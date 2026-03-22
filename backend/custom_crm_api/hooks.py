app_name = "custom_crm_api"
app_title = "Custom CRM API"
app_publisher = "Your Company"
app_description = "Frappe app exposing REST endpoints for the decoupled React CRM portal"
app_version = "0.0.1"

# CSS/JS assets — empty because this app does not render Frappe pages.
# All UI is served by the standalone React/Vite frontend.
app_include_css = []
app_include_js = []

# ---------------------------------------------------------------------------
# CORS CONFIGURATION
# ---------------------------------------------------------------------------
# CORS is NOT configured here. Frappe handles CORS via common_site_config.json.
# Add the following keys to your site's common_site_config.json:
#
#   {
#     "allow_cors": "http://localhost:5173",
#     "cors_headers": "Authorization,Content-Type,X-Frappe-CSRF-Token"
#   }
#
# For multiple origins you can pass a comma-separated string or a list.
# Restart gunicorn / nginx after editing common_site_config.json.
# ---------------------------------------------------------------------------

# Override whitelisted methods — can be used to alias endpoint paths.
# Example:  "crm.login": "custom_crm_api.api.auth.login"
# Leave empty unless you need to remap paths.
override_whitelisted_methods = {}
