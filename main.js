(function(){
    window.onload = init;

    function init() {
        // DOM elements.
        let fog = {
            near: document.getElementById('near-fog'),
            far: document.getElementById('far-fog')
        };

        let scale = {
            x: document.getElementById('scale-x'),
            y: document.getElementById('scale-y'),
            z: document.getElementById('scale-z')
        };

        let position = {
            x: document.getElementById('position-x'),
            y: document.getElementById('position-y'),
            z: document.getElementById('position-z'),
        };

        // WebGL settings.
        const width = window.innerWidth;
        const height = window.innerHeight;

        const scene = new THREE.Scene();
        scene.fog = new THREE.Fog(0x000000, 20, 500);

        const camera = new THREE.PerspectiveCamera(45, width / height);
        camera.position.set(40, 40, 100);

        const renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById('webgl-canvas'),
            antialias: true
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true;
        renderer.setSize(width, height);

        // Main objects
        const plane = new THREE.Mesh(
            new THREE.BoxGeometry(2000, .1, 2000),
            new THREE.MeshStandardMaterial({color: 0xc3c3c3, roughness: 0.1})
        );
        plane.receiveShadow = true;
        scene.add(plane);

        const octahedron = new THREE.Mesh(
            new THREE.OctahedronGeometry(9),
            new THREE.MeshStandardMaterial({
                color: 0x16c7fc,
                roughness: 0.0,

                opacity: 0.7,
                transparent: true
            })
        );
        octahedron.castShadow = true;
        scene.add(octahedron);
        // Camera view to octahedron.
        camera.lookAt(octahedron.position);

        // Lights
        const sun = new THREE.DirectionalLight(0x303030, 2);
        sun.position.set(0, 20, 20);
        scene.add(sun);

        const light = new THREE.SpotLight(0xFFFFFF, 3, 100, Math.PI / 4, 1);
        light.shadow.mapSize.height = 2048;
        light.shadow.mapSize.width = 2048;
        light.castShadow = true;
        scene.add(light);

        tick();
        function tick() {
            octahedron.rotation.y += .01;

            let t = Date.now() / 500, r = 20.0;
            light.position.set(r * Math.cos(t), 20 + 5 * Math.sin(t / 3.0), r * Math.sin(t));

            renderer.render(scene, camera);
            requestAnimationFrame(tick);

            // Submit values by DOM elements.
            scene.fog = new THREE.Fog(0x000000, ~~fog.near.value, ~~fog.far.value);
            octahedron.scale.set(Number(scale.x.value), Number(scale.y.value), Number(scale.z.value));
            octahedron.position.set(Number(position.x.value), Number(position.y.value), Number(position.z.value));
        }
    }
})();
