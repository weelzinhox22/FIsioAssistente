"use client"

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Clock, Play, Pause, RotateCcw, Bell, Settings, X, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak';

export default function StudyMode() {
  // Configurações padrão
  const defaultSettings = {
    pomodoro: 25, // minutos
    shortBreak: 5, // minutos
    longBreak: 15, // minutos
    longBreakInterval: 4, // número de pomodoros antes de um intervalo longo
    autoStartBreaks: false,
    autoStartPomodoros: false,
    volume: 50, // 0-100
    soundEnabled: true,
  };

  // Estados
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<TimerMode>('pomodoro');
  const [timeLeft, setTimeLeft] = useState(defaultSettings.pomodoro * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [settings, setSettings] = useState(defaultSettings);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [volume, setVolume] = useState(50);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Carregar configurações do localStorage
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('study-mode-settings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
        setVolume(parsedSettings.volume);
        setSoundEnabled(parsedSettings.soundEnabled);
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    }
  }, []);

  // Salvar configurações no localStorage quando alteradas
  useEffect(() => {
    localStorage.setItem('study-mode-settings', JSON.stringify({
      ...settings,
      volume,
      soundEnabled
    }));
  }, [settings, volume, soundEnabled]);

  // Inicializar áudio
  useEffect(() => {
    // Não tentar carregar arquivo externo, usar apenas o gerador de som
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Atualizar o timer quando o modo mudar
  useEffect(() => {
    switch (mode) {
      case 'pomodoro':
        setTimeLeft(settings.pomodoro * 60);
        break;
      case 'shortBreak':
        setTimeLeft(settings.shortBreak * 60);
        break;
      case 'longBreak':
        setTimeLeft(settings.longBreak * 60);
        break;
    }
    
    // Parar o timer quando o modo mudar
    setIsRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [mode, settings]);

  // Criar um som de notificação usando Web Audio API
  const playNotificationSound = () => {
    if (!soundEnabled) return;
    generateBeepSound();
  };
  
  // Gerar um som de beep usando Web Audio API
  const generateBeepSound = () => {
    try {
      // Verificar se está no navegador
      if (typeof window === 'undefined' || !window.AudioContext && !(window as any).webkitAudioContext) {
        console.warn('Web Audio API não disponível');
        // Usar vibração como alternativa se disponível
        if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
          navigator.vibrate([200, 100, 200]);
        }
        return;
      }
      
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      // Configurar oscilador
      oscillator.type = 'sine';
      oscillator.frequency.value = 800; // frequência em Hz
      
      // Configurar volume
      gainNode.gain.value = volume / 100;
      
      // Conectar nodes
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Tocar som
      oscillator.start();
      
      // Parar após 500ms
      setTimeout(() => {
        oscillator.stop();
        audioContext.close();
      }, 500);
      
      // Usar vibração como complemento se disponível
      if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200]);
      }
    } catch (error) {
      console.error('Erro ao gerar som:', error);
    }
  };

  // Timer
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            // Timer acabou
            clearInterval(timerRef.current!);
            
            // Tocar som
            playNotificationSound();
            
            // Incrementar contador de pomodoros se o modo atual for 'pomodoro'
            if (mode === 'pomodoro') {
              const newCount = pomodoroCount + 1;
              setPomodoroCount(newCount);
              
              // Verificar se deve passar para longBreak
              if (newCount % settings.longBreakInterval === 0) {
                setMode('longBreak');
                if (settings.autoStartBreaks) {
                  // Atraso para permitir a transição
                  setTimeout(() => setIsRunning(true), 500);
                }
              } else {
                setMode('shortBreak');
                if (settings.autoStartBreaks) {
                  // Atraso para permitir a transição
                  setTimeout(() => setIsRunning(true), 500);
                }
              }
            } else {
              // Se for um intervalo, voltar para pomodoro
              setMode('pomodoro');
              if (settings.autoStartPomodoros) {
                // Atraso para permitir a transição
                setTimeout(() => setIsRunning(true), 500);
              }
            }
            
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
      
      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [isRunning, mode, settings, pomodoroCount, soundEnabled]);

  // Formatar tempo
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calcular progresso
  const calculateProgress = () => {
    let totalTime;
    switch (mode) {
      case 'pomodoro':
        totalTime = settings.pomodoro * 60;
        break;
      case 'shortBreak':
        totalTime = settings.shortBreak * 60;
        break;
      case 'longBreak':
        totalTime = settings.longBreak * 60;
        break;
    }
    
    return (1 - timeLeft / totalTime) * 100;
  };

  // Iniciar/pausar timer
  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  // Resetar timer
  const resetTimer = () => {
    setIsRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    switch (mode) {
      case 'pomodoro':
        setTimeLeft(settings.pomodoro * 60);
        break;
      case 'shortBreak':
        setTimeLeft(settings.shortBreak * 60);
        break;
      case 'longBreak':
        setTimeLeft(settings.longBreak * 60);
        break;
    }
  };

  // Alternar som
  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };

  if (!isOpen) {
    return (
      <Button 
        onClick={() => setIsOpen(true)}
        variant="outline" 
        size="icon"
        className="fixed bottom-4 right-4 z-10 bg-white dark:bg-gray-800 shadow-md hover:shadow-lg rounded-full w-12 h-12"
      >
        <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
      </Button>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed bottom-4 right-4 z-10 bg-white dark:bg-gray-800 shadow-xl rounded-lg p-4 w-80"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300">Modo Estudo</h3>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSound}
            className="h-8 w-8"
          >
            {soundEnabled ? 
              <Volume2 className="h-4 w-4" /> : 
              <VolumeX className="h-4 w-4" />
            }
          </Button>
          <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Settings className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Configurações</DialogTitle>
                <DialogDescription>
                  Ajuste as configurações do seu timer pomodoro.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 items-center gap-4">
                  <Label htmlFor="pomodoro">Pomodoro (min)</Label>
                  <input
                    id="pomodoro"
                    type="number"
                    min="1"
                    max="60"
                    value={settings.pomodoro}
                    onChange={(e) => setSettings({...settings, pomodoro: parseInt(e.target.value)})}
                    className="w-full p-2 border rounded-md dark:bg-gray-800"
                  />
                </div>
                <div className="grid grid-cols-2 items-center gap-4">
                  <Label htmlFor="shortBreak">Pausa Curta (min)</Label>
                  <input
                    id="shortBreak"
                    type="number"
                    min="1"
                    max="30"
                    value={settings.shortBreak}
                    onChange={(e) => setSettings({...settings, shortBreak: parseInt(e.target.value)})}
                    className="w-full p-2 border rounded-md dark:bg-gray-800"
                  />
                </div>
                <div className="grid grid-cols-2 items-center gap-4">
                  <Label htmlFor="longBreak">Pausa Longa (min)</Label>
                  <input
                    id="longBreak"
                    type="number"
                    min="1"
                    max="60"
                    value={settings.longBreak}
                    onChange={(e) => setSettings({...settings, longBreak: parseInt(e.target.value)})}
                    className="w-full p-2 border rounded-md dark:bg-gray-800"
                  />
                </div>
                <div className="grid grid-cols-2 items-center gap-4">
                  <Label htmlFor="longBreakInterval">Intervalo de Pausa Longa</Label>
                  <input
                    id="longBreakInterval"
                    type="number"
                    min="1"
                    max="10"
                    value={settings.longBreakInterval}
                    onChange={(e) => setSettings({...settings, longBreakInterval: parseInt(e.target.value)})}
                    className="w-full p-2 border rounded-md dark:bg-gray-800"
                  />
                </div>
                <div className="grid grid-cols-2 items-center gap-4">
                  <Label htmlFor="autoStartBreaks">Auto Iniciar Pausas</Label>
                  <Switch
                    id="autoStartBreaks"
                    checked={settings.autoStartBreaks}
                    onCheckedChange={(checked) => setSettings({...settings, autoStartBreaks: checked})}
                  />
                </div>
                <div className="grid grid-cols-2 items-center gap-4">
                  <Label htmlFor="autoStartPomodoros">Auto Iniciar Pomodoros</Label>
                  <Switch
                    id="autoStartPomodoros"
                    checked={settings.autoStartPomodoros}
                    onCheckedChange={(checked) => setSettings({...settings, autoStartPomodoros: checked})}
                  />
                </div>
                <div className="grid grid-cols-2 items-center gap-4">
                  <Label htmlFor="volume">Volume</Label>
                  <Slider
                    id="volume"
                    min={0}
                    max={100}
                    step={1}
                    value={[volume]}
                    onValueChange={(value) => setVolume(value[0])}
                  />
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex justify-center space-x-2 mb-4">
        <Button 
          variant={mode === 'pomodoro' ? 'default' : 'outline'} 
          size="sm" 
          onClick={() => setMode('pomodoro')}
        >
          Pomodoro
        </Button>
        <Button 
          variant={mode === 'shortBreak' ? 'default' : 'outline'} 
          size="sm" 
          onClick={() => setMode('shortBreak')}
        >
          Pausa Curta
        </Button>
        <Button 
          variant={mode === 'longBreak' ? 'default' : 'outline'} 
          size="sm" 
          onClick={() => setMode('longBreak')}
        >
          Pausa Longa
        </Button>
      </div>
      
      <div className="relative w-full h-40 flex items-center justify-center">
        {/* Círculo de progresso */}
        <svg className="w-36 h-36 transform -rotate-90">
          <circle
            cx="72"
            cy="72"
            r="60"
            fill="transparent"
            stroke="#e5e7eb"
            strokeWidth="8"
          />
          <circle
            cx="72"
            cy="72"
            r="60"
            fill="transparent"
            stroke={
              mode === 'pomodoro' ? '#ef4444' : 
              mode === 'shortBreak' ? '#3b82f6' : '#10b981'
            }
            strokeWidth="8"
            strokeDasharray={2 * Math.PI * 60}
            strokeDashoffset={2 * Math.PI * 60 * (1 - calculateProgress() / 100)}
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
        </svg>
        
        {/* Tempo */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl font-bold">
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>
      
      <div className="flex justify-center space-x-4 mt-4">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={resetTimer}
          className="rounded-full"
        >
          <RotateCcw className="h-5 w-5" />
        </Button>
        <Button 
          onClick={toggleTimer} 
          size="icon"
          className={`rounded-full ${
            mode === 'pomodoro' ? 'bg-red-500 hover:bg-red-600' : 
            mode === 'shortBreak' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {isRunning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </Button>
      </div>
      
      <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
        Ciclos completados: {pomodoroCount}
      </div>
    </motion.div>
  );
} 