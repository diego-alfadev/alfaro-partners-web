import base64, json, pathlib, re

K = pathlib.Path("/Users/diego/projects/NM/git/alfaro&partners/assets/brand-kit")

def b64(p):
    return base64.b64encode((K / p).read_bytes()).decode()

def svg(nombre, **attrs):
    d = (K / "logos" / nombre).read_text()
    d = re.sub(r'\srole="img"|\saria-label="[^"]*"', "", d)
    extra = " ".join(f'{k}="{v}"' for k, v in attrs.items())
    return d.replace("<svg ", f"<svg {extra} ", 1).strip()

paleta = json.loads((K / "paleta" / "paleta.json").read_text())

# ── proporciones del logotipo ─────────────────────────────────────────────
# Se leen del kit, no se copian aquí: si el logotipo cambia, se regenera
# geometria.json y el diagrama de respiración se ajusta solo.
geo = json.loads((K / "logos" / "geometria.json").read_text())
ratio_alto = geo["viewBoxAlto"] / geo["viewBoxAncho"]
x_sobre_alto = geo["alturaA"] / geo["viewBoxAlto"]

def grupo_color(titulo, colores):
    fichas = "".join(f"""
        <figure class="ficha">
          <div class="muestra" style="background:{hexv}"></div>
          <figcaption><b>{nombre.split(' · ')[0]}</b><code>{hexv.upper()}</code>
          <span>{nombre.split(' · ')[1] if ' · ' in nombre else ''}</span></figcaption>
        </figure>""" for nombre, hexv in colores.items())
    return f'<h3>{titulo}</h3><div class="rejilla-color">{fichas}</div>'

html = f"""<!doctype html>
<html lang="es">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Alfaro &amp; Partners · Kit de marca</title>
<link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap">
<style>
@font-face {{
  font-family:'Libre Baskerville'; font-style:normal; font-weight:400 700; font-display:swap;
  src:local('Libre Baskerville'), url(data:font/ttf;base64,{b64('tipografias/libre-baskerville/LibreBaskerville[wght].ttf')}) format('truetype');
}}
@font-face {{
  font-family:'Libre Baskerville'; font-style:italic; font-weight:400 700; font-display:swap;
  src:local('Libre Baskerville Italic'), url(data:font/ttf;base64,{b64('tipografias/libre-baskerville/LibreBaskerville-Italic[wght].ttf')}) format('truetype');
}}
:root {{
  --navy:#0d1322; --navy-800:#12182a; --navy-700:#192236; --navy-600:#222b43;
  --off:#eeeceb; --mist:#b8bdc7; --quill:#6e7686;
  --oro:#c9a44a; --oro-claro:#efdc9a; --oro-hondo:#8a6e2f;
  --serif:'Libre Baskerville',Baskerville,'Times New Roman',serif;
  --sans:'Satoshi','Segoe UI',Helvetica,Arial,sans-serif;
  --ancho:1080px;
}}
*{{box-sizing:border-box}}
body{{margin:0;background:var(--navy);color:var(--off);font-family:var(--sans);
     font-size:16px;line-height:1.65;-webkit-font-smoothing:antialiased}}
.envoltorio{{max-width:var(--ancho);margin:0 auto;padding:0 clamp(1.5rem,4vw,3rem)}}
section{{padding:clamp(3rem,7vw,6rem) 0;border-top:1px solid rgba(238,236,235,.1)}}
section:first-of-type{{border-top:0}}

h1,h2,h3{{font-family:var(--serif);font-weight:400;margin:0}}
h1{{font-size:clamp(2rem,5vw,3.4rem);line-height:1.1}}
h2{{font-size:clamp(1.5rem,3vw,2.2rem);margin-bottom:.4em}}
h3{{font-size:1.15rem;margin:2.5rem 0 1rem;color:var(--oro-claro)}}
p{{max-width:62ch;color:var(--mist)}}
code{{font-family:ui-monospace,Menlo,monospace;font-size:.8em;letter-spacing:.04em}}
.cejilla{{font-size:.68rem;letter-spacing:.42em;text-transform:uppercase;
        color:var(--oro);margin-bottom:1.5rem}}
.nota{{border-left:2px solid var(--oro);padding:.2rem 0 .2rem 1rem;
      color:var(--mist);font-size:.92rem;max-width:62ch}}

/* ── portada ─────────────────────────────────────────────── */
.portada{{padding:clamp(3rem,9vw,7rem) 0 clamp(2rem,5vw,4rem)}}
.portada svg{{width:min(420px,80%);height:auto;display:block;margin-bottom:2.5rem}}

/* ── logotipo ────────────────────────────────────────────── */
.lienzo{{padding:clamp(2rem,5vw,3.5rem);display:grid;place-items:center;margin-bottom:.75rem}}
.lienzo svg{{width:min(360px,90%);height:auto}}
.lienzo--oscuro{{background:var(--navy-800)}}
.lienzo--claro{{background:var(--off)}}
.lienzo--oro{{background:var(--navy-800);color:var(--oro)}}
.par{{display:grid;gap:1.5rem;grid-template-columns:repeat(auto-fit,minmax(260px,1fr))}}
.pie{{font-size:.8rem;color:var(--quill);margin:0}}
.pie b{{color:var(--off);font-weight:500}}

/* respiración: X = altura de la A; 1X a los lados, 0,5X arriba y abajo */
.respiracion{{--w:340px;background:var(--navy-800);display:grid;place-items:center;
             padding:3.5rem;margin-top:1rem}}
.caja-aire{{--alto:calc(var(--w) * {ratio_alto:.5f});--x:calc(var(--alto) * {x_sobre_alto:.5f});
           padding:calc(var(--x) * .5) var(--x);outline:1px dashed rgba(201,164,74,.55);
           position:relative}}
.caja-aire svg{{width:var(--w);height:auto;display:block;outline:1px dashed rgba(238,236,235,.28)}}
.marca-x{{position:absolute;font-size:.62rem;letter-spacing:.14em;color:var(--oro);
         font-family:ui-monospace,monospace}}
.marca-x.lat{{left:.35rem;top:50%;transform:translateY(-50%)}}
.marca-x.lat2{{right:.35rem;top:50%;transform:translateY(-50%)}}
.marca-x.arr{{top:.15rem;left:50%;transform:translateX(-50%)}}
.marca-x.aba{{bottom:.15rem;left:50%;transform:translateX(-50%)}}

/* ── color ───────────────────────────────────────────────── */
.rejilla-color{{display:grid;gap:1rem;grid-template-columns:repeat(auto-fill,minmax(150px,1fr))}}
.ficha{{margin:0}}
.muestra{{height:78px;border:1px solid rgba(238,236,235,.14)}}
figcaption{{font-size:.78rem;line-height:1.5;padding-top:.55rem;color:var(--quill)}}
figcaption b{{display:block;color:var(--off);font-weight:500}}
figcaption code{{color:var(--oro)}}
figcaption span{{display:block}}

/* ── tipografía ──────────────────────────────────────────── */
.espec{{border-top:1px solid rgba(238,236,235,.1);padding:1.75rem 0}}
.espec .etiqueta{{font-size:.65rem;letter-spacing:.24em;text-transform:uppercase;
                 color:var(--quill);margin-bottom:.75rem}}
.muestra-serif{{font-family:var(--serif);font-size:clamp(1.8rem,4.5vw,3rem);line-height:1.2}}
.muestra-serif em{{color:var(--oro-claro)}}
.muestra-sans{{font-family:var(--sans);font-size:1.05rem;max-width:58ch;color:var(--mist)}}
.abecedario{{font-family:var(--serif);font-size:1.1rem;letter-spacing:.06em;
            color:var(--mist);word-break:break-all}}

/* ── reglas ──────────────────────────────────────────────── */
.reglas{{display:grid;gap:2rem;grid-template-columns:repeat(auto-fit,minmax(280px,1fr))}}
.reglas ul{{margin:.5rem 0 0;padding-left:1.1rem;color:var(--mist);font-size:.94rem}}
.reglas li{{margin-bottom:.5rem}}
.si h3{{color:#7fc0a4}} .no h3{{color:#e08a8a}}

table{{border-collapse:collapse;width:100%;font-size:.88rem;margin-top:1rem}}
th,td{{text-align:left;padding:.6rem .8rem;border-bottom:1px solid rgba(238,236,235,.1)}}
th{{font-size:.66rem;letter-spacing:.16em;text-transform:uppercase;color:var(--oro)}}
td{{color:var(--mist)}} td code{{color:var(--off)}}
footer{{padding:3rem 0 4rem;color:var(--quill);font-size:.82rem}}
</style>

<div class="envoltorio">

  <header class="portada">
    {svg('alfaro-partners-blanco.svg')}
    <h1>Kit de marca</h1>
    <p>Todo lo que hace falta para crear una pieza que parezca de la casa.
       Esta página se dibuja con los archivos que hay en esta misma carpeta:
       lo que ves es exactamente lo que te llevas.</p>
  </header>

  <section>
    <div class="cejilla">01 · Logotipo</div>
    <h2>Tres versiones, un solo dibujo</h2>
    <p>Está vectorizado: no depende de ninguna fuente instalada y aguanta cualquier
       tamaño. No se reescribe a mano nunca — se coloca el archivo.</p>

    <div class="par" style="margin-top:2rem">
      <div>
        <div class="lienzo lienzo--oscuro">{svg('alfaro-partners-blanco.svg')}</div>
        <p class="pie"><b>Blanco</b> · sobre fondo oscuro</p>
      </div>
      <div>
        <div class="lienzo lienzo--claro">{svg('alfaro-partners-azul.svg')}</div>
        <p class="pie"><b>Azul</b> · sobre fondo claro</p>
      </div>
      <div>
        <div class="lienzo lienzo--oro">{svg('alfaro-partners-monocromo.svg')}</div>
        <p class="pie"><b>Monocromo</b> · toma el color del contexto. Aquí, oro</p>
      </div>
    </div>

    <h3>Área de respiración</h3>
    <p><b>X</b> es la altura de la letra A del logotipo. Deja <b>1X</b> a los lados
       y <b>0,5X</b> arriba y abajo. Ese hueco no lo pisa nada: ni una foto, ni un
       texto, ni un borde.</p>
    <div class="respiracion">
      <div class="caja-aire">
        <span class="marca-x lat">1X</span><span class="marca-x lat2">1X</span>
        <span class="marca-x arr">0,5X</span><span class="marca-x aba">0,5X</span>
        {svg('alfaro-partners-blanco.svg')}
      </div>
    </div>

    <table>
      <tr><th>Archivo</th><th>Cuándo</th></tr>
      <tr><td><code>alfaro-partners-azul.svg</code></td><td>Fondo claro · digital</td></tr>
      <tr><td><code>alfaro-partners-blanco.svg</code></td><td>Fondo oscuro · digital</td></tr>
      <tr><td><code>alfaro-partners-monocromo.svg</code></td><td>Hereda el color del contexto</td></tr>
      <tr><td><code>alfaro-partners-azul.pdf</code> · <code>-blanco.pdf</code></td><td>Imprenta</td></tr>
      <tr><td><code>alfaro-partners-original.ai</code></td><td>Original. De aquí salen los demás — no maquetes con él</td></tr>
    </table>
  </section>

  <section>
    <div class="cejilla">02 · Color</div>
    <h2>Azul muy oscuro, casi blanco, y oro con cuentagotas</h2>
    <p>El azul de la marca es <code>#0D1322</code>, tomado del logotipo vectorial.
       El oro funciona porque se usa poco: un botón, una palabra, una línea fina.
       Repartido por todas partes deja de significar nada.</p>
    {"".join(grupo_color(g, c) for g, c in paleta.items())}
    <p class="nota" style="margin-top:2rem"><b>Para imprenta:</b> manda el HEX o el RGB
       y que el impresor convierta con el perfil de su máquina. El CMYK de la tabla es
       orientativo — si se lo mandas tal cual, el azul saldrá distinto.</p>
  </section>

  <section>
    <div class="cejilla">03 · Tipografía</div>
    <h2>Si es grande, Baskerville. Si hay que leerlo, Satoshi</h2>

    <div class="espec">
      <div class="etiqueta">Libre Baskerville · titulares</div>
      <div class="muestra-serif">Tu patrimonio <em>bien representado</em></div>
      <div class="abecedario" style="margin-top:1rem">ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789</div>
    </div>

    <div class="espec">
      <div class="etiqueta">Satoshi · textos, botones, etiquetas</div>
      <div class="muestra-sans">Venta, compra, alquiler e inversión con una sola
        prioridad: proteger tus intereses con criterio y transparencia.</div>
    </div>

    <div class="espec">
      <div class="etiqueta">Etiqueta de marca · Satoshi muy espaciada</div>
      <div style="font-size:.7rem;letter-spacing:.42em;text-transform:uppercase;color:var(--oro)">
        Representación inmobiliaria premium</div>
    </div>

    <p class="nota" style="margin-top:2rem">El logotipo está compuesto en
       <b>Times New Roman</b>, que <b>no</b> es la tipografía de la marca. Un logotipo
       se congela cuando se dibuja. No maquetes una pieza en Times para que pegue con
       el logo — usa Libre Baskerville y Satoshi.</p>
  </section>

  <section>
    <div class="cejilla">04 · Reglas</div>
    <h2>Lo corto</h2>
    <div class="reglas">
      <div class="si">
        <h3>Sí</h3>
        <ul>
          <li>Escalar el logo con la proporción bloqueada</li>
          <li>Respetar el aire de 1X / 0,5X</li>
          <li>Oro para una sola cosa por pieza</li>
          <li>Exportar PDF con las fuentes incrustadas</li>
          <li>Fondos oscuros por defecto</li>
        </ul>
      </div>
      <div class="no">
        <h3>No</h3>
        <ul>
          <li>Estirar, comprimir o recolorear el logo fuera de sus versiones</li>
          <li>Rehacer el nombre escribiéndolo con una fuente parecida</li>
          <li>Separar el nombre de «Representación inmobiliaria»</li>
          <li>Baskerville en párrafos largos</li>
          <li>Meter una tercera tipografía</li>
        </ul>
      </div>
    </div>
  </section>

  <footer>
    Si algo no está claro aquí, la referencia viva es <b>alfaropartners.es</b> —
    está construida exactamente con esto.<br>
    La definición técnica vive en <code>src/styles/tokens.css</code> del repositorio de la web.
  </footer>

</div>
</html>
"""

(K / "escaparate.html").write_text(html, encoding="utf-8")
print(f"escaparate.html · {len(html)/1024:.0f} KB")
