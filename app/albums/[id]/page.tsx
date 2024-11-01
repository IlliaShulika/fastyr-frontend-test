"use client";

import { GET_ALBUM } from "@/app/(services)/queries";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Album, Photo, User } from "@/types";
import { useQuery } from "@apollo/client";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";

const PHOTOS_PER_PAGE = 15;

interface PhotoGridProps {
  photos: Photo[];
}

interface UserInfoCardProps {
  user: User;
}

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

const PhotoGrid: React.FC<PhotoGridProps> = React.memo(({ photos }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {photos.map((photo) => (
      <PhotoCard key={photo.id} photo={photo} />
    ))}
  </div>
));

const PhotoCard: React.FC<{ photo: Photo }> = React.memo(({ photo }) => (
  <Card className="group border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
    <div className="relative w-full aspect-square overflow-hidden">
      <Image
        src={photo.thumbnailUrl}
        alt={photo.title}
        fill
        className="object-cover group-hover:scale-110 transition-transform duration-300"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        placeholder="blur"
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
      />
    </div>
    <div className="p-4">
      <h3 className="font-semibold text-sm truncate mb-2">{photo.title}</h3>
      <a
        href={photo.url}
        className="text-blue-500 text-xs hover:underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        View Full Image
      </a>
    </div>
  </Card>
));

const UserInfoCard: React.FC<UserInfoCardProps> = React.memo(({ user }) => {
  const userDetails = [
    { label: "Name", value: user.name },
    { label: "Username", value: user.username },
    { label: "Email", value: user.email },
    { label: "Phone", value: user.phone },
    {
      label: "Website",
      value: (
        <a
          href={`https://${user.website}`}
          className="text-blue-500 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {user.website}
        </a>
      ),
    },
  ];

  return (
    <Card className="mb-6 p-6 space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800">User Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-600">
        {userDetails.map(({ label, value }) => (
          <div key={label} className="flex flex-col">
            <span className="text-xs font-medium text-gray-500 uppercase">
              {label}
            </span>
            <span>{value}</span>
          </div>
        ))}
      </div>
    </Card>
  );
});

const PaginationControls: React.FC<PaginationControlsProps> = React.memo(
  ({ currentPage, totalPages, onPreviousPage, onNextPage }) => (
    <div className="flex justify-between items-center mt-6 p-4 bg-gray-50 rounded-lg">
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === 1}
        onClick={onPreviousPage}
      >
        Previous
      </Button>
      <span className="text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === totalPages}
        onClick={onNextPage}
      >
        Next
      </Button>
    </div>
  )
);

const PageLoader: React.FC = () => (
  <div className="container mx-auto px-4 py-8">
    <div className="space-y-6">
      <Skeleton className="h-12 w-1/2" />
      <Skeleton className="h-64 w-full" />
      <div className="grid grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-64 w-full" />
        ))}
      </div>
    </div>
  </div>
);

const ErrorDisplay: React.FC<{ error: any }> = ({ error }) => {
  console.error("Error fetching album:", error);
  return (
    <div className="flex flex-col justify-center items-center min-h-screen text-center p-4">
      <h2 className="text-2xl font-bold text-red-600 mb-4">
        Oops! Something went wrong
      </h2>
      <p className="text-gray-600 mb-6">
        We couldn't load the album at this time. Please try again later.
      </p>
      <Button variant="outline" onClick={() => window.location.reload()}>
        Retry
      </Button>
    </div>
  );
};

const NotFoundDisplay: React.FC = () => (
  <div className="flex flex-col justify-center items-center min-h-screen text-center p-4">
    <h2 className="text-2xl font-bold text-gray-600 mb-4">Album Not Found</h2>
    <p className="text-gray-500 mb-6">
      The album you are looking for does not exist or has been removed.
    </p>
    <Button variant="outline" onClick={() => window.history.back()}>
      Go Back
    </Button>
  </div>
);

export default function AlbumDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);

  const { loading, error, data } = useQuery<{ album: Album }>(GET_ALBUM, {
    variables: { id },
    skip: !id,
    errorPolicy: "all",
  });

  const { totalPages, displayedPhotos } = useMemo(() => {
    if (!data?.album) return { totalPages: 0, displayedPhotos: [] };

    const photos = data.album.photos.data;
    const totalPages = Math.ceil(photos.length / PHOTOS_PER_PAGE);
    const startIndex = (currentPage - 1) * PHOTOS_PER_PAGE;
    const endIndex = Math.min(startIndex + PHOTOS_PER_PAGE, photos.length);

    return {
      totalPages,
      displayedPhotos: photos.slice(startIndex, endIndex),
    };
  }, [data, currentPage]);

  if (loading) return <PageLoader />;
  if (error) return <ErrorDisplay error={error} />;
  if (!data?.album) return <NotFoundDisplay />;

  const { title, user, photos } = data.album;

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 space-y-6">
      <Button
        variant="outline"
        size="sm"
        onClick={() => router.back()}
        className="mb-4"
      >
        Back to Albums
      </Button>

      <header className="mb-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-600">
          {photos.data.length} Photos in this Album
        </p>
      </header>

      <UserInfoCard user={user} />

      <section>
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Photos</h2>
        <PhotoGrid photos={displayedPhotos} />
      </section>

      {totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPreviousPage={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          onNextPage={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
        />
      )}
    </div>
  );
}
