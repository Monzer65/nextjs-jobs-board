"use client";

import { useActionState } from "react";
import { logoutAction } from "@/actions/auth";
import { LogOut } from "lucide-react";

const initialState = {
  message: "",
};

export function LogoutButton() {
  const [, action] = useActionState(logoutAction, initialState);
  return (
    <form action={action} className='w-full h-10 grid place-items-stretch px-2'>
      <button className='flex items-center w-full'>
        <LogOut className='h-4 w-4 mr-4' /> خروج
      </button>
    </form>
  );
}
