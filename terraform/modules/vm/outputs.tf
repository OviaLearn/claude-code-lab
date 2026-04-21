output "vm_id" {
  value       = azurerm_linux_virtual_machine.this.id
  description = "Resource ID of the virtual machine."
}

output "private_ip_address" {
  value       = azurerm_network_interface.this.private_ip_address
  description = "Private IP assigned to the NIC."
}

output "public_ip_address" {
  value       = var.enable_public_ip ? azurerm_public_ip.this[0].ip_address : null
  description = "Public IP address (null if not enabled)."
}
