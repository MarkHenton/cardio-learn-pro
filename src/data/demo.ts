import { University, Period, Discipline } from "@/types/app";

export const demoUniversity: University = {
  id: "uninassau-teresina",
  name: "Uninassau Medicina Teresina",
};

export const demoPeriod: Period = {
  id: "3-periodo",
  name: "3º período",
  universityId: demoUniversity.id,
};

const makeCounters = () => ({
  slides: 0,
  resumoAudio: 0,
  mapaMental: 0,
  relatorios: {
    guiaDeEstudo: 0,
    documentoDeResumo: 0,
    perguntas: 0,
    linhaDoTempo: 0,
  },
});

const disciplineNames = [
  "Bases Científicas da Medicina",
  "Integração dos Sistemas de Saúde",
  "Microbiologia",
  "Imunologia",
  "Patologia Geral",
  "Farmacologia Geral",
  "Introdução Às Técnicas Cirúrgicas",
  "Atividades Integrativas e Ativas Eixo IIA",
  "Atividades Práticas Interdisciplinares de Extensão II",
];

export const demoDisciplines: Discipline[] = disciplineNames.map((name, idx) => ({
  id: `disc-${idx + 1}`,
  name,
  course: "Medicina",
  periodId: demoPeriod.id,
  universityId: demoUniversity.id,
  counters: makeCounters(),
}));
