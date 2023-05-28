import { useQuery } from "@tanstack/react-query";
import { create } from "./luna";

export const [api, serverApi, connector] = create({
  url: "http://localhost:3000/api/",
  createContext: async (req) => ({ user: { name: "Mario", isAdmin: true } }),
  queries: (ctx) => ({
    getTodos: async () => {
      return todos;
    },
    getAnswer: async (x: number) => {
      const answer: Answer = { answer: "answer " + x };
      return answer;
    },
  }),
  mutations: (ctx) => ({
    addTodo: async (text: string, completed: boolean) => {
      if (!ctx.user) {
        throw new Error("Not logged in!");
      }
      const newTodo: Todo = { id: crypto.randomUUID(), text, completed };
      todos.push(newTodo);
      return newTodo;
    },
  }),
});

api.getTodos.useQuery;
const queryResult = api.getAnswer.useQuery(6);
const answer = queryResult.data;
const a = api.addTodo.useMutation();
const b = a.data;

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

interface Answer {
  answer: string;
}

const todos: Todo[] = [];
