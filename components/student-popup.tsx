"use client"

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function StudentPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Verificar se o popup já foi mostrado antes
    const popupShown = localStorage.getItem('student-popup-shown');
    
    if (!popupShown) {
      // Mostrar o popup após 2 segundos
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const closePopup = () => {
    setIsOpen(false);
    // Marcar que o popup já foi mostrado
    localStorage.setItem('student-popup-shown', 'true');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closePopup}
        >
          <motion.div 
            className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 max-w-md mx-4"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-blue-800 dark:text-blue-400">Informação</h2>
              <Button variant="ghost" size="icon" onClick={closePopup}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              Este aplicativo foi desenvolvido por um estudante de fisioterapia com o objetivo de 
              auxiliar profissionais e estudantes da área com ferramentas práticas e recursos baseados em evidências.
            </p>
            <div className="flex justify-end">
              <Button onClick={closePopup}>Entendi</Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 