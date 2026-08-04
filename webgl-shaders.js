/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    WEBGL-SHADERS.JS
    PART 01 — GLSL SHADER CORE ENGINE

======================================================================*/

const ShaderEngine={

    initialized:false,

    shaders:{},

    materials:[],

    uniforms:{

        uTime:{

            value:0

        },

        uDelta:{

            value:0

        },

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

        },

        uScroll:{

            value:0

        },

        uProgress:{

            value:0

        }

    },

    clock:new THREE.Clock()

};

/*==================================================
UPDATE
==================================================*/

ShaderEngine.update=function(){

    gsap.ticker.add(

        ()=>{

            const delta=

            this.clock.getDelta();

            this.uniforms

            .uDelta.value=

            delta;

            this.uniforms

            .uTime.value+=

            delta;

        }

    );

};

/*==================================================
MOUSE
==================================================*/

ShaderEngine.mouse=function(){

    window.addEventListener(

        "pointermove",

        event=>{

            this.uniforms

            .uMouse.value.set(

                event.clientX/

                innerWidth,

                1-

                event.clientY/

                innerHeight

            );

        },

        {

            passive:true

        }

    );

};

/*==================================================
RESOLUTION
==================================================*/

ShaderEngine.resize=function(){

    window.addEventListener(

        "resize",

        Utilities.debounce(

            ()=>{

                this.uniforms

                .uResolution.value.set(

                    innerWidth,

                    innerHeight

                );

            },

            120

        )

    );

};

/*==================================================
SCROLL
==================================================*/

ShaderEngine.scroll=function(){

    EVENTS.on(

        "scroll:update",

        scroll=>{

            this.uniforms

            .uScroll.value=

            scroll.progress||

            0;

        }

    );

};

/*==================================================
REGISTER
==================================================*/

ShaderEngine.register=function(

    name,

    material

){

    this.shaders[name]=

    material;

    this.materials.push(

        material

    );

};

/*==================================================
GET
==================================================*/

ShaderEngine.get=function(name){

    return this.shaders[name];

};

/*==================================================
READY
==================================================*/

ShaderEngine.init=async function(){

    this.update();

    this.mouse();

    this.resize();

    this.scroll();

    this.initialized=true;

    Log.info(

        "Shader Engine Ready"

    );

};

/*==================================================
REGISTER
==================================================*/

registerModule(

    "ShaderEngine",

    ShaderEngine

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    WEBGL-SHADERS.JS
    PART 02 — AURORA SHADER

======================================================================*/

/*==================================================
VERTEX
==================================================*/

ShaderEngine.AuroraVertex=`

varying vec2 vUv;

void main(){

    vUv=uv;

    gl_Position=

    projectionMatrix*

    modelViewMatrix*

    vec4(position,1.0);

}

`;

/*==================================================
FRAGMENT
==================================================*/

ShaderEngine.AuroraFragment=`

uniform float uTime;

uniform vec2 uMouse;

varying vec2 vUv;

float random(vec2 p){

    return fract(

        sin(

            dot(

                p,

                vec2(

                    127.1,

                    311.7

                )

            )

        )*

        43758.5453123

    );

}

float noise(vec2 p){

    vec2 i=floor(p);

    vec2 f=fract(p);

    vec2 u=f*f*(3.0-2.0*f);

    return mix(

        mix(

            random(i),

            random(i+vec2(1.,0.)),

            u.x

        ),

        mix(

            random(i+vec2(0.,1.)),

            random(i+vec2(1.,1.)),

            u.x

        ),

        u.y

    );

}

void main(){

    vec2 uv=vUv;

    float n=

    noise(

        uv*5.0+

        uTime*.08

    );

    float wave=

    sin(

        uv.y*10.0+

        uTime+

        n*4.0

    );

    vec3 c1=

    vec3(

        .18,

        .52,

        1.0

    );

    vec3 c2=

    vec3(

        .65,

        .15,

        1.0

    );

    vec3 c3=

    vec3(

        .20,

        1.0,

        .80

    );

    vec3 color=

    mix(

        c1,

        c2,

        wave*.5+.5

    );

    color=

    mix(

        color,

        c3,

        n*.5

    );

    float alpha=

    smoothstep(

        0.,

        .8,

        n

    );

    gl_FragColor=

    vec4(

        color,

        alpha*.75

    );

}

`;

/*==================================================
CREATE
==================================================*/

ShaderEngine.createAurora=function(){

    const material=

    new THREE.ShaderMaterial({

        transparent:true,

        depthWrite:false,

        blending:

        THREE.AdditiveBlending,

        uniforms:

        ShaderEngine.uniforms,

        vertexShader:

        ShaderEngine

        .AuroraVertex,

        fragmentShader:

        ShaderEngine

        .AuroraFragment

    });

    ShaderEngine.register(

        "aurora",

        material

    );

    return material;

};

/*==================================================
READY
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        ShaderEngine.createAurora();

        Log.info(

            "Aurora Shader Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    WEBGL-SHADERS.JS
    PART 03 — LIQUID GLASS SHADER

======================================================================*/

/*==================================================
VERTEX
==================================================*/

ShaderEngine.LiquidGlassVertex=`

varying vec2 vUv;

varying vec3 vNormal;

varying vec3 vPosition;

void main(){

    vUv=uv;

    vNormal=

    normalize(

        normalMatrix*

        normal

    );

    vec4 world=

    modelMatrix*

    vec4(

        position,

        1.0

    );

    vPosition=

    world.xyz;

    gl_Position=

    projectionMatrix*

    viewMatrix*

    world;

}

`;

/*==================================================
FRAGMENT
==================================================*/

ShaderEngine.LiquidGlassFragment=`

uniform float uTime;

uniform vec2 uMouse;

varying vec2 vUv;

varying vec3 vNormal;

varying vec3 vPosition;

void main(){

    vec2 uv=vUv;

    uv+=

    sin(

        uv.yx*12.0+

        uTime

    )*0.015;

    vec3 viewDir=

    normalize(

        cameraPosition-

        vPosition

    );

    float fresnel=

    pow(

        1.0-

        max(

            dot(

                viewDir,

                normalize(

                    vNormal

                )

            ),

            0.0

        ),

        3.0

    );

    vec3 base=

    vec3(

        0.92,

        0.96,

        1.0

    );

    vec3 tint=

    vec3(

        0.42,

        0.70,

        1.0

    );

    vec3 color=

    mix(

        base,

        tint,

        fresnel

    );

    color+=

    fresnel*

    .35;

    float alpha=

    .22+

    fresnel*

    .55;

    gl_FragColor=

    vec4(

        color,

        alpha

    );

}

`;

/*==================================================
CREATE
==================================================*/

ShaderEngine.createLiquidGlass=

function(){

    const material=

    new THREE.ShaderMaterial({

        transparent:true,

        depthWrite:false,

        side:

        THREE.DoubleSide,

        uniforms:

        ShaderEngine.uniforms,

        vertexShader:

        ShaderEngine

        .LiquidGlassVertex,

        fragmentShader:

        ShaderEngine

        .LiquidGlassFragment

    });

    ShaderEngine.register(

        "liquidGlass",

        material

    );

    return material;

};

/*==================================================
READY
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        ShaderEngine

        .createLiquidGlass();

        Log.info(

            "Liquid Glass Shader Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    WEBGL-SHADERS.JS
    PART 04 — HOLOGRAM SHADER

======================================================================*/

/*==================================================
VERTEX
==================================================*/

ShaderEngine.HologramVertex=`

uniform float uTime;

varying vec2 vUv;

varying float vElevation;

void main(){

    vUv=uv;

    vec3 pos=position;

    float wave=

    sin(

        pos.y*8.0+

        uTime*3.0

    )*0.03;

    pos.x+=wave;

    pos.z+=wave;

    vElevation=wave;

    gl_Position=

    projectionMatrix*

    modelViewMatrix*

    vec4(

        pos,

        1.0

    );

}

`;

/*==================================================
FRAGMENT
==================================================*/

ShaderEngine.HologramFragment=`

uniform float uTime;

varying vec2 vUv;

varying float vElevation;

void main(){

    vec2 uv=vUv;

    float scan=

    sin(

        uv.y*900.0+

        uTime*18.0

    )*0.5+

    0.5;

    float glow=

    smoothstep(

        0.2,

        1.0,

        scan

    );

    float grid=

    step(

        0.98,

        fract(

            uv.x*45.0

        )

    )+

    step(

        0.98,

        fract(

            uv.y*45.0

        )

    );

    vec3 cyan=

    vec3(

        0.15,

        0.95,

        1.0

    );

    vec3 blue=

    vec3(

        0.35,

        0.55,

        1.0

    );

    vec3 color=

    mix(

        cyan,

        blue,

        uv.y

    );

    color+=

    glow*.25;

    color+=

    grid*.2;

    color+=

    abs(

        vElevation

    )*4.0;

    float alpha=

    .28+

    glow*.45+

    grid*.15;

    gl_FragColor=

    vec4(

        color,

        alpha

    );

}

`;

/*==================================================
CREATE
==================================================*/

ShaderEngine.createHologram=

function(){

    const material=

    new THREE.ShaderMaterial({

        transparent:true,

        side:

        THREE.DoubleSide,

        depthWrite:false,

        blending:

        THREE.AdditiveBlending,

        uniforms:

        ShaderEngine.uniforms,

        vertexShader:

        ShaderEngine

        .HologramVertex,

        fragmentShader:

        ShaderEngine

        .HologramFragment

    });

    ShaderEngine.register(

        "hologram",

        material

    );

    return material;

};

/*==================================================
READY
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        ShaderEngine

        .createHologram();

        Log.info(

            "Hologram Shader Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    WEBGL-SHADERS.JS
    PART 05 — ENERGY WAVE SHADER

======================================================================*/

/*==================================================
VERTEX
==================================================*/

ShaderEngine.EnergyWaveVertex=`

uniform float uTime;

varying vec2 vUv;

varying float vWave;

void main(){

    vUv=uv;

    vec3 pos=position;

    float wave=

    sin(

        pos.x*8.0+

        uTime*2.5

    )*

    cos(

        pos.y*8.0+

        uTime*2.0

    )*

    0.12;

    pos.z+=wave;

    vWave=wave;

    gl_Position=

    projectionMatrix*

    modelViewMatrix*

    vec4(

        pos,

        1.0

    );

}

`;

/*==================================================
FRAGMENT
==================================================*/

ShaderEngine.EnergyWaveFragment=`

uniform float uTime;

uniform vec2 uMouse;

varying vec2 vUv;

varying float vWave;

void main(){

    vec2 uv=vUv;

    vec2 center=

    uMouse;

    float dist=

    distance(

        uv,

        center

    );

    float rings=

    sin(

        dist*45.0-

        uTime*8.0

    );

    float glow=

    smoothstep(

        0.8,

        1.0,

        rings

    );

    vec3 blue=

    vec3(

        0.12,

        0.65,

        1.0

    );

    vec3 purple=

    vec3(

        0.55,

        0.18,

        1.0

    );

    vec3 cyan=

    vec3(

        0.25,

        1.0,

        0.95

    );

    vec3 color=

    mix(

        blue,

        purple,

        uv.y

    );

    color=

    mix(

        color,

        cyan,

        glow

    );

    color+=

    abs(

        vWave

    )*3.5;

    float alpha=

    .35+

    glow*.45;

    gl_FragColor=

    vec4(

        color,

        alpha

    );

}

`;

/*==================================================
CREATE
==================================================*/

ShaderEngine.createEnergyWave=

function(){

    const material=

    new THREE.ShaderMaterial({

        transparent:true,

        side:

        THREE.DoubleSide,

        blending:

        THREE.AdditiveBlending,

        depthWrite:false,

        uniforms:

        ShaderEngine.uniforms,

        vertexShader:

        ShaderEngine

        .EnergyWaveVertex,

        fragmentShader:

        ShaderEngine

        .EnergyWaveFragment

    });

    ShaderEngine.register(

        "energyWave",

        material

    );

    return material;

};

/*==================================================
READY
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        ShaderEngine

        .createEnergyWave();

        Log.info(

            "Energy Wave Shader Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    WEBGL-SHADERS.JS
    PART 06 — CHROMATIC ABERRATION SHADER

======================================================================*/

/*==================================================
VERTEX
==================================================*/

ShaderEngine.ChromaticVertex=`

varying vec2 vUv;

void main(){

    vUv=uv;

    gl_Position=

    projectionMatrix*

    modelViewMatrix*

    vec4(

        position,

        1.0

    );

}

`;

/*==================================================
FRAGMENT
==================================================*/

ShaderEngine.ChromaticFragment=`

uniform float uTime;

uniform vec2 uMouse;

varying vec2 vUv;

void main(){

    vec2 uv=vUv;

    vec2 center=

    uMouse;

    vec2 dir=

    uv-center;

    float dist=

    length(dir);

    vec2 offset=

    normalize(dir)*

    dist*

    0.015;

    vec3 red=

    vec3(

        1.0,

        0.15,

        0.35

    );

    vec3 green=

    vec3(

        0.15,

        1.0,

        0.85

    );

    vec3 blue=

    vec3(

        0.20,

        0.45,

        1.0

    );

    float pulse=

    sin(

        uTime*3.0+

        dist*30.0

    )*.5+.5;

    vec3 color=

    red*

    smoothstep(

        .0,

        .4,

        length(

            uv+offset

        )

    );

    color+=

    green*

    smoothstep(

        .0,

        .4,

        length(

            uv

        )

    );

    color+=

    blue*

    smoothstep(

        .0,

        .4,

        length(

            uv-offset

        )

    );

    color*=

    .45+

    pulse*.55;

    float alpha=

    .28+

    pulse*.25;

    gl_FragColor=

    vec4(

        color,

        alpha

    );

}

`;

/*==================================================
CREATE
==================================================*/

ShaderEngine.createChromatic=

function(){

    const material=

    new THREE.ShaderMaterial({

        transparent:true,

        depthWrite:false,

        blending:

        THREE.AdditiveBlending,

        uniforms:

        ShaderEngine.uniforms,

        vertexShader:

        ShaderEngine

        .ChromaticVertex,

        fragmentShader:

        ShaderEngine

        .ChromaticFragment

    });

    ShaderEngine.register(

        "chromatic",

        material

    );

    return material;

};

/*==================================================
READY
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        ShaderEngine

        .createChromatic();

        Log.info(

            "Chromatic Shader Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    WEBGL-SHADERS.JS
    PART 07 — REFRACTION & DISPERSION SHADER

======================================================================*/

/*==================================================
VERTEX
==================================================*/

ShaderEngine.RefractionVertex=`

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;

void main(){

    vUv=uv;

    vNormal=

    normalize(

        normalMatrix*

        normal

    );

    vec4 worldPosition=

    modelMatrix*

    vec4(

        position,

        1.0

    );

    vWorldPosition=

    worldPosition.xyz;

    gl_Position=

    projectionMatrix*

    viewMatrix*

    worldPosition;

}

`;

/*==================================================
FRAGMENT
==================================================*/

ShaderEngine.RefractionFragment=`

uniform float uTime;
uniform vec2 uMouse;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;

void main(){

    vec3 viewDir=

    normalize(

        cameraPosition-

        vWorldPosition

    );

    float fresnel=

    pow(

        1.0-

        max(

            dot(

                viewDir,

                normalize(

                    vNormal

                )

            ),

            0.0

        ),

        4.0

    );

    vec2 distortion=

    sin(

        vUv*20.0+

        uTime

    )*

    0.02;

    vec3 red=

    vec3(

        1.0,

        .35,

        .35

    );

    vec3 green=

    vec3(

        .45,

        1.0,

        .85

    );

    vec3 blue=

    vec3(

        .35,

        .65,

        1.0

    );

    vec3 color=

    mix(

        red,

        blue,

        vUv.y+

        distortion.x

    );

    color=

    mix(

        color,

        green,

        fresnel

    );

    color+=

    fresnel*

    .45;

    float alpha=

    .20+

    fresnel*

    .65;

    gl_FragColor=

    vec4(

        color,

        alpha

    );

}

`;

/*==================================================
CREATE
==================================================*/

ShaderEngine.createRefraction=

function(){

    const material=

    new THREE.ShaderMaterial({

        transparent:true,

        side:

        THREE.DoubleSide,

        depthWrite:false,

        blending:

        THREE.AdditiveBlending,

        uniforms:

        ShaderEngine.uniforms,

        vertexShader:

        ShaderEngine

        .RefractionVertex,

        fragmentShader:

        ShaderEngine

        .RefractionFragment

    });

    ShaderEngine.register(

        "refraction",

        material

    );

    return material;

};

/*==================================================
READY
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        ShaderEngine

        .createRefraction();

        Log.info(

            "Refraction Shader Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    WEBGL-SHADERS.JS
    PART 08 — DISSOLVE & ENERGY PARTICLE SHADER

======================================================================*/

/*==================================================
VERTEX
==================================================*/

ShaderEngine.DissolveVertex=`

varying vec2 vUv;
varying vec3 vPosition;

void main(){

    vUv=uv;

    vPosition=position;

    gl_Position=

    projectionMatrix*

    modelViewMatrix*

    vec4(

        position,

        1.0

    );

}

`;

/*==================================================
FRAGMENT
==================================================*/

ShaderEngine.DissolveFragment=`

uniform float uTime;
uniform float uProgress;

varying vec2 vUv;
varying vec3 vPosition;

float hash(vec2 p){

    return fract(

        sin(

            dot(

                p,

                vec2(

                    12.9898,

                    78.233

                )

            )

        )*

        43758.5453

    );

}

float noise(vec2 p){

    vec2 i=floor(p);

    vec2 f=fract(p);

    float a=hash(i);

    float b=hash(i+vec2(1.,0.));

    float c=hash(i+vec2(0.,1.));

    float d=hash(i+vec2(1.,1.));

    vec2 u=

    f*f*(3.0-2.0*f);

    return mix(

        mix(a,b,u.x),

        mix(c,d,u.x),

        u.y

    );

}

void main(){

    float n=

    noise(

        vUv*8.0+

        uTime*.15

    );

    float edge=

    smoothstep(

        uProgress-.03,

        uProgress+.03,

        n

    );

    float mask=

    step(

        uProgress,

        n

    );

    vec3 glow=

    mix(

        vec3(

            .15,

            .70,

            1.0

        ),

        vec3(

            .85,

            .25,

            1.0

        ),

        edge

    );

    vec3 color=

    glow+

    edge*

    2.5;

    float alpha=

    mask+

    edge*.8;

    gl_FragColor=

    vec4(

        color,

        alpha

    );

}

`;

/*==================================================
CREATE
==================================================*/

ShaderEngine.createDissolve=

function(){

    const material=

    new THREE.ShaderMaterial({

        transparent:true,

        side:

        THREE.DoubleSide,

        depthWrite:false,

        blending:

        THREE.AdditiveBlending,

        uniforms:

        ShaderEngine.uniforms,

        vertexShader:

        ShaderEngine

        .DissolveVertex,

        fragmentShader:

        ShaderEngine

        .DissolveFragment

    });

    ShaderEngine.register(

        "dissolve",

        material

    );

    return material;

};

/*==================================================
ANIMATE
==================================================*/

ShaderEngine.animateDissolve=

function(

    material

){

    gsap.to(

        material.uniforms

        .uProgress,

        {

            value:1,

            duration:3,

            ease:

            "power2.inOut",

            repeat:-1,

            yoyo:true

        }

    );

};

/*==================================================
READY
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        const shader=

        ShaderEngine

        .createDissolve();

        ShaderEngine

        .animateDissolve(

            shader

        );

        Log.info(

            "Dissolve Shader Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    WEBGL-SHADERS.JS
    PART 09 — HEAT DISTORTION & NOISE SHADER

======================================================================*/

/*==================================================
VERTEX
==================================================*/

ShaderEngine.HeatVertex=`

varying vec2 vUv;

void main(){

    vUv=uv;

    gl_Position=

    projectionMatrix*

    modelViewMatrix*

    vec4(

        position,

        1.0

    );

}

`;

/*==================================================
FRAGMENT
==================================================*/

ShaderEngine.HeatFragment=`

uniform float uTime;

varying vec2 vUv;

float hash(vec2 p){

    return fract(

        sin(

            dot(

                p,

                vec2(

                    127.1,

                    311.7

                )

            )

        )*

        43758.5453123

    );

}

float noise(vec2 p){

    vec2 i=floor(p);

    vec2 f=fract(p);

    float a=hash(i);

    float b=hash(i+vec2(1.,0.));

    float c=hash(i+vec2(0.,1.));

    float d=hash(i+vec2(1.,1.));

    vec2 u=

    f*f*

    (3.0-2.0*f);

    return mix(

        mix(a,b,u.x),

        mix(c,d,u.x),

        u.y

    );

}

void main(){

    vec2 uv=vUv;

    float n=

    noise(

        uv*12.0+

        uTime*0.35

    );

    uv+=

    vec2(

        sin(

            uv.y*25.0+

            uTime*4.0

        ),

        cos(

            uv.x*25.0+

            uTime*3.5

        )

    )*

    0.02*

    n;

    vec3 fire=

    mix(

        vec3(

            1.0,

            .45,

            .05

        ),

        vec3(

            .15,

            .55,

            1.0

        ),

        uv.y

    );

    fire+=

    n*.25;

    float alpha=

    .45+

    n*.25;

    gl_FragColor=

    vec4(

        fire,

        alpha

    );

}

`;

/*==================================================
CREATE
==================================================*/

ShaderEngine.createHeat=function(){

    const material=

    new THREE.ShaderMaterial({

        transparent:true,

        depthWrite:false,

        blending:

        THREE.AdditiveBlending,

        uniforms:

        ShaderEngine.uniforms,

        vertexShader:

        ShaderEngine

        .HeatVertex,

        fragmentShader:

        ShaderEngine

        .HeatFragment

    });

    ShaderEngine.register(

        "heat",

        material

    );

    return material;

};

/*==================================================
UPDATE
==================================================*/

ShaderEngine.animateHeat=

function(

    material

){

    gsap.to(

        material.uniforms

        .uTime,

        {

            value:9999,

            duration:9999,

            ease:"none"

        }

    );

};

/*==================================================
READY
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        const shader=

        ShaderEngine

        .createHeat();

        ShaderEngine

        .animateHeat(

            shader

        );

        Log.info(

            "Heat Distortion Shader Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    WEBGL-SHADERS.JS
    PART 10 — FINALIZATION, SHADER LIBRARY & GLOBAL API

======================================================================*/

/*==================================================
VERSION
==================================================*/

ShaderEngine.version={

    module:

    "WebGL Shaders",

    version:

    "1.0.0",

    build:

    "2026.08",

    author:

    "Director VISION"

};

/*==================================================
UPDATE MATERIALS
==================================================*/

ShaderEngine.updateMaterials=

function(){

    gsap.ticker.add(

        ()=>{

            this.materials.forEach(

                material=>{

                    if(

                        material&&

                        material.uniforms&&

                        material.uniforms.uTime

                    ){

                        material.uniforms

                        .uTime.value=

                        this.uniforms

                        .uTime.value;

                    }

                }

            );

        }

    );

};

/*==================================================
DISPOSE
==================================================*/

ShaderEngine.destroy=

function(){

    this.materials.forEach(

        material=>{

            material.dispose();

        }

    );

    this.materials=[];

    this.shaders={};

};

/*==================================================
GET ALL
==================================================*/

ShaderEngine.library=

function(){

    return{

        aurora:

        this.get(

            "aurora"

        ),

        liquidGlass:

        this.get(

            "liquidGlass"

        ),

        hologram:

        this.get(

            "hologram"

        ),

        energyWave:

        this.get(

            "energyWave"

        ),

        chromatic:

        this.get(

            "chromatic"

        ),

        refraction:

        this.get(

            "refraction"

        ),

        dissolve:

        this.get(

            "dissolve"

        ),

        heat:

        this.get(

            "heat"

        )

    };

};

/*==================================================
EXPORT
==================================================*/

window.$shaders=

Object.freeze({

    engine:

    ShaderEngine,

    get:

    name=>

    ShaderEngine.get(

        name

    ),

    library:

    ()=>ShaderEngine

    .library(),

    uniforms:

    ShaderEngine

    .uniforms

});

/*==================================================
READY
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        ShaderEngine

        .updateMaterials();

        Log.success(

            "Shader Library Ready"

        );

    }

);

/*==================================================
MODULE COMPLETE
==================================================*/

EVENTS.emit(

    "shader:initialized"

);

/*==================================================
WEBGL-SHADERS.JS COMPLETE
==================================================*/

Log.success(

`
═══════════════════════════════════════════════

 Director VISION
 Luxury Cinematic Portfolio

 WEBGL-SHADERS.JS BUILD COMPLETE

 Version : 1.0.0
 Build   : 2026.08

 Shader Library

 ✓ Aurora
 ✓ Liquid Glass
 ✓ Hologram
 ✓ Energy Wave
 ✓ Chromatic Aberration
 ✓ Refraction
 ✓ Dissolve
 ✓ Heat Distortion

 Global APIs

 ✓ ShaderEngine
 ✓ $shaders
 ✓ Uniform Manager
 ✓ Material Registry

═══════════════════════════════════════════════
`
);
