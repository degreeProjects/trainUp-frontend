export const createFormData = (data: Record<string, any>) => {
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
