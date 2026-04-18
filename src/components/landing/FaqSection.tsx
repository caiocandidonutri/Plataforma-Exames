import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export function FaqSection() {
  const faqs = [
    {
      q: 'Como funciona o teste gratuito?',
      a: 'Você terá acesso total ao plano Pro por 7 dias, sem precisar cadastrar cartão de crédito.',
    },
    {
      q: 'Posso integrar com meu calendário?',
      a: 'Sim, suportamos integração com Google Calendar e Outlook para sincronizar suas consultas.',
    },
    {
      q: 'Meus dados estão seguros?',
      a: 'Completamente. Utilizamos criptografia de ponta a ponta e seguimos todas as normas da LGPD.',
    },
    {
      q: 'Qual é o suporte disponível?',
      a: 'Oferecemos suporte por e-mail e WhatsApp em horário comercial para todos os assinantes.',
    },
    {
      q: 'Posso cancelar a qualquer momento?',
      a: 'Sim, não há fidelidade. Você pode cancelar sua assinatura com apenas um clique.',
    },
  ]

  return (
    <section className="py-20 container mx-auto px-4 max-w-3xl">
      <div className="text-center mb-12 space-y-4">
        <h2 className="text-3xl font-bold tracking-tight">Perguntas Frequentes</h2>
      </div>
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, i) => (
          <AccordionItem key={i} value={`item-${i}`}>
            <AccordionTrigger className="text-left text-lg">{faq.q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-base">{faq.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}
