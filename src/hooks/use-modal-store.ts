import { Kandang, Sensor, Kambing, notifications } from "@prisma/client";
import { create } from "zustand";

export type ModalType = "createKandang" | "createKambing" | "createSensor" | "editKandang" | "createNotif";

interface ModalData {
  notif?: notifications;
  kandang?: Kandang;
  kambing?: Kambing;
  sensor?: Sensor;
  apiUrl?: string;
  query?: Record<string, any>;
}

interface ModalStore {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ type: null, isOpen: false }),
}));
