import { Canal } from '@/contexts/AppContext';

export interface ScheduleSlot {
  date: Date;
  time: string;
  available: boolean;
}

export const getNextAvailableSlot = (
  canal: Canal,
  occupiedSlots: { data_agendada: Date; hora_agendada: string }[]
): ScheduleSlot | null => {
  if (!canal.dias_postagem || canal.dias_postagem.length === 0) {
    return null;
  }

  const today = new Date();
  const maxDaysAhead = 365; // Search up to 1 year ahead
  
  for (let daysAhead = 0; daysAhead < maxDaysAhead; daysAhead++) {
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() + daysAhead);
    
    const dayOfWeek = checkDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const dayNames = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
    const dayName = dayNames[dayOfWeek];
    
    // Check if this day is in the channel's posting days
    if (canal.dias_postagem.includes(dayName)) {
      // Check each time slot for this day
      for (const timeSlot of canal.horarios_postagem) {
        const isOccupied = occupiedSlots.some(slot => {
          const slotDate = new Date(slot.data_agendada);
          return (
            slotDate.toDateString() === checkDate.toDateString() &&
            slot.hora_agendada === timeSlot
          );
        });
        
        if (!isOccupied) {
          return {
            date: checkDate,
            time: timeSlot,
            available: true
          };
        }
      }
    }
  }
  
  return null;
};

export const getAvailableSlotsForWeek = (
  canal: Canal,
  startDate: Date,
  occupiedSlots: { data_agendada: Date; hora_agendada: string }[]
): ScheduleSlot[] => {
  const slots: ScheduleSlot[] = [];
  
  for (let i = 0; i < 7; i++) {
    const checkDate = new Date(startDate);
    checkDate.setDate(startDate.getDate() + i);
    
    const dayOfWeek = checkDate.getDay();
    const dayNames = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
    const dayName = dayNames[dayOfWeek];
    
    if (canal.dias_postagem.includes(dayName)) {
      for (const timeSlot of canal.horarios_postagem) {
        const isOccupied = occupiedSlots.some(slot => {
          const slotDate = new Date(slot.data_agendada);
          return (
            slotDate.toDateString() === checkDate.toDateString() &&
            slot.hora_agendada === timeSlot
          );
        });
        
        slots.push({
          date: checkDate,
          time: timeSlot,
          available: !isOccupied
        });
      }
    }
  }
  
  return slots;
};

export const formatSlotDisplay = (slot: ScheduleSlot): string => {
  const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  const dayName = dayNames[slot.date.getDay()];
  const formattedDate = slot.date.toLocaleDateString('pt-BR', { 
    day: '2-digit', 
    month: '2-digit' 
  });
  
  return `${dayName}, ${formattedDate} às ${slot.time}`;
};