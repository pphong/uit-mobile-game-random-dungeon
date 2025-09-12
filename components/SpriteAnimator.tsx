import React, { useEffect, useState } from "react";
import { Image } from "react-native";

type SpriteAnimatorProps = {
  frames: any[];
  trigger: any;
  duration?: number;
  loop?: boolean;
  onEnd?: () => void;
  style?: object;
};

export default function SpriteAnimator({
  frames,
  trigger,
  duration = 100,
  loop = false,
  onEnd,
  style,
}: SpriteAnimatorProps) {
  const [currentFrame, setCurrentFrame] = useState(0);

  useEffect(() => {
    if (trigger == null || trigger === undefined) return;

    let frame = 0;
    setCurrentFrame(0);

    const interval = setInterval(() => {
      frame++;
      if (frame >= frames.length) {
        if (loop) {
          frame = 0;
        } else {
          clearInterval(interval);
          onEnd?.();
          return;
        }
      }
      setCurrentFrame(frame);
    }, duration);

    return () => clearInterval(interval);
  }, [trigger]);

  return (
    <Image
      source={frames[currentFrame]}
      style={[{ width: 180, height: 100 }, style]}
    />
  );
}
