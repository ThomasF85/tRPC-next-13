# typed-api

## create a typed api

```ts
import create from ‘typed-api’;

export const [api, connector] = create({
  getItems: async () => {
    const items: Item[] = await getItemsFunc();
    return items;
  },
  getItem: async (id: string) => {
    const item: Item = await getItemFunc(id);
    return item;
  },
  addItem: async (todo: string, completed: boolean) => {
    const newItem: Item = await addItemFunc(todo, completed);
    return newItem;
  }
}, ‘http://localhost:3000/api/’);
```

## connect your api

Example for api in `app/api/route.ts`:

```ts
import { connector } from ‘@/lib/typed-api’;

export const {connector as GET, connector as POST}
```

## use the typed api in client components

```ts
‘use client’;

import { api } from ‘@/lib/typed-api’;

export default function Component() {
  const { data, isLoading, isError } = api.getItems.useQuery();

  return …
}
```

## use the typed api in server components

```ts
import { api } from ‘@/lib/typed-api’;

export default async function Component() {
  const items = await api.getItems();

  return …
}
```

```ts
import create from ‘typed-api’;

export const [api, connector] = create(ctx => ({
  getItems: createQuery(async () => {
    const items: Item[] = await getItemsFunc();
    return items;
  }),
  addItem: createMutation(async (todo: string, completed: boolean) => {
    if (!ctx.user) {
      throw new Error(“You have to be logged in to add items”);
    }
    const newItem: Item = await addItemFunc(todo, completed);
    return newItem;
  }),
}), {
  url: ‘http://localhost:3000/api/’,
  createContext: req => …,
});
```

```ts
import create from ‘typed-api’;

export const [api, connector] = create({
  url: ‘http://localhost:3000/api/’,
  createContext: req => null,
}).addQueries(ctx => ({
  getItems: createQuery(async () => {
    const items: Item[] = await getItemsFunc();
    return items;
  }),
  addItem: createMutation(async (todo: string, completed: boolean) => {
    if (!ctx.user) {
      throw new Error(“You have to be logged in to add items”);
    }
    const newItem: Item = await addItemFunc(todo, completed);
    return newItem;
  }),
}));
```

```ts
import create from "typed-api";

export const [api, connector] = create({
  url: "http://localhost:3000/api/",
  createContext: (req) => createContextFunc(req),
}).addQueries((ctx) => ({
  getItems: async () => {
    const items: Item[] = await getItemsFunc();
    return items;
  },
  addItem: async (todo: string, completed: boolean) => {
    if (!ctx.user) {
      throw new Error("You have to be logged in to add items");
    }
    const newItem: Item = await addItemFunc(todo, completed);
    return newItem;
  },
 })).addMutations((ctx) => ({}).get();

export const [api, connector] = create({
  url: "http://localhost:3000/api/",
  createContext: (req) => createContextFunc(req),
}).addQueries((ctx) => ({
  getItems: createQuery(async () => {
    const items: Item[] = await getItemsFunc();
    return items;
  }),
  addItem: createMutation(async (todo: string, completed: boolean) => {
    if (!ctx.user) {
      throw new Error("You have to be logged in to add items");
    }
    const newItem: Item = await addItemFunc(todo, completed);
    return newItem;
  }),
}));
```
