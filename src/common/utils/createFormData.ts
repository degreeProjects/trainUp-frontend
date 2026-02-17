export const createFormData = (data: Record<string, any>) => {
  // Most payloads mix primitives with optional File objects; this helper keeps
  // the wiring identical across services so the backend always receives the
  // expected multipart layout.
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (key === "picture" && value instanceof File) {
      formData.append("picture", value);
    } else {
      formData.set(key, value);
    }
  });

  return formData;
};
