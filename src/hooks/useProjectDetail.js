// src/hooks/useProjectDetail.js

import { useQuery } from "@tanstack/react-query";

import { getProject } from "@/services/project.service";
import { getProjectPayments } from "@/services/payment.service";
import { getProjectExpenses } from "@/services/expenses.service";
import { getProjectDocuments } from "@/services/documents.service";

const EMPTY_ARRAY = [];

export function useProjectDetail(projectId) {
  const detailQuery = useQuery({
    queryKey: ["project-detail", projectId],
    queryFn: async () => {
      const [projectData, paymentData, expenseData, documentData] =
        await Promise.all([
          getProject(projectId),
          getProjectPayments(projectId),
          getProjectExpenses(projectId),
          getProjectDocuments(projectId),
        ]);

      return {
        project: projectData,
        payments: paymentData || EMPTY_ARRAY,
        expenses: expenseData || EMPTY_ARRAY,
        documents: documentData || EMPTY_ARRAY,
      };
    },
    enabled: Boolean(projectId),
  });
  const data = detailQuery.data || {};

  return {
    loading: detailQuery.isPending,
    project: data.project || null,
    payments: data.payments || EMPTY_ARRAY,
    expenses: data.expenses || EMPTY_ARRAY,
    documents: data.documents || EMPTY_ARRAY,
    error: detailQuery.error?.message || "",
    refresh: detailQuery.refetch,
  };
}
