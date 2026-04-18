import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MessageCircle } from 'lucide-react'

const mockChats = [
  {
    id: 1,
    name: 'Maria Silva',
    lastMessage: 'Doutor, gostaria de tirar uma dúvida sobre a recomendação',
    time: '10:30',
    unread: true,
  },
  {
    id: 2,
    name: 'João Santos',
    lastMessage: 'Muito obrigado pela consulta!',
    time: 'Ontem',
    unread: false,
  },
  {
    id: 3,
    name: 'Ana Costa',
    lastMessage: 'Quando sai o resultado do meu exame?',
    time: 'Ontem',
    unread: true,
  },
  {
    id: 4,
    name: 'Carlos Ferreira',
    lastMessage: 'Ok, vou seguir a dieta recomendada.',
    time: '14/04',
    unread: false,
  },
]

export function WhatsAppConversations({ preview }: { preview?: boolean }) {
  const chats = preview ? mockChats.slice(0, 3) : mockChats

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-muted-foreground" />
          Conversas WhatsApp
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <Avatar>
                <AvatarImage src={`https://img.usecurling.com/ppl/thumbnail?seed=${chat.id}`} />
                <AvatarFallback>{chat.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="space-y-1 overflow-hidden">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm leading-none truncate">{chat.name}</p>
                  {chat.unread && (
                    <Badge className="bg-emerald-500 h-4 px-1.5 text-[10px] shrink-0">Novo</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate">{chat.lastMessage}</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0 ml-2">
              <span className="text-[10px] text-muted-foreground font-medium">{chat.time}</span>
              <Button
                size="sm"
                variant={chat.unread ? 'default' : 'secondary'}
                className="h-7 text-xs"
              >
                {chat.unread ? 'Responder' : 'Abrir'}
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
