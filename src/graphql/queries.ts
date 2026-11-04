// src/graphql/queries.ts

export const GET_USER_TODOS_QUERY = `
  query GetUserTodos($id: ID!, $options: PageQueryOptions) {
    user(id: $id) {
      todos(options: $options) {
        data {
          id
          title
          completed
          user {
            id
            name
            username
            email
          }
        }
        meta {
          totalCount
        }
      }
    }
  }
`;

export const GET_USER_POSTS_COMMENTS_QUERY = `
  query GetUserPostsComments($id: ID!, $options: PageQueryOptions) {
    user(id: $id) {
      posts(options: $options) {
        data {
          id
          title
          comments {
            data {
              id
              name
              email
              body
            }
          }
        }
      }
    }
  }
`;

export const GET_TODO_DETAILS_QUERY = `
  query GetTodoDetails($id: ID!) {
    todo(id: $id) {
      id
      title
      completed
      user {
        id
        name
        username
        email
      }
    }
  }
`;

export const GET_USERS_QUERY = `
  query GetUsers($options: PageQueryOptions) {
    users(options: $options) {
      data {
        id
        name
        username
        email
      }
      meta {
        totalCount
      }
    }
  }
`;

export const CREATE_TODO_MUTATION = `
  mutation CreateTodo($input: CreateTodoInput!) {
    createTodo(input: $input) {
      id
      title
      completed
      user {
        id
        name
        username
        email
      }
    }
  }
`;

export const UPDATE_TODO_MUTATION = `
  mutation UpdateTodo($id: ID!, $input: UpdateTodoInput!) {
    updateTodo(id: $id, input: $input) {
      id
      title
      completed
      user {
        id
        name
        username
        email
      }
    }
  }
`;

export const DELETE_TODO_MUTATION = `
  mutation DeleteTodo($id: ID!) {
    deleteTodo(id: $id)
  }
`;

export const CREATE_COMMENT_MUTATION = `
  mutation CreateComment($input: CreateCommentInput!) {
    createComment(input: $input) {
      id
      name
      email
      body
    }
  }
`;
