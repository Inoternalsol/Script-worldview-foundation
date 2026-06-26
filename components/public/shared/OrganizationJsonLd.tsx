export function OrganizationJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'NGO',
    name: 'Script Worldview Foundation',
    alternateName: 'SWF',
    url: 'https://scriptworldviewfoundation.org',
    logo: 'https://scriptworldviewfoundation.org/logo.png',
    description:
      'A faith-inspired Nigerian NGO advancing education, humanitarian response, community development, and youth empowerment across Plateau State and Nigeria since 2016.',
    foundingDate: '2016',
    areaServed: {
      '@type': 'Country',
      name: 'Nigeria',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Jos',
      addressRegion: 'Plateau State',
      addressCountry: 'NG',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'General',
      email: 'hello@scriptworldviewfoundation.org',
    },
    sameAs: [
      'https://www.facebook.com/scriptworldviewfoundation',
      'https://twitter.com/scriptworldview',
      'https://www.instagram.com/scriptworldviewfoundation',
      'https://www.linkedin.com/company/scriptworldviewfoundation',
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
