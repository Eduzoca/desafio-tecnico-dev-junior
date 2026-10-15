import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import ptBr from "@fullcalendar/core/locales/pt-br";
import { diasSemana, horarioFinal } from "../config";
export default function AgendaCalendar({
  dias,
  duracao,
}: {
  dias: Record<string, string[]>;
  duracao: number;
}) {
  const events = diasSemana.flatMap(([dia], index) =>
    (dias[dia] ?? []).map((hora) => ({
      id: `${dia}-${hora}`,
      daysOfWeek: [(index + 1) % 7],
      startTime: hora,
      endTime: horarioFinal(hora, duracao),
      title: `${hora}–${horarioFinal(hora, duracao)}`,
    })),
  );
  return (
    <div className="agenda-calendar">
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridWeek"
        locale={ptBr}
        firstDay={1}
        headerToolbar={false}
        dayHeaderFormat={{ weekday: "short" }}
        height={260}
        events={events}
        displayEventTime={false}
        dayMaxEvents={3}
        moreLinkClick="popover"
        eventDisplay="block"
        eventOrder="start"
        editable={false}
      />
    </div>
  );
}
