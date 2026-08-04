
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    ANIMATIONS.JS
    PART 01 — GSAP CORE ENGINE

======================================================================*/

const Animations={

    initialized:false,

    timelines:{},

    defaults:{

        duration:.8,

        ease:"power3.out"

    }

};

/*==================================================
CHECK GSAP
==================================================*/

Animations.exists=function(){

    return(

        typeof gsap!=="undefined"

    );

};

/*==================================================
REGISTER PLUGINS
==================================================*/

Animations.plugins=function(){

    if(

        !this.exists()

    ) return;

    const plugins=[

        ScrollTrigger,

        SplitText,

        ScrollToPlugin,

        Flip,

        MotionPathPlugin

    ];

    plugins.forEach(

        plugin=>{

            if(plugin){

                gsap.registerPlugin(

                    plugin

                );

            }

        }

    );

};

/*==================================================
DEFAULTS
==================================================*/

Animations.defaultsEngine=function(){

    if(

        !this.exists()

    ) return;

    gsap.defaults({

        duration:

        this.defaults.duration,

        ease:

        this.defaults.ease,

        overwrite:"auto"

    });

};

/*==================================================
LAG
==================================================*/

Animations.performance=function(){

    if(

        !this.exists()

    ) return;

    gsap.ticker.lagSmoothing(

        0

    );

};

/*==================================================
GLOBAL TIMELINE
==================================================*/

Animations.master=

gsap.timeline({

    paused:true

});

/*==================================================
CREATE
==================================================*/

Animations.timeline=function(

    name,

    options={}

){

    this.timelines[name]=

    gsap.timeline(

        options

    );

    return this.timelines[name];

};

/*==================================================
GET
==================================================*/

Animations.get=function(name){

    return this.timelines[name];

};

/*==================================================
KILL
==================================================*/

Animations.kill=function(name){

    if(

        this.timelines[name]

    ){

        this.timelines[name]

        .kill();

        delete

        this.timelines[name];

    }

};

/*==================================================
READY
==================================================*/

Animations.init=async function(){

    if(

        !this.exists()

    ) return;

    this.plugins();

    this.defaultsEngine();

    this.performance();

    this.initialized=true;

    Log.info(

        "Animations Engine Ready"

    );

};

/*==================================================
REGISTER
==================================================*/

registerModule(

    "Animations",

    Animations

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    ANIMATIONS.JS
    PART 02 — REUSABLE FADE & REVEAL LIBRARY

======================================================================*/

/*==================================================
FADE UP
==================================================*/

Animations.fadeUp=function(

    targets,

    options={}

){

    return gsap.from(

        targets,

        {

            autoAlpha:0,

            y:60,

            duration:

            options.duration||

            .8,

            stagger:

            options.stagger||

            .08,

            ease:

            options.ease||

            "power3.out",

            ...options

        }

    );

};

/*==================================================
FADE DOWN
==================================================*/

Animations.fadeDown=function(

    targets,

    options={}

){

    return gsap.from(

        targets,

        {

            autoAlpha:0,

            y:-60,

            duration:.8,

            ease:"power3.out",

            ...options

        }

    );

};

/*==================================================
FADE LEFT
==================================================*/

Animations.fadeLeft=function(

    targets,

    options={}

){

    return gsap.from(

        targets,

        {

            autoAlpha:0,

            x:80,

            duration:.8,

            ease:"power3.out",

            ...options

        }

    );

};

/*==================================================
FADE RIGHT
==================================================*/

Animations.fadeRight=function(

    targets,

    options={}

){

    return gsap.from(

        targets,

        {

            autoAlpha:0,

            x:-80,

            duration:.8,

            ease:"power3.out",

            ...options

        }

    );

};

/*==================================================
SCALE
==================================================*/

Animations.scale=function(

    targets,

    options={}

){

    return gsap.from(

        targets,

        {

            autoAlpha:0,

            scale:.85,

            duration:.8,

            ease:"back.out(1.8)",

            ...options

        }

    );

};

/*==================================================
ROTATE
==================================================*/

Animations.rotate=function(

    targets,

    options={}

){

    return gsap.from(

        targets,

        {

            autoAlpha:0,

            rotate:12,

            scale:.95,

            duration:.8,

            ease:"power3.out",

            ...options

        }

    );

};

/*==================================================
BLUR
==================================================*/

Animations.blur=function(

    targets,

    options={}

){

    return gsap.from(

        targets,

        {

            autoAlpha:0,

            filter:

            "blur(20px)",

            duration:1,

            ease:"power2.out",

            ...options

        }

    );

};

/*==================================================
READY
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        Log.info(

            "Reveal Library Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    ANIMATIONS.JS
    PART 03 — SPLIT TEXT ANIMATION ENGINE

======================================================================*/

/*==================================================
CACHE
==================================================*/

Animations.split={

    items:[],

    instances:[]

};

/*==================================================
CREATE
==================================================*/

Animations.createSplit=function(

    selector=".split-text"

){

    if(

        typeof SplitText===

        "undefined"

    ) return;

    this.split.items=[

        ...document.querySelectorAll(

            selector

        )

    ];

    this.split.items.forEach(

        element=>{

            const split=

            new SplitText(

                element,

                {

                    type:

                    "lines,words,chars"

                }

            );

            this.split.instances.push(

                split

            );

        }

    );

};

/*==================================================
CHARS
==================================================*/

Animations.chars=function(){

    this.split.instances.forEach(

        split=>{

            gsap.from(

                split.chars,

                {

                    autoAlpha:0,

                    y:60,

                    rotateX:-90,

                    stagger:.015,

                    duration:.8,

                    ease:"back.out(1.7)",

                    scrollTrigger:{

                        trigger:

                        split.elements[0],

                        start:"top 85%",

                        once:true

                    }

                }

            );

        }

    );

};

/*==================================================
WORDS
==================================================*/

Animations.words=function(){

    this.split.instances.forEach(

        split=>{

            gsap.from(

                split.words,

                {

                    autoAlpha:0,

                    y:30,

                    stagger:.04,

                    duration:.7,

                    ease:"power3.out",

                    scrollTrigger:{

                        trigger:

                        split.elements[0],

                        start:"top 85%",

                        once:true

                    }

                }

            );

        }

    );

};

/*==================================================
LINES
==================================================*/

Animations.lines=function(){

    this.split.instances.forEach(

        split=>{

            gsap.from(

                split.lines,

                {

                    autoAlpha:0,

                    y:70,

                    stagger:.12,

                    duration:.9,

                    ease:"power4.out",

                    scrollTrigger:{

                        trigger:

                        split.elements[0],

                        start:"top 85%",

                        once:true

                    }

                }

            );

        }

    );

};

/*==================================================
REVERT
==================================================*/

Animations.revertSplit=function(){

    this.split.instances.forEach(

        split=>{

            split.revert();

        }

    );

    this.split.instances=[];

};

/*==================================================
REFRESH
==================================================*/

Animations.refreshSplit=function(){

    this.revertSplit();

    this.createSplit();

    this.chars();

};

/*==================================================
READY
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        Animations.createSplit();

        Animations.chars();

        Log.info(

            "Split Text Engine Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    ANIMATIONS.JS
    PART 04 — SCROLLTRIGGER REVEAL ENGINE

======================================================================*/

/*==================================================
REVEAL
==================================================*/

Animations.reveal={

    selectors:[

        ".reveal",

        ".reveal-up",

        ".reveal-left",

        ".reveal-right",

        ".reveal-scale",

        ".reveal-blur"

    ]

};

/*==================================================
UP
==================================================*/

Animations.revealUp=function(){

    gsap.utils.toArray(

        ".reveal-up"

    ).forEach(

        element=>{

            gsap.from(

                element,

                {

                    autoAlpha:0,

                    y:80,

                    duration:.9,

                    ease:"power3.out",

                    scrollTrigger:{

                        trigger:element,

                        start:"top 85%",

                        once:true

                    }

                }

            );

        }

    );

};

/*==================================================
LEFT
==================================================*/

Animations.revealLeft=function(){

    gsap.utils.toArray(

        ".reveal-left"

    ).forEach(

        element=>{

            gsap.from(

                element,

                {

                    autoAlpha:0,

                    x:100,

                    duration:.9,

                    ease:"power3.out",

                    scrollTrigger:{

                        trigger:element,

                        start:"top 85%",

                        once:true

                    }

                }

            );

        }

    );

};

/*==================================================
RIGHT
==================================================*/

Animations.revealRight=function(){

    gsap.utils.toArray(

        ".reveal-right"

    ).forEach(

        element=>{

            gsap.from(

                element,

                {

                    autoAlpha:0,

                    x:-100,

                    duration:.9,

                    ease:"power3.out",

                    scrollTrigger:{

                        trigger:element,

                        start:"top 85%",

                        once:true

                    }

                }

            );

        }

    );

};

/*==================================================
SCALE
==================================================*/

Animations.revealScale=function(){

    gsap.utils.toArray(

        ".reveal-scale"

    ).forEach(

        element=>{

            gsap.from(

                element,

                {

                    autoAlpha:0,

                    scale:.82,

                    duration:.8,

                    ease:"back.out(1.8)",

                    scrollTrigger:{

                        trigger:element,

                        start:"top 88%",

                        once:true

                    }

                }

            );

        }

    );

};

/*==================================================
BLUR
==================================================*/

Animations.revealBlur=function(){

    gsap.utils.toArray(

        ".reveal-blur"

    ).forEach(

        element=>{

            gsap.from(

                element,

                {

                    autoAlpha:0,

                    filter:

                    "blur(18px)",

                    duration:1,

                    ease:"power2.out",

                    scrollTrigger:{

                        trigger:element,

                        start:"top 85%",

                        once:true

                    }

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

        Animations.revealUp();

        Animations.revealLeft();

        Animations.revealRight();

        Animations.revealScale();

        Animations.revealBlur();

        Log.info(

            "Scroll Reveal Engine Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    ANIMATIONS.JS
    PART 05 — ADVANCED SCROLL EFFECTS & PARALLAX ENGINE

======================================================================*/

/*==================================================
PARALLAX
==================================================*/

Animations.parallax={

    items:[]

};

/*==================================================
CACHE
==================================================*/

Animations.cacheParallax=function(){

    this.parallax.items=[

        ...document.querySelectorAll(

            "[data-parallax]"

        )

    ];

};

/*==================================================
UPDATE
==================================================*/

Animations.updateParallax=function(){

    this.parallax.items.forEach(

        element=>{

            const speed=

            parseFloat(

                element.dataset.parallax

            )||.15;

            gsap.to(

                element,

                {

                    y:()=>{

                        const rect=

                        element

                        .getBoundingClientRect();

                        return

                        -rect.top*

                        speed;

                    },

                    ease:"none",

                    overwrite:true

                }

            );

        }

    );

};

/*==================================================
ROTATE
==================================================*/

Animations.rotateScroll=function(){

    gsap.utils.toArray(

        "[data-rotate-scroll]"

    ).forEach(

        element=>{

            gsap.to(

                element,

                {

                    rotation:

                    element.dataset

                    .rotateScroll||

                    360,

                    ease:"none",

                    scrollTrigger:{

                        trigger:element,

                        start:"top bottom",

                        end:"bottom top",

                        scrub:true

                    }

                }

            );

        }

    );

};

/*==================================================
SCALE
==================================================*/

Animations.scaleScroll=function(){

    gsap.utils.toArray(

        "[data-scale-scroll]"

    ).forEach(

        element=>{

            gsap.fromTo(

                element,

                {

                    scale:.8

                },

                {

                    scale:1,

                    ease:"none",

                    scrollTrigger:{

                        trigger:element,

                        start:"top bottom",

                        end:"center center",

                        scrub:true

                    }

                }

            );

        }

    );

};

/*==================================================
FADE
==================================================*/

Animations.fadeScroll=function(){

    gsap.utils.toArray(

        "[data-fade-scroll]"

    ).forEach(

        element=>{

            gsap.fromTo(

                element,

                {

                    opacity:0

                },

                {

                    opacity:1,

                    ease:"none",

                    scrollTrigger:{

                        trigger:element,

                        start:"top 90%",

                        end:"top 50%",

                        scrub:true

                    }

                }

            );

        }

    );

};

/*==================================================
EVENTS
==================================================*/

EVENTS.on(

    "scroll:update",

    ()=>{

        Animations.updateParallax();

    }

);

/*==================================================
READY
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        Animations.cacheParallax();

        Animations.rotateScroll();

        Animations.scaleScroll();

        Animations.fadeScroll();

        Log.info(

            "Advanced Scroll Effects Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    ANIMATIONS.JS
    PART 06 — STAGGER & SEQUENCE ANIMATION LIBRARY

======================================================================*/

/*==================================================
STAGGER UP
==================================================*/

Animations.staggerUp=function(

    selector,

    options={}

){

    gsap.utils.toArray(

        selector

    ).forEach(

        container=>{

            const items=[

                ...container.children

            ];

            gsap.from(

                items,

                {

                    autoAlpha:0,

                    y:60,

                    stagger:

                    options.stagger||

                    .08,

                    duration:

                    options.duration||

                    .8,

                    ease:

                    "power3.out",

                    scrollTrigger:{

                        trigger:

                        container,

                        start:

                        "top 85%",

                        once:true

                    }

                }

            );

        }

    );

};

/*==================================================
STAGGER SCALE
==================================================*/

Animations.staggerScale=function(

    selector

){

    gsap.utils.toArray(

        selector

    ).forEach(

        container=>{

            gsap.from(

                container.children,

                {

                    autoAlpha:0,

                    scale:.82,

                    stagger:.08,

                    duration:.75,

                    ease:

                    "back.out(1.8)",

                    scrollTrigger:{

                        trigger:

                        container,

                        start:"top 85%",

                        once:true

                    }

                }

            );

        }

    );

};

/*==================================================
CASCADE
==================================================*/

Animations.cascade=function(

    selector

){

    gsap.utils.toArray(

        selector

    ).forEach(

        element=>{

            gsap.from(

                element,

                {

                    autoAlpha:0,

                    y:80,

                    rotationX:-20,

                    transformOrigin:

                    "top center",

                    duration:1,

                    ease:"power4.out",

                    scrollTrigger:{

                        trigger:element,

                        start:"top 85%",

                        once:true

                    }

                }

            );

        }

    );

};

/*==================================================
WAVE
==================================================*/

Animations.wave=function(

    selector

){

    gsap.utils.toArray(

        selector

    ).forEach(

        container=>{

            gsap.from(

                container.children,

                {

                    y:30,

                    opacity:0,

                    stagger:{

                        each:.05,

                        from:"center"

                    },

                    duration:.7,

                    ease:"power2.out",

                    scrollTrigger:{

                        trigger:

                        container,

                        start:"top 85%",

                        once:true

                    }

                }

            );

        }

    );

};

/*==================================================
RANDOM
==================================================*/

Animations.random=function(

    selector

){

    gsap.utils.toArray(

        selector

    ).forEach(

        container=>{

            gsap.from(

                container.children,

                {

                    autoAlpha:0,

                    y:"random(-80,80)",

                    x:"random(-60,60)",

                    rotate:

                    "random(-15,15)",

                    stagger:.04,

                    duration:.9,

                    ease:"power3.out",

                    scrollTrigger:{

                        trigger:

                        container,

                        start:"top 85%",

                        once:true

                    }

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

        Log.info(

            "Sequence Library Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    ANIMATIONS.JS
    PART 07 — TEXT EFFECTS LIBRARY

======================================================================*/

/*==================================================
TYPEWRITER
==================================================*/

Animations.typewriter=function(

    selector,

    speed=0.04

){

    gsap.utils.toArray(

        selector

    ).forEach(

        element=>{

            const text=

            element.textContent;

            element.textContent="";

            gsap.to(

                {},

                {

                    duration:

                    text.length*

                    speed,

                    ease:"none",

                    scrollTrigger:{

                        trigger:element,

                        start:"top 85%",

                        once:true

                    },

                    onUpdate:function(){

                        const count=

                        Math.floor(

                            this.progress()*

                            text.length

                        );

                        element.textContent=

                        text.slice(

                            0,

                            count

                        );

                    }

                }

            );

        }

    );

};

/*==================================================
TEXT MASK
==================================================*/

Animations.maskReveal=function(

    selector

){

    gsap.utils.toArray(

        selector

    ).forEach(

        element=>{

            gsap.fromTo(

                element,

                {

                    clipPath:

                    "inset(0 100% 0 0)"

                },

                {

                    clipPath:

                    "inset(0 0% 0 0)",

                    duration:1,

                    ease:"power4.out",

                    scrollTrigger:{

                        trigger:element,

                        start:"top 85%",

                        once:true

                    }

                }

            );

        }

    );

};

/*==================================================
TEXT GRADIENT
==================================================*/

Animations.gradientText=function(

    selector

){

    gsap.utils.toArray(

        selector

    ).forEach(

        element=>{

            gsap.to(

                element,

                {

                    backgroundPosition:

                    "200% center",

                    repeat:-1,

                    duration:6,

                    ease:"none"

                }

            );

        }

    );

};

/*==================================================
SCRAMBLE
==================================================*/

Animations.scramble=function(

    selector

){

    gsap.utils.toArray(

        selector

    ).forEach(

        element=>{

            const original=

            element.textContent;

            element.addEventListener(

                "mouseenter",

                ()=>{

                    if(

                        typeof ScrambleTextPlugin===

                        "undefined"

                    ) return;

                    gsap.to(

                        element,

                        {

                            duration:.8,

                            scrambleText:{

                                text:original,

                                chars:

                                "01ABCDEFGHIJKLMNOPQRSTUVWXYZ",

                                speed:0.5

                            }

                        }

                    );

                }

            );

        }

    );

};

/*==================================================
HIGHLIGHT
==================================================*/

Animations.highlight=function(

    selector

){

    gsap.utils.toArray(

        selector

    ).forEach(

        element=>{

            gsap.fromTo(

                element,

                {

                    backgroundSize:

                    "0% 100%"

                },

                {

                    backgroundSize:

                    "100% 100%",

                    duration:1,

                    ease:"power2.out",

                    scrollTrigger:{

                        trigger:element,

                        start:"top 85%",

                        once:true

                    }

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

        Log.info(

            "Text Effects Library Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    ANIMATIONS.JS
    PART 08 — PAGE TRANSITIONS & ROUTE ANIMATIONS

======================================================================*/

/*==================================================
STATE
==================================================*/

Animations.page={

    active:false,

    duration:.8

};

/*==================================================
ENTER
==================================================*/

Animations.pageEnter=function(){

    if(

        typeof gsap==="undefined"

    ) return;

    gsap.fromTo(

        "main",

        {

            autoAlpha:0,

            y:40,

            filter:

            "blur(12px)"

        },

        {

            autoAlpha:1,

            y:0,

            filter:

            "blur(0px)",

            duration:

            this.page.duration,

            ease:"power4.out"

        }

    );

};

/*==================================================
EXIT
==================================================*/

Animations.pageExit=function(

    callback

){

    if(

        typeof gsap==="undefined"

    ){

        callback?.();

        return;

    }

    gsap.to(

        "main",

        {

            autoAlpha:0,

            y:-40,

            filter:

            "blur(10px)",

            duration:.55,

            ease:"power3.in",

            onComplete:()=>{

                callback?.();

            }

        }

    );

};

/*==================================================
SECTION ENTER
==================================================*/

Animations.section=function(

    selector

){

    gsap.utils.toArray(

        selector

    ).forEach(

        section=>{

            gsap.from(

                section,

                {

                    autoAlpha:0,

                    y:80,

                    duration:.9,

                    ease:"power3.out",

                    scrollTrigger:{

                        trigger:

                        section,

                        start:

                        "top 80%",

                        once:true

                    }

                }

            );

        }

    );

};

/*==================================================
ROUTE LINKS
==================================================*/

Animations.routes=function(){

    document.querySelectorAll(

        "a[data-transition]"

    ).forEach(

        link=>{

            link.addEventListener(

                "click",

                event=>{

                    const href=

                    link.href;

                    if(

                        !href

                    ) return;

                    event.preventDefault();

                    this.pageExit(

                        ()=>{

                            window.location=

                            href;

                        }

                    );

                }

            );

        }

    );

};

/*==================================================
POPSTATE
==================================================*/

Animations.history=function(){

    window.addEventListener(

        "pageshow",

        ()=>{

            this.pageEnter();

        }

    );

};

/*==================================================
READY
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        Animations.pageEnter();

        Animations.routes();

        Animations.history();

        Log.info(

            "Page Transition Engine Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    ANIMATIONS.JS
    PART 09 — MOUSE INTERACTION & MAGNETIC ENGINE

======================================================================*/

/*==================================================
MAGNETIC
==================================================*/

Animations.magnetic={

    items:[]

};

/*==================================================
CACHE
==================================================*/

Animations.cacheMagnetic=function(){

    this.magnetic.items=[

        ...document.querySelectorAll(

            "[data-magnetic]"

        )

    ];

};

/*==================================================
MAGNETIC EFFECT
==================================================*/

Animations.bindMagnetic=function(){

    this.magnetic.items.forEach(

        element=>{

            element.addEventListener(

                "mousemove",

                event=>{

                    const rect=

                    element.getBoundingClientRect();

                    const x=

                    event.clientX-

                    rect.left-

                    rect.width/2;

                    const y=

                    event.clientY-

                    rect.top-

                    rect.height/2;

                    gsap.to(

                        element,

                        {

                            x:x*.25,

                            y:y*.25,

                            duration:.35,

                            ease:"power3.out"

                        }

                    );

                }

            );

            element.addEventListener(

                "mouseleave",

                ()=>{

                    gsap.to(

                        element,

                        {

                            x:0,

                            y:0,

                            duration:.45,

                            ease:"elastic.out(1,.4)"

                        }

                    );

                }

            );

        }

    );

};

/*==================================================
3D CARD
==================================================*/

Animations.cards=function(){

    gsap.utils.toArray(

        "[data-tilt]"

    ).forEach(

        card=>{

            card.addEventListener(

                "mousemove",

                event=>{

                    const rect=

                    card.getBoundingClientRect();

                    const x=

                    (

                        event.clientX-

                        rect.left

                    )/

                    rect.width-.5;

                    const y=

                    (

                        event.clientY-

                        rect.top

                    )/

                    rect.height-.5;

                    gsap.to(

                        card,

                        {

                            rotationY:

                            x*16,

                            rotationX:

                            -y*16,

                            transformPerspective:

                            1200,

                            duration:.35

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

                            rotationX:0,

                            rotationY:0,

                            duration:.45

                        }

                    );

                }

            );

        }

    );

};

/*==================================================
FOLLOW GLOW
==================================================*/

Animations.glow=function(){

    gsap.utils.toArray(

        "[data-glow]"

    ).forEach(

        element=>{

            element.addEventListener(

                "mousemove",

                event=>{

                    const rect=

                    element.getBoundingClientRect();

                    element.style.setProperty(

                        "--mx",

                        (

                            event.clientX-

                            rect.left

                        )+"px"

                    );

                    element.style.setProperty(

                        "--my",

                        (

                            event.clientY-

                            rect.top

                        )+"px"

                    );

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

        Animations.cacheMagnetic();

        Animations.bindMagnetic();

        Animations.cards();

        Animations.glow();

        Log.info(

            "Mouse Interaction Engine Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    ANIMATIONS.JS
    PART 10 — MASTER TIMELINE & GLOBAL ANIMATION CONTROLLER

======================================================================*/

/*==================================================
MASTER
==================================================*/

Animations.master={

    timeline:null,

    paused:false,

    speed:1

};

/*==================================================
CREATE
==================================================*/

Animations.createMaster=function(){

    if(

        typeof gsap==="undefined"

    ) return;

    this.master.timeline=

    gsap.timeline({

        paused:false,

        defaults:{

            ease:"power3.out"

        }

    );

};

/*==================================================
ADD
==================================================*/

Animations.add=function(

    name,

    animation,

    position=">"

){

    if(

        !this.master.timeline

    ) return;

    this.master.timeline.add(

        animation,

        position

    );

    Log.info(

        `Animation Added → ${name}`

    );

};

/*==================================================
PLAY
==================================================*/

Animations.play=function(){

    this.master.paused=false;

    this.master.timeline

    ?.play();

};

/*==================================================
PAUSE
==================================================*/

Animations.pause=function(){

    this.master.paused=true;

    this.master.timeline

    ?.pause();

};

/*==================================================
REVERSE
==================================================*/

Animations.reverse=function(){

    this.master.timeline

    ?.reverse();

};

/*==================================================
RESTART
==================================================*/

Animations.restart=function(){

    this.master.timeline

    ?.restart();

};

/*==================================================
TIME SCALE
==================================================*/

Animations.speed=function(

    value=1

){

    this.master.speed=value;

    this.master.timeline

    ?.timeScale(value);

};

/*==================================================
KILL
==================================================*/

Animations.killAll=function(){

    gsap.killTweensOf("*");

    ScrollTrigger

    ?.getAll()

    .forEach(

        trigger=>{

            trigger.kill();

        }

    );

};

/*==================================================
REFRESH
==================================================*/

Animations.refresh=function(){

    ScrollTrigger

    ?.refresh(true);

};

/*==================================================
REDUCED MOTION
==================================================*/

Animations.motion=function(){

    const reduce=

    window.matchMedia(

        "(prefers-reduced-motion: reduce)"

    ).matches;

    if(

        reduce

    ){

        gsap.globalTimeline

        .timeScale(

            100

        );

    }

};

/*==================================================
VERSION
==================================================*/

Animations.version={

    module:

    "Animations",

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

        Animations.createMaster();

        Animations.motion();

        Animations.refresh();

        Log.success(

            "Animations Module Complete"

        );

    }

);

/*==================================================
MODULE COMPLETE
==================================================*/

EVENTS.emit(

    "animations:initialized"

);

/*==================================================
ANIMATIONS.JS COMPLETE
==================================================*/

Log.success(

`
═══════════════════════════════════════════════

 Director VISION
 Luxury Cinematic Portfolio

 ANIMATIONS.JS BUILD COMPLETE

 Version : 1.0.0
 Build   : 2026.08

 Modules

 ✓ GSAP Core
 ✓ Reveal Library
 ✓ Split Text Engine
 ✓ ScrollTrigger
 ✓ Advanced Scroll FX
 ✓ Stagger Library
 ✓ Text Effects
 ✓ Page Transitions
 ✓ Magnetic Engine
 ✓ Master Timeline

═══════════════════════════════════════════════
`
);
