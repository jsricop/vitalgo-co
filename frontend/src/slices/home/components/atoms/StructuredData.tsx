import React from 'react'

export function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalOrganization",
    "name": "VitalGo",
    "alternateName": "VitalGo Colombia",
    "url": "https://vitalgo.co",
    "logo": "https://vitalgo.co/assets/images/logos/vitalgo-logo-official.svg",
    "description": "Plataforma líder en salud digital de Colombia. Unifica tu historial médico, reduce tiempos de urgencias 70% con IA, y optimiza la gestión clínica.",
    "foundingDate": "2024",
    "areaServed": {
      "@type": "Country",
      "name": "Colombia"
    },
    "serviceArea": {
      "@type": "Country",
      "name": "Colombia"
    },
    "medicalSpecialty": [
      "Emergency Medicine",
      "Internal Medicine",
      "Family Medicine",
      "Digital Health",
      "Telemedicine"
    ],
    "knowsAbout": [
      "Electronic Health Records",
      "Medical AI",
      "Emergency QR Codes",
      "Healthcare Interoperability",
      "Medical Data Security"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+57-800-VITALGO",
      "contactType": "customer service",
      "areaServed": "CO",
      "availableLanguage": "Spanish"
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "CO",
      "addressRegion": "Bogotá"
    },
    "sameAs": [
      "https://twitter.com/VitalGoColombia",
      "https://linkedin.com/company/vitalgo-colombia",
      "https://facebook.com/VitalGoColombia"
    ],
    "offers": {
      "@type": "Offer",
      "name": "Digital Health Platform",
      "description": "Comprehensive digital health record management with AI-powered emergency response",
      "category": "Medical Records Management",
      "areaServed": "Colombia"
    }
  }

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "VitalGo",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "Web Browser, iOS, Android",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "COP"
    },
    "featureList": [
      "Unified Medical Records",
      "Emergency QR Codes",
      "AI-Powered Triage",
      "Healthcare Professional Dashboard",
      "Offline PWA Functionality",
      "HIPAA Compliant Security"
    ],
    "screenshot": "https://vitalgo.co/assets/images/logos/vitalgo-logo-official.svg"
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webAppSchema),
        }}
      />
    </>
  )
}