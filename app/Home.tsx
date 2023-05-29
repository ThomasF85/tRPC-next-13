"use client";

import { api } from "@/luna-test/api";
import styles from "./Home.module.css";
import Link from "next/link";
import { useState } from "react";
import { protectedApi } from "@/luna-test/protectedApi";

export default function Home({
  answer,
  protectedAnswer,
}: {
  answer: any;
  protectedAnswer: any;
}) {
  const { data: todos, isLoading, isError, refetch } = api.getTodos.useQuery();
  const {
    data: protectedTodos,
    isLoading: protectedIsLoading,
    isError: protectedIsError,
  } = protectedApi.getTodos.useQuery();
  const [count, setCount] = useState(1);
  /*const { mutate: addTodo } = api.addTodo.useMutation({
    onSuccess: () => refetch(),
  });*/

  if (isLoading || protectedIsLoading) {
    return <div>Loading...</div>;
  }

  if (isError || protectedIsError) {
    return <div>An Error occurred</div>;
  }

  return (
    <>
      <TodoList todos={todos} />
      <TodoList todos={protectedTodos} />
      <p>Count: {count}</p>
      <button onClick={() => setCount((prev) => prev + 1)}>inc</button>
    </>
  );
}

function TodoList({ todos }: { todos: any }) {
  return (
    <>
      <ul className={styles.list}>
        {todos?.map((todo: any) => (
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
