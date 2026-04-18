import { Bell, Search, UserCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import useAppStore from '@/stores/use-app-store'

export function Header() {
  const { currentUser, setCurrentUser } = useAppStore()

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between px-4 glass-header shadow-sm">
      <div className="flex items-center gap-4 flex-1">
        <SidebarTrigger />
        <div className="relative w-full max-w-md hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar pacientes ou exames..."
            className="w-full bg-muted/50 pl-9 rounded-full border-transparent focus-visible:bg-background transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground hover:text-foreground"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-rose-500 border border-background"></span>
        </Button>
        <div className="h-8 w-px bg-border mx-1"></div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="gap-2 pl-2 pr-3 text-muted-foreground hover:text-foreground"
            >
              <UserCircle className="h-6 w-6" />
              <span className="text-sm font-medium hidden sm:inline-block">
                {currentUser.name} ({currentUser.plan === 'pro' ? 'Pro' : 'Basic'})
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Alternar Usuário (Teste)</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setCurrentUser('PT-001')}>
              Maria Silva (Pro)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setCurrentUser('PT-002')}>
              João Santos (Basic)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
