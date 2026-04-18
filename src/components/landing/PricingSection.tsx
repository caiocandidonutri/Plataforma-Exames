import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export function PricingSection() {
  const plans = [
    {
      name: 'Básico',
      price: 'R$ 0/mês',
      desc: 'Gratuito, limitado',
      features: ['5 análises/mês', 'Relatório básico'],
    },
    {
      name: 'Pro',
      price: 'R$ 29,90/mês',
      desc: 'Completo para profissionais',
      features: [
        'Análises ilimitadas',
        'Relatórios Premium',
        'Histórico de 6 meses',
        'WhatsApp Integrado',
      ],
      highlight: true,
    },
    {
      name: 'Empresa',
      price: 'R$ 99,90/mês',
      desc: 'Para clínicas',
      features: ['Múltiplos profissionais', 'Dashboard gerencial', 'API de integração'],
    },
  ]

  return (
    <section className="py-20 container mx-auto px-4">
      <div className="text-center mb-16 space-y-4">
        <h2 className="text-3xl font-bold tracking-tight">Comparação de Planos</h2>
        <p className="text-muted-foreground text-lg">
          Escolha o plano ideal para o seu momento profissional.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {plans.map((plan, i) => (
          <Card
            key={i}
            className={plan.highlight ? 'border-primary shadow-lg md:scale-105 relative z-10' : ''}
          >
            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <p className="text-muted-foreground">{plan.desc}</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-4xl font-bold">{plan.price}</div>
              <ul className="space-y-2">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2">
                    <span className="text-primary">✓</span> {f}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                variant={plan.highlight ? 'default' : 'outline'}
                onClick={() => document.getElementById('lead-form-section')?.scrollIntoView()}
              >
                {plan.name === 'Básico' ? 'Criar Conta Grátis' : 'Começar Teste Gratuito'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}
