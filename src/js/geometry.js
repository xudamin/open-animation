import {
  check
} from '../js/util'
export default function initGeometry(params) {
  let points = check(params.points, [])
  points.push(points[0])
  let height = check(params.height, 120)

  let positions = []
  let uvs = []
  for (let i = 0, j = positions.length, t = uvs.length; i < points.length - 1; i++) {
    let vUvyMax = 1
    let left = points[i]
    let right = points[i + 1]
    positions[j++] = left.x
    positions[j++] = left.y
    positions[j++] = 0
    uvs[t++] = 0
    uvs[t++] = 0

    positions[j++] = right.x
    positions[j++] = right.y
    positions[j++] = 0
    uvs[t++] = 1
    uvs[t++] = 0

    positions[j++] = left.x
    positions[j++] = left.y
    positions[j++] = height
    uvs[t++] = 0
    uvs[t++] = vUvyMax

    positions[j++] = left.x
    positions[j++] = left.y
    positions[j++] = height
    uvs[t++] = 0
    uvs[t++] = vUvyMax

    positions[j++] = right.x
    positions[j++] = right.y
    positions[j++] = 0
    uvs[t++] = 1
    uvs[t++] = 0

    positions[j++] = right.x
    positions[j++] = right.y
    positions[j++] = height
    uvs[t++] = 1
    uvs[t++] = vUvyMax
  }
  let geometry = new THREE.BufferGeometry()
  geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3))
  geometry.addAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), 2))
  return geometry
}
