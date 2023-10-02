import Link from "next/link";
import { userService } from "services";
import { Layout } from "../components/users";

export default Home;

function Home() {
  return (
    <Layout>
      <h1>Hi {userService.userValue?.firstName}!</h1>
      <p>You&apos;re logged in with Next.js & JWT!!</p>
      <p>
        <Link href="/users">Manage Users</Link>
      </p>
    </Layout>
  );
}
