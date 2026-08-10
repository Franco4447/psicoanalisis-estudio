import os
import shutil
import subprocess
from pathlib import Path

def smart_extract_pdf(pdf_path: str, output_md_path: str):
    """
    Convierte un PDF a Markdown utilizando MinerU.
    Intenta siempre usar la versión gratuita/sin API ('flash-extract') primero.
    Si el archivo excede los límites (10MB o 20 páginas), utiliza automáticamente 
    el modo completo con la API ('extract').
    """
    pdf_file = Path(pdf_path)
    out_file = Path(output_md_path)
    
    if not pdf_file.exists():
        raise FileNotFoundError(f"No se encontró el archivo: {pdf_file}")
    
    # 1. Intentar siempre flash-extract primero (Opción sin API)
    file_size_mb = pdf_file.stat().st_size / (1024 * 1024)
    print(f"[{pdf_file.name}] Tamaño: {file_size_mb:.2f} MB. Intentando flash-extract...")
    
    cmd_flash = [
        "mineru-open-api", 
        "flash-extract", 
        str(pdf_file), 
        "-o", 
        str(out_file), 
        "--language", "es"
    ]
    
    # Run the fast extraction
    result = subprocess.run(cmd_flash, shell=True, capture_output=True, text=True)
    
    # Si flash-extract fue exitoso (retcode 0) y el archivo de salida existe, terminamos.
    if result.returncode == 0 and out_file.exists():
        print(f"[{pdf_file.name}] ✅ flash-extract exitoso.")
        return True
        
    # 2. Fallback: Si falló (probablemente por exceder las 20 páginas o 10MB)
    print(f"[{pdf_file.name}] ⚠️ flash-extract falló o excedió los límites. Cambiando al modo API ('extract')...")
    
    # extract mode genera una carpeta, así que creamos una temporal
    temp_dir = out_file.parent / f"temp_{pdf_file.stem}"
    cmd_extract = [
        "mineru-open-api", 
        "extract", 
        str(pdf_file), 
        "-o", 
        str(temp_dir)
    ]
    
    result_ext = subprocess.run(cmd_extract, shell=True, capture_output=True, text=True)
    
    if result_ext.returncode != 0:
        print(f"[{pdf_file.name}] ❌ Error en modo extract: {result_ext.stderr}")
        return False
        
    # extract mode suele guardar el resultado en temp_dir/nombre_del_pdf/nombre_del_pdf.md
    # Buscamos el archivo .md generado y lo movemos a la ruta deseada
    md_files = list(temp_dir.rglob("*.md"))
    if md_files:
        # Mover el archivo generado al destino solicitado
        shutil.move(str(md_files[0]), str(out_file))
        # Limpiar la carpeta temporal
        shutil.rmtree(temp_dir, ignore_errors=True)
        print(f"[{pdf_file.name}] ✅ extract (API) exitoso.")
        return True
    else:
        print(f"[{pdf_file.name}] ❌ No se generó el archivo markdown en modo extract.")
        return False

# --- Ejemplo de uso para procesar el otro archivo pendiente ---
if __name__ == "__main__":
    import sys
    sys.stdout.reconfigure(encoding='utf-8')
    
    base_dir = Path(r"C:\Users\Fmendezcasariego\Downloads\psicoanalisis-2cuatri")
    out_dir = base_dir / "markdown"
    
    # Procesar el archivo restante de Freud
    pdf = base_dir / "08. Freud - Inhibición, síntoma y angustia - Caps. I-VIII.pdf"
    md = out_dir / "08. Freud - Inhibición, síntoma y angustia - Caps. I-VIII.md"
    
    if not md.exists() or md.stat().st_size < 1000:
        smart_extract_pdf(str(pdf), str(md))
    else:
        print("El archivo de Freud ya estaba listo.")
