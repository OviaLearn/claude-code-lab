# --- Workload VM (no public IP, sits in workload subnet) ---

module "vm_workload" {
  source = "./modules/vm"

  vm_name             = "vm-workload-uks-001"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  subnet_id           = azurerm_subnet.workload.id
  vm_size              = var.vm_size_workload
  admin_username       = var.admin_username
  admin_ssh_public_key = var.admin_ssh_public_key
  enable_public_ip     = false
  tags                = local.tags
}

# --- Management VM (public IP enabled, sits in management subnet) ---

module "vm_management" {
  source = "./modules/vm"

  vm_name             = "vm-management-uks-001"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  subnet_id           = azurerm_subnet.management.id
  vm_size              = var.vm_size_management
  admin_username       = var.admin_username
  admin_ssh_public_key = var.admin_ssh_public_key
  enable_public_ip     = true
  tags                = local.tags
}

# --- Outputs ---

output "workload_private_ip" {
  value = module.vm_workload.private_ip_address
}

output "management_public_ip" {
  value = module.vm_management.public_ip_address
}

output "management_private_ip" {
  value = module.vm_management.private_ip_address
}
