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
import { skillQuestions, areas } from "@/data/questions";

interface Props {
  name: string;
  email: string;
  area: string;
  scores: Record<string, number>;
}

const profileDescriptions: Record<string, string> = {
  "Estrategista em IA":
    "Você se destaca em planejamento e governança de IA, liderando estratégias que transformam organizações.",
  "Inovador em IA":
    "Sua curiosidade e experimentação contínua fazem de você uma referência em inovação com inteligência artificial.",
  "Criativo em IA":
    "Você domina a criação de conteúdo e automação com IA, produzindo resultados surpreendentes.",
  "Líder em IA":
    "Sua habilidade em comunicação e gestão de pessoas com IA inspira equipes e transforma culturas.",
  "Profissional Completo em IA":
    "Você demonstra equilíbrio excepcional em todas as dimensões de proficiência em IA.",
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
    (a) => Math.abs(a.score - highest.score) <= 10
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

  const today = new Date().toLocaleDateString("pt-BR");

  const handleDownload = async () => {
    if (!certRef.current) return;
    const canvas = await html2canvas(certRef.current, {
      backgroundColor: "#1b1b1b",
      scale: 2,
    });
    const link = document.createElement("a");
    link.download = `matriz-ia-${name.toLowerCase().replace(/\s+/g, "-")}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const handleLinkedIn = () => {
    const text = encodeURIComponent(
      `Acabei de descobrir minha Matriz de IA pela StackX! Confira o seu também em ${window.location.href} #MatrizIA #StackX #InteligenciaArtificial`
    );
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&summary=${text}`,
      "_blank"
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-[640px]"
      >
        <div
          ref={certRef}
          className="glass rounded-2xl p-6 md:p-8 space-y-6"
          style={{ backgroundColor: "rgba(27,27,27,0.95)" }}
        >
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-heading text-xl text-foreground">Matriz IA</h2>
              <p className="text-xs text-muted-foreground">by StackX</p>
            </div>
            <p className="text-xs text-muted-foreground">{today}</p>
          </div>

          {/* Radar Chart */}
          <div className="w-full h-[280px] md:h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={chartData} cx="50%" cy="50%" outerRadius="75%">
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis
                  dataKey="skill"
                  tick={{ fill: "#e8e8e8", fontSize: 10, fontFamily: "Poppins" }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={false}
                  axisLine={false}
                />
                <Radar
                  name="Score"
                  dataKey="value"
                  stroke="#F58208"
                  fill="#F58208"
                  fillOpacity={0.35}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Area scores */}
          <div className="flex flex-wrap gap-2 justify-center">
            {areaScores.map((a) => (
              <div
                key={a.area}
                className="glass px-3 py-1.5 rounded-full text-xs text-foreground"
              >
                {a.area} <span className="text-primary font-heading">{a.score}%</span>
              </div>
            ))}
          </div>

          {/* Name & Profile */}
          <div className="text-center space-y-2">
            <h3 className="font-heading text-2xl text-foreground">{name}</h3>
            <p className="text-primary font-heading text-lg">{profileLabel}</p>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              {profileDescriptions[profileLabel]}
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-6 justify-center">
          <button
            onClick={handleDownload}
            className="rounded-full border border-primary text-primary px-6 py-2.5 font-heading text-sm hover:bg-primary/10 transition-colors"
          >
            Baixar certificado
          </button>
          <button
            onClick={handleLinkedIn}
            className="rounded-full bg-primary text-primary-foreground px-6 py-2.5 font-heading text-sm glow-orange hover:scale-105 active:scale-95 transition-transform"
          >
            Compartilhar no LinkedIn
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default CertificateScreen;
