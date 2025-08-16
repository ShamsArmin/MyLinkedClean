import { Router, Request, Response } from "express";
import { storage } from "./storage";
import { z } from "zod";
import {
  createProjectSchema,
  collaboratorSchema,
  collaborativeLinkSchema,
  invitationSchema,
} from "../shared/schema";

export const collaborativeRouter = Router();

// Middleware to check authentication
function isAuthenticated(req: Request, res: Response, next: Function) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}

// Middleware to check if user is collaborator of a project
async function isCollaborator(req: Request, res: Response, next: Function) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  const projectId = parseInt(req.params.projectId);
  const userId = req.user!.id;
  
  try {
    const collaborators = await storage.getProjectCollaborators(projectId);
    const isCollaborator = collaborators.some(c => c.userId === userId);
    
    if (!isCollaborator) {
      return res.status(403).json({ message: "Not authorized to access this project" });
    }
    
    next();
  } catch (error) {
    console.error("Error checking collaborator status:", error);
    res.status(500).json({ message: "Error checking collaborator status" });
  }
}

// Middleware to check if user has edit permissions on a project
async function hasEditPermission(req: Request, res: Response, next: Function) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  const projectId = parseInt(req.params.projectId);
  const userId = req.user!.id;
  
  try {
    const collaborators = await storage.getProjectCollaborators(projectId);
    const userRole = collaborators.find(c => c.userId === userId)?.role;
    
    if (!userRole || (userRole !== 'owner' && userRole !== 'editor')) {
      return res.status(403).json({ message: "Not authorized to edit this project" });
    }
    
    next();
  } catch (error) {
    console.error("Error checking edit permissions:", error);
    res.status(500).json({ message: "Error checking edit permissions" });
  }
}

// Middleware to check if user is owner of a project
async function isOwner(req: Request, res: Response, next: Function) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  const projectId = parseInt(req.params.projectId);
  const userId = req.user!.id;
  
  try {
    const collaborators = await storage.getProjectCollaborators(projectId);
    const isOwner = collaborators.some(c => c.userId === userId && c.role === 'owner');
    
    if (!isOwner) {
      return res.status(403).json({ message: "Only the project owner can perform this action" });
    }
    
    next();
  } catch (error) {
    console.error("Error checking owner status:", error);
    res.status(500).json({ message: "Error checking owner status" });
  }
}

// Get all projects where the user is a collaborator
collaborativeRouter.get("/projects", isAuthenticated, async (req, res) => {
  try {
    const userId = req.user!.id;
    const projects = await storage.getCollaboratorProjects(userId);
    
    // Fetch collaborators for each project
    const projectsWithCollaborators = await Promise.all(
      projects.map(async (project) => {
        const collaborators = await storage.getProjectCollaborators(project.id);
        return {
          ...project,
          collaborators,
        };
      })
    );
    
    res.json(projectsWithCollaborators);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ message: "Error fetching projects" });
  }
});

// Create a new collaborative project
collaborativeRouter.post("/projects", isAuthenticated, async (req, res) => {
  try {
    const userId = req.user!.id;
    const projectData = createProjectSchema.parse(req.body);
    
    const newProject = await storage.createCollaborativeProject(projectData, userId);
    
    // Add the creator as the owner
    await storage.addCollaborator(newProject.id, userId, "owner");
    
    // Get the updated project with collaborators
    const collaborators = await storage.getProjectCollaborators(newProject.id);
    
    res.status(201).json({
      ...newProject,
      collaborators,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid project data", errors: error.errors });
    }
    res.status(500).json({ message: "Error creating project" });
  }
});

// Get a specific project with collaborators
collaborativeRouter.get("/projects/:projectId", isCollaborator, async (req, res) => {
  try {
    const projectId = parseInt(req.params.projectId);
    const project = await storage.getCollaborativeProjectById(projectId);
    
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    
    const collaborators = await storage.getProjectCollaborators(projectId);
    
    res.json({
      ...project,
      collaborators,
    });
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ message: "Error fetching project" });
  }
});

// Update a project
collaborativeRouter.patch("/projects/:projectId", hasEditPermission, async (req, res) => {
  try {
    const projectId = parseInt(req.params.projectId);
    const updates = createProjectSchema.partial().parse(req.body);
    
    const updatedProject = await storage.updateCollaborativeProject(projectId, updates);
    
    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }
    
    const collaborators = await storage.getProjectCollaborators(projectId);
    
    res.json({
      ...updatedProject,
      collaborators,
    });
  } catch (error) {
    console.error("Error updating project:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid update data", errors: error.errors });
    }
    res.status(500).json({ message: "Error updating project" });
  }
});

// Delete a project
collaborativeRouter.delete("/projects/:projectId", isOwner, async (req, res) => {
  try {
    const projectId = parseInt(req.params.projectId);
    const success = await storage.deleteCollaborativeProject(projectId);
    
    if (!success) {
      return res.status(404).json({ message: "Project not found" });
    }
    
    res.sendStatus(204);
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ message: "Error deleting project" });
  }
});

// Get all links for a project
collaborativeRouter.get("/projects/:projectId/links", isCollaborator, async (req, res) => {
  try {
    const projectId = parseInt(req.params.projectId);
    const links = await storage.getCollaborativeLinks(projectId);
    
    res.json(links);
  } catch (error) {
    console.error("Error fetching links:", error);
    res.status(500).json({ message: "Error fetching links" });
  }
});

// Add a link to a project
collaborativeRouter.post("/links", hasEditPermission, async (req, res) => {
  try {
    const userId = req.user!.id;
    const linkData = collaborativeLinkSchema.parse({
      ...req.body,
      addedBy: userId,
    });
    
    const newLink = await storage.createCollaborativeLink(linkData);
    
    res.status(201).json(newLink);
  } catch (error) {
    console.error("Error creating link:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid link data", errors: error.errors });
    }
    res.status(500).json({ message: "Error creating link" });
  }
});

// Update a link
collaborativeRouter.patch("/projects/:projectId/links/:linkId", hasEditPermission, async (req, res) => {
  try {
    const linkId = parseInt(req.params.linkId);
    const updates = collaborativeLinkSchema.omit({ projectId: true, addedBy: true }).partial().parse(req.body);
    
    const updatedLink = await storage.updateCollaborativeLink(linkId, updates);
    
    if (!updatedLink) {
      return res.status(404).json({ message: "Link not found" });
    }
    
    res.json(updatedLink);
  } catch (error) {
    console.error("Error updating link:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid update data", errors: error.errors });
    }
    res.status(500).json({ message: "Error updating link" });
  }
});

// Delete a link
collaborativeRouter.delete("/projects/:projectId/links/:linkId", hasEditPermission, async (req, res) => {
  try {
    const linkId = parseInt(req.params.linkId);
    const success = await storage.deleteCollaborativeLink(linkId);
    
    if (!success) {
      return res.status(404).json({ message: "Link not found" });
    }
    
    res.sendStatus(204);
  } catch (error) {
    console.error("Error deleting link:", error);
    res.status(500).json({ message: "Error deleting link" });
  }
});

// Record a link click
collaborativeRouter.post("/projects/:projectId/links/:linkId/click", async (req, res) => {
  try {
    const linkId = parseInt(req.params.linkId);
    const updatedLink = await storage.incrementCollaborativeLinkClicks(linkId);
    
    if (!updatedLink) {
      return res.status(404).json({ message: "Link not found" });
    }
    
    res.json(updatedLink);
  } catch (error) {
    console.error("Error recording link click:", error);
    res.status(500).json({ message: "Error recording link click" });
  }
});

// Get all invitations for the current user
collaborativeRouter.get("/invitations", isAuthenticated, async (req, res) => {
  try {
    const email = req.user!.email;
    
    if (!email) {
      return res.status(400).json({ message: "User email is required" });
    }
    
    const invitations = await storage.getInvitationsByRecipient(email);
    
    // Fetch project and sender info for each invitation
    const invitationsWithDetails = await Promise.all(
      invitations.map(async (invitation) => {
        const project = await storage.getCollaborativeProjectById(invitation.projectId);
        const sender = await storage.getUser(invitation.senderUserId);
        
        return {
          ...invitation,
          projectName: project?.name || "Unknown Project",
          senderName: sender?.name || "Unknown User",
          senderEmail: sender?.email || "unknown@example.com",
        };
      })
    );
    
    res.json(invitationsWithDetails);
  } catch (error) {
    console.error("Error fetching invitations:", error);
    res.status(500).json({ message: "Error fetching invitations" });
  }
});

// Send an invitation to collaborate
collaborativeRouter.post("/invite", isAuthenticated, async (req, res) => {
  try {
    const userId = req.user!.id;
    const { projectId, email, role, message } = req.body;
    
    // Validate projectId and role
    if (!projectId || !email || !role) {
      return res.status(400).json({ message: "Project ID, email, and role are required" });
    }
    
    // Check if user is authorized to send invitations (must be owner or editor)
    const collaborators = await storage.getProjectCollaborators(projectId);
    const userRole = collaborators.find(c => c.userId === userId)?.role;
    
    if (!userRole || (userRole !== 'owner' && userRole !== 'editor')) {
      return res.status(403).json({ message: "Not authorized to send invitations for this project" });
    }
    
    // Check if user with this email already exists
    let recipientUserId = null;
    const existingUser = await storage.getUserByEmail(email);
    
    if (existingUser) {
      recipientUserId = existingUser.id;
      
      // Check if user is already a collaborator
      const isAlreadyCollaborator = collaborators.some(c => c.userId === existingUser.id);
      
      if (isAlreadyCollaborator) {
        return res.status(400).json({ message: "User is already a collaborator on this project" });
      }
    }
    
    const invitationData = {
      projectId,
      senderUserId: userId,
      recipientEmail: email,
      recipientUserId,
      role,
      message: message || null,
      status: "pending",
    };
    
    const invitation = await storage.createInvitation(invitationData);
    
    res.status(201).json(invitation);
  } catch (error) {
    console.error("Error sending invitation:", error);
    res.status(500).json({ message: "Error sending invitation" });
  }
});

// Respond to an invitation (accept or decline)
collaborativeRouter.post("/invitations/:invitationId/respond", isAuthenticated, async (req, res) => {
  try {
    const invitationId = parseInt(req.params.invitationId);
    const userId = req.user!.id;
    const { accept } = req.body;
    
    // Validate accept parameter
    if (typeof accept !== 'boolean') {
      return res.status(400).json({ message: "Accept parameter is required and must be a boolean" });
    }
    
    // Get the invitation
    const invitations = await storage.getInvitationsByRecipient(req.user!.email!);
    const invitation = invitations.find(inv => inv.id === invitationId);
    
    if (!invitation) {
      return res.status(404).json({ message: "Invitation not found" });
    }
    
    // If accepting, add the user as a collaborator
    if (accept) {
      await storage.addCollaborator(invitation.projectId, userId, invitation.role);
      await storage.updateInvitationStatus(invitationId, "accepted");
    } else {
      await storage.updateInvitationStatus(invitationId, "declined");
    }
    
    res.json({ message: accept ? "Invitation accepted" : "Invitation declined" });
  } catch (error) {
    console.error("Error responding to invitation:", error);
    res.status(500).json({ message: "Error responding to invitation" });
  }
});

// Remove a collaborator from a project
collaborativeRouter.delete("/projects/:projectId/collaborators/:collaboratorId", isOwner, async (req, res) => {
  try {
    const projectId = parseInt(req.params.projectId);
    const collaboratorId = parseInt(req.params.collaboratorId);
    
    // Cannot remove the owner
    const collaborators = await storage.getProjectCollaborators(projectId);
    const isOwner = collaborators.some(c => c.userId === collaboratorId && c.role === 'owner');
    
    if (isOwner) {
      return res.status(400).json({ message: "Cannot remove the project owner" });
    }
    
    const success = await storage.removeCollaborator(projectId, collaboratorId);
    
    if (!success) {
      return res.status(404).json({ message: "Collaborator not found" });
    }
    
    res.sendStatus(204);
  } catch (error) {
    console.error("Error removing collaborator:", error);
    res.status(500).json({ message: "Error removing collaborator" });
  }
});

// Change a collaborator's role
collaborativeRouter.patch("/projects/:projectId/collaborators/:collaboratorId", isOwner, async (req, res) => {
  try {
    const projectId = parseInt(req.params.projectId);
    const collaboratorId = parseInt(req.params.collaboratorId);
    const { role } = req.body;
    
    if (!role) {
      return res.status(400).json({ message: "Role is required" });
    }
    
    if (!['editor', 'viewer'].includes(role)) {
      return res.status(400).json({ message: "Role must be either 'editor' or 'viewer'" });
    }
    
    // Cannot change the owner's role
    const collaborators = await storage.getProjectCollaborators(projectId);
    const isOwner = collaborators.some(c => c.userId === collaboratorId && c.role === 'owner');
    
    if (isOwner) {
      return res.status(400).json({ message: "Cannot change the owner's role" });
    }
    
    const updatedCollaborator = await storage.updateCollaboratorRole(projectId, collaboratorId, role);
    
    if (!updatedCollaborator) {
      return res.status(404).json({ message: "Collaborator not found" });
    }
    
    res.json(updatedCollaborator);
  } catch (error) {
    console.error("Error updating collaborator role:", error);
    res.status(500).json({ message: "Error updating collaborator role" });
  }
});