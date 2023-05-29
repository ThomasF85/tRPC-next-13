"use client";

import styles from "./page.module.css";
import Link from "next/link";
import { api } from "@/luna-api/lunatest";
import { useState } from "react";

export default function Home() {
  const { data: todos, isLoading, isError, refetch } = api.getTodos.useQuery();
  const [a, setA] = useState(1);
  /*const { mutate: addTodo } = api.addTodo.useMutation({
    onSuccess: () => refetch(),
  });*/

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
              {todo.text}
            </Link>
          </li>
        ))}
      </ul>
      <form
        className={styles.form}
        onSubmit={(event: any) => {
          event.preventDefault();
          setA((prev) => prev + 1);
          //addTodo(event.target.elements.todo.value);
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
