import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";

export interface Document {
  id: string;
  name: string;
  subject: string;
  status: string;
  chunks_count?: number;
  pages?: number;
  updated_at?: string;
}

export interface Interview {
  id: string;
  mode: string;
  subject: string;
  status: string;
  total_score: number;
  turns: any[];
}

export interface KnowledgePoint {
  id: string;
  name: string;
  subject: string;
  difficulty: string;
  mastery_score: number;
  keywords: string[];
}

export interface Question {
  id: string;
  stem: string;
  type: string;
  subject: string;
}

export interface Mistake {
  id: string;
  title: string;
  question_id: string;
  subject: string;
  mistake_reason: string;
  review_count: number;
  user_answer: string;
  correct_answer: string;
}

export interface StudyDay {
  id: string;
  title: string;
  completed_items: number;
  total_items: number;
  status: string;
}

export interface DocumentChunk {
  id: string;
  document_id: string;
  chunk_index: number;
  content: string;
  chapter: string;
  section: string;
  page_number: number;
  keywords: string[];
}

// Global Dashboard Metrics (Mocked backend fallback if no API exists)
export function useMetrics() {
  return useQuery({
    queryKey: ["metrics"],
    queryFn: async () => {
      // Return fallback metrics as no specific dashboard metric API was found
      return [
        { label: "资料", value: "0", trend: "0" },
        { label: "Chunk", value: "0", trend: "0%" },
        { label: "问答", value: "0", trend: "0" },
        { label: "面试分", value: "0", trend: "0" },
      ];
    },
  });
}

// Documents
export function useDocuments() {
  return useQuery({
    queryKey: ["documents"],
    queryFn: () => apiFetch<Document[]>("/documents"),
  });
}

export function useDocument(id: string) {
  return useQuery({
    queryKey: ["documents", id],
    queryFn: () => apiFetch<Document>(`/documents/${id}`),
    enabled: !!id,
  });
}

export function useDocumentChunks(id: string) {
  return useQuery({
    queryKey: ['documents', id, 'chunks'],
    queryFn: () => apiFetch<DocumentChunk[]>(`/documents/${id}/chunks`),
    enabled: !!id,
  });
}

// Interviews
export function useInterviews() {
  return useQuery({
    queryKey: ["interviews"],
    queryFn: () => apiFetch<Interview[]>("/interviews"),
  });
}

export function useInterview(id: string) {
  return useQuery({
    queryKey: ["interviews", id],
    queryFn: () => apiFetch<Interview>(`/interviews/${id}`),
    enabled: !!id,
  });
}

export function useInterviewReport(id: string) {
  return useQuery({
    queryKey: ["interviews", id, "report"],
    queryFn: () => apiFetch<any>(`/interviews/${id}/report`),
    enabled: !!id,
  });
}

// Knowledge Points
export function useKnowledgePoints() {
  return useQuery({
    queryKey: ["knowledge-points"],
    queryFn: () => apiFetch<KnowledgePoint[]>("/knowledge-points"),
  });
}

// Questions
export function useQuestions() {
  return useQuery({
    queryKey: ["questions"],
    queryFn: () => apiFetch<Question[]>("/questions"),
  });
}

// Mistakes
export function useMistakes() {
  return useQuery({
    queryKey: ["mistakes"],
    queryFn: () => apiFetch<Mistake[]>("/mistakes"),
  });
}

// Study Plans
export function useStudyPlans() {
  return useQuery({
    queryKey: ["study-plans"],
    queryFn: async () => {
      try {
        return await apiFetch<StudyDay[]>("/study-plans");
      } catch (err) {
        return []; // Fallback empty array if endpoint is not perfectly matched
      }
    },
  });
}

// Chat Chunks
export function useChatHistory() {
  return useQuery({
    queryKey: ["chat"],
    queryFn: async () => {
      try {
        return await apiFetch<any[]>("/chat");
      } catch (err) {
        return [];
      }
    },
  });
}