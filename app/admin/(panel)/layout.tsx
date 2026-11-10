import { redirect } from "next/navigation";
import { auth } from "@/auth";
import Sidebar from "@/components/common/sidebar";

export const instant = false;

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-full flex-1 flex-col md:flex-row">
      <Sidebar />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
