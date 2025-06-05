"use client"

import { useEffect, useState } from 'react';
import { Star, Clock, Activity, BookOpen, Database, FileText, Link2, Stethoscope, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

// Interface para os módulos
interface Module {
  title: string;
  description: string;
  iconName: string; // Nome do ícone em vez do componente React
  href: string;
}

// Função para obter o ícone com base no nome
const getIconByName = (iconName: string) => {
  switch (iconName) {
    case 'Users': return <Users className="h-5 w-5 text-blue-800" />;
    case 'FileText': return <FileText className="h-5 w-5 text-blue-800" />;
    case 'Stethoscope': return <Stethoscope className="h-5 w-5 text-blue-800" />;
    case 'Database': return <Database className="h-5 w-5 text-blue-800" />;
    case 'BookOpen': return <BookOpen className="h-5 w-5 text-blue-800" />;
    case 'Activity': return <Activity className="h-5 w-5 text-blue-800" />;
    case 'Link2': return <Link2 className="h-5 w-5 text-blue-800" />;
    case 'TrendingUp': return <TrendingUp className="h-5 w-5 text-blue-800" />;
    default: return <BookOpen className="h-5 w-5 text-blue-800" />;
  }
};

export default function FavoritesSystem() {
  const [favorites, setFavorites] = useState<Module[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Module[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar favoritos e recentes do localStorage
  useEffect(() => {
    try {
      // Tentar carregar favoritos
      const storedFavorites = localStorage.getItem('favorites');
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }

      // Tentar carregar recentes
      const storedRecent = localStorage.getItem('recently-viewed');
      if (storedRecent) {
        setRecentlyViewed(JSON.parse(storedRecent));
      }
    } catch (error) {
      console.error('Erro ao carregar favoritos/recentes:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Salvar quando os favoritos mudarem
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
  }, [favorites, isLoading]);

  // Adicionar aos favoritos
  const addToFavorites = (module: Module) => {
    if (!favorites.some(fav => fav.href === module.href)) {
      setFavorites(prev => [...prev, module]);
    }
  };

  // Remover dos favoritos
  const removeFromFavorite = (moduleHref: string) => {
    setFavorites(prev => prev.filter(module => module.href !== moduleHref));
  };

  // Verificar se um módulo é favorito
  const isFavorite = (moduleHref: string) => {
    return favorites.some(module => module.href === moduleHref);
  };

  // Registrar acesso a um módulo
  const registerModuleAccess = (module: Module) => {
    // Remover o módulo da lista atual se já existir
    const updatedRecent = recentlyViewed.filter(item => item.href !== module.href);
    
    // Adicionar na primeira posição
    const newRecentlyViewed = [module, ...updatedRecent].slice(0, 5); // Manter apenas 5 itens
    
    setRecentlyViewed(newRecentlyViewed);
    localStorage.setItem('recently-viewed', JSON.stringify(newRecentlyViewed));
  };

  // Se não houver favoritos ou recentes, não mostrar nada
  if (isLoading || (favorites.length === 0 && recentlyViewed.length === 0)) {
    return null;
  }

  return (
    <div className="mb-8">
      {favorites.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100 flex items-center mb-4">
            <Star className="h-5 w-5 mr-2 text-yellow-500" />
            Favoritos
          </h2>
          <div className="flex flex-wrap gap-3">
            {favorites.map((module, index) => (
              <motion.div
                key={module.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 flex items-center gap-2 hover:shadow-md transition-shadow"
              >
                <div className="bg-blue-50 dark:bg-blue-900/30 rounded-full p-2 flex-shrink-0">
                  {getIconByName(module.iconName)}
                </div>
                <div className="flex-grow">
                  <Link href={module.href} className="text-blue-800 dark:text-blue-300 font-medium">
                    {module.title}
                  </Link>
                </div>
                <button 
                  onClick={() => removeFromFavorite(module.href)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  aria-label="Remover dos favoritos"
                >
                  <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {recentlyViewed.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100 flex items-center mb-4">
            <Clock className="h-5 w-5 mr-2 text-blue-500" />
            Acessados Recentemente
          </h2>
          <div className="flex flex-wrap gap-3">
            {recentlyViewed.map((module, index) => (
              <motion.div
                key={module.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 flex items-center gap-2 hover:shadow-md transition-shadow"
              >
                <div className="bg-blue-50 dark:bg-blue-900/30 rounded-full p-2 flex-shrink-0">
                  {getIconByName(module.iconName)}
                </div>
                <div className="flex-grow">
                  <Link href={module.href} className="text-blue-800 dark:text-blue-300 font-medium">
                    {module.title}
                  </Link>
                </div>
                <button 
                  onClick={() => isFavorite(module.href) ? removeFromFavorite(module.href) : addToFavorites(module)}
                  className="text-gray-400 hover:text-yellow-500 transition-colors"
                  aria-label={isFavorite(module.href) ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                >
                  <Star className={`h-5 w-5 ${isFavorite(module.href) ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Funções para exportar para uso em outros componentes
export const FavoritesContext = {
  addToFavorites: (module: Module) => {
    try {
      const storedFavorites = localStorage.getItem('favorites');
      const favorites = storedFavorites ? JSON.parse(storedFavorites) : [];
      
      if (!favorites.some((fav: Module) => fav.href === module.href)) {
        const updatedFavorites = [...favorites, module];
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      }
    } catch (error) {
      console.error('Erro ao adicionar favorito:', error);
    }
  },
  
  registerModuleAccess: (module: Module) => {
    try {
      const storedRecent = localStorage.getItem('recently-viewed');
      const recentlyViewed = storedRecent ? JSON.parse(storedRecent) : [];
      
      // Remover o módulo da lista atual se já existir
      const updatedRecent = recentlyViewed.filter((item: Module) => item.href !== module.href);
      
      // Adicionar na primeira posição
      const newRecentlyViewed = [module, ...updatedRecent].slice(0, 5); // Manter apenas 5 itens
      
      localStorage.setItem('recently-viewed', JSON.stringify(newRecentlyViewed));
    } catch (error) {
      console.error('Erro ao registrar acesso ao módulo:', error);
    }
  }
}; 