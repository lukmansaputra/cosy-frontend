// src/hooks/useProjectDetail.js

import { useEffect, useState } from "react";

import { getProject } from "@/services/project.service";
import { getProjectPayments } from "@/services/payment.service";
import { getProjectExpenses } from "@/services/expenses.service";
import { getProjectDocuments } from "@/services/documents.service";

export function useProjectDetail(projectId) {
  const [loading, setLoading] = useState(true);

  const [project, setProject] = useState(null);
  const [payments, setPayments] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [documents, setDocuments] = useState([]);

  async function loadData() {
    try {
      setLoading(true);

      const [projectData, paymentData, expenseData, documentData] =
        await Promise.all([
          getProject(projectId),
          getProjectPayments(projectId),
          getProjectExpenses(projectId),
          getProjectDocuments(projectId),
        ]);

      setProject(projectData);
      setPayments(paymentData);
      setExpenses(expenseData);
      setDocuments(documentData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!projectId) return;

    loadData();
  }, [projectId]);

  return {
    loading,
    project,
    payments,
    expenses,
    documents,
    refresh: loadData,
  };
}
