import { useParams } from "wouter";

export default function TestVisitor() {
  const { username } = useParams();
  
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Test Visitor Profile</h1>
        <p className="text-lg">Username from URL: {username}</p>
        <p className="text-sm text-gray-600 mt-4">
          This is a simple test page to verify routing is working for /profile/:username
        </p>
      </div>
    </div>
  );
}