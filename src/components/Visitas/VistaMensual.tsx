
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { format, isSameDay, getDaysInMonth, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { es } from 'date-fns/locale';
import { Visita } from '@/types';
import { Clock, MapPin } from 'lucide-react';

interface VistaMensualProps {
  visitas: Visita[];
  fechaSeleccionada: Date;
  setFechaSeleccionada: (fecha: Date) => void;
  clientes: any[];
}

const VistaMensual: React.FC<VistaMensualProps> = ({ 
  visitas, 
  fechaSeleccionada, 
  setFechaSeleccionada,
  clientes 
}) => {
  const inicioMes = startOfMonth(fechaSeleccionada);
  const finMes = endOfMonth(fechaSeleccionada);
  const diasMes = eachDayOfInterval({ start: inicioMes, end: finMes });

  const visitasPorDia = (dia: Date) => {
    return visitas.filter(visita => 
      isSameDay(new Date(visita.fechaProgramada), dia)
    );
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'programada':
        return <Badge variant="outline" className="text-xs">Prog.</Badge>;
      case 'en_proceso':
        return <Badge className="bg-yellow-500 text-xs">En Proceso</Badge>;
      case 'completada':
        return <Badge className="bg-green-500 text-xs">Comp.</Badge>;
      case 'reagendada':
        return <Badge className="bg-blue-500 text-xs">Reag.</Badge>;
      case 'cancelada':
        return <Badge variant="destructive" className="text-xs">Canc.</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">{estado}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Vista Mensual - {format(fechaSeleccionada, 'MMMM yyyy', { locale: es })}</span>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setFechaSeleccionada(new Date(fechaSeleccionada.getFullYear(), fechaSeleccionada.getMonth() - 1))}
            >
              ← Anterior
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setFechaSeleccionada(new Date())}
            >
              Hoy
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setFechaSeleccionada(new Date(fechaSeleccionada.getFullYear(), fechaSeleccionada.getMonth() + 1))}
            >
              Siguiente →
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(dia => (
            <div key={dia} className="p-2 text-center font-semibold text-gray-600 border-b">
              {dia}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {diasMes.map(dia => {
            const visitasHoy = visitasPorDia(dia);
            const esHoy = isSameDay(dia, new Date());
            
            return (
              <div 
                key={dia.toISOString()} 
                className={`min-h-[120px] p-2 border rounded-lg ${
                  esHoy ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                }`}
              >
                <div className={`text-sm font-medium mb-1 ${
                  esHoy ? 'text-blue-600' : 'text-gray-700'
                }`}>
                  {format(dia, 'd')}
                </div>
                
                <div className="space-y-1">
                  {visitasHoy.map(visita => (
                    <div 
                      key={visita.id} 
                      className="text-xs p-1 bg-white rounded border shadow-sm"
                    >
                      <div className="font-medium truncate">
                        {visita.clienteNombre}
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-gray-600 truncate">
                          {visita.equipoNombre}
                        </span>
                        {getEstadoBadge(visita.estado)}
                      </div>
                    </div>
                  ))}
                </div>
                
                {visitasHoy.length > 2 && (
                  <div className="text-xs text-gray-500 mt-1">
                    +{visitasHoy.length - 2} más
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default VistaMensual;
