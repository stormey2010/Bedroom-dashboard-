"""Config flow for Bedroom Dashboard."""

from __future__ import annotations

from homeassistant import config_entries

from .const import DOMAIN, NAME


class BedroomDashboardConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Configure Bedroom Dashboard."""

    VERSION = 1

    async def async_step_user(self, user_input=None):
        """Create the single Bedroom Dashboard entry."""
        if self._async_current_entries():
            return self.async_abort(reason="single_instance_allowed")
        return self.async_create_entry(title=NAME, data={})
