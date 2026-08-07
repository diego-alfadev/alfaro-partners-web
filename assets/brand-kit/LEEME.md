# Alfaro & Partners · Kit de marca

**Esta carpeta es la fuente.** Todo lo demás —flyers, tarjetas, vídeos, la web— se deriva de aquí.

Si solo vas a leer una cosa: **fondo azul muy oscuro, texto casi blanco, dorado solo para lo que importa.**

```
brand-kit/
├── logos/          → logotipo vectorial (SVG, PDF, .ai original)
├── paleta/         → colores (.ase para Adobe, .json, tabla)
├── tipografias/    → las dos fuentes y sus licencias
└── LEEME.md        → esto
```

> Aquí **no** hay flyers, tarjetas ni fotos de piezas impresas. Eso vive en el
> Drive compartido, en `Finales Alfaro&Partners`. Esta carpeta es solo lo que
> hace falta para *crear* una pieza nueva.

---

## Logotipo

El logotipo es **dibujo, no texto**. No se vuelve a escribir a mano, se coloca el archivo. Está vectorizado: no depende de que ninguna fuente esté instalada y se escala a cualquier tamaño sin perder nitidez.

| Archivo | Cuándo |
|---|---|
| `alfaro-partners-azul.svg` | Sobre fondo claro · digital |
| `alfaro-partners-blanco.svg` | Sobre fondo oscuro · digital |
| `alfaro-partners-monocromo.svg` | Hereda el color del contexto (`currentColor`). Para web y para cuando haga falta el logo en un color puntual |
| `alfaro-partners-azul.pdf` / `-blanco.pdf` | Imprenta |
| `alfaro-partners-original.ai` | Original de Illustrator. **No lo uses para maquetar** — es de donde salen los demás |

Los SVG llevan el color como atributo `fill` en la raíz, sin hojas de estilo internas: se pueden incrustar en HTML sin que se pisen estilos.

### Área de respiración

Alrededor del logotipo tiene que quedar espacio vacío. Se mide con la letra **A** del propio logotipo:

- **X** = altura de la A, de la base a la punta
- **1X** a izquierda y derecha
- **0,5X** arriba y abajo

Ese espacio no lo invade nada: ni una foto, ni un texto, ni un borde.

### Qué no hacer

- No lo estires ni lo comprimas — al escalar, proporción bloqueada
- No le cambies el color fuera de las versiones de arriba
- No lo pongas sobre una foto con detalle donde se pierda
- No lo rehagas escribiendo el nombre con una fuente parecida
- No separes el nombre de "REPRESENTACIÓN INMOBILIARIA"

---

## Color

El azul de la marca es **`#0D1322`**. Está tomado del logotipo vectorial, que es la única fuente fiable — los PNG arrastran desviaciones de compresión.

Los demás azules son variaciones para dar profundidad: una tarjeta algo más clara sobre el fondo, una línea divisoria, un pie más oscuro. No hace falta usarlos todos.

El **dorado `#C9A44A`** es el acento y funciona porque se usa poco: un botón, una palabra, una línea fina. Repartido por todas partes deja de significar nada.

Los colores de estado (verde, ámbar, rojo) son avisos de interfaz. No son colores de marca — no los uses en una pieza gráfica.

Tabla completa en `paleta/paleta.md`. Para Illustrator, Photoshop o InDesign: doble clic en `paleta/alfaro-partners.ase` y aparecen agrupados en la biblioteca de muestras.

**Sobre el CMYK:** es orientativo, convertido sin perfil de color. Al impresor se le manda el **HEX o el RGB** y convierte él con el perfil de su máquina. Si le mandas el CMYK de la tabla, el azul saldrá distinto.

---

## Tipografía

**Libre Baskerville** — titulares. Serif editorial, con carácter. La cursiva es especialmente buena para destacar una palabra dentro de un titular.

**Satoshi** — todo lo demás: textos, pies, botones, etiquetas. Neutra a propósito.

Regla práctica: **si es grande, Baskerville; si hay que leerlo, Satoshi.**

Las etiquetas pequeñas en mayúsculas con mucho espaciado entre letras (`REPRESENTACIÓN INMOBILIARIA PREMIUM`) son un recurso de la marca, no un accidente. Van en Satoshi.

Instalación y licencias: `tipografias/LEEME.md`.

> **Ojo.** El logotipo está compuesto en Times New Roman, que **no** es la tipografía de la marca. Es normal: un logotipo se congela cuando se dibuja. No maquetes una pieza en Times "para que pegue con el logo" — usa Libre Baskerville y Satoshi.

---

## Para programadores

La definición viva está en **`src/styles/tokens.css`**, no aquí. Ese archivo es lo que construye la web: rampa de color, escala tipográfica, espaciado, hairlines, sombras, easings y z-index.

Los archivos de esta carpeta se derivan de él. Si cambia un color:

1. Se cambia en `tokens.css`
2. Se regeneran `paleta/*` desde ahí
3. Se vuelve a exportar la copia del Drive

En ese orden y solo en ese orden. `tokens.css` manda.

La rampa de azules está derivada en OKLab a partir de `#0D1322`, conservando los saltos de luminancia. No inventes escalones nuevos a ojo: si hace falta uno, se deriva con la misma fórmula.

Y para ver cómo se combina todo —cuánto aire, cómo cae el dorado sobre el azul, qué tamaño tiene un titular— la referencia es **alfaropartners.es**. Está construida exactamente con esto.
