"use client";

import { useState } from "react";
import { ExternalLink, FileText, ShieldCheck } from "lucide-react";
import { certificates } from "@/data/certificates";
import { useAsset } from "@/components/ui/AssetsContext";
import { Modal } from "@/components/ui/Modal";
import { ItemButton, PanelShell, StepNav } from "@/components/ui/Panel";
import { Placeholder, SafeImage } from "@/components/ui/SafeImage";
import { useItemSelection } from "@/hooks/useItemSelection";
import { certificateFocus } from "@/lib/stationFocus";
import { formatMonth } from "@/lib/utils";
import type { Certificate } from "@/types/portfolio";

const ids = certificates.map((c) => c.id);

function CertificateViewer({ cert, open, onClose }: { cert: Certificate; open: boolean; onClose: () => void }) {
  const hasPdf = useAsset(cert.pdf);
  return (
    <Modal open={open} onClose={onClose} title={cert.title}>
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-white/10 bg-nexus-bg">
        <SafeImage
          src={cert.previewImage}
          alt={`Preview of the ${cert.title} certificate issued by ${cert.issuer}`}
          className="object-contain"
          sizes="(max-width: 768px) 90vw, 800px"
          fallback={<Placeholder label={`${cert.title} — preview not provided`} />}
        />
      </div>
      <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
        <div>
          <dt className="field-label">Issuer</dt>
          <dd>{cert.issuer}</dd>
        </div>
        <div>
          <dt className="field-label">Issued</dt>
          <dd>{formatMonth(cert.issueDate)}</dd>
        </div>
        {cert.expirationDate && (
          <div>
            <dt className="field-label">Expires</dt>
            <dd>{formatMonth(cert.expirationDate)}</dd>
          </div>
        )}
        {cert.credentialId && (
          <div>
            <dt className="field-label">Credential ID</dt>
            <dd className="font-mono">{cert.credentialId}</dd>
          </div>
        )}
      </dl>
      <div className="mt-4 flex flex-wrap gap-2">
        {hasPdf && cert.pdf && (
          <a href={cert.pdf} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            <FileText size={14} aria-hidden="true" />
            Open original PDF<span className="sr-only"> (opens in a new tab)</span>
          </a>
        )}
        {cert.verificationUrl && (
          <a href={cert.verificationUrl} target="_blank" rel="noopener noreferrer" className="btn">
            <ShieldCheck size={14} aria-hidden="true" />
            Verify credential<span className="sr-only"> (opens in a new tab)</span>
          </a>
        )}
        {!hasPdf && <p className="self-center text-xs text-nexus-muted">The original PDF has not been added yet.</p>}
      </div>
    </Modal>
  );
}

export function CertificatesPanel() {
  const sel = useItemSelection("certificate", "certificates", ids, certificateFocus);
  const [viewing, setViewing] = useState<string | null>(null);
  const viewed = certificates.find((c) => c.id === viewing);

  return (
    <PanelShell station="certificates">
      {certificates.length === 0 && <p className="text-sm text-nexus-muted">Certificates will be added soon.</p>}
      {sel.index < 0 && certificates.length > 0 && <p className="mb-3 text-sm text-nexus-muted">Select a framed certificate, or choose one below.</p>}
      <ol className="space-y-2">
        {certificates.map((c) => {
          const active = sel.selected === c.id;
          return (
            <li key={c.id}>
              <ItemButton active={active} onClick={() => sel.toggle(c.id)} eyebrow={c.issuer} title={c.title} subtitle={`Issued ${formatMonth(c.issueDate)}`} controls={`cert-${c.id}`} />
              <div id={`cert-${c.id}`} hidden={!active} className="mt-2 rounded-xl border border-white/10 p-3 text-sm">
                {active && (
                  <>
                    <dl className="grid gap-1 text-xs text-nexus-muted">
                      <div className="flex gap-2">
                        <dt>Issued:</dt>
                        <dd className="text-nexus-text">{formatMonth(c.issueDate)}</dd>
                      </div>
                      {c.expirationDate && (
                        <div className="flex gap-2">
                          <dt>Expires:</dt>
                          <dd className="text-nexus-text">{formatMonth(c.expirationDate)}</dd>
                        </div>
                      )}
                      {c.credentialId && (
                        <div className="flex gap-2">
                          <dt>Credential ID:</dt>
                          <dd className="font-mono text-nexus-text">{c.credentialId}</dd>
                        </div>
                      )}
                    </dl>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button type="button" className="btn btn-primary !px-3 !py-2" onClick={() => setViewing(c.id)}>
                        Open full certificate
                      </button>
                      {c.verificationUrl && (
                        <a href={c.verificationUrl} target="_blank" rel="noopener noreferrer" className="btn !px-3 !py-2">
                          <ExternalLink size={14} aria-hidden="true" />
                          Verify<span className="sr-only"> (opens in a new tab)</span>
                        </a>
                      )}
                    </div>
                    <StepNav onPrev={sel.prev} onNext={sel.next} onClose={sel.clear} label="Certificates" />
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ol>
      {viewed && <CertificateViewer cert={viewed} open onClose={() => setViewing(null)} />}
    </PanelShell>
  );
}
