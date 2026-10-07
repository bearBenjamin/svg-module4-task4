function buildPathTimings(paths) {
	const sorted = paths
		.map(el => ({ el, len: el.getTotalLength() }))
		.sort((a, b) => a.len - b.len);

	let cursor = 0;
	const timings = new Map();
	sorted.forEach(({ el, len }) => {
		const duration = Math.max(200, len * 4);
		timings.set(el, { delay: cursor, duration });
		cursor += duration * 0.4;
	});
	return { sorted, timings };
}

// ====== ВСПОМОГАТЕЛЬНАЯ ======
function buildPathTimings(paths) {
	const sorted = paths
		.map(el => ({ el, len: el.getTotalLength() }))
		.sort((a, b) => a.len - b.len);

	let cursor = 0;
	const timings = new Map();
	sorted.forEach(({ el, len }) => {
		const duration = Math.max(200, len * 4);
		timings.set(el, { delay: cursor, duration });
		cursor += duration * 0.4;
	});
	return { sorted, timings };
}

// ====== СЦЕНА 1: КОТ ======
function buildCatScene() {
	const catSVG = document.querySelector('svg.cat');
	const catPaths = Array.from(catSVG.querySelectorAll('.cat path[stroke]'));
	const catCircle = catSVG.querySelector('.cat path[fill="#F66C41"]');
	const catBlackElements = Array.from(catSVG.querySelectorAll('.cat path[fill="black"]'));
	const catBlackExceptLast = catBlackElements.slice(0, -1);
	const catBlackLast = catBlackElements[catBlackElements.length - 1];

	const { sorted, timings } = buildPathTimings(catPaths);

	return [
		{
			targets: sorted.map(({ el }) => el),
			strokeDashoffset: [anime.setDashoffset, 0],
			duration: (el) => timings.get(el).duration,
			delay: (el) => timings.get(el).delay
		},
		{
			targets: catBlackExceptLast,
			opacity: [0, 1],
			duration: 300,
			delay: anime.stagger(300),
			easing: 'easeOutQuad',
			_offset: '-=6750'
		},
		{
			targets: catBlackLast,
			opacity: [0, 1],
			duration: 300,
			easing: 'easeOutQuad'
		},
		{
			targets: catCircle,
			opacity: [0, 1],
			duration: 400,
			easing: 'easeOutQuad'
		}
	];
}

// ====== СЦЕНА 2: ТЕКСТ-РОСЧЕРК ======
function buildTextScene() {
	const textPath = document.querySelector('svg.html path');
	// const textLen = textPath.getTotalLength();  // если нужен фиксированный dasharray

	return [
		{
			targets: textPath,
			strokeDashoffset: [anime.setDashoffset, 0],
			duration: 2200,
			easing: 'easeInOutSine'
		}
	];
}

// ====== СЦЕНА 3: ЗАГОЛОВОК СНИЗУ ======
function buildHeadingScene() {
	const heading = document.querySelector('h1');
	return [
		{
			targets: heading,
			translateY: ['100%', '0%'],
			opacity: [0, 1],
			duration: 800,
			easing: 'easeOutCubic'
		}
	];
}

// ====== МАСТЕР ======
const master = anime.timeline({ easing: 'easeInOutSine' });
buildCatScene().forEach(step => {
	const { _offset, ...animProps } = step;
	master.add(animProps, _offset);
});
master.add({ duration: 250 });          // пауза между котом и текстом
buildTextScene().forEach(step => master.add(step));
master.add({ duration: 50 });          // пауза перед заголовком
buildHeadingScene().forEach(step => master.add(step));
