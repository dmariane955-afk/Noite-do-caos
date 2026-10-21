import React, { useEffect, useRef } from 'react';

interface AnalogEffectsProps {
  glitchActive?: boolean;
  intensity?: 'subtle' | 'medium' | 'high';
}

export const AnalogEffects: React.FC<AnalogEffectsProps> = ({
  glitchActive = false,
  intensity = 'medium',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Canvas de baixa resolução para simulação ultraleve de estática analógica
    const width = 128;
    const height = 96;
    canvas.width = width;
    canvas.height = height;

    const imgData = ctx.createImageData(width, height);
    const buffer32 = new Uint32Array(imgData.data.buffer);
    let animationFrameId: number;
    let frameCount = 0;

    const renderNoise = () => {
      frameCount++;
      // Renderiza a cada 2 frames para reduzir ainda mais o uso de CPU mantendo o aspecto clássico de VHS
      if (frameCount % 2 === 0) {
        const len = buffer32.length;
        for (let i = 0; i < len; i++) {
          if (Math.random() > 0.45) {
            // Pixels de estática analógica com leves toques avermelhados
            const gray = (Math.random() * 255) | 0;
            buffer32[i] = (255 << 24) | (gray << 16) | (gray << 8) | gray;
          } else {
            buffer32[i] = 0; // Transparente
          }
        }
        ctx.putImageData(imgData, 0, 0);
      }
      animationFrameId = requestAnimationFrame(renderNoise);
    };

    renderNoise();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const opacityMap = {
    subtle: 'opacity-[0.035]',
    medium: 'opacity-[0.065]',
    high: 'opacity-[0.16]',
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden select-none">
      {/* 1. Canvas de Estática Analógica */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full mix-blend-screen ${opacityMap[intensity]} ${
          glitchActive ? 'opacity-30' : ''
        }`}
        style={{ imageRendering: 'pixelated' }}
        aria-hidden="true"
      />

      {/* 2. Scanlines CRT de Televisão de Tubo */}
      <div className="absolute inset-0 crt-overlay opacity-60" aria-hidden="true" />

      {/* 3. Vinheta e Curvatura CRT */}
      <div className="absolute inset-0 crt-vignette opacity-90" aria-hidden="true" />

      {/* 4. Barra de Tracking VHS em loop sutil */}
      <div
        className="absolute left-0 right-0 h-2 bg-white/5 blur-[2px] vhs-scanbar pointer-events-none"
        aria-hidden="true"
      />

      {/* 5. Linhas de corte da tela analógica (letterbox sutil) */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-red-950/20" />
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-red-950/20" />

      {/* 6. Distorção de Glitch ativo quando disparado */}
      {glitchActive && (
        <div className="absolute inset-0 bg-red-900/15 mix-blend-color-dodge animate-crt-flicker pointer-events-none" />
      )}
    </div>
  );
};
