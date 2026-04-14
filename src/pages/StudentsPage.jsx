import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useStudents, useAddStudent } from "../hooks/useApi";
import StudentListItem from "../components/StudentListItem";
import Modal from "../components/Modal";

const schema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters.")
    .max(50, "Name is too long.")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces."),
});

function CreateStudentForm({ onSuccess }) {
  const { mutateAsync: addStudent, isPending, isError, error } = useAddStudent();
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async ({ name }) => {
    try {
      await addStudent(name);
      reset();
      onSuccess?.();
    } catch {
      // error shown via isError
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="mb-2">
        <label htmlFor="name" className="label">Student Name</label>
        <input
          id="name"
          type="text"
          placeholder="e.g. Riya Patel"
          autoFocus
          {...register("name")}
          className="input-field"
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
        )}
      </div>
      <p className="text-xs text-stone-400 mb-5">
        A unique referral code will be generated automatically.
      </p>
      {isError && (
        <p className="text-red-500 text-xs mb-3">{error?.message}</p>
      )}
      <button
        type="submit"
        disabled={isPending}
        className="btn-primary w-full flex items-center justify-center gap-2"
      >
        {isPending ? (
          <>
            <span className="w-4 h-4 border-2 border-stone-400 border-t-stone-800 rounded-full animate-spin" />
            Creating…
          </>
        ) : "Create Student"}
      </button>
    </form>
  );
}

export default function StudentsPage() {
  const { data: students, isLoading, isError } = useStudents();
  const [modalOpen, setModalOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [search, setSearch] = useState("");

  const handleCreateSuccess = () => {
    setModalOpen(false);
    setSuccessMsg("Student added successfully! 🎉");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const filtered = students?.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.referralCode.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="section-title">Students</h1>
          <p className="text-stone-400 text-sm mt-1">
            {students ? `${students.length} registered` : "Loading…"}
          </p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary text-sm">
          + Add Student
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name or referral code…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field max-w-sm"
        />
      </div>

      {successMsg && (
        <div className="mb-5 bg-green-50 border border-green-200 text-green-700 rounded-2xl px-5 py-3 text-sm font-medium">
          {successMsg}
        </div>
      )}

      {isLoading && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="card h-20 animate-pulse bg-stone-50" />
          ))}
        </div>
      )}

      {isError && (
        <div className="card text-center py-12">
          <p className="text-stone-500">Failed to load students. Please refresh.</p>
        </div>
      )}

      {filtered && (
        <div className="flex flex-col gap-3">
          {filtered.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-stone-500">No students found.</p>
            </div>
          ) : (
            filtered.map((student) => (
              <StudentListItem key={student.id} student={student} />
            ))
          )}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add New Student">
        <CreateStudentForm onSuccess={handleCreateSuccess} />
      </Modal>
    </div>
  );
}