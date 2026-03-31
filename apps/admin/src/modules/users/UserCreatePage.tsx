import type { FormEvent } from "react";
import { useState } from "react";
import { Button, Card } from "@repo/ui";
import { AdminPageFrame } from "../../components/AdminPageFrame";
import { ADMIN_PAGE_TITLES } from "../../constants/adminNavigation";
import { adminInputClass } from "../../lib/formFieldStyles";

export function UserCreatePage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    console.info("admin:users:create", { email, name });
  }

  return (
    <AdminPageFrame
      title={ADMIN_PAGE_TITLES.users}
      addon={
        <p className="text-sm text-slate-500">
          Create or invite a buyer — replace with API mutation when ready.
        </p>
      }
    >
      <Card title="Add user" description="Minimal fields; extend as your schema requires.">
        <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
          <div>
            <label htmlFor="user-email" className="text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              id="user-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              className={adminInputClass}
              placeholder="buyer@example.com"
            />
          </div>
          <div>
            <label htmlFor="user-name" className="text-sm font-medium text-slate-700">
              Full name
            </label>
            <input
              id="user-name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(ev) => setName(ev.target.value)}
              className={adminInputClass}
              placeholder="Jane Buyer"
            />
          </div>
          <Button type="submit" variant="accent" size="md">
            Save user
          </Button>
        </form>
      </Card>
    </AdminPageFrame>
  );
}
