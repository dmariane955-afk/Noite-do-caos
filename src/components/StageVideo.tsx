import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, SkipForward, AlertTriangle, RefreshCw, Film } from 'lucide-react';
import { VIDEO_URL } from '../config';
import { horrorAudio } from '../utils/audio';

interface StageVideoProps {
  onVideoEnded: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const StageVideo: React.FC<StageVideoProps> = ({
  onVideoEnded,
  isMuted,
  onToggleMute,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [currentTimeFormatted, setCurrentTimeFormatted] = useState<string>('00:00');
  const [durationFormatted, setDurationFormatted] = useState<string>('00:00');
  const [isGlitchingOut, setIsGlitchingOut] = useState<boolean>(false);
  
  // Para quando não há vídeo inserido ainda (modo de teste / simulação de sinal analógico)
  const isVideoUrlConfigured = Boolean(VIDEO_URL && VIDEO_URL.trim() !== '');
  const [testCountdown, setTestCountdown] = useState<number>(10);

  // Iniciar reprodução do vídeo
  useEffect(() => {
    if (isVideoUrlConfigured && videoRef.current) {
      videoRef.current.muted = isMuted;
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn('Falha no autoplay com áudio, alternando para silencioso:', err);
          if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setHasError(true));
          }
        });
    }
  }, [isVideoUrlConfigured, isMuted]);

  // Sincronizar mudo com o elemento de vídeo
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Se não houver URL de vídeo configurada, roda um contador analógico de calibração
  useEffect(() => {
    if (!isVideoUrlConfigured && !hasError) {
      const timer = setInterval(() => {
        setTestCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            triggerEndGlitch();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isVideoUrlConfigured, hasError]);

  const triggerEndGlitch = () => {
    setIsGlitchingOut(true);
    horrorAudio.playGlitchBurst();
    setTimeout(() => {
      onVideoEnded();
    }, 1800);
  };

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true));
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const duration = videoRef.current.duration || 1;
    setProgress((current / duration) * 100);

    const curMins = Math.floor(current / 60);
    const curSecs = Math.floor(current % 60);
    setCurrentTimeFormatted(`${String(curMins).padStart(2, '0')}:${String(curSecs).padStart(2, '0')}`);

    if (videoRef.current.duration) {
      const durMins = Math.floor(duration / 60);
      const durSecs = Math.floor(duration % 60);
      setDurationFormatted(`${String(durMins).padStart(2, '0')}:${String(durSecs).padStart(2, '0')}`);
    }
  };

  const handleVideoEnded = () => {
    triggerEndGlitch();
  };

  const handleVideoError = () => {
    setHasError(true);
  };

  const handleRetry = () => {
    setHasError(false);
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setHasError(true));
    }
  };

  return (
    <section className="relative min-h-screen w-full flex flex-col justify-center items-center bg-black text-stone-200 p-2 sm:p-4 md:p-6 z-20 select-none overflow-hidden">
      {/* Moldura Cinematográfica de TV Antiga / Monitor Analógico */}
      <div className="relative w-full max-w-md sm:max-w-lg md:max-w-xl h-[80vh] sm:h-[84vh] max-h-[850px] bg-[#060606] border-2 border-[#2b0808] rounded-md shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col justify-between overflow-hidden">
        
        {/* Marcadores de Fita VHS / CRT */}
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-30 flex items-center gap-2 font-mono text-[10px] sm:text-xs text-red-500 uppercase tracking-widest bg-black/60 px-2.5 py-1 rounded border border-red-950/60 backdrop-blur-sm pointer-events-none">
          <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
          <span>REC ● TAPE 01</span>
          <span className="hidden sm:inline text-stone-400">| SP 2:00</span>
        </div>

        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 flex items-center gap-3 font-mono text-[10px] sm:text-xs text-stone-400 uppercase tracking-widest bg-black/60 px-2.5 py-1 rounded border border-stone-800/60 backdrop-blur-sm pointer-events-none">
          <span>{isVideoUrlConfigured ? `${currentTimeFormatted} / ${durationFormatted}` : `SINAL: 00:0${testCountdown}`}</span>
        </div>

        {/* Mídia Central */}
        <div className="relative w-full h-full flex items-center justify-center bg-black">
          {hasError ? (
            /* Tela de Erro Temática */
            <div className="max-w-md p-6 text-center z-20 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-red-950/50 border border-red-700/80 flex items-center justify-center text-red-500 mb-4 animate-bounce">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h2 className="font-horror-impact text-2xl sm:text-3xl text-red-400 tracking-wider uppercase blood-glow">
                FALHA NO RECEPTOR DE SINAL
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-stone-400 font-teletext leading-relaxed">
                A transmissão foi corrompida ou o arquivo de vídeo não pôde ser decodificado pelo canal.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 justify-center">
                <button
                  onClick={handleRetry}
                  className="px-4 py-2 border border-stone-700 hover:border-red-600 bg-stone-900/80 text-stone-300 hover:text-white text-xs font-mono tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  [ TENTAR RECONEXÃO ]
                </button>
                <button
                  onClick={triggerEndGlitch}
                  className="px-4 py-2 border border-red-900 bg-red-950/60 hover:bg-red-900 text-red-200 text-xs font-mono tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <SkipForward className="w-3.5 h-3.5" />
                  [ FORÇAR REVELAÇÃO DO CONVITE ]
                </button>
              </div>
            </div>
          ) : isVideoUrlConfigured ? (
            /* Vídeo Real Configurado pelo Usuário */
            <video
              ref={videoRef}
              src={VIDEO_URL}
              className="w-full h-full object-contain"
              playsInline
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleVideoEnded}
              onError={handleVideoError}
            />
          ) : (
            /* Padrão de Calibração Analógica quando VIDEO_URL está aguardando inserção */
            <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center analog-noise-bg">
              {/* Padrão de barras de teste de TV em preto e vermelho escuro */}
              <div className="absolute inset-x-0 top-0 h-4 flex opacity-30">
                <div className="flex-1 bg-white" />
                <div className="flex-1 bg-yellow-600" />
                <div className="flex-1 bg-cyan-700" />
                <div className="flex-1 bg-green-700" />
                <div className="flex-1 bg-fuchsia-800" />
                <div className="flex-1 bg-red-800" />
                <div className="flex-1 bg-blue-900" />
              </div>

              <div className="z-10 max-w-lg bg-black/85 border border-red-950/80 p-6 rounded shadow-2xl backdrop-blur-md">
                <div className="inline-flex items-center gap-2 text-red-500 font-mono text-xs uppercase tracking-widest mb-3">
                  <Film className="w-4 h-4 animate-spin text-red-600" style={{ animationDuration: '4s' }} />
                  <span>TRANSMISSÃO DE TERROR PREPARADA</span>
                </div>

                <h3 className="font-horror-impact text-3xl sm:text-4xl text-[#eae5dc] tracking-wider blood-glow">
                  AGUARDANDO ALIMENTAÇÃO DA FITA
                </h3>

                <p className="mt-3 text-xs sm:text-sm text-stone-400 font-teletext leading-relaxed">
                  Para reproduzir seu vídeo de terror, insira a URL na constante <code className="text-red-400 bg-red-950/40 px-1.5 py-0.5 border border-red-900/40 font-mono">VIDEO_URL</code> no arquivo <code className="text-stone-300 font-mono">src/config.ts</code>.
                </p>

                <div className="mt-5 p-3 bg-red-950/30 border border-red-900/50 rounded flex items-center justify-between text-xs font-mono">
                  <span className="text-stone-400">Autoteste em andamento:</span>
                  <span className="text-red-400 font-bold text-base tabular-nums animate-pulse">00:0{testCountdown}</span>
                </div>

                <div className="mt-5 flex flex-wrap gap-3 justify-center">
                  <button
                    onClick={triggerEndGlitch}
                    className="px-5 py-2.5 bg-red-900/70 hover:bg-red-800 text-white font-mono text-xs uppercase tracking-widest border border-red-700/80 transition-all cursor-pointer flex items-center gap-2"
                  >
                    <SkipForward className="w-3.5 h-3.5" />
                    [ PULAR SIMULAÇÃO / VER CONVITE ]
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Barra de Controles Discretos de Cinema */}
        <div className="relative z-30 w-full bg-gradient-to-t from-black via-black/90 to-transparent p-3 sm:p-4 flex flex-col gap-2 border-t border-red-950/40">
          {/* Barra de Progresso Sutil */}
          <div className="w-full h-1 bg-stone-900/80 rounded-full overflow-hidden">
            <div
              className="h-full bg-red-700 transition-all duration-100 ease-linear shadow-[0_0_8px_rgba(185,28,28,0.8)]"
              style={{ width: `${isVideoUrlConfigured ? progress : ((10 - testCountdown) / 10) * 100}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-stone-400 pt-1">
            <div className="flex items-center gap-3">
              {isVideoUrlConfigured && (
                <button
                  onClick={handlePlayPause}
                  className="hover:text-red-400 transition-colors p-1"
                  aria-label={isPlaying ? 'Pausar' : 'Reproduzir'}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
              )}

              <button
                onClick={onToggleMute}
                className="hover:text-red-400 transition-colors p-1"
                aria-label={isMuted ? 'Ativar som' : 'Desativar som'}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4" />}
              </button>
              
              <span className="text-[11px] text-stone-500 tracking-wider">
                {isMuted ? 'MUDO' : 'ÁUDIO ATIVO'}
              </span>
            </div>

            <button
              onClick={triggerEndGlitch}
              className="flex items-center gap-1.5 hover:text-red-400 transition-colors text-[11px] tracking-wider uppercase p-1 cursor-pointer"
            >
              <span>AVANÇAR</span>
              <SkipForward className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Interrupção Abrupta de Sinal na Transição (Glitch de saída) */}
      {isGlitchingOut && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-6 text-center select-none animate-crt-flicker">
          <div className="absolute inset-0 bg-red-950/30 mix-blend-color-dodge" />
          <div className="z-10 flex flex-col items-center">
            <span className="text-red-600 font-mono text-sm tracking-[0.3em] uppercase mb-4 animate-ping">
              ▲ PERDA DE SINAL
            </span>
            <h2 className="font-horror-impact text-3xl sm:text-5xl md:text-6xl text-[#f3ece2] uppercase tracking-[0.2em] blood-glow glitch-active">
              A TRANSMISSÃO FOI INTERROMPIDA
            </h2>
            <div className="mt-6 font-mono text-xs text-stone-500 tracking-widest">
              [ CANAL 00 DESSINCRONIZADO · RECONFIGURANDO COORDENADAS ]
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
