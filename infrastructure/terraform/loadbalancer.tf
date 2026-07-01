# infrastructure/terraform/loadbalancer.tf

# Target Group pointing to our EC2 instance on port 80
resource "aws_lb_target_group" "cap_prod_tg" {
  name     = "cap-prod-tg"
  port     = 80
  protocol = "HTTP"
  vpc_id   = "vpc-12345678" # NOTE: Default VPC ID representation for the academic report

  health_check {
    path                = "/"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
  }

  tags = {
    Name        = "cap-prod-tg"
    Environment = var.environment
  }
}

# Application Load Balancer (Internet Facing)
resource "aws_lb" "cap_prod_alb" {
  name               = "cap-prod-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.cap_prod_sg.id]
  
  # NOTE: At least two public subnets are required for High Availability
  subnets = ["subnet-111111", "subnet-222222"] 

  tags = {
    Name        = "CAP-Production-ALB"
    Environment = var.environment
  }
}

# Listener routing traffic from ALB to Target Group
resource "aws_lb_listener" "cap_http_listener" {
  load_balancer_arn = aws_lb.cap_prod_alb.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.cap_prod_tg.arn
  }
}