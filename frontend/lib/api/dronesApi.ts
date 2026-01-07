import { Drone } from "@/types/domain";

const simulateDelay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

let drones: Drone[] = [
  {
    id: "dji_mavic_3_enterprise",
    name: "Mavic 3 Enterprise",
    model: "DJI Mavic 3 Enterprise",
    serial_number: "DJI-M3E-001",
    specs_id: "dji_mavic_3_enterprise",
    status: "active"
  },
  {
    id: "dji_matrice_300_rtk",
    name: "Matrice 300 RTK",
    model: "DJI Matrice 300 RTK",
    serial_number: "DJI-M300-001",
    specs_id: "dji_matrice_300_rtk",
    status: "active"
  }
];

export const getDrones = async (): Promise<Drone[]> => {
  await simulateDelay(300);
  return drones;
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


