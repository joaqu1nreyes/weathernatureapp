"use client";
import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("@farcaster/miniapp-sdk").then(({ sdk }) => {
        sdk.actions.ready();
      });
    }
  }, []);
  return <div>Hello from Farcaster Mini App!</div>;
}

