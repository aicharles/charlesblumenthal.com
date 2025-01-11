terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-2"
}

resource "aws_s3_bucket" "personal_site_terraform_state" {
  bucket = "aicharles-personal-site-terraform-state"

  # Prevent accidental deletion of this S3 bucket
  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_s3_bucket_versioning" "personal_site_terraform_state" {
  bucket = aws_s3_bucket.personal_site_terraform_state.id
  versioning_configuration {
    status = "Enabled"
  }
}

# Enable server-side encryption by default
resource "aws_s3_bucket_server_side_encryption_configuration" "personal_site_terraform_state" {
  bucket = aws_s3_bucket.personal_site_terraform_state.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# Block all public access to the S3 bucket
resource "aws_s3_bucket_public_access_block" "personal_site_terraform_state" {
  bucket = aws_s3_bucket.personal_site_terraform_state.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_dynamodb_table" "personal_site_terraform_state_lock" {
  name         = "personal-site-terraform-state-lock"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }
}

output "s3_bucket_name" {
  value = aws_s3_bucket.personal_site_terraform_state.id
}

output "dynamodb_table_name" {
  value = aws_dynamodb_table.personal_site_terraform_state_lock.name
}



resource "aws_iam_openid_connect_provider" "github" {
  url = "https://token.actions.githubusercontent.com"

  client_id_list = ["sts.amazonaws.com"]

  thumbprint_list = [
    "6938fd4d98bab03faadb97b34396831e3780aea1"
  ]
}

# Role for Terraform operations
resource "aws_iam_role" "terraform_role" {
  name = "github-terraform-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = aws_iam_openid_connect_provider.github.arn
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          StringLike = {
            "token.actions.githubusercontent.com:sub" : "repo:${var.github_repo}:ref:refs/heads/main"
            "token.actions.githubusercontent.com:aud" : "sts.amazonaws.com"
          }
        }
      }
    ]
  })
}

# Role for website deployments
resource "aws_iam_role" "deployer_role" {
  name = "github-deployer-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = aws_iam_openid_connect_provider.github.arn
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          StringLike = {
            "token.actions.githubusercontent.com:sub" : "repo:${var.github_repo}:ref:refs/heads/main"
            "token.actions.githubusercontent.com:aud" : "sts.amazonaws.com"
          }
        }
      }
    ]
  })
}

resource "aws_iam_role_policy" "terraform_policy" {
  name = "terraform-policy"
  role = aws_iam_role.terraform_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:*"
        ]
        Resource = [
          "arn:aws:s3:::${var.website_bucket_name}",
          "arn:aws:s3:::${var.website_bucket_name}/*",
          "arn:aws:s3:::aicharles-personal-site-terraform-state",
          "arn:aws:s3:::aicharles-personal-site-terraform-state/*"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "cloudfront:*",
          "acm:*",
          "route53:*"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:DeleteItem"
        ]
        Resource = "arn:aws:dynamodb:us-east-2:*:table/personal-site-terraform-state-lock"
      }
    ]
  })
}

resource "aws_iam_role_policy" "deployer_policy" {
  name = "deployer-policy"
  role = aws_iam_role.deployer_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:DeleteObject",
          "s3:ListBucket"
        ]
        Resource = [
          "arn:aws:s3:::${var.website_bucket_name}",
          "arn:aws:s3:::${var.website_bucket_name}/*"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "cloudfront:CreateInvalidation",
          "cloudfront:GetInvalidation",
          "cloudfront:ListInvalidations"
        ]
        Resource = "*"
      }
    ]
  })
}

variable "github_repo" {
  type        = string
  description = "GitHub repository (format: owner/repo)"
  default     = "aicharles/charlesblumenthal-com"
}

variable "website_bucket_name" {
  type        = string
  default     = "charlesblumenthal-com-website"
  description = "The name of the S3 bucket for the website"
}

output "terraform_role_arn" {
  value = aws_iam_role.terraform_role.arn
}

output "deployer_role_arn" {
  value = aws_iam_role.deployer_role.arn
}
