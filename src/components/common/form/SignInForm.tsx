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
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { loginValidation } from "@/lib/validations/user-validation";
import Image from "next/image";
import { icons } from "lucide-react";

const SignInForm = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof loginValidation>>({
    resolver: zodResolver(loginValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (values: z.infer<typeof loginValidation>) => {
    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });
      if (result?.error) {
        setError(result.error);
      } else {
        // Redirect to home page
        router.refresh();
        router.push("/");
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
          setError("Something went wrong. Please try again later.");
        }
      }
    }
  };

  const loginWithGoogle = () =>
    signIn("google", {
      callbackUrl: "http://localhost:3000/",
    });

  return (
    <Card className="bg-[#1C1917] w-[400px] h-fit border-none">
      <CardHeader className="space-y-1">
        <CardTitle className="text-[24px] text-center text-light-1">
          Sign In
        </CardTitle>
        {/* <CardDescription>
          Welcome back! Please enter your email to sign in.
        </CardDescription> */}
      </CardHeader>
      <CardContent className="grid gap-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      {/* <FormLabel>Email</FormLabel> */}
                      <FormControl>
                        <Input
                          className="bg-[#262626] h-16 border-none"
                          placeholder="Username"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-2">
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
                          placeholder="Kata Sandi"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="text-2xl">{error}</div>
            <span className="mt-4 h2 block w-1/3 border-t-2"></span>
            <Button className="w-full mt-5" variant="destructive" type="submit">
              Sign In
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
          If you don&apos;t have an account, please&nbsp;
          <Link className="text-blue-500 hover:underline" href="/sign-up">
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default SignInForm;
