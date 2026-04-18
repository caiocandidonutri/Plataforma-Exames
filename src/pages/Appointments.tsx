import { useState } from 'react'
import { Calendar as CalendarIcon, Clock, Plus, Video, ExternalLink, Lock } from 'lucide-react'
import { Link } from 'react-router-dom'
import useAppStore from '@/stores/use-app-store'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { toast } from 'sonner'
import { Appointment } from '@/types'

export default function Appointments() {
  const { currentUser, appointments, addAppointment } = useAppStore()
  const [isOpen, setIsOpen] = useState(false)
  const [isScheduling, setIsScheduling] = useState(false)

  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [type, setType] = useState('Consulta Inicial')
  const professional = 'Dr. Caio Cândido'

  if (currentUser.plan !== 'pro') {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed rounded-xl bg-slate-50 border-slate-200 mt-8">
        <div className="p-4 bg-amber-100 text-amber-600 rounded-full mb-4">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-slate-900">Agendamento Premium</h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          O agendamento direto de consultas e sincronização com Google/Outlook Calendar é exclusivo
          para assinantes do plano Pro.
        </p>
        <Button asChild size="lg" className="bg-primary">
          <Link to="/assinatura">Fazer Upgrade para Pro</Link>
        </Button>
      </div>
    )
  }

  const userAppointments = appointments.filter((a) => a.patientId === currentUser.id)

  const handleSchedule = () => {
    if (!date || !time) {
      toast.error('Preencha a data e horário desejados.')
      return
    }

    const hour = parseInt(time.split(':')[0])
    if (hour < 8 || hour > 18) {
      toast.error('Data/hora indisponível', {
        description: 'O profissional atende apenas das 08:00 às 18:00.',
      })
      return
    }

    setIsScheduling(true)

    setTimeout(() => {
      const dateTimeString = `${date}T${time}:00Z`

      const newAppt: Appointment = {
        id: `APP-${Date.now()}`,
        patientId: currentUser.id,
        professionalName: professional,
        date: dateTimeString,
        type,
        status: 'pendente',
        calendarSynced: true,
      }

      addAppointment(newAppt)
      setIsOpen(false)
      setIsScheduling(false)

      toast.success('Consulta solicitada com sucesso!', {
        description: `Evento "Consulta com ${professional} - ${type}" adicionado ao seu calendário (Simulação).`,
      })

      setDate('')
      setTime('')
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Minhas Consultas</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Gerencie seus agendamentos e sincronize com seu calendário.
          </p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="shadow-sm">
              <Plus className="w-4 h-4 mr-2" /> Agendar Consulta
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Nova Consulta com {professional}</DialogTitle>
              <DialogDescription>
                Selecione a data, horário e tipo de consulta. Verificaremos a disponibilidade na
                agenda do profissional.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="type">Tipo de Consulta</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Consulta Inicial">Consulta Inicial</SelectItem>
                    <SelectItem value="Retorno Nutricional">Retorno Nutricional</SelectItem>
                    <SelectItem value="Avaliação de Exames">Avaliação de Exames</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Data</Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Horário</Label>
                  <Input
                    id="time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSchedule} disabled={isScheduling}>
                {isScheduling ? 'Verificando...' : 'Confirmar Agendamento'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userAppointments.map((appt) => (
          <Card key={appt.id} className="overflow-hidden">
            <div className="h-2 w-full bg-primary/20"></div>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <Badge
                  variant={appt.status === 'confirmada' ? 'default' : 'secondary'}
                  className={appt.status === 'confirmada' ? 'bg-emerald-500' : ''}
                >
                  {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                </Badge>
                {appt.calendarSynced && (
                  <span
                    className="text-xs text-muted-foreground flex items-center gap-1"
                    title="Sincronizado com calendário externo"
                  >
                    <CalendarIcon className="w-3 h-3" /> Sync
                  </span>
                )}
              </div>
              <CardTitle className="text-lg mt-2">{appt.type}</CardTitle>
              <CardDescription className="text-slate-900 font-medium">
                {appt.professionalName}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm space-y-3">
              <div className="flex items-center text-slate-600 gap-2">
                <CalendarIcon className="w-4 h-4 text-slate-400" />
                {format(new Date(appt.date), "dd 'de' MMMM, yyyy", { locale: ptBR })}
              </div>
              <div className="flex items-center text-slate-600 gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                {format(new Date(appt.date), 'HH:mm')}
              </div>
              <div className="flex items-center text-slate-600 gap-2">
                <Video className="w-4 h-4 text-slate-400" />
                Telemedicina (Link enviado por email)
              </div>
            </CardContent>
            <CardFooter className="bg-slate-50 border-t pt-4">
              <Button variant="outline" className="w-full text-xs" size="sm">
                <ExternalLink className="w-3 h-3 mr-2" /> Abrir no Calendário
              </Button>
            </CardFooter>
          </Card>
        ))}
        {userAppointments.length === 0 && (
          <div className="col-span-full py-12 text-center border-2 border-dashed rounded-xl border-slate-200 text-slate-500">
            <CalendarIcon className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <p className="text-lg font-medium">Nenhuma consulta agendada</p>
            <p className="text-sm mt-1">Clique em "Agendar Consulta" para marcar um horário.</p>
          </div>
        )}
      </div>
    </div>
  )
}
