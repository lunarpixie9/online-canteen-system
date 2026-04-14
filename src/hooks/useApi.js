import { useQuery } from "@tanstack/react-query";
import { api } from "../api/mockApi";

export function useSnacks() {
  return useQuery({ queryKey: ["snacks"], queryFn: () => api.getSnacks() });
}

export function useStudents() {
  return useQuery({ queryKey: ["students"], queryFn: () => api.getStudents() });
}

export function useStudent(id) {
  return useQuery({
    queryKey: ["student", id],
    queryFn: () => api.getStudent(id),
    enabled: !!id,
  });
}

export function useStudentOrders(studentId) {
  return useQuery({
    queryKey: ["orders", studentId],
    queryFn: () => api.getOrdersByStudentId(studentId),
    enabled: !!studentId,
  });
}