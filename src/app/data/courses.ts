export type CourseLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type CourseSchedule = {
  days: string; // e.g. "Montag–Freitag"
  time: string; // e.g. "18:00–20:00"
};

export type CourseModule = {
  title: string;
  description: string;
};

export type Course = {
  id: string;
  title: string;
  image: string;
  level: CourseLevel;
  description: string;
  schedule: CourseSchedule;
  startDate: string; // ISO date string
  enrolled: number;
  maxCapacity: number;
  modules: CourseModule[];
  price: string;
};

export const courses: Course[] = [
  {
    id: "german-a1",
    title: "German for Beginners",
    image:
      "https://images.unsplash.com/photo-1527866959252-deab85ef7d1b?w=600&h=400&fit=crop",
    level: "A1",
    description:
      "Start your journey into the German language. This course covers the essentials: greetings, introductions, basic grammar, and everyday vocabulary to help you navigate daily life in a German-speaking environment.",
    schedule: { days: "Montag–Mittwoch", time: "18:00–20:00 Uhr" },
    startDate: "2026-04-01",
    enrolled: 24,
    maxCapacity: 30,
    modules: [
      {
        title: "Begrüßung & Vorstellung",
        description: "Greetings, introductions, and the German alphabet.",
      },
      {
        title: "Zahlen & Farben",
        description: "Numbers, colors, and basic counting.",
      },
      {
        title: "Alltag & Einkaufen",
        description: "Daily routines, shopping, and ordering food.",
      },
      {
        title: "Grammatik Grundlagen",
        description:
          "Articles, pronouns, present tense, and sentence structure.",
      },
      {
        title: "Erste Gespräche",
        description:
          "Practice conversations for real-world situations.",
      },
    ],
    price: "€349",
  },
  {
    id: "german-a2",
    title: "Elementary German",
    image:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop",
    level: "A2",
    description:
      "Build on your basics and gain confidence. Learn to describe your environment, handle everyday situations, and understand simple texts in German.",
    schedule: { days: "Dienstag–Donnerstag", time: "09:00–11:00 Uhr" },
    startDate: "2026-04-15",
    enrolled: 18,
    maxCapacity: 25,
    modules: [
      {
        title: "Reisen & Verkehr",
        description: "Travel vocabulary, directions, and transportation.",
      },
      {
        title: "Wohnen & Umgebung",
        description: "Describing your home, neighborhood, and city.",
      },
      {
        title: "Arbeit & Beruf",
        description: "Talking about jobs, workplaces, and schedules.",
      },
      {
        title: "Vergangenheit erzählen",
        description: "Past tense (Perfekt) and telling stories.",
      },
      {
        title: "Briefe & E-Mails",
        description: "Writing simple letters and emails in German.",
      },
    ],
    price: "€379",
  },
  {
    id: "german-b1",
    title: "Intermediate German",
    image:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400&fit=crop",
    level: "B1",
    description:
      "Take your German to the next level. Discuss opinions, understand main points of clear texts, and describe experiences, events, dreams, and ambitions.",
    schedule: { days: "Montag–Freitag", time: "14:00–16:00 Uhr" },
    startDate: "2026-05-01",
    enrolled: 15,
    maxCapacity: 20,
    modules: [
      {
        title: "Meinungen äußern",
        description: "Expressing and defending opinions on various topics.",
      },
      {
        title: "Medien & Nachrichten",
        description: "Understanding news articles and media reports.",
      },
      {
        title: "Konjunktiv II",
        description: "Subjunctive mood for wishes, polite requests, and hypotheticals.",
      },
      {
        title: "Kultur & Gesellschaft",
        description: "Discussing culture, traditions, and social issues.",
      },
      {
        title: "Prüfungsvorbereitung",
        description: "Preparation for the B1 Goethe-Zertifikat exam.",
      },
    ],
    price: "€429",
  },
  {
    id: "german-b2",
    title: "Upper-Intermediate German",
    image:
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&h=400&fit=crop",
    level: "B2",
    description:
      "Achieve fluency for professional and academic contexts. Understand complex texts, interact spontaneously, and produce clear, detailed writing on a wide range of subjects.",
    schedule: { days: "Mittwoch–Freitag", time: "17:00–19:30 Uhr" },
    startDate: "2026-06-01",
    enrolled: 12,
    maxCapacity: 20,
    modules: [
      {
        title: "Akademisches Schreiben",
        description: "Essay writing, argumentation, and formal register.",
      },
      {
        title: "Wirtschaft & Politik",
        description: "Economics, politics, and current affairs vocabulary.",
      },
      {
        title: "Passiv & Nominalisierung",
        description: "Passive voice and nominalization in formal German.",
      },
      {
        title: "Diskussionen führen",
        description: "Leading and participating in structured debates.",
      },
      {
        title: "Bewerbung & Lebenslauf",
        description: "Job applications, CVs, and interview preparation in German.",
      },
    ],
    price: "€479",
  },
  {
    id: "german-c1",
    title: "Advanced German",
    image:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop",
    level: "C1",
    description:
      "Master complex German for demanding academic and professional use. Understand implicit meaning, express ideas fluently, and use language flexibly for social, academic, and professional purposes.",
    schedule: { days: "Montag–Mittwoch", time: "19:00–21:30 Uhr" },
    startDate: "2026-07-01",
    enrolled: 8,
    maxCapacity: 15,
    modules: [
      {
        title: "Literatur & Analyse",
        description: "Reading and analyzing German literary texts.",
      },
      {
        title: "Wissenschaftssprache",
        description: "Academic language for research and presentations.",
      },
      {
        title: "Redewendungen & Idiome",
        description: "German idioms, collocations, and figurative language.",
      },
      {
        title: "Komplexe Grammatik",
        description: "Advanced grammar: extended attributes, participial constructions.",
      },
      {
        title: "C1 Prüfungstraining",
        description: "Intensive preparation for the C1 Goethe-Zertifikat.",
      },
    ],
    price: "€549",
  },
  {
    id: "german-c2",
    title: "Proficiency German",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop",
    level: "C2",
    description:
      "Reach near-native proficiency. Understand virtually everything heard or read, summarize information from different sources, and express yourself spontaneously with precision.",
    schedule: { days: "Dienstag–Donnerstag", time: "18:00–20:30 Uhr" },
    startDate: "2026-09-01",
    enrolled: 5,
    maxCapacity: 12,
    modules: [
      {
        title: "Stilistik & Rhetorik",
        description: "Style, rhetoric, and persuasive communication.",
      },
      {
        title: "Fachsprachen",
        description: "Specialized vocabulary across law, medicine, and technology.",
      },
      {
        title: "Übersetzung & Mediation",
        description: "Translation exercises and language mediation skills.",
      },
      {
        title: "Freies Schreiben",
        description: "Creative and analytical writing at a professional level.",
      },
      {
        title: "C2 Prüfungsvorbereitung",
        description: "Full preparation for the C2 Großes Deutsches Sprachdiplom.",
      },
    ],
    price: "€599",
  },
];

