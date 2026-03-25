import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send } from "lucide-react";
import { skillQuestions, areaOptions } from "@/data/questions";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
}

interface Props {
  onComplete: (data: {
    name: string;
    phone: string;
    email: string;
    area: string;
    scores: Record<string, number>;
  }) => void;
}

type Phase =
  | { type: "name" }
  | { type: "phone" }
  | { type: "email" }
  | { type: "area" }
  | { type: "intro" }
  | { type: "skill"; index: number }
  | { type: "done" };

const totalSkillQuestions = skillQuestions.length;
const totalSteps = 4 + totalSkillQuestions; // name, phone, email, area + skills

const ChatScreen = ({ onComplete }: Props) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [phase, setPhase] = useState<Phase>({ type: "name" });
  const [inputValue, setInputValue] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState({ name: "", phone: "", email: "", area: "" });
  const [scores, setScores] = useState<Record<string, number>>({});
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const initialized = useRef(false);

  const addBotMessage = useCallback((text: string) => {
    const msg: Message = { id: Date.now().toString() + Math.random(), sender: "bot", text };
    setMessages((prev) => [...prev, msg]);
  }, []);

  const addUserMessage = useCallback((text: string) => {
    const msg: Message = { id: Date.now().toString() + Math.random(), sender: "user", text };
    setMessages((prev) => [...prev, msg]);
  }, []);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        addBotMessage("Olá! Vamos começar. Qual é o seu nome completo?");
        setShowOptions(false);
      }, 1200);
    }
  }, [addBotMessage]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, showOptions, isTyping]);

  const advancePhase = useCallback(
    (nextPhase: Phase) => {
      setPhase(nextPhase);
      setShowOptions(false);
      setIsTyping(true);
      
      const typingTime = 1000 + Math.random() * 500; // Tempo randômico de "pensamento"
      
      setTimeout(() => {
        setIsTyping(false);
        switch (nextPhase.type) {
          case "phone":
            addBotMessage("Qual é o seu telefone?");
            break;
          case "email":
            addBotMessage("Qual é o seu e-mail?");
            break;
          case "area":
            addBotMessage("Em qual área você atua?");
            setTimeout(() => setShowOptions(true), 400);
            break;
          case "intro":
            addBotMessage(
              "Agora vou te fazer algumas perguntas sobre como você usa IA no seu trabalho. Escolha a opção que melhor descreve você."
            );
            
            // Pausa um pouco antes de mostrar a primeira skill question
            setIsTyping(true);
            setTimeout(() => {
              setIsTyping(false);
              setPhase({ type: "skill", index: 0 });
              setCurrentStep(4);
              const q = skillQuestions[0];
              addBotMessage(`${q.skill}: ${q.question}`);
              setTimeout(() => setShowOptions(true), 400);
            }, 2000);
            break;
          case "skill": {
            const idx = nextPhase.index;
            const q = skillQuestions[idx];
            setCurrentStep(4 + idx);
            addBotMessage(`${q.skill}: ${q.question}`);
            setTimeout(() => setShowOptions(true), 400);
            break;
          }
          case "done":
            break;
        }
      }, typingTime);
    },
    [addBotMessage]
  );

  const handleTextSubmit = () => {
    const val = inputValue.trim();
    if (!val) return;
    addUserMessage(val);
    setInputValue("");

    if (phase.type === "name") {
      setUserData((d) => ({ ...d, name: val }));
      setCurrentStep(1);
      advancePhase({ type: "phone" });
    } else if (phase.type === "phone") {
      setUserData((d) => ({ ...d, phone: val }));
      setCurrentStep(2);
      advancePhase({ type: "email" });
    } else if (phase.type === "email") {
      setUserData((d) => ({ ...d, email: val }));
      setCurrentStep(3);
      advancePhase({ type: "area" });
    }
  };

  const handleAreaSelect = (area: string) => {
    addUserMessage(area);
    setUserData((d) => ({ ...d, area }));
    setShowOptions(false);
    advancePhase({ type: "intro" });
  };

  const handleSkillSelect = (optionLabel: string, score: number) => {
    if (phase.type !== "skill") return;
    const idx = phase.index;
    const skill = skillQuestions[idx].skill;
    addUserMessage(optionLabel);
    setShowOptions(false);

    const newScores = { ...scores, [skill]: score };
    setScores(newScores);

    if (idx + 1 < totalSkillQuestions) {
      advancePhase({ type: "skill", index: idx + 1 });
    } else {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        addBotMessage("Analisando suas respostas e gerando seu diagnóstico completo...");
        
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          onComplete({ ...userData, scores: newScores });
        }, 2500);
      }, 1500);
    }
  };

  const showTextInput = phase.type === "name" || phase.type === "phone" || phase.type === "email";
  const progress = Math.round((currentStep / totalSteps) * 100);

  const currentOptions =
    phase.type === "area"
      ? areaOptions.map((a) => ({ label: a, action: () => handleAreaSelect(a) }))
      : phase.type === "skill"
      ? skillQuestions[phase.index]?.options.map((o) => ({
          label: o.label,
          action: () => handleSkillSelect(o.label, o.score),
        }))
      : [];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { currentTarget, clientX, clientY } = e;
    const { left, top } = currentTarget.getBoundingClientRect();
    currentTarget.style.setProperty("--mouseX", `${clientX - left}px`);
    currentTarget.style.setProperty("--mouseY", `${clientY - top}px`);
  };

  return (
    <div 
      className="flex flex-col h-screen dot-grid-bg bg-background/90"
      onMouseMove={handleMouseMove}
    >
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-6 pb-20 pt-5 bg-gradient-to-b from-black/95 via-black/50 to-transparent">
        <div className="flex items-center gap-4">
          <a href="https://stackx.com.br" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:opacity-80 transition-opacity drop-shadow-md">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center overflow-hidden border border-primary/50 p-0.5 shadow-lg">
              <img src="/icone-stackx.svg.svg" alt="StackX" className="w-full h-full object-contain rounded-full" />
            </div>
            <span className="font-heading text-xl font-medium text-foreground">Matriz IA</span>
          </a>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs font-medium text-muted-foreground">
            {currentStep + 1}/{totalSteps}
          </span>
          <div className="w-48 sm:w-64 md:w-80 h-2.5 rounded-full bg-background overflow-hidden border border-white/5 shadow-inner hidden sm:block">
            <motion.div
              className="h-full rounded-full bg-primary"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="relative z-10 flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-24">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.sender === "bot" && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full glass bg-black/60 flex items-center justify-center mr-2 mt-1 overflow-hidden border border-white/20 p-0.5 shadow-lg">
                  <img src="/icone-stackx.svg.svg" alt="StackX" className="w-full h-full object-contain rounded-full" />
                </div>
              )}
              <div
                className={`max-w-[85%] md:max-w-[75%] px-5 py-3.5 rounded-2xl text-[15px] leading-relaxed shadow-sm ${
                  msg.sender === "user"
                    ? "bg-primary text-black font-medium rounded-br-sm glow-orange-sm"
                    : "glass !bg-zinc-900/80 text-zinc-100 rounded-bl-sm border-white/5"
                }`}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}
          
          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              key="typing-indicator"
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ duration: 0.2 }}
              className="flex justify-start items-center"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full glass bg-black/60 flex items-center justify-center mr-2 mt-1 overflow-hidden border border-white/20 p-0.5 shadow-lg">
                <img src="/icone-stackx.svg.svg" alt="StackX" className="w-full h-full object-contain rounded-full" />
              </div>
              <div className="glass !bg-zinc-900/80 rounded-2xl rounded-bl-sm px-5 py-4 border-white/5 flex items-center gap-1.5 h-[46px] ml-1 shadow-sm">
                <motion.div className="w-2 h-2 rounded-full bg-primary/80" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut", delay: 0 }} />
                <motion.div className="w-2 h-2 rounded-full bg-primary/80" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut", delay: 0.2 }} />
                <motion.div className="w-2 h-2 rounded-full bg-primary/80" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut", delay: 0.4 }} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Options */}
        <AnimatePresence>
          {showOptions && currentOptions.length > 0 && !isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex flex-col sm:flex-row sm:flex-wrap gap-2.5 sm:pl-10 mt-2"
            >
              {currentOptions.map((opt, i) => (
                <motion.button
                  key={i}
                  onClick={opt.action}
                  className="w-full sm:w-auto glass !bg-black/70 px-5 py-3.5 rounded-xl text-[15px] font-medium text-zinc-200 !border-white/10 hover:!border-primary/60 focus-visible:!border-primary hover:!bg-black/90 hover:shadow-[0_0_20px_rgba(245,124,0,0.25)] transition-all duration-300 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-lg"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  aria-label={`Selecionar opção: ${opt.label}`}
                >
                  {opt.label}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input */}
      {showTextInput && (
        <div className="relative z-10 w-full px-4 sm:px-6 pb-6 sm:pb-8 max-w-4xl mx-auto flex-shrink-0">
          <div className="orange-gradient-border shadow-2xl relative rounded-full">
            <div className="w-full flex items-center relative input-glass-dark transition-all py-2 pl-6 pr-14 sm:pr-16">
              <input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => {
                  let val = e.target.value;
                  if (phase.type === "phone") {
                    val = val.replace(/\D/g, "");
                    if (val.length > 2) val = val.replace(/^(\d{2})/, "($1) ");
                    if (val.length > 7) val = val.replace(/(\(\d{2}\) )(\d)/, "$1$2 ");
                    if (val.length > 12) val = val.replace(/(\(\d{2}\) \d \d{4})(\d)/, "$1-$2");
                    val = val.slice(0, 16);
                  }
                  setInputValue(val);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isTyping) handleTextSubmit()
                }}
                placeholder={phase.type === "name" ? "Seu nome completo..." : phase.type === "phone" ? "(11) 9 0000-0000" : "Seu e-mail..."}
                className="w-full bg-transparent text-[16px] md:text-lg text-white placeholder:text-zinc-500 outline-none py-1.5 font-medium"
                autoFocus
                disabled={isTyping}
                aria-label={phase.type === "name" ? "Digite seu nome completo" : phase.type === "phone" ? "Digite seu telefone" : "Digite seu email"}
              />
              <button
                onClick={handleTextSubmit}
                disabled={isTyping}
                className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 rounded-full bg-primary flex items-center justify-center text-black hover:bg-primary/90 hover:shadow-[0_0_15px_rgba(245,124,0,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:ring-primary hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
                aria-label="Enviar mensagem"
              >
                <Send size={18} className="-ml-0.5 sm:hidden" />
                <Send size={20} className="-ml-0.5 hidden sm:block" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatScreen;
