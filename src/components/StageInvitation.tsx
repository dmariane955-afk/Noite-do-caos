import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, RotateCcw, Volume2, VolumeX, Clock } from 'lucide-react';
import { EVENT_DETAILS } from '../config';
import { horrorAudio } from '../utils/audio';

interface StageInvitationProps {
  onRestart: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const StageInvitation: React.FC<StageInvitationProps> = ({
  onRestart,
  isMuted,
  onToggleMute,
}) => {
  const [countdown, setCountdown] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Cálculo da contagem regressiva para 31 de Outubro às 21h
  useEffect(() => {
    const targetDate = new Date(EVENT_DETAILS.year, 9, EVENT_DETAILS.day, EVENT_DETAILS.startHour, EVENT_DETAILS.startMinute, 0);

    const updateCountdown = () => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setCountdown({ days, hours, minutes, seconds });
      } else {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAddToCalendar = () => {
    horrorAudio.playKeyBeep();
    // Gera link direto para o Google Calendar
    const startTime = `${EVENT_DETAILS.year}1031T210000`;
    const endTime = `${EVENT_DETAILS.year}1101T040000`;
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      EVENT_DETAILS.title + ' — Halloween'
    )}&dates=${startTime}/${endTime}&details=${encodeURIComponent(
      'Você não deveria estar aqui... Transmissão confirmada na Casa da Vó Márcia. Venha a caráter!'
    )}&location=${encodeURIComponent(EVENT_DETAILS.location)}`;
    window.open(url, '_blank');
  };

  return (
    <section className="relative min-h-screen w-full flex flex-col justify-between items-center text-[#e5e0d8] bg-[#020202] z-10 overflow-hidden select-none">
      
      {/* =========================================================================
          CENÁRIO VISUAL GÓTICO CINEMATOGRÁFICO (Ilustrado com SVG & Gradientes CSS)
          - Silhueta da Mansão Assombrada
          - Névoa Vermelha e Púrpura Fluida
          - Lua de Sangue com Halo Carmesim
          - Velas Góticas com Chamas Vivas
          - Abóboras de Halloween Iluminadas (Jack-o'-lanterns)
         ========================================================================= */}
      
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        {/* Lua de Sangue ao fundo */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-gradient-to-b from-[#8a0606] via-[#4d0000] to-[#1c0000] shadow-[0_0_90px_rgba(185,28,28,0.45)] opacity-80" />
        
        {/* Halo Vermelho Sombrio */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-80 h-80 sm:w-[480px] sm:h-[480px] rounded-full bg-red-900/10 blur-3xl pointer-events-none" />

        {/* Silhueta Vetorial da Mansão Gótica com Janelas Iluminadas por Velas */}
        <div className="absolute bottom-0 left-0 right-0 w-full flex justify-center opacity-85">
          <svg
            className="w-full max-w-4xl h-56 sm:h-72 md:h-80 object-cover text-[#070505]"
            viewBox="0 0 1000 400"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Chão e colina sombria */}
            <path d="M0,400 Q250,330 500,345 Q750,360 1000,400 L1000,400 L0,400 Z" />

            {/* Mansão Gótica Central */}
            {/* Torre Esquerda */}
            <path d="M260,350 L260,190 L285,120 L310,190 L310,350 Z" />
            <polygon points="285,120 282,90 288,90" fill="#040303" />

            {/* Corpo Principal da Mansão */}
            <path d="M310,350 L310,170 L400,90 L490,170 L490,350 Z" />

            {/* Torre Maior Pontiaguda */}
            <path d="M490,350 L490,140 L540,50 L590,140 L590,350 Z" />
            <polygon points="540,50 538,20 542,20" fill="#040303" />

            {/* Asa Direita da Mansão */}
            <path d="M590,350 L590,200 L680,130 L730,200 L730,350 Z" />
            {/* Chaminés tortas */}
            <rect x="350" y="100" width="16" height="40" />
            <rect x="640" y="120" width="14" height="45" />

            {/* Árvores secas e retorcidas ao redor */}
            <path d="M120,380 Q140,290 150,220 Q120,200 90,210 M150,220 Q170,180 180,150 M150,220 Q180,210 210,190" stroke="#060404" strokeWidth="6" strokeLinecap="round" fill="none" />
            <path d="M860,380 Q840,300 830,230 Q860,200 890,210 M830,230 Q810,190 790,160 M830,230 Q810,220 780,200" stroke="#060404" strokeWidth="6" strokeLinecap="round" fill="none" />

            {/* Grade de ferro forjado no horizonte */}
            <path d="M180,365 L180,340 M200,365 L200,340 M220,365 L220,340 M760,365 L760,340 M780,365 L780,340 M800,365 L800,340" stroke="#050303" strokeWidth="3" />

            {/* Janelas em Arco com Luz de Velas Amareladas Inquietantes */}
            <path d="M375,180 Q400,160 425,180 L425,220 L375,220 Z" fill="#d97706" className="candle-flame" opacity="0.85" />
            <path d="M525,160 Q540,145 555,160 L555,195 L525,195 Z" fill="#b45309" className="candle-flame" opacity="0.75" />
            <path d="M640,210 Q655,198 670,210 L670,240 L640,240 Z" fill="#ea580c" className="candle-flame" opacity="0.7" />
            <path d="M280,220 Q285,210 290,220 L290,245 L280,245 Z" fill="#f59e0b" className="candle-flame" opacity="0.65" />
          </svg>
        </div>

        {/* Camadas de Névoa Vermelha e Púrpura Fluindo */}
        <div className="absolute bottom-0 left-0 right-0 h-72 bg-gradient-to-t from-red-950/40 via-red-900/10 to-transparent animate-fog-slow" />
        <div className="absolute bottom-4 left-0 right-0 h-48 bg-gradient-to-t from-black via-red-950/30 to-transparent animate-fog-fast" />

        {/* Abóboras Iluminadas (Jack-o'-lanterns) no Primeiro Plano */}
        <div className="absolute bottom-2 left-6 sm:left-16 z-10 scale-90 sm:scale-100">
          <svg width="64" height="54" viewBox="0 0 64 54" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Caule */}
            <path d="M30 4C30 4 31 10 33 13" stroke="#2b1f14" strokeWidth="4" strokeLinecap="round" />
            {/* Casca da Abóbora */}
            <ellipse cx="32" cy="32" rx="28" ry="20" fill="#290f05" stroke="#160803" strokeWidth="2" />
            {/* Olhos triangulares sinistros */}
            <polygon points="20,24 25,28 17,29" fill="#f59e0b" className="candle-flame" />
            <polygon points="44,24 47,29 39,28" fill="#f59e0b" className="candle-flame" />
            {/* Nariz */}
            <polygon points="32,30 34,34 30,34" fill="#f59e0b" className="candle-flame" />
            {/* Boca dentada maligna */}
            <path d="M18 38 L22 42 L26 38 L30 42 L34 38 L38 42 L42 38 L46 42 L44 45 L38 43 L34 46 L30 43 L26 46 L20 44 Z" fill="#f59e0b" className="candle-flame" />
          </svg>
        </div>

        <div className="absolute bottom-3 right-6 sm:right-20 z-10 scale-95 sm:scale-110">
          <svg width="70" height="58" viewBox="0 0 70 58" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Caule */}
            <path d="M35 3C34 7 36 12 37 15" stroke="#251a10" strokeWidth="4" strokeLinecap="round" />
            {/* Casca */}
            <ellipse cx="35" cy="35" rx="30" ry="21" fill="#301107" stroke="#180702" strokeWidth="2" />
            {/* Olhos recortados */}
            <polygon points="22,26 27,30 19,31" fill="#ea580c" className="candle-flame" />
            <polygon points="48,26 51,31 43,30" fill="#ea580c" className="candle-flame" />
            {/* Boca macabra */}
            <path d="M19 40 Q35 48 51 40 Q35 45 19 40" stroke="#f59e0b" strokeWidth="3" fill="#ea580c" className="candle-flame" />
          </svg>
        </div>

        {/* Velas com cera escorrida na base */}
        <div className="absolute bottom-6 left-1/4 hidden md:flex items-end gap-1.5 opacity-90">
          <div className="w-2.5 h-10 bg-[#e2d6c3] rounded-t-sm relative shadow-[0_0_10px_rgba(245,158,11,0.5)]">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-2 h-4 bg-amber-400 rounded-full candle-flame" />
          </div>
          <div className="w-3 h-14 bg-[#d8ccb8] rounded-t-sm relative shadow-[0_0_12px_rgba(245,158,11,0.6)]">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-2 h-4 bg-orange-400 rounded-full candle-flame" />
          </div>
        </div>

        <div className="absolute bottom-6 right-1/4 hidden md:flex items-end gap-2 opacity-90">
          <div className="w-3 h-12 bg-[#ded2be] rounded-t-sm relative shadow-[0_0_12px_rgba(245,158,11,0.6)]">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-2 h-4 bg-amber-400 rounded-full candle-flame" />
          </div>
        </div>
      </div>

      {/* =========================================================================
          CABEÇALHO DA REVELAÇÃO (Controles Discretos & Indicador de Fita)
         ========================================================================= */}
      <header className="relative z-20 w-full max-w-4xl pt-4 sm:pt-6 px-4 flex items-center justify-between font-mono text-xs text-stone-500">
        <div className="flex items-center gap-2 text-red-600/90 tracking-widest uppercase">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
          <span>SINAL PERMANENTE · ARQUIVO #3110</span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onToggleMute}
            className="hover:text-red-400 transition-colors p-1"
            title={isMuted ? 'Ativar som atmosférico' : 'Desativar som'}
            aria-label="Áudio Ambiente"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4" />}
          </button>
          
          <button
            onClick={onRestart}
            className="flex items-center gap-1.5 hover:text-red-400 transition-colors text-[11px] tracking-wider uppercase"
            title="Reiniciar a experiência"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">REVER TRANSMISSÃO</span>
          </button>
        </div>
      </header>

      {/* =========================================================================
          CONTEÚDO PRINCIPAL DO CONVITE
         ========================================================================= */}
      <main className="relative z-20 w-full max-w-3xl my-auto px-4 py-8 flex flex-col items-center text-center">
        
        {/* Kicker Editorial */}
        <div className="font-teletext text-xs sm:text-sm tracking-[0.25em] text-red-500 uppercase mb-3">
          [ CONVITE DE HALLOWEEN · TRANSMISSÃO REVELADA ]
        </div>

        {/* TÍTULO PRINCIPAL: A NOITE DO CAOS */}
        <h1 className="font-horror-title font-black text-5xl sm:text-7xl md:text-8xl tracking-tight text-[#f5efe6] uppercase blood-glow drop-shadow-[0_5px_25px_rgba(139,0,0,0.8)] leading-[0.95]">
          {EVENT_DETAILS.title}
        </h1>

        {/* Separador de Sangue Sutil */}
        <div className="w-32 sm:w-48 h-[2px] bg-gradient-to-r from-transparent via-red-600 to-transparent my-6" />

        {/* BLOCO DE DETALHES PRINCIPAIS: DATA, HORA, LOCAL */}
        <div className="w-full max-w-xl bg-black/60 border border-red-950/70 p-6 sm:p-8 backdrop-blur-md shadow-[0_0_35px_rgba(0,0,0,0.8)]">
          <div className="flex flex-col gap-5 sm:gap-6">
            
            {/* DATA */}
            <div className="flex flex-col items-center justify-center">
              <span className="font-teletext text-[11px] text-stone-500 uppercase tracking-widest flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-red-600" /> DATA
              </span>
              <span className="font-horror-impact text-3xl sm:text-4xl text-[#faf6ee] tracking-wider mt-1 bone-glow">
                {EVENT_DETAILS.date}
              </span>
            </div>

            <div className="w-full h-px bg-red-950/40" />

            {/* HORÁRIO */}
            <div className="flex flex-col items-center justify-center">
              <span className="font-teletext text-[11px] text-stone-500 uppercase tracking-widest flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-red-600" /> HORÁRIO
              </span>
              <span className="font-horror-impact text-2xl sm:text-3xl text-red-400 tracking-wider mt-1">
                {EVENT_DETAILS.time}
              </span>
            </div>

            <div className="w-full h-px bg-red-950/40" />

            {/* LOCALIZAÇÃO: CASA DA VÓ MÁRCIA */}
            <div className="flex flex-col items-center justify-center">
              <span className="font-teletext text-[11px] text-stone-500 uppercase tracking-widest flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-red-600" /> LOCAL
              </span>
              <span className="font-horror-impact text-3xl sm:text-4xl text-[#f3ece2] tracking-wider mt-1 blood-glow">
                {EVENT_DETAILS.location}
              </span>
            </div>

          </div>
        </div>

        {/* FRASE FINAL ASSOMBRADA: "A Vó Márcia está esperando… e eu também." */}
        <div className="mt-8 px-4 max-w-lg">
          <p className="font-antique italic text-xl sm:text-2xl text-stone-300 tracking-wide blood-glow">
            “{EVENT_DETAILS.finalPhrase}”
          </p>
        </div>

        {/* CONTAGEM REGRESSIVA PARA O HALLOWEEN */}
        <div className="mt-8 flex flex-col items-center">
          <span className="font-mono text-[10px] sm:text-xs text-stone-500 uppercase tracking-widest mb-2">
            CONTAGEM REGRESSIVA PARA O INÍCIO DO CAOS
          </span>
          <div className="flex items-center gap-2 sm:gap-4 font-mono text-center">
            <div className="bg-black/70 border border-red-950 px-3 py-2 rounded min-w-[54px]">
              <span className="block text-lg sm:text-xl font-bold text-red-500 tabular-nums">{countdown.days}</span>
              <span className="text-[9px] text-stone-500 uppercase">Dias</span>
            </div>
            <span className="text-red-700 font-bold">:</span>
            <div className="bg-black/70 border border-red-950 px-3 py-2 rounded min-w-[54px]">
              <span className="block text-lg sm:text-xl font-bold text-red-500 tabular-nums">{countdown.hours}</span>
              <span className="text-[9px] text-stone-500 uppercase">Horas</span>
            </div>
            <span className="text-red-700 font-bold">:</span>
            <div className="bg-black/70 border border-red-950 px-3 py-2 rounded min-w-[54px]">
              <span className="block text-lg sm:text-xl font-bold text-red-500 tabular-nums">{countdown.minutes}</span>
              <span className="text-[9px] text-stone-500 uppercase">Min</span>
            </div>
            <span className="text-red-700 font-bold">:</span>
            <div className="bg-black/70 border border-red-950 px-3 py-2 rounded min-w-[54px]">
              <span className="block text-lg sm:text-xl font-bold text-red-500 tabular-nums">{countdown.seconds}</span>
              <span className="text-[9px] text-stone-500 uppercase">Seg</span>
            </div>
          </div>
        </div>

        {/* BOTÃO DE AÇÃO DO CONVIDADO (Salvar no Calendário) */}
        <div className="mt-10 w-full max-w-xs flex justify-center items-center font-mono text-xs">
          {/* Salvar no Calendário */}
          <button
            onClick={handleAddToCalendar}
            className="w-full px-6 py-3.5 bg-black/80 hover:bg-stone-900 border border-stone-800 hover:border-red-900 text-stone-300 hover:text-white tracking-wider uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(0,0,0,0.8)]"
          >
            <Calendar className="w-4 h-4 text-red-500" />
            <span>SALVAR DATA NO CALENDÁRIO</span>
          </button>
        </div>

      </main>

      {/* =========================================================================
          RODAPÉ DO CONVITE
         ========================================================================= */}
      <footer className="relative z-20 w-full max-w-4xl py-6 px-4 text-center font-mono text-[10px] text-stone-600 border-t border-red-950/30">
        <p className="tracking-widest uppercase">
          A NOITE DO CAOS © HALLOWEEN NA CASA DA VÓ MÁRCIA
        </p>
        <p className="mt-1 text-stone-700">
          Traje sugerido: Fantasia de terror, trajes sombrios ou roupas pretas.
        </p>
      </footer>

    </section>
  );
};
