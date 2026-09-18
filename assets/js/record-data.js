/* El registro. Hechos y redacción de Alexander, verbatim: no añadir entradas,
   no inventar desenlaces, no adornar. Fuente única para /record/, /record/entry/
   y la tarjeta "What I'm up to" de /about/. */

export const RECORD = [
  { slug: "exporecerca", date: "Mar 2026", phase: "past", kind: "Award",
    title: "Exporecerca science fair",
    body: "Awarded by the Societat Catalana de Pedagogia. The prize is a speaker slot at their III International Congress." },
  { slug: "baccalaureate", date: "Jun 2026", phase: "past", kind: "Milestone",
    title: "Spanish Baccalaureate",
    body: "Finished, with the Baccalaureate award for my grades." },
  { slug: "burgasconf", date: "Jul 2026", phase: "past", kind: "Talk",
    title: "BurgasConf · IT Tour Bulgaria",
    body: "Lightning talk on the role of LLMs in biomedicine." },
  { slug: "university", date: "7 Sep 2026", phase: "past", kind: "Milestone",
    title: "Started university",
    body: "Bioinformatics, coordinated by four Catalan universities." },
  { slug: "breakthrough", date: "16 Sep 2026", phase: "present", kind: "Tipping point",
    title: "Missed the Breakthrough Junior Challenge deadline",
    body: "I felt so stupid... I was exporting the video when the timeline ended. It won't happen again. This one was a big loss." },
  { slug: "ai-summit", date: "21–23 Sep 2026", phase: "present", kind: "Volunteer",
    title: "AI Summit Barcelona",
    body: "Volunteering. I literally don't have anything else to say until it happens." },
  { slug: "respira", date: "1–3 Oct 2026", phase: "present", kind: "Hackathon",
    title: "AstraZeneca Respira Hackathon",
    body: "Three days in Barcelona, on respiratory disease. My first hackathon, btw. I'll be SO lost but it's fine..." },
  { slug: "vds", date: "21–22 Oct 2026", phase: "future", kind: "Volunteer",
    title: "Valencia Digital Summit",
    body: "Volunteering. Second summit of the autumn." },
  { slug: "scp-congress", date: "May 2027", phase: "future", kind: "Speaker",
    title: "III International SCP Congress",
    body: "The speaker slot the Exporecerca award came with. A year to make it worth the stage." },
  { slug: "vph", date: "2028", phase: "future", kind: "Presenter",
    title: "VPH Conference",
    body: "Presenting. The furthest thing on the calendar, and the one I am aiming everything at." },
];

/* Intereses sin fecha: fuera de la línea temporal y sin página propia todavía. */
export const RADAR = [
  { slug: "grifols-audiovisual", title: "Grifols Audiovisual Award" },
  { slug: "thiel-fellowship", title: "Thiel Fellowship" },
  { slug: "bsc-cns-fellowship", title: "BSC-CNS Training Fellowship" },
];

export const PHASE = { past: "The past", present: "Now", future: "Ahead" };

export const bySlug = (slug) => RECORD.find((e) => e.slug === slug);
export const inPhase = (phase) => RECORD.filter((e) => e.phase === phase);
