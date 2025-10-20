import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "AtlasReg by ness.",
  version: packageJson.version,
  copyright: `© ${currentYear}, ness. - Todos os direitos reservados`,
  meta: {
    title: "AtlasReg by ness. | Inteligência de Mercado para Transmissão de Energia",
    description:
      "Plataforma de IA para monitoramento automático e análise do setor de transmissão de energia elétrica brasileiro. Coleta, processa e alerta sobre eventos críticos (ANEEL, ONS, SIGEL) com inteligência artificial. Powered by ness.",
  },
  brand: {
    wordmark: "ness.",
    accentColor: "#00ADE8",  // Cor do ponto no wordmark ness.
    font: "Montserrat",
  }
};
