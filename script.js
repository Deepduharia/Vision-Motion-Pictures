/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 01 — CORE ENGINE

======================================================================*/

"use strict";

/*======================================================
    VERSION
======================================================*/

const APP = {

    version: "1.0.0",

    name: "Director Vision",

    author: "Director VISION",

    debug: false,

    mobileBreakpoint: 992,

    tabletBreakpoint: 1200,

    initialized: false

};

/*======================================================
    DOM CACHE
======================================================*/

const DOM = {

    body: document.body,

    html: document.documentElement,

    header: document.querySelector("header"),

    hero: document.querySelector("#hero"),

    preloader: document.querySelector("#preloader"),

    navigation: document.querySelector(".navbar"),

    backToTop: document.querySelector("#backToTop"),

    cursor: document.querySelector(".cursor"),

    cursorOutline: document.querySelector(".cursor-outline"),

    scrollProgress: document.querySelector(".scroll-progress")

};

/*======================================================
    WINDOW
======================================================*/

const WIN = {

    width: window.innerWidth,

    height: window.innerHeight,

    scrollY: window.scrollY,

    scrollX: window.scrollX,

    ratio: window.devicePixelRatio || 1

};

/*======================================================
    DEVICE
======================================================*/

const DEVICE = {

    touch: ("ontouchstart" in window),

    mobile: window.innerWidth < APP.mobileBreakpoint,

    tablet:
        window.innerWidth >= APP.mobileBreakpoint &&
        window.innerWidth < APP.tabletBreakpoint,

    desktop: window.innerWidth >= APP.tabletBreakpoint

};

/*======================================================
    EVENT BUS
======================================================*/

const EVENTS = {

    events: {},

    on(event, callback){

        if(!this.events[event]){

            this.events[event]=[];

        }

        this.events[event].push(callback);

    },

    emit(event,data){

        if(!this.events[event]) return;

        this.events[event].forEach(callback=>callback(data));

    },

    off(event,callback){

        if(!this.events[event]) return;

        this.events[event]=

        this.events[event].filter(

        item=>item!==callback

        );

    }

};

/*======================================================
    SELECTORS
======================================================*/

const $=(selector,parent=document)=>parent.querySelector(selector);

const $$=(selector,parent=document)=>

[...parent.querySelectorAll(selector)];

/*======================================================
    UTILITIES
======================================================*/

const Utils={

    clamp(value,min,max){

        return Math.min(

        Math.max(value,min),

        max

        );

    },

    lerp(start,end,t){

        return start+(end-start)*t;

    },

    map(value,inMin,inMax,outMin,outMax){

        return(

        (value-inMin)

        *(outMax-outMin)

        /(inMax-inMin)

        )+outMin;

    },

    random(min,max){

        return Math.random()*(max-min)+min;

    },

    randomInt(min,max){

        return Math.floor(

        Math.random()

        *(max-min+1)

        )+min;

    },

    distance(x1,y1,x2,y2){

        return Math.hypot(

        x2-x1,

        y2-y1

        );

    },

    degrees(rad){

        return rad*(180/Math.PI);

    },

    radians(deg){

        return deg*(Math.PI/180);

    }

};

/*======================================================
    DEBOUNCE
======================================================*/

function debounce(callback,delay=250){

    let timeout;

    return(...args)=>{

        clearTimeout(timeout);

        timeout=setTimeout(

        ()=>callback(...args),

        delay

        );

    };

}

/*======================================================
    THROTTLE
======================================================*/

function throttle(callback,limit=100){

    let waiting=false;

    return(...args)=>{

        if(waiting) return;

        callback(...args);

        waiting=true;

        setTimeout(()=>{

            waiting=false;

        },limit);

    };

}

/*======================================================
    RAF
======================================================*/

const RAF={

    callbacks:[],

    add(callback){

        this.callbacks.push(callback);

    },

    remove(callback){

        this.callbacks=

        this.callbacks.filter(

        item=>item!==callback

        );

    },

    update(time){

        this.callbacks.forEach(

        callback=>callback(time)

        );

        requestAnimationFrame(

        this.update.bind(this)

        );

    },

    start(){

        requestAnimationFrame(

        this.update.bind(this)

        );

    }

};

/*======================================================
    LOGGER
======================================================*/

const Log={

    info(message){

        if(APP.debug)

        console.log(

        "%cINFO",

        "color:#D4AF37",

        message

        );

    },

    warn(message){

        if(APP.debug)

        console.warn(message);

    },

    error(message){

        console.error(message);

    }

};

/*======================================================
    RESIZE
======================================================*/

function updateViewport(){

    WIN.width=window.innerWidth;

    WIN.height=window.innerHeight;

    WIN.scrollY=window.scrollY;

    WIN.scrollX=window.scrollX;

}

window.addEventListener(

"resize",

debounce(updateViewport,120)

);

/*======================================================
    SCROLL
======================================================*/

window.addEventListener(

"scroll",

throttle(()=>{

WIN.scrollY=window.scrollY;

EVENTS.emit(

"scroll",

WIN.scrollY

);

},16)

);

/*======================================================
    GSAP
======================================================*/

if(typeof gsap!=="undefined"){

    gsap.registerPlugin(

        ScrollTrigger

    );

}

/*======================================================
    READY
======================================================*/

document.addEventListener(

"DOMContentLoaded",

()=>{

    Log.info(

    "Core Engine Loaded"

    );

    RAF.start();

}

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 02 — APPLICATION INITIALIZATION ENGINE

======================================================================*/

/*======================================================
    MODULE REGISTRY
======================================================*/

const Modules = new Map();

/*======================================================
    REGISTER MODULE
======================================================*/

function registerModule(name, module){

    if(!name || typeof module !== "object"){

        Log.error(`Invalid module: ${name}`);

        return;

    }

    Modules.set(name,module);

    Log.info(`Registered → ${name}`);

}

/*======================================================
    GET MODULE
======================================================*/

function getModule(name){

    return Modules.get(name);

}

/*======================================================
    INITIALIZE MODULE
======================================================*/

async function initializeModule(name){

    const module = Modules.get(name);

    if(!module){

        Log.warn(`Module not found → ${name}`);

        return;

    }

    try{

        if(typeof module.init==="function"){

            await module.init();

            Log.info(`${name} initialized`);

        }

    }

    catch(error){

        console.error(

            `Module Error → ${name}`,

            error

        );

    }

}

/*======================================================
    INITIALIZE ALL
======================================================*/

async function initializeModules(){

    for(const [name] of Modules){

        await initializeModule(name);

    }

}

/*======================================================
    PLUGIN DETECTION
======================================================*/

const Plugins={

    gsap:typeof gsap!=="undefined",

    scrollTrigger:
    typeof ScrollTrigger!=="undefined",

    swiper:
    typeof Swiper!=="undefined",

    lenis:
    typeof Lenis!=="undefined",

    isotope:
    typeof Isotope!=="undefined",

    imagesLoaded:
    typeof imagesLoaded!=="undefined"

};

/*======================================================
    VERIFY PLUGINS
======================================================*/

function verifyPlugins(){

    Object.entries(Plugins)

    .forEach(([plugin,loaded])=>{

        if(loaded){

            Log.info(`${plugin} ✓`);

        }

        else{

            console.warn(

            `${plugin} Missing`

            );

        }

    });

}

/*======================================================
    PERFORMANCE
======================================================*/

const PerformanceMonitor={

    start:0,

    init(){

        this.start=performance.now();

    },

    finish(){

        const total=

        performance.now()

        -this.start;

        Log.info(

        `Startup ${total.toFixed(2)}ms`

        );

    }

};

/*======================================================
    PAGE STATE
======================================================*/

const State={

    loaded:false,

    scrolling:false,

    resizing:false,

    menuOpen:false,

    modalOpen:false,

    currentSection:"",

    theme:"dark"

};

/*======================================================
    BODY CLASSES
======================================================*/

function addReadyClass(){

    DOM.body.classList.remove(

    "loading"

    );

    DOM.body.classList.add(

    "loaded"

    );

}

/*======================================================
    UPDATE ACTIVE SECTION
======================================================*/

function detectSections(){

    const sections=$$("section[id]");

    const observer=

    new IntersectionObserver(

    entries=>{

        entries.forEach(entry=>{

            if(entry.isIntersecting){

                State.currentSection=

                entry.target.id;

            }

        });

    },

    {

        threshold:.4

    }

    );

    sections.forEach(

    section=>observer.observe(section)

    );

}

/*======================================================
    WINDOW LOAD
======================================================*/

window.addEventListener(

"load",

()=>{

    State.loaded=true;

    EVENTS.emit("windowLoaded");

    addReadyClass();

}

/*======================================================
    RESIZE
======================================================*/

window.addEventListener(

"resize",

debounce(()=>{

State.resizing=true;

EVENTS.emit("resize");

setTimeout(()=>{

State.resizing=false;

},200);

})

);

/*======================================================
    ONLINE / OFFLINE
======================================================*/

window.addEventListener(

"online",

()=>{

Log.info(

"Connection Restored"

);

}

);

window.addEventListener(

"offline",

()=>{

Log.warn(

"Offline Mode"

);

}

);

/*======================================================
    ERROR HANDLER
======================================================*/

window.addEventListener(

"error",

event=>{

console.error(

"Runtime Error",

event.error

);

}

);

/*======================================================
    PROMISE ERROR
======================================================*/

window.addEventListener(

"unhandledrejection",

event=>{

console.error(

"Promise Error",

event.reason

);

}

);

/*======================================================
    STARTUP
======================================================*/

async function bootstrap(){

    PerformanceMonitor.init();

    verifyPlugins();

    detectSections();

    await initializeModules();

    PerformanceMonitor.finish();

    APP.initialized=true;

    EVENTS.emit("appReady");

}

/*======================================================
    APPLICATION
======================================================*/

document.addEventListener(

"DOMContentLoaded",

()=>{

bootstrap();

});
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 03.1 — PREMIUM PRELOADER CORE

======================================================================*/

/*======================================================
    PRELOADER MODULE
======================================================*/

const Preloader = {

    progress: 0,

    displayedProgress: 0,

    targetProgress: 100,

    completed: false,

    assetsLoaded: false,

    timeline: null,

    raf: null,

    startTime: 0,

    duration: 2200,

    selectors: {},

    messages: [

        "Loading Experience",

        "Preparing Portfolio",

        "Initializing Cinematic Engine",

        "Loading Motion Graphics",

        "Building Visual World",

        "Almost Ready"

    ],

    currentMessage: 0

};

/*======================================================
    CACHE DOM
======================================================*/

Preloader.cache = function(){

    this.selectors.wrapper = $("#preloader");

    this.selectors.counter = $("#preloaderCounter");

    this.selectors.bar = $("#preloaderBar");

    this.selectors.logo = $("#preloaderLogo");

    this.selectors.message = $("#preloaderMessage");

    this.selectors.overlay = $("#preloaderOverlay");

};

/*======================================================
    EXISTS
======================================================*/

Preloader.exists = function(){

    return !!this.selectors.wrapper;

};

/*======================================================
    RESET
======================================================*/

Preloader.reset = function(){

    this.progress = 0;

    this.displayedProgress = 0;

    this.completed = false;

    this.assetsLoaded = false;

    this.currentMessage = 0;

};

/*======================================================
    SET MESSAGE
======================================================*/

Preloader.setMessage = function(text){

    if(!this.selectors.message) return;

    this.selectors.message.textContent = text;

};

/*======================================================
    NEXT MESSAGE
======================================================*/

Preloader.nextMessage = function(){

    this.currentMessage++;

    if(this.currentMessage >= this.messages.length){

        this.currentMessage = this.messages.length - 1;

    }

    this.setMessage(

        this.messages[this.currentMessage]

    );

};

/*======================================================
    UPDATE COUNTER
======================================================*/

Preloader.updateCounter = function(){

    if(!this.selectors.counter) return;

    this.selectors.counter.textContent =

        Math.floor(

            this.displayedProgress

        ) + "%";

};

/*======================================================
    UPDATE BAR
======================================================*/

Preloader.updateBar = function(){

    if(!this.selectors.bar) return;

    this.selectors.bar.style.transform =

        `scaleX(${this.displayedProgress/100})`;

};

/*======================================================
    UPDATE UI
======================================================*/

Preloader.updateUI = function(){

    this.updateCounter();

    this.updateBar();

};

/*======================================================
    SMOOTH PROGRESS
======================================================*/

Preloader.animateProgress = function(){

    this.displayedProgress = Utils.lerp(

        this.displayedProgress,

        this.progress,

        0.08

    );

    if(

        Math.abs(

            this.displayedProgress -

            this.progress

        ) < .05

    ){

        this.displayedProgress = this.progress;

    }

    this.updateUI();

};

/*======================================================
    SET PROGRESS
======================================================*/

Preloader.setProgress = function(value){

    this.progress = Utils.clamp(

        value,

        0,

        100

    );

};

/*======================================================
    COMPLETE
======================================================*/

Preloader.complete = function(){

    this.progress = 100;

    this.assetsLoaded = true;

};

/*======================================================
    RAF LOOP
======================================================*/

Preloader.loop = function(){

    this.animateProgress();

    if(!this.completed){

        this.raf = requestAnimationFrame(

            this.loop.bind(this)

        );

    }

};

/*======================================================
    START
======================================================*/

Preloader.start = function(){

    if(!this.exists()) return;

    this.reset();

    this.startTime = performance.now();

    this.setMessage(

        this.messages[0]

    );

    this.loop();

};

/*======================================================
    STOP
======================================================*/

Preloader.stop = function(){

    cancelAnimationFrame(

        this.raf

    );

};

/*======================================================
    PUBLIC INIT
======================================================*/

Preloader.init = async function(){

    this.cache();

    if(!this.exists()) return;

    this.start();

    Log.info(

        "Preloader Started"

    );

};

/*======================================================
    REGISTER
======================================================*/

registerModule(

    "Preloader",

    Preloader

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 03.2 — ASSET LOADER & PROGRESS ENGINE

======================================================================*/

/*======================================================
    LOADER STATE
======================================================*/

Preloader.totalAssets = 0;
Preloader.loadedAssets = 0;
Preloader.minimumDuration = 2200;
Preloader.minimumFinished = false;

/*======================================================
    REGISTER ASSET
======================================================*/

Preloader.registerAsset = function(){

    this.totalAssets++;

};

/*======================================================
    ASSET LOADED
======================================================*/

Preloader.assetLoaded = function(){

    this.loadedAssets++;

    this.calculateProgress();

};

/*======================================================
    CALCULATE
======================================================*/

Preloader.calculateProgress = function(){

    if(this.totalAssets <= 0){

        this.setProgress(95);

        return;

    }

    const percent =

        (this.loadedAssets / this.totalAssets) * 95;

    this.setProgress(percent);

};

/*======================================================
    IMAGES
======================================================*/

Preloader.loadImages = function(){

    const images = $$("img");

    if(images.length === 0) return;

    images.forEach(image=>{

        this.registerAsset();

        if(image.complete){

            this.assetLoaded();

        }

        else{

            image.addEventListener(

                "load",

                ()=>this.assetLoaded(),

                {once:true}

            );

            image.addEventListener(

                "error",

                ()=>this.assetLoaded(),

                {once:true}

            );

        }

    });

};

/*======================================================
    VIDEOS
======================================================*/

Preloader.loadVideos = function(){

    const videos = $$("video");

    if(videos.length===0) return;

    videos.forEach(video=>{

        this.registerAsset();

        if(video.readyState>=2){

            this.assetLoaded();

        }

        else{

            video.addEventListener(

                "loadeddata",

                ()=>this.assetLoaded(),

                {once:true}

            );

            video.addEventListener(

                "error",

                ()=>this.assetLoaded(),

                {once:true}

            );

        }

    });

};

/*======================================================
    FONTS
======================================================*/

Preloader.loadFonts = async function(){

    if(!document.fonts) return;

    this.registerAsset();

    try{

        await document.fonts.ready;

    }

    catch(error){

        Log.warn("Font Loading Error");

    }

    this.assetLoaded();

};

/*======================================================
    BACKGROUND IMAGES
======================================================*/

Preloader.loadBackgrounds = function(){

    const elements = $$("*");

    elements.forEach(el=>{

        const bg =

        getComputedStyle(el)

        .backgroundImage;

        if(

            !bg ||

            bg==="none"

        ) return;

        const match =

        bg.match(

        /url\\(["']?(.*?)["']?\\)/

        );

        if(!match) return;

        this.registerAsset();

        const img = new Image();

        img.onload=()=>this.assetLoaded();

        img.onerror=()=>this.assetLoaded();

        img.src=match[1];

    });

};

/*======================================================
    MESSAGE ROTATION
======================================================*/

Preloader.messageLoop = function(){

    this.messageTimer=

    setInterval(()=>{

        if(this.completed){

            clearInterval(

                this.messageTimer

            );

            return;

        }

        this.nextMessage();

    },1200);

};

/*======================================================
    MINIMUM DISPLAY
======================================================*/

Preloader.minimumTimer=function(){

    setTimeout(()=>{

        this.minimumFinished=true;

        this.checkCompletion();

    },this.minimumDuration);

};

/*======================================================
    CHECK COMPLETE
======================================================*/

Preloader.checkCompletion=function(){

    if(

        this.loadedAssets>=this.totalAssets &&

        this.minimumFinished

    ){

        this.complete();

    }

};

/*======================================================
    OVERRIDE COMPLETE
======================================================*/

Preloader.complete=function(){

    this.progress=100;

    this.assetsLoaded=true;

};

/*======================================================
    WATCH
======================================================*/

Preloader.watch=function(){

    const timer=setInterval(()=>{

        this.calculateProgress();

        this.checkCompletion();

        if(this.assetsLoaded){

            clearInterval(timer);

        }

    },100);

};

/*======================================================
    START ASSETS
======================================================*/

Preloader.startLoading=function(){

    this.loadImages();

    this.loadVideos();

    this.loadFonts();

    this.loadBackgrounds();

    this.minimumTimer();

    this.messageLoop();

    this.watch();

};

/*======================================================
    EXTEND INIT
======================================================*/

const originalPreloaderInit =

Preloader.init.bind(Preloader);

Preloader.init = async function(){

    await originalPreloaderInit();

    this.startLoading();

    Log.info(

        "Asset Loader Ready"

    );

};
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 03.3 — GSAP CINEMATIC PRELOADER

======================================================================*/

/*======================================================
    GSAP CHECK
======================================================*/

Preloader.hasGSAP = function(){

    return (

        typeof gsap !== "undefined"

    );

};

/*======================================================
    BUILD TIMELINE
======================================================*/

Preloader.createTimeline = function(){

    if(!this.hasGSAP()) return;

    gsap.set(this.selectors.logo,{

        opacity:0,

        scale:.85,

        y:40,

        rotateX:-15

    });

    gsap.set(this.selectors.counter,{

        opacity:0,

        y:25

    });

    gsap.set(this.selectors.message,{

        opacity:0,

        y:20

    });

    gsap.set(this.selectors.bar,{

        scaleX:0,

        transformOrigin:"left center"

    });

    this.timeline = gsap.timeline({

        paused:true,

        defaults:{

            ease:"power3.out"

        }

    });

    this.timeline

    .to(

        this.selectors.logo,

        {

            opacity:1,

            scale:1,

            rotateX:0,

            y:0,

            duration:1

        }

    )

    .to(

        this.selectors.counter,

        {

            opacity:1,

            y:0,

            duration:.6

        },

        "-=.6"

    )

    .to(

        this.selectors.message,

        {

            opacity:1,

            y:0,

            duration:.6

        },

        "-=.45"

    );

};

/*======================================================
    PLAY INTRO
======================================================*/

Preloader.playIntro = function(){

    if(

        this.timeline

    ){

        this.timeline.play();

    }

};

/*======================================================
    BAR ANIMATION
======================================================*/

Preloader.animateBar = function(){

    if(

        !this.hasGSAP()

    ) return;

    gsap.to(

        this.selectors.bar,

        {

            scaleX:

            this.displayedProgress/100,

            duration:.35,

            ease:"power2.out"

        }

    );

};

/*======================================================
    COUNTER FX
======================================================*/

Preloader.animateCounter = function(){

    if(

        !this.hasGSAP()

    ) return;

    gsap.to(

        this.selectors.counter,

        {

            scale:1.08,

            duration:.15,

            yoyo:true,

            repeat:1

        }

    );

};

/*======================================================
    MESSAGE FX
======================================================*/

Preloader.animateMessage = function(){

    if(

        !this.hasGSAP()

    ) return;

    gsap.fromTo(

        this.selectors.message,

        {

            opacity:0,

            y:18

        },

        {

            opacity:1,

            y:0,

            duration:.45,

            ease:"power2.out"

        }

    );

};

/*======================================================
    GLOW EFFECT
======================================================*/

Preloader.glow = function(){

    if(

        !this.hasGSAP()

    ) return;

    gsap.to(

        this.selectors.logo,

        {

            boxShadow:

            "0 0 60px rgba(212,175,55,.35)",

            repeat:-1,

            yoyo:true,

            duration:1.6,

            ease:"sine.inOut"

        }

    );

};

/*======================================================
    AMBIENT FLOAT
======================================================*/

Preloader.floatLogo = function(){

    if(

        !this.hasGSAP()

    ) return;

    gsap.to(

        this.selectors.logo,

        {

            y:-10,

            duration:2,

            repeat:-1,

            yoyo:true,

            ease:"sine.inOut"

        }

    );

};

/*======================================================
    UPDATE GSAP
======================================================*/

const preloaderUI =

Preloader.updateUI.bind(Preloader);

Preloader.updateUI = function(){

    preloaderUI();

    this.animateBar();

    this.animateCounter();

};

/*======================================================
    OVERRIDE MESSAGE
======================================================*/

const nextMessage =

Preloader.nextMessage.bind(Preloader);

Preloader.nextMessage = function(){

    nextMessage();

    this.animateMessage();

};

/*======================================================
    START ANIMATION
======================================================*/

const preloaderStart =

Preloader.start.bind(Preloader);

Preloader.start = function(){

    preloaderStart();

    this.createTimeline();

    this.playIntro();

    this.glow();

    this.floatLogo();

};

/*======================================================
    READY
======================================================*/

EVENTS.on(

    "appReady",

    ()=>{

        Log.info(

            "GSAP Preloader Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 03.4 — PRELOADER EXIT ENGINE

======================================================================*/

/*======================================================
    LOCK SCROLL
======================================================*/

Preloader.lockScroll = function(){

    document.documentElement.classList.add("loading");

    document.body.style.overflow = "hidden";

};

/*======================================================
    UNLOCK SCROLL
======================================================*/

Preloader.unlockScroll = function(){

    document.documentElement.classList.remove("loading");

    document.body.style.removeProperty("overflow");

};

/*======================================================
    HERO PREPARE
======================================================*/

Preloader.prepareHero = function(){

    if(!DOM.hero) return;

    if(typeof gsap === "undefined") return;

    gsap.set(

        DOM.hero,

        {

            opacity:0,

            y:80,

            scale:1.03,

            filter:"blur(20px)"

        }

    );

};

/*======================================================
    HERO REVEAL
======================================================*/

Preloader.revealHero = function(){

    if(!DOM.hero) return;

    if(typeof gsap === "undefined") return;

    gsap.to(

        DOM.hero,

        {

            opacity:1,

            y:0,

            scale:1,

            filter:"blur(0px)",

            duration:1.4,

            ease:"power4.out"

        }

    );

};

/*======================================================
    FADE PRELOADER
======================================================*/

Preloader.fadeOut = function(){

    if(!this.selectors.wrapper) return;

    if(typeof gsap === "undefined"){

        this.selectors.wrapper.remove();

        this.unlockScroll();

        return;

    }

    const tl = gsap.timeline({

        defaults:{

            ease:"power3.inOut"

        }

    });

    tl

    .to(

        this.selectors.counter,

        {

            opacity:0,

            y:-20,

            duration:.25

        }

    )

    .to(

        this.selectors.message,

        {

            opacity:0,

            y:-20,

            duration:.25

        },

        "<"

    )

    .to(

        this.selectors.bar,

        {

            opacity:0,

            duration:.25

        },

        "<"

    )

    .to(

        this.selectors.logo,

        {

            scale:1.18,

            opacity:0,

            filter:"blur(8px)",

            duration:.6

        }

    )

    .to(

        this.selectors.wrapper,

        {

            opacity:0,

            duration:.8

        },

        "-=.2"

    )

    .add(()=>{

        this.destroy();

    });

};

/*======================================================
    DESTROY
======================================================*/

Preloader.destroy = function(){

    this.completed = true;

    this.stop();

    this.unlockScroll();

    this.revealHero();

    if(this.selectors.wrapper){

        this.selectors.wrapper.remove();

    }

    EVENTS.emit(

        "preloaderComplete"

    );

};

/*======================================================
    WAIT FOR COMPLETE
======================================================*/

Preloader.waitUntilReady = function(){

    const watcher = setInterval(()=>{

        if(

            this.assetsLoaded &&

            this.displayedProgress >= 99.9

        ){

            clearInterval(watcher);

            this.fadeOut();

        }

    },60);

};

/*======================================================
    EXTEND START
======================================================*/

const preloaderStartSequence =

Preloader.start.bind(Preloader);

Preloader.start = function(){

    this.lockScroll();

    this.prepareHero();

    preloaderStartSequence();

    this.waitUntilReady();

};

/*======================================================
    SAFETY TIMEOUT
======================================================*/

setTimeout(()=>{

    if(

        !Preloader.completed

    ){

        Log.warn(

            "Preloader timeout fallback."

        );

        Preloader.complete();

    }

},10000);

/*======================================================
    EVENT
======================================================*/

EVENTS.on(

    "preloaderComplete",

    ()=>{

        Log.info(

            "Preloader Finished"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 03.5 — PRELOADER FINALIZATION

======================================================================*/

/*======================================================
    PERFORMANCE METRICS
======================================================*/

Preloader.metrics = {

    start: 0,

    end: 0,

    duration: 0

};

Preloader.startMetrics = function(){

    this.metrics.start = performance.now();

};

Preloader.finishMetrics = function(){

    this.metrics.end = performance.now();

    this.metrics.duration =

        this.metrics.end -

        this.metrics.start;

    Log.info(

        `Preloader ${this.metrics.duration.toFixed(2)} ms`

    );

};

/*======================================================
    CLEAR TIMERS
======================================================*/

Preloader.clearTimers = function(){

    if(this.messageTimer){

        clearInterval(this.messageTimer);

    }

};

/*======================================================
    RELEASE REFERENCES
======================================================*/

Preloader.release = function(){

    this.timeline = null;

    this.raf = null;

    this.messageTimer = null;

};

/*======================================================
    REMOVE EVENTS
======================================================*/

Preloader.removeListeners = function(){

    EVENTS.emit(

        "preloaderCleanup"

    );

};

/*======================================================
    PAGE READY
======================================================*/

Preloader.pageReady = function(){

    DOM.body.classList.add(

        "page-ready"

    );

    DOM.body.classList.remove(

        "page-loading"

    );

};

/*======================================================
    HERO START EVENT
======================================================*/

Preloader.startHero = function(){

    EVENTS.emit(

        "heroStart"

    );

};

/*======================================================
    APP READY EVENT
======================================================*/

Preloader.finishApplication = function(){

    EVENTS.emit(

        "websiteReady"

    );

};

/*======================================================
    ANALYTICS
======================================================*/

Preloader.analytics = function(){

    if(APP.debug){

        console.table({

            Assets:this.totalAssets,

            Loaded:this.loadedAssets,

            Duration:

            this.metrics.duration.toFixed(2)+" ms"

        });

    }

};

/*======================================================
    MEMORY CLEANUP
======================================================*/

Preloader.cleanup = function(){

    this.clearTimers();

    this.release();

    this.removeListeners();

};

/*======================================================
    FINALIZE
======================================================*/

const destroyPreloader =

Preloader.destroy.bind(Preloader);

Preloader.destroy = function(){

    destroyPreloader();

    this.finishMetrics();

    this.pageReady();

    this.startHero();

    this.finishApplication();

    this.analytics();

    this.cleanup();

};

/*======================================================
    INITIAL METRICS
======================================================*/

const preloaderInit =

Preloader.init.bind(Preloader);

Preloader.init = async function(){

    this.startMetrics();

    await preloaderInit();

};

/*======================================================
    FALLBACK
======================================================*/

window.addEventListener(

"pageshow",

()=>{

    if(

        this.completed

    ) return;

});

document.addEventListener(

"visibilitychange",

()=>{

    if(

        document.visibilityState ===

        "visible"

    ){

        EVENTS.emit(

            "pageVisible"

        );

    }

});

/*======================================================
    APP EVENTS
======================================================*/

EVENTS.on(

"websiteReady",

()=>{

    Log.info(

        "Website Ready"

    );

});

EVENTS.on(

"heroStart",

()=>{

    Log.info(

        "Hero Animation Started"

    );

});

/*======================================================
    VERSION
======================================================*/

console.info(

`%c${APP.name}`,

"color:#D4AF37;font-size:18px;font-weight:bold"

);

console.info(

`Version ${APP.version}`

);

console.info(

"Director VISION"

);

/*======================================================
    PRELOADER MODULE COMPLETE
======================================================*/
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 04.1 — NAVIGATION CORE ENGINE

======================================================================*/

/*======================================================
    NAVIGATION MODULE
======================================================*/

const Navigation={

    initialized:false,

    lastScroll:0,

    currentScroll:0,

    direction:"up",

    stickyOffset:80,

    ticking:false,

    state:{

        sticky:false,

        hidden:false,

        mobileOpen:false,

        megaOpen:false

    },

    elements:{}

};

/*======================================================
    CACHE DOM
======================================================*/

Navigation.cache=function(){

    this.elements.header=

    $("header");

    this.elements.nav=

    $(".navbar");

    this.elements.wrapper=

    $(".nav-wrapper");

    this.elements.links=

    $$(".nav-link");

    this.elements.items=

    $$(".nav-item");

    this.elements.dropdowns=

    $$(".has-dropdown");

    this.elements.toggle=

    $(".menu-toggle");

    this.elements.overlay=

    $(".nav-overlay");

    this.elements.mobile=

    $(".mobile-menu");

    this.elements.progress=

    $(".scroll-progress");

};

/*======================================================
    EXISTS
======================================================*/

Navigation.exists=function(){

    return !!this.elements.header;

};

/*======================================================
    SCROLL VALUES
======================================================*/

Navigation.updateScroll=function(){

    this.currentScroll=

    window.pageYOffset||

    window.scrollY||

    0;

};

/*======================================================
    SCROLL DIRECTION
======================================================*/

Navigation.detectDirection=function(){

    this.direction=

    this.currentScroll>

    this.lastScroll

    ?"down":"up";

    this.lastScroll=

    this.currentScroll;

};

/*======================================================
    STICKY
======================================================*/

Navigation.enableSticky=function(){

    if(

        this.currentScroll>

        this.stickyOffset

    ){

        if(!this.state.sticky){

            this.state.sticky=true;

            this.elements.header

            ?.classList.add(

            "is-sticky"

            );

        }

    }

    else{

        if(this.state.sticky){

            this.state.sticky=false;

            this.elements.header

            ?.classList.remove(

            "is-sticky"

            );

        }

    }

};

/*======================================================
    GLASS EFFECT
======================================================*/

Navigation.updateGlass=function(){

    const nav=

    this.elements.header;

    if(!nav) return;

    if(this.currentScroll<40){

        nav.classList.remove(

        "glass",

        "solid"

        );

        return;

    }

    if(

        this.currentScroll>=40 &&

        this.currentScroll<250

    ){

        nav.classList.add("glass");

        nav.classList.remove("solid");

    }

    else{

        nav.classList.remove("glass");

        nav.classList.add("solid");

    }

};

/*======================================================
    SHADOW
======================================================*/

Navigation.updateShadow=function(){

    const nav=

    this.elements.header;

    if(!nav) return;

    nav.classList.toggle(

    "nav-shadow",

    this.currentScroll>30

    );

};

/*======================================================
    SCROLL PROGRESS
======================================================*/

Navigation.updateProgress=function(){

    if(

        !this.elements.progress

    ) return;

    const height=

    document.documentElement

    .scrollHeight-

    window.innerHeight;

    const progress=

    height<=0

    ?0

    :(this.currentScroll/

    height)*100;

    this.elements.progress

    .style.width=

    progress+"%";

};

/*======================================================
    RAF UPDATE
======================================================*/

Navigation.render=function(){

    this.updateScroll();

    this.detectDirection();

    this.enableSticky();

    this.updateGlass();

    this.updateShadow();

    this.updateProgress();

    this.ticking=false;

};

/*======================================================
    REQUEST FRAME
======================================================*/

Navigation.onScroll=function(){

    if(this.ticking) return;

    this.ticking=true;

    requestAnimationFrame(

    ()=>this.render()

    );

};

/*======================================================
    RESIZE
======================================================*/

Navigation.onResize=function(){

    this.updateScroll();

    this.enableSticky();

    this.updateGlass();

};

/*======================================================
    EVENTS
======================================================*/

Navigation.events=function(){

    window.addEventListener(

    "scroll",

    ()=>this.onScroll(),

    {

        passive:true

    }

    );

    window.addEventListener(

    "resize",

    debounce(

    ()=>this.onResize(),

    120

    )

    );

};

/*======================================================
    INITIAL STATE
======================================================*/

Navigation.refresh=function(){

    this.updateScroll();

    this.enableSticky();

    this.updateGlass();

    this.updateShadow();

    this.updateProgress();

};

/*======================================================
    INIT
======================================================*/

Navigation.init=async function(){

    this.cache();

    if(!this.exists()) return;

    this.refresh();

    this.events();

    this.initialized=true;

    Log.info(

    "Navigation Ready"

    );

};

/*======================================================
    REGISTER
======================================================*/

registerModule(

"Navigation",

Navigation

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 04.2 — ACTIVE LINKS & SCROLLSPY

======================================================================*/

/*======================================================
    SECTION CACHE
======================================================*/

Navigation.sections = [];

Navigation.collectSections = function(){

    this.sections = [];

    $$("section[id]").forEach(section=>{

        this.sections.push({

            id:section.id,

            element:section,

            top:0,

            bottom:0

        });

    });

};

/*======================================================
    CALCULATE POSITIONS
======================================================*/

Navigation.calculateSections = function(){

    this.sections.forEach(item=>{

        const rect = item.element.getBoundingClientRect();

        const top = rect.top + window.pageYOffset;

        item.top = top;

        item.bottom = top + item.element.offsetHeight;

    });

};

/*======================================================
    CLEAR ACTIVE
======================================================*/

Navigation.clearActive = function(){

    this.elements.links.forEach(link=>{

        link.classList.remove(

            "active"

        );

        link.removeAttribute(

            "aria-current"

        );

    });

};

/*======================================================
    SET ACTIVE LINK
======================================================*/

Navigation.setActive = function(id){

    this.clearActive();

    const active = document.querySelector(

        `.nav-link[href="#${id}"]`

    );

    if(!active) return;

    active.classList.add("active");

    active.setAttribute(

        "aria-current",

        "page"

    );

};

/*======================================================
    SCROLLSPY
======================================================*/

Navigation.scrollSpy = function(){

    const offset = 180;

    const scroll =

        this.currentScroll + offset;

    for(const section of this.sections){

        if(

            scroll >= section.top &&

            scroll < section.bottom

        ){

            if(

                State.currentSection !==

                section.id

            ){

                State.currentSection =

                section.id;

                this.setActive(

                    section.id

                );

            }

            break;

        }

    }

};

/*======================================================
    SMOOTH SCROLL
======================================================*/

Navigation.scrollTo = function(target){

    if(!target) return;

    const section =

        document.querySelector(target);

    if(!section) return;

    const y =

        section.getBoundingClientRect().top +

        window.pageYOffset -

        100;

    if(

        window.lenis

    ){

        window.lenis.scrollTo(

            y,

            {

                duration:1.2

            }

        );

    }

    else{

        window.scrollTo({

            top:y,

            behavior:"smooth"

        });

    }

};

/*======================================================
    LINK EVENTS
======================================================*/

Navigation.bindLinks = function(){

    this.elements.links.forEach(link=>{

        link.addEventListener(

            "click",

            event=>{

                const href =

                    link.getAttribute(

                        "href"

                    );

                if(

                    !href ||

                    !href.startsWith("#")

                ) return;

                event.preventDefault();

                this.scrollTo(href);

                history.replaceState(

                    null,

                    "",

                    href

                );

            }

        );

    });

};

/*======================================================
    HASH SUPPORT
======================================================*/

Navigation.hashLoad = function(){

    if(

        !location.hash

    ) return;

    requestAnimationFrame(()=>{

        this.scrollTo(

            location.hash

        );

    });

};

/*======================================================
    HASH CHANGE
======================================================*/

window.addEventListener(

    "hashchange",

    ()=>{

        Navigation.scrollTo(

            location.hash

        );

    }

);

/*======================================================
    OBSERVER
======================================================*/

Navigation.observe = function(){

    const observer =

    new IntersectionObserver(

    entries=>{

        entries.forEach(entry=>{

            if(

                entry.isIntersecting

            ){

                const id =

                entry.target.id;

                this.setActive(id);

            }

        });

    },

    {

        threshold:.45

    }

    );

    this.sections.forEach(item=>{

        observer.observe(

            item.element

        );

    });

};

/*======================================================
    EXTEND RENDER
======================================================*/

const navigationRender =

Navigation.render.bind(Navigation);

Navigation.render = function(){

    navigationRender();

    this.scrollSpy();

};

/*======================================================
    EXTEND RESIZE
======================================================*/

const navigationResize =

Navigation.onResize.bind(Navigation);

Navigation.onResize = function(){

    navigationResize();

    this.calculateSections();

};

/*======================================================
    EXTEND INIT
======================================================*/

const navigationInit =

Navigation.init.bind(Navigation);

Navigation.init = async function(){

    await navigationInit();

    this.collectSections();

    this.calculateSections();

    this.bindLinks();

    this.observe();

    this.hashLoad();

    Log.info(

        "ScrollSpy Ready"

    );

};
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 04.4.1 — MEGA MENU CORE ENGINE

======================================================================*/

/*======================================================
    MEGA MENU MODULE
======================================================*/

const MegaMenu={

    initialized:false,

    active:null,

    isOpen:false,

    delay:120,

    timer:null,

    elements:{}

};

/*======================================================
    CACHE DOM
======================================================*/

MegaMenu.cache=function(){

    this.elements.items=

    $$(".has-mega");

    this.elements.panels=

    $$(".mega-menu");

    this.elements.links=

    $$(".has-mega > a");

};

/*======================================================
    EXISTS
======================================================*/

MegaMenu.exists=function(){

    return this.elements.items.length>0;

};

/*======================================================
    INITIAL ARIA
======================================================*/

MegaMenu.setupARIA=function(){

    this.elements.items.forEach(item=>{

        const trigger=

        $("a",item);

        const panel=

        $(".mega-menu",item);

        if(!trigger||!panel) return;

        if(!panel.id){

            panel.id=

            "mega-"+

            Utils.randomInt(

            1000,

            999999

            );

        }

        trigger.setAttribute(

        "aria-haspopup",

        "true"

        );

        trigger.setAttribute(

        "aria-expanded",

        "false"

        );

        trigger.setAttribute(

        "aria-controls",

        panel.id

        );

        panel.setAttribute(

        "role",

        "menu"

        );

        panel.setAttribute(

        "aria-hidden",

        "true"

        );

    });

};

/*======================================================
    RESET
======================================================*/

MegaMenu.reset=function(){

    this.active=null;

    this.isOpen=false;

};

/*======================================================
    GET PANEL
======================================================*/

MegaMenu.getPanel=function(item){

    return $(".mega-menu",item);

};

/*======================================================
    GET TRIGGER
======================================================*/

MegaMenu.getTrigger=function(item){

    return $("a",item);

};

/*======================================================
    UPDATE ARIA
======================================================*/

MegaMenu.updateARIA=function(

item,

expanded

){

    const trigger=

    this.getTrigger(item);

    const panel=

    this.getPanel(item);

    if(trigger){

        trigger.setAttribute(

        "aria-expanded",

        expanded

        );

    }

    if(panel){

        panel.setAttribute(

        "aria-hidden",

        !expanded

        );

    }

};

/*======================================================
    CLOSE ALL
======================================================*/

MegaMenu.closeAll=function(){

    this.elements.items.forEach(item=>{

        item.classList.remove(

        "mega-open"

        );

        this.updateARIA(

        item,

        false

        );

    });

    this.active=null;

    this.isOpen=false;

};

/*======================================================
    OPEN
======================================================*/

MegaMenu.open=function(item){

    if(!item) return;

    if(

        this.active===item

    ) return;

    this.closeAll();

    item.classList.add(

    "mega-open"

    );

    this.updateARIA(

    item,

    true

    );

    this.active=item;

    this.isOpen=true;

};

/*======================================================
    CLOSE
======================================================*/

MegaMenu.close=function(item){

    if(!item) return;

    item.classList.remove(

    "mega-open"

    );

    this.updateARIA(

    item,

    false

    );

    if(

        this.active===item

    ){

        this.active=null;

        this.isOpen=false;

    }

};

/*======================================================
    TOGGLE
======================================================*/

MegaMenu.toggle=function(item){

    if(

        this.active===item

    ){

        this.close(item);

    }

    else{

        this.open(item);

    }

};

/*======================================================
    REGISTER EVENTS
======================================================*/

MegaMenu.bindCore=function(){

    this.elements.items.forEach(item=>{

        const trigger=

        this.getTrigger(item);

        if(!trigger) return;

        trigger.addEventListener(

        "click",

        event=>{

            if(

                window.innerWidth>

                APP.mobileBreakpoint

            ){

                event.preventDefault();

            }

            this.toggle(item);

        });

    });

};

/*======================================================
    INIT
======================================================*/

MegaMenu.init=async function(){

    this.cache();

    if(!this.exists()) return;

    this.setupARIA();

    this.reset();

    this.bindCore();

    this.initialized=true;

    Log.info(

    "Mega Menu Core Ready"

    );

};

/*======================================================
    REGISTER
======================================================*/

registerModule(

"MegaMenu",

MegaMenu

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 04.4.2 — MEGA MENU GSAP ANIMATION ENGINE

======================================================================*/

/*======================================================
    TIMELINES
======================================================*/

MegaMenu.timelines = new WeakMap();

/*======================================================
    GSAP AVAILABLE
======================================================*/

MegaMenu.hasGSAP = function(){

    return typeof gsap !== "undefined";

};

/*======================================================
    CREATE TIMELINE
======================================================*/

MegaMenu.createTimeline = function(item){

    if(!this.hasGSAP()) return null;

    const panel = this.getPanel(item);

    if(!panel) return null;

    const columns = $$(
        ".mega-column,.mega-item,.mega-card",
        panel
    );

    const heading = $("h2,h3,h4",panel);

    gsap.set(panel,{
        display:"block",
        opacity:0,
        y:18,
        pointerEvents:"none"
    });

    gsap.set(columns,{
        opacity:0,
        y:24
    });

    if(heading){

        gsap.set(heading,{
            opacity:0,
            y:12
        });

    }

    const tl = gsap.timeline({

        paused:true,

        defaults:{
            ease:"power3.out"
        }

    });

    tl

    .to(panel,{

        opacity:1,

        y:0,

        duration:.35,

        pointerEvents:"auto"

    })

    .to(panel,{

        backdropFilter:"blur(24px)",

        duration:.45

    },0);

    if(heading){

        tl.to(

            heading,

            {

                opacity:1,

                y:0,

                duration:.35

            },

            "-=.15"

        );

    }

    if(columns.length){

        tl.to(

            columns,

            {

                opacity:1,

                y:0,

                duration:.45,

                stagger:.06

            },

            "-=.20"

        );

    }

    this.timelines.set(item,tl);

    return tl;

};

/*======================================================
    GET TIMELINE
======================================================*/

MegaMenu.getTimeline = function(item){

    if(

        this.timelines.has(item)

    ){

        return this.timelines.get(item);

    }

    return this.createTimeline(item);

};

/*======================================================
    PLAY
======================================================*/

MegaMenu.play = function(item){

    const tl = this.getTimeline(item);

    if(!tl) return;

    tl.play(0);

};

/*======================================================
    REVERSE
======================================================*/

MegaMenu.reverse = function(item){

    const tl = this.getTimeline(item);

    const panel = this.getPanel(item);

    if(!tl){

        if(panel){

            panel.style.display="none";

        }

        return;

    }

    tl.eventCallback(

        "onReverseComplete",

        ()=>{

            if(panel){

                panel.style.display="none";

            }

        }

    );

    tl.reverse();

};

/*======================================================
    OPEN OVERRIDE
======================================================*/

const megaOpen = MegaMenu.open.bind(MegaMenu);

MegaMenu.open = function(item){

    megaOpen(item);

    this.play(item);

};

/*======================================================
    CLOSE OVERRIDE
======================================================*/

const megaClose = MegaMenu.close.bind(MegaMenu);

MegaMenu.close = function(item){

    this.reverse(item);

    megaClose(item);

};

/*======================================================
    CLOSE ALL OVERRIDE
======================================================*/

const megaCloseAll = MegaMenu.closeAll.bind(MegaMenu);

MegaMenu.closeAll = function(){

    this.elements.items.forEach(item=>{

        this.reverse(item);

    });

    megaCloseAll();

};

/*======================================================
    BACKDROP GLOW
======================================================*/

MegaMenu.animateGlow = function(item){

    if(!this.hasGSAP()) return;

    const panel = this.getPanel(item);

    if(!panel) return;

    gsap.fromTo(

        panel,

        {

            boxShadow:

            "0 0 0 rgba(212,175,55,0)"

        },

        {

            boxShadow:

            "0 30px 80px rgba(212,175,55,.18)",

            duration:.6,

            ease:"power2.out"

        }

    );

};

/*======================================================
    OPEN OVERRIDE 2
======================================================*/

const megaOpenFX = MegaMenu.open.bind(MegaMenu);

MegaMenu.open = function(item){

    megaOpenFX(item);

    this.animateGlow(item);

};

/*======================================================
    INIT TIMELINES
======================================================*/

MegaMenu.prepareAnimations = function(){

    this.elements.items.forEach(item=>{

        this.createTimeline(item);

    });

};

/*======================================================
    INIT EXTENSION
======================================================*/

const megaInit = MegaMenu.init.bind(MegaMenu);

MegaMenu.init = async function(){

    await megaInit();

    this.prepareAnimations();

    Log.info(

        "Mega Menu Animation Ready"

    );

};
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 04.4.3.1 — KEYBOARD NAVIGATION CORE

======================================================================*/

/*======================================================
    ACCESSIBILITY STATE
======================================================*/

MegaMenu.accessibility = {

    keyboardMode:false,

    lastFocused:null,

    currentTrigger:null,

    currentPanel:null,

    focusable:[],

    focusIndex:0

};

/*======================================================
    KEY CODES
======================================================*/

MegaMenu.keys = {

    TAB:"Tab",

    ESC:"Escape",

    ENTER:"Enter",

    SPACE:" ",

    LEFT:"ArrowLeft",

    RIGHT:"ArrowRight",

    UP:"ArrowUp",

    DOWN:"ArrowDown",

    HOME:"Home",

    END:"End"

};

/*======================================================
    FOCUSABLE SELECTOR
======================================================*/

MegaMenu.focusableSelector = [

'a[href]',

'button:not([disabled])',

'input:not([disabled])',

'select:not([disabled])',

'textarea:not([disabled])',

'[tabindex]:not([tabindex="-1"])'

].join(",");

/*======================================================
    UPDATE FOCUSABLE
======================================================*/

MegaMenu.updateFocusable = function(panel){

    if(!panel){

        this.accessibility.focusable=[];

        return;

    }

    this.accessibility.focusable =

    $$(
        this.focusableSelector,
        panel
    );

    this.accessibility.focusIndex=0;

};

/*======================================================
    FIRST FOCUSABLE
======================================================*/

MegaMenu.firstFocusable=function(){

    return this.accessibility

    .focusable[0] || null;

};

/*======================================================
    LAST FOCUSABLE
======================================================*/

MegaMenu.lastFocusable=function(){

    const items=

    this.accessibility.focusable;

    return items[items.length-1]||null;

};

/*======================================================
    SAVE FOCUS
======================================================*/

MegaMenu.saveFocus=function(){

    this.accessibility.lastFocused=

    document.activeElement;

};

/*======================================================
    RESTORE FOCUS
======================================================*/

MegaMenu.restoreFocus=function(){

    const element=

    this.accessibility.lastFocused;

    if(

        element &&

        typeof element.focus==="function"

    ){

        element.focus();

    }

};

/*======================================================
    SET CURRENT
======================================================*/

MegaMenu.setCurrent=function(item){

    this.accessibility.currentTrigger=

    this.getTrigger(item);

    this.accessibility.currentPanel=

    this.getPanel(item);

    this.updateFocusable(

        this.accessibility.currentPanel

    );

};

/*======================================================
    CLEAR CURRENT
======================================================*/

MegaMenu.clearCurrent=function(){

    this.accessibility.currentTrigger=null;

    this.accessibility.currentPanel=null;

    this.accessibility.focusable=[];

    this.accessibility.focusIndex=0;

};

/*======================================================
    FOCUS FIRST
======================================================*/

MegaMenu.focusFirst=function(){

    const first=

    this.firstFocusable();

    if(first){

        first.focus();

    }

};

/*======================================================
    FOCUS LAST
======================================================*/

MegaMenu.focusLast=function(){

    const last=

    this.lastFocusable();

    if(last){

        last.focus();

    }

};

/*======================================================
    KEYBOARD MODE
======================================================*/

MegaMenu.enableKeyboardMode=function(){

    if(

        this.accessibility.keyboardMode

    ) return;

    this.accessibility.keyboardMode=true;

    document.documentElement

    .classList.add(

        "keyboard-navigation"

    );

};

/*======================================================
    POINTER MODE
======================================================*/

MegaMenu.disableKeyboardMode=function(){

    this.accessibility.keyboardMode=false;

    document.documentElement

    .classList.remove(

        "keyboard-navigation"

    );

};

/*======================================================
    INPUT DETECTION
======================================================*/

MegaMenu.detectInput=function(){

    window.addEventListener(

        "keydown",

        ()=>{

            this.enableKeyboardMode();

        }

    );

    window.addEventListener(

        "mousedown",

        ()=>{

            this.disableKeyboardMode();

        }

    );

    window.addEventListener(

        "touchstart",

        ()=>{

            this.disableKeyboardMode();

        },

        {

            passive:true

        }

    );

};

/*======================================================
    OPEN OVERRIDE
======================================================*/

const megaOpenKeyboard =

MegaMenu.open.bind(MegaMenu);

MegaMenu.open=function(item){

    this.saveFocus();

    this.setCurrent(item);

    megaOpenKeyboard(item);

};

/*======================================================
    CLOSE OVERRIDE
======================================================*/

const megaCloseKeyboard=

MegaMenu.close.bind(MegaMenu);

MegaMenu.close=function(item){

    megaCloseKeyboard(item);

    this.restoreFocus();

    this.clearCurrent();

};

/*======================================================
    INIT EXTENSION
======================================================*/

const megaKeyboardInit=

MegaMenu.init.bind(MegaMenu);

MegaMenu.init=async function(){

    await megaKeyboardInit();

    this.detectInput();

    Log.info(

        "Mega Menu Keyboard Core Ready"

    );

};
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 04.4.3.2 — FOCUS TRAP ENGINE

======================================================================*/

/*======================================================
    FOCUS TRAP STATE
======================================================*/

MegaMenu.focusTrap={

    enabled:false,

    listener:null

};

/*======================================================
    REFRESH FOCUSABLE
======================================================*/

MegaMenu.refreshFocusable=function(){

    const panel=

    this.accessibility.currentPanel;

    if(!panel) return;

    this.updateFocusable(panel);

};

/*======================================================
    NEXT FOCUS
======================================================*/

MegaMenu.focusNext=function(){

    const items=

    this.accessibility.focusable;

    if(!items.length) return;

    this.accessibility.focusIndex++;

    if(

        this.accessibility.focusIndex>=

        items.length

    ){

        this.accessibility.focusIndex=0;

    }

    items[

        this.accessibility.focusIndex

    ].focus();

};

/*======================================================
    PREVIOUS FOCUS
======================================================*/

MegaMenu.focusPrevious=function(){

    const items=

    this.accessibility.focusable;

    if(!items.length) return;

    this.accessibility.focusIndex--;

    if(

        this.accessibility.focusIndex<0

    ){

        this.accessibility.focusIndex=

        items.length-1;

    }

    items[

        this.accessibility.focusIndex

    ].focus();

};

/*======================================================
    UPDATE INDEX
======================================================*/

MegaMenu.updateFocusIndex=function(){

    const active=

    document.activeElement;

    this.accessibility.focusIndex=

    this.accessibility.focusable.indexOf(

        active

    );

    if(

        this.accessibility.focusIndex<0

    ){

        this.accessibility.focusIndex=0;

    }

};

/*======================================================
    TAB HANDLER
======================================================*/

MegaMenu.handleTab=function(event){

    this.refreshFocusable();

    if(

        !this.accessibility.focusable.length

    ) return;

    this.updateFocusIndex();

    if(event.shiftKey){

        event.preventDefault();

        this.focusPrevious();

    }

    else{

        event.preventDefault();

        this.focusNext();

    }

};

/*======================================================
    KEYDOWN HANDLER
======================================================*/

MegaMenu.focusTrapKeydown=function(event){

    if(

        !this.focusTrap.enabled

    ) return;

    if(

        event.key===this.keys.TAB

    ){

        this.handleTab(event);

    }

};

/*======================================================
    ENABLE
======================================================*/

MegaMenu.enableFocusTrap=function(){

    if(

        this.focusTrap.enabled

    ) return;

    this.focusTrap.enabled=true;

    this.focusTrap.listener=

    this.focusTrapKeydown.bind(this);

    document.addEventListener(

        "keydown",

        this.focusTrap.listener

    );

    requestAnimationFrame(()=>{

        this.focusFirst();

    });

};

/*======================================================
    DISABLE
======================================================*/

MegaMenu.disableFocusTrap=function(){

    if(

        !this.focusTrap.enabled

    ) return;

    document.removeEventListener(

        "keydown",

        this.focusTrap.listener

    );

    this.focusTrap.enabled=false;

    this.focusTrap.listener=null;

};

/*======================================================
    FOCUS INSIDE
======================================================*/

MegaMenu.isFocusInside=function(){

    const panel=

    this.accessibility.currentPanel;

    if(!panel) return false;

    return panel.contains(

        document.activeElement

    );

};

/*======================================================
    VERIFY
======================================================*/

MegaMenu.verifyFocus=function(){

    if(

        !this.focusTrap.enabled

    ) return;

    if(

        this.isFocusInside()

    ) return;

    this.focusFirst();

};

/*======================================================
    WATCHDOG
======================================================*/

MegaMenu.startFocusWatch=function(){

    this.focusWatch=

    setInterval(()=>{

        this.verifyFocus();

    },250);

};

/*======================================================
    STOP WATCHDOG
======================================================*/

MegaMenu.stopFocusWatch=function(){

    clearInterval(

        this.focusWatch

    );

};

/*======================================================
    OPEN EXTENSION
======================================================*/

const megaTrapOpen=

MegaMenu.open.bind(MegaMenu);

MegaMenu.open=function(item){

    megaTrapOpen(item);

    this.enableFocusTrap();

    this.startFocusWatch();

};

/*======================================================
    CLOSE EXTENSION
======================================================*/

const megaTrapClose=

MegaMenu.close.bind(MegaMenu);

MegaMenu.close=function(item){

    this.disableFocusTrap();

    this.stopFocusWatch();

    megaTrapClose(item);

};

/*======================================================
    CLEANUP
======================================================*/

MegaMenu.cleanupFocusTrap=function(){

    this.disableFocusTrap();

    this.stopFocusWatch();

};

/*======================================================
    PAGE HIDE
======================================================*/

window.addEventListener(

"pagehide",

()=>{

    MegaMenu.cleanupFocusTrap();

});

/*======================================================
    INIT EXTENSION
======================================================*/

const megaTrapInit=

MegaMenu.init.bind(MegaMenu);

MegaMenu.init=async function(){

    await megaTrapInit();

    Log.info(

        "Mega Menu Focus Trap Ready"

    );

};
MegaMenu.open = function(){...}
MegaMenu.close = function(){...}
MegaMenu.init = function(){...}
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    PART 04.4.1
    ENTERPRISE MEGA MENU CORE

======================================================================*/

const MegaMenu = {

    initialized:false,

    activeItem:null,

    activePanel:null,

    isOpen:false,

    timeline:null,

    items:[],

    panels:[],

    triggers:[],

    config:{

        breakpoint:992,

        hoverDelay:120,

        closeDelay:160

    }

};

/*==========================================================
DOM
==========================================================*/

MegaMenu.cache=function(){

    this.items=[

        ...document.querySelectorAll(".has-mega")

    ];

    this.triggers=[

        ...document.querySelectorAll(".has-mega > a")

    ];

    this.panels=[

        ...document.querySelectorAll(".mega-menu")

    ];

};

/*==========================================================
CHECK
==========================================================*/

MegaMenu.exists=function(){

    return this.items.length>0;

};

/*==========================================================
DESKTOP
==========================================================*/

MegaMenu.isDesktop=function(){

    return window.innerWidth>

    this.config.breakpoint;

};

/*==========================================================
GET PANEL
==========================================================*/

MegaMenu.getPanel=function(item){

    return item.querySelector(

        ".mega-menu"

    );

};

/*==========================================================
GET TRIGGER
==========================================================*/

MegaMenu.getTrigger=function(item){

    return item.querySelector("a");

};

/*==========================================================
ARIA
==========================================================*/

MegaMenu.initializeARIA=function(){

    this.items.forEach((item,index)=>{

        const trigger=

        this.getTrigger(item);

        const panel=

        this.getPanel(item);

        if(

            !trigger||

            !panel

        ) return;

        const id=

        "mega-panel-"+index;

        panel.id=id;

        trigger.setAttribute(

            "aria-haspopup",

            "true"

        );

        trigger.setAttribute(

            "aria-expanded",

            "false"

        );

        trigger.setAttribute(

            "aria-controls",

            id

        );

        panel.setAttribute(

            "role",

            "menu"

        );

        panel.setAttribute(

            "aria-hidden",

            "true"

        );

    });

};

/*==========================================================
RESET
==========================================================*/

MegaMenu.reset=function(){

    this.activeItem=null;

    this.activePanel=null;

    this.isOpen=false;

};

/*==========================================================
OPEN
==========================================================*/

MegaMenu.open=function(item){

    if(!item) return;

    if(

        this.activeItem===item

    ) return;

    this.closeAll();

    this.activeItem=item;

    this.activePanel=

    this.getPanel(item);

    item.classList.add(

        "mega-open"

    );

    const trigger=

    this.getTrigger(item);

    if(trigger){

        trigger.setAttribute(

            "aria-expanded",

            "true"

        );

    }

    if(this.activePanel){

        this.activePanel.setAttribute(

            "aria-hidden",

            "false"

        );

    }

    this.isOpen=true;

    EVENTS.emit(

        "mega:open",

        {

            item,

            panel:this.activePanel

        }

    );

};

/*==========================================================
CLOSE
==========================================================*/

MegaMenu.close=function(){

    if(!this.activeItem) return;

    const trigger=

    this.getTrigger(

        this.activeItem

    );

    if(trigger){

        trigger.setAttribute(

            "aria-expanded",

            "false"

        );

    }

    if(this.activePanel){

        this.activePanel.setAttribute(

            "aria-hidden",

            "true"

        );

    }

    this.activeItem.classList.remove(

        "mega-open"

    );

    EVENTS.emit(

        "mega:close",

        {

            item:this.activeItem,

            panel:this.activePanel

        }

    );

    this.reset();

};

/*==========================================================
CLOSE ALL
==========================================================*/

MegaMenu.closeAll=function(){

    this.items.forEach(item=>{

        item.classList.remove(

            "mega-open"

        );

        const trigger=

        this.getTrigger(item);

        const panel=

        this.getPanel(item);

        if(trigger){

            trigger.setAttribute(

                "aria-expanded",

                "false"

            );

        }

        if(panel){

            panel.setAttribute(

                "aria-hidden",

                "true"

            );

        }

    });

    this.reset();

};

/*==========================================================
TOGGLE
==========================================================*/

MegaMenu.toggle=function(item){

    if(

        this.activeItem===item

    ){

        this.close();

    }

    else{

        this.open(item);

    }

};

/*==========================================================
CLICK EVENTS
==========================================================*/

MegaMenu.bindClicks=function(){

    this.items.forEach(item=>{

        const trigger=

        this.getTrigger(item);

        if(!trigger) return;

        trigger.addEventListener(

            "click",

            e=>{

                if(

                    this.isDesktop()

                ){

                    e.preventDefault();

                }

                this.toggle(item);

            }

        );

    });

};

/*==========================================================
INIT
==========================================================*/

MegaMenu.init=async function(){

    this.cache();

    if(

        !this.exists()

    ) return;

    this.initializeARIA();

    this.bindClicks();

    this.initialized=true;

    Log.info(

        "Mega Menu Ready"

    );

};

/*==========================================================
REGISTER
==========================================================*/

registerModule(

    "MegaMenu",

    MegaMenu

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    PART 04.4.2
    MEGA MENU GSAP ANIMATION ENGINE

======================================================================*/

MegaMenu.animation={

    timelines:new WeakMap(),

    duration:.45,

    ease:"power3.out"

};

/*==========================================================
CHECK GSAP
==========================================================*/

MegaMenu.hasGSAP=function(){

    return typeof gsap!=="undefined";

};

/*==========================================================
CREATE TIMELINE
==========================================================*/

MegaMenu.createAnimation=function(panel){

    if(!this.hasGSAP()) return null;

    if(this.animation.timelines.has(panel)){

        return this.animation.timelines.get(panel);

    }

    const columns=[

        ...panel.querySelectorAll(

        ".mega-column,.mega-item,.mega-card"

        )

    ];

    const headings=[

        ...panel.querySelectorAll(

        "h2,h3,h4"

        )

    ];

    const buttons=[

        ...panel.querySelectorAll(

        ".btn"

        )

    ];

    gsap.set(panel,{

        autoAlpha:0,

        y:18,

        display:"block",

        pointerEvents:"none"

    });

    gsap.set(

        [...columns,...headings,...buttons],

        {

            opacity:0,

            y:20

        }

    );

    const tl=gsap.timeline({

        paused:true

    });

    tl.to(panel,{

        autoAlpha:1,

        y:0,

        duration:.35,

        pointerEvents:"auto",

        ease:this.animation.ease

    });

    tl.to(

        headings,

        {

            opacity:1,

            y:0,

            duration:.35,

            stagger:.05

        },

        "-=.2"

    );

    tl.to(

        columns,

        {

            opacity:1,

            y:0,

            duration:.45,

            stagger:.06

        },

        "-=.2"

    );

    tl.to(

        buttons,

        {

            opacity:1,

            y:0,

            duration:.3,

            stagger:.05

        },

        "-=.25"

    );

    this.animation.timelines.set(

        panel,

        tl

    );

    return tl;

};

/*==========================================================
OPEN ANIMATION
==========================================================*/

MegaMenu.animateOpen=function(panel){

    if(!panel) return;

    if(!this.hasGSAP()){

        panel.style.display="block";

        return;

    }

    const tl=

    this.createAnimation(panel);

    tl.play(0);

};

/*==========================================================
CLOSE ANIMATION
==========================================================*/

MegaMenu.animateClose=function(panel){

    if(!panel) return;

    if(!this.hasGSAP()){

        panel.style.display="none";

        return;

    }

    const tl=

    this.createAnimation(panel);

    tl.eventCallback(

        "onReverseComplete",

        ()=>{

            panel.style.display="none";

        }

    );

    tl.reverse();

};

/*==========================================================
BACKGROUND GLOW
==========================================================*/

MegaMenu.glow=function(panel){

    if(

        !panel ||

        !this.hasGSAP()

    ) return;

    gsap.fromTo(

        panel,

        {

            boxShadow:

            "0 0 0 rgba(212,175,55,0)"

        },

        {

            boxShadow:

            "0 35px 90px rgba(212,175,55,.18)",

            duration:.6,

            ease:"power2.out"

        }

    );

};

/*==========================================================
HOVER INTENT
==========================================================*/

MegaMenu.hover={

    openTimer:null,

    closeTimer:null

};

MegaMenu.bindHover=function(){

    if(!this.isDesktop()) return;

    this.items.forEach(item=>{

        item.addEventListener(

            "mouseenter",

            ()=>{

                clearTimeout(

                    this.hover.closeTimer

                );

                this.hover.openTimer=

                setTimeout(()=>{

                    this.open(item);

                },

                this.config.hoverDelay);

            }

        );

        item.addEventListener(

            "mouseleave",

            ()=>{

                clearTimeout(

                    this.hover.openTimer

                );

                this.hover.closeTimer=

                setTimeout(()=>{

                    this.close();

                },

                this.config.closeDelay);

            }

        );

    });

};

/*==========================================================
EVENT BUS
==========================================================*/

EVENTS.on(

    "mega:open",

    ({panel})=>{

        MegaMenu.animateOpen(panel);

        MegaMenu.glow(panel);

    }

);

EVENTS.on(

    "mega:close",

    ({panel})=>{

        MegaMenu.animateClose(panel);

    }

);

/*==========================================================
INIT
==========================================================*/

EVENTS.on(

    "appReady",

    ()=>{

        MegaMenu.bindHover();

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    PART 04.4.3
    MEGA MENU KEYBOARD NAVIGATION

======================================================================*/

MegaMenu.keyboard={

    enabled:true,

    focusableSelector:
`
a[href],
button:not([disabled]),
input:not([disabled]),
select:not([disabled]),
textarea:not([disabled]),
[tabindex]:not([tabindex="-1"])
`

};

/*==========================================================
GET FOCUSABLE
==========================================================*/

MegaMenu.getFocusable=function(panel){

    if(!panel) return [];

    return [

        ...panel.querySelectorAll(

            this.keyboard.focusableSelector

        )

    ];

};

/*==========================================================
FOCUS FIRST
==========================================================*/

MegaMenu.focusFirst=function(){

    if(!this.activePanel) return;

    const items=

    this.getFocusable(

        this.activePanel

    );

    if(items.length){

        items[0].focus();

    }

};

/*==========================================================
FOCUS LAST
==========================================================*/

MegaMenu.focusLast=function(){

    if(!this.activePanel) return;

    const items=

    this.getFocusable(

        this.activePanel

    );

    if(items.length){

        items[items.length-1]

        .focus();

    }

};

/*==========================================================
NEXT TRIGGER
==========================================================*/

MegaMenu.nextTrigger=function(){

    if(!this.activeItem) return;

    let index=

    this.items.indexOf(

        this.activeItem

    );

    index++;

    if(index>=this.items.length){

        index=0;

    }

    this.getTrigger(

        this.items[index]

    ).focus();

};

/*==========================================================
PREVIOUS TRIGGER
==========================================================*/

MegaMenu.previousTrigger=function(){

    if(!this.activeItem) return;

    let index=

    this.items.indexOf(

        this.activeItem

    );

    index--;

    if(index<0){

        index=

        this.items.length-1;

    }

    this.getTrigger(

        this.items[index]

    ).focus();

};

/*==========================================================
HOME
==========================================================*/

MegaMenu.focusHome=function(){

    if(

        !this.items.length

    ) return;

    this.getTrigger(

        this.items[0]

    ).focus();

};

/*==========================================================
END
==========================================================*/

MegaMenu.focusEnd=function(){

    if(

        !this.items.length

    ) return;

    this.getTrigger(

        this.items[

            this.items.length-1

        ]

    ).focus();

};

/*==========================================================
OPEN WITH KEYBOARD
==========================================================*/

MegaMenu.keyboardOpen=function(trigger){

    const item=

    trigger.closest(

        ".has-mega"

    );

    if(!item) return;

    this.open(item);

    requestAnimationFrame(()=>{

        this.focusFirst();

    });

};

/*==========================================================
TRIGGER EVENTS
==========================================================*/

MegaMenu.bindKeyboard=function(){

    this.triggers.forEach(trigger=>{

        trigger.addEventListener(

            "keydown",

            event=>{

                switch(event.key){

                    case"ArrowDown":

                        event.preventDefault();

                        this.keyboardOpen(

                            trigger

                        );

                    break;

                    case"ArrowRight":

                        event.preventDefault();

                        this.nextTrigger();

                    break;

                    case"ArrowLeft":

                        event.preventDefault();

                        this.previousTrigger();

                    break;

                    case"Home":

                        event.preventDefault();

                        this.focusHome();

                    break;

                    case"End":

                        event.preventDefault();

                        this.focusEnd();

                    break;

                    case"Enter":

                    case" ":

                        event.preventDefault();

                        this.keyboardOpen(

                            trigger

                        );

                    break;

                }

            }

        );

    });

};

/*==========================================================
PANEL EVENTS
==========================================================*/

MegaMenu.bindPanelKeyboard=function(){

    document.addEventListener(

        "keydown",

        event=>{

            if(

                !this.isOpen

            ) return;

            switch(event.key){

                case"Escape":

                    event.preventDefault();

                    this.close();

                    if(

                        this.activeItem

                    ){

                        this.getTrigger(

                            this.activeItem

                        )?.focus();

                    }

                break;

                case"Home":

                    event.preventDefault();

                    this.focusFirst();

                break;

                case"End":

                    event.preventDefault();

                    this.focusLast();

                break;

            }

        }

    );

};

/*==========================================================
TABINDEX
==========================================================*/

MegaMenu.updateTabIndex=function(){

    this.panels.forEach(panel=>{

        const focusable=

        this.getFocusable(panel);

        focusable.forEach(el=>{

            el.tabIndex=

            panel===this.activePanel

            ?0

            :-1;

        });

    });

};

/*==========================================================
EVENTS
==========================================================*/

EVENTS.on(

    "mega:open",

    ()=>{

        MegaMenu.updateTabIndex();

    }

);

EVENTS.on(

    "mega:close",

    ()=>{

        MegaMenu.updateTabIndex();

    }

);

/*==========================================================
INIT
==========================================================*/

EVENTS.on(

    "appReady",

    ()=>{

        MegaMenu.bindKeyboard();

        MegaMenu.bindPanelKeyboard();

        MegaMenu.updateTabIndex();

        Log.info(

            "Mega Menu Keyboard Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    PART 04.4.4
    FOCUS TRAP & ACCESSIBILITY

======================================================================*/

MegaMenu.focus={

    previous:null,

    enabled:false,

    liveRegion:null

};

/*==========================================================
CREATE LIVE REGION
==========================================================*/

MegaMenu.createLiveRegion=function(){

    const region=document.createElement("div");

    region.className="sr-only";

    region.setAttribute(

        "aria-live",

        "polite"

    );

    region.setAttribute(

        "aria-atomic",

        "true"

    );

    document.body.appendChild(region);

    this.focus.liveRegion=region;

};

/*==========================================================
ANNOUNCE
==========================================================*/

MegaMenu.announce=function(text){

    if(!this.focus.liveRegion) return;

    this.focus.liveRegion.textContent="";

    requestAnimationFrame(()=>{

        this.focus.liveRegion.textContent=text;

    });

};

/*==========================================================
SAVE FOCUS
==========================================================*/

MegaMenu.saveFocus=function(){

    this.focus.previous=

    document.activeElement;

};

/*==========================================================
RESTORE FOCUS
==========================================================*/

MegaMenu.restoreFocus=function(){

    if(

        this.focus.previous &&

        typeof this.focus.previous.focus==="function"

    ){

        this.focus.previous.focus();

    }

};

/*==========================================================
FOCUSABLE
==========================================================*/

MegaMenu.getPanelFocusable=function(){

    if(!this.activePanel) return [];

    return this.getFocusable(

        this.activePanel

    );

};

/*==========================================================
TAB LOOP
==========================================================*/

MegaMenu.handleTab=function(event){

    const items=

    this.getPanelFocusable();

    if(!items.length) return;

    const first=items[0];

    const last=

    items[items.length-1];

    if(

        event.shiftKey &&

        document.activeElement===first

    ){

        event.preventDefault();

        last.focus();

    }

    else if(

        !event.shiftKey &&

        document.activeElement===last

    ){

        event.preventDefault();

        first.focus();

    }

};

/*==========================================================
KEYBOARD
==========================================================*/

MegaMenu.focusHandler=function(event){

    if(

        !this.isOpen ||

        !this.activePanel

    ) return;

    switch(event.key){

        case"Tab":

            this.handleTab(event);

        break;

        case"Escape":

            event.preventDefault();

            this.close();

            this.restoreFocus();

        break;

    }

};

/*==========================================================
ENABLE
==========================================================*/

MegaMenu.enableFocusTrap=function(){

    if(

        this.focus.enabled

    ) return;

    this.focus.enabled=true;

    document.addEventListener(

        "keydown",

        this.boundFocusHandler

    );

};

/*==========================================================
DISABLE
==========================================================*/

MegaMenu.disableFocusTrap=function(){

    this.focus.enabled=false;

    document.removeEventListener(

        "keydown",

        this.boundFocusHandler

    );

};

/*==========================================================
CLICK OUTSIDE
==========================================================*/

MegaMenu.clickOutside=function(event){

    if(

        !this.isOpen

    ) return;

    if(

        this.activeItem &&

        !this.activeItem.contains(

            event.target

        )

    ){

        this.close();

    }

};

/*==========================================================
WINDOW BLUR
==========================================================*/

MegaMenu.windowBlur=function(){

    if(

        this.isOpen

    ){

        this.close();

    }

};

/*==========================================================
ARIA UPDATE
==========================================================*/

MegaMenu.updateAccessibility=function(){

    this.items.forEach(item=>{

        const trigger=

        this.getTrigger(item);

        const panel=

        this.getPanel(item);

        const active=

        item===this.activeItem;

        if(trigger){

            trigger.setAttribute(

                "aria-expanded",

                active

            );

        }

        if(panel){

            panel.setAttribute(

                "aria-hidden",

                !active

            );

        }

    });

};

/*==========================================================
OPEN EVENT
==========================================================*/

EVENTS.on(

"mega:open",

()=>{

    MegaMenu.saveFocus();

    MegaMenu.enableFocusTrap();

    MegaMenu.updateAccessibility();

    MegaMenu.announce(

    "Mega menu opened"

    );

});

/*==========================================================
CLOSE EVENT
==========================================================*/

EVENTS.on(

"mega:close",

()=>{

    MegaMenu.disableFocusTrap();

    MegaMenu.restoreFocus();

    MegaMenu.updateAccessibility();

    MegaMenu.announce(

    "Mega menu closed"

    );

});

/*==========================================================
INIT
==========================================================*/

EVENTS.on(

"appReady",

()=>{

    MegaMenu.boundFocusHandler=

    MegaMenu.focusHandler.bind(

        MegaMenu

    );

    MegaMenu.createLiveRegion();

    document.addEventListener(

        "click",

        MegaMenu.clickOutside.bind(

            MegaMenu

        )

    );

    window.addEventListener(

        "blur",

        MegaMenu.windowBlur.bind(

            MegaMenu

        )

    );

    Log.info(

        "Mega Menu Accessibility Ready"

    );

});
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    PART 04.4.5
    MEGA MENU PRODUCTION FINALIZATION

======================================================================*/

/*==========================================================
    RESIZE MANAGER
==========================================================*/

MegaMenu.onResize=function(){

    if(!this.isDesktop()){

        this.close();

    }

};

MegaMenu.resizeHandler=debounce(function(){

    MegaMenu.onResize();

},150);

/*==========================================================
    SCROLL CLOSE
==========================================================*/

MegaMenu.onScroll=function(){

    if(!this.isOpen) return;

    this.close();

};

/*==========================================================
    TOUCH SUPPORT
==========================================================*/

MegaMenu.bindTouch=function(){

    this.items.forEach(item=>{

        const trigger=this.getTrigger(item);

        if(!trigger) return;

        trigger.addEventListener(

            "touchstart",

            ()=>{

                if(this.isDesktop()) return;

                this.toggle(item);

            },

            {

                passive:true

            }

        );

    });

};

/*==========================================================
    CLICK OUTSIDE
==========================================================*/

MegaMenu.bindOutside=function(){

    document.addEventListener(

        "pointerdown",

        event=>{

            if(!this.isOpen) return;

            if(

                this.activeItem &&

                !this.activeItem.contains(

                    event.target

                )

            ){

                this.close();

            }

        }

    );

};

/*==========================================================
    CLOSE ON ESC
==========================================================*/

MegaMenu.bindEscape=function(){

    document.addEventListener(

        "keydown",

        event=>{

            if(

                event.key!=="Escape"

            ) return;

            if(

                !this.isOpen

            ) return;

            this.close();

        }

    );

};

/*==========================================================
    PERFORMANCE
==========================================================*/

MegaMenu.optimize=function(){

    this.panels.forEach(panel=>{

        panel.style.willChange=

        "transform,opacity";

        panel.style.backfaceVisibility=

        "hidden";

    });

};

/*==========================================================
    CLEANUP
==========================================================*/

MegaMenu.destroy=function(){

    window.removeEventListener(

        "resize",

        this.resizeHandler

    );

    window.removeEventListener(

        "scroll",

        this.onScroll

    );

    this.closeAll();

};

/*==========================================================
    WINDOW EVENTS
==========================================================*/

MegaMenu.bindWindow=function(){

    window.addEventListener(

        "resize",

        this.resizeHandler

    );

    window.addEventListener(

        "scroll",

        this.onScroll.bind(this),

        {

            passive:true

        }

    );

};

/*==========================================================
    APP EVENTS
==========================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        Log.info(

            "Mega Menu Ready"

        );

    }

);

EVENTS.on(

    "pageVisible",

    ()=>{

        MegaMenu.updateAccessibility();

    }

);

/*==========================================================
    INIT
==========================================================*/

EVENTS.on(

    "appReady",

    ()=>{

        MegaMenu.bindTouch();

        MegaMenu.bindOutside();

        MegaMenu.bindEscape();

        MegaMenu.bindWindow();

        MegaMenu.optimize();

    }

);

/*==========================================================
    VERSION
==========================================================*/

MegaMenu.version={

    module:"Mega Menu",

    version:"1.0.0",

    author:"Director VISION"

};

Log.info(

    "Mega Menu Module Loaded"

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 04.5 — CORE EVENT MANAGER

======================================================================*/

const EventManager={

    initialized:false,

    mouse:{
        x:0,
        y:0
    },

    scroll:{
        x:0,
        y:0,
        direction:"up",
        velocity:0
    },

    viewport:{
        width:window.innerWidth,
        height:window.innerHeight
    },

    keyboard:{
        key:null,
        ctrl:false,
        shift:false,
        alt:false
    },

    raf:false

};

/*==================================================
SCROLL
==================================================*/

EventManager.onScroll=function(){

    const previous=this.scroll.y;

    this.scroll.y=window.scrollY;

    this.scroll.x=window.scrollX;

    this.scroll.velocity=

    Math.abs(

        this.scroll.y-previous

    );

    this.scroll.direction=

    this.scroll.y>previous

    ?"down":"up";

    EVENTS.emit(

        "scroll:update",

        this.scroll

    );

};

/*==================================================
RESIZE
==================================================*/

EventManager.onResize=function(){

    this.viewport.width=

    window.innerWidth;

    this.viewport.height=

    window.innerHeight;

    EVENTS.emit(

        "viewport:resize",

        this.viewport

    );

};

/*==================================================
MOUSE
==================================================*/

EventManager.onMouseMove=function(event){

    this.mouse.x=event.clientX;

    this.mouse.y=event.clientY;

    EVENTS.emit(

        "mouse:move",

        this.mouse

    );

};

/*==================================================
KEYBOARD
==================================================*/

EventManager.onKeyDown=function(event){

    this.keyboard.key=

    event.key;

    this.keyboard.ctrl=

    event.ctrlKey;

    this.keyboard.shift=

    event.shiftKey;

    this.keyboard.alt=

    event.altKey;

    EVENTS.emit(

        "keyboard:down",

        event

    );

};

EventManager.onKeyUp=function(event){

    EVENTS.emit(

        "keyboard:up",

        event

    );

};

/*==================================================
CLICK
==================================================*/

EventManager.onClick=function(event){

    EVENTS.emit(

        "pointer:click",

        event

    );

};

/*==================================================
POINTER
==================================================*/

EventManager.onPointerDown=function(event){

    EVENTS.emit(

        "pointer:down",

        event

    );

};

EventManager.onPointerUp=function(event){

    EVENTS.emit(

        "pointer:up",

        event

    );

};

/*==================================================
RAF
==================================================*/

EventManager.update=function(){

    EVENTS.emit(

        "frame:update",

        performance.now()

    );

    requestAnimationFrame(

        this.update.bind(this)

    );

};

/*==================================================
VISIBILITY
==================================================*/

EventManager.onVisibility=function(){

    EVENTS.emit(

        document.hidden

        ?"page:hidden"

        :"page:visible"

    );

};

/*==================================================
ONLINE
==================================================*/

EventManager.onOnline=function(){

    EVENTS.emit(

        "network:online"

    );

};

EventManager.onOffline=function(){

    EVENTS.emit(

        "network:offline"

    );

};

/*==================================================
BIND
==================================================*/

EventManager.bind=function(){

    window.addEventListener(

        "scroll",

        this.onScroll.bind(this),

        {

            passive:true

        }

    );

    window.addEventListener(

        "resize",

        debounce(

            this.onResize.bind(this),

            100

        )

    );

    window.addEventListener(

        "mousemove",

        throttle(

            this.onMouseMove.bind(this),

            16

        ),

        {

            passive:true

        }

    );

    window.addEventListener(

        "keydown",

        this.onKeyDown.bind(this)

    );

    window.addEventListener(

        "keyup",

        this.onKeyUp.bind(this)

    );

    window.addEventListener(

        "click",

        this.onClick.bind(this)

    );

    window.addEventListener(

        "pointerdown",

        this.onPointerDown.bind(this)

    );

    window.addEventListener(

        "pointerup",

        this.onPointerUp.bind(this)

    );

    window.addEventListener(

        "online",

        this.onOnline.bind(this)

    );

    window.addEventListener(

        "offline",

        this.onOffline.bind(this)

    );

    document.addEventListener(

        "visibilitychange",

        this.onVisibility.bind(this)

    );

};

/*==================================================
INIT
==================================================*/

EventManager.init=async function(){

    if(this.initialized) return;

    this.bind();

    this.update();

    this.initialized=true;

    Log.info(

        "Core Event Manager Ready"

    );

};

/*==================================================
REGISTER
==================================================*/

registerModule(

    "EventManager",

    EventManager

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 04.6 — AUTO HIDE / SHOW NAVIGATION

======================================================================*/

const NavigationVisibility={

    hidden:false,

    lastScroll:0,

    threshold:120,

    delta:8,

    enabled:true,

    header:null

};

/*==================================================
CACHE
==================================================*/

NavigationVisibility.cache=function(){

    this.header=

    document.querySelector("header");

};

/*==================================================
HIDE
==================================================*/

NavigationVisibility.hide=function(){

    if(

        this.hidden ||

        !this.header

    ) return;

    this.hidden=true;

    this.header.classList.add(

        "nav-hidden"

    );

    this.header.classList.remove(

        "nav-visible"

    );

    EVENTS.emit(

        "navigation:hidden"

    );

};

/*==================================================
SHOW
==================================================*/

NavigationVisibility.show=function(){

    if(

        !this.hidden ||

        !this.header

    ) return;

    this.hidden=false;

    this.header.classList.remove(

        "nav-hidden"

    );

    this.header.classList.add(

        "nav-visible"

    );

    EVENTS.emit(

        "navigation:visible"

    );

};

/*==================================================
SCROLL
==================================================*/

NavigationVisibility.update=function(scroll){

    if(

        !this.enabled ||

        !this.header

    ) return;

    const current=

    scroll.y;

    const diff=

    current-

    this.lastScroll;

    if(

        current<

        this.threshold

    ){

        this.show();

        this.lastScroll=current;

        return;

    }

    if(

        diff>

        this.delta

    ){

        this.hide();

    }

    else if(

        diff<

        -this.delta

    ){

        this.show();

    }

    this.lastScroll=current;

};

/*==================================================
FREEZE
==================================================*/

NavigationVisibility.freeze=function(){

    this.enabled=false;

    this.show();

};

/*==================================================
UNFREEZE
==================================================*/

NavigationVisibility.unfreeze=function(){

    this.enabled=true;

};

/*==================================================
EVENTS
==================================================*/

EVENTS.on(

    "scroll:update",

    scroll=>{

        NavigationVisibility.update(

            scroll

        );

    }

);

EVENTS.on(

    "mega:open",

    ()=>{

        NavigationVisibility.freeze();

    }

);

EVENTS.on(

    "mega:close",

    ()=>{

        NavigationVisibility.unfreeze();

    }

);

EVENTS.on(

    "windowLoaded",

    ()=>{

        NavigationVisibility.show();

    }

);

/*==================================================
INIT
==================================================*/

NavigationVisibility.init=async function(){

    this.cache();

    if(!this.header) return;

    this.header.classList.add(

        "nav-visible"

    );

    Log.info(

        "Navigation Visibility Ready"

    );

};

/*==================================================
REGISTER
==================================================*/

registerModule(

    "NavigationVisibility",

    NavigationVisibility

);
```
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 04.3.1 — MOBILE MENU CORE

======================================================================*/

const MobileMenu={

    initialized:false,

    isOpen:false,

    isAnimating:false,

    activeLevel:0,

    elements:{},

    config:{

        breakpoint:992,

        animationDuration:.55

    }

};

/*==================================================
CACHE
==================================================*/

MobileMenu.cache=function(){

    this.elements.toggle=

    document.querySelector(

        ".menu-toggle"

    );

    this.elements.menu=

    document.querySelector(

        ".mobile-menu"

    );

    this.elements.overlay=

    document.querySelector(

        ".mobile-overlay"

    );

    this.elements.close=

    document.querySelector(

        ".mobile-close"

    );

    this.elements.links=[

        ...document.querySelectorAll(

            ".mobile-menu .nav-link"

        )

    ];

    this.elements.dropdowns=[

        ...document.querySelectorAll(

            ".mobile-dropdown"

        )

    ];

    this.elements.back=[

        ...document.querySelectorAll(

            ".mobile-back"

        )

    ];

};

/*==================================================
CHECK
==================================================*/

MobileMenu.exists=function(){

    return(

        this.elements.menu&&

        this.elements.toggle

    );

};

/*==================================================
DEVICE
==================================================*/

MobileMenu.isMobile=function(){

    return(

        window.innerWidth<=

        this.config.breakpoint

    );

};

/*==================================================
LOCK
==================================================*/

MobileMenu.lock=function(){

    document.body.classList.add(

        "menu-open"

    );

    document.body.style.overflow=

    "hidden";

};

/*==================================================
UNLOCK
==================================================*/

MobileMenu.unlock=function(){

    document.body.classList.remove(

        "menu-open"

    );

    document.body.style.removeProperty(

        "overflow"

    );

};

/*==================================================
RESET
==================================================*/

MobileMenu.reset=function(){

    this.activeLevel=0;

    this.elements.dropdowns.forEach(

        panel=>{

            panel.classList.remove(

                "active"

            );

        }

    );

};

/*==================================================
OPEN
==================================================*/

MobileMenu.open=function(){

    if(

        this.isOpen||

        this.isAnimating

    ) return;

    this.isAnimating=true;

    this.isOpen=true;

    this.lock();

    this.elements.menu.classList.add(

        "is-open"

    );

    this.elements.overlay?.classList.add(

        "active"

    );

    EVENTS.emit(

        "mobileMenu:open"

    );

};

/*==================================================
CLOSE
==================================================*/

MobileMenu.close=function(){

    if(

        !this.isOpen||

        this.isAnimating

    ) return;

    this.isAnimating=true;

    this.isOpen=false;

    this.unlock();

    this.reset();

    this.elements.menu.classList.remove(

        "is-open"

    );

    this.elements.overlay?.classList.remove(

        "active"

    );

    EVENTS.emit(

        "mobileMenu:close"

    );

};

/*==================================================
TOGGLE
==================================================*/

MobileMenu.toggle=function(){

    this.isOpen

    ?this.close()

    :this.open();

};

/*==================================================
SUBMENU
==================================================*/

MobileMenu.openSubmenu=function(panel){

    if(!panel) return;

    panel.classList.add(

        "active"

    );

    this.activeLevel++;

};

MobileMenu.closeSubmenu=function(){

    const active=

    this.elements.menu.querySelector(

        ".mobile-dropdown.active"

    );

    if(!active) return;

    active.classList.remove(

        "active"

    );

    this.activeLevel--;

    if(this.activeLevel<0)

    this.activeLevel=0;

};

/*==================================================
LINKS
==================================================*/

MobileMenu.bindLinks=function(){

    this.elements.links.forEach(

        link=>{

            const submenu=

            link.nextElementSibling;

            if(

                submenu&&

                submenu.classList.contains(

                    "mobile-dropdown"

                )

            ){

                link.addEventListener(

                    "click",

                    e=>{

                        if(

                            !this.isMobile()

                        ) return;

                        e.preventDefault();

                        this.openSubmenu(

                            submenu

                        );

                    }

                );

            }

        }

    );

    this.elements.back.forEach(

        button=>{

            button.addEventListener(

                "click",

                ()=>{

                    this.closeSubmenu();

                }

            );

        }

    );

};

/*==================================================
BUTTONS
==================================================*/

MobileMenu.bindButtons=function(){

    this.elements.toggle?.addEventListener(

        "click",

        ()=>{

            this.toggle();

        }

    );

    this.elements.close?.addEventListener(

        "click",

        ()=>{

            this.close();

        }

    );

};

/*==================================================
EVENTS
==================================================*/

EVENTS.on(

    "viewport:resize",

    ()=>{

        if(

            !MobileMenu.isMobile()

        ){

            MobileMenu.close();

        }

    }

);

/*==================================================
INIT
==================================================*/

MobileMenu.init=async function(){

    this.cache();

    if(

        !this.exists()

    ) return;

    this.bindButtons();

    this.bindLinks();

    this.initialized=true;

    Log.info(

        "Mobile Menu Core Ready"

    );

};

/*==================================================
REGISTER
==================================================*/

registerModule(

    "MobileMenu",

    MobileMenu

);
```
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 04.3.3 — FULLSCREEN MENU INTERACTION ENGINE

======================================================================*/

/*==================================================
FOCUS
==================================================*/

MobileMenu.focus={

    previous:null,

    selector:
`
a[href],
button,
input,
textarea,
select,
[tabindex]:not([tabindex="-1"])
`

};

/*==================================================
SAVE FOCUS
==================================================*/

MobileMenu.saveFocus=function(){

    this.focus.previous=

    document.activeElement;

};

/*==================================================
RESTORE FOCUS
==================================================*/

MobileMenu.restoreFocus=function(){

    if(

        this.focus.previous &&

        typeof this.focus.previous.focus==="function"

    ){

        this.focus.previous.focus();

    }

};

/*==================================================
FIRST FOCUS
==================================================*/

MobileMenu.focusFirst=function(){

    const first=

    this.elements.menu.querySelector(

        this.focus.selector

    );

    if(first){

        first.focus();

    }

};

/*==================================================
TAB TRAP
==================================================*/

MobileMenu.handleTab=function(event){

    if(!this.isOpen) return;

    const items=[

        ...this.elements.menu.querySelectorAll(

            this.focus.selector

        )

    ];

    if(!items.length) return;

    const first=items[0];

    const last=items[items.length-1];

    if(

        event.shiftKey &&

        document.activeElement===first

    ){

        event.preventDefault();

        last.focus();

    }

    else if(

        !event.shiftKey &&

        document.activeElement===last

    ){

        event.preventDefault();

        first.focus();

    }

};

/*==================================================
KEYBOARD
==================================================*/

MobileMenu.onKeyDown=function(event){

    if(!this.isOpen) return;

    switch(event.key){

        case"Escape":

            event.preventDefault();

            this.close();

        break;

        case"Tab":

            this.handleTab(event);

        break;

    }

};

/*==================================================
OUTSIDE CLICK
==================================================*/

MobileMenu.onPointer=function(event){

    if(!this.isOpen) return;

    if(

        this.elements.menu.contains(

            event.target

        )

    ) return;

    if(

        this.elements.toggle.contains(

            event.target

        )

    ) return;

    this.close();

};

/*==================================================
LINK CLOSE
==================================================*/

MobileMenu.autoClose=function(){

    this.elements.links.forEach(

        link=>{

            if(

                link.nextElementSibling

            ) return;

            link.addEventListener(

                "click",

                ()=>{

                    this.close();

                }

            );

        }

    );

};

/*==================================================
EVENTS
==================================================*/

EVENTS.on(

    "mobileMenu:open",

    ()=>{

        MobileMenu.saveFocus();

        requestAnimationFrame(()=>{

            MobileMenu.focusFirst();

        });

    }

);

EVENTS.on(

    "mobileMenu:close",

    ()=>{

        MobileMenu.restoreFocus();

    }

);

/*==================================================
BIND
==================================================*/

MobileMenu.bindInteraction=function(){

    document.addEventListener(

        "keydown",

        this.onKeyDown.bind(this)

    );

    document.addEventListener(

        "pointerdown",

        this.onPointer.bind(this)

    );

    this.autoClose();

};

/*==================================================
READY
==================================================*/

EVENTS.on(

    "appReady",

    ()=>{

        MobileMenu.bindInteraction();

        Log.info(

            "Mobile Menu Interaction Ready"

        );

    }

);
```
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 04.3.4 — TOUCH GESTURES & ACCESSIBILITY

======================================================================*/

/*==================================================
TOUCH
==================================================*/

MobileMenu.touch={

    startX:0,

    startY:0,

    endX:0,

    endY:0,

    minDistance:80,

    tracking:false

};

/*==================================================
START
==================================================*/

MobileMenu.touchStart=function(event){

    if(!this.isOpen) return;

    const touch=

    event.touches[0];

    this.touch.startX=

    touch.clientX;

    this.touch.startY=

    touch.clientY;

    this.touch.tracking=true;

};

/*==================================================
MOVE
==================================================*/

MobileMenu.touchMove=function(event){

    if(

        !this.touch.tracking||

        !this.isOpen

    ) return;

    const touch=

    event.touches[0];

    this.touch.endX=

    touch.clientX;

    this.touch.endY=

    touch.clientY;

};

/*==================================================
END
==================================================*/

MobileMenu.touchEnd=function(){

    if(

        !this.touch.tracking

    ) return;

    const dx=

    this.touch.endX-

    this.touch.startX;

    const dy=

    Math.abs(

        this.touch.endY-

        this.touch.startY

    );

    if(

        dx>

        this.touch.minDistance &&

        dy<70

    ){

        this.close();

    }

    this.touch.tracking=false;

};

/*==================================================
ARIA
==================================================*/

MobileMenu.updateARIA=function(){

    const expanded=

    this.isOpen;

    this.elements.toggle?.setAttribute(

        "aria-expanded",

        expanded

    );

    this.elements.menu?.setAttribute(

        "aria-hidden",

        !expanded

    );

};

/*==================================================
LABEL
==================================================*/

MobileMenu.updateLabel=function(){

    if(

        !this.elements.toggle

    ) return;

    this.elements.toggle.setAttribute(

        "aria-label",

        this.isOpen

        ?"Close Navigation"

        :"Open Navigation"

    );

};

/*==================================================
BODY
==================================================*/

MobileMenu.updateBody=function(){

    document.body.classList.toggle(

        "mobile-menu-open",

        this.isOpen

    );

};

/*==================================================
SAFE AREA
==================================================*/

MobileMenu.safeArea=function(){

    document.documentElement.style.setProperty(

        "--safe-top",

        "env(safe-area-inset-top)"

    );

    document.documentElement.style.setProperty(

        "--safe-bottom",

        "env(safe-area-inset-bottom)"

    );

};

/*==================================================
REDUCED MOTION
==================================================*/

MobileMenu.motion=function(){

    const reduce=

    window.matchMedia(

        "(prefers-reduced-motion: reduce)"

    ).matches;

    document.documentElement.classList.toggle(

        "reduced-motion",

        reduce

    );

};

/*==================================================
EVENTS
==================================================*/

EVENTS.on(

    "mobileMenu:open",

    ()=>{

        MobileMenu.updateARIA();

        MobileMenu.updateLabel();

        MobileMenu.updateBody();

    }

);

EVENTS.on(

    "mobileMenu:close",

    ()=>{

        MobileMenu.updateARIA();

        MobileMenu.updateLabel();

        MobileMenu.updateBody();

    }

);

/*==================================================
TOUCH
==================================================*/

MobileMenu.bindTouch=function(){

    this.elements.menu.addEventListener(

        "touchstart",

        this.touchStart.bind(this),

        {

            passive:true

        }

    );

    this.elements.menu.addEventListener(

        "touchmove",

        this.touchMove.bind(this),

        {

            passive:true

        }

    );

    this.elements.menu.addEventListener(

        "touchend",

        this.touchEnd.bind(this)

    );

};

/*==================================================
READY
==================================================*/

EVENTS.on(

    "appReady",

    ()=>{

        MobileMenu.safeArea();

        MobileMenu.motion();

        MobileMenu.updateARIA();

        MobileMenu.updateLabel();

        MobileMenu.bindTouch();

        Log.info(

            "Mobile Accessibility Ready"

        );

    }

);
```
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 04.3.5 — MOBILE MENU FINALIZATION

======================================================================*/

/*==================================================
STATE
==================================================*/

MobileMenu.final={

    initialized:false,

    observers:[],

    cleanup:[]

};

/*==================================================
ACTIVE LINK
==================================================*/

MobileMenu.updateActiveLink=function(){

    const current=

    State.currentSection||

    location.hash.replace("#","");

    this.elements.links.forEach(link=>{

        const href=

        link.getAttribute("href");

        if(

            !href||

            !href.startsWith("#")

        ) return;

        const active=

        href==="#"+current;

        link.classList.toggle(

            "active",

            active

        );

        link.setAttribute(

            "aria-current",

            active

            ?"page"

            :"false"

        );

    });

};

/*==================================================
LAZY OBSERVER
==================================================*/

MobileMenu.observeMenu=function(){

    if(

        !("IntersectionObserver" in window)

    ) return;

    const observer=

    new IntersectionObserver(

        entries=>{

            entries.forEach(entry=>{

                entry.target.classList.toggle(

                    "in-view",

                    entry.isIntersecting

                );

            });

        },

        {

            threshold:.15

        }

    );

    this.elements.links.forEach(link=>{

        observer.observe(link);

    });

    this.final.observers.push(observer);

};

/*==================================================
PERFORMANCE
==================================================*/

MobileMenu.optimize=function(){

    this.elements.menu.style.willChange=

    "transform";

    this.elements.overlay?.style.setProperty(

        "will-change",

        "opacity"

    );

};

/*==================================================
RESET
==================================================*/

MobileMenu.resetMenu=function(){

    this.elements.dropdowns.forEach(panel=>{

        panel.classList.remove(

            "active"

        );

    });

    this.activeLevel=0;

};

/*==================================================
CLOSE EVENTS
==================================================*/

EVENTS.on(

    "page:hidden",

    ()=>{

        MobileMenu.close();

    }

);

EVENTS.on(

    "navigation:hidden",

    ()=>{

        if(

            MobileMenu.isOpen

        ){

            MobileMenu.close();

        }

    }

);

EVENTS.on(

    "scroll:update",

    ()=>{

        MobileMenu.updateActiveLink();

    }

);

/*==================================================
DESTROY
==================================================*/

MobileMenu.destroy=function(){

    this.final.observers.forEach(observer=>{

        observer.disconnect();

    });

    this.final.cleanup.forEach(fn=>{

        if(

            typeof fn==="function"

        ){

            fn();

        }

    });

    this.final.observers=[];

    this.final.cleanup=[];

    this.resetMenu();

};

/*==================================================
MODULE READY
==================================================*/

MobileMenu.ready=function(){

    this.optimize();

    this.observeMenu();

    this.updateActiveLink();

    this.final.initialized=true;

};

/*==================================================
EVENTS
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        MobileMenu.ready();

    }

);

EVENTS.on(

    "page:visible",

    ()=>{

        MobileMenu.updateActiveLink();

    }

);

/*==================================================
VERSION
==================================================*/

MobileMenu.version={

    module:"Mobile Menu",

    version:"1.0.0",

    build:"2026.08"

};

Log.info(

    "Mobile Menu Module Loaded",

    MobileMenu.version

);

/*==================================================
COMPLETE
==================================================*/

EVENTS.emit(

    "mobileMenu:initialized"

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 05.1 — HERO ENGINE CORE

======================================================================*/

const Hero={

    initialized:false,

    loaded:false,

    timeline:null,

    elements:{},

    mouse:{

        x:0,

        y:0

    },

    config:{

        parallax:.04,

        revealDuration:1.4,

        ease:"power4.out"

    }

};

/*==================================================
CACHE
==================================================*/

Hero.cache=function(){

    this.elements.section=

    document.querySelector("#hero");

    this.elements.title=

    document.querySelector(".hero-title");

    this.elements.subtitle=

    document.querySelector(".hero-subtitle");

    this.elements.description=

    document.querySelector(".hero-description");

    this.elements.buttons=[

        ...document.querySelectorAll(

            ".hero-actions .btn"

        )

    ];

    this.elements.image=

    document.querySelector(

        ".hero-image"

    );

    this.elements.video=

    document.querySelector(

        ".hero-video"

    );

    this.elements.scroll=

    document.querySelector(

        ".scroll-indicator"

    );

    this.elements.shapes=[

        ...document.querySelectorAll(

            ".hero-parallax"

        )

    ];

};

/*==================================================
CHECK
==================================================*/

Hero.exists=function(){

    return !!this.elements.section;

};

/*==================================================
GSAP
==================================================*/

Hero.hasGSAP=function(){

    return typeof gsap!=="undefined";

};

/*==================================================
INITIAL STATE
==================================================*/

Hero.prepare=function(){

    if(

        !this.hasGSAP()

    ) return;

    gsap.set([

        this.elements.title,

        this.elements.subtitle,

        this.elements.description,

        ...this.elements.buttons,

        this.elements.image,

        this.elements.scroll

    ],{

        autoAlpha:0,

        y:60

    });

};

/*==================================================
TIMELINE
==================================================*/

Hero.createTimeline=function(){

    if(

        !this.hasGSAP()

    ) return;

    this.timeline=

    gsap.timeline({

        paused:true,

        defaults:{

            ease:this.config.ease

        }

    });

    this.timeline

    .to(

        this.elements.title,

        {

            autoAlpha:1,

            y:0,

            duration:1

        }

    )

    .to(

        this.elements.subtitle,

        {

            autoAlpha:1,

            y:0,

            duration:.7

        },

        "-=.6"

    )

    .to(

        this.elements.description,

        {

            autoAlpha:1,

            y:0,

            duration:.7

        },

        "-=.5"

    )

    .to(

        this.elements.buttons,

        {

            autoAlpha:1,

            y:0,

            stagger:.12,

            duration:.55

        },

        "-=.4"

    )

    .to(

        this.elements.image,

        {

            autoAlpha:1,

            y:0,

            scale:1,

            duration:1

        },

        "-=.7"

    )

    .to(

        this.elements.scroll,

        {

            autoAlpha:1,

            y:0,

            duration:.5

        },

        "-=.3"

    );

};

/*==================================================
PLAY
==================================================*/

Hero.play=function(){

    if(

        this.timeline

    ){

        this.timeline.play(0);

    }

};

/*==================================================
PARALLAX
==================================================*/

Hero.updateParallax=function(mouse){

    if(

        !this.elements.shapes.length

    ) return;

    const x=

    (mouse.x/window.innerWidth-.5);

    const y=

    (mouse.y/window.innerHeight-.5);

    this.elements.shapes.forEach(

        (el,index)=>{

            const speed=

            (index+1)*25*

            this.config.parallax;

            if(this.hasGSAP()){

                gsap.to(el,{

                    x:x*speed,

                    y:y*speed,

                    duration:.8,

                    ease:"power2.out"

                });

            }

        }

    );

};

/*==================================================
EVENTS
==================================================*/

EVENTS.on(

    "heroStart",

    ()=>{

        Hero.play();

    }

);

EVENTS.on(

    "mouse:move",

    mouse=>{

        Hero.updateParallax(mouse);

    }

);

/*==================================================
INIT
==================================================*/

Hero.init=async function(){

    this.cache();

    if(

        !this.exists()

    ) return;

    this.prepare();

    this.createTimeline();

    this.initialized=true;

    Log.info(

        "Hero Engine Ready"

    );

};

/*==================================================
REGISTER
==================================================*/

registerModule(

    "Hero",

    Hero

);

/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 05.2 — HERO SCROLLTRIGGER & SPLITTEXT

======================================================================*/

/*==================================================
SPLITTEXT
==================================================*/

Hero.split={

    title:null,

    subtitle:null

};

/*==================================================
CHECK
==================================================*/

Hero.hasSplitText=function(){

    return typeof SplitText!=="undefined";

};

/*==================================================
CREATE SPLIT
==================================================*/

Hero.createSplit=function(){

    if(

        !this.hasSplitText()

    ) return;

    if(this.elements.title){

        this.split.title=

        new SplitText(

            this.elements.title,

            {

                type:"lines,words,chars"

            }

        );

    }

    if(this.elements.subtitle){

        this.split.subtitle=

        new SplitText(

            this.elements.subtitle,

            {

                type:"lines,words"

            }

        );

    }

};

/*==================================================
TEXT TIMELINE
==================================================*/

Hero.createTextAnimation=function(){

    if(

        !this.timeline||

        !this.split.title

    ) return;

    gsap.set(

        this.split.title.chars,

        {

            opacity:0,

            y:100,

            rotateX:-90

        }

    );

    this.timeline.to(

        this.split.title.chars,

        {

            opacity:1,

            y:0,

            rotateX:0,

            duration:.9,

            stagger:.02,

            ease:"power4.out"

        },

        0

    );

    if(this.split.subtitle){

        gsap.set(

            this.split.subtitle.words,

            {

                opacity:0,

                y:35

            }

        );

        this.timeline.to(

            this.split.subtitle.words,

            {

                opacity:1,

                y:0,

                stagger:.05,

                duration:.5

            },

            .35

        );

    }

};

/*==================================================
SCROLL INDICATOR
==================================================*/

Hero.animateIndicator=function(){

    if(

        !this.elements.scroll||

        !this.hasGSAP()

    ) return;

    gsap.to(

        this.elements.scroll,

        {

            y:18,

            repeat:-1,

            yoyo:true,

            ease:"sine.inOut",

            duration:1.4

        }

    );

};

/*==================================================
VIDEO
==================================================*/

Hero.videoReveal=function(){

    if(

        !this.elements.video||

        !this.hasGSAP()

    ) return;

    gsap.fromTo(

        this.elements.video,

        {

            scale:1.15,

            filter:"blur(12px)"

        },

        {

            scale:1,

            filter:"blur(0px)",

            duration:2,

            ease:"power3.out"

        }

    );

};

/*==================================================
SCROLL TRIGGER
==================================================*/

Hero.createScrollTrigger=function(){

    if(

        typeof ScrollTrigger==="undefined"

    ) return;

    ScrollTrigger.create({

        trigger:this.elements.section,

        start:"top top",

        end:"bottom top",

        scrub:true,

        animation:gsap.to(

            this.elements.section,

            {

                yPercent:18,

                ease:"none"

            }

        )

    });

    ScrollTrigger.create({

        trigger:this.elements.section,

        start:"top top",

        end:"bottom+=200 top",

        scrub:true,

        animation:gsap.to(

            this.elements.image,

            {

                scale:1.15,

                rotation:2,

                y:100,

                ease:"none"

            }

        )

    });

};

/*==================================================
BACKGROUND
==================================================*/

Hero.backgroundMotion=function(){

    const bg=

    document.querySelector(

        ".hero-background"

    );

    if(

        !bg||

        !this.hasGSAP()

    ) return;

    gsap.to(

        bg,

        {

            scale:1.08,

            duration:8,

            repeat:-1,

            yoyo:true,

            ease:"sine.inOut"

        }

    );

};

/*==================================================
EVENTS
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        Hero.createSplit();

        Hero.createTextAnimation();

        Hero.createScrollTrigger();

        Hero.animateIndicator();

        Hero.videoReveal();

        Hero.backgroundMotion();

    }

);

/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 05.3 — HERO MAGNETIC BUTTONS & MOUSE ENGINE

======================================================================*/

Hero.cursor={

    active:false,

    magneticStrength:.35,

    rotateStrength:8

};

/*==================================================
MAGNETIC
==================================================*/

Hero.magnetic=function(button,event){

    const rect=

    button.getBoundingClientRect();

    const x=

    event.clientX-

    rect.left-

    rect.width/2;

    const y=

    event.clientY-

    rect.top-

    rect.height/2;

    if(!Hero.hasGSAP()) return;

    gsap.to(

        button,

        {

            x:x*

            Hero.cursor.magneticStrength,

            y:y*

            Hero.cursor.magneticStrength,

            rotationY:

            x*.05,

            rotationX:

            -y*.05,

            duration:.45,

            ease:"power3.out"

        }

    );

};

/*==================================================
RESET
==================================================*/

Hero.resetMagnetic=function(button){

    if(!Hero.hasGSAP()) return;

    gsap.to(

        button,

        {

            x:0,

            y:0,

            rotationX:0,

            rotationY:0,

            duration:.55,

            ease:"elastic.out(1,0.45)"

        }

    );

};

/*==================================================
BUTTON EVENTS
==================================================*/

Hero.bindButtons=function(){

    this.elements.buttons.forEach(

        button=>{

            button.addEventListener(

                "mousemove",

                event=>{

                    Hero.magnetic(

                        button,

                        event

                    );

                }

            );

            button.addEventListener(

                "mouseleave",

                ()=>{

                    Hero.resetMagnetic(

                        button

                    );

                }

            );

        }

    );

};

/*==================================================
IMAGE TILT
==================================================*/

Hero.imageTilt=function(mouse){

    if(

        !this.elements.image||

        !this.hasGSAP()

    ) return;

    const x=

    (mouse.x/

    window.innerWidth-.5);

    const y=

    (mouse.y/

    window.innerHeight-.5);

    gsap.to(

        this.elements.image,

        {

            rotationY:

            x*

            this.cursor.rotateStrength,

            rotationX:

            -y*

            this.cursor.rotateStrength,

            transformPerspective:1200,

            transformOrigin:

            "center center",

            duration:.7,

            ease:"power2.out"

        }

    );

};

/*==================================================
BACKGROUND PARALLAX
==================================================*/

Hero.backgroundParallax=function(mouse){

    const layers=[

        ...document.querySelectorAll(

            ".hero-layer"

        )

    ];

    if(

        !layers.length||

        !this.hasGSAP()

    ) return;

    layers.forEach(

        (layer,index)=>{

            const depth=

            (index+1)*15;

            gsap.to(

                layer,

                {

                    x:(mouse.x/

                    window.innerWidth-.5)

                    *depth,

                    y:(mouse.y/

                    window.innerHeight-.5)

                    *depth,

                    duration:1,

                    ease:"power2.out"

                }

            );

        }

    );

};

/*==================================================
LIGHT EFFECT
==================================================*/

Hero.lightFollow=function(mouse){

    const glow=

    document.querySelector(

        ".hero-glow"

    );

    if(

        !glow||

        !this.hasGSAP()

    ) return;

    gsap.to(

        glow,

        {

            x:mouse.x,

            y:mouse.y,

            duration:.9,

            ease:"power3.out"

        }

    );

};

/*==================================================
EVENTS
==================================================*/

EVENTS.on(

    "mouse:move",

    mouse=>{

        Hero.imageTilt(mouse);

        Hero.backgroundParallax(mouse);

        Hero.lightFollow(mouse);

    }

);

/*==================================================
READY
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        Hero.bindButtons();

        Log.info(

            "Hero Mouse Engine Ready"

        );

    }

);

/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 05.4 — HERO PARTICLES, SHAPES & SCROLL INDICATOR

======================================================================*/

/*==================================================
FLOATING SHAPES
==================================================*/

Hero.floatShapes=function(){

    if(

        !Hero.hasGSAP()

    ) return;

    const shapes=[

        ...document.querySelectorAll(

            ".hero-shape"

        )

    ];

    shapes.forEach(

        (shape,index)=>{

            gsap.to(

                shape,

                {

                    y:-30-(index*8),

                    x:8*(index+1),

                    rotation:12,

                    repeat:-1,

                    yoyo:true,

                    duration:4+(index*.5),

                    ease:"sine.inOut"

                }

            );

        }

    );

};

/*==================================================
PARTICLES
==================================================*/

Hero.animateParticles=function(){

    if(

        !Hero.hasGSAP()

    ) return;

    const particles=[

        ...document.querySelectorAll(

            ".hero-particle"

        )

    ];

    particles.forEach(

        particle=>{

            gsap.to(

                particle,

                {

                    y:"random(-120,-40)",

                    x:"random(-60,60)",

                    opacity:0,

                    scale:"random(.4,1.4)",

                    duration:"random(4,8)",

                    ease:"none",

                    repeat:-1,

                    delay:"random(0,5)"

                }

            );

        }

    );

};

/*==================================================
SCROLL PROGRESS RING
==================================================*/

Hero.progressRing=function(){

    const ring=

    document.querySelector(

        ".scroll-ring circle.progress"

    );

    if(!ring) return;

    const length=

    ring.getTotalLength();

    ring.style.strokeDasharray=

    length;

    EVENTS.on(

        "scroll:update",

        scroll=>{

            const height=

            document.documentElement.scrollHeight-

            window.innerHeight;

            const progress=

            Math.min(

                scroll.y/height,

                1

            );

            ring.style.strokeDashoffset=

            length-

            progress*length;

        }

    );

};

/*==================================================
SCROLL TEXT
==================================================*/

Hero.scrollText=function(){

    const text=

    document.querySelector(

        ".scroll-text"

    );

    if(

        !text||

        !Hero.hasGSAP()

    ) return;

    gsap.to(

        text,

        {

            opacity:.35,

            repeat:-1,

            yoyo:true,

            duration:1.4,

            ease:"power1.inOut"

        }

    );

};

/*==================================================
BACKGROUND GRADIENT
==================================================*/

Hero.gradient=function(){

    const bg=

    document.querySelector(

        ".hero-gradient"

    );

    if(

        !bg||

        !Hero.hasGSAP()

    ) return;

    gsap.to(

        bg,

        {

            backgroundPosition:

            "100% 50%",

            duration:16,

            repeat:-1,

            yoyo:true,

            ease:"none"

        }

    );

};

/*==================================================
NOISE
==================================================*/

Hero.noise=function(){

    const noise=

    document.querySelector(

        ".hero-noise"

    );

    if(

        !noise||

        !Hero.hasGSAP()

    ) return;

    gsap.to(

        noise,

        {

            x:30,

            y:20,

            duration:.25,

            repeat:-1,

            yoyo:true,

            ease:"steps(2)"

        }

    );

};

/*==================================================
LENS FLARE
==================================================*/

Hero.lensFlare=function(){

    const flare=

    document.querySelector(

        ".hero-flare"

    );

    if(

        !flare||

        !Hero.hasGSAP()

    ) return;

    gsap.timeline({

        repeat:-1

    })

    .to(

        flare,

        {

            opacity:1,

            scale:1.15,

            duration:2

        }

    )

    .to(

        flare,

        {

            opacity:.25,

            scale:1,

            duration:2

        }

    );

};

/*==================================================
EVENT
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        Hero.floatShapes();

        Hero.animateParticles();

        Hero.progressRing();

        Hero.scrollText();

        Hero.gradient();

        Hero.noise();

        Hero.lensFlare();

        Log.info(

            "Hero Visual Effects Ready"

        );

    }

);
```
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 05.5 — HERO CINEMATIC ENGINE FINAL

======================================================================*/

/*==================================================
AUTO PLAY VIDEO
==================================================*/

Hero.playVideo=function(){

    if(

        !this.elements.video

    ) return;

    this.elements.video.muted=true;

    this.elements.video.playsInline=true;

    this.elements.video.loop=true;

    this.elements.video.play()

    .catch(()=>{});

};

/*==================================================
SCROLL FADE
==================================================*/

Hero.scrollFade=function(){

    if(

        typeof ScrollTrigger==="undefined"||

        !this.elements.section

    ) return;

    gsap.to(

        this.elements.section,

        {

            opacity:.25,

            scale:.96,

            ease:"none",

            scrollTrigger:{

                trigger:this.elements.section,

                start:"top top",

                end:"bottom top",

                scrub:true

            }

        }

    );

};

/*==================================================
CTA GLOW
==================================================*/

Hero.ctaGlow=function(){

    if(

        !Hero.hasGSAP()

    ) return;

    this.elements.buttons.forEach(

        button=>{

            gsap.to(

                button,

                {

                    boxShadow:

                    "0 0 35px rgba(212,175,55,.35)",

                    repeat:-1,

                    yoyo:true,

                    duration:1.8,

                    ease:"sine.inOut"

                }

            );

        }

    );

};

/*==================================================
IMAGE FLOAT
==================================================*/

Hero.imageFloat=function(){

    if(

        !Hero.hasGSAP()||

        !this.elements.image

    ) return;

    gsap.to(

        this.elements.image,

        {

            y:-20,

            duration:3,

            repeat:-1,

            yoyo:true,

            ease:"sine.inOut"

        }

    );

};

/*==================================================
HERO MASK REVEAL
==================================================*/

Hero.maskReveal=function(){

    const mask=

    document.querySelector(

        ".hero-mask"

    );

    if(

        !mask||

        !Hero.hasGSAP()

    ) return;

    gsap.fromTo(

        mask,

        {

            clipPath:

            "circle(0% at 50% 50%)"

        },

        {

            clipPath:

            "circle(150% at 50% 50%)",

            duration:1.8,

            ease:"power4.out"

        }

    );

};

/*==================================================
MARQUEE
==================================================*/

Hero.marquee=function(){

    const track=

    document.querySelector(

        ".hero-marquee-track"

    );

    if(

        !track||

        !Hero.hasGSAP()

    ) return;

    gsap.to(

        track,

        {

            xPercent:-50,

            repeat:-1,

            duration:18,

            ease:"none"

        }

    );

};

/*==================================================
AMBIENT LIGHT
==================================================*/

Hero.ambient=function(){

    const light=

    document.querySelector(

        ".ambient-light"

    );

    if(

        !light||

        !Hero.hasGSAP()

    ) return;

    gsap.to(

        light,

        {

            scale:1.15,

            opacity:.8,

            duration:6,

            repeat:-1,

            yoyo:true,

            ease:"sine.inOut"

        }

    );

};

/*==================================================
FPS OPTIMIZATION
==================================================*/

Hero.optimize=function(){

    this.elements.section.style.willChange=

    "transform";

    this.elements.image?.style.setProperty(

        "will-change",

        "transform"

    );

};

/*==================================================
DESTROY
==================================================*/

Hero.destroy=function(){

    if(

        this.timeline

    ){

        this.timeline.kill();

    }

    ScrollTrigger

    ?.getAll()

    .forEach(trigger=>{

        if(

            trigger.trigger===

            this.elements.section

        ){

            trigger.kill();

        }

    });

};

/*==================================================
EVENTS
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        Hero.playVideo();

        Hero.scrollFade();

        Hero.ctaGlow();

        Hero.imageFloat();

        Hero.maskReveal();

        Hero.marquee();

        Hero.ambient();

        Hero.optimize();

        Log.info(

            "Hero Module Complete"

        );

    }

);

/*==================================================
VERSION
==================================================*/

Hero.version={

    module:"Hero Engine",

    version:"1.0.0",

    build:"2026.08"

};

EVENTS.emit(

    "hero:initialized"

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 06.1 — PREMIUM CUSTOM CURSOR ENGINE

======================================================================*/

const Cursor={

    initialized:false,

    enabled:true,

    visible:false,

    x:window.innerWidth/2,

    y:window.innerHeight/2,

    tx:window.innerWidth/2,

    ty:window.innerHeight/2,

    speed:.16,

    elements:{}

};

/*==================================================
CACHE
==================================================*/

Cursor.cache=function(){

    this.elements.cursor=

    document.querySelector(

        ".cursor"

    );

    this.elements.dot=

    document.querySelector(

        ".cursor-dot"

    );

    this.elements.text=

    document.querySelector(

        ".cursor-text"

    );

    this.elements.ring=

    document.querySelector(

        ".cursor-ring"

    );

};

/*==================================================
CHECK
==================================================*/

Cursor.exists=function(){

    return(

        this.elements.cursor&&

        window.matchMedia(

            "(pointer:fine)"

        ).matches

    );

};

/*==================================================
SHOW
==================================================*/

Cursor.show=function(){

    if(this.visible) return;

    this.visible=true;

    this.elements.cursor.classList.add(

        "visible"

    );

};

/*==================================================
HIDE
==================================================*/

Cursor.hide=function(){

    this.visible=false;

    this.elements.cursor.classList.remove(

        "visible"

    );

};

/*==================================================
UPDATE
==================================================*/

Cursor.update=function(){

    this.x+=

    (this.tx-this.x)*

    this.speed;

    this.y+=

    (this.ty-this.y)*

    this.speed;

    this.elements.cursor.style.transform=

    `translate3d(${this.x}px,${this.y}px,0)`;

    requestAnimationFrame(

        this.update.bind(this)

    );

};

/*==================================================
MOUSE
==================================================*/

Cursor.move=function(mouse){

    this.tx=mouse.x;

    this.ty=mouse.y;

    if(!this.visible){

        this.show();

    }

};

/*==================================================
ENTER
==================================================*/

Cursor.enter=function(){

    this.show();

};

/*==================================================
LEAVE
==================================================*/

Cursor.leave=function(){

    this.hide();

};

/*==================================================
EVENTS
==================================================*/

EVENTS.on(

    "mouse:move",

    mouse=>{

        Cursor.move(mouse);

    }

);

/*==================================================
LISTENERS
==================================================*/

Cursor.bind=function(){

    document.addEventListener(

        "mouseenter",

        this.enter.bind(this)

    );

    document.addEventListener(

        "mouseleave",

        this.leave.bind(this)

    );

};

/*==================================================
INIT
==================================================*/

Cursor.init=async function(){

    this.cache();

    if(

        !this.exists()

    ) return;

    this.bind();

    this.update();

    this.initialized=true;

    Log.info(

        "Cursor Engine Ready"

    );

};

/*==================================================
REGISTER
==================================================*/

registerModule(

    "Cursor",

    Cursor

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 06.2 — CURSOR STATES & MAGNETIC ELEMENTS

======================================================================*/

/*==================================================
STATE
==================================================*/

Cursor.state={

    current:"default",

    magneticElements:[],

    hoverElements:[]

};

/*==================================================
CACHE ELEMENTS
==================================================*/

Cursor.collect=function(){

    this.state.magneticElements=[

        ...document.querySelectorAll(

            "[data-magnetic]"

        )

    ];

    this.state.hoverElements=[

        ...document.querySelectorAll(

`
a,
button,
.btn,
.card,
.project-card,
input,
textarea,
[data-cursor]
`

        )

    ];

};

/*==================================================
TEXT
==================================================*/

Cursor.setText=function(text=""){

    if(

        !this.elements.text

    ) return;

    this.elements.text.textContent=text;

};

/*==================================================
STATE
==================================================*/

Cursor.setState=function(state){

    this.state.current=state;

    this.elements.cursor.dataset.state=

    state;

};

/*==================================================
RESET
==================================================*/

Cursor.reset=function(){

    this.setState("default");

    this.setText("");

};

/*==================================================
MAGNETIC
==================================================*/

Cursor.magnetic=function(element,event){

    if(

        typeof gsap==="undefined"

    ) return;

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

            duration:.45,

            ease:"power3.out"

        }

    );

};

/*==================================================
RESET MAGNETIC
==================================================*/

Cursor.resetMagnetic=function(element){

    if(

        typeof gsap==="undefined"

    ) return;

    gsap.to(

        element,

        {

            x:0,

            y:0,

            duration:.6,

            ease:"elastic.out(1,.45)"

        }

    );

};

/*==================================================
BIND MAGNETIC
==================================================*/

Cursor.bindMagnetic=function(){

    this.state.magneticElements.forEach(

        element=>{

            element.addEventListener(

                "mousemove",

                event=>{

                    this.magnetic(

                        element,

                        event

                    );

                }

            );

            element.addEventListener(

                "mouseleave",

                ()=>{

                    this.resetMagnetic(

                        element

                    );

                }

            );

        }

    );

};

/*==================================================
BIND HOVER
==================================================*/

Cursor.bindHover=function(){

    this.state.hoverElements.forEach(

        element=>{

            element.addEventListener(

                "mouseenter",

                ()=>{

                    this.setState("hover");

                    this.setText(

                        element.dataset.cursor||

                        ""

                    );

                }

            );

            element.addEventListener(

                "mouseleave",

                ()=>{

                    this.reset();

                }

            );

        }

    );

};

/*==================================================
CLICK
==================================================*/

Cursor.click=function(){

    if(

        typeof gsap==="undefined"

    ) return;

    gsap.fromTo(

        this.elements.ring,

        {

            scale:1

        },

        {

            scale:.7,

            duration:.12,

            repeat:1,

            yoyo:true,

            ease:"power2.out"

        }

    );

};

/*==================================================
EVENTS
==================================================*/

EVENTS.on(

    "pointer:down",

    ()=>{

        Cursor.click();

    }

);

/*==================================================
READY
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        Cursor.collect();

        Cursor.bindHover();

        Cursor.bindMagnetic();

        Log.info(

            "Cursor Interaction Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 06.3 — ADVANCED CURSOR MODES & HOVER ENGINE

======================================================================*/

/*==================================================
MODES
==================================================*/

Cursor.modes={

    view:"View",

    drag:"Drag",

    play:"Play",

    open:"Open",

    zoom:"Zoom",

    next:"Next",

    prev:"Prev",

    close:"Close"

};

/*==================================================
CURSOR SCALE
==================================================*/

Cursor.scale=function(value){

    if(

        !this.elements.cursor||

        typeof gsap==="undefined"

    ) return;

    gsap.to(

        this.elements.cursor,

        {

            scale:value,

            duration:.25,

            ease:"power2.out"

        }

    );

};

/*==================================================
SET MODE
==================================================*/

Cursor.mode=function(name){

    this.setState(name);

    this.setText(

        this.modes[name]||

        ""

    );

};

/*==================================================
CLEAR MODE
==================================================*/

Cursor.clearMode=function(){

    this.scale(1);

    this.reset();

};

/*==================================================
REGISTER DATA CURSORS
==================================================*/

Cursor.bindModes=function(){

    const items=[

        ...document.querySelectorAll(

            "[data-cursor-mode]"

        )

    ];

    items.forEach(

        element=>{

            const mode=

            element.dataset.cursorMode;

            element.addEventListener(

                "mouseenter",

                ()=>{

                    this.mode(mode);

                    this.scale(1.8);

                }

            );

            element.addEventListener(

                "mouseleave",

                ()=>{

                    this.clearMode();

                }

            );

        }

    );

};

/*==================================================
IMAGE HOVER
==================================================*/

Cursor.imageHover=function(){

    const items=[

        ...document.querySelectorAll(

            ".project-card"

        )

    ];

    items.forEach(

        item=>{

            item.addEventListener(

                "mouseenter",

                ()=>{

                    this.mode("view");

                    this.scale(2);

                }

            );

            item.addEventListener(

                "mouseleave",

                ()=>{

                    this.clearMode();

                }

            );

        }

    );

};

/*==================================================
VIDEO HOVER
==================================================*/

Cursor.videoHover=function(){

    const videos=[

        ...document.querySelectorAll(

            ".video-trigger"

        )

    ];

    videos.forEach(

        video=>{

            video.addEventListener(

                "mouseenter",

                ()=>{

                    this.mode("play");

                    this.scale(2.2);

                }

            );

            video.addEventListener(

                "mouseleave",

                ()=>{

                    this.clearMode();

                }

            );

        }

    );

};

/*==================================================
LINK HOVER
==================================================*/

Cursor.linkHover=function(){

    const links=[

        ...document.querySelectorAll(

            "a"

        )

    ];

    links.forEach(

        link=>{

            link.addEventListener(

                "mouseenter",

                ()=>{

                    this.scale(1.3);

                }

            );

            link.addEventListener(

                "mouseleave",

                ()=>{

                    this.scale(1);

                }

            );

        }

    );

};

/*==================================================
BUTTON PRESS
==================================================*/

Cursor.press=function(){

    if(

        typeof gsap==="undefined"

    ) return;

    gsap.to(

        this.elements.cursor,

        {

            scale:.8,

            duration:.12,

            yoyo:true,

            repeat:1,

            ease:"power2.out"

        }

    );

};

/*==================================================
POINTER EVENTS
==================================================*/

EVENTS.on(

    "pointer:down",

    ()=>{

        Cursor.press();

    }

);

/*==================================================
READY
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        Cursor.bindModes();

        Cursor.imageHover();

        Cursor.videoHover();

        Cursor.linkHover();

        Log.info(

            "Advanced Cursor Modes Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 06.4 — CURSOR TRAIL, PARTICLES & RIPPLE ENGINE

======================================================================*/

/*==================================================
TRAIL
==================================================*/

Cursor.trail={

    items:[],

    amount:12

};

/*==================================================
CREATE TRAIL
==================================================*/

Cursor.createTrail=function(){

    const wrapper=

    document.body;

    for(

        let i=0;

        i<this.trail.amount;

        i++

    ){

        const dot=

        document.createElement(

            "span"

        );

        dot.className=

        "cursor-trail";

        wrapper.appendChild(dot);

        this.trail.items.push({

            el:dot,

            x:this.x,

            y:this.y

        });

    }

};

/*==================================================
UPDATE TRAIL
==================================================*/

Cursor.updateTrail=function(){

    if(

        !this.trail.items.length

    ) return;

    let x=this.x;

    let y=this.y;

    this.trail.items.forEach(

        (item,index)=>{

            item.x+=(

                x-item.x

            )*.25;

            item.y+=(

                y-item.y

            )*.25;

            item.el.style.transform=

`
translate3d(
${item.x}px,
${item.y}px,
0)
scale(${1-index*0.05})
`;

            item.el.style.opacity=

            1-index*.07;

            x=item.x;

            y=item.y;

        }

    );

};

/*==================================================
RIPPLE
==================================================*/

Cursor.ripple=function(){

    const ripple=

    document.createElement(

        "span"

    );

    ripple.className=

    "cursor-ripple";

    ripple.style.left=

    this.x+"px";

    ripple.style.top=

    this.y+"px";

    document.body.appendChild(

        ripple

    );

    if(

        typeof gsap==="undefined"

    ){

        ripple.remove();

        return;

    }

    gsap.fromTo(

        ripple,

        {

            scale:.3,

            opacity:.8

        },

        {

            scale:4,

            opacity:0,

            duration:.8,

            ease:"power2.out",

            onComplete:()=>{

                ripple.remove();

            }

        }

    );

};

/*==================================================
PARTICLES
==================================================*/

Cursor.spawnParticles=function(){

    if(

        typeof gsap==="undefined"

    ) return;

    for(

        let i=0;

        i<6;

        i++

    ){

        const particle=

        document.createElement(

            "span"

        );

        particle.className=

        "cursor-particle";

        particle.style.left=

        this.x+"px";

        particle.style.top=

        this.y+"px";

        document.body.appendChild(

            particle

        );

        gsap.to(

            particle,

            {

                x:

                gsap.utils.random(

                    -40,

                    40

                ),

                y:

                gsap.utils.random(

                    -40,

                    40

                ),

                opacity:0,

                scale:0,

                duration:.8,

                ease:"power3.out",

                onComplete:()=>{

                    particle.remove();

                }

            }

        );

    }

};

/*==================================================
FRAME
==================================================*/

EVENTS.on(

    "frame:update",

    ()=>{

        Cursor.updateTrail();

    }

);

/*==================================================
CLICK FX
==================================================*/

EVENTS.on(

    "pointer:down",

    ()=>{

        Cursor.ripple();

        Cursor.spawnParticles();

    }

);

/*==================================================
READY
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        Cursor.createTrail();

        Log.info(

            "Cursor Trail Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 06.5 — CURSOR FINALIZATION & PERFORMANCE ENGINE

======================================================================*/

/*==================================================
VISIBILITY
==================================================*/

Cursor.visibility=function(){

    document.addEventListener(

        "visibilitychange",

        ()=>{

            if(document.hidden){

                this.hide();

            }

            else{

                this.show();

            }

        }

    );

};

/*==================================================
WINDOW BLUR
==================================================*/

Cursor.windowState=function(){

    window.addEventListener(

        "blur",

        ()=>{

            this.hide();

        }

    );

    window.addEventListener(

        "focus",

        ()=>{

            this.show();

        }

    );

};

/*==================================================
IDLE MODE
==================================================*/

Cursor.idle={

    timer:null,

    delay:3000

};

Cursor.startIdle=function(){

    clearTimeout(

        this.idle.timer

    );

    this.elements.cursor.classList.remove(

        "cursor-idle"

    );

    this.idle.timer=

    setTimeout(()=>{

        this.elements.cursor.classList.add(

            "cursor-idle"

        );

    },

    this.idle.delay);

};

EVENTS.on(

    "mouse:move",

    ()=>{

        Cursor.startIdle();

    }

);

/*==================================================
PERFORMANCE
==================================================*/

Cursor.optimize=function(){

    this.elements.cursor.style.willChange=

    "transform";

    this.elements.cursor.style.pointerEvents=

    "none";

    this.elements.cursor.style.userSelect=

    "none";

};

/*==================================================
REDUCED MOTION
==================================================*/

Cursor.motion=function(){

    const reduce=

    window.matchMedia(

        "(prefers-reduced-motion: reduce)"

    ).matches;

    if(reduce){

        this.speed=.35;

        this.trail.amount=0;

    }

};

/*==================================================
TOUCH DEVICES
==================================================*/

Cursor.touch=function(){

    if(

        window.matchMedia(

            "(pointer:coarse)"

        ).matches

    ){

        this.enabled=false;

        this.elements.cursor?.remove();

    }

};

/*==================================================
DESTROY
==================================================*/

Cursor.destroy=function(){

    this.trail.items.forEach(

        item=>{

            item.el.remove();

        }

    );

    this.trail.items=[];

    clearTimeout(

        this.idle.timer

    );

};

/*==================================================
VERSION
==================================================*/

Cursor.version={

    module:"Premium Cursor",

    version:"1.0.0",

    build:"2026.08",

    author:"Director VISION"

};

/*==================================================
EVENTS
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        Cursor.visibility();

        Cursor.windowState();

        Cursor.motion();

        Cursor.touch();

        Cursor.optimize();

        Cursor.startIdle();

        Log.info(

            "Premium Cursor Complete"

        );

    }

);

EVENTS.on(

    "page:hidden",

    ()=>{

        Cursor.hide();

    }

);

EVENTS.on(

    "page:visible",

    ()=>{

        Cursor.show();

    }

);

/*==================================================
MODULE COMPLETE
==================================================*/

EVENTS.emit(

    "cursor:initialized"

);

Log.info(

    "Cursor Engine v1.0 Loaded"

);
```
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 07.1 — PORTFOLIO ENGINE CORE

======================================================================*/

const Portfolio={

    initialized:false,

    isotope:null,

    currentFilter:"*",

    elements:{},

    config:{

        layoutMode:"fitRows",

        transition:450

    }

};

/*==================================================
CACHE
==================================================*/

Portfolio.cache=function(){

    this.elements.grid=

    document.querySelector(

        ".portfolio-grid"

    );

    this.elements.filters=[

        ...document.querySelectorAll(

            ".portfolio-filter button"

        )

    ];

    this.elements.items=[

        ...document.querySelectorAll(

            ".portfolio-item"

        )

    ];

};

/*==================================================
CHECK
==================================================*/

Portfolio.exists=function(){

    return!!this.elements.grid;

};

/*==================================================
ISOTOPE
==================================================*/

Portfolio.create=function(){

    if(

        typeof Isotope==="undefined"

    ) return;

    this.isotope=

    new Isotope(

        this.elements.grid,

        {

            itemSelector:

            ".portfolio-item",

            layoutMode:

            this.config.layoutMode,

            percentPosition:true,

            transitionDuration:

            this.config.transition+"ms"

        }

    );

};

/*==================================================
FILTER
==================================================*/

Portfolio.filter=function(selector){

    this.currentFilter=

    selector;

    if(

        this.isotope

    ){

        this.isotope.arrange({

            filter:selector

        });

    }

    EVENTS.emit(

        "portfolio:filter",

        selector

    );

};

/*==================================================
BUTTONS
==================================================*/

Portfolio.bindFilters=function(){

    this.elements.filters.forEach(

        button=>{

            button.addEventListener(

                "click",

                ()=>{

                    const filter=

                    button.dataset.filter||

                    "*";

                    this.elements.filters.forEach(

                        btn=>btn.classList.remove(

                            "active"

                        )

                    );

                    button.classList.add(

                        "active"

                    );

                    this.filter(filter);

                }

            );

        }

    );

};

/*==================================================
LAYOUT
==================================================*/

Portfolio.layout=function(){

    if(

        this.isotope

    ){

        this.isotope.layout();

    }

};

/*==================================================
IMAGES
==================================================*/

Portfolio.images=function(){

    if(

        typeof imagesLoaded===

        "undefined"

    ) return;

    imagesLoaded(

        this.elements.grid,

        ()=>{

            this.layout();

        }

    );

};

/*==================================================
EVENTS
==================================================*/

EVENTS.on(

    "viewport:resize",

    ()=>{

        Portfolio.layout();

    }

);

/*==================================================
INIT
==================================================*/

Portfolio.init=async function(){

    this.cache();

    if(

        !this.exists()

    ) return;

    this.create();

    this.bindFilters();

    this.images();

    this.initialized=true;

    Log.info(

        "Portfolio Engine Ready"

    );

};

/*==================================================
REGISTER
==================================================*/

registerModule(

    "Portfolio",

    Portfolio

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 07.2 — PORTFOLIO GSAP REVEAL & HOVER ENGINE

======================================================================*/

/*==================================================
GSAP
==================================================*/

Portfolio.hasGSAP=function(){

    return typeof gsap!=="undefined";

};

/*==================================================
REVEAL
==================================================*/

Portfolio.reveal=function(){

    if(

        !this.hasGSAP()

    ) return;

    this.elements.items.forEach(

        item=>{

            gsap.set(

                item,

                {

                    autoAlpha:0,

                    y:60,

                    scale:.95

                }

            );

            gsap.to(

                item,

                {

                    autoAlpha:1,

                    y:0,

                    scale:1,

                    duration:.8,

                    ease:"power3.out",

                    scrollTrigger:{

                        trigger:item,

                        start:"top 85%",

                        once:true

                    }

                }

            );

        }

    );

};

/*==================================================
IMAGE ZOOM
==================================================*/

Portfolio.imageHover=function(){

    const cards=[

        ...document.querySelectorAll(

            ".portfolio-item"

        )

    ];

    cards.forEach(

        card=>{

            const image=

            card.querySelector(

                "img"

            );

            if(!image) return;

            card.addEventListener(

                "mouseenter",

                ()=>{

                    if(

                        !Portfolio.hasGSAP()

                    ) return;

                    gsap.to(

                        image,

                        {

                            scale:1.08,

                            duration:.6,

                            ease:"power3.out"

                        }

                    );

                }

            );

            card.addEventListener(

                "mouseleave",

                ()=>{

                    if(

                        !Portfolio.hasGSAP()

                    ) return;

                    gsap.to(

                        image,

                        {

                            scale:1,

                            duration:.6,

                            ease:"power3.out"

                        }

                    );

                }

            );

        }

    );

};

/*==================================================
CONTENT
==================================================*/

Portfolio.contentHover=function(){

    this.elements.items.forEach(

        item=>{

            const content=

            item.querySelector(

                ".portfolio-content"

            );

            if(!content) return;

            item.addEventListener(

                "mouseenter",

                ()=>{

                    if(

                        !Portfolio.hasGSAP()

                    ) return;

                    gsap.to(

                        content,

                        {

                            y:0,

                            autoAlpha:1,

                            duration:.45

                        }

                    );

                }

            );

            item.addEventListener(

                "mouseleave",

                ()=>{

                    if(

                        !Portfolio.hasGSAP()

                    ) return;

                    gsap.to(

                        content,

                        {

                            y:20,

                            autoAlpha:.9,

                            duration:.45

                        }

                    );

                }

            );

        }

    );

};

/*==================================================
FILTER FX
==================================================*/

EVENTS.on(

    "portfolio:filter",

    ()=>{

        if(

            !Portfolio.hasGSAP()

        ) return;

        gsap.fromTo(

            Portfolio.elements.items,

            {

                autoAlpha:0,

                y:25

            },

            {

                autoAlpha:1,

                y:0,

                stagger:.04,

                duration:.45,

                ease:"power2.out"

            }

        );

    }

);

/*==================================================
READY
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        Portfolio.reveal();

        Portfolio.imageHover();

        Portfolio.contentHover();

        Log.info(

            "Portfolio Animation Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 07.3 — PORTFOLIO LIGHTBOX & VIDEO ENGINE

======================================================================*/

/*==================================================
LIGHTBOX
==================================================*/

Portfolio.lightbox={

    instance:null

};

/*==================================================
INIT LIGHTBOX
==================================================*/

Portfolio.initLightbox=function(){

    if(

        typeof GLightbox==="undefined"

    ) return;

    this.lightbox.instance=

    GLightbox({

        selector:

        ".portfolio-lightbox",

        touchNavigation:true,

        loop:true,

        autoplayVideos:true,

        openEffect:"zoom",

        closeEffect:"fade"

    });

};

/*==================================================
VIDEO
==================================================*/

Portfolio.video=function(){

    const videos=[

        ...document.querySelectorAll(

            ".portfolio-video"

        )

    ];

    videos.forEach(

        video=>{

            video.addEventListener(

                "mouseenter",

                ()=>{

                    video.play()

                    ?.catch(()=>{});

                }

            );

            video.addEventListener(

                "mouseleave",

                ()=>{

                    video.pause();

                    video.currentTime=0;

                }

            );

        }

    );

};

/*==================================================
TILT
==================================================*/

Portfolio.tilt=function(){

    if(

        typeof VanillaTilt===

        "undefined"

    ) return;

    VanillaTilt.init(

        document.querySelectorAll(

            ".portfolio-item"

        ),

        {

            max:8,

            speed:500,

            glare:true,

            "max-glare":.18,

            perspective:1200

        }

    );

};

/*==================================================
LAZY LOAD
==================================================*/

Portfolio.lazy=function(){

    const images=[

        ...document.querySelectorAll(

            ".portfolio-item img"

        )

    ];

    if(

        !("IntersectionObserver" in window)

    ) return;

    const observer=

    new IntersectionObserver(

        entries=>{

            entries.forEach(entry=>{

                if(

                    !entry.isIntersecting

                ) return;

                const img=

                entry.target;

                if(

                    img.dataset.src

                ){

                    img.src=

                    img.dataset.src;

                    img.removeAttribute(

                        "data-src"

                    );

                }

                observer.unobserve(img);

            });

        },

        {

            rootMargin:"100px"

        }

    );

    images.forEach(img=>{

        observer.observe(img);

    });

};

/*==================================================
READY
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        Portfolio.initLightbox();

        Portfolio.video();

        Portfolio.tilt();

        Portfolio.lazy();

        Log.info(

            "Portfolio Media Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 07.4 — PORTFOLIO AJAX LOADER & DETAILS PANEL

======================================================================*/

Portfolio.details={

    panel:null,

    content:null,

    close:null,

    loading:false

};

/*==================================================
CACHE
==================================================*/

Portfolio.cacheDetails=function(){

    this.details.panel=

    document.querySelector(

        ".portfolio-details"

    );

    this.details.content=

    document.querySelector(

        ".portfolio-details-content"

    );

    this.details.close=

    document.querySelector(

        ".portfolio-details-close"

    );

};

/*==================================================
OPEN
==================================================*/

Portfolio.openDetails=function(html){

    if(

        !this.details.panel

    ) return;

    this.details.content.innerHTML=

    html;

    this.details.panel.classList.add(

        "active"

    );

    document.body.classList.add(

        "details-open"

    );

    if(

        typeof gsap!=="undefined"

    ){

        gsap.fromTo(

            this.details.panel,

            {

                autoAlpha:0,

                x:80

            },

            {

                autoAlpha:1,

                x:0,

                duration:.6,

                ease:"power3.out"

            }

        );

    }

};

/*==================================================
CLOSE
==================================================*/

Portfolio.closeDetails=function(){

    if(

        !this.details.panel

    ) return;

    document.body.classList.remove(

        "details-open"

    );

    if(

        typeof gsap!=="undefined"

    ){

        gsap.to(

            this.details.panel,

            {

                autoAlpha:0,

                x:80,

                duration:.35,

                onComplete:()=>{

                    this.details.panel.classList.remove(

                        "active"

                    );

                }

            }

        );

    }

    else{

        this.details.panel.classList.remove(

            "active"

        );

    }

};

/*==================================================
FETCH
==================================================*/

Portfolio.load=function(url){

    if(

        this.details.loading

    ) return;

    this.details.loading=true;

    fetch(url)

    .then(

        response=>response.text()

    )

    .then(

        html=>{

            this.openDetails(

                html

            );

        }

    )

    .catch(console.error)

    .finally(()=>{

        this.details.loading=false;

    });

};

/*==================================================
BIND ITEMS
==================================================*/

Portfolio.bindDetails=function(){

    const items=[

        ...document.querySelectorAll(

            "[data-project]"

        )

    ];

    items.forEach(

        item=>{

            item.addEventListener(

                "click",

                event=>{

                    event.preventDefault();

                    this.load(

                        item.dataset.project

                    );

                }

            );

        }

    );

};

/*==================================================
CLOSE EVENTS
==================================================*/

Portfolio.bindClose=function(){

    this.details.close

    ?.addEventListener(

        "click",

        ()=>{

            this.closeDetails();

        }

    );

    document.addEventListener(

        "keydown",

        event=>{

            if(

                event.key==="Escape"

            ){

                this.closeDetails();

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

        Portfolio.cacheDetails();

        Portfolio.bindDetails();

        Portfolio.bindClose();

        Log.info(

            "Portfolio Details Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 07.5 — PORTFOLIO FINALIZATION & PERFORMANCE

======================================================================*/

/*==================================================
SORT
==================================================*/

Portfolio.sort=function(type="original-order"){

    if(

        !this.isotope

    ) return;

    this.isotope.arrange({

        sortBy:type

    });

};

/*==================================================
REFRESH
==================================================*/

Portfolio.refresh=function(){

    if(

        !this.isotope

    ) return;

    this.isotope.reloadItems();

    this.isotope.layout();

};

/*==================================================
COUNT
==================================================*/

Portfolio.count=function(){

    const total=

    this.elements.items.length;

    const counter=

    document.querySelector(

        ".portfolio-count"

    );

    if(counter){

        counter.textContent=

        total;

    }

};

/*==================================================
URL HASH
==================================================*/

Portfolio.hash=function(){

    const hash=

    window.location.hash;

    if(

        !hash||

        !hash.startsWith("#filter=")

    ) return;

    const filter=

    hash.replace(

        "#filter=",

        "."

    );

    this.filter(filter);

};

EVENTS.on(

    "portfolio:filter",

    selector=>{

        history.replaceState(

            null,

            "",

            selector==="*"

            ?location.pathname

            :"#filter="+

            selector.replace(".","")

        );

    }

);

/*==================================================
INTERSECTION
==================================================*/

Portfolio.observe=function(){

    if(

        !("IntersectionObserver" in window)

    ) return;

    const observer=

    new IntersectionObserver(

        entries=>{

            entries.forEach(entry=>{

                entry.target.classList.toggle(

                    "is-visible",

                    entry.isIntersecting

                );

            });

        },

        {

            threshold:.25

        }

    );

    this.elements.items.forEach(

        item=>observer.observe(item)

    );

};

/*==================================================
DESTROY
==================================================*/

Portfolio.destroy=function(){

    if(

        this.isotope

    ){

        this.isotope.destroy();

        this.isotope=null;

    }

    if(

        this.lightbox.instance

    ){

        this.lightbox.instance.destroy();

    }

};

/*==================================================
VERSION
==================================================*/

Portfolio.version={

    module:"Portfolio",

    version:"1.0.0",

    build:"2026.08",

    author:"Director VISION"

};

/*==================================================
READY
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        Portfolio.hash();

        Portfolio.observe();

        Portfolio.count();

        Portfolio.refresh();

        Log.info(

            "Portfolio Module Complete"

        );

    }

);

/*==================================================
MODULE COMPLETE
==================================================*/

EVENTS.emit(

    "portfolio:initialized"

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 08.1 — ABOUT SECTION CORE ENGINE

======================================================================*/

const About={

    initialized:false,

    elements:{},

    timeline:null,

    config:{

        duration:1,

        ease:"power4.out"

    }

};

/*==================================================
CACHE
==================================================*/

About.cache=function(){

    this.elements.section=

    document.querySelector(

        "#about"

    );

    this.elements.image=

    document.querySelector(

        ".about-image"

    );

    this.elements.content=

    document.querySelector(

        ".about-content"

    );

    this.elements.title=

    document.querySelector(

        ".about-title"

    );

    this.elements.subtitle=

    document.querySelector(

        ".about-subtitle"

    );

    this.elements.text=[

        ...document.querySelectorAll(

            ".about-text p"

        )

    ];

    this.elements.stats=[

        ...document.querySelectorAll(

            ".about-stat"

        )

    ];

    this.elements.buttons=[

        ...document.querySelectorAll(

            ".about-actions .btn"

        )

    ];

};

/*==================================================
CHECK
==================================================*/

About.exists=function(){

    return!!this.elements.section;

};

/*==================================================
GSAP
==================================================*/

About.hasGSAP=function(){

    return typeof gsap!=="undefined";

};

/*==================================================
PREPARE
==================================================*/

About.prepare=function(){

    if(

        !this.hasGSAP()

    ) return;

    gsap.set([

        this.elements.image,

        this.elements.title,

        this.elements.subtitle,

        ...this.elements.text,

        ...this.elements.stats,

        ...this.elements.buttons

    ],{

        autoAlpha:0,

        y:60

    });

};

/*==================================================
TIMELINE
==================================================*/

About.createTimeline=function(){

    if(

        !this.hasGSAP()

    ) return;

    this.timeline=

    gsap.timeline({

        scrollTrigger:{

            trigger:this.elements.section,

            start:"top 75%",

            once:true

        }

    });

    this.timeline

    .to(

        this.elements.image,

        {

            autoAlpha:1,

            y:0,

            duration:1

        }

    )

    .to(

        this.elements.title,

        {

            autoAlpha:1,

            y:0,

            duration:.7

        },

        "-=.6"

    )

    .to(

        this.elements.subtitle,

        {

            autoAlpha:1,

            y:0,

            duration:.6

        },

        "-=.45"

    )

    .to(

        this.elements.text,

        {

            autoAlpha:1,

            y:0,

            stagger:.12,

            duration:.5

        },

        "-=.4"

    )

    .to(

        this.elements.stats,

        {

            autoAlpha:1,

            y:0,

            stagger:.08,

            duration:.45

        },

        "-=.3"

    )

    .to(

        this.elements.buttons,

        {

            autoAlpha:1,

            y:0,

            stagger:.1,

            duration:.45

        },

        "-=.25"

    );

};

/*==================================================
READY
==================================================*/

About.init=async function(){

    this.cache();

    if(

        !this.exists()

    ) return;

    this.prepare();

    this.createTimeline();

    this.initialized=true;

    Log.info(

        "About Engine Ready"

    );

};

/*==================================================
REGISTER
==================================================*/

registerModule(

    "About",

    About

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 08.2 — ABOUT COUNTERS & SKILLS ENGINE

======================================================================*/

/*==================================================
COUNTERS
==================================================*/

About.counters=[

    ...document.querySelectorAll(

        "[data-counter]"

    )

];

/*==================================================
ANIMATE COUNTER
==================================================*/

About.animateCounter=function(counter){

    const end=

    parseInt(

        counter.dataset.counter,

        10

    )||0;

    const obj={value:0};

    if(

        typeof gsap==="undefined"

    ){

        counter.textContent=end;

        return;

    }

    gsap.to(obj,{

        value:end,

        duration:2,

        ease:"power2.out",

        snap:"value",

        onUpdate:()=>{

            counter.textContent=

            obj.value.toLocaleString();

        }

    });

};

/*==================================================
COUNTERS
==================================================*/

About.startCounters=function(){

    this.counters.forEach(

        counter=>{

            ScrollTrigger.create({

                trigger:counter,

                start:"top 90%",

                once:true,

                onEnter:()=>{

                    this.animateCounter(

                        counter

                    );

                }

            });

        }

    );

};

/*==================================================
SKILLS
==================================================*/

About.skills=[

    ...document.querySelectorAll(

        ".skill-progress"

    )

];

/*==================================================
PROGRESS
==================================================*/

About.animateSkills=function(){

    this.skills.forEach(

        bar=>{

            const width=

            bar.dataset.progress||

            100;

            gsap.set(bar,{

                width:0

            });

            ScrollTrigger.create({

                trigger:bar,

                start:"top 90%",

                once:true,

                onEnter:()=>{

                    gsap.to(bar,{

                        width:width+"%",

                        duration:1.4,

                        ease:"power3.out"

                    });

                }

            });

        }

    );

};

/*==================================================
STATS HOVER
==================================================*/

About.hoverStats=function(){

    this.elements.stats.forEach(

        stat=>{

            stat.addEventListener(

                "mouseenter",

                ()=>{

                    gsap.to(stat,{

                        y:-8,

                        scale:1.04,

                        duration:.35

                    });

                }

            );

            stat.addEventListener(

                "mouseleave",

                ()=>{

                    gsap.to(stat,{

                        y:0,

                        scale:1,

                        duration:.35

                    });

                }

            );

        }

    );

};

/*==================================================
EVENT
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        About.startCounters();

        About.animateSkills();

        About.hoverStats();

        Log.info(

            "About Counters Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 08.3 — ABOUT PARALLAX & IMAGE EFFECTS

======================================================================*/

/*==================================================
PARALLAX
==================================================*/

About.parallax={

    imageSpeed:.08,

    shapeSpeed:.04

};

/*==================================================
IMAGE PARALLAX
==================================================*/

About.imageParallax=function(scroll){

    if(

        !this.elements.image||

        typeof gsap==="undefined"

    ) return;

    const rect=

    this.elements.section.getBoundingClientRect();

    const offset=

    rect.top*

    this.parallax.imageSpeed;

    gsap.to(

        this.elements.image,

        {

            y:-offset,

            duration:.6,

            overwrite:true,

            ease:"power2.out"

        }

    );

};

/*==================================================
FLOATING SHAPES
==================================================*/

About.floatShapes=function(){

    if(

        typeof gsap==="undefined"

    ) return;

    const shapes=[

        ...document.querySelectorAll(

            ".about-shape"

        )

    ];

    shapes.forEach(

        (shape,index)=>{

            gsap.to(

                shape,

                {

                    y:-20-(index*8),

                    x:10*(index+1),

                    rotation:8,

                    repeat:-1,

                    yoyo:true,

                    duration:4+(index*.6),

                    ease:"sine.inOut"

                }

            );

        }

    );

};

/*==================================================
IMAGE TILT
==================================================*/

About.imageTilt=function(){

    if(

        typeof VanillaTilt===

        "undefined"||

        !this.elements.image

    ) return;

    VanillaTilt.init(

        this.elements.image,

        {

            max:8,

            speed:500,

            glare:true,

            perspective:1400,

            "max-glare":.15

        }

    );

};

/*==================================================
IMAGE ZOOM
==================================================*/

About.imageHover=function(){

    if(

        typeof gsap==="undefined"||

        !this.elements.image

    ) return;

    this.elements.image.addEventListener(

        "mouseenter",

        ()=>{

            gsap.to(

                this.elements.image,

                {

                    scale:1.03,

                    duration:.5

                }

            );

        }

    );

    this.elements.image.addEventListener(

        "mouseleave",

        ()=>{

            gsap.to(

                this.elements.image,

                {

                    scale:1,

                    duration:.5

                }

            );

        }

    );

};

/*==================================================
GRADIENT
==================================================*/

About.gradient=function(){

    const bg=

    document.querySelector(

        ".about-gradient"

    );

    if(

        !bg||

        typeof gsap==="undefined"

    ) return;

    gsap.to(

        bg,

        {

            backgroundPosition:

            "100% 50%",

            duration:18,

            repeat:-1,

            yoyo:true,

            ease:"none"

        }

    );

};

/*==================================================
EVENTS
==================================================*/

EVENTS.on(

    "scroll:update",

    scroll=>{

        About.imageParallax(

            scroll

        );

    }

);

/*==================================================
READY
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        About.floatShapes();

        About.imageTilt();

        About.imageHover();

        About.gradient();

        Log.info(

            "About Visual Effects Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 08.4 — ABOUT EXPERIENCE TIMELINE & CERTIFICATES

======================================================================*/

/*==================================================
TIMELINE
==================================================*/

About.timeline={

    items:[],

    line:null

};

/*==================================================
CACHE
==================================================*/

About.cacheTimeline=function(){

    this.timeline.items=[

        ...document.querySelectorAll(

            ".timeline-item"

        )

    ];

    this.timeline.line=

    document.querySelector(

        ".timeline-line"

    );

};

/*==================================================
LINE
==================================================*/

About.animateLine=function(){

    if(

        typeof gsap==="undefined"||

        !this.timeline.line

    ) return;

    gsap.set(

        this.timeline.line,

        {

            scaleY:0,

            transformOrigin:

            "top center"

        }

    );

    gsap.to(

        this.timeline.line,

        {

            scaleY:1,

            duration:1.8,

            ease:"power3.out",

            scrollTrigger:{

                trigger:this.timeline.line,

                start:"top 80%",

                once:true

            }

        }

    );

};

/*==================================================
ITEMS
==================================================*/

About.animateTimeline=function(){

    this.timeline.items.forEach(

        (item,index)=>{

            gsap.set(

                item,

                {

                    autoAlpha:0,

                    x:index%2?80:-80

                }

            );

            gsap.to(

                item,

                {

                    autoAlpha:1,

                    x:0,

                    duration:.9,

                    ease:"power3.out",

                    scrollTrigger:{

                        trigger:item,

                        start:"top 85%",

                        once:true

                    }

                }

            );

        }

    );

};

/*==================================================
CERTIFICATES
==================================================*/

About.certificates=function(){

    const cards=[

        ...document.querySelectorAll(

            ".certificate-card"

        )

    ];

    cards.forEach(

        card=>{

            card.addEventListener(

                "mouseenter",

                ()=>{

                    gsap.to(

                        card,

                        {

                            y:-10,

                            scale:1.03,

                            boxShadow:

                            "0 30px 80px rgba(0,0,0,.25)",

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

                            y:0,

                            scale:1,

                            boxShadow:

                            "0 0 0 rgba(0,0,0,0)",

                            duration:.35

                        }

                    );

                }

            );

        }

    );

};

/*==================================================
BADGES
==================================================*/

About.badges=function(){

    const badges=[

        ...document.querySelectorAll(

            ".skill-badge"

        )

    ];

    badges.forEach(

        badge=>{

            gsap.to(

                badge,

                {

                    y:-4,

                    repeat:-1,

                    yoyo:true,

                    stagger:.08,

                    duration:1.2,

                    ease:"sine.inOut"

                }

            );

        }

    );

};

/*==================================================
EVENT
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        About.cacheTimeline();

        About.animateLine();

        About.animateTimeline();

        About.certificates();

        About.badges();

        Log.info(

            "About Timeline Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 08.5 — ABOUT FINALIZATION & PERFORMANCE

======================================================================*/

/*==================================================
MARQUEE
==================================================*/

About.marquee=function(){

    const track=

    document.querySelector(

        ".about-marquee-track"

    );

    if(

        !track||

        typeof gsap==="undefined"

    ) return;

    gsap.to(

        track,

        {

            xPercent:-50,

            duration:20,

            repeat:-1,

            ease:"none"

        }

    );

};

/*==================================================
BACKGROUND
==================================================*/

About.background=function(){

    const bg=

    document.querySelector(

        ".about-background"

    );

    if(

        !bg||

        typeof gsap==="undefined"

    ) return;

    gsap.to(

        bg,

        {

            scale:1.08,

            rotation:2,

            duration:12,

            repeat:-1,

            yoyo:true,

            ease:"sine.inOut"

        }

    );

};

/*==================================================
NOISE
==================================================*/

About.noise=function(){

    const noise=

    document.querySelector(

        ".about-noise"

    );

    if(

        !noise||

        typeof gsap==="undefined"

    ) return;

    gsap.to(

        noise,

        {

            x:20,

            y:12,

            duration:.25,

            repeat:-1,

            yoyo:true,

            ease:"steps(2)"

        }

    );

};

/*==================================================
OPTIMIZE
==================================================*/

About.optimize=function(){

    if(

        this.elements.section

    ){

        this.elements.section.style.willChange=

        "transform";

    }

    if(

        this.elements.image

    ){

        this.elements.image.style.willChange=

        "transform";

    }

};

/*==================================================
REFRESH
==================================================*/

About.refresh=function(){

    if(

        typeof ScrollTrigger!=="undefined"

    ){

        ScrollTrigger.refresh();

    }

};

/*==================================================
DESTROY
==================================================*/

About.destroy=function(){

    if(

        this.timeline

    ){

        this.timeline.kill();

    }

    if(

        typeof ScrollTrigger!=="undefined"

    ){

        ScrollTrigger.getAll()

        .forEach(trigger=>{

            if(

                trigger.trigger&&

                this.elements.section&&

                this.elements.section.contains(

                    trigger.trigger

                )

            ){

                trigger.kill();

            }

        });

    }

};

/*==================================================
VERSION
==================================================*/

About.version={

    module:"About",

    version:"1.0.0",

    build:"2026.08",

    author:"Director VISION"

};

/*==================================================
READY
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        About.marquee();

        About.background();

        About.noise();

        About.optimize();

        About.refresh();

        Log.info(

            "About Module Complete"

        );

    }

);

/*==================================================
MODULE COMPLETE
==================================================*/

EVENTS.emit(

    "about:initialized"

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 09.1 — SERVICES ENGINE CORE

======================================================================*/

const Services={

    initialized:false,

    timeline:null,

    elements:{},

    config:{

        duration:.8,

        stagger:.08,

        ease:"power3.out"

    }

};

/*==================================================
CACHE
==================================================*/

Services.cache=function(){

    this.elements.section=

    document.querySelector(

        "#services"

    );

    this.elements.title=

    document.querySelector(

        ".services-title"

    );

    this.elements.subtitle=

    document.querySelector(

        ".services-subtitle"

    );

    this.elements.cards=[

        ...document.querySelectorAll(

            ".service-card"

        )

    ];

    this.elements.buttons=[

        ...document.querySelectorAll(

            ".services .btn"

        )

    ];

};

/*==================================================
CHECK
==================================================*/

Services.exists=function(){

    return!!

    this.elements.section;

};

/*==================================================
GSAP
==================================================*/

Services.hasGSAP=function(){

    return typeof gsap!=="undefined";

};

/*==================================================
PREPARE
==================================================*/

Services.prepare=function(){

    if(

        !this.hasGSAP()

    ) return;

    gsap.set([

        this.elements.title,

        this.elements.subtitle,

        ...this.elements.cards,

        ...this.elements.buttons

    ],{

        autoAlpha:0,

        y:60

    });

};

/*==================================================
TIMELINE
==================================================*/

Services.createTimeline=function(){

    if(

        !this.hasGSAP()

    ) return;

    this.timeline=

    gsap.timeline({

        scrollTrigger:{

            trigger:

            this.elements.section,

            start:"top 75%",

            once:true

        }

    });

    this.timeline

    .to(

        this.elements.title,

        {

            autoAlpha:1,

            y:0,

            duration:.8

        }

    )

    .to(

        this.elements.subtitle,

        {

            autoAlpha:1,

            y:0,

            duration:.6

        },

        "-=.45"

    )

    .to(

        this.elements.cards,

        {

            autoAlpha:1,

            y:0,

            stagger:

            this.config.stagger,

            duration:

            this.config.duration

        },

        "-=.3"

    )

    .to(

        this.elements.buttons,

        {

            autoAlpha:1,

            y:0,

            duration:.45

        },

        "-=.25"

    );

};

/*==================================================
READY
==================================================*/

Services.init=async function(){

    this.cache();

    if(

        !this.exists()

    ) return;

    this.prepare();

    this.createTimeline();

    this.initialized=true;

    Log.info(

        "Services Engine Ready"

    );

};

/*==================================================
REGISTER
==================================================*/

registerModule(

    "Services",

    Services

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 09.2 — SERVICES HOVER & CARD INTERACTION ENGINE

======================================================================*/

/*==================================================
HOVER
==================================================*/

Services.hover=function(){

    if(

        !this.hasGSAP()

    ) return;

    this.elements.cards.forEach(

        card=>{

            const icon=

            card.querySelector(

                ".service-icon"

            );

            const glow=

            card.querySelector(

                ".service-glow"

            );

            card.addEventListener(

                "mouseenter",

                ()=>{

                    gsap.to(

                        card,

                        {

                            y:-14,

                            scale:1.025,

                            duration:.4,

                            ease:"power3.out"

                        }

                    );

                    if(icon){

                        gsap.to(

                            icon,

                            {

                                rotate:10,

                                scale:1.15,

                                duration:.45

                            }

                        );

                    }

                    if(glow){

                        gsap.to(

                            glow,

                            {

                                opacity:1,

                                scale:1.2,

                                duration:.5

                            }

                        );

                    }

                }

            );

            card.addEventListener(

                "mouseleave",

                ()=>{

                    gsap.to(

                        card,

                        {

                            y:0,

                            scale:1,

                            duration:.45,

                            ease:"power3.out"

                        }

                    );

                    if(icon){

                        gsap.to(

                            icon,

                            {

                                rotate:0,

                                scale:1,

                                duration:.4

                            }

                        );

                    }

                    if(glow){

                        gsap.to(

                            glow,

                            {

                                opacity:0,

                                scale:1,

                                duration:.4

                            }

                        );

                    }

                }

            );

        }

    );

};

/*==================================================
MAGNETIC
==================================================*/

Services.magnetic=function(){

    this.elements.cards.forEach(

        card=>{

            card.addEventListener(

                "mousemove",

                event=>{

                    const rect=

                    card.getBoundingClientRect();

                    const x=

                    event.clientX-

                    rect.left-

                    rect.width/2;

                    const y=

                    event.clientY-

                    rect.top-

                    rect.height/2;

                    gsap.to(

                        card,

                        {

                            rotationY:x*.02,

                            rotationX:-y*.02,

                            transformPerspective:1200,

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
ICON LOOP
==================================================*/

Services.icons=function(){

    document.querySelectorAll(

        ".service-icon"

    ).forEach(

        icon=>{

            gsap.to(

                icon,

                {

                    y:-6,

                    repeat:-1,

                    yoyo:true,

                    duration:2,

                    ease:"sine.inOut"

                }

            );

        }

    );

};

/*==================================================
EVENT
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        Services.hover();

        Services.magnetic();

        Services.icons();

        Log.info(

            "Services Interaction Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 09.4 — SERVICES MODAL, ACCORDION & DETAILS ENGINE

======================================================================*/

Services.modal={

    element:null,

    content:null,

    close:null,

    active:false

};

/*==================================================
CACHE
==================================================*/

Services.cacheModal=function(){

    this.modal.element=

    document.querySelector(

        ".services-modal"

    );

    this.modal.content=

    document.querySelector(

        ".services-modal-content"

    );

    this.modal.close=

    document.querySelector(

        ".services-modal-close"

    );

};

/*==================================================
OPEN
==================================================*/

Services.openModal=function(html){

    if(

        !this.modal.element

    ) return;

    this.modal.active=true;

    this.modal.content.innerHTML=

    html;

    document.body.classList.add(

        "services-modal-open"

    );

    if(

        typeof gsap!=="undefined"

    ){

        gsap.fromTo(

            this.modal.element,

            {

                autoAlpha:0,

                scale:.94

            },

            {

                autoAlpha:1,

                scale:1,

                duration:.45,

                ease:"power3.out"

            }

        );

    }

    this.modal.element.classList.add(

        "active"

    );

};

/*==================================================
CLOSE
==================================================*/

Services.closeModal=function(){

    if(

        !this.modal.active

    ) return;

    this.modal.active=false;

    document.body.classList.remove(

        "services-modal-open"

    );

    if(

        typeof gsap!=="undefined"

    ){

        gsap.to(

            this.modal.element,

            {

                autoAlpha:0,

                scale:.96,

                duration:.35,

                onComplete:()=>{

                    this.modal.element.classList.remove(

                        "active"

                    );

                }

            }

        );

    }

};

/*==================================================
LOAD
==================================================*/

Services.load=function(url){

    fetch(url)

    .then(

        response=>response.text()

    )

    .then(

        html=>{

            this.openModal(

                html

            );

        }

    )

    .catch(console.error);

};

/*==================================================
DETAIL BUTTONS
==================================================*/

Services.bindDetails=function(){

    document.querySelectorAll(

        "[data-service]"

    ).forEach(

        button=>{

            button.addEventListener(

                "click",

                event=>{

                    event.preventDefault();

                    this.load(

                        button.dataset.service

                    );

                }

            );

        }

    );

};

/*==================================================
ACCORDION
==================================================*/

Services.accordion=function(){

    document.querySelectorAll(

        ".service-accordion-item"

    ).forEach(

        item=>{

            const trigger=

            item.querySelector(

                ".service-accordion-header"

            );

            const body=

            item.querySelector(

                ".service-accordion-body"

            );

            if(

                !trigger||

                !body

            ) return;

            trigger.addEventListener(

                "click",

                ()=>{

                    const open=

                    item.classList.contains(

                        "active"

                    );

                    document.querySelectorAll(

                        ".service-accordion-item"

                    ).forEach(

                        accordion=>{

                            accordion.classList.remove(

                                "active"

                            );

                        }

                    );

                    if(

                        !open

                    ){

                        item.classList.add(

                            "active"

                        );

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

    "keyboard:down",

    event=>{

        if(

            event.key==="Escape"

        ){

            Services.closeModal();

        }

    }

);

/*==================================================
READY
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        Services.cacheModal();

        Services.bindDetails();

        Services.accordion();

        this.modal.close

        ?.addEventListener(

            "click",

            ()=>{

                Services.closeModal();

            }

        );

        Log.info(

            "Services Modal Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 09.5 — SERVICES FINALIZATION & PERFORMANCE

======================================================================*/

/*==================================================
MARQUEE
==================================================*/

Services.marquee=function(){

    const track=

    document.querySelector(

        ".services-marquee-track"

    );

    if(

        !track||

        typeof gsap==="undefined"

    ) return;

    gsap.to(

        track,

        {

            xPercent:-50,

            duration:20,

            repeat:-1,

            ease:"none"

        }

    );

};

/*==================================================
SERVICE COUNT
==================================================*/

Services.counter=function(){

    const counter=

    document.querySelector(

        ".services-count"

    );

    if(!counter) return;

    counter.textContent=

    this.elements.cards.length;

};

/*==================================================
REFRESH
==================================================*/

Services.refresh=function(){

    if(

        typeof ScrollTrigger!==

        "undefined"

    ){

        ScrollTrigger.refresh();

    }

};

/*==================================================
OPTIMIZE
==================================================*/

Services.optimize=function(){

    this.elements.cards.forEach(

        card=>{

            card.style.willChange=

            "transform";

            card.style.backfaceVisibility=

            "hidden";

        }

    );

};

/*==================================================
OBSERVER
==================================================*/

Services.observe=function(){

    if(

        !("IntersectionObserver" in window)

    ) return;

    const observer=

    new IntersectionObserver(

        entries=>{

            entries.forEach(entry=>{

                entry.target.classList.toggle(

                    "is-visible",

                    entry.isIntersecting

                );

            });

        },

        {

            threshold:.2

        }

    );

    this.elements.cards.forEach(

        card=>observer.observe(card)

    );

};

/*==================================================
DESTROY
==================================================*/

Services.destroy=function(){

    if(

        this.timeline

    ){

        this.timeline.kill();

    }

    if(

        typeof ScrollTrigger!==

        "undefined"

    ){

        ScrollTrigger.getAll()

        .forEach(trigger=>{

            if(

                trigger.trigger&&

                this.elements.section&&

                this.elements.section.contains(

                    trigger.trigger

                )

            ){

                trigger.kill();

            }

        });

    }

};

/*==================================================
VERSION
==================================================*/

Services.version={

    module:"Services",

    version:"1.0.0",

    build:"2026.08",

    author:"Director VISION"

};

/*==================================================
READY
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        Services.marquee();

        Services.counter();

        Services.observe();

        Services.optimize();

        Services.refresh();

        Log.info(

            "Services Module Complete"

        );

    }

);

/*==================================================
MODULE COMPLETE
==================================================*/

EVENTS.emit(

    "services:initialized"

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 10.1 — TESTIMONIALS ENGINE CORE

======================================================================*/

const Testimonials={

    initialized:false,

    swiper:null,

    elements:{},

    config:{

        speed:900,

        autoplay:5000,

        space:30

    }

};

/*==================================================
CACHE
==================================================*/

Testimonials.cache=function(){

    this.elements.section=

    document.querySelector(

        "#testimonials"

    );

    this.elements.slider=

    document.querySelector(

        ".testimonials-slider"

    );

    this.elements.cards=[

        ...document.querySelectorAll(

            ".testimonial-card"

        )

    ];

    this.elements.next=

    document.querySelector(

        ".testimonial-next"

    );

    this.elements.prev=

    document.querySelector(

        ".testimonial-prev"

    );

    this.elements.pagination=

    document.querySelector(

        ".testimonial-pagination"

    );

};

/*==================================================
CHECK
==================================================*/

Testimonials.exists=function(){

    return!!

    this.elements.slider;

};

/*==================================================
SWIPER
==================================================*/

Testimonials.create=function(){

    if(

        typeof Swiper===

        "undefined"

    ) return;

    this.swiper=

    new Swiper(

        this.elements.slider,

        {

            slidesPerView:1,

            spaceBetween:

            this.config.space,

            speed:

            this.config.speed,

            loop:true,

            grabCursor:true,

            centeredSlides:true,

            autoplay:{

                delay:

                this.config.autoplay,

                disableOnInteraction:false

            },

            navigation:{

                nextEl:

                this.elements.next,

                prevEl:

                this.elements.prev

            },

            pagination:{

                el:

                this.elements.pagination,

                clickable:true

            },

            breakpoints:{

                768:{

                    slidesPerView:2

                },

                1200:{

                    slidesPerView:3

                }

            }

        }

    );

};

/*==================================================
READY
==================================================*/

Testimonials.init=async function(){

    this.cache();

    if(

        !this.exists()

    ) return;

    this.create();

    this.initialized=true;

    Log.info(

        "Testimonials Engine Ready"

    );

};

/*==================================================
REGISTER
==================================================*/

registerModule(

    "Testimonials",

    Testimonials

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 10.2 — TESTIMONIALS GSAP ANIMATION ENGINE

======================================================================*/

/*==================================================
GSAP
==================================================*/

Testimonials.hasGSAP=function(){

    return typeof gsap!=="undefined";

};

/*==================================================
REVEAL
==================================================*/

Testimonials.reveal=function(){

    if(

        !this.hasGSAP()

    ) return;

    gsap.set(

        this.elements.cards,

        {

            autoAlpha:0,

            y:80,

            scale:.95

        }

    );

    ScrollTrigger.batch(

        this.elements.cards,

        {

            start:"top 85%",

            once:true,

            onEnter:batch=>{

                gsap.to(

                    batch,

                    {

                        autoAlpha:1,

                        y:0,

                        scale:1,

                        stagger:.12,

                        duration:.9,

                        ease:"power3.out"

                    }

                );

            }

        }

    );

};

/*==================================================
ACTIVE CARD
==================================================*/

Testimonials.active=function(){

    if(

        !this.swiper||

        !this.hasGSAP()

    ) return;

    this.swiper.on(

        "slideChangeTransitionStart",

        ()=>{

            this.elements.cards.forEach(

                card=>{

                    gsap.to(

                        card,

                        {

                            scale:.92,

                            opacity:.45,

                            duration:.35

                        }

                    );

                }

            );

            const active=

            this.elements.cards[

                this.swiper.realIndex

            ];

            if(active){

                gsap.to(

                    active,

                    {

                        scale:1,

                        opacity:1,

                        duration:.45

                    }

                );

            }

        }

    );

};

/*==================================================
HOVER
==================================================*/

Testimonials.hover=function(){

    this.elements.cards.forEach(

        card=>{

            card.addEventListener(

                "mouseenter",

                ()=>{

                    gsap.to(

                        card,

                        {

                            y:-12,

                            duration:.35,

                            ease:"power3.out"

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

                            y:0,

                            duration:.35

                        }

                    );

                }

            );

        }

    );

};

/*==================================================
QUOTE ICON
==================================================*/

Testimonials.icons=function(){

    document.querySelectorAll(

        ".testimonial-quote"

    ).forEach(

        icon=>{

            gsap.to(

                icon,

                {

                    rotate:8,

                    repeat:-1,

                    yoyo:true,

                    duration:2,

                    ease:"sine.inOut"

                }

            );

        }

    );

};

/*==================================================
EVENT
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        Testimonials.reveal();

        Testimonials.active();

        Testimonials.hover();

        Testimonials.icons();

        Log.info(

            "Testimonials Animation Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 10.3 — TESTIMONIALS VIDEO, RATING & PARALLAX ENGINE

======================================================================*/

/*==================================================
VIDEO
==================================================*/

Testimonials.video=function(){

    const videos=[

        ...document.querySelectorAll(

            ".testimonial-video"

        )

    ];

    videos.forEach(

        video=>{

            video.muted=true;

            video.loop=true;

            video.playsInline=true;

            video.addEventListener(

                "mouseenter",

                ()=>{

                    video.play()

                    ?.catch(()=>{});

                }

            );

            video.addEventListener(

                "mouseleave",

                ()=>{

                    video.pause();

                    video.currentTime=0;

                }

            );

        }

    );

};

/*==================================================
STARS
==================================================*/

Testimonials.stars=function(){

    document.querySelectorAll(

        ".testimonial-stars"

    ).forEach(

        stars=>{

            gsap.from(

                stars.children,

                {

                    opacity:0,

                    scale:.4,

                    stagger:.08,

                    duration:.35,

                    ease:"back.out(2)",

                    scrollTrigger:{

                        trigger:stars,

                        start:"top 90%",

                        once:true

                    }

                }

            );

        }

    );

};

/*==================================================
PARALLAX
==================================================*/

Testimonials.parallax=function(mouse){

    const cards=

    Testimonials.elements.cards;

    if(

        !cards.length||

        typeof gsap==="undefined"

    ) return;

    const x=

    (mouse.x/window.innerWidth-.5);

    const y=

    (mouse.y/window.innerHeight-.5);

    cards.forEach(

        (card,index)=>{

            const depth=

            (index+1)*8;

            gsap.to(

                card,

                {

                    x:x*depth,

                    y:y*depth,

                    duration:.8,

                    overwrite:true,

                    ease:"power2.out"

                }

            );

        }

    );

};

/*==================================================
GLOW
==================================================*/

Testimonials.glow=function(){

    this.elements.cards.forEach(

        card=>{

            const glow=

            card.querySelector(

                ".testimonial-glow"

            );

            if(!glow) return;

            card.addEventListener(

                "mouseenter",

                ()=>{

                    gsap.to(

                        glow,

                        {

                            opacity:1,

                            scale:1.2,

                            duration:.45

                        }

                    );

                }

            );

            card.addEventListener(

                "mouseleave",

                ()=>{

                    gsap.to(

                        glow,

                        {

                            opacity:0,

                            scale:1,

                            duration:.35

                        }

                    );

                }

            );

        }

    );

};

/*==================================================
EVENTS
==================================================*/

EVENTS.on(

    "mouse:move",

    mouse=>{

        Testimonials.parallax(

            mouse

        );

    }

);

/*==================================================
READY
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        Testimonials.video();

        Testimonials.stars();

        Testimonials.glow();

        Log.info(

            "Testimonials Effects Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 10.4 — TESTIMONIALS AUTO HEIGHT, FILTERS & MODAL ENGINE

======================================================================*/

/*==================================================
AUTO HEIGHT
==================================================*/

Testimonials.autoHeight=function(){

    if(

        !this.swiper

    ) return;

    this.swiper.on(

        "slideChange",

        ()=>{

            this.swiper.updateAutoHeight(

                500

            );

        }

    );

};

/*==================================================
FILTERS
==================================================*/

Testimonials.filter=function(category){

    this.elements.cards.forEach(

        card=>{

            const visible=

            category==="all"||

            card.dataset.category===

            category;

            gsap.to(

                card,

                {

                    autoAlpha:

                    visible?1:0,

                    scale:

                    visible?1:.9,

                    duration:.35,

                    display:

                    visible?"block":"none"

                }

            );

        }

    );

};

/*==================================================
FILTER BUTTONS
==================================================*/

Testimonials.bindFilters=function(){

    document.querySelectorAll(

        "[data-testimonial-filter]"

    ).forEach(

        button=>{

            button.addEventListener(

                "click",

                ()=>{

                    document.querySelectorAll(

                        "[data-testimonial-filter]"

                    ).forEach(

                        item=>{

                            item.classList.remove(

                                "active"

                            );

                        }

                    );

                    button.classList.add(

                        "active"

                    );

                    this.filter(

                        button.dataset

                        .testimonialFilter

                    );

                }

            );

        }

    );

};

/*==================================================
MODAL
==================================================*/

Testimonials.modal=function(){

    document.querySelectorAll(

        "[data-testimonial-modal]"

    ).forEach(

        trigger=>{

            trigger.addEventListener(

                "click",

                ()=>{

                    const target=

                    document.querySelector(

                        trigger.dataset

                        .testimonialModal

                    );

                    if(!target) return;

                    target.classList.add(

                        "active"

                    );

                    gsap.fromTo(

                        target,

                        {

                            autoAlpha:0,

                            scale:.92

                        },

                        {

                            autoAlpha:1,

                            scale:1,

                            duration:.4

                        }

                    );

                }

            );

        }

    );

};

/*==================================================
MODAL CLOSE
==================================================*/

Testimonials.closeModal=function(){

    document.querySelectorAll(

        ".testimonial-modal"

    ).forEach(

        modal=>{

            modal.addEventListener(

                "click",

                event=>{

                    if(

                        event.target!==modal

                    ) return;

                    gsap.to(

                        modal,

                        {

                            autoAlpha:0,

                            scale:.96,

                            duration:.3,

                            onComplete:()=>{

                                modal.classList.remove(

                                    "active"

                                );

                            }

                        }

                    );

                }

            );

        }

    );

};

/*==================================================
KEYBOARD
==================================================*/

EVENTS.on(

    "keyboard:down",

    event=>{

        if(

            event.key!=="Escape"

        ) return;

        document.querySelectorAll(

            ".testimonial-modal.active"

        ).forEach(

            modal=>{

                modal.classList.remove(

                    "active"

                );

            }

        );

    }

);

/*==================================================
READY
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        Testimonials.autoHeight();

        Testimonials.bindFilters();

        Testimonials.modal();

        Testimonials.closeModal();

        Log.info(

            "Testimonials Modal Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 10.5 — TESTIMONIALS FINALIZATION & PERFORMANCE

======================================================================*/

/*==================================================
MARQUEE
==================================================*/

Testimonials.marquee=function(){

    const track=

    document.querySelector(

        ".testimonials-marquee-track"

    );

    if(

        !track||

        typeof gsap==="undefined"

    ) return;

    gsap.to(

        track,

        {

            xPercent:-50,

            duration:22,

            repeat:-1,

            ease:"none"

        }

    );

};

/*==================================================
BACKGROUND
==================================================*/

Testimonials.background=function(){

    const bg=

    document.querySelector(

        ".testimonials-background"

    );

    if(

        !bg||

        typeof gsap==="undefined"

    ) return;

    gsap.to(

        bg,

        {

            scale:1.08,

            rotation:2,

            duration:16,

            repeat:-1,

            yoyo:true,

            ease:"sine.inOut"

        }

    );

};

/*==================================================
NOISE
==================================================*/

Testimonials.noise=function(){

    const noise=

    document.querySelector(

        ".testimonials-noise"

    );

    if(

        !noise||

        typeof gsap==="undefined"

    ) return;

    gsap.to(

        noise,

        {

            x:18,

            y:12,

            duration:.25,

            repeat:-1,

            yoyo:true,

            ease:"steps(2)"

        }

    );

};

/*==================================================
REFRESH
==================================================*/

Testimonials.refresh=function(){

    if(

        this.swiper

    ){

        this.swiper.update();

    }

    if(

        typeof ScrollTrigger!==

        "undefined"

    ){

        ScrollTrigger.refresh();

    }

};

/*==================================================
OPTIMIZE
==================================================*/

Testimonials.optimize=function(){

    this.elements.cards.forEach(

        card=>{

            card.style.willChange=

            "transform";

            card.style.backfaceVisibility=

            "hidden";

        }

    );

};

/*==================================================
DESTROY
==================================================*/

Testimonials.destroy=function(){

    if(

        this.swiper

    ){

        this.swiper.destroy(

            true,

            true

        );

        this.swiper=null;

    }

    if(

        typeof ScrollTrigger!==

        "undefined"

    ){

        ScrollTrigger.getAll()

        .forEach(trigger=>{

            if(

                trigger.trigger&&

                this.elements.section&&

                this.elements.section.contains(

                    trigger.trigger

                )

            ){

                trigger.kill();

            }

        });

    }

};

/*==================================================
VERSION
==================================================*/

Testimonials.version={

    module:"Testimonials",

    version:"1.0.0",

    build:"2026.08",

    author:"Director VISION"

};

/*==================================================
READY
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        Testimonials.marquee();

        Testimonials.background();

        Testimonials.noise();

        Testimonials.optimize();

        Testimonials.refresh();

        Log.info(

            "Testimonials Module Complete"

        );

    }

);

/*==================================================
MODULE COMPLETE
==================================================*/

EVENTS.emit(

    "testimonials:initialized"

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 11.1 — CONTACT ENGINE CORE

======================================================================*/

const Contact={

    initialized:false,

    form:null,

    fields:[],

    submit:null,

    timeline:null,

    elements:{},

    config:{

        duration:.8,

        ease:"power3.out"

    }

};

/*==================================================
CACHE
==================================================*/

Contact.cache=function(){

    this.elements.section=

    document.querySelector(

        "#contact"

    );

    this.form=

    document.querySelector(

        "#contact-form"

    );

    this.fields=[

        ...document.querySelectorAll(

            "#contact-form input,#contact-form textarea,#contact-form select"

        )

    ];

    this.submit=

    document.querySelector(

        "#contact-form button[type='submit']"

    );

    this.elements.title=

    document.querySelector(

        ".contact-title"

    );

    this.elements.subtitle=

    document.querySelector(

        ".contact-subtitle"

    );

    this.elements.info=[

        ...document.querySelectorAll(

            ".contact-info-card"

        )

    ];

};

/*==================================================
CHECK
==================================================*/

Contact.exists=function(){

    return(

        this.form&&

        this.elements.section

    );

};

/*==================================================
GSAP
==================================================*/

Contact.hasGSAP=function(){

    return typeof gsap!=="undefined";

};

/*==================================================
PREPARE
==================================================*/

Contact.prepare=function(){

    if(

        !this.hasGSAP()

    ) return;

    gsap.set([

        this.elements.title,

        this.elements.subtitle,

        this.form,

        ...this.elements.info

    ],{

        autoAlpha:0,

        y:60

    });

};

/*==================================================
TIMELINE
==================================================*/

Contact.createTimeline=function(){

    if(

        !this.hasGSAP()

    ) return;

    this.timeline=

    gsap.timeline({

        scrollTrigger:{

            trigger:

            this.elements.section,

            start:"top 75%",

            once:true

        }

    });

    this.timeline

    .to(

        this.elements.title,

        {

            autoAlpha:1,

            y:0,

            duration:.8

        }

    )

    .to(

        this.elements.subtitle,

        {

            autoAlpha:1,

            y:0,

            duration:.6

        },

        "-=.45"

    )

    .to(

        this.form,

        {

            autoAlpha:1,

            y:0,

            duration:.7

        },

        "-=.3"

    )

    .to(

        this.elements.info,

        {

            autoAlpha:1,

            y:0,

            stagger:.08,

            duration:.6

        },

        "-=.4"

    );

};

/*==================================================
READY
==================================================*/

Contact.init=async function(){

    this.cache();

    if(

        !this.exists()

    ) return;

    this.prepare();

    this.createTimeline();

    this.initialized=true;

    Log.info(

        "Contact Engine Ready"

    );

};

/*==================================================
REGISTER
==================================================*/

registerModule(

    "Contact",

    Contact

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 11.2 — CONTACT VALIDATION & SUBMISSION ENGINE

======================================================================*/

/*==================================================
STATE
==================================================*/

Contact.state={

    sending:false,

    valid:false

};

/*==================================================
EMAIL
==================================================*/

Contact.email=function(value){

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    .test(value);

};

/*==================================================
FIELD
==================================================*/

Contact.validateField=function(field){

    let valid=true;

    const value=

    field.value.trim();

    if(

        field.hasAttribute(

            "required"

        )&&

        !value

    ){

        valid=false;

    }

    if(

        valid&&

        field.type==="email"

    ){

        valid=

        this.email(value);

    }

    field.classList.toggle(

        "is-valid",

        valid

    );

    field.classList.toggle(

        "is-invalid",

        !valid

    );

    return valid;

};

/*==================================================
FORM
==================================================*/

Contact.validate=function(){

    this.state.valid=true;

    this.fields.forEach(

        field=>{

            if(

                !this.validateField(

                    field

                )

            ){

                this.state.valid=false;

            }

        }

    );

    return this.state.valid;

};

/*==================================================
LOADING
==================================================*/

Contact.loading=function(state){

    this.state.sending=state;

    if(

        !this.submit

    ) return;

    this.submit.disabled=

    state;

    this.submit.classList.toggle(

        "is-loading",

        state

    );

};

/*==================================================
SUCCESS
==================================================*/

Contact.success=function(){

    EVENTS.emit(

        "notification:show",

        {

            type:"success",

            message:

            "Message sent successfully."

        }

    );

    this.form.reset();

    this.fields.forEach(

        field=>{

            field.classList.remove(

                "is-valid",

                "is-invalid"

            );

        }

    );

};

/*==================================================
ERROR
==================================================*/

Contact.error=function(){

    EVENTS.emit(

        "notification:show",

        {

            type:"error",

            message:

            "Unable to send message."

        }

    );

};

/*==================================================
SUBMIT
==================================================*/

Contact.submitForm=async function(event){

    event.preventDefault();

    if(

        !this.validate()

    ) return;

    this.loading(true);

    try{

        await new Promise(

            resolve=>

            setTimeout(

                resolve,

                1200

            )

        );

        this.success();

    }

    catch(error){

        console.error(error);

        this.error();

    }

    finally{

        this.loading(false);

    }

};

/*==================================================
LIVE VALIDATION
==================================================*/

Contact.bindValidation=function(){

    this.fields.forEach(

        field=>{

            field.addEventListener(

                "input",

                ()=>{

                    this.validateField(

                        field

                    );

                }

            );

            field.addEventListener(

                "blur",

                ()=>{

                    this.validateField(

                        field

                    );

                }

            );

        }

    );

};

/*==================================================
FORM
==================================================*/

Contact.bindSubmit=function(){

    this.form.addEventListener(

        "submit",

        this.submitForm.bind(

            this

        )

    );

};

/*==================================================
READY
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        Contact.bindValidation();

        Contact.bindSubmit();

        Log.info(

            "Contact Validation Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 11.3 — CONTACT UI INTERACTION & MICRO ANIMATIONS

======================================================================*/

/*==================================================
FLOATING LABELS
==================================================*/

Contact.floatingLabels=function(){

    this.fields.forEach(

        field=>{

            const wrapper=

            field.closest(

                ".form-group"

            );

            if(!wrapper) return;

            const update=()=>{

                wrapper.classList.toggle(

                    "has-value",

                    field.value.trim()!==""||

                    document.activeElement===field

                );

            };

            field.addEventListener(

                "focus",

                update

            );

            field.addEventListener(

                "blur",

                update

            );

            field.addEventListener(

                "input",

                update

            );

            update();

        }

    );

};

/*==================================================
INPUT HOVER
==================================================*/

Contact.inputHover=function(){

    if(

        typeof gsap==="undefined"

    ) return;

    this.fields.forEach(

        field=>{

            field.addEventListener(

                "focus",

                ()=>{

                    gsap.to(

                        field,

                        {

                            scale:1.02,

                            duration:.25,

                            ease:"power2.out"

                        }

                    );

                }

            );

            field.addEventListener(

                "blur",

                ()=>{

                    gsap.to(

                        field,

                        {

                            scale:1,

                            duration:.25

                        }

                    );

                }

            );

        }

    );

};

/*==================================================
BUTTON
==================================================*/

Contact.button=function(){

    if(

        typeof gsap==="undefined"||

        !this.submit

    ) return;

    this.submit.addEventListener(

        "mouseenter",

        ()=>{

            gsap.to(

                this.submit,

                {

                    y:-4,

                    scale:1.03,

                    duration:.3

                }

            );

        }

    );

    this.submit.addEventListener(

        "mouseleave",

        ()=>{

            gsap.to(

                this.submit,

                {

                    y:0,

                    scale:1,

                    duration:.3

                }

            );

        }

    );

};

/*==================================================
INFO CARDS
==================================================*/

Contact.cards=function(){

    if(

        typeof gsap==="undefined"

    ) return;

    this.elements.info.forEach(

        card=>{

            card.addEventListener(

                "mouseenter",

                ()=>{

                    gsap.to(

                        card,

                        {

                            y:-10,

                            duration:.35,

                            ease:"power3.out"

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

                            y:0,

                            duration:.35

                        }

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

        Contact.floatingLabels();

        Contact.inputHover();

        Contact.button();

        Contact.cards();

        Log.info(

            "Contact UI Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 11.4 — CONTACT MAP, SOCIAL & COPY ENGINE

======================================================================*/

/*==================================================
MAP
==================================================*/

Contact.map=function(){

    const iframe=

    document.querySelector(

        ".contact-map iframe"

    );

    if(

        !iframe||

        typeof gsap==="undefined"

    ) return;

    ScrollTrigger.create({

        trigger:iframe,

        start:"top 85%",

        once:true,

        onEnter:()=>{

            gsap.fromTo(

                iframe,

                {

                    autoAlpha:0,

                    scale:.96,

                    y:60

                },

                {

                    autoAlpha:1,

                    scale:1,

                    y:0,

                    duration:1,

                    ease:"power3.out"

                }

            );

        }

    });

};

/*==================================================
SOCIAL
==================================================*/

Contact.social=function(){

    document.querySelectorAll(

        ".contact-social a"

    ).forEach(

        link=>{

            link.addEventListener(

                "mouseenter",

                ()=>{

                    gsap.to(

                        link,

                        {

                            y:-8,

                            rotate:6,

                            scale:1.12,

                            duration:.3,

                            ease:"power3.out"

                        }

                    );

                }

            );

            link.addEventListener(

                "mouseleave",

                ()=>{

                    gsap.to(

                        link,

                        {

                            y:0,

                            rotate:0,

                            scale:1,

                            duration:.3

                        }

                    );

                }

            );

        }

    );

};

/*==================================================
COPY
==================================================*/

Contact.copy=function(){

    document.querySelectorAll(

        "[data-copy]"

    ).forEach(

        element=>{

            element.addEventListener(

                "click",

                async()=>{

                    try{

                        await navigator

                        .clipboard

                        .writeText(

                            element.dataset.copy

                        );

                        EVENTS.emit(

                            "notification:show",

                            {

                                type:"success",

                                message:

                                "Copied to clipboard."

                            }

                        );

                    }

                    catch(error){

                        console.error(

                            error

                        );

                    }

                }

            );

        }

    );

};

/*==================================================
LINKS
==================================================*/

Contact.external=function(){

    document.querySelectorAll(

        ".contact-social a"

    ).forEach(

        link=>{

            link.setAttribute(

                "target",

                "_blank"

            );

            link.setAttribute(

                "rel",

                "noopener noreferrer"

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

        Contact.map();

        Contact.social();

        Contact.copy();

        Contact.external();

        Log.info(

            "Contact Map & Social Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 11.5 — CONTACT FINALIZATION & PERFORMANCE

======================================================================*/

/*==================================================
OPTIMIZE
==================================================*/

Contact.optimize=function(){

    this.fields.forEach(

        field=>{

            field.style.willChange=

            "transform,border-color";

        }

    );

    this.elements.info.forEach(

        card=>{

            card.style.willChange=

            "transform";

            card.style.backfaceVisibility=

            "hidden";

        }

    );

};

/*==================================================
BACKGROUND
==================================================*/

Contact.background=function(){

    const bg=

    document.querySelector(

        ".contact-background"

    );

    if(

        !bg||

        typeof gsap==="undefined"

    ) return;

    gsap.to(

        bg,

        {

            scale:1.08,

            rotation:2,

            duration:18,

            repeat:-1,

            yoyo:true,

            ease:"sine.inOut"

        }

    );

};

/*==================================================
GRADIENT
==================================================*/

Contact.gradient=function(){

    const gradient=

    document.querySelector(

        ".contact-gradient"

    );

    if(

        !gradient||

        typeof gsap==="undefined"

    ) return;

    gsap.to(

        gradient,

        {

            backgroundPosition:

            "100% 50%",

            duration:20,

            repeat:-1,

            yoyo:true,

            ease:"none"

        }

    );

};

/*==================================================
NOISE
==================================================*/

Contact.noise=function(){

    const noise=

    document.querySelector(

        ".contact-noise"

    );

    if(

        !noise||

        typeof gsap==="undefined"

    ) return;

    gsap.to(

        noise,

        {

            x:18,

            y:12,

            duration:.25,

            repeat:-1,

            yoyo:true,

            ease:"steps(2)"

        }

    );

};

/*==================================================
REFRESH
==================================================*/

Contact.refresh=function(){

    if(

        typeof ScrollTrigger!==

        "undefined"

    ){

        ScrollTrigger.refresh();

    }

};

/*==================================================
DESTROY
==================================================*/

Contact.destroy=function(){

    if(

        this.timeline

    ){

        this.timeline.kill();

    }

    if(

        typeof ScrollTrigger!==

        "undefined"

    ){

        ScrollTrigger.getAll()

        .forEach(trigger=>{

            if(

                trigger.trigger&&

                this.elements.section&&

                this.elements.section.contains(

                    trigger.trigger

                )

            ){

                trigger.kill();

            }

        });

    }

};

/*==================================================
VERSION
==================================================*/

Contact.version={

    module:"Contact",

    version:"1.0.0",

    build:"2026.08",

    author:"Director VISION"

};

/*==================================================
READY
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        Contact.optimize();

        Contact.background();

        Contact.gradient();

        Contact.noise();

        Contact.refresh();

        Log.info(

            "Contact Module Complete"

        );

    }

);

/*==================================================
MODULE COMPLETE
==================================================*/

EVENTS.emit(

    "contact:initialized"

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 12.1 — FOOTER ENGINE CORE

======================================================================*/

const Footer={

    initialized:false,

    timeline:null,

    elements:{},

    config:{

        duration:.8,

        ease:"power3.out"

    }

};

/*==================================================
CACHE
==================================================*/

Footer.cache=function(){

    this.elements.footer=

    document.querySelector(

        "footer"

    );

    this.elements.logo=

    document.querySelector(

        ".footer-logo"

    );

    this.elements.columns=[

        ...document.querySelectorAll(

            ".footer-column"

        )

    ];

    this.elements.socials=[

        ...document.querySelectorAll(

            ".footer-social a"

        )

    ];

    this.elements.bottom=

    document.querySelector(

        ".footer-bottom"

    );

};

/*==================================================
CHECK
==================================================*/

Footer.exists=function(){

    return!!

    this.elements.footer;

};

/*==================================================
GSAP
==================================================*/

Footer.hasGSAP=function(){

    return typeof gsap!=="undefined";

};

/*==================================================
PREPARE
==================================================*/

Footer.prepare=function(){

    if(

        !this.hasGSAP()

    ) return;

    gsap.set([

        this.elements.logo,

        ...this.elements.columns,

        this.elements.bottom

    ],{

        autoAlpha:0,

        y:60

    });

};

/*==================================================
TIMELINE
==================================================*/

Footer.createTimeline=function(){

    if(

        !this.hasGSAP()

    ) return;

    this.timeline=

    gsap.timeline({

        scrollTrigger:{

            trigger:

            this.elements.footer,

            start:"top 85%",

            once:true

        }

    });

    this.timeline

    .to(

        this.elements.logo,

        {

            autoAlpha:1,

            y:0,

            duration:.8

        }

    )

    .to(

        this.elements.columns,

        {

            autoAlpha:1,

            y:0,

            stagger:.08,

            duration:.6

        },

        "-=.4"

    )

    .to(

        this.elements.bottom,

        {

            autoAlpha:1,

            y:0,

            duration:.5

        },

        "-=.25"

    );

};

/*==================================================
SOCIAL
==================================================*/

Footer.socialHover=function(){

    if(

        !this.hasGSAP()

    ) return;

    this.elements.socials.forEach(

        link=>{

            link.addEventListener(

                "mouseenter",

                ()=>{

                    gsap.to(

                        link,

                        {

                            y:-6,

                            scale:1.12,

                            rotate:8,

                            duration:.3

                        }

                    );

                }

            );

            link.addEventListener(

                "mouseleave",

                ()=>{

                    gsap.to(

                        link,

                        {

                            y:0,

                            scale:1,

                            rotate:0,

                            duration:.3

                        }

                    );

                }

            );

        }

    );

};

/*==================================================
INIT
==================================================*/

Footer.init=async function(){

    this.cache();

    if(

        !this.exists()

    ) return;

    this.prepare();

    this.createTimeline();

    this.socialHover();

    this.initialized=true;

    Log.info(

        "Footer Engine Ready"

    );

};

/*==================================================
REGISTER
==================================================*/

registerModule(

    "Footer",

    Footer

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 12.2 — FOOTER INTERACTION & NEWSLETTER ENGINE

======================================================================*/

/*==================================================
NEWSLETTER
==================================================*/

Footer.newsletter={

    form:null,

    input:null,

    button:null

};

/*==================================================
CACHE
==================================================*/

Footer.cacheNewsletter=function(){

    this.newsletter.form=

    document.querySelector(

        ".footer-newsletter"

    );

    this.newsletter.input=

    document.querySelector(

        ".footer-newsletter input"

    );

    this.newsletter.button=

    document.querySelector(

        ".footer-newsletter button"

    );

};

/*==================================================
EMAIL
==================================================*/

Footer.validateEmail=function(email){

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    .test(email);

};

/*==================================================
SUBMIT
==================================================*/

Footer.submitNewsletter=function(event){

    event.preventDefault();

    const value=

    this.newsletter.input.value

    .trim();

    if(

        !this.validateEmail(value)

    ){

        this.newsletter.input

        .classList.add(

            "is-invalid"

        );

        return;

    }

    this.newsletter.input

    .classList.remove(

        "is-invalid"

    );

    this.newsletter.button.disabled=

    true;

    this.newsletter.button

    .classList.add(

        "is-loading"

    );

    setTimeout(()=>{

        this.newsletter.form.reset();

        this.newsletter.button

        .disabled=false;

        this.newsletter.button

        .classList.remove(

            "is-loading"

        );

        EVENTS.emit(

            "notification:show",

            {

                type:"success",

                message:

                "Subscribed successfully."

            }

        );

    },1000);

};

/*==================================================
LINK HOVER
==================================================*/

Footer.links=function(){

    document.querySelectorAll(

        ".footer-links a"

    ).forEach(

        link=>{

            link.addEventListener(

                "mouseenter",

                ()=>{

                    gsap.to(

                        link,

                        {

                            x:10,

                            duration:.25

                        }

                    );

                }

            );

            link.addEventListener(

                "mouseleave",

                ()=>{

                    gsap.to(

                        link,

                        {

                            x:0,

                            duration:.25

                        }

                    );

                }

            );

        }

    );

};

/*==================================================
LOGO
==================================================*/

Footer.logo=function(){

    if(

        !this.elements.logo

    ) return;

    this.elements.logo

    .addEventListener(

        "mouseenter",

        ()=>{

            gsap.to(

                this.elements.logo,

                {

                    scale:1.05,

                    rotation:2,

                    duration:.4

                }

            );

        }

    );

    this.elements.logo

    .addEventListener(

        "mouseleave",

        ()=>{

            gsap.to(

                this.elements.logo,

                {

                    scale:1,

                    rotation:0,

                    duration:.4

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

        Footer.cacheNewsletter();

        Footer.newsletter.form

        ?.addEventListener(

            "submit",

            Footer.submitNewsletter.bind(

                Footer

            )

        );

        Footer.links();

        Footer.logo();

        Log.info(

            "Footer Interaction Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 12.3 — FOOTER PARALLAX & VISUAL EFFECTS

======================================================================*/

/*==================================================
PARALLAX
==================================================*/

Footer.parallax={

    speed:.06

};

Footer.updateParallax=function(){

    if(

        !this.elements.footer||

        typeof gsap==="undefined"

    ) return;

    const rect=

    this.elements.footer

    .getBoundingClientRect();

    const offset=

    rect.top*

    this.parallax.speed;

    gsap.to(

        this.elements.footer,

        {

            backgroundPosition:

            `50% ${offset}px`,

            duration:.6,

            overwrite:true,

            ease:"power2.out"

        }

    );

};

/*==================================================
BACKGROUND
==================================================*/

Footer.background=function(){

    const bg=

    document.querySelector(

        ".footer-background"

    );

    if(

        !bg||

        typeof gsap==="undefined"

    ) return;

    gsap.to(

        bg,

        {

            scale:1.08,

            rotation:2,

            duration:16,

            repeat:-1,

            yoyo:true,

            ease:"sine.inOut"

        }

    );

};

/*==================================================
GRADIENT
==================================================*/

Footer.gradient=function(){

    const gradient=

    document.querySelector(

        ".footer-gradient"

    );

    if(

        !gradient||

        typeof gsap==="undefined"

    ) return;

    gsap.to(

        gradient,

        {

            backgroundPosition:

            "100% 50%",

            duration:18,

            repeat:-1,

            yoyo:true,

            ease:"none"

        }

    );

};

/*==================================================
NOISE
==================================================*/

Footer.noise=function(){

    const noise=

    document.querySelector(

        ".footer-noise"

    );

    if(

        !noise||

        typeof gsap==="undefined"

    ) return;

    gsap.to(

        noise,

        {

            x:18,

            y:12,

            duration:.25,

            repeat:-1,

            yoyo:true,

            ease:"steps(2)"

        }

    );

};

/*==================================================
FLOAT ICONS
==================================================*/

Footer.floatIcons=function(){

    document.querySelectorAll(

        ".footer-social a"

    ).forEach(

        (icon,index)=>{

            gsap.to(

                icon,

                {

                    y:-5,

                    duration:1.6+

                    index*.15,

                    repeat:-1,

                    yoyo:true,

                    ease:"sine.inOut"

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

        Footer.updateParallax();

    }

);

/*==================================================
READY
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        Footer.background();

        Footer.gradient();

        Footer.noise();

        Footer.floatIcons();

        Log.info(

            "Footer Visual Effects Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 12.4 — FOOTER BACK TO TOP & COPYRIGHT ENGINE

======================================================================*/

/*==================================================
BACK TO TOP
==================================================*/

Footer.top={

    button:null,

    visible:false

};

/*==================================================
CACHE
==================================================*/

Footer.cacheTop=function(){

    this.top.button=

    document.querySelector(

        ".back-to-top"

    );

};

/*==================================================
SHOW
==================================================*/

Footer.showTop=function(){

    if(

        this.top.visible||

        !this.top.button

    ) return;

    this.top.visible=true;

    gsap.to(

        this.top.button,

        {

            autoAlpha:1,

            y:0,

            duration:.35,

            pointerEvents:"auto"

        }

    );

};

/*==================================================
HIDE
==================================================*/

Footer.hideTop=function(){

    if(

        !this.top.visible||

        !this.top.button

    ) return;

    this.top.visible=false;

    gsap.to(

        this.top.button,

        {

            autoAlpha:0,

            y:20,

            duration:.35,

            pointerEvents:"none"

        }

    );

};

/*==================================================
SCROLL
==================================================*/

Footer.updateTop=function(scroll){

    if(

        scroll.y>600

    ){

        this.showTop();

    }

    else{

        this.hideTop();

    }

};

/*==================================================
SCROLL TO TOP
==================================================*/

Footer.scrollTop=function(){

    if(

        typeof Lenis!=="undefined"&&

        window.lenis

    ){

        window.lenis.scrollTo(

            0,

            {

                duration:1.4

            }

        );

    }

    else{

        window.scrollTo({

            top:0,

            behavior:"smooth"

        });

    }

};

/*==================================================
COPYRIGHT
==================================================*/

Footer.copyright=function(){

    const year=

    document.querySelector(

        ".footer-year"

    );

    if(

        year

    ){

        year.textContent=

        new Date()

        .getFullYear();

    }

};

/*==================================================
EVENTS
==================================================*/

EVENTS.on(

    "scroll:update",

    scroll=>{

        Footer.updateTop(

            scroll

        );

    }

);

/*==================================================
READY
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        Footer.cacheTop();

        Footer.copyright();

        Footer.top.button

        ?.addEventListener(

            "click",

            ()=>{

                Footer.scrollTop();

            }

        );

        Log.info(

            "Footer Back To Top Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 12.5 — FOOTER FINALIZATION & PERFORMANCE

======================================================================*/

/*==================================================
OPTIMIZE
==================================================*/

Footer.optimize=function(){

    if(

        this.elements.footer

    ){

        this.elements.footer.style.willChange=

        "transform";

    }

    this.elements.columns.forEach(

        column=>{

            column.style.willChange=

            "transform";

            column.style.backfaceVisibility=

            "hidden";

        }

    );

};

/*==================================================
REFRESH
==================================================*/

Footer.refresh=function(){

    if(

        typeof ScrollTrigger!==

        "undefined"

    ){

        ScrollTrigger.refresh();

    }

};

/*==================================================
OBSERVER
==================================================*/

Footer.observe=function(){

    if(

        !("IntersectionObserver" in window)

    ) return;

    const observer=

    new IntersectionObserver(

        entries=>{

            entries.forEach(

                entry=>{

                    entry.target.classList.toggle(

                        "is-visible",

                        entry.isIntersecting

                    );

                }

            );

        },

        {

            threshold:.2

        }

    );

    this.elements.columns.forEach(

        column=>observer.observe(

            column

        )

    );

};

/*==================================================
DESTROY
==================================================*/

Footer.destroy=function(){

    if(

        this.timeline

    ){

        this.timeline.kill();

    }

    if(

        typeof ScrollTrigger!==

        "undefined"

    ){

        ScrollTrigger

        .getAll()

        .forEach(trigger=>{

            if(

                trigger.trigger&&

                this.elements.footer&&

                this.elements.footer.contains(

                    trigger.trigger

                )

            ){

                trigger.kill();

            }

        });

    }

};

/*==================================================
VERSION
==================================================*/

Footer.version={

    module:"Footer",

    version:"1.0.0",

    build:"2026.08",

    author:"Director VISION"

};

/*==================================================
READY
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        Footer.optimize();

        Footer.observe();

        Footer.refresh();

        Log.info(

            "Footer Module Complete"

        );

    }

);

/*==================================================
MODULE COMPLETE
==================================================*/

EVENTS.emit(

    "footer:initialized"

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 13.1 — PAGE LOADER CORE ENGINE

======================================================================*/

const Loader={

    initialized:false,

    loaded:false,

    progress:0,

    timeline:null,

    elements:{}

};

/*==================================================
CACHE
==================================================*/

Loader.cache=function(){

    this.elements.loader=

    document.querySelector(

        ".page-loader"

    );

    this.elements.progress=

    document.querySelector(

        ".loader-progress"

    );

    this.elements.bar=

    document.querySelector(

        ".loader-bar"

    );

    this.elements.logo=

    document.querySelector(

        ".loader-logo"

    );

};

/*==================================================
CHECK
==================================================*/

Loader.exists=function(){

    return!!

    this.elements.loader;

};

/*==================================================
UPDATE
==================================================*/

Loader.update=function(value){

    this.progress=

    Math.min(

        100,

        value

    );

    if(

        this.elements.progress

    ){

        this.elements.progress.textContent=

        this.progress+"%";

    }

    if(

        this.elements.bar

    ){

        this.elements.bar.style.width=

        this.progress+"%";

    }

};

/*==================================================
SIMULATE
==================================================*/

Loader.simulate=function(){

    const timer=

    setInterval(()=>{

        if(

            this.progress>=100

        ){

            clearInterval(

                timer

            );

            this.complete();

            return;

        }

        this.update(

            this.progress+

            Math.random()*8

        );

    },60);

};

/*==================================================
COMPLETE
==================================================*/

Loader.complete=function(){

    this.loaded=true;

    EVENTS.emit(

        "loader:complete"

    );

};

/*==================================================
READY
==================================================*/

Loader.init=async function(){

    this.cache();

    if(

        !this.exists()

    ) return;

    this.simulate();

    this.initialized=true;

    Log.info(

        "Loader Engine Ready"

    );

};

/*==================================================
REGISTER
==================================================*/

registerModule(

    "Loader",

    Loader

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 13.2 — LOADER GSAP INTRO TIMELINE

======================================================================*/

/*==================================================
GSAP
==================================================*/

Loader.hasGSAP=function(){

    return typeof gsap!=="undefined";

};

/*==================================================
PREPARE
==================================================*/

Loader.prepare=function(){

    if(

        !this.hasGSAP()

    ) return;

    gsap.set([

        this.elements.logo,

        this.elements.progress,

        this.elements.bar

    ],{

        autoAlpha:0,

        y:40

    });

};

/*==================================================
INTRO
==================================================*/

Loader.intro=function(){

    if(

        !this.hasGSAP()

    ) return;

    this.timeline=

    gsap.timeline();

    this.timeline

    .to(

        this.elements.logo,

        {

            autoAlpha:1,

            y:0,

            duration:.8,

            ease:"power3.out"

        }

    )

    .to(

        this.elements.progress,

        {

            autoAlpha:1,

            y:0,

            duration:.5

        },

        "-=.35"

    )

    .to(

        this.elements.bar,

        {

            autoAlpha:1,

            y:0,

            duration:.45

        },

        "-=.25"

    );

};

/*==================================================
LOGO
==================================================*/

Loader.animateLogo=function(){

    if(

        !this.hasGSAP()||

        !this.elements.logo

    ) return;

    gsap.to(

        this.elements.logo,

        {

            scale:1.05,

            repeat:-1,

            yoyo:true,

            duration:1.5,

            ease:"sine.inOut"

        }

    );

};

/*==================================================
PROGRESS
==================================================*/

Loader.animateProgress=function(){

    if(

        !this.hasGSAP()

    ) return;

    gsap.to(

        this.elements.progress,

        {

            opacity:.45,

            repeat:-1,

            yoyo:true,

            duration:.8

        }

    );

};

/*==================================================
EVENT
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        Loader.prepare();

        Loader.intro();

        Loader.animateLogo();

        Loader.animateProgress();

        Log.info(

            "Loader Intro Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 13.3 — ASSET PRELOADER & RESOURCE MANAGER

======================================================================*/

/*==================================================
STATE
==================================================*/

Loader.assets={

    total:0,

    loaded:0,

    failed:0,

    complete:false

};

/*==================================================
COLLECT
==================================================*/

Loader.collect=function(){

    const images=[

        ...document.images

    ];

    const videos=[

        ...document.querySelectorAll(

            "video"

        )

    ];

    const fonts=[

        ...document.querySelectorAll(

            "link[rel='preload'][as='font']"

        )

    ];

    this.assets.total=

    images.length+

    videos.length+

    fonts.length;

    return{

        images,

        videos,

        fonts

    };

};

/*==================================================
PROGRESS
==================================================*/

Loader.assetLoaded=function(){

    this.assets.loaded++;

    const percent=

    Math.floor(

        (this.assets.loaded/

        this.assets.total)

        *100

    );

    this.update(percent);

    if(

        this.assets.loaded+

        this.assets.failed>=

        this.assets.total

    ){

        this.assets.complete=true;

        this.complete();

    }

};

/*==================================================
FAILED
==================================================*/

Loader.assetFailed=function(){

    this.assets.failed++;

    this.assetLoaded();

};

/*==================================================
IMAGES
==================================================*/

Loader.preloadImages=function(images){

    images.forEach(img=>{

        if(

            img.complete

        ){

            this.assetLoaded();

            return;

        }

        img.addEventListener(

            "load",

            ()=>{

                this.assetLoaded();

            },

            {

                once:true

            }

        );

        img.addEventListener(

            "error",

            ()=>{

                this.assetFailed();

            },

            {

                once:true

            }

        );

    });

};

/*==================================================
VIDEOS
==================================================*/

Loader.preloadVideos=function(videos){

    videos.forEach(video=>{

        if(

            video.readyState>=2

        ){

            this.assetLoaded();

            return;

        }

        video.addEventListener(

            "loadeddata",

            ()=>{

                this.assetLoaded();

            },

            {

                once:true

            }

        );

        video.addEventListener(

            "error",

            ()=>{

                this.assetFailed();

            },

            {

                once:true

            }

        );

    });

};

/*==================================================
FONTS
==================================================*/

Loader.preloadFonts=function(fonts){

    if(

        !fonts.length

    ) return;

    document.fonts.ready

    .then(()=>{

        fonts.forEach(

            ()=>{

                this.assetLoaded();

            }

        );

    });

};

/*==================================================
START
==================================================*/

Loader.preload=function(){

    const assets=

    this.collect();

    if(

        !this.assets.total

    ){

        this.complete();

        return;

    }

    this.preloadImages(

        assets.images

    );

    this.preloadVideos(

        assets.videos

    );

    this.preloadFonts(

        assets.fonts

    );

};

/*==================================================
READY
==================================================*/

EVENTS.on(

    "appReady",

    ()=>{

        Loader.preload();

        Log.info(

            "Asset Preloader Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 13.4 — PAGE TRANSITION & EXIT ANIMATION ENGINE

======================================================================*/

/*==================================================
TRANSITION
==================================================*/

Loader.transition={

    active:false

};

/*==================================================
SHOW
==================================================*/

Loader.show=function(){

    if(

        !this.elements.loader||

        !this.hasGSAP()

    ) return;

    this.transition.active=true;

    gsap.set(

        this.elements.loader,

        {

            display:"flex",

            autoAlpha:1,

            pointerEvents:"all"

        }

    );

    gsap.fromTo(

        this.elements.loader,

        {

            clipPath:

            "circle(0% at 50% 50%)"

        },

        {

            clipPath:

            "circle(150% at 50% 50%)",

            duration:.9,

            ease:"power4.inOut"

        }

    );

};

/*==================================================
HIDE
==================================================*/

Loader.hide=function(){

    if(

        !this.elements.loader||

        !this.hasGSAP()

    ) return;

    gsap.to(

        this.elements.loader,

        {

            autoAlpha:0,

            duration:.7,

            ease:"power3.out",

            onComplete:()=>{

                this.transition.active=false;

                this.elements.loader.style.display=

                "none";

                EVENTS.emit(

                    "websiteReady"

                );

            }

        }

    );

};

/*==================================================
LINKS
==================================================*/

Loader.bindLinks=function(){

    document.querySelectorAll(

        "a[href]"

    ).forEach(

        link=>{

            const href=

            link.getAttribute(

                "href"

            );

            if(

                !href||

                href.startsWith("#")||

                href.startsWith("mailto:")||

                href.startsWith("tel:")||

                link.target==="_blank"

            ) return;

            link.addEventListener(

                "click",

                event=>{

                    event.preventDefault();

                    this.show();

                    setTimeout(()=>{

                        window.location=

                        href;

                    },700);

                }

            );

        }

    );

};

/*==================================================
POPSTATE
==================================================*/

Loader.history=function(){

    window.addEventListener(

        "pageshow",

        ()=>{

            this.hide();

        }

    );

};

/*==================================================
EVENTS
==================================================*/

EVENTS.on(

    "loader:complete",

    ()=>{

        Loader.hide();

    }

);

/*==================================================
READY
==================================================*/

EVENTS.on(

    "appReady",

    ()=>{

        Loader.bindLinks();

        Loader.history();

        Log.info(

            "Page Transition Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 13.5 — LOADER FINALIZATION & PERFORMANCE

======================================================================*/

/*==================================================
OPTIMIZE
==================================================*/

Loader.optimize=function(){

    if(

        !this.elements.loader

    ) return;

    this.elements.loader.style.willChange=

    "opacity,transform";

    this.elements.loader.style.backfaceVisibility=

    "hidden";

    this.elements.loader.style.transform=

    "translateZ(0)";

};

/*==================================================
REDUCED MOTION
==================================================*/

Loader.motion=function(){

    const reduce=

    window.matchMedia(

        "(prefers-reduced-motion: reduce)"

    ).matches;

    if(

        reduce

    ){

        this.update(100);

        this.complete();

    }

};

/*==================================================
TIMEOUT
==================================================*/

Loader.timeout=function(){

    setTimeout(()=>{

        if(

            !this.loaded

        ){

            this.update(100);

            this.complete();

        }

    },10000);

};

/*==================================================
REFRESH
==================================================*/

Loader.refresh=function(){

    if(

        typeof ScrollTrigger!==

        "undefined"

    ){

        ScrollTrigger.refresh();

    }

};

/*==================================================
DESTROY
==================================================*/

Loader.destroy=function(){

    if(

        this.timeline

    ){

        this.timeline.kill();

    }

    if(

        this.elements.loader

    ){

        this.elements.loader.remove();

    }

};

/*==================================================
VERSION
==================================================*/

Loader.version={

    module:"Page Loader",

    version:"1.0.0",

    build:"2026.08",

    author:"Director VISION"

};

/*==================================================
READY
==================================================*/

EVENTS.on(

    "appReady",

    ()=>{

        Loader.optimize();

        Loader.motion();

        Loader.timeout();

        Loader.refresh();

        Log.info(

            "Loader Module Complete"

        );

    }

);

/*==================================================
MODULE COMPLETE
==================================================*/

EVENTS.emit(

    "loader:initialized"

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 14.1 — LENIS SMOOTH SCROLL ENGINE

======================================================================*/

const SmoothScroll={

    initialized:false,

    instance:null,

    enabled:true,

    config:{

        duration:1.2,

        wheelMultiplier:1,

        touchMultiplier:2,

        infinite:false,

        smoothWheel:true,

        smoothTouch:false,

        gestureOrientation:"vertical"

    }

};

/*==================================================
CHECK
==================================================*/

SmoothScroll.exists=function(){

    return typeof Lenis!=="undefined";

};

/*==================================================
CREATE
==================================================*/

SmoothScroll.create=function(){

    if(

        !this.exists()

    ) return;

    this.instance=

    new Lenis({

        duration:

        this.config.duration,

        wheelMultiplier:

        this.config.wheelMultiplier,

        touchMultiplier:

        this.config.touchMultiplier,

        smoothWheel:

        this.config.smoothWheel,

        smoothTouch:

        this.config.smoothTouch,

        infinite:

        this.config.infinite,

        gestureOrientation:

        this.config

        .gestureOrientation

    });

    window.lenis=

    this.instance;

};

/*==================================================
RAF
==================================================*/

SmoothScroll.raf=function(time){

    if(

        !this.instance

    ) return;

    this.instance.raf(

        time

    );

    requestAnimationFrame(

        this.raf.bind(this)

    );

};

/*==================================================
SCROLL
==================================================*/

SmoothScroll.scrollTo=function(

    target,

    options={}

){

    if(

        !this.instance

    ) return;

    this.instance.scrollTo(

        target,

        options

    );

};

/*==================================================
START
==================================================*/

SmoothScroll.start=function(){

    this.instance?.start();

};

/*==================================================
STOP
==================================================*/

SmoothScroll.stop=function(){

    this.instance?.stop();

};

/*==================================================
TOGGLE
==================================================*/

SmoothScroll.toggle=function(state){

    this.enabled=state;

    state

    ?this.start()

    :this.stop();

};

/*==================================================
READY
==================================================*/

SmoothScroll.init=async function(){

    if(

        !this.exists()

    ) return;

    this.create();

    requestAnimationFrame(

        this.raf.bind(this)

    );

    this.initialized=true;

    Log.info(

        "Lenis Engine Ready"

    );

};

/*==================================================
REGISTER
==================================================*/

registerModule(

    "SmoothScroll",

    SmoothScroll

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 14.2 — LENIS + GSAP SCROLLTRIGGER INTEGRATION

======================================================================*/

/*==================================================
SYNC
==================================================*/

SmoothScroll.sync=function(){

    if(

        !this.instance||

        typeof ScrollTrigger===

        "undefined"

    ) return;

    this.instance.on(

        "scroll",

        ScrollTrigger.update

    );

    gsap.ticker.add(

        time=>{

            this.instance.raf(

                time*1000

            );

        }

    );

    gsap.ticker.lagSmoothing(

        0

    );

};

/*==================================================
PROXY
==================================================*/

SmoothScroll.proxy=function(){

    if(

        typeof ScrollTrigger===

        "undefined"

    ) return;

    ScrollTrigger.scrollerProxy(

        document.body,

        {

            scrollTop:value=>{

                if(

                    arguments.length

                ){

                    this.instance.scrollTo(

                        value,

                        {

                            immediate:true

                        }

                    );

                }

                return this.instance

                .scroll;

            },

            getBoundingClientRect(){

                return{

                    top:0,

                    left:0,

                    width:

                    window.innerWidth,

                    height:

                    window.innerHeight

                };

            }

        }

    );

};

/*==================================================
ANCHORS
==================================================*/

SmoothScroll.anchors=function(){

    document.querySelectorAll(

        'a[href^="#"]'

    ).forEach(

        link=>{

            link.addEventListener(

                "click",

                event=>{

                    const href=

                    link.getAttribute(

                        "href"

                    );

                    if(

                        href==="#"

                    ) return;

                    const target=

                    document.querySelector(

                        href

                    );

                    if(

                        !target

                    ) return;

                    event.preventDefault();

                    this.scrollTo(

                        target,

                        {

                            duration:1.2,

                            offset:-80

                        }

                    );

                }

            );

        }

    );

};

/*==================================================
RESIZE
==================================================*/

SmoothScroll.resize=function(){

    this.instance?.resize();

    ScrollTrigger

    ?.refresh();

};

/*==================================================
EVENTS
==================================================*/

EVENTS.on(

    "viewport:resize",

    ()=>{

        SmoothScroll.resize();

    }

);

/*==================================================
READY
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        SmoothScroll.sync();

        SmoothScroll.proxy();

        SmoothScroll.anchors();

        Log.info(

            "Lenis GSAP Integration Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 14.3 — LENIS ADVANCED SCROLL CONTROLS

======================================================================*/

/*==================================================
LOCK
==================================================*/

SmoothScroll.lock=function(){

    if(

        !this.instance

    ) return;

    this.stop();

    document.documentElement

    .classList.add(

        "scroll-locked"

    );

    document.body.style.overflow=

    "hidden";

};

/*==================================================
UNLOCK
==================================================*/

SmoothScroll.unlock=function(){

    if(

        !this.instance

    ) return;

    this.start();

    document.documentElement

    .classList.remove(

        "scroll-locked"

    );

    document.body.style.removeProperty(

        "overflow"

    );

};

/*==================================================
SAVE POSITION
==================================================*/

SmoothScroll.savedPosition=0;

SmoothScroll.save=function(){

    this.savedPosition=

    this.instance

    ?this.instance.scroll

    :window.scrollY;

};

/*==================================================
RESTORE POSITION
==================================================*/

SmoothScroll.restore=function(){

    this.scrollTo(

        this.savedPosition,

        {

            immediate:true

        }

    );

};

/*==================================================
SECTION SCROLL
==================================================*/

SmoothScroll.toSection=function(

    selector,

    offset=-80

){

    const target=

    document.querySelector(

        selector

    );

    if(

        !target

    ) return;

    this.scrollTo(

        target,

        {

            offset,

            duration:1.4,

            easing:t=>

            Math.min(

                1,

                1.001-

                Math.pow(

                    2,

                    -10*t

                )

            )

        }

    );

};

/*==================================================
MODAL EVENTS
==================================================*/

EVENTS.on(

    "modal:open",

    ()=>{

        SmoothScroll.lock();

    }

);

EVENTS.on(

    "modal:close",

    ()=>{

        SmoothScroll.unlock();

    }

);

/*==================================================
MENU EVENTS
==================================================*/

EVENTS.on(

    "mobileMenu:open",

    ()=>{

        SmoothScroll.lock();

    }

);

EVENTS.on(

    "mobileMenu:close",

    ()=>{

        SmoothScroll.unlock();

    }

);

/*==================================================
PAGE EVENTS
==================================================*/

EVENTS.on(

    "page:hidden",

    ()=>{

        SmoothScroll.save();

    }

);

EVENTS.on(

    "page:visible",

    ()=>{

        SmoothScroll.restore();

    }

);

/*==================================================
READY
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        Log.info(

            "Lenis Advanced Controls Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 14.4 — LENIS PAGE PROGRESS & SCROLL UTILITIES

======================================================================*/

/*==================================================
PROGRESS
==================================================*/

SmoothScroll.progress={

    value:0,

    bar:null,

    circle:null

};

/*==================================================
CACHE
==================================================*/

SmoothScroll.cacheProgress=function(){

    this.progress.bar=

    document.querySelector(

        ".scroll-progress-bar"

    );

    this.progress.circle=

    document.querySelector(

        ".scroll-progress-circle"

    );

};

/*==================================================
UPDATE
==================================================*/

SmoothScroll.updateProgress=function(){

    const max=

    document.documentElement.scrollHeight-

    window.innerHeight;

    const current=

    this.instance

    ?this.instance.scroll

    :window.scrollY;

    this.progress.value=

    Math.min(

        current/max,

        1

    );

    if(

        this.progress.bar

    ){

        this.progress.bar.style.transform=

`
scaleX(${this.progress.value})
`;

    }

    if(

        this.progress.circle

    ){

        const length=

        this.progress.circle

        .getTotalLength();

        this.progress.circle

        .style.strokeDasharray=

        length;

        this.progress.circle

        .style.strokeDashoffset=

        length-

        (

            length*

            this.progress.value

        );

    }

};

/*==================================================
DIRECTION
==================================================*/

SmoothScroll.direction={

    value:"down",

    previous:0

};

SmoothScroll.detectDirection=function(){

    const current=

    this.instance

    ?this.instance.scroll

    :window.scrollY;

    this.direction.value=

    current>

    this.direction.previous

    ?"down"

    :"up";

    this.direction.previous=

    current;

};

/*==================================================
SCROLL END
==================================================*/

SmoothScroll.onScrollEnd=function(callback){

    let timer;

    this.instance?.on(

        "scroll",

        ()=>{

            clearTimeout(

                timer

            );

            timer=

            setTimeout(

                callback,

                120

            );

        }

    );

};

/*==================================================
EVENTS
==================================================*/

EVENTS.on(

    "frame:update",

    ()=>{

        SmoothScroll.updateProgress();

        SmoothScroll.detectDirection();

    }

);

/*==================================================
READY
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        SmoothScroll.cacheProgress();

        SmoothScroll.onScrollEnd(

            ()=>{

                EVENTS.emit(

                    "scroll:end"

                );

            }

        );

        Log.info(

            "Lenis Scroll Utilities Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 14.5 — LENIS FINALIZATION & PERFORMANCE

======================================================================*/

/*==================================================
OPTIMIZE
==================================================*/

SmoothScroll.optimize=function(){

    document.documentElement.style.scrollBehavior=

    "auto";

    document.documentElement.style.overscrollBehavior=

    "none";

    document.body.style.overscrollBehavior=

    "none";

    document.body.style.touchAction=

    "pan-y";

};

/*==================================================
REDUCED MOTION
==================================================*/

SmoothScroll.motion=function(){

    const reduce=

    window.matchMedia(

        "(prefers-reduced-motion: reduce)"

    ).matches;

    if(

        reduce&&

        this.instance

    ){

        this.instance.destroy();

        this.instance=null;

        this.enabled=false;

    }

};

/*==================================================
VISIBILITY
==================================================*/

SmoothScroll.visibility=function(){

    document.addEventListener(

        "visibilitychange",

        ()=>{

            if(

                document.hidden

            ){

                this.stop();

            }

            else{

                this.start();

            }

        }

    );

};

/*==================================================
DESTROY
==================================================*/

SmoothScroll.destroy=function(){

    if(

        !this.instance

    ) return;

    this.instance.destroy();

    this.instance=null;

};

/*==================================================
VERSION
==================================================*/

SmoothScroll.version={

    module:"Lenis",

    version:"1.0.0",

    build:"2026.08",

    author:"Director VISION"

};

/*==================================================
READY
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        SmoothScroll.optimize();

        SmoothScroll.motion();

        SmoothScroll.visibility();

        Log.info(

            "Lenis Module Complete"

        );

    }

);

/*==================================================
MODULE COMPLETE
==================================================*/

EVENTS.emit(

    "lenis:initialized"

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 15.1 — GLOBAL UTILITIES ENGINE

======================================================================*/

const Utilities={

    initialized:false,

    viewport:{},

    device:{},

    browser:{}

};

/*==================================================
VIEWPORT
==================================================*/

Utilities.viewport.update=function(){

    document.documentElement.style.setProperty(

        "--vw",

        window.innerWidth*.01+"px"

    );

    document.documentElement.style.setProperty(

        "--vh",

        window.innerHeight*.01+"px"

    );

};

/*==================================================
DEVICE
==================================================*/

Utilities.device.detect=function(){

    const ua=

    navigator.userAgent;

    this.isMobile=

    /Android|iPhone|iPad|iPod/i

    .test(ua);

    this.isTouch=

    navigator.maxTouchPoints>0;

    this.isMac=

    /Mac/i.test(ua);

    this.isWindows=

    /Win/i.test(ua);

};

/*==================================================
BROWSER
==================================================*/

Utilities.browser.detect=function(){

    const ua=

    navigator.userAgent;

    this.chrome=

    /Chrome/i.test(ua);

    this.firefox=

    /Firefox/i.test(ua);

    this.safari=

    /^((?!chrome|android).)*safari/i

    .test(ua);

    this.edge=

    /Edg/i.test(ua);

};

/*==================================================
CLASS
==================================================*/

Utilities.applyClasses=function(){

    document.documentElement

    .classList.toggle(

        "is-mobile",

        this.device.isMobile

    );

    document.documentElement

    .classList.toggle(

        "is-touch",

        this.device.isTouch

    );

};

/*==================================================
ONLINE
==================================================*/

Utilities.network=function(){

    document.documentElement

    .classList.toggle(

        "is-offline",

        !navigator.onLine

    );

};

/*==================================================
EVENTS
==================================================*/

EVENTS.on(

    "viewport:resize",

    ()=>{

        Utilities.viewport.update();

    }

);

EVENTS.on(

    "network:online",

    ()=>{

        Utilities.network();

    }

);

EVENTS.on(

    "network:offline",

    ()=>{

        Utilities.network();

    }

);

/*==================================================
INIT
==================================================*/

Utilities.init=async function(){

    this.viewport.update();

    this.device.detect();

    this.browser.detect();

    this.applyClasses();

    this.network();

    this.initialized=true;

    Log.info(

        "Utilities Engine Ready"

    );

};

/*==================================================
REGISTER
==================================================*/

registerModule(

    "Utilities",

    Utilities

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 15.2 — GLOBAL HELPER FUNCTIONS

======================================================================*/

/*==================================================
UUID
==================================================*/

Utilities.uuid=function(){

    return(

        crypto.randomUUID

        ?crypto.randomUUID()

        :"id-"+

        Date.now()+"-"+

        Math.random()

        .toString(36)

        .slice(2)

    );

};

/*==================================================
COPY
==================================================*/

Utilities.copy=async function(text){

    try{

        await navigator

        .clipboard

        .writeText(text);

        EVENTS.emit(

            "notification:show",

            {

                type:"success",

                message:"Copied."

            }

        );

    }

    catch(error){

        console.error(error);

    }

};

/*==================================================
DOWNLOAD
==================================================*/

Utilities.download=function(

    url,

    filename="download"

){

    const link=

    document.createElement("a");

    link.href=url;

    link.download=filename;

    document.body.appendChild(

        link

    );

    link.click();

    link.remove();

};

/*==================================================
DEBOUNCE
==================================================*/

Utilities.debounce=function(

    callback,

    delay=200

){

    let timer;

    return(...args)=>{

        clearTimeout(timer);

        timer=setTimeout(

            ()=>{

                callback(...args);

            },

            delay

        );

    };

};

/*==================================================
THROTTLE
==================================================*/

Utilities.throttle=function(

    callback,

    limit=100

){

    let waiting=false;

    return(...args)=>{

        if(waiting) return;

        waiting=true;

        callback(...args);

        setTimeout(

            ()=>{

                waiting=false;

            },

            limit

        );

    };

};

/*==================================================
WAIT
==================================================*/

Utilities.wait=function(ms){

    return new Promise(

        resolve=>

        setTimeout(

            resolve,

            ms

        )

    );

};

/*==================================================
RANDOM
==================================================*/

Utilities.random=function(

    min,

    max

){

    return Math.floor(

        Math.random()*

        (max-min+1)

    )+min;

};

/*==================================================
CLAMP
==================================================*/

Utilities.clamp=function(

    value,

    min,

    max

){

    return Math.min(

        Math.max(

            value,

            min

        ),

        max

    );

};

/*==================================================
LERP
==================================================*/

Utilities.lerp=function(

    start,

    end,

    amount

){

    return start+

    (end-start)*amount;

};

/*==================================================
READY
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        Log.info(

            "Global Helpers Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 15.3 — STORAGE, URL & SESSION UTILITIES

======================================================================*/

/*==================================================
LOCAL STORAGE
==================================================*/

Utilities.storage={};

Utilities.storage.set=function(

    key,

    value

){

    try{

        localStorage.setItem(

            key,

            JSON.stringify(value)

        );

    }

    catch(error){

        console.error(error);

    }

};

Utilities.storage.get=function(

    key,

    fallback=null

){

    try{

        const value=

        localStorage.getItem(

            key

        );

        return value

        ?JSON.parse(value)

        :fallback;

    }

    catch{

        return fallback;

    }

};

Utilities.storage.remove=function(

    key

){

    localStorage.removeItem(

        key

    );

};

Utilities.storage.clear=function(){

    localStorage.clear();

};

/*==================================================
SESSION STORAGE
==================================================*/

Utilities.session={};

Utilities.session.set=function(

    key,

    value

){

    sessionStorage.setItem(

        key,

        JSON.stringify(value)

    );

};

Utilities.session.get=function(

    key,

    fallback=null

){

    const value=

    sessionStorage.getItem(

        key

    );

    return value

    ?JSON.parse(value)

    :fallback;

};

Utilities.session.remove=function(

    key

){

    sessionStorage.removeItem(

        key

    );

};

/*==================================================
URL PARAMS
==================================================*/

Utilities.url={};

Utilities.url.get=function(name){

    return new URLSearchParams(

        window.location.search

    ).get(name);

};

Utilities.url.set=function(

    key,

    value

){

    const url=

    new URL(

        window.location

    );

    url.searchParams.set(

        key,

        value

    );

    history.replaceState(

        {},

        "",

        url

    );

};

Utilities.url.remove=function(

    key

){

    const url=

    new URL(

        window.location

    );

    url.searchParams.delete(

        key

    );

    history.replaceState(

        {},

        "",

        url

    );

};

/*==================================================
HASH
==================================================*/

Utilities.hash=function(id){

    history.replaceState(

        {},

        "",

        "#"+id

    );

};

/*==================================================
READY
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        Log.info(

            "Storage Utilities Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 15.4 — PERFORMANCE, MEMORY & FPS MONITOR

======================================================================*/

/*==================================================
PERFORMANCE
==================================================*/

Utilities.performance={

    fps:0,

    frames:0,

    last:performance.now(),

    memory:null

};

/*==================================================
FPS
==================================================*/

Utilities.performance.monitor=function(){

    const now=

    performance.now();

    this.frames++;

    if(

        now>=this.last+1000

    ){

        this.fps=

        this.frames;

        this.frames=0;

        this.last=now;

        EVENTS.emit(

            "performance:fps",

            this.fps

        );

    }

    requestAnimationFrame(

        this.monitor.bind(this)

    );

};

/*==================================================
MEMORY
==================================================*/

Utilities.performance.memoryUsage=function(){

    if(

        !performance.memory

    ) return null;

    this.memory={

        used:

        performance.memory

        .usedJSHeapSize,

        total:

        performance.memory

        .totalJSHeapSize,

        limit:

        performance.memory

        .jsHeapSizeLimit

    };

    EVENTS.emit(

        "performance:memory",

        this.memory

    );

};

/*==================================================
DEVICE MEMORY
==================================================*/

Utilities.performance.device=function(){

    return{

        cores:

        navigator.hardwareConcurrency||

        0,

        memory:

        navigator.deviceMemory||

        null,

        online:

        navigator.onLine

    };

};

/*==================================================
NETWORK
==================================================*/

Utilities.performance.connection=function(){

    const connection=

    navigator.connection||

    navigator.mozConnection||

    navigator.webkitConnection;

    if(

        !connection

    ) return null;

    return{

        type:

        connection.effectiveType,

        downlink:

        connection.downlink,

        rtt:

        connection.rtt,

        saveData:

        connection.saveData

    };

};

/*==================================================
PAGE LOAD
==================================================*/

Utilities.performance.pageLoad=function(){

    window.addEventListener(

        "load",

        ()=>{

            const nav=

            performance

            .getEntriesByType(

                "navigation"

            )[0];

            if(!nav) return;

            EVENTS.emit(

                "performance:load",

                nav

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

        Utilities.performance.monitor();

        Utilities.performance.memoryUsage();

        Utilities.performance.pageLoad();

        Log.info(

            "Performance Monitor Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 15.5 — UTILITIES FINALIZATION & GLOBAL API

======================================================================*/

/*==================================================
GLOBAL API
==================================================*/

window.$utils=

Object.freeze({

    uuid:

    Utilities.uuid,

    wait:

    Utilities.wait,

    random:

    Utilities.random,

    clamp:

    Utilities.clamp,

    lerp:

    Utilities.lerp,

    debounce:

    Utilities.debounce,

    throttle:

    Utilities.throttle,

    copy:

    Utilities.copy,

    download:

    Utilities.download,

    storage:

    Utilities.storage,

    session:

    Utilities.session,

    url:

    Utilities.url

});

/*==================================================
PREFERS
==================================================*/

Utilities.preferences=function(){

    const dark=

    window.matchMedia(

        "(prefers-color-scheme: dark)"

    );

    const motion=

    window.matchMedia(

        "(prefers-reduced-motion: reduce)"

    );

    document.documentElement

    .classList.toggle(

        "prefers-dark",

        dark.matches

    );

    document.documentElement

    .classList.toggle(

        "reduced-motion",

        motion.matches

    );

};

/*==================================================
CSS SUPPORT
==================================================*/

Utilities.support=function(){

    document.documentElement

    .classList.toggle(

        "supports-backdrop",

        CSS.supports(

            "backdrop-filter",

            "blur(10px)"

        )

    );

    document.documentElement

    .classList.toggle(

        "supports-grid",

        CSS.supports(

            "display",

            "grid"

        )

    );

};

/*==================================================
DEBUG
==================================================*/

Utilities.debug=function(){

    window.$app={

        modules,

        EVENTS,

        CONFIG,

        Utilities,

        State,

        Log

    };

};

/*==================================================
VERSION
==================================================*/

Utilities.version={

    module:"Utilities",

    version:"1.0.0",

    build:"2026.08",

    author:"Director VISION"

};

/*==================================================
READY
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        Utilities.preferences();

        Utilities.support();

        Utilities.debug();

        Log.info(

            "Utilities Module Complete"

        );

    }

);

/*==================================================
MODULE COMPLETE
==================================================*/

EVENTS.emit(

    "utilities:initialized"

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 16.1 — APPLICATION CONTROLLER

======================================================================*/

const App={

    initialized:false,

    started:false,

    modules:[],

    startTime:performance.now(),

    version:"1.0.0"

};

/*==================================================
COLLECT
==================================================*/

App.collect=function(){

    this.modules=

    Object.values(

        modules

    );

};

/*==================================================
INIT MODULES
==================================================*/

App.initialize=async function(){

    this.collect();

    for(

        const module

        of this.modules

    ){

        if(

            module&&

            typeof module.init===

            "function"

        ){

            try{

                await module.init();

            }

            catch(error){

                console.error(

                    error

                );

            }

        }

    }

};

/*==================================================
READY
==================================================*/

App.ready=function(){

    this.started=true;

    document.documentElement

    .classList.add(

        "app-ready"

    );

    EVENTS.emit(

        "appReady"

    );

};

/*==================================================
LOAD
==================================================*/

App.loaded=function(){

    EVENTS.emit(

        "websiteReady"

    );

};

/*==================================================
BOOT
==================================================*/

App.boot=async function(){

    if(

        this.initialized

    ) return;

    await this.initialize();

    this.ready();

    this.initialized=true;

    Log.success(

        "Application Booted"

    );

};

/*==================================================
WINDOW
==================================================*/

window.addEventListener(

    "load",

    ()=>{

        App.loaded();

    }

);

/*==================================================
DOM
==================================================*/

document.addEventListener(

    "DOMContentLoaded",

    ()=>{

        App.boot();

    }

);

/*==================================================
REGISTER
==================================================*/

window.App=App;
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 16.2 — APPLICATION LIFECYCLE & STATE ENGINE

======================================================================*/

App.state={

    loading:true,

    ready:false,

    visible:true,

    online:navigator.onLine,

    focused:true,

    destroyed:false

};

/*==================================================
READY
==================================================*/

App.setReady=function(){

    this.state.loading=false;

    this.state.ready=true;

    document.documentElement

    .classList.add(

        "is-ready"

    );

    EVENTS.emit(

        "app:ready"

    );

};

/*==================================================
VISIBILITY
==================================================*/

App.visibility=function(){

    document.addEventListener(

        "visibilitychange",

        ()=>{

            this.state.visible=

            !document.hidden;

            EVENTS.emit(

                document.hidden

                ?"app:hidden"

                :"app:visible"

            );

        }

    );

};

/*==================================================
WINDOW
==================================================*/

App.windowState=function(){

    window.addEventListener(

        "focus",

        ()=>{

            this.state.focused=true;

            EVENTS.emit(

                "app:focus"

            );

        }

    );

    window.addEventListener(

        "blur",

        ()=>{

            this.state.focused=false;

            EVENTS.emit(

                "app:blur"

            );

        }

    );

};

/*==================================================
NETWORK
==================================================*/

App.network=function(){

    window.addEventListener(

        "online",

        ()=>{

            this.state.online=true;

            EVENTS.emit(

                "app:online"

            );

        }

    );

    window.addEventListener(

        "offline",

        ()=>{

            this.state.online=false;

            EVENTS.emit(

                "app:offline"

            );

        }

    );

};

/*==================================================
BEFORE UNLOAD
==================================================*/

App.beforeUnload=function(){

    window.addEventListener(

        "beforeunload",

        ()=>{

            EVENTS.emit(

                "app:beforeDestroy"

            );

        }

    );

};

/*==================================================
EVENTS
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        App.setReady();

    }

);

/*==================================================
INIT
==================================================*/

EVENTS.on(

    "appReady",

    ()=>{

        App.visibility();

        App.windowState();

        App.network();

        App.beforeUnload();

        Log.info(

            "Application Lifecycle Ready"

        );

    }

);

/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 16.3 — APPLICATION EVENT BUS & MODULE MANAGER

======================================================================*/

/*==================================================
MODULE STATUS
==================================================*/

App.status={

    total:0,

    loaded:0,

    failed:0

};

/*==================================================
REGISTER
==================================================*/

App.register=function(

    name,

    module

){

    if(

        modules[name]

    ){

        Log.warn(

            name+

            " already registered."

        );

        return;

    }

    modules[name]=

    module;

    this.status.total++;

    EVENTS.emit(

        "module:registered",

        name

    );

};

/*==================================================
START MODULE
==================================================*/

App.startModule=

async function(name){

    const module=

    modules[name];

    if(

        !module||

        typeof module.init!==

        "function"

    ) return;

    try{

        await module.init();

        this.status.loaded++;

        EVENTS.emit(

            "module:loaded",

            name

        );

    }

    catch(error){

        this.status.failed++;

        console.error(

            error

        );

        EVENTS.emit(

            "module:error",

            {

                name,

                error

            }

        );

    }

};

/*==================================================
START ALL
==================================================*/

App.startModules=

async function(){

    const list=

    Object.keys(

        modules

    );

    this.status.total=

    list.length;

    for(

        const name

        of list

    ){

        await this.startModule(

            name

        );

    }

};

/*==================================================
MODULE INFO
==================================================*/

App.info=function(){

    return{

        total:

        this.status.total,

        loaded:

        this.status.loaded,

        failed:

        this.status.failed,

        ready:

        this.state.ready

    };

};

/*==================================================
RESTART
==================================================*/

App.restart=

async function(){

    EVENTS.emit(

        "app:restart"

    );

    this.status.loaded=0;

    this.status.failed=0;

    await this.startModules();

};

/*==================================================
EVENTS
==================================================*/

EVENTS.on(

    "module:error",

    data=>{

        Log.error(

            data.name+

            " failed."

        );

    }

);

EVENTS.on(

    "module:loaded",

    name=>{

        Log.success(

            name+

            " loaded."

        );

    }

);

/*==================================================
READY
==================================================*/

EVENTS.on(

    "appReady",

    ()=>{

        Log.info(

            "Module Manager Ready"

        );

    }

);

/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 16.4 — APPLICATION ERROR HANDLER & DEBUG SYSTEM

======================================================================*/

/*==================================================
ERROR STORE
==================================================*/

App.errors=[];

/*==================================================
LOG ERROR
==================================================*/

App.logError=function(

    error,

    source="Application"

){

    const entry={

        id:

        Utilities.uuid(),

        source,

        message:

        error?.message||

        String(error),

        stack:

        error?.stack||

        null,

        time:

        new Date()

        .toISOString()

    };

    this.errors.push(

        entry

    );

    console.error(

        `[${source}]`,

        error

    );

    EVENTS.emit(

        "app:error",

        entry

    );

};

/*==================================================
WINDOW ERROR
==================================================*/

App.captureErrors=function(){

    window.addEventListener(

        "error",

        event=>{

            this.logError(

                event.error||

                event.message,

                "Window"

            );

        }

    );

    window.addEventListener(

        "unhandledrejection",

        event=>{

            this.logError(

                event.reason,

                "Promise"

            );

        }

    );

};

/*==================================================
DEBUG PANEL
==================================================*/

App.debug={

    enabled:false

};

App.toggleDebug=function(){

    this.debug.enabled=

    !this.debug.enabled;

    document.documentElement

    .classList.toggle(

        "debug-mode",

        this.debug.enabled

    );

};

/*==================================================
SHORTCUT
==================================================*/

App.shortcuts=function(){

    window.addEventListener(

        "keydown",

        event=>{

            if(

                event.ctrlKey&&

                event.shiftKey&&

                event.key==="D"

            ){

                this.toggleDebug();

            }

        }

    );

};

/*==================================================
REPORT
==================================================*/

App.report=function(){

    return{

        version:

        this.version,

        uptime:

        performance.now()

        -this.startTime,

        modules:

        this.info(),

        errors:

        this.errors

    };

};

/*==================================================
EVENTS
==================================================*/

EVENTS.on(

    "app:error",

    error=>{

        Log.error(

            error.message

        );

    }

);

/*==================================================
READY
==================================================*/

EVENTS.on(

    "appReady",

    ()=>{

        App.captureErrors();

        App.shortcuts();

        Log.info(

            "Error Handler Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 16.5 — APPLICATION FINALIZATION & SHUTDOWN ENGINE

======================================================================*/

/*==================================================
UPTIME
==================================================*/

App.uptime=function(){

    return Math.floor(

        (

            performance.now()-

            this.startTime

        )/1000

    );

};

/*==================================================
HEALTH
==================================================*/

App.health=function(){

    return{

        version:

        this.version,

        initialized:

        this.initialized,

        started:

        this.started,

        ready:

        this.state.ready,

        modules:

        this.info(),

        uptime:

        this.uptime(),

        online:

        this.state.online,

        visible:

        this.state.visible,

        focused:

        this.state.focused,

        errors:

        this.errors.length

    };

};

/*==================================================
DESTROY MODULES
==================================================*/

App.destroyModules=function(){

    Object.values(

        modules

    ).forEach(

        module=>{

            if(

                module&&

                typeof module.destroy===

                "function"

            ){

                try{

                    module.destroy();

                }

                catch(error){

                    this.logError(

                        error,

                        "Destroy"

                    );

                }

            }

        }

    );

};

/*==================================================
SHUTDOWN
==================================================*/

App.shutdown=function(){

    if(

        this.state.destroyed

    ) return;

    EVENTS.emit(

        "app:shutdown"

    );

    this.destroyModules();

    this.state.destroyed=true;

    Log.warn(

        "Application Shutdown"

    );

};

/*==================================================
FREE MEMORY
==================================================*/

App.cleanup=function(){

    this.errors.length=0;

    this.modules.length=0;

};

/*==================================================
VERSION
==================================================*/

App.release={

    name:

    "Director VISION Portfolio",

    edition:

    "Luxury Cinematic",

    version:

    "1.0.0",

    build:

    "2026.08",

    author:

    "Director VISION"

};

/*==================================================
EXPORT
==================================================*/

window.$app=

Object.freeze({

    app:App,

    modules,

    EVENTS,

    CONFIG,

    Utilities,

    State,

    Log

});

/*==================================================
EVENTS
==================================================*/

window.addEventListener(

    "beforeunload",

    ()=>{

        App.shutdown();

        App.cleanup();

    }

);

/*==================================================
APPLICATION COMPLETE
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        Log.success(

            "Director VISION Portfolio Ready"

        );

        console.table(

            App.health()

        );

    }

);

/*==================================================
SCRIPT.JS COMPLETE
==================================================*/

Log.success(

`
═══════════════════════════════════════════════

 Director VISION
 Luxury Cinematic Portfolio

 SCRIPT.JS BUILD COMPLETE

 Version : 1.0.0
 Build   : 2026.08

 Modules Loaded

 ✓ Core
 ✓ Utilities
 ✓ Events
 ✓ State
 ✓ Loader
 ✓ Lenis
 ✓ Cursor
 ✓ Navigation
 ✓ Hero
 ✓ Portfolio
 ✓ About
 ✓ Services
 ✓ Testimonials
 ✓ Contact
 ✓ Footer
 ✓ App Controller

═══════════════════════════════════════════════
`
);



