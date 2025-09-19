# Manual de Marca y Estilo - VitalGo

## 📋 Índice

1. [Introducción](#introducción)
2. [Identidad de Marca](#identidad-de-marca)
3. [Paleta de Colores](#paleta-de-colores)
4. [Tipografía](#tipografía)
5. [Logotipos y Recursos Gráficos](#logotipos-y-recursos-gráficos)
6. [Componentes UI](#componentes-ui)
7. [Estilos y Sombras](#estilos-y-sombras)
8. [Espaciado y Layout](#espaciado-y-layout)
9. [Animaciones y Transiciones](#animaciones-y-transiciones)
10. [Temas y Modos](#temas-y-modos)
11. [Responsive Design](#responsive-design)
12. [Accesibilidad](#accesibilidad)

---

## 🌟 Introducción

VitalGo es una plataforma de salud digital que conecta pacientes con profesionales médicos. Este manual define los estándares visuales y de diseño que garantizan una experiencia coherente y profesional en toda la aplicación.

### Valores de Marca
- **Confianza**: Transmitir seguridad y profesionalismo en salud
- **Modernidad**: Interfaz limpia y tecnología de vanguardia
- **Accesibilidad**: Diseño inclusivo para todos los usuarios
- **Claridad**: Información médica presentada de forma comprensible

---

## 🎨 Identidad de Marca

### Nombre de la Marca
**VitalGo** - Representa vitalidad, salud y movimiento hacia el bienestar.

### Tono de Comunicación
- Profesional pero cercano
- Claro y directo
- Empático y comprensivo
- Informativo sin ser técnico

---

## 🎨 Paleta de Colores

### Colores Principales

#### Verde VitalGo (Color Primario)
```css
--vitalgo-green: #01EF7F        /* Verde principal oficial */
--vitalgo-green-light: #5AF4AC   /* Verde claro oficial */
--vitalgo-green-lighter: #99F9CC /* Verde más claro oficial */
--vitalgo-green-lightest: #CCFCE5 /* Verde muy claro oficial */
```

**Uso**: 
- Botones principales de acción
- Enlaces importantes
- Indicadores de éxito
- Elementos destacados

#### Azul Oscuro VitalGo (Color Secundario)
```css
--vitalgo-dark: #002C41          /* Azul oscuro principal oficial */
--vitalgo-dark-light: #406171    /* Azul medio oficial */
--vitalgo-dark-lighter: #99ABB3  /* Azul claro oficial */
--vitalgo-dark-lightest: #CCD5D9 /* Azul muy claro oficial */
```

**Uso**:
- Textos principales
- Headers y títulos
- Navegación
- Fondos profesionales

### Colores del Sistema

#### Colores Base (Modo Claro)
```css
--background: 0 0% 100%         /* Blanco puro */
--foreground: 222.2 84% 4.9%    /* Casi negro */
--card: 0 0% 100%               /* Blanco para tarjetas */
--card-foreground: 222.2 84% 4.9%
--popover: 0 0% 100%
--popover-foreground: 222.2 84% 4.9%
```

#### Colores Funcionales
```css
--primary: 142 76% 36%          /* Verde primario (HSL) */
--primary-foreground: 210 40% 98%
--secondary: 210 40% 96%        /* Gris azulado claro */
--secondary-foreground: 222.2 47.4% 11.2%
--muted: 210 40% 96%
--muted-foreground: 215.4 16.3% 46.9%
--accent: 210 40% 96%
--accent-foreground: 222.2 47.4% 11.2%
```

#### Colores de Estado
```css
--destructive: 0 84.2% 60.2%    /* Rojo para errores */
--destructive-foreground: 210 40% 98%
--border: 214.3 31.8% 91.4%     /* Bordes sutiles */
--input: 214.3 31.8% 91.4%      /* Campos de entrada */
--ring: 222.2 84% 4.9%          /* Focus ring */
```

### Modo Oscuro
El sistema soporta modo oscuro con inversión inteligente de colores manteniendo la legibilidad y el contraste adecuado.

---

## 📝 Tipografía

### Familia Tipográfica Principal

```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, 
             "Helvetica Neue", Arial, sans-serif;
```

Esta stack de fuentes garantiza:
- Renderizado nativo óptimo en cada plataforma
- Legibilidad superior en dispositivos médicos
- Consistencia cross-platform

### Tamaños y Jerarquía

#### Desktop
```css
h1 { font-size: 2.5rem; line-height: 3rem; }      /* 40px */
h2 { font-size: 2rem; line-height: 2.5rem; }      /* 32px */
h3 { font-size: 1.5rem; line-height: 2rem; }      /* 24px */
h4 { font-size: 1.25rem; line-height: 1.75rem; }  /* 20px */
body { font-size: 1rem; line-height: 1.5rem; }    /* 16px */
small { font-size: 0.875rem; line-height: 1.25rem; } /* 14px */
```

#### Mobile (Responsive)
```css
.text-responsive-xl { font-size: clamp(1.5rem, 4vw, 3rem); }
.text-responsive-lg { font-size: clamp(1.25rem, 3vw, 2rem); }
.text-responsive-md { font-size: clamp(1rem, 2.5vw, 1.5rem); }
```

### Pesos Tipográficos
- **Regular (400)**: Texto body, descripciones
- **Medium (500)**: Labels, subtítulos
- **Semibold (600)**: Títulos de sección
- **Bold (700)**: Headers principales

---

## 🖼️ Logotipos y Recursos Gráficos

### Archivos de Logo Disponibles

#### Logo Principal
- **SVG**: `/assets/images/logos/vitalgo-logo-official.svg`
- **PNG**: `/assets/images/logos/vitalgo-logo-official.png`
- **PNG Completo**: `/assets/images/logos/vitalgo-logo-complete.png`

#### Logo Horizontal
- **SVG**: `/assets/images/logos/vitalgo-logo-horizontal-official.svg`
- **PNG**: `/assets/images/logos/vitalgo-logo-horizontal.png`

#### Logotipos para Diferentes Fondos
- **Azul sobre fondo claro**: `/assets/images/logos/logoh-blue-light-background.png`
- **Verde sobre fondo oscuro**: `/assets/images/logos/logoh-green-dark-background.png`
- **Logo con marca**: `/assets/images/logos/logos-blue-light-background.png`

#### Icono/Isotipo
- **SVG**: `/assets/images/logos/vitalgo-icon-official.svg`
- **PNG**: `/assets/images/logos/vitalgo-icon-official.png`
- **Corazón SVG**: `/assets/images/icons/vitalgo-heart.svg`

#### Footer
- **SVG**: `/assets/images/logos/vitalgo-footer-logo.svg`
- **PNG**: `/assets/images/logos/vitalgo-footer-logo.png`

### Favicons y PWA
- **Favicon ICO**: `/favicon.ico`
- **Favicon 16x16**: `/favicon-16x16.png`
- **Favicon 32x32**: `/favicon-32x32.png`
- **Apple Touch Icon**: `/apple-touch-icon.png`
- **Android Chrome 192x192**: `/android-chrome-192x192.png`
- **Android Chrome 512x512**: `/android-chrome-512x512.png`

### Uso del Logo
- **Espacio mínimo**: Mantener un área de respeto equivalente a la altura de la "V" de VitalGo
- **Tamaño mínimo**: No menos de 24px de altura para el icono, 120px para el logo completo
- **Fondos**: Preferir fondos claros. En fondos oscuros, usar versión con suficiente contraste

---

## 🧩 Componentes UI

### Botones

#### Variantes
```tsx
variant: {
  default: "bg-primary text-primary-foreground hover:bg-primary/90",
  destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  ghost: "hover:bg-accent hover:text-accent-foreground",
  link: "text-primary underline-offset-4 hover:underline"
}
```

#### Tamaños
```tsx
size: {
  default: "h-10 px-4 py-2",    /* 40px altura */
  sm: "h-9 rounded-md px-3",     /* 36px altura */
  lg: "h-11 rounded-md px-8",    /* 44px altura */
  icon: "h-10 w-10"              /* 40x40px */
}
```

### Tarjetas (Cards)
- Border radius: `rounded-xl` (0.75rem)
- Sombras disponibles:
  - `shadow-sm`: Tarjetas sutiles
  - `shadow-lg`: Tarjetas destacadas
  - `shadow-2xl`: Modales y overlays

### Inputs y Formularios
- Border radius: `rounded-md` (0.375rem)
- Altura mínima: 44px en mobile (accesibilidad táctil)
- Font-size: 16px (previene zoom en iOS)
- Focus: Ring azul con `box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1)`

---

## 🎭 Estilos y Sombras

### Sistema de Sombras

```css
/* Sombra básica */
box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);

/* Sombra media */
box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);

/* Sombra grande */
box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);

/* Sombra extra grande */
box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);

/* Sombra focus */
box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
```

### Border Radius

```css
--radius: 0.5rem;                /* Radio base */
border-radius-lg: var(--radius);                  /* 0.5rem */
border-radius-md: calc(var(--radius) - 2px);      /* 0.375rem */
border-radius-sm: calc(var(--radius) - 4px);      /* 0.25rem */
border-radius-xl: 0.75rem;                        /* Tarjetas grandes */
border-radius-2xl: 1rem;                          /* Contenedores especiales */
border-radius-full: 9999px;                       /* Elementos circulares */
```

---

## 📐 Espaciado y Layout

### Sistema de Espaciado
Basado en incrementos de 4px (0.25rem):

```css
spacing-0: 0
spacing-1: 0.25rem  /* 4px */
spacing-2: 0.5rem   /* 8px */
spacing-3: 0.75rem  /* 12px */
spacing-4: 1rem     /* 16px */
spacing-5: 1.25rem  /* 20px */
spacing-6: 1.5rem   /* 24px */
spacing-8: 2rem     /* 32px */
spacing-10: 2.5rem  /* 40px */
spacing-12: 3rem    /* 48px */
spacing-16: 4rem    /* 64px */
```

### Container
```css
.container {
  center: true;
  padding: 2rem;
  screens: {
    2xl: 1400px
  }
}
```

### Grid Responsivo
```css
.responsive-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}
```

---

## ✨ Animaciones y Transiciones

### Transiciones Estándar
```css
transition-colors: 150ms;
transition-all: 200ms ease-out;
transition-shadow: 200ms;
```

### Animaciones Personalizadas

#### Accordion
```css
accordion-down: 0.2s ease-out
accordion-up: 0.2s ease-out
```

#### Gradient Animation
```css
@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.gradient-animate {
  background-size: 200% 200%;
  animation: gradient-shift 3s ease infinite;
}
```

### Scrollbar Personalizado
```css
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: #f8f9fa; }
::-webkit-scrollbar-thumb { 
  background: #d1d5db; 
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
```

---

## 🌓 Temas y Modos

### Modo Claro (Default)
- Fondos blancos y grises muy claros
- Texto oscuro de alto contraste
- Sombras sutiles para profundidad

### Modo Oscuro
- Fondos en tonos azul oscuro
- Texto claro para legibilidad
- Bordes más prominentes para delimitar áreas

### Implementación
```css
.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... resto de variables */
}
```

---

## 📱 Responsive Design

### Breakpoints
```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Desktop grande */
2xl: 1536px /* Desktop extra grande */
```

### Mobile First
- Diseño base optimizado para mobile
- Progressive enhancement para pantallas mayores
- Touch targets mínimos de 44x44px
- Safe area padding para dispositivos con notch

### Mejoras Mobile Específicas
```css
@media (max-width: 768px) {
  .container { padding: 1rem; }
  h1 { font-size: 1.875rem; }
  h2 { font-size: 1.5rem; }
  h3 { font-size: 1.25rem; }
  input, select, textarea { 
    min-height: 44px;
    font-size: 16px; /* Previene zoom iOS */
  }
}
```

---

## ♿ Accesibilidad

### Contraste de Color
- Ratio mínimo 4.5:1 para texto normal
- Ratio mínimo 3:1 para texto grande
- Ratio mínimo 3:1 para elementos interactivos

### Focus States
- Anillo de focus visible de 2px
- Color de contraste apropiado
- Nunca remover outline sin alternativa

### Motion Preferences
```css
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Semántica HTML
- Uso correcto de headers (h1-h6)
- Labels asociados a inputs
- Roles ARIA donde sea necesario
- Alt text en imágenes

---

## ⚙️ Configuración Técnica

### Tailwind CSS Configuration

El proyecto ya incluye la configuración oficial de colores VitalGo en `frontend/tailwind.config.ts`:

```typescript
colors: {
  // 🎨 COLORES OFICIALES DEL MANUAL DE MARCA
  "vitalgo-green": {
    DEFAULT: "#01EF7F", // Verde principal oficial
    light: "#5AF4AC", // Verde claro oficial
    lighter: "#99F9CC", // Verde más claro oficial
    lightest: "#CCFCE5", // Verde muy claro oficial
  },
  "vitalgo-dark": {
    DEFAULT: "#002C41", // Azul oscuro principal oficial
    light: "#406171", // Azul medio oficial
    lighter: "#99ABB3", // Azul claro oficial
    lightest: "#CCD5D9", // Azul muy claro oficial
  },
}
```

### Uso en Componentes

#### Correcto ✅
```tsx
<Button className="bg-vitalgo-green hover:bg-vitalgo-green/90 text-white">
  Acción Principal
</Button>

<div className="text-vitalgo-dark border-vitalgo-green/20">
  Contenido con colores oficiales
</div>
```

#### Incorrecto ❌
```tsx
<Button className="bg-green-500 hover:bg-green-600 text-white">
  Acción Principal
</Button>
```

### Assets Routing

Todos los assets están disponibles desde `/assets/` en la aplicación:

```tsx
// Logo principal
<img src="/assets/images/logos/vitalgo-logo-official.svg" alt="VitalGo" />

// Icono
<img src="/assets/images/logos/vitalgo-icon-official.svg" alt="VitalGo Icon" />

// Footer logo
<img src="/assets/images/logos/vitalgo-footer-logo.svg" alt="VitalGo" />
```

---

## 📋 Checklist de Implementación

### Para Desarrolladores
- [ ] Usar variables CSS para colores, nunca hardcodear
- [ ] Usar clases de Tailwind con colores VitalGo: `vitalgo-green`, `vitalgo-dark`
- [ ] Aplicar clases de Tailwind según el sistema definido
- [ ] Mantener consistencia en espaciados
- [ ] Probar en modo claro y oscuro
- [ ] Verificar accesibilidad con herramientas
- [ ] Optimizar para mobile first
- [ ] Usar los logos desde las rutas oficiales (`/assets/images/logos/`)
- [ ] Aplicar transiciones suaves en interacciones
- [ ] Implementar los colores oficiales VitalGo en lugar de `green-500` genérico

### Para Diseñadores
- [ ] Usar paleta de colores oficial
- [ ] Mantener jerarquía tipográfica
- [ ] Aplicar sistema de espaciado de 4px
- [ ] Diseñar con componentes reutilizables
- [ ] Considerar estados (hover, focus, disabled)
- [ ] Proporcionar assets en formatos SVG y PNG
- [ ] Documentar casos edge y excepciones

---

## 📞 Contacto y Soporte

Para consultas sobre el manual de marca o solicitudes de nuevos componentes, contactar al equipo de diseño de VitalGo.

---

## 🚀 Estado de Implementación

### ✅ Ya Implementado
- [x] Colores oficiales VitalGo en Tailwind config
- [x] Assets organizados en `/frontend/public/assets/`
- [x] Favicons y PWA icons
- [x] Estructura de componentes Atomic Design
- [x] Sistema de espaciado y grid responsivo

### 🔄 En Proceso
- [ ] Migración completa de `green-500` a `vitalgo-green`
- [ ] Actualización de todos los componentes a colores oficiales
- [ ] Implementación de modo oscuro completo

### 📋 Próximos Pasos
1. Ejecutar búsqueda global de `green-500` y reemplazar por `vitalgo-green`
2. Actualizar componentes de home page con colores oficiales
3. Validar contraste y accesibilidad con nuevos colores
4. Documentar casos especiales y excepciones

---

**Última actualización**: Septiembre 2025
**Versión**: 2.0.0
**Proyecto**: VitalGo Platform - `/Users/jsricop/dev-rq/projects/vitalgo-co`