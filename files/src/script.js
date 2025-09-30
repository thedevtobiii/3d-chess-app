import './style.css';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js' 
import * as dat from 'dat.gui'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'


//debug
const gui = new dat.GUI()

//canvas
const canvas = document.querySelector('.webgl');

//sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

//resize
window.addEventListener('resize', ()=>{
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight
  //update camera
  camera.aspect = sizes.width/sizes.height
  camera.updateProjectionMatrix()
  //update renderer
  renderer.setSize(sizes.width, sizes.height); 
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

window.addEventListener('dblclick', ()=>{
  if(!document.fullscreenElement){
    canvas.requestFullscreen()
  }else{
    document.exitFullscreen()
  }
})

//scene
const scene = new THREE.Scene();

//models
//pawns
const gltfloader = new GLTFLoader()
gltfloader.load('./models/pawn/pawn9.gltf', 
  (gltf)=>{
    console.log(gltf)
    const pawn = gltf.scene
scene.add(pawn)
pawn.scale.set(0.1,0.1,0.1)
pawn.position.set(3,0,0)
pawn.traverse(
  (child)=>{
if(child.isMesh){
  child.material = new THREE.MeshStandardMaterial({
    color: 0x4169e1,
    metalness:0.7,
    roughness:0.2
  })
}
  }
)

// console.log(pawn.children.material)
  }
)

//knights
gltfloader.load('./models/knight/knight5.gltf', (gltf)=>{
const knight = gltf.scene
knight.position.set(2,0,-2)
knight.scale.set(0.1, 0.1, 0.1)
knight.traverse((child)=>{
if (child.isMesh){
  child.material = new THREE.MeshStandardMaterial({
    color: 0x4169e1,
    metalness: 0.7,
    roughness: 0.2
  })
  child.material.side = THREE.DoubleSide
}
})
scene.add(knight)
})

//rooks
gltfloader.load('./models/bishop/bishop.gltf', (gltf)=>{
  const bishop = gltf.scene
  bishop.position.set(-2,0,0)
  bishop.scale.set(0.1, 0.1, 0.1)
  scene.add(bishop)
  bishop.traverse((child)=>{
    if (child.isMesh){
      child.material = new THREE.MeshStandardMaterial({
        color: 0x4169e1,
        metalness: 0.7,
        roughness: 0.2
      })
      child.material.side = THREE.DoubleSide
    }
  })
}
)

//queens
gltfloader.load('./models/queen/queen.gltf',(gltf)=>{
  const queen = gltf.scene
  queen.position.set(-2,0,-2)
  queen.scale.set(0.1, 0.1, 0.1)
  scene.add(queen)
  queen.traverse((child)=>{
    if(child.isMesh){
      child.material = new THREE.MeshStandardMaterial({
        color : 0x4169e1,
        metalness:0.7,
        roughness: 0.2
      })
      child.material.side = THREE.DoubleSide
    }
  })

})

//kings
gltfloader.load('./models/king/king3.gltf', (gltf)=>{
  const king = gltf.scene
  king.position.set(-2,0,3)
  king.scale.set(0.1, 0.1, 0.1)
  scene.add(king)
    king.traverse((child)=>{
    if(child.isMesh){
      child.material = new THREE.MeshStandardMaterial({
        color : 0x4169e1,
        metalness:0.7,
        roughness: 0.2
      })
      child.material.side = THREE.DoubleSide
    }
  })
})

//rooks
gltfloader.load('./models/rook/rook.gltf', (gltf)=>{
const rook = gltf.scene
rook.position.set(0,0,0)
rook.scale.set(0.1,0.1,0.1)
scene.add(rook)
rook.traverse((child)=>{
    if(child.isMesh){
      child.material = new THREE.MeshStandardMaterial({
        color : 0x4169e1,
        metalness:0.7,
        roughness: 0.2
      })
      child.material.side = THREE.DoubleSide
    }
  })
})

//board
gltfloader.load('./models/chessboard/chessboard2.gltf', (gltf)=>{
  const chessBoard = gltf.scene
  chessBoard.scale.set(0.15,0.15,0.15)
  chessBoard.position.set(0,-1,0)
  scene.add(chessBoard)
  chessBoard.traverse((child)=>{
    if(child.isMesh){
      child.material = new THREE.MeshStandardMaterial({
        color : 0x006400,
        metalness:0.7,
        roughness: 0.2
      })
      child.material.side = THREE.DoubleSide
    }
  })

})


//objects
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({
        color: '#444444',
        metalness: 0.5,
        roughness: 0.1
    })
)

floor.rotation.x = - Math.PI * 0.5
floor.position.y = -1.1
floor.material.side = THREE.DoubleSide
scene.add(floor)


// lights
const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)
const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(3, 3, 8)
scene.add(directionalLight)



//camera
const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height, 0.1 ,100);
camera.position.set(0, 5, 12)
scene.add(camera)

//controls
const controls = new OrbitControls(camera, canvas)  
controls.enableDamping = true;
// controls.target.set(0, 0.75, 0)


//renderer
const renderer =new THREE.WebGLRenderer(
  {
    canvas : canvas
  }
);
renderer.setSize(sizes.width, sizes.height); 


//animation
const clock = new THREE.Clock()

const loop = () =>
{
  //update objects

   
  controls.update()

  renderer.render(scene, camera);
  

  window.requestAnimationFrame(loop); 
}
loop();