variable "resource_group_name" {
  type        = string
  description = "Resource group to deploy all resources into."
  default     = "claude-code-lab-rg"
}

variable "admin_username" {
  type        = string
  description = "Admin username for all VMs."
  default     = "azureuser"
}

variable "admin_ssh_public_key" {
  type        = string
  sensitive   = true
  description = "SSH public key for VM admin access. Set via TF_VAR_admin_ssh_public_key or a tfvars file."
}

variable "vm_size_workload" {
  type        = string
  description = "VM SKU for the workload VM."
  default     = "Standard_B1s"
}

variable "vm_size_management" {
  type        = string
  description = "VM SKU for the management VM."
  default     = "Standard_B1s"
}
