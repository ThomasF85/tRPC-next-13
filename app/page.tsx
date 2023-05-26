"use client";

import { trpc as api } from "@/trpc/client/trpc";
import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  const { data: todos, isLoading, isError, refetch } = api.todos.useQuery();
  const { mutate: addTodo } = api.addTodo.useMutation({
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
      <ul className={styles.list}>
        {todos?.map((todo) => (
          <li className={styles.listitem} key={todo.id}>
            <Link className={styles.link} href={`/todos/${todo.id}`}>
              {todo.todo}
            </Link>
          </li>
        ))}
      </ul>
      <form
        className={styles.form}
        onSubmit={(event) => {
          event.preventDefault();
          addTodo(event.target.elements.todo.value);
        }}
      >
        <label>
          Todo:
          <input type="text" name="todo" />
        </label>
        <button>add Todo</button>
      </form>
    </>
  );
}
