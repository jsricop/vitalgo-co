# VitalGo AWS Infrastructure - Free Tier Production
terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# Data sources
data "aws_availability_zones" "available" {
  state = "available"
}

data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }
}

# VPC
resource "aws_vpc" "vitalgo_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name        = "vitalgo-vpc"
    Environment = "production"
  }
}

# Internet Gateway
resource "aws_internet_gateway" "vitalgo_igw" {
  vpc_id = aws_vpc.vitalgo_vpc.id

  tags = {
    Name        = "vitalgo-igw"
    Environment = "production"
  }
}

# Public Subnet
resource "aws_subnet" "vitalgo_public_subnet" {
  vpc_id                  = aws_vpc.vitalgo_vpc.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = data.aws_availability_zones.available.names[0]
  map_public_ip_on_launch = true

  tags = {
    Name        = "vitalgo-public-subnet"
    Environment = "production"
  }
}

# Private Subnet (for RDS)
resource "aws_subnet" "vitalgo_private_subnet" {
  vpc_id            = aws_vpc.vitalgo_vpc.id
  cidr_block        = "10.0.2.0/24"
  availability_zone = data.aws_availability_zones.available.names[1]

  tags = {
    Name        = "vitalgo-private-subnet"
    Environment = "production"
  }
}

# Route Table for Public Subnet
resource "aws_route_table" "vitalgo_public_rt" {
  vpc_id = aws_vpc.vitalgo_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.vitalgo_igw.id
  }

  tags = {
    Name        = "vitalgo-public-rt"
    Environment = "production"
  }
}

# Route Table Association
resource "aws_route_table_association" "vitalgo_public_rta" {
  subnet_id      = aws_subnet.vitalgo_public_subnet.id
  route_table_id = aws_route_table.vitalgo_public_rt.id
}

# Security Group for EC2
resource "aws_security_group" "vitalgo_ec2_sg" {
  name_prefix = "vitalgo-ec2-sg"
  vpc_id      = aws_vpc.vitalgo_vpc.id

  # SSH access - RESTRICTED TO SPECIFIC IP
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["190.253.153.112/32"] # Restricted to authorized IP only
  }

  # Frontend access
  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Backend API access
  ingress {
    from_port   = 8000
    to_port     = 8000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # All outbound traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "vitalgo-ec2-sg"
    Environment = "production"
  }
}

# Security Group for RDS
resource "aws_security_group" "vitalgo_rds_sg" {
  name_prefix = "vitalgo-rds-sg"
  vpc_id      = aws_vpc.vitalgo_vpc.id

  # PostgreSQL access from EC2
  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.vitalgo_ec2_sg.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "vitalgo-rds-sg"
    Environment = "production"
  }
}

# RDS Subnet Group
resource "aws_db_subnet_group" "vitalgo_db_subnet_group" {
  name       = "vitalgo-db-subnet-group"
  subnet_ids = [aws_subnet.vitalgo_private_subnet.id, aws_subnet.vitalgo_public_subnet.id]

  tags = {
    Name        = "vitalgo-db-subnet-group"
    Environment = "production"
  }
}

# RDS Parameter Group for enhanced security
resource "aws_db_parameter_group" "vitalgo_postgres_ssl" {
  family = "postgres15"
  name   = "vitalgo-postgres-ssl"

  parameter {
    name  = "log_statement"
    value = "all"
  }

  parameter {
    name  = "shared_preload_libraries"
    value = "pg_stat_statements"
  }

  tags = {
    Name        = "vitalgo-postgres-ssl"
    Environment = "production"
  }
}

# RDS PostgreSQL Instance
resource "aws_db_instance" "vitalgo_rds" {
  identifier     = "vitalgo-db"
  engine         = "postgres"
  engine_version = "15.14"
  instance_class = "db.t3.micro" # Free tier eligible

  allocated_storage     = 20  # Free tier limit
  max_allocated_storage = 20  # Prevent auto-scaling charges
  storage_type          = "gp2"
  storage_encrypted     = true

  db_name  = var.db_name
  username = var.db_username
  password = var.db_password

  vpc_security_group_ids = [aws_security_group.vitalgo_rds_sg.id]
  db_subnet_group_name   = aws_db_subnet_group.vitalgo_db_subnet_group.name

  backup_retention_period = 7
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"

  # Security enhancements
  skip_final_snapshot = true
  deletion_protection = true  # SECURITY: Prevent accidental deletion

  # Force SSL connections
  parameter_group_name = aws_db_parameter_group.vitalgo_postgres_ssl.name

  publicly_accessible = false

  tags = {
    Name        = "vitalgo-rds"
    Environment = "production"
  }
}

# EC2 Instance
resource "aws_instance" "vitalgo_ec2" {
  ami                    = data.aws_ami.amazon_linux.id
  instance_type          = "t3.small" # Temporarily upgraded for deployment
  key_name               = var.key_pair_name
  vpc_security_group_ids = [aws_security_group.vitalgo_ec2_sg.id]
  subnet_id              = aws_subnet.vitalgo_public_subnet.id

  user_data = base64encode(templatefile("${path.module}/user_data.sh", {
    rds_endpoint = split(":", aws_db_instance.vitalgo_rds.endpoint)[0]
  }))

  tags = {
    Name        = "vitalgo-ec2"
    Environment = "production"
  }
}

# Elastic IP for EC2
resource "aws_eip" "vitalgo_eip" {
  instance = aws_instance.vitalgo_ec2.id
  domain   = "vpc"

  tags = {
    Name        = "vitalgo-eip"
    Environment = "production"
  }
}