"use client";

import { CREATE_USER } from "@/app/(services)/queries";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateUser() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
  });
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [createUser, { loading }] = useMutation(CREATE_USER, {
    onCompleted: () => {
      setAlert({ type: "success", message: "User created successfully!" });
      setTimeout(() => {
        router.push("/users");
      }, 1500);
    },
    onError: (error) => {
      setAlert({ type: "error", message: error.message });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { name, email, username } = formData;

    if (name && email && username) {
      createUser({
        variables: { input: formData },
      });
    } else {
      setAlert({ type: "error", message: "Please fill in all fields" });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">Create New User</h1>

        {alert.message && (
          <Alert
            variant={alert.type === "success" ? "success" : "destructive"}
            className="mb-4"
          >
            {alert.message}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter name"
              required
              className="mt-1"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              required
              className="mt-1"
            />
          </div>

          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <Input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter username"
              required
              className="mt-1"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create User"}
          </Button>
        </form>
      </div>
    </div>
  );
}
