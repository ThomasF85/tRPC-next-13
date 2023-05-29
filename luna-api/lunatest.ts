import { create } from "./create";

export const [api, serverApi, connector] = create({
  url: "http://localhost:3000/api",
  queries: {
    getTodos: async () => {
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

/*
api.getTodos.useQuery;
const queryResult = api.getAnswer.useQuery(6);
const answer = queryResult.data;
const a = api.addTodo.useMutation();
const b = a.data;
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
