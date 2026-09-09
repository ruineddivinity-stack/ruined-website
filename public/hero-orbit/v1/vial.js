import * as THREE from './vendor/three.module.min.js';
import {createOpticalGlass} from './glass.js?v=14';

const TAU=Math.PI*2;
export const VIAL_DIMENSIONS=Object.freeze({radius:.81,height:4.04,labelRadius:.818,labelHeight:2.20,labelCenter:-.45,neckRadius:.565,capRadius:.795});

export function createFinishTextures(){
  function grain(brushed,seed){
    const width=128,height=256,data=new Uint8Array(width*height*4);
    let state=seed;const noise=()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296;};
    for(let y=0;y<height;y++){
      const line=noise();
      for(let x=0;x<width;x++){
        const value=Math.round(255*(.38+.24*(brushed?.84*line+.16*noise():noise()))),i=(y*width+x)*4;
        data[i]=data[i+1]=data[i+2]=value;data[i+3]=255;
      }
    }
    const t=new THREE.DataTexture(data,width,height);t.wrapS=t.wrapT=THREE.RepeatWrapping;
    t.magFilter=THREE.LinearFilter;t.minFilter=THREE.LinearMipmapLinearFilter;t.generateMipmaps=true;t.needsUpdate=true;return t;
  }
  return{metal:grain(true,17),plastic:grain(false,31)};
}

function lathe(points,segments=128){
  const g=new THREE.LatheGeometry(points.map(([r,y])=>new THREE.Vector2(r,y)),segments);
  g.computeBoundingSphere();return g;
}

function glassGeometry(){
  // One closed cross-section supplies the outside, rolled base, inside wall and
  // neck lip. These are actual surfaces, so rear views need no photographic art.
  const p=new THREE.Path();
  p.moveTo(0,-1.89);p.lineTo(.53,-1.89);
  p.quadraticCurveTo(.81,-1.89,.81,-1.64);p.lineTo(.81,.56);
  p.quadraticCurveTo(.81,.88,.63,1.02);
  p.quadraticCurveTo(.565,1.08,.565,1.16);p.lineTo(.565,1.51);
  p.lineTo(.516,1.51);p.lineTo(.516,1.16);
  p.quadraticCurveTo(.516,1.05,.593,.98);
  p.quadraticCurveTo(.755,.84,.755,.56);p.lineTo(.755,-1.59);
  p.quadraticCurveTo(.755,-1.72,.54,-1.72);p.lineTo(0,-1.72);
  return new THREE.LatheGeometry(p.getPoints(16),128);
}

function labelMaterial(texture,label={},foilTexture){
  if(!foilTexture)throw new Error('The holographic foil material is missing.');
  const material=new THREE.MeshPhysicalMaterial({
    color:'#ffffff',map:texture||null,metalness:.72,roughness:.27,
    clearcoat:.52,clearcoatRoughness:.14,iridescence:.22,iridescenceIOR:1.40,
    iridescenceThicknessRange:[330,440],envMapIntensity:1.15
  });
  material.onBeforeCompile=shader=>{
    shader.uniforms.uFoilTexture={value:foilTexture};
    shader.fragmentShader=shader.fragmentShader.replace('#include <common>',`
      #include <common>
      uniform sampler2D uFoilTexture;
    `).replace('#include <map_fragment>',`
      #include <map_fragment>
      float foilMask=0.0;
      #ifdef USE_MAP
        vec2 labelUV=vec2(fract(vMapUv.x),vMapUv.y);
        float labelLuma=dot(diffuseColor.rgb,vec3(.2126,.7152,.0722));
        // The complete supplied artwork is a black ink mask over holographic
        // stock. Light lettering and the lower logo expose the same foil.
        foilMask=smoothstep(.015,.93,labelLuma);
        diffuseColor.rgb=vec3(.002);
      #endif
    `).replace('#include <roughnessmap_fragment>',`
      #include <roughnessmap_fragment>
      roughnessFactor=mix(.48,.27,foilMask);
    `).replace('#include <metalnessmap_fragment>',`
      #include <metalnessmap_fragment>
      metalnessFactor=mix(.015,.72,foilMask);
    `).replace('#include <lights_physical_fragment>',`
      #ifdef USE_MAP
        // The foil grain and colors are bonded to the printed label. Only
        // physical lighting and the angle-dependent coating response change.
        vec2 foilUV=vec2(labelUV.x*2.0,.12+.76*labelUV.y);
        // Filter the foil microtexture independently of the original print.
        // The holographic color bands remain; fine cracks and grain soften.
        vec3 holographicStock=texture2D(uFoilTexture,foilUV,1.5).rgb;
        diffuseColor.rgb=mix(diffuseColor.rgb,holographicStock,foilMask);
      #endif
      #include <lights_physical_fragment>
      #ifdef USE_MAP
        material.iridescence=.22*foilMask;
        material.iridescenceThickness=385.0;
        material.clearcoat=mix(.065,.52,foilMask);
        material.clearcoatRoughness=mix(.32,.14,foilMask);
      #endif
    `);
  };
  material.customProgramCacheKey=()=>'ruined-smooth-holographic-stock-v12';
  material.userData.fullWrap=true;material.userData.holographicStock=true;material.userData.product=label.name;
  return material;
}

export function createVial({labelTexture,label:labelInfo,foilTexture,finishes=createFinishTextures()}={}){
  const group=new THREE.Group();group.name='360-degree Ruined RX vial';
  const glass=createOpticalGlass({thickness:.11,refraction:.11});
  const aluminum=new THREE.MeshPhysicalMaterial({
    color:'#c9cdd3',metalness:1,roughness:.27,anisotropy:.70,
    bumpMap:finishes.metal,bumpScale:.003,
    clearcoat:.16,clearcoatRoughness:.25,envMapIntensity:1.3
  });
  const plastic=new THREE.MeshPhysicalMaterial({
    color:'#e5e6e9',metalness:0,roughness:.43,clearcoat:.20,
    bumpMap:finishes.plastic,bumpScale:.0015,
    clearcoatRoughness:.34,envMapIntensity:.65
  });
  function part(name,geometry,material,shadow=true){
    const mesh=new THREE.Mesh(geometry,material);mesh.name=name;
    mesh.castShadow=shadow;mesh.receiveShadow=shadow;group.add(mesh);return mesh;
  }
  part('Hollow glass body and thick rounded base',glassGeometry(),glass,false);
  part('Rubber closure beneath cap',new THREE.CylinderGeometry(.538,.542,.14,96),new THREE.MeshStandardMaterial({color:'#141820',roughness:.78})).position.y=1.53;
  part('Crimped aluminum collar',lathe([
    [.54,1.43],[.68,1.43],[.735,1.45],[.75,1.475],[.75,1.50],
    [.741,1.515],[.75,1.53],[.75,1.855],[.739,1.88],
    [.69,1.895],[.54,1.895],[.54,1.43]
  ]),aluminum);
  part('Rounded white flip-off cap',lathe([
    [0,1.90],[.69,1.90],[.775,1.91],[.794,1.933],[.795,2.107],
    [.788,2.132],[.755,2.15],[0,2.15]
  ]),plastic);
  part('Cap lower bevel',new THREE.TorusGeometry(.780,.008,10,128),plastic).rotation.x=Math.PI/2;
  group.children.at(-1).position.y=1.923;
  for(const y of [1.19,1.365]){
    const ring=part('Fine glass neck molding',new THREE.TorusGeometry(.565,.008,10,128),glass,false);
    ring.rotation.x=Math.PI/2;ring.position.y=y;
  }
  const d=VIAL_DIMENSIONS;
  const label=part('Cylindrical wraparound label',new THREE.CylinderGeometry(d.labelRadius,d.labelRadius,d.labelHeight,160,1,true,Math.PI,TAU),labelMaterial(labelTexture,labelInfo,foilTexture));
  label.position.y=d.labelCenter;
  return{group,label};
}
