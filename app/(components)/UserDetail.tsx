"use client";

import { GET_USER_BY_ID, DELETE_USER } from "../(services)/queries";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useQuery, useMutation } from "@apollo/client";
import { useParams, useRouter } from "next/navigation";
import { useState, useCallback } from "react";

export default function UserDetail() {
  const router = useRouter();
  const { id } = useParams();
  const [showAlert, setShowAlert] = useState(false);

  const { loading, error, data } = useQuery(GET_USER_BY_ID, {
    variables: { id },
  });

  const [deleteUser] = useMutation(DELETE_USER, {
    onCompleted: () => {
      router.push("/users");
    },
    onError: (error) => {
      console.error("Error deleting user:", error);
    },
  });

  const handleDelete = useCallback(() => {
    deleteUser({ variables: { id } });
  }, [deleteUser, id]);

  const handleBack = useCallback(() => router.back(), [router]);
  const handleEdit = useCallback(
    () => router.push(`/users/${id}/edit`),
    [router, id]
  );

  if (loading) return <p className="text-center mt-4">Loading...</p>;
  if (error || !data?.user)
    return (
      <p className="text-center mt-4 text-red-600">
        {error ? "Error loading user data" : "User not found"}
      </p>
    );

  const { user } = data;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="max-w-3xl w-full">
        <Card className="shadow-lg transition-transform duration-300 transform hover:scale-105">
          <CardHeader className="bg-blue-600 p-8 text-white text-center rounded-t-lg shadow-md">
            <CardTitle className="text-4xl font-bold">{user.name}</CardTitle>
            <CardDescription className="text-lg text-white">
              {user.email}
            </CardDescription>
          </CardHeader>

          <CardContent className="p-8 bg-white rounded-b-lg shadow-inner">
            <h2 className="text-3xl font-semibold mb-6">User Details</h2>
            <div className="bg-gray-100 p-6 rounded-md border border-gray-200">
              <h3 className="text-xl font-medium text-gray-700 mb-2">
                Address
              </h3>
              <p>
                {user.address?.street}, {user.address?.suite}
              </p>
              <p>
                {user.address?.city}, {user.address?.zipcode}
              </p>
            </div>
          </CardContent>

          <CardFooter className="p-8 space-y-4 flex flex-col sm:flex-row sm:space-y-0 sm:space-x-4">
            <Button
              onClick={handleBack}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white transition duration-200"
            >
              Go Back
            </Button>
            <Button
              onClick={handleEdit}
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white transition duration-200"
            >
              Update
            </Button>
            <Button
              onClick={() => setShowAlert(true)}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white transition duration-200"
            >
              Delete
            </Button>
          </CardFooter>
        </Card>

        {showAlert && (
          <ConfirmDeleteDialog
            onConfirm={handleDelete}
            onCancel={() => setShowAlert(false)}
          />
        )}
      </div>
    </div>
  );
}

function ConfirmDeleteDialog({ onConfirm, onCancel }) {
  return (
    <AlertDialog open onOpenChange={onCancel}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-semibold">
            Confirm Deletion
          </AlertDialogTitle>
          <p>Are you sure you want to delete this user?</p>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button onClick={onCancel} className="mr-2">
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
