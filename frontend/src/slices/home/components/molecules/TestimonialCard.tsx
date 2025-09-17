import { Star } from 'lucide-react'
import { Card, CardContent } from '../atoms/Card'

interface TestimonialCardProps {
  name: string
  role: string
  content: string
  rating: number
}

export function TestimonialCard({ name, role, content, rating }: TestimonialCardProps) {
  return (
    <Card className="h-full" data-testid="home-testimonial-card">
      <CardContent className="p-6">
        <div className="flex items-center mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
              }`}
              data-testid={`home-testimonial-star-${i}`}
            />
          ))}
        </div>
        <p
          className="text-gray-600 mb-4 leading-relaxed"
          data-testid="home-testimonial-content"
        >
          &ldquo;{content}&rdquo;
        </p>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <span
              className="text-sm font-medium text-gray-600"
              data-testid="home-testimonial-initials"
            >
              {name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </span>
          </div>
          <div>
            <div
              className="font-medium text-gray-900"
              data-testid="home-testimonial-name"
            >
              {name}
            </div>
            <div
              className="text-sm text-gray-500"
              data-testid="home-testimonial-role"
            >
              {role}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}