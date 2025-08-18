'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

const fragmentShader = `
  uniform float u_time;
  uniform vec2 u_mouse;
  uniform vec2 u_resolution;

  vec2 hash( vec2 p ) {
    p = vec2( dot(p,vec2(127.1,311.7)),
              dot(p,vec2(269.5,183.3)) );
    return -1.0 + 2.0*fract(sin(p)*43758.5453123);
  }

  float noise( in vec2 p ) {
    vec2 i = floor( p );
    vec2 f = fract( p );
    
    vec2 u = f*f*(3.0-2.0*f);

    return mix( mix( dot( hash( i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ), 
                     dot( hash( i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                mix( dot( hash( i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ), 
                     dot( hash( i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 5; i++) {
      value += amplitude * noise(p);
      p *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    st.x *= u_resolution.x / u_resolution.y;

    vec2 mouse_normalized = u_mouse / u_resolution;
    float mouse_dist = distance(st, mouse_normalized * vec2(u_resolution.x / u_resolution.y, 1.0));
    vec2 warp = (mouse_normalized - st) * 0.2 / (mouse_dist + 0.1);
    
    vec2 p = st * 3.0 + warp;

    p.x += u_time * 0.05;

    float cloud_pattern = fbm(p);
    
    vec3 sky_color_top = vec3(0.1, 0.2, 0.4); 
    vec3 sky_color_bottom = vec3(0.66, 0.76, 1.0);
    
    vec3 sky_color = mix(sky_color_bottom, sky_color_top, st.y);
    
    float cloud_coverage = smoothstep(0.4, 0.6, cloud_pattern);
    vec3 cloud_color = vec3(1.0) * cloud_coverage;
    
    vec3 final_color = mix(sky_color, vec3(1.0), cloud_coverage * 0.7);

    gl_FragColor = vec4(final_color, 1.0);
  }
`;

function Scene() {
  const shaderRef = useRef();
  const { viewport, size } = useThree();

  const uniforms = useMemo(
    () => ({
      u_time: { value: 0.0 },
      u_mouse: { value: new THREE.Vector2(0, 0) },
      u_resolution: { value: new THREE.Vector2(size.width, size.height) },
    }),
    [size]
  );
  
  useFrame(({ clock, mouse }) => {
    if (shaderRef.current) {
      shaderRef.current.uniforms.u_time.value = clock.getElapsedTime();
      shaderRef.current.uniforms.u_mouse.value.set(
        (mouse.x * 0.5 + 0.5) * size.width,
        (mouse.y * 0.5 + 0.5) * size.height
      );
    }
  });

  return (
    <>
      <mesh>
        <planeGeometry args={[viewport.width, viewport.height]} />
        <shaderMaterial
          ref={shaderRef}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
        />
      </mesh>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <EffectComposer>
        <Bloom luminanceThreshold={0.3} luminanceSmoothing={0.9} height={300} intensity={0.8} />
      </EffectComposer>
    </>
  );
}

export default function SkyBackground() {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10">
      <Canvas>
        <Scene />
      </Canvas>
    </div>
  );
}