import { serverApi } from "@/luna-test/api";
import Home from "./Home";
import { protectedServerApi } from "@/luna-test/protectedServerApi";

export default async function Page() {
  const answer = await serverApi.getAnswer(5);
  const protectedAnswer = await protectedServerApi.getAnswer(5);
  console.log("Server Component: ", answer, protectedAnswer);
  return <Home answer={answer} protectedAnswer={protectedAnswer} />;
}
