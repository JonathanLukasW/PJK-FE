import React from "react";
import { Phone, AlertOctagon } from "lucide-react";
import type { RiskLevel } from "@/types";

interface Contact {
  name: string;
  number: string;
  description: string;
  priority?: "critical" | "normal";
}

const ALL_CONTACTS: Contact[] = [
  {
    name: "Darurat Nasional",
    number: "112",
    description: "Polisi, Ambulans, Pemadam",
    priority: "critical",
  },
  {
    name: "BNPB",
    number: "119",
    description: "Badan Nasional Penanggulangan Bencana",
    priority: "critical",
  },
  {
    name: "SAR Nasional",
    number: "115",
    description: "Pencarian dan Penyelamatan",
    priority: "normal",
  },
  {
    name: "PMI",
    number: "021-7992325",
    description: "Palang Merah Indonesia",
    priority: "normal",
  },
];

interface EmergencyContactsProps {
  riskLevel: RiskLevel;
}

export function EmergencyContacts({ riskLevel }: EmergencyContactsProps) {
  const showAll = riskLevel === "siaga" || riskLevel === "awas";
  const contacts = showAll ? ALL_CONTACTS : ALL_CONTACTS.slice(0, 2);

  return (
    <div className="card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertOctagon className="w-4 h-4 text-red-400" />
          <h3 className="text-sm font-semibold text-white/70">
            Kontak Darurat
          </h3>
        </div>
        {!showAll && (
          <span className="text-[10px] text-white/25">
            +{ALL_CONTACTS.length - 2} lainnya saat siaga
          </span>
        )}
      </div>

      <div className="space-y-2">
        {contacts.map((contact) => (
          <a
            key={contact.number}
            href={`tel:${contact.number.replace(/[^0-9+]/g, "")}`}
            className={`
              flex items-center gap-3 p-3 rounded-lg
              hover:bg-[var(--bg-subtle)] transition-colors group
              ${contact.priority === "critical"
                ? "border border-red-500/15"
                : "border border-white/[0.04]"
              }
            `}
          >
            <div
              className={`
                w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                ${contact.priority === "critical"
                  ? "bg-red-500/10"
                  : "bg-[var(--bg-subtle)]"
                }
              `}
            >
              <Phone
                className={`w-3.5 h-3.5 ${contact.priority === "critical"
                  ? "text-red-400"
                  : "text-white/30"
                  }`}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white/70 group-hover:text-white/90 transition-colors">
                {contact.name}
              </p>
              <p className="text-[10px] text-white/35">{contact.description}</p>
            </div>
            <span
              className={`text-sm font-bold font-mono flex-shrink-0 ${contact.priority === "critical"
                ? "text-red-300"
                : "text-white/50"
                }`}
            >
              {contact.number}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
