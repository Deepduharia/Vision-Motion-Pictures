/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    AI.JS
    PART 01 — AI CORE ENGINE

======================================================================*/

const AI={

    initialized:false,

    enabled:true,

    apiKey:null,

    endpoint:"",

    model:"gpt-5.5",

    conversation:[],

    memory:[],

    cache:new Map(),

    settings:{

        temperature:.7,

        maxTokens:2048,

        stream:false

    }

};

/*==================================================
CONFIG
==================================================*/

AI.configure=function({

    apiKey,

    endpoint,

    model

}={}){

    this.apiKey=

    apiKey||

    this.apiKey;

    this.endpoint=

    endpoint||

    this.endpoint;

    this.model=

    model||

    this.model;

};

/*==================================================
MESSAGE
==================================================*/

AI.message=function(

    role,

    content

){

    this.conversation.push({

        role,

        content,

        time:

        Date.now()

    });

};

/*==================================================
CLEAR
==================================================*/

AI.clear=function(){

    this.conversation=[];

};

/*==================================================
CACHE
==================================================*/

AI.save=function(

    key,

    value

){

    this.cache.set(

        key,

        value

    );

};

AI.load=function(

    key

){

    return this.cache.get(

        key

    );

};

/*==================================================
INIT
==================================================*/

AI.init=async function(){

    this.initialized=true;

    Log.info(

        "AI Engine Ready"

    );

};

/*==================================================
REGISTER
==================================================*/

registerModule(

    "AI",

    AI

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    AI.JS
    PART 02 — OPENAI API CLIENT

======================================================================*/

/*==================================================
REQUEST
==================================================*/

AI.request=async function(

    prompt,

    options={}

){

    if(

        !this.apiKey||

        !this.endpoint

    ){

        throw new Error(

            "AI not configured."

        );

    }

    this.message(

        "user",

        prompt

    );

    const body={

        model:

        options.model||

        this.model,

        messages:

        this.conversation.map(

            item=>({

                role:

                item.role,

                content:

                item.content

            })

        ),

        temperature:

        options.temperature??

        this.settings

        .temperature,

        max_tokens:

        options.maxTokens??

        this.settings

        .maxTokens,

        stream:

        options.stream??

        this.settings

        .stream

    };

    const response=

    await fetch(

        this.endpoint,

        {

            method:"POST",

            headers:{

                Authorization:

                `Bearer ${

                    this.apiKey

                }`,

                "Content-Type":

                "application/json"

            },

            body:

            JSON.stringify(

                body

            )

        }

    );

    if(

        !response.ok

    ){

        throw new Error(

            "API Request Failed"

        );

    }

    const json=

    await response.json();

    const reply=

    json

    .choices?.[0]

    ?.message

    ?.content||

    "";

    this.message(

        "assistant",

        reply

    );

    return reply;

};

/*==================================================
PING
==================================================*/

AI.ping=async function(){

    try{

        await this.request(

            "Hello"

        );

        return true;

    }

    catch{

        return false;

    }

};

/*==================================================
READY
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        Log.info(

            "OpenAI Client Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    AI.JS
    PART 03 — KNOWLEDGE BASE & SEMANTIC SEARCH ENGINE

======================================================================*/

/*==================================================
KNOWLEDGE
==================================================*/

AI.knowledge={

    documents:[],

    index:new Map()

};

/*==================================================
ADD
==================================================*/

AI.addDocument=

function(

    id,

    title,

    content,

    metadata={}

){

    const document={

        id,

        title,

        content,

        metadata,

        created:

        Date.now()

    };

    this.knowledge

    .documents.push(

        document

    );

    this.knowledge

    .index.set(

        id,

        document

    );

};

/*==================================================
GET
==================================================*/

AI.document=

function(

    id

){

    return this.knowledge

    .index.get(

        id

    );

};

/*==================================================
SEARCH
==================================================*/

AI.search=

function(

    query

){

    const q=

    query

    .toLowerCase();

    return this.knowledge

    .documents

    .filter(

        document=>{

            return(

                document.title

                .toLowerCase()

                .includes(q)||

                document.content

                .toLowerCase()

                .includes(q)

            );

        }

    )

    .sort(

        (

            a,

            b

        )=>

        b.content

        .length-

        a.content

        .length

    );

};

/*==================================================
KEYWORDS
==================================================*/

AI.keywords=

function(

    query

){

    return query

    .toLowerCase()

    .replace(

        /[^\w\s]/g,

        ""

    )

    .split(

        /\s+/

    )

    .filter(

        Boolean

    );

};

/*==================================================
SEMANTIC
==================================================*/

AI.semantic=

function(

    query

){

    const words=

    this.keywords(

        query

    );

    return this.knowledge

    .documents

    .map(

        document=>{

            let score=0;

            words.forEach(

                word=>{

                    if(

                        document

                        .title

                        .toLowerCase()

                        .includes(

                            word

                        )

                    ){

                        score+=5;

                    }

                    if(

                        document

                        .content

                        .toLowerCase()

                        .includes(

                            word

                        )

                    ){

                        score++;

                    }

                }

            );

            return{

                score,

                document

            };

        }

    )

    .filter(

        item=>

        item.score>0

    )

    .sort(

        (

            a,

            b

        )=>

        b.score-

        a.score

    );

};

/*==================================================
READY
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        Log.info(

            "Knowledge Engine Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    AI.JS
    PART 04 — SMART PROMPT GENERATOR ENGINE

======================================================================*/

/*==================================================
PROMPTS
==================================================*/

AI.prompts={

    templates:new Map()

};

/*==================================================
REGISTER
==================================================*/

AI.registerPrompt=

function(

    name,

    template

){

    this.prompts

    .templates.set(

        name,

        template

    );

};

/*==================================================
GET
==================================================*/

AI.prompt=

function(

    name

){

    return this.prompts

    .templates.get(

        name

    );

};

/*==================================================
BUILD
==================================================*/

AI.buildPrompt=

function(

    name,

    variables={}

){

    let template=

    this.prompt(

        name

    );

    if(

        !template

    ) return "";

    Object.entries(

        variables

    ).forEach(

        ([

            key,

            value

        ])=>{

            template=

            template.replaceAll(

                `{{${key}}}`,

                value

            );

        }

    );

    return template;

};

/*==================================================
GENERATE
==================================================*/

AI.generate=

async function(

    template,

    variables={},

    options={}

){

    const prompt=

    this.buildPrompt(

        template,

        variables

    );

    return await

    this.request(

        prompt,

        options

    );

};

/*==================================================
DEFAULTS
==================================================*/

AI.defaults=

function(){

    this.registerPrompt(

        "cinematic",

`
Create an ultra-realistic cinematic concept.

Subject:
{{subject}}

Style:
{{style}}

Camera:
{{camera}}

Lighting:
{{lighting}}

Mood:
{{mood}}

Output in professional filmmaking language.

`

    );

    this.registerPrompt(

        "portfolio",

`
Write premium portfolio content.

Topic:

{{topic}}

Tone:

Luxury,
Minimal,
Professional,
Cinematic.

`

    );

    this.registerPrompt(

        "seo",

`
Generate advanced SEO content.

Keyword:

{{keyword}}

Include:

Title

Meta Description

Headings

Keywords

FAQ

`

    );

};

/*==================================================
READY
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        AI.defaults();

        Log.info(

            "Prompt Generator Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    AI.JS
    PART 05 — AI PORTFOLIO ASSISTANT ENGINE

======================================================================*/

/*==================================================
ASSISTANT
==================================================*/

AI.assistant={

    enabled:true,

    identity:{

        name:

        "Director VISION AI",

        role:

        "Creative Director"

    },

    suggestions:[]

};

/*==================================================
SYSTEM PROMPT
==================================================*/

AI.system=function(){

    return`

You are Director VISION AI.

You are a luxury cinematic
portfolio assistant.

Expertise:

• Film Direction
• Cinematography
• Screenwriting
• Editing
• Color Grading
• AI Filmmaking
• Creative Direction

Always answer professionally.

`;

};

/*==================================================
CHAT
==================================================*/

AI.chat=

async function(

    message

){

    this.clear();

    this.message(

        "system",

        this.system()

    );

    this.message(

        "user",

        message

    );

    return await

    this.request(

        message

    );

};

/*==================================================
SUGGESTIONS
==================================================*/

AI.defaultSuggestions=

function(){

    this.assistant

    .suggestions=[

        "Show latest projects",

        "Generate Midjourney prompt",

        "Write screenplay",

        "Create cinematic shot list",

        "Explain color grading",

        "Portfolio overview",

        "Book a meeting",

        "Contact Director"

    ];

};

/*==================================================
QUICK ACTION
==================================================*/

AI.quick=

async function(

    index

){

    const prompt=

    this.assistant

    .suggestions[

        index

    ];

    if(

        !prompt

    ) return "";

    return await

    this.chat(

        prompt

    );

};

/*==================================================
WELCOME
==================================================*/

AI.welcome=

function(){

    EVENTS.emit(

        "ai:welcome",

        {

            title:

            "Director VISION AI",

            message:

            "How can I help?"

        }

    );

};

/*==================================================
READY
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        AI.defaultSuggestions();

        AI.welcome();

        Log.info(

            "AI Portfolio Assistant Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    AI.JS
    PART 06 — PROJECT RECOMMENDER ENGINE

======================================================================*/

/*==================================================
PROJECTS
==================================================*/

AI.projects={

    items:[]

};

/*==================================================
REGISTER
==================================================*/

AI.addProject=

function(

    project

){

    this.projects

    .items.push({

        id:

        Utilities.uuid(),

        ...project

    });

};

/*==================================================
FILTER
==================================================*/

AI.findProjects=

function(

    keyword

){

    keyword=

    keyword

    .toLowerCase();

    return this.projects

    .items

    .filter(

        project=>{

            return(

                project.title

                ?.toLowerCase()

                .includes(

                    keyword

                )||

                project.tags

                ?.join(" ")

                .toLowerCase()

                .includes(

                    keyword

                )||

                project.category

                ?.toLowerCase()

                .includes(

                    keyword

                )

            );

        }

    );

};

/*==================================================
RECOMMEND
==================================================*/

AI.recommend=

function(

    interests=[]

){

    return this.projects

    .items

    .map(

        project=>{

            let score=0;

            interests

            .forEach(

                item=>{

                    if(

                        project.tags

                        ?.includes(

                            item

                        )

                    ){

                        score+=5;

                    }

                    if(

                        project.category===

                        item

                    ){

                        score+=10;

                    }

                }

            );

            return{

                score,

                project

            };

        }

    )

    .filter(

        item=>

        item.score>0

    )

    .sort(

        (

            a,

            b

        )=>

        b.score-

        a.score

    );

};

/*==================================================
FEATURED
==================================================*/

AI.featured=

function(

    count=3

){

    return this.projects

    .items

    .slice(

        0,

        count

    );

};

/*==================================================
RANDOM
==================================================*/

AI.randomProject=

function(){

    if(

        !this.projects

        .items.length

    ) return null;

    return this.projects

    .items[

        Utilities.random(

            0,

            this.projects

            .items.length-1

        )

    ];

};

/*==================================================
READY
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        Log.info(

            "Project Recommender Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    AI.JS
    PART 07 — SMART CONTACT & LEAD QUALIFICATION ENGINE

======================================================================*/

/*==================================================
LEADS
==================================================*/

AI.leads={

    items:[]

};

/*==================================================
CREATE
==================================================*/

AI.createLead=

function(

    data

){

    const lead={

        id:

        Utilities.uuid(),

        created:

        Date.now(),

        score:0,

        status:

        "new",

        ...data

    };

    lead.score=

    this.scoreLead(

        lead

    );

    this.leads

    .items.push(

        lead

    );

    EVENTS.emit(

        "ai:lead",

        lead

    );

    return lead;

};

/*==================================================
SCORE
==================================================*/

AI.scoreLead=

function(

    lead

){

    let score=0;

    if(

        lead.budget>=5000

    ) score+=30;

    if(

        lead.timeline&&

        lead.timeline<=30

    ) score+=20;

    if(

        lead.project

    ) score+=15;

    if(

        lead.email

    ) score+=10;

    if(

        lead.phone

    ) score+=10;

    if(

        lead.company

    ) score+=10;

    if(

        lead.country

    ) score+=5;

    return score;

};

/*==================================================
PRIORITY
==================================================*/

AI.priority=

function(

    score

){

    if(

        score>=70

    ) return"High";

    if(

        score>=40

    ) return"Medium";

    return"Low";

};

/*==================================================
SUMMARY
==================================================*/

AI.leadSummary=

function(

    lead

){

    return{

        id:

        lead.id,

        name:

        lead.name,

        project:

        lead.project,

        score:

        lead.score,

        priority:

        this.priority(

            lead.score

        ),

        status:

        lead.status

    };

};

/*==================================================
SEARCH
==================================================*/

AI.findLead=

function(

    keyword

){

    keyword=

    keyword

    .toLowerCase();

    return this.leads

    .items.filter(

        lead=>

        JSON.stringify(

            lead

        )

        .toLowerCase()

        .includes(

            keyword

        )

    );

};

/*==================================================
READY
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        Log.info(

            "Lead Qualification Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    AI.JS
    PART 08 — EMBEDDINGS & VECTOR SEARCH ENGINE

======================================================================*/

/*==================================================
STATE
==================================================*/

AI.embeddings={

    enabled:true,

    vectors:new Map(),

    dimensions:1536

};

/*==================================================
REGISTER
==================================================*/

AI.addVector=

function(

    id,

    vector,

    metadata={}

){

    this.embeddings

    .vectors.set(

        id,

        {

            vector,

            metadata

        }

    );

};

/*==================================================
DOT PRODUCT
==================================================*/

AI.dot=

function(

    a,

    b

){

    let sum=0;

    for(

        let i=0;

        i<a.length;

        i++

    ){

        sum+=

        a[i]*

        b[i];

    }

    return sum;

};

/*==================================================
MAGNITUDE
==================================================*/

AI.magnitude=

function(

    vector

){

    let sum=0;

    vector.forEach(

        value=>{

            sum+=

            value*

            value;

        }

    );

    return Math.sqrt(

        sum

    );

};

/*==================================================
COSINE
==================================================*/

AI.similarity=

function(

    a,

    b

){

    return(

        this.dot(

            a,

            b

        )/

        (

            this.magnitude(a)*

            this.magnitude(b)

        )

    );

};

/*==================================================
SEARCH
==================================================*/

AI.vectorSearch=

function(

    queryVector,

    limit=5

){

    return[

        ...this

        .embeddings

        .vectors

    ]

    .map(

        ([

            id,

            item

        ])=>{

            return{

                id,

                score:

                this

                .similarity(

                    queryVector,

                    item.vector

                ),

                metadata:

                item.metadata

            };

        }

    )

    .sort(

        (

            a,

            b

        )=>

        b.score-

        a.score

    )

    .slice(

        0,

        limit

    );

};

/*==================================================
REMOVE
==================================================*/

AI.removeVector=

function(

    id

){

    this.embeddings

    .vectors

    .delete(

        id

    );

};

/*==================================================
CLEAR
==================================================*/

AI.clearVectors=

function(){

    this.embeddings

    .vectors

    .clear();

};

/*==================================================
READY
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        Log.info(

            "Embedding Engine Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    AI.JS
    PART 09 — MEMORY, CONTEXT & CONVERSATION ENGINE

======================================================================*/

/*==================================================
MEMORY
==================================================*/

AI.memory={

    profile:{},

    history:[],

    context:[],

    maxHistory:50

};

/*==================================================
PROFILE
==================================================*/

AI.setProfile=

function(

    data={}

){

    this.memory.profile={

        ...this.memory.profile,

        ...data

    };

};

/*==================================================
CONTEXT
==================================================*/

AI.addContext=

function(

    key,

    value

){

    this.memory.context.push({

        key,

        value,

        created:

        Date.now()

    });

};

/*==================================================
MESSAGE
==================================================*/

AI.saveConversation=

function(

    role,

    content

){

    this.memory.history.push({

        role,

        content,

        timestamp:

        Date.now()

    });

    if(

        this.memory

        .history.length>

        this.memory

        .maxHistory

    ){

        this.memory

        .history.shift();

    }

};

/*==================================================
RECENT
==================================================*/

AI.recent=

function(

    limit=10

){

    return this.memory

    .history.slice(

        -limit

    );

};

/*==================================================
CONTEXT STRING
==================================================*/

AI.contextPrompt=

function(){

    return this.memory

    .context

    .map(

        item=>

        `${

            item.key

        }: ${

            item.value

        }`

    )

    .join(

        "\n"

    );

};

/*==================================================
RESET
==================================================*/

AI.resetMemory=

function(){

    this.memory.profile={};

    this.memory.context=[];

    this.memory.history=[];

};

/*==================================================
AUTO SAVE
==================================================*/

EVENTS.on(

    "ai:message",

    data=>{

        AI.saveConversation(

            data.role,

            data.content

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

            "Conversation Memory Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    AI.JS
    PART 10 — FINALIZATION, GLOBAL API & AI MANAGER

======================================================================*/

/*==================================================
VERSION
==================================================*/

AI.version={

    module:

    "AI",

    version:

    "1.0.0",

    build:

    "2026.08",

    model:

    AI.model,

    author:

    "Director VISION"

};

/*==================================================
INFO
==================================================*/

AI.info=

function(){

    return{

        initialized:

        this.initialized,

        enabled:

        this.enabled,

        model:

        this.model,

        conversations:

        this.conversation

        .length,

        documents:

        this.knowledge

        .documents.length,

        prompts:

        this.prompts

        .templates.size,

        projects:

        this.projects

        .items.length,

        leads:

        this.leads

        .items.length,

        vectors:

        this.embeddings

        .vectors.size

    };

};

/*==================================================
DESTROY
==================================================*/

AI.destroy=

function(){

    this.clear();

    this.resetMemory();

    this.clearVectors();

    this.cache.clear();

    this.knowledge

    .documents=[];

    this.knowledge

    .index.clear();

    this.projects

    .items=[];

    this.leads

    .items=[];

};

/*==================================================
EXPORT
==================================================*/

window.$ai=

Object.freeze({

    engine:

    AI,

    chat:

    message=>

    AI.chat(

        message

    ),

    search:

    query=>

    AI.search(

        query

    ),

    semantic:

    query=>

    AI.semantic(

        query

    ),

    recommend:

    interests=>

    AI.recommend(

        interests

    ),

    prompt:

    (

        name,

        variables

    )=>

    AI.generate(

        name,

        variables

    ),

    info:

    ()=>AI.info()

});

/*==================================================
AUTO CLEANUP
==================================================*/

window.addEventListener(

    "beforeunload",

    ()=>{

        AI.destroy();

    }

);

/*==================================================
READY
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        Log.success(

            "AI Module Complete"

        );

    }

);

/*==================================================
MODULE COMPLETE
==================================================*/

EVENTS.emit(

    "ai:initialized"

);

/*==================================================
AI.JS COMPLETE
==================================================*/

Log.success(

`
═══════════════════════════════════════════════

 Director VISION
 Luxury Cinematic Portfolio

 AI.JS BUILD COMPLETE

 Version : 1.0.0
 Build   : 2026.08

 Modules Included

 ✓ AI Core
 ✓ API Client
 ✓ Knowledge Base
 ✓ Semantic Search
 ✓ Prompt Generator
 ✓ Portfolio Assistant
 ✓ Project Recommender
 ✓ Lead Qualification
 ✓ Embeddings
 ✓ Memory Engine

 Global APIs

 ✓ AI
 ✓ $ai

═══════════════════════════════════════════════
`
);
