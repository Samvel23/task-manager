import { useOptimistic, useState, useTransition } from "react";

import type { ITodo } from "@/graphql";
import { fetchGraphQL } from "@/graphql/client";
import { DELETE_TODO_MUTATION, UPDATE_TODO_MUTATION } from "@/graphql/queries";

import { toast } from "react-toastify";

type TodoAction =
  | { type: "toggle"; id: string; completed: boolean }
  | { type: "update"; id: string; title: string }
  | { type: "delete"; id: string };

export const useTaskListActions = (
  initialTodos: ITodo[],
  onTodoUpdated: (todo: ITodo) => void,
  onTodoDeleted: (id: string) => void,
  onTodoStatusChanged?: (completed: boolean) => void,
) => {
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [optimisticTodos, setOptimisticTodos] = useOptimistic(
    initialTodos,
    (state, action: TodoAction) => {
      switch (action.type) {
        case "toggle":
          return state.map((todo) =>
            todo.id === action.id
              ? { ...todo, completed: action.completed }
              : todo,
          );
        case "update":
          return state.map((todo) =>
            todo.id === action.id ? { ...todo, title: action.title } : todo,
          );
        case "delete":
          return state.filter((todo) => todo.id !== action.id);
      };
    },
  );

  const mergeRemoteTodo = (
    todo: ITodo,
    id: string,
    updates: Partial<ITodo> = {},
  ): ITodo => {
    const existingTodo = initialTodos.find((item) => item.id === id);
    return {
      ...existingTodo,
      ...todo,
      title:
        typeof todo.title === "string" && todo.title.trim()
          ? todo.title
          : existingTodo?.title ?? todo.title,
      id,
      user: existingTodo?.user ?? todo.user,
      userId: existingTodo?.userId ?? todo.user?.id,
      ...updates,
    };
  };

  const handleToggle = (id: string, completed: boolean) => {
    setErrorMessage(null);
    setPendingId(id);
    startTransition(async () => {
      setOptimisticTodos({ type: "toggle", id, completed });
      try {
        const result = await fetchGraphQL<{ updateTodo: ITodo }>(
          UPDATE_TODO_MUTATION,
          { id, input: { completed } },
        );
        onTodoUpdated(
          mergeRemoteTodo(result.updateTodo, id, { completed }),
        );
        onTodoStatusChanged?.(completed);
      } catch (error: unknown) {
        setErrorMessage(
          error instanceof Error ? error.message : "Unable to update this task.",
        );
      } finally {
        setPendingId(null);
      }
    });
  };

  const handleEdit = async (formData: FormData): Promise<boolean> => {
    const id = formData.get("id")?.toString();
    const title = formData.get("title")?.toString().trim();
    if (!id || !title || title.length < 3) {
      setErrorMessage("Task title must be at least 3 characters long.");
      return false;
    }
    if (initialTodos.find((todo) => todo.id === id)?.title === title) {
      return false;
    }

    setErrorMessage(null);
    setPendingId(id);
    setOptimisticTodos({ type: "update", id, title });
    try {
      const result = await fetchGraphQL<{ updateTodo: ITodo }>(
        UPDATE_TODO_MUTATION,
        { id, input: { title } },
      );
      onTodoUpdated(mergeRemoteTodo(result.updateTodo, id, { title }));
      toast.success(`Task "${title}" updated.`);
      return true;
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to save this task.",
      );
      return false;
    } finally {
      setPendingId(null);
    }
  };

  const handleDelete = async (formData: FormData): Promise<boolean> => {
    const id = formData.get("id")?.toString();
    if (!id) {
      setErrorMessage("Unable to identify the task to delete.");
      toast.error("Unable to identify the task to delete.");
      return false;
    }

    setErrorMessage(null);
    setPendingId(id);
    setOptimisticTodos({ type: "delete", id });
    try {
      await fetchGraphQL<{ deleteTodo: boolean }>(DELETE_TODO_MUTATION, { id });
      onTodoDeleted(id);
      toast.success(`Task "${formData.get("title")?.toString() ?? ""}" deleted.`);
      return true;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unable to delete this task.";
      setErrorMessage(message);
      toast.error(message);
      return false;
    } finally {
      setPendingId(null);
    }
  };

  return {
    todos: optimisticTodos,
    pendingId,
    isPending,
    errorMessage,
    handleToggle,
    handleEdit,
    handleDelete,
  };
}
