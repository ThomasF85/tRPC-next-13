import create from "luna-api";

const apiCreator = create({
  url: "http://localhost:3000/api/",
  createContext: (req) => createContextFunc(req),
});

apiCreator.addQueries((ctx) => ({
  getTodos: async () => {
    const todos: Todo[] = await getTodosFunc();
    return todos;
  },
}));

apiCreator.addMutations((ctx) => ({
  addTodo: async (text: string, completed: boolean) => {
    if (!ctx.user) {
      throw new Error("Not logged in!");
    }
    const newTodo: Todo = await addTodoFunc(text, completed);
    return newTodo;
  },
}));

export const [api, connector] = apiCreator.get();
