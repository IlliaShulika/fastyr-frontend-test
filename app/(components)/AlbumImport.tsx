"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertCircle, Upload, X } from "lucide-react";
import React, { useState } from "react";
import * as XLSX from "xlsx";

interface ImportedAlbum {
  title: string;
  artist: string;
  year: string;
  genre: string;
  isValid: boolean;
  errors: string[];
}

interface AlbumImportProps {
  onImportComplete: () => void;
}

const AlbumImport = ({ onImportComplete }: AlbumImportProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [importedData, setImportedData] = useState<ImportedAlbum[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"upload" | "preview" | "processing">(
    "upload"
  );

  const validateAlbum = (album: any): ImportedAlbum => {
    const errors: string[] = [];

    if (!album.title || typeof album.title !== "string") {
      errors.push("Title is required and must be text");
    }
    if (!album.artist || typeof album.artist !== "string") {
      errors.push("Artist is required and must be text");
    }
    if (album.year) {
      const yearNum = parseInt(album.year);
      if (
        isNaN(yearNum) ||
        yearNum < 1900 ||
        yearNum > new Date().getFullYear()
      ) {
        errors.push("Year must be between 1900 and current year");
      }
    }
    if (album.genre && typeof album.genre !== "string") {
      errors.push("Genre must be text");
    }

    return {
      ...album,
      isValid: errors.length === 0,
      errors,
    };
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const workbook = XLSX.read(e.target?.result, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet);

        const validatedData = data.map(validateAlbum);
        setImportedData(validatedData);
        setStep("preview");
      } catch (error) {
        console.error("Error reading file:", error);
        alert(
          "Error reading file. Please make sure it's a valid CSV or XLSX file."
        );
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleRowRemove = (index: number) => {
    setImportedData((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCellEdit = (
    index: number,
    field: keyof ImportedAlbum,
    value: string
  ) => {
    setImportedData((prev) => {
      const newData = [...prev];
      newData[index] = {
        ...newData[index],
        [field]: value,
      };
      newData[index] = validateAlbum(newData[index]);
      return newData;
    });
  };

  const handleImport = async () => {
    setIsLoading(true);
    setStep("processing");

    try {
      const validData = importedData.filter((album) => album.isValid);

      setIsOpen(false);
      onImportComplete();
      alert(`Successfully imported ${validData.length} albums`);
    } catch (error) {
      console.error("Error importing albums:", error);
      alert("Error importing albums. Please try again.");
    } finally {
      setIsLoading(false);
      setStep("upload");
      setImportedData([]);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-green-600 text-white hover:bg-green-700 transition"
      >
        <Upload className="w-4 h-4 mr-2" /> Import Albums
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Import Albums</DialogTitle>
          </DialogHeader>

          {step === "upload" && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Upload a CSV or XLSX file with the following columns: title,
                artist, year, genre
              </p>
              <Input
                type="file"
                accept=".csv,.xlsx"
                onChange={handleFileUpload}
                className="w-full"
              />
            </div>
          )}

          {step === "preview" && (
            <div className="max-h-[60vh] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Artist</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Genre</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {importedData.map((album, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Input
                          value={album.title}
                          onChange={(e) =>
                            handleCellEdit(index, "title", e.target.value)
                          }
                          className={
                            album.errors.includes(
                              "Title is required and must be text"
                            )
                              ? "border-red-500"
                              : ""
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={album.artist}
                          onChange={(e) =>
                            handleCellEdit(index, "artist", e.target.value)
                          }
                          className={
                            album.errors.includes(
                              "Artist is required and must be text"
                            )
                              ? "border-red-500"
                              : ""
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={album.year}
                          onChange={(e) =>
                            handleCellEdit(index, "year", e.target.value)
                          }
                          className={
                            album.errors.includes(
                              "Year must be between 1900 and current year"
                            )
                              ? "border-red-500"
                              : ""
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={album.genre}
                          onChange={(e) =>
                            handleCellEdit(index, "genre", e.target.value)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        {!album.isValid && (
                          <div className="flex items-center text-red-500">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            <span className="text-xs">{album.errors[0]}</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRowRemove(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <DialogFooter>
            {step === "preview" && (
              <div className="flex justify-between w-full">
                <p className="text-sm text-gray-500">
                  {importedData.filter((a) => a.isValid).length} of{" "}
                  {importedData.length} albums are valid
                </p>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setStep("upload");
                      setImportedData([]);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleImport}
                    disabled={
                      importedData.filter((a) => a.isValid).length === 0 ||
                      isLoading
                    }
                  >
                    {isLoading ? "Importing..." : "Import Albums"}
                  </Button>
                </div>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AlbumImport;
