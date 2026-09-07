import { Eye, Phone, MapPin } from 'lucide-react';
import type { GlassesPrescription, ContactLensPrescription } from '@/types';

const glassesTypeLabels: Record<string, string> = {
  loin: 'Vision de loin',
  pres: 'Vision de près',
  intermediaire: 'Vision intermédiaire',
  progressive: 'Progressive',
  bifocale: 'Bifocale',
  anti_fatigue: 'Anti-fatigue',
  autre: 'Autre',
};

const contactLensTypeLabels: Record<string, string> = {
  spherique: 'Sphérique',
  torique: 'Torique',
  multifocale: 'Multifocale',
  rgp: 'RGP',
  autre: 'Autre',
};

export function GlassesPrintPreview({ rx, patientAge }: { rx: GlassesPrescription; patientAge: number }) {
  return (
    <div className="mx-auto max-w-[210mm] bg-white p-[15mm] text-black print-page">
      {/* Header */}
      <div className="flex items-start justify-between border-b-2 border-primary pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <Eye className="h-6 w-6 text-primary" strokeWidth={2.2} />
          </div>
          <div>
            <p className="text-xl font-bold tracking-tight text-primary">CENTRE OPHTALMOLOGIQUE</p>
            <p className="text-sm font-medium text-foreground">Dr. Sabeg Ilias</p>
            <p className="text-xs text-muted-foreground">Médecin Spécialiste en Ophtalmologie</p>
          </div>
        </div>
        <div className="text-end text-xs text-muted-foreground">
          <p className="flex items-center gap-1.5 justify-end"><Phone className="h-3 w-3" /> 0564 05 30 72</p>
          <p className="mt-1 flex items-center gap-1.5 justify-end"><MapPin className="h-3 w-3" /> Rue Abbas Laghrour, Khenchela</p>
        </div>
      </div>

      {/* Title */}
      <div className="mt-6 text-center">
        <h2 className="text-lg font-bold uppercase tracking-wider">Prescription de Lunettes</h2>
        <p className="mt-1 text-sm text-muted-foreground">{rx.prescriptionId} · {rx.date}</p>
      </div>

      {/* Patient info */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Patient</p>
          <p className="text-sm font-bold">{rx.patientName}</p>
          <p className="text-xs text-muted-foreground">{patientAge} ans</p>
        </div>
        <div className="text-end">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date</p>
          <p className="text-sm font-medium">{rx.date}</p>
        </div>
      </div>

      {/* Prescription type */}
      <p className="mt-4 text-sm font-bold">Type: {glassesTypeLabels[rx.type] || rx.type}</p>

      {/* OD / OG table */}
      <table className="mt-2 w-full border-collapse text-sm">
        <thead>
          <tr className="border-b-2 border-border bg-muted/20">
            <th className="border border-border px-3 py-2 text-start text-xs font-semibold uppercase text-muted-foreground">Œil</th>
            <th className="border border-border px-3 py-2 text-center text-xs font-semibold uppercase text-muted-foreground">SPH</th>
            <th className="border border-border px-3 py-2 text-center text-xs font-semibold uppercase text-muted-foreground">CYL</th>
            <th className="border border-border px-3 py-2 text-center text-xs font-semibold uppercase text-muted-foreground">AXE</th>
            <th className="border border-border px-3 py-2 text-center text-xs font-semibold uppercase text-muted-foreground">ADD</th>
            <th className="border border-border px-3 py-2 text-center text-xs font-semibold uppercase text-muted-foreground">PRISME</th>
            <th className="border border-border px-3 py-2 text-center text-xs font-semibold uppercase text-muted-foreground">BASE</th>
            <th className="border border-border px-3 py-2 text-center text-xs font-semibold uppercase text-muted-foreground">AV</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-border px-3 py-2 font-bold">OD</td>
            <td className="border border-border px-3 py-2 text-center tabular-nums">{rx.OD.sph || '—'}</td>
            <td className="border border-border px-3 py-2 text-center tabular-nums">{rx.OD.cyl || '—'}</td>
            <td className="border border-border px-3 py-2 text-center tabular-nums">{rx.OD.axis || '—'}</td>
            <td className="border border-border px-3 py-2 text-center tabular-nums">{rx.OD.add || '—'}</td>
            <td className="border border-border px-3 py-2 text-center tabular-nums">{rx.OD.prisme || '—'}</td>
            <td className="border border-border px-3 py-2 text-center tabular-nums">{rx.OD.base || '—'}</td>
            <td className="border border-border px-3 py-2 text-center tabular-nums">{rx.OD.va || '—'}</td>
          </tr>
          <tr>
            <td className="border border-border px-3 py-2 font-bold">OG</td>
            <td className="border border-border px-3 py-2 text-center tabular-nums">{rx.OG.sph || '—'}</td>
            <td className="border border-border px-3 py-2 text-center tabular-nums">{rx.OG.cyl || '—'}</td>
            <td className="border border-border px-3 py-2 text-center tabular-nums">{rx.OG.axis || '—'}</td>
            <td className="border border-border px-3 py-2 text-center tabular-nums">{rx.OG.add || '—'}</td>
            <td className="border border-border px-3 py-2 text-center tabular-nums">{rx.OG.prisme || '—'}</td>
            <td className="border border-border px-3 py-2 text-center tabular-nums">{rx.OG.base || '—'}</td>
            <td className="border border-border px-3 py-2 text-center tabular-nums">{rx.OG.va || '—'}</td>
          </tr>
        </tbody>
      </table>

      {/* Additional fields */}
      <div className="mt-4 grid grid-cols-4 gap-3 text-sm">
        <div><span className="text-muted-foreground">PD: </span><span className="font-medium">{rx.pd || '—'}</span></div>
        <div><span className="text-muted-foreground">PD mono OD: </span><span className="font-medium">{rx.pdMonoOD || '—'}</span></div>
        <div><span className="text-muted-foreground">PD mono OG: </span><span className="font-medium">{rx.pdMonoOG || '—'}</span></div>
        <div><span className="text-muted-foreground">PD de près: </span><span className="font-medium">{rx.pdNear || '—'}</span></div>
        <div><span className="text-muted-foreground">Hauteur OD: </span><span className="font-medium">{rx.heightOD || '—'}</span></div>
        <div><span className="text-muted-foreground">Hauteur OG: </span><span className="font-medium">{rx.heightOG || '—'}</span></div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
        <div><span className="text-muted-foreground">Type de verre: </span><span className="font-medium">{rx.lensType || '—'}</span></div>
        <div><span className="text-muted-foreground">Matériau: </span><span className="font-medium">{rx.material || '—'}</span></div>
        <div><span className="text-muted-foreground">Indice: </span><span className="font-medium">{rx.index || '—'}</span></div>
        <div><span className="text-muted-foreground">Design: </span><span className="font-medium">{rx.design || '—'}</span></div>
        <div><span className="text-muted-foreground">Traitements: </span><span className="font-medium">{rx.treatments || '—'}</span></div>
        <div><span className="text-muted-foreground">Options: </span><span className="font-medium">{rx.options || '—'}</span></div>
      </div>

      {rx.notes && (
        <div className="mt-3 border-t border-border pt-2">
          <p className="text-xs font-semibold uppercase text-muted-foreground">Notes</p>
          <p className="mt-1 text-sm">{rx.notes}</p>
        </div>
      )}

      {/* Signature */}
      <div className="mt-16 flex justify-end">
        <div className="text-center">
          <div className="mb-2 h-16 w-48 border-b border-border" />
          <p className="text-sm font-semibold">Dr. Sabeg Ilias</p>
          <p className="text-xs text-muted-foreground">Médecin Spécialiste en Ophtalmologie</p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 border-t border-border pt-3 text-center">
        <p className="text-xs text-muted-foreground">"Votre Vision, Notre Engagement"</p>
      </div>
    </div>
  );
}

export function ContactLensPrintPreview({ rx, patientAge }: { rx: ContactLensPrescription; patientAge: number }) {
  return (
    <div className="mx-auto max-w-[210mm] bg-white p-[15mm] text-black print-page">
      {/* Header */}
      <div className="flex items-start justify-between border-b-2 border-primary pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <Eye className="h-6 w-6 text-primary" strokeWidth={2.2} />
          </div>
          <div>
            <p className="text-xl font-bold tracking-tight text-primary">CENTRE OPHTALMOLOGIQUE</p>
            <p className="text-sm font-medium text-foreground">Dr. Sabeg Ilias</p>
            <p className="text-xs text-muted-foreground">Médecin Spécialiste en Ophtalmologie</p>
          </div>
        </div>
        <div className="text-end text-xs text-muted-foreground">
          <p className="flex items-center gap-1.5 justify-end"><Phone className="h-3 w-3" /> 0564 05 30 72</p>
          <p className="mt-1 flex items-center gap-1.5 justify-end"><MapPin className="h-3 w-3" /> Rue Abbas Laghrour, Khenchela</p>
        </div>
      </div>

      {/* Title */}
      <div className="mt-6 text-center">
        <h2 className="text-lg font-bold uppercase tracking-wider">Prescription de Lentilles de Contact</h2>
        <p className="mt-1 text-sm text-muted-foreground">{rx.prescriptionId} · {rx.date}</p>
      </div>

      {/* Patient info */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Patient</p>
          <p className="text-sm font-bold">{rx.patientName}</p>
          <p className="text-xs text-muted-foreground">{patientAge} ans</p>
        </div>
        <div className="text-end">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date</p>
          <p className="text-sm font-medium">{rx.date}</p>
        </div>
      </div>

      {/* Type */}
      <p className="mt-4 text-sm font-bold">Type: {contactLensTypeLabels[rx.type] || rx.type}</p>

      {/* OD / OG table */}
      <table className="mt-2 w-full border-collapse text-sm">
        <thead>
          <tr className="border-b-2 border-border bg-muted/20">
            <th className="border border-border px-2 py-2 text-start text-xs font-semibold uppercase text-muted-foreground">Œil</th>
            <th className="border border-border px-2 py-2 text-center text-xs font-semibold uppercase text-muted-foreground">Fabricant</th>
            <th className="border border-border px-2 py-2 text-center text-xs font-semibold uppercase text-muted-foreground">Marque</th>
            <th className="border border-border px-2 py-2 text-center text-xs font-semibold uppercase text-muted-foreground">BC</th>
            <th className="border border-border px-2 py-2 text-center text-xs font-semibold uppercase text-muted-foreground">DIA</th>
            <th className="border border-border px-2 py-2 text-center text-xs font-semibold uppercase text-muted-foreground">Puissance</th>
            <th className="border border-border px-2 py-2 text-center text-xs font-semibold uppercase text-muted-foreground">CYL</th>
            <th className="border border-border px-2 py-2 text-center text-xs font-semibold uppercase text-muted-foreground">Axe</th>
            <th className="border border-border px-2 py-2 text-center text-xs font-semibold uppercase text-muted-foreground">ADD</th>
          </tr>
        </thead>
        <tbody>
          {(['OD', 'OG'] as const).map((side) => {
            const e = rx[side];
            return (
              <tr key={side}>
                <td className="border border-border px-2 py-2 font-bold">{side}</td>
                <td className="border border-border px-2 py-2 text-center">{e.manufacturer || '—'}</td>
                <td className="border border-border px-2 py-2 text-center">{e.brand || '—'}</td>
                <td className="border border-border px-2 py-2 text-center tabular-nums">{e.bc || '—'}</td>
                <td className="border border-border px-2 py-2 text-center tabular-nums">{e.dia || '—'}</td>
                <td className="border border-border px-2 py-2 text-center tabular-nums">{e.power || '—'}</td>
                <td className="border border-border px-2 py-2 text-center tabular-nums">{e.cyl || '—'}</td>
                <td className="border border-border px-2 py-2 text-center tabular-nums">{e.axis || '—'}</td>
                <td className="border border-border px-2 py-2 text-center tabular-nums">{e.add || '—'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Additional info */}
      <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
        <div><span className="text-muted-foreground">Matériau: </span><span className="font-medium">{rx.OD.material || '—'}</span></div>
        <div><span className="text-muted-foreground">Remplacement: </span><span className="font-medium">{rx.OD.replacement || '—'}</span></div>
        <div><span className="text-muted-foreground">Mode de port: </span><span className="font-medium">{rx.OD.wearMode || '—'}</span></div>
      </div>

      {/* Fitting */}
      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Adaptation</p>
        <div className="mt-1 grid grid-cols-3 gap-3 text-sm">
          <div><span className="text-muted-foreground">Lentille d'essai: </span><span className="font-medium">{rx.trialLens || '—'}</span></div>
          <div><span className="text-muted-foreground">Sur-réfraction: </span><span className="font-medium">{rx.overRefraction || '—'}</span></div>
          <div><span className="text-muted-foreground">Mouvement: </span><span className="font-medium">{rx.movement || '—'}</span></div>
          <div><span className="text-muted-foreground">Centration: </span><span className="font-medium">{rx.centration || '—'}</span></div>
          <div><span className="text-muted-foreground">Confort: </span><span className="font-medium">{rx.comfort || '—'}</span></div>
          <div><span className="text-muted-foreground">Film lacrymal: </span><span className="font-medium">{rx.tearFilm || '—'}</span></div>
          <div><span className="text-muted-foreground">Temps de port: </span><span className="font-medium">{rx.wearingTime || '—'}</span></div>
          <div><span className="text-muted-foreground">Lentille finale: </span><span className="font-medium">{rx.finalLens || '—'}</span></div>
          <div><span className="text-muted-foreground">Suivi: </span><span className="font-medium">{rx.followUp || '—'}</span></div>
        </div>
      </div>

      {rx.notes && (
        <div className="mt-3 border-t border-border pt-2">
          <p className="text-xs font-semibold uppercase text-muted-foreground">Notes</p>
          <p className="mt-1 text-sm">{rx.notes}</p>
        </div>
      )}

      {/* Signature */}
      <div className="mt-16 flex justify-end">
        <div className="text-center">
          <div className="mb-2 h-16 w-48 border-b border-border" />
          <p className="text-sm font-semibold">Dr. Sabeg Ilias</p>
          <p className="text-xs text-muted-foreground">Médecin Spécialiste en Ophtalmologie</p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 border-t border-border pt-3 text-center">
        <p className="text-xs text-muted-foreground">"Votre Vision, Notre Engagement"</p>
      </div>
    </div>
  );
}
