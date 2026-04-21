variable "vm_name" {
  type        = string
  description = "Name of the virtual machine."
}

variable "location" {
  type        = string
  description = "Azure region."
}

variable "resource_group_name" {
  type        = string
  description = "Resource group to deploy into."
}

variable "subnet_id" {
  type        = string
  description = "Subnet ID to attach the NIC to."
}

variable "vm_size" {
  type        = string
  description = "Azure VM SKU."
  default     = "Standard_B1s"
}

variable "admin_username" {
  type        = string
  description = "Local admin username."
}

variable "admin_ssh_public_key" {
  type        = string
  sensitive   = true
  description = "SSH public key for admin access."
}

variable "enable_public_ip" {
  type        = bool
  description = "Attach a public IP to the VM."
  default     = false
}

variable "os_disk_size_gb" {
  type        = number
  description = "OS disk size in GB."
  default     = 30
}

variable "tags" {
  type        = map(string)
  description = "Tags to apply to all resources."
  default     = {}
}
