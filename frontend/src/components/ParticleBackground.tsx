"use client";

import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import type { Container, Engine, ISourceOptions } from "tsparticles-engine";

interface ParticleBackgroundProps {
  className?: string;
  preset?: "default" | "colorful" | "dense" | "vibrant" | "light";
}

export default function ParticleBackground({ className, preset = "default" }: ParticleBackgroundProps) {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async (container: Container | undefined) => {
    // console.log(container);
  }, []);

  let options: ISourceOptions;

  switch (preset) {
    case "light":
      options = {
        fullScreen: {
          enable: false,
          zIndex: -1
        },
        fpsLimit: 60,
        particles: {
          color: {
            value: ["#3b82f6", "#6366f1", "#8b5cf6"],
          },
          links: {
            color: "#a5b4fc",
            distance: 150,
            enable: true,
            opacity: 0.4,
            width: 1,
          },
          move: {
            direction: "none",
            enable: true,
            outModes: {
              default: "out",
            },
            random: false,
            speed: 1.2,
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 1000,
            },
            value: 50,
          },
          opacity: {
            value: 0.5,
          },
          shape: {
            type: "circle",
          },
          size: {
            value: { min: 1, max: 3 },
          },
        },
        detectRetina: true,
      };
      break;
    case "vibrant":
      options = {
        fullScreen: {
          enable: false,
          zIndex: -1
        },
        fpsLimit: 120,
        interactivity: {
          events: {
            onClick: {
              enable: true,
              mode: "push",
            },
            onHover: {
              enable: true,
              mode: "repulse",
            },
            resize: true,
          },
          modes: {
            push: {
              quantity: 4,
            },
            repulse: {
              distance: 100,
              duration: 0.4,
            },
          },
        },
        particles: {
          color: {
            value: ["#3b82f6", "#6366f1", "#8b5cf6", "#d946ef"],
          },
          links: {
            color: "#a5b4fc",
            distance: 150,
            enable: true,
            opacity: 0.5,
            width: 1.5,
            triangles: {
              enable: true,
              opacity: 0.1
            }
          },
          collisions: {
            enable: true,
          },
          move: {
            direction: "none",
            enable: true,
            outModes: {
              default: "bounce",
            },
            random: false,
            speed: 2,
            straight: false,
            attract: {
              enable: true,
              rotateX: 600,
              rotateY: 1200
            }
          },
          number: {
            density: {
              enable: true,
              area: 800,
            },
            value: 80,
          },
          opacity: {
            value: 0.7,
          },
          shape: {
            type: ["circle", "triangle", "edge"],
          },
          size: {
            value: { min: 1, max: 5 },
          },
          shadow: {
            enable: true,
            color: "#3b82f6",
            blur: 5
          },
          twinkle: {
            particles: {
              enable: true,
              frequency: 0.05,
              opacity: 1
            },
            lines: {
              enable: true,
              frequency: 0.005,
              opacity: 1
            }
          }
        },
        detectRetina: true,
      };
      break;
    case "colorful":
      options = {
        fullScreen: {
          enable: false,
          zIndex: -1
        },
        fpsLimit: 60,
        particles: {
          color: {
            value: ["#FF6B6B", "#4ECDC4", "#FFE66D", "#1A535C", "#F7FFF7"],
          },
          links: {
            color: "#4ECDC4",
            distance: 150,
            enable: true,
            opacity: 0.3,
            width: 1,
          },
          collisions: {
            enable: true,
          },
          move: {
            direction: "none",
            enable: true,
            outModes: {
              default: "bounce",
            },
            random: true,
            speed: 1.5,
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 800,
            },
            value: 50,
          },
          opacity: {
            value: 0.7,
            animation: {
              enable: true,
              speed: 0.3,
              minimumValue: 0.1,
              sync: false
            }
          },
          shape: {
            type: ["circle", "triangle", "square"],
          },
          size: {
            value: { min: 1, max: 5 },
            animation: {
              enable: true,
              speed: 2,
              minimumValue: 0.1,
              sync: false
            }
          },
        },
        detectRetina: true,
      };
      break;
    case "dense":
      options = {
        fullScreen: {
          enable: false,
          zIndex: -1
        },
        fpsLimit: 60,
        particles: {
          color: {
            value: "#6366f1",
          },
          links: {
            color: "#6366f1",
            distance: 100,
            enable: true,
            opacity: 0.2,
            width: 0.5,
          },
          move: {
            direction: "none",
            enable: true,
            outModes: {
              default: "out",
            },
            random: false,
            speed: 0.8,
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 600,
            },
            value: 100,
          },
          opacity: {
            value: 0.4,
          },
          shape: {
            type: "circle",
          },
          size: {
            value: { min: 0.5, max: 1.5 },
          },
          twinkle: {
            particles: {
              enable: true,
              frequency: 0.05,
              opacity: 0.8
            }
          }
        },
        detectRetina: true,
      };
      break;
    default:
      options = {
        fullScreen: {
          enable: false,
          zIndex: -1
        },
        fpsLimit: 60,
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: "grab"
            }
          },
          modes: {
            grab: {
              distance: 140,
              links: {
                opacity: 0.5
              }
            }
          }
        },
        particles: {
          color: {
            value: "#6366f1",
          },
          links: {
            color: "#6366f1",
            distance: 150,
            enable: true,
            opacity: 0.3,
            width: 1,
          },
          move: {
            direction: "none",
            enable: true,
            outModes: {
              default: "bounce",
            },
            random: false,
            speed: 1,
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 800,
            },
            value: 60,
          },
          opacity: {
            value: 0.5,
          },
          shape: {
            type: "circle",
          },
          size: {
            value: { min: 1, max: 3 },
          },
        },
        detectRetina: true,
      };
  }

  return (
    <Particles
      id="tsparticles"
      className={className}
      init={particlesInit}
      loaded={particlesLoaded}
      options={options}
    />
  );
} 