import { createBrowserRouter } from "react-router-dom";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/layouts/DashboardLayout";

import DashboardPage from "@/pages/DashboardPage";
import CustomersPage from "@/pages/CustomersPage";
import SurveysPage from "@/pages/SurveysPage";
import ProjectsPage from "@/pages/ProjectsPage";
import ProfilePage from "@/pages/ProfilePage";
import FinancePage from "@/pages/FinancePage";
import InvoicePrintPage from "@/pages/InvoicePrintPage";
import LoginPage from "@/pages/LoginPage";
import ProjectDetailPage from "@/pages/ProjectDetailPage";
import RabPrintPage from "@/pages/RabPrintPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/projects/:id/rab/print",
    element: (
      <ProtectedRoute>
        <RabPrintPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/projects/:id/invoice/print",
    element: (
      <ProtectedRoute>
        <InvoicePrintPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "customers",
        element: <CustomersPage />,
      },
      {
        path: "surveys",
        element: <SurveysPage />,
      },
      {
        path: "projects",
        element: <ProjectsPage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "finance",
        element: <FinancePage />,
      },
      {
        path: "/projects/:id",
        element: <ProjectDetailPage />,
      },
    ],
  },
]);
