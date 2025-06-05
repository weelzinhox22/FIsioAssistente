"use client"

import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';
import { FavoritesContext } from './favorites-system';

interface AnimatedCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  delay: number;
}

export default function AnimatedCard({ title, description, icon, href, delay }: AnimatedCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Verificar se o card é um favorito
  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem('favorites');
      if (storedFavorites) {
        const favorites = JSON.parse(storedFavorites);
        setIsFavorite(favorites.some((fav: any) => fav.href === href));
      }
    } catch (error) {
      console.error('Erro ao verificar favoritos:', error);
    }
  }, [href]);
  
  useEffect(() => {
    const card = cardRef.current;
    
    if (!card) return;
    
    // Configuração inicial
    gsap.set(card, { 
      y: 50, 
      opacity: 0,
      scale: 0.95
    });
    
    // Animação de entrada
    gsap.to(card, { 
      y: 0, 
      opacity: 1, 
      scale: 1,
      duration: 0.8, 
      ease: "power3.out",
      delay: 0.2 + (delay * 0.1)
    });
    
    // Configurar hover animation
    const enterAnimation = () => {
      gsap.to(card, { 
        y: -10, 
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        duration: 0.3,
        ease: "power2.out"
      });
    };
    
    const leaveAnimation = () => {
      gsap.to(card, { 
        y: 0, 
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        duration: 0.3,
        ease: "power2.out"
      });
    };
    
    card.addEventListener('mouseenter', enterAnimation);
    card.addEventListener('mouseleave', leaveAnimation);
    
    return () => {
      card.removeEventListener('mouseenter', enterAnimation);
      card.removeEventListener('mouseleave', leaveAnimation);
    };
  }, [delay]);
  
  // Função para alternar favorito
  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const module = { title, description, icon, href };
    
    try {
      const storedFavorites = localStorage.getItem('favorites');
      const favorites = storedFavorites ? JSON.parse(storedFavorites) : [];
      
      if (isFavorite) {
        // Remover dos favoritos
        const updatedFavorites = favorites.filter((fav: any) => fav.href !== href);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        setIsFavorite(false);
      } else {
        // Adicionar aos favoritos
        FavoritesContext.addToFavorites(module);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Erro ao gerenciar favoritos:', error);
    }
  };
  
  // Registrar acesso ao módulo quando clicar no link
  const handleCardClick = () => {
    const module = { title, description, icon, href };
    FavoritesContext.registerModuleAccess(module);
  };
  
  return (
    <div 
      ref={cardRef}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-300 border border-gray-100 dark:border-gray-700 h-full relative"
    >
      <button 
        onClick={toggleFavorite}
        className="absolute top-3 right-3 text-gray-400 hover:text-yellow-500 transition-colors"
        aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      >
        <Star className={`h-5 w-5 ${isFavorite ? 'fill-yellow-500 text-yellow-500' : ''}`} />
      </button>
      
      <div className="mb-4 bg-blue-50 dark:bg-blue-900/30 rounded-full w-14 h-14 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2 text-blue-900 dark:text-blue-300">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">{description}</p>
      <Link 
        href={href}
        className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
        onClick={handleCardClick}
      >
        Acessar
        <ArrowRight className="ml-1 h-4 w-4" />
      </Link>
    </div>
  );
} 