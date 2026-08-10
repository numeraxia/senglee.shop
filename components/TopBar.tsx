import { getSiteSettings } from "@/lib/site-settings";

export async function TopBar() {
  const settings = await getSiteSettings();

  return (
    <div className="top-bar">
      <p>{settings.top_bar_message}</p>
    </div>
  );
}
