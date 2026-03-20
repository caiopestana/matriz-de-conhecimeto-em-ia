import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import DarkVeil from "./DarkVeil";
import BorderGlow from "./BorderGlow";
import GradientText from "./GradientText";

interface Props {
  onStart: () => void;
}

const LandingScreen = ({ onStart }: Props) => (
  <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
    <div className="absolute inset-0 z-0 bg-black">
      <DarkVeil
        hueShift={0}
        noiseIntensity={0.01}
        scanlineIntensity={0}
        speed={0.5}
        scanlineFrequency={0}
        warpAmount={0}
      />
    </div>

    {/* Floating Glass Menu */}
    <div className="absolute top-4 sm:top-6 z-50 w-[95%] sm:w-[90%] max-w-5xl rounded-full border border-white/10 bg-black/40 px-5 sm:px-6 py-3.5 shadow-2xl backdrop-blur-xl flex items-center justify-between">
      <a
        href="https://stackx.com.br"
        target="_blank"
        rel="noopener noreferrer"
        className="flex shrink-0 items-center hover:scale-105 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full"
        aria-label="Ir para a página inicial da StackX"
      >
        <img src="/icone-stackx.svg.svg" alt="StackX Ícone" className="h-8 md:h-10 w-auto object-contain brightness-0 invert drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
      </a>
      <a
        href="https://stackx.com.br"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-[13px] md:text-sm font-medium text-zinc-300 border border-zinc-600 rounded-full px-5 py-2.5 transition-all duration-300 hover:border-primary hover:text-primary hover:bg-primary/10 hover:shadow-[0_0_20px_rgba(245,124,0,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        Voltar para o site
        <ArrowUpRight size={16} strokeWidth={2.5} />
      </a>
    </div>

    <motion.div
      className="relative z-10 flex flex-col items-center gap-6 md:gap-8 px-6 text-center max-w-4xl"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-[72px] text-white !leading-[1.15] font-bold mt-16 drop-shadow-lg tracking-tight">
        <GradientText
          colors={["#ff512f", "#f09819", "#ff512f", "#f09819"]}
          animationSpeed={14}
          showBorder={false}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-[72px]"
        >
          Descubra o quanto você sabe sobre IA
        </GradientText>
      </h1>

      <p className="max-w-2xl text-zinc-300 text-base sm:text-lg md:text-xl font-light mb-4 drop-shadow-md">
        Responda à nossa avaliação interativa e descubra de forma simples e rápida qual o seu verdadeiro nível de proficiência em ferramentas de Inteligência Artificial.
      </p>

      <div className="flex flex-col items-center gap-5 w-full sm:w-auto mt-2">
        <motion.button
          onClick={onStart}
          aria-label="Iniciar avaliação de conhecimentos em IA"
          className="w-full sm:w-auto rounded-full bg-primary px-12 py-4 font-heading text-[17px] font-bold text-black transition-all duration-300 shadow-[0_4px_20px_rgba(245,124,0,0.3)] hover:shadow-[0_4px_25px_rgba(245,124,0,0.5)] hover:scale-105 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/50"
          whileTap={{ scale: 0.96 }}
        >
          Começar diagnóstico
        </motion.button>
      </div>
    </motion.div>
  </div>
);

export default LandingScreen;
