import { useState } from 'react';
import { User } from '@shared/schema';

interface CollaborativeProfilesProps {
  currentUser: { id: number; username: string };
  className?: string;
}

interface Collaborator {
  id: number;
  username: string;
  avatar?: string;
  email?: string;
  role?: string;
}

interface CollaborativeProject {
  id: number;
  name: string;
  description: string;
  owner: User;
  collaborators: Collaborator[];
  created: string;
}

export function CollaborativeProfiles({ currentUser, className = '' }: CollaborativeProfilesProps) {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('editor');
  const [collaborativeProjects, setCollaborativeProjects] = useState<CollaborativeProject[]>([
    {
      id: 1,
      name: 'Team Portfolio',
      description: 'Our design team\'s collective portfolio showcasing our best work',
      owner: currentUser,
      collaborators: [
        { id: 2, username: 'sarahjones', avatar: 'https://i.pravatar.cc/150?img=5', role: 'editor' },
        { id: 3, username: 'mikebrown', avatar: 'https://i.pravatar.cc/150?img=12', role: 'viewer' }
      ],
      created: '2023-08-15'
    },
    {
      id: 2,
      name: 'Hackathon Project',
      description: 'Our team\'s hackathon project links and resources',
      owner: currentUser,
      collaborators: [
        { id: 4, username: 'alexwong', avatar: 'https://i.pravatar.cc/150?img=11', role: 'editor' }
      ],
      created: '2023-09-22'
    }
  ]);
  const [creatingProject, setCreatingProject] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: ''
  });
  
  // Function to handle inviting a collaborator
  const handleInvite = () => {
    // In a real app, this would send an API request
    console.log(`Inviting ${inviteEmail} as ${inviteRole}`);
    setInviteEmail('');
    setIsInviteModalOpen(false);
  };
  
  // Function to handle creating a new collaborative project
  const handleCreateProject = () => {
    const project: CollaborativeProject = {
      id: Date.now(),
      name: newProject.name,
      description: newProject.description,
      owner: currentUser,
      collaborators: [],
      created: new Date().toISOString().split('T')[0]
    };
    
    setCollaborativeProjects([...collaborativeProjects, project]);
    setNewProject({ name: '', description: '' });
    setCreatingProject(false);
  };
  
  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Collaborative Profiles</h2>
        <button
          onClick={() => setCreatingProject(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          Create Project
        </button>
      </div>
      
      {collaborativeProjects.length === 0 ? (
        <div className="text-center py-12 px-4">
          <div className="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-12 h-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No collaborative projects yet</h3>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            Create your first collaborative project to share with team members, classmates, or friends.
          </p>
          <button
            onClick={() => setCreatingProject(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Create Your First Project
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {collaborativeProjects.map(project => (
            <div key={project.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between">
                <h3 className="font-semibold text-lg">{project.name}</h3>
                <span className="text-xs text-gray-500">Created on {project.created}</span>
              </div>
              <p className="text-gray-600 text-sm mt-1 mb-4">{project.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-medium ring-2 ring-white">
                    {currentUser.username.substring(0, 2).toUpperCase()}
                  </div>
                  {project.collaborators.map(collaborator => (
                    <div
                      key={collaborator.id}
                      className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 text-xs font-medium ring-2 ring-white"
                      title={`${collaborator.username} (${collaborator.role})`}
                    >
                      {collaborator.username.substring(0, 2).toUpperCase()}
                    </div>
                  ))}
                  <button
                    onClick={() => setIsInviteModalOpen(true)}
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 text-xs font-medium ring-2 ring-white hover:bg-gray-200"
                  >
                    +
                  </button>
                </div>
                
                <div className="flex space-x-2">
                  <a
                    href={`/collab/${project.id}`}
                    className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded hover:bg-blue-200 transition-colors"
                  >
                    View
                  </a>
                  <button
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200 transition-colors"
                  >
                    Share
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Create Project Modal */}
      {creatingProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Create Collaborative Project</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
              <input
                type="text"
                value={newProject.name}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Team Portfolio"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe your collaborative project"
                rows={3}
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setCreatingProject(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProject}
                disabled={!newProject.name}
                className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${!newProject.name ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Invite Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Invite Collaborator</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="colleague@example.com"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="editor">Editor (can edit)</option>
                <option value="viewer">Viewer (view only)</option>
              </select>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleInvite}
                disabled={!inviteEmail}
                className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${!inviteEmail ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Send Invitation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}