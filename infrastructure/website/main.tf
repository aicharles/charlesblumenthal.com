variable "environment" {
  type        = string
  description = "The environment (dev or prod)"
  validation {
    condition     = contains(["dev", "prod"], var.environment)
    error_message = "Environment must be either 'dev' or 'prod'"
  }
}

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket         = "aicharles-personal-site-terraform-state"
    key            = "website/${terraform.workspace}/terraform.tfstate"
    region         = "us-east-2"
    encrypt        = true
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
  domain_name = var.environment == "prod" ? var.domain_name : "dev.${var.domain_name}"
  bucket_name = var.environment == "prod" ? var.website_bucket_name : "${var.website_bucket_name}-dev"

  common_tags = {
    Environment = var.environment
    ManagedBy   = "terraform"
    Project     = "personal-website"
  }
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

# 1. First create the Route53 zone
resource "aws_route53_zone" "main" {
  name = local.domain_name
}

# 2. Reference the zone
data "aws_route53_zone" "selected" {
  name         = local.domain_name
  private_zone = false

  depends_on = [aws_route53_zone.main]
}

# 3. Create the certificate
resource "aws_acm_certificate" "website" {
  provider          = aws.acm_region
  domain_name       = local.domain_name
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
  zone_id         = aws_route53_zone.main.zone_id # Use the zone we created directly

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
  bucket        = local.bucket_name
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

# Add server-side encryption configuration
resource "aws_s3_bucket_server_side_encryption_configuration" "website" {
  bucket = aws_s3_bucket.website.id

  rule {
    apply_server_side_encryption_by_default {
      kms_master_key_id = aws_kms_key.website_bucket.arn
      sse_algorithm     = "aws:kms"
    }
  }
}

# Create KMS key for S3 bucket encryption
resource "aws_kms_key" "website_bucket" {
  description             = "KMS key for website bucket encryption"
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

# Add bucket versioning
resource "aws_s3_bucket_versioning" "website" {
  bucket = aws_s3_bucket.website.id
  versioning_configuration {
    status = "Enabled"
  }
}

# Add bucket logging
#tfsec:ignore:aws-s3-enable-bucket-logging:This is a logs bucket - no need to log access to logs
resource "aws_s3_bucket" "website_logs" {
  bucket        = "${local.bucket_name}-logs"
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
      kms_master_key_id = aws_kms_key.website_bucket.arn
      sse_algorithm     = "aws:kms"
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
#tfsec:ignore:aws-cloudfront-enable-waf
resource "aws_cloudfront_distribution" "website" {
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  aliases             = [local.domain_name]

  depends_on = [aws_acm_certificate_validation.website]

  origin {
    domain_name              = aws_s3_bucket.website.bucket_regional_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.website.id
    origin_id                = "S3Origin"
  }

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "S3Origin"
    viewer_protocol_policy = "redirect-to-https"
    compress               = true

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    min_ttl     = 0
    default_ttl = 3600  # 1 hour
    max_ttl     = 86400 # 24 hours
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

  web_acl_id = var.environment == "dev" ? aws_wafv2_web_acl.dev_environment[0].id : null
}

# 9. Create S3 bucket policy after CloudFront is created
resource "aws_s3_bucket_policy" "website" {
  bucket = aws_s3_bucket.website.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowCloudFrontAccess"
        Effect = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action   = "s3:GetObject"
        Resource = "${aws_s3_bucket.website.arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.website.arn
          }
        }
      }
    ]
  })

  depends_on = [aws_cloudfront_distribution.website]
}

# 10. Create the website A record
resource "aws_route53_record" "website" {
  zone_id = data.aws_route53_zone.selected.zone_id
  name    = local.domain_name
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

# Add WAF IPSet for dev environment
resource "aws_wafv2_ip_set" "dev_allowed_ips" {
  provider           = aws.acm_region # WAF needs to be in us-east-1
  count              = var.environment == "dev" ? 1 : 0
  name               = "allowed-ips"
  description        = "IP addresses allowed to access dev environment"
  ip_address_version = "IPV4"
  scope              = "CLOUDFRONT"

  addresses = var.allowed_ips # You'll define this in your tfvars files
}

# Create WAF WebACL for dev environment
resource "aws_wafv2_web_acl" "dev_environment" {
  provider    = aws.acm_region
  count       = var.environment == "dev" ? 1 : 0
  name        = "dev-environment-restrictions"
  description = "ACL for dev environment access control"
  scope       = "CLOUDFRONT"

  default_action {
    block {}
  }

  rule {
    name     = "AllowListedIPs"
    priority = 1

    override_action {
      none {}
    }

    statement {
      ip_set_reference_statement {
        arn = aws_wafv2_ip_set.dev_allowed_ips[0].arn
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "AllowListedIPsMetric"
      sampled_requests_enabled   = true
    }
  }

  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = "DevEnvironmentACLMetric"
    sampled_requests_enabled   = true
  }
}

# Add variable for allowed IPs
variable "allowed_ips" {
  type        = list(string)
  description = "List of IP addresses allowed to access dev environment"
  default     = [] # Empty default for prod
}


