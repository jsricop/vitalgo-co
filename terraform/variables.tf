# Terraform Variables for VitalGo AWS Infrastructure

variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-east-1"
}

variable "key_pair_name" {
  description = "AWS Key Pair name for EC2 SSH access"
  type        = string
}

variable "db_name" {
  description = "Database name"
  type        = string
  default     = "vitalgo_prod"
}

variable "db_username" {
  description = "Database username"
  type        = string
  default     = "vitalgo_user"
}

variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
}

variable "dockerhub_username" {
  description = "DockerHub username for pulling images"
  type        = string
}