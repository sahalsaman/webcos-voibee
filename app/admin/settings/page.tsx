import { connectDB } from "@/lib/db";
import { getSettings } from "@/models/Settings";
import { serialize } from "@/lib/utils";
import { SettingsForm } from "@/components/admin/settings-form";
import { DEFAULT_SETTINGS } from "@/lib/constants";

export default async function AdminSettingsPage() {
  let settings = { ...DEFAULT_SETTINGS };
  try {
    await connectDB();
    settings = serialize(await getSettings());
  } catch {
    /* fall back to defaults if DB unavailable */
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Commission rules & platform configuration</p>
      </div>
      <SettingsForm
        settings={{
          defaultCommission: settings.defaultCommission,
          platformFeePercent: settings.platformFeePercent,
          platformFeeFlat: settings.platformFeeFlat,
          minWithdrawal: settings.minWithdrawal,
          currency: settings.currency,
        }}
      />
    </div>
  );
}
