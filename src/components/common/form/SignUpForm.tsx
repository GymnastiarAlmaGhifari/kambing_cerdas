"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { registerValidation } from "@/lib/validations/user-validation";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import Image from "next/image";

const SignUpForm = () => {
  const router = useRouter();
  const pathname = usePathname();

  // state error handler
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof registerValidation>>({
    resolver: zodResolver(registerValidation),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof registerValidation>) => {
    const responseData = {
      email: values.email,
      username: values.username,
      password: values.password,
      pathname: pathname,
    };
    try {
      const response = await axios.post("/api/user", responseData);
      // Cek jika response memiliki properti 'error'
      if (response.data.error) {
        setError(response.data.error);
      } else {
        // Jika tidak ada error, redirect ke halaman sign in
        router.push("/sign-in");
      }
    } catch (error) {
      const errorMessage = error as string;
      if (errorMessage) {
        const { email, password } = JSON.parse(errorMessage);
        if (email) {
          setError(email);
        } else if (password) {
          setError(password);
        } else {
          setError("Something went wrong");
        }
      }
    }
  };

  const loginWithGoogle = () => signIn("google", { callbackUrl: "/" });

  return (
    <Card className="bg-[#1C1917] w-[400px] h-fit border-none">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-[24px] text-center text-light-1">
          Sign Up
        </CardTitle>
        {/* <CardDescription className=''>
          Welcome! Please fill in the information below to create an account.
        </CardDescription> */}
      </CardHeader>
      <CardContent className="grid gap-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    {/* <FormLabel>Username</FormLabel> */}
                    <FormControl>
                      <Input
                        className="bg-[#262626] h-16 border-none"
                        placeholder="johndoe"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    {/* <FormLabel>Email</FormLabel> */}
                    <FormControl>
                      <Input 
                        className="bg-[#262626] h-16 border-none"
                        placeholder="mail@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    {/* <FormLabel>Password</FormLabel> */}
                    <FormControl>
                      <Input
                        className="bg-[#262626] h-16 border-none"
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    {/* <FormLabel>Re-Enter your password</FormLabel> */}
                    <FormControl>
                      <Input
                        className="bg-[#262626] h-16 border-none"
                        placeholder="Re-Enter your password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="text-2xl">{error}</div>
            <span className="mt-4 h2 block w-1/3 border-t-2"></span>
            <Button
              variant={"destructive"}
              className="w-full mt-6"
              type="submit"
            >
              Sign up
            </Button>
          </form>
        </Form>
        <div className="relative flex gap-3 ">
          <span className="mt-4 h2 block w-full border-t-2"></span>
          <span className="block p-1 rounded-md border-2 text-light-1 text-base-regular">
            OR
          </span>
          <span className="mt-4 h2 block w-full border-t-2"></span>
        </div>
        <div className="flex justify-center mt-4">
          {/* <Button variant="outline">
            <Icons.gitHub className="mr-2 h-4 w-4" />
            Github
          </Button> */}
          <Button
            variant="outline"
            className="h-16 w-16 rounded-full"
            onClick={loginWithGoogle}
          >
            {/* <Icons.google className="mr-2 h-4 w-4" /> */}
            {/* Google
             */}
            <Image
              alt=""
              src="/assets/loginGoogle.svg"
              width={200}
              height={200}
            />
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-center text-sm text-gray-600 ">
          If you already have an account, please&nbsp;
          <Link className="text-blue-500 hover:underline" href="/sign-in">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default SignUpForm;

// const response = await fetch('api/user', {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   body: JSON.stringify({
//     username: values.username,
//     email: values.email,
//     password: values.password
//   })
// })

// if (response.ok) {
//   router.push('./sign-in')
// } else {
//   console.log("babbi")
// }
