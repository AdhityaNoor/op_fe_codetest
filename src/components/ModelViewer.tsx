import React, { useRef, Suspense, useMemo, useEffect } from 'react';
import { Canvas } from 'react-three-fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { useLoader } from 'react-three-fiber';
import { OrbitControls } from 'drei/OrbitControls';
import { Mesh, Vector3, Box3, AnimationMixer } from 'three';



interface GLBViewerProps {
    glbPath: string;
}

const ModelViewer: React.FC<GLBViewerProps> = ({ glbPath }) => {
    const gltf = useLoader(GLTFLoader, glbPath, (loader) => {
        loader.manager.onError = (url) => {
            console.error('Error loading texture:', url);
        };
    });
    const group = useRef<any>();
    const mixer = useRef<AnimationMixer>();

    const boundingBox = useMemo(() => {
        const box = new Box3();
        gltf.scene.traverse((child) => {
            if (child instanceof Mesh) {
                box.expandByObject(child);
            }
        });
        return box;
    }, [gltf.scene]);

    const cameraDistance = boundingBox.getSize(new Vector3()).length();

    gltf.scene.traverse((child) => {
        if (child instanceof Mesh) {
            child.position.y = 0;
        }
    });

    useEffect(() => {
        mixer.current = new AnimationMixer(gltf.scene);
        const clips = gltf.animations;
        if (clips && clips.length > 0) {
            const action = mixer.current.clipAction(clips[0]);
            action.play();
        }
    }, [gltf.animations]);

    return (
        <div>
            <Suspense fallback={null}>
                <Canvas
                    style={{ height: '60vh', border: 'solid 1px red', borderRadius: '20px' }}
                    camera={{ position: [10, 0, cameraDistance], fov: 20 }}
                >
                    <ambientLight />
                    <pointLight position={[30, 30, 30]} />
                    <directionalLight position={[10, 10, 5]} intensity={2} />
                    <directionalLight position={[-10, -10, -5]} intensity={1} />
                    <group ref={group}>
                        <primitive object={gltf.scene} userData={{ name: "gltf" }} />
                    </group>
                    <OrbitControls autoRotate={true} />
                </Canvas>
            </Suspense>
        </div>
    );
};

export default ModelViewer;