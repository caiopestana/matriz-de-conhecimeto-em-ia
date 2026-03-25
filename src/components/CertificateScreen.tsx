import { useRef } from "react";
import { motion } from "framer-motion";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { skillQuestions, areas } from "@/data/questions";
import { ArrowUpRight } from "lucide-react";

interface Props {
  name: string;
  phone: string;
  email: string;
  area: string;
  scores: Record<string, number>;
}

const profileDescriptions: Record<string, string> = {
  "Estrategista em IA":
    "Une criatividade e estratégia para transformar ideias ousadas em planos concretos, usando IA generativa para inovar e gerar impacto real nos negócios.",
  "Inovador em IA":
    "Sua curiosidade e capacidade de experimentação contínua fazem de você uma mente visionária, sendo referência em inovação com inteligência artificial.",
  "Criativo em IA":
    "Você domina a criação de conteúdo e automação avançada com IA, produzindo resultados surpreendentes e rompendo os limites do formato tradicional.",
  "Líder em IA":
    "Sua habilidade excepcional em comunicação e gestão de pessoas com IA inspira equipes, engaja times e transforma culturas num ambiente corporativo ágil.",
  "Profissional Completo em IA":
    "Você demonstra um equilíbrio excepcional em todas as dimensões de proficiência em IA, orquestrando soluções complexas com maestria.",
};

const CertificateScreen = ({ name, scores }: Props) => {
  const certRef = useRef<HTMLDivElement>(null);

  const chartData = skillQuestions.map((q) => ({
    skill: q.skill,
    value: scores[q.skill] || 0,
    fullMark: 100,
  }));

  const areaScores = areas.map((area) => {
    const areaSkills = skillQuestions.filter((q) => q.area === area);
    const avg = Math.round(
      areaSkills.reduce((sum, q) => sum + (scores[q.skill] || 0), 0) / areaSkills.length
    );
    return { area, score: avg };
  });

  const highest = areaScores.reduce((a, b) => (b.score > a.score ? b : a));
  const allBalanced = areaScores.every(
    (a) => Math.abs(a.score - highest.score) <= 15
  );

  const profileLabel = allBalanced
    ? "Profissional Completo em IA"
    : highest.area === "Estratégia"
    ? "Estrategista em IA"
    : highest.area === "Inovação"
    ? "Inovador em IA"
    : highest.area === "Criatividade"
    ? "Criativo em IA"
    : "Líder em IA";

  // Formatar data no padrão: 19 de março de 2026
  const today = new Date().toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  const handleDownloadPdf = async () => {
    if (!certRef.current) return;
    try {
      const canvas = await html2canvas(certRef.current, {
        backgroundColor: "#111111", 
        scale: 2,           
        useCORS: true,      
        logging: false,
      });
      
      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      
      const pdf = new jsPDF("landscape", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      const yOffset = (pdf.internal.pageSize.getHeight() - pdfHeight) / 2;
      
      pdf.addImage(imgData, "JPEG", 0, yOffset > 0 ? yOffset : 0, pdfWidth, pdfHeight);
      pdf.save(`matriz-ia-${name.toLowerCase().replace(/\s+/g, "-")}.pdf`);
    } catch (error) {
      console.error("Erro ao gerar PDF", error);
    }
  };

  const handleLinkedIn = () => {
    const text = encodeURIComponent(
      `Esse foi meu resultado na Matriz de Conhecimento em IA da StackX. Faça o seu teste também!`
    );
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&summary=${text}`,
      "_blank"
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 dot-grid-bg bg-background/90 relative overflow-hidden">
      {/* Top Black Gradient */}
      <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-black/95 via-black/50 to-transparent pointer-events-none z-10" />

      {/* Floating Glass Menu */}
      <div className="absolute top-6 z-50 w-[90%] max-w-5xl rounded-full border border-white/10 bg-black/40 px-4 md:px-6 py-3 shadow-xl backdrop-blur-md flex items-center justify-between">
        <a 
          href="https://stackx.com.br" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex shrink-0 items-center hover:scale-105 transition-transform"
        >
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center overflow-hidden border border-primary/50 p-0.5 shadow-lg">
            <img src="/icone-stackx.svg.svg" alt="StackX" className="w-full h-full object-contain rounded-full" />
          </div>
        </a>
        <a 
          href="https://stackx.com.br" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs md:text-sm font-light text-zinc-300 border border-zinc-600 rounded-full px-4 py-2 transition-all duration-300 hover:border-primary hover:text-primary hover:bg-primary/10 hover:shadow-[0_0_20px_rgba(245,124,0,0.35)]"
        >
          Voltar para o site
          <ArrowUpRight size={16} />
        </a>
      </div>

      {/* Scrollable container for smaller screens */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-[1100px] pt-24 pb-8 z-20 flex flex-col items-center"
      >
        <div className="w-full overflow-x-auto pb-6 snap-x snap-mandatory flex justify-start md:justify-center items-center rounded-xl scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {/* Certificate Container: Aumentado para 1040x736 para mais espaço e proporção ideal */}
          <div
            ref={certRef}
            className="w-[1040px] h-[736px] shrink-0 relative p-14 flex flex-col justify-between overflow-hidden shadow-2xl rounded-sm snap-center bg-[#111111]"
            style={{ 
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.05)",
              background: "linear-gradient(135deg, rgba(20,20,20,1) 0%, rgba(10,10,10,1) 100%)"
            }}
          >
            {/* Decorações do background - Dot Grid */}
            <div 
              className="absolute inset-0 pointer-events-none" 
              style={{
                backgroundImage: 'radial-gradient(rgba(200, 200, 200, 0.5) 1px, transparent 1px)',
                backgroundSize: '24px 24px',
                opacity: 0.08
              }}
            />

            {/* Header: Titulo e Logo */}
            <div className="flex justify-between items-start z-10 w-full relative">
              <h2 className="font-heading text-[38px] font-bold leading-[1.15] text-white/95 tracking-tight">
                Matriz de conhecimento em<br />
                <span className="text-primary tracking-wide">Inteligência Artificial</span>
              </h2>
              
              {/* STACKX Logo Padrão da Aplicação */}
              <div className="ml-6 shrink-0 flex items-center justify-center">
                <img src="/icone-stackx.svg.svg" alt="StackX" className="h-[60px] w-auto object-contain drop-shadow-md" />
              </div>
            </div>

            {/* Conteudo Principal: Grafico e Infos */}
            <div className="flex-1 flex items-center justify-between z-10 mt-6 gap-12">
              
              {/* Radar Chart (Esquerda) */}
              <div className="w-[52%] h-[480px] relative">
                <ResponsiveContainer width="100%" height="100%">
                  {/* outerRadius reduzido de 60% para 50% para dar ainda mais respiro */}
                  <RadarChart data={chartData} cx="50%" cy="50%" outerRadius="50%">
                    <PolarGrid stroke="rgba(255,255,255,0.15)" strokeDasharray="3 3" />
                    <PolarAngleAxis
                      dataKey="skill"
                      tick={(props: any) => {
                        const { payload, x, y, cx, cy, ...rest } = props;
                        // Calcula um fator para afastar os textos do centro
                        const dx = x - cx;
                        const dy = y - cy;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        // Aumenta a distância radial em 20px
                        const offset = 20; 
                        const newX = x + (dx / distance) * offset;
                        const newY = y + (dy / distance) * offset;

                        return (
                          <text
                            {...rest}
                            x={newX}
                            y={newY}
                            fill="#f0f0f0"
                            fontSize={11}
                            fontFamily="Poppins, sans-serif"
                            fontWeight={500}
                          >
                            {payload.value}
                          </text>
                        );
                      }}
                    />
                    <PolarRadiusAxis
                      angle={30}
                      domain={[0, 100]}
                      tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10, fontFamily: "Poppins" }}
                      tickCount={5}
                      axisLine={false}
                    />
                    <Radar
                      name="Score"
                      dataKey="value"
                      stroke="#F58208"
                      strokeWidth={3}
                      fill="#F58208"
                      fillOpacity={0.4}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              
              {/* Info Textos (Direita) */}
              <div className="w-[45%] flex flex-col justify-center gap-12 text-left relative pl-6">
                {/* Linha divisoria lateral */}
                <div className="absolute left-0 top-[-20px] bottom-[-20px] w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />

                <div className="space-y-2">
                  <p className="text-[13px] text-foreground/50 tracking-[0.25em] font-heading font-semibold uppercase flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary/60"></span>
                    Nome
                  </p>
                  <h3 className="font-heading text-[42px] font-bold text-white/95 tracking-tight leading-tight">{name}</h3>
                </div>
                
                <div className="space-y-2">
                  <p className="text-[13px] text-foreground/50 tracking-[0.25em] font-heading font-semibold uppercase flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary/60"></span>
                    Perfil
                  </p>
                  <p className="text-primary font-heading text-[34px] font-bold leading-tight">{profileLabel}</p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-[13px] text-foreground/50 tracking-[0.25em] font-heading font-semibold uppercase flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary/60"></span>
                    Descrição
                  </p>
                  <p className="text-zinc-400 text-[19px] leading-relaxed max-w-md font-light">
                    {profileDescriptions[profileLabel]}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer: Site e Data */}
            <div className="flex justify-between items-end z-10 w-full relative mt-6">
              <div className="flex items-center gap-4">
                {/* Icone de globo estilisado */}
                <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center opacity-70">
                  <div className="w-full h-[1px] bg-white/20 absolute"></div>
                  <div className="h-full w-[1px] bg-white/20 absolute"></div>
                  <div className="w-[60%] h-full rounded-[50%] border border-white/20 absolute"></div>
                </div>
                <div className="text-left font-sans flex flex-col justify-center">
                  <p className="text-white/40 text-[11px] font-bold uppercase tracking-[0.1em] mb-[2px]">Acesse</p>
                  <p className="text-white/85 font-semibold text-[15px] tracking-wide">stackx.com.br/matriz-ia</p>
                </div>
              </div>
              
              <p className="text-white/40 text-[15px] font-sans tracking-wide font-medium">
                {today}
              </p>
            </div>
          </div>
        </div>

        {/* Buttons (Fora do PDF) */}
        <div className="flex flex-col sm:flex-row gap-5 mt-10 justify-center w-full max-w-lg mx-auto">
          <button
            onClick={handleDownloadPdf}
            className="rounded-full border border-primary text-primary px-8 py-4 font-heading text-[15px] font-semibold hover:bg-primary/10 transition-colors w-full sm:w-auto text-center flex items-center justify-center gap-2"
          >
             Baixar seu resultado
          </button>
          <button
            onClick={handleLinkedIn}
            className="rounded-full bg-primary text-primary-foreground px-8 py-4 font-heading text-[15px] font-semibold glow-orange hover:scale-105 active:scale-95 transition-transform w-full sm:w-auto text-center shadow-[0_0_20px_rgba(245,124,0,0.4)]"
          >
            Compartilhar no LinkedIn
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default CertificateScreen;
