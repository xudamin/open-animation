<template>
  <div id="app">
    <div id="container">
    	<!-- 选中菜单结构 start-->
    	<div id="menu">
    		<button id="table">TABLE</button>
    		<button id="sphere">SPHERE</button>
    		<button id="sphere2">SPHERE2</button>
    		<button id="plane">PLANE</button>
    		<button id="helix">HELIX</button>
    		<button id="grid">GRID</button>
    	</div>
    	<!-- end -->
    </div>
  </div>
</template>

<script>
import * as THREE from 'three'
import Stats from 'stats.js'
import TWEEN from 'tween'
import initCSS3DRenderer from './js/CSS3DRenderer'
import OrbitControls from './js/OrbitControl'
export default {
  name: 'app',
  data() {
    return {
      box: null,
      boxId: 'container',
      stats: null,
      scene: null,
      camera: null,
      renderer: null,
      lights: null,
      lightWall: null,
      clock: null,

      objects: [],
      objLength: 0,
      targets: {
        grid: [],
        helix: [],
        table: [],
        sphere: []
      },
      table: [
        'H', 'Hydrogen', '1.00794', 1, 1,
        'He', 'Helium', '4.002602', 18, 1,
        'Li', 'Lithium', '6.941', 1, 2,
        'Be', 'Beryllium', '9.012182', 2, 2,
        'B', 'Boron', '10.811', 13, 2,
        'C', 'Carbon', '12.0107', 14, 2,
        'N', 'Nitrogen', '14.0067', 15, 2,
        'O', 'Oxygen', '15.9994', 16, 2,
        'F', 'Fluorine', '18.9984032', 17, 2,
        'Ne', 'Neon', '20.1797', 18, 2,
        'Na', 'Sodium', '22.98976...', 1, 3,
        'Mg', 'Magnesium', '24.305', 2, 3,
        'Al', 'Aluminium', '26.9815386', 13, 3,
        'Si', 'Silicon', '28.0855', 14, 3,
        'P', 'Phosphorus', '30.973762', 15, 3,
        'S', 'Sulfur', '32.065', 16, 3,
        'Cl', 'Chlorine', '35.453', 17, 3,
        'Ar', 'Argon', '39.948', 18, 3,
        'K', 'Potassium', '39.948', 1, 4,
        'Ca', 'Calcium', '40.078', 2, 4,
        'Sc', 'Scandium', '44.955912', 3, 4,
        'Ti', 'Titanium', '47.867', 4, 4,
        'V', 'Vanadium', '50.9415', 5, 4,
        'Cr', 'Chromium', '51.9961', 6, 4,
        'Mn', 'Manganese', '54.938045', 7, 4,
        'Fe', 'Iron', '55.845', 8, 4,
        'Co', 'Cobalt', '58.933195', 9, 4,
        'Ni', 'Nickel', '58.6934', 10, 4,
        'Cu', 'Copper', '63.546', 11, 4,
        'Zn', 'Zinc', '65.38', 12, 4,
        'Ga', 'Gallium', '69.723', 13, 4,
        'Ge', 'Germanium', '72.63', 14, 4,
        'As', 'Arsenic', '74.9216', 15, 4,
        'Se', 'Selenium', '78.96', 16, 4,
        'Br', 'Bromine', '79.904', 17, 4,
        'Kr', 'Krypton', '83.798', 18, 4,
        'Rb', 'Rubidium', '85.4678', 1, 5,
        'Sr', 'Strontium', '87.62', 2, 5,
        'Y', 'Yttrium', '88.90585', 3, 5,
        'Zr', 'Zirconium', '91.224', 4, 5,
        'Nb', 'Niobium', '92.90628', 5, 5,
        'Mo', 'Molybdenum', '95.96', 6, 5,
        'Tc', 'Technetium', '(98)', 7, 5,
        'Ru', 'Ruthenium', '101.07', 8, 5,
        'Rh', 'Rhodium', '102.9055', 9, 5,
        'Pd', 'Palladium', '106.42', 10, 5,
        'Ag', 'Silver', '107.8682', 11, 5,
        'Cd', 'Cadmium', '112.411', 12, 5,
        'In', 'Indium', '114.818', 13, 5,
        'Sn', 'Tin', '118.71', 14, 5,
        'Sb', 'Antimony', '121.76', 15, 5,
        'Te', 'Tellurium', '127.6', 16, 5,
        'I', 'Iodine', '126.90447', 17, 5,
        'Xe', 'Xenon', '131.293', 18, 5,
        'Cs', 'Caesium', '132.9054', 1, 6,
        'Ba', 'Barium', '132.9054', 2, 6,
        'La', 'Lanthanum', '138.90547', 4, 9,
        'Ce', 'Cerium', '140.116', 5, 9,
        'Pr', 'Praseodymium', '140.90765', 6, 9,
        'Nd', 'Neodymium', '144.242', 7, 9,
        'Pm', 'Promethium', '(145)', 8, 9,
        'Sm', 'Samarium', '150.36', 9, 9,
        'Eu', 'Europium', '151.964', 10, 9,
        'Gd', 'Gadolinium', '157.25', 11, 9,
        'Tb', 'Terbium', '158.92535', 12, 9,
        'Dy', 'Dysprosium', '162.5', 13, 9,
        'Ho', 'Holmium', '164.93032', 14, 9,
        'Er', 'Erbium', '167.259', 15, 9,
        'Tm', 'Thulium', '168.93421', 16, 9,
        'Yb', 'Ytterbium', '173.054', 17, 9,
        'Lu', 'Lutetium', '174.9668', 18, 9,
        'Hf', 'Hafnium', '178.49', 4, 6,
        'Ta', 'Tantalum', '180.94788', 5, 6,
        'W', 'Tungsten', '183.84', 6, 6,
        'Re', 'Rhenium', '186.207', 7, 6,
        'Os', 'Osmium', '190.23', 8, 6,
        'Ir', 'Iridium', '192.217', 9, 6,
        'Pt', 'Platinum', '195.084', 10, 6,
        'Au', 'Gold', '196.966569', 11, 6,
        'Hg', 'Mercury', '200.59', 12, 6,
        'Tl', 'Thallium', '204.3833', 13, 6,
        'Pb', 'Lead', '207.2', 14, 6,
        'Bi', 'Bismuth', '208.9804', 15, 6,
        'Po', 'Polonium', '(209)', 16, 6,
        'At', 'Astatine', '(210)', 17, 6,
        'Rn', 'Radon', '(222)', 18, 6,
        'Fr', 'Francium', '(223)', 1, 7,
        'Ra', 'Radium', '(226)', 2, 7,
        'Ac', 'Actinium', '(227)', 4, 10,
        'Th', 'Thorium', '232.03806', 5, 10,
        'Pa', 'Protactinium', '231.0588', 6, 10,
        'U', 'Uranium', '238.02891', 7, 10,
        'Np', 'Neptunium', '(237)', 8, 10,
        'Pu', 'Plutonium', '(244)', 9, 10,
        'Am', 'Americium', '(243)', 10, 10,
        'Cm', 'Curium', '(247)', 11, 10,
        'Bk', 'Berkelium', '(247)', 12, 10,
        'Cf', 'Californium', '(251)', 13, 10,
        'Es', 'Einstenium', '(252)', 14, 10,
        'Fm', 'Fermium', '(257)', 15, 10,
        'Md', 'Mendelevium', '(258)', 16, 10,
        'No', 'Nobelium', '(259)', 17, 10,
        'Lr', 'Lawrencium', '(262)', 18, 10,
        'Rf', 'Rutherfordium', '(267)', 4, 7,
        'Db', 'Dubnium', '(268)', 5, 7,
        'Sg', 'Seaborgium', '(271)', 6, 7,
        'Bh', 'Bohrium', '(272)', 7, 7,
        'Hs', 'Hassium', '(270)', 8, 7,
        'Mt', 'Meitnerium', '(276)', 9, 7,
        'Ds', 'Darmstadium', '(281)', 10, 7,
        'Rg', 'Roentgenium', '(280)', 11, 7,
        'Cn', 'Copernicium', '(285)', 12, 7,
        'Uut', 'Unutrium', '(284)', 13, 7,
        'Fl', 'Flerovium', '(289)', 14, 7,
        'Uup', 'Ununpentium', '(288)', 15, 7,
        'Lv', 'Livermorium', '(293)', 16, 7,
        'Uus', 'Ununseptium', '(294)', 17, 7,
        'Uuo', 'Ununoctium', '(294)', 18, 7
      ]
    }
  },
  created: function() {
    window.THREE = THREE
    window.TWEEN = TWEEN
    console.log(TWEEN)
  },
  mounted: function() {
    this.$nextTick(() => {
      this.prepare()
      this.init()
    })
  },
  methods: {
    prepare() {
      this.initRequestAnimationFrame()
      this.initBox()
      initCSS3DRenderer()
    },
    initRequestAnimationFrame() {
      window.requestNextAnimationFrame = (function() {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame ||
          function(callback, element) {
            let self = this
            let start = null
            let finish = null
            window.setTimeout(function() {
              start += new Date().getTime()
              callback(start)
              finish += new Date().getTime()
              self.timeout = 1000 / 60 - (finish - start)
            }, self.timeout)
          }
      })()
    },
    initBox() {
      this.box = document.getElementById(this.boxId)
      this.box.onselectstart = function() {
        return false
      }
    },
    bindResizeEvent() {
      window.addEventListener('resize', this.containerResize, false)
    },
    containerResize() {
      this.renderer.setSize(this.box.clientWidth, this.box.clientHeight)
      this.camera.aspect = this.box.clientWidth / this.box.clientHeight
      this.camera.updateProjectionMatrix()
    },
    init() {
      this.initStats()
      this.initClock()
      this.initScene()
      this.initCamera()
      this.initRenderer()
      this.initOrbitControls()
      this.initLights()
      this.initAxes()

      this.initList()
      this.initButton()

      this.$nextTick(() => {
        this.bindResizeEvent()
        this.animate()
      })
    },
    initStats() {
      this.stats = new Stats()
      this.stats.domElement.style.position = 'absolute'
      this.stats.domElement.style.left = '0px'
      this.stats.domElement.style.top = '0px'
      this.box.appendChild(this.stats.domElement)
    },
    initClock() {
      this.clock = new THREE.Clock()
    },
    initScene() {
      this.scene = new THREE.Scene()
    },
    initCamera() {
      this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 3000)
      this.camera.position.z = 3000
      this.camera.up.set(0, 0, 1)
      this.camera.lookAt(this.scene.position)
    },
    initRenderer() {
      let box = document.getElementById(`${this.boxId}`)
      // this.renderer = new THREE.WebGLRenderer({
      //   antialias: true
      // })
      this.renderer = new THREE.CSS3DRenderer()
      this.renderer.setSize(window.innerWidth, window.innerHeight)
      // this.renderer.autoClear = true
      // this.renderer.setClearColor(0x111111, 1.0)
      this.renderer.domElement.style.position = 'absolute'
      box.appendChild(this.renderer.domElement)
    },
    initOrbitControls() {
      this.orbitControls = new OrbitControls(this.camera, this.box)
      // 使动画循环使用时阻尼或自转 意思是否有惯性
      this.orbitControls.enableDamping = true
      // 动态阻尼系数 就是鼠标拖拽旋转灵敏度
      this.orbitControls.dampingFactor = 0.25
      // 是否可以缩放
      this.orbitControls.enableZoom = true
      // 是否自动旋转
      this.orbitControls.autoRotate = false
      // 设置相机距离原点的最远距离
      this.orbitControls.minDistance = 500
      // 设置相机距离原点的最远距离
      this.orbitControls.maxDistance = 6000
      // 是否开启右键拖拽
      this.orbitControls.enablePan = false
      console.log(this.orbitControls)
    },
    initLights() {
      let ambientLight = new THREE.AmbientLight(0x393939, 0.5)
      ambientLight.name = 'ambient'
      this.scene.add(ambientLight)
    },
    initList() {
      let i = 0
      let len = this.table.length
      for (; i < len; i += 5) {
        const element = document.createElement('div')
        element.className = 'element'
        element.style.backgroundColor = `rgba( 0, 127, 127, ${Math.random() * 0.5 + 0.25} )`

        const number = document.createElement('div')
        number.className = 'number'
        number.textContent = i / 5 + 1
        element.appendChild(number)

        const symbol = document.createElement('div')
        symbol.className = 'symbol'
        symbol.textContent = this.table[ i ]
        element.appendChild(symbol)

        const detail = document.createElement('div')
        detail.className = 'detail'
        detail.innerHTML = `${this.table[ i + 1 ]}<br/>${this.table[ i + 2 ]}`
        element.appendChild(detail)
        const object = new THREE.CSS3DObject(element)
        object.position.x = Math.random() * 4000 - 2000
        object.position.y = Math.random() * 4000 - 2000
        object.position.z = Math.random() * 4000 - 2000
        this.scene.add(object)
        this.objects.push(object)
      }
      this.objLength = this.objects.length
      this.createGridVertices()
      this.createTableVertices()
      this.createHelixVertices()
      this.createSphereVertices()
    },
    createTableVertices() {
      let i = 0
      let len = this.table.length
      for (; i < len; i += 5) {
        const object = new THREE.Object3D()
 // [ column 18 ]
        object.position.x = this.table[ i + 3 ] * 140 - 1260
        object.position.y = -this.table[ i + 4 ] * 180 + 1000
        object.position.z = 0
        this.targets.table.push(object)
      }
    },
    createSphereVertices() {
      let i = 0
      const vector = new THREE.Vector3()
      for (; i < this.objLength; ++i) {
        let phi = Math.acos(-1 + (2 * i) / this.objLength)
        let theta = Math.sqrt(this.objLength * Math.PI) * phi
        const object = new THREE.Object3D()
        object.position.x = 800 * Math.cos(theta) * Math.sin(phi)
        object.position.y = 800 * Math.sin(theta) * Math.sin(phi)
        object.position.z = -800 * Math.cos(phi)
// rotation object

        vector.copy(object.position).multiplyScalar(2)
        object.lookAt(vector)
        this.targets.sphere.push(object)
      }
    },
    createHelixVertices() {
      let i = 0
      const vector = new THREE.Vector3()
      for (; i < this.objLength; ++i) {
        let phi = i * 0.213 + Math.PI
        const object = new THREE.Object3D()
        object.position.x = 800 * Math.sin(phi)
        object.position.y = -(i * 8) + 450
        object.position.z = 800 * Math.cos(phi + Math.PI)
        object.scale.set(1.1, 1.1, 1.1)
        vector.x = object.position.x * 2
        vector.y = object.position.y
        vector.z = object.position.z * 2
        object.lookAt(vector)
        this.targets.helix.push(object)
      }
    },
    createGridVertices() {
      let i = 0
      for (; i < this.objLength; ++i) {
        const object = new THREE.Object3D()
        object.position.x = 360 * (i % 5) - 800
        object.position.y = -360 * ((i / 5 >> 0) % 5) + 700
        object.position.z = -700 * (i / 25 >> 0)
        this.targets.grid.push(object)
      }
    },
    initButton() {
      const gridBtn = document.getElementById('grid')
      const tableBtn = document.getElementById('table')
      const helixBtn = document.getElementById('helix')
      const planeBtn = document.getElementById('plane')
      const sphereBtn = document.getElementById('sphere')
      const sphere2Btn = document.getElementById('sphere2')
      planeBtn.addEventListener('click', function() { this.transformPlane(2000) }.bind(this), false)
      sphere2Btn.addEventListener('click', function() { this.transformSphere2(2000) }.bind(this), false)
      gridBtn.addEventListener('click', function() { this.transform(this.targets.grid, 2000) }.bind(this), false)
      tableBtn.addEventListener('click', function() { this.transform(this.targets.table, 2000) }.bind(this), false)
      helixBtn.addEventListener('click', function() { this.transform(this.targets.helix, 2000) }.bind(this), false)
      sphereBtn.addEventListener('click', function() { this.transform(this.targets.sphere, 2000) }.bind(this), false)
      this.transform(this.targets.table, 2000)
    },
    transform(targets, duration) {
      TWEEN.removeAll()
      for (let i = 0; i < this.objLength; ++i) {
        let object = this.objects[ i ]
        let target = targets[ i ]
        new TWEEN.Tween(object.position)
          .to({ x: target.position.x, y: target.position.y, z: target.position.z },
          Math.random() * duration + duration)
          .easing(TWEEN.Easing.Exponential.InOut)
          .start()
        new TWEEN.Tween(object.rotation)
          .to({ x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration)
          .easing(TWEEN.Easing.Exponential.InOut)
          .start()
      }
        // 这个补间用来在位置与旋转补间同步执行，通过onUpdate在每次更新数据后渲染scene和camera
      new TWEEN.Tween({})
          .to({}, duration * 2)
          .onUpdate(this.render.bind(this))
          .start()
    },
    transformSphere2(duration) {
      TWEEN.removeAll()
      const sphereGeom = new THREE.SphereGeometry(800, 12, 11)
      const vertices = sphereGeom.vertices
      const vector = new THREE.Vector3()
      for (let i = 0; i < this.objLength; ++i) {
        const target = new THREE.Object3D()
        target.position.copy(vertices[i])
        vector.copy(target.position).multiplyScalar(2)
        target.lookAt(vector)
        let object = this.objects[ i ]
        new TWEEN.Tween(object.position)
          .to(vertices[i],
          Math.random() * duration + duration)
          .easing(TWEEN.Easing.Exponential.InOut)
          .start()
        new TWEEN.Tween(object.rotation)
          .to({ x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration)
          .easing(TWEEN.Easing.Exponential.InOut)
          .start()
      }
      new TWEEN.Tween(this)
          .to({}, duration * 2)
          .onUpdate(this.render.bind(this))
          .start()
    },
    transformPlane(duration) {
      TWEEN.removeAll()
      const planeGeom = new THREE.PlaneGeometry(1400, 1800, 10, 10)
      const vertices = planeGeom.vertices
      // const vector = new THREE.Vector3()
      for (let i = 0; i < this.objLength; ++i) {
        const target = new THREE.Object3D()
        target.position.copy(vertices[i])

        let object = this.objects[ i ]
        new TWEEN.Tween(object.position)
          .to(vertices[i],
          Math.random() * duration + duration)
          .easing(TWEEN.Easing.Exponential.InOut)
          .start()
        new TWEEN.Tween(object.rotation)
          .to({ x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration)
          .easing(TWEEN.Easing.Exponential.InOut)
          .start()
      }
      new TWEEN.Tween(this)
          .to({}, duration * 2)
          .onUpdate(this.render.bind(this))
          .start()
    },
    initAxes() {
      let axes = new THREE.AxesHelper(500)
      this.scene.add(axes)
    },
    render() {
      this.renderer.render(this.scene, this.camera)
    },
    animate(time) {
      let delta = this.clock.getDelta()
      this.stats.update()
      TWEEN.update()
      // this.render()
      this.orbitControls.update(delta)
      window.requestAnimationFrame(this.animate.bind(this))
    }
  }
}
</script>
<style>
* {
  margin: 0;
  padding: 0;
}
html,
body {
  width: 100%;
  height: 100%;
  background-color: #000000;
  margin: 0;
  font-family: Helvetica, sans-serif;
  overflow: hidden;
}
/*选择按钮样式start*/
	#menu {
		position: absolute;
		z-index: 100;
		width: 100%;
		bottom: 50px;
		text-align: center;
		font-size: 32px
	}
	button {
		border: none;
		background-color: transparent;
		color: rgba( 127, 255, 255, 0.75 );
		padding: 12px 24px;
		cursor: pointer;
		outline: 1px solid rgba( 127, 255, 255, 0.75 );
	}
	button:hover {
		background-color: rgba( 127, 255, 255, 0.5 )
	}
	button:active {
		background-color: rgba( 127, 255, 255, 0.75 )
	}
	/*end*/

	/*元素样式start*/
	.element {
		width: 120px;
		height: 160px;
		cursor: default;
		text-align: center;
		border: 1px solid rgba( 127, 255, 255, 0.25 );
		box-shadow: 0 0 12px rgba( 0, 255, 255, 0.5 );
	}
	.element:hover{
		border: 1px solid rgba( 127, 255, 255, 0.75 );
		box-shadow: 0 0 12px rgba( 0, 255, 255, 0.75 );
	}
	.element .number {
		position: absolute;
		top: 20px;
		right: 20px;
		font-size: 12px;
		color: rgba( 127, 255, 255, 0.75 );
	}
	.element .symbol {
		position: absolute;
		top: 40px;
		left: 0px;
		right: 0;
		font-size: 60px;
		font-weight: bold;
		color: rgba( 255, 255, 255, 0.75 );
		text-shadow: 0 0 10px rgba( 0, 255, 255, 0.95 );
	}
	.element .detail {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 15px;
		font-size: 12px;
		color: rgba( 127, 255, 255, 0.75 );
	}
</style>
