import { Button } from '@/components/ui/button'
import { FileText } from 'lucide-react'
import { Link } from 'react-router-dom'

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-6 h-6 text-primary" />
          <span className="font-bold text-xl">Dr. Exames</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <a href="#" className="hover:text-primary transition-colors">
            Recursos
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            Preços
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            Testemunhos
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            FAQ
          </a>
        </nav>
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link to="/">Login</Link>
          </Button>
          <Button
            onClick={() =>
              document.getElementById('lead-form-section')?.scrollIntoView({ behavior: 'smooth' })
            }
          >
            Teste Gratuito
          </Button>
        </div>
      </div>
    </header>
  )
}
