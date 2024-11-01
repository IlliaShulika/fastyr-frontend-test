"use client";

import { GET_ALBUM } from "@/app/(services)/queries";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useQuery } from "@apollo/client";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

const AlbumDetails = () => {
  const { id } = useParams();
  const router = useRouter();
  const { loading, error, data } = useQuery(GET_ALBUM, {
    variables: { id },
    skip: !id,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const photosPerPage = 15;

  if (loading) return <p className="text-center mt-4">Loading album...</p>;
  if (error) {
    console.error("Error fetching album:", error);
    return <p className="text-center mt-4 text-red-600">Error loading album</p>;
  }

  const { title, photos, user } = data.album;
  const totalPhotos = photos.data.length;
  const totalPages = Math.ceil(totalPhotos / photosPerPage);

  const startIndex = (currentPage - 1) * photosPerPage;
  const endIndex = Math.min(startIndex + photosPerPage, totalPhotos);
  const displayedPhotos = photos.data.slice(startIndex, endIndex);

  return (
    <div className="w-full p-8 space-y-6">
      <Button onClick={() => router.back()} className="mb-6">
        Back
      </Button>

      <h1 className="text-3xl font-bold mb-4">{title}</h1>

      <Card className="mb-6 p-6">
        <h2 className="text-2xl font-semibold mb-2">User Information</h2>
        <p className="text-gray-600">
          <strong>Name:</strong> {user.name}
        </p>
        <p className="text-gray-600">
          <strong>Username:</strong> {user.username}
        </p>
        <p className="text-gray-600">
          <strong>Email:</strong> {user.email}
        </p>
        <p className="text-gray-600">
          <strong>Phone:</strong> {user.phone}
        </p>
        <p className="text-gray-600">
          <strong>Website:</strong>{" "}
          <a
            href={`https://${user.website}`}
            className="text-blue-500"
            target="_blank"
            rel="noopener noreferrer"
          >
            {user.website}
          </a>
        </p>
      </Card>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Photos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedPhotos.map((photo) => (
            <Card
              key={photo.id}
              className="border rounded-lg overflow-hidden shadow-sm"
            >
              <img
                src={photo.thumbnailUrl}
                alt={photo.title}
                className="w-full h-32 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold">{photo.title}</h3>
                <a
                  href={photo.url}
                  className="text-blue-500 text-sm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Full Image
                </a>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center mt-4">
        <Button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        >
          Previous
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          disabled={currentPage === totalPages}
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default AlbumDetails;
