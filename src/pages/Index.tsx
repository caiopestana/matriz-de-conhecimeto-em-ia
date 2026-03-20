import { useState, Suspense, lazy } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LandingScreen from "@/components/LandingScreen";

const ChatScreen = lazy(() => import("@/components/ChatScreen"));
const CertificateScreen = lazy(() => import("@/components/CertificateScreen"));

type Screen = "landing" | "chat" | "result";

interface ResultData {
  name: string;
  phone: string;
  email: string;
  area: string;
  scores: Record<string, number>;
}

const LoadingFallback = () => (
  <div className="flex h-screen w-full items-center justify-center bg-black/95">
    <motion.div 
      className="w-12 h-12 rounded-full border-4 border-primary/10 border-t-primary"
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
    />
  </div>
);

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
          <Suspense fallback={<LoadingFallback />}>
            <ChatScreen
              onComplete={(data) => {
                setResultData(data);
                setScreen("result");
              }}
            />
          </Suspense>
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
          <Suspense fallback={<LoadingFallback />}>
            <CertificateScreen {...resultData} />
          </Suspense>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Index;
