# Sitio de estudio — Psicoanálisis (Freud ↔ Lacan)

Sitio estático para estudiar el cuatrimestre. Funciona de dos maneras:

1. **Offline (sin nada):** doble clic en `index.html`. Anda en cualquier navegador.
2. **Online (GitHub Pages):** publicado como página web accesible desde el celular.

## Contenido

```
sitio/
├── index.html          ← inicio (hub): mapa maestro + las 11 clases
├── mapa-maestro.html   ← vista global: 5 ejes, puentes Freud→Lacan, escuelas, trampas
├── css/estilo.css      ← estilos compartidos (cambiar acá restila todo el sitio)
├── clases/             ← una página por clase (clase-01.html … clase-11.html)
└── .nojekyll           ← evita que GitHub procese el sitio con Jekyll
```

Esta carpeta `sitio/` **es la raíz del sitio web**: todo lo que se publica está acá adentro.

## Cómo publicarlo en GitHub Pages (sin saber programar)

### Opción A — Subir por la web (la más simple)

1. Creá una cuenta en <https://github.com> si no tenés.
2. Click en **New repository**. Ponele un nombre sin espacios, por ejemplo
   `psicoanalisis-estudio`. Dejalo **Public**. Creá el repo.
3. En la página del repo, click en **Add file → Upload files**.
4. Arrastrá **todo el contenido de esta carpeta `sitio/`** (no la carpeta, su *contenido*:
   `index.html`, `mapa-maestro.html`, la carpeta `css/`, la carpeta `clases/` y el archivo
   `.nojekyll`). Confirmá con **Commit changes**.
5. Andá a **Settings → Pages**. En *Source* elegí **Deploy from a branch**, branch
   **main** y carpeta **/ (root)**. Guardá.
6. Esperá ~1 minuto. GitHub te da una URL del tipo
   `https://TU-USUARIO.github.io/psicoanalisis-estudio/`. ¡Listo!

> El archivo `.nojekyll` ya está incluido para que no haya problemas con carpetas.

### Opción B — Por consola (si usás git)

```bash
cd "ruta/al/sitio"
git init
git add .
git commit -m "Sitio de estudio psicoanálisis"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/psicoanalisis-estudio.git
git push -u origin main
```

Después, en **Settings → Pages**, elegí branch `main` / carpeta `/ (root)`.

## Actualizarlo

Cada vez que se agregue o mejore una clase, volvé a subir los archivos cambiados
(Opción A) o hacé `git add . && git commit && git push` (Opción B). GitHub Pages se
actualiza solo en un minuto.
