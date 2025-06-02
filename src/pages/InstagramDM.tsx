
import { AppLayout } from "@/components/layout/AppLayout";
import { InstagramDMManager } from "@/components/instagram/InstagramDMManager";

export default function InstagramDM() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Instagram DM Manager</h1>
          <p className="text-muted-foreground">
            Manage client social media conversations with AI-powered sales scripts
          </p>
        </div>
        <InstagramDMManager />
      </div>
    </AppLayout>
  );
}
