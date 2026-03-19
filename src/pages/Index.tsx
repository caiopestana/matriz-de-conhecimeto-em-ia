import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LandingScreen from "@/components/LandingScreen";
import ChatScreen from "@/components/ChatScreen";
import CertificateScreen from "@/components/CertificateScreen";

type Screen = "landing" | "chat" | "result";

interface ResultData {
  name: string;
  email: string;
  area: string;
  scores: Record<string, number>;
}

const Index = () => {
  const [screen, setScreen] = useState<Screen>("landing");
  const [resultData, setResultData] = useState<ResultData | null>(null);

  return (
    <AnimatePresence mode="wait">
      {screen === "landing" && (
        <motion.div
          key="landing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <LandingScreen onStart={() => setScreen("chat")} />
        </motion.div>
      )}
      {screen === "chat" && (
        <motion.div
          key="chat"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="h-screen"
        >
          <ChatScreen
            onComplete={(data) => {
              setResultData(data);
              setScreen("result");
            }}
          />
        </motion.div>
      )}
      {screen === "result" && resultData && (
        <motion.div
          key="result"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <CertificateScreen {...resultData} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Index;
