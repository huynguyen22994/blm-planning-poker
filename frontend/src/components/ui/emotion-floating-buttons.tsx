import React, { useEffect, useState } from "react";
import "@/css/emotion-floating-buttons.css";
import { socket } from "@/lib/socket";
import { usePokerRoom } from "@/hooks/usePokerRoom";

type EmotionType = "heart" | "sad" | "think" | "angry";

interface Emotion {
  id: number;
  type: EmotionType;
  label: string;
}

const emotionIconMap: Record<EmotionType, string> = {
  heart: "❤️",
  sad: "😢",
  think: "🤔",
  angry: "😡",
};

export const EmotionFloatingButtons: React.FC = () => {
  const [emotions, setEmotions] = useState<Emotion[]>([]);

  const { reaction } = usePokerRoom();

  /** EFFECT */
  useEffect(() => {
    socket.on("player-reacted", (data) => {
      if (data && data?.emotion) {
        const { emotion, player } = data;
        const newEmotion: Emotion = {
          id: Date.now() + Math.random(),
          type: emotion,
          label: player?.name,
        };
        setEmotions((prev) => [...prev, newEmotion]);
        // remove sau khi animation kết thúc
        setTimeout(() => {
          setEmotions((prev) => prev.filter((e) => e.id !== newEmotion.id));
        }, 2000);
      }
    });

    return () => {
      socket.off("player-reacted");
    };
  }, []);

  /** FUNCTIONS */
  const handleClick = (type: EmotionType) => {
    reaction(type);
  };

  return (
    <>
      {/* Floating buttons */}
      <div className="emotion-buttons">
        <button onClick={() => handleClick("heart")}>❤️</button>
        <button onClick={() => handleClick("sad")}>😢</button>
        <button onClick={() => handleClick("think")}>🤔</button>
        <button onClick={() => handleClick("angry")}>😡</button>
      </div>

      {/* Floating effects */}
      <div className="emotion-effects">
        {emotions.map((emotion) => (
          <span
            key={emotion.id}
            className={`emotion-float emotion-${emotion.type}`}
          >
            {emotionIconMap[emotion.type]} {emotion.label}
          </span>
        ))}
      </div>
    </>
  );
};
