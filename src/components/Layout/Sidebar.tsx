
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Calendar, 
  CheckSquare, 
  User, 
  Settings,
  UserPlus,
  MapPin,
  Clock
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { usuario } = useAuth();

  const getMenuItems = () => {
    const baseItems = [];

    if (usuario?.rol === 'administrador') {
      return [
        { id: 'dashboard', label: 'Dashboard', icon: Settings },
        { id: 'clientes', label: 'Clientes', icon: Users },
        { id: 'prospectos', label: 'Prospectos', icon: UserPlus },
        { id: 'equipos', label: 'Equipos', icon: User },
        { id: 'tareas', label: 'Tareas', icon: CheckSquare },
        { id: 'visitas', label: 'Programación', icon: Calendar },
        { id: 'usuarios', label: 'Usuarios', icon: Settings },
      ];
    }

    if (usuario?.rol === 'operador_logistico') {
      return [
        { id: 'dashboard', label: 'Dashboard', icon: Settings },
        { id: 'clientes', label: 'Clientes', icon: Users },
        { id: 'visitas', label: 'Programación', icon: Calendar },
        { id: 'equipos', label: 'Equipos', icon: User },
        { id: 'tareas', label: 'Tareas', icon: CheckSquare },
      ];
    }

    if (usuario?.rol === 'encargado') {
      return [
        { id: 'hoja-ruta', label: 'Mi Hoja de Ruta', icon: MapPin },
        { id: 'visitas-hoy', label: 'Visitas de Hoy', icon: Clock },
      ];
    }

    return baseItems;
  };

  const menuItems = getMenuItems();

  return (
    <div className="bg-gradient-to-b from-green-50 to-green-100 w-64 min-h-screen p-4 shadow-lg">
      <div className="mb-8">
        <div className="text-sm text-green-600 font-medium mb-2">
          {usuario?.rol?.replace('_', ' ').toUpperCase()}
        </div>
        <div className="text-gray-600 text-sm">
          {usuario?.nombre}
        </div>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Button
            key={item.id}
            variant={activeTab === item.id ? "default" : "ghost"}
            className={`w-full justify-start ${
              activeTab === item.id 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : 'text-green-700 hover:bg-green-200'
            }`}
            onClick={() => setActiveTab(item.id)}
          >
            <item.icon className="mr-3 h-4 w-4" />
            {item.label}
          </Button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
