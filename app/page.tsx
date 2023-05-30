import { serverApi } from "@/luna-test/api";
import Home from "./Home";
import { protectedServerApi } from "@/luna-test/protectedApi";

export default async function Page() {
  const answer = await serverApi.getAnswer(5);
  const todos = await protectedServerApi.getTodos();

  console.log("Server Component: ", answer);
  return <Home answer={answer} />;
}
