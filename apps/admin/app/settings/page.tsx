import { settings } from "../../lib/mock-data";
import { SectionCard } from "../../components/section-card";

export default function SettingsPage() {
  return (
    <div className="stack">
      <header>
        <p className="brand-kicker">Settings</p>
        <h1 className="page-title">Moderation settings</h1>
        <p className="subtle">Tune rules, review windows, and alerts for the admin team.</p>
      </header>

      <SectionCard title="Workspace defaults">
        <div className="grid two">
          <form className="stack">
            <div className="field">
              <label htmlFor="sla">Review SLA</label>
              <input id="sla" defaultValue="24 hours" />
            </div>
            <div className="field">
              <label htmlFor="confidence">Duplicate threshold</label>
              <input id="confidence" defaultValue="0.82" />
            </div>
          </form>

          <div className="stack">
            {settings.map((setting) => (
              <p key={setting} className="subtle">
                <span className="pill">Enabled</span> {setting}
              </p>
            ))}
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
