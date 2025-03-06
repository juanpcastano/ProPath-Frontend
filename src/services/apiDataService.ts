//apiDataService

import Api from "../api/Api"

export const ApiCall = async () => {
  try {
    const result = await Api.get("", {
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

