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
    dynamodb_table = "personal-site-terraform-state-lock"
  }
}

variable "domain_name" {
  type        = string
  default     = "charlesblumenthal.com"
  description = "The domain name for the website"
}

variable "website_bucket_name" {
  type        = string
  default     = "charlesblumenthal-com-website"
  description = "The name of the S3 bucket for the website"
}

provider "aws" {
  alias  = "acm_region"
  region = "us-east-1" # For ACM certificate, must be in us-east-1
}

provider "aws" {
  region = "us-east-2" # Main region for all other resources
}

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
  bucket        = var.website_bucket_name
  force_destroy = true
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


