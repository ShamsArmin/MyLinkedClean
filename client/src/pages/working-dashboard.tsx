import React from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SpotlightCard } from "@/components/spotlight-card";

export default function WorkingDashboard() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  return (
    <div className="container p-4">
      <h1 className="text-2xl font-bold mb-6">Welcome, {user?.name || "User"}</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>My Links</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Manage your social media links here.</p>
            <Button onClick={() => {}}>
              Add Link
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">View and edit your profile.</p>
            <Button onClick={() => navigate("/profile")}>
              Edit Profile
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">View your profile analytics.</p>
            <Button onClick={() => navigate("/analytics")}>
              View Analytics
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Social Score</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Improve your social presence.</p>
            <Button onClick={() => navigate("/social-score")}>
              Check Score
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Spotlight Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <SpotlightCard />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Manage your account settings.</p>
            <Button onClick={() => navigate("/settings")}>
              Open Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}