import os
import json

#configuracion
# "," significa la carpeta donde esta el script, puedes cambiarlo por la ruta de tu carpeta
RUTA_CARPETA = "./assets"
EXTENCIONES_PERMITIDAS = (".mp4", "mkv", ".mp3", ".nav", ".ogg")
ARCHIVO_SALIDA = "lista_archivos.json"

def generar_lista():
    archivos_encontrados = {}

    #verificar si la carpeta existe
    if not os.path.exists(RUTA_CARPETA) or not os.path.isdir(RUTA_CARPETA):
        print(f"la carpeta{RUTA_CARPETA} no existe.")
        return

    #escanear la carpeta
    for categoria in os.listdir(RUTA_CARPETA):
        tab = {
            "nombre": categoria
        }
        tab["elementos"] = {}

        for nombre_archivo in os.listdir(F"{RUTA_CARPETA}/{categoria}"):
            if nombre_archivo.lower().endswith(EXTENCIONES_PERMITIDAS):
                
                tab["elementos"][len(tab["elementos"]) + 1] = {
                    "nombre": nombre_archivo,
                    "ruta": f"{RUTA_CARPETA}/{categoria}/{nombre_archivo}"
                }
        print(len(tab["elementos"]))
        archivos_encontrados[categoria] = tab
        #archivos_encontrados.append({ categoria: tab })
        
    #guardar en JSON
    with open(ARCHIVO_SALIDA, "w", encoding="utf-8") as f:
        json.dump(archivos_encontrados, f, indent=4, ensure_ascii=False)

    print(f"listo, se han encontrado {len(archivos_encontrados)} archivos")

if __name__ == "__main__":
    generar_lista()