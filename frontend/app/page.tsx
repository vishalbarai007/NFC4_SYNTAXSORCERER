import { HeroSection } from "@/components/hero-section"
import { FeatureGrid } from "@/components/feature-grid"
import { TestimonialsSection } from "@/components/testimonials-section"
import { StatsSection } from "@/components/stats-section"
import { CTASection } from "@/components/cta-section"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import Galaxy from "@/components/Galaxy"
// import Galaxy from './Galaxy';

export default function HomePage() {
  return (
    // <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-800">
    <div className="min-h-screen bg-gradient-to-br bg-[#FFD700] dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-800">
      <Navigation />
      <main className="flex-1">
        {/* <div className="h-screen w-">
          <Galaxy
          mouseRepulsion={true}
          mouseInteraction={true}
          density={1.5}
          glowIntensity={0.5}
          saturation={0.8}
          hueShift={240}
        />
        </div> */}
        <HeroSection />
        <FeatureGrid />
        <StatsSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
