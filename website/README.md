# Charles Blumenthal Website

This is my personal website built with Next.js and deployed to AWS using CloudFront and S3.

## Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

The website is automatically deployed to [charlesblumenthal.com](https://charlesblumenthal.com) when changes are pushed to the main branch.

The deployment process:
1. Builds the Next.js application
2. Uploads the static files to S3
3. Invalidates the CloudFront cache
4. Makes the changes live on the website

## Infrastructure

The infrastructure is managed with Terraform and includes:
- CloudFront distribution for content delivery
- S3 bucket for static file hosting
- Route53 for DNS management
- ACM for SSL/TLS certificate
- CloudWatch for monitoring and alerts
