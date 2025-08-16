import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import VoiceRecorder from "@/components/audio/VoiceRecorder";

type ProfileFormData = {
  welcomeMessage: string;
};

export default function ProfilePage() {
  const [messageType, setMessageType] = useState<"text" | "voice">("text");

  const form = useForm<ProfileFormData>({
    defaultValues: {
      welcomeMessage: "",
    },
  });

  const handleSave = (data: ProfileFormData) => {
    console.log("Form data:", data);
    // TODO: Save via API call if needed
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Welcome Message</h2>

      <div className="flex gap-4 mb-4">
        <Button
          variant={messageType === "text" ? "default" : "outline"}
          onClick={() => setMessageType("text")}
        >
          Text
        </Button>
        <Button
          variant={messageType === "voice" ? "default" : "outline"}
          onClick={() => setMessageType("voice")}
        >
          Voice
        </Button>
      </div>

      {messageType === "text" ? (
        <Textarea
          placeholder="Type your welcome message..."
          {...form.register("welcomeMessage")}
        />
      ) : (
        <VoiceRecorder
          initialAudio={form.getValues("welcomeMessage")}
          onRecordingComplete={(base64: string, _blob: Blob) => {
            form.setValue("welcomeMessage", base64);
          }}
        />
      )}

      <div className="mt-6">
        <Button onClick={form.handleSubmit(handleSave)}>Save Profile</Button>
      </div>
    </div>
  );
}
