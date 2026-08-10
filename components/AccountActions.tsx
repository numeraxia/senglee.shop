"use client";

import { useRouter } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export function AccountActions() {
  const router = useRouter();

  const handleSignOut = async () => {
    if (!isSupabaseConfigured()) return;
    const supabase = createClient();
    if (supabase) {
      await supabase.auth.signOut();
      router.push("/");
      router.refresh();
    }
  };

  return (
    <button type="button" className="location-btn" onClick={handleSignOut}>
      Sign Out
    </button>
  );
}
