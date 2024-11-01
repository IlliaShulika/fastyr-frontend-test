"use client";

import { GET_USERS } from "../(services)/queries";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useQuery } from "@apollo/client";
import Link from "next/link";

interface User {
  id: string;
  name: string;
  email: string;
}

export default function UserList() {
  const { loading, error, data } = useQuery<{ users: { data: User[] } }>(
    GET_USERS
  );

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  if (!data?.users?.data?.length) return <EmptyState />;

  return (
    <div className="p-6 min-h-screen max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">User List</h1>
        <Link href="/users/create">
          <Button
            variant="default"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Create New User
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.users.data.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <p className="text-gray-600 text-lg">Loading users...</p>
    </div>
  );
}

function ErrorState({ error }: { error: Error }) {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <p className="text-red-600 text-lg">
        Error loading users: {error.message}
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex justify-center items-center min-h-screen flex-col text-center">
      <p className="text-gray-600 text-lg mb-4">No users found</p>
      <Link href="/users/create">
        <Button variant="default">Create First User</Button>
      </Link>
    </div>
  );
}

function UserCard({ user }: { user: User }) {
  return (
    <Link href={`/users/${user.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader>
          <CardTitle className="font-semibold text-lg">{user.name}</CardTitle>
          <CardDescription>{user.email}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">Click to view details</p>
        </CardContent>
      </Card>
    </Link>
  );
}
