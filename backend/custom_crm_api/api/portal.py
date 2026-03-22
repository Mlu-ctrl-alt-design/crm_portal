"""
custom_crm_api.api.portal
~~~~~~~~~~~~~~~~~~~~~~~~~
CRM portal endpoints consumed by the React authenticated views.
All endpoints require an active Frappe session (no allow_guest=True).

Views that call these endpoints:
  Dashboard.jsx        → get_dashboard_summary()
  Tickets.jsx          → get_my_tickets()
  TicketDetail.jsx     → get_ticket_detail(), reply_to_ticket()
  NewTicket.jsx        → create_ticket()
  Profile.jsx          → get_my_profile(), update_my_profile()
  TopBar.jsx           → get_notifications(), mark_notifications_read()
"""

import frappe
from frappe import _
from frappe.utils import now, today


# ---------------------------------------------------------------------------
# Private helper
# ---------------------------------------------------------------------------

def _get_session_contact():
    """
    Returns the Contact document linked to the currently logged-in user.
    Raises frappe.PermissionError if no Contact is found — this prevents
    unauthenticated or misconfigured users from accessing portal data.
    """
    user_email = frappe.session.user
    contact_name = frappe.db.get_value("Contact", {"user": user_email}, "name")
    if not contact_name:
        frappe.throw(
            _("No Contact record found for user {0}. Please contact support.").format(user_email),
            frappe.PermissionError,
        )
    return frappe.get_doc("Contact", contact_name)


# ---------------------------------------------------------------------------
# Dashboard
# ---------------------------------------------------------------------------

@frappe.whitelist()
def get_dashboard_summary() -> dict:
    """
    Called by: src/views/end_user/Dashboard.jsx
    Returns aggregated counts and recent activity for the portal user's dashboard.

    Returns:
        {
            open_tickets: int,
            resolved_tickets: int,
            active_deals: int,
            recent_activity: list  (last 5 Communication records)
        }
    """
    contact = _get_session_contact()

    open_tickets = frappe.db.count(
        "Issue",
        filters={"contact": contact.name, "status": ["not in", ["Resolved", "Closed"]]},
    )
    resolved_tickets = frappe.db.count(
        "Issue",
        filters={"contact": contact.name, "status": ["in", ["Resolved", "Closed"]]},
    )
    # Active deals — counts Opportunities linked to the contact's email/company
    active_deals = frappe.db.count(
        "Opportunity",
        filters={
            "contact_email": contact.email_id,
            "status": ["not in", ["Lost", "Closed"]],
        },
    )

    recent_activity = frappe.get_all(
        "Communication",
        filters={"reference_doctype": "Issue", "sender": frappe.session.user},
        fields=["name", "subject", "sent_or_received", "creation", "reference_name"],
        order_by="creation desc",
        limit=5,
    )

    return {
        "open_tickets": open_tickets,
        "resolved_tickets": resolved_tickets,
        "active_deals": active_deals,
        "recent_activity": recent_activity,
    }


# ---------------------------------------------------------------------------
# Tickets
# ---------------------------------------------------------------------------

@frappe.whitelist()
def get_my_tickets(status: str | None = None, page: int = 1, page_size: int = 20) -> dict:
    """
    Called by: src/views/end_user/Tickets.jsx
    Returns a paginated list of Issues linked to the session user's Contact.

    Args:
        status:    Optional status filter (e.g. "Open", "Resolved").
        page:      1-based page number.
        page_size: Records per page (default 20).

    Returns:
        { tickets: list, total: int, page: int }
    """
    contact = _get_session_contact()
    page = int(page)
    page_size = int(page_size)

    filters = {"contact": contact.name}
    if status:
        filters["status"] = status

    total = frappe.db.count("Issue", filters=filters)
    tickets = frappe.get_all(
        "Issue",
        filters=filters,
        fields=["name", "subject", "status", "priority", "creation", "modified"],
        order_by="creation desc",
        start=(page - 1) * page_size,
        page_length=page_size,
    )

    return {"tickets": tickets, "total": total, "page": page}


@frappe.whitelist()
def get_ticket_detail(ticket_id: str) -> dict:
    """
    Called by: src/views/end_user/TicketDetail.jsx
    Returns the full Issue document plus its Communication thread.
    Performs an ownership check to ensure the session user owns this ticket.

    Args:
        ticket_id: The Issue name (e.g. "ISS-0001").

    Returns:
        { ticket: dict, thread: list }

    Raises:
        frappe.PermissionError — if the ticket does not belong to this user.
    """
    contact = _get_session_contact()
    issue = frappe.get_doc("Issue", ticket_id)

    if issue.contact != contact.name:
        frappe.throw(
            _("You do not have permission to view ticket {0}.").format(ticket_id),
            frappe.PermissionError,
        )

    thread = frappe.get_all(
        "Communication",
        filters={"reference_doctype": "Issue", "reference_name": ticket_id},
        fields=[
            "name",
            "sender",
            "sender_full_name",
            "sent_or_received",
            "content",
            "creation",
        ],
        order_by="creation asc",
    )

    return {"ticket": issue.as_dict(), "thread": thread}


@frappe.whitelist(methods=["POST"])
def create_ticket(subject: str, description: str, priority: str = "Medium") -> dict:
    """
    Called by: src/views/end_user/NewTicket.jsx
    Creates a new Issue (support ticket) linked to the session user's Contact.

    Args:
        subject:     Short summary of the issue.
        description: Full description / steps to reproduce.
        priority:    "Low" | "Medium" | "High" (default "Medium").

    Returns:
        { ticket_id: str, message: str }
    """
    contact = _get_session_contact()

    issue = frappe.get_doc(
        {
            "doctype": "Issue",
            "subject": subject,
            "description": description,
            "priority": priority,
            "contact": contact.name,
            "raised_by": frappe.session.user,
            "status": "Open",
        }
    )
    issue.insert(ignore_permissions=True)
    frappe.db.commit()

    return {"ticket_id": issue.name, "message": "Ticket created successfully."}


@frappe.whitelist(methods=["POST"])
def reply_to_ticket(ticket_id: str, message: str) -> dict:
    """
    Called by: src/views/end_user/TicketDetail.jsx (reply form)
    Appends a Communication entry to the ticket thread.
    If the ticket was Resolved or Closed, it is automatically reopened.

    Args:
        ticket_id: The Issue name.
        message:   The reply text (may contain HTML).

    Returns:
        { message: str }

    Raises:
        frappe.PermissionError — if the ticket does not belong to this user.
    """
    contact = _get_session_contact()
    issue = frappe.get_doc("Issue", ticket_id)

    if issue.contact != contact.name:
        frappe.throw(
            _("You do not have permission to reply to ticket {0}.").format(ticket_id),
            frappe.PermissionError,
        )

    # Create Communication entry
    comm = frappe.get_doc(
        {
            "doctype": "Communication",
            "communication_type": "Communication",
            "communication_medium": "Portal",
            "sent_or_received": "Received",
            "sender": frappe.session.user,
            "sender_full_name": frappe.get_value("User", frappe.session.user, "full_name"),
            "subject": f"Re: {issue.subject}",
            "content": message,
            "reference_doctype": "Issue",
            "reference_name": ticket_id,
            "status": "Linked",
        }
    )
    comm.insert(ignore_permissions=True)

    # Reopen ticket if it was resolved/closed
    if issue.status in ("Resolved", "Closed"):
        issue.status = "Open"
        issue.save(ignore_permissions=True)

    frappe.db.commit()
    return {"message": "Reply submitted successfully."}


# ---------------------------------------------------------------------------
# Profile
# ---------------------------------------------------------------------------

@frappe.whitelist()
def get_my_profile() -> dict:
    """
    Called by: src/views/end_user/Profile.jsx
    Returns the portal user's profile information sourced from their Contact
    and User records.

    Returns:
        { full_name, email, phone, company, image }
    """
    contact = _get_session_contact()
    user_doc = frappe.get_doc("User", frappe.session.user)

    phone = ""
    if contact.phone_nos:
        phone = contact.phone_nos[0].phone

    return {
        "full_name": contact.full_name,
        "email": user_doc.email,
        "phone": phone,
        "company": contact.company_name or "",
        "image": user_doc.user_image or "",
    }


@frappe.whitelist(methods=["POST"])
def update_my_profile(
    full_name: str | None = None,
    phone: str | None = None,
    company: str | None = None,
) -> dict:
    """
    Called by: src/views/end_user/Profile.jsx (save button)
    Updates the portal user's Contact (and User) record.

    Email changes are intentionally excluded here because Frappe requires
    an email-verification flow before changing a login email address.
    Direct email updates would break authentication without that flow.

    Returns:
        { message: str }
    """
    contact = _get_session_contact()
    user_doc = frappe.get_doc("User", frappe.session.user)

    if full_name:
        parts = full_name.split(" ", 1)
        contact.first_name = parts[0]
        contact.last_name = parts[1] if len(parts) > 1 else ""
        contact.full_name = full_name
        user_doc.first_name = parts[0]
        user_doc.last_name = parts[1] if len(parts) > 1 else ""
        user_doc.full_name = full_name

    if company is not None:
        contact.company_name = company

    if phone is not None:
        if contact.phone_nos:
            contact.phone_nos[0].phone = phone
        else:
            contact.append("phone_nos", {"phone": phone, "is_primary_phone": 1})

    contact.save(ignore_permissions=True)
    user_doc.save(ignore_permissions=True)
    frappe.db.commit()

    return {"message": "Profile updated successfully."}


# ---------------------------------------------------------------------------
# Notifications
# ---------------------------------------------------------------------------

@frappe.whitelist()
def get_notifications() -> dict:
    """
    Called by: src/hooks/useNotifications.js (polled every 30 s)
    Returns the session user's Notification Log entries and the unread count.

    Returns:
        { notifications: list, unread_count: int }
    """
    notifications = frappe.get_all(
        "Notification Log",
        filters={"for_user": frappe.session.user},
        fields=["name", "subject", "email_content", "creation", "read", "type", "from_user"],
        order_by="creation desc",
        limit=50,
    )

    unread_count = sum(1 for n in notifications if not n.get("read"))

    return {"notifications": notifications, "unread_count": unread_count}


@frappe.whitelist(methods=["POST"])
def mark_notifications_read() -> dict:
    """
    Called by: src/hooks/useNotifications.js → useMarkRead mutation
    Marks all unread Notification Log entries for the session user as read.

    Returns:
        { message: str }
    """
    frappe.db.set_value(
        "Notification Log",
        {"for_user": frappe.session.user, "read": 0},
        "read",
        1,
        update_modified=False,
    )
    frappe.db.commit()
    return {"message": "All notifications marked as read."}
