import { AccountNav } from "@/components/account/navbar";
import { getUserSession } from "@/lib/session";
import { redirect } from "next/navigation";

const AccountPage = async () => {
  const session = await getUserSession();

  console.log("session", session);

  // Authentication needs to be as close to the data as possible
  if ("error" in session) {
    redirect("/auth/login");
  }

  return <AccountNav />;
};

export default AccountPage;
