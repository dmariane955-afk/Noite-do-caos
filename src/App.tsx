/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { StageTransmission } from './components/StageTransmission';
import { StageVideo } from './components/StageVideo';
import { StageInvitation } from './components/StageInvitation';
import { AnalogEffects } from './components/AnalogEffects';
import { horrorAudio } from './utils/audio';

type Stage = 'transmission' | 'video' | 'invitation';

export default function App() {
  const [currentStage, setCurrentStage] = useState<Stage>('transmission');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [glitchActive, setGlitchActive] = useState<boolean>(false);

  // Alternar mudo
  const handleToggleMute = () => {
    const nextMuted = horrorAudio.toggleMute();
    setIsMuted(nextMuted);
  };

  // Transição Etapa 1 -> Etapa 2 (Sintonizar Transmissão)
  const handleStartTransmission = () => {
    setGlitchActive(true);
    horrorAudio.playGlitchBurst();
    horrorAudio.pauseAmbientDrone();
    setTimeout(() => {
      setGlitchActive(false);
      setCurrentStage('video');
    }, 400);
  };

  // Transição Etapa 2 -> Etapa 3 (Fim do Vídeo / Interrupção de Sinal)
  const handleVideoCompleted = () => {
    setGlitchActive(true);
    horrorAudio.playGlitchBurst();
    horrorAudio.resumeAmbientDrone();
    setTimeout(() => {
      setGlitchActive(false);
      setCurrentStage('invitation');
    }, 600);
  };

  // Reiniciar para o início
  const handleRestart = () => {
    setGlitchActive(true);
    horrorAudio.playGlitchBurst();
    horrorAudio.resumeAmbientDrone();
    setTimeout(() => {
      setGlitchActive(false);
      setCurrentStage('transmission');
    }, 400);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#030303] text-[#ded9d0] overflow-x-hidden">
      {/* Efeitos Analógicos Globais (Scanlines de CRT, Ruído de Tubo, Vinheta) */}
      <AnalogEffects
        glitchActive={glitchActive}
        intensity={currentStage === 'transmission' ? 'medium' : currentStage === 'video' ? 'subtle' : 'subtle'}
      />

      {/* Roteamento entre os três estados reais e funcionais */}
      {currentStage === 'transmission' && (
        <StageTransmission
          onTuneIn={handleStartTransmission}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />
      )}

      {currentStage === 'video' && (
        <StageVideo
          onVideoEnded={handleVideoCompleted}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />
      )}

      {currentStage === 'invitation' && (
        <StageInvitation
          onRestart={handleRestart}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />
      )}
    </div>
  );
}
