import { Drone } from "@/types/domain";

const simulateDelay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

let drones: Drone[] = [
  {
    id: "drone_001",
    name: "Скаут-1",
    model: "DJI Mavic 3 Enterprise",
    serial_number: "1ZNBH8K00C0089",
    specs_id: "dji_mavic_3_enterprise",
    status: "active"
  },
  {
    id: "drone_002",
    name: "Орион-М300",
    model: "DJI Matrice 300 RTK",
    serial_number: "1ZNBJ9L00D0134",
    specs_id: "dji_matrice_300_rtk",
    status: "active"
  },
  {
    id: "drone_003",
    name: "Инспектор-2",
    model: "DJI Mavic 3 Thermal",
    serial_number: "1ZNBH8T00E0067",
    specs_id: "dji_mavic_3_thermal",
    status: "active"
  },
  {
    id: "drone_004",
    name: "Гефест-П",
    model: "DJI Matrice 30T",
    serial_number: "1ZNBK2M00F0098",
    specs_id: "dji_matrice_30t",
    status: "maintenance"
  },
  {
    id: "drone_005",
    name: "Стриж-AIR",
    model: "Autel EVO II Pro",
    serial_number: "AU7H2K3L00123",
    specs_id: "autel_evo2_pro",
    status: "active"
  },
  {
    id: "drone_006",
    name: "Патруль-7",
    model: "DJI Inspire 3",
    serial_number: "1ZNBI3N00G0045",
    specs_id: "dji_inspire_3",
    status: "active"
  },
  {
    id: "drone_007",
    name: "Каскад-Агро",
    model: "DJI Agras T40",
    serial_number: "1ZNBA4T00H0022",
    specs_id: "dji_agras_t40",
    status: "maintenance"
  },
  {
    id: "drone_008",
    name: "Разведчик-5",
    model: "DJI Mini 3 Pro",
    serial_number: "1ZNBM3P00I0189",
    specs_id: "dji_mini_3_pro",
    status: "active"
  }
];

export const getDrones = async (): Promise<Drone[]> => {
  await simulateDelay(300);
  return drones;
};

export const getDroneById = async (id: string): Promise<Drone | null> => {
  await simulateDelay(200);
  return drones.find(d => d.id === id) ?? null;
};

export const createDrone = async (
  payload: Omit<Drone, "id">
): Promise<Drone> => {
  await simulateDelay(400);
  const drone: Drone = { ...payload, id: `drone_${Date.now()}` };
  drones = [...drones, drone];
  return drone;
};

export const updateDrone = async (
  id: string,
  patch: Partial<Drone>
): Promise<Drone> => {
  await simulateDelay(300);
  drones = drones.map((d) => (d.id === id ? { ...d, ...patch } : d));
  const updated = drones.find((d) => d.id === id);
  if (!updated) {
    throw new Error("Drone not found");
  }
  return updated;
};

export const deleteDrone = async (id: string): Promise<void> => {
  await simulateDelay(300);
  drones = drones.filter((d) => d.id !== id);
};
