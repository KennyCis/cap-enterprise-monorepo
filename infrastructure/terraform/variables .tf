# infrastructure/terraform/variables.tf

variable "aws_region" {
  description = "The AWS region to deploy the infrastructure"
  type        = string
  default     = "us-east-1"
}

variable "instance_type" {
  description = "EC2 instance type for the CAP application"
  type        = string
  default     = "t3.micro"
}

variable "environment" {
  description = "Deployment environment (e.g., prod, qa)"
  type        = string
  default     = "production"
}