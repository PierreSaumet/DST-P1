import { motion } from "framer-motion";

function AnimatedText({ text }) {
  return (
    <span className="inline">
      {text.split(" ").map((word, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap">
          {word.split("").map((char, ci) => (
            <motion.span
              key={ci}
              animate={{ color: "inherit" }}
              whileHover={{ y: -10, color: "#9333EA" }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="inline-block"
            >
              {char}
            </motion.span>
          ))}
          {wi < text.split(" ").length - 1 && "\u00A0"}
        </span>
      ))}
    </span>
  );
}

export default AnimatedText;
