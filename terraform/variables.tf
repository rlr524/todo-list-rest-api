variable "lambda_code_bucket" {
  type        = string
  description = "The S3 bucket in which the lambda source code will be stored"
}

variable "environment" {
  type        = string
  description = "The environment in which the application is being deployed"
}