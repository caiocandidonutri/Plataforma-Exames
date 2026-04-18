import { useState } from 'react'
import { Send, Check, CheckCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

export function WhatsAppHistory({
  patientId,
  professionalName,
}: {
  patientId: string
  professionalName: string
}) {
  const { toast } = useToast()
  const [messages, setMessages] = useState([
    {
      id: 1,
      remetente: 'paciente',
      conteudo: 'Olá, quando sai meu resultado?',
      time: '10:00',
      status: 'lido',
    },
    {
      id: 2,
      remetente: 'profissional',
      conteudo: `Boa tarde! O laudo já está disponível no sistema. Acesse a plataforma para visualizar.`,
      time: '14:30',
      status: 'lido',
    },
  ])
  const [newMessage, setNewMessage] = useState('')

  const handleSend = () => {
    if (!newMessage.trim()) return
    const msg = {
      id: Date.now(),
      remetente: 'profissional',
      conteudo: newMessage,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      status: 'enviado',
    }
    setMessages([...messages, msg])
    setNewMessage('')

    toast({
      title: 'Mensagem enviada',
      description: 'A mensagem foi enviada para o WhatsApp do paciente.',
      className:
        'bg-emerald-50 text-emerald-900 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-100',
    })

    // Simulate delivery (mocking webhook response)
    setTimeout(() => {
      setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, status: 'entregue' } : m)))
    }, 1500)
  }

  return (
    <div className="flex flex-col h-full border rounded-xl overflow-hidden bg-white dark:bg-slate-950 shadow-sm">
      <div className="p-4 border-b bg-emerald-50 dark:bg-emerald-950/20 flex items-center gap-3">
        <Avatar className="h-10 w-10 border border-emerald-200 dark:border-emerald-800">
          <AvatarFallback className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
            W
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold text-sm">WhatsApp (ID: {patientId})</h3>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>{' '}
            {professionalName} online
          </p>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4 bg-slate-50/50 dark:bg-slate-900/20">
        <div className="space-y-4">
          {messages.map((msg) => {
            const isMe = msg.remetente === 'profissional'
            return (
              <div
                key={msg.id}
                className={cn(
                  'flex flex-col max-w-[85%]',
                  isMe ? 'ml-auto items-end' : 'mr-auto items-start',
                )}
              >
                <div
                  className={cn(
                    'p-3 rounded-2xl text-sm shadow-sm',
                    isMe
                      ? 'bg-emerald-500 text-white rounded-tr-sm'
                      : 'bg-white border dark:bg-slate-800 rounded-tl-sm',
                  )}
                >
                  {msg.conteudo}
                </div>
                <div className="flex items-center gap-1 mt-1 px-1">
                  <span className="text-[10px] text-muted-foreground">{msg.time}</span>
                  {isMe &&
                    (msg.status === 'lido' ? (
                      <CheckCheck className="w-3 h-3 text-blue-500" />
                    ) : msg.status === 'entregue' ? (
                      <CheckCheck className="w-3 h-3 text-muted-foreground" />
                    ) : (
                      <Check className="w-3 h-3 text-muted-foreground" />
                    ))}
                </div>
              </div>
            )
          })}
        </div>
      </ScrollArea>

      <div className="p-3 border-t bg-white dark:bg-slate-950 flex gap-2 items-center">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Digite uma mensagem..."
          className="flex-1 bg-slate-50 dark:bg-slate-900"
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <Button
          onClick={handleSend}
          size="icon"
          className="bg-emerald-500 hover:bg-emerald-600 text-white shrink-0"
        >
          <Send className="w-4 h-4 ml-[-2px] mt-[2px]" />
        </Button>
      </div>
    </div>
  )
}
