//ejemplo pa hacer llamadas a la api

import Api from "../api/Api";
import { UserInfo } from "../models/user.model";

export const ApiCallGroups = async () => {
  try {
    const result = await Api.get("/users-management/groups", {
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

export interface groupMember {
  id: string;
  groupRole: string;
}

export interface group {
  name: string;
  description: string;
  userGroups?: { id: string; role: string; user: UserInfo }[];
}

export interface userGroup {
  groupId: string;
  userId: string;
  role: string;
}

export const ApiCallAddGroup = async (group: group) => {
  try {
    const result = await Api.post("/users-management/groups", group, {
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

export const ApiCallGroup = async (id: string): Promise<group> => {
  try {
    const result = await Api.get("/users-management/group/" + id, {
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

export const ApiCallAddUserGroup = async (userGroup: userGroup) => {
  try {
    const result = await Api.post(
      "/users-management/groups/add-user",
      userGroup,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return result.data;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const ApiCallUpdateGroup = async (id: string, group: group) => {
  try {
    const result = await Api.put("/users-management/groups/" + id, group, {
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

export const ApiCallDeleteUserGroup = async (id: string) => {
  try {
    const result = await Api.delete(
      "/users-management/groups/remove-user/" + id,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return result.data;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};
