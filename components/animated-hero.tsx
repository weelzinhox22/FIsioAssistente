"use client"

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/dist/SplitText';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(SplitText);
}

interface AnimatedHeroProps {
  title: string;
  subtitle: string;
}

export default function AnimatedHero({ title, subtitle }: AnimatedHeroProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const hero = heroRef.current;
    const titleElement = titleRef.current;
    const subtitleElement = subtitleRef.current;
    
    if (!hero || !titleElement || !subtitleElement) return;
    
    // Configuração inicial
    gsap.set(hero, { 
      opacity: 0
    });
    
    // Animação do hero
    const tl = gsap.timeline();
    
    tl.to(hero, {
      opacity: 1,
      duration: 0.8,
      ease: "power2.out"
    });
    
    // Animação do título com split text
    if (typeof window !== 'undefined') {
      try {
        const splitTitle = new SplitText(titleElement, { type: "words,chars" });
        const chars = splitTitle.chars;
        
        gsap.set(chars, { opacity: 0, y: 20 });
        
        tl.to(chars, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.02,
          ease: "power4.out"
        }, "-=0.4");
        
        // Animação do subtítulo
        gsap.set(subtitleElement, { opacity: 0, y: 20 });
        
        tl.to(subtitleElement, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out"
        }, "-=0.6");
      } catch (error) {
        // Fallback se SplitText falhar
        gsap.to([titleElement, subtitleElement], {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out"
        });
      }
    }
    
    // Adicionar efeito de gradiente animado
    const gradientElement = document.createElement('div');
    gradientElement.classList.add('animated-gradient');
    hero.appendChild(gradientElement);
    
    return () => {
      if (gradientElement && gradientElement.parentNode) {
        gradientElement.parentNode.removeChild(gradientElement);
      }
    };
  }, []);
  
  return (
    <div 
      ref={heroRef}
      className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-2xl p-8 md:p-12 mb-8 shadow-lg"
    >
      <div className="relative z-10">
        <h1 
          ref={titleRef}
          className="text-3xl md:text-4xl font-bold text-blue-900 dark:text-blue-100 mb-4"
        >
          {title}
        </h1>
        <p 
          ref={subtitleRef}
          className="text-lg text-blue-700 dark:text-blue-300 max-w-2xl"
        >
          {subtitle}
        </p>
      </div>
      
      {/* Formas decorativas */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200 dark:bg-blue-800/20 rounded-full -mr-20 -mt-20 opacity-50" />
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-300 dark:bg-blue-700/20 rounded-full -ml-10 -mb-10 opacity-30" />
      
      <style jsx>{`
        .animated-gradient {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.05), rgba(147, 197, 253, 0.1));
          animation: rotate 15s linear infinite;
          z-index: 1;
        }
        
        @keyframes rotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
} 