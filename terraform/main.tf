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
  source_dir  = "../dist"
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

resource "aws_api_gateway_rest_api" "express_api_gateway" {
  name = "EmiyaToDoExpressApiGateway"
  description = "API Gateway for ToDo List API Express Lambda"
}

resource "aws_api_gateway_resource" "proxy_resource" {
  rest_api_id = aws_api_gateway_rest_api.express_api_gateway.id
  parent_id = aws_api_gateway_rest_api.express_api_gateway.root_resource_id
  path_part = "{proxy+}"
}

resource "aws_api_gateway_method" "proxy_method" {
  rest_api_id = aws_api_gateway_rest_api.express_api_gateway.id
  resource_id = aws_api_gateway_resource.proxy_resource.id
  http_method = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "lambda_integration" {
  rest_api_id             = aws_api_gateway_rest_api.express_api_gateway.id
  resource_id             = aws_api_gateway_method.proxy_method.resource_id
  http_method             = aws_api_gateway_method.proxy_method.http_method
  integration_http_method = "POST" # Always POST for Lambda proxy integration
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.todo-list-rest-api.invoke_arn
}

resource "aws_lambda_permission" "apigateway_permission" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.todo-list-rest-api.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.express_api_gateway.execution_arn}/*/*"
}

resource "aws_api_gateway_deployment" "api_deployment" {
  rest_api_id = aws_api_gateway_rest_api.express_api_gateway.id
  triggers = {
    redeployment = sha1(jsonencode(aws_api_gateway_rest_api.express_api_gateway.body))
  }
  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_api_gateway_stage" "prod_stage" {
  deployment_id = aws_api_gateway_deployment.api_deployment.id
  rest_api_id   = aws_api_gateway_rest_api.express_api_gateway.id
  stage_name    = "prod"
}