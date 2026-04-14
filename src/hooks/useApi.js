import { useQuery } from "@tanstack/react-query";
import { useStore } from "../store/useStore";

export function useSnacks() {
  const snacks = useStore(s => s.snacks);
  return useQuery({ queryKey: ["snacks"], queryFn: () => snacks, initialData: snacks });
}

export function useStudents() {
  const students = useStore(s => s.students);
  return useQuery({ queryKey: ["students"], queryFn: () => students, initialData: students });
}

export function useStudent(id) {
  const getStudentById = useStore(s => s.getStudentById);
  return useQuery({
    queryKey: ["student", id],
    queryFn: () => getStudentById(id) ?? null,
    enabled: !!id,
  });
}

export function useStudentOrders(studentId) {
  const getOrdersByStudentId = useStore(s => s.getOrdersByStudentId);
  return useQuery({
    queryKey: ["orders", studentId],
    queryFn: () => getOrdersByStudentId(studentId),
    enabled: !!studentId,
  });
}