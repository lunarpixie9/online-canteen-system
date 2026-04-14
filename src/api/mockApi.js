import { useStore } from "../store/useStore";

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// Minimal mocked endpoints (Promise-based) to demonstrate API integration.
export const api = {
  async getSnacks() {
    await sleep(250);
    return useStore.getState().snacks;
  },

  async getStudents() {
    await sleep(250);
    return useStore.getState().students;
  },

  async getStudent(id) {
    await sleep(180);
    return useStore.getState().getStudentById(id) ?? null;
  },

  async createStudent({ name }) {
    await sleep(300);
    const student = useStore.getState().addStudent(name);
    if (!student) throw new Error("Invalid student name.");
    return student;
  },

  async getOrdersByStudentId(studentId) {
    await sleep(200);
    return useStore.getState().getOrdersByStudentId(studentId);
  },

  async createOrder({ studentId, snackId, quantity }) {
    await sleep(350);
    const result = useStore.getState().placeOrder({ studentId, snackId, quantity });
    if (!result.success) throw new Error(result.error || "Failed to place order.");
    return result.order;
  },
};

