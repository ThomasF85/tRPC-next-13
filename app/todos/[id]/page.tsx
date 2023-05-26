"use client";

import { trpc as api } from "@/trpc/client/trpc";
import Link from "next/link";

export default function Page({ params: { id } }: { params: { id: string } }) {
  const { data: todo, isLoading, isError, refetch } = api.todo.useQuery(id);
  const { mutate: toggleCompleted } = api.toggleCompleted.useMutation({
    onSuccess: () => refetch(),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>An Error occurred</div>;
  }

  return (
    <>
      <p>{todo?.todo}</p>
      <p>is completed: {todo?.completed ? "YES" : "NO"}</p>
      <button onClick={() => toggleCompleted(id)}>
        {todo?.completed ? "complete" : "uncomplete"}
      </button>
      <Link href="/">Home</Link>
    </>
  );
}
