# Changelog

## 1.0.0 (2026-05-29)


### ⚠ BREAKING CHANGES

* **infra:** Removes KMS key for S3 bucket encryption in favor of AES256

### Features

* **content:** enhance AI expertise presentation ([feaecb5](https://github.com/aicharles/charlesblumenthal.com/commit/feaecb5199d658f6164dd730fbc941779f41acb3))
* **infra:** remove waf. ([#6](https://github.com/aicharles/charlesblumenthal.com/issues/6)) ([2d94264](https://github.com/aicharles/charlesblumenthal.com/commit/2d9426413c826a404aa0820f9f60eff9a10b0fb8))
* **infra:** update terraform configurations ([65bf75d](https://github.com/aicharles/charlesblumenthal.com/commit/65bf75d86b86920557019f1d80bc3cc95b77beca))
* **infra:** update the bootstrap infra. ([#2](https://github.com/aicharles/charlesblumenthal.com/issues/2)) ([88d359b](https://github.com/aicharles/charlesblumenthal.com/commit/88d359b439a7562c2b1b4f39c1b4c91ef5e57b04))
* total site refresh. ([#1](https://github.com/aicharles/charlesblumenthal.com/issues/1)) ([dafd0d0](https://github.com/aicharles/charlesblumenthal.com/commit/dafd0d02cda182f9f3af362ca335ac6b9b0ef4bd))
* **website:** redesign refresh with about page and social feeds ([1759ac5](https://github.com/aicharles/charlesblumenthal.com/commit/1759ac5972758782e77710721e73a99dbccdd7ef))
* **website:** updated certs content. ([e0b15ee](https://github.com/aicharles/charlesblumenthal.com/commit/e0b15ee337c23de6c6682350a48b71b0566bf327))
* **web:** update Contact component and gitignore ([217bd08](https://github.com/aicharles/charlesblumenthal.com/commit/217bd0861946d5b40fed107ba48e925ff78d399c))


### Bug Fixes

* add audience parameter to AWS credentials configuration ([922167b](https://github.com/aicharles/charlesblumenthal.com/commit/922167b6a8a2c3ccf5ff6a8202404022cfa567ba))
* add KMS key policies for GitHub Actions ([6c91838](https://github.com/aicharles/charlesblumenthal.com/commit/6c918384910d586cd5a065c14fe84b7c44d41fd1))
* **ci:** add content-type specifications for S3 uploads ([4dd16f7](https://github.com/aicharles/charlesblumenthal.com/commit/4dd16f7a48ce0a67a6f9ece64316634326345450))
* **ci:** regenerate package-lock to include [@emnapi](https://github.com/emnapi) platform deps ([c427ca1](https://github.com/aicharles/charlesblumenthal.com/commit/c427ca1f3d0d773474f95696b189debcb8f9ba1e))
* **infra:** remove unused KMS key for S3 bucket encryption ([ee31d9d](https://github.com/aicharles/charlesblumenthal.com/commit/ee31d9d4c1992f8f0b1e86b1d4a7e53ffc09e7a5))
* remove workspace variable from backend config ([554bfaa](https://github.com/aicharles/charlesblumenthal.com/commit/554bfaac3f97fdde396d62805862bccc3b648127))
* update GitHub Actions to use OIDC for AWS authentication ([55f9b44](https://github.com/aicharles/charlesblumenthal.com/commit/55f9b445276c0407d4f2b876ff21e50532df1a07))
* update workflow to trigger on master branch ([adf2bc4](https://github.com/aicharles/charlesblumenthal.com/commit/adf2bc4989b9a7cb368716a8ac034ecbeda98a80))
