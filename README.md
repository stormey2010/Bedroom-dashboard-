# Bedroom Dashboard

A native Home Assistant sidebar panel for a bedroom dashboard. It uses Home Assistant's authenticated frontend connection for live state updates and service calls—no long-lived token, REST polling, or hardcoded Home Assistant URL.

## Install with HACS

1. In HACS, open **Integrations**.
2. Open the three-dot menu and choose **Custom repositories**.
3. Add `https://github.com/stormey2010/Bedroom-dashboard-` with category **Integration**.
4. Find **Bedroom Dashboard** in HACS and download it.
5. Restart Home Assistant.
6. Go to **Settings → Devices & services → Add integration**.
7. Search for **Bedroom Dashboard** and add it.
8. Open **Bedroom** in the sidebar or visit `/bedroom`.

If you previously configured this dashboard through `panel_custom:` in `configuration.yaml`, remove that old block after installing this integration, then restart Home Assistant once more.

## Manual install

Copy `custom_components/bedroom_dashboard` into `/config/custom_components/bedroom_dashboard`, restart Home Assistant, and add **Bedroom Dashboard** from **Settings → Devices & services**.

## Updating

Install updates through HACS and restart Home Assistant. Frontend assets are bundled inside the integration and versioned to avoid stale browser caches.

## Features

- Native `/bedroom` sidebar panel with `mdi:bed`
- Live state updates through Home Assistant's supplied `hass` object
- Service calls through `hass.callService`
- Instant optimistic UI with rollback on failures
- Bidirectional light-group prediction for individual bulbs, Fan Light, and All Lights
- No polling, exposed token, separate WebSocket client, or Lovelace dashboard required

## Troubleshooting

- Confirm the integration is listed under **Settings → Devices & services**.
- Restart Home Assistant after installing or updating through HACS.
- Search Home Assistant logs for `bedroom_dashboard` if the sidebar entry does not appear.
- Hard-refresh the browser once after a major update if an older frontend module remains cached.
