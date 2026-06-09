# 🧠 Centro de estudio — Psicoanálisis (Freud ↔ Lacan)

Sitio de estudio interactivo para **Psicoanálisis** (2.º año, Psicología, Universidad Favaloro).
Cubre las **11 clases** del 1.er cuatrimestre + la **transversal de Psicosis**, articulando el
recorrido **Freud → Lacan** ("retorno a Freud").

## 🌐 Sitio en vivo

### → **https://franco4447.github.io/psicoanalisis-estudio/**

Funciona en compu y celular. También anda **offline**: con descargar/clonar el repo y abrir
`index.html`, todo funciona sin conexión.

---

## ✨ Qué incluye

**11 clases + 1 transversal**, cada una con una página web de **6 pestañas**:

| Pestaña | Qué es |
|---|---|
| 📖 **Resumen** | resumen integrador jerarquizado "para el examen" + prompts de auto-explicación |
| 🧩 **Diagramas** | esquemas visuales de los conceptos y procesos clave |
| 🔬 **Ejemplo** | un caso/ejemplo trabajado paso a paso |
| 🃏 **Flashcards** | recuerdo activo + **repetición espaciada** (sistema Leitner) |
| ✅ **Autoevaluación** | preguntas tipo examen con corrección + **pregunta integradora** con respuesta modelo y rúbrica |
| 🔗 **Articulación** | cómo se conecta esa clase con el resto del cuatrimestre |

**6 herramientas transversales:**

- 🗺️ **[Mapa maestro](https://franco4447.github.io/psicoanalisis-estudio/mapa-maestro.html)** — los 5 ejes, los puentes Freud→Lacan, las 3 escuelas y las trampas de examen.
- 🔀 **[Práctica intercalada](https://franco4447.github.io/psicoanalisis-estudio/practica.html)** — preguntas mezcladas entre clases (interleaving).
- 📝 **[Simulador de examen](https://franco4447.github.io/psicoanalisis-estudio/examen.html)** — arma exámenes al azar + cronómetro.
- 🧭 **[Síntesis del cuatrimestre](https://franco4447.github.io/psicoanalisis-estudio/sintesis.html)** — todo en una mirada: el relato en 5 ejes, las 3 "cosechas" y las trampas juntas.
- 📚 **[Glosario maestro](https://franco4447.github.io/psicoanalisis-estudio/glosario.html)** — todos los términos (con su alemán/francés) + flashcards maestras.
- 📊 **[Mi progreso](https://franco4447.github.io/psicoanalisis-estudio/progreso.html)** — dominio por clase y qué tenés pendiente de repasar.

---

## 🧭 Cómo estudiar con esto

- **Todos los días (10–15 min):** flashcards en alguna clase → marcá con honestidad. Lo que falles
  **vuelve antes** (repetición espaciada). Mirá *Mi progreso* para ver tus huecos.
- **Por clase:** Resumen → Diagramas → Ejemplo → **escribí a mano la pregunta integradora (#8)**.
- **Cada semana:** *Práctica intercalada* y *Simulador de examen* (con cronómetro).
- **Antes del examen:** *Síntesis* + *Glosario* + repaso de lo pendiente en *Mi progreso*.

> **El criterio del examen:** el profesor valora **(1) redactar y explicar extendido** y
> **(2) conectar conceptos**. Por eso cada clase trae respuestas desarrolladas modelo y preguntas
> integradoras. Plantilla de respuesta: *definir → desarrollar el porqué → conectar → ejemplo → cierre.*

---

## 🗺️ La arquitectura del curso

El curso construye **5 ejes**; casi cada eje se ve primero en **Freud** y luego se **relee en Lacan**.

```
EJE 0 · Marco        C1  Epistemología · 3 escuelas · "retorno a Freud"
EJE 1 · Inconsciente C2 Freud(sueño) → C3 Freud(represión) → C4 Lacan(significante)
EJE 2 · Sexualidad   C5 Freud(Edipo) → C6 Freud(pulsión) → C7 Lacan(metáfora paterna)
EJE 3 · Más allá     C8 Freud(pulsión de muerte · repetición)
EJE 4 · El Yo        C9 Freud(narcisismo) → C10 Freud(tópicas) → C11 Lacan(estadio del espejo)
                     ───────────────────────────────────────
              Transversal · Psicosis (Belucci 4) = integra C4 + C7 + C11
```

**Las 3 "cosechas" de Lacan** (el esqueleto del examen): **C4** (significante) · **C7** (metáfora
paterna) · **C11** (estadio del espejo). La **transversal de Psicosis** es su aplicación clínica.

---

## 🧩 Estructura del repositorio

```
.
├── index.html            # inicio (hub)
├── mapa-maestro.html     # vista global del cuatrimestre
├── practica.html         # práctica intercalada
├── examen.html           # simulador de examen
├── sintesis.html         # síntesis / repaso final
├── glosario.html         # glosario maestro + flashcards maestras
├── progreso.html         # tablero de dominio (metacognición)
├── psicosis.html         # transversal: Psicosis (Belucci 4)
├── clases/
│   └── clase-01.html … clase-11.html   # una página por clase (6 pestañas)
├── css/
│   └── estilo.css        # estilos compartidos (Freud = ámbar · Lacan = índigo)
├── js/
│   ├── estudio.js        # motor: pestañas + flashcards/SRS + progreso
│   └── banco.js          # banco de preguntas (práctica/examen) + consignas de desarrollo
├── .nojekyll             # evita el procesamiento Jekyll de GitHub Pages
└── README.md             # este archivo
```

---

## ⚙️ Cómo funciona

- **100% estático, sin dependencias** (HTML + CSS + JavaScript puro). No usa servidores ni CDNs.
- **Repetición espaciada y progreso** se guardan en `localStorage` del navegador → **privado y por
  dispositivo** (tu progreso en el celu y en la compu son independientes; nada se sube a ningún
  lado).
- Para **reiniciar** tus marcas de estudio: botón en *Mi progreso*.

---

## 🔄 Cómo actualizar el sitio

GitHub Pages ya está activado (deploy desde `main` / raíz). Para publicar cambios:

```bash
cd "ruta/al/repo"      # la carpeta 'sitio' del proyecto
git add -A
git commit -m "describí el cambio"
git push
```

El sitio se actualiza solo en ~1 minuto.

---

## 📚 Fuentes y notas

- Material de estudio elaborado a partir de los **apuntes de clase**, las **guías de lectura** y los
  **textos de la cátedra** (resúmenes de **G. Belucci** y bibliografía de Freud, Lacan, Klimovsky,
  Klein, Winnicott, entre otros).
- Es un **recurso de estudio personal**, no un material oficial de la cátedra.
- Generado con asistencia de IA (Claude) y curado sobre las fuentes del curso.

_¡A estudiar y a romperla en el examen!_ 📖💪
