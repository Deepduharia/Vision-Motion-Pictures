/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SELF-HEALING.JS
    PART 01 — CORE SELF-HEALING ENGINE

======================================================================*/

const SelfHealing={

    initialized:false,

    enabled:true,

    version:"1.0.0",

    build:"2026.08",

    modules:new Map(),

    errors:[],

    warnings:[],

    recoveries:[],

    logs:[],

    statistics:{

        errors:0,

        recovered:0,

        restarted:0,

        retries:0,

        warnings:0

    },

    settings:{

        autoRecover:true,

        autoRestart:true,

        autoRetry:true,

        developerMode:true,

        logConsole:true,

        maxLogs:1000,

        maxErrors:500,

        heartbeat:1000

    }

};

/*==================================================
REGISTER MODULE
==================================================*/

SelfHealing.register=

function(

    name,

    module

){

    this.modules.set(

        name,

        {

            name,

            module,

            healthy:true,

            restarted:0,

            failures:0,

            lastCheck:

            Date.now()

        }

    );

};

/*==================================================
GET MODULE
==================================================*/

SelfHealing.module=

function(

    name

){

    return this.modules.get(

        name

    );

};

/*==================================================
REGISTER ALL
==================================================*/

SelfHealing.registerDefaults=

function(){

    [

        "Config",

        "Utilities",

        "EVENTS",

        "Loader",

        "Navigation",

        "Scroll",

        "Animations",

        "Effects",

        "ThreeEngine",

        "ShaderEngine",

        "AudioEngine",

        "AI",

        "Admin",

        "API"

    ]

    .forEach(

        name=>{

            this.register(

                name,

                window[name]

            );

        }

    );

};

/*==================================================
LOG
==================================================*/

SelfHealing.log=

function(

    type,

    message,

    data={}

){

    const item={

        id:

        Utilities

        ?.uuid?.()||

        crypto

        .randomUUID(),

        type,

        message,

        data,

        time:

        Date.now()

    };

    this.logs.push(

        item

    );

    if(

        this.logs.length>

        this.settings

        .maxLogs

    ){

        this.logs.shift();

    }

    if(

        this.settings

        .logConsole

    ){

        console.log(

            `[SELF] ${

                type

            }`,

            message,

            data

        );

    }

    EVENTS?.emit?.(

        "self:log",

        item

    );

};

/*==================================================
WARNING
==================================================*/

SelfHealing.warning=

function(

    message,

    data={}

){

    this.statistics

    .warnings++;

    this.warnings.push({

        message,

        data,

        time:

        Date.now()

    });

    this.log(

        "warning",

        message,

        data

    );

};

/*==================================================
ERROR
==================================================*/

SelfHealing.error=

function(

    error

){

    this.statistics

    .errors++;

    this.errors.push(

        error

    );

    if(

        this.errors.length>

        this.settings

        .maxErrors

    ){

        this.errors.shift();

    }

    this.log(

        "error",

        error.message||

        "Unknown Error",

        error

    );

    EVENTS?.emit?.(

        "self:error",

        error

    );

};

/*==================================================
RECOVERY
==================================================*/

SelfHealing.recovered=

function(

    module,

    reason

){

    this.statistics

    .recovered++;

    this.recoveries.push({

        module,

        reason,

        time:

        Date.now()

    });

    this.log(

        "recovered",

        module,

        {

            reason

        }

    );

};

/*==================================================
STATUS
==================================================*/

SelfHealing.status=

function(){

    return{

        initialized:

        this.initialized,

        enabled:

        this.enabled,

        modules:

        this.modules.size,

        errors:

        this.statistics

        .errors,

        recovered:

        this.statistics

        .recovered,

        warnings:

        this.statistics

        .warnings,

        logs:

        this.logs.length

    };

};

/*==================================================
INIT
==================================================*/

SelfHealing.init=

function(){

    this.initialized=true;

    this.registerDefaults();

    this.log(

        "system",

        "Self-Healing Started"

    );

};

/*==================================================
EXPORT
==================================================*/

window.SelfHealing=

SelfHealing;

window.$heal=

Object.freeze({

    engine:

    SelfHealing,

    status:

    ()=>SelfHealing

    .status(),

    logs:

    ()=>SelfHealing

    .logs,

    errors:

    ()=>SelfHealing

    .errors

});

/*==================================================
READY
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        SelfHealing

        .init();

        Log.success(

            "Self-Healing Core Ready"

        );

    }

);

/*==================================================
REGISTER
==================================================*/

registerModule(

    "SelfHealing",

    SelfHealing

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SELF-HEALING.JS
    PART 02 — GLOBAL ERROR HANDLER & RECOVERY ENGINE

======================================================================*/

/*==================================================
STATE
==================================================*/

SelfHealing.runtime={

    active:true,

    lastError:null,

    lastPromise:null,

    lastScript:null,

    totalCrashes:0,

    recovered:0

};

/*==================================================
BUILD ERROR
==================================================*/

SelfHealing.buildError=

function(

    type,

    payload={}

){

    return{

        id:

        Utilities?.uuid?.()||

        crypto.randomUUID(),

        type,

        timestamp:

        Date.now(),

        url:

        location.href,

        userAgent:

        navigator.userAgent,

        ...payload

    };

};

/*==================================================
GLOBAL ERROR
==================================================*/

window.onerror=

function(

    message,

    source,

    line,

    column,

    error

){

    const payload=

    SelfHealing

    .buildError(

        "RuntimeError",

        {

            message,

            source,

            line,

            column,

            stack:

            error?.stack||

            null

        }

    );

    SelfHealing

    .runtime

    .lastError=

    payload;

    SelfHealing

    .runtime

    .totalCrashes++;

    SelfHealing

    .error(

        payload

    );

    SelfHealing

    .recover(

        payload

    );

    return true;

};

/*==================================================
PROMISE ERROR
==================================================*/

window.addEventListener(

    "unhandledrejection",

    event=>{

        const payload=

        SelfHealing

        .buildError(

            "PromiseError",

            {

                reason:

                event.reason,

                stack:

                event.reason?.stack||

                null

            }

        );

        SelfHealing

        .runtime

        .lastPromise=

        payload;

        SelfHealing

        .error(

            payload

        );

        SelfHealing

        .recover(

            payload

        );

        event.preventDefault();

    }

);

/*==================================================
RESOURCE ERROR
==================================================*/

window.addEventListener(

    "error",

    event=>{

        if(

            event.target===window

        ) return;

        const payload=

        SelfHealing

        .buildError(

            "ResourceError",

            {

                tag:

                event.target

                ?.tagName,

                source:

                event.target

                ?.src||

                event.target

                ?.href||

                ""

            }

        );

        SelfHealing

        .runtime

        .lastScript=

        payload;

        SelfHealing

        .warning(

            "Resource Failed",

            payload

        );

        SelfHealing

        .recover(

            payload

        );

    },

    true

);

/*==================================================
SAFE EXECUTE
==================================================*/

SelfHealing.safe=

async function(

    name,

    callback

){

    try{

        return await

        callback();

    }

    catch(

        error

    ){

        const payload=

        SelfHealing

        .buildError(

            "SafeExecution",

            {

                module:

                name,

                message:

                error.message,

                stack:

                error.stack

            }

        );

        SelfHealing

        .error(

            payload

        );

        SelfHealing

        .recover(

            payload

        );

        return null;

    }

};

/*==================================================
RECOVER
==================================================*/

SelfHealing.recover=

function(

    payload

){

    if(

        !this.settings

        .autoRecover

    ) return;

    this.log(

        "recover",

        payload.type,

        payload

    );

    EVENTS.emit(

        "self:recover",

        payload

    );

};

/*==================================================
IGNORE
==================================================*/

SelfHealing.ignore=

function(

    pattern

){

    if(

        !this.ignoreList

    ){

        this.ignoreList=[];

    }

    this.ignoreList

    .push(

        pattern

    );

};

/*==================================================
FILTER
==================================================*/

SelfHealing.shouldIgnore=

function(

    message

){

    return(

        this.ignoreList||

        []

    )

    .some(

        pattern=>

        message

        ?.includes(

            pattern

        )

    );

};

/*==================================================
READY
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        Log.success(

            "Global Error Handler Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SELF-HEALING.JS
    PART 03 — SAFE MODULE LOADER & AUTO RESTART ENGINE

======================================================================*/

/*==================================================
MODULE STATE
==================================================*/

SelfHealing.loader={

    loading:false,

    restarting:false,

    retries:new Map(),

    maxRetries:3,

    restartDelay:1500,

    failed:new Set()

};

/*==================================================
LOAD MODULE
==================================================*/

SelfHealing.load=

async function(

    name,

    callback

){

    this.loader

    .loading=true;

    try{

        await callback();

        const module=

        this.module(

            name

        );

        if(

            module

        ){

            module.healthy=true;

            module.failures=0;

            module.lastCheck=

            Date.now();

        }

        this.loader

        .failed.delete(

            name

        );

        this.log(

            "module",

            `${name} Loaded`

        );

        EVENTS.emit(

            "self:module:loaded",

            name

        );

    }

    catch(

        error

    ){

        this.failModule(

            name,

            error

        );

    }

    finally{

        this.loader

        .loading=false;

    }

};

/*==================================================
FAIL MODULE
==================================================*/

SelfHealing.failModule=

function(

    name,

    error

){

    this.loader

    .failed.add(

        name

    );

    const module=

    this.module(

        name

    );

    if(

        module

    ){

        module.healthy=false;

        module.failures++;

    }

    this.error({

        module:name,

        message:

        error.message,

        stack:

        error.stack

    });

    EVENTS.emit(

        "self:module:failed",

        {

            name,

            error

        }

    );

    this.restart(

        name

    );

};

/*==================================================
RESTART MODULE
==================================================*/

SelfHealing.restart=

async function(

    name

){

    if(

        !this.settings

        .autoRestart

    ) return;

    const retries=

    this.loader

    .retries.get(

        name

    )||0;

    if(

        retries>=

        this.loader

        .maxRetries

    ){

        this.warning(

            `${name} Restart Limit Reached`

        );

        EVENTS.emit(

            "self:module:dead",

            name

        );

        return;

    }

    this.loader

    .retries.set(

        name,

        retries+1

    );

    this.statistics

    .restarted++;

    this.loader

    .restarting=true;

    this.log(

        "restart",

        `${name} Restarting`

    );

    await new Promise(

        resolve=>

        setTimeout(

            resolve,

            this.loader

            .restartDelay

        )

    );

    try{

        const module=

        window[name];

        if(

            module&&

            typeof

            module.init===

            "function"

        ){

            await module.init();

        }

        const state=

        this.module(

            name

        );

        if(

            state

        ){

            state.healthy=true;

            state.restarted++;

            state.lastCheck=

            Date.now();

        }

        this.loader

        .failed.delete(

            name

        );

        this.recovered(

            name,

            "Restart Success"

        );

        EVENTS.emit(

            "self:module:recovered",

            name

        );

    }

    catch(

        error

    ){

        this.failModule(

            name,

            error

        );

    }

    finally{

        this.loader

        .restarting=false;

    }

};

/*==================================================
RESTART ALL
==================================================*/

SelfHealing.restartAll=

async function(){

    for(

        const[

            name

        ]of

        this.modules

    ){

        await this.restart(

            name

        );

    }

};

/*==================================================
RESET RETRIES
==================================================*/

SelfHealing.resetRetries=

function(

    name

){

    if(

        name

    ){

        this.loader

        .retries.delete(

            name

        );

        return;

    }

    this.loader

    .retries.clear();

};

/*==================================================
FAILED MODULES
==================================================*/

SelfHealing.failed=

function(){

    return[

        ...this.loader

        .failed

    ];

};

/*==================================================
MODULE HEALTH
==================================================*/

SelfHealing.health=

function(

    name

){

    const module=

    this.module(

        name

    );

    if(

        !module

        ) return null;

    return{

        healthy:

        module.healthy,

        failures:

        module.failures,

        restarted:

        module.restarted,

        lastCheck:

        module.lastCheck

    };

};

/*==================================================
AUTO RECOVERY
==================================================*/

EVENTS.on(

    "self:recover",

    payload=>{

        if(

            payload.module

        ){

            SelfHealing

            .restart(

                payload.module

            );

        }

    }

);

/*==================================================
READY
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        Log.success(

            "Safe Module Loader Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SELF-HEALING.JS
    PART 04 — WATCHDOG ENGINE & LIVE HEALTH MONITOR

======================================================================*/

/*==================================================
WATCHDOG
==================================================*/

SelfHealing.watchdog={

    running:false,

    timer:null,

    interval:1000,

    heartbeat:0,

    fps:0,

    lastFrame:

    performance.now()

};

/*==================================================
START
==================================================*/

SelfHealing.startWatchdog=

function(){

    if(

        this.watchdog

        .running

    ) return;

    this.watchdog

    .running=true;

    this.watchdog.timer=

    setInterval(

        ()=>{

            this.checkModules();

            this.checkMemory();

            this.checkFPS();

            this.checkNetwork();

            this.heartbeat();

        },

        this.watchdog

        .interval

    );

    this.log(

        "watchdog",

        "Started"

    );

};

/*==================================================
STOP
==================================================*/

SelfHealing.stopWatchdog=

function(){

    clearInterval(

        this.watchdog

        .timer

    );

    this.watchdog

    .running=false;

};

/*==================================================
HEARTBEAT
==================================================*/

SelfHealing.heartbeat=

function(){

    this.watchdog

    .heartbeat=

    Date.now();

    EVENTS.emit(

        "self:heartbeat",

        this.watchdog

        .heartbeat

    );

};

/*==================================================
CHECK MODULES
==================================================*/

SelfHealing.checkModules=

function(){

    this.modules.forEach(

        module=>{

            const target=

            module.module;

            if(

                !target

            ){

                module.healthy=

                false;

                this.warning(

                    `${

                        module.name

                    } Missing`

                );

                return;

            }

            if(

                target.init&&

                typeof

                target.init!==

                "function"

            ){

                module.healthy=

                false;

                this.warning(

                    `${

                        module.name

                    } Invalid`

                );

                return;

            }

            module.lastCheck=

            Date.now();

            module.healthy=true;

        }

    );

};

/*==================================================
CHECK FPS
==================================================*/

SelfHealing.checkFPS=

function(){

    const now=

    performance.now();

    const delta=

    now-

    this.watchdog

    .lastFrame;

    this.watchdog

    .fps=

    Math.round(

        1000/

        delta

    );

    this.watchdog

    .lastFrame=

    now;

    if(

        this.watchdog

        .fps<25

    ){

        this.warning(

            "Low FPS",

            {

                fps:

                this.watchdog

                .fps

            }

        );

        EVENTS.emit(

            "self:fps:low",

            this.watchdog

            .fps

        );

    }

};

/*==================================================
CHECK MEMORY
==================================================*/

SelfHealing.checkMemory=

function(){

    if(

        !performance

        .memory

    ) return;

    const memory=

    performance

    .memory;

    const used=

    Math.round(

        memory

        .usedJSHeapSize/

        1048576

    );

    const limit=

    Math.round(

        memory

        .jsHeapSizeLimit/

        1048576

    );

    if(

        used>

        limit*.80

    ){

        this.warning(

            "High Memory Usage",

            {

                used,

                limit

            }

        );

        EVENTS.emit(

            "self:memory:high",

            {

                used,

                limit

            }

        );

    }

};

/*==================================================
CHECK NETWORK
==================================================*/

SelfHealing.checkNetwork=

function(){

    if(

        navigator.onLine

    ) return;

    this.warning(

        "Network Offline"

    );

    EVENTS.emit(

        "self:offline"

    );

};

/*==================================================
STATUS
==================================================*/

SelfHealing.watchdogStatus=

function(){

    return{

        running:

        this.watchdog

        .running,

        fps:

        this.watchdog

        .fps,

        heartbeat:

        this.watchdog

        .heartbeat,

        modules:

        this.modules

        .size

    };

};

/*==================================================
AUTO START
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        SelfHealing

        .startWatchdog();

    }

);

/*==================================================
AUTO STOP
==================================================*/

window.addEventListener(

    "beforeunload",

    ()=>{

        SelfHealing

        .stopWatchdog();

    }

);

/*==================================================
READY
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        Log.success(

            "Watchdog Engine Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SELF-HEALING.JS
    PART 05 — PERFORMANCE PROFILER & MEMORY LEAK DETECTOR

======================================================================*/

/*==================================================
PERFORMANCE
==================================================*/

SelfHealing.performance={

    enabled:true,

    started:Date.now(),

    fpsHistory:[],

    memoryHistory:[],

    cpuHistory:[],

    longTasks:[],

    maxSamples:300

};

/*==================================================
RECORD FPS
==================================================*/

SelfHealing.recordFPS=

function(){

    const fps=

    this.watchdog

    .fps;

    this.performance

    .fpsHistory.push({

        value:fps,

        time:Date.now()

    });

    if(

        this.performance

        .fpsHistory.length>

        this.performance

        .maxSamples

    ){

        this.performance

        .fpsHistory.shift();

    }

};

/*==================================================
RECORD MEMORY
==================================================*/

SelfHealing.recordMemory=

function(){

    if(

        !performance.memory

    ) return;

    const used=

    performance.memory

    .usedJSHeapSize/

    1048576;

    this.performance

    .memoryHistory.push({

        value:used,

        time:Date.now()

    });

    if(

        this.performance

        .memoryHistory.length>

        this.performance

        .maxSamples

    ){

        this.performance

        .memoryHistory.shift();

    }

};

/*==================================================
MEMORY LEAK
==================================================*/

SelfHealing.detectMemoryLeak=

function(){

    const history=

    this.performance

    .memoryHistory;

    if(

        history.length<20

    ) return false;

    const first=

    history[0].value;

    const last=

    history[

        history.length-1

    ].value;

    if(

        last>

        first*1.5

    ){

        this.warning(

            "Possible Memory Leak",

            {

                start:first,

                current:last

            }

        );

        EVENTS.emit(

            "self:memory:leak",

            {

                start:first,

                current:last

            }

        );

        return true;

    }

    return false;

};

/*==================================================
LONG TASK
==================================================*/

SelfHealing.detectLongTask=

function(){

    if(

        !window

        .PerformanceObserver

    ) return;

    const observer=

    new PerformanceObserver(

        list=>{

            list

            .getEntries()

            .forEach(

                entry=>{

                    this.performance

                    .longTasks

                    .push(

                        entry

                    );

                    if(

                        entry.duration>

                        50

                    ){

                        this.warning(

                            "Long Task",

                            {

                                duration:

                                entry.duration

                            }

                        );

                    }

                }

            );

        }

    );

    observer.observe({

        entryTypes:[

            "longtask"

        ]

    });

};

/*==================================================
AVERAGE FPS
==================================================*/

SelfHealing.averageFPS=

function(){

    const history=

    this.performance

    .fpsHistory;

    if(

        !history.length

    ) return 0;

    return Math.round(

        history.reduce(

            (

                total,

                item

            )=>

            total+

            item.value,

            0

        )/

        history.length

    );

};

/*==================================================
AVERAGE MEMORY
==================================================*/

SelfHealing.averageMemory=

function(){

    const history=

    this.performance

    .memoryHistory;

    if(

        !history.length

    ) return 0;

    return Math.round(

        history.reduce(

            (

                total,

                item

            )=>

            total+

            item.value,

            0

        )/

        history.length

    );

};

/*==================================================
PROFILE
==================================================*/

SelfHealing.profile=

function(){

    return{

        uptime:

        Math.round(

            (

                Date.now()-

                this.performance

                .started

            )/

            1000

        ),

        fps:

        this.averageFPS(),

        memory:

        this.averageMemory(),

        longTasks:

        this.performance

        .longTasks.length,

        warnings:

        this.statistics

        .warnings,

        errors:

        this.statistics

        .errors

    };

};

/*==================================================
AUTO MONITOR
==================================================*/

EVENTS.on(

    "self:heartbeat",

    ()=>{

        SelfHealing

        .recordFPS();

        SelfHealing

        .recordMemory();

        SelfHealing

        .detectMemoryLeak();

    }

);

/*==================================================
READY
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        SelfHealing

        .detectLongTask();

        Log.success(

            "Performance Profiler Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SELF-HEALING.JS
    PART 06 — NETWORK RECOVERY & API SELF-REPAIR ENGINE

======================================================================*/

/*==================================================
NETWORK
==================================================*/

SelfHealing.network={

    online:

    navigator.onLine,

    reconnecting:false,

    retries:0,

    maxRetries:10,

    retryDelay:3000,

    lastOnline:

    Date.now()

};

/*==================================================
ONLINE
==================================================*/

SelfHealing.isOnline=

function(){

    return navigator

    .onLine;

};

/*==================================================
OFFLINE
==================================================*/

SelfHealing.offline=

function(){

    this.network

    .online=false;

    this.warning(

        "Internet Connection Lost"

    );

    EVENTS.emit(

        "network:offline"

    );

};

/*==================================================
ONLINE EVENT
==================================================*/

SelfHealing.online=

function(){

    this.network

    .online=true;

    this.network

    .lastOnline=

    Date.now();

    this.network

    .retries=0;

    this.log(

        "network",

        "Connection Restored"

    );

    EVENTS.emit(

        "network:online"

    );

    this.restoreNetwork();

};

/*==================================================
RESTORE
==================================================*/

SelfHealing.restoreNetwork=

async function(){

    if(

        this.network

        .reconnecting

    ) return;

    this.network

    .reconnecting=true;

    try{

        if(

            window.API

        ){

            await API.sync?.();

            await API

            .processQueue?.();

        }

        if(

            window.Admin&&

            Admin

            .authenticated

        ){

            await Admin

            .restoreSession?.();

        }

        this.recovered(

            "Network",

            "Internet Restored"

        );

    }

    catch(

        error

    ){

        this.error({

            module:

            "Network",

            message:

            error.message

        });

    }

    finally{

        this.network

        .reconnecting=false;

    }

};

/*==================================================
PING
==================================================*/

SelfHealing.ping=

async function(

    url="/"

){

    try{

        const controller=

        new AbortController();

        const timeout=

        setTimeout(

            ()=>{

                controller.abort();

            },

            5000

        );

        await fetch(

            url,

            {

                method:

                "HEAD",

                cache:

                "no-store",

                signal:

                controller.signal

            }

        );

        clearTimeout(

            timeout

        );

        return true;

    }

    catch{

        return false;

    }

};

/*==================================================
AUTO RETRY
==================================================*/

SelfHealing.retryNetwork=

async function(){

    if(

        this.network

        .reconnecting

    ) return;

    while(

        !navigator.onLine&&

        this.network

        .retries<

        this.network

        .maxRetries

    ){

        this.network

        .retries++;

        this.log(

            "network",

            `Reconnect ${

                this.network

                .retries

            }`

        );

        await new Promise(

            resolve=>

            setTimeout(

                resolve,

                this.network

                .retryDelay

            )

        );

    }

};

/*==================================================
API HEALTH
==================================================*/

SelfHealing.apiHealth=

async function(){

    if(

        !window.API

    ) return;

    try{

        await API.get(

            "health"

        );

        EVENTS.emit(

            "api:healthy"

        );

    }

    catch(

        error

    ){

        this.warning(

            "API Offline"

        );

        EVENTS.emit(

            "api:down"

        );

    }

};

/*==================================================
HEARTBEAT
==================================================*/

EVENTS.on(

    "self:heartbeat",

    ()=>{

        SelfHealing

        .apiHealth();

    }

);

/*==================================================
NETWORK EVENTS
==================================================*/

window.addEventListener(

    "offline",

    ()=>{

        SelfHealing

        .offline();

    }

);

window.addEventListener(

    "online",

    ()=>{

        SelfHealing

        .online();

    }

);

/*==================================================
READY
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        Log.success(

            "Network Recovery Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SELF-HEALING.JS
    PART 07 — WEBGL, THREE.JS & GPU RECOVERY ENGINE

======================================================================*/

/*==================================================
GPU STATE
==================================================*/

SelfHealing.gpu={

    renderer:null,

    canvas:null,

    context:null,

    lost:false,

    recovering:false,

    recoveries:0,

    maxRecoveries:5

};

/*==================================================
REGISTER
==================================================*/

SelfHealing.registerRenderer=

function(

    renderer

){

    if(

        !renderer

    ) return;

    this.gpu.renderer=

    renderer;

    this.gpu.canvas=

    renderer.domElement;

    this.gpu.context=

    renderer

    .getContext();

    this.listenContext();

};

/*==================================================
CONTEXT EVENTS
==================================================*/

SelfHealing.listenContext=

function(){

    if(

        !this.gpu

        .canvas

    ) return;

    this.gpu.canvas

    .addEventListener(

        "webglcontextlost",

        event=>{

            event.preventDefault();

            this.gpu.lost=true;

            this.warning(

                "WebGL Context Lost"

            );

            EVENTS.emit(

                "gpu:lost"

            );

            this.restoreGPU();

        },

        false

    );

    this.gpu.canvas

    .addEventListener(

        "webglcontextrestored",

        ()=>{

            this.gpu.lost=false;

            this.recovered(

                "GPU",

                "Context Restored"

            );

            EVENTS.emit(

                "gpu:restored"

            );

        },

        false

    );

};

/*==================================================
RESTORE GPU
==================================================*/

SelfHealing.restoreGPU=

async function(){

    if(

        this.gpu

        .recovering

    ) return;

    if(

        this.gpu

        .recoveries>=

        this.gpu

        .maxRecoveries

    ){

        this.warning(

            "GPU Recovery Limit"

        );

        return;

    }

    this.gpu

    .recovering=true;

    this.gpu

    .recoveries++;

    try{

        if(

            window

            .ThreeEngine

        ){

            ThreeEngine

            .dispose?.();

            await ThreeEngine

            .init?.();

        }

        if(

            window

            .ShaderEngine

        ){

            ShaderEngine

            .destroy?.();

            ShaderEngine

            .updateMaterials?.();

        }

        EVENTS.emit(

            "gpu:recovered"

        );

        this.recovered(

            "ThreeJS",

            "Renderer Restarted"

        );

    }

    catch(

        error

    ){

        this.error({

            module:

            "GPU",

            message:

            error.message,

            stack:

            error.stack

        });

    }

    finally{

        this.gpu

        .recovering=false;

    }

};

/*==================================================
TEXTURE CLEANUP
==================================================*/

SelfHealing.releaseTextures=

function(){

    if(

        !window

        .ThreeEngine

    ) return;

    ThreeEngine.scene

    ?.traverse(

        object=>{

            if(

                object.material

            ){

                const materials=

                Array.isArray(

                    object.material

                )

                ?object.material

                :[

                    object.material

                ];

                materials.forEach(

                    material=>{

                        Object.keys(

                            material

                        )

                        .forEach(

                            key=>{

                                const value=

                                material[

                                    key

                                ];

                                if(

                                    value&&

                                    value

                                    .isTexture

                                ){

                                    value

                                    .dispose();

                                }

                            }

                        );

                    }

                );

            }

        }

    );

};

/*==================================================
DISPOSE SCENE
==================================================*/

SelfHealing.disposeScene=

function(){

    if(

        !window

        .ThreeEngine

    ) return;

    ThreeEngine.scene

    ?.traverse(

        object=>{

            object.geometry

            ?.dispose?.();

            if(

                object.material

            ){

                const materials=

                Array.isArray(

                    object.material

                )

                ?object.material

                :[

                    object.material

                ];

                materials.forEach(

                    material=>

                    material.dispose?.()

                );

            }

        }

    );

};

/*==================================================
GPU MEMORY
==================================================*/

SelfHealing.gpuMemory=

function(){

    const renderer=

    this.gpu

    .renderer;

    if(

        !renderer

    ) return null;

    return{

        textures:

        renderer.info

        .memory

        .textures,

        geometries:

        renderer.info

        .memory

        .geometries,

        programs:

        renderer.info

        .programs

        ?.length||

        0,

        calls:

        renderer.info

        .render.calls,

        triangles:

        renderer.info

        .render

        .triangles

    };

};

/*==================================================
GPU HEALTH
==================================================*/

SelfHealing.checkGPU=

function(){

    if(

        !this.gpu

        .renderer

    ) return;

    const info=

    this.gpuMemory();

    if(

        info&&

        info.textures>

        500

    ){

        this.warning(

            "GPU Texture Leak",

            info

        );

    }

};

/*==================================================
AUTO CHECK
==================================================*/

EVENTS.on(

    "self:heartbeat",

    ()=>{

        SelfHealing

        .checkGPU();

    }

);

/*==================================================
AUTO REGISTER
==================================================*/

EVENTS.on(

    "three:initialized",

    ()=>{

        if(

            window

            .ThreeEngine

            ?.renderer

        ){

            SelfHealing

            .registerRenderer(

                ThreeEngine

                .renderer

            );

        }

    }

);

/*==================================================
READY
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        Log.success(

            "GPU Recovery Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SELF-HEALING.JS
    PART 08 — AUDIO, AI, API & DATABASE RECOVERY ENGINE

======================================================================*/

/*==================================================
SERVICES
==================================================*/

SelfHealing.services={

    audio:true,

    ai:true,

    api:true,

    admin:true,

    database:true,

    repairing:false

};

/*==================================================
AUDIO
==================================================*/

SelfHealing.restoreAudio=

async function(){

    if(

        !window.AudioEngine

    ) return;

    try{

        AudioEngine.stop?.();

        AudioEngine.destroy?.();

        await AudioEngine.init?.();

        this.recovered(

            "Audio",

            "Restart Success"

        );

        EVENTS.emit(

            "audio:recovered"

        );

    }

    catch(

        error

    ){

        this.error({

            module:

            "Audio",

            message:

            error.message,

            stack:

            error.stack

        });

    }

};

/*==================================================
AI
==================================================*/

SelfHealing.restoreAI=

async function(){

    if(

        !window.AI

    ) return;

    try{

        AI.destroy?.();

        await AI.init?.();

        this.recovered(

            "AI",

            "Restart Success"

        );

        EVENTS.emit(

            "ai:recovered"

        );

    }

    catch(

        error

    ){

        this.error({

            module:

            "AI",

            message:

            error.message

        });

    }

};

/*==================================================
API
==================================================*/

SelfHealing.restoreAPI=

async function(){

    if(

        !window.API

    ) return;

    try{

        API.clearCache?.();

        await API.sync?.();

        await API.processQueue?.();

        this.recovered(

            "API",

            "Connection Restored"

        );

        EVENTS.emit(

            "api:recovered"

        );

    }

    catch(

        error

    ){

        this.error({

            module:

            "API",

            message:

            error.message

        });

    }

};

/*==================================================
ADMIN
==================================================*/

SelfHealing.restoreAdmin=

async function(){

    if(

        !window.Admin

    ) return;

    try{

        if(

            Admin

            .authenticated

        ){

            await Admin

            .restoreSession?.();

        }

        this.recovered(

            "Admin",

            "Session Restored"

        );

    }

    catch(

        error

    ){

        this.error({

            module:

            "Admin",

            message:

            error.message

        });

    }

};

/*==================================================
DATABASE
==================================================*/

SelfHealing.restoreDatabase=

async function(){

    if(

        !window.Database

    ) return;

    try{

        await Database

        .connect?.();

        await Database

        .sync?.();

        this.recovered(

            "Database",

            "Connection Restored"

        );

        EVENTS.emit(

            "database:recovered"

        );

    }

    catch(

        error

    ){

        this.error({

            module:

            "Database",

            message:

            error.message

        });

    }

};

/*==================================================
RESTORE ALL
==================================================*/

SelfHealing.restoreServices=

async function(){

    if(

        this.services

        .repairing

    ) return;

    this.services

    .repairing=true;

    await this.restoreAudio();

    await this.restoreAI();

    await this.restoreAPI();

    await this.restoreAdmin();

    await this.restoreDatabase();

    this.services

    .repairing=false;

};

/*==================================================
SERVICE HEALTH
==================================================*/

SelfHealing.checkServices=

function(){

    if(

        window.AudioEngine&&

        !AudioEngine.context

    ){

        this.restoreAudio();

    }

    if(

        window.API&&

        !navigator.onLine

    ){

        this.warning(

            "API Waiting Network"

        );

    }

    if(

        window.Admin&&

        Admin.authenticated&&

        !Admin.token

    ){

        this.restoreAdmin();

    }

};

/*==================================================
AUTO CHECK
==================================================*/

EVENTS.on(

    "self:heartbeat",

    ()=>{

        SelfHealing

        .checkServices();

    }

);

/*==================================================
AUTO RESTORE
==================================================*/

EVENTS.on(

    "network:online",

    ()=>{

        SelfHealing

        .restoreServices();

    }

);

/*==================================================
READY
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        Log.success(

            "Service Recovery Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SELF-HEALING.JS
    PART 09 — DEVELOPER DASHBOARD, LIVE LOGGER &
               AI DEBUG ENGINE

======================================================================*/

/*==================================================
DASHBOARD
==================================================*/

SelfHealing.dashboard={

    visible:false,

    element:null,

    refreshRate:500,

    timer:null

};

/*==================================================
CREATE
==================================================*/

SelfHealing.createDashboard=

function(){

    if(

        document.getElementById(

            "self-healing-dashboard"

        )

    ) return;

    const panel=

    document.createElement(

        "div"

    );

    panel.id=

    "self-healing-dashboard";

    panel.style.cssText=`

position:fixed;
top:20px;
right:20px;
width:420px;
height:650px;
background:#0b0b0b;
color:#00ff99;
font:12px monospace;
z-index:999999;
padding:20px;
overflow:auto;
border:1px solid #00ff99;
border-radius:12px;
display:none;
box-shadow:0 0 40px rgba(0,255,150,.25);

`;

    document.body

    .appendChild(

        panel

    );

    this.dashboard

    .element=

    panel;

};

/*==================================================
TOGGLE
==================================================*/

SelfHealing.toggleDashboard=

function(){

    if(

        !this.dashboard

        .element

    ){

        this.createDashboard();

    }

    this.dashboard

    .visible=

    !this.dashboard

    .visible;

    this.dashboard

    .element.style.display=

    this.dashboard

    .visible

    ?"block"

    :"none";

};

/*==================================================
UPDATE
==================================================*/

SelfHealing.updateDashboard=

function(){

    if(

        !this.dashboard

        .visible

    ) return;

    const gpu=

    this.gpuMemory?.()||

    {};

    const info=

    this.profile();

    this.dashboard

    .element.innerHTML=`

<h2>SELF HEALING</h2>

<hr>

<b>Uptime</b>

${info.uptime}s

<br><br>

<b>FPS</b>

${info.fps}

<br>

<b>Memory</b>

${info.memory} MB

<br>

<b>Errors</b>

${info.errors}

<br>

<b>Warnings</b>

${info.warnings}

<br>

<b>Recovered</b>

${this.statistics.recovered}

<br>

<b>Restarted</b>

${this.statistics.restarted}

<hr>

<b>GPU</b>

<pre>

${JSON.stringify(

gpu,

null,

2

)}

</pre>

<hr>

<b>Failed Modules</b>

<pre>

${JSON.stringify(

this.failed(),

null,

2

)}

</pre>

`;

};

/*==================================================
AUTO REFRESH
==================================================*/

SelfHealing.dashboardLoop=

function(){

    this.dashboard.timer=

    setInterval(

        ()=>{

            this.updateDashboard();

        },

        this.dashboard

        .refreshRate

    );

};

/*==================================================
KEYBOARD
==================================================*/

window.addEventListener(

    "keydown",

    event=>{

        if(

            event.ctrlKey&&

            event.shiftKey&&

            event.key

            .toLowerCase()==="d"

        ){

            event

            .preventDefault();

            SelfHealing

            .toggleDashboard();

        }

    }

);

/*==================================================
AI DEBUG
==================================================*/

SelfHealing.aiDebug=

async function(

    error

){

    if(

        !window.AI

    ) return null;

    try{

        const prompt=`

Analyze this JavaScript error.

Message:

${

error.message

}

Stack:

${

error.stack||

""

}

Suggest the fix only.

`;

        const result=

        await AI.chat(

            prompt

        );

        this.log(

            "ai",

            "AI Suggestion",

            result

        );

        EVENTS.emit(

            "self:ai",

            result

        );

        return result;

    }

    catch(

        exception

    ){

        this.warning(

            "AI Debug Failed"

        );

        return null;

    }

};

/*==================================================
AUTO DEBUG
==================================================*/

EVENTS.on(

    "self:error",

    error=>{

        SelfHealing

        .aiDebug(

            error

        );

    }

);

/*==================================================
READY
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        SelfHealing

        .createDashboard();

        SelfHealing

        .dashboardLoop();

        Log.success(

            "Developer Dashboard Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SELF-HEALING.JS
    PART 10 — AUTOMATIC BUG REPORTER, STATE RESTORE,
              FINALIZATION & GLOBAL API

======================================================================*/

/*==================================================
BUG REPORTER
==================================================*/

SelfHealing.reporter={

    enabled:true,

    endpoint:null,

    reports:[]

};

/*==================================================
STATE
==================================================*/

SelfHealing.state={

    snapshot:null,

    restored:0

};

/*==================================================
CREATE SNAPSHOT
==================================================*/

SelfHealing.snapshot=

function(){

    this.state.snapshot={

        timestamp:

        Date.now(),

        url:

        location.href,

        modules:

        [...this.modules.keys()],

        status:

        this.status(),

        profile:

        this.profile(),

        gpu:

        this.gpuMemory?.()||

        {},

        services:{

            api:

            !!window.API,

            ai:

            !!window.AI,

            audio:

            !!window.AudioEngine,

            three:

            !!window.ThreeEngine

        }

    };

    return this.state.snapshot;

};

/*==================================================
RESTORE STATE
==================================================*/

SelfHealing.restoreState=

async function(){

    if(

        !this.state

        .snapshot

    ) return;

    try{

        await this

        .restoreServices();

        await this

        .restartAll();

        this.state

        .restored++;

        this.recovered(

            "System",

            "State Restored"

        );

        EVENTS.emit(

            "self:state:restored"

        );

    }

    catch(

        error

    ){

        this.error({

            module:

            "Restore",

            message:

            error.message

        });

    }

};

/*==================================================
REPORT
==================================================*/

SelfHealing.report=

async function(

    payload

){

    if(

        !this.reporter

        .enabled

    ) return;

    const report={

        timestamp:

        Date.now(),

        browser:

        navigator.userAgent,

        url:

        location.href,

        payload,

        profile:

        this.profile(),

        gpu:

        this.gpuMemory?.()||

        {}

    };

    this.reporter

    .reports.push(

        report

    );

    if(

        !this.reporter

        .endpoint

    ) return report;

    try{

        await fetch(

            this.reporter

            .endpoint,

            {

                method:"POST",

                headers:{

                    "Content-Type":

                    "application/json"

                },

                body:

                JSON.stringify(

                    report

                )

            }

        );

    }

    catch{}

    return report;

};

/*==================================================
HEALTH SCORE
==================================================*/

SelfHealing.healthScore=

function(){

    let score=100;

    score-=

    this.statistics

    .errors*5;

    score-=

    this.statistics

    .warnings*2;

    score-=

    this.failed()

    .length*10;

    return Math.max(

        score,

        0

    );

};

/*==================================================
EXPORT REPORT
==================================================*/

SelfHealing.exportLogs=

function(){

    return JSON.stringify({

        version:

        this.version,

        status:

        this.status(),

        profile:

        this.profile(),

        statistics:

        this.statistics,

        logs:

        this.logs,

        errors:

        this.errors,

        warnings:

        this.warnings,

        recoveries:

        this.recoveries

    },

    null,

    4

    );

};

/*==================================================
DESTROY
==================================================*/

SelfHealing.destroy=

function(){

    this.stopWatchdog();

    clearInterval(

        this.dashboard

        .timer

    );

    this.logs=[];

    this.errors=[];

    this.warnings=[];

    this.recoveries=[];

    this.modules.clear();

};

/*==================================================
EXPORT
==================================================*/

window.$heal=

Object.freeze({

    engine:

    SelfHealing,

    status:

    ()=>SelfHealing

    .status(),

    profile:

    ()=>SelfHealing

    .profile(),

    health:

    ()=>SelfHealing

    .healthScore(),

    report:

    ()=>SelfHealing

    .exportLogs(),

    restart:

    name=>

    SelfHealing

    .restart(

        name

    ),

    restartAll:

    ()=>SelfHealing

    .restartAll(),

    snapshot:

    ()=>SelfHealing

    .snapshot(),

    restore:

    ()=>SelfHealing

    .restoreState()

});

/*==================================================
AUTO SNAPSHOT
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        SelfHealing

        .snapshot();

    }

);

/*==================================================
AUTO REPORT
==================================================*/

EVENTS.on(

    "self:error",

    error=>{

        SelfHealing

        .report(

            error

        );

    }

);

/*==================================================
AUTO CLEANUP
==================================================*/

window.addEventListener(

    "beforeunload",

    ()=>{

        SelfHealing

        .destroy();

    }

);

/*==================================================
READY
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        Log.success(

            "Self-Healing Ready"

        );

    }

);

/*==================================================
MODULE COMPLETE
==================================================*/

EVENTS.emit(

    "self:initialized"

);

/*==================================================
SELF-HEALING.JS COMPLETE
==================================================*/

Log.success(

`
═══════════════════════════════════════════════════

 Director VISION
 Luxury Cinematic Portfolio

 SELF-HEALING.JS COMPLETE

 Version : 1.0.0
 Build   : 2026.08

 Modules Included

 ✓ Core Engine
 ✓ Global Error Handler
 ✓ Safe Module Loader
 ✓ Watchdog Engine
 ✓ Performance Profiler
 ✓ Network Recovery
 ✓ GPU Recovery
 ✓ Service Recovery
 ✓ Developer Dashboard
 ✓ Bug Reporter
 ✓ State Restore
 ✓ Global API

 Global APIs

 ✓ SelfHealing
 ✓ $heal

 Health Monitoring

 ✓ Module Health
 ✓ FPS Monitor
 ✓ Memory Monitor
 ✓ GPU Monitor
 ✓ Network Monitor
 ✓ AI Debug
 ✓ Auto Recovery

═══════════════════════════════════════════════════
`
);
