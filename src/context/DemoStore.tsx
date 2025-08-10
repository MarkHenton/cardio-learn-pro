import React, { createContext, useContext, useMemo, useState, ReactNode } from "react";
import type {
  University,
  Period,
  Discipline,
  Material,
  Subscriber,
  Category,
  RelatorioSubcategory,
} from "@/types/app";
import { demoUniversity, demoPeriod, demoDisciplines } from "@/data/demo";

interface DemoState {
  universities: University[];
  periods: Period[];
  disciplines: Discipline[];
  materials: Material[];
  subscribers: Subscriber[];
}

interface DemoActions {
  addUniversity: (name: string) => University;
  addPeriod: (universityId: string, name: string) => Period;
  addDiscipline: (universityId: string, periodId: string, name: string, course?: string) => Discipline;
  addSubscriber: (payload: Omit<Subscriber, "id">) => Subscriber;
  addMaterial: (payload: Omit<Material, "id" | "createdAt">) => Material;
}

const DemoStoreContext = createContext<(DemoState & DemoActions) | null>(null);

function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}_${Date.now().toString(36)}`;
}

export const DemoStoreProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<DemoState>({
    universities: [demoUniversity],
    periods: [demoPeriod],
    disciplines: demoDisciplines,
    materials: [],
    subscribers: [],
  });

  const actions: DemoActions = {
    addUniversity: (name) => {
      const uni: University = { id: uid("uni"), name };
      setState((s) => ({ ...s, universities: [...s.universities, uni] }));
      return uni;
    },
    addPeriod: (universityId, name) => {
      const per: Period = { id: uid("per"), name, universityId };
      setState((s) => ({ ...s, periods: [...s.periods, per] }));
      return per;
    },
    addDiscipline: (universityId, periodId, name, course = "Medicina") => {
      const disc: Discipline = {
        id: uid("disc"),
        name,
        course,
        periodId,
        universityId,
        counters: {
          slides: 0,
          resumoAudio: 0,
          mapaMental: 0,
          relatorios: { guiaDeEstudo: 0, documentoDeResumo: 0, perguntas: 0, linhaDoTempo: 0 },
        },
      };
      setState((s) => ({ ...s, disciplines: [...s.disciplines, disc] }));
      return disc;
    },
    addSubscriber: (payload) => {
      const sub: Subscriber = { id: uid("sub"), ...payload };
      setState((s) => ({ ...s, subscribers: [...s.subscribers, sub] }));
      return sub;
    },
    addMaterial: (payload) => {
      const mat: Material = { id: uid("mat"), createdAt: new Date().toISOString(), ...payload };
      setState((s) => {
        const disc = s.disciplines.find((d) => d.id === mat.disciplineId);
        if (disc) {
          const counters = { ...disc.counters };
          if (mat.category === "slides") counters.slides += 1;
          if (mat.category === "resumo-audio") counters.resumoAudio += 1;
          if (mat.category === "mapa-mental") counters.mapaMental += 1;
          if (mat.category === "relatorios") {
            const key = mat.subcategory as RelatorioSubcategory | undefined;
            if (key === "guia-de-estudo") counters.relatorios.guiaDeEstudo += 1;
            if (key === "documento-de-resumo") counters.relatorios.documentoDeResumo += 1;
            if (key === "perguntas") counters.relatorios.perguntas += 1;
            if (key === "linha-do-tempo") counters.relatorios.linhaDoTempo += 1;
          }
          const updatedDisc: Discipline = { ...disc, counters };
          return {
            ...s,
            disciplines: s.disciplines.map((d) => (d.id === updatedDisc.id ? updatedDisc : d)),
            materials: [...s.materials, mat],
          };
        }
        return { ...s, materials: [...s.materials, mat] };
      });
      return mat;
    },
  };

  const value = useMemo(() => ({ ...state, ...actions }), [state]);

  return <DemoStoreContext.Provider value={value}>{children}</DemoStoreContext.Provider>;
};

export function useDemoStore() {
  const ctx = useContext(DemoStoreContext);
  if (!ctx) throw new Error("useDemoStore must be used within DemoStoreProvider");
  return ctx;
}
