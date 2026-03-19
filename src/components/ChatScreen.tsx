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
    email: string;
    area: string;
    scores: Record<string, number>;
  }) => void;
}

type Phase =
  | { type: "name" }
  | { type: "email" }
  | { type: "area" }
  | { type: "intro" }
  | { type: "skill"; index: number }
  | { type: "done" };

const totalSkillQuestions = skillQuestions.length;
const totalSteps = 3 + totalSkillQuestions; // name, email, area + skills

const ChatScreen = ({ onComplete }: Props) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [phase, setPhase] = useState<Phase>({ type: "name" });
  const [inputValue, setInputValue] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState({ name: "", email: "", area: "" });
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
      setTimeout(() => {
        addBotMessage("Olá! Vamos começar. Qual é o seu nome?");
        setShowOptions(false);
      }, 500);
    }
  }, [addBotMessage]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, showOptions]);

  const advancePhase = useCallback(
    (nextPhase: Phase) => {
      setPhase(nextPhase);
      setShowOptions(false);
      setTimeout(() => {
        switch (nextPhase.type) {
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
            setTimeout(() => {
              setPhase({ type: "skill", index: 0 });
              setCurrentStep(3);
              const q = skillQuestions[0];
              setTimeout(() => {
                addBotMessage(`${q.skill}: ${q.question}`);
                setTimeout(() => setShowOptions(true), 400);
              }, 600);
            }, 1500);
            break;
          case "skill": {
            const idx = nextPhase.index;
            const q = skillQuestions[idx];
            setCurrentStep(3 + idx);
            setTimeout(() => {
              addBotMessage(`${q.skill}: ${q.question}`);
              setTimeout(() => setShowOptions(true), 400);
            }, 600);
            break;
          }
          case "done":
            break;
        }
      }, 400);
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
      advancePhase({ type: "email" });
    } else if (phase.type === "email") {
      setUserData((d) => ({ ...d, email: val }));
      setCurrentStep(2);
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
      addBotMessage("Obrigado! Gerando seu certificado...");
      setTimeout(() => {
        onComplete({ ...userData, scores: newScores });
      }, 1500);
    }
  };

  const showTextInput = phase.type === "name" || phase.type === "email";
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

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 glass border-b border-border">
        <span className="font-heading text-lg text-foreground">Matriz IA</span>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            {currentStep + 1}/{totalSteps}
          </span>
          <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-primary"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
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
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center mr-2 mt-1">
                  <span className="text-primary-foreground font-heading text-sm">S</span>
                </div>
              )}
              <div
                className={`max-w-[85%] md:max-w-[70%] px-4 py-3 rounded-2xl text-sm ${
                  msg.sender === "user"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "glass text-foreground rounded-bl-md"
                }`}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Options */}
        <AnimatePresence>
          {showOptions && currentOptions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex flex-wrap gap-2 pl-10"
            >
              {currentOptions.map((opt, i) => (
                <motion.button
                  key={i}
                  onClick={opt.action}
                  className="glass px-4 py-2 rounded-xl text-sm text-foreground hover:border-primary/40 transition-all text-left"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
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
        <div className="px-4 py-3 glass border-t border-border">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleTextSubmit()}
              placeholder={phase.type === "name" ? "Seu nome..." : "Seu e-mail..."}
              className="flex-1 bg-muted rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              autoFocus
            />
            <button
              onClick={handleTextSubmit}
              className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center text-primary-foreground hover:scale-105 active:scale-95 transition-transform"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatScreen;
