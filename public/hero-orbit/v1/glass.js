import * as THREE from './vendor/three.module.min.js';
import {createMotionChannel} from './motion.js?v=14';

export function createOpticalGlass({thickness=.12,refraction=.12}={}){
  const material=new THREE.MeshPhysicalMaterial({
    color:'#ffffff',metalness:0,roughness:.022,transmission:1,thickness,
    ior:1.52,dispersion:1.65,attenuationColor:'#ffffff',attenuationDistance:8,
    clearcoat:.18,clearcoatRoughness:.03,envMapIntensity:1.65,
    iridescence:.24,iridescenceIOR:1.30,iridescenceThicknessRange:[180,430],
    side:THREE.DoubleSide
  });
  // Retain screen-space scene refraction, and include studio lights outside the
  // frame through three wavelength-dependent refracted environment samples.
  // Unlit directions contribute black: there is no body fill or emissive glow.
  material.onBeforeCompile=shader=>{
    shader.fragmentShader=shader.fragmentShader.replace('#include <transmission_fragment>',`
      #include <transmission_fragment>
      #if defined(USE_TRANSMISSION) && defined(ENVMAP_TYPE_CUBE_UV)
        vec3 opticalNormal=inverseTransformDirection(normal,viewMatrix);
        vec3 opticalIncident=normalize(vWorldPosition-cameraPosition);
        vec3 rayR=envMapRotation*refract(opticalIncident,opticalNormal,1.0/1.496);
        vec3 rayG=envMapRotation*refract(opticalIncident,opticalNormal,1.0/1.520);
        vec3 rayB=envMapRotation*refract(opticalIncident,opticalNormal,1.0/1.552);
        vec3 spectrum=vec3(
          textureCubeUV(envMap,rayR,material.roughness).r,
          textureCubeUV(envMap,rayG,material.roughness).g,
          textureCubeUV(envMap,rayB,material.roughness).b);
        float opticalFresnel=.04+.96*pow(1.0-clamp(dot(-opticalIncident,opticalNormal),0.0,1.0),5.0);
        totalDiffuse+=spectrum*envMapIntensity*material.transmission*(1.0-opticalFresnel)*${refraction.toFixed(4)};
      #endif
    `);
  };
  material.customProgramCacheKey=()=>'ruined-dark-optics-v6-'+refraction;
  return material;
}

const PATHS=[
  // Inclined tracks cross the actual vial silhouettes on their front passes,
  // then return behind the bodies. Small height offsets on the front passes
  // leave the printed peptide-name lines between the two arcs.
  {points:[[-3.35,.45,-.15],[-2.65,-.38,1.55],[-.80,-1.10,2.35],[1.20,-.78,2.20],[2.85,.32,1.20],[3.35,1.20,-.65],[2.30,.95,-2.30],[.30,.45,-2.65],[-1.90,.55,-2.05],[-3.15,.85,-1.25]],width:.90,depth:.18,phase:.2},
  {points:[[-3.50,-.70,-1.55],[-2.60,-1.05,-2.85],[-.20,-.55,-3.15],[2.00,.30,-2.80],[3.60,1.00,-1.70],[3.85,1.25,.20],[2.45,1.28,2.35],[0,1.16,3.05],[-2.65,.98,2.15],[-3.85,-.20,.10]],width:.82,depth:.17,phase:2.1}
];

const TAU=Math.PI*2,TABLE_STEPS=768,ALONG=224,ACROSS=24,STRIDE=ACROSS+1;
export const GLASS_ORBITS=Object.freeze([
  {period:14.5,direction:1,arc:.80,phase:0},
  {period:19.0,direction:-1,arc:.74,phase:.38}
]);

function orbitTable(setting){
  const curve=new THREE.CatmullRomCurve3(setting.points.map(p=>new THREE.Vector3(...p)),true);
  curve.arcLengthDivisions=1536;curve.updateArcLengths();
  const frames=curve.computeFrenetFrames(TABLE_STEPS,true);
  const points=Array.from({length:TABLE_STEPS+1},(_,i)=>curve.getPointAt(i/TABLE_STEPS));
  return{points,normals:frames.normals,binormals:frames.binormals,clearance:new Float32Array(TABLE_STEPS+1)};
}

function orbitGeometry(table,width){
  const count=(ALONG+1)*STRIDE+2,positions=new Float32Array(count*3),uvs=[],indices=[];
  for(let i=0;i<=ALONG;i++)for(let j=0;j<=ACROSS;j++){
    uvs.push(i/ALONG,j/ACROSS);
    if(i<ALONG&&j<ACROSS){const k=i*STRIDE+j,n=k+STRIDE;indices.push(k,k+1,n,n,k+1,n+1);}
  }
  for(const row of [0,ALONG]){
    const center=(ALONG+1)*STRIDE+(row===0?0:1);uvs.push(row/ALONG,.5);
    for(let j=0;j<ACROSS;j++){const a=row*STRIDE+j,b=a+1;if(row===0)indices.push(center,b,a);else indices.push(center,a,b);}
  }
  const g=new THREE.BufferGeometry();
  g.setAttribute('position',new THREE.BufferAttribute(positions,3).setUsage(THREE.DynamicDrawUsage));
  g.setAttribute('normal',new THREE.BufferAttribute(new Float32Array(count*3),3).setUsage(THREE.DynamicDrawUsage));
  g.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));g.setIndex(indices);
  // A fixed bound contains every pose of the traveling arc.
  g.boundingBox=new THREE.Box3().setFromPoints(table.points).expandByScalar(width);
  g.boundingSphere=g.boundingBox.getBoundingSphere(new THREE.Sphere());
  return g;
}

export function createGlassSculpture(){
  const root=new THREE.Group();root.name='Glass arcs orbiting around the vial trio';
  const clocks=[
    {orbit:createMotionChannel({seed:421,interval:3.8,min:.62,max:1.40,initial:1}),surface:createMotionChannel({seed:937,interval:4.6,min:.72,max:1.25,initial:1}),drift:createMotionChannel({seed:1429,interval:6.5,min:-.29,max:-.23,initial:0})},
    {orbit:createMotionChannel({seed:1951,interval:5.2,min:.70,max:1.32,initial:1}),surface:createMotionChannel({seed:3163,interval:6.1,min:.74,max:1.24,initial:1}),drift:createMotionChannel({seed:2477,interval:8.1,min:.14,max:.22,initial:0})}
  ];
  // A restrained shared sway preserves the separation between the tracks.
  // Each arc still has its own circulation and folding rhythm.
  const sway=[
    createMotionChannel({seed:1103,interval:6.8,min:-.014,max:.014,initial:0}),
    createMotionChannel({seed:2081,interval:8.6,min:-.045,max:.045,initial:0}),
    createMotionChannel({seed:3221,interval:7.7,min:-.010,max:.010,initial:0})
  ];
  const tables=PATHS.map(orbitTable);
  // The cross-section narrows where the paths approach one another.
  // This bound remains valid even when both arcs reach a crossing together.
  tables.forEach((table,i)=>table.points.forEach((point,k)=>{
    let distanceSquared=Infinity;
    for(const other of tables[1-i].points)distanceSquared=Math.min(distanceSquared,point.distanceToSquared(other));
    table.clearance[k]=Math.max(.012,Math.sqrt(distanceSquared)*.45-.035);
  }));
  const folds=PATHS.map((s,i)=>{
    const mesh=new THREE.Mesh(orbitGeometry(tables[i],s.width),createOpticalGlass({thickness:s.depth*1.8,refraction:.14}));
    mesh.name='Orbiting prismatic glass arc '+(i+1);root.add(mesh);return mesh;
  });
  const cosine=Array.from({length:STRIDE},(_,i)=>Math.cos(i/ACROSS*TAU));
  const sine=Array.from({length:STRIDE},(_,i)=>Math.sin(i/ACROSS*TAU));
  const center=new THREE.Vector3(),normal=new THREE.Vector3(),binormal=new THREE.Vector3();
  const worldPoint=new THREE.Vector3(),localPoint=new THREE.Vector3(),seamNormal=new THREE.Vector3();
  const firstPoint=new THREE.Vector3(),lastPoint=new THREE.Vector3();
  const keepouts=Array.from({length:3},()=>({inverse:new THREE.Matrix4(),scale:1}));
  let portrait=false,lastTime=NaN;

  function paint(mesh,table,setting,motion,orbitTime,surfaceTime,drift,count){
    const g=mesh.geometry,position=g.attributes.position;
    for(let i=0;i<=ALONG;i++){
      const t=i/ALONG,u=THREE.MathUtils.euclideanModulo(motion.phase+motion.direction*orbitTime/motion.period+t*motion.arc,1);
      const at=u*TABLE_STEPS,k=Math.floor(at),fraction=at-k;
      center.copy(table.points[k]).lerp(table.points[k+1],fraction);
      // Ease the front passes away from the names; retain the rear separation.
      center.y+=drift*THREE.MathUtils.smootherstep(center.z,0,1.4);
      normal.copy(table.normals[k]).lerp(table.normals[k+1],fraction).normalize();
      binormal.copy(table.binormals[k]).lerp(table.binormals[k+1],fraction).normalize();
      let radiusLimit=THREE.MathUtils.lerp(table.clearance[k],table.clearance[k+1],fraction)*(portrait?.86:1);
      worldPoint.copy(center).applyMatrix4(mesh.matrixWorld);
      for(let j=0;j<count;j++){
        const keepout=keepouts[j];localPoint.copy(worldPoint).applyMatrix4(keepout.inverse);
        const radial=Math.hypot(localPoint.x,localPoint.z)-.825;
        const vertical=Math.abs(localPoint.y-.13)-2.02;
        const distance=(Math.hypot(Math.max(radial,0),Math.max(vertical,0))+Math.min(Math.max(radial,vertical),0))*keepout.scale;
        radiusLimit=Math.min(radiusLimit,Math.max(.012,distance-.075));
      }
      const taper=.018+.982*Math.pow(Math.sin(Math.PI*t),.55);
      const halfWidth=Math.min(radiusLimit,setting.width*.5*taper*(.90+.18*Math.sin(t*TAU*1.3+surfaceTime*.50+setting.phase)));
      const halfDepth=Math.min(radiusLimit,setting.depth*.5*taper);
      const twist=.65*Math.sin(t*TAU+surfaceTime*.65+setting.phase)+.18*Math.cos(t*TAU*2-surfaceTime*.31);
      const c=Math.cos(twist),s=Math.sin(twist);
      for(let j=0;j<=ACROSS;j++){
        const x=halfWidth*cosine[j],y=halfDepth*sine[j],a=x*c-y*s,b=x*s+y*c;
        position.setXYZ(i*STRIDE+j,center.x+normal.x*a+binormal.x*b,center.y+normal.y*a+binormal.y*b,center.z+normal.z*a+binormal.z*b);
      }
      if(i===0)firstPoint.copy(center);if(i===ALONG)lastPoint.copy(center);
    }
    const start=(ALONG+1)*STRIDE;
    position.setXYZ(start,firstPoint.x,firstPoint.y,firstPoint.z);
    position.setXYZ(start+1,lastPoint.x,lastPoint.y,lastPoint.z);
    position.needsUpdate=true;g.computeVertexNormals();
    const normals=g.attributes.normal;
    for(let i=0;i<=ALONG;i++){
      const a=i*STRIDE,b=a+ACROSS;
      seamNormal.set(normals.getX(a)+normals.getX(b),normals.getY(a)+normals.getY(b),normals.getZ(a)+normals.getZ(b)).normalize();
      normals.setXYZ(a,seamNormal.x,seamNormal.y,seamNormal.z);normals.setXYZ(b,seamNormal.x,seamNormal.y,seamNormal.z);
    }
    normals.needsUpdate=true;
  }
  function update(time,vials=[]){
    if(time===lastTime)return;lastTime=time;
    root.rotation.set(sway[0](time).value,sway[1](time).value,sway[2](time).value);
    root.updateWorldMatrix(true,false);
    const count=Math.min(vials.length,keepouts.length);
    for(let i=0;i<count;i++){
      vials[i].updateWorldMatrix(true,false);
      keepouts[i].inverse.copy(vials[i].matrixWorld).invert();
      keepouts[i].scale=vials[i].matrixWorld.getMaxScaleOnAxis();
    }
    folds.forEach((mesh,i)=>{
      mesh.updateWorldMatrix(false,false);
      paint(mesh,tables[i],PATHS[i],GLASS_ORBITS[i],clocks[i].orbit(time).elapsed,clocks[i].surface(time).elapsed,clocks[i].drift(time).value,count);
      mesh.material.envMapIntensity=1.52+.22*Math.sin(time*(i?1.61:2.03)+i*2.6);
    });
  }
  return{root,folds,tables,layout(isPortrait){portrait=isPortrait;root.scale.set(portrait?.86:1,portrait?.93:1,1);lastTime=NaN;},update};
}
