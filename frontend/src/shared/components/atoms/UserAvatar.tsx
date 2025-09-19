"use client"

interface UserAvatarProps {
  name: string
  avatar?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function UserAvatar({ name, avatar, size = 'md', className = "" }: UserAvatarProps) {
  const sizeClasses = {
    sm: "h-6 w-6 text-xs",
    md: "h-8 w-8 text-sm",
    lg: "h-10 w-10 text-base"
  }

  const initials = name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className={`${sizeClasses[size]} rounded-full flex items-center justify-center bg-vitalgo-green text-white font-medium ${className}`}>
      {avatar ? (
        <img
          src={avatar}
          alt={`Avatar de ${name}`}
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  )
}