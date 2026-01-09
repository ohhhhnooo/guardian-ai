import { Operator } from "@/types/domain";

const simulateDelay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

let operators: Operator[] = [
  {
    id: "op_001",
    name: "Алексей Козлов",
    email: "a.kozlov@guardian-ai.ru",
    role: "Ведущий оператор",
    status: "active"
  },
  {
    id: "op_002",
    name: "Мария Соколова",
    email: "m.sokolova@guardian-ai.ru",
    role: "Старший оператор",
    status: "active"
  },
  {
    id: "op_003",
    name: "Дмитрий Волков",
    email: "d.volkov@guardian-ai.ru",
    role: "Оператор",
    status: "active"
  },
  {
    id: "op_004",
    name: "Елена Морозова",
    email: "e.morozova@guardian-ai.ru",
    role: "Оператор",
    status: "active"
  },
  {
    id: "op_005",
    name: "Сергей Новиков",
    email: "s.novikov@guardian-ai.ru",
    role: "Оператор-стажёр",
    status: "active"
  },
  {
    id: "op_006",
    name: "Анна Белова",
    email: "a.belova@guardian-ai.ru",
    role: "Технический специалист",
    status: "active"
  },
  {
    id: "op_007",
    name: "Игорь Кузнецов",
    email: "i.kuznetsov@guardian-ai.ru",
    role: "Оператор",
    status: "inactive"
  },
  {
    id: "op_008",
    name: "Ольга Павлова",
    email: "o.pavlova@guardian-ai.ru",
    role: "Диспетчер",
    status: "active"
  },
  {
    id: "op_009",
    name: "Андрей Смирнов",
    email: "a.smirnov@guardian-ai.ru",
    role: "Руководитель полётов",
    status: "active"
  },
  {
    id: "op_010",
    name: "Наталья Орлова",
    email: "n.orlova@guardian-ai.ru",
    role: "Оператор",
    status: "active"
  }
];

export const getOperators = async (): Promise<Operator[]> => {
  await simulateDelay(250);
  return operators;
};

export const getOperatorById = async (id: string): Promise<Operator | null> => {
  await simulateDelay(200);
  return operators.find(o => o.id === id) ?? null;
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
