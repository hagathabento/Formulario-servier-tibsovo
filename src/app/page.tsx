'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Star, CheckCircle, Zap, User, Activity, FileText, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import { Particles } from '@/components/magicui/particles';
import { ShineBorder } from '@/components/magicui/shine-border';
import { ShimmerButton } from '@/components/magicui/shimmer-button';
import { BlurFade } from '@/components/magicui/blur-fade';
import { TextAnimate } from '@/components/magicui/text-animate';
import { SparklesText } from '@/components/magicui/sparkles-text';
import { supabase } from '@/lib/supabase';
import { HeroVideoDialog } from '@/components/magicui/hero-video-dialog';

// Definição das Perguntas
const questions = [
  {
    id: 1,
    type: 'text',
    question: '1. Após a confirmação do diagnóstico de Leucemia Mielóide Aguda.\nPensando na sua prática clínica: O que mais atrapalha a solicitação imediata do painel molecular após o diagnóstico de LMA?',
    placeholder: 'Digite sua resposta aqui...'
  },
  {
    id: 2,
    type: 'text',
    question: '2. Passaram-se 4 dias e o paciente continua clinicamente estável.\nBaseada na apresentação dos dados da Dra Voso, qual seria sua conduta hoje?',
    placeholder: 'Descreva sua conduta...'
  },
  {
    id: 3,
    type: 'radio',
    question: '3. O laudo chegou no D+5: IDH1 Mutado. D = data do envio do teste molecular.\nEste paciente, após a discussão dos dados apresentados pelo Dr. Stein, seria candidato a Tibsovo®?',
    options: ['Sim', 'Não', 'Outro (especifique)']
  },
  {
    id: 4,
    type: 'rating',
    question: '4. Avaliação do evento',
    maxStars: 5
  },
  {
    id: 5,
    type: 'text',
    question: '5. Feedback do evento',
    placeholder: 'Deixe seu feedback...'
  }
];

export default function Home() {
  const [showNameModal, setShowNameModal] = useState(true);
  const [userName, setUserName] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [videoFinished, setVideoFinished] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [direction, setDirection] = useState(0);
  const [showSecondVideo, setShowSecondVideo] = useState(false);
  const [secondVideoFinished, setSecondVideoFinished] = useState(false);
  const [video2Watched, setVideo2Watched] = useState(false);
  const [showThirdVideo, setShowThirdVideo] = useState(false);
  const [thirdVideoFinished, setThirdVideoFinished] = useState(false);
  const [video3Watched, setVideo3Watched] = useState(false);
  
  const BREAKPOINT_VIDEO_2 = 0; // Após pergunta 1 (index 0)
  const BREAKPOINT_VIDEO_3 = 1; // Após pergunta 2 (index 1)

  // Efeito para "auto-focus" em inputs de texto no tablet - REMOVIDO
  /*
  useEffect(() => {
    if (isStarted && !isCompleted && !showVideo) {
      const input = document.getElementById(`input-${currentStep}`);
      if (input) input.focus();
    }
  }, [currentStep, isCompleted, isStarted, showVideo]);
  */

  const handleStart = () => {
    setShowVideo(false);
    setIsStarted(true);
  };

  const handleInitialClick = () => {
    setShowVideo(true);
  };

  const handleVideoEnd = () => {
    setVideoFinished(true);
  };

  const handleVideoTimeUpdate = (currentTime: number) => {
    if (currentTime >= 120 && !videoFinished) { // 2 minutos
      setVideoFinished(true);
    }
  };

  const handleSecondVideoEnd = () => {
    setSecondVideoFinished(true);
  };

  const handleSecondVideoTimeUpdate = (currentTime: number) => {
    if (currentTime >= 120 && !secondVideoFinished) {
      setSecondVideoFinished(true);
    }
  };

  const handleFinishSecondVideo = () => {
    setShowSecondVideo(false);
    setVideo2Watched(true);
    // Avança para a próxima pergunta após o vídeo
    setDirection(1);
    setCurrentStep(prev => prev + 1);
  };

  const handleThirdVideoEnd = () => {
    setThirdVideoFinished(true);
  };

  const handleThirdVideoTimeUpdate = (currentTime: number) => {
    if (currentTime >= 120 && !thirdVideoFinished) {
      setThirdVideoFinished(true);
    }
  };

  const handleFinishThirdVideo = () => {
    setShowThirdVideo(false);
    setVideo3Watched(true);
    setDirection(1);
    setCurrentStep(prev => prev + 1);
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim()) {
      setShowNameModal(false);
    }
  };

  if (showNameModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-6">
        {/* Logo Fixo */}
        <div className="absolute top-6 left-6 z-50">
          <img src="/image.png" alt="TIBSOVO®" className="h-14 md:h-20 w-auto object-contain" />
        </div>

        {/* Logo Servier */}
        <div className="absolute bottom-4 right-4 z-50 opacity-80 pointer-events-none">
          <img src="/lgooservier.png" alt="Servier" className="h-6 md:h-8 w-auto object-contain" />
        </div>

        {/* Imagem de Fundo */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/cover.png" 
            alt="Cover Tibsovo®" 
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--tibsovo-bg)] via-transparent to-transparent" />
        </div>

        <Particles className="absolute inset-0 z-0" quantity={50} ease={80} color="#FF6B4A" refresh />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg relative z-10"
        >
          <ShineBorder 
            className="w-full bg-black/80 border border-white/10 p-8 md:p-12 flex flex-col gap-8 items-center text-center backdrop-blur-xl"
            color={["#FF6B4A", "#6A44A3"]}
            borderWidth={1}
            borderRadius={32}
          >
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mt-2">
                Lançamento de <span className="text-[var(--tibsovo-orange)]">Tibsovo®</span>
              </h1>
            </div>

            <form onSubmit={handleNameSubmit} className="w-full space-y-6">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="text-gray-500 group-focus-within:text-[var(--tibsovo-orange)] transition-colors" size={20} />
                </div>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="SEU NOME"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-lg text-white placeholder:text-gray-600 focus:outline-none focus:border-[var(--tibsovo-orange)] focus:ring-1 focus:ring-[var(--tibsovo-orange)] transition-all uppercase tracking-wider"
                  autoFocus
                />
              </div>

              <button 
                type="submit"
                disabled={!userName.trim()}
                className="w-full"
              >
                <ShimmerButton 
                  className={clsx(
                    "w-full text-lg font-bold tracking-wide shadow-2xl",
                    !userName.trim() && "opacity-50 cursor-not-allowed"
                  )}
                  background="var(--tibsovo-orange)"
                  shimmerColor="#ffffff"
                  shimmerSize="0.1em"
                  shimmerDuration="2s"
                >
                  <span className="flex items-center gap-2">
                    COMEÇAR <ChevronRight />
                  </span>
                </ShimmerButton>
              </button>
            </form>

            <div className="w-full text-center mt-4">
              <p className="text-[10px] md:text-xs text-gray-500/60 font-light uppercase tracking-wide">
                Material destinado a profissionais de saúde habilitados a prescrever e dispensar medicamentos
              </p>
            </div>
          </ShineBorder>
        </motion.div>
      </div>
    );
  }

  const handleNext = () => {
    console.log('handleNext acionado', { currentStep, video2Watched, video3Watched });
    
    // Breakpoint para Vídeo 2 (após Q1)
    if (currentStep === BREAKPOINT_VIDEO_2 && !video2Watched) {
      console.log('Mostrando vídeo 2');
      setShowSecondVideo(true);
      return;
    }

    // Breakpoint para Vídeo 3 (após Q2)
    if (currentStep === BREAKPOINT_VIDEO_3 && !video3Watched) {
      console.log('Mostrando vídeo 3');
      setShowThirdVideo(true);
      return;
    }

    if (currentStep < questions.length - 1) {
      setDirection(1);
      setCurrentStep(prev => prev + 1);
    } else {
      // Salvar no Supabase ao concluir
      const saveSubmission = async () => {
        try {
          const { error } = await supabase
            .from('submissions')
            .insert([
              {
                name: userName,
                answers: answers,
                completed: true
              }
            ]);
          
          if (error) {
            console.error('Erro ao salvar submissão:', error);
          } else {
            console.log('Submissão salva com sucesso!');
          }
        } catch (err) {
          console.error('Erro inesperado:', err);
        }
      };

      saveSubmission();
      setIsCompleted(true);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setDirection(-1);

      // Resetar vídeos se estiver voltando para o ponto anterior a eles
      // Vídeo 2 é após Q1 (index 0). Se estamos em Q2 (index 1) e voltamos para Q1, resetamos o watched.
      if (currentStep === BREAKPOINT_VIDEO_2 + 1) {
        setVideo2Watched(false);
      }
      // Vídeo 3 é após Q2 (index 1). Se estamos em Q3 (index 2) e voltamos para Q2, resetamos o watched.
      if (currentStep === BREAKPOINT_VIDEO_3 + 1) {
        setVideo3Watched(false);
      }

      setCurrentStep(prev => prev - 1);
    }
  };

  const handleAnswer = (value: any) => {
    setAnswers(prev => ({ ...prev, [questions[currentStep].id]: value }));
  };

  const isCurrentQuestionAnswered = () => {
    const answer = answers[questions[currentStep].id];
    
    // Perguntas de texto são opcionais agora
    if (questions[currentStep].type === 'text') return true;
    
    if (questions[currentStep].type === 'radio') {
      if (!answer) return false;
      if (answer === 'Outro (especifique)') {
        const otherText = answers[`other_${questions[currentStep].id}`];
        return !!otherText && otherText.trim().length > 0;
      }
      return true;
    }

    if (questions[currentStep].type === 'rating' && !answer) return false;
    return true;
  };

  // Variantes de Animação
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8
    })
  };

  if (showSecondVideo) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[var(--tibsovo-bg)] text-white relative overflow-hidden">
        {/* Logo Fixo */}
        <div className="absolute top-6 left-6 z-50">
          <img src="/image.png" alt="TIBSOVO®" className="h-14 md:h-20 w-auto object-contain" />
        </div>

        {/* Logo Servier */}
        <div className="absolute bottom-4 right-4 z-50 opacity-80 pointer-events-none">
          <img src="/lgooservier.png" alt="Servier" className="h-6 md:h-8 w-auto object-contain" />
        </div>

        <Particles className="absolute inset-0 z-0" quantity={100} ease={80} color="#FF6B4A" refresh />
        
        <div className="w-full max-w-5xl z-10 flex flex-col items-center gap-8">
          <BlurFade delay={0.2} inView className="w-full">
            <HeroVideoDialog
              className="w-full"
              animationStyle="from-center"
              videoSrc="/video2.mp4"
              thumbnailSrc="https://placehold.co/1920x1080/4B2C78/FFFFFF/png?text=Assista+ao+V%C3%ADdeo+2"
              thumbnailAlt="Vídeo de Encerramento"
              autoPlay={true}
              onClose={handleFinishSecondVideo}
              onVideoEnd={handleSecondVideoEnd}
              onTimeUpdate={handleSecondVideoTimeUpdate}
            />
          </BlurFade>

          <BlurFade delay={0.5} inView className="flex flex-col items-center gap-4 w-full">
            {secondVideoFinished ? (
              <div onClick={handleFinishSecondVideo} className="w-full max-w-sm cursor-pointer">
                <ShimmerButton 
                  className="w-full text-lg font-bold tracking-wide shadow-2xl" 
                  background="var(--tibsovo-orange)"
                  shimmerColor="#ffffff"
                  shimmerSize="0.1em"
                  shimmerDuration="2s"
                >
                  <span className="flex items-center gap-2">
                    Continuar <ChevronRight />
                  </span>
                </ShimmerButton>
              </div>
            ) : (
              <button 
                onClick={handleFinishSecondVideo}
                className="text-white/70 hover:text-white hover:underline transition-all text-sm uppercase tracking-widest"
              >
                Pular Vídeo &rarr;
              </button>
            )}
            
            <p className="text-[10px] md:text-xs text-gray-500/60 font-light uppercase tracking-wide mt-8 text-center">
              Material destinado a profissionais de saúde habilitados a prescrever e dispensar medicamentos
            </p>
          </BlurFade>
        </div>
      </div>
    );
  }

  if (showThirdVideo) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[var(--tibsovo-bg)] text-white relative overflow-hidden">
        {/* Logo Fixo */}
        <div className="absolute top-6 left-6 z-50">
          <img src="/image.png" alt="TIBSOVO®" className="h-14 md:h-20 w-auto object-contain" />
        </div>

        {/* Logo Servier */}
        <div className="absolute bottom-4 right-4 z-50 opacity-80 pointer-events-none">
          <img src="/lgooservier.png" alt="Servier" className="h-6 md:h-8 w-auto object-contain" />
        </div>

        <Particles className="absolute inset-0 z-0" quantity={100} ease={80} color="#FF6B4A" refresh />
        
        <div className="w-full max-w-5xl z-10 flex flex-col items-center gap-8">
          <BlurFade delay={0.2} inView className="w-full">
            <HeroVideoDialog
              className="w-full"
              animationStyle="from-center"
              videoSrc="/video3.mp4"
              thumbnailSrc="https://placehold.co/1920x1080/4B2C78/FFFFFF/png?text=Assista+ao+V%C3%ADdeo+3"
              thumbnailAlt="Vídeo 3"
              autoPlay={true}
              onClose={handleFinishThirdVideo}
              onVideoEnd={handleThirdVideoEnd}
              onTimeUpdate={handleThirdVideoTimeUpdate}
            />
          </BlurFade>

          <BlurFade delay={0.5} inView className="flex flex-col items-center gap-4 w-full">
            {thirdVideoFinished ? (
              <div onClick={handleFinishThirdVideo} className="w-full max-w-sm cursor-pointer">
                <ShimmerButton 
                  className="w-full text-lg font-bold tracking-wide shadow-2xl" 
                  background="var(--tibsovo-orange)"
                  shimmerColor="#ffffff"
                  shimmerSize="0.1em"
                  shimmerDuration="2s"
                >
                  <span className="flex items-center gap-2">
                    Continuar <ChevronRight />
                  </span>
                </ShimmerButton>
              </div>
            ) : (
              <button 
                onClick={handleFinishThirdVideo}
                className="text-white/70 hover:text-white hover:underline transition-all text-sm uppercase tracking-widest"
              >
                Pular Vídeo &rarr;
              </button>
            )}

            <p className="text-[10px] md:text-xs text-gray-500/60 font-light uppercase tracking-wide mt-8 text-center">
              Material destinado a profissionais de saúde habilitados a prescrever e dispensar medicamentos
            </p>
          </BlurFade>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-[var(--tibsovo-bg)] text-white relative overflow-hidden">
        {/* Logo Fixo */}
        <div className="absolute top-6 left-6 z-50">
          <img src="/image.png" alt="TIBSOVO®" className="h-14 md:h-20 w-auto object-contain" />
        </div>

        {/* Logo Servier */}
        <div className="absolute bottom-4 right-4 z-50 opacity-80 pointer-events-none">
          <img src="/lgooservier.png" alt="Servier" className="h-6 md:h-8 w-auto object-contain" />
        </div>

        <Particles className="absolute inset-0 z-0" quantity={100} ease={80} color="#FF6B4A" refresh />
        
        <BlurFade delay={0.2} inView>
          <ShineBorder 
            className="bg-white/10 backdrop-blur-lg p-12 shadow-2xl text-center max-w-2xl w-full border border-white/20 relative z-10 flex flex-col items-center"
            color={["#FF6B4A", "#6A44A3", "#FF6B4A"]}
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="w-24 h-24 bg-[var(--tibsovo-orange)] rounded-full flex items-center justify-center mb-8 shadow-lg shadow-orange-500/50"
            >
              <CheckCircle size={48} color="white" strokeWidth={3} />
            </motion.div>
            <h2 className="text-4xl font-bold mb-4 text-white">Obrigado pela sua participação!</h2>
            <p className="text-xl text-gray-300 mb-8">Suas respostas foram registradas com sucesso.</p>
            <button 
              onClick={() => window.location.reload()}
              className="text-[var(--tibsovo-orange)] hover:text-white transition-colors font-semibold"
            >
              Voltar ao início
            </button>
          </ShineBorder>
        </BlurFade>

        <div className="absolute bottom-4 left-0 w-full text-center z-50">
          <p className="text-[10px] md:text-xs text-gray-500/60 font-light uppercase tracking-wide max-w-2xl mx-auto px-4">
            Material destinado a profissionais de saúde habilitados a prescrever e dispensar medicamentos
          </p>
        </div>
      </div>
    );
  }

  if (showVideo) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[var(--tibsovo-bg)] text-white relative overflow-hidden">
        {/* Logo Fixo */}
        <div className="absolute top-6 left-6 z-50">
          <img src="/image.png" alt="TIBSOVO®" className="h-14 md:h-20 w-auto object-contain" />
        </div>

        {/* Logo Servier */}
        <div className="absolute bottom-4 right-4 z-50 opacity-80 pointer-events-none">
          <img src="/lgooservier.png" alt="Servier" className="h-6 md:h-8 w-auto object-contain" />
        </div>

        <Particles className="absolute inset-0 z-0" quantity={100} ease={80} color="#FF6B4A" refresh />
        
        <div className="w-full max-w-5xl z-10 flex flex-col items-center gap-8">
          <BlurFade delay={0.2} inView className="w-full">
            <HeroVideoDialog
              className="w-full"
              animationStyle="from-center"
              videoSrc="/video.mp4"
              thumbnailSrc="https://placehold.co/1920x1080/4B2C78/FFFFFF/png?text=Assista+ao+V%C3%ADdeo"
              thumbnailAlt="Vídeo Introdutório"
              autoPlay={true}
              onClose={handleStart}
              onVideoEnd={handleVideoEnd}
              onTimeUpdate={handleVideoTimeUpdate}
            />
          </BlurFade>

          <BlurFade delay={0.5} inView className="flex flex-col items-center gap-4 w-full">
            {videoFinished ? (
              <div onClick={handleStart} className="w-full max-w-sm cursor-pointer">
                <ShimmerButton 
                  className="w-full text-lg font-bold tracking-wide shadow-2xl" 
                  background="var(--tibsovo-orange)"
                  shimmerColor="#ffffff"
                  shimmerSize="0.1em"
                  shimmerDuration="2s"
                >
                  <span className="flex items-center gap-2">
                    Próximo <ChevronRight />
                  </span>
                </ShimmerButton>
              </div>
            ) : (
              <button 
                onClick={handleStart}
                className="text-white/70 hover:text-white hover:underline transition-all text-sm uppercase tracking-widest"
              >
                Pular Vídeo &rarr;
              </button>
            )}

            <p className="text-[10px] md:text-xs text-gray-500/60 font-light uppercase tracking-wide mt-8 text-center">
              Material destinado a profissionais de saúde habilitados a prescrever e dispensar medicamentos
            </p>
          </BlurFade>
        </div>
      </div>
    );
  }

  // Tela Inicial: Caso Clínico
  if (!isStarted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[var(--tibsovo-bg)] text-white relative overflow-hidden">
        {/* Background Particles */}
        <Particles className="absolute inset-0 z-0" quantity={80} ease={80} color="#ffffff" refresh />
        
        {/* Header Logo Small */}
        <div className="absolute top-8 left-8 z-20 opacity-80">
          <img src="/image.png" alt="TIBSOVO®" className="h-14 md:h-20 w-auto object-contain" />
        </div>

        {/* Logo Servier */}
        <div className="absolute bottom-4 right-4 z-50 opacity-80 pointer-events-none">
          <img src="/lgooservier.png" alt="Servier" className="h-6 md:h-8 w-auto object-contain" />
        </div>

        <div className="max-w-5xl w-full z-10 flex flex-col gap-8 mt-12">
          
          <div className="text-center mb-4">
            <BlurFade delay={0.2} inView>
               <h1 className="text-4xl md:text-5xl font-bold mb-2 flex justify-center">
                <SparklesText 
                  className="text-white text-4xl md:text-5xl"
                  colors={{ first: "#FF6B4A", second: "#6A44A3" }}
                  sparklesCount={15}
                >
                  Caso clínico fictício
                </SparklesText>
              </h1>
            </BlurFade>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Card 1: Identificação e Histórico */}
            <BlurFade delay={0.3} inView className="h-full">
              <ShineBorder 
                className="w-full h-full bg-gradient-to-br from-[#E85A3C]/40 via-[#9E2A2B]/40 to-[#4B2C78]/40 backdrop-blur-md border border-white/10 p-8 flex flex-col gap-6"
                color={["#6A44A3", "#FF6B4A"]}
                borderWidth={1}
                borderRadius={48}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 rounded-2xl bg-white/10 text-white shadow-inner">
                    <User size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Características do Paciente</h3>
                </div>
                
                <div className="space-y-4 text-gray-100">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs uppercase tracking-wider text-white/70 font-bold">Paciente</span>
                    <p className="text-lg font-medium">Homem, 72 anos, aposentado.</p>
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <span className="text-xs uppercase tracking-wider text-white/70 font-bold">Queixa Principal</span>
                    <p className="font-medium">Fadiga progressiva e petéquias (manchas no corpo) há 2 semanas.</p>
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <span className="text-xs uppercase tracking-wider text-white/70 font-bold">Comorbidades</span>
                    <p className="font-medium">Hipertensão controlada e Diabetes Tipo 2.</p>
                    <div className="mt-2 inline-block px-4 py-2 bg-black/30 text-white text-sm rounded-xl border border-white/10 backdrop-blur-sm">
                      Não elegível à QT intensiva
                    </div>
                  </div>
                </div>
              </ShineBorder>
            </BlurFade>

            {/* Card 2: Exames */}
            <BlurFade delay={0.4} inView className="h-full">
              <ShineBorder 
                className="w-full h-full bg-gradient-to-br from-[#E85A3C]/40 via-[#9E2A2B]/40 to-[#4B2C78]/40 backdrop-blur-md border border-white/10 p-8 flex flex-col gap-6"
                color={["#FF6B4A", "#6A44A3"]}
                borderWidth={1}
                borderRadius={48}
              >
                 <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 rounded-2xl bg-white/10 text-white shadow-inner">
                    <FileText size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Resultado dos Exames</h3>
                </div>

                <div className="space-y-5">
                  <div className="bg-black/20 p-5 rounded-3xl border-l-4 border-[var(--tibsovo-orange)]">
                    <span className="text-xs uppercase tracking-wider text-gray-400 font-bold block mb-2">Hemograma</span>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <span className="block text-gray-500">Hb</span>
                        <span className="font-mono text-lg font-bold text-white">8.2 <span className="text-xs font-normal text-gray-500">g/dL</span></span>
                      </div>
                      <div>
                        <span className="block text-gray-500">Plaquetas</span>
                        <span className="font-mono text-lg font-bold text-white">35k <span className="text-xs font-normal text-gray-500">/mm³</span></span>
                      </div>
                      <div>
                        <span className="block text-gray-500">Leucócitos</span>
                        <span className="font-mono text-lg font-bold text-white">38k <span className="text-xs font-normal text-gray-500">/mm³</span></span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="text-sm uppercase tracking-wider text-[var(--tibsovo-orange)] font-bold block mb-2 border-b border-white/10 pb-1">Mielograma</span>
                    <p className="text-gray-200">Hipercelular, <span className="text-white font-bold bg-[var(--tibsovo-purple)]/50 px-1 rounded">44% de blastos mieloides</span> com ausência de células linfoides e marcadores de fenótipo difuso.</p>
                  </div>

                  <div>
                    <span className="text-sm uppercase tracking-wider text-[var(--tibsovo-orange)] font-bold block mb-2 border-b border-white/10 pb-1">Imunofenotipagem</span>
                    <p className="text-gray-200">Positiva para marcadores mieloides:</p>
                    <div className="flex gap-2 mt-2">
                      {['CD33+', 'CD13+', 'CD34+'].map(marker => (
                        <span key={marker} className="px-2 py-1 bg-white/10 rounded text-xs font-mono text-[var(--tibsovo-orange)] border border-white/10">
                          {marker}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </ShineBorder>
            </BlurFade>
          </div>

          <BlurFade delay={0.6} inView className="flex justify-center mt-4">
            <div onClick={handleInitialClick} className="w-full max-w-md">
              <ShimmerButton 
                className="w-full text-lg font-bold tracking-wide shadow-2xl" 
                background="var(--tibsovo-orange)"
                shimmerColor="#ffffff"
                shimmerSize="0.1em"
                shimmerDuration="2s"
              >
                <span className="flex items-center gap-2">
                  Próximo <ChevronRight />
                </span>
              </ShimmerButton>
            </div>
          </BlurFade>

          <div className="w-full text-center mt-8 pb-8">
            <p className="text-[10px] md:text-xs text-gray-500/60 font-light uppercase tracking-wide max-w-2xl mx-auto">
              Material destinado a profissionais de saúde habilitados a prescrever e dispensar medicamentos
            </p>
          </div>

        </div>
      </div>
    );
  }

  // Tela do Formulário (Wizard)
  const currentQ = questions[currentStep];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--tibsovo-bg)] text-white font-sans overflow-hidden relative selection:bg-[var(--tibsovo-orange)] selection:text-white">
      {/* Background Particles */}
      <Particles className="absolute inset-0 z-0 pointer-events-none" quantity={60} ease={100} color="#ffffff" refresh />

      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute bottom-0 right-0 w-full h-full bg-[linear-gradient(to_top_right,transparent,rgba(255,107,74,0.05))] mix-blend-overlay" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-screen bg-gradient-to-b from-transparent via-[var(--tibsovo-orange)]/20 to-transparent blur-[1px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 p-6 md:p-8 flex justify-between items-center backdrop-blur-md bg-black/10 border-b border-white/5">
        <div className="flex items-center gap-3">
          <img src="/image.png" alt="TIBSOVO®" className="h-14 md:h-20 w-auto object-contain" />
        </div>
        <div className="text-sm font-medium text-gray-300 bg-white/5 px-4 py-2 rounded-full border border-white/10 hidden md:block">
          Formulário Educacional
        </div>
      </header>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-white/5 relative z-20">
        <motion.div 
          className="h-full bg-gradient-to-r from-[var(--tibsovo-purple-light)] to-[var(--tibsovo-orange)] shadow-[0_0_10px_rgba(255,107,74,0.7)]"
          initial={{ width: 0 }}
          animate={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 max-w-4xl mx-auto w-full">
        <AnimatePresence mode='wait' custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="w-full"
          >
            <div className="mb-6">
              <span className="inline-block px-3 py-1 bg-[var(--tibsovo-orange)] text-white text-xs font-bold rounded-full mb-4 shadow-lg shadow-orange-500/30">
                QUESTÃO {currentStep + 1} DE {questions.length}
              </span>
              
              <h2 className="text-3xl md:text-4xl font-light leading-tight text-white mb-8 drop-shadow-lg">
                <TextAnimate animation="fadeIn" by="word" duration={0.02}>
                   {currentQ.question}
                </TextAnimate>
              </h2>
            </div>

            {/* Input Areas */}
            <div className="mb-12">
              <ShineBorder 
                className="w-full p-0 bg-transparent border-none" 
                borderRadius={16}
                borderWidth={1}
                color={["transparent", "rgba(255, 107, 74, 0.3)", "transparent"]}
              >
                {currentQ.type === 'text' && (
                  <textarea
                    id={`input-${currentStep}`}
                    value={answers[currentQ.id] || ''}
                    onChange={(e) => handleAnswer(e.target.value)}
                    placeholder={currentQ.placeholder}
                    className="input-custom min-h-[180px] text-lg resize-none placeholder:text-gray-500 bg-white/5 border border-white/10 focus:border-[var(--tibsovo-orange)] focus:ring-1 focus:ring-[var(--tibsovo-orange)] transition-all rounded-2xl p-6 shadow-inner w-full"
                  />
                )}

                {currentQ.type === 'radio' && (
                  <div className="flex flex-col gap-4 w-full">
                    {currentQ.options?.map((option) => (
                      <div key={option} className="w-full">
                        <label 
                          className={clsx(
                            "flex items-center p-6 rounded-xl cursor-pointer transition-all duration-300 border w-full group",
                            answers[currentQ.id] === option 
                              ? "bg-[var(--tibsovo-orange)] border-[var(--tibsovo-orange)] shadow-[0_0_20px_rgba(255,107,74,0.4)] transform scale-[1.02]" 
                              : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/30"
                          )}
                        >
                          <input
                            type="radio"
                            name={`question-${currentQ.id}`}
                            value={option}
                            checked={answers[currentQ.id] === option}
                            onChange={() => handleAnswer(option)}
                            className="hidden"
                          />
                          <div className={clsx(
                            "w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center transition-colors",
                            answers[currentQ.id] === option ? "border-white bg-white" : "border-gray-400 group-hover:border-gray-300"
                          )}>
                            {answers[currentQ.id] === option && (
                              <div className="w-3 h-3 rounded-full bg-[var(--tibsovo-orange)]" />
                            )}
                          </div>
                          <span className="text-xl font-medium">{option}</span>
                        </label>
                        
                        {option === 'Outro (especifique)' && answers[currentQ.id] === option && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }} 
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-3 ml-2 mr-2"
                          >
                            <input 
                              type="text" 
                              placeholder="Por favor, especifique..."
                              value={answers[`other_${currentQ.id}`] || ''}
                              onChange={(e) => setAnswers(prev => ({ ...prev, [`other_${currentQ.id}`]: e.target.value }))}
                              className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder:text-gray-400 focus:outline-none focus:border-[var(--tibsovo-orange)] focus:ring-1 focus:ring-[var(--tibsovo-orange)] transition-all"
                              // autoFocus removido
                            />
                          </motion.div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {currentQ.type === 'rating' && (
                  <div className="flex justify-center gap-6 py-8 w-full bg-white/5 rounded-2xl border border-white/10">
                    {[...Array(currentQ.maxStars)].map((_, index) => {
                      const ratingValue = index + 1;
                      return (
                        <motion.div
                          key={index}
                          whileHover={{ scale: 1.2, rotate: 5 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Star
                            size={56}
                            fill={ (answers[currentQ.id] || 0) >= ratingValue ? "currentColor" : "none"}
                            className={clsx(
                              "cursor-pointer transition-all duration-300",
                              (answers[currentQ.id] || 0) >= ratingValue 
                                ? "text-[var(--tibsovo-orange)] drop-shadow-[0_0_15px_rgba(255,107,74,0.6)]" 
                                : "text-gray-600 hover:text-gray-400"
                            )}
                            onClick={() => handleAnswer(ratingValue)}
                          />
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </ShineBorder>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Navigation Footer */}
      <footer className="p-8 backdrop-blur-md bg-black/20 border-t border-white/5 relative z-20 flex flex-col gap-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center w-full">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className={clsx(
              "flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all hover:bg-white/5",
              currentStep === 0 
                ? "opacity-0 pointer-events-none" 
                : "text-gray-300 hover:text-white"
            )}
          >
            <ArrowLeft size={20} />
            Anterior
          </button>

          <ShimmerButton 
            onClick={handleNext}
            disabled={!isCurrentQuestionAnswered()}
            className={clsx(
              "font-bold text-lg shadow-lg transition-all",
              !isCurrentQuestionAnswered() && "opacity-50 grayscale cursor-not-allowed"
            )}
            background={isCurrentQuestionAnswered() ? "var(--tibsovo-orange)" : "#333"}
            shimmerColor={isCurrentQuestionAnswered() ? "#ffffff" : "transparent"}
            shimmerDuration="2.5s"
          >
            <span className="flex items-center gap-3">
              {currentStep === questions.length - 1 ? 'Concluir' : 'Próxima'}
              {currentStep !== questions.length - 1 && <ArrowRight size={20} />}
            </span>
          </ShimmerButton>
        </div>
        
        <div className="w-full text-center">
          <p className="text-[10px] md:text-xs text-gray-500/60 font-light uppercase tracking-wide max-w-2xl mx-auto">
            Material destinado a profissionais de saúde habilitados a prescrever e dispensar medicamentos
          </p>
        </div>
      </footer>

      {/* Logo Servier */}
      <div className="absolute bottom-4 right-4 z-50 opacity-80 pointer-events-none">
        <img src="/lgooservier.png" alt="Servier" className="h-6 md:h-8 w-auto object-contain" />
      </div>
    </div>
  );
}
