import { users } from "../../lib/mock-data";
import { SectionCard } from "../../components/section-card";

export default function UsersPage() {
  return (
    <div className="stack">
      <header>
        <p className="brand-kicker">Users</p>
        <h1 className="page-title">Account management</h1>
        <p className="subtle">Track roles, access, and moderation status for admins, agents, and owners.</p>
      </header>

      <SectionCard title="User directory">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.name}>
                <td>{user.name}</td>
                <td>{user.role}</td>
                <td>{user.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>
    </div>
  );
}
