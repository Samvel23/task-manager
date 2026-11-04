import { useEffect, useRef, useState } from "react";
import type { ITodo } from "@/graphql";
import {
  adjustTodoTotal,
  fetchUserTodos,
  getFallbackTodosForUser,
  mergeLocalTodos,
  TASK_PAGE_SIZE,
} from "@/lib/dashboard-data";

interface IDashboardTasks {
  todos: ITodo[];
  page: number;
  total: number;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  reset: () => void;
  loadMore: () => Promise<void>;
  add: (todo: ITodo) => void;
  update: (todo: ITodo) => void;
  remove: (id: string) => void;
}

export const useDashboardTasks = (
  userId: string | null,
  searchQuery: string,
): IDashboardTasks => {
  const [todos, setTodos] = useState<ITodo[]>([]);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadedWorkspaceKey, setLoadedWorkspaceKey] = useState("");
  const [error, setError] = useState<string | null>(null);
  const overrides = useRef(new Map<string, ITodo>());
  const createdIds = useRef(new Set<string>());
  const deletedTodos = useRef(new Map<string, ITodo>());
  const workspaceKeyRef = useRef("");
  const workspaceKey = `${userId ?? ""}:${searchQuery}`;

  useEffect(() => {
    workspaceKeyRef.current = workspaceKey;
  }, [workspaceKey]);

  useEffect(() => {
    if (!userId) return;

    let ignore = false;
    fetchUserTodos(userId, 1, searchQuery)
      .then((result) => {
        if (ignore) return;
        setTodos(
          mergeLocalTodos(
            result.todos,
            searchQuery,
            overrides.current,
            createdIds.current,
            deletedTodos.current,
          ),
        );
        setTotal(
          adjustTodoTotal(
            result.totalCount,
            searchQuery,
            overrides.current,
            createdIds.current,
            deletedTodos.current,
          ),
        );
        setPage(1);
        setError(null);
        setLoadedWorkspaceKey(workspaceKey);
      })
      .catch((requestError: unknown) => {
        if (ignore) return;
        const message =
          requestError instanceof Error
            ? requestError.message
            : "Unable to load this workspace.";
        console.error(
          "TaskFlow workspace request failed; using sample data.",
          requestError,
        );
        const fallbackTodos = getFallbackTodosForUser(userId);
        setTodos(
          mergeLocalTodos(
            fallbackTodos,
            searchQuery,
            overrides.current,
            createdIds.current,
            deletedTodos.current,
          ),
        );
        setTotal(
          adjustTodoTotal(
            fallbackTodos.length,
            searchQuery,
            overrides.current,
            createdIds.current,
            deletedTodos.current,
          ),
        );
        setPage(1);
        setError(`Live data is unavailable (${message}); showing sample data.`);
        setLoadedWorkspaceKey(workspaceKey);
      });

    return () => {
      ignore = true;
    };
  }, [searchQuery, userId, workspaceKey]);

  const reset = () => {
    overrides.current.clear();
    createdIds.current.clear();
    deletedTodos.current.clear();
    setTodos([]);
    setPage(0);
    setTotal(0);
    setLoadedWorkspaceKey("");
    setIsLoadingMore(false);
    setError(null);
  };

  const loadMore = async () => {
    if (!userId || isLoadingMore || page * TASK_PAGE_SIZE >= total) return;

    const nextPage = page + 1;
    const requestWorkspaceKey = workspaceKey;
    setIsLoadingMore(true);
    setError(null);
    try {
      const result = await fetchUserTodos(userId, nextPage, searchQuery);
      if (workspaceKeyRef.current !== requestWorkspaceKey) return;
      setTodos((previous) => [
        ...previous,
        ...mergeLocalTodos(
          result.todos,
          searchQuery,
          overrides.current,
          createdIds.current,
          deletedTodos.current,
        ).filter(
          (todo) => !previous.some((existing) => existing.id === todo.id),
        ),
      ]);
      setTotal(
        adjustTodoTotal(
          result.totalCount,
          searchQuery,
          overrides.current,
          createdIds.current,
          deletedTodos.current,
        ),
      );
      setPage(nextPage);
    } catch (requestError: unknown) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Unable to load more tasks.";
      console.error("TaskFlow task pagination failed.", requestError);
      setError(message);
    } finally {
      setIsLoadingMore(false);
    };
  };

  const add = (todo: ITodo) => {
    overrides.current.set(todo.id, todo);
    createdIds.current.add(todo.id);
    deletedTodos.current.delete(todo.id);
    setTodos((previous) => [
      todo,
      ...previous.filter((existing) => existing.id !== todo.id),
    ]);
    setTotal((count) => count + 1);
  };

  const update = (updatedTodo: ITodo) => {
    overrides.current.set(updatedTodo.id, updatedTodo);
    setTodos((previous) =>
      previous.map((todo) =>
        todo.id === updatedTodo.id ? { ...todo, ...updatedTodo } : todo,
      ),
    );
  };

  const remove = (id: string) => {
    const deletedTodo =
      overrides.current.get(id) ?? todos.find((todo) => todo.id === id);
    if (createdIds.current.has(id)) {
      createdIds.current.delete(id);
    } else if (deletedTodo) {
      deletedTodos.current.set(id, deletedTodo);
    }
    overrides.current.delete(id);
    setTodos((previous) => previous.filter((todo) => todo.id !== id));
    setTotal((count) => Math.max(0, count - 1));
  };

  return {
    todos: userId ? todos.filter((todo) => todo.userId === userId) : [],
    page,
    total,
    isLoading: userId !== null && loadedWorkspaceKey !== workspaceKey,
    isLoadingMore,
    error,
    reset,
    loadMore,
    add,
    update,
    remove,
  };
}
