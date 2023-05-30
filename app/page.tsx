import { serverApi } from "@/luna-test/combinedApi";
import Home from "./Home";

export default async function Page() {
  const answer = await serverApi.getAnswer(5);

  console.log("Server Component: ", answer);
  return <Home answer={answer} />;
}
