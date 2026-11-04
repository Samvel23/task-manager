import {
  fetchGraphQL,
  FALLBACK_TODOS,
  FALLBACK_USERS,
  GET_USERS_QUERY,
  GET_USER_TODOS_QUERY,
  GET_USER_POSTS_COMMENTS_QUERY,
  type ITodo,
  type IUser,
  type IComment,
  type IUserConnection,
  type IUsersVariables,
  type IPageQueryOptions,
  type IUserTodosResponse,
  type IUserTodosVariables,
  type IUserPostsCommentsResponse,
  type IUserPostsCommentsVariables,
} from "@/graphql";

export const TASK_PAGE_SIZE = 10;

export interface IDashboardData {
  users: IUser[];
  loadError: string | null;
}

export const createPageOptions = (
  page: number,
  searchQuery = "",
  limit = TASK_PAGE_SIZE,
): IPageQueryOptions => {
  const search = searchQuery.trim();
  return {
    paginate: { page, limit },
    sort: [{ field: "title", order: "ASC" }],
    ...(search ? { search: { q: search } } : {}),
  };
};

export const fetchDashboardData = async (): Promise<IDashboardData> => {
  try {
    const usersData = await fetchGraphQL<
      { users: IUserConnection },
      IUsersVariables
    >(GET_USERS_QUERY, {
      options: {
        paginate: { page: 1, limit: 20 },
        sort: [{ field: "name", order: "ASC" }],
      },
    });

    return { users: usersData.users.data, loadError: null };
  } catch (error) {
    console.error(
      "TaskFlow user request failed; using bundled sample data.",
      error,
    );
    return {
      users: FALLBACK_USERS,
      loadError:
        error instanceof Error
          ? error.message
          : "Unable to load users from GraphQLZero.",
    };
  }
};

export const fetchUserTodos = async (
  userId: string,
  page: number,
  searchQuery: string,
): Promise<{ todos: ITodo[]; totalCount: number }> => {
  const result = await fetchGraphQL<IUserTodosResponse, IUserTodosVariables>(
    GET_USER_TODOS_QUERY,
    {
      id: userId,
      options: createPageOptions(page, searchQuery),
    },
  );
  if (!result.user) {
    throw new Error("The selected user could not be found.");
  }

  const todos = result.user.todos.data.map((todo) => ({
    ...todo,
    userId: todo.userId ?? todo.user?.id ?? userId,
  }));
  return { todos, totalCount: result.user.todos.meta.totalCount };
};

export const fetchUserComments = async (
  userId: string,
): Promise<IComment[]> => {
  const result = await fetchGraphQL<
    IUserPostsCommentsResponse,
    IUserPostsCommentsVariables
  >(GET_USER_POSTS_COMMENTS_QUERY, {
    id: userId,
    options: {
      paginate: { page: 1, limit: 10 },
      sort: [{ field: "id", order: "ASC" }],
    },
  });
  if (!result.user) {
    throw new Error("The selected user could not be found.");
  }

  return result.user.posts.data.flatMap((post) =>
    post.comments.data.map((comment) => ({
      ...comment,
      postId: post.id,
      userId,
    })),
  );
};

export const todoMatchesSearch = (
  todo: ITodo,
  searchQuery: string,
): boolean => {
  const search = searchQuery.trim().toLowerCase();
  return !search || todo.title.toLowerCase().includes(search);
};

export const mergeLocalTodos = (
  serverTodos: ITodo[],
  searchQuery: string,
  overrides: Map<string, ITodo>,
  createdIds: Set<string>,
  deletedTodos: Map<string, ITodo>,
): ITodo[] => {
  const serverIds = new Set(serverTodos.map((todo) => todo.id));
  const merged = serverTodos
    .filter((todo) => !deletedTodos.has(todo.id))
    .map((todo) => overrides.get(todo.id) ?? todo);
  const extras = [...overrides.entries()]
    .filter(
      ([id, todo]) =>
        !serverIds.has(id) &&
        !deletedTodos.has(id) &&
        (createdIds.has(id) || todoMatchesSearch(todo, searchQuery)),
    )
    .map(([, todo]) => todo);
  return [...merged, ...extras];
};

export const adjustTodoTotal = (
  serverTotal: number,
  searchQuery: string,
  overrides: Map<string, ITodo>,
  createdIds: Set<string>,
  deletedTodos: Map<string, ITodo>,
): number => {
  const createdCount = [...createdIds].filter((id) => {
    const todo = overrides.get(id);
    return todo !== undefined && todoMatchesSearch(todo, searchQuery);
  }).length;
  const deletedCount = [...deletedTodos.values()].filter((todo) =>
    todoMatchesSearch(todo, searchQuery),
  ).length;
  return Math.max(0, serverTotal + createdCount - deletedCount);
};

export const getFallbackTodosForUser = (userId: string): ITodo[] => {
  return FALLBACK_TODOS.filter((todo) => todo.userId === userId);
};
