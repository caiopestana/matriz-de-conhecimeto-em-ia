import { motion } from "framer-motion";
import FloatingOrbs from "./FloatingOrbs";

interface Props {
  onStart: () => void;
}

const LandingScreen = ({ onStart }: Props) => (
  <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
    <FloatingOrbs />
    <motion.div
      className="relative z-10 flex flex-col items-center gap-6 px-6 text-center"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h1 className="font-heading text-5xl md:text-6xl text-foreground">
        Matriz IA
      </h1>
      <p className="font-heading text-xl md:text-2xl text-primary">
        Descubra sua Matriz de IA
      </p>
      <p className="max-w-md text-muted-foreground text-sm md:text-base">
        Responda algumas perguntas e descubra seu nível de proficiência em
        Inteligência Artificial.
      </p>
      <motion.button
        onClick={onStart}
        className="mt-4 rounded-full bg-primary px-8 py-3 font-heading text-primary-foreground text-lg glow-orange transition-all hover:scale-105 active:scale-95"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Começar agora
      </motion.button>
    </motion.div>
  </div>
);

export default LandingScreen;
