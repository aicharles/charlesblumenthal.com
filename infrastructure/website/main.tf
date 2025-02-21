terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket         = "aicharles-personal-site-terraform-state"
    key            = "website/terraform.tfstate"
    region         = "us-east-2"
    encrypt        = true
    lock_timeout   = "10m"
    dynamodb_table = "personal-site-terraform-state-lock"
  }
}

variable "domain_name" {
  type        = string
  description = "The domain name for the website"
}

variable "website_bucket_name" {
  type        = string
  description = "The name of the S3 bucket for the website"
}

locals {
  common_tags = {
    ManagedBy = "terraform"
    Project   = "personal-website"
  }
  s3_origin_domain = "${var.website_bucket_name}.s3-website.${data.aws_region.current.name}.amazonaws.com"
}

provider "aws" {
  alias  = "acm_region"
  region = "us-east-1" # For ACM certificate and WAF, must be in us-east-1
}

provider "aws" {
  region = "us-east-2" # Main region for all other resources
}

# Get current AWS account ID
data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

# 1. First create the Route53 zone
resource "aws_route53_zone" "main" {
  name = var.domain_name
}

# 2. Reference the zone
data "aws_route53_zone" "selected" {
  name         = var.domain_name
  private_zone = false

  depends_on = [aws_route53_zone.main]
}

# 3. Create the certificate
resource "aws_acm_certificate" "website" {
  provider          = aws.acm_region
  domain_name       = var.domain_name
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

# 4. Create the certificate validation records
resource "aws_route53_record" "cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.website.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = aws_route53_zone.main.zone_id

  depends_on = [aws_route53_zone.main]
}

# 5. Validate the certificate
resource "aws_acm_certificate_validation" "website" {
  provider                = aws.acm_region
  certificate_arn         = aws_acm_certificate.website.arn
  validation_record_fqdns = [for record in aws_route53_record.cert_validation : record.fqdn]
}

# 6. Create S3 bucket and its configuration
resource "aws_s3_bucket" "website" {
  bucket        = var.website_bucket_name
  force_destroy = true

  tags = local.common_tags
}

resource "aws_s3_bucket_website_configuration" "website" {
  bucket = aws_s3_bucket.website.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "404.html"
  }
}

resource "aws_s3_bucket_public_access_block" "website" {
  bucket                  = aws_s3_bucket.website.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Set bucket ownership controls
resource "aws_s3_bucket_ownership_controls" "website" {
  bucket = aws_s3_bucket.website.id
  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

# Add server-side encryption configuration
resource "aws_s3_bucket_server_side_encryption_configuration" "website" {
  bucket = aws_s3_bucket.website.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# Add bucket versioning
resource "aws_s3_bucket_versioning" "website" {
  bucket = aws_s3_bucket.website.id
  versioning_configuration {
    status = "Enabled"
  }
}

# Add bucket logging
resource "aws_s3_bucket" "website_logs" {
  bucket        = "${var.website_bucket_name}-logs"
  force_destroy = true
}

# Enable ACLs for the logs bucket
resource "aws_s3_bucket_ownership_controls" "website_logs" {
  bucket = aws_s3_bucket.website_logs.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_acl" "website_logs" {
  depends_on = [aws_s3_bucket_ownership_controls.website_logs]
  bucket     = aws_s3_bucket.website_logs.id
  acl        = "private"
}

# Grant CloudFront logging permissions via bucket ACL
resource "aws_s3_bucket_acl" "website_logs_cloudfront" {
  depends_on = [aws_s3_bucket_ownership_controls.website_logs]
  bucket     = aws_s3_bucket.website_logs.id

  access_control_policy {
    owner {
      id = data.aws_canonical_user_id.current.id
    }

    grant {
      grantee {
        id   = data.aws_canonical_user_id.current.id
        type = "CanonicalUser"
      }
      permission = "FULL_CONTROL"
    }

    grant {
      grantee {
        type = "CanonicalUser"
        id   = "c4c1ede66af53448b93c283ce9448c4ba468c9432aa01d700d3878632f77d2d0" # CloudFront canonical user ID
      }
      permission = "WRITE"
    }
  }
}

# Add data source for current account's canonical user ID
data "aws_canonical_user_id" "current" {}

# Add encryption to logs bucket
resource "aws_s3_bucket_server_side_encryption_configuration" "website_logs" {
  bucket = aws_s3_bucket.website_logs.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# Add versioning to logs bucket
resource "aws_s3_bucket_versioning" "website_logs" {
  bucket = aws_s3_bucket.website_logs.id
  versioning_configuration {
    status = "Enabled"
  }
}

# Block public access for logs bucket
resource "aws_s3_bucket_public_access_block" "website_logs" {
  bucket = aws_s3_bucket.website_logs.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Add bucket policy to allow CloudFront to write logs
resource "aws_s3_bucket_policy" "website_logs" {
  bucket = aws_s3_bucket.website_logs.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowCloudFrontLogs"
        Effect = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action   = "s3:PutObject"
        Resource = "${aws_s3_bucket.website_logs.arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.website.arn
          }
        }
      }
    ]
  })

  depends_on = [aws_s3_bucket_public_access_block.website_logs]
}

# Add logging configuration for website bucket
resource "aws_s3_bucket_logging" "website" {
  bucket = aws_s3_bucket.website.id

  target_bucket = aws_s3_bucket.website_logs.id
  target_prefix = "s3-access-logs/"
}

# 7. Create CloudFront OAC
resource "aws_cloudfront_origin_access_control" "website" {
  name                              = "website-oac"
  description                       = "Origin Access Control for website"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# 8. Create CloudFront distribution
resource "aws_cloudfront_distribution" "website" {
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  aliases             = [var.domain_name]

  depends_on = [aws_acm_certificate_validation.website]

  # Add retry logic for distribution updates
  lifecycle {
    create_before_destroy = true
  }

  origin {
    domain_name              = aws_s3_bucket.website.bucket_regional_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.website.id
    origin_path              = ""
    s3_origin_config {
      origin_access_identity = ""
    }
    origin_id = "S3Origin"
  }

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD", "OPTIONS"]
    target_origin_id       = "S3Origin"
    viewer_protocol_policy = "redirect-to-https"
    compress               = true
    smooth_streaming       = false

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    min_ttl     = 0        # No minimum TTL
    default_ttl = 86400    # 24 hours
    max_ttl     = 31536000 # 1 year
  }

  custom_error_response {
    error_code         = 403
    response_code      = 200
    response_page_path = "/index.html"
  }

  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/index.html"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate.website.arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }

  logging_config {
    include_cookies = false
    bucket          = aws_s3_bucket.website_logs.bucket_regional_domain_name
    prefix          = "cloudfront-logs/"
  }
}

# 9. Create S3 bucket policy after CloudFront is created
resource "aws_s3_bucket_policy" "website" {
  bucket = aws_s3_bucket.website.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Sid    = "AllowCloudFrontAccess",
        Effect = "Allow",
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action = [
          "s3:GetObject",
          "s3:ListBucket",
          "s3:GetBucketLocation"
        ],
        Resource = [
          "${aws_s3_bucket.website.arn}/*",
          aws_s3_bucket.website.arn
        ],
        Condition = {
          StringEquals = {
            "AWS:SourceArn" : aws_cloudfront_distribution.website.arn,
            "AWS:SourceAccount" : data.aws_caller_identity.current.account_id
          }
        }
      }
    ],
  })

  depends_on = [aws_cloudfront_distribution.website]
}

# 10. Create the website A record
resource "aws_route53_record" "website" {
  zone_id = data.aws_route53_zone.selected.zone_id
  name    = var.domain_name
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.website.domain_name
    zone_id                = aws_cloudfront_distribution.website.hosted_zone_id
    evaluate_target_health = false
  }
}

# Outputs
output "nameservers" {
  value       = aws_route53_zone.main.name_servers
  description = "Nameservers for the domain"
}

output "website_endpoint" {
  value = aws_cloudfront_distribution.website.domain_name
}

output "distribution_id" {
  value = aws_cloudfront_distribution.website.id
}

# Add CloudWatch alarms for monitoring
resource "aws_cloudwatch_metric_alarm" "cloudfront_5xx_errors" {
  alarm_name          = "cloudfront-5xx-errors"
  alarm_description   = "This metric monitors CloudFront 5xx errors"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "1"
  metric_name         = "5xxErrorRate"
  namespace           = "AWS/CloudFront"
  period              = "300" # 5 minutes
  statistic           = "Average"
  threshold           = "5" # Trigger if more than 5% errors
  treat_missing_data  = "notBreaching"

  dimensions = {
    DistributionId = aws_cloudfront_distribution.website.id
    Region         = "Global"
  }

  alarm_actions = [aws_sns_topic.website_alerts.arn]
}

resource "aws_cloudwatch_metric_alarm" "cloudfront_4xx_errors" {
  alarm_name          = "cloudfront-4xx-errors"
  alarm_description   = "This metric monitors CloudFront 4xx errors"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "1"
  metric_name         = "4xxErrorRate"
  namespace           = "AWS/CloudFront"
  period              = "300" # 5 minutes
  statistic           = "Average"
  threshold           = "5" # Trigger if more than 5% errors
  treat_missing_data  = "notBreaching"

  dimensions = {
    DistributionId = aws_cloudfront_distribution.website.id
    Region         = "Global"
  }

  alarm_actions = [aws_sns_topic.website_alerts.arn]
}

# Create KMS key for SNS topic encryption
resource "aws_kms_key" "sns_encryption" {
  description             = "KMS key for SNS topic encryption"
  deletion_window_in_days = 7
  enable_key_rotation     = true

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "Enable IAM User Permissions"
        Effect = "Allow"
        Principal = {
          AWS = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:root"
        }
        Action   = "kms:*"
        Resource = "*"
      },
      {
        Sid    = "AllowGitHubActionsKMS"
        Effect = "Allow"
        Principal = {
          AWS = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/github-deployer-role"
        }
        Action = [
          "kms:GenerateDataKey",
          "kms:Decrypt"
        ]
        Resource = "*"
      }
    ]
  })
}

# Create SNS topic for alarms with encryption
resource "aws_sns_topic" "website_alerts" {
  name              = "website-alerts"
  kms_master_key_id = aws_kms_key.sns_encryption.id
}

# Add your email subscription to the SNS topic
resource "aws_sns_topic_subscription" "website_alerts_email" {
  topic_arn = aws_sns_topic.website_alerts.arn
  protocol  = "email"
  endpoint  = "charlesblumenthal@gmail.com"
}
