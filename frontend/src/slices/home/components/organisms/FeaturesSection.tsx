"use client"

import { FileText, QrCode, Clock, Shield, Stethoscope, Smartphone } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Badge } from '../atoms/Badge'
import { FeatureCard } from '../molecules/FeatureCard'

export function FeaturesSection() {
  const t = useTranslations('home')

  const features = [
    {
      icon: <FileText className="h-6 w-6 text-vitalgo-green" />,
      title: t('features.feature1.title'),
      description: t('features.feature1.description'),
      badge: t('features.feature1.badge')
    },
    {
      icon: <QrCode className="h-6 w-6 text-vitalgo-green" />,
      title: t('features.feature2.title'),
      description: t('features.feature2.description'),
      badge: t('features.feature2.badge')
    },
    {
      icon: <Clock className="h-6 w-6 text-vitalgo-green" />,
      title: t('features.feature3.title'),
      description: t('features.feature3.description')
    },
    {
      icon: <Shield className="h-6 w-6 text-vitalgo-green" />,
      title: t('features.feature4.title'),
      description: t('features.feature4.description')
    },
    {
      icon: <Stethoscope className="h-6 w-6 text-vitalgo-green" />,
      title: t('features.feature5.title'),
      description: t('features.feature5.description')
    },
    {
      icon: <Smartphone className="h-6 w-6 text-vitalgo-green" />,
      title: t('features.feature6.title'),
      description: t('features.feature6.description')
    }
  ]

  return (
    <section
      className="py-16 lg:py-24 bg-gray-50/50"
      data-testid="home-features-section"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge
            className="mb-4 bg-vitalgo-green/10 text-vitalgo-green"
            data-testid="home-features-badge"
          >
            {t('features.badge')}
          </Badge>
          <h2
            className="text-3xl lg:text-4xl font-light text-gray-900 mb-4"
            data-testid="home-features-title"
          >
            {t('features.title')}
          </h2>
          <p
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            data-testid="home-features-description"
          >
            {t('features.description')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  )
}
