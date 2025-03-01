
export type EasingFunction = (t: number) => number;

export const easings = {
  linear: (t: number) => t,
  easeInQuad: (t: number) => t * t,
  easeOutQuad: (t: number) => t * (2 - t),
  easeInOutQuad: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easeInCubic: (t: number) => t * t * t,
  easeOutCubic: (t: number) => --t * t * t + 1,
  easeInOutCubic: (t: number) =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  easeInQuart: (t: number) => t * t * t * t,
  easeOutQuart: (t: number) => 1 - --t * t * t * t,
  easeInOutQuart: (t: number) =>
    t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t,
};

export type StaggerConfig = {
  delay?: number;
  duration?: number;
  staggerChildren?: number;
  delayChildren?: number;
};

export type AnimationVariant = {
  hidden: Record<string, any>;
  visible: Record<string, any>;
};

export const fadeIn = (
  direction: "up" | "down" | "left" | "right" | "none" = "none",
  duration: number = 0.4,
  delay: number = 0
): AnimationVariant => {
  const variants: AnimationVariant = {
    hidden: {
      opacity: 0,
      transition: {
        duration,
        delay,
      },
    },
    visible: {
      opacity: 1,
      transition: {
        duration,
        delay,
      },
    },
  };

  if (direction === "up") {
    variants.hidden.y = 20;
    variants.visible.y = 0;
  } else if (direction === "down") {
    variants.hidden.y = -20;
    variants.visible.y = 0;
  } else if (direction === "left") {
    variants.hidden.x = 20;
    variants.visible.x = 0;
  } else if (direction === "right") {
    variants.hidden.x = -20;
    variants.visible.x = 0;
  }

  return variants;
};

export const scale = (duration: number = 0.4, delay: number = 0): AnimationVariant => {
  return {
    hidden: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration,
        delay,
      },
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration,
        delay,
      },
    },
  };
};

export const staggerContainer = (
  config: StaggerConfig = {}
): AnimationVariant => {
  const { staggerChildren = 0.1, delayChildren = 0 } = config;

  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren,
        delayChildren,
      },
    },
  };
};

export const zoomIn = (
  duration: number = 0.5,
  delay: number = 0
): AnimationVariant => {
  return {
    hidden: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration,
        delay,
      },
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration,
        delay,
      },
    },
  };
};
