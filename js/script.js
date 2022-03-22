"use strict"

//  Изображения
const images = document.querySelectorAll('[data-src]');
const imagesMap = new Map();

// Карта
const pageMap = document.querySelector('[data-map-src]')

// Текст
const lazyText = document.querySelector('[data-lazy-text]');

// Общая высота страницы
const pageHeight = document.documentElement.clientHeight;

// Инициализируем imagesMap и запускаем
if(!!images.length){
	images.forEach((image, index) => {
		imagesMap.set(index, {
			image: image,
			top: image.getBoundingClientRect().top + pageYOffset,
			isLoaded: false
		})
	});
}


function initLazyImageLoading(){
	if(imagesMap.size === 0) return
	Array.from(imagesMap.values()).forEach((imageItem, index) => {
		if(pageYOffset < imageItem.top - pageHeight) return;
		const imageSrc = imageItem.image.getAttribute('data-src');
		if(!imageSrc) return;
		imageItem.image.setAttribute('src', imageSrc);
		imageItem.image.removeAttribute('data-src');
		imagesMap.delete(index);
	});
}

function initLazyMapLoading(){
	if(pageMap.classList.contains('_loaded')) return
	const pageMapAbsoluteTopPosition = pageMap.getBoundingClientRect().top + pageYOffset;
	if(pageYOffset < pageMapAbsoluteTopPosition - pageHeight) return
	const mapSrc = pageMap.getAttribute('data-map-src');
	const iframe = document.createElement('iframe');
	iframe.src = mapSrc;
	iframe.style.width = '100%';
	iframe.style.height = '100%';
	pageMap.append(iframe)
	pageMap.removeAttribute('data-map-src')
	pageMap.classList.add('_loaded')
}

let i = 0;
let hasLoader = false;
let loaded = false;

async function initLazyTextLoading(){
	if(loaded || hasLoader) return;
	const absoluteTopCoordinate = lazyText.getBoundingClientRect().top + pageYOffset + lazyText.offsetHeight;
	if(pageYOffset < absoluteTopCoordinate - pageHeight) return

	if(!hasLoader){
		const loader = lazyText.getAttribute('data-lazy-loader');
		lazyText.insertAdjacentHTML("beforeend",
			`<img src="${loader}" class="image-loader" alt="loader" />`
		)
		hasLoader = true;
	}

	try{
		const response = await new Promise((resolve) => {
			setTimeout(() => {
				i++;
				resolve(`
					Lorem ipsum dolor sit amet, consectetur adipisicing elit.
					Lorem ipsum dolor sit amet, consectetur adipisicing elit.
				`)
			}, 1000)
		})

		lazyText.querySelector("img").remove();
		hasLoader = false;
		lazyText.insertAdjacentHTML('beforeend', `<p class="lazy-text">${JSON.stringify(response)}</p>`)
		if(i === 5) loaded = true;

	}catch(error){
		console.error(error);
		alert("Случилась какая то ошибка");
		lazyText.querySelector("img").remove();
		loaded = true;
	}
}

initLazyTextLoading();
initLazyMapLoading()
initLazyImageLoading();

window.addEventListener('scroll', initLazyTextLoading)
window.addEventListener('scroll', initLazyMapLoading);
window.addEventListener('scroll', initLazyImageLoading);


























