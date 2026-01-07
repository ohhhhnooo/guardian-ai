import { User } from "@/types/domain";

const simulateDelay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

let currentUser: User | null = null;

export const login = async (
  email: string,
  _password: string
): Promise<User> => {
  await simulateDelay(500);
  currentUser = {
    id: "user_1",
    name: "Алексей Иванов",
    email,
    role: "admin"
  };
  return currentUser;
};

export const register = async (data: {
  name: string;
  email: string;
  password: string;
}): Promise<User> => {
  await simulateDelay(700);
  currentUser = {
    id: "user_2",
    name: data.name,
    email: data.email,
    role: "operator"
  };
  return currentUser;
};

export const getCurrentUser = async (): Promise<User | null> => {
  await simulateDelay(200);
  return currentUser;
};

export const logout = async (): Promise<void> => {
  await simulateDelay(200);
  currentUser = null;
};


