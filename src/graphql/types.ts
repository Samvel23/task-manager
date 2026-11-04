export interface ITodo {
  id: string;
  user?: IUser;
  title: string;
  userId?: string;
  completed: boolean;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  username: string;
}

export interface IComment {
  id: string;
  name: string;
  body: string;
  email: string;
  postId?: string;
  userId?: string;
}

export interface IPaginationMeta {
  totalCount: number;
}

export interface ITodoConnection {
  data: ITodo[];
  meta: IPaginationMeta;
}

export interface IUserConnection {
  data: IUser[];
  meta: IPaginationMeta;
}

export interface IPageQueryOptions {
  search?: { q: string };
  paginate: { page: number; limit: number };
  sort?: Array<{ field: string; order: "ASC" | "DESC" }>;
}

export interface IUsersVariables {
  options: IPageQueryOptions;
}

export interface IUserTodosVariables {
  id: string;
  options: IPageQueryOptions;
}

export interface IUserPostsCommentsVariables {
  id: string;
  options: IPageQueryOptions;
}

export interface IUserTodosResponse {
  user: {
    todos: ITodoConnection;
  } | null;
}

export interface IUserPostsCommentsResponse {
  user: {
    posts: {
      data: Array<{
        id: string;
        title: string;
        comments: {
          data: IComment[];
        };
      }>;
    };
  } | null;
}

export interface ICreateTodoInput {
  title: string;
  completed: boolean;
}

export interface IUpdateTodoInput {
  title?: string;
  completed?: boolean;
}

export interface ICreateCommentInput {
  name: string;
  body: string;
  email: string;
}
