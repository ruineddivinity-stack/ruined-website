import * as THREE from './vendor/three.module.min.js';
import {createOrbitalModel,makeEnvironment,createLightingRig} from './model.js?v=14';
import {VIAL_LABELS} from './labels.js?v=8';

const canvas=document.querySelector('#scene'),loading=document.querySelector('#loading');
const play=document.querySelector('#play'),playLabel=document.querySelector('#play-label');
const speedInput=document.querySelector('#speed'),speedOutput=document.querySelector('#speed-value');
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
document.body.classList.toggle('embedded',new URLSearchParams(location.search).get('embed')==='1');
let paused=reducedMotion.matches,speed=Number(speedInput.value),ready=false,hidden=document.hidden;
let renderer,scene,camera,model,lights,time=0,previous=0,dirty=true,raf=0;
let drag=null,orbitX=0,orbitY=0,goalX=0,goalY=0,baseDistance=12;
let disposed=false,slowFrames=0,qualityAdjusted=false,hostVisible=true,failed=false;
const notifyHost=status=>{if(window.parent!==window)window.parent.postMessage({type:'ruined-rx-hero',status,paused},location.origin);};
function syncVisibility(){hidden=document.hidden||!hostVisible;previous=0;if(hidden){cancelAnimationFrame(raf);raf=0;}else{dirty=true;schedule();}}
window.addEventListener('message',event=>{
  if(event.origin!==location.origin||event.source!==window.parent||event.data?.type!=='ruined-rx-hero')return;
  if(event.data.command==='status')notifyHost(failed?'error':ready?'ready':'loading');
  if(event.data.command==='visibility'&&typeof event.data.visible==='boolean'){hostVisible=event.data.visible;syncVisibility();}
  if(event.data.command==='pause'&&ready){paused=true;updatePlay();}
  if(event.data.command==='play'&&ready){paused=false;updatePlay();schedule();}
});
const resources=[];

function updatePlay(){
  playLabel.textContent=paused?'Play':'Pause';
  notifyHost('state');
  play.setAttribute('aria-label',paused?'Play animation':'Pause animation');
  document.querySelector('#pause-icon').innerHTML=paused?'<path d="m7 4 9 6-9 6Z"/>':'<path d="M7 5v10M13 5v10"/>';
}
updatePlay();
play.addEventListener('click',()=>{paused=!paused;updatePlay();dirty=true;});
speedInput.addEventListener('input',()=>{speed=Number(speedInput.value);speedOutput.textContent=`${Number(speed.toFixed(2))}×`;speedInput.setAttribute('aria-valuetext',`${speed} times speed`);});
reducedMotion.addEventListener('change',()=>{if(reducedMotion.matches){paused=true;updatePlay();dirty=true;}});
document.addEventListener('visibilitychange',syncVisibility);
document.querySelector('#retry').addEventListener('click',()=>location.reload());
document.querySelector('#expand').addEventListener('click',async()=>{
  try{if(document.fullscreenElement)await document.exitFullscreen();else if(document.documentElement.requestFullscreen)await document.documentElement.requestFullscreen();else throw new Error('Fullscreen unavailable');}
  catch{const notice=document.querySelector('#notice');notice.textContent='Full screen is unavailable in this browser.';setTimeout(()=>notice.textContent='',4000);}
});
document.addEventListener('fullscreenchange',()=>{
  const expanded=Boolean(document.fullscreenElement),button=document.querySelector('#expand');
  button.setAttribute('aria-label',expanded?'Exit full screen':'Enter full screen');button.querySelector('span').textContent=expanded?'Exit full screen':'Full screen';
});

function fail(message){
  ready=false;failed=true;cancelAnimationFrame(raf);notifyHost('error');raf=0;
  canvas.classList.remove('ready');loading.hidden=true;document.querySelector('#fallback').hidden=false;
  document.querySelector('#error-message').textContent=message;document.querySelector('.playback').hidden=true;
}
canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();fail('The 3D preview was interrupted. Reload to resume.');});

function resize(){
  if(!renderer||!camera)return;
  const w=canvas.clientWidth,h=canvas.clientHeight;if(!w||!h)return;
  camera.aspect=w/h;
  // Keep the close glass folds and three rotating products together in frame.
  const width=camera.aspect<.8?4.7:6.1;
  baseDistance=Math.max(12.8,width/(2*Math.tan(THREE.MathUtils.degToRad(camera.fov)/2)*camera.aspect));
  model?.layout(camera.aspect);
  camera.updateProjectionMatrix();renderer.setSize(w,h,false);dirty=true;
}
canvas.addEventListener('pointerdown',e=>{if(!ready||e.button>0)return;drag={x:e.clientX,y:e.clientY,gx:goalX,gy:goalY};canvas.setPointerCapture(e.pointerId);});
canvas.addEventListener('pointermove',e=>{if(!drag)return;goalX=THREE.MathUtils.clamp(drag.gx-(e.clientX-drag.x)*.0008,-.075,.075);goalY=THREE.MathUtils.clamp(drag.gy+(e.clientY-drag.y)*.0006,-.045,.045);dirty=true;});
const endDrag=()=>{drag=null;goalX=0;goalY=0;dirty=true;};
canvas.addEventListener('pointerup',endDrag);canvas.addEventListener('pointercancel',endDrag);canvas.addEventListener('lostpointercapture',endDrag);

function schedule(){if(!raf&&!hidden&&ready&&!disposed)raf=requestAnimationFrame(frame);}
function frame(now){
  raf=0;if(hidden||!ready||disposed)return;
  const rawDelta=previous?(now-previous)/1000:0,dt=Math.min(rawDelta,.05);previous=now;
  if(!paused)time+=dt*speed;
  const ease=reducedMotion.matches?1:1-Math.exp(-dt*5);
  if(Math.abs(orbitX-goalX)+Math.abs(orbitY-goalY)>.0001){orbitX+=(goalX-orbitX)*ease;orbitY+=(goalY-orbitY)*ease;dirty=true;}
  if(!paused||dirty){
    model.update(time);
    lights.update(time,model.vials);
    scene.environmentRotation.set(.24*Math.sin(time*.67),time*.56+.20*Math.sin(time*.91),.19*Math.cos(time*.73));
    camera.position.set(Math.sin(orbitX)*baseDistance,Math.sin(orbitY)*baseDistance,Math.cos(orbitX)*Math.cos(orbitY)*baseDistance);
    camera.lookAt(0,0,0);renderer.render(scene,camera);dirty=false;
  }
  if(!paused&&rawDelta>.038&&rawDelta<.3&&!qualityAdjusted)slowFrames++;
  else slowFrames=Math.max(0,slowFrames-1);
  if(slowFrames>90){renderer.setPixelRatio(Math.min(devicePixelRatio,1));renderer.transmissionResolutionScale=.5;renderer.shadowMap.enabled=false;scene.traverse(o=>{if(o.material)o.material.needsUpdate=true;});resize();qualityAdjusted=true;}
  schedule();
}

async function init(){
  try{
    renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'high-performance'});
    const mobile=matchMedia('(pointer:coarse)').matches;
    renderer.setPixelRatio(Math.min(devicePixelRatio,mobile?1.5:1.8));
    renderer.setClearColor('#000000',0);renderer.outputColorSpace=THREE.SRGBColorSpace;
    renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.0;
    renderer.shadowMap.enabled=!mobile;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    renderer.transmissionResolutionScale=mobile ? 0.65 : 1;
    scene=new THREE.Scene();camera=new THREE.PerspectiveCamera(34,1,.1,100);camera.position.set(0,0,16.2);
    const pmrem=new THREE.PMREMGenerator(renderer),studio=makeEnvironment();
    const environment=pmrem.fromScene(studio,.006,.1,30);scene.environment=environment.texture;scene.environmentIntensity=.95;
    resources.push(environment);studio.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});pmrem.dispose();
    lights=createLightingRig(scene);
    const loader=new THREE.TextureLoader();
    const anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
    const [labelTextures,foilTexture]=await Promise.all([Promise.all(VIAL_LABELS.map(async label=>{
      if(!label.url)throw new Error('A full label asset is missing.');
      const t=await loader.loadAsync(new URL(label.url,import.meta.url).href);
      t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=anisotropy;
      t.wrapS=THREE.RepeatWrapping;t.offset.x=label.offset;
      resources.push(t);return t;
    })),loader.loadAsync(new URL('./assets/materials/holographic-foil-v10.png',import.meta.url).href).then(t=>{
      t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=anisotropy;
      t.wrapS=THREE.MirroredRepeatWrapping;t.wrapT=THREE.ClampToEdgeWrapping;
      resources.push(t);return t;
    })]);
    if(disposed){[...labelTextures,foilTexture].forEach(t=>t?.dispose());return;}
    model=createOrbitalModel({labelTextures,labelMetadata:VIAL_LABELS,foilTexture});scene.add(model.root);resources.push(...model.resources);
    resize();model.update(0);lights.update(0,model.vials);camera.position.z=baseDistance;camera.lookAt(0,0,0);await renderer.compileAsync(scene,camera);
    if(disposed)return;
    renderer.render(scene,camera);ready=true;loading.hidden=true;canvas.classList.add('ready');notifyHost('ready');schedule();
    window.ruinedOrbit=Object.freeze({pause(){paused=true;updatePlay();},play(){paused=false;updatePlay();schedule();},setSpeed(value){if(!Number.isFinite(value))return;speed=THREE.MathUtils.clamp(value,Number(speedInput.min),Number(speedInput.max));speedInput.value=String(speed);speedOutput.textContent=`${speed}×`;speedInput.setAttribute('aria-valuetext',`${speed} times speed`);},getState(){return{ready,paused,speed,time};}});
  }catch(error){console.error('Ruined RX 3D preview:',error);fail('This device could not start the 3D preview. Try a browser with WebGL enabled.');}
}
const observer=new ResizeObserver(resize);observer.observe(canvas);
window.addEventListener('pagehide',event=>{
  if(event.persisted)return;
  disposed=true;cancelAnimationFrame(raf);observer.disconnect();
  scene?.traverse(o=>{o.geometry?.dispose();o.shadow?.map?.dispose();if(o.material){for(const m of Array.isArray(o.material)?o.material:[o.material])m.dispose();}});
  for(const item of resources)item.dispose();renderer?.dispose();
});
init();
