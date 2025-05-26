import Api from "../api/Api";

export const ApiCallAISuggestions = async (path: any) => {
  try {
    const result = await Api.post("/genai/recommend-path", path, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return result.data;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};
