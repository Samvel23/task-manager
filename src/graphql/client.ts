const GRAPHQL_ENDPOINT = "https://graphqlzero.almansi.me/api";

export interface IGraphQLError {
  message: string;
  path?: unknown[];
  locations?: unknown[];
}

export interface IGraphQLResponse<T> {
  data?: T;
  errors?: IGraphQLError[];
}

export class GraphQLError extends Error {
  public errors: IGraphQLError[];
  public status: number;

  constructor(message: string, errors: IGraphQLError[], status: number) {
    super(message);
    this.name = "GraphQLError";
    this.errors = errors;
    this.status = status;
  }
}

const parseErrors = (value: unknown, status: number): IGraphQLError[] => {
  if (!Array.isArray(value)) {
    throw new GraphQLError("Invalid GraphQL errors payload", [], status);
  }

  return value.map((error: unknown) => {
    if (
      typeof error !== "object" ||
      error === null ||
      !("message" in error) ||
      typeof error.message !== "string"
    ) {
      throw new GraphQLError("Invalid GraphQL error entry", [], status);
    }

    return { message: error.message };
  });
}

export const fetchGraphQL = async <
  T,
  V extends object = Record<string, unknown>,
>(
  query: string,
  variables?: V,
): Promise<T> => {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      ...(variables && Object.keys(variables).length > 0 ? { variables } : {}),
    }),
  });

  if (!response.ok) {
    let errors: IGraphQLError[] = [];
    if (response.headers.get("content-type")?.includes("application/json")) {
      const errorPayload: unknown = await response.json();
      if (
        typeof errorPayload === "object" &&
        errorPayload !== null &&
        "errors" in errorPayload
      ) {
        errors = parseErrors(errorPayload.errors, response.status);
      };
    }

    const details =
      errors.length > 0
        ? `: ${errors.map((error) => error.message).join(", ")}`
        : "";
    throw new GraphQLError(
      `Network response error: ${response.status} ${response.statusText}${details}`,
      errors,
      response.status,
    );
  }

  const result: unknown = await response.json();
  if (typeof result !== "object" || result === null) {
    throw new GraphQLError(
      "Invalid GraphQL response payload",
      [],
      response.status,
    );
  }

  const payload = result as Record<string, unknown>;
  if (Object.prototype.hasOwnProperty.call(payload, "errors")) {
    const errors = parseErrors(payload.errors, response.status);
    if (errors.length > 0) {
      throw new GraphQLError(
        `GraphQL error: ${errors.map((error) => error.message).join(", ")}`,
        errors,
        response.status,
      );
    }
  }

  if (!("data" in payload) || payload.data === undefined || payload.data === null) {
    throw new GraphQLError(
      "No data returned from GraphQL server",
      [],
      response.status,
    );
  }

  return payload.data as T;
}
