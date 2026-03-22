"""
custom_crm_api.api.auth
~~~~~~~~~~~~~~~~~~~~~~~
Authentication endpoints consumed by the React guest views:
  - Login.jsx       → login()
  - Register.jsx    → register()
  - ForgotPassword.jsx → request_password_reset()
  - (logout button in TopBar.jsx) → logout()
"""

import frappe
from frappe import _
from frappe.utils.password_reset import send_password_reset_email


@frappe.whitelist(allow_guest=True)
def login(email: str, password: str) -> dict:
    """
    Called by: src/views/guest/Login.jsx
    Authenticates the user against Frappe's user store and establishes a session.

    Returns:
        { message: str, user: str (email), full_name: str }

    Raises:
        frappe.AuthenticationError — if credentials are invalid.
    """
    try:
        frappe.local.login_manager.authenticate(user=email, pwd=password)
        frappe.local.login_manager.post_login()
    except frappe.AuthenticationError:
        frappe.local.response["http_status_code"] = 401
        raise frappe.AuthenticationError(_("Invalid email or password."))

    user_doc = frappe.get_doc("User", frappe.session.user)
    return {
        "message": "Logged in successfully.",
        "user": frappe.session.user,
        "full_name": user_doc.full_name,
    }


@frappe.whitelist(allow_guest=True)
def register(
    full_name: str,
    email: str,
    password: str,
    company: str | None = None,
    phone: str | None = None,
) -> dict:
    """
    Called by: src/views/guest/Register.jsx
    Creates a new Website User account with the 'Customer Portal User' role,
    then creates a linked Contact record.

    Returns:
        { message: str }

    Raises:
        frappe.DuplicateEntryError — if a user with this email already exists.
    """
    if frappe.db.exists("User", {"email": email}):
        frappe.throw(
            _("An account with email {0} already exists.").format(email),
            frappe.DuplicateEntryError,
        )

    # Create User
    user = frappe.get_doc(
        {
            "doctype": "User",
            "email": email,
            "first_name": full_name.split(" ")[0],
            "last_name": " ".join(full_name.split(" ")[1:]) if " " in full_name else "",
            "full_name": full_name,
            "user_type": "Website User",
            "send_welcome_email": 0,
        }
    )
    user.append("roles", {"role": "Customer Portal User"})
    user.insert(ignore_permissions=True)

    # Set password
    from frappe.utils.password import update_password
    update_password(user=email, pwd=password)

    # Create linked Contact
    contact = frappe.get_doc(
        {
            "doctype": "Contact",
            "first_name": full_name.split(" ")[0],
            "last_name": " ".join(full_name.split(" ")[1:]) if " " in full_name else "",
            "full_name": full_name,
            "user": email,
            "company_name": company or "",
        }
    )
    contact.append("email_ids", {"email_id": email, "is_primary": 1})
    if phone:
        contact.append("phone_nos", {"phone": phone, "is_primary_phone": 1})
    contact.insert(ignore_permissions=True)

    frappe.db.commit()
    return {"message": "Account created successfully. Please log in."}


@frappe.whitelist(allow_guest=True)
def request_password_reset(email: str) -> dict:
    """
    Called by: src/views/guest/ForgotPassword.jsx
    Triggers Frappe's built-in password reset email flow.

    Always returns a generic success message regardless of whether the email
    exists — this prevents user enumeration attacks.

    Returns:
        { message: str }
    """
    try:
        send_password_reset_email(email)
    except Exception:
        # Swallow any error (e.g. user not found) to avoid leaking info.
        pass

    return {
        "message": "If that email address is in our system, you will receive a reset link shortly."
    }


@frappe.whitelist()
def logout() -> dict:
    """
    Called by: src/components/layout/TopBar.jsx (logout button)
    Destroys the current Frappe session.

    Returns:
        { message: str }
    """
    frappe.local.login_manager.logout()
    frappe.db.commit()
    return {"message": "Logged out successfully."}
