
const planetData = [
    { name: 'Mercury', distance: 10, size: 0.5, color: 0xaaaaaa, speed: 0.04 },
    { name: 'Venus', distance: 15, size: 0.8, color: 0xffaa00, speed: 0.015 },
    { name: 'Earth', distance: 20, size: 1, color: 0x3366ff, speed: 0.01 },
    { name: 'Mars', distance: 25, size: 0.7, color: 0xff3300, speed: 0.008 },
    { name: 'Jupiter', distance: 35, size: 2.5, color: 0xffaa55, speed: 0.005 },
    { name: 'Saturn', distance: 45, size: 2, color: 0xffeeaa, speed: 0.003 },
    { name: 'Uranus', distance: 55, size: 1.5, color: 0x66ccff, speed: 0.002 },
    { name: 'Neptune', distance: 65, size: 1.3, color: 0x3366cc, speed: 0.0015 },
];

let isPaused = false;
let isDarkMode = true;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 200);
camera.position.z = 100;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const pointLight = new THREE.PointLight(0xffffff, 1.5);
scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

const sunGeometry = new THREE.SphereGeometry(4, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

function createStars() {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    for (let i = 0; i < 10000; i++) {
        vertices.push(THREE.MathUtils.randFloatSpread(1000));
        vertices.push(THREE.MathUtils.randFloatSpread(1000));
        vertices.push(THREE.MathUtils.randFloatSpread(1000));
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    const material = new THREE.PointsMaterial({ color: 0xffffff });
    const stars = new THREE.Points(geometry, material);
    scene.add(stars);
}
createStars();

const planets = [];
planetData.forEach((planet, i) => {
    const geometry = new THREE.SphereGeometry(planet.size, 32, 32);
    const material = new THREE.MeshStandardMaterial({
        color: planet.color,
        emissive: planet.color,
        emissiveIntensity: 0.4
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = planet.distance;
    scene.add(mesh);
    planets.push({ ...planet, mesh, angle: 0 });

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = 0.001;
    slider.max = 0.1;
    slider.step = 0.001;
    slider.value = planet.speed;
    slider.id = `speed-${i}`;
    slider.addEventListener('input', () => {
        planets[i].speed = parseFloat(slider.value);
    });

    const label = document.createElement('label');
    label.innerText = planet.name;
    label.appendChild(slider);
    document.getElementById('sliders').appendChild(label);
});

document.getElementById('toggle-animation').onclick = () => {
    isPaused = !isPaused;
    document.getElementById('toggle-animation').innerText = isPaused ? '▶ Resume' : '⏸ Pause';
};

document.getElementById('theme-toggle').onclick = () => {
    isDarkMode = !isDarkMode;
    const bg = isDarkMode ? '#000' : '#fff';
    const text = isDarkMode ? 'white' : 'black';
    const panel = isDarkMode ? 'rgba(0,0,0,0.85)' : 'rgba(255,255,255,0.95)';
    document.body.style.backgroundColor = bg;
    document.body.style.color = text;
    document.getElementById('controls').style.background = panel;
    document.getElementById('controls').style.color = text;
    document.getElementById('theme-toggle').innerText = isDarkMode ? '🌙 Switch to Light Mode' : '🌞 Switch to Dark Mode';
    renderer.setClearColor(bg);
};

function animate() {
    requestAnimationFrame(animate);
    if (!isPaused) {
        planets.forEach(p => {
            p.angle += p.speed;
            p.mesh.position.x = p.distance * Math.cos(p.angle);
            p.mesh.position.z = p.distance * Math.sin(p.angle);
        });
    }
    renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
