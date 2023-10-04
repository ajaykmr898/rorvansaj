export * from "./api-handler";
export * from "./db";
export * from "./error-handler";
export * from "./jwt-middleware";

export const success = {
  success: true,
  message: "Request successful",
  data: {},
};

export const error = {
  success: false,
  message: "Generic error",
  error: {
    code: "000",
    details: "Generic error",
  },
};
