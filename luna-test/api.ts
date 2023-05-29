import "server-only";
import { create } from "@/luna-api/create";

export const [serverApi, connector] = create({
  queries: {
    getTodos: async () => {
      console.log("hihi43");
      return todos;
    },
    getAnswer: async (x: number) => {
      const answer: Answer = { answer: "answer " + x };
      return answer;
    },
    getNumber: async () => {
      return 42;
    },
  },
  mutations: {
    addTodo: async (text: string, completed: boolean) => {
      const newTodo: Todo = { id: crypto.randomUUID(), text, completed };
      todos.push(newTodo);
      return newTodo;
    },
  },
});

export type API = typeof serverApi;

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
