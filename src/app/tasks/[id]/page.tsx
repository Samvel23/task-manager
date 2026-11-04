import { Suspense } from "react";

import { TaskDetails } from "@/components/organisms";
import { ErrorBoundary } from "@/components/ErrorBoundary";

import {
  fetchGraphQL,
  FALLBACK_TODOS,
  FALLBACK_COMMENTS,
  GET_TODO_DETAILS_QUERY,
  GET_USER_POSTS_COMMENTS_QUERY,
} from "@/graphql";

import type {
  ITodo,
  IComment,
  IUserPostsCommentsResponse,
  IUserPostsCommentsVariables,
} from "@/graphql/types";

import styles from "@/app/styles/dashboard-common.module.scss";

const fetchTodo = async (id: string): Promise<ITodo> => {
  try {
    const result = await fetchGraphQL<{ todo: ITodo | null }, { id: string }>(
      GET_TODO_DETAILS_QUERY,
      { id },
    );
    if (result.todo) return result.todo;
  } catch (error) {
    console.error(`Unable to load task ${id}; checking local sample data.`, error);
  }

  const fallbackTodo = FALLBACK_TODOS.find((todo) => todo.id === id);
  if (fallbackTodo) return fallbackTodo;
  throw new Error("This task could not be found.");
}

const fetchTaskComments = async (userId: string): Promise<IComment[]> => {
  if (!userId) return [];

  try {
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
      throw new Error("The task owner could not be found.");
    }
    return result.user.posts.data.flatMap((post) =>
      post.comments.data.map((comment) => ({
        ...comment,
        postId: post.id,
        userId,
      })),
    );
  } catch (error) {
    console.error(
      `Unable to load comments for task owner ${userId}; checking local sample data.`,
      error,
    );
    return FALLBACK_COMMENTS.filter((comment) => comment.userId === userId);
  }
}

const TaskDetailsContent = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const todoPromise = fetchTodo(id);
  const commentsPromise = todoPromise.then((todo) =>
    fetchTaskComments(todo.user?.id ?? todo.userId ?? ""),
  );

  return (
    <Suspense fallback={<p className={styles.loadingText}>Loading task…</p>}>
      <ErrorBoundary>
        <TaskDetails
          todoPromise={todoPromise}
          commentsPromise={commentsPromise}
          taskId={id}
        />
      </ErrorBoundary>
    </Suspense>
  );
}

const TaskDetailsPage = ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  return (
    <Suspense fallback={<p className={styles.loadingText}>Loading task…</p>}>
      <TaskDetailsContent params={params} />
    </Suspense>
  );
};

export default TaskDetailsPage;
