import { motion } from "framer-motion";

const orbs = [
  { size: 200, x: "10%", y: "20%", delay: 0, color: "rgba(245,130,8,0.06)" },
  { size: 300, x: "70%", y: "60%", delay: 2, color: "rgba(245,130,8,0.04)" },
  { size: 150, x: "80%", y: "15%", delay: 1, color: "rgba(100,100,100,0.05)" },
  { size: 250, x: "20%", y: "70%", delay: 3, color: "rgba(100,100,100,0.04)" },
  { size: 180, x: "50%", y: "40%", delay: 1.5, color: "rgba(245,130,8,0.03)" },
];

const FloatingOrbs = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
    {orbs.map((orb, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full"
        style={{
          width: orb.size,
          height: orb.size,
          left: orb.x,
          top: orb.y,
          background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
        }}
        animate={{
          y: [0, -30, 0],
          x: [0, 15, 0],
        }}
        transition={{
          duration: 8,
          delay: orb.delay,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    ))}
  </div>
);

export default FloatingOrbs;
