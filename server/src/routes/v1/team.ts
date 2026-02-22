import express, { Request, Response } from "express";
import {
  getAllTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from "@/controllers/team";
// import { authenticate } from "@/middleware/auth";   ← comment this out for now

const router = express.Router();

// GET all team members – already public
router.get("", async (req: Request, res: Response) => {
  try {
    const members = await getAllTeamMembers();
    res.status(200).json({
      total: members.length,
      members,
    });
  } catch (error) {
    console.error("Get team members error:", error);
    res.status(500).json({ message: "Failed to fetch team members" });
  }
});

// CREATE team member – temporarily public
router.post(
  "/",
  /* authenticate, */ async (req: Request, res: Response) => {
    try {
      const newMember = await createTeamMember(req.body);
      res.status(201).json({
        message: "Team member created successfully",
        member: newMember,
      });
    } catch (error) {
      console.error("Create team member error:", error);
      res.status(500).json({ message: "Failed to create team member" });
    }
  }
);

// UPDATE team member – temporarily public
router.put(
  "/:id",
  /* authenticate, */ async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updatedMember = await updateTeamMember(id, req.body);

      if (!updatedMember) {
        res.status(404).json({ message: "Team member not found" });
        return;
      }

      res.status(200).json({
        message: "Team member updated successfully",
        member: updatedMember,
      });
    } catch (error) {
      console.error("Update team member error:", error);
      res.status(500).json({ message: "Failed to update team member" });
    }
  }
);

// DELETE team member – temporarily public
router.delete(
  "/:id",
  /* authenticate, */ async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await deleteTeamMember(id);
      res.status(200).json({
        message: "Team member deleted successfully",
      });
    } catch (error) {
      console.error("Delete team member error:", error);
      res.status(500).json({ message: "Failed to delete team member" });
    }
  }
);

export const teamRouter = router;
