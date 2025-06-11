
import { AdTracking } from "@/components/client/AdTracking";
import { AppLayout } from "@/components/layout/AppLayout";

export default function AdTrackingPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ad Tracking</h1>
          <p className="text-muted-foreground">Track and manage your advertising performance</p>
        </div>
        <AdTracking />
      </div>
    </AppLayout>
  );
}
