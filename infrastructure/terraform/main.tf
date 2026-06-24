# infrastructure/terraform/main.tf

provider "aws" {
  region = var.aws_region
}

# Security Group (Firewall) for the Production Server
resource "aws_security_group" "cap_prod_sg" {
  name        = "cap-prod-sg"
  description = "Security Group for CAP Production Server allowing SSH and HTTP"

  ingress {
    description = "Allow SSH from anywhere"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Allow HTTP from anywhere"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "Allow all outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "cap-prod-sg"
    Environment = var.environment
  }
}

# EC2 Instance for Production
resource "aws_instance" "cap_prod_server" {
  ami           = "ami-04b70fa74e45c3917" # Ubuntu 24.04 LTS
  instance_type = var.instance_type
  key_name      = "cap-prod-key"
  
  vpc_security_group_ids = [aws_security_group.cap_prod_sg.id]

  tags = {
    Name        = "CAP-Production-Server"
    Environment = var.environment
    Project     = "Classroom Assignment Platform"
  }
}