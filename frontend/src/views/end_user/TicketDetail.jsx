// UNTITLED UI: Replace thread with Chat component, metadata panel with Detail Panel —
//   see untitledui.com/react/components/chat
//   see untitledui.com/react/components/detail-panel

/**
 * src/views/end_user/TicketDetail.jsx
 * Ticket detail page: communication thread on the left,
 * metadata panel on the right, reply form at the bottom.
 */

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTicket, useReplyToTicket } from "../../hooks/useTickets.js";
import Badge from "../../components/ui/Badge.jsx";
import Button from "../../components/ui/Button.jsx";

function statusVariant(status) {
  switch (status) {
    case "Open": return "open";
    case "Replied": return "pending";
    case "Resolved": return "resolved";
    case "Closed": return "closed";
    default: return "closed";
  }
}

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useTicket(id);
  const { mutate: reply, isPending: isReplying } = useReplyToTicket(id);

  const [replyText, setReplyText] = useState("");
  const [replyError, setReplyError] = useState("");

  const handleReply = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setReplyError("");
    reply(
      { message: replyText },
      {
        onSuccess: () => setReplyText(""),
        onError: () => setReplyError("Failed to submit reply. Please try again."),
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (isError || !data) {
    return <p className="text-red-600">Ticket not found or access denied.</p>;
  }

  const { ticket, thread } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/tickets")}
          className="text-sm text-blue-600 hover:underline"
        >
          ← Back to tickets
        </button>
        <h1 className="text-xl font-semibold text-gray-900">{ticket.subject}</h1>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* ── Thread ────────────────────────────────────────────── */}
        <div className="flex-1 space-y-4">
          {thread.length === 0 ? (
            <p className="text-sm text-gray-400">No messages yet.</p>
          ) : (
            thread.map((msg) => {
              const isAgent = msg.sent_or_received === "Sent";
              return (
                <div
                  key={msg.name}
                  className={`flex ${isAgent ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={[
                      "max-w-xl rounded-xl px-4 py-3 text-sm",
                      isAgent
                        ? "bg-gray-100 text-gray-800"
                        : "bg-blue-600 text-white",
                    ].join(" ")}
                  >
                    <p className="mb-1 text-xs font-semibold opacity-70">
                      {msg.sender_full_name || msg.sender}{" "}
                      &middot; {new Date(msg.creation).toLocaleString()}
                    </p>
                    {/* Render content as HTML (Frappe stores rich text) */}
                    <div dangerouslySetInnerHTML={{ __html: msg.content }} />
                  </div>
                </div>
              );
            })
          )}

          {/* Reply form */}
          <form onSubmit={handleReply} className="mt-4 space-y-3">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={3}
              placeholder="Write your reply…"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            {replyError && (
              <p className="text-xs text-red-600">{replyError}</p>
            )}
            <Button type="submit" variant="primary" isLoading={isReplying}>
              Send reply
            </Button>
          </form>
        </div>

        {/* ── Metadata panel ────────────────────────────────────── */}
        <aside className="w-full lg:w-56 space-y-4 rounded-xl border border-gray-200 bg-white p-5">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">Status</p>
            <Badge label={ticket.status} variant={statusVariant(ticket.status)} />
          </div>
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">Priority</p>
            <p className="text-sm text-gray-700">{ticket.priority}</p>
          </div>
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">Created</p>
            <p className="text-sm text-gray-700">
              {new Date(ticket.creation).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">Ticket ID</p>
            <p className="font-mono text-xs text-gray-500">{ticket.name}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
