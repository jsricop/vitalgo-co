# Terraform Outputs for VitalGo AWS Infrastructure

output "ec2_public_ip" {
  description = "Public IP address of EC2 instance"
  value       = aws_eip.vitalgo_eip.public_ip
}

output "ec2_public_dns" {
  description = "Public DNS name of EC2 instance"
  value       = aws_instance.vitalgo_ec2.public_dns
}

output "rds_endpoint" {
  description = "RDS PostgreSQL endpoint"
  value       = aws_db_instance.vitalgo_rds.endpoint
}

output "rds_port" {
  description = "RDS PostgreSQL port"
  value       = aws_db_instance.vitalgo_rds.port
}

output "frontend_url" {
  description = "Frontend application URL"
  value       = "http://${aws_eip.vitalgo_eip.public_ip}:3000"
}

output "backend_url" {
  description = "Backend API URL"
  value       = "http://${aws_eip.vitalgo_eip.public_ip}:8000"
}

output "ssh_command" {
  description = "SSH command to connect to EC2 instance"
  value       = "ssh -i ~/.ssh/${var.key_pair_name}.pem ec2-user@${aws_eip.vitalgo_eip.public_ip}"
}