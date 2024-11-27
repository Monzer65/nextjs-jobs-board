"use client";

import { useRouter } from "next/navigation";
import { ButtonHTMLAttributes } from "react";
import { Button } from "./ui/button";

type props = {
  title: string;
  className?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | null
    | undefined;
} & ButtonHTMLAttributes<HTMLButtonElement>;
export default function BackButton({
  title,
  className,
  variant,
  ...props
}: props) {
  const router = useRouter();

  return (
    <Button
      className={className}
      variant={variant}
      onClick={() => router.back()}
    >
      {title}
    </Button>
  );
}
