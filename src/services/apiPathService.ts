

import Api from "../api/Api"

export const ApiCallPath = async (id:string) => {
  try {
    const result = await Api.get("/Path/" + id, {
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
