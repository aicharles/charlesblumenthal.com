# Personal Website

This repository contains the source code and infrastructure configuration for my personal website. The site is built with Next.js and deployed to AWS using Terraform for infrastructure management.

## Repository Structure

```
.
├── infrastructure/          # Terraform configuration
│   ├── bootstrap/          # Initial AWS setup (S3 backend, IAM roles)
│   └── website/            # Main infrastructure (S3, CloudFront, Route53)
└── website/                # Next.js application
    ├── public/             # Static assets
    ├── src/
    │   ├── app/           # Next.js app router components
    │   ├── components/    # React components
    │   ├── data/         # Content and data files
    │   └── types/        # TypeScript type definitions
    └── package.json
```

## Local Development

### Prerequisites

- Node.js 20.x or later
- npm 10.x or later
- AWS CLI configured with appropriate credentials
- Terraform 1.7.x or later

### Setting Up the Development Environment

1. Clone the repository:
   ```bash
   git clone https://github.com/aicharles/charlesblumenthal.com.git
   cd charlesblumenthal.com
   ```

2. Install website dependencies:
   ```bash
   cd website
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view the site

## Infrastructure Setup

The infrastructure is managed using Terraform and deployed to AWS. It consists of:
- S3 for static file hosting
- CloudFront for content delivery
- Route53 for DNS management
- ACM for SSL certificates
- WAF for security (dev environment)
- CloudWatch for monitoring
- SNS for alerts

### Bootstrap Infrastructure

Before deploying the main infrastructure, you need to set up the Terraform backend and IAM roles:

1. Navigate to the bootstrap directory:
   ```bash
   cd infrastructure/bootstrap
   ```

2. Initialize and apply the bootstrap configuration:
   ```bash
   terraform init
   terraform apply
   ```

This creates:
- S3 bucket for Terraform state
- DynamoDB table for state locking
- IAM roles for GitHub Actions

### Website Infrastructure

The main infrastructure can be deployed after the bootstrap:

1. Navigate to the website infrastructure directory:
   ```bash
   cd infrastructure/website
   ```

2. Create a `terraform.tfvars` file:
   ```hcl
   environment = "dev"  # or "prod"
   domain_name = "example.com"
   website_bucket_name = "example-com-website"
   allowed_ips = ["YOUR_IP/32"]  # For dev environment only
   ```

3. Deploy the infrastructure:
   ```bash
   terraform init
   terraform apply
   ```

## Deployment

The website uses GitHub Actions for automated deployments:

- Push to `main` branch deploys to production
- Push to `develop` branch deploys to development environment

The workflow:
1. Builds the Next.js application
2. Runs tests and linting
3. Uploads built files to S3
4. Invalidates CloudFront cache

## Monitoring and Alerts

The infrastructure includes:
- CloudWatch alarms for 4xx and 5xx errors
- SNS topic for alert notifications
- S3 and CloudFront access logging

## Security Features

- WAF protection for dev environment
- CloudFront with OAC for S3 access
- KMS encryption for S3 buckets and SNS
- TLS 1.2 enforcement
- Public access blocking on S3 buckets

## License

All rights reserved. This is a private repository.