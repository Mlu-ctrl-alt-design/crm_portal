/**
 * src/views/end_user/NewTicket.jsx
 * Form to create a new support ticket. On success navigates to the
 * newly created ticket's detail page.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateTicket } from "../../hooks/useTickets.js";
import Input from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";

const PRIORITY_OPTIONS = ["Low", "Medium", "High"];

export default function NewTicket() {
  const navigate = useNavigate();
  const { mutate: createTicket, isPending } = useCreateTicket();

  const [form, setForm] = useState({
    subject: "",
    description: "",
    priority: "Medium",
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.subject.trim()) errs.subject = "Subject is required.";
    if (!form.description.trim()) errs.description = "Description is required.";
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitError("");

    createTicket(
      { subject: form.subject, description: form.description, priority: form.priority },
      {
        onSuccess: (data) => {
          navigate(`/tickets/${data.ticket_id}`, { replace: true });
        },
        onError: () => {
          setSubmitError("Failed to create ticket. Please try again.");
        },
      }
    );
  };

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">New Ticket</h1>

      {submitError && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-gray-200 bg-white p-6">
        <Input
          label="Subject"
          name="subject"
          value={form.subject}
          onChange={handleChange}
          placeholder="Briefly describe your issue"
          error={errors.subject}
          required
        />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700" htmlFor="description">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={5}
            placeholder="Provide as much detail as possible…"
            className={[
              "rounded-md border px-3 py-2 text-sm shadow-sm outline-none transition",
              "focus:border-blue-500 focus:ring-2 focus:ring-blue-200",
              errors.description ? "border-red-400" : "border-gray-300",
            ].join(" ")}
          />
          {errors.description && (
            <p className="text-xs text-red-600">{errors.description}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700" htmlFor="priority">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            {PRIORITY_OPTIONS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            variant="secondary"
            type="button"
            onClick={() => navigate("/tickets")}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isPending}>
            Submit ticket
          </Button>
        </div>
      </form>
    </div>
  );
}
