export type ApiSuccessResponse<T> = {
  success: true;
  message: string;
  data: T;
  errors?: unknown;
};

export type ApiErrorResponse = {
  success: false;
  message: string;
  data: null;
  errors?: unknown;
};

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export type UnknownRecord = Record<string, unknown>;

export function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null;
}
