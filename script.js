/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 01 — CORE APPLICATION CONTROLLER

    Purpose:
    - Main system namespace
    - Global configuration
    - Application state
    - Environment detection
    - Core utilities

======================================================================*/


"use strict";


/*==================================================
GLOBAL VISION OBJECT
==================================================*/

window.VISION = {

    name:

    "VISION MOTION PICTURES",


    tagline:

    "Crafting Stories Beyond The Screen",


    version:

    "2026.08",


    build:

    "Production",


    author:

    "Director VISION",


    initialized:

    false,


    startTime:

    Date.now()

};


/*==================================================
APPLICATION CORE
==================================================*/

const APP = {


    version:

    VISION.version,


    modules:{},


    loaded:{},


    failed:{},


    state:{},


    settings:{},


    environment:{},


    initialized:false


};


/*==================================================
ENVIRONMENT DETECTION
==================================================*/

APP.environment = {


    browser:

    navigator.userAgent,


    mobile:

    /Android|iPhone|iPad/i

    .test(

        navigator.userAgent

    ),


    online:

    navigator.onLine,


    language:

    navigator.language,


    touch:

    "ontouchstart"

    in window,


    webgl:

    false,


    screen:{


        width:

        window.innerWidth,


        height:

        window.innerHeight,


        ratio:

        window.devicePixelRatio || 1

    }

};


/*==================================================
WEBGL CHECK
==================================================*/

APP.checkWebGL=function(){


    try{


        const canvas=

        document.createElement(

            "canvas"

        );


        const context=

        canvas.getContext(

            "webgl"

        )

        ||

        canvas.getContext(

            "experimental-webgl"

        );


        this.environment.webgl=

        !!context;


    }

    catch(error){


        this.environment.webgl=

        false;


    }


    return this.environment.webgl;


};


/*==================================================
APPLICATION STATE
==================================================*/

APP.state={


    loading:true,


    progress:0,


    ready:false,


    errors:[],


    performance:{


        fps:0,


        memory:0


    },


    user:{},


    session:{}


};


/*==================================================
SETTINGS
==================================================*/

APP.settings={


    debug:true,


    production:false,


    animations:true,


    three:true,


    audio:true,


    ai:true,


    autoRecovery:true,


    smoothScroll:true


};


/*==================================================
LOG SYSTEM BRIDGE
==================================================*/

APP.log=function(

    message,

    type="info"

){


    if(

        window.Log

    ){


        if(

            Log[type]

        ){


            Log[type](

                message

            );


            return;

        }


    }


    console.log(

        `[VISION ${type.toUpperCase()}]`,

        message

    );


};


/*==================================================
ERROR HANDLER BRIDGE
==================================================*/

APP.error=function(

    error,

    module="APP"

){


    this.state.errors.push({


        module,


        error,


        time:

        Date.now()


    });


    if(

        window.SelfHealing

    ){


        SelfHealing.error({

            module,

            message:

            error.message || error

        });


    }


    console.error(

        `[${module}]`,

        error

    );


};


/*==================================================
SYSTEM INFO
==================================================*/

APP.info=function(){


    return {


        name:

        VISION.name,


        version:

        VISION.version,


        initialized:

        this.initialized,


        modules:

        Object.keys(

            this.modules

        ),


        environment:

        this.environment,


        state:

        this.state


    };


};


/*==================================================
INITIAL CHECK
==================================================*/

APP.bootstrap=function(){


    this.checkWebGL();


    this.log(

        "Core Bootstrap Started"

    );


    this.log(

        `WebGL: ${
            this.environment.webgl
        }`

    );


    this.log(

        `Online: ${
            this.environment.online
        }`

    );


    return true;


};


/*==================================================
EXPORT
==================================================*/

window.APP=

APP;


/*==================================================
START CORE
==================================================*/

APP.bootstrap();


/*==================================================
PART 01 COMPLETE
==================================================*/

APP.log(

    "SCRIPT CORE PART 01 READY",

    "info"

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 02 — EXISTING MODULE REGISTRY SYSTEM

    Purpose:
    - Connect existing JS modules
    - Prevent duplicate initialization
    - Track module status
    - Prepare dependency management

======================================================================*/


/*==================================================
MODULE REGISTRY
==================================================*/

APP.registry={

    total:0,

    loaded:0,

    failed:0,

    pending:0

};


/*==================================================
REGISTER MODULE
==================================================*/

APP.register=function(

    name,

    module,

    options={}

){

    if(

        !name

        ||

        !module

    ){

        this.error(

            "Invalid module registration",

            "Registry"

        );

        return false;

    }


    // Prevent duplicate modules

    if(

        this.modules[name]

    ){

        this.log(

            `${name} already registered`,

            "warn"

        );

        return false;

    }


    this.modules[name]={


        instance:

        module,


        name:


        name,


        version:

        options.version ||

        "1.0.0",


        dependencies:

        options.dependencies || [],


        priority:

        options.priority || 0,


        status:

        "registered",


        initialized:

        false,


        error:

        null


    };


    this.registry.total++;


    this.log(

        `${name} registered`

    );


    return true;


};


/*==================================================
GET MODULE
==================================================*/

APP.getModule=function(

    name

){

    const module=

    this.modules[name];


    if(

        !module

    ){

        this.log(

            `${name} not found`,

            "warn"

        );


        return null;

    }


    return module;


};


/*==================================================
CHECK MODULE
==================================================*/

APP.hasModule=function(

    name

){

    return !!this.modules[name];

};


/*==================================================
REMOVE MODULE
==================================================*/

APP.removeModule=function(

    name

){

    if(

        !this.modules[name]

    ){

        return false;

    }


    delete this.modules[name];


    this.log(

        `${name} removed`

    );


    return true;


};


/*==================================================
REGISTER EXISTING SYSTEMS
==================================================*/

APP.registerExistingModules=function(){


    const systems={


        Loader:

        window.Loader,


        Events:

        window.EVENTS,


        API:

        window.API,


        SelfHealing:

        window.SelfHealing,


        Admin:

        window.Admin,


        AI:

        window.AI,


        ThreeEngine:

        window.ThreeEngine,


        AudioEngine:

        window.AudioEngine,


        Database:

        window.Database,


        MegaMenu:

        window.MegaMenu,


        GSAP:

        window.gsap,


        ScrollEngine:

        window.ScrollEngine



    };



    Object.entries(

        systems

    )

    .forEach(

        ([name,module])=>{


            if(

                module

            ){

                this.register(

                    name,

                    module

                );


            }


        }

    );


};


/*==================================================
MODULE STATUS
==================================================*/

APP.moduleStatus=function(){


    const result={};


    Object.entries(

        this.modules

    )

    .forEach(

        ([name,module])=>{


            result[name]={


                status:

                module.status,


                initialized:

                module.initialized,


                error:

                module.error


            };


        }

    );


    return result;


};


/*==================================================
SYSTEM STATUS
==================================================*/

APP.systemStatus=function(){


    return {


        total:

        this.registry.total,


        loaded:

        this.registry.loaded,


        failed:

        this.registry.failed,


        pending:

        this.registry.pending,


        modules:

        this.moduleStatus()


    };


};


/*==================================================
AUTO REGISTER
==================================================*/

APP.registerExistingModules();


/*==================================================
EVENT
==================================================*/

if(

    window.EVENTS

){

    EVENTS.emit(

        "modules:registered",

        APP.modules

    );

}


/*==================================================
PART 02 COMPLETE
==================================================*/

APP.log(

    "SCRIPT CORE PART 02 READY",

    "info"

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 03 — DEPENDENCY MANAGER ENGINE

    Purpose:
    - Control module loading order
    - Check required dependencies
    - Prevent initialization crashes
    - Resolve module hierarchy

======================================================================*/


/*==================================================
DEPENDENCY SYSTEM
==================================================*/

APP.dependencies={

    resolved:{},

    waiting:{},

    failed:{},

    checking:false

};


/*==================================================
ADD DEPENDENCY
==================================================*/

APP.addDependency=function(

    module,

    dependencies=[]

){

    const target=

    this.modules[module];


    if(

        !target

    ){

        this.log(

            `${module} not registered`,

            "warn"

        );

        return false;

    }


    target.dependencies=

    dependencies;


    return true;

};


/*==================================================
CHECK DEPENDENCY
==================================================*/

APP.checkDependency=function(

    dependency

){

    const module=

    this.modules[dependency];


    if(

        !module

    ){

        return false;

    }


    return (

        module.initialized

        ||

        module.status==="loaded"

    );


};


/*==================================================
RESOLVE MODULE
==================================================*/

APP.resolveDependencies=function(

    moduleName

){

    const module=

    this.modules[moduleName];


    if(

        !module

    ){

        return false;

    }


    const dependencies=

    module.dependencies || [];


    for(

        const dependency of dependencies

    ){


        if(

            !this.checkDependency(

                dependency

            )

        ){

            this.dependencies.waiting[moduleName]=true;


            this.log(

                `${moduleName} waiting for ${dependency}`,

                "warn"

            );


            return false;

        }

    }


    this.dependencies.resolved[moduleName]=true;


    return true;


};


/*==================================================
DEPENDENCY TREE
==================================================*/

APP.getDependencyTree=function(){


    const tree={};


    Object.entries(

        this.modules

    )

    .forEach(

        ([name,module])=>{


            tree[name]=

            module.dependencies || [];


        }

    );


    return tree;


};


/*==================================================
AUTO DEPENDENCY SETUP
==================================================*/

APP.setupDependencies=function(){


    this.addDependency(

        "SelfHealing",

        [

            "Events"

        ]

    );


    this.addDependency(

        "API",

        [

            "Events"

        ]

    );


    this.addDependency(

        "Admin",

        [

            "API",

            "Events"

        ]

    );


    this.addDependency(

        "AI",

        [

            "API"

        ]

    );


    this.addDependency(

        "ThreeEngine",

        [

            "Events"

        ]

    );


    this.addDependency(

        "AudioEngine",

        [

            "Events"

        ]

    );


    this.addDependency(

        "MegaMenu",

        [

            "Events"

        ]

    );


    this.log(

        "Dependency Map Created"

    );


};


/*==================================================
CHECK ALL
==================================================*/

APP.checkAllDependencies=function(){


    const result={};


    Object.keys(

        this.modules

    )

    .forEach(

        name=>{


            result[name]=

            this.resolveDependencies(

                name

            );


        }

    );


    return result;


};


/*==================================================
WAITING MODULES
==================================================*/

APP.getWaitingModules=function(){


    return Object.keys(

        this.dependencies

        .waiting

    );


};


/*==================================================
FAILED DEPENDENCIES
==================================================*/

APP.failDependency=function(

    module,

    reason

){


    this.dependencies.failed[module]={

        reason,

        time:

        Date.now()

    };


    this.log(

        `${module} dependency failed`,

        "error"

    );


};


/*==================================================
AUTO SETUP
==================================================*/

APP.setupDependencies();



/*==================================================
PART 03 COMPLETE
==================================================*/

APP.log(

    "SCRIPT CORE PART 03 READY",

    "info"

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 04 — SAFE INITIALIZATION ENGINE

    Purpose:
    - Initialize modules safely
    - Catch module crashes
    - Track loading progress
    - Recover failed modules
    - Continue website startup

======================================================================*/


/*==================================================
INITIALIZATION ENGINE
==================================================*/

APP.initializer={

    queue:[],

    running:false,

    current:null,

    progress:0

};


/*==================================================
ADD TO QUEUE
==================================================*/

APP.queueModule=function(

    name

){

    if(

        !this.modules[name]

    ){

        this.log(

            `${name} not found`,

            "warn"

        );

        return false;

    }


    this.initializer

    .queue

    .push(

        name

    );


    this.registry.pending++;


    return true;


};


/*==================================================
SAFE EXECUTION
==================================================*/

APP.safeExecute=

async function(

    name,

    callback

){


    try{


        this.initializer.current=

        name;


        this.log(

            `Starting ${name}`

        );


        const result=

        await callback();


        this.modules[name]

        .status=

        "loaded";


        this.modules[name]

        .initialized=

        true;


        this.registry.loaded++;


        this.initializer.progress++;


        this.log(

            `${name} initialized`

        );


        return result;


    }


    catch(error){


        this.modules[name]

        .status=

        "failed";


        this.modules[name]

        .error=

        error;


        this.registry.failed++;


        this.failed[name]=error;


        this.error(

            error,

            name

        );


        // Self healing attempt

        if(

            window.SelfHealing

        ){


            SelfHealing.restart(

                name

            );


        }


        return null;


    }

};


/*==================================================
INITIALIZE MODULE
==================================================*/

APP.initModule=

async function(

    name

){


    const module=

    this.modules[name];


    if(

        !module

    ){

        return false;

    }



    // Dependency check

    if(

        !this.resolveDependencies(

            name

        )

    ){

        this.log(

            `${name} dependencies pending`,

            "warn"

        );

        return false;

    }



    const instance=

    module.instance;



    return await this.safeExecute(

        name,

        async()=>{


            if(

                typeof instance.init==="function"

            ){


                await instance.init();


            }


            else if(

                typeof instance==="function"

            ){


                await instance();


            }


        }

    );


};


/*==================================================
INITIALIZE ALL
==================================================*/

APP.initAll=

async function(){


    if(

        this.initializer.running

    ){

        return;

    }


    this.initializer.running=true;


    const modules=

    Object.keys(

        this.modules

    );



    for(

        const name of modules

    ){


        await this.initModule(

            name

        );


    }



    this.initializer.running=false;



    this.initialized=true;



    APP.state.loading=false;


    APP.state.ready=true;


    VISION.initialized=true;



    EVENTS?.emit?.(

        "websiteReady"

    );



    this.log(

        "All Systems Initialized"

    );


};


/*==================================================
RETRY FAILED MODULE
==================================================*/

APP.retryModule=

async function(

    name

){


    const module=

    this.modules[name];


    if(

        !module

    ){

        return;

    }


    this.log(

        `Retrying ${name}`

    );


    module.status=

    "retrying";


    return await this.initModule(

        name

    );


};


/*==================================================
FAILED MODULE LIST
==================================================*/

APP.failedModules=function(){


    return Object.keys(

        this.failed

    );


};


/*==================================================
PROGRESS
==================================================*/

APP.loadingProgress=function(){


    const total=

    this.registry.total;


    const loaded=

    this.registry.loaded;


    if(

        !total

    ){

        return 0;

    }


    return Math.round(

        (

            loaded /

            total

        )

        *

        100

    );


};


/*==================================================
PART 04 COMPLETE
==================================================*/

APP.log(

    "SCRIPT CORE PART 04 READY",

    "info"

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 05 — WEBSITE LOADING SYSTEM

    Purpose:
    - Control initial loading screen
    - Track system progress
    - Prevent 0% freeze
    - Handle asset loading
    - Complete website startup

======================================================================*/


/*==================================================
LOADER SYSTEM
==================================================*/

APP.loader={

    element:null,

    progressBar:null,

    percentage:null,

    value:0,

    tasks:[],

    completed:0,

    started:false,

    finished:false

};


/*==================================================
CACHE LOADER DOM
==================================================*/

APP.loader.cache=function(){


    this.element=

    document.querySelector(

        "#loader"

    );


    this.progressBar=

    document.querySelector(

        ".loader-progress"

    );


    this.percentage=

    document.querySelector(

        ".loader-percentage"

    );


};


/*==================================================
ADD LOADING TASK
==================================================*/

APP.addLoadingTask=function(

    name,

    weight=1

){


    this.loader

    .tasks

    .push({

        name,

        weight,

        completed:false

    });


};


/*==================================================
UPDATE PROGRESS
==================================================*/

APP.updateProgress=function(

    value

){


    value=

    Math.min(

        Math.max(

            value,

            0

        ),

        100

    );


    this.loader.value=

    value;



    APP.state.progress=

    value;



    if(

        this.loader.progressBar

    ){

        this.loader.progressBar.style.width=

        `${value}%`;

    }



    if(

        this.loader.percentage

    ){

        this.loader.percentage.textContent=

        `${Math.floor(value)}%`;

    }



    EVENTS?.emit?.(

        "loader:progress",

        value

    );


};


/*==================================================
COMPLETE TASK
==================================================*/

APP.completeTask=function(

    name

){


    const task=

    this.loader.tasks.find(

        item=>

        item.name===name

    );



    if(

        !task ||

        task.completed

    ){

        return;

    }



    task.completed=true;


    this.loader.completed++;



    const totalWeight=

    this.loader.tasks.reduce(

        (

            total,

            item

        )=>

        total+

        item.weight,

        0

    );



    const finishedWeight=

    this.loader.tasks.reduce(

        (

            total,

            item

        )=>

        total+

        (

            item.completed

            ?

            item.weight

            :

            0

        ),

        0

    );



    this.updateProgress(

        (

            finishedWeight /

            totalWeight

        )

        *

        100

    );


};


/*==================================================
DEFAULT TASKS
==================================================*/

APP.setupLoaderTasks=function(){


    const tasks=[


        [

            "Core",

            10

        ],


        [

            "Events",

            10

        ],


        [

            "API",

            15

        ],


        [

            "SelfHealing",

            15

        ],


        [

            "UI",

            15

        ],


        [

            "Animation",

            15

        ],


        [

            "VisualEngine",

            10

        ],


        [

            "Ready",

            10

        ]


    ];



    tasks.forEach(

        task=>{


            this.addLoadingTask(

                task[0],

                task[1]

            );


        }

    );


};


/*==================================================
START LOADER
==================================================*/

APP.startLoader=function(){


    this.loader.started=true;


    this.loader.cache();


    this.setupLoaderTasks();


    this.updateProgress(

        0

    );


    this.log(

        "Loader Started"

    );


};


/*==================================================
HIDE LOADER
==================================================*/

APP.hideLoader=function(){


    if(

        this.loader.finished

    ){

        return;

    }


    this.loader.finished=true;



    this.updateProgress(

        100

    );



    setTimeout(

        ()=>{


            if(

                this.loader.element

            ){


                this.loader.element

                .classList

                .add(

                    "hidden"

                );


            }


            APP.state.loading=false;



            EVENTS?.emit?.(

                "loader:complete"

            );


        },

        800

    );


};


/*==================================================
AUTO COMPLETE
==================================================*/

APP.finishLoading=function(){


    this.completeTask(

        "Ready"

    );


    setTimeout(

        ()=>{


            this.hideLoader();


        },

        500

    );


};


/*==================================================
LOADER SAFETY WATCHDOG
==================================================*/

APP.loaderWatch=function(){


    setTimeout(

        ()=>{


            if(

                APP.state.loading

                &&

                APP.loader.value===0

            ){


                APP.log(

                    "Loader stuck detected. Recovering..."

                );


                APP.updateProgress(

                    10

                );


            }


        },

        10000

    );


};


/*==================================================
INITIALIZE
==================================================*/

APP.initLoader=function(){


    this.startLoader();


    this.loaderWatch();


};


/*==================================================
PART 05 COMPLETE
==================================================*/

APP.log(

    "SCRIPT CORE PART 05 READY",

    "info"

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 06 — EVENT COMMUNICATION BRIDGE

    Purpose:
    - Connect all modules together
    - Create global event system
    - Handle module communication
    - Prevent direct dependency conflicts

======================================================================*/


/*==================================================
EVENT ENGINE
==================================================*/

APP.events={

    listeners:{},

    history:[],

    maxHistory:500

};


/*==================================================
CREATE EVENT
==================================================*/

APP.on=function(

    event,

    callback

){


    if(

        !event ||

        typeof callback!=="function"

    ){

        return false;

    }



    if(

        !this.events.listeners[event]

    ){

        this.events.listeners[event]=[];

    }



    this.events.listeners[event]

    .push(

        callback

    );


    return true;


};


/*==================================================
REMOVE EVENT
==================================================*/

APP.off=function(

    event,

    callback

){


    const listeners=

    this.events.listeners[event];


    if(

        !listeners

    ){

        return;

    }



    this.events.listeners[event]=

    listeners.filter(

        fn=>

        fn!==callback

    );


};


/*==================================================
EMIT EVENT
==================================================*/

APP.emit=function(

    event,

    data={}

){


    const record={


        event,

        data,

        time:

        Date.now()


    };



    this.events.history

    .push(

        record

    );



    if(

        this.events.history.length >

        this.events.maxHistory

    ){

        this.events.history.shift();

    }



    const listeners=

    this.events.listeners[event];



    if(

        !listeners

    ){

        return;

    }



    listeners.forEach(

        callback=>{


            try{


                callback(

                    data

                );


            }


            catch(error){


                this.error(

                    error,

                    "EVENT"

                );


            }


        }

    );


};


/*==================================================
EVENT HISTORY
==================================================*/

APP.eventHistory=function(){


    return this.events.history;


};


/*==================================================
GLOBAL EVENTS
==================================================*/


/*

CORE EVENTS

*/


APP.on(

    "modules:registered",

    ()=>{


        APP.log(

            "All modules registered"

        );


    }

);



APP.on(

    "loader:progress",

    progress=>{


        APP.state.progress=

        progress;


    }

);



APP.on(

    "loader:complete",

    ()=>{


        APP.log(

            "Loader completed"

        );


    }

);



APP.on(

    "websiteReady",

    ()=>{


        APP.state.ready=true;


        APP.log(

            "Website Ready"

        );


    }

);


/*

API EVENTS

*/


APP.on(

    "api:ready",

    ()=>{


        APP.completeTask?.(

            "API"

        );


    }

);



APP.on(

    "api:error",

    error=>{


        APP.error(

            error,

            "API"

        );


    }

);



/*

VISUAL EVENTS

*/


APP.on(

    "three:ready",

    ()=>{


        APP.completeTask?.(

            "VisualEngine"

        );


    }

);



APP.on(

    "audio:ready",

    ()=>{


        APP.log(

            "Audio Engine Ready"

        );


    }

);



/*

RECOVERY EVENTS

*/


APP.on(

    "self:error",

    error=>{


        APP.error(

            error,

            "SelfHealing"

        );


    }

);



APP.on(

    "self:recovered",

    data=>{


        APP.log(

            "System recovered",

            "info"

        );


    }

);



/*==================================================
BRIDGE EXISTING EVENTS
==================================================*/

APP.bridgeEvents=function(){


    if(

        window.EVENTS

    ){


        EVENTS.on(

            "websiteReady",

            data=>{


                APP.emit(

                    "websiteReady",

                    data

                );


            }

        );



        EVENTS.on(

            "api:initialized",

            data=>{


                APP.emit(

                    "api:ready",

                    data

                );


            }

        );



        EVENTS.on(

            "self:initialized",

            data=>{


                APP.emit(

                    "self:ready",

                    data

                );


            }

        );


    }


};


/*==================================================
BROADCAST
==================================================*/

APP.broadcast=function(

    event,

    data

){


    this.emit(

        event,

        data

    );


    if(

        window.EVENTS

    ){

        EVENTS.emit(

            event,

            data

        );

    }


};


/*==================================================
INITIALIZE
==================================================*/

APP.initEvents=function(){


    this.bridgeEvents();


    this.log(

        "Event Bridge Started"

    );


};


/*==================================================
START
==================================================*/

APP.initEvents();



/*==================================================
PART 06 COMPLETE
==================================================*/

APP.log(

    "SCRIPT CORE PART 06 READY",

    "info"

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 07 — SELF-HEALING INTEGRATION & RECOVERY CONTROLLER

    Purpose:
    - Connect self-healing.js with main system
    - Monitor module failures
    - Auto recovery
    - Crash protection
    - Restore failed systems

======================================================================*/


/*==================================================
SELF HEALING CONTROLLER
==================================================*/

APP.recovery={

    enabled:true,

    active:false,

    attempts:0,

    maxAttempts:5,

    recoveredModules:[],

    failedModules:[]

};


/*==================================================
CONNECT SELF HEALING
==================================================*/

APP.connectSelfHealing=function(){


    if(

        !window.SelfHealing

    ){

        this.log(

            "SelfHealing module not found",

            "warn"

        );

        return false;

    }



    this.log(

        "Connecting Self Healing Engine"

    );



    return true;


};


/*==================================================
REGISTER RECOVERY LISTENERS
==================================================*/

APP.setupRecoveryEvents=function(){


    if(

        !window.SelfHealing

    ){

        return;

    }



    /*

    ERROR DETECTED

    */


    EVENTS?.on?.(

        "self:error",

        error=>{


            APP.handleSystemError(

                error

            );


        }

    );



    /*

    MODULE FAILED

    */


    EVENTS?.on?.(

        "self:module:failed",

        data=>{


            APP.failedModules

            .push(

                data.name

            );


            APP.recoverModule(

                data.name

            );


        }

    );



    /*

    MODULE RECOVERED

    */


    EVENTS?.on?.(

        "self:module:recovered",

        name=>{


            APP.recovery

            .recoveredModules

            .push(

                name

            );


            APP.log(

                `${name} recovered`

            );


        }

    );


};


/*==================================================
SYSTEM ERROR HANDLER
==================================================*/

APP.handleSystemError=function(

    error

){


    APP.recovery

    .attempts++;



    APP.error(

        error,

        "Recovery"

    );



    if(

        APP.recovery

        .attempts >

        APP.recovery

        .maxAttempts

    ){


        APP.log(

            "Maximum recovery attempts reached",

            "warn"

        );


        return;

    }



    if(

        window.SelfHealing

    ){


        SelfHealing

        .snapshot?.();


    }


};


/*==================================================
RECOVER MODULE
==================================================*/

APP.recoverModule=

async function(

    name

){


    if(

        !name

    ){

        return;

    }



    APP.recovery

    .active=true;



    APP.log(

        `Recovering ${name}`

    );



    try{


        if(

            window.SelfHealing

        ){


            await SelfHealing

            .restart(

                name

            );


        }



        APP.modules[name]

        .status=

        "recovered";



        APP.recovery

        .active=false;



    }


    catch(error){


        APP.error(

            error,

            "Module Recovery"

        );


        APP.recovery

        .active=false;


    }


};


/*==================================================
RECOVER ALL FAILED
==================================================*/

APP.recoverFailed=function(){


    const failed=

    Object.keys(

        APP.failed

    );



    failed.forEach(

        module=>{


            APP.recoverModule(

                module

            );


        }

    );


};


/*==================================================
HEALTH MONITOR
==================================================*/

APP.health=function(){


    return {


        system:

        APP.initialized,


        recovery:

        APP.recovery,


        failed:

        APP.failedModules(),


        selfHealing:

        !!window.SelfHealing


    };


};


/*==================================================
AUTO RECOVERY MODE
==================================================*/

APP.enableRecovery=function(){


    APP.recovery.enabled=true;



    APP.log(

        "Automatic Recovery Enabled"

    );


};



APP.disableRecovery=function(){


    APP.recovery.enabled=false;



    APP.log(

        "Automatic Recovery Disabled"

    );


};


/*==================================================
INITIALIZE
==================================================*/

APP.initRecovery=function(){


    APP.connectSelfHealing();


    APP.setupRecoveryEvents();


    APP.enableRecovery();



};


/*==================================================
START
==================================================*/

APP.initRecovery();



/*==================================================
PART 07 COMPLETE
==================================================*/

APP.log(

    "SCRIPT CORE PART 07 READY",

    "info"

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    SCRIPT.JS
    PART 08 — FINAL BOOT SYSTEM & PRODUCTION STARTUP

    Purpose:
    - Start complete website
    - Initialize all modules
    - Complete loader
    - Activate production mode
    - Emit final ready events

======================================================================*/


/*==================================================
BOOT CONTROLLER
==================================================*/

APP.boot={

    started:false,

    completed:false,

    timestamp:null,

    steps:[]

};


/*==================================================
BOOT STEP LOGGER
==================================================*/

APP.bootStep=function(

    name,

    status="started"

){

    const step={

        name,

        status,

        time:

        Date.now()

    };


    this.boot.steps.push(

        step

    );


    this.log(

        `${name} ${status}`

    );


};


/*==================================================
SYSTEM PRECHECK
==================================================*/

APP.precheck=function(){


    this.bootStep(

        "System Precheck"

    );


    const checks={


        DOM:

        !!document.body,


        Events:

        !!window.EVENTS,


        Loader:

        !!this.loader,


        Recovery:

        !!window.SelfHealing


    };



    Object.entries(

        checks

    )

    .forEach(

        ([name,value])=>{


            if(!value){


                this.log(

                    `${name} unavailable`,

                    "warn"

                );


            }


        }

    );



    return checks;


};


/*==================================================
INITIALIZE CORE MODULES
==================================================*/

APP.startCoreModules=

async function(){


    this.bootStep(

        "Core Modules"

    );



    const priority=[


        "Events",


        "Loader",


        "SelfHealing",


        "API",


        "Database",


        "Admin",


        "AI",


        "ThreeEngine",


        "AudioEngine",


        "MegaMenu"

    ];



    for(

        const module of priority

    ){


        if(

            this.modules[module]

        ){


            await this.initModule(

                module

            );


        }


    }


};


/*==================================================
START APPLICATION
==================================================*/

APP.start=

async function(){


    if(

        this.boot.started

    ){

        return;

    }



    this.boot.started=true;


    this.boot.timestamp=

    Date.now();



    try{


        this.bootStep(

            "VISION Startup"

        );



        this.precheck();



        this.initLoader();



        await this.startCoreModules();



        this.bootStep(

            "Final Checks",

            "complete"

        );



        this.completeTask?.(

            "Ready"

        );



        this.finishLoading();



        this.initialized=true;


        this.boot.completed=true;



        VISION.initialized=true;



        this.emit(

            "websiteReady",

            {

                version:

                VISION.version,

                time:

                Date.now()

            }

        );



        this.log(

            `

════════════════════════════

VISION MOTION PICTURES

SYSTEM READY

Version:

${VISION.version}

Status:

ONLINE

════════════════════════════

            `

        );


    }


    catch(error){


        this.error(

            error,

            "BOOT"

        );



        if(

            window.SelfHealing

        ){

            SelfHealing.error(

                error

            );

        }


    }


};


/*==================================================
SYSTEM RESTART
==================================================*/

APP.restart=

async function(){


    this.log(

        "System Restart Requested"

    );



    this.boot.started=false;

    this.boot.completed=false;



    await this.start();


};


/*==================================================
GLOBAL STATUS
==================================================*/

APP.status=function(){


    return{


        ready:

        this.boot.completed,


        version:

        VISION.version,


        uptime:

        Math.round(

            (

                Date.now()

                -

                VISION.startTime

            )

            /

            1000

        ),


        modules:

        this.systemStatus(),


        health:

        this.health?.()


    };


};


/*==================================================
AUTO START
==================================================*/

document.addEventListener(

    "DOMContentLoaded",

    ()=>{


        APP.start();


    }

);


/*==================================================
GLOBAL ACCESS
==================================================*/

window.VISION_APP=

APP;


/*==================================================
PART 08 COMPLETE
==================================================*/

APP.log(

    "SCRIPT CORE PART 08 READY",

    "info"

);
