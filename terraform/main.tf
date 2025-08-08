provider "aws" {
  region = "us-west-2"
}

data "aws_iam_policy_document" "assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "execution_role_for_lambda" {
  name               = "emoya_todo_lambda_execution_role_${var.environment}"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

data "archive_file" "lambda_archive_file" {
  type        = "zip"
  source_file = "../dist/*"
  output_path = "${path.root}/function.zip"
}

resource "aws_s3_bucket" "lambda_code_bucket" {
  bucket = var.lambda_code_bucket
}

resource "aws_lambda_function" "todo-list-rest-api" {
  filename         = data.archive_file.lambda_archive_file.output_path
  function_name    = "todo-list-rest-api"
  role             = aws_iam_role.execution_role_for_lambda.arn
  handler          = "index.handler"
  source_code_hash = data.archive_file.lambda_archive_file.output_base64sha256
  memory_size      = 128
  timeout          = 30

  runtime = "nodejs22.x"

  environment {
    variables = {
      ENVIRONMEMT = "dev"
    }
  }

  tags = {
    Environment = "dev"
    Application = "todo-list-rest-api"
  }

  depends_on = [aws_s3_bucket.lambda_code_bucket, aws_iam_role.execution_role_for_lambda]
}