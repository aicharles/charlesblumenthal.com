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
