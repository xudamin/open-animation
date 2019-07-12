import {
  check
} from './util'
export default function initShader(params) {
  let color = check(params.color, '#33CCFF')
  let opacity = check(params.opacity, 1)
  let hiz = check(params.hiz, 0.15)
  let useFloater = check(params.useFloater, false)
  let uniforms = THREE.UniformsUtils.merge([
    THREE.UniformsLib['fog'], {
      time: {
        type: 'f',
        value: 0.0
      },
      color: {
        type: 'c',
        value: new THREE.Color(color)
      },
      opacity: {
        type: 'f',
        value: opacity
      },
      hiz: {
        type: 'f',
        value: hiz
      },
      useFloater: {
        type: 'b',
        value: useFloater
      }
    }
  ])
  let vertexShader = `
    varying vec2 texCoord;
    ${THREE.ShaderChunk['fog_pars_vertex']}
    void main() {
      texCoord = uv;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * mvPosition;
      ${THREE.ShaderChunk['fog_vertex']}
    }`
  let fragmentShader = `
    precision lowp float;

    uniform float time;
    uniform vec3 color;
    uniform float hiz;
    uniform float opacity;
    uniform vec2 resolution;
    uniform bool useFloater;
    ${THREE.ShaderChunk['common']}
    ${THREE.ShaderChunk['fog_pars_fragment']}
    varying vec2 texCoord;
    
    float snow(vec2 uv,float scale) {
      float w=smoothstep(9.,0.,-uv.y*(scale/10.));
      if(w<.1)return 0.;
      uv.y-=time/scale;
      uv*=scale;
      vec2 s=floor(uv),f=fract(uv),p;
      float k=3.,d;
      p=.5+.35*sin(11.*fract(sin((s+p+scale)*mat2(7,3,6,5))*5.))-f;
      d=length(p);
      k=min(d,k);
      k=smoothstep(0.,k,sin(f.x+f.y)*0.01);
      return k*w;
    }

    void main()
    {
      vec2 uv = texCoord;

      float sin = sin((uv.y - time * hiz) / 0.025);
      float high = 0.9;
      float medium = 0.4;
      if (sin > high) {
        gl_FragColor = vec4( mix(vec3(.8, 1., 1.), color, (1.-sin)/(1.-high)), 1.);
      } else if(sin > medium) {
        gl_FragColor = vec4( color, mix(1., 0.15, 1.-(sin - medium)/(high-medium)));
      } else {
        gl_FragColor = vec4( color, 0.15);
      }
      vec3 fade = vec3(smoothstep(0.7,0.4,clamp(-(1.-uv.y)*.25+.8,0.,.75)), color.g, color.b);
      if (useFloater) {
        float c=snow(uv,30.)*.3;
        c+=snow(uv,20.)*.5;
        c+=snow(uv,15.)*.8;
        c+=snow(uv,10.);
        c+=snow(uv,8.);
        c+=snow(uv,6.);
        c+=snow(uv,5.);
        float modulo = mod(time, 10.0);
        if(modulo > 5.0) {
          modulo -= ((modulo - 5.0) * 2.0); 
        }
        modulo /= 5.0;
        modulo += 0.35;
        if(modulo > 1.0) {
          modulo = 1.0;
        }
        gl_FragColor += vec4(c * modulo, c * modulo, 0,c);
      }
      gl_FragColor += vec4(fade, fade.x * 2.0);
      gl_FragColor.a *= (1.-uv.y) * opacity;
      ${THREE.ShaderChunk['fog_fragment']}
    }`
  return {
    uniforms: uniforms,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader
  }
}
