/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    THREE.JS
    PART 01 — CORE 3D ENGINE

======================================================================*/

const ThreeEngine={

    initialized:false,

    scene:null,

    camera:null,

    renderer:null,

    canvas:null,

    clock:new THREE.Clock(),

    mouse:new THREE.Vector2(),

    raycaster:new THREE.Raycaster(),

    sizes:{

        width:window.innerWidth,

        height:window.innerHeight,

        pixelRatio:Math.min(

            window.devicePixelRatio,

            2

        )

    },

    objects:[],

    mixers:[],

    config:{

        antialias:true,

        alpha:true,

        physicallyCorrectLights:true,

        toneMapping:

        THREE.ACESFilmicToneMapping,

        exposure:1.15,

        shadows:true

    }

};

/*==================================================
CACHE
==================================================*/

ThreeEngine.cache=function(){

    this.canvas=

    document.querySelector(

        "#three-canvas"

    );

};

/*==================================================
CHECK
==================================================*/

ThreeEngine.exists=function(){

    return(

        typeof THREE!==

        "undefined"&&

        this.canvas

    );

};

/*==================================================
SCENE
==================================================*/

ThreeEngine.createScene=function(){

    this.scene=

    new THREE.Scene();

    this.scene.name=

    "Director VISION";

};

/*==================================================
CAMERA
==================================================*/

ThreeEngine.createCamera=function(){

    this.camera=

    new THREE.PerspectiveCamera(

        35,

        this.sizes.width/

        this.sizes.height,

        .1,

        1000

    );

    this.camera.position.set(

        0,

        0,

        8

    );

    this.scene.add(

        this.camera

    );

};

/*==================================================
RENDERER
==================================================*/

ThreeEngine.createRenderer=function(){

    this.renderer=

    new THREE.WebGLRenderer({

        canvas:this.canvas,

        antialias:

        this.config.antialias,

        alpha:

        this.config.alpha,

        powerPreference:

        "high-performance"

    });

    this.renderer.setSize(

        this.sizes.width,

        this.sizes.height

    );

    this.renderer.setPixelRatio(

        this.sizes.pixelRatio

    );

    this.renderer.outputColorSpace=

    THREE.SRGBColorSpace;

    this.renderer.toneMapping=

    this.config.toneMapping;

    this.renderer.toneMappingExposure=

    this.config.exposure;

    this.renderer.physicallyCorrectLights=

    this.config

    .physicallyCorrectLights;

    this.renderer.shadowMap.enabled=

    this.config.shadows;

    this.renderer.shadowMap.type=

    THREE.PCFSoftShadowMap;

};

/*==================================================
INIT
==================================================*/

ThreeEngine.init=async function(){

    this.cache();

    if(

        !this.exists()

    ) return;

    this.createScene();

    this.createCamera();

    this.createRenderer();

    this.initialized=true;

    Log.info(

        "Three.js Engine Ready"

    );

};

/*==================================================
REGISTER
==================================================*/

registerModule(

    "ThreeEngine",

    ThreeEngine

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    THREE.JS
    PART 02 — HDRI ENVIRONMENT & CINEMATIC LIGHTING

======================================================================*/

/*==================================================
LIGHTS
==================================================*/

ThreeEngine.lights={

    ambient:null,

    key:null,

    fill:null,

    rim:null,

    hemisphere:null

};

/*==================================================
AMBIENT
==================================================*/

ThreeEngine.createAmbient=function(){

    this.lights.ambient=

    new THREE.AmbientLight(

        0xffffff,

        .45

    );

    this.scene.add(

        this.lights.ambient

    );

};

/*==================================================
HEMISPHERE
==================================================*/

ThreeEngine.createHemisphere=function(){

    this.lights.hemisphere=

    new THREE.HemisphereLight(

        0xffffff,

        0x0b1220,

        .9

    );

    this.scene.add(

        this.lights.hemisphere

    );

};

/*==================================================
KEY LIGHT
==================================================*/

ThreeEngine.createKeyLight=function(){

    this.lights.key=

    new THREE.DirectionalLight(

        0xffffff,

        4

    );

    this.lights.key.position.set(

        6,

        8,

        8

    );

    this.lights.key.castShadow=true;

    this.lights.key.shadow.mapSize.set(

        2048,

        2048

    );

    this.scene.add(

        this.lights.key

    );

};

/*==================================================
FILL LIGHT
==================================================*/

ThreeEngine.createFillLight=function(){

    this.lights.fill=

    new THREE.DirectionalLight(

        0x6eb8ff,

        1.2

    );

    this.lights.fill.position.set(

        -6,

        2,

        4

    );

    this.scene.add(

        this.lights.fill

    );

};

/*==================================================
RIM LIGHT
==================================================*/

ThreeEngine.createRimLight=function(){

    this.lights.rim=

    new THREE.PointLight(

        0xffd7a8,

        3,

        50

    );

    this.lights.rim.position.set(

        0,

        5,

        -8

    );

    this.scene.add(

        this.lights.rim

    );

};

/*==================================================
HDRI
==================================================*/

ThreeEngine.environment=function(){

    if(

        typeof RGBELoader===

        "undefined"

    ) return;

    const loader=

    new RGBELoader();

    loader.load(

        "assets/hdri/studio.hdr",

        texture=>{

            texture.mapping=

            THREE.EquirectangularReflectionMapping;

            this.scene.environment=

            texture;

            this.scene.background=

            null;

        }

    );

};

/*==================================================
READY
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        ThreeEngine.createAmbient();

        ThreeEngine.createHemisphere();

        ThreeEngine.createKeyLight();

        ThreeEngine.createFillLight();

        ThreeEngine.createRimLight();

        ThreeEngine.environment();

        Log.info(

            "Three Lighting Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    THREE.JS
    PART 03 — FLOATING GEOMETRY & HERO OBJECTS

======================================================================*/

/*==================================================
GROUP
==================================================*/

ThreeEngine.hero={

    group:new THREE.Group(),

    meshes:[]

};

/*==================================================
MATERIAL
==================================================*/

ThreeEngine.heroMaterial=function(){

    return new THREE.MeshPhysicalMaterial({

        color:0xffffff,

        metalness:.95,

        roughness:.08,

        transmission:.15,

        thickness:1,

        clearcoat:1,

        clearcoatRoughness:.05,

        reflectivity:1,

        envMapIntensity:2.5

    });

};

/*==================================================
ICOSAHEDRON
==================================================*/

ThreeEngine.createIcosahedron=function(){

    const mesh=

    new THREE.Mesh(

        new THREE.IcosahedronGeometry(

            1.2,

            2

        ),

        this.heroMaterial()

    );

    mesh.position.set(

        0,

        0,

        0

    );

    mesh.castShadow=true;

    mesh.receiveShadow=true;

    this.hero.group.add(

        mesh

    );

    this.hero.meshes.push(

        mesh

    );

};

/*==================================================
TORUS
==================================================*/

ThreeEngine.createRing=function(){

    const mesh=

    new THREE.Mesh(

        new THREE.TorusGeometry(

            2,

            .05,

            32,

            200

        ),

        new THREE.MeshPhysicalMaterial({

            color:0x7a8cff,

            emissive:0x3344ff,

            emissiveIntensity:.6,

            metalness:1,

            roughness:.15

        })

    );

    mesh.rotation.x=

    Math.PI/2;

    this.hero.group.add(

        mesh

    );

    this.hero.meshes.push(

        mesh

    );

};

/*==================================================
SMALL ORBS
==================================================*/

ThreeEngine.createOrbs=function(){

    const geometry=

    new THREE.SphereGeometry(

        .08,

        24,

        24

    );

    for(

        let i=0;

        i<30;

        i++

    ){

        const orb=

        new THREE.Mesh(

            geometry,

            new THREE.MeshStandardMaterial({

                color:0xffffff,

                emissive:0xffffff,

                emissiveIntensity:2,

                metalness:1,

                roughness:0

            })

        );

        orb.position.set(

            (Math.random()-.5)*8,

            (Math.random()-.5)*6,

            (Math.random()-.5)*5

        );

        this.hero.group.add(

            orb

        );

        this.hero.meshes.push(

            orb

        );

    }

};

/*==================================================
ADD
==================================================*/

ThreeEngine.addHero=function(){

    this.scene.add(

        this.hero.group

    );

};

/*==================================================
ANIMATE
==================================================*/

ThreeEngine.animateHero=function(){

    gsap.ticker.add(

        ()=>{

            const t=

            this.clock.getElapsedTime();

            this.hero.group.rotation.y=

            t*.18;

            this.hero.group.rotation.x=

            Math.sin(

                t*.25

            )*.12;

            this.hero.meshes.forEach(

                (mesh,index)=>{

                    mesh.position.y+=

                    Math.sin(

                        t+

                        index

                    )*

                    .0008;

                }

            );

        }

    );

};

/*==================================================
READY
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        ThreeEngine.createIcosahedron();

        ThreeEngine.createRing();

        ThreeEngine.createOrbs();

        ThreeEngine.addHero();

        ThreeEngine.animateHero();

        Log.info(

            "Floating Geometry Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    THREE.JS
    PART 04 — POST PROCESSING & CINEMATIC RENDER PIPELINE

======================================================================*/

/*==================================================
COMPOSER
==================================================*/

ThreeEngine.post={

    composer:null,

    renderPass:null,

    bloom:null,

    dof:null,

    fxaa:null,

    vignette:null

};

/*==================================================
CHECK
==================================================*/

ThreeEngine.hasPost=function(){

    return(

        typeof EffectComposer!=="undefined"&&

        typeof RenderPass!=="undefined"

    );

};

/*==================================================
COMPOSER
==================================================*/

ThreeEngine.createComposer=function(){

    if(

        !this.hasPost()

    ) return;

    this.post.composer=

    new EffectComposer(

        this.renderer

    );

};

/*==================================================
RENDER PASS
==================================================*/

ThreeEngine.renderPass=function(){

    this.post.renderPass=

    new RenderPass(

        this.scene,

        this.camera

    );

    this.post.composer.addPass(

        this.post.renderPass

    );

};

/*==================================================
BLOOM
==================================================*/

ThreeEngine.bloom=function(){

    if(

        typeof UnrealBloomPass===

        "undefined"

    ) return;

    this.post.bloom=

    new UnrealBloomPass(

        new THREE.Vector2(

            innerWidth,

            innerHeight

        ),

        .65,

        .45,

        .9

    );

    this.post.composer.addPass(

        this.post.bloom

    );

};

/*==================================================
DEPTH OF FIELD
==================================================*/

ThreeEngine.depthOfField=function(){

    if(

        typeof BokehPass===

        "undefined"

    ) return;

    this.post.dof=

    new BokehPass(

        this.scene,

        this.camera,

        {

            focus:6,

            aperture:.00012,

            maxblur:.01

        }

    );

    this.post.composer.addPass(

        this.post.dof

    );

};

/*==================================================
FXAA
==================================================*/

ThreeEngine.fxaa=function(){

    if(

        typeof ShaderPass===

        "undefined"||

        typeof FXAAShader===

        "undefined"

    ) return;

    this.post.fxaa=

    new ShaderPass(

        FXAAShader

    );

    this.post.fxaa.material

    .uniforms

    .resolution.value.set(

        1/

        (

            innerWidth*

            this.sizes.pixelRatio

        ),

        1/

        (

            innerHeight*

            this.sizes.pixelRatio

        )

    );

    this.post.composer.addPass(

        this.post.fxaa

    );

};

/*==================================================
RESIZE
==================================================*/

ThreeEngine.resizeComposer=function(){

    if(

        !this.post.composer

    ) return;

    this.post.composer.setSize(

        innerWidth,

        innerHeight

    );

};

/*==================================================
READY
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        ThreeEngine.createComposer();

        ThreeEngine.renderPass();

        ThreeEngine.bloom();

        ThreeEngine.depthOfField();

        ThreeEngine.fxaa();

        Log.info(

            "Post Processing Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    THREE.JS
    PART 05 — RENDER LOOP, MOUSE INTERACTION & PERFORMANCE

======================================================================*/

/*==================================================
TARGET
==================================================*/

ThreeEngine.target={

    x:0,

    y:0

};

/*==================================================
MOUSE
==================================================*/

ThreeEngine.mouseEvents=function(){

    window.addEventListener(

        "pointermove",

        event=>{

            this.mouse.x=

            (

                event.clientX/

                innerWidth

            )*2-1;

            this.mouse.y=

            -(

                event.clientY/

                innerHeight

            )*2+1;

            this.target.x=

            this.mouse.x*.35;

            this.target.y=

            this.mouse.y*.25;

        },

        {

            passive:true

        }

    );

};

/*==================================================
CAMERA MOTION
==================================================*/

ThreeEngine.cameraMotion=function(){

    gsap.ticker.add(

        ()=>{

            this.camera.position.x+=

            (

                this.target.x-

                this.camera.position.x

            )*.05;

            this.camera.position.y+=

            (

                this.target.y-

                this.camera.position.y

            )*.05;

            this.camera.lookAt(

                0,

                0,

                0

            );

        }

    );

};

/*==================================================
RENDER
==================================================*/

ThreeEngine.render=function(){

    const elapsed=

    this.clock.getElapsedTime();

    this.mixers.forEach(

        mixer=>{

            mixer.update(

                this.clock.getDelta()

            );

        }

    );

    if(

        this.post.composer

    ){

        this.post.composer.render(

            elapsed

        );

    }

    else{

        this.renderer.render(

            this.scene,

            this.camera

        );

    }

};

/*==================================================
LOOP
==================================================*/

ThreeEngine.animate=function(){

    this.render();

    requestAnimationFrame(

        this.animate.bind(

            this

        )

    );

};

/*==================================================
RESIZE
==================================================*/

ThreeEngine.resize=function(){

    this.sizes.width=

    innerWidth;

    this.sizes.height=

    innerHeight;

    this.camera.aspect=

    this.sizes.width/

    this.sizes.height;

    this.camera.updateProjectionMatrix();

    this.renderer.setSize(

        this.sizes.width,

        this.sizes.height

    );

    this.renderer.setPixelRatio(

        Math.min(

            devicePixelRatio,

            2

        )

    );

    this.resizeComposer();

};

/*==================================================
VISIBILITY
==================================================*/

ThreeEngine.visibility=function(){

    document.addEventListener(

        "visibilitychange",

        ()=>{

            if(

                document.hidden

            ){

                gsap.ticker.sleep();

            }

            else{

                gsap.ticker.wake();

            }

        }

    );

};

/*==================================================
READY
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        ThreeEngine.mouseEvents();

        ThreeEngine.cameraMotion();

        ThreeEngine.visibility();

        ThreeEngine.animate();

        window.addEventListener(

            "resize",

            Utilities.debounce(

                ()=>{

                    ThreeEngine.resize();

                },

                200

            )

        );

        Log.info(

            "Three Render Engine Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    THREE.JS
    PART 06 — CUSTOM SHADERS & MATERIAL ENGINE

======================================================================*/

/*==================================================
SHADERS
==================================================*/

ThreeEngine.shaders={

    materials:[],

    uniforms:{

        uTime:{value:0},

        uMouse:{

            value:

            new THREE.Vector2()

        },

        uResolution:{

            value:

            new THREE.Vector2(

                innerWidth,

                innerHeight

            )

        }

    }

};

/*==================================================
VERTEX
==================================================*/

ThreeEngine.vertexShader=`

varying vec2 vUv;

uniform float uTime;

void main(){

vUv=uv;

vec3 pos=position;

pos.z+=

sin(

pos.x*3.0+

uTime

)*0.08;

gl_Position=

projectionMatrix*

modelViewMatrix*

vec4(pos,1.0);

}

`;

/*==================================================
FRAGMENT
==================================================*/

ThreeEngine.fragmentShader=`

varying vec2 vUv;

uniform float uTime;

void main(){

vec3 c1=

vec3(

0.40,

0.65,

1.0

);

vec3 c2=

vec3(

0.55,

0.20,

1.0

);

float wave=

sin(

vUv.y*8.0+

uTime

)*0.5+

0.5;

vec3 color=

mix(

c1,

c2,

wave

);

gl_FragColor=

vec4(

color,

0.85

);

}

`;

/*==================================================
CREATE
==================================================*/

ThreeEngine.createShaderMaterial=

function(){

    const material=

    new THREE.ShaderMaterial({

        transparent:true,

        uniforms:

        this.shaders.uniforms,

        vertexShader:

        this.vertexShader,

        fragmentShader:

        this.fragmentShader

    });

    this.shaders.materials.push(

        material

    );

    return material;

};

/*==================================================
PLANE
==================================================*/

ThreeEngine.shaderPlane=function(){

    const mesh=

    new THREE.Mesh(

        new THREE.PlaneGeometry(

            8,

            8,

            120,

            120

        ),

        this.createShaderMaterial()

    );

    mesh.position.z=

    -5;

    this.scene.add(

        mesh

    );

};

/*==================================================
UPDATE
==================================================*/

ThreeEngine.updateShaders=function(){

    gsap.ticker.add(

        ()=>{

            this.shaders

            .uniforms

            .uTime.value=

            this.clock

            .getElapsedTime();

            this.shaders

            .uniforms

            .uMouse.value.set(

                this.mouse.x,

                this.mouse.y

            );

        }

    );

};

/*==================================================
READY
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        ThreeEngine.shaderPlane();

        ThreeEngine.updateShaders();

        Log.info(

            "Shader Engine Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    THREE.JS
    PART 07 — CAMERA RIG, PARALLAX & CINEMATIC MOVEMENT

======================================================================*/

/*==================================================
RIG
==================================================*/

ThreeEngine.rig={

    group:new THREE.Group(),

    target:new THREE.Vector3(),

    enabled:true

};

/*==================================================
CREATE
==================================================*/

ThreeEngine.createRig=function(){

    this.rig.group.add(

        this.camera

    );

    this.scene.add(

        this.rig.group

    );

};

/*==================================================
PARALLAX
==================================================*/

ThreeEngine.parallax=function(){

    window.addEventListener(

        "pointermove",

        event=>{

            this.rig.target.x=

            (

                event.clientX/

                innerWidth-.5

            )*.6;

            this.rig.target.y=

            (

                event.clientY/

                innerHeight-.5

            )*-.35;

        },

        {

            passive:true

        }

    );

};

/*==================================================
SMOOTH
==================================================*/

ThreeEngine.updateRig=function(){

    gsap.ticker.add(

        ()=>{

            this.rig.group.position.x+=

            (

                this.rig.target.x-

                this.rig.group.position.x

            )*.04;

            this.rig.group.position.y+=

            (

                this.rig.target.y-

                this.rig.group.position.y

            )*.04;

        }

    );

};

/*==================================================
FLOAT
==================================================*/

ThreeEngine.cameraFloat=function(){

    gsap.ticker.add(

        ()=>{

            const t=

            this.clock

            .getElapsedTime();

            this.camera.position.z=

            8+

            Math.sin(

                t*.45

            )*.15;

            this.camera.rotation.z=

            Math.sin(

                t*.22

            )*.01;

        }

    );

};

/*==================================================
SCROLL MOTION
==================================================*/

ThreeEngine.scrollCamera=function(){

    if(

        typeof ScrollTrigger===

        "undefined"

    ) return;

    gsap.to(

        this.camera.position,

        {

            z:6,

            scrollTrigger:{

                trigger:"body",

                start:"top top",

                end:"bottom bottom",

                scrub:true

            }

        }

    );

};

/*==================================================
LOOK TARGET
==================================================*/

ThreeEngine.lookTarget=function(){

    gsap.ticker.add(

        ()=>{

            this.camera.lookAt(

                0,

                0,

                0

            );

        }

    );

};

/*==================================================
READY
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        ThreeEngine.createRig();

        ThreeEngine.parallax();

        ThreeEngine.updateRig();

        ThreeEngine.cameraFloat();

        ThreeEngine.scrollCamera();

        ThreeEngine.lookTarget();

        Log.info(

            "Camera Rig Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    THREE.JS
    PART 08 — INTERACTION, RAYCASTING & OBJECT CONTROLS

======================================================================*/

/*==================================================
INTERACTION
==================================================*/

ThreeEngine.interaction={

    hovered:null,

    selected:null,

    clickable:[]

};

/*==================================================
REGISTER
==================================================*/

ThreeEngine.registerInteractive=function(

    object

){

    if(

        !object

    ) return;

    this.interaction

    .clickable.push(

        object

    );

};

/*==================================================
RAYCAST
==================================================*/

ThreeEngine.raycast=function(){

    this.raycaster.setFromCamera(

        this.mouse,

        this.camera

    );

    const hits=

    this.raycaster

    .intersectObjects(

        this.interaction

        .clickable,

        true

    );

    if(

        hits.length

    ){

        this.hover(

            hits[0].object

        );

    }

    else{

        this.unhover();

    }

};

/*==================================================
HOVER
==================================================*/

ThreeEngine.hover=function(

    object

){

    if(

        this.interaction

        .hovered===object

    ) return;

    this.unhover();

    this.interaction

    .hovered=object;

    gsap.to(

        object.scale,

        {

            x:1.08,

            y:1.08,

            z:1.08,

            duration:.35,

            ease:"power3.out"

        }

    );

};

/*==================================================
UNHOVER
==================================================*/

ThreeEngine.unhover=function(){

    const object=

    this.interaction

    .hovered;

    if(

        !object

    ) return;

    gsap.to(

        object.scale,

        {

            x:1,

            y:1,

            z:1,

            duration:.35,

            ease:"power2.out"

        }

    );

    this.interaction

    .hovered=null;

};

/*==================================================
CLICK
==================================================*/

ThreeEngine.click=function(){

    window.addEventListener(

        "pointerdown",

        ()=>{

            this.raycaster

            .setFromCamera(

                this.mouse,

                this.camera

            );

            const hits=

            this.raycaster

            .intersectObjects(

                this.interaction

                .clickable,

                true

            );

            if(

                !hits.length

            ) return;

            this.interaction

            .selected=

            hits[0].object;

            EVENTS.emit(

                "three:select",

                this.interaction

                .selected

            );

        }

    );

};

/*==================================================
OUTLINE
==================================================*/

ThreeEngine.outline=function(){

    EVENTS.on(

        "three:select",

        object=>{

            gsap.fromTo(

                object.material,

                {

                    emissiveIntensity:

                    .4

                },

                {

                    emissiveIntensity:

                    2,

                    duration:.6,

                    yoyo:true,

                    repeat:1

                }

            );

        }

    );

};

/*==================================================
UPDATE
==================================================*/

ThreeEngine.updateInteraction=function(){

    gsap.ticker.add(

        ()=>{

            this.raycast();

        }

    );

};

/*==================================================
READY
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        ThreeEngine.hero

        .meshes.forEach(

            mesh=>{

                ThreeEngine

                .registerInteractive(

                    mesh

                );

            }

        );

        ThreeEngine.click();

        ThreeEngine.outline();

        ThreeEngine.updateInteraction();

        Log.info(

            "Three Interaction Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    THREE.JS
    PART 09 — PERFORMANCE OPTIMIZER & RESOURCE MANAGER

======================================================================*/

/*==================================================
PERFORMANCE
==================================================*/

ThreeEngine.performance={

    fps:60,

    adaptive:true,

    quality:"ultra",

    frame:0,

    last:performance.now()

};

/*==================================================
FPS
==================================================*/

ThreeEngine.monitorFPS=function(){

    gsap.ticker.add(

        ()=>{

            this.performance.frame++;

            const now=

            performance.now();

            if(

                now-

                this.performance.last>=

                1000

            ){

                this.performance.fps=

                this.performance.frame;

                this.performance.frame=0;

                this.performance.last=now;

                EVENTS.emit(

                    "three:fps",

                    this.performance.fps

                );

            }

        }

    );

};

/*==================================================
ADAPTIVE QUALITY
==================================================*/

ThreeEngine.optimize=function(){

    EVENTS.on(

        "three:fps",

        fps=>{

            if(

                !this.performance

                .adaptive

            ) return;

            if(

                fps<45&&

                this.performance

                .quality==="ultra"

            ){

                this.performance

                .quality="high";

                this.renderer

                .setPixelRatio(

                    1.5

                );

            }

            if(

                fps<30

            ){

                this.performance

                .quality="medium";

                this.renderer

                .setPixelRatio(

                    1

                );

            }

        }

    );

};

/*==================================================
TEXTURES
==================================================*/

ThreeEngine.disposeTextures=function(){

    this.scene.traverse(

        object=>{

            if(

                object.material&&

                object.material.map

            ){

                object.material

                .map.dispose();

            }

        }

    );

};

/*==================================================
GEOMETRIES
==================================================*/

ThreeEngine.disposeGeometry=function(){

    this.scene.traverse(

        object=>{

            object.geometry

            ?.dispose();

        }

    );

};

/*==================================================
MATERIALS
==================================================*/

ThreeEngine.disposeMaterials=function(){

    this.scene.traverse(

        object=>{

            if(

                Array.isArray(

                    object.material

                )

            ){

                object.material

                .forEach(

                    material=>

                    material.dispose()

                );

            }

            else{

                object.material

                ?.dispose();

            }

        }

    );

};

/*==================================================
DESTROY
==================================================*/

ThreeEngine.destroy=function(){

    this.disposeTextures();

    this.disposeGeometry();

    this.disposeMaterials();

    this.renderer

    ?.dispose();

    this.post

    .composer

    ?.dispose();

};

/*==================================================
READY
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        ThreeEngine.monitorFPS();

        ThreeEngine.optimize();

        Log.info(

            "Three Performance Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    THREE.JS
    PART 10 — FINALIZATION, DEBUG & EXPORT ENGINE

======================================================================*/

/*==================================================
DEBUG
==================================================*/

ThreeEngine.debug={

    enabled:false,

    axes:null,

    grid:null

};

/*==================================================
AXES
==================================================*/

ThreeEngine.axes=function(){

    this.debug.axes=

    new THREE.AxesHelper(

        5

    );

    this.debug.axes.visible=

    false;

    this.scene.add(

        this.debug.axes

    );

};

/*==================================================
GRID
==================================================*/

ThreeEngine.grid=function(){

    this.debug.grid=

    new THREE.GridHelper(

        20,

        20,

        0x444444,

        0x222222

    );

    this.debug.grid.visible=

    false;

    this.scene.add(

        this.debug.grid

    );

};

/*==================================================
TOGGLE DEBUG
==================================================*/

ThreeEngine.toggleDebug=function(){

    this.debug.enabled=

    !this.debug.enabled;

    if(

        this.debug.axes

    ){

        this.debug.axes.visible=

        this.debug.enabled;

    }

    if(

        this.debug.grid

    ){

        this.debug.grid.visible=

        this.debug.enabled;

    }

};

/*==================================================
SHORTCUT
==================================================*/

ThreeEngine.shortcuts=function(){

    window.addEventListener(

        "keydown",

        event=>{

            if(

                event.ctrlKey&&

                event.shiftKey&&

                event.key==="T"

            ){

                this.toggleDebug();

            }

        }

    );

};

/*==================================================
SCREENSHOT
==================================================*/

ThreeEngine.capture=function(){

    return this.renderer

    .domElement

    .toDataURL(

        "image/png"

    );

};

/*==================================================
INFO
==================================================*/

ThreeEngine.info=function(){

    return{

        renderer:

        this.renderer.info,

        objects:

        this.scene.children

        .length,

        triangles:

        this.renderer.info

        .render.triangles,

        textures:

        this.renderer.info

        .memory.textures,

        geometries:

        this.renderer.info

        .memory.geometries

    };

};

/*==================================================
VERSION
==================================================*/

ThreeEngine.version={

    module:

    "Three.js",

    version:

    "1.0.0",

    build:

    "2026.08",

    renderer:

    THREE.REVISION,

    author:

    "Director VISION"

};

/*==================================================
EXPORT
==================================================*/

window.$three=

Object.freeze({

    engine:

    ThreeEngine,

    scene:

    ()=>ThreeEngine.scene,

    camera:

    ()=>ThreeEngine.camera,

    renderer:

    ()=>ThreeEngine.renderer,

    info:

    ()=>ThreeEngine.info(),

    screenshot:

    ()=>ThreeEngine.capture()

});

/*==================================================
READY
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        ThreeEngine.axes();

        ThreeEngine.grid();

        ThreeEngine.shortcuts();

        Log.success(

            "Three.js Module Complete"

        );

    }

);

/*==================================================
MODULE COMPLETE
==================================================*/

EVENTS.emit(

    "three:initialized"

);

/*==================================================
THREE.JS COMPLETE
==================================================*/

Log.success(

`
═══════════════════════════════════════════════

 Director VISION
 Luxury Cinematic Portfolio

 THREE.JS BUILD COMPLETE

 Version : 1.0.0
 Build   : 2026.08

 Modules Included

 ✓ Core Engine
 ✓ HDRI Environment
 ✓ Cinematic Lighting
 ✓ Floating Geometry
 ✓ Hero Objects
 ✓ Shader Materials
 ✓ Camera Rig
 ✓ Raycasting
 ✓ Post Processing
 ✓ Performance Optimizer
 ✓ Debug Tools
 ✓ Screenshot API

═══════════════════════════════════════════════
`
);
