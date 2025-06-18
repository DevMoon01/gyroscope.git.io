const isMobile = window.innerWidth < 768;  // Rileva se è uno smartphone

const particleCount = isMobile ? 500 : 1000; // Meno particelle su mobile
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 10;

const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector("#heroCanvas"), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Creazione delle particelle
const particlesGeometry = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);
const velocity = new Float32Array(particleCount * 3);

for (let i = 0; i < positions.length; i += 3) {
    positions[i] = (Math.random() - 0.5) * 20;
    positions[i + 1] = (Math.random() - 0.5) * 20;
    positions[i + 2] = (Math.random() - 0.5) * 20;

    velocity[i] = (Math.random() - 0.5) * 0.02;
    velocity[i + 1] = (Math.random() - 0.5) * 0.02;
    velocity[i + 2] = (Math.random() - 0.5) * 0.02;
}

particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
const particlesMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: isMobile ? 0.04 : 0.03 });
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

// Fluttuazione naturale delle particelle
const animate = () => {
    requestAnimationFrame(animate);
    const positions = particlesGeometry.attributes.position.array;

    for (let i = 0; i < positions.length; i++) {
        positions[i] += velocity[i];
        if (positions[i] > 10 || positions[i] < -10) velocity[i] *= -1;
    }

    particlesGeometry.attributes.position.needsUpdate = true;
    renderer.render(scene, camera);
};

// **Interazione con mouse e touch**
const updateParticles = (x, y) => {
    const positions = particlesGeometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
        const dx = positions[i] - x * 10;
        const dy = positions[i + 1] - y * 10;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 3) {
            gsap.to(positions, {
                [i]: positions[i] + dx * 0.2,
                [i + 1]: positions[i + 1] + dy * 0.2,
                duration: 0.3
            });
        }
    }
    particlesGeometry.attributes.position.needsUpdate = true;
};

// Evento mouse (desktop)
window.addEventListener("mousemove", (event) => {
    updateParticles((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);
});

// Evento touch (smartphone)
window.addEventListener("touchmove", (event) => {
    const touch = event.touches[0];
    updateParticles((touch.clientX / window.innerWidth) * 2 - 1, -(touch.clientY / window.innerHeight) * 2 + 1);
});




// Caricamento della texture dello sfondo
const textureLoader = new THREE.TextureLoader();
const backgroundTexture = textureLoader.load("https://cdn.pixabay.com/photo/2016/11/22/19/25/galaxy-1853493_1280.jpg");

const backgroundMaterial = new THREE.MeshBasicMaterial({
    map: backgroundTexture,
    side: THREE.BackSide // Rende il piano visibile da dentro la scena
});

const backgroundGeometry = new THREE.SphereGeometry(50, 32, 32);
const backgroundMesh = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
scene.add(backgroundMesh);

// Funzione di parallasse
const updateBackground = (x, y) => {
    gsap.to(backgroundMesh.rotation, {
        x: y * 0.05,  // Muove il background con effetto di profondità
        y: x * 0.05,
        duration: 1
    });
};

// **Desktop: movimento con il mouse**
window.addEventListener("mousemove", (event) => {
    const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    updateBackground(mouseX, mouseY);
});

// **Mobile: movimento con il touch**
window.addEventListener("touchmove", (event) => {
    const touch = event.touches[0];
    const touchX = (touch.clientX / window.innerWidth) * 2 - 1;
    const touchY = -(touch.clientY / window.innerHeight) * 2 + 1;
    updateBackground(touchX, touchY);
});




const title = document.getElementById("heroTitle");

// Movimento con il mouse (desktop)
window.addEventListener("mousemove", (event) => {
    const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

    gsap.to(title, {
        x: mouseX * 20, // Muove il titolo orizzontalmente
        y: mouseY * 20, // Muove il titolo verticalmente
        duration: 0.5,
        ease: "power2.out"
    });
});

// Movimento con il touch (mobile)
window.addEventListener("touchmove", (event) => {
    const touch = event.touches[0];
    const touchX = (touch.clientX / window.innerWidth) * 2 - 1;
    const touchY = -(touch.clientY / window.innerHeight) * 2 + 1;

    gsap.to(title, {
        x: touchX * 20,
        y: touchY * 20,
        duration: 0.5,
        ease: "power2.out"
    });
});


if (window.DeviceOrientationEvent) {
    window.addEventListener("deviceorientation", (event) => {
        const tiltX = event.gamma; // Inclinazione orizzontale
        const tiltY = event.beta;  // Inclinazione verticale

        gsap.to(title, {
            x: tiltX * 2, // Sposta il titolo orizzontalmente
            y: tiltY * 2, // Sposta il titolo verticalmente
            duration: 0.5,
            ease: "power2.out"
        });
    });
}




animate();
