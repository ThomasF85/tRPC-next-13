import { createProtected } from "@/luna-api/createProtected";

export const [protectedApi, createServerApi] = createProtected({
  url: "http://localhost:3000/api/protected",
  queries: {
    getTodos: async (ctx: any) => {
      return [ctx, ...todos];
    },
    getAnswer: async (ctx: any, x: number) => {
      const answer: Answer & { ctx: any } = {
        answer: "answer " + x,
        ctx,
      };
      return answer;
    },
    getNumber: async (ctx: any) => {
      return 42;
    },
  },
  mutations: {
    addTodo: async (ctx: any, text: string, completed: boolean) => {
      const newTodo: Todo = { id: crypto.randomUUID(), text, completed };
      todos.push(newTodo);
      return newTodo;
    },
  },
});

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
    text: "Protected Todo 1",
    completed: false,
  },
  {
    id: "2",
    text: "Protected Todo 2",
    completed: false,
  },
  {
    id: "3",
    text: "Protected Todo 3",
    completed: false,
  },
  {
    id: "4",
    text: "Protected Todo 4",
    completed: false,
  },
  {
    id: "5",
    text: "Protected Todo 5",
    completed: false,
  },
];
