import "server-only";
import { createProtected } from "@/luna-api/create";
import { MiddlewareOptions } from "@/luna-api/types";

interface User {
  id: string;
  name: string;
  isAdmin: boolean;
}

export const [protectedServerApi, protectedConnector] = createProtected({
  getContext: async (): Promise<User | null> => {
    console.log("Gotten context");
    return {
      id: "1",
      name: "Carla",
      isAdmin: false,
    };
  },
  middleware: (options: MiddlewareOptions<User | null>, next: () => any) => {
    console.log("middleware fired: ", options);
    return next();
  },
  queries: {
    getTodos: async (user: User | null) => {
      console.log(user);
      return todos;
    },
    getAnswer: async (user: User | null, x: number) => {
      const answer: Answer = { answer: "answer " + x };
      return answer;
    },
    getNumber: async (user: User | null) => {
      return 42;
    },
  },
  mutations: {
    addTodo: async (user: User | null, text: string, completed: boolean) => {
      const newTodo: Todo = { id: crypto.randomUUID(), text, completed };
      todos.push(newTodo);
      return newTodo;
    },
  },
});

export type ProtectedAPI = typeof protectedServerApi;

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

interface Answer {
  answer: string;
}

const todos: Todo[] = [
  {
    id: "1",
    text: "Todo 1",
    completed: false,
  },
  {
    id: "2",
    text: "Todo 2",
    completed: false,
  },
  {
    id: "3",
    text: "Todo 3",
    completed: false,
  },
  {
    id: "4",
    text: "Todo 4",
    completed: false,
  },
  {
    id: "5",
    text: "Todo 5",
    completed: false,
  },
];
