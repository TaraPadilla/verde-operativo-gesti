
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { MapPin, Clock, CheckSquare, MessageSquare, Navigation } from 'lucide-react';
import { Visita } from '@/types';
import { toast } from '@/hooks/use-toast';

const HojaRuta = () => {
  const [visitasHoy] = useState<Visita[]>([
    {
      id: '1',
      clienteId: '1',
      clienteNombre: 'Jardines del Norte S.A.',
      equipoId: '1',
      equipoNombre: 'Equipo A',
      fechaProgramada: '2024-06-25',
      estado: 'programada',
      tareasProgramadas: ['Corte de césped', 'Poda de arbustos', 'Riego general'],
      tareasRealizadas: [],
      tareasAdicionales: [],
      observaciones: ''
    },
    {
      id: '2',
      clienteId: '2',
      clienteNombre: 'Villa Hermosa',
      equipoId: '1',
      equipoNombre: 'Equipo A',
      fechaProgramada: '2024-06-25',
      estado: 'programada',
      tareasProgramadas: ['Mantenimiento de jardín', 'Limpieza de área verde'],
      tareasRealizadas: [],
      tareasAdicionales: [],
      observaciones: ''
    }
  ]);

  const [visitasActualizadas, setVisitasActualizadas] = useState<{[key: string]: any}>({});

  const handleTareaChange = (visitaId: string, tarea: string, checked: boolean) => {
    setVisitasActualizadas(prev => ({
      ...prev,
      [visitaId]: {
        ...prev[visitaId],
        tareasRealizadas: checked 
          ? [...(prev[visitaId]?.tareasRealizadas || []), tarea]
          : (prev[visitaId]?.tareasRealizadas || []).filter((t: string) => t !== tarea)
      }
    }));
  };

  const handleObservacionChange = (visitaId: string, observacion: string) => {
    setVisitasActualizadas(prev => ({
      ...prev,
      [visitaId]: {
        ...prev[visitaId],
        observaciones: observacion
      }
    }));
  };

  const marcarVisitaCompleta = (visitaId: string) => {
    const visita = visitasHoy.find(v => v.id === visitaId);
    const actualizacion = visitasActualizadas[visitaId];
    
    if (!actualizacion?.tareasRealizadas?.length) {
      toast({
        title: "Selecciona las tareas",
        description: "Debes marcar al menos una tarea como realizada",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Visita completada",
      description: `Visita a ${visita?.clienteNombre} marcada como completa`,
    });

    // Aquí se enviarían los datos al backend
    console.log('Datos de visita completada:', {
      visitaId,
      tareasRealizadas: actualizacion.tareasRealizadas,
      observaciones: actualizacion.observaciones,
      fechaEjecucion: new Date().toISOString()
    });
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'completada': return 'bg-green-100 text-green-800';
      case 'en_proceso': return 'bg-blue-100 text-blue-800';
      case 'programada': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mi Hoja de Ruta</h1>
        <p className="text-gray-600 flex items-center">
          <Calendar className="mr-2 h-4 w-4" />
          {new Date().toLocaleDateString('es-ES', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      <div className="grid gap-6">
        {visitasHoy.map((visita, index) => {
          const actualizacion = visitasActualizadas[visita.id] || {};
          const tareasRealizadas = actualizacion.tareasRealizadas || [];
          const todasTareasCompletas = tareasRealizadas.length === visita.tareasProgramadas.length;

          return (
            <Card key={visita.id} className="border-l-4 border-l-green-500">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl flex items-center">
                      <MapPin className="mr-2 h-5 w-5 text-green-600" />
                      {visita.clienteNombre}
                    </CardTitle>
                    <CardDescription className="flex items-center mt-2">
                      <Clock className="mr-2 h-4 w-4" />
                      Visita #{index + 1} del día
                    </CardDescription>
                  </div>
                  <Badge className={getEstadoColor(visita.estado)}>
                    {visita.estado}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Tareas */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <CheckSquare className="mr-2 h-4 w-4" />
                    Tareas Programadas
                  </h3>
                  <div className="space-y-3">
                    {visita.tareasProgramadas.map((tarea, tareaIndex) => (
                      <div key={tareaIndex} className="flex items-center space-x-3">
                        <Checkbox
                          id={`tarea-${visita.id}-${tareaIndex}`}
                          checked={tareasRealizadas.includes(tarea)}
                          onCheckedChange={(checked) => 
                            handleTareaChange(visita.id, tarea, checked as boolean)
                          }
                        />
                        <label 
                          htmlFor={`tarea-${visita.id}-${tareaIndex}`}
                          className={`text-sm ${
                            tareasRealizadas.includes(tarea) 
                              ? 'line-through text-gray-500' 
                              : 'text-gray-900'
                          }`}
                        >
                          {tarea}
                        </label>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 text-sm text-gray-600">
                    Completadas: {tareasRealizadas.length} de {visita.tareasProgramadas.length}
                  </div>
                </div>

                {/* Observaciones */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Observaciones de Campo
                  </h3>
                  <Textarea
                    placeholder="Notas sobre la visita, condiciones del jardín, problemas encontrados..."
                    value={actualizacion.observaciones || ''}
                    onChange={(e) => handleObservacionChange(visita.id, e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>

                {/* Acciones */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button 
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => marcarVisitaCompleta(visita.id)}
                    disabled={tareasRealizadas.length === 0}
                  >
                    <CheckSquare className="mr-2 h-4 w-4" />
                    {todasTareasCompletas ? 'Completar Visita' : 'Completar Parcialmente'}
                  </Button>
                  
                  <Button variant="outline" className="flex-1">
                    <Navigation className="mr-2 h-4 w-4" />
                    Ver Ubicación
                  </Button>
                </div>

                {/* Progreso visual */}
                <div className="bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${(tareasRealizadas.length / visita.tareasProgramadas.length) * 100}%` 
                    }}
                  ></div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {visitasHoy.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay visitas programadas para hoy
            </h3>
            <p className="text-gray-600">
              Disfruta de tu día libre o consulta la programación de mañana
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default HojaRuta;
