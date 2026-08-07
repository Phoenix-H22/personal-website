import type { ReactElement } from "react";

/**
 * Unique, self-contained animated SVG diagrams for the "how it works" flip
 * cards, keyed by `<slug>:<code>`. Each illustrates one project's specific
 * mechanism with looping SMIL animation. See orbit-dossiers.ts for the
 * matching mechanic copy.
 */

// prettier-ignore
const DIAGRAMS: Record<string, () => ReactElement> = {
  "warqah-store:0x01": () => (
    <svg viewBox="0 0 240 132" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Async fulfillment pipeline">
      <path id="wa01flow" d="M 42 50 L 198 50" fill="none" stroke="none" />
      <line x1="70" y1="50" x2="86" y2="50" stroke="rgba(139,171,204,0.28)" strokeWidth="1.3" />
      <path d="M 86 47 L 92 50 L 86 53 Z" fill="#8ea6b4" />
      <line x1="148" y1="50" x2="164" y2="50" stroke="rgba(139,171,204,0.28)" strokeWidth="1.3" />
      <path d="M 164 47 L 170 50 L 164 53 Z" fill="#8ea6b4" />
      <path d="M 198 66 C 190 92, 130 92, 120 66" fill="none" stroke="#d8ad65" strokeWidth="1.3" strokeDasharray="3 3" strokeLinecap="round" />
      <path d="M 117 71 L 120 65 L 123 71 Z" fill="#d8ad65" />
      <text x="159" y="90" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="8.5" fill="#8ea6b4">RETRY</text>
      <rect x="14" y="35" width="56" height="30" rx="6" fill="rgba(7,25,31,0.55)" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <rect x="92" y="35" width="56" height="30" rx="6" fill="rgba(7,25,31,0.55)" stroke="#31e6d0" strokeWidth="1.4" />
      <rect x="170" y="35" width="56" height="30" rx="6" fill="rgba(7,25,31,0.55)" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <text x="42" y="53.7" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="10.5" fill="#f4f7fb">VALIDATE</text>
      <text x="120" y="53.7" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="10.5" fill="#63f0de">QUEUE</text>
      <text x="198" y="53.7" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="10.5" fill="#f4f7fb">FULFILL</text>
      <text x="120" y="107" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="8.5" fill="#8ea6b4">Validated callback, retry-safe jobs</text>
      <circle r="3.2" fill="#63f0de">
        <animateMotion dur="3s" repeatCount="indefinite">
          <mpath href="#wa01flow" />
        </animateMotion>
      </circle>
    </svg>
  ),
  "warqah-store:0x02": () => (
    <svg viewBox="0 0 240 132" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Concurrency-safe inventory">
      <path id="wa02flow" d="M 44 39 C 80 41, 98 52, 124 58 L 198 58" fill="none" stroke="none" />
      <line x1="69" y1="40" x2="94" y2="50" stroke="rgba(139,171,204,0.28)" strokeWidth="1.3" />
      <path d="M 90 48 L 98 52 L 90 54 Z" fill="#8ea6b4" />
      <line x1="69" y1="76" x2="94" y2="66" stroke="rgba(139,171,204,0.28)" strokeWidth="1.3" />
      <path d="M 90 62 L 98 64 L 90 68 Z" fill="#8ea6b4" />
      <line x1="150" y1="58" x2="167" y2="58" stroke="rgba(139,171,204,0.28)" strokeWidth="1.3" />
      <path d="M 167 55 L 173 58 L 167 61 Z" fill="#8ea6b4" />
      <rect x="19" y="27" width="50" height="24" rx="6" fill="rgba(7,25,31,0.55)" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <rect x="19" y="65" width="50" height="24" rx="6" fill="rgba(7,25,31,0.55)" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <rect x="98" y="43" width="52" height="30" rx="6" fill="rgba(7,25,31,0.55)" stroke="#31e6d0" strokeWidth="1.4" />
      <rect x="173" y="43" width="50" height="30" rx="6" fill="rgba(7,25,31,0.55)" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <text x="44" y="42.5" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="10" fill="#cfdae3">ORDER A</text>
      <text x="44" y="80.5" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="10" fill="#cfdae3">ORDER B</text>
      <text x="124" y="61.5" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="10.5" fill="#63f0de">ROW LOCK</text>
      <text x="198" y="61.5" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="10.5" fill="#f4f7fb">STOCK</text>
      <text x="120" y="107" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="8.5" fill="#8ea6b4">Locked update, no oversell</text>
      <circle r="3.2" fill="#63f0de">
        <animateMotion dur="3.2s" repeatCount="indefinite">
          <mpath href="#wa02flow" />
        </animateMotion>
      </circle>
    </svg>
  ),
  "warqah-store:0x03": () => (
    <svg viewBox="0 0 240 132" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Idempotent shipping handoff">
      <path id="wa03flow" d="M 42 50 L 198 50" fill="none" stroke="none" />
      <path d="M 42 35 C 72 21, 168 21, 198 35" fill="none" stroke="#31e6d0" strokeWidth="1.3" strokeDasharray="3 3" strokeLinecap="round" />
      <path d="M 195 30 L 198 36 L 201 30 Z" fill="#31e6d0" />
      <text x="120" y="31" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="8.5" fill="#63f0de">SKIP</text>
      <line x1="70" y1="50" x2="86" y2="50" stroke="rgba(139,171,204,0.28)" strokeWidth="1.3" />
      <path d="M 86 47 L 92 50 L 86 53 Z" fill="#8ea6b4" />
      <line x1="148" y1="50" x2="164" y2="50" stroke="rgba(139,171,204,0.28)" strokeWidth="1.3" />
      <path d="M 164 47 L 170 50 L 164 53 Z" fill="#8ea6b4" />
      <rect x="14" y="35" width="56" height="30" rx="6" fill="rgba(7,25,31,0.55)" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <rect x="92" y="35" width="56" height="30" rx="6" fill="rgba(7,25,31,0.55)" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <rect x="170" y="35" width="56" height="30" rx="6" fill="rgba(7,25,31,0.55)" stroke="#31e6d0" strokeWidth="1.4" />
      <text x="42" y="53.7" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="10.5" fill="#f4f7fb">ORDER</text>
      <text x="120" y="53.7" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="10" fill="#f4f7fb">BOSTA API</text>
      <text x="198" y="53.7" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="10" fill="#63f0de">TRACKING</text>
      <text x="120" y="107" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="8.5" fill="#8ea6b4">Skip if tracked, retry on fail</text>
      <circle r="3.2" fill="#63f0de">
        <animateMotion dur="2.8s" repeatCount="indefinite">
          <mpath href="#wa03flow" />
        </animateMotion>
      </circle>
    </svg>
  ),
  "smart-lockers-platform:0x01": () => (
    <svg viewBox="0 0 240 132" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Command state machine">
      <path id="sl01flow" d="M 42 50 L 198 50" fill="none" stroke="none" />
      <path d="M 108 35 C 100 22, 140 22, 132 35" fill="none" stroke="#78aefb" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M 129 30 L 132 36 L 135 30 Z" fill="#78aefb" />
      <line x1="70" y1="50" x2="86" y2="50" stroke="rgba(139,171,204,0.28)" strokeWidth="1.3" />
      <path d="M 86 47 L 92 50 L 86 53 Z" fill="#8ea6b4" />
      <line x1="148" y1="50" x2="164" y2="50" stroke="rgba(139,171,204,0.28)" strokeWidth="1.3" />
      <path d="M 164 47 L 170 50 L 164 53 Z" fill="#8ea6b4" />
      <rect x="14" y="35" width="56" height="30" rx="6" fill="rgba(7,25,31,0.55)" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <rect x="92" y="35" width="56" height="30" rx="6" fill="rgba(7,25,31,0.55)" stroke="#78aefb" strokeWidth="1.4" />
      <rect x="170" y="35" width="56" height="30" rx="6" fill="rgba(7,25,31,0.55)" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <text x="42" y="53.7" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="10.5" fill="#f4f7fb">QUEUED</text>
      <text x="120" y="53.7" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="10.5" fill="#78aefb">SENT</text>
      <text x="198" y="53.7" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="10.5" fill="#f4f7fb">DONE</text>
      <text x="120" y="107" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="8.5" fill="#8ea6b4">Ack, timeout, backoff retry</text>
      <circle r="3.2" fill="#63f0de">
        <animateMotion dur="3s" repeatCount="indefinite">
          <mpath href="#sl01flow" />
        </animateMotion>
      </circle>
    </svg>
  ),
  "smart-lockers-platform:0x02": () => (
    <svg viewBox="0 0 240 132" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="HMAC-signed API boundary">
      <path id="sl02flow" d="M 42 44 L 198 44" fill="none" stroke="none" />
      <line x1="70" y1="44" x2="86" y2="44" stroke="rgba(139,171,204,0.28)" strokeWidth="1.3" />
      <path d="M 86 41 L 92 44 L 86 47 Z" fill="#8ea6b4" />
      <line x1="148" y1="44" x2="164" y2="44" stroke="rgba(139,171,204,0.28)" strokeWidth="1.3" />
      <path d="M 164 41 L 170 44 L 164 47 Z" fill="#8ea6b4" />
      <line x1="120" y1="59" x2="120" y2="74" stroke="#e08c8c" strokeWidth="1.3" strokeDasharray="3 3" />
      <path d="M 117 74 L 120 80 L 123 74 Z" fill="#e08c8c" />
      <rect x="14" y="29" width="56" height="30" rx="6" fill="rgba(7,25,31,0.55)" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <rect x="92" y="29" width="56" height="30" rx="6" fill="rgba(7,25,31,0.55)" stroke="#31e6d0" strokeWidth="1.4" />
      <rect x="170" y="29" width="56" height="30" rx="6" fill="rgba(7,25,31,0.55)" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <rect x="97" y="80" width="46" height="24" rx="6" fill="rgba(7,25,31,0.55)" stroke="#e08c8c" strokeWidth="1.4" />
      <text x="42" y="47.7" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="10" fill="#f4f7fb">REQUEST</text>
      <text x="120" y="47.7" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="10.5" fill="#63f0de">VERIFY</text>
      <text x="198" y="47.7" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="10" fill="#f4f7fb">TENANT API</text>
      <text x="120" y="95.5" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="10" fill="#e08c8c">DENY</text>
      <text x="120" y="114" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="8.5" fill="#8ea6b4">HMAC, nonce, timestamp</text>
      <circle r="3.2" fill="#63f0de">
        <animateMotion dur="3.4s" repeatCount="indefinite">
          <mpath href="#sl02flow" />
        </animateMotion>
      </circle>
    </svg>
  ),
  "smart-lockers-platform:0x03": () => (
    <svg viewBox="0 0 240 132" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="MQTT device agent">
      <path id="sl03flow" d="M 42 50 L 198 50" fill="none" stroke="none" />
      <line x1="70" y1="50" x2="86" y2="50" stroke="rgba(139,171,204,0.28)" strokeWidth="1.3" />
      <path d="M 86 47 L 92 50 L 86 53 Z" fill="#8ea6b4" />
      <line x1="148" y1="50" x2="164" y2="50" stroke="rgba(139,171,204,0.28)" strokeWidth="1.3" strokeDasharray="3 3" />
      <path d="M 164 47 L 170 50 L 164 53 Z" fill="#8ea6b4" />
      <rect x="14" y="35" width="56" height="30" rx="6" fill="rgba(7,25,31,0.55)" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <rect x="92" y="35" width="56" height="30" rx="6" fill="rgba(7,25,31,0.55)" stroke="#31e6d0" strokeWidth="1.4" />
      <rect x="170" y="35" width="56" height="30" rx="6" fill="rgba(7,25,31,0.55)" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <text x="42" y="53.7" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="10" fill="#f4f7fb">PLATFORM</text>
      <text x="120" y="53.7" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="10.5" fill="#63f0de">MQTT</text>
      <text x="198" y="53.7" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="10" fill="#f4f7fb">PI AGENT</text>
      <circle cx="198" cy="30" r="2.4" fill="#91d98a" />
      <circle cx="198" cy="30" r="2.4" fill="none" stroke="#91d98a" strokeWidth="1.3">
        <animate attributeName="r" values="2.4;9" dur="1.8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.9;0" dur="1.8s" repeatCount="indefinite" />
      </circle>
      <text x="120" y="107" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="8.5" fill="#8ea6b4">MQTT QoS 1, heartbeat online</text>
      <circle r="3.2" fill="#63f0de">
        <animateMotion dur="2.6s" repeatCount="indefinite">
          <mpath href="#sl03flow" />
        </animateMotion>
      </circle>
    </svg>
  ),
  "wasfaty-smart-vending:0x01": () => (
    <svg viewBox="0 0 240 132" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Transaction state machine">
      <path id="wf01path" d="M 50 41 L 190 41 L 190 91 L 50 91" fill="none" stroke="none" />
      <line x1="84" y1="41" x2="151" y2="41" stroke="#8ea6b4" strokeWidth="1.4" />
      <path d="M 157 41 l -7 -4 l 0 8 z" fill="#8ea6b4" />
      <line x1="190" y1="57" x2="190" y2="69" stroke="#8ea6b4" strokeWidth="1.4" />
      <path d="M 190 75 l -4 -7 l 8 0 z" fill="#8ea6b4" />
      <line x1="156" y1="91" x2="90" y2="91" stroke="#8ea6b4" strokeWidth="1.4" />
      <path d="M 83 91 l 7 -4 l 0 8 z" fill="#8ea6b4" />
      <rect x="18" y="26" width="64" height="30" rx="6" fill="rgba(7,25,31,0.55)" stroke="#31e6d0" strokeWidth="1.4" />
      <rect x="158" y="26" width="64" height="30" rx="6" fill="rgba(7,25,31,0.55)" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <rect x="158" y="76" width="64" height="30" rx="6" fill="rgba(7,25,31,0.55)" stroke="#78aefb" strokeWidth="1.4" />
      <rect x="18" y="76" width="64" height="30" rx="6" fill="rgba(7,25,31,0.55)" stroke="#91d98a" strokeWidth="1.4" />
      <text x="50" y="41" textAnchor="middle" dominantBaseline="central" fontFamily="ui-monospace, monospace" fontSize="10" fill="#f4f7fb">INIT</text>
      <text x="190" y="41" textAnchor="middle" dominantBaseline="central" fontFamily="ui-monospace, monospace" fontSize="10" fill="#f4f7fb">QUEUED</text>
      <text x="190" y="91" textAnchor="middle" dominantBaseline="central" fontFamily="ui-monospace, monospace" fontSize="10" fill="#f4f7fb">DISPENSING</text>
      <text x="50" y="91" textAnchor="middle" dominantBaseline="central" fontFamily="ui-monospace, monospace" fontSize="10" fill="#f4f7fb">SUCCESS</text>
      <text x="120" y="66" textAnchor="middle" dominantBaseline="central" fontFamily="ui-monospace, monospace" fontSize="8.5" fill="#8ea6b4">AUDIT LOGGED</text>
      <circle r="3.2" fill="#63f0de">
        <animateMotion dur="3s" repeatCount="indefinite">
          <mpath href="#wf01path" />
        </animateMotion>
      </circle>
    </svg>
  ),
  "wasfaty-smart-vending:0x02": () => (
    <svg viewBox="0 0 240 132" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Callback reconciliation">
      <path id="wf02path" d="M 45 67 L 108 67 L 108 39 L 150 39" fill="none" stroke="none" />
      <line x1="74" y1="67" x2="104" y2="67" stroke="#8ea6b4" strokeWidth="1.4" />
      <line x1="108" y1="63" x2="108" y2="39" stroke="#8ea6b4" strokeWidth="1.4" />
      <line x1="108" y1="39" x2="144" y2="39" stroke="#8ea6b4" strokeWidth="1.4" />
      <path d="M 150 39 l -7 -4 l 0 8 z" fill="#91d98a" />
      <line x1="108" y1="71" x2="108" y2="95" stroke="#8ea6b4" strokeWidth="1.4" />
      <line x1="108" y1="95" x2="144" y2="95" stroke="#8ea6b4" strokeWidth="1.4" />
      <path d="M 150 95 l -7 -4 l 0 8 z" fill="#e08c8c" />
      <circle cx="108" cy="67" r="4" fill="rgba(7,25,31,0.55)" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <rect x="16" y="52" width="58" height="30" rx="6" fill="rgba(7,25,31,0.55)" stroke="#78aefb" strokeWidth="1.4" />
      <rect x="150" y="24" width="64" height="30" rx="6" fill="rgba(7,25,31,0.55)" stroke="#91d98a" strokeWidth="1.4" />
      <rect x="150" y="80" width="64" height="30" rx="6" fill="rgba(7,25,31,0.55)" stroke="#e08c8c" strokeWidth="1.4" />
      <text x="45" y="67" textAnchor="middle" dominantBaseline="central" fontFamily="ui-monospace, monospace" fontSize="10" fill="#f4f7fb">MACHINE</text>
      <text x="182" y="39" textAnchor="middle" dominantBaseline="central" fontFamily="ui-monospace, monospace" fontSize="10" fill="#f4f7fb">SUCCESS</text>
      <text x="182" y="95" textAnchor="middle" dominantBaseline="central" fontFamily="ui-monospace, monospace" fontSize="10" fill="#f4f7fb">FAILURE</text>
      <text x="89" y="59" textAnchor="middle" dominantBaseline="central" fontFamily="ui-monospace, monospace" fontSize="8.5" fill="#8ea6b4">CALLBACK</text>
      <circle r="3.2" fill="#63f0de">
        <animateMotion dur="3.2s" repeatCount="indefinite">
          <mpath href="#wf02path" />
        </animateMotion>
      </circle>
    </svg>
  ),
  "wasfaty-smart-vending:0x03": () => (
    <svg viewBox="0 0 240 132" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Resilient external integration">
      <path id="wf03path" d="M 40 67 L 197 67" fill="none" stroke="none" />
      <path d="M 197 52 C 197 26 130 26 119 51" fill="none" stroke="#d8ad65" strokeWidth="1.4" />
      <path d="M 119 52 l -4 -7 l 8 0 z" fill="#d8ad65" />
      <line x1="64" y1="67" x2="84" y2="67" stroke="#8ea6b4" strokeWidth="1.4" />
      <path d="M 89 67 l -7 -4 l 0 8 z" fill="#8ea6b4" />
      <line x1="148" y1="67" x2="162" y2="67" stroke="#8ea6b4" strokeWidth="1.4" />
      <path d="M 167 67 l -7 -4 l 0 8 z" fill="#8ea6b4" />
      <rect x="16" y="52" width="48" height="30" rx="6" fill="rgba(7,25,31,0.55)" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <rect x="90" y="52" width="58" height="30" rx="6" fill="rgba(7,25,31,0.55)" stroke="#31e6d0" strokeWidth="1.4" />
      <rect x="168" y="52" width="58" height="30" rx="6" fill="rgba(7,25,31,0.55)" stroke="#78aefb" strokeWidth="1.4" />
      <text x="40" y="67" textAnchor="middle" dominantBaseline="central" fontFamily="ui-monospace, monospace" fontSize="10" fill="#f4f7fb">APP</text>
      <text x="119" y="67" textAnchor="middle" dominantBaseline="central" fontFamily="ui-monospace, monospace" fontSize="10" fill="#f4f7fb">OAUTH2</text>
      <text x="197" y="67" textAnchor="middle" dominantBaseline="central" fontFamily="ui-monospace, monospace" fontSize="10" fill="#f4f7fb">WASFATY</text>
      <text x="158" y="23" textAnchor="middle" dominantBaseline="central" fontFamily="ui-monospace, monospace" fontSize="8.5" fill="#d8ad65">RETRY</text>
      <circle r="3.2" fill="#63f0de">
        <animateMotion dur="2.8s" repeatCount="indefinite">
          <mpath href="#wf03path" />
        </animateMotion>
      </circle>
    </svg>
  ),
  "your-obour-guide:0x01": () => (
    <svg viewBox="0 0 240 132" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Place data pipeline">
      <path id="ob01path" d="M 44 67 L 197 67" fill="none" stroke="none" />
      <line x1="72" y1="67" x2="86" y2="67" stroke="#8ea6b4" strokeWidth="1.4" />
      <path d="M 91 67 l -7 -4 l 0 8 z" fill="#8ea6b4" />
      <line x1="148" y1="67" x2="162" y2="67" stroke="#8ea6b4" strokeWidth="1.4" />
      <path d="M 167 67 l -7 -4 l 0 8 z" fill="#8ea6b4" />
      <rect x="16" y="52" width="56" height="30" rx="6" fill="rgba(7,25,31,0.55)" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <rect x="92" y="52" width="56" height="30" rx="6" fill="rgba(7,25,31,0.55)" stroke="#d8ad65" strokeWidth="1.4" />
      <rect x="168" y="52" width="58" height="30" rx="6" fill="rgba(7,25,31,0.55)" stroke="#91d98a" strokeWidth="1.4" />
      <text x="44" y="67" textAnchor="middle" dominantBaseline="central" fontFamily="ui-monospace, monospace" fontSize="10" fill="#f4f7fb">RAW DATA</text>
      <text x="120" y="67" textAnchor="middle" dominantBaseline="central" fontFamily="ui-monospace, monospace" fontSize="10" fill="#f4f7fb">REVIEW</text>
      <text x="197" y="67" textAnchor="middle" dominantBaseline="central" fontFamily="ui-monospace, monospace" fontSize="10" fill="#f4f7fb">LIVE</text>
      <text x="120" y="42" textAnchor="middle" dominantBaseline="central" fontFamily="ui-monospace, monospace" fontSize="8.5" fill="#8ea6b4">DEDUP · APPROVE</text>
      <circle r="3.2" fill="#63f0de">
        <animateMotion dur="3s" repeatCount="indefinite">
          <mpath href="#ob01path" />
        </animateMotion>
      </circle>
    </svg>
  ),
  "your-obour-guide:0x02": () => (
    <svg viewBox="0 0 240 132" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Signed CDN media delivery">
      <path id="ob02path" d="M 45 41 L 182 41 L 182 95 L 120 95" fill="none" stroke="none" />
      <line x1="74" y1="41" x2="144" y2="41" stroke="#8ea6b4" strokeWidth="1.4" />
      <path d="M 149 41 l -7 -4 l 0 8 z" fill="#8ea6b4" />
      <line x1="182" y1="57" x2="182" y2="95" stroke="#8ea6b4" strokeWidth="1.4" />
      <line x1="182" y1="95" x2="158" y2="95" stroke="#8ea6b4" strokeWidth="1.4" />
      <path d="M 153 95 l 7 -4 l 0 8 z" fill="#8ea6b4" />
      <rect x="178" y="28" width="8" height="6" rx="1" fill="none" stroke="#63f0de" strokeWidth="1.2" />
      <path d="M 179.5 28 a 2.5 2.5 0 0 1 5 0" fill="none" stroke="#63f0de" strokeWidth="1.2" />
      <rect x="16" y="26" width="58" height="30" rx="6" fill="rgba(7,25,31,0.55)" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <rect x="150" y="26" width="64" height="30" rx="6" fill="rgba(7,25,31,0.55)" stroke="#31e6d0" strokeWidth="1.4" />
      <rect x="88" y="80" width="64" height="30" rx="6" fill="rgba(7,25,31,0.55)" stroke="#78aefb" strokeWidth="1.4" />
      <text x="45" y="41" textAnchor="middle" dominantBaseline="central" fontFamily="ui-monospace, monospace" fontSize="10" fill="#f4f7fb">DB KEY</text>
      <text x="182" y="41" textAnchor="middle" dominantBaseline="central" fontFamily="ui-monospace, monospace" fontSize="10" fill="#f4f7fb">SIGNED</text>
      <text x="120" y="95" textAnchor="middle" dominantBaseline="central" fontFamily="ui-monospace, monospace" fontSize="10" fill="#f4f7fb">CLIENT</text>
      <text x="150" y="70" textAnchor="middle" dominantBaseline="central" fontFamily="ui-monospace, monospace" fontSize="8.5" fill="#8ea6b4">EXPIRES</text>
      <circle r="3.2" fill="#63f0de">
        <animateMotion dur="3.2s" repeatCount="indefinite">
          <mpath href="#ob02path" />
        </animateMotion>
      </circle>
    </svg>
  ),
  "your-obour-guide:0x03": () => (
    <svg viewBox="0 0 240 132" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Unified API and moderation layer">
      <path id="ob03path" d="M 46 65 L 120 65 L 194 66" fill="none" stroke="none" />
      <line x1="76" y1="65" x2="112" y2="65" stroke="#8ea6b4" strokeWidth="1.4" />
      <line x1="128" y1="63" x2="163" y2="34" stroke="#8ea6b4" strokeWidth="1.4" />
      <path d="M 166 32 l -8 -1 l 3 8 z" fill="#8ea6b4" />
      <line x1="128" y1="65" x2="163" y2="66" stroke="#8ea6b4" strokeWidth="1.4" />
      <path d="M 166 66 l -7 -4 l 0 8 z" fill="#8ea6b4" />
      <line x1="128" y1="67" x2="163" y2="98" stroke="#8ea6b4" strokeWidth="1.4" />
      <path d="M 166 100 l -8 1 l 3 -8 z" fill="#8ea6b4" />
      <path d="M 120 58 L 128 65 L 120 72 L 112 65 Z" fill="rgba(7,25,31,0.55)" stroke="#d8ad65" strokeWidth="1.4" />
      <rect x="16" y="48" width="60" height="34" rx="6" fill="rgba(7,25,31,0.55)" stroke="#31e6d0" strokeWidth="1.4" />
      <rect x="166" y="19" width="56" height="26" rx="6" fill="rgba(7,25,31,0.55)" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <rect x="166" y="53" width="56" height="26" rx="6" fill="rgba(7,25,31,0.55)" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <rect x="166" y="87" width="56" height="26" rx="6" fill="rgba(7,25,31,0.55)" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <text x="46" y="65" textAnchor="middle" dominantBaseline="central" fontFamily="ui-monospace, monospace" fontSize="11" fill="#f4f7fb">API</text>
      <text x="194" y="32" textAnchor="middle" dominantBaseline="central" fontFamily="ui-monospace, monospace" fontSize="10" fill="#f4f7fb">APP</text>
      <text x="194" y="66" textAnchor="middle" dominantBaseline="central" fontFamily="ui-monospace, monospace" fontSize="10" fill="#f4f7fb">WEB</text>
      <text x="194" y="100" textAnchor="middle" dominantBaseline="central" fontFamily="ui-monospace, monospace" fontSize="10" fill="#f4f7fb">ADMIN</text>
      <text x="120" y="82" textAnchor="middle" dominantBaseline="central" fontFamily="ui-monospace, monospace" fontSize="8.5" fill="#d8ad65">MODERATE</text>
      <circle r="3.2" fill="#63f0de">
        <animateMotion dur="3s" repeatCount="indefinite">
          <mpath href="#ob03path" />
        </animateMotion>
      </circle>
    </svg>
  ),
  "nabd:0x01": () => (
    <svg viewBox="0 0 240 132" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Isolated channel services" fontFamily="ui-monospace, monospace">
      <path id="nb01path" d="M76 58 C 110 50, 122 42, 148 38" fill="none" stroke="none" />
      <rect x="18" y="46" width="58" height="32" rx="6" fill="rgba(7,25,31,0.55)" stroke="#31e6d0" strokeWidth="1.4" />
      <rect x="150" y="24" width="62" height="26" rx="6" fill="rgba(7,25,31,0.55)" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <rect x="150" y="72" width="62" height="26" rx="6" fill="rgba(7,25,31,0.55)" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <path d="M76 58 C 110 50, 122 42, 146 38" fill="none" stroke="#31e6d0" strokeWidth="1.4" />
      <path d="M150 37 L143 33.5 L143 40.5 Z" fill="#31e6d0" />
      <path d="M76 66 C 108 74, 120 80, 146 84" fill="none" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <path d="M150 85 L143 81.5 L143 88.5 Z" fill="rgba(139,171,204,0.28)" />
      <text x="47" y="62" textAnchor="middle" dominantBaseline="central" fontSize="11" fill="#f4f7fb">CONTROL</text>
      <text x="181" y="37" textAnchor="middle" dominantBaseline="central" fontSize="10.5" fill="#f4f7fb">WHATSAPP</text>
      <text x="181" y="85" textAnchor="middle" dominantBaseline="central" fontSize="10.5" fill="#f4f7fb">TELEGRAM</text>
      <text x="120" y="110" textAnchor="middle" dominantBaseline="central" fontSize="8.5" fill="#8ea6b4">ISOLATED CHANNELS</text>
      <circle r="3.2" fill="#63f0de">
        <animateMotion dur="3s" repeatCount="indefinite">
          <mpath href="#nb01path" />
        </animateMotion>
      </circle>
    </svg>
  ),
  "nabd:0x02": () => (
    <svg viewBox="0 0 240 132" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Queue with retry recovery" fontFamily="ui-monospace, monospace">
      <path id="nb02path" d="M70 65 L168 65" fill="none" stroke="none" />
      <rect x="16" y="50" width="54" height="30" rx="6" fill="rgba(7,25,31,0.55)" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <rect x="94" y="50" width="54" height="30" rx="6" fill="rgba(7,25,31,0.55)" stroke="#31e6d0" strokeWidth="1.4" />
      <rect x="170" y="50" width="54" height="30" rx="6" fill="rgba(7,25,31,0.55)" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <path d="M70 65 L91 65" fill="none" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <path d="M94 65 L87 61.5 L87 68.5 Z" fill="rgba(139,171,204,0.28)" />
      <path d="M148 65 L167 65" fill="none" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <path d="M170 65 L163 61.5 L163 68.5 Z" fill="rgba(139,171,204,0.28)" />
      <path d="M197 80 C 197 104, 121 104, 121 82" fill="none" stroke="#d8ad65" strokeWidth="1.4" strokeDasharray="4 3" />
      <path d="M121 80 L117.5 87 L124.5 87 Z" fill="#d8ad65" />
      <text x="43" y="65" textAnchor="middle" dominantBaseline="central" fontSize="11" fill="#f4f7fb">EVENTS</text>
      <text x="121" y="65" textAnchor="middle" dominantBaseline="central" fontSize="11" fill="#f4f7fb">QUEUE</text>
      <text x="197" y="65" textAnchor="middle" dominantBaseline="central" fontSize="11" fill="#f4f7fb">WORKERS</text>
      <text x="120" y="36" textAnchor="middle" dominantBaseline="central" fontSize="8.5" fill="#8ea6b4">REDIS · SUPERVISOR</text>
      <text x="159" y="99" textAnchor="middle" dominantBaseline="central" fontSize="8.5" fill="#d8ad65">RETRY</text>
      <circle r="3.2" fill="#63f0de">
        <animateMotion dur="2.8s" repeatCount="indefinite">
          <mpath href="#nb02path" />
        </animateMotion>
      </circle>
    </svg>
  ),
  "nabd:0x03": () => (
    <svg viewBox="0 0 240 132" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Multi-tenant commerce routing" fontFamily="ui-monospace, monospace">
      <path id="nb03path" d="M68 42 L92 58 L120 66 L172 65" fill="none" stroke="none" />
      <rect x="16" y="26" width="52" height="26" rx="6" fill="rgba(7,25,31,0.55)" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <rect x="16" y="80" width="52" height="26" rx="6" fill="rgba(7,25,31,0.55)" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <rect x="92" y="50" width="56" height="32" rx="6" fill="rgba(7,25,31,0.55)" stroke="#31e6d0" strokeWidth="1.4" />
      <rect x="172" y="50" width="52" height="30" rx="6" fill="rgba(7,25,31,0.55)" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <path d="M68 44 L90 57" fill="none" stroke="#31e6d0" strokeWidth="1.4" />
      <path d="M92 58 L85 54.5 L85 61.5 Z" fill="#31e6d0" />
      <path d="M68 88 L90 75" fill="none" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <path d="M92 74 L85 70.5 L85 77.5 Z" fill="rgba(139,171,204,0.28)" />
      <path d="M148 66 L170 65" fill="none" stroke="#31e6d0" strokeWidth="1.4" />
      <path d="M172 65 L165 61.5 L165 68.5 Z" fill="#31e6d0" />
      <text x="42" y="39" textAnchor="middle" dominantBaseline="central" fontSize="11" fill="#f4f7fb">SALLA</text>
      <text x="42" y="93" textAnchor="middle" dominantBaseline="central" fontSize="11" fill="#f4f7fb">ZID</text>
      <text x="120" y="66" textAnchor="middle" dominantBaseline="central" fontSize="11" fill="#f4f7fb">TENANT</text>
      <text x="198" y="65" textAnchor="middle" dominantBaseline="central" fontSize="10.5" fill="#f4f7fb">MESSAGE</text>
      <text x="120" y="112" textAnchor="middle" dominantBaseline="central" fontSize="8.5" fill="#8ea6b4">SIGNED WEBHOOKS</text>
      <circle r="3.2" fill="#63f0de">
        <animateMotion dur="3.2s" repeatCount="indefinite">
          <mpath href="#nb03path" />
        </animateMotion>
      </circle>
    </svg>
  ),
  "autopay-eg:0x01": () => (
    <svg viewBox="0 0 240 132" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Payment matching engine" fontFamily="ui-monospace, monospace">
      <path id="ap01path" d="M70 65 L120 65 C 150 65, 164 86, 170 90" fill="none" stroke="none" />
      <rect x="16" y="50" width="54" height="30" rx="6" fill="rgba(7,25,31,0.55)" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <rect x="92" y="48" width="56" height="34" rx="6" fill="rgba(7,25,31,0.55)" stroke="#31e6d0" strokeWidth="1.4" />
      <rect x="170" y="24" width="54" height="26" rx="6" fill="rgba(7,25,31,0.55)" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <rect x="170" y="80" width="54" height="26" rx="6" fill="rgba(7,25,31,0.55)" stroke="#91d98a" strokeWidth="1.4" />
      <path d="M70 65 L90 65" fill="none" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <path d="M92 65 L85 61.5 L85 68.5 Z" fill="rgba(139,171,204,0.28)" />
      <path d="M168 44 L150 52" fill="none" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <path d="M148 52 L155 48.5 L155 55.5 Z" fill="rgba(139,171,204,0.28)" />
      <path d="M146 74 L168 89" fill="none" stroke="#91d98a" strokeWidth="1.4" />
      <path d="M170 90 L163 86.5 L163 93.5 Z" fill="#91d98a" />
      <text x="43" y="65" textAnchor="middle" dominantBaseline="central" fontSize="10.5" fill="#f4f7fb">TRANSFER</text>
      <text x="120" y="65" textAnchor="middle" dominantBaseline="central" fontSize="11" fill="#f4f7fb">MATCH</text>
      <text x="197" y="37" textAnchor="middle" dominantBaseline="central" fontSize="10.5" fill="#f4f7fb">INVOICES</text>
      <text x="197" y="93" textAnchor="middle" dominantBaseline="central" fontSize="11" fill="#f4f7fb">MATCHED</text>
      <text x="120" y="112" textAnchor="middle" dominantBaseline="central" fontSize="8.5" fill="#8ea6b4">AMOUNT · REF · TIME</text>
      <circle r="3.2" fill="#63f0de">
        <animateMotion dur="3s" repeatCount="indefinite">
          <mpath href="#ap01path" />
        </animateMotion>
      </circle>
    </svg>
  ),
  "autopay-eg:0x02": () => (
    <svg viewBox="0 0 240 132" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Lock-guarded confirmation" fontFamily="ui-monospace, monospace">
      <path id="ap02path" d="M68 39 L92 58 L119 66 L172 65" fill="none" stroke="none" />
      <rect x="16" y="26" width="52" height="26" rx="6" fill="rgba(7,25,31,0.55)" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <rect x="16" y="80" width="52" height="26" rx="6" fill="rgba(7,25,31,0.55)" stroke="#e08c8c" strokeWidth="1.4" />
      <rect x="92" y="50" width="54" height="32" rx="6" fill="rgba(7,25,31,0.55)" stroke="#31e6d0" strokeWidth="1.4" />
      <rect x="172" y="50" width="52" height="30" rx="6" fill="rgba(7,25,31,0.55)" stroke="#91d98a" strokeWidth="1.4" />
      <path d="M68 42 L90 57" fill="none" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <path d="M92 58 L85 54.5 L85 61.5 Z" fill="rgba(139,171,204,0.28)" />
      <path d="M68 88 L90 75" fill="none" stroke="#e08c8c" strokeWidth="1.4" strokeDasharray="4 3" />
      <path d="M92 74 L85 70.5 L85 77.5 Z" fill="#e08c8c" />
      <path d="M146 66 L170 65" fill="none" stroke="#91d98a" strokeWidth="1.4" />
      <path d="M172 65 L165 61.5 L165 68.5 Z" fill="#91d98a" />
      <text x="42" y="39" textAnchor="middle" dominantBaseline="central" fontSize="11" fill="#f4f7fb">EVENT A</text>
      <text x="42" y="93" textAnchor="middle" dominantBaseline="central" fontSize="11" fill="#f4f7fb">EVENT B</text>
      <text x="119" y="66" textAnchor="middle" dominantBaseline="central" fontSize="11" fill="#f4f7fb">LOCK</text>
      <text x="198" y="65" textAnchor="middle" dominantBaseline="central" fontSize="11" fill="#f4f7fb">CONFIRM</text>
      <text x="120" y="112" textAnchor="middle" dominantBaseline="central" fontSize="8.5" fill="#8ea6b4">ROW LOCK · UNIQUE</text>
      <circle r="3.2" fill="#63f0de">
        <animateMotion dur="2.8s" repeatCount="indefinite">
          <mpath href="#ap02path" />
        </animateMotion>
      </circle>
    </svg>
  ),
  "autopay-eg:0x03": () => (
    <svg viewBox="0 0 240 132" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Signed device ingestion" fontFamily="ui-monospace, monospace">
      <path id="ap03path" d="M68 73 L170 73" fill="none" stroke="none" />
      <rect x="16" y="58" width="52" height="30" rx="6" fill="rgba(7,25,31,0.55)" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <rect x="92" y="58" width="54" height="30" rx="6" fill="rgba(7,25,31,0.55)" stroke="#31e6d0" strokeWidth="1.4" />
      <rect x="172" y="58" width="52" height="30" rx="6" fill="rgba(7,25,31,0.55)" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <rect x="92" y="18" width="54" height="26" rx="6" fill="rgba(7,25,31,0.55)" stroke="#78aefb" strokeWidth="1.4" />
      <path d="M68 73 L90 73" fill="none" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <path d="M92 73 L85 69.5 L85 76.5 Z" fill="rgba(139,171,204,0.28)" />
      <path d="M146 73 L170 73" fill="none" stroke="#31e6d0" strokeWidth="1.4" />
      <path d="M172 73 L165 69.5 L165 76.5 Z" fill="#31e6d0" />
      <path d="M119 44 L119 56" fill="none" stroke="#78aefb" strokeWidth="1.4" />
      <path d="M119 58 L115.5 51 L122.5 51 Z" fill="#78aefb" />
      <text x="42" y="73" textAnchor="middle" dominantBaseline="central" fontSize="10.5" fill="#f4f7fb">ANDROID</text>
      <text x="119" y="73" textAnchor="middle" dominantBaseline="central" fontSize="11" fill="#f4f7fb">VERIFY</text>
      <text x="198" y="73" textAnchor="middle" dominantBaseline="central" fontSize="11" fill="#f4f7fb">STORE</text>
      <text x="119" y="31" textAnchor="middle" dominantBaseline="central" fontSize="10.5" fill="#f4f7fb">REGISTRY</text>
      <text x="120" y="104" textAnchor="middle" dominantBaseline="central" fontSize="8.5" fill="#8ea6b4">HMAC + REPLAY</text>
      <circle r="3.2" fill="#63f0de">
        <animateMotion dur="3s" repeatCount="indefinite">
          <mpath href="#ap03path" />
        </animateMotion>
      </circle>
    </svg>
  ),
  "riders-shopify-wordpress:0x01": () => (
    <svg viewBox="0 0 240 132" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Store orders from two platforms mapped into one Riders shipment" fontFamily="ui-monospace, monospace">
      <path id="rd01pathA" d="M 66 41 L 100 62 L 124 66 L 197 66" fill="none" stroke="none" />
      <path id="rd01pathB" d="M 66 93 L 100 70 L 124 66" fill="none" stroke="none" />
      <line x1="66" y1="41" x2="100" y2="60" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <line x1="66" y1="93" x2="100" y2="72" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <path d="M 100 60 L 94 57 L 94 63 Z" fill="#8ea6b4" />
      <path d="M 100 72 L 94 69 L 94 75 Z" fill="#8ea6b4" />
      <line x1="148" y1="66" x2="170" y2="66" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <path d="M 170 66 L 164 63 L 164 69 Z" fill="#8ea6b4" />
      <rect x="14" y="28" width="52" height="26" rx="6" fill="rgba(7,25,31,0.55)" stroke="#31e6d0" strokeWidth="1.4" />
      <rect x="14" y="80" width="52" height="26" rx="6" fill="rgba(7,25,31,0.55)" stroke="#31e6d0" strokeWidth="1.4" />
      <rect x="100" y="52" width="48" height="28" rx="6" fill="rgba(7,25,31,0.55)" stroke="#63f0de" strokeWidth="1.4" />
      <rect x="170" y="52" width="54" height="28" rx="6" fill="rgba(7,25,31,0.55)" stroke="#31e6d0" strokeWidth="1.4" />
      <text x="40" y="41" textAnchor="middle" dominantBaseline="central" fontSize="10" fill="#f4f7fb">SHOPIFY</text>
      <text x="40" y="93" textAnchor="middle" dominantBaseline="central" fontSize="10" fill="#f4f7fb">WOO</text>
      <text x="124" y="66" textAnchor="middle" dominantBaseline="central" fontSize="11" fill="#63f0de">MAP</text>
      <text x="197" y="66" textAnchor="middle" dominantBaseline="central" fontSize="11" fill="#f4f7fb">RIDERS</text>
      <text x="120" y="110" textAnchor="middle" dominantBaseline="central" fontSize="8.5" fill="#8ea6b4">STORE ORDER TO SHIPMENT</text>
      <circle r="3.2" fill="#63f0de"><animateMotion dur="3s" repeatCount="indefinite"><mpath href="#rd01pathA" /></animateMotion></circle>
      <circle r="2.6" fill="#31e6d0" opacity="0.5"><animateMotion dur="3.4s" repeatCount="indefinite"><mpath href="#rd01pathB" /></animateMotion></circle>
    </svg>
  ),
  "riders-shopify-wordpress:0x02": () => (
    <svg viewBox="0 0 240 132" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Sync retries and reconciles without creating duplicate shipments" fontFamily="ui-monospace, monospace">
      <path id="rd02loop" d="M 40 65 H 202 C 216 65 216 98 202 98 H 40 C 26 98 26 65 40 65 Z" fill="none" stroke="none" />
      <line x1="66" y1="65" x2="96" y2="65" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <path d="M 96 65 L 90 62 L 90 68 Z" fill="#8ea6b4" />
      <line x1="152" y1="65" x2="180" y2="65" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <path d="M 180 65 L 174 62 L 174 68 Z" fill="#8ea6b4" />
      <path d="M 200 80 C 210 98 60 102 40 82" fill="none" stroke="#78aefb" strokeWidth="1.4" strokeDasharray="3 3" />
      <path d="M 40 80 L 36 87 L 44 87 Z" fill="#78aefb" />
      <rect x="14" y="50" width="52" height="30" rx="6" fill="rgba(7,25,31,0.55)" stroke="#31e6d0" strokeWidth="1.4" />
      <rect x="96" y="50" width="56" height="30" rx="6" fill="rgba(7,25,31,0.55)" stroke="#63f0de" strokeWidth="1.4" />
      <rect x="180" y="50" width="44" height="30" rx="6" fill="rgba(7,25,31,0.55)" stroke="#31e6d0" strokeWidth="1.4" />
      <text x="40" y="65" textAnchor="middle" dominantBaseline="central" fontSize="10" fill="#f4f7fb">SYNC JOB</text>
      <text x="124" y="65" textAnchor="middle" dominantBaseline="central" fontSize="10" fill="#63f0de">DEDUP GATE</text>
      <text x="202" y="65" textAnchor="middle" dominantBaseline="central" fontSize="10" fill="#f4f7fb">RIDERS</text>
      <text x="120" y="108" textAnchor="middle" dominantBaseline="central" fontSize="8.5" fill="#78aefb">RETRY, NO DUPLICATES</text>
      <circle r="3.2" fill="#63f0de"><animateMotion dur="3.2s" repeatCount="indefinite" rotate="auto"><mpath href="#rd02loop" /></animateMotion></circle>
    </svg>
  ),
  "riders-shopify-wordpress:0x03": () => (
    <svg viewBox="0 0 240 132" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Signature-verified webhooks apply valid events and reject the rest" fontFamily="ui-monospace, monospace">
      <path id="rd03path" d="M 40 59 H 204" fill="none" stroke="none" />
      <line x1="66" y1="59" x2="96" y2="59" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <path d="M 96 59 L 90 56 L 90 62 Z" fill="#8ea6b4" />
      <line x1="152" y1="59" x2="184" y2="59" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <path d="M 184 59 L 178 56 L 178 62 Z" fill="#91d98a" />
      <line x1="124" y1="74" x2="124" y2="94" stroke="rgba(224,140,140,0.6)" strokeWidth="1.4" strokeDasharray="3 3" />
      <path d="M 124 96 L 121 90 L 127 90 Z" fill="#e08c8c" />
      <rect x="14" y="44" width="52" height="30" rx="6" fill="rgba(7,25,31,0.55)" stroke="#31e6d0" strokeWidth="1.4" />
      <rect x="96" y="44" width="56" height="30" rx="6" fill="rgba(7,25,31,0.55)" stroke="#63f0de" strokeWidth="1.4" />
      <rect x="184" y="44" width="40" height="30" rx="6" fill="rgba(7,25,31,0.55)" stroke="#91d98a" strokeWidth="1.4" />
      <rect x="100" y="96" width="48" height="18" rx="6" fill="rgba(7,25,31,0.55)" stroke="#e08c8c" strokeWidth="1.4" />
      <text x="40" y="59" textAnchor="middle" dominantBaseline="central" fontSize="10" fill="#f4f7fb">WEBHOOK</text>
      <text x="124" y="59" textAnchor="middle" dominantBaseline="central" fontSize="10" fill="#63f0de">VERIFY SIG</text>
      <text x="204" y="59" textAnchor="middle" dominantBaseline="central" fontSize="10" fill="#91d98a">APPLY</text>
      <text x="124" y="105" textAnchor="middle" dominantBaseline="central" fontSize="9" fill="#e08c8c">REJECT</text>
      <circle r="3.2" fill="#63f0de"><animateMotion dur="2.8s" repeatCount="indefinite"><mpath href="#rd03path" /></animateMotion></circle>
    </svg>
  ),
  "alzahaby-loyalty-app:0x01": () => (
    <svg viewBox="0 0 240 132" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Scanned QR codes earn points only after backend validation" fontFamily="ui-monospace, monospace">
      <path id="az01path" d="M 40 61 H 204" fill="none" stroke="none" />
      <line x1="66" y1="61" x2="100" y2="61" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <path d="M 100 61 L 94 58 L 94 64 Z" fill="#8ea6b4" />
      <line x1="152" y1="61" x2="184" y2="61" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <path d="M 184 61 L 178 58 L 178 64 Z" fill="#8ea6b4" />
      <rect x="14" y="44" width="52" height="34" rx="6" fill="rgba(7,25,31,0.55)" stroke="#31e6d0" strokeWidth="1.4" />
      <rect x="100" y="44" width="52" height="34" rx="6" fill="rgba(7,25,31,0.55)" stroke="#63f0de" strokeWidth="1.4" />
      <rect x="184" y="44" width="40" height="34" rx="6" fill="rgba(7,25,31,0.55)" stroke="#31e6d0" strokeWidth="1.4" />
      <rect x="32" y="49" width="14" height="14" rx="1" fill="none" stroke="#8ea6b4" strokeWidth="1" />
      <rect x="34" y="51" width="3.5" height="3.5" fill="#63f0de" />
      <rect x="40.5" y="51" width="3.5" height="3.5" fill="#63f0de" />
      <rect x="34" y="57.5" width="3.5" height="3.5" fill="#63f0de" />
      <text x="40" y="71" textAnchor="middle" dominantBaseline="central" fontSize="10" fill="#f4f7fb">SCAN QR</text>
      <text x="126" y="61" textAnchor="middle" dominantBaseline="central" fontSize="10" fill="#63f0de">VALIDATE</text>
      <text x="204" y="61" textAnchor="middle" dominantBaseline="central" fontSize="10" fill="#f4f7fb">POINTS</text>
      <text x="120" y="106" textAnchor="middle" dominantBaseline="central" fontSize="8.5" fill="#8ea6b4">SERVER-SIDE ONLY</text>
      <circle r="3.2" fill="#63f0de"><animateMotion dur="3s" repeatCount="indefinite"><mpath href="#az01path" /></animateMotion></circle>
    </svg>
  ),
  "alzahaby-loyalty-app:0x02": () => (
    <svg viewBox="0 0 240 132" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="A row lock lets a product code redeem once and rejects any reuse" fontFamily="ui-monospace, monospace">
      <path id="az02path" d="M 38 65 L 110 65 L 176 44 L 200 41" fill="none" stroke="none" />
      <line x1="62" y1="65" x2="82" y2="65" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <path d="M 82 65 L 76 62 L 76 68 Z" fill="#8ea6b4" />
      <line x1="138" y1="58" x2="176" y2="44" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <path d="M 176 44 L 170 43 L 172 49 Z" fill="#91d98a" />
      <line x1="138" y1="72" x2="176" y2="94" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <path d="M 176 94 L 170 89 L 168 95 Z" fill="#e08c8c" />
      <rect x="14" y="50" width="48" height="30" rx="6" fill="rgba(7,25,31,0.55)" stroke="#31e6d0" strokeWidth="1.4" />
      <rect x="82" y="50" width="56" height="30" rx="6" fill="rgba(7,25,31,0.55)" stroke="#63f0de" strokeWidth="1.4" />
      <rect x="176" y="28" width="48" height="26" rx="6" fill="rgba(7,25,31,0.55)" stroke="#91d98a" strokeWidth="1.4" />
      <rect x="176" y="84" width="48" height="26" rx="6" fill="rgba(7,25,31,0.55)" stroke="#e08c8c" strokeWidth="1.4" />
      <rect x="92" y="63" width="9" height="7" rx="1" fill="none" stroke="#63f0de" strokeWidth="1.2" />
      <path d="M 93.5 63 L 93.5 60.5 A 3 3 0 0 1 99.5 60.5 L 99.5 63" fill="none" stroke="#63f0de" strokeWidth="1.2" />
      <text x="38" y="65" textAnchor="middle" dominantBaseline="central" fontSize="10" fill="#f4f7fb">CODE</text>
      <text x="116" y="66" textAnchor="middle" dominantBaseline="central" fontSize="10" fill="#63f0de">LOCK ROW</text>
      <text x="200" y="41" textAnchor="middle" dominantBaseline="central" fontSize="10" fill="#91d98a">ACCEPT</text>
      <text x="200" y="97" textAnchor="middle" dominantBaseline="central" fontSize="10" fill="#e08c8c">REJECT</text>
      <circle r="3.2" fill="#63f0de"><animateMotion dur="3s" repeatCount="indefinite"><mpath href="#az02path" /></animateMotion></circle>
    </svg>
  ),
  "alzahaby-loyalty-app:0x03": () => (
    <svg viewBox="0 0 240 132" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="A signed ledger keeps point balances consistent and auditable" fontFamily="ui-monospace, monospace">
      <path id="az03path" d="M 38 63 H 200" fill="none" stroke="none" />
      <line x1="62" y1="63" x2="84" y2="63" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <path d="M 84 63 L 78 60 L 78 66 Z" fill="#8ea6b4" />
      <line x1="142" y1="63" x2="172" y2="63" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <path d="M 172 63 L 166 60 L 166 66 Z" fill="#8ea6b4" />
      <rect x="14" y="48" width="48" height="30" rx="6" fill="rgba(7,25,31,0.55)" stroke="#31e6d0" strokeWidth="1.4" />
      <rect x="84" y="46" width="58" height="34" rx="6" fill="rgba(7,25,31,0.55)" stroke="#63f0de" strokeWidth="1.4" />
      <rect x="172" y="46" width="48" height="34" rx="6" fill="rgba(7,25,31,0.55)" stroke="#31e6d0" strokeWidth="1.4" />
      <line x1="120" y1="57" x2="136" y2="57" stroke="#91d98a" strokeWidth="2" />
      <line x1="120" y1="63" x2="136" y2="63" stroke="#e08c8c" strokeWidth="2" />
      <line x1="120" y1="69" x2="136" y2="69" stroke="#91d98a" strokeWidth="2" />
      <text x="38" y="63" textAnchor="middle" dominantBaseline="central" fontSize="10" fill="#f4f7fb">CHANGE</text>
      <text x="103" y="63" textAnchor="middle" dominantBaseline="central" fontSize="10" fill="#63f0de">LEDGER</text>
      <text x="196" y="63" textAnchor="middle" dominantBaseline="central" fontSize="10" fill="#f4f7fb">BALANCE</text>
      <text x="120" y="106" textAnchor="middle" dominantBaseline="central" fontSize="8.5" fill="#8ea6b4">SIGNED, SNAPSHOTS</text>
      <circle r="3.2" fill="#63f0de"><animateMotion dur="3.2s" repeatCount="indefinite"><mpath href="#az03path" /></animateMotion></circle>
    </svg>
  ),
  "sim-express:0x01": () => (
    <svg viewBox="0 0 240 132" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Queued activation pipeline" fontFamily="ui-monospace, monospace">
      <path id="se01path" d="M70 57 H170" fill="none" stroke="none" />
      <line x1="70" y1="57" x2="90" y2="57" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <line x1="147" y1="57" x2="167" y2="57" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <path d="M92 57 l -6 -3 l 0 6 z" fill="#31e6d0" />
      <path d="M169 57 l -6 -3 l 0 6 z" fill="#31e6d0" />
      <path d="M104 42 C102 24 138 24 136 42" fill="none" stroke="#31e6d0" strokeWidth="1.4" strokeDasharray="3 4" strokeLinecap="round">
        <animate attributeName="stroke-dashoffset" values="0;-14" dur="1.4s" repeatCount="indefinite" />
      </path>
      <path d="M136 42 l -3 -5 l 6 0 z" fill="#31e6d0" />
      <rect x="16" y="42" width="54" height="30" rx="6" fill="rgba(7,25,31,0.55)" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <rect x="93" y="42" width="54" height="30" rx="6" fill="rgba(7,25,31,0.55)" stroke="#31e6d0" strokeWidth="1.4" />
      <rect x="170" y="42" width="54" height="30" rx="6" fill="rgba(7,25,31,0.55)" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <text x="43" y="57" textAnchor="middle" dominantBaseline="central" fontSize="10.5" fontWeight="600" fill="#f4f7fb">REQUEST</text>
      <text x="120" y="57" textAnchor="middle" dominantBaseline="central" fontSize="10.5" fontWeight="600" fill="#f4f7fb">QUEUE</text>
      <text x="197" y="57" textAnchor="middle" dominantBaseline="central" fontSize="10.5" fontWeight="600" fill="#f4f7fb">ACTIVATE</text>
      <text x="120" y="94" textAnchor="middle" fontSize="8.5" fill="#8ea6b4">REDIS · HORIZON</text>
      <circle r="3.2" fill="#63f0de">
        <animateMotion dur="3s" repeatCount="indefinite"><mpath href="#se01path" /></animateMotion>
      </circle>
    </svg>
  ),
  "sim-express:0x02": () => (
    <svg viewBox="0 0 240 132" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Independent step failure recovery" fontFamily="ui-monospace, monospace">
      <path id="se02path" d="M74 44 H166" fill="none" stroke="none" />
      <text x="120" y="22" textAnchor="middle" fontSize="8.5" fill="#8ea6b4">STEPS FAIL ALONE</text>
      <line x1="74" y1="44" x2="90" y2="44" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <line x1="149" y1="44" x2="165" y2="44" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <path d="M92 44 l -6 -3 l 0 6 z" fill="#31e6d0" />
      <path d="M167 44 l -6 -3 l 0 6 z" fill="#31e6d0" />
      <path d="M45 58 L102 82" fill="none" stroke="#e08c8c" strokeWidth="1.4" strokeDasharray="3 4" />
      <path d="M120 58 L120 82" fill="none" stroke="#e08c8c" strokeWidth="1.4" strokeDasharray="3 4" />
      <path d="M195 58 L138 82" fill="none" stroke="#e08c8c" strokeWidth="1.4" strokeDasharray="3 4" />
      <path d="M102 82 l -4 -6 l 8 0 z" fill="#e08c8c" />
      <path d="M120 82 l -4 -6 l 8 0 z" fill="#e08c8c" />
      <path d="M138 82 l -4 -6 l 8 0 z" fill="#e08c8c" />
      <rect x="16" y="30" width="58" height="28" rx="6" fill="rgba(7,25,31,0.55)" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <rect x="91" y="30" width="58" height="28" rx="6" fill="rgba(7,25,31,0.55)" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <rect x="166" y="30" width="58" height="28" rx="6" fill="rgba(7,25,31,0.55)" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <rect x="91" y="82" width="58" height="28" rx="6" fill="rgba(7,25,31,0.55)" stroke="#e08c8c" strokeWidth="1.4" />
      <text x="45" y="44" textAnchor="middle" dominantBaseline="central" fontSize="10" fontWeight="600" fill="#f4f7fb">PAYMENT</text>
      <text x="120" y="44" textAnchor="middle" dominantBaseline="central" fontSize="10" fontWeight="600" fill="#f4f7fb">ACTIVATE</text>
      <text x="195" y="44" textAnchor="middle" dominantBaseline="central" fontSize="10" fontWeight="600" fill="#f4f7fb">DISPENSE</text>
      <text x="120" y="96" textAnchor="middle" dominantBaseline="central" fontSize="10.5" fontWeight="600" fill="#e08c8c">REVIEW</text>
      <circle r="3.2" fill="#63f0de">
        <animateMotion dur="3s" repeatCount="indefinite"><mpath href="#se02path" /></animateMotion>
      </circle>
    </svg>
  ),
  "sim-express:0x03": () => (
    <svg viewBox="0 0 240 132" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Signed scoped auth gate" fontFamily="ui-monospace, monospace">
      <path id="se03path" d="M64 33 L94 60" fill="none" stroke="none" />
      <line x1="64" y1="33" x2="94" y2="60" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <line x1="64" y1="101" x2="94" y2="78" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <line x1="176" y1="69" x2="146" y2="69" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <path d="M94 60 l -6 -3 l 0 6 z" fill="#31e6d0" />
      <path d="M94 78 l -6 -3 l 0 6 z" fill="#31e6d0" />
      <path d="M146 69 l 6 -3 l 0 6 z" fill="#31e6d0" />
      <rect x="16" y="20" width="48" height="26" rx="6" fill="rgba(7,25,31,0.55)" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <rect x="16" y="88" width="48" height="26" rx="6" fill="rgba(7,25,31,0.55)" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <rect x="176" y="56" width="48" height="26" rx="6" fill="rgba(7,25,31,0.55)" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <rect x="94" y="52" width="52" height="34" rx="6" fill="rgba(7,25,31,0.55)" stroke="#63f0de" strokeWidth="1.4" />
      <text x="40" y="33" textAnchor="middle" dominantBaseline="central" fontSize="10.5" fontWeight="600" fill="#f4f7fb">KIOSK</text>
      <text x="40" y="101" textAnchor="middle" dominantBaseline="central" fontSize="10.5" fontWeight="600" fill="#f4f7fb">WORKER</text>
      <text x="200" y="69" textAnchor="middle" dominantBaseline="central" fontSize="10.5" fontWeight="600" fill="#f4f7fb">STC</text>
      <text x="120" y="69" textAnchor="middle" dominantBaseline="central" fontSize="10.5" fontWeight="600" fill="#63f0de">AUTH</text>
      <text x="120" y="100" textAnchor="middle" fontSize="8.5" fill="#8ea6b4">SIGNED · SCOPED</text>
      <circle r="3.2" fill="#63f0de">
        <animateMotion dur="3.2s" repeatCount="indefinite"><mpath href="#se03path" /></animateMotion>
      </circle>
    </svg>
  ),
  "tawfir:0x01": () => (
    <svg viewBox="0 0 240 132" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Independent Laravel modules" fontFamily="ui-monospace, monospace">
      <path id="tw01path" d="M24 46 H206" fill="none" stroke="none" />
      <rect x="14" y="24" width="212" height="84" rx="6" fill="rgba(7,25,31,0.55)" stroke="#31e6d0" strokeWidth="1.4" />
      <text x="120" y="37" textAnchor="middle" fontSize="9" fill="#8ea6b4">LARAVEL MODULES</text>
      <line x1="24" y1="46" x2="206" y2="46" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <line x1="52" y1="46" x2="52" y2="54" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <line x1="123" y1="46" x2="123" y2="54" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <line x1="194" y1="46" x2="194" y2="54" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <rect x="24" y="54" width="57" height="40" rx="6" fill="rgba(7,25,31,0.55)" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <rect x="95" y="54" width="57" height="40" rx="6" fill="rgba(7,25,31,0.55)" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <rect x="166" y="54" width="57" height="40" rx="6" fill="rgba(7,25,31,0.55)" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <text x="52" y="74" textAnchor="middle" dominantBaseline="central" fontSize="10.5" fontWeight="600" fill="#f4f7fb">ADMIN</text>
      <text x="123" y="74" textAnchor="middle" dominantBaseline="central" fontSize="10.5" fontWeight="600" fill="#f4f7fb">PAYMENT</text>
      <text x="194" y="74" textAnchor="middle" dominantBaseline="central" fontSize="10.5" fontWeight="600" fill="#f4f7fb">USER</text>
      <circle r="3.2" fill="#63f0de">
        <animateMotion dur="3s" repeatCount="indefinite"><mpath href="#tw01path" /></animateMotion>
      </circle>
    </svg>
  ),
  "tawfir:0x02": () => (
    <svg viewBox="0 0 240 132" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Stripe Connect payout flow" fontFamily="ui-monospace, monospace">
      <path id="tw02path" d="M70 50 H170" fill="none" stroke="none" />
      <text x="120" y="22" textAnchor="middle" fontSize="8.5" fill="#8ea6b4">STRIPE CONNECT</text>
      <line x1="70" y1="50" x2="90" y2="50" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <line x1="147" y1="50" x2="167" y2="50" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <path d="M92 50 l -6 -3 l 0 6 z" fill="#31e6d0" />
      <path d="M169 50 l -6 -3 l 0 6 z" fill="#31e6d0" />
      <path d="M120 82 L120 66" fill="none" stroke="#78aefb" strokeWidth="1.4" strokeDasharray="3 4">
        <animate attributeName="stroke-dashoffset" values="0;14" dur="1.6s" repeatCount="indefinite" />
      </path>
      <path d="M120 64 l -3 5 l 6 0 z" fill="#78aefb" />
      <rect x="16" y="34" width="54" height="30" rx="6" fill="rgba(7,25,31,0.55)" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <rect x="93" y="34" width="54" height="30" rx="6" fill="rgba(7,25,31,0.55)" stroke="#31e6d0" strokeWidth="1.4" />
      <rect x="170" y="34" width="54" height="30" rx="6" fill="rgba(7,25,31,0.55)" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <rect x="93" y="82" width="54" height="26" rx="6" fill="rgba(7,25,31,0.55)" stroke="#78aefb" strokeWidth="1.4" strokeDasharray="4 3" />
      <text x="43" y="49" textAnchor="middle" dominantBaseline="central" fontSize="10" fontWeight="600" fill="#f4f7fb">CUSTOMER</text>
      <text x="120" y="49" textAnchor="middle" dominantBaseline="central" fontSize="10" fontWeight="600" fill="#f4f7fb">PLATFORM</text>
      <text x="197" y="49" textAnchor="middle" dominantBaseline="central" fontSize="10.5" fontWeight="600" fill="#f4f7fb">PAYOUT</text>
      <text x="120" y="95" textAnchor="middle" dominantBaseline="central" fontSize="9.5" fontWeight="600" fill="#78aefb">WEBHOOK</text>
      <circle r="3.2" fill="#91d98a">
        <animateMotion dur="3s" repeatCount="indefinite"><mpath href="#tw02path" /></animateMotion>
      </circle>
    </svg>
  ),
  "tawfir:0x03": () => (
    <svg viewBox="0 0 240 132" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Role-scoped access routing" fontFamily="ui-monospace, monospace">
      <path id="tw03path" d="M66 68 H116 L170 98" fill="none" stroke="none" />
      <line x1="66" y1="68" x2="88" y2="68" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <line x1="142" y1="60" x2="170" y2="38" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <line x1="142" y1="76" x2="170" y2="98" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <path d="M89 68 l -6 -3 l 0 6 z" fill="#31e6d0" />
      <path d="M170 38 l -6 -3 l 0 6 z" fill="#31e6d0" />
      <path d="M170 98 l -6 -3 l 0 6 z" fill="#31e6d0" />
      <rect x="16" y="52" width="50" height="32" rx="6" fill="rgba(7,25,31,0.55)" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <rect x="90" y="50" width="52" height="36" rx="6" fill="rgba(7,25,31,0.55)" stroke="#63f0de" strokeWidth="1.4" />
      <rect x="170" y="24" width="54" height="28" rx="6" fill="rgba(7,25,31,0.55)" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <rect x="170" y="84" width="54" height="28" rx="6" fill="rgba(7,25,31,0.55)" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <text x="41" y="68" textAnchor="middle" dominantBaseline="central" fontSize="10.5" fontWeight="600" fill="#f4f7fb">REQUEST</text>
      <text x="116" y="68" textAnchor="middle" dominantBaseline="central" fontSize="10.5" fontWeight="600" fill="#63f0de">GUARD</text>
      <text x="197" y="38" textAnchor="middle" dominantBaseline="central" fontSize="10.5" fontWeight="600" fill="#f4f7fb">ADMIN</text>
      <text x="197" y="98" textAnchor="middle" dominantBaseline="central" fontSize="10.5" fontWeight="600" fill="#f4f7fb">TENANT</text>
      <text x="104" y="104" textAnchor="middle" fontSize="8.5" fill="#8ea6b4">SANCTUM · LARATRUST</text>
      <circle r="3.2" fill="#63f0de">
        <animateMotion dur="3.2s" repeatCount="indefinite"><mpath href="#tw03path" /></animateMotion>
      </circle>
    </svg>
  ),
  "pdf-extractor:0x01": () => (
    <svg viewBox="0 0 240 132" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Native text first, OCR only when a page is empty" fontFamily="ui-monospace, monospace">
      <path id="pd01path" d="M42,66 L118,66 L196,90" fill="none" stroke="none" />
      <line x1="66" y1="66" x2="88" y2="66" stroke="rgba(139,171,204,0.45)" strokeWidth="1.4" />
      <path d="M90,66 L84,63 L84,69 Z" fill="#8ea6b4" />
      <line x1="146" y1="60" x2="168" y2="44" stroke="rgba(139,171,204,0.45)" strokeWidth="1.4" />
      <path d="M170,42 L167,48 L163.4,43.2 Z" fill="#91d98a" />
      <line x1="146" y1="72" x2="168" y2="88" stroke="#d8ad65" strokeWidth="1.4" />
      <path d="M170,90 L163.4,88.8 L167,84 Z" fill="#d8ad65" />
      <rect x="18" y="52" width="48" height="28" rx="6" fill="rgba(7,25,31,0.55)" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <text x="42" y="66" textAnchor="middle" dominantBaseline="central" fontSize="10.5" fontWeight="600" fill="#f4f7fb">PAGE</text>
      <rect x="90" y="52" width="56" height="28" rx="6" fill="rgba(7,25,31,0.55)" stroke="#31e6d0" strokeWidth="1.4" />
      <text x="118" y="66" textAnchor="middle" dominantBaseline="central" fontSize="10.5" fontWeight="600" fill="#f4f7fb">NATIVE</text>
      <rect x="172" y="26" width="48" height="26" rx="6" fill="rgba(7,25,31,0.55)" stroke="#91d98a" strokeWidth="1.4" />
      <text x="196" y="39" textAnchor="middle" dominantBaseline="central" fontSize="10" fontWeight="600" fill="#cfdae3">TEXT</text>
      <rect x="172" y="80" width="48" height="26" rx="6" fill="rgba(7,25,31,0.55)" stroke="#d8ad65" strokeWidth="1.4" />
      <text x="196" y="93" textAnchor="middle" dominantBaseline="central" fontSize="10" fontWeight="600" fill="#cfdae3">OCR</text>
      <text x="116" y="110" textAnchor="middle" dominantBaseline="central" fontSize="8.5" fill="#8ea6b4">OCR IF NO TEXT</text>
      <circle r="3.2" fill="#63f0de">
        <animateMotion dur="3s" repeatCount="indefinite"><mpath href="#pd01path" /></animateMotion>
      </circle>
    </svg>
  ),
  "pdf-extractor:0x02": () => (
    <svg viewBox="0 0 240 132" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Chained queue jobs preserve page order" fontFamily="ui-monospace, monospace">
      <path id="pd02path" d="M47,66 L193,66" fill="none" stroke="none" />
      <line x1="74" y1="66" x2="91" y2="66" stroke="rgba(139,171,204,0.45)" strokeWidth="1.4" />
      <path d="M93,66 L87,63 L87,69 Z" fill="#8ea6b4" />
      <line x1="147" y1="66" x2="164" y2="66" stroke="rgba(139,171,204,0.45)" strokeWidth="1.4" />
      <path d="M166,66 L160,63 L160,69 Z" fill="#8ea6b4" />
      <rect x="20" y="51" width="54" height="30" rx="6" fill="rgba(7,25,31,0.55)" stroke="#31e6d0" strokeWidth="1.4" />
      <text x="47" y="66" textAnchor="middle" dominantBaseline="central" fontSize="10" fontWeight="600" fill="#f4f7fb">PDF JOB</text>
      <rect x="93" y="51" width="54" height="30" rx="6" fill="rgba(7,25,31,0.55)" stroke="#31e6d0" strokeWidth="1.4" />
      <text x="120" y="66" textAnchor="middle" dominantBaseline="central" fontSize="10" fontWeight="600" fill="#f4f7fb">PAGE JOB</text>
      <rect x="166" y="51" width="54" height="30" rx="6" fill="rgba(7,25,31,0.55)" stroke="#31e6d0" strokeWidth="1.4" />
      <text x="193" y="66" textAnchor="middle" dominantBaseline="central" fontSize="10" fontWeight="600" fill="#f4f7fb">PARA JOB</text>
      <text x="120" y="100" textAnchor="middle" dominantBaseline="central" fontSize="8.5" fill="#8ea6b4">CHAINED IN ORDER</text>
      <circle r="3.2" fill="#63f0de">
        <animateMotion dur="2.8s" repeatCount="indefinite"><mpath href="#pd02path" /></animateMotion>
      </circle>
    </svg>
  ),
  "pdf-extractor:0x03": () => (
    <svg viewBox="0 0 240 132" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Server streams live progress to the browser over SSE" fontFamily="ui-monospace, monospace">
      <path id="pd03path" d="M47,66 L193,66" fill="none" stroke="none" />
      <line x1="76" y1="66" x2="162" y2="66" stroke="rgba(139,171,204,0.4)" strokeWidth="1.4" strokeDasharray="5 4">
        <animate attributeName="stroke-dashoffset" from="0" to="-18" dur="1.1s" repeatCount="indefinite" />
      </line>
      <path d="M164,66 L158,63 L158,69 Z" fill="#8ea6b4" />
      <rect x="18" y="48" width="58" height="36" rx="6" fill="rgba(7,25,31,0.55)" stroke="#31e6d0" strokeWidth="1.4" />
      <text x="47" y="66" textAnchor="middle" dominantBaseline="central" fontSize="11" fontWeight="600" fill="#f4f7fb">SERVER</text>
      <rect x="164" y="48" width="58" height="36" rx="6" fill="rgba(7,25,31,0.55)" stroke="#78aefb" strokeWidth="1.4" />
      <text x="193" y="66" textAnchor="middle" dominantBaseline="central" fontSize="11" fontWeight="600" fill="#f4f7fb">BROWSER</text>
      <text x="120" y="54" textAnchor="middle" dominantBaseline="central" fontSize="8.5" fill="#8ea6b4">SSE</text>
      <text x="120" y="100" textAnchor="middle" dominantBaseline="central" fontSize="8.5" fill="#8ea6b4">LIVE PROGRESS</text>
      <circle r="3.2" fill="#91d98a">
        <animateMotion dur="2.8s" repeatCount="indefinite"><mpath href="#pd03path" /></animateMotion>
      </circle>
    </svg>
  ),
  "pinoyaid:0x01": () => (
    <svg viewBox="0 0 240 132" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Many payment gateways normalized into one donation flow" fontFamily="ui-monospace, monospace">
      <path id="pn01path" d="M42,61 L126,66 L196,66" fill="none" stroke="none" />
      <line x1="68" y1="39" x2="86" y2="63" stroke="rgba(139,171,204,0.4)" strokeWidth="1.3" />
      <line x1="68" y1="61" x2="86" y2="66" stroke="rgba(139,171,204,0.4)" strokeWidth="1.3" />
      <line x1="68" y1="83" x2="86" y2="69" stroke="rgba(139,171,204,0.4)" strokeWidth="1.3" />
      <line x1="88" y1="66" x2="96" y2="66" stroke="rgba(139,171,204,0.45)" strokeWidth="1.4" />
      <path d="M98,66 L92,63 L92,69 Z" fill="#8ea6b4" />
      <rect x="16" y="30" width="52" height="18" rx="5" fill="rgba(7,25,31,0.55)" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <text x="42" y="39" textAnchor="middle" dominantBaseline="central" fontSize="8.5" fontWeight="600" fill="#cfdae3">STRIPE</text>
      <rect x="16" y="52" width="52" height="18" rx="5" fill="rgba(7,25,31,0.55)" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <text x="42" y="61" textAnchor="middle" dominantBaseline="central" fontSize="8.5" fontWeight="600" fill="#cfdae3">PAYPAL</text>
      <rect x="16" y="74" width="52" height="18" rx="5" fill="rgba(7,25,31,0.55)" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <text x="42" y="83" textAnchor="middle" dominantBaseline="central" fontSize="8.5" fontWeight="600" fill="#cfdae3">PAYSTACK</text>
      <text x="42" y="102" textAnchor="middle" dominantBaseline="central" fontSize="11" fontWeight="600" fill="#6f7d90">...</text>
      <rect x="98" y="51" width="56" height="30" rx="6" fill="rgba(7,25,31,0.55)" stroke="#31e6d0" strokeWidth="1.4" />
      <text x="126" y="66" textAnchor="middle" dominantBaseline="central" fontSize="9.5" fontWeight="600" fill="#f4f7fb">NORMALIZE</text>
      <line x1="154" y1="66" x2="168" y2="66" stroke="rgba(139,171,204,0.45)" strokeWidth="1.4" />
      <path d="M170,66 L164,63 L164,69 Z" fill="#8ea6b4" />
      <rect x="170" y="51" width="52" height="30" rx="6" fill="rgba(7,25,31,0.55)" stroke="#91d98a" strokeWidth="1.4" />
      <text x="196" y="66" textAnchor="middle" dominantBaseline="central" fontSize="10" fontWeight="600" fill="#f4f7fb">DONATE</text>
      <text x="126" y="104" textAnchor="middle" dominantBaseline="central" fontSize="8.5" fill="#8ea6b4">9 GATEWAYS, 1 FLOW</text>
      <circle r="3.2" fill="#63f0de">
        <animateMotion dur="3.2s" repeatCount="indefinite"><mpath href="#pn01path" /></animateMotion>
      </circle>
    </svg>
  ),
  "pinoyaid:0x02": () => (
    <svg viewBox="0 0 240 132" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="One confirmed payment updates donation, campaign, and balance in sync" fontFamily="ui-monospace, monospace">
      <path id="pn02path" d="M45,65 L185,65" fill="none" stroke="none" />
      <line x1="74" y1="62" x2="150" y2="30" stroke="rgba(139,171,204,0.45)" strokeWidth="1.4" />
      <path d="M154,29 L147.6,31 L148,25.6 Z" fill="#8ea6b4" />
      <line x1="74" y1="65" x2="150" y2="65" stroke="rgba(139,171,204,0.45)" strokeWidth="1.4" />
      <path d="M154,65 L148,62 L148,68 Z" fill="#8ea6b4" />
      <line x1="74" y1="68" x2="150" y2="100" stroke="rgba(139,171,204,0.45)" strokeWidth="1.4" />
      <path d="M154,101 L148,99 L147.6,104.4 Z" fill="#8ea6b4" />
      <rect x="16" y="50" width="58" height="30" rx="6" fill="rgba(7,25,31,0.55)" stroke="#78aefb" strokeWidth="1.4" />
      <text x="45" y="65" textAnchor="middle" dominantBaseline="central" fontSize="11" fontWeight="600" fill="#f4f7fb">CONFIRM</text>
      <rect x="154" y="18" width="62" height="22" rx="6" fill="rgba(7,25,31,0.55)" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <text x="185" y="29" textAnchor="middle" dominantBaseline="central" fontSize="10" fontWeight="600" fill="#cfdae3">DONATION</text>
      <rect x="154" y="54" width="62" height="22" rx="6" fill="rgba(7,25,31,0.55)" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <text x="185" y="65" textAnchor="middle" dominantBaseline="central" fontSize="10" fontWeight="600" fill="#cfdae3">CAMPAIGN</text>
      <rect x="154" y="90" width="62" height="22" rx="6" fill="rgba(7,25,31,0.55)" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <text x="185" y="101" textAnchor="middle" dominantBaseline="central" fontSize="10" fontWeight="600" fill="#cfdae3">BALANCE</text>
      <text x="45" y="96" textAnchor="middle" dominantBaseline="central" fontSize="8.5" fill="#8ea6b4">STAYS IN SYNC</text>
      <circle r="3.2" fill="#78aefb">
        <animateMotion dur="2.8s" repeatCount="indefinite"><mpath href="#pn02path" /></animateMotion>
      </circle>
    </svg>
  ),
  "pinoyaid:0x03": () => (
    <svg viewBox="0 0 240 132" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Campaigns pass admin review before publishing" fontFamily="ui-monospace, monospace">
      <path id="pn03path" d="M47,64 L193,64" fill="none" stroke="none" />
      <line x1="74" y1="64" x2="91" y2="64" stroke="rgba(139,171,204,0.45)" strokeWidth="1.4" />
      <path d="M93,64 L87,61 L87,67 Z" fill="#8ea6b4" />
      <line x1="147" y1="64" x2="164" y2="64" stroke="rgba(139,171,204,0.45)" strokeWidth="1.4" />
      <path d="M166,64 L160,61 L160,67 Z" fill="#8ea6b4" />
      <line x1="120" y1="79" x2="120" y2="90" stroke="#e08c8c" strokeWidth="1.4" />
      <path d="M120,93 L117,87 L123,87 Z" fill="#e08c8c" />
      <rect x="20" y="49" width="54" height="30" rx="6" fill="rgba(7,25,31,0.55)" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" />
      <text x="47" y="64" textAnchor="middle" dominantBaseline="central" fontSize="10.5" fontWeight="600" fill="#f4f7fb">DRAFT</text>
      <rect x="93" y="49" width="54" height="30" rx="6" fill="rgba(7,25,31,0.55)" stroke="#d8ad65" strokeWidth="1.4" />
      <text x="120" y="64" textAnchor="middle" dominantBaseline="central" fontSize="10.5" fontWeight="600" fill="#f4f7fb">REVIEW</text>
      <rect x="166" y="49" width="54" height="30" rx="6" fill="rgba(7,25,31,0.55)" stroke="#91d98a" strokeWidth="1.4" />
      <text x="193" y="64" textAnchor="middle" dominantBaseline="central" fontSize="10.5" fontWeight="600" fill="#f4f7fb">PUBLISH</text>
      <text x="120" y="30" textAnchor="middle" dominantBaseline="central" fontSize="8.5" fill="#8ea6b4">ADMIN APPROVAL</text>
      <text x="120" y="103" textAnchor="middle" dominantBaseline="central" fontSize="8.5" fill="#e08c8c">REJECT</text>
      <circle r="3.2" fill="#63f0de">
        <animateMotion dur="3s" repeatCount="indefinite"><mpath href="#pn03path" /></animateMotion>
      </circle>
    </svg>
  ),
  "chocolate-smart-vending:0x01": () => (
    <svg viewBox="0 0 240 132" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Confirmed payment unlocks the locker, finalized on the door result" fontFamily="ui-monospace, monospace">
      <path id="ch01path" d="M47,64 L193,64" fill="none" stroke="none" />
      <line x1="74" y1="64" x2="91" y2="64" stroke="rgba(139,171,204,0.45)" strokeWidth="1.4" />
      <path d="M93,64 L87,61 L87,67 Z" fill="#8ea6b4" />
      <line x1="147" y1="64" x2="164" y2="64" stroke="rgba(139,171,204,0.45)" strokeWidth="1.4" />
      <path d="M166,64 L160,61 L160,67 Z" fill="#8ea6b4" />
      <path d="M193,79 L193,96 L51,96" fill="none" stroke="rgba(139,171,204,0.4)" strokeWidth="1.4" strokeDasharray="5 4" />
      <path d="M47,96 L53,93 L53,99 Z" fill="#8ea6b4" />
      <rect x="20" y="49" width="54" height="30" rx="6" fill="rgba(7,25,31,0.55)" stroke="#78aefb" strokeWidth="1.4" />
      <text x="47" y="64" textAnchor="middle" dominantBaseline="central" fontSize="10" fontWeight="600" fill="#f4f7fb">MOYASAR</text>
      <rect x="93" y="49" width="54" height="30" rx="6" fill="rgba(7,25,31,0.55)" stroke="#31e6d0" strokeWidth="1.4" />
      <text x="120" y="64" textAnchor="middle" dominantBaseline="central" fontSize="10.5" fontWeight="600" fill="#f4f7fb">UNLOCK</text>
      <rect x="166" y="49" width="54" height="30" rx="6" fill="rgba(7,25,31,0.55)" stroke="#d8ad65" strokeWidth="1.4" />
      <text x="193" y="64" textAnchor="middle" dominantBaseline="central" fontSize="10.5" fontWeight="600" fill="#f4f7fb">DOOR</text>
      <text x="120" y="30" textAnchor="middle" dominantBaseline="central" fontSize="8.5" fill="#8ea6b4">CONFIRM TO OPEN</text>
      <text x="120" y="106" textAnchor="middle" dominantBaseline="central" fontSize="8.5" fill="#8ea6b4">RESULT FINALIZES</text>
      <circle r="3.2" fill="#63f0de">
        <animateMotion dur="3s" repeatCount="indefinite"><mpath href="#ch01path" /></animateMotion>
      </circle>
    </svg>
  ),
  "chocolate-smart-vending:0x02": () => (
    <svg viewBox="0 0 240 132" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="HMAC API publishes MQTT commands to the machine" fontFamily="ui-monospace, monospace">
      <path id="ch02path" d="M47,66 L193,66" fill="none" stroke="none" />
      <line x1="74" y1="66" x2="91" y2="66" stroke="rgba(139,171,204,0.45)" strokeWidth="1.4" />
      <path d="M93,66 L87,63 L87,69 Z" fill="#8ea6b4" />
      <line x1="147" y1="66" x2="164" y2="66" stroke="rgba(139,171,204,0.45)" strokeWidth="1.4" />
      <path d="M166,66 L160,63 L160,69 Z" fill="#8ea6b4" />
      <rect x="20" y="51" width="54" height="30" rx="6" fill="rgba(7,25,31,0.55)" stroke="#31e6d0" strokeWidth="1.4" />
      <text x="47" y="66" textAnchor="middle" dominantBaseline="central" fontSize="10" fontWeight="600" fill="#f4f7fb">HMAC API</text>
      <rect x="93" y="51" width="54" height="30" rx="6" fill="rgba(7,25,31,0.55)" stroke="#78aefb" strokeWidth="1.4" />
      <text x="120" y="66" textAnchor="middle" dominantBaseline="central" fontSize="10.5" fontWeight="600" fill="#f4f7fb">MQTT</text>
      <rect x="166" y="51" width="54" height="30" rx="6" fill="rgba(7,25,31,0.55)" stroke="#d8ad65" strokeWidth="1.4" />
      <text x="193" y="66" textAnchor="middle" dominantBaseline="central" fontSize="10.5" fontWeight="600" fill="#f4f7fb">MACHINE</text>
      <text x="120" y="30" textAnchor="middle" dominantBaseline="central" fontSize="8.5" fill="#8ea6b4">AUTHENTICATED</text>
      <text x="120" y="100" textAnchor="middle" dominantBaseline="central" fontSize="8.5" fill="#8ea6b4">PUB / SUB</text>
      <circle r="3.2" fill="#63f0de">
        <animateMotion dur="2.8s" repeatCount="indefinite"><mpath href="#ch02path" /></animateMotion>
      </circle>
    </svg>
  ),
  "chocolate-smart-vending:0x03": () => (
    <svg viewBox="0 0 240 132" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Commerce app and locker core are two independent, reusable apps" fontFamily="ui-monospace, monospace">
      <path id="ch03path" d="M59,66 L181,66" fill="none" stroke="none" />
      <line x1="120" y1="30" x2="120" y2="102" stroke="rgba(139,171,204,0.28)" strokeWidth="1.4" strokeDasharray="4 4" />
      <line x1="98" y1="66" x2="138" y2="66" stroke="rgba(139,171,204,0.45)" strokeWidth="1.4" />
      <path d="M142,66 L136,63 L136,69 Z" fill="#8ea6b4" />
      <rect x="20" y="38" width="78" height="56" rx="6" fill="rgba(7,25,31,0.55)" stroke="#31e6d0" strokeWidth="1.4" />
      <text x="59" y="66" textAnchor="middle" dominantBaseline="central" fontSize="11" fontWeight="600" fill="#f4f7fb">SALES APP</text>
      <rect x="142" y="38" width="78" height="56" rx="6" fill="rgba(7,25,31,0.55)" stroke="#78aefb" strokeWidth="1.4" />
      <text x="181" y="66" textAnchor="middle" dominantBaseline="central" fontSize="11" fontWeight="600" fill="#f4f7fb">LOCKERS</text>
      <text x="120" y="56" textAnchor="middle" dominantBaseline="central" fontSize="8.5" fill="#8ea6b4">API</text>
      <text x="120" y="108" textAnchor="middle" dominantBaseline="central" fontSize="8.5" fill="#8ea6b4">TWO REUSABLE APPS</text>
      <circle r="3.2" fill="#63f0de">
        <animateMotion dur="3s" repeatCount="indefinite"><mpath href="#ch03path" /></animateMotion>
      </circle>
    </svg>
  ),
};

export function OrbitMechanicDiagram({
  slug,
  code,
}: {
  slug: string;
  code: string;
}): ReactElement | null {
  const render = DIAGRAMS[`${slug}:${code}`];
  return render ? render() : null;
}
