"use client"

import { useTranslations } from 'next-intl'
import { Badge } from '../atoms/Badge'
import { TestimonialCard } from '../molecules/TestimonialCard'

export function TestimonialsSection() {
  const t = useTranslations('home')

  const testimonials = [
    {
      name: t('testimonials.testimonial1.name'),
      role: t('testimonials.testimonial1.role'),
      content: t('testimonials.testimonial1.content'),
      rating: 5
    },
    {
      name: t('testimonials.testimonial2.name'),
      role: t('testimonials.testimonial2.role'),
      content: t('testimonials.testimonial2.content'),
      rating: 5
    },
    {
      name: t('testimonials.testimonial3.name'),
      role: t('testimonials.testimonial3.role'),
      content: t('testimonials.testimonial3.content'),
      rating: 5
    }
  ]

  return (
    <section
      className="py-16 lg:py-24 bg-gray-50/50"
      data-testid="home-testimonials-section"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge
            className="mb-4 bg-vitalgo-green/10 text-vitalgo-green"
            data-testid="home-testimonials-badge"
          >
            {t('testimonials.badge')}
          </Badge>
          <h2
            className="text-3xl lg:text-4xl font-light text-gray-900 mb-4"
            data-testid="home-testimonials-title"
          >
            {t('testimonials.title')}
          </h2>
          <p
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            data-testid="home-testimonials-description"
          >
            {t('testimonials.description')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  )
}
