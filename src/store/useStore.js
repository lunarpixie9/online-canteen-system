import { create } from "zustand";
import { INITIAL_SNACKS, INITIAL_STUDENTS, INITIAL_ORDERS } from "../data/mockData";

const STORAGE_KEY = "edzy_orders";

function startOfTodayMs() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function loadOrdersFromStorage() {
  const todayStart = startOfTodayMs();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const orders = raw ? JSON.parse(raw) : INITIAL_ORDERS;
    return (orders || []).map((o) => ({
      status: "ready",
      ...o,
      status:
        o.createdAt && new Date(o.createdAt).getTime() < todayStart
          ? "completed"
          : (o.status ?? "ready"),
    }));
  } catch {
    return (INITIAL_ORDERS || []).map((o) => ({
      status: "ready",
      ...o,
      status:
        o.createdAt && new Date(o.createdAt).getTime() < todayStart
          ? "completed"
          : (o.status ?? "ready"),
    }));
  }
}

function saveOrdersToStorage(orders) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch {
    // fail silently if storage is unavailable
  }
}

function generateReferralCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return `EDZ-${code}`;
}

function generateId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export const useStore = create((set, get) => ({
  snacks: INITIAL_SNACKS,
  students: INITIAL_STUDENTS,
  orders: loadOrdersFromStorage(),
  currentStudentId: INITIAL_STUDENTS?.[0]?.id ?? null,

  setCurrentStudentId: (id) => set(() => ({ currentStudentId: id })),

  getSnackById: (id) => get().snacks.find((s) => s.id === id),
  getStudentById: (id) => get().students.find((s) => s.id === id),
  getOrdersByStudentId: (studentId) =>
    get().orders.filter((o) => o.studentId === studentId),

  addStudent: (name) => {
    const trimmed = name.trim();
    if (!trimmed || trimmed.length < 2) return null;

    const newStudent = {
      id: generateId("st"),
      name: trimmed,
      referralCode: generateReferralCode(),
      totalSpent: 0,
      createdAt: new Date().toISOString(),
    };

    set((state) => ({ students: [...state.students, newStudent] }));
    return newStudent;
  },

  placeOrder: ({ studentId, snackId, quantity }) => {
    const snack = get().getSnackById(snackId);
    const student = get().getStudentById(studentId);

    if (!snack || !student) return { success: false, error: "Invalid snack or student." };
    if (quantity < 1 || quantity > 5) return { success: false, error: "Quantity must be 1–5." };

    const payableAmount = snack.price * quantity;

    const newOrder = {
      id: generateId("o"),
      studentId,
      snackId,
      snackName: snack.name,
      quantity,
      payableAmount,
      createdAt: new Date().toISOString(),
      status: "pending",
    };

    set((state) => {
      const updatedOrders = [...state.orders, newOrder];
      const updatedSnacks = state.snacks.map((s) =>
        s.id === snackId ? { ...s, ordersCount: s.ordersCount + quantity } : s
      );
      const updatedStudents = state.students.map((st) =>
        st.id === studentId
          ? { ...st, totalSpent: st.totalSpent + payableAmount }
          : st
      );

      saveOrdersToStorage(updatedOrders);

      return {
        orders: updatedOrders,
        snacks: updatedSnacks,
        students: updatedStudents,
      };
    });

    // prototype: auto-mark ready after a short delay
    setTimeout(() => {
      set((state) => {
        const updatedOrders = state.orders.map((o) =>
          o.id === newOrder.id ? { ...o, status: "ready" } : o
        );
        saveOrdersToStorage(updatedOrders);
        return { orders: updatedOrders };
      });
    }, 8000);

    // prototype: auto-mark completed 20 minutes after placing (ready -> completed)
    setTimeout(() => {
      set((state) => {
        const updatedOrders = state.orders.map((o) =>
          o.id === newOrder.id && o.status === "ready" ? { ...o, status: "completed" } : o
        );
        saveOrdersToStorage(updatedOrders);
        return { orders: updatedOrders };
      });
    }, 20 * 60 * 1000);

    return { success: true, order: newOrder };
  },
}));