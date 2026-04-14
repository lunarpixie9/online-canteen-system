import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useStore } from "../store/useStore";

const delay = (ms = 400) => new Promise((res) => setTimeout(res, ms));

export function useSnacks() {
  const snacks = useStore((s) => s.snacks);
  return useQuery({
    queryKey: ["snacks"],
    queryFn: async () => { await delay(); return snacks; },
  });
}

export function useStudents() {
  const students = useStore((s) => s.students);
  return useQuery({
    queryKey: ["students"],
    queryFn: async () => { await delay(); return students; },
  });
}

export function useStudent(id) {
  const getStudentById = useStore((s) => s.getStudentById);
  return useQuery({
    queryKey: ["students", id],
    queryFn: async () => {
      await delay(300);
      const student = getStudentById(id);
      if (!student) throw new Error("Student not found.");
      return student;
    },
    enabled: !!id,
    retry: false,
  });
}

export function useStudentOrders(studentId) {
  const getOrdersByStudentId = useStore((s) => s.getOrdersByStudentId);
  return useQuery({
    queryKey: ["orders", studentId],
    queryFn: async () => { await delay(300); return getOrdersByStudentId(studentId); },
    enabled: !!studentId,
  });
}

export function useAddStudent() {
  const addStudent = useStore((s) => s.addStudent);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (name) => {
      await delay(500);
      const student = addStudent(name);
      if (!student) throw new Error("Invalid name. Must be at least 2 characters.");
      return student;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
}

export function usePlaceOrder() {
  const placeOrder = useStore((s) => s.placeOrder);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ studentId, snackId, quantity }) => {
      await delay(600);
      const result = placeOrder({ studentId, snackId, quantity });
      if (!result.success) throw new Error(result.error);
      return result.order;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["snacks"] });
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["orders", variables.studentId] });
    },
  });
}