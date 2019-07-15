<template>
  <div id="app">
    <div class="header">关键信息基础设施安全保卫平台</div>
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
    <div class="footer"></div>
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
      page: 1,

      objects: [],
      groups: [],
      objLength: 0,
      targets: {
        grid: [],
        helix: [],
        table: [],
        sphere: []
      },
      innerWH: {
        x: 0,
        y: 0
      },
      table: [
        '网站监测', '../static/img/wzjc.png', 'large', 1, 1,
        '流量检测', '../static/img/lljc.png', 'large', 2, 1,
        '0day检测', '../static/img/0djc.png', 'large', 3, 1,
        '资产探测', '../static/img/zctc.png', 'large', 1, 2,
        '追踪溯源', '../static/img/zzsy.png', 'large', 4, 1,
        '情报信息', '../static/img/qbxx.png', 'large', 5, 1,
        '综合态势', '../static/img/zhts.png', 'large', 7, 1,
        '资产态势', '../static/img/zcts.png', 'large', 8, 1,
        '攻击态势', '../static/img/gjts.png', 'large', 9, 1,
        '隐患态势', '../static/img/yhts.png', 'large', 7, 2,
        '事件态势', '../static/img/sjts.png', 'large', 8, 2,
        '通报态势', '../static/img/tbts.png', 'large', 9, 2,
        '等级保护', '../static/img/djbh.png', 'large', 10, 1,
        '通报预警', '../static/img/tbyj.png', 'large', 11, 1,
        '执法检查', '../static/img/zfjc.png', 'large', 12, 1,
        '指挥调度', '../static/img/zhdd.png', 'large', 10, 2,

        '系统档案', '../static/img/zhdd.png', 'large', 3, 5,
        '监管对象', '../static/img/zhdd.png', 'large', 4, 5,
        '智慧公安', '../static/img/zhdd.png', 'large', 5, 5,
        '邮件专项', '../static/img/zhdd.png', 'large', 6, 5,
        '业务库', '../static/img/zhdd.png', 'large', 7, 5,
        '知识库', '../static/img/zhdd.png', 'large', 8, 5,
        '资源库', '../static/img/zhdd.png', 'large', 9, 5
      ]
    }
  },
  created: function() {
    window.THREE = THREE
    window.TWEEN = TWEEN
    console.log(THREE)
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
      this.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000)
      this.camera.up.set(0, 1, 0)
      this.camera.position.z = 3000
      this.camera.lookAt(this.scene.position)
      this.innerWH.y = Math.tan(20 / 180 * Math.PI) * 3000 * 2
      this.innerWH.x = this.innerWH.y / window.innerHeight * window.innerWidth
    },
    initRenderer() {
      let box = document.getElementById(`${this.boxId}`)
      this.renderer = new THREE.CSS3DRenderer({
        antialias: true,
        alpha: true
      })
      this.renderer.setSize(window.innerWidth, window.innerHeight)
      this.renderer.domElement.style.position = 'absolute'
      box.appendChild(this.renderer.domElement)
    },
    initOrbitControls() {
      this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement)
      // 使动画循环使用时阻尼或自转 意思是否有惯性
      this.orbitControls.enableDamping = true
      // 动态阻尼系数 就是鼠标拖拽旋转灵敏度
      this.orbitControls.dampingFactor = 0.065
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
      this.orbitControls.rotateSpeed = 0.08
      this.orbitControls.minPolarAngle = 15 / 180 * Math.PI
      this.orbitControls.maxPolarAngle = 165 / 180 * Math.PI
      console.log(this.orbitControls)
      let self = this
      this.orbitControls.addEventListener('change', self.render)
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
        element.style.width = 180 * window.innerWidth / 1536 + 'px'

        const icon = document.createElement('img')
        icon.className = 'icon'
        icon.src = this.table[ i + 1 ]

        element.appendChild(icon)

        const title = document.createElement('div')
        title.className = 'title'
        title.textContent = this.table[ i ]
        element.appendChild(title)

        const object = new THREE.CSS3DObject(element)
        object.renderOrder = 5
        object.position.x = Math.random() * 4000 - 2000
        object.position.y = Math.random() * 4000 - 2000
        object.position.z = Math.random() * 4000 - 2000
        this.scene.add(object)
        this.objects.push(object)
      }

      const element = document.createElement('div')
      element.className = 'group-container'
      element.style.width = this.innerWH.x + 'px'
      element.style.height = this.innerWH.y / 2.5 + 'px'
      let titles = ['威胁感知', '智能分析', '态势评估', '监管处置']
      for (let j = 0; j < 4; j++) {
        const group = document.createElement('div')
        group.className = 'group'

        const title = document.createElement('div')
        title.className = 'title'
        title.textContent = titles[j]
        group.appendChild(title)
        element.appendChild(group)
      }
      const object = new THREE.CSS3DObject(element)
      object.renderOrder = 1
      this.scene.add(object)

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
        let group = Math.floor((this.table[ i + 3 ] - 1) / 3)
        let ratio = group - 1.5
        let centerX = this.innerWH.x / 4 * ratio
        let remain = (this.table[ i + 3 ] - 1) % 3

        object.position.x = (remain - 1) * this.innerWH.x / 18 + centerX
        object.position.y = -this.table[ i + 4 ] * 320 + 800
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
        let phi = i * 0.426 + Math.PI
        const object = new THREE.Object3D()
        object.position.x = 1000 * Math.sin(phi)
        object.position.y = -(i * 24) + 450
        object.position.z = 1000 * Math.cos(phi + Math.PI)
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
    resetControl() {
      new TWEEN.Tween(this.camera.position)
          .to({ x: 0, y: 0, z: 3000 },
          800)
          .easing(TWEEN.Easing.Exponential.InOut)
          .start()
      // this.orbitControls.setPolar
    },
    initButton() {
      const gridBtn = document.getElementById('grid')
      const tableBtn = document.getElementById('table')
      const helixBtn = document.getElementById('helix')
      const planeBtn = document.getElementById('plane')
      const sphereBtn = document.getElementById('sphere')
      const sphere2Btn = document.getElementById('sphere2')
      let groupBg = document.getElementsByClassName('group-container')
      planeBtn.addEventListener('click', function() {
        this.page = 2
        this.orbitControls.enabled = true
        this.transformPlane(2000)
        groupBg[0].style.display = 'none'
      }.bind(this), false)
      sphere2Btn.addEventListener('click', function() {
        this.page = 2
        this.orbitControls.enabled = true
        this.transformSphere2(2000)
        groupBg[0].style.display = 'none'
      }.bind(this), false)
      gridBtn.addEventListener('click', function() {
        this.page = 2
        this.orbitControls.enabled = true
        this.transform(this.targets.grid, 2000)
        groupBg[0].style.display = 'none'
      }.bind(this), false)
      tableBtn.addEventListener('click', function() {
        this.page = 1
        this.orbitControls.enabled = false
        this.transform(this.targets.table, 2000)
        groupBg[0].style.display = 'block'
        this.resetControl()
      }.bind(this), false)
      helixBtn.addEventListener('click', function() {
        this.page = 2
        this.orbitControls.enabled = true
        this.transform(this.targets.helix, 2000)
        groupBg[0].style.display = 'none'
      }.bind(this), false)
      sphereBtn.addEventListener('click', function() {
        this.page = 2
        this.orbitControls.enabled = true
        this.transform(this.targets.sphere, 2000)
        groupBg[0].style.display = 'none'
      }.bind(this), false)
      this.transform(this.targets.table, 2000)
    },
    transform(targets, duration) {
      let self = this
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
          .onUpdate(self.render)
          .start()
    },
    transformSphere2(duration) {
      let self = this
      TWEEN.removeAll()
      const sphereGeom = new THREE.SphereGeometry(800, 6, 8)
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
          .onUpdate(self.render)
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
          .onUpdate(this.render)
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
      window.requestAnimationFrame(this.animate.bind(this))
      if (this.page === 1) {
        this.orbitControls.enabled = false
      }
      let delta = this.clock.getDelta()
      this.stats.update()
      // this.render()
      this.orbitControls.update(delta)
      TWEEN.update()
    }
  }
}
</script>
<style lang="postcss">
* {
  margin: 0;
  padding: 0;
}
html,
body {
  width: 100%;
  height: 100%;
  background: url('../static/img/background.png') center center no-repeat;
  background-size: cover!important;
  margin: 0;
  font-family: Helvetica, sans-serif;
  overflow: hidden;
}
.header{
  position: absolute;
  width: 80%;
  height: 64px;
  background: url('../static/img/header.png') center center no-repeat;
  background-size: cover!important;
  margin: 0 10%;
  color: #fff;
  text-align: center;
  line-height: 80px;
  font-size: 26px;
}
.group-container{
  width: 100%;
  height: 50vh;
  position: absolute;
  z-index: 10;
  left: 0;
  top: 128px;
  .group{
    position: relative;
    width: 25%;
    height: 100%;
    float: left;
    background: url('../static/img/group-bg.png') center bottom no-repeat;
    background-size: 80%!important;
    .title {
      position: absolute;
      bottom: 3.75%;
      width: 100%;
      height: 40px;
      color: #fff;
      line-height: 40px;
      text-align: center;
      color: rgb(128, 213, 255);
      font-size: 3rem;
    }
  }
}
.footer{
  position: absolute;
  width: 80%;
  height: 64px;
  background: url('../static/img/footer.png') center center no-repeat;
  background-size: cover!important;
  bottom: 0;
  margin: 0 10%;
}
/*选择按钮样式start*/
	#menu {
		position: absolute;
		z-index: 100;
		width: 120px;
    right: 0;
		bottom: 50px;
		text-align: center;
		font-size: 12px
	}
	button {
		border: none;
		background-color: transparent;
		color: rgba( 127, 255, 255, 0.75 );
		padding: 4px 8px;
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
    position: relative;
		width: 180px;
		height: 240px;
    background: url('../static/img/icon-bg.png') no-repeat top center;
    background-size: contain!important;
		cursor: default;
		text-align: center;
    z-index: 11;
	}
	.element:hover{
    cursor: pointer;
    margin-top: 16px;
    transition: all 0.5s ease;
	}
  .element .title{
    position: absolute;
    bottom: 2%;
    width: 100%;
    height: 32px;
    text-align: center;
    font-size: 2.25rem;
    color: #ffffff
  }
	.element .icon {
		position: absolute;
    width: 65%;
    height: auto;
    left: 17.5%;
    top: 17%;
	}
</style>
