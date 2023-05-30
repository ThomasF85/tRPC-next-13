"use client";

import styles from "./Home.module.css";
import Link from "next/link";
import { useState } from "react";
import { api } from "@/luna-test/clientApi";

export default function Home({ answer }: { answer: any }) {
  const { data: todos, isLoading, error, mutate } = api.getTodos.useQuery();
  const [count, setCount] = useState(1);
  const { mutate: addTodo } = api.addTodo.useMutation({
    onSuccess: () => mutate(),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>An Error occurred</div>;
  }

  return (
    <>
      <TodoList todos={todos} addTodo={addTodo} />
      <p>Count: {count}</p>
      <button onClick={() => setCount((prev) => prev + 1)}>inc</button>
    </>
  );
}

function TodoList({ todos, addTodo }: { todos: any; addTodo: any }) {
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
          addTodo(event.target.elements.todo.value, false);
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
