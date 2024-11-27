"use client";
import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

export default function SubmitButton({
  text,
  Icon,
}: {
  text: string;
  Icon?: React.ReactNode;
}) {
  const { pending } = useFormStatus();
  return (
    <Button
      type='submit'
      className={`w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 ${
        pending ? "opacity-75" : "opacity-100"
      }`}
      disabled={pending}
    >
      {pending ? <Loader2 className='ml-2 h-4 w-4 animate-spin' /> : Icon}
      {text}
    </Button>
  );
}
