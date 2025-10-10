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

//black pieces
const blackColorTexture = textureLoader.load('/textures/black-pieces/color.jpeg')
const blacknormalTexture = textureLoader.load('/textures/black-pieces/normal.jpeg')
const blackglossinessTexture = textureLoader.load('/textures/black-pieces/glossiness.jpeg')
const blackheightTexture = textureLoader.load('/textures/black-pieces/height.jpeg')
const blackmetallicTexture = textureLoader.load('/textures/black-pieces/metallic.jpeg')
const blackroughnessTexture = textureLoader.load('/textures/black-pieces/roughness.jpeg')
const blackspecularTexture = textureLoader.load('/textures/black-pieces/specular.jpeg')

const checkerboardTexture = textureLoader.load('/textures/checkerboard/checkerboard.png')

checkerboardTexture.wrapS = THREE.RepeatWrapping;
checkerboardTexture.wrapT = THREE.RepeatWrapping;
checkerboardTexture.repeat.set(16,17.3)
checkerboardTexture.magFilter = THREE.NearestFilter;
checkerboardTexture.minFilter = THREE.NearestFilter;
checkerboardTexture.generateMipmaps = false;

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


chessColorTexture.magFilter = THREE.LinearFilter
chessColorTexture.minFilter = THREE.LinearMipMapLinearFilter
chessColorTexture.anisotropy = 16







//scene
const scene = new THREE.Scene();

//models
//model materials
const whiteMaterial = new THREE.MeshStandardMaterial({
    map: chessColorTexture,
    normalMap: chessNormalTexture,
    roughnessMap: chessRoughnessTexture,
    metalness: 0.5,
    roughness: 0.2
})

const blackMaterial = new THREE.MeshStandardMaterial({
  color: 0x0a0a0a,       
  roughness: 0.1,         
  metalness: 0.0,      
  side: THREE.DoubleSide   
})

//pawns
const gltfloader = new GLTFLoader()
gltfloader.load('./models/pawn/pawn9.gltf', 
  (gltf)=>{
console.log(gltf)
const pawn = gltf.scene
pawn.scale.set(0.1,0.1,0.1)
pawn.traverse(
  (child)=>{
if(child.isMesh){
  child.material = whiteMaterial
}
  }
)
const squareSize = 2.1
const pawnsWhite = []
for (let i =0; i<8; i++){
const pawnPieces = pawn.clone(true)
pawnPieces.position.set((i - 3.5)* squareSize, -0.8 , 3.3* squareSize)
pawnsWhite.push(pawnPieces)
scene.add(pawnPieces)
}

//blackpawns
const blackPawn = pawn.clone(true)
blackPawn.traverse((child)=>{
if (child.isMesh){
  child.material = blackMaterial
}
})
//to create multiple balckpawns lined up accordingly
const pawnsBlack = []
for (let i = 0; i<8; i++){
const pawnPieces = blackPawn.clone(true)
pawnPieces.position.set((i-3.5)*squareSize, -0.8, -3.3*squareSize)
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
  child.material = whiteMaterial
  child.material.side = THREE.DoubleSide
}
})
  const squareSize = 2.1
const positionKnights = [-2.5,2.5]

positionKnights.forEach((x)=>{
const clonedKnights = knight.clone()
clonedKnights.rotation.y = Math.PI
clonedKnights.position.set(x * squareSize, -0.8, 4.3*squareSize)

scene.add(clonedKnights)

//black knights
const blackKnight = knight.clone(true)
blackKnight.traverse((child)=>{
  if (child.isMesh){
    child.material = blackMaterial
  }
})

const positionBlackKnights = [-2.5, 2.5]
positionBlackKnights.forEach((x)=>{
  const clonedKnights = blackKnight.clone()
  clonedKnights.position.set(x * squareSize, -0.8, -4.3*squareSize)

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
      child.material = whiteMaterial
      child.material.side = THREE.DoubleSide
    }
  })

const squareSize = 2.1
const positionBishops = [-1.5,1.5]

positionBishops.forEach((x)=>{
const clonedBishops = bishop.clone()
clonedBishops.position.set(x * squareSize, -0.8, 4.3*squareSize)

scene.add(clonedBishops)
})

//black bishops
const blackBishop = bishop.clone(true)
blackBishop.traverse((child)=>{
if (child.isMesh){
  child.material = blackMaterial
}
})

positionBishops.forEach((x)=>{
  const clonedBlackBishops = blackBishop.clone()
  clonedBlackBishops.position.set(x * squareSize, -0.8, -4.3*squareSize)
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
      child.material = whiteMaterial
      child.material.side = THREE.DoubleSide
    }
  })

const squareSize = 2.1
queen.position.set(-0.5 * squareSize, -0.8, 4.3*squareSize)
scene.add(queen)

const blackQueen = queen.clone()
blackQueen.traverse((child)=>{
if (child.isMesh){
  child.material = blackMaterial
}
})
blackQueen.position.set(-0.5 * squareSize, -0.8, -4.3*squareSize)
scene.add(blackQueen)


})

//kings
gltfloader.load('./models/king/king3.gltf', (gltf)=>{
  const king = gltf.scene
 
  king.scale.set(0.1, 0.1, 0.1)
  // scene.add(king)
    king.traverse((child)=>{
    if(child.isMesh){
      child.material = whiteMaterial
      child.material.side = THREE.DoubleSide
    }
  })

const squareSize = 2.1
king.position.set(0.5 * squareSize, -0.8, 4.3*squareSize)
scene.add(king)

const blackKing = king.clone()
blackKing.traverse((child)=>{
if (child.isMesh){
  child.material = blackMaterial
}
})
blackKing.position.set(0.5 * squareSize, -0.8, -4.3*squareSize)
scene.add(blackKing)
})

//rooks
gltfloader.load('./models/rook/rook.gltf', (gltf)=>{
const rook = gltf.scene
rook.scale.set(0.1,0.1,0.1)

// scene.add(rook)
rook.traverse((child)=>{
    if(child.isMesh){
      child.material = whiteMaterial
      child.material.side = THREE.DoubleSide
    }
  })

  const squareSize = 2.1
const positionRooks = [-3.5,3.5]

positionRooks.forEach((x)=>{
const clonedRooks = rook.clone()
clonedRooks.position.set(x * squareSize, -0.8, 4.3*squareSize)

scene.add(clonedRooks)

})

const blackRook = rook.clone(true)
blackRook.traverse((child)=>{
if (child.isMesh){
  child.material = blackMaterial
}
})

positionRooks.forEach((x)=>{
  const clonedBlackRooks = blackRook.clone()
  clonedBlackRooks.position.set(x * squareSize, -0.8, -4.3*squareSize)
  scene.add(clonedBlackRooks)
})
})

//board
gltfloader.load('./models/chessboard/chessboard4.gltf', (gltf)=>{
  const chessBoard = gltf.scene
  chessBoard.scale.set(0.3,0.3,0.3)
  chessBoard.position.set(0,-3,0)
  scene.add(chessBoard)
  chessBoard.traverse((child)=>{
   if (child.isMesh){
    console.log('Mesh:', child.name, 'UUID:', child.uuid)

        if (child.name === "Cube_1") {
        child.material = new THREE.MeshStandardMaterial({
          
         color: 0x3e1f0e,
  roughness: 0.35,
  metalness: 0.2

        })
      }
       if (child.name === "Cube_2") {
        child.material = new THREE.MeshStandardMaterial({
        map : checkerboardTexture 
        })

   }
  }
  })

})


//lamp
gltfloader.load('./models/lamp/lamp.gltf', (gltf)=>{
  const lamp = gltf.scene
 
  lamp.scale.set(0.5,0.5,0.5)
 lamp.position.set(12,-3,0)
 scene.add(lamp)
  })





//objects
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(40, 40),
    new THREE.MeshStandardMaterial({
        color: '#444444',
        metalness: 0.5,
        roughness: 0.1
    })
)

floor.rotation.x = - Math.PI * 0.5
floor.position.y = -3.2
floor.material.side = THREE.DoubleSide
scene.add(floor)


// lights
const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)
const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
// directionalLight.position.set(3, 3, 8)
directionalLight.position.set(3,5,0)
scene.add(directionalLight)

const lampLight = new THREE.HemisphereLight(0xff0000, 0x0000ff,0.5)
scene.add(lampLight)



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