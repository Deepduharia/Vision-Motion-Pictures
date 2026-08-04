/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    ADMIN.JS
    PART 01 — ADMIN CORE ENGINE

======================================================================*/

const Admin={

    initialized:false,

    authenticated:false,

    token:null,

    user:null,

    config:{

        api:"",

        storage:"vision-admin",

        session:"vision-session"

    },

    modules:{},

    cache:new Map()

};

/*==================================================
CONFIG
==================================================*/

Admin.configure=function({

    api,

    storage,

    session

}={}){

    this.config.api=

    api||

    this.config.api;

    this.config.storage=

    storage||

    this.config.storage;

    this.config.session=

    session||

    this.config.session;

};

/*==================================================
REGISTER
==================================================*/

Admin.register=function(

    name,

    module

){

    this.modules[name]=

    module;

};

/*==================================================
CACHE
==================================================*/

Admin.set=function(

    key,

    value

){

    this.cache.set(

        key,

        value

    );

};

Admin.get=function(

    key

){

    return this.cache.get(

        key

    );

};

/*==================================================
CLEAR
==================================================*/

Admin.clear=function(){

    this.cache.clear();

};

/*==================================================
INIT
==================================================*/

Admin.init=async function(){

    this.initialized=true;

    Log.info(

        "Admin Engine Ready"

    );

};

/*==================================================
REGISTER
==================================================*/

registerModule(

    "Admin",

    Admin

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    ADMIN.JS
    PART 02 — AUTHENTICATION & SESSION ENGINE

======================================================================*/

/*==================================================
LOGIN
==================================================*/

Admin.login=

async function(

    credentials

){

    const response=

    await fetch(

        `${

            this.config.api

        }/login`,

        {

            method:"POST",

            headers:{

                "Content-Type":

                "application/json"

            },

            body:

            JSON.stringify(

                credentials

            )

        }

    );

    if(

        !response.ok

    ){

        throw new Error(

            "Authentication Failed"

        );

    }

    const data=

    await response.json();

    this.token=

    data.token;

    this.user=

    data.user;

    this.authenticated=

    true;

    this.saveSession();

    EVENTS.emit(

        "admin:login",

        this.user

    );

    return data;

};

/*==================================================
LOGOUT
==================================================*/

Admin.logout=

function(){

    this.token=null;

    this.user=null;

    this.authenticated=false;

    sessionStorage.removeItem(

        this.config.session

    );

    EVENTS.emit(

        "admin:logout"

    );

};

/*==================================================
SESSION SAVE
==================================================*/

Admin.saveSession=

function(){

    sessionStorage.setItem(

        this.config.session,

        JSON.stringify({

            token:

            this.token,

            user:

            this.user

        })

    );

};

/*==================================================
SESSION LOAD
==================================================*/

Admin.restoreSession=

function(){

    const session=

    sessionStorage.getItem(

        this.config.session

    );

    if(

        !session

    ) return false;

    const data=

    JSON.parse(

        session

    );

    this.token=

    data.token;

    this.user=

    data.user;

    this.authenticated=true;

    return true;

};

/*==================================================
AUTH HEADER
==================================================*/

Admin.headers=

function(){

    return{

        Authorization:

        `Bearer ${

            this.token

        }`,

        "Content-Type":

        "application/json"

    };

};

/*==================================================
CHECK
==================================================*/

Admin.isLoggedIn=

function(){

    return(

        this.authenticated&&

        !!this.token

    );

};

/*==================================================
READY
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        Admin.restoreSession();

        Log.info(

            "Authentication Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    ADMIN.JS
    PART 03 — PROJECT MANAGEMENT ENGINE

======================================================================*/

/*==================================================
PROJECTS
==================================================*/

Admin.projects={

    items:[]

};

/*==================================================
LOAD
==================================================*/

Admin.loadProjects=

async function(){

    const response=

    await fetch(

        `${

            this.config.api

        }/projects`,

        {

            headers:

            this.headers()

        }

    );

    const data=

    await response.json();

    this.projects.items=

    data;

    EVENTS.emit(

        "admin:projects",

        data

    );

    return data;

};

/*==================================================
CREATE
==================================================*/

Admin.createProject=

async function(

    project

){

    const response=

    await fetch(

        `${

            this.config.api

        }/projects`,

        {

            method:"POST",

            headers:

            this.headers(),

            body:

            JSON.stringify(

                project

            )

        }

    );

    const data=

    await response.json();

    this.projects

    .items.push(

        data

    );

    EVENTS.emit(

        "admin:project:create",

        data

    );

    return data;

};

/*==================================================
UPDATE
==================================================*/

Admin.updateProject=

async function(

    id,

    project

){

    const response=

    await fetch(

        `${

            this.config.api

        }/projects/${

            id

        }`,

        {

            method:"PUT",

            headers:

            this.headers(),

            body:

            JSON.stringify(

                project

            )

        }

    );

    const updated=

    await response.json();

    const index=

    this.projects

    .items.findIndex(

        item=>

        item.id===id

    );

    if(

        index>-1

    ){

        this.projects

        .items[index]=

        updated;

    }

    EVENTS.emit(

        "admin:project:update",

        updated

    );

    return updated;

};

/*==================================================
DELETE
==================================================*/

Admin.deleteProject=

async function(

    id

){

    await fetch(

        `${

            this.config.api

        }/projects/${

            id

        }`,

        {

            method:"DELETE",

            headers:

            this.headers()

        }

    );

    this.projects.items=

    this.projects.items

    .filter(

        project=>

        project.id!==id

    );

    EVENTS.emit(

        "admin:project:delete",

        id

    );

};

/*==================================================
FIND
==================================================*/

Admin.project=

function(

    id

){

    return this.projects

    .items.find(

        item=>

        item.id===id

    );

};

/*==================================================
READY
==================================================*/

EVENTS.on(

    "admin:login",

    ()=>{

        Admin

        .loadProjects();

        Log.info(

            "Project Manager Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    ADMIN.JS
    PART 04 — BLOG & ARTICLE MANAGEMENT ENGINE

======================================================================*/

/*==================================================
BLOG
==================================================*/

Admin.blog={

    posts:[]

};

/*==================================================
LOAD
==================================================*/

Admin.loadPosts=

async function(){

    const response=

    await fetch(

        `${

            this.config.api

        }/posts`,

        {

            headers:

            this.headers()

        }

    );

    const posts=

    await response.json();

    this.blog.posts=

    posts;

    EVENTS.emit(

        "admin:posts",

        posts

    );

    return posts;

};

/*==================================================
CREATE
==================================================*/

Admin.createPost=

async function(

    post

){

    const response=

    await fetch(

        `${

            this.config.api

        }/posts`,

        {

            method:"POST",

            headers:

            this.headers(),

            body:

            JSON.stringify(

                post

            )

        }

    );

    const created=

    await response.json();

    this.blog.posts.push(

        created

    );

    EVENTS.emit(

        "admin:post:create",

        created

    );

    return created;

};

/*==================================================
UPDATE
==================================================*/

Admin.updatePost=

async function(

    id,

    post

){

    const response=

    await fetch(

        `${

            this.config.api

        }/posts/${

            id

        }`,

        {

            method:"PUT",

            headers:

            this.headers(),

            body:

            JSON.stringify(

                post

            )

        }

    );

    const updated=

    await response.json();

    const index=

    this.blog.posts

    .findIndex(

        item=>

        item.id===id

    );

    if(

        index>-1

    ){

        this.blog.posts[

            index

        ]=updated;

    }

    EVENTS.emit(

        "admin:post:update",

        updated

    );

    return updated;

};

/*==================================================
DELETE
==================================================*/

Admin.deletePost=

async function(

    id

){

    await fetch(

        `${

            this.config.api

        }/posts/${

            id

        }`,

        {

            method:"DELETE",

            headers:

            this.headers()

        }

    );

    this.blog.posts=

    this.blog.posts.filter(

        post=>

        post.id!==id

    );

    EVENTS.emit(

        "admin:post:delete",

        id

    );

};

/*==================================================
DRAFTS
==================================================*/

Admin.drafts=

function(){

    return this.blog.posts.filter(

        post=>

        post.status===

        "draft"

    );

};

/*==================================================
PUBLISHED
==================================================*/

Admin.published=

function(){

    return this.blog.posts.filter(

        post=>

        post.status===

        "published"

    );

};

/*==================================================
READY
==================================================*/

EVENTS.on(

    "admin:login",

    ()=>{

        Admin.loadPosts();

        Log.info(

            "Blog Manager Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    ADMIN.JS
    PART 05 — MEDIA LIBRARY & ASSET MANAGER

======================================================================*/

/*==================================================
MEDIA
==================================================*/

Admin.media={

    files:[],

    folders:[]

};

/*==================================================
LOAD
==================================================*/

Admin.loadMedia=

async function(){

    const response=

    await fetch(

        `${

            this.config.api

        }/media`,

        {

            headers:

            this.headers()

        }

    );

    const files=

    await response.json();

    this.media.files=

    files;

    EVENTS.emit(

        "admin:media",

        files

    );

    return files;

};

/*==================================================
UPLOAD
==================================================*/

Admin.uploadMedia=

async function(

    file

){

    const form=

    new FormData();

    form.append(

        "file",

        file

    );

    const response=

    await fetch(

        `${

            this.config.api

        }/media`,

        {

            method:"POST",

            headers:{

                Authorization:

                `Bearer ${

                    this.token

                }`

            },

            body:form

        }

    );

    const asset=

    await response.json();

    this.media.files.push(

        asset

    );

    EVENTS.emit(

        "admin:media:upload",

        asset

    );

    return asset;

};

/*==================================================
DELETE
==================================================*/

Admin.deleteMedia=

async function(

    id

){

    await fetch(

        `${

            this.config.api

        }/media/${

            id

        }`,

        {

            method:"DELETE",

            headers:

            this.headers()

        }

    );

    this.media.files=

    this.media.files.filter(

        file=>

        file.id!==id

    );

    EVENTS.emit(

        "admin:media:delete",

        id

    );

};

/*==================================================
SEARCH
==================================================*/

Admin.searchMedia=

function(

    keyword

){

    keyword=

    keyword

    .toLowerCase();

    return this.media

    .files.filter(

        file=>

        file.name

        ?.toLowerCase()

        .includes(

            keyword

        )

    );

};

/*==================================================
BY TYPE
==================================================*/

Admin.mediaType=

function(

    type

){

    return this.media

    .files.filter(

        file=>

        file.type===

        type

    );

};

/*==================================================
STORAGE
==================================================*/

Admin.storageUsage=

function(){

    return this.media

    .files.reduce(

        (

            total,

            file

        )=>

        total+

        (

            file.size||

            0

        ),

        0

    );

};

/*==================================================
READY
==================================================*/

EVENTS.on(

    "admin:login",

    ()=>{

        Admin

        .loadMedia();

        Log.info(

            "Media Library Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    ADMIN.JS
    PART 06 — ANALYTICS & DASHBOARD ENGINE

======================================================================*/

/*==================================================
ANALYTICS
==================================================*/

Admin.analytics={

    overview:{},

    visitors:[],

    pageviews:[],

    devices:[],

    countries:[]

};

/*==================================================
LOAD
==================================================*/

Admin.loadAnalytics=

async function(

    range="30d"

){

    const response=

    await fetch(

        `${

            this.config.api

        }/analytics?range=${

            range

        }`,

        {

            headers:

            this.headers()

        }

    );

    const data=

    await response.json();

    this.analytics=

    data;

    EVENTS.emit(

        "admin:analytics",

        data

    );

    return data;

};

/*==================================================
OVERVIEW
==================================================*/

Admin.overview=

function(){

    return this.analytics

    .overview;

};

/*==================================================
TOP PAGES
==================================================*/

Admin.topPages=

function(

    limit=10

){

    return(

        this.analytics

        .pageviews||

        []

    )

    .sort(

        (

            a,

            b

        )=>

        b.views-

        a.views

    )

    .slice(

        0,

        limit

    );

};

/*==================================================
TOP COUNTRIES
==================================================*/

Admin.topCountries=

function(

    limit=10

){

    return(

        this.analytics

        .countries||

        []

    )

    .sort(

        (

            a,

            b

        )=>

        b.visitors-

        a.visitors

    )

    .slice(

        0,

        limit

    );

};

/*==================================================
DEVICES
==================================================*/

Admin.deviceStats=

function(){

    return this.analytics

    .devices||

    [];

};

/*==================================================
REALTIME
==================================================*/

Admin.realtime=

async function(){

    const response=

    await fetch(

        `${

            this.config.api

        }/analytics/realtime`,

        {

            headers:

            this.headers()

        }

    );

    return await

    response.json();

};

/*==================================================
REFRESH
==================================================*/

Admin.refreshAnalytics=

function(){

    return this.loadAnalytics();

};

/*==================================================
READY
==================================================*/

EVENTS.on(

    "admin:login",

    ()=>{

        Admin

        .loadAnalytics();

        Log.info(

            "Analytics Dashboard Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    ADMIN.JS
    PART 07 — CONTACT INBOX & CRM ENGINE

======================================================================*/

/*==================================================
INBOX
==================================================*/

Admin.inbox={

    messages:[],

    unread:0

};

/*==================================================
LOAD
==================================================*/

Admin.loadInbox=

async function(){

    const response=

    await fetch(

        `${

            this.config.api

        }/messages`,

        {

            headers:

            this.headers()

        }

    );

    const messages=

    await response.json();

    this.inbox.messages=

    messages;

    this.inbox.unread=

    messages.filter(

        item=>

        !item.read

    ).length;

    EVENTS.emit(

        "admin:inbox",

        messages

    );

    return messages;

};

/*==================================================
GET
==================================================*/

Admin.message=

function(

    id

){

    return this.inbox

    .messages.find(

        item=>

        item.id===id

    );

};

/*==================================================
MARK READ
==================================================*/

Admin.markRead=

async function(

    id

){

    await fetch(

        `${

            this.config.api

        }/messages/${

            id

        }/read`,

        {

            method:"PUT",

            headers:

            this.headers()

        }

    );

    const message=

    this.message(

        id

    );

    if(

        message&&

        !message.read

    ){

        message.read=true;

        this.inbox.unread--;

    }

    EVENTS.emit(

        "admin:message:read",

        id

    );

};

/*==================================================
DELETE
==================================================*/

Admin.deleteMessage=

async function(

    id

){

    await fetch(

        `${

            this.config.api

        }/messages/${

            id

        }`,

        {

            method:"DELETE",

            headers:

            this.headers()

        }

    );

    this.inbox.messages=

    this.inbox.messages

    .filter(

        item=>

        item.id!==id

    );

    EVENTS.emit(

        "admin:message:delete",

        id

    );

};

/*==================================================
SEARCH
==================================================*/

Admin.searchMessages=

function(

    keyword

){

    keyword=

    keyword

    .toLowerCase();

    return this.inbox

    .messages.filter(

        message=>

        JSON.stringify(

            message

        )

        .toLowerCase()

        .includes(

            keyword

        )

    );

};

/*==================================================
STAR
==================================================*/

Admin.starMessage=

function(

    id,

    value=true

){

    const message=

    this.message(

        id

    );

    if(

        message

    ){

        message.starred=

        value;

    }

};

/*==================================================
READY
==================================================*/

EVENTS.on(

    "admin:login",

    ()=>{

        Admin

        .loadInbox();

        Log.info(

            "Inbox & CRM Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    ADMIN.JS
    PART 08 — SETTINGS & SYSTEM CONFIGURATION ENGINE

======================================================================*/

/*==================================================
SETTINGS
==================================================*/

Admin.settings={

    theme:"dark",

    language:"en",

    timezone:"UTC",

    notifications:true,

    maintenance:false,

    seo:{},

    social:{}

};

/*==================================================
LOAD
==================================================*/

Admin.loadSettings=

async function(){

    const response=

    await fetch(

        `${

            this.config.api

        }/settings`,

        {

            headers:

            this.headers()

        }

    );

    const data=

    await response.json();

    this.settings={

        ...this.settings,

        ...data

    };

    EVENTS.emit(

        "admin:settings",

        this.settings

    );

    return this.settings;

};

/*==================================================
SAVE
==================================================*/

Admin.saveSettings=

async function(

    settings

){

    const response=

    await fetch(

        `${

            this.config.api

        }/settings`,

        {

            method:"PUT",

            headers:

            this.headers(),

            body:

            JSON.stringify(

                settings

            )

        }

    );

    const data=

    await response.json();

    this.settings={

        ...this.settings,

        ...data

    };

    EVENTS.emit(

        "admin:settings:update",

        this.settings

    );

    return data;

};

/*==================================================
SET
==================================================*/

Admin.setSetting=

function(

    key,

    value

){

    this.settings[

        key

    ]=value;

};

/*==================================================
GET
==================================================*/

Admin.getSetting=

function(

    key

){

    return this.settings[

        key

    ];

};

/*==================================================
RESET
==================================================*/

Admin.resetSettings=

function(){

    this.settings={

        theme:"dark",

        language:"en",

        timezone:"UTC",

        notifications:true,

        maintenance:false,

        seo:{},

        social:{}

    };

};

/*==================================================
EXPORT
==================================================*/

Admin.exportSettings=

function(){

    return JSON.stringify(

        this.settings,

        null,

        4

    );

};

/*==================================================
IMPORT
==================================================*/

Admin.importSettings=

function(

    json

){

    this.settings={

        ...this.settings,

        ...JSON.parse(

            json

        )

    };

};

/*==================================================
READY
==================================================*/

EVENTS.on(

    "admin:login",

    ()=>{

        Admin

        .loadSettings();

        Log.info(

            "System Settings Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    ADMIN.JS
    PART 09 — BACKUP, EXPORT & DEPLOYMENT ENGINE

======================================================================*/

/*==================================================
BACKUP
==================================================*/

Admin.backup={

    last:null,

    history:[]

};

/*==================================================
EXPORT DATABASE
==================================================*/

Admin.exportData=

async function(){

    const response=

    await fetch(

        `${

            this.config.api

        }/backup/export`,

        {

            headers:

            this.headers()

        }

    );

    const data=

    await response.json();

    this.backup.last=

    Date.now();

    this.backup.history.push({

        type:

        "export",

        created:

        this.backup.last

    });

    EVENTS.emit(

        "admin:backup:export",

        data

    );

    return data;

};

/*==================================================
IMPORT DATABASE
==================================================*/

Admin.importData=

async function(

    payload

){

    const response=

    await fetch(

        `${

            this.config.api

        }/backup/import`,

        {

            method:"POST",

            headers:

            this.headers(),

            body:

            JSON.stringify(

                payload

            )

        }

    );

    const data=

    await response.json();

    EVENTS.emit(

        "admin:backup:import",

        data

    );

    return data;

};

/*==================================================
DEPLOY
==================================================*/

Admin.deploy=

async function(){

    const response=

    await fetch(

        `${

            this.config.api

        }/deploy`,

        {

            method:"POST",

            headers:

            this.headers()

        }

    );

    const deployment=

    await response.json();

    EVENTS.emit(

        "admin:deploy",

        deployment

    );

    return deployment;

};

/*==================================================
BUILD STATUS
==================================================*/

Admin.buildStatus=

async function(){

    const response=

    await fetch(

        `${

            this.config.api

        }/deploy/status`,

        {

            headers:

            this.headers()

        }

    );

    return await

    response.json();

};

/*==================================================
ROLLBACK
==================================================*/

Admin.rollback=

async function(

    version

){

    const response=

    await fetch(

        `${

            this.config.api

        }/deploy/rollback`,

        {

            method:"POST",

            headers:

            this.headers(),

            body:

            JSON.stringify({

                version

            })

        }

    );

    return await

    response.json();

};

/*==================================================
AUTO SAVE
==================================================*/

Admin.autoBackup=

function(

    interval=

    86400000

){

    setInterval(

        ()=>{

            if(

                Admin

                .authenticated

            ){

                Admin

                .exportData();

            }

        },

        interval

    );

};

/*==================================================
READY
==================================================*/

EVENTS.on(

    "admin:login",

    ()=>{

        Admin

        .autoBackup();

        Log.info(

            "Backup & Deployment Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    ADMIN.JS
    PART 10 — FINALIZATION, GLOBAL API & ADMIN MANAGER

======================================================================*/

/*==================================================
VERSION
==================================================*/

Admin.version={

    module:

    "Admin",

    version:

    "1.0.0",

    build:

    "2026.08",

    author:

    "Director VISION"

};

/*==================================================
INFO
==================================================*/

Admin.info=

function(){

    return{

        initialized:

        this.initialized,

        authenticated:

        this.authenticated,

        user:

        this.user,

        projects:

        this.projects

        .items.length,

        posts:

        this.blog

        .posts.length,

        media:

        this.media

        .files.length,

        inbox:

        this.inbox

        .messages.length,

        unread:

        this.inbox

        .unread,

        analytics:

        !!this.analytics

        .overview

    };

};

/*==================================================
DESTROY
==================================================*/

Admin.destroy=

function(){

    this.logout();

    this.clear();

    this.projects

    .items=[];

    this.blog

    .posts=[];

    this.media

    .files=[];

    this.inbox

    .messages=[];

    this.analytics={};

    this.resetSettings();

};

/*==================================================
EXPORT
==================================================*/

window.$admin=

Object.freeze({

    engine:

    Admin,

    login:

    credentials=>

    Admin.login(

        credentials

    ),

    logout:

    ()=>Admin.logout(),

    info:

    ()=>Admin.info(),

    projects:

    ()=>Admin.projects

    .items,

    posts:

    ()=>Admin.blog

    .posts,

    media:

    ()=>Admin.media

    .files,

    inbox:

    ()=>Admin.inbox

    .messages,

    settings:

    ()=>Admin.settings

});

/*==================================================
AUTO CLEANUP
==================================================*/

window.addEventListener(

    "beforeunload",

    ()=>{

        Admin.destroy();

    }

);

/*==================================================
READY
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        Log.success(

            "Admin Module Complete"

        );

    }

);

/*==================================================
MODULE COMPLETE
==================================================*/

EVENTS.emit(

    "admin:initialized"

);

/*==================================================
ADMIN.JS COMPLETE
==================================================*/

Log.success(

`
═══════════════════════════════════════════════

 Director VISION
 Luxury Cinematic Portfolio

 ADMIN.JS BUILD COMPLETE

 Version : 1.0.0
 Build   : 2026.08

 Modules Included

 ✓ Admin Core
 ✓ Authentication
 ✓ Project Manager
 ✓ Blog Manager
 ✓ Media Library
 ✓ Analytics Dashboard
 ✓ Contact Inbox / CRM
 ✓ Settings Manager
 ✓ Backup & Deployment
 ✓ Global Admin API

 Global APIs

 ✓ Admin
 ✓ $admin

═══════════════════════════════════════════════
`
);
