import { Card, CardContent } from '@/components/ui/card'
import { Star } from 'lucide-react'

export function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Dra. Ana Silva',
      role: 'Nutricionista Esportiva',
      text: 'Reduzi o tempo de análise de laudos em 80%. A ferramenta de geração de PDF encanta meus pacientes.',
      img: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=1',
    },
    {
      name: 'Dr. Carlos Mendes',
      role: 'Endocrinologista',
      text: 'Os alertas de urgência automáticos me ajudam a priorizar casos críticos rapidamente. Indispensável na minha clínica.',
      img: 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=2',
    },
    {
      name: 'Dra. Mariana Costa',
      role: 'Nutricionista Funcional',
      text: 'A comunicação integrada via WhatsApp facilitou muito o acompanhamento pós-consulta.',
      img: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=3',
    },
  ]

  return (
    <section className="py-20 bg-muted/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">O que dizem os profissionais</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <Card key={i} className="bg-card">
              <CardContent className="pt-6 space-y-4">
                <div className="flex gap-1 text-yellow-400">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground italic">"{t.text}"</p>
                <div className="flex items-center gap-4 pt-4">
                  <img src={t.img} alt={t.name} className="w-12 h-12 rounded-full border" />
                  <div>
                    <p className="font-semibold">{t.name}</p>
                    <p className="text-sm text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
