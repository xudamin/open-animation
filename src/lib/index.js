import initGeometry from '../js/geometry'
import initMaterial from '../js/material'
import {
  check
} from '../js/util'
export default function initMesh(params) {
  let renderOrder = check(params.renderOrder, 2)
  let object = new THREE.Object3D()
  object.renderOrder = renderOrder
  let geometry = initGeometry(params)
  let material = initMaterial(params)
  let wall = new THREE.Mesh(geometry, material)
  wall.renderOrder = renderOrder
  object.update = function(time) {
    wall.material.uniforms.time.value = time
  }
  object.add(wall)
  return object
}
