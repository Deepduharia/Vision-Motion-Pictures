
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    EFFECTS.JS
    PART 01 — VISUAL EFFECTS CORE ENGINE

======================================================================*/

const Effects={

    initialized:false,

    enabled:true,

    layers:{},

    config:{

        quality:"ultra",

        fps:60,

        dpr:

        Math.min(

            window.devicePixelRatio,

            2

        )

    }

};

/*==================================================
CACHE
==================================================*/

Effects.cache=function(){

    this.layers.wrapper=

    document.querySelector(

        ".effects"

    );

    this.layers.canvas=

    document.querySelector(

        "#effects-canvas"

    );

    this.layers.glow=

    document.querySelector(

        ".effects-glow"

    );

    this.layers.noise=

    document.querySelector(

        ".effects-noise"

    );

    this.layers.gradient=

    document.querySelector(

        ".effects-gradient"

    );

};

/*==================================================
CHECK
==================================================*/

Effects.exists=function(){

    return!!

    this.layers.wrapper;

};

/*==================================================
CANVAS
==================================================*/

Effects.createCanvas=function(){

    if(

        !this.layers.canvas

    ) return;

    this.ctx=

    this.layers.canvas

    .getContext(

        "2d",

        {

            alpha:true,

            desynchronized:true

        }

    );

};

/*==================================================
RESIZE
==================================================*/

Effects.resize=function(){

    if(

        !this.layers.canvas

    ) return;

    this.layers.canvas.width=

    innerWidth*

    this.config.dpr;

    this.layers.canvas.height=

    innerHeight*

    this.config.dpr;

    this.layers.canvas.style.width=

    innerWidth+"px";

    this.layers.canvas.style.height=

    innerHeight+"px";

    this.ctx?.scale(

        this.config.dpr,

        this.config.dpr

    );

};

/*==================================================
CLEAR
==================================================*/

Effects.clear=function(){

    if(

        !this.ctx

    ) return;

    this.ctx.clearRect(

        0,

        0,

        innerWidth,

        innerHeight

    );

};

/*==================================================
ENABLE
==================================================*/

Effects.enable=function(){

    this.enabled=true;

};

/*==================================================
DISABLE
==================================================*/

Effects.disable=function(){

    this.enabled=false;

};

/*==================================================
INIT
==================================================*/

Effects.init=async function(){

    this.cache();

    if(

        !this.exists()

    ) return;

    this.createCanvas();

    this.resize();

    this.initialized=true;

    Log.info(

        "Effects Engine Ready"

    );

};

/*==================================================
REGISTER
==================================================*/

registerModule(

    "Effects",

    Effects

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    EFFECTS.JS
    PART 02 — AURORA GRADIENT ENGINE

======================================================================*/

/*==================================================
STATE
==================================================*/

Effects.aurora={

    element:null,

    colors:[

        "#6E00FF",

        "#00D9FF",

        "#FF2E88",

        "#FFD400"

    ]

};

/*==================================================
CACHE
==================================================*/

Effects.cacheAurora=function(){

    this.aurora.element=

    document.querySelector(

        ".aurora"

    );

};

/*==================================================
CREATE
==================================================*/

Effects.createAurora=function(){

    if(

        !this.aurora.element||

        typeof gsap==="undefined"

    ) return;

    gsap.set(

        this.aurora.element,

        {

            background:

`
radial-gradient(
circle at 20% 20%,
${this.aurora.colors[0]},
transparent 45%
),
radial-gradient(
circle at 80% 40%,
${this.aurora.colors[1]},
transparent 45%
),
radial-gradient(
circle at 50% 80%,
${this.aurora.colors[2]},
transparent 40%
)
`

        }

    );

};

/*==================================================
ANIMATE
==================================================*/

Effects.animateAurora=function(){

    if(

        !this.aurora.element||

        typeof gsap==="undefined"

    ) return;

    gsap.to(

        this.aurora.element,

        {

            backgroundPosition:

            "0% 0%,100% 100%,50% 50%",

            duration:18,

            repeat:-1,

            yoyo:true,

            ease:"sine.inOut"

        }

    );

};

/*==================================================
ROTATION
==================================================*/

Effects.rotateAurora=function(){

    if(

        !this.aurora.element||

        typeof gsap==="undefined"

    ) return;

    gsap.to(

        this.aurora.element,

        {

            rotation:360,

            transformOrigin:

            "50% 50%",

            duration:120,

            repeat:-1,

            ease:"none"

        }

    );

};

/*==================================================
PARALLAX
==================================================*/

Effects.auroraParallax=function(){

    if(

        !this.aurora.element||

        typeof gsap==="undefined"

    ) return;

    EVENTS.on(

        "mouse:move",

        mouse=>{

            gsap.to(

                this.aurora.element,

                {

                    x:

                    (

                        mouse.x/

                        innerWidth-

                        .5

                    )*60,

                    y:

                    (

                        mouse.y/

                        innerHeight-

                        .5

                    )*40,

                    duration:1,

                    ease:"power2.out"

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

        Effects.cacheAurora();

        Effects.createAurora();

        Effects.animateAurora();

        Effects.rotateAurora();

        Effects.auroraParallax();

        Log.info(

            "Aurora Engine Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    EFFECTS.JS
    PART 03 — PARTICLE SYSTEM ENGINE

======================================================================*/

/*==================================================
STATE
==================================================*/

Effects.particles={

    items:[],

    count:120

};

/*==================================================
PARTICLE
==================================================*/

Effects.createParticle=function(){

    return{

        x:

        Math.random()*

        innerWidth,

        y:

        Math.random()*

        innerHeight,

        vx:

        (Math.random()-.5)*.5,

        vy:

        (Math.random()-.5)*.5,

        size:

        Math.random()*2+1,

        alpha:

        Math.random()*.6+.2

    };

};

/*==================================================
GENERATE
==================================================*/

Effects.generateParticles=function(){

    this.particles.items=[];

    for(

        let i=0;

        i<

        this.particles.count;

        i++

    ){

        this.particles.items.push(

            this.createParticle()

        );

    }

};

/*==================================================
UPDATE
==================================================*/

Effects.updateParticles=function(){

    this.particles.items.forEach(

        particle=>{

            particle.x+=

            particle.vx;

            particle.y+=

            particle.vy;

            if(

                particle.x<0||

                particle.x>

                innerWidth

            ){

                particle.vx*=

                -1;

            }

            if(

                particle.y<0||

                particle.y>

                innerHeight

            ){

                particle.vy*=

                -1;

            }

        }

    );

};

/*==================================================
DRAW
==================================================*/

Effects.drawParticles=function(){

    if(

        !this.ctx

    ) return;

    this.ctx.save();

    this.particles.items.forEach(

        particle=>{

            this.ctx.beginPath();

            this.ctx.arc(

                particle.x,

                particle.y,

                particle.size,

                0,

                Math.PI*2

            );

            this.ctx.fillStyle=

`
rgba(
255,
255,
255,
${particle.alpha}
)
`;

            this.ctx.fill();

        }

    );

    this.ctx.restore();

};

/*==================================================
CONNECT
==================================================*/

Effects.connectParticles=function(){

    if(

        !this.ctx

    ) return;

    for(

        let a=0;

        a<

        this.particles.items.length;

        a++

    ){

        for(

            let b=a+1;

            b<

            this.particles.items.length;

            b++

        ){

            const p1=

            this.particles.items[a];

            const p2=

            this.particles.items[b];

            const distance=

            Math.hypot(

                p1.x-p2.x,

                p1.y-p2.y

            );

            if(

                distance<140

            ){

                this.ctx.beginPath();

                this.ctx.moveTo(

                    p1.x,

                    p1.y

                );

                this.ctx.lineTo(

                    p2.x,

                    p2.y

                );

                this.ctx.strokeStyle=

`
rgba(
255,
255,
255,
${(140-distance)/700}
)
`;

                this.ctx.lineWidth=.5;

                this.ctx.stroke();

            }

        }

    }

};

/*==================================================
LOOP
==================================================*/

Effects.renderParticles=function(){

    if(

        !Effects.enabled

    ) return;

    Effects.clear();

    Effects.updateParticles();

    Effects.drawParticles();

    Effects.connectParticles();

    requestAnimationFrame(

        Effects.renderParticles

    );

};

/*==================================================
READY
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        Effects.generateParticles();

        Effects.renderParticles();

        Log.info(

            "Particle Engine Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    EFFECTS.JS
    PART 04 — GLASSMORPHISM & LIGHTING ENGINE

======================================================================*/

/*==================================================
STATE
==================================================*/

Effects.glass={

    cards:[],

    lighting:true

};

/*==================================================
CACHE
==================================================*/

Effects.cacheGlass=function(){

    this.glass.cards=[

        ...document.querySelectorAll(

            ".glass"

        )

    ];

};

/*==================================================
LIGHT FOLLOW
==================================================*/

Effects.lightFollow=function(){

    this.glass.cards.forEach(

        card=>{

            card.addEventListener(

                "mousemove",

                event=>{

                    const rect=

                    card.getBoundingClientRect();

                    const x=

                    event.clientX-

                    rect.left;

                    const y=

                    event.clientY-

                    rect.top;

                    card.style.setProperty(

                        "--light-x",

                        x+"px"

                    );

                    card.style.setProperty(

                        "--light-y",

                        y+"px"

                    );

                }

            );

        }

    );

};

/*==================================================
GLARE
==================================================*/

Effects.glare=function(){

    if(

        typeof gsap==="undefined"

    ) return;

    this.glass.cards.forEach(

        card=>{

            card.addEventListener(

                "mouseenter",

                ()=>{

                    gsap.to(

                        card,

                        {

                            "--glass-opacity":1,

                            duration:.35,

                            ease:"power2.out"

                        }

                    );

                }

            );

            card.addEventListener(

                "mouseleave",

                ()=>{

                    gsap.to(

                        card,

                        {

                            "--glass-opacity":.45,

                            duration:.45,

                            ease:"power2.out"

                        }

                    );

                }

            );

        }

    );

};

/*==================================================
REFLECTION
==================================================*/

Effects.reflection=function(){

    if(

        typeof gsap==="undefined"

    ) return;

    document.querySelectorAll(

        ".glass-reflection"

    ).forEach(

        reflection=>{

            gsap.to(

                reflection,

                {

                    xPercent:120,

                    repeat:-1,

                    duration:5,

                    ease:"none",

                    repeatDelay:2

                }

            );

        }

    );

};

/*==================================================
SPECULAR
==================================================*/

Effects.specular=function(){

    document.querySelectorAll(

        ".glass"

    ).forEach(

        card=>{

            card.addEventListener(

                "mousemove",

                event=>{

                    const rect=

                    card.getBoundingClientRect();

                    const rx=

                    (

                        event.clientY-

                        rect.top

                    )/

                    rect.height;

                    const ry=

                    (

                        event.clientX-

                        rect.left

                    )/

                    rect.width;

                    card.style.setProperty(

                        "--specular-x",

                        ry*100+"%"

                    );

                    card.style.setProperty(

                        "--specular-y",

                        rx*100+"%"

                    );

                }

            );

        }

    );

};

/*==================================================
FROSTED
==================================================*/

Effects.frosted=function(){

    document.documentElement

    .style.setProperty(

        "--glass-blur",

        "24px"

    );

};

/*==================================================
READY
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        Effects.cacheGlass();

        Effects.lightFollow();

        Effects.glare();

        Effects.reflection();

        Effects.specular();

        Effects.frosted();

        Log.info(

            "Glass Engine Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    EFFECTS.JS
    PART 05 — NOISE, FILM GRAIN & CINEMATIC POST FX

======================================================================*/

/*==================================================
STATE
==================================================*/

Effects.post={

    noise:null,

    grain:null,

    vignette:null,

    chromatic:null,

    enabled:true

};

/*==================================================
CACHE
==================================================*/

Effects.cachePost=function(){

    this.post.noise=

    document.querySelector(

        ".fx-noise"

    );

    this.post.grain=

    document.querySelector(

        ".fx-grain"

    );

    this.post.vignette=

    document.querySelector(

        ".fx-vignette"

    );

    this.post.chromatic=

    document.querySelector(

        ".fx-chromatic"

    );

};

/*==================================================
NOISE
==================================================*/

Effects.animateNoise=function(){

    if(

        !this.post.noise||

        typeof gsap==="undefined"

    ) return;

    gsap.to(

        this.post.noise,

        {

            x:"random(-80,80)",

            y:"random(-80,80)",

            duration:.08,

            repeat:-1,

            ease:"steps(2)"

        }

    );

};

/*==================================================
FILM GRAIN
==================================================*/

Effects.animateGrain=function(){

    if(

        !this.post.grain||

        typeof gsap==="undefined"

    ) return;

    gsap.to(

        this.post.grain,

        {

            backgroundPosition:

            "400px 300px",

            duration:.25,

            repeat:-1,

            ease:"none"

        }

    );

};

/*==================================================
VIGNETTE
==================================================*/

Effects.animateVignette=function(){

    if(

        !this.post.vignette||

        typeof gsap==="undefined"

    ) return;

    gsap.to(

        this.post.vignette,

        {

            opacity:.45,

            repeat:-1,

            yoyo:true,

            duration:6,

            ease:"sine.inOut"

        }

    );

};

/*==================================================
CHROMATIC
==================================================*/

Effects.chromatic=function(){

    if(

        !this.post.chromatic||

        typeof gsap==="undefined"

    ) return;

    gsap.to(

        this.post.chromatic,

        {

            x:1,

            y:-1,

            repeat:-1,

            yoyo:true,

            duration:.06,

            ease:"steps(2)"

        }

    );

};

/*==================================================
SCANLINES
==================================================*/

Effects.scanlines=function(){

    const scan=

    document.querySelector(

        ".fx-scanlines"

    );

    if(

        !scan||

        typeof gsap==="undefined"

    ) return;

    gsap.to(

        scan,

        {

            backgroundPositionY:

            "100%",

            duration:8,

            repeat:-1,

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

        Effects.cachePost();

        Effects.animateNoise();

        Effects.animateGrain();

        Effects.animateVignette();

        Effects.chromatic();

        Effects.scanlines();

        Log.info(

            "Post FX Engine Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    EFFECTS.JS
    PART 06 — GLOW, BLOOM & LIGHT SHAFT ENGINE

======================================================================*/

/*==================================================
STATE
==================================================*/

Effects.glow={

    lights:[],

    mouse:{

        x:innerWidth/2,

        y:innerHeight/2

    }

};

/*==================================================
CACHE
==================================================*/

Effects.cacheGlow=function(){

    this.glow.lights=[

        ...document.querySelectorAll(

            ".fx-glow"

        )

    ];

};

/*==================================================
MOUSE
==================================================*/

Effects.mouse=function(){

    window.addEventListener(

        "pointermove",

        event=>{

            this.glow.mouse.x=

            event.clientX;

            this.glow.mouse.y=

            event.clientY;

        },

        {

            passive:true

        }

    );

};

/*==================================================
FOLLOW
==================================================*/

Effects.follow=function(){

    if(

        typeof gsap==="undefined"

    ) return;

    this.glow.lights.forEach(

        light=>{

            gsap.ticker.add(

                ()=>{

                    gsap.to(

                        light,

                        {

                            x:

                            this.glow.mouse.x-

                            innerWidth/2,

                            y:

                            this.glow.mouse.y-

                            innerHeight/2,

                            duration:1,

                            ease:"power2.out",

                            overwrite:true

                        }

                    );

                }

            );

        }

    );

};

/*==================================================
PULSE
==================================================*/

Effects.pulse=function(){

    if(

        typeof gsap==="undefined"

    ) return;

    this.glow.lights.forEach(

        light=>{

            gsap.to(

                light,

                {

                    scale:1.25,

                    opacity:.8,

                    repeat:-1,

                    yoyo:true,

                    duration:3,

                    ease:"sine.inOut"

                }

            );

        }

    );

};

/*==================================================
LIGHT SHAFT
==================================================*/

Effects.lightShafts=function(){

    document.querySelectorAll(

        ".fx-light-shaft"

    ).forEach(

        shaft=>{

            gsap.to(

                shaft,

                {

                    rotation:6,

                    x:40,

                    repeat:-1,

                    yoyo:true,

                    duration:12,

                    ease:"sine.inOut"

                }

            );

        }

    );

};

/*==================================================
BLOOM
==================================================*/

Effects.bloom=function(){

    document.querySelectorAll(

        ".fx-bloom"

    ).forEach(

        bloom=>{

            gsap.to(

                bloom,

                {

                    filter:

                    "blur(90px)",

                    scale:1.15,

                    repeat:-1,

                    yoyo:true,

                    duration:8,

                    ease:"sine.inOut"

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

        Effects.cacheGlow();

        Effects.mouse();

        Effects.follow();

        Effects.pulse();

        Effects.lightShafts();

        Effects.bloom();

        Log.info(

            "Glow & Bloom Engine Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    EFFECTS.JS
    PART 07 — LIQUID BLOBS & MORPHING GRADIENT ENGINE

======================================================================*/

/*==================================================
STATE
==================================================*/

Effects.blobs={

    items:[]

};

/*==================================================
CACHE
==================================================*/

Effects.cacheBlobs=function(){

    this.blobs.items=[

        ...document.querySelectorAll(

            ".fx-blob"

        )

    ];

};

/*==================================================
FLOAT
==================================================*/

Effects.floatBlobs=function(){

    if(

        typeof gsap==="undefined"

    ) return;

    this.blobs.items.forEach(

        (blob,index)=>{

            gsap.to(

                blob,

                {

                    x:

                    "random(-120,120)",

                    y:

                    "random(-120,120)",

                    rotation:

                    "random(-30,30)",

                    duration:

                    12+

                    index*2,

                    repeat:-1,

                    yoyo:true,

                    ease:

                    "sine.inOut"

                }

            );

        }

    );

};

/*==================================================
BREATHING
==================================================*/

Effects.breathing=function(){

    this.blobs.items.forEach(

        blob=>{

            gsap.to(

                blob,

                {

                    scale:

                    "random(1.05,1.35)",

                    duration:

                    "random(6,12)",

                    repeat:-1,

                    yoyo:true,

                    ease:

                    "sine.inOut"

                }

            );

        }

    );

};

/*==================================================
MORPH COLORS
==================================================*/

Effects.gradientShift=function(){

    const gradient=

    document.querySelector(

        ".fx-gradient"

    );

    if(

        !gradient||

        typeof gsap==="undefined"

    ) return;

    gsap.to(

        gradient,

        {

            filter:

            "hue-rotate(360deg)",

            duration:30,

            repeat:-1,

            ease:"none"

        }

    );

};

/*==================================================
MOUSE DRIFT
==================================================*/

Effects.blobMouse=function(){

    EVENTS.on(

        "mouse:move",

        mouse=>{

            this.blobs.items.forEach(

                (blob,index)=>{

                    gsap.to(

                        blob,

                        {

                            x:

                            (

                                mouse.x/

                                innerWidth-

                                .5

                            )*

                            (30+

                            index*12),

                            y:

                            (

                                mouse.y/

                                innerHeight-

                                .5

                            )*

                            (20+

                            index*10),

                            duration:2,

                            ease:

                            "power2.out",

                            overwrite:true

                        }

                    );

                }

            );

        }

    );

};

/*==================================================
BLUR PULSE
==================================================*/

Effects.blurPulse=function(){

    this.blobs.items.forEach(

        blob=>{

            gsap.to(

                blob,

                {

                    filter:

                    "blur(120px)",

                    duration:8,

                    repeat:-1,

                    yoyo:true,

                    ease:

                    "sine.inOut"

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

        Effects.cacheBlobs();

        Effects.floatBlobs();

        Effects.breathing();

        Effects.gradientShift();

        Effects.blobMouse();

        Effects.blurPulse();

        Log.info(

            "Liquid Blob Engine Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    EFFECTS.JS
    PART 08 — DISTORTION, SHADER & WAVE ENGINE

======================================================================*/

/*==================================================
STATE
==================================================*/

Effects.distortion={

    elements:[],

    enabled:true

};

/*==================================================
CACHE
==================================================*/

Effects.cacheDistortion=function(){

    this.distortion.elements=[

        ...document.querySelectorAll(

            ".fx-distort"

        )

    ];

};

/*==================================================
WAVE
==================================================*/

Effects.wave=function(){

    if(

        typeof gsap==="undefined"

    ) return;

    this.distortion.elements.forEach(

        element=>{

            gsap.to(

                element,

                {

                    rotation:.8,

                    skewX:1.5,

                    skewY:.6,

                    duration:4,

                    repeat:-1,

                    yoyo:true,

                    ease:"sine.inOut"

                }

            );

        }

    );

};

/*==================================================
MOUSE DISTORTION
==================================================*/

Effects.mouseDistortion=function(){

    EVENTS.on(

        "mouse:move",

        mouse=>{

            this.distortion.elements.forEach(

                element=>{

                    const x=

                    (

                        mouse.x/

                        innerWidth-

                        .5

                    )*12;

                    const y=

                    (

                        mouse.y/

                        innerHeight-

                        .5

                    )*12;

                    gsap.to(

                        element,

                        {

                            x,

                            y,

                            rotation:

                            x*.2,

                            duration:.8,

                            ease:"power2.out",

                            overwrite:true

                        }

                    );

                }

            );

        }

    );

};

/*==================================================
SHADER SHIFT
==================================================*/

Effects.shader=function(){

    document.querySelectorAll(

        ".fx-shader"

    ).forEach(

        shader=>{

            gsap.to(

                shader,

                {

                    filter:

                    "hue-rotate(360deg)",

                    duration:24,

                    repeat:-1,

                    ease:"none"

                }

            );

        }

    );

};

/*==================================================
REFRACTION
==================================================*/

Effects.refraction=function(){

    document.querySelectorAll(

        ".fx-refraction"

    ).forEach(

        layer=>{

            gsap.to(

                layer,

                {

                    x:15,

                    y:-15,

                    duration:8,

                    repeat:-1,

                    yoyo:true,

                    ease:"sine.inOut"

                }

            );

        }

    );

};

/*==================================================
HEAT DISTORTION
==================================================*/

Effects.heat=function(){

    document.querySelectorAll(

        ".fx-heat"

    ).forEach(

        layer=>{

            gsap.to(

                layer,

                {

                    scaleY:1.02,

                    skewX:2,

                    duration:2,

                    repeat:-1,

                    yoyo:true,

                    ease:"sine.inOut"

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

        Effects.cacheDistortion();

        Effects.wave();

        Effects.mouseDistortion();

        Effects.shader();

        Effects.refraction();

        Effects.heat();

        Log.info(

            "Distortion Engine Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    EFFECTS.JS
    PART 09 — AMBIENT ENVIRONMENT & CINEMATIC ATMOSPHERE

======================================================================*/

/*==================================================
STATE
==================================================*/

Effects.atmosphere={

    fog:null,

    dust:[],

    rays:[],

    enabled:true

};

/*==================================================
CACHE
==================================================*/

Effects.cacheAtmosphere=function(){

    this.atmosphere.fog=

    document.querySelector(

        ".fx-fog"

    );

    this.atmosphere.dust=[

        ...document.querySelectorAll(

            ".fx-dust"

        )

    ];

    this.atmosphere.rays=[

        ...document.querySelectorAll(

            ".fx-ray"

        )

    ];

};

/*==================================================
FOG
==================================================*/

Effects.fog=function(){

    if(

        !this.atmosphere.fog||

        typeof gsap==="undefined"

    ) return;

    gsap.to(

        this.atmosphere.fog,

        {

            xPercent:12,

            yPercent:4,

            scale:1.08,

            opacity:.65,

            duration:26,

            repeat:-1,

            yoyo:true,

            ease:"sine.inOut"

        }

    );

};

/*==================================================
DUST
==================================================*/

Effects.dust=function(){

    this.atmosphere.dust.forEach(

        (particle,index)=>{

            gsap.fromTo(

                particle,

                {

                    y:

                    innerHeight+

                    Utilities.random(

                        50,

                        300

                    ),

                    x:

                    Utilities.random(

                        -200,

                        innerWidth

                    ),

                    opacity:0

                },

                {

                    y:-300,

                    x:"+="+

                    Utilities.random(

                        -120,

                        120

                    ),

                    opacity:.35,

                    duration:

                    Utilities.random(

                        18,

                        40

                    ),

                    delay:index*.08,

                    repeat:-1,

                    ease:"none"

                }

            );

        }

    );

};

/*==================================================
LIGHT RAYS
==================================================*/

Effects.lightRays=function(){

    this.atmosphere.rays.forEach(

        (ray,index)=>{

            gsap.to(

                ray,

                {

                    rotation:

                    Utilities.random(

                        -4,

                        4

                    ),

                    opacity:

                    Utilities.random(

                        .15,

                        .45

                    ),

                    duration:

                    10+

                    index*2,

                    repeat:-1,

                    yoyo:true,

                    ease:"sine.inOut"

                }

            );

        }

    );

};

/*==================================================
BREATHING
==================================================*/

Effects.environment=function(){

    const wrapper=

    document.querySelector(

        ".effects"

    );

    if(

        !wrapper

    ) return;

    gsap.to(

        wrapper,

        {

            filter:

            "brightness(1.03)",

            duration:8,

            repeat:-1,

            yoyo:true,

            ease:"sine.inOut"

        }

    );

};

/*==================================================
AMBIENT FLASH
==================================================*/

Effects.flash=function(){

    const flash=

    document.querySelector(

        ".fx-flash"

    );

    if(

        !flash

    ) return;

    gsap.timeline({

        repeat:-1,

        repeatDelay:

        Utilities.random(

            8,

            18

        )

    })

    .to(

        flash,

        {

            opacity:.18,

            duration:.08

        }

    )

    .to(

        flash,

        {

            opacity:0,

            duration:.35

        }

    );

};

/*==================================================
READY
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        Effects.cacheAtmosphere();

        Effects.fog();

        Effects.dust();

        Effects.lightRays();

        Effects.environment();

        Effects.flash();

        Log.info(

            "Atmosphere Engine Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    EFFECTS.JS
    PART 10 — EFFECTS FINALIZATION & PERFORMANCE ENGINE

======================================================================*/

/*==================================================
QUALITY
==================================================*/

Effects.quality=function(){

    const cores=

    navigator.hardwareConcurrency||4;

    const memory=

    navigator.deviceMemory||4;

    if(

        cores<=4||

        memory<=4

    ){

        this.config.quality=

        "medium";

        this.particles.count=

        60;

    }

    if(

        cores<=2||

        memory<=2

    ){

        this.config.quality=

        "low";

        this.particles.count=

        30;

    }

};

/*==================================================
REDUCED MOTION
==================================================*/

Effects.motion=function(){

    const reduce=

    window.matchMedia(

        "(prefers-reduced-motion: reduce)"

    ).matches;

    if(

        reduce

    ){

        this.disable();

        gsap.globalTimeline

        .timeScale(

            100

        );

    }

};

/*==================================================
VISIBILITY
==================================================*/

Effects.visibility=function(){

    document.addEventListener(

        "visibilitychange",

        ()=>{

            if(

                document.hidden

            ){

                gsap.globalTimeline

                .pause();

            }

            else{

                gsap.globalTimeline

                .resume();

            }

        }

    );

};

/*==================================================
RESIZE
==================================================*/

Effects.bindResize=function(){

    window.addEventListener(

        "resize",

        Utilities.debounce(

            ()=>{

                Effects.resize();

            },

            200

        )

    );

};

/*==================================================
DESTROY
==================================================*/

Effects.destroy=function(){

    if(

        this.ctx

    ){

        this.clear();

    }

    this.particles.items=[];

    this.blobs.items=[];

    this.glow.lights=[];

    this.distortion.elements=[];

    this.atmosphere.dust=[];

    this.atmosphere.rays=[];

};

/*==================================================
VERSION
==================================================*/

Effects.version={

    module:

    "Effects",

    version:

    "1.0.0",

    build:

    "2026.08",

    author:

    "Director VISION"

};

/*==================================================
READY
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        Effects.quality();

        Effects.motion();

        Effects.visibility();

        Effects.bindResize();

        Log.success(

            "Effects Module Complete"

        );

    }

);

/*==================================================
MODULE COMPLETE
==================================================*/

EVENTS.emit(

    "effects:initialized"

);

/*==================================================
EFFECTS.JS COMPLETE
==================================================*/

Log.success(

`
═══════════════════════════════════════════════

 Director VISION
 Luxury Cinematic Portfolio

 EFFECTS.JS BUILD COMPLETE

 Version : 1.0.0
 Build   : 2026.08

 Effects Included

 ✓ Aurora Engine
 ✓ Particle System
 ✓ Glassmorphism
 ✓ Film Grain
 ✓ Noise
 ✓ Bloom
 ✓ Glow
 ✓ Light Shafts
 ✓ Liquid Blobs
 ✓ Distortion
 ✓ Atmosphere
 ✓ Performance Optimizer

═══════════════════════════════════════════════
`
);
