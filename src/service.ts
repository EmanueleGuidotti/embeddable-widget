export const getData = async <T>(request: string): Promise<T> => {
  try {
    const response = await fetch(request);
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return await response.json();
  } catch (e) {
    return e;
  }
};
