"use client";

import { GET_USER_BY_ID, UPDATE_USER } from "../../../(services)/queries";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation } from "@apollo/client";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const zipCodePattern = /^[0-9]{5}(-[0-9]{4})?$/;

const userSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters")
    .required("Name is required"),

  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),

  street: yup.string().trim().max(100, "Street must not exceed 100 characters"),

  suite: yup.string().trim().max(50, "Suite must not exceed 50 characters"),

  city: yup
    .string()
    .trim()
    .min(2, "City must be at least 2 characters")
    .max(50, "City must not exceed 50 characters"),

  zipcode: yup
    .string()
    .matches(zipCodePattern, "Invalid zip code format")
    .required("Zip Code is required"),
});

export default function EditUser() {
  const router = useRouter();
  const { id } = useParams();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(userSchema),
  });

  const { loading, error, data } = useQuery(GET_USER_BY_ID, {
    variables: { id },
  });

  const [updateUser] = useMutation(UPDATE_USER, {
    onCompleted: () => {
      router.push(`/users/${id}`);
    },
    onError: (error) => {
      console.error("Error updating user:", error);
    },
  });

  const onSubmit = async (values) => {
    const { street, suite, city, zipcode, ...rest } = values;

    const input = {
      ...rest,
      address: {
        street,
        suite,
        city,
        zipcode,
      },
    };

    try {
      await updateUser({
        variables: {
          id,
          input,
        },
      });
      router.push(`/users/${id}`);
    } catch (error) {
      console.error("Submission error:", {
        message: error.message,
        stack: error.stack,
        input,
      });
    }
  };

  if (loading) return <p className="text-center mt-4">Loading...</p>;
  if (error) {
    console.error("Error loading user data:", error);
    return (
      <p className="text-center mt-4 text-red-600">Error loading user data</p>
    );
  }

  const user = data.user;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="max-w-3xl w-full">
        <Card className="shadow-lg">
          <CardHeader className="bg-blue-600 p-8 text-white text-center rounded-t-lg shadow-md">
            <CardTitle className="text-4xl font-bold">Edit User</CardTitle>
          </CardHeader>

          <CardContent className="p-8 bg-white rounded-b-lg shadow-inner">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="text-lg font-medium">Name</label>
                <Input
                  {...register("name")}
                  defaultValue={user.name}
                  placeholder="Enter name"
                />
                {errors.name && (
                  <p className="text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="text-lg font-medium">Email</label>
                <Input
                  {...register("email")}
                  defaultValue={user.email}
                  placeholder="Enter email"
                />
                {errors.email && (
                  <p className="text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-lg font-medium">Street</label>
                  <Input
                    {...register("street")}
                    defaultValue={user.address?.street}
                    placeholder="Enter street"
                  />
                  {errors.street && (
                    <p className="text-red-500">{errors.street.message}</p>
                  )}
                </div>

                <div>
                  <label className="text-lg font-medium">Suite</label>
                  <Input
                    {...register("suite")}
                    defaultValue={user.address?.suite}
                    placeholder="Enter suite"
                  />
                  {errors.suite && (
                    <p className="text-red-500">{errors.suite.message}</p>
                  )}
                </div>

                <div>
                  <label className="text-lg font-medium">City</label>
                  <Input
                    {...register("city")}
                    defaultValue={user.address?.city}
                    placeholder="Enter city"
                  />
                  {errors.city && (
                    <p className="text-red-500">{errors.city.message}</p>
                  )}
                </div>

                <div>
                  <label className="text-lg font-medium">Zip Code</label>
                  <Input
                    {...register("zipcode")}
                    defaultValue={user.address?.zipcode}
                    placeholder="Enter zip code"
                  />
                  {errors.zipcode && (
                    <p className="text-red-500">{errors.zipcode.message}</p>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white transition duration-200"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="p-8">
            <Button
              onClick={() => router.back()}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white transition duration-200"
            >
              Cancel
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
