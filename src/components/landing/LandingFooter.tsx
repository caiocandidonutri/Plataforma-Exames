import { FileText, Instagram, Linkedin, Twitter } from 'lucide-react'

export function LandingFooter() {
  return (
    <footer className="bg-muted py-12 border-t">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="w-6 h-6 text-primary" />
              <span className="font-bold text-xl">Dr. Exames</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Inteligência e precisão para transformar o acompanhamento clínico.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Produto</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary">
                  Recursos
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">
                  Preços
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">
                  Para Nutricionistas
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">
                  Para Médicos
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Suporte</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">
                  Contato
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">
                  Tutorial
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary">
                  Termos de Uso
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">
                  Política de Privacidade
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">
                  LGPD
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© 2026 Dr. Exames. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
