import { api } from "./lunatest";

api.addTodo("asd", false).then((todo) => console.log(todo));
api.getTodos().then((todos) => console.log(todos));
