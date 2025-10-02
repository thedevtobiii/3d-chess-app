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

//textures
const textureLoader = new THREE.TextureLoader()
const chessColorTexture = textureLoader.load('/textures/chess-pieces/color.jpg')
const chessAlphaTexture = textureLoader.load('/textures/chess-pieces/color.jpg')
const chessHeightTexture = textureLoader.load('/textures/chess-pieces/height.png')
const chessNormalTexture =textureLoader.load('/textures/chess-pieces/normal.jpg')
const chessAOTexture = textureLoader.load('/textures/chesspieces/ambientOcclusion.jpg')
const chessRoughnessTexture = textureLoader.load('/textures/chess-pieces/roughness.jpg')

chessColorTexture.repeat.set(2,2)
chessAOTexture.repeat.set(2,2)
chessNormalTexture.repeat.set(2,2)
chessRoughnessTexture.repeat.set(2,2)

chessColorTexture.wrapS = THREE.RepeatWrapping
chessAOTexture.wrapS = THREE.RepeatWrapping
chessNormalTexture.wrapS = THREE.RepeatWrapping
chessRoughnessTexture.wrapS = THREE.RepeatWrapping

chessColorTexture.wrapT = THREE.RepeatWrapping
chessAOTexture.wrapT = THREE.RepeatWrapping
chessNormalTexture.wrapT = THREE.RepeatWrapping
chessRoughnessTexture.wrapT = THREE.RepeatWrapping

chessColorTexture.magFilter = THREE.NearestFilter
chessColorTexture.minFilter = THREE.NearestFilter

//scene
const scene = new THREE.Scene();

//models
//pawns
const gltfloader = new GLTFLoader()
gltfloader.load('./models/pawn/pawn9.gltf', 
  (gltf)=>{
    console.log(gltf)
    const pawn = gltf.scene
// scene.add(pawn)
pawn.scale.set(0.1,0.1,0.1)
// pawn.position.set(3,0,0)
pawn.traverse(
  (child)=>{
if(child.isMesh){
  child.material = new THREE.MeshStandardMaterial({
    // color: 0x4169e1,
    // metalness:0.7,
    // roughness:0.2,
    map: chessColorTexture,
    alphaMap: chessAlphaTexture,
    aoMap: chessAOTexture,
    displacementMap: chessHeightTexture,
    normalMap: chessNormalTexture,
    roughnessMap: chessRoughnessTexture
  })
}
  }
)
const squareSize = 2.1
const pawnsWhite = []
for (let i =0; i<8; i++){
const pawnPieces = pawn.clone(true)
pawnPieces.position.set((i - 3.5)* squareSize, -0.8 , 3* squareSize)
pawnsWhite.push(pawnPieces)
scene.add(pawnPieces)
}

const pawnsBlack = []

for (let i = 0; i<8; i++){
const pawnPieces = pawn.clone(true)
pawnPieces.position.set((i-3.5)*squareSize, -0.8, -3*squareSize)
pawnsBlack.push(pawnPieces)
scene.add(pawnPieces)
}

// console.log(pawn.children.material)
  }
)

//knights
gltfloader.load('./models/knight/knight5.gltf', (gltf)=>{
const knight = gltf.scene
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
  const squareSize = 2.1
const positionKnights = [-2.5,2.5]

positionKnights.forEach((x)=>{
const clonedKnights = knight.clone()
clonedKnights.rotation.y = Math.PI
clonedKnights.position.set(x * squareSize, -0.8, 4*squareSize)

scene.add(clonedKnights)

const positionBlackKnights = [-2.5, 2.5]
positionBlackKnights.forEach((x)=>{
  const clonedKnights = knight.clone()
  clonedKnights.position.set(x * squareSize, -0.8, -4*squareSize)

  scene.add(clonedKnights)
})

})
})

//bishops
gltfloader.load('./models/bishop/bishop.gltf', (gltf)=>{
  const bishop = gltf.scene
  bishop.position.set(-2,0,0)
  bishop.scale.set(0.1, 0.1, 0.1)
  // scene.add(bishop)
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

const squareSize = 2.1
const positionBishops = [-1.5,1.5]

positionBishops.forEach((x)=>{
const clonedBishops = bishop.clone()
clonedBishops.position.set(x * squareSize, -0.8, 4*squareSize)

scene.add(clonedBishops)
})


positionBishops.forEach((x)=>{
  const clonedBlackBishops = bishop.clone()
  clonedBlackBishops.position.set(x * squareSize, -0.8, -4*squareSize)
  scene.add(clonedBlackBishops)
})


}
)

//queens
gltfloader.load('./models/queen/queen.gltf',(gltf)=>{
  const queen = gltf.scene
  queen.scale.set(0.1, 0.1, 0.1)
  // scene.add(queen)
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

const squareSize = 2.1
queen.position.set(-0.5 * squareSize, -0.8, 4*squareSize)
scene.add(queen)

const blackQueen = queen.clone()
blackQueen.position.set(-0.5 * squareSize, -0.8, -4*squareSize)
scene.add(blackQueen)


})

//kings
gltfloader.load('./models/king/king3.gltf', (gltf)=>{
  const king = gltf.scene
 
  king.scale.set(0.1, 0.1, 0.1)
  // scene.add(king)
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

const squareSize = 2.1
king.position.set(0.5 * squareSize, -0.8, 4*squareSize)
scene.add(king)

const blackKing = king.clone()
blackKing.position.set(0.5 * squareSize, -0.8, -4*squareSize)
scene.add(blackKing)
})

//rooks
gltfloader.load('./models/rook/rook.gltf', (gltf)=>{
const rook = gltf.scene
rook.scale.set(0.1,0.1,0.1)

// scene.add(rook)
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

  const squareSize = 2.1
const positionRooks = [-3.5,3.5]

positionRooks.forEach((x)=>{
const clonedRooks = rook.clone()
clonedRooks.position.set(x * squareSize, -0.8, 4*squareSize)

scene.add(clonedRooks)

})

positionRooks.forEach((x)=>{
  const clonedBlackRooks = rook.clone()
  clonedBlackRooks.position.set(x * squareSize, -0.8, -4*squareSize)
  scene.add(clonedBlackRooks)
})
})

//board
gltfloader.load('./models/chessboard/chessboard2.gltf', (gltf)=>{
  const chessBoard = gltf.scene
  chessBoard.scale.set(0.3,0.3,0.3)
  chessBoard.position.set(0,-3,0)
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
//positioning the pieces




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
// directionalLight.position.set(3, 3, 8)
directionalLight.position.set(0,5,0)
scene.add(directionalLight)



//camera
const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height, 0.1 ,100);
camera.position.set(5, 10, 20)
scene.add(camera)

//controls
const controls = new OrbitControls(camera, canvas)  
controls.enableDamping = true;
// controls.target.set(0, 0.75, 0)


//renderer
const renderer =new THREE.WebGLRenderer(
  {
    canvas : canvas,
    antialias: true
  }
);
renderer.setSize(sizes.width, sizes.height); 
// renderer.outputEncoding = THREE.sRGBEncoding
// renderer.toneMapping = THREE.CineonToneMapping


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