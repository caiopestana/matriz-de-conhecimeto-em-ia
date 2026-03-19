export interface SkillQuestion {
  area: string;
  skill: string;
  question: string;
  options: { label: string; score: number }[];
}

export const areas = ["Estratégia", "Inovação", "Criatividade", "Liderança"];

export const skillQuestions: SkillQuestion[] = [
  // ESTRATÉGIA
  {
    area: "Estratégia",
    skill: "Planejamento",
    question: "Como você usa IA para planejar suas atividades?",
    options: [
      { label: "Identifico oportunidades simples de usar IA no meu dia a dia", score: 25 },
      { label: "Desenvolvo planos de implementação com objetivos e métricas", score: 50 },
      { label: "Lidero mudanças organizacionais colocando IA no centro da estratégia", score: 75 },
      { label: "Crio estratégias inovadoras que posicionam minha empresa como referência em IA", score: 100 },
    ],
  },
  {
    area: "Estratégia",
    skill: "Governança",
    question: "Como você gerencia o uso de IA na sua empresa?",
    options: [
      { label: "Sigo regras básicas de uso e privacidade", score: 25 },
      { label: "Crio políticas e monitoro o uso de IA na minha área", score: 50 },
      { label: "Implemento grupos de governança e sistemas de avaliação de riscos", score: 75 },
      { label: "Estabeleço sistemas completos de governança com métricas avançadas", score: 100 },
    ],
  },
  {
    area: "Estratégia",
    skill: "Implementação",
    question: "Como você implementa soluções de IA?",
    options: [
      { label: "Uso IA pontualmente em tarefas do dia a dia", score: 25 },
      { label: "Implemento IA de média complexidade conectando ferramentas", score: 50 },
      { label: "Implemento processos de IA para mim e meu time com monitoramento", score: 75 },
      { label: "Implemento metodologias para outros times com agentes e monitoramento de qualidade", score: 100 },
    ],
  },
  // INOVAÇÃO
  {
    area: "Inovação",
    skill: "Experimentação",
    question: "Como você testa soluções de IA?",
    options: [
      { label: "Testo ferramentas por curiosidade sem método definido", score: 25 },
      { label: "Desenvolvo hipóteses simples e documento aprendizados", score: 50 },
      { label: "Estruturo processos de experimentação e acompanho lançamentos", score: 75 },
      { label: "Estabeleço cultura de inovação contínua em toda a organização", score: 100 },
    ],
  },
  {
    area: "Inovação",
    skill: "Aprendizagem",
    question: "Como você desenvolve seu conhecimento em IA?",
    options: [
      { label: "Busco informações de forma reativa quando preciso", score: 25 },
      { label: "Crio rotina para aprender sobre IA e acompanhar tendências", score: 50 },
      { label: "Lidero iniciativas de capacitação e mentoro colegas", score: 75 },
      { label: "Antecipo tendências e contribuo para novos métodos em IA", score: 100 },
    ],
  },
  {
    area: "Inovação",
    skill: "Segurança",
    question: "Como você aplica práticas de segurança em IA?",
    options: [
      { label: "Sigo regras simples para proteger informações confidenciais", score: 25 },
      { label: "Crio políticas de uso e monitoro situações sensíveis", score: 50 },
      { label: "Desenvolvo sistemas de detecção de uso inadequado em tempo real", score: 75 },
      { label: "Crio soluções de segurança referência no mercado", score: 100 },
    ],
  },
  // CRIATIVIDADE
  {
    area: "Criatividade",
    skill: "Geração de Conteúdo",
    question: "Como você usa IA para criar conteúdo?",
    options: [
      { label: "Uso IA para tarefas simples como textos curtos e resumos", score: 25 },
      { label: "Faço prompts estruturados combinando texto, imagem e áudio", score: 50 },
      { label: "Crio bibliotecas de prompts e fluxos de trabalho com várias ferramentas", score: 75 },
      { label: "Implemento sistemas escaláveis de geração com aprovação automática", score: 100 },
    ],
  },
  {
    area: "Criatividade",
    skill: "Automação",
    question: "Como você automatiza tarefas com IA?",
    options: [
      { label: "Uso ferramentas simples para automatizar tarefas repetitivas", score: 25 },
      { label: "Crio automações com regras simples e integro IA em fluxos existentes", score: 50 },
      { label: "Combino ferramentas para automatizar processos complexos com supervisão", score: 75 },
      { label: "Desenvolvo sistemas robustos com monitoramento e recuperação de erros", score: 100 },
    ],
  },
  {
    area: "Criatividade",
    skill: "Análise de Dados",
    question: "Como você usa dados com IA?",
    options: [
      { label: "Uso IA para análises simples e resumos de documentos", score: 25 },
      { label: "Processo grandes volumes de dados e crio dashboards básicos", score: 50 },
      { label: "Combino IA com ferramentas avançadas para recomendações automáticas", score: 75 },
      { label: "Desenvolvo modelos preditivos que orientam estratégias organizacionais", score: 100 },
    ],
  },
  // LIDERANÇA
  {
    area: "Liderança",
    skill: "Comunicação",
    question: "Como você usa IA para comunicação?",
    options: [
      { label: "Uso IA para e-mails, mensagens simples e traduções", score: 25 },
      { label: "Personalizo comunicações para diferentes públicos ajustando tom e estilo", score: 50 },
      { label: "Monitoro efetividade das comunicações e preparo apresentações com IA", score: 75 },
      { label: "Crio estratégias de comunicação referência e mentoro líderes", score: 100 },
    ],
  },
  {
    area: "Liderança",
    skill: "Colaboração",
    question: "Como você usa IA para promover colaboração?",
    options: [
      { label: "Uso IA para marcar reuniões e documentar decisões simples", score: 25 },
      { label: "Analiso participação em reuniões e identifico falhas de comunicação", score: 50 },
      { label: "Implemento sistemas de colaboração conectando pessoas de diferentes áreas", score: 75 },
      { label: "Crio ecossistemas colaborativos que influenciam outras organizações", score: 100 },
    ],
  },
  {
    area: "Liderança",
    skill: "Gestão de Pessoas",
    question: "Como você usa IA para apoiar a gestão de pessoas?",
    options: [
      { label: "Uso IA para tarefas simples como lembretes e organizar informações", score: 25 },
      { label: "Personalizo planos de desenvolvimento e feedbacks com IA", score: 50 },
      { label: "Utilizo IA para prever necessidades e antecipar riscos de performance", score: 75 },
      { label: "Crio novos modelos de liderança integrando IA para transformar gestão", score: 100 },
    ],
  },
];

export const areaOptions = [
  "Desenvolvimento",
  "Produto",
  "Design",
  "Marketing",
  "Dados",
  "Gestão",
  "Outra",
];
