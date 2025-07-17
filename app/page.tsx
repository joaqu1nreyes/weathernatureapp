"use client";
import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    console.log("Hello from useEffect");
  }, []);
  return <div>Hello from Farcaster Mini App!</div>;
}

