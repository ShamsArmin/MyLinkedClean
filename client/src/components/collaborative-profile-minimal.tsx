import { useState } from 'react';

type CollaboratorType = {
  id: number;
  username: string;
  avatar?: string;
  role?: string;
};

type ProjectType = {
  id: number;
  name: string;
  description: string;
  owner: { id: number; username: string };
  collaborators: CollaboratorType[];
  created: string;
};

type CollaborativeProfileMinimalProps = {
  currentUser: { id: number; username: string };
  className?: string;
};

export function CollaborativeProfileMinimal({ currentUser, className = '' }: CollaborativeProfileMinimalProps) {
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [isInvitingCollaborator, setIsInvitingCollaborator] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('editor');
  const [selectedProject, setSelectedProject] = useState<ProjectType | null>(null);
  
  // Sample data - in a real app this would come from an API
  const [projects, setProjects] = useState<ProjectType[]>([
    {
      id: 1,
      name: 'Team Portfolio',
      description: 'Our design team\'s collective portfolio showcasing our best work',
      owner: currentUser,
      collaborators: [
        { id: 2, username: 'designer', avatar: 'https://i.pravatar.cc/150?img=5', role: 'editor' },
        { id: 3, username: 'developer', avatar: 'https://i.pravatar.cc/150?img=12', role: 'viewer' }
      ],
      created: '2023-05-15'
    }
  ]);
  const [newProject, setNewProject] = useState({
    name: '',
    description: ''
  });

  // Handle creating a new project
  const handleCreateProject = () => {
    if (!newProject.name) return;
    
    const project = {
      id: Date.now(),
      name: newProject.name,
      description: newProject.description,
      owner: currentUser,
      collaborators: [],
      created: new Date().toISOString().split('T')[0]
    };
    
    setProjects([...projects, project]);
    setNewProject({ name: '', description: '' });
    setIsCreatingProject(false);
  };

  // Handle inviting a collaborator
  const handleInviteCollaborator = () => {
    if (!inviteEmail || !selectedProject) return;
    
    // In a real app, this would send an API request
    console.log(`Inviting ${inviteEmail} as ${inviteRole} to project ${selectedProject.id}`);
    setInviteEmail('');
    setIsInvitingCollaborator(false);
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Collaborative Profiles</h2>
        <button
          onClick={() => setIsCreatingProject(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Create Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-10">
          <div className="bg-blue-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium mb-2">No Collaborative Projects Yet</h3>
          <p className="text-gray-500 mb-4 max-w-md mx-auto">
            Create your first collaborative project to showcase team members, organize events, or share joint work.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map(project => (
            <div key={project.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-lg">{project.name}</h3>
              <p className="text-gray-600 text-sm mt-1 mb-4">{project.description}</p>
              
              <div className="flex justify-between items-center">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs ring-2 ring-white">
                    {project.owner.username.substring(0, 2).toUpperCase()}
                  </div>
                  
                  {project.collaborators.map(collaborator => (
                    <div 
                      key={collaborator.id}
                      className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 text-xs ring-2 ring-white"
                      title={`${collaborator.username} (${collaborator.role})`}
                    >
                      {collaborator.username.substring(0, 2).toUpperCase()}
                    </div>
                  ))}
                  
                  <button
                    onClick={() => {
                      setSelectedProject(project);
                      setIsInvitingCollaborator(true);
                    }}
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 text-xs ring-2 ring-white"
                  >
                    +
                  </button>
                </div>
                
                <div className="flex space-x-2 text-sm">
                  <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200">
                    View
                  </button>
                  <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                    Share
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Create Project Modal */}
      {isCreatingProject && (
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
                onClick={() => setIsCreatingProject(false)}
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
      
      {/* Invite Collaborator Modal */}
      {isInvitingCollaborator && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">
              Invite Collaborator to {selectedProject.name}
            </h3>
            
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
                onClick={() => setIsInvitingCollaborator(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleInviteCollaborator}
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