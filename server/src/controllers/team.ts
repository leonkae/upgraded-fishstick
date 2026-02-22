import { TeamMember, ITeamMember } from "@/db/models/team";

export async function getAllTeamMembers(): Promise<ITeamMember[]> {
  return TeamMember.find().sort({ order: 1 });
}

export async function createTeamMember(
  data: Partial<ITeamMember>
): Promise<ITeamMember> {
  const member = new TeamMember(data);
  return member.save();
}

export async function updateTeamMember(
  id: string,
  updates: Partial<ITeamMember>
): Promise<ITeamMember> {
  const updated = await TeamMember.findByIdAndUpdate(id, updates, {
    new: true,
  });

  if (!updated) throw new Error("Not found");

  return updated;
}

export async function deleteTeamMember(id: string): Promise<void> {
  await TeamMember.findByIdAndDelete(id);
}
