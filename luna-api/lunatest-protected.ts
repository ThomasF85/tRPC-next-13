import { createProtected } from "./createProtected";

export const [protectedApi, createServerApi] = createProtected({
  url: "http://localhost:3000/api/protected",
  queries: {
    getTodos: async (ctx: any) => {
      return todos;
    },
    getAnswer: async (ctx: any, x: number) => {
      const answer: Answer = { answer: "answer " + x };
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

/*
serverApi.getTodos();
*/

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
    text: "cook",
    completed: false,
  },
];
