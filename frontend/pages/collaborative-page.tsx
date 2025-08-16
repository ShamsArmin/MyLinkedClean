import { useEffect, useState } from "react";

interface CollaborationRequest {
  id: number;
  requesterName: string;
  requesterEmail: string;
  requesterCompany?: string;
  requesterSkills?: string;
  projectType?: string;
  timeline?: string;
  budget?: string;
  description?: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
  updatedAt: string;
}

export default function CollaborativePage() {
  const [requests, setRequests] = useState<CollaborationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<number | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        console.log("Fetching collaboration requests...");
        const res = await fetch("/api/collaboration-requests");
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || `HTTP ${res.status}: Failed to fetch requests`);
        }
        const data = await res.json();
        console.log("Fetched requests:", data);
        setRequests(data);
      } catch (error: any) {
        console.error("Failed to fetch requests:", error);
        setError(error.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const updateStatus = async (id: number, status: "accepted" | "rejected") => {
    console.log(`Updating request ${id} to status: ${status}`);
    setUpdating(id);

    try {
      // Fixed: Use the correct API endpoint that matches your backend route
      const res = await fetch(`/api/collaboration-requests/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || `HTTP ${res.status}: Failed to update request`);
      }

      const updated = await res.json();
      console.log("Request updated successfully:", updated);

      setRequests((prev) =>
        prev.map((r) => (r.id === updated.id ? updated : r))
      );
    } catch (err: any) {
      console.error("Error updating status:", err);
      setError(`Failed to update request: ${err.message}`);
    } finally {
      setUpdating(null);
    }
  };

  const renderSection = (title: string, filter: CollaborationRequest["status"]) => {
    const filtered = requests.filter((r) => r.status === filter);
    return (
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">{title} ({filtered.length})</h2>
        {filtered.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <p className="text-gray-500">No {filter} requests</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((r) => (
              <div key={r.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">{r.requesterName}</h3>
                    <p className="text-gray-600">{r.requesterEmail}</p>
                    {r.requesterCompany && (
                      <p className="text-gray-600 text-sm">{r.requesterCompany}</p>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    r.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    r.status === 'accepted' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {r.projectType && (
                    <div>
                      <span className="font-medium text-gray-700">Project Type:</span>
                      <p className="text-gray-600">{r.projectType}</p>
                    </div>
                  )}
                  {r.timeline && (
                    <div>
                      <span className="font-medium text-gray-700">Timeline:</span>
                      <p className="text-gray-600">{r.timeline}</p>
                    </div>
                  )}
                  {r.budget && (
                    <div>
                      <span className="font-medium text-gray-700">Budget:</span>
                      <p className="text-gray-600">{r.budget}</p>
                    </div>
                  )}
                  {r.requesterSkills && (
                    <div>
                      <span className="font-medium text-gray-700">Skills:</span>
                      <p className="text-gray-600">{r.requesterSkills}</p>
                    </div>
                  )}
                </div>

                {r.description && (
                  <div className="mb-4">
                    <span className="font-medium text-gray-700">Description:</span>
                    <p className="text-gray-600 mt-1">{r.description}</p>
                  </div>
                )}

                <div className="text-xs text-gray-500 mb-4">
                  Received: {new Date(r.createdAt).toLocaleDateString()} at {new Date(r.createdAt).toLocaleTimeString()}
                </div>

                {r.status === "pending" && (
                  <div className="flex space-x-3">
                    <button
                      onClick={() => updateStatus(r.id, "accepted")}
                      disabled={updating === r.id}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {updating === r.id ? "Accepting..." : "Accept"}
                    </button>
                    <button
                      onClick={() => updateStatus(r.id, "rejected")}
                      disabled={updating === r.id}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {updating === r.id ? "Rejecting..." : "Reject"}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-6 bg-gradient-to-br from-indigo-50 to-blue-50 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <span className="ml-3 text-gray-600">Loading collaboration requests...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-indigo-50 to-blue-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Collaboration Requests</h1>
          <p className="text-gray-600">Manage your incoming collaboration requests</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="text-red-700">
                <strong>Error:</strong> {error}
              </div>
              <button 
                onClick={() => setError(null)}
                className="ml-auto text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {renderSection("Pending Requests", "pending")}
        {renderSection("Accepted Requests", "accepted")}
        {renderSection("Rejected Requests", "rejected")}

        {requests.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No collaboration requests yet</h3>
            <p className="text-gray-600">When someone sends you a collaboration request, it will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}