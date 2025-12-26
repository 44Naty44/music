
let lista = [];
let categoriaTpl = document.querySelector('.categoria-tpl');
let cancionTpl = document.querySelector('.cancion-tpl');

let containerCat = document.querySelector('.categorias');
let containerSongs = document.querySelector('.canciones');

let titulo = document.querySelector(".titulo-text");
let tituloSearch = document.querySelector(".titulo-search");

let categoria = null;
let filtrarNombre = "";
let cancionSeleccionada = null;
let reproduciendo = null;
let aleatorio = false;
let repetir = false;
let audio = document.querySelector(".audio");
let video = document.querySelector(".video");
let repType = video;
let isPlaying = false;
let tiempo = document.querySelector(".tiempo")

let prevBtn = document.querySelector(".prev");
let playBtn = document.querySelector(".play");
let nextBtn = document.querySelector(".next");
let randomBtn = document.querySelector(".random");
let repetirBtn = document.querySelector(".repetir");
let volumeBtn = document.querySelector(".volume")

let progressContainer = document.querySelector(".progress")
let progressBar = document.querySelector(".progress-bar")

let nombreCancion = document.querySelector(".nombre-cancion")

let extencionesAudio = ["mp3"]
let extencionesVideo = ["mp4"]

let videoType = document.querySelector(".video-type")
let audioType = document.querySelector(".audio-type")

async function getAssets() {
    try {
        const res = await fetch('lista_archivos.json');
        const products = await res.json();
        lista = products
        renderCategorias()
    } catch {
        console.log("error")
    }
}

function renderCategorias() {
    if (!categoriaTpl || !cancionTpl) return;

    if (!containerCat || !containerSongs) return;
    containerCat.innerHTML = ''; // limpiar
    containerSongs.innerHTML = ''; // limpiar

    Object.entries(lista).forEach(([clave, valor]) => {
        const cat = categoriaTpl.content.cloneNode(true);
        cat.querySelector('.new-categoria').textContent = valor.nombre;
        cat.querySelector('.new-categoria').classList.add(valor.nombre);
        containerCat.appendChild(cat);
    });

    load()
}

function cambiarSong() {
    
    const ss = Array.from(document.querySelectorAll(".new-cancion"))
    const s = ss.find(el => el.innerText === lista[categoria]["elementos"][reproduciendo].nombre)

    if (!s) return;
    if (cancionSeleccionada) {
        cancionSeleccionada.classList.remove("selected")
    }
    cancionSeleccionada = s
    cancionSeleccionada.classList.add("selected")
}

function loadCanciones() {
    if (!containerSongs) return;
    containerSongs.innerHTML = ''; // limpiar
    
    if (!lista || !lista[categoria] || !lista[categoria]["elementos"]) return;
    
    Object.entries(lista[categoria]["elementos"]).forEach(([clave, valor]) => {
        const name = valor.nombre.toLowerCase()
        if (!filtrarNombre || filtrarNombre === "" || name.includes(filtrarNombre)) {
            const song = cancionTpl.content.cloneNode(true);
            song.querySelector('.new-cancion').textContent = valor.nombre;
            song.querySelector('.new-cancion').classList.add(clave);
            containerSongs.appendChild(song);
        }
    });

    const cancion = document.querySelectorAll(".new-cancion")
    cancion.forEach(s => {
        s.addEventListener("click", () => {
            const classList = Array.from(s.classList);
            const second = classList.find(song => song !== 'new-cancion');
            reproduciendo = (second || 'todo').toLowerCase();

            const infoArchivo = lista[categoria]["elementos"][reproduciendo]
            if (!audio) return;

            cambiarSong()

            repType.src = infoArchivo.ruta
            nombreCancion.innerText = infoArchivo.nombre

            if (isPlaying)
                repType.play();
            // reproducir cancion
        })
    })
}

tituloSearch.addEventListener("input", (e) => {
    filtrarNombre = e.target.value.toLowerCase()
    loadCanciones()
})

function load() {
    const openNav = document.querySelector(".settings-btn")
    const navBar = document.querySelector(".nav-bar")
    if (!openNav || !navBar) return;
    
    openNav.addEventListener("click", function() {
        console.log("listo")
    });

    const categorias = document.querySelectorAll(".new-categoria")
    categorias.forEach(c => {
        c.addEventListener("click", () => {
            const classList = Array.from(c.classList);
            const second = classList.find(cat => cat !== 'new-categoria');
            filtrarPor = (second || 'todo');
            titulo.textContent = `${filtrarPor} (${Object.keys(lista[filtrarPor]["elementos"]).length})`;
            categoria = filtrarPor
            loadCanciones()
        })
    })
    
    
}

playBtn.addEventListener("click", () => {
    if (!repType || !reproduciendo) {
        if (Object.keys(lista[categoria]["elementos"]).length < 1) return;
        if (aleatorio) {
            reproduciendo = Math.floor(Math.random() * ( Object.keys(lista[categoria]["elementos"]).length - 1 )) + 1
            
        } else {
            reproduciendo = 1

        }

        repType.src = lista[categoria]["elementos"][reproduciendo].ruta
        nombreCancion.innerText = lista[categoria]["elementos"][reproduciendo].nombre

        repType.play();
        playBtn.innerText = "⏸"
        isPlaying = true;
        return;
    };

    if (isPlaying){
        repType.pause();
        playBtn.innerText = "▶"
    } else {
        repType.play();
        playBtn.innerText = "⏸"
    }

    isPlaying = !isPlaying
})

prevBtn.addEventListener("click", () => {
    if (!reproduciendo || reproduciendo < 2) return;

    if (repetir) {
        repType.currentTime = 0;
        repType.play();
        return;
    }

    reproduciendo = ( +reproduciendo - 1 ).toString()
    repType.src = lista[categoria]["elementos"][reproduciendo].ruta
    nombreCancion.innerText = lista[categoria]["elementos"][reproduciendo].nombre

    cambiarSong()

    if (isPlaying)
        repType.play();
})

function nextSong() {
    if (aleatorio) {
        reproduciendo = Math.floor(Math.random() * ( Object.keys(lista[categoria]["elementos"]).length - 1 )) + 1
        repType.src = lista[categoria]["elementos"][reproduciendo].ruta
        nombreCancion.innerText = lista[categoria]["elementos"][reproduciendo].nombre

        cambiarSong()
        
        if (isPlaying)
            repType.play();
    } else if (repetir) {
        repType.currentTime = 0;
        repType.play();
    } else {
        // continua normal (la siguiente)
        if (!reproduciendo || reproduciendo > Object.keys(lista[categoria]["elementos"]).length -1) {
            reproduciendo = 1
        } else {
            reproduciendo = ( +reproduciendo + 1 ).toString()
        }

        repType.src = lista[categoria]["elementos"][reproduciendo].ruta
        nombreCancion.innerText = lista[categoria]["elementos"][reproduciendo].nombre

        cambiarSong()

        if (isPlaying)
            repType.play();
    }
}

nextBtn.addEventListener("click", nextSong)

randomBtn.addEventListener("click", () => {
    aleatorio = !aleatorio
    repetir = false
    repetirBtn.classList.remove("selected")

    if (aleatorio) {
        randomBtn.classList.add("selected")
        randomBtn.innerText = "🔀"
    } else {
        randomBtn.classList.remove("selected")
        randomBtn.innerText = "🔢"
    }
})

repetirBtn.addEventListener("click", () => {
    repetir = !repetir
    aleatorio = false
    randomBtn.classList.remove("selected")

    if (repetir) {
        repetirBtn.classList.add("selected")
        repetirBtn.innerText = "🔂"
    } else {
        repetirBtn.classList.remove("selected")
        repetirBtn.innerText = "🔁"
    }
})

volumeBtn.addEventListener("input", (e) => {
    repType.volume = e.target.value;
})

repType.onerror = function() {
    
    if (audio.error.code === 4) {
        nextSong(); 
    }
};

repType.addEventListener("timeupdate", (e) => {
    if (!progressBar) return;

    const { duration, currentTime } = e.srcElement
    if (!duration || !currentTime) return;

    const progressPercent = (currentTime / duration) * 100
    progressBar.style.width = `${progressPercent}%`;

    const tiempoActual = `${Math.floor(repType.currentTime / 60)}:${Math.floor(repType.currentTime % 60) < 10 ? '0' : ''}${Math.floor(repType.currentTime % 60)}`

    const tiempoTotal = `${Math.floor(duration / 60)}:${Math.floor(duration % 60) < 10 ? '0' : ''}${Math.floor(duration % 60)}`

    tiempo.innerText = `${tiempoActual} / ${tiempoTotal}`
})

repType.addEventListener("ended", nextSong)

progressContainer.addEventListener("click", (e) => {
    if (!repType || !reproduciendo) return;

    const width = progressContainer.clientWidth;
    const clickX = e.offsetX;
    const duration = repType.duration;
    repType.currentTime = (clickX / width) * duration;
})

videoType.addEventListener("click", () => {
    const p = repType.currentTime
    repType = video;

    audio.src = ""
    if (reproduciendo) {
        video.src = lista[categoria]["elementos"][reproduciendo].ruta
    }

    video.style.visibility = "visible";
    video.style.display = "block";

    if (isPlaying)
        repType.play();
        repType.currentTime = p;
})
audioType.addEventListener("click", () => {
    const p = repType.currentTime
    repType = audio;

    if (reproduciendo) {
        audio.src = lista[categoria]["elementos"][reproduciendo].ruta
    }
    video.src = ""

    video.style.visibility = "hidden";
    video.style.display = "none";

    if (isPlaying)
        repType.play();
        repType.currentTime = p;
})

document.addEventListener("DOMContentLoaded", getAssets);