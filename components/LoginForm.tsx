// "use client";

// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { LoginFormData, loginSchema } from "@/zod-schemas/user";
// import { login } from "@/actions/auth";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Alert, AlertDescription } from "@/components/ui/alert";

// export function LoginForm() {
//   const [serverError, setServerError] = useState<string | null>(null);
//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//   } = useForm<LoginFormData>({
//     resolver: zodResolver(loginSchema),
//   });

//   const onSubmit = async (data: LoginFormData) => {
//     setServerError(null);
//     const result = await login(data);
//     if (result.error) {
//       // Handle field-specific errors
//       Object.keys(result.error).forEach((key) => {
//         errors[key as keyof LoginFormData] = {
//           type: "server",
//           message: result.error[key as keyof LoginFormData]?.[0],
//         };
//       });
//     } else if (!result.success) {
//       setServerError("An unexpected error occurred. Please try again.");
//     } else {
//       // Handle successful login (e.g., redirect or update UI)
//       console.log("Logged in successfully", result.user);
//     }
//   };

//   return (
//     <Card className='w-[350px]'>
//       <CardHeader>
//         <CardTitle>Login</CardTitle>
//         <CardDescription>
//           Enter your credentials to access your account
//         </CardDescription>
//       </CardHeader>
//       <form onSubmit={handleSubmit(onSubmit)}>
//         <CardContent className='space-y-4'>
//           <div className='space-y-2'>
//             <Label htmlFor='email'>Email</Label>
//             <Input id='email' type='email' {...register("email")} />
//             {errors.email && (
//               <p className='text-sm text-red-500'>{errors.email.message}</p>
//             )}
//           </div>
//           <div className='space-y-2'>
//             <Label htmlFor='password'>Password</Label>
//             <Input id='password' type='password' {...register("password")} />
//             {errors.password && (
//               <p className='text-sm text-red-500'>{errors.password.message}</p>
//             )}
//           </div>
//         </CardContent>
//         <CardFooter>
//           <Button type='submit' className='w-full' disabled={isSubmitting}>
//             {isSubmitting ? "Logging in..." : "Login"}
//           </Button>
//         </CardFooter>
//       </form>
//       {serverError && (
//         <Alert variant='destructive' className='mt-4'>
//           <AlertDescription>{serverError}</AlertDescription>
//         </Alert>
//       )}
//     </Card>
//   );
// }
