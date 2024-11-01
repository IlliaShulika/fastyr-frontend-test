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

export default function UserList() {
  const { loading, error, data } = useQuery(GET_USERS);

  if (loading) return <p className="text-center mt-4">Loading...</p>;
  if (error)
    return <p className="text-center mt-4 text-red-600">Error loading users</p>;

  return (
    <div className="p-6 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">User List</h1>
        <Link href="/users/create">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            Create New User
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.users.data.map((user) => (
          <Link href={`/users/${user.id}`} key={user.id}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="font-semibold text-lg">
                  {user.name}
                </CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Click to view details</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
