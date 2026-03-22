/**
 * src/views/end_user/Profile.jsx
 * User profile view. Allows updating name, phone, and company.
 *
 * Email is intentionally read-only — changing a Frappe login email requires
 * an email-verification flow (System Settings → email change) to prevent
 * account takeover. Direct email updates here would bypass that flow.
 */

import { useState, useEffect } from "react";
import { useProfile, useUpdateProfile } from "../../hooks/useProfile.js";
import Input from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";

export default function Profile() {
  const { data: profile, isLoading, isError } = useProfile();
  const { mutate: updateProfile, isPending, isSuccess, error: mutationError } =
    useUpdateProfile();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    company: "",
  });

  // Pre-fill form when profile data arrives
  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name ?? "",
        email: profile.email ?? "",
        phone: profile.phone ?? "",
        company: profile.company ?? "",
      });
    }
  }, [profile]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile({
      full_name: form.full_name,
      phone: form.phone,
      company: form.company,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (isError) {
    return <p className="text-red-600">Failed to load profile.</p>;
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">My Profile</h1>

      {isSuccess && (
        <div className="rounded-md bg-green-50 p-3 text-sm text-green-700">
          Profile updated successfully.
        </div>
      )}

      {mutationError && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
          Failed to update profile. Please try again.
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-xl border border-gray-200 bg-white p-6"
      >
        <Input
          label="Full name"
          name="full_name"
          value={form.full_name}
          onChange={handleChange}
          placeholder="Jane Smith"
          required
        />

        {/* Email is read-only — see file docstring for explanation */}
        <Input
          label="Email (read-only)"
          name="email"
          type="email"
          value={form.email}
          onChange={() => {}}
          readOnly
        />

        <Input
          label="Phone"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          placeholder="+1 555 000 0000"
        />

        <Input
          label="Company"
          name="company"
          value={form.company}
          onChange={handleChange}
          placeholder="Acme Corp"
        />

        <div className="flex justify-end">
          <Button type="submit" variant="primary" isLoading={isPending}>
            Save changes
          </Button>
        </div>
      </form>
    </div>
  );
}
