import React, { useState, useEffect } from 'react';
import { Radio, Skull, Volume2, VolumeX } from 'lucide-react';
import { horrorAudio } from '../utils/audio';

interface StageTransmissionProps {
  onTuneIn: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const StageTransmission: React.FC<StageTransmissionProps> = ({
  onTuneIn,
  isMuted,
  onToggleMute,
}) => {
  const [step1Visible, setStep1Visible] = useState(false);
  const [step2Visible, setStep2Visible] = useState(false);
  const [step3Visible, setStep3Visible] = useState(false);
  const [revelationVisible, setRevelationVisible] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  // Atualização de horário estilo fita VHS / monitor militar
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      const ms = String(Math.floor(now.getMilliseconds() / 10)).padStart(2, '0');
      setCurrentTime(`${h}:${m}:${s}.${ms}`);
    };
    updateClock();
    const interval = setInterval(updateClock, 60);
    return () => clearInterval(interval);
  }, []);

  // Sequência cinematográfica de mensagens analógicas
  useEffect(() => {
    const t1 = setTimeout(() => {
      setStep1Visible(true);
      horrorAudio.playKeyBeep();
    }, 400);

    const t2 = setTimeout(() => {
      setStep2Visible(true);
      horrorAudio.playKeyBeep();
    }, 1100);

    const t3 = setTimeout(() => {
      setStep3Visible(true);
      horrorAudio.playKeyBeep();
    }, 1800);

    const t4 = setTimeout(() => {
      setRevelationVisible(true);
      horrorAudio.playGlitchBurst();
    }, 2700);

    const t5 = setTimeout(() => {
      setButtonVisible(true);
    }, 3400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, []);

  const handleTuneInClick = () => {
    horrorAudio.playGlitchBurst();
    horrorAudio.startAmbientDrone();
    onTuneIn();
  };

  return (
    <section className="relative min-h-screen w-full flex flex-col justify-between items-center p-4 sm:p-6 md:p-8 bg-black text-[#dfdbd4] select-none z-10 overflow-hidden">
      {/* Barra superior de status da transmissão CRT */}
      <div className="w-full max-w-2xl flex items-center justify-between border-b border-red-950/60 pb-3 text-[11px] sm:text-xs font-mono tracking-widest text-red-700/80 uppercase">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-red-600 animate-ping" />
          <span className="text-red-500 font-bold tracking-wider">CH 00 · FREQ 666.6 MHz</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="tabular-nums font-mono text-stone-400">{currentTime || '00:00:00.00'}</span>
          <button
            onClick={onToggleMute}
            className="text-stone-500 hover:text-red-400 transition-colors p-1"
            title={isMuted ? 'Ativar som' : 'Desativar som'}
            aria-label="Controle de Áudio"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Conteúdo Central da Transmissão */}
      <div className="w-full max-w-xl my-auto py-8 flex flex-col items-center text-center">
        {/* Bloco de Mensagens de Sinal Analógico */}
        <div className="w-full space-y-2 mb-8 font-teletext text-xs sm:text-sm tracking-wider text-stone-400">
          <div
            className={`transition-all duration-300 ${
              step1Visible ? 'opacity-90 translate-y-0 text-red-500/90' : 'opacity-0 -translate-y-1'
            }`}
          >
            [ <span className="text-red-400">SINAL DESCONHECIDO DETECTADO</span> ]
          </div>
          <div
            className={`transition-all duration-300 ${
              step2Visible ? 'opacity-90 translate-y-0 text-stone-400' : 'opacity-0 -translate-y-1'
            }`}
          >
            ORIGEM: <span className="text-stone-200">NÃO IDENTIFICADA</span>
          </div>
          <div
            className={`transition-all duration-300 ${
              step3Visible ? 'opacity-90 translate-y-0 text-amber-500/80' : 'opacity-0 -translate-y-1'
            }`}
          >
            TRANSMISSÃO RECUPERADA PARCIALMENTE
          </div>
        </div>

        {/* Revelação visceral e dramática */}
        <div className="min-h-[140px] sm:min-h-[160px] flex flex-col items-center justify-center">
          {revelationVisible ? (
            <div className="animate-in fade-in zoom-in-95 duration-500">
              <h1 className="font-horror-impact text-4xl sm:text-6xl md:text-7xl uppercase tracking-wider text-[#e8e2d8] blood-glow leading-none glitch-active">
                VOCÊ NÃO DEVERIA ESTAR AQUI.
              </h1>
              <p className="mt-5 font-antique italic text-base sm:text-lg text-stone-400 max-w-md mx-auto tracking-wide">
                Uma transmissão foi encontrada. Deseja continuar?
              </p>
            </div>
          ) : (
            <div className="h-12 flex items-center justify-center">
              <span className="text-stone-700 font-mono text-sm tracking-widest animate-pulse">
                [ AGUARDANDO DECODIFICAÇÃO... ]
              </span>
            </div>
          )}
        </div>

        {/* Botão de Ação Impactante */}
        <div
          className={`mt-10 w-full flex flex-col items-center transition-all duration-700 ${
            buttonVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
        >
          <button
            onClick={handleTuneInClick}
            className="group relative px-6 sm:px-10 py-4 sm:py-5 bg-gradient-to-b from-[#180505] via-[#220707] to-[#0d0202] border-2 border-red-900/80 hover:border-red-600 rounded-none text-red-200 hover:text-white font-horror-impact text-xl sm:text-2xl tracking-[0.2em] uppercase transition-all duration-200 shadow-[0_0_25px_rgba(185,28,28,0.25)] hover:shadow-[0_0_45px_rgba(220,38,38,0.6)] active:scale-95 cursor-pointer"
          >
            {/* Efeito de scanline no botão */}
            <div className="absolute inset-0 bg-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            
            <div className="flex items-center justify-center gap-3">
              <Radio className="w-5 h-5 text-red-500 animate-pulse" />
              <span>[ SINTONIZAR TRANSMISSÃO ]</span>
            </div>
          </button>

          <span className="mt-3 text-[10px] tracking-widest uppercase text-stone-600 font-mono">
            CLIQUE PARA LIBERAR ÁUDIO & SINAL
          </span>
        </div>
      </div>

      {/* Rodapé com Advertência Sombria */}
      <div className="w-full max-w-2xl pt-4 border-t border-red-950/40 text-center font-mono">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-950/20 border border-red-900/30 text-red-500 text-xs sm:text-sm tracking-widest font-semibold uppercase animate-pulse">
          <Skull className="w-3.5 h-3.5" />
          <span>NÃO ABRA DEPOIS DAS 00H00.</span>
        </div>
        <p className="mt-2 text-[10px] text-stone-600 tracking-wider uppercase">
          A NOITE DO CAOS · DOCUMENTO CONFIDENCIAL
        </p>
      </div>
    </section>
  );
};
