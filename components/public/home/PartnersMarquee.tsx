export function PartnersMarquee() {
  // In a real app, these would be actual partner logos
  const partners = [
    "UNICEF", "World Health Organization", "Oxfam", "USAID", 
    "Ford Foundation", "Save the Children", "Red Cross", "Local Govt"
  ]

  return (
    <section className="overflow-hidden border-y border-black/5 bg-white py-10">
      <div className="mx-auto max-w-6xl px-4 md:px-8 mb-6 text-center text-sm font-semibold uppercase tracking-wider text-brand-muted">
        Trusted by our global and local partners
      </div>
      
      <div className="relative flex w-full overflow-hidden">
        {/* CSS Marquee */}
        <div className="flex w-max animate-[marquee_20s_linear_infinite] md:w-full md:animate-none md:flex-wrap md:justify-center md:gap-12">
          <div className="flex shrink-0 gap-12 px-6 md:w-auto md:shrink md:justify-center md:gap-12 md:px-0">
            {partners.map((partner, idx) => (
              <div 
                key={`p1-${idx}`} 
                className="flex items-center justify-center font-heading text-xl font-bold text-gray-400 grayscale transition-all hover:text-brand-primary hover:grayscale-0 whitespace-nowrap"
              >
                {partner}
              </div>
            ))}
          </div>
          <div className="flex shrink-0 gap-12 px-6 md:hidden">
            {partners.map((partner, idx) => (
              <div 
                key={`p2-${idx}`} 
                className="flex items-center justify-center font-heading text-xl font-bold text-gray-400 grayscale transition-all hover:text-brand-primary hover:grayscale-0 whitespace-nowrap"
              >
                {partner}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// Add this to globals.css later:
// @keyframes marquee {
//   0% { transform: translateX(0); }
//   100% { transform: translateX(-50%); }
// }
