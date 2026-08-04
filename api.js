/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    API.JS
    PART 01 — CORE API ENGINE

======================================================================*/

const API={

    initialized:false,

    baseURL:"",

    version:"v1",

    timeout:30000,

    token:null,

    headers:{},

    services:{},

    queue:[],

    cache:new Map()

};

/*==================================================
CONFIG
==================================================*/

API.configure=function({

    baseURL,

    version,

    timeout

}={}){

    this.baseURL=

    baseURL||

    this.baseURL;

    this.version=

    version||

    this.version;

    this.timeout=

    timeout||

    this.timeout;

};

/*==================================================
TOKEN
==================================================*/

API.setToken=

function(

    token

){

    this.token=

    token;

};

/*==================================================
HEADER
==================================================*/

API.setHeader=

function(

    key,

    value

){

    this.headers[

        key

    ]=value;

};

/*==================================================
REMOVE HEADER
==================================================*/

API.removeHeader=

function(

    key

){

    delete this.headers[

        key

    ];

};

/*==================================================
URL
==================================================*/

API.url=

function(

    endpoint

){

    return`${

        this.baseURL

    }/${

        this.version

    }/${

        endpoint

    }`;

};

/*==================================================
INIT
==================================================*/

API.init=

async function(){

    this.initialized=true;

    Log.info(

        "API Engine Ready"

    );

};

/*==================================================
REGISTER
==================================================*/

registerModule(

    "API",

    API

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    API.JS
    PART 02 — REQUEST ENGINE

======================================================================*/

/*==================================================
REQUEST
==================================================*/

API.request=

async function(

    endpoint,

    options={}

){

    const controller=

    new AbortController();

    const timer=

    setTimeout(

        ()=>{

            controller.abort();

        },

        options.timeout||

        this.timeout

    );

    const headers={

        ...this.headers,

        ...(

            this.token

            ?{

                Authorization:

                `Bearer ${

                    this.token

                }`

            }

            :{}

        ),

        ...options.headers

    };

    const response=

    await fetch(

        this.url(

            endpoint

        ),

        {

            method:

            options.method||

            "GET",

            headers,

            body:

            options.body

            ?JSON.stringify(

                options.body

            )

            :undefined,

            signal:

            controller.signal

        }

    );

    clearTimeout(

        timer

    );

    if(

        !response.ok

    ){

        throw new Error(

            `${

                response.status

            } ${

                response.statusText

            }`

        );

    }

    return await

    response.json();

};

/*==================================================
GET
==================================================*/

API.get=

function(

    endpoint,

    options={}

){

    return this.request(

        endpoint,

        {

            ...options,

            method:

            "GET"

        }

    );

};

/*==================================================
POST
==================================================*/

API.post=

function(

    endpoint,

    body,

    options={}

){

    return this.request(

        endpoint,

        {

            ...options,

            method:

            "POST",

            body

        }

    );

};

/*==================================================
PUT
==================================================*/

API.put=

function(

    endpoint,

    body,

    options={}

){

    return this.request(

        endpoint,

        {

            ...options,

            method:

            "PUT",

            body

        }

    );

};

/*==================================================
PATCH
==================================================*/

API.patch=

function(

    endpoint,

    body,

    options={}

){

    return this.request(

        endpoint,

        {

            ...options,

            method:

            "PATCH",

            body

        }

    );

};

/*==================================================
DELETE
==================================================*/

API.delete=

function(

    endpoint,

    options={}

){

    return this.request(

        endpoint,

        {

            ...options,

            method:

            "DELETE"

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

            "Request Engine Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    API.JS
    PART 03 — RESPONSE CACHE ENGINE

======================================================================*/

/*==================================================
CACHE CONFIG
==================================================*/

API.cacheConfig={

    enabled:true,

    ttl:300000,

    prefix:"api:"

};

/*==================================================
CACHE KEY
==================================================*/

API.cacheKey=

function(

    endpoint,

    options={}

){

    return`${

        this.cacheConfig

        .prefix

    }${

        endpoint

    }::${

        JSON.stringify(

            options

        )

    }`;

};

/*==================================================
SET
==================================================*/

API.setCache=

function(

    key,

    data

){

    this.cache.set(

        key,

        {

            data,

            expires:

            Date.now()+

            this.cacheConfig

            .ttl

        }

    );

};

/*==================================================
GET
==================================================*/

API.getCache=

function(

    key

){

    const item=

    this.cache.get(

        key

    );

    if(

        !item

    ) return null;

    if(

        Date.now()>

        item.expires

    ){

        this.cache.delete(

            key

        );

        return null;

    }

    return item.data;

};

/*==================================================
CLEAR
==================================================*/

API.clearCache=

function(){

    this.cache.clear();

};

/*==================================================
INVALIDATE
==================================================*/

API.invalidate=

function(

    endpoint

){

    [

        ...this.cache

        .keys()

    ]

    .forEach(

        key=>{

            if(

                key.includes(

                    endpoint

                )

            ){

                this.cache

                .delete(

                    key

                );

            }

        }

    );

};

/*==================================================
CACHED GET
==================================================*/

API.cachedGet=

async function(

    endpoint,

    options={}

){

    const key=

    this.cacheKey(

        endpoint,

        options

    );

    const cached=

    this.getCache(

        key

    );

    if(

        cached

    ){

        return cached;

    }

    const data=

    await this.get(

        endpoint,

        options

    );

    this.setCache(

        key,

        data

    );

    return data;

};

/*==================================================
CACHE SIZE
==================================================*/

API.cacheSize=

function(){

    return this.cache

    .size;

};

/*==================================================
READY
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        Log.info(

            "Cache Engine Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    API.JS
    PART 04 — RETRY, ERROR HANDLING & RECOVERY ENGINE

======================================================================*/

/*==================================================
CONFIG
==================================================*/

API.retry={

    attempts:3,

    delay:1000,

    factor:2

};

/*==================================================
WAIT
==================================================*/

API.sleep=

function(

    ms

){

    return new Promise(

        resolve=>

        setTimeout(

            resolve,

            ms

        )

    );

};

/*==================================================
RETRY REQUEST
==================================================*/

API.retryRequest=

async function(

    endpoint,

    options={}

){

    let error;

    let delay=

    this.retry.delay;

    for(

        let attempt=1;

        attempt<=

        this.retry.attempts;

        attempt++

    ){

        try{

            return await

            this.request(

                endpoint,

                options

            );

        }

        catch(

            exception

        ){

            error=

            exception;

            EVENTS.emit(

                "api:retry",

                {

                    endpoint,

                    attempt,

                    error

                }

            );

            if(

                attempt===

                this.retry

                .attempts

            ){

                break;

            }

            await this.sleep(

                delay

            );

            delay*=

            this.retry.factor;

        }

    }

    EVENTS.emit(

        "api:error",

        error

    );

    throw error;

};

/*==================================================
SAFE REQUEST
==================================================*/

API.safe=

async function(

    endpoint,

    options={}

){

    try{

        return{

            success:true,

            data:

            await this.retryRequest(

                endpoint,

                options

            )

        };

    }

    catch(

        error

    ){

        return{

            success:false,

            error:

            error.message

        };

    }

};

/*==================================================
NETWORK STATUS
==================================================*/

API.online=

function(){

    return navigator

    .onLine;

};

/*==================================================
NETWORK EVENTS
==================================================*/

window.addEventListener(

    "online",

    ()=>{

        EVENTS.emit(

            "api:online"

        );

    }

);

window.addEventListener(

    "offline",

    ()=>{

        EVENTS.emit(

            "api:offline"

        );

    }

);

/*==================================================
READY
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        Log.info(

            "Retry Engine Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    API.JS
    PART 05 — FILE UPLOAD & DOWNLOAD ENGINE

======================================================================*/

/*==================================================
UPLOAD
==================================================*/

API.upload=

async function(

    endpoint,

    file,

    options={}

){

    const form=

    new FormData();

    form.append(

        options.field||

        "file",

        file

    );

    if(

        options.data

    ){

        Object.entries(

            options.data

        ).forEach(

            ([

                key,

                value

            ])=>{

                form.append(

                    key,

                    value

                );

            }

        );

    }

    const response=

    await fetch(

        this.url(

            endpoint

        ),

        {

            method:"POST",

            headers:{

                Authorization:

                this.token

                ?`Bearer ${

                    this.token

                }`

                :""

            },

            body:form

        }

    );

    if(

        !response.ok

    ){

        throw new Error(

            "Upload Failed"

        );

    }

    const result=

    await response.json();

    EVENTS.emit(

        "api:upload",

        result

    );

    return result;

};

/*==================================================
MULTI UPLOAD
==================================================*/

API.uploadMultiple=

async function(

    endpoint,

    files,

    options={}

){

    const form=

    new FormData();

    [

        ...files

    ]

    .forEach(

        file=>{

            form.append(

                options.field||

                "files",

                file

            );

        }

    );

    const response=

    await fetch(

        this.url(

            endpoint

        ),

        {

            method:"POST",

            headers:{

                Authorization:

                this.token

                ?`Bearer ${

                    this.token

                }`

                :""

            },

            body:form

        }

    );

    return await

    response.json();

};

/*==================================================
DOWNLOAD
==================================================*/

API.download=

async function(

    endpoint,

    filename

){

    const response=

    await fetch(

        this.url(

            endpoint

        ),

        {

            headers:{

                Authorization:

                this.token

                ?`Bearer ${

                    this.token

                }`

                :""

            }

        }

    );

    const blob=

    await response.blob();

    const url=

    URL.createObjectURL(

        blob

    );

    const link=

    document.createElement(

        "a"

    );

    link.href=url;

    link.download=

    filename;

    link.click();

    URL.revokeObjectURL(

        url

    );

    EVENTS.emit(

        "api:download",

        filename

    );

};

/*==================================================
UPLOAD PROGRESS
==================================================*/

API.uploadProgress=

function(

    percent

){

    EVENTS.emit(

        "api:upload:progress",

        percent

    );

};

/*==================================================
READY
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        Log.info(

            "Upload Engine Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    API.JS
    PART 06 — GRAPHQL CLIENT ENGINE

======================================================================*/

/*==================================================
GRAPHQL
==================================================*/

API.graphql={

    endpoint:"graphql",

    headers:{}

};

/*==================================================
CONFIGURE
==================================================*/

API.setGraphQL=

function(

    endpoint

){

    this.graphql.endpoint=

    endpoint;

};

/*==================================================
QUERY
==================================================*/

API.query=

async function(

    query,

    variables={}

){

    const response=

    await fetch(

        this.url(

            this.graphql

            .endpoint

        ),

        {

            method:"POST",

            headers:{

                "Content-Type":

                "application/json",

                Authorization:

                this.token

                ?`Bearer ${

                    this.token

                }`

                :"",

                ...this.graphql

                .headers

            },

            body:

            JSON.stringify({

                query,

                variables

            })

        }

    );

    if(

        !response.ok

    ){

        throw new Error(

            "GraphQL Query Failed"

        );

    }

    const json=

    await response.json();

    if(

        json.errors

    ){

        throw json.errors;

    }

    EVENTS.emit(

        "api:graphql:query",

        json.data

    );

    return json.data;

};

/*==================================================
MUTATION
==================================================*/

API.mutation=

function(

    mutation,

    variables={}

){

    return this.query(

        mutation,

        variables

    );

};

/*==================================================
BATCH
==================================================*/

API.batchQueries=

async function(

    queries=[]

){

    return Promise.all(

        queries.map(

            item=>

            this.query(

                item.query,

                item.variables||

                {}

            )

        )

    );

};

/*==================================================
SET HEADER
==================================================*/

API.setGraphQLHeader=

function(

    key,

    value

){

    this.graphql

    .headers[

        key

    ]=value;

};

/*==================================================
CLEAR HEADERS
==================================================*/

API.clearGraphQLHeaders=

function(){

    this.graphql

    .headers={};

};

/*==================================================
READY
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        Log.info(

            "GraphQL Engine Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    API.JS
    PART 07 — WEBSOCKET & REALTIME ENGINE

======================================================================*/

/*==================================================
WEBSOCKET
==================================================*/

API.websocket={

    socket:null,

    url:"",

    connected:false,

    reconnect:true,

    reconnectDelay:3000,

    reconnectAttempts:0,

    maxReconnects:10

};

/*==================================================
CONNECT
==================================================*/

API.connectSocket=

function(

    url

){

    this.websocket.url=

    url;

    this.websocket.socket=

    new WebSocket(

        url

    );

    this.websocket.socket

    .onopen=

    ()=>{

        this.websocket

        .connected=true;

        this.websocket

        .reconnectAttempts=0;

        EVENTS.emit(

            "api:socket:open"

        );

    };

    this.websocket.socket

    .onmessage=

    event=>{

        let payload=

        event.data;

        try{

            payload=

            JSON.parse(

                payload

            );

        }

        catch{}

        EVENTS.emit(

            "api:socket:message",

            payload

        );

    };

    this.websocket.socket

    .onerror=

    error=>{

        EVENTS.emit(

            "api:socket:error",

            error

        );

    };

    this.websocket.socket

    .onclose=

    ()=>{

        this.websocket

        .connected=false;

        EVENTS.emit(

            "api:socket:close"

        );

        if(

            this.websocket

            .reconnect

        ){

            this

            .reconnectSocket();

        }

    };

};

/*==================================================
SEND
==================================================*/

API.socketSend=

function(

    payload

){

    if(

        !this.websocket

        .connected

    ) return false;

    this.websocket

    .socket.send(

        JSON.stringify(

            payload

        )

    );

    return true;

};

/*==================================================
RECONNECT
==================================================*/

API.reconnectSocket=

function(){

    if(

        this.websocket

        .reconnectAttempts>=

        this.websocket

        .maxReconnects

    ) return;

    this.websocket

    .reconnectAttempts++;

    setTimeout(

        ()=>{

            this.connectSocket(

                this.websocket

                .url

            );

        },

        this.websocket

        .reconnectDelay

    );

};

/*==================================================
DISCONNECT
==================================================*/

API.disconnectSocket=

function(){

    this.websocket

    .reconnect=false;

    this.websocket

    .socket

    ?.close();

};

/*==================================================
READY
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        Log.info(

            "WebSocket Engine Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    API.JS
    PART 08 — SERVER SENT EVENTS & LIVE STREAM ENGINE

======================================================================*/

/*==================================================
SSE
==================================================*/

API.sse={

    source:null,

    connected:false,

    endpoint:"",

    reconnect:true,

    reconnectDelay:3000

};

/*==================================================
CONNECT
==================================================*/

API.connectSSE=

function(

    endpoint

){

    this.sse.endpoint=

    endpoint;

    this.sse.source=

    new EventSource(

        this.url(

            endpoint

        )

    );

    this.sse.source

    .onopen=

    ()=>{

        this.sse

        .connected=true;

        EVENTS.emit(

            "api:sse:open"

        );

    };

    this.sse.source

    .onmessage=

    event=>{

        let payload=

        event.data;

        try{

            payload=

            JSON.parse(

                payload

            );

        }

        catch{}

        EVENTS.emit(

            "api:sse:message",

            payload

        );

    };

    this.sse.source

    .onerror=

    ()=>{

        this.sse

        .connected=false;

        EVENTS.emit(

            "api:sse:error"

        );

        if(

            this.sse

            .reconnect

        ){

            this

            .reconnectSSE();

        }

    };

};

/*==================================================
CUSTOM EVENT
==================================================*/

API.listen=

function(

    name,

    callback

){

    if(

        !this.sse

        .source

    ) return;

    this.sse

    .source

    .addEventListener(

        name,

        callback

    );

};

/*==================================================
RECONNECT
==================================================*/

API.reconnectSSE=

function(){

    if(

        !this.sse

        .endpoint

    ) return;

    setTimeout(

        ()=>{

            this.connectSSE(

                this.sse

                .endpoint

            );

        },

        this.sse

        .reconnectDelay

    );

};

/*==================================================
DISCONNECT
==================================================*/

API.disconnectSSE=

function(){

    this.sse

    .reconnect=false;

    this.sse

    .source

    ?.close();

    this.sse

    .connected=false;

};

/*==================================================
STATUS
==================================================*/

API.sseStatus=

function(){

    return{

        connected:

        this.sse

        .connected,

        endpoint:

        this.sse

        .endpoint

    };

};

/*==================================================
READY
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        Log.info(

            "SSE Engine Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    API.JS
    PART 09 — OFFLINE SYNC, REQUEST QUEUE & BACKGROUND TASKS

======================================================================*/

/*==================================================
QUEUE
==================================================*/

API.queue={

    requests:[],

    processing:false

};

/*==================================================
ENQUEUE
==================================================*/

API.enqueue=

function(

    endpoint,

    options={}

){

    this.queue

    .requests.push({

        endpoint,

        options,

        created:

        Date.now()

    });

    EVENTS.emit(

        "api:queue:add",

        this.queue

        .requests.length

    );

};

/*==================================================
PROCESS
==================================================*/

API.processQueue=

async function(){

    if(

        this.queue

        .processing

    ) return;

    this.queue

    .processing=true;

    while(

        this.queue

        .requests.length

    ){

        const job=

        this.queue

        .requests.shift();

        try{

            await this.request(

                job.endpoint,

                job.options

            );

            EVENTS.emit(

                "api:queue:success",

                job

            );

        }

        catch(

            error

        ){

            EVENTS.emit(

                "api:queue:error",

                {

                    job,

                    error

                }

            );

            this.queue

            .requests.unshift(

                job

            );

            break;

        }

    }

    this.queue

    .processing=false;

};

/*==================================================
SYNC
==================================================*/

API.sync=

function(){

    if(

        navigator.onLine

    ){

        this.processQueue();

    }

};

/*==================================================
BACKGROUND
==================================================*/

API.background=

function(

    endpoint,

    interval=60000

){

    return setInterval(

        ()=>{

            if(

                navigator.onLine

            ){

                this.get(

                    endpoint

                )

                .then(

                    data=>{

                        EVENTS.emit(

                            "api:background",

                            data

                        );

                    }

                )

                .catch(

                    ()=>{}

                );

            }

        },

        interval

    );

};

/*==================================================
ONLINE
==================================================*/

window.addEventListener(

    "online",

    ()=>{

        API.sync();

    }

);

/*==================================================
QUEUE STATUS
==================================================*/

API.queueStatus=

function(){

    return{

        pending:

        this.queue

        .requests.length,

        processing:

        this.queue

        .processing

    };

};

/*==================================================
READY
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        API.sync();

        Log.info(

            "Offline Sync Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    API.JS
    PART 10 — FINALIZATION, GLOBAL API & SERVICE LAYER

======================================================================*/

/*==================================================
VERSION
==================================================*/

API.version={

    module:

    "API",

    version:

    "1.0.0",

    build:

    "2026.08",

    author:

    "Director VISION"

};

/*==================================================
REGISTER SERVICE
==================================================*/

API.registerService=

function(

    name,

    service

){

    this.services[

        name

    ]=service;

};

/*==================================================
SERVICE
==================================================*/

API.service=

function(

    name

){

    return this.services[

        name

    ];

};

/*==================================================
INFO
==================================================*/

API.info=

function(){

    return{

        initialized:

        this.initialized,

        baseURL:

        this.baseURL,

        version:

        this.version.version,

        cached:

        this.cache.size,

        queued:

        this.queue

        .requests.length,

        websocket:

        this.websocket

        .connected,

        sse:

        this.sse

        .connected,

        online:

        navigator.onLine,

        services:

        Object.keys(

            this.services

        )

    };

};

/*==================================================
DESTROY
==================================================*/

API.destroy=

function(){

    this.disconnectSocket();

    this.disconnectSSE();

    this.clearCache();

    this.queue

    .requests=[];

    this.services={};

    this.headers={};

    this.token=null;

};

/*==================================================
EXPORT
==================================================*/

window.$api=

Object.freeze({

    engine:

    API,

    get:

    (

        endpoint,

        options

    )=>

    API.get(

        endpoint,

        options

    ),

    post:

    (

        endpoint,

        body,

        options

    )=>

    API.post(

        endpoint,

        body,

        options

    ),

    put:

    (

        endpoint,

        body,

        options

    )=>

    API.put(

        endpoint,

        body,

        options

    ),

    patch:

    (

        endpoint,

        body,

        options

    )=>

    API.patch(

        endpoint,

        body,

        options

    ),

    delete:

    (

        endpoint,

        options

    )=>

    API.delete(

        endpoint,

        options

    ),

    upload:

    (

        endpoint,

        file,

        options

    )=>

    API.upload(

        endpoint,

        file,

        options

    ),

    graphql:

    (

        query,

        variables

    )=>

    API.query(

        query,

        variables

    ),

    info:

    ()=>API.info()

});

/*==================================================
AUTO CLEANUP
==================================================*/

window.addEventListener(

    "beforeunload",

    ()=>{

        API.destroy();

    }

);

/*==================================================
READY
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        Log.success(

            "API Module Complete"

        );

    }

);

/*==================================================
MODULE COMPLETE
==================================================*/

EVENTS.emit(

    "api:initialized"

);

/*==================================================
API.JS COMPLETE
==================================================*/

Log.success(

`
═══════════════════════════════════════════════

 Director VISION
 Luxury Cinematic Portfolio

 API.JS BUILD COMPLETE

 Version : 1.0.0
 Build   : 2026.08

 Modules Included

 ✓ Core API Engine
 ✓ Request Engine
 ✓ Response Cache
 ✓ Retry & Recovery
 ✓ Upload / Download
 ✓ GraphQL Client
 ✓ WebSocket Engine
 ✓ Server-Sent Events
 ✓ Offline Sync
 ✓ Global Service Layer

 Global APIs

 ✓ API
 ✓ $api

═══════════════════════════════════════════════
`
);
