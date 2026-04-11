terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }

  cloud {
    organization = "ovialearn"
    workspaces {
      name = "claude-code-lab"
    }
  }
}

provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "main" {
  name     = "claude-code-lab-rg"
  location = "UK South"
}

resource "azurerm_static_site" "main" {
  name                = "claude-code-lab-site"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  sku_tier            = "Free"
  sku_size            = "Free"
}

output "site_url" {
  value = azurerm_static_site.main.default_host_name
}