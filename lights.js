let scene,
camera,
cloudParticles = [],
renderer,
mesh,
composer,
altLights = [],
mainLights = [],
rotation = 0.004;


function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
          60,
          window.innerWidth / window.innerHeight,
          1,
          1000);
    camera.position.z = 1;
    camera.rotation.x = 1.16;
    camera.rotation.y = -0.12;
    camera.rotation.z = 0.27;

    let ambient = new THREE.AmbientLight(0x000080);
    scene.add(ambient);

    // MAIN LIGHTS
    let directionalLight = new THREE.DirectionalLight(0x0000cd);
    directionalLight.position.set(0, 0, 1);

    let lightOne = new THREE.PointLight(0x2e8b57, 50, 450, 1.7);
    lightOne.position.set(200, 300, 100);
    mainLights.push(lightOne);
    scene.add(lightOne);

    let lightTwo = new THREE.PointLight(0x000000, 50, 450, 1.7);
    lightTwo.position.set(100, 300, 100);
    mainLights.push(lightTwo)
    scene.add(lightTwo);

    let lightThree = new THREE.PointLight(0x191970, 50, 450, 1.7);
    lightThree.position.set(300, 300, 100);
    mainLights.push(lightThree);
    scene.add(lightThree);

    // ALT LIGHTS
    let altDirectionalLight = new THREE.DirectionalLight(0x8b0000);
    altDirectionalLight.position.set(0, 0, 1);
    // altLights.push(altDirectionalLight);
    scene.add(altDirectionalLight);

    let altLightOne = new THREE.PointLight(0xb22222, 0, 450, 1.7);
    altLightOne.position.set(200, 300, 100);
    altLights.push(altLightOne);
    scene.add(altLightOne);

    let altLightTwo = new THREE.PointLight(0xdc143c, 0, 450, 1.7);
    altLightTwo.position.set(100, 300, 100);
    altLights.push(altLightTwo);
    scene.add(altLightTwo);

    let altLightThree = new THREE.PointLight(0x000000, 0, 450, 1.7);
    altLightThree.position.set(300, 300, 100);
    altLights.push(altLightThree);
    scene.add(altLightThree);


    renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#bg'),
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    scene.fog = new THREE.FogExp2(0x000000, 0.001);
    renderer.setClearColor(scene.fog.color);
    document.body.appendChild(renderer.domElement);

    //smoke
    let loader = new THREE.TextureLoader();
    loader.load("Pictures/smoke.png", function (texture) {
    let cloudGeo = new THREE.PlaneBufferGeometry(500, 500);
    let cloudMaterial = new THREE.MeshLambertMaterial({
            map: texture,
            transparent: true,
          });

        //create 50
        for (let p = 0; p < 50; p++) {
            let cloud = new THREE.Mesh(cloudGeo, cloudMaterial);
            cloud.position.set(
              Math.random() * 1000 - 400,
              500,
              Math.random() * 600 - 500
            );
            cloud.rotation.x = 1.16;
            cloud.rotation.y = -0.12;
            cloud.rotation.z = Math.random() * 2 * Math.PI;
            cloud.material.opacity = 0.55;
            cloudParticles.push(cloud); //create a reference to each after created
            scene.add(cloud);
        }
    });

    const vertices = [];
    for ( let i = 0; i < 10000; i ++ ) {
        const x = THREE.MathUtils.randFloatSpread( 2000 );
        const y = THREE.MathUtils.randFloatSpread( 2000 );
        const z = THREE.MathUtils.randFloatSpread( 2000 );
        vertices.push( x, y, z );
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
    let material = new THREE.PointsMaterial({ color: 0xFFFFFF, size: 0.9 })
    mesh = new THREE.Points(geometry, material)
    mesh.position.x = -50; 
    mesh.position.y = 300; 
    mesh.position.z = 0; 
    scene.add(mesh)

   
    loader.load("Pictures/binary.jpg", function (texture) {
        //process that sh*t
        const textureEffect = new POSTPROCESSING.TextureEffect({
        blendFunction: POSTPROCESSING.BlendFunction.COLOR_DODGE,
            texture: texture,
        });
        textureEffect.blendMode.opacity.value = 0.1;
        const bloomEffect = new POSTPROCESSING.BloomEffect({
            blendFunction: POSTPROCESSING.BlendFunction.COLOR_DODGE,
            kernelSize: POSTPROCESSING.KernelSize.SMALL,
            useLuminanceFilter: true,
            luminanceThreshold: 0.3,
            luminanceSmoothing: 0.75,
        });
        bloomEffect.blendMode.opacity.value = 1.5;

        let effectPass = new POSTPROCESSING.EffectPass(
            camera,
            bloomEffect,
            textureEffect
        );
        effectPass.renderToScreen = true;

        composer = new POSTPROCESSING.EffectComposer(renderer);
        composer.addPass(new POSTPROCESSING.RenderPass(scene, camera));
        composer.addPass(effectPass);
        window.addEventListener("resize", onWindowResize, false);
        render();
    });
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function render() {
     mesh.rotation.x += 0.005
     mesh.rotation.y += 0.005
    cloudParticles.forEach((p) => {
        p.rotation.z -= rotation;
    });
    composer.render(0.1);
    requestAnimationFrame(render);
}


document.body.onscroll = moveCamera;
init();


function moveCamera() {
    const t = document.body.getBoundingClientRect().top;
    for (let i = 0; i < mainLights.length; i++) {
        altLights[i].intensity = t * -0.05;
        mainLights[i].intensity = 50 + t * 0.05;
    }
    camera.position.z = t * -0.07;

}
moveCamera();
