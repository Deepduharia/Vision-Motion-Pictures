/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    AUDIO.JS
    PART 01 — AUDIO CORE ENGINE

======================================================================*/

const AudioEngine={

    initialized:false,

    context:null,

    listener:null,

    analyser:null,

    gain:null,

    source:null,

    audio:null,

    fftSize:512,

    data:null,

    playing:false,

    muted:false,

    volume:.75

};

/*==================================================
CREATE CONTEXT
==================================================*/

AudioEngine.createContext=

async function(){

    const AudioContext=

    window.AudioContext||

    window.webkitAudioContext;

    this.context=

    new AudioContext();

};

/*==================================================
ANALYSER
==================================================*/

AudioEngine.createAnalyser=

function(){

    this.analyser=

    this.context

    .createAnalyser();

    this.analyser.fftSize=

    this.fftSize;

    this.data=

    new Uint8Array(

        this.analyser

        .frequencyBinCount

    );

};

/*==================================================
GAIN
==================================================*/

AudioEngine.createGain=

function(){

    this.gain=

    this.context

    .createGain();

    this.gain.gain.value=

    this.volume;

};

/*==================================================
CONNECT
==================================================*/

AudioEngine.connect=

function(){

    this.gain.connect(

        this.analyser

    );

    this.analyser.connect(

        this.context

        .destination

    );

};

/*==================================================
LOAD
==================================================*/

AudioEngine.load=

async function(

    url

){

    this.audio=

    new Audio(

        url

    );

    this.audio.crossOrigin=

    "anonymous";

    this.source=

    this.context

    .createMediaElementSource(

        this.audio

    );

    this.source.connect(

        this.gain

    );

};

/*==================================================
INIT
==================================================*/

AudioEngine.init=

async function(){

    await this.createContext();

    this.createAnalyser();

    this.createGain();

    this.connect();

    this.initialized=true;

    Log.info(

        "Audio Engine Ready"

    );

};

/*==================================================
REGISTER
==================================================*/

registerModule(

    "AudioEngine",

    AudioEngine

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    AUDIO.JS
    PART 02 — PLAYBACK, CONTROLS & AUDIO STATE

======================================================================*/

/*==================================================
PLAY
==================================================*/

AudioEngine.play=

async function(){

    if(

        !this.audio

    ) return;

    await this.context

    .resume();

    await this.audio

    .play();

    this.playing=true;

    EVENTS.emit(

        "audio:play"

    );

};

/*==================================================
PAUSE
==================================================*/

AudioEngine.pause=

function(){

    if(

        !this.audio

    ) return;

    this.audio.pause();

    this.playing=false;

    EVENTS.emit(

        "audio:pause"

    );

};

/*==================================================
TOGGLE
==================================================*/

AudioEngine.toggle=

function(){

    this.playing

    ?this.pause()

    :this.play();

};

/*==================================================
STOP
==================================================*/

AudioEngine.stop=

function(){

    if(

        !this.audio

    ) return;

    this.audio.pause();

    this.audio.currentTime=0;

    this.playing=false;

    EVENTS.emit(

        "audio:stop"

    );

};

/*==================================================
SEEK
==================================================*/

AudioEngine.seek=

function(

    seconds

){

    if(

        !this.audio

    ) return;

    this.audio.currentTime=

    seconds;

};

/*==================================================
VOLUME
==================================================*/

AudioEngine.setVolume=

function(

    value

){

    this.volume=

    Utilities.clamp(

        value,

        0,

        1

    );

    this.gain.gain.value=

    this.volume;

    EVENTS.emit(

        "audio:volume",

        this.volume

    );

};

/*==================================================
MUTE
==================================================*/

AudioEngine.mute=

function(){

    this.muted=true;

    this.gain.gain.value=0;

};

/*==================================================
UNMUTE
==================================================*/

AudioEngine.unmute=

function(){

    this.muted=false;

    this.gain.gain.value=

    this.volume;

};

/*==================================================
TIME
==================================================*/

AudioEngine.time=

function(){

    return{

        current:

        this.audio

        ?.currentTime||

        0,

        duration:

        this.audio

        ?.duration||

        0

    };

};

/*==================================================
READY
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        Log.info(

            "Playback Engine Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    AUDIO.JS
    PART 03 — FREQUENCY ANALYSER & VISUALIZER ENGINE

======================================================================*/

/*==================================================
ANALYSE
==================================================*/

AudioEngine.analyse=

function(){

    if(

        !this.analyser

    ) return;

    this.analyser

    .getByteFrequencyData(

        this.data

    );

};

/*==================================================
WAVEFORM
==================================================*/

AudioEngine.waveform=

function(){

    const buffer=

    new Uint8Array(

        this.analyser

        .frequencyBinCount

    );

    this.analyser

    .getByteTimeDomainData(

        buffer

    );

    return buffer;

};

/*==================================================
AVERAGE
==================================================*/

AudioEngine.average=

function(){

    this.analyse();

    let total=0;

    for(

        let i=0;

        i<

        this.data.length;

        i++

    ){

        total+=

        this.data[i];

    }

    return total/

    this.data.length;

};

/*==================================================
BASS
==================================================*/

AudioEngine.bass=

function(){

    this.analyse();

    let total=0;

    for(

        let i=0;

        i<32;

        i++

    ){

        total+=

        this.data[i];

    }

    return total/32;

};

/*==================================================
MID
==================================================*/

AudioEngine.mid=

function(){

    this.analyse();

    let total=0;

    for(

        let i=32;

        i<96;

        i++

    ){

        total+=

        this.data[i];

    }

    return total/64;

};

/*==================================================
TREBLE
==================================================*/

AudioEngine.treble=

function(){

    this.analyse();

    let total=0;

    for(

        let i=96;

        i<

        this.data.length;

        i++

    ){

        total+=

        this.data[i];

    }

    return total/

    (

        this.data.length-

        96

    );

};

/*==================================================
UPDATE
==================================================*/

AudioEngine.update=

function(){

    gsap.ticker.add(

        ()=>{

            if(

                !this.playing

            ) return;

            EVENTS.emit(

                "audio:update",

                {

                    average:

                    this.average(),

                    bass:

                    this.bass(),

                    mid:

                    this.mid(),

                    treble:

                    this.treble()

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

        AudioEngine.update();

        Log.info(

            "Audio Visualizer Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    AUDIO.JS
    PART 04 — AUDIO REACTIVE ANIMATION ENGINE

======================================================================*/

/*==================================================
STATE
==================================================*/

AudioEngine.reactive={

    enabled:true,

    intensity:1,

    targets:[]

};

/*==================================================
REGISTER
==================================================*/

AudioEngine.registerReactive=

function(

    object,

    options={}

){

    this.reactive

    .targets.push({

        object,

        scale:

        options.scale||

        .004,

        rotate:

        options.rotate||

        .0015,

        glow:

        options.glow||

        .01

    });

};

/*==================================================
UPDATE OBJECTS
==================================================*/

AudioEngine.updateReactive=

function(

    data

){

    if(

        !this.reactive

        .enabled

    ) return;

    this.reactive

    .targets.forEach(

        item=>{

            if(

                !item.object

            ) return;

            const energy=

            data.average*

            this.reactive

            .intensity;

            if(

                item.object.scale

            ){

                const scale=

                1+

                energy*

                item.scale;

                gsap.to(

                    item.object.scale,

                    {

                        x:scale,

                        y:scale,

                        z:scale,

                        duration:.15,

                        overwrite:true

                    }

                );

            }

            if(

                item.object.rotation

            ){

                gsap.to(

                    item.object.rotation,

                    {

                        y:"+="+

                        energy*

                        item.rotate,

                        duration:.15,

                        overwrite:true

                    }

                );

            }

        }

    );

};

/*==================================================
BACKGROUND
==================================================*/

AudioEngine.background=

function(

    data

){

    document.documentElement

    .style.setProperty(

        "--audio-energy",

        data.average/

        255

    );

};

/*==================================================
EVENT
==================================================*/

EVENTS.on(

    "audio:update",

    data=>{

        AudioEngine

        .updateReactive(

            data

        );

        AudioEngine

        .background(

            data

        );

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

            .ThreeEngine&&

            ThreeEngine.hero

        ){

            ThreeEngine

            .hero

            .meshes

            .forEach(

                mesh=>{

                    AudioEngine

                    .registerReactive(

                        mesh

                    );

                }

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

        Log.info(

            "Audio Reactive Engine Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    AUDIO.JS
    PART 05 — SPATIAL AUDIO & 3D POSITIONAL SOUND

======================================================================*/

/*==================================================
STATE
==================================================*/

AudioEngine.spatial={

    enabled:true,

    listeners:[],

    sounds:[]

};

/*==================================================
LISTENER
==================================================*/

AudioEngine.createListener=

function(){

    if(

        !window.ThreeEngine||

        !ThreeEngine.camera

    ) return;

    this.listener=

    new THREE.AudioListener();

    ThreeEngine.camera.add(

        this.listener

    );

};

/*==================================================
POSITIONAL
==================================================*/

AudioEngine.createPositional=

function(

    object,

    url

){

    if(

        !this.listener||

        !object

    ) return;

    const sound=

    new THREE.PositionalAudio(

        this.listener

    );

    const loader=

    new THREE.AudioLoader();

    loader.load(

        url,

        buffer=>{

            sound.setBuffer(

                buffer

            );

            sound.setLoop(

                true

            );

            sound.setRefDistance(

                2

            );

            sound.setMaxDistance(

                25

            );

            sound.setRolloffFactor(

                2

            );

            sound.setVolume(

                .6

            );

        }

    );

    object.add(

        sound

    );

    this.sounds.push(

        sound

    );

};

/*==================================================
MASTER VOLUME
==================================================*/

AudioEngine.masterVolume=

function(

    value

){

    if(

        !this.listener

    ) return;

    this.listener

    .setMasterVolume(

        Utilities.clamp(

            value,

            0,

            1

        )

    );

};

/*==================================================
UPDATE
==================================================*/

AudioEngine.updateSpatial=

function(){

    if(

        !window

        .ThreeEngine

    ) return;

    gsap.ticker.add(

        ()=>{

            if(

                ThreeEngine

                .camera

            ){

                ThreeEngine

                .camera

                .updateMatrixWorld();

            }

        }

    );

};

/*==================================================
STOP
==================================================*/

AudioEngine.stopSpatial=

function(){

    this.sounds.forEach(

        sound=>{

            if(

                sound.isPlaying

            ){

                sound.stop();

            }

        }

    );

};

/*==================================================
READY
==================================================*/

EVENTS.on(

    "three:initialized",

    ()=>{

        AudioEngine

        .createListener();

        AudioEngine

        .updateSpatial();

        Log.info(

            "Spatial Audio Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    AUDIO.JS
    PART 06 — PLAYLIST, CROSSFADE & MUSIC MANAGER

======================================================================*/

/*==================================================
STATE
==================================================*/

AudioEngine.playlist={

    tracks:[],

    current:0,

    shuffle:false,

    repeat:true

};

/*==================================================
ADD
==================================================*/

AudioEngine.addTrack=

function(

    title,

    url

){

    this.playlist

    .tracks.push({

        title,

        url

    });

};

/*==================================================
LOAD CURRENT
==================================================*/

AudioEngine.loadCurrent=

async function(){

    const track=

    this.playlist

    .tracks[

        this.playlist

        .current

    ];

    if(

        !track

    ) return;

    if(

        this.audio

    ){

        this.stop();

    }

    await this.load(

        track.url

    );

    EVENTS.emit(

        "audio:track",

        track

    );

};

/*==================================================
NEXT
==================================================*/

AudioEngine.next=

async function(){

    if(

        !this.playlist

        .tracks.length

    ) return;

    this.playlist.current=

    (

        this.playlist.current+

        1

    )%

    this.playlist

    .tracks.length;

    await this.loadCurrent();

    this.play();

};

/*==================================================
PREVIOUS
==================================================*/

AudioEngine.previous=

async function(){

    if(

        !this.playlist

        .tracks.length

    ) return;

    this.playlist.current--;

    if(

        this.playlist.current<0

    ){

        this.playlist.current=

        this.playlist

        .tracks.length-1;

    }

    await this.loadCurrent();

    this.play();

};

/*==================================================
CROSSFADE
==================================================*/

AudioEngine.crossfade=

function(

    duration=1.5

){

    gsap.to(

        this.gain.gain,

        {

            value:0,

            duration:

            duration/2,

            onComplete:async()=>{

                await this.next();

                gsap.to(

                    this.gain.gain,

                    {

                        value:

                        this.volume,

                        duration:

                        duration/2

                    }

                );

            }

        }

    );

};

/*==================================================
AUTO NEXT
==================================================*/

AudioEngine.autoNext=

function(){

    if(

        !this.audio

    ) return;

    this.audio.onended=

    ()=>{

        if(

            this.playlist

            .repeat||

            this.playlist

            .tracks.length>1

        ){

            this.crossfade();

        }

    };

};

/*==================================================
READY
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        Log.info(

            "Playlist Manager Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    AUDIO.JS
    PART 07 — AUDIO EFFECTS, FILTERS & DSP ENGINE

======================================================================*/

/*==================================================
FILTERS
==================================================*/

AudioEngine.filters={

    lowpass:null,

    highpass:null,

    compressor:null,

    reverb:null,

    enabled:true

};

/*==================================================
LOWPASS
==================================================*/

AudioEngine.createLowpass=

function(){

    this.filters.lowpass=

    this.context

    .createBiquadFilter();

    this.filters.lowpass.type=

    "lowpass";

    this.filters.lowpass.frequency.value=

    18000;

};

/*==================================================
HIGHPASS
==================================================*/

AudioEngine.createHighpass=

function(){

    this.filters.highpass=

    this.context

    .createBiquadFilter();

    this.filters.highpass.type=

    "highpass";

    this.filters.highpass.frequency.value=

    30;

};

/*==================================================
COMPRESSOR
==================================================*/

AudioEngine.createCompressor=

function(){

    this.filters.compressor=

    this.context

    .createDynamicsCompressor();

    this.filters.compressor.threshold.value=

    -24;

    this.filters.compressor.knee.value=

    30;

    this.filters.compressor.ratio.value=

    12;

    this.filters.compressor.attack.value=

    .003;

    this.filters.compressor.release.value=

    .25;

};

/*==================================================
CHAIN
==================================================*/

AudioEngine.connectFilters=

function(){

    if(

        !this.source

    ) return;

    this.source.disconnect();

    this.source.connect(

        this.filters.highpass

    );

    this.filters.highpass.connect(

        this.filters.lowpass

    );

    this.filters.lowpass.connect(

        this.filters.compressor

    );

    this.filters.compressor.connect(

        this.gain

    );

};

/*==================================================
LOWPASS VALUE
==================================================*/

AudioEngine.lowpass=

function(

    frequency

){

    if(

        this.filters.lowpass

    ){

        this.filters.lowpass

        .frequency

        .setTargetAtTime(

            frequency,

            this.context.currentTime,

            .08

        );

    }

};

/*==================================================
HIGHPASS VALUE
==================================================*/

AudioEngine.highpass=

function(

    frequency

){

    if(

        this.filters.highpass

    ){

        this.filters.highpass

        .frequency

        .setTargetAtTime(

            frequency,

            this.context.currentTime,

            .08

        );

    }

};

/*==================================================
RESET
==================================================*/

AudioEngine.resetFilters=

function(){

    this.lowpass(

        18000

    );

    this.highpass(

        30

    );

};

/*==================================================
READY
==================================================*/

EVENTS.on(

    "audio:play",

    ()=>{

        AudioEngine

        .createLowpass();

        AudioEngine

        .createHighpass();

        AudioEngine

        .createCompressor();

        AudioEngine

        .connectFilters();

        Log.info(

            "DSP Engine Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    AUDIO.JS
    PART 08 — BEAT DETECTION & RHYTHM ENGINE

======================================================================*/

/*==================================================
STATE
==================================================*/

AudioEngine.beat={

    threshold:170,

    decay:.96,

    energy:0,

    last:0,

    bpm:0,

    beats:[],

    detected:false

};

/*==================================================
ENERGY
==================================================*/

AudioEngine.energy=

function(){

    const bass=

    this.bass();

    const mid=

    this.mid();

    return(

        bass*.75+

        mid*.25

    );

};

/*==================================================
DETECT
==================================================*/

AudioEngine.detectBeat=

function(){

    const now=

    performance.now();

    const energy=

    this.energy();

    this.beat.energy=

    this.beat.energy*

    this.beat.decay;

    if(

        energy>

        this.beat.threshold&&

        energy>

        this.beat.energy

    ){

        this.beat.energy=

        energy;

        this.beat.detected=true;

        this.beat.beats.push(

            now

        );

        EVENTS.emit(

            "audio:beat",

            {

                energy,

                time:now

            }

        );

    }

    else{

        this.beat.detected=false;

    }

};

/*==================================================
BPM
==================================================*/

AudioEngine.calculateBPM=

function(){

    const beats=

    this.beat.beats;

    if(

        beats.length<8

    ) return;

    const intervals=[];

    for(

        let i=1;

        i<beats.length;

        i++

    ){

        intervals.push(

            beats[i]-

            beats[i-1]

        );

    }

    const average=

    intervals.reduce(

        (a,b)=>a+b,

        0

    )/

    intervals.length;

    this.beat.bpm=

    Math.round(

        60000/

        average

    );

    if(

        beats.length>

        64

    ){

        beats.shift();

    }

};

/*==================================================
UPDATE
==================================================*/

AudioEngine.updateBeat=

function(){

    gsap.ticker.add(

        ()=>{

            if(

                !this.playing

            ) return;

            this.detectBeat();

            this.calculateBPM();

        }

    );

};

/*==================================================
PULSE
==================================================*/

EVENTS.on(

    "audio:beat",

    ()=>{

        document.documentElement

        .classList.add(

            "beat-active"

        );

        gsap.delayedCall(

            .12,

            ()=>{

                document

                .documentElement

                .classList.remove(

                    "beat-active"

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

        AudioEngine

        .updateBeat();

        Log.info(

            "Beat Detection Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    AUDIO.JS
    PART 09 — AUDIO VISUAL FX & SYNCHRONIZATION ENGINE

======================================================================*/

/*==================================================
STATE
==================================================*/

AudioEngine.visuals={

    enabled:true,

    intensity:1,

    targets:[]

};

/*==================================================
REGISTER
==================================================*/

AudioEngine.registerVisual=

function(

    element,

    options={}

){

    if(

        !element

    ) return;

    this.visuals

    .targets.push({

        element,

        scale:

        options.scale||

        .002,

        blur:

        options.blur||

        .03,

        opacity:

        options.opacity||

        .003

    });

};

/*==================================================
UPDATE
==================================================*/

AudioEngine.updateVisuals=

function(

    data

){

    if(

        !this.visuals

        .enabled

    ) return;

    const energy=

    data.average/

    255;

    this.visuals

    .targets.forEach(

        item=>{

            gsap.to(

                item.element,

                {

                    scale:

                    1+

                    energy*

                    item.scale*

                    100,

                    opacity:

                    .65+

                    energy*

                    item.opacity*

                    100,

                    filter:

                    `blur(${

                        energy*

                        item.blur*

                        100

                    }px)`,

                    duration:.15,

                    overwrite:true,

                    ease:

                    "power2.out"

                }

            );

        }

    );

};

/*==================================================
CSS VARIABLES
==================================================*/

AudioEngine.css=

function(

    data

){

    const root=

    document.documentElement;

    root.style.setProperty(

        "--audio-average",

        (

            data.average/

            255

        ).toFixed(3)

    );

    root.style.setProperty(

        "--audio-bass",

        (

            data.bass/

            255

        ).toFixed(3)

    );

    root.style.setProperty(

        "--audio-mid",

        (

            data.mid/

            255

        ).toFixed(3)

    );

    root.style.setProperty(

        "--audio-treble",

        (

            data.treble/

            255

        ).toFixed(3)

    );

};

/*==================================================
SYNC
==================================================*/

EVENTS.on(

    "audio:update",

    data=>{

        AudioEngine

        .updateVisuals(

            data

        );

        AudioEngine

        .css(

            data

        );

    }

);

/*==================================================
AUTO REGISTER
==================================================*/

EVENTS.on(

    "websiteReady",

    ()=>{

        document

        .querySelectorAll(

            "[data-audio-reactive]"

        )

        .forEach(

            element=>{

                AudioEngine

                .registerVisual(

                    element

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

        Log.info(

            "Audio Visual Sync Ready"

        );

    }

);
/*=====================================================================

    Director VISION
    Luxury Cinematic Portfolio

    AUDIO.JS
    PART 10 — FINALIZATION, GLOBAL API & AUDIO MANAGER

======================================================================*/

/*==================================================
VERSION
==================================================*/

AudioEngine.version={

    module:

    "Audio",

    version:

    "1.0.0",

    build:

    "2026.08",

    author:

    "Director VISION"

};

/*==================================================
DESTROY
==================================================*/

AudioEngine.destroy=

function(){

    this.stop();

    this.stopSpatial();

    this.source

    ?.disconnect();

    this.gain

    ?.disconnect();

    this.analyser

    ?.disconnect();

    this.filters

    .compressor

    ?.disconnect();

    this.filters

    .lowpass

    ?.disconnect();

    this.filters

    .highpass

    ?.disconnect();

    this.context

    ?.close();

};

/*==================================================
INFO
==================================================*/

AudioEngine.info=

function(){

    return{

        playing:

        this.playing,

        muted:

        this.muted,

        volume:

        this.volume,

        bpm:

        this.beat.bpm,

        average:

        this.average(),

        tracks:

        this.playlist

        .tracks.length,

        current:

        this.playlist

        .current

    };

};

/*==================================================
EXPORT
==================================================*/

window.$audio=

Object.freeze({

    engine:

    AudioEngine,

    play:

    ()=>AudioEngine.play(),

    pause:

    ()=>AudioEngine.pause(),

    stop:

    ()=>AudioEngine.stop(),

    toggle:

    ()=>AudioEngine.toggle(),

    next:

    ()=>AudioEngine.next(),

    previous:

    ()=>AudioEngine.previous(),

    volume:

    value=>

    AudioEngine.setVolume(

        value

    ),

    mute:

    ()=>AudioEngine.mute(),

    unmute:

    ()=>AudioEngine.unmute(),

    info:

    ()=>AudioEngine.info()

});

/*==================================================
AUTO CLEANUP
==================================================*/

window.addEventListener(

    "beforeunload",

    ()=>{

        AudioEngine

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

            "Audio Module Complete"

        );

    }

);

/*==================================================
MODULE COMPLETE
==================================================*/

EVENTS.emit(

    "audio:initialized"

);

/*==================================================
AUDIO.JS COMPLETE
==================================================*/

Log.success(

`
═══════════════════════════════════════════════

 Director VISION
 Luxury Cinematic Portfolio

 AUDIO.JS BUILD COMPLETE

 Version : 1.0.0
 Build   : 2026.08

 Modules Included

 ✓ Audio Core
 ✓ Playback Engine
 ✓ Frequency Analyzer
 ✓ Audio Reactive Engine
 ✓ Spatial Audio
 ✓ Playlist Manager
 ✓ DSP Filters
 ✓ Beat Detection
 ✓ Visual Synchronization
 ✓ Global Audio API

 Global APIs

 ✓ AudioEngine
 ✓ $audio

═══════════════════════════════════════════════
`
);
