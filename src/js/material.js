import {
  check
} from '../js/util'
import initShader from './shader'
export default function initMaterial(params) {
  let depthWrite = check(params.depthWrite, false)
  let depthTest = check(params.depthTest, true)
  let blending = check(params.blending, THREE.AdditiveBlending)
  let side = check(params.side, THREE.DoubleSide)
  let fog = check(params.fog, true)
  let transparent = check(params.transparent, true)
  let shader = initShader(params)
  let material = new THREE.ShaderMaterial({
    uniforms: shader.uniforms,
    vertexShader: shader.vertexShader,
    fragmentShader: shader.fragmentShader,
    blending: blending,
    depthWrite: depthWrite,
    depthTest: depthTest,
    side: side,
    fog: fog,
    transparent: transparent
  })
  return material
}
