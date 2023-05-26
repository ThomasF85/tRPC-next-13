import { z } from "zod";
import { procedure, router } from "../trpc";

export const appRouter = router({
  todos: procedure.query(() => todos),
  todo: procedure
    .input(z.string())
    .query(({ input: id }) => todos.find((todo) => todo.id === id)),
  addTodo: procedure.input(z.string()).mutation(({ input: todo }) => {
    const newTodo: Todo = { id: crypto.randomUUID(), todo, completed: false };
    todos.push(newTodo);
    return newTodo;
  }),
  toggleCompleted: procedure.input(z.string()).mutation(({ input: id }) => {
    const todo = todos.find((todo) => todo.id === id);
    if (!todo) {
      throw new Error(`Todo with id ${id} cannot be found!`);
    }
    todo.completed = !todo.completed;
    return todo;
  }),
});

interface Todo {
  id: string;
  todo: string;
  completed: boolean;
}

const todos: Todo[] = [
  {
    id: "1",
    todo: "go for a run",
    completed: false,
  },
  {
    id: "2",
    todo: "buy groceries",
    completed: false,
  },
  {
    id: "3",
    todo: "learn tRPC",
    completed: false,
  },
];

export type AppRouter = typeof appRouter;
