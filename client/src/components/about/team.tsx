"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Linkedin, Twitter } from "lucide-react";

interface TeamMember {
  _id: string;
  name: string;
  role: string;
  description?: string;
  imageUrl: string;
  linkedin?: string | null;
  twitter?: string | null;
  order: number;
}

export const Team = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const res = await fetch("http://localhost:3005/api/v1/team"); // or http://localhost:3005/api/v1/team if not proxied
        if (!res.ok) {
          throw new Error(`Failed to fetch team members: ${res.status}`);
        }
        const data = await res.json();
        // Assuming your backend returns { total: number, members: TeamMember[] }
        const sortedMembers = (data.members || []).sort(
          (a: TeamMember, b: TeamMember) => a.order - b.order
        );
        setMembers(sortedMembers);
      } catch (err) {
        console.error("Error fetching team:", err);
        setError("Failed to load team members");
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  if (loading) {
    return (
      <section id="team" className="bg-background-secondary py-16 px-4 sm:px-6">
        <div className="container mx-auto text-center">
          <p className="text-tertiary-text">Loading team members...</p>
        </div>
      </section>
    );
  }

  if (error || members.length === 0) {
    return (
      <section id="team" className="bg-background-secondary py-16 px-4 sm:px-6">
        <div className="container mx-auto text-center">
          <p className="text-tertiary-text">
            {error || "No team members found"}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="team" className="bg-background-secondary py-16 px-4 sm:px-6">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
            Our Team
          </h2>
          <p className="text-tertiary-text text-base sm:text-lg">
            Meet the people behind The Future of Man
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {members.map((member) => (
            <div
              key={member._id}
              className="bg-card-purple p-4 sm:p-6 rounded-2xl text-center"
            >
              <Image
                src={member.imageUrl}
                alt={member.name}
                width={96}
                height={96}
                unoptimized
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-white">
                {member.name}
              </h3>
              <p className="text-highlight-text mb-4 text-sm sm:text-base">
                {member.role}
              </p>
              <p className="text-tertiary-text mb-4 text-sm sm:text-base">
                {member.description || "Team member"}
              </p>
              <div className="flex justify-center space-x-4">
                {member.linkedin && (
                  <Link
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-tertiary-text hover:text-highlight-text transition-colors"
                  >
                    <Linkedin className="w-5 h-5 sm:w-6 sm:h-6" />
                  </Link>
                )}
                {member.twitter && (
                  <Link
                    href={member.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-tertiary-text hover:text-highlight-text transition-colors"
                  >
                    <Twitter className="w-5 h-5 sm:w-6 sm:h-6" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
