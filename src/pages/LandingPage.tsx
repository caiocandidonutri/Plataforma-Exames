import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getLandingPageVariation } from '@/services/leads'
import { HeroSection } from '@/components/landing/HeroSection'
import { BenefitsSection } from '@/components/landing/BenefitsSection'
import { PricingSection } from '@/components/landing/PricingSection'
import { TestimonialsSection } from '@/components/landing/TestimonialsSection'
import { FaqSection } from '@/components/landing/FaqSection'
import { LeadForm } from '@/components/landing/LeadForm'
import { LandingHeader } from '@/components/landing/LandingHeader'
import { LandingFooter } from '@/components/landing/LandingFooter'
import { trackEvent } from '@/lib/analytics'

export default function LandingPage() {
  const [searchParams] = useSearchParams()
  const variacao = searchParams.get('variacao') || 'geral'
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    trackEvent('page_view', { page: 'landing_page', variacao })
    getLandingPageVariation(variacao).then((res) => {
      if (res) setData(res)
      else getLandingPageVariation('geral').then(setData)
    })
  }, [variacao])

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <LandingHeader />
      <main className="flex-1">
        <HeroSection data={data} />
        <BenefitsSection data={data} />
        <PricingSection />
        <TestimonialsSection />
        <FaqSection />
        <div id="lead-form-section" className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 max-w-5xl flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1 space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Pronto para transformar sua prática?
              </h2>
              <p className="text-lg text-muted-foreground">
                Comece seu teste gratuito agora e experimente o poder da análise automática de
                exames.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <span className="text-primary text-xl">✓</span> Análise em 5 minutos
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary text-xl">✓</span> Sem cartão de crédito
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary text-xl">✓</span> Cancelamento fácil
                </li>
              </ul>
            </div>
            <div className="flex-1 w-full">
              <LeadForm variacaoId={data?.id} />
            </div>
          </div>
        </div>
      </main>
      <LandingFooter />
    </div>
  )
}
