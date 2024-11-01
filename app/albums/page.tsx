"use client";

import AlbumImport from "../(components)/AlbumImport";
import { GET_ALBUMS } from "../(services)/queries";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { gql, useMutation, useQuery } from "@apollo/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const DELETE_ALBUM = gql`
  mutation DeleteAlbum($id: ID!) {
    deleteAlbum(id: $id)
  }
`;

export default function AlbumsPage() {
  const router = useRouter();

  const { loading, error, data, refetch } = useQuery(GET_ALBUMS);
  const [deleteAlbum] = useMutation(DELETE_ALBUM);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  if (loading) return <p className="text-center mt-4">Loading...</p>;
  if (error) {
    console.error("Error loading albums:", error);
    return (
      <p className="text-center mt-4 text-red-600">Error loading albums</p>
    );
  }

  const albums = data.albums.data;

  const handleSelect = (id: string, isSelected: boolean) => {
    setSelectedIds((prev) =>
      isSelected ? [...prev, id] : prev.filter((item) => item !== id)
    );
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      alert("Please select at least one album to delete.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete the selected albums?"
    );

    if (confirmDelete) {
      try {
        await Promise.all(
          selectedIds.map(async (id) => {
            await deleteAlbum({
              variables: { id },
            });
          })
        );
        setSelectedIds([]);
        alert("Albums deleted successfully!");
        await refetch();
      } catch (error) {
        console.error("Error deleting albums:", error);
        alert("Failed to delete albums. Please try again later.");
      }
    }
  };

  const filteredAlbums = albums.filter((album) =>
    album.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full px-4 py-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Albums</h1>
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-4">
          <Button
            onClick={handleBulkDelete}
            className="bg-red-600 text-white hover:bg-red-700 transition"
          >
            Delete Selected Albums
          </Button>
          <Input
            type="text"
            placeholder="Search albums"
            className="p-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Link href="/albums/create">
            <Button className="bg-blue-600 text-white hover:bg-blue-700 transition">
              Create New Album
            </Button>
          </Link>
          <AlbumImport onImportComplete={refetch} />
        </div>
      </div>
      {filteredAlbums.length > 0 ? (
        <DataTable
          data={filteredAlbums}
          onSelect={handleSelect}
          selectedIds={selectedIds}
        />
      ) : (
        <p className="text-center text-gray-500 mt-4">No albums found.</p>
      )}
    </div>
  );
}
