
import { useState, useMemo } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/context/AuthContext";
import AdminDashboard from "./Dashboard/AdminDashboard";
import UnifiedClientView from "./Client/UnifiedClientView";
import UnifiedFreelancerView from "./Freelancer/UnifiedFreelancerView";

export default function MainPage() {
  const { user } = useAuth();

  return (
    <AppLayout>
      {user?.role === "admin" && <AdminDashboard />}
      {user?.role === "client" && <UnifiedClientView />}
      {user?.role === "freelancer" && <UnifiedFreelancerView />}
    </AppLayout>
  );
}
