import { Operator } from "@/types/domain";

const simulateDelay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

let operators: Operator[] = [
  {
    id: "op_1",
    name: "Иван Петров",
    email: "ivan@example.com",
    role: "Старший оператор",
    status: "active"
  },
  {
    id: "op_2",
    name: "Мария Сидорова",
    email: "maria@example.com",
    role: "Оператор",
    status: "active"
  }
];

export const getOperators = async (): Promise<Operator[]> => {
  await simulateDelay(250);
  return operators;
};

export const createOperator = async (
  payload: Omit<Operator, "id">
): Promise<Operator> => {
  await simulateDelay(400);
  const operator: Operator = { ...payload, id: `op_${Date.now()}` };
  operators = [...operators, operator];
  return operator;
};

export const updateOperator = async (
  id: string,
  patch: Partial<Operator>
): Promise<Operator> => {
  await simulateDelay(300);
  operators = operators.map((o) => (o.id === id ? { ...o, ...patch } : o));
  const updated = operators.find((o) => o.id === id);
  if (!updated) {
    throw new Error("Operator not found");
  }
  return updated;
};

export const deleteOperator = async (id: string): Promise<void> => {
  await simulateDelay(300);
  operators = operators.filter((o) => o.id !== id);
};


