# Alfaro & Partners · Kit de marca

**Abre primero [`escaparate.html`](escaparate.html)** — doble clic. Es esta misma
información, pero renderizada con los archivos reales de la carpeta.

Esto de aquí es la versión en texto, para consultar rápido.

---

## Lo mínimo que hay que saber

Fondo azul muy oscuro. Texto casi blanco. **Oro solo para una cosa por pieza.**

| | |
|---|---|
| Azul | `#0D1322` |
| Off-white | `#EEECEB` |
| Oro | `#C9A44A` |
| Titulares | Libre Baskerville |
| Textos | Satoshi |

---

## Qué hay aquí

```
logos/         logotipo vectorial
paleta/        colores (.ase, .json, tabla)
tipografias/   las dos fuentes y sus licencias
escaparate.html
```

Aquí **no** hay flyers, tarjetas ni fotos de piezas impresas. Eso está en el Drive
compartido, en `Finales Alfaro&Partners`. Esta carpeta es solo lo necesario para
*crear* algo nuevo.

---

## Logotipo

Es **dibujo, no texto**. No se reescribe a mano: se coloca el archivo. Está
vectorizado, así que no depende de ninguna fuente instalada.

| Archivo | Cuándo |
|---|---|
| `alfaro-partners-azul.svg` | Fondo claro · digital |
| `alfaro-partners-blanco.svg` | Fondo oscuro · digital |
| `alfaro-partners-oro.svg` | Solo estampación dorada en imprenta — ver abajo |
| `alfaro-partners-monocromo.svg` | Hereda el color del contexto (`currentColor`) |
| `*.pdf` | Imprenta |
| `alfaro-partners-original.ai` | Original. De aquí salen los demás — no maquetes con él |

### Área de respiración

**X** = altura de la letra A del logotipo.
**1X** a los lados · **0,5X** arriba y abajo.

Ese hueco no lo pisa nada: ni foto, ni texto, ni borde. El diagrama está en el
escaparate.

### Sobre la versión en oro

Existe, pero **no es la versión principal**. Su sitio es la estampación en caliente
sobre papel — carpeta, tarjeta, sobre. Ahí es donde el oro tiene sentido físico.

En pantalla, el logo va en blanco o en azul. Si el logotipo es dorado, el oro deja
de ser el acento que señala lo importante y pasa a ser el color de fondo de la
marca. Y entonces ya no señala nada.

### Qué no hacer

- Estirarlo o comprimirlo (al escalar, proporción bloqueada)
- Recolorearlo fuera de las versiones de arriba
- Rehacer el nombre escribiéndolo con una fuente parecida
- Separar el nombre de «Representación inmobiliaria»
- Ponerlo sobre una foto con detalle donde se pierda

---

## Color

El azul sale del logotipo vectorial, que es la única fuente fiable: los PNG
arrastran desviaciones de compresión.

Los demás azules son variaciones para dar profundidad — una tarjeta algo más clara
sobre el fondo, una línea, un pie más oscuro. No hace falta usarlos todos.

Los colores de estado (verde, ámbar, rojo) son avisos de interfaz. **No son colores
de marca**: no los uses en una pieza gráfica.

**Adobe:** doble clic en `paleta/alfaro-partners.ase` y aparecen agrupados en la
biblioteca de muestras. Tabla completa en `paleta/paleta.md`.

**Imprenta:** manda el HEX o el RGB y que el impresor convierta con el perfil de su
máquina. El CMYK de la tabla es orientativo; si se lo mandas tal cual, el azul
saldrá distinto.

---

## Tipografía

**Si es grande, Baskerville. Si hay que leerlo, Satoshi.**

- **Libre Baskerville** — titulares. Está en `tipografias/`, se instala con doble clic.
- **Satoshi** — textos, botones, etiquetas. Hay que descargarla:
  [fontshare.com/fonts/satoshi](https://www.fontshare.com/fonts/satoshi) *(su licencia
  no permite que la repartamos nosotros).*

Las etiquetas pequeñas en mayúsculas muy espaciadas son un recurso de la marca, no
un accidente. Van en Satoshi.

Detalle e instalación: `tipografias/LEEME.md`.

> **Ojo.** El logotipo está compuesto en Times New Roman, que **no** es la tipografía
> de la marca. Un logotipo se congela cuando se dibuja. No maquetes una pieza en
> Times para que pegue con el logo — usa Libre Baskerville y Satoshi.

---

## Para programadores

La definición viva es **`src/styles/tokens.css`** del repositorio de la web, no esta
carpeta. Ahí están la rampa de color, la escala tipográfica, el espaciado, hairlines,
sombras, easings y z-index.

Los archivos de aquí se derivan de ese fichero. Si cambia un color:

1. Se cambia en `tokens.css`
2. Se regeneran `paleta/*`
3. Se vuelve a exportar la copia del Drive

En ese orden. **`tokens.css` manda.**

La rampa de azules está derivada en OKLab desde `#0D1322`, conservando los saltos de
luminancia. Si hace falta un escalón nuevo, se deriva con la misma fórmula — no se
inventa a ojo.

Referencia viva: **alfaropartners.es**, construida exactamente con esto.
