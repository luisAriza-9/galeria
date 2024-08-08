"use strict";

// Valida si la URL es correcta y corresponde a una imagen
function confirmUrl(url) {
    if (url.trim() !== "") {
        try {
            new URL(url); // Verifica que la URL es válida
            const resExt = confirmImage(url);
            if (!resExt) {
                throw new Error("La URL no corresponde a una imagen válida.");
            }
            return url;
        } catch (error) {
            alert("La URL o el formato de archivo alojado no son válidos");
            return false;
        }
    }
}

// Verifica si la URL termina con una extensión de imagen válida
function confirmImage(url) {
    const extensions = [
        "jpeg", "jpg", "jpe", "gif", "png", "apng", "svg", "bmp", "ico", "webp",
        "avif", "tiff", "tif", "xbm", "heic", "heif", "pcx", "tga", "raw", "arw",
        "cr2", "nrw", "k25", "raf", "nef", "orf", "sr2", "srf", "rw2", "dcr",
        "dng", "erf", "mrw", "pef", "srw"
    ];
    const urlWithoutParams = url.split("?")[0].toLowerCase();
    return extensions.some(ext => urlWithoutParams.endsWith(`.${ext}`));
}

// Muestra una animación de carga en el botón
async function loadingAnimation(button) {
    const originalWidth = button.offsetWidth;
    const originalHeight = button.offsetHeight;
    button.style.backgroundColor = "white";
    button.style.width = `${originalWidth}px`;
    button.style.height = `${originalHeight}px`;
    button.setAttribute("disabled", "");
    button.style.transform = "scale(0.9)";
    button.style.cursor = "default";
    button.style.padding = "0";
    button.textContent = "";

    const loader = document.createElement("img");
    loader.id = "loader";
    loader.classList.add("pos_abs", "centrar_absoluto");
    loader.src = "assets/loader.svg";

    const loadBar = document.createElement("div");
    loadBar.classList.add("pos_abs");
    loadBar.style.height = "100%";
    loadBar.style.background = "#019908";
    loadBar.style.left = "0";
    loadBar.style.width = "0";
    loadBar.style.top = "0";
    loadBar.style.zIndex = "1";

    button.appendChild(loader);
    button.appendChild(loadBar);

    await new Promise(res => setTimeout(res, 600));
    const animation = loadBar.animate({ width: "100%" }, 1500);
    await animation.finished;

    button.textContent = "¡Hecho!";
    await new Promise(res => setTimeout(res, 1000));
    button.textContent = "Añadir al carrusel";
    button.removeAttribute("disabled");
    button.style.transform = "";
    button.style.cursor = "";
    button.style.padding = "";
    button.style.width = "";
    button.style.height = "";
}

let images = [];
let currentIndex = 0;

document.addEventListener("DOMContentLoaded", () => {

    const addButton = document.querySelector("#add_button");
    const leftArrow = document.querySelector(".left");
    const rightArrow = document.querySelector(".right");
    const advice = document.querySelector(".advice");
    const prevImg = document.querySelector(".prev");
    const currentImg = document.querySelector(".current");
    const nextImg = document.querySelector(".next");

    addButton.addEventListener("click", async () => {
        const urlValue = document.querySelector("#url");
        const titleValue = document.querySelector("#title");
        const url = confirmUrl(urlValue.value.toLowerCase().trim());

        if (titleValue.value.trim() !== "" && url) {
            await loadingAnimation(addButton);
            const fullDate = new Date();
            const date = `${fullDate.getDate()}/${fullDate.getMonth() + 1}/${fullDate.getFullYear()} ${fullDate.getHours()}:${fullDate.getMinutes()}:${fullDate.getSeconds()}`;
            const newImage = {
                url: urlValue.value,
                title: titleValue.value,
                date: date,
            };
            images.push(newImage);
            updateCarousel();
        }
    });

    leftArrow.addEventListener("click", () => {
        if (images.length > 1) {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            updateCarousel();
        }
    });

    rightArrow.addEventListener("click", () => {
        if (images.length > 1) {
            currentIndex = (currentIndex + 1) % images.length;
            updateCarousel();
        }
    });

    function updateCarousel() {
        if (images.length === 0) {
            advice.classList.remove("no_display");
            leftArrow.classList.add("no_display");
            rightArrow.classList.add("no_display");
            prevImg.innerHTML = '';
            currentImg.innerHTML = '';
            nextImg.innerHTML = '';
        } else {
            advice.classList.add("no_display");
            leftArrow.classList.remove("no_display");
            rightArrow.classList.remove("no_display");

            const prevIndex = (currentIndex - 1 + images.length) % images.length;
            const nextIndex = (currentIndex + 1) % images.length;

            prevImg.className = "prev";
            currentImg.className = "current";
            nextImg.className = "next";

            prevImg.innerHTML = createImageHTML(images[prevIndex]);
            currentImg.innerHTML = createImageHTML(images[currentIndex]);
            nextImg.innerHTML = createImageHTML(images[nextIndex]);
        }
    }

    function createImageHTML(image) {
        return `
            <div class="img_box pos_rela flex all_c">
                <img src="${image.url}" alt="${image.title}" draggable="false"/>
            </div>
            <div class="img_added_info pos_abs centrar_absoluto flex_col all_c">
                <h3>${image.title}</h3>
                <ul>
                    <li><strong>Fecha de adición: </strong>${image.date}</li>
                    <li><strong>Origen: </strong><a href="${image.url}" target="_blank">${image.url}</a></li>
                </ul>
                <button onclick="deleteImage(${images.indexOf(image)})">Eliminar</button>
            </div>
        `;
    }

    window.deleteImage = function(index) {
        images.splice(index, 1);
        if (currentIndex >= images.length) {
            currentIndex = 0;
        }
        updateCarousel();
    }
});
