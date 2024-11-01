"use client";

import { CREATE_ALBUM } from "@/app/(services)/queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AddAlbumPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const mockUserId = "mocked-user-id";

  const [createAlbum] = useMutation(CREATE_ALBUM, {
    onCompleted: () => {
      alert("Album created successfully!");
      router.push("/albums");
    },
    onError: (error) => {
      console.error("Error creating album:", error);
      setErrorMessage("Failed to create album. Please try again later.");
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    if (!title) {
      setErrorMessage("Title is required.");
      setLoading(false);
      return;
    }

    try {
      await createAlbum({
        variables: {
          input: {
            userId: mockUserId,
            title,
          },
        },
      });
    } catch (error) {
      console.error("Error during album creation:", error);
      setLoading(false);
    }
  };

  return (
    <div className="w-full px-4 py-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Add New Album</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMessage && <div className="text-red-600">{errorMessage}</div>}
        <Input
          type="text"
          placeholder="Album Title"
          className="p-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-500"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <Textarea
          placeholder="Album Description"
          className="p-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-500"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="flex justify-end">
          <Button
            type="submit"
            className={`bg-blue-600 text-white hover:bg-blue-700 transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Album"}
          </Button>
        </div>
      </form>
    </div>
  );
}
