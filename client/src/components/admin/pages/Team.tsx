// app/(admin)/team/page.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { TeamMember } from "@/types";

export default function AdminTeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<Partial<TeamMember>>({
    name: "",
    role: "",
    description: "",
    imageUrl: "",
    linkedin: "",
    twitter: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3005/api/v1/team");
      const data = await res.json();
      setMembers(data.members ?? []);
    } catch (error) {
      console.error("Failed to fetch team members:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `http://localhost:3005/api/v1/team/${editingId}`
      : "http://localhost:3005/api/v1/team";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setFormData({
        name: "",
        role: "",
        description: "",
        imageUrl: "",
        linkedin: "",
        twitter: "",
      });
      setEditingId(null);
      fetchMembers();
    } else {
      alert("Error saving member");
    }
  };

  const handleEdit = (member: TeamMember) => {
    setFormData(member);
    setEditingId(member._id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this team member?")) return;
    await fetch(`http://localhost:3005/api/v1/team/${id}`, {
      method: "DELETE",
    });
    fetchMembers();
  };

  if (loading) return <div className="p-8">Loading team members...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Manage Team Members</h1>

      <form
        onSubmit={handleSubmit}
        className="mb-12 p-6 border rounded-xl bg-gray-50 shadow-sm"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              value={formData.name ?? ""}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Role / Title</label>
            <input
              type="text"
              placeholder="Developer"
              value={formData.role ?? ""}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Image URL</label>
            <input
              type="url"
              placeholder="https://example.com/photo.jpg"
              value={formData.imageUrl ?? ""}
              onChange={(e) =>
                setFormData({ ...formData, imageUrl: e.target.value })
              }
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">
              LinkedIn URL (optional)
            </label>
            <input
              type="url"
              placeholder="https://linkedin.com/in/username"
              value={formData.linkedin ?? ""}
              onChange={(e) =>
                setFormData({ ...formData, linkedin: e.target.value })
              }
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">
              Twitter / X URL (optional)
            </label>
            <input
              type="url"
              placeholder="https://twitter.com/username"
              value={formData.twitter ?? ""}
              onChange={(e) =>
                setFormData({ ...formData, twitter: e.target.value })
              }
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div className="flex flex-col md:col-span-2">
            <label className="text-sm font-medium mb-1">
              Short bio / description
            </label>
            <textarea
              placeholder="A short bio about the team member..."
              value={formData.description ?? ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none"
              rows={3}
            />
          </div>
        </div>

        <div className="mt-4 flex gap-3 justify-end">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
          >
            {editingId ? "Update Member" : "Add Member"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={() => {
                setFormData({
                  name: "",
                  role: "",
                  description: "",
                  imageUrl: "",
                  linkedin: "",
                  twitter: "",
                });
                setEditingId(null);
              }}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2 rounded-lg transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member) => (
          <div key={member._id} className="border rounded-lg p-4 shadow-sm">
            <div className="relative w-24 h-24 mx-auto mb-3">
              <Image
                src={member.imageUrl}
                alt={member.name}
                fill
                className="rounded-full object-cover"
                sizes="96px"
              />
            </div>
            <h3 className="font-bold text-center">{member.name}</h3>
            <p className="text-center text-blue-600">{member.role}</p>
            <p className="text-sm text-gray-600 mt-2">{member.description}</p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={() => handleEdit(member)}
                className="text-blue-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(member._id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {members.length === 0 && (
        <p className="text-center text-gray-500 mt-8">No team members yet.</p>
      )}
    </div>
  );
}
