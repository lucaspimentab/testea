import { Heart, User, LogOut } from 'lucide-react';
import type { Page } from '../App';

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  isLoggedIn?: boolean;
  onLogout?: () => void;
}

export function Header({ currentPage, onNavigate, isLoggedIn, onLogout }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <button 
            onClick={() => onNavigate('search')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Heart className="w-6 h-6 text-teal-500 fill-teal-500" />
            <span className="text-gray-900">ConectCausa</span>
          </button>
          
          <div className="flex items-center gap-6">
            <button 
              onClick={() => onNavigate('search')}
              className="text-gray-700 hover:text-teal-600 transition-colors"
            >
              Buscar ONGs
            </button>
            {isLoggedIn ? (
              <>
                <button 
                  onClick={() => onNavigate('dashboard')}
                  className="text-gray-700 hover:text-teal-600 transition-colors"
                >
                  Painel
                </button>
                <button 
                  onClick={onLogout}
                  className="flex items-center gap-2 text-gray-700 hover:text-teal-600 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </button>
              </>
            ) : (
              <button 
                onClick={() => onNavigate('admin')}
                className="flex items-center gap-2 text-gray-700 hover:text-teal-600 transition-colors"
              >
                <User className="w-4 h-4" />
                Área do Administrador
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
