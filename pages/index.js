// pages/index.js
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { useRouter } from "next/router";

// load Dashboard dynamically to avoid circular imports or heavy initial bundle
const Dashboard = dynamic(() => import("./dashboard"), { ssr: false });

export default function Home() {
  // optional: you can still redirect to /login if you want root to be login-only,
  // but since we want instant UI, render dashboard component directly.
  return <Dashboard />;
}
