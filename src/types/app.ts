export type Category =
  | "slides"
  | "resumo-audio"
  | "mapa-mental"
  | "relatorios";

export type RelatorioSubcategory =
  | "guia-de-estudo"
  | "documento-de-resumo"
  | "perguntas"
  | "linha-do-tempo";

export type MaterialType =
  | "html"
  | "wav"
  | "json"
  | "mp3"
  | "pdf"
  | "ppt"
  | "pptx"
  | "ppx"
  | "png"
  | "jpg"
  | "jpeg";

export interface University {
  id: string;
  name: string;
}

export interface Period {
  id: string;
  name: string; // e.g., "3º período"
  universityId: string;
}

export interface DisciplineCounters {
  slides: number;
  resumoAudio: number;
  mapaMental: number;
  relatorios: {
    guiaDeEstudo: number;
    documentoDeResumo: number;
    perguntas: number;
    linhaDoTempo: number;
  };
}

export interface Discipline {
  id: string;
  name: string;
  course: string; // Medicina
  periodId: string;
  universityId: string;
  counters: DisciplineCounters;
}

export interface Subscriber {
  id: string;
  name: string;
  email: string;
  universityId: string;
  periodId: string;
  active: boolean;
}

export interface Material {
  id: string;
  title: string;
  filename: string;
  type: MaterialType;
  size?: number;
  url?: string; // demo only
  disciplineId: string;
  universityId: string;
  periodId: string;
  category: Category;
  subcategory?: RelatorioSubcategory;
  createdAt: string; // ISO
}
