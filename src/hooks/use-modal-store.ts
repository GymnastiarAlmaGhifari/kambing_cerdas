import { Kandang, DataDht, Kambing, notifications, cartimageprocessing } from "@prisma/client";
import { create } from "zustand";

export type dataModal = {
  idKambing?: string | null;
  idKandang?: string | null;
  namaKambing?: string | null;
  dateKambing?: Date | string | null;
  imageKambing?: string | null;
  rfid?: string | null;
};

export type terimaData = {
  id?: string | null;
  nama?: string | null;
  id_kambing?: string | null;
  image_path?: string | null;
  usia?: number | null;
  bobot?: number | null;
  deskripsi?: string | null;
  standart?: number | null;
  keterangan?: string | null;
};

export type alat = {
  id_dht22?: string | null;
  id_kandang?: string | null;
  nama_kandang?: string | null;
};

export type ModalType = "createKandang" | "createKambing" | "createSensor" | "createNotif" | "editKandang" | "editKambing" | "editSensor" | "deleteKandang" | "deleteKambing" | "deleteSensor" | "terima" | "tolak" | "deleteUser";

interface ModalData {
  notif?: notifications;
  kandang?: Kandang;
  kambing?: Kambing;
  idKandang?: string;
  idKambing?: string;
  dataModal?: dataModal;
  alat?: alat;
  terimaData?: terimaData;
  sensor?: DataDht;
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
