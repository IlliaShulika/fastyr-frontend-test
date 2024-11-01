"use client";

import AlbumImport from "../(components)/AlbumImport";
import { DELETE_ALBUM, GET_ALBUMS } from "../(services)/queries";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Album } from "@/types";
import { useQuery, useMutation } from "@apollo/client";
import Link from "next/link";
import React, { useMemo, useState, useCallback } from "react";

const filterAlbums = (albums: Album[], searchQuery: string) =>
  albums.filter((album) =>
    album.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

const AlbumsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { loading, error, data, refetch } = useQuery(GET_ALBUMS, {
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  const [deleteAlbum, { loading: isDeleting }] = useMutation(DELETE_ALBUM, {
    onCompleted: () => {
      toast({
        title: "Albums Deleted",
        description: "Selected albums were successfully removed.",
        variant: "success",
      });
      setSelectedIds([]);
      refetch();
    },
    onError: (error) => {
      toast({
        title: "Deletion Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const filteredAlbums = useMemo(
    () => (data ? filterAlbums(data.albums.data, searchQuery) : []),
    [data, searchQuery]
  );

  const handleSelect = useCallback((id: string, isSelected: boolean) => {
    setSelectedIds((prev) =>
      isSelected ? [...prev, id] : prev.filter((item) => item !== id)
    );
  }, []);

  const handleBulkDelete = useCallback(async () => {
    if (selectedIds.length === 0) {
      toast({
        title: "No Albums Selected",
        description: "Please select at least one album to delete.",
        variant: "outline",
      });
      return;
    }

    try {
      await Promise.all(
        selectedIds.map((id) => deleteAlbum({ variables: { id } }))
      );
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Bulk delete error:", error);
    }
  }, [selectedIds, deleteAlbum]);

  if (loading) return <PageLoader />;
  if (error) return <ErrorDisplay error={error} />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Albums</h1>

        <div className="flex items-center space-x-4">
          <Link href="/albums/create">
            <Button variant="outline">Create New Album</Button>
          </Link>
          <AlbumImport onImportComplete={refetch} />
        </div>
      </div>

      <div className="flex space-x-4 mb-4">
        <Input
          placeholder="Search albums"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-grow"
        />

        <BulkDeleteButton
          selectedCount={selectedIds.length}
          onDelete={() => setIsDeleteDialogOpen(true)}
        />
      </div>

      {filteredAlbums.length > 0 ? (
        <DataTable
          data={filteredAlbums}
          onSelect={handleSelect}
          selectedIds={selectedIds}
        />
      ) : (
        <NoAlbumsMessage />
      )}

      <BulkDeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleBulkDelete}
        selectedCount={selectedIds.length}
        isDeleting={isDeleting}
      />
    </div>
  );
};

const PageLoader: React.FC = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500" />
  </div>
);

const ErrorDisplay: React.FC<{ error: any }> = ({ error }) => (
  <div className="flex justify-center items-center h-screen text-red-600">
    <div className="text-center">
      <p className="text-2xl mb-4">Error Loading Albums</p>
      <p className="text-sm">{error.message}</p>
    </div>
  </div>
);

const BulkDeleteButton: React.FC<{
  selectedCount: number;
  onDelete: () => void;
}> = ({ selectedCount, onDelete }) => (
  <Button
    variant="destructive"
    onClick={onDelete}
    disabled={selectedCount === 0}
  >
    Delete {selectedCount > 0 ? `(${selectedCount})` : ""} Albums
  </Button>
);

const BulkDeleteConfirmDialog: React.FC<{
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  selectedCount: number;
  isDeleting: boolean;
}> = ({ isOpen, onOpenChange, onConfirm, selectedCount, isDeleting }) => (
  <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Delete Albums</AlertDialogTitle>
        <AlertDialogDescription>
          Are you sure you want to delete {selectedCount} album(s)? This action
          cannot be undone.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={onConfirm} disabled={isDeleting}>
          {isDeleting ? "Deleting..." : "Confirm Delete"}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

const NoAlbumsMessage: React.FC = () => (
  <div className="text-center py-8 bg-gray-50 rounded-lg">
    <p className="text-gray-600 mb-4">No albums found.</p>
    <Link href="/albums/create">
      <Button variant="outline">Create Your First Album</Button>
    </Link>
  </div>
);

export default AlbumsPage;
