import { create } from "zustand";
import type { Notification } from "../types";

interface ModalState {
  isOpen: boolean;
  type?: string;
  data?: any;
}

interface UIStore {
  sidebarOpen: boolean;
  selectedTab: string;
  modal: ModalState;
  notifications: Notification[];

  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setSelectedTab: (tab: string) => void;
  openModal: (type: string, data?: any) => void;
  closeModal: () => void;
  showNotification: (notification: Omit<Notification, "id">) => void;
  removeNotification: (id: string) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: true,
  selectedTab: "dashboard",
  modal: { isOpen: false },
  notifications: [],

  toggleSidebar: () =>
    set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  setSelectedTab: (tab) => set({ selectedTab: tab }),

  openModal: (type, data) =>
    set({
      modal: {
        isOpen: true,
        type,
        data,
      },
    }),

  closeModal: () =>
    set({
      modal: { isOpen: false },
    }),

  showNotification: (notification) =>
    set((state) => {
      const id = `${Date.now()}-${Math.random()}`;
      const newNotification: Notification = {
        ...notification,
        id,
        duration: notification.duration || 5000,
      };

      // Auto-remove after duration
      if (newNotification.duration) {
        setTimeout(() => {
          set((s) => ({
            notifications: s.notifications.filter((n) => n.id !== id),
          }));
        }, newNotification.duration);
      }

      return {
        notifications: [...state.notifications, newNotification],
      };
    }),

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
}));
