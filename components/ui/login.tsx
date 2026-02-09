"use client";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { loginSchema } from "@/schemas/loginSchema";
import { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";

const formSchema = loginSchema;

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to login");
        setLoading(false);
        return;
      }

      toast.success("Login successful");
      router.refresh();
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader>
        <CardTitle>Welcome Back</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                placeholder="Enter your email"
                {...form.register("email")}
              />
              <FieldError>{form.formState.errors.email?.message}</FieldError>
            </Field>
<Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    {...form.register("password")}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {!showPassword ? (
                      <EyeClosed size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
                <FieldError>
                  {form.formState.errors.password?.message}
                </FieldError>
              </Field>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}
