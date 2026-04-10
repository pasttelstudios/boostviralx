import { getServerSession } from "next-auth/next";
import { authOptions } from "../../lib/auth";
import { redirect } from "next/navigation";
import prisma from "../../lib/prisma";
import DashboardShell from "./DashboardShell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const isAdmin = (session.user as any)?.role === "ADMIN";
  const userEmail = session.user?.email;
  const userDb = userEmail ? await prisma.user.findUnique({ where: { email: userEmail } }) : null;
  const initialBalance = userDb?.balance || 0;
  const userName = session.user?.name || "Usuario";

  return (
    <DashboardShell 
      isAdmin={isAdmin} 
      initialBalance={initialBalance} 
      userName={userName}
    >
      {children}
    </DashboardShell>
  );
}
