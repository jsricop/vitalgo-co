# Manual de Diseño - VitalGo

## 🎨 Identidad de Marca

### Valores de Marca
- **Confianza**: Transmitir seguridad y profesionalismo en salud
- **Modernidad**: Interfaz limpia y tecnología de vanguardia
- **Accesibilidad**: Diseño inclusivo para todos los usuarios
- **Claridad**: Información médica presentada de forma comprensible

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

---

## 📝 Tipografía

### Familia Tipográfica Principal
```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
             "Helvetica Neue", Arial, sans-serif;
```

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

### Pesos Tipográficos
- **Regular (400)**: Texto body, descripciones
- **Medium (500)**: Labels, subtítulos
- **Semibold (600)**: Títulos de sección
- **Bold (700)**: Headers principales

---

## 🧩 Componentes UI

### Botones

#### Tamaños
```css
default: "h-10 px-4 py-2"    /* 40px altura */
sm: "h-9 px-3"               /* 36px altura */
lg: "h-11 px-8"              /* 44px altura */
icon: "h-10 w-10"            /* 40x40px */
```

### Tarjetas (Cards)
- Border radius: 0.75rem
- Sombras sutiles para profundidad

### Inputs y Formularios
- Border radius: 0.375rem
- Altura mínima: 44px en mobile
- Font-size: 16px (previene zoom en iOS)

---

## 🎭 Estilos y Sombras

### Border Radius
```css
--radius: 0.5rem;                /* Radio base */
border-radius-md: 0.375rem       /* Campos de entrada */
border-radius-lg: 0.5rem         /* Botones */
border-radius-xl: 0.75rem        /* Tarjetas grandes */
border-radius-full: 9999px       /* Elementos circulares */
```

---

## 📐 Espaciado

### Sistema de Espaciado
Basado en incrementos de 4px:

```css
spacing-1: 0.25rem  /* 4px */
spacing-2: 0.5rem   /* 8px */
spacing-3: 0.75rem  /* 12px */
spacing-4: 1rem     /* 16px */
spacing-6: 1.5rem   /* 24px */
spacing-8: 2rem     /* 32px */
spacing-12: 3rem    /* 48px */
```

---

## ✨ Animaciones y Transiciones

### Transiciones Estándar
```css
transition-colors: 150ms;
transition-all: 200ms ease-out;
transition-shadow: 200ms;
```

---

## 📱 Responsive Design

### Breakpoints
```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Desktop grande */
```

### Mobile First
- Diseño base optimizado para mobile
- Touch targets mínimos de 44x44px
- Font-size mínimo de 16px en inputs

---

## ♿ Accesibilidad

### Contraste de Color
- Ratio mínimo 4.5:1 para texto normal
- Ratio mínimo 3:1 para texto grande
- Ratio mínimo 3:1 para elementos interactivos

### Focus States
- Anillo de focus visible de 2px
- Color de contraste apropiado

### Semántica HTML
- Uso correcto de headers (h1-h6)
- Labels asociados a inputs
- Alt text en imágenes

---

**Versión**: 2.1.0 - Guías de Diseño Esenciales