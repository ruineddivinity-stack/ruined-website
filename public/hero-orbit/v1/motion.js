// Seeded targets make the drift irregular but repeatable. The animation clock
// owns time, so pausing, changing speed and resuming never reseed the motion.
function randomTarget(index,seed){
  let n=Math.imul(index+1,0x9e3779b1)^seed;
  n=Math.imul(n^(n>>>16),0x85ebca6b);
  n=Math.imul(n^(n>>>13),0xc2b2ae35);
  return((n^(n>>>16))>>>0)/4294967295;
}

export function createMotionChannel({seed,interval,min,max,initial}){
  const targets=[initial],areas=[0],state={value:initial,elapsed:0};
  function target(index){
    while(targets.length<=index){
      const i=targets.length;
      targets.push(min+(max-min)*randomTarget(i,seed));
    }
    return targets[index];
  }
  return time=>{
    const at=Math.max(0,time)/interval,index=Math.floor(at),fraction=at-index;
    // Integrate each eased speed segment exactly, rather than multiplying the
    // current speed by total time (which would jump when a target changes).
    while(areas.length<=index){
      const i=areas.length-1;
      areas.push(areas[i]+interval*(target(i)+target(i+1))*.5);
    }
    const a=target(index),b=target(index+1),f=fraction;
    const eased=f*f*f*(f*(f*6-15)+10);
    const integral=f*f*f*f*(2.5+f*(f-3));
    state.value=a+(b-a)*eased;
    state.elapsed=areas[index]+interval*(a*f+(b-a)*integral);
    return state;
  };
}
