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
  name               = "lambda_execution_role"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json

}

data "archive_file" "lambda_archive_file" {
  type        = "zip"
  source_file = "../dist/index.js"
  output_path = "${path.root}/function.zip"
}

resource "aws_lambda_function" "todo-list-rest-api" {
  filename         = data.archive_file.lambda_archive_file.output_path
  function_name    = "todo-list-rest-api"
  role             = aws_iam_role.execution_role_for_lambda.arn
  handler          = "index.handler"
  source_code_hash = data.archive_file.lambda_archive_file.output_base64sha256

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
}