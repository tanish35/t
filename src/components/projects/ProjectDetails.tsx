import { useState } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import {
  IconArrowLeft,
  IconKey,
  IconPlus,
  IconWaveSine,
} from "@tabler/icons-react";
import type { getProject } from "@/server/projects";
import { STATUS_META } from "@/components/dashboard/series";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createToken, revokeToken } from "@/server/tokens";

const EXPIRY_OPTIONS = [
  { value: "1h", label: "1 hour" },
  { value: "4h", label: "4 hours" },
  { value: "8h", label: "8 hours" },
  { value: "24h", label: "24 hours" },
  { value: "1w", label: "1 week" },
  { value: "1m", label: "1 month" },
  { value: "1y", label: "1 year" },
  { value: "never", label: "Never" },
] as const;

type IngestTokenForm = {
  name: string;
  expiry: (typeof EXPIRY_OPTIONS)[number]["value"];
};

const DEFAULT_TOKEN_FORM: IngestTokenForm = { name: "", expiry: "24h" };

export function ProjectDetails({
  project,
}: {
  project: Awaited<ReturnType<typeof getProject>>;
}) {
  const { recordings, ingestTokens } = project;
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [createdToken, setCreatedToken] = useState<string | null>(null);
  const createTokenMutation = useMutation({
    mutationFn: (data: IngestTokenForm) =>
      createToken({ data: { projectId: project.id, ...data } }),
    onSuccess: () => router.invalidate(),
  });
  const revokeTokenMutation = useMutation({
    mutationFn: (tokenId: string) => revokeToken({ data: { tokenId } }),
    onSuccess: () => router.invalidate(),
  });

  const form = useForm({
    defaultValues: DEFAULT_TOKEN_FORM,
    onSubmit: async ({ value }) => {
      const { token } = await createTokenMutation.mutateAsync(value);
      form.reset();
      setOpen(false);
      setCreatedToken(token);
    },
  });

  return (
    <div className="h-screen flex-1 overflow-y-auto">
      <div className="mx-auto w-full max-w-[1180px] px-5 py-8 sm:px-8">
        <Link
          to="/projects"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--sea-ink-soft)] no-underline hover:text-[var(--sea-ink)]"
        >
          <IconArrowLeft className="h-4 w-4" /> All projects
        </Link>
        <header className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="island-kicker mb-1.5">Project</p>
            <h1 className="text-[27px] leading-tight font-bold tracking-[-0.02em] text-[var(--sea-ink)]">
              {project.name}
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-[var(--sea-ink-soft)]">
              {project.description || "No description"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--card-dark)] px-4 py-2.5 text-sm font-semibold text-white"
          >
            <IconPlus className="h-4 w-4" stroke={2.4} />
            Create ingest token
          </button>
        </header>

        <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ["Recordings", String(recordings.length)],
            ["Events", String(project.totalEvents)],
            ["Ingest tokens", String(ingestTokens.length)],
            ["Created", project.createdAt.toLocaleDateString()],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-[20px] border border-[var(--line)] bg-[var(--card)] p-4 shadow-[0_10px_24px_rgba(16,18,16,0.04)]"
            >
              <div className="text-[12px] font-medium text-[var(--sea-ink-soft)]">
                {label}
              </div>
              <div className="mt-2 text-xl font-bold tracking-[-0.02em] text-[var(--sea-ink)]">
                {value}
              </div>
            </div>
          ))}
        </div>

        <div className="grid items-start gap-5 lg:grid-cols-[1.25fr_0.75fr]">
          <section className="rounded-[26px] border border-[var(--line)] bg-[var(--card)] p-5 shadow-[0_14px_32px_rgba(16,18,16,0.06)] sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--card-dark)]">
                <IconWaveSine className="h-5 w-5 text-[var(--mint)]" />
              </span>
              <div>
                <h2 className="font-bold text-[var(--sea-ink)]">Recordings</h2>
                <p className="text-[13px] text-[var(--sea-ink-soft)]">
                  {recordings.length} recent recordings
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {recordings.map((recording) => {
                const status = STATUS_META[recording.status];
                return (
                  <div
                    key={recording.id}
                    className="flex items-center gap-3 rounded-2xl bg-[var(--secondary)] px-3.5 py-3"
                  >
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ background: status.color }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[13.5px] font-semibold text-[var(--sea-ink)]">
                        {recording.name}
                      </div>
                      <div className="text-[12px] text-[var(--sea-ink-soft)]">
                        Created {recording.createdAt.toLocaleDateString()}
                      </div>
                    </div>
                    <span className="text-[11.5px] font-semibold text-[var(--sea-ink-soft)]">
                      {status.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="rounded-[26px] border border-[var(--line)] bg-[var(--secondary)] p-5 shadow-[0_14px_32px_rgba(16,18,16,0.06)] sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--violet)]">
                <IconKey className="h-5 w-5 text-[#101210]" />
              </span>
              <div>
                <h2 className="font-bold text-[var(--sea-ink)]">
                  Ingest tokens
                </h2>
                <p className="text-[13px] text-[var(--sea-ink-soft)]">
                  Created for this project
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {ingestTokens.map((token) => (
                <div
                  key={token.id}
                  className="rounded-2xl bg-[var(--card)] p-4"
                >
                  <div className="text-[13.5px] font-semibold text-[var(--sea-ink)]">
                    {token.name}
                  </div>
                  <code className="mt-2 inline-block text-[12px]">
                    ••••{token.tokenSuffix}
                  </code>
                  <div className="mt-2 text-[12px] text-[var(--sea-ink-soft)]">
                    Created {token.createdAt.toLocaleDateString()}
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="xs"
                    className="mt-3"
                    disabled={Boolean(token.revokedAt) || revokeTokenMutation.isPending}
                    onClick={() => {
                      if (window.confirm(`Revoke ${token.name}? This cannot be undone.`)) {
                        revokeTokenMutation.mutate(token.id);
                      }
                    }}
                  >
                    {token.revokedAt ? "Revoked" : "Revoke"}
                  </Button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create ingest token</DialogTitle>
            <DialogDescription>
              Generate a new token to send events into {project.name}.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="flex flex-col gap-4"
          >
            <form.Field
              name="name"
              validators={{
                onChange: ({ value }) =>
                  !value || value.trim().length === 0
                    ? "Name is required"
                    : undefined,
              }}
            >
              {(field) => (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="token-name">Name</Label>
                  <Input
                    id="token-name"
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="e.g. Production server"
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-[12px] text-red-500">
                      {String(field.state.meta.errors[0])}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field name="expiry">
              {(field) => (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="token-expiry">Expiry</Label>
                  <Select
                    value={field.state.value}
                    onValueChange={(v) =>
                      field.handleChange(v as IngestTokenForm["expiry"])
                    }
                  >
                    <SelectTrigger id="token-expiry" className="w-full">
                      <SelectValue placeholder="Select expiry" />
                    </SelectTrigger>
                    <SelectContent>
                      {EXPIRY_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </form.Field>

            <form.Subscribe
              selector={(state) => ({
                canSubmit: state.canSubmit,
                isSubmitting: state.isSubmitting,
              })}
            >
              {({ canSubmit, isSubmitting }) => (
                <DialogFooter className="mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={!canSubmit || isSubmitting}
                    className="bg-[var(--card-dark)] text-white hover:bg-[var(--card-dark)]/90"
                  >
                    Create token
                  </Button>
                </DialogFooter>
              )}
            </form.Subscribe>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={createdToken !== null}
        onOpenChange={(isOpen) => !isOpen && setCreatedToken(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Copy your ingest token</DialogTitle>
            <DialogDescription>
              This is the only time it will be shown. Copy it now and store it securely.
            </DialogDescription>
          </DialogHeader>
          <code className="block break-all rounded-md bg-[var(--secondary)] p-3 text-sm">
            {createdToken}
          </code>
          <DialogFooter>
            <Button
              type="button"
              onClick={() => createdToken && navigator.clipboard.writeText(createdToken)}
            >
              Copy token
            </Button>
            <Button type="button" variant="outline" onClick={() => setCreatedToken(null)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
