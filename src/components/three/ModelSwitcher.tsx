import { useGSAP } from "@gsap/react";
import { PresentationControls } from "@react-three/drei";
import gsap from "gsap";
import { useRef } from "react";
import { Group, Mesh, Material } from "three";

import MacbookModel14 from "../models/Macbook-14.tsx";
import MacbookModel16 from "../models/Macbook-16.tsx";

const ANIMATION_DURATION = 1;
const OFFSET_DISTANCE = 5;

const fadeMeshes = (group: Group | null, opacity: number) => {
    if(!group) return;

  group.traverse((child) => {
    if (child.type === 'Mesh') {
      const mesh = child as Mesh;
      if (mesh.material) {
        const material = mesh.material as Material;
        material.transparent = true;
        gsap.to(material, {
          opacity: opacity,
          duration: ANIMATION_DURATION,
        });
      }
    }
  });
};


const moveGroup = (group: Group | null, x: number) => {
    if(!group) return;

    gsap.to(group.position, {
        x,
        duration: ANIMATION_DURATION,
    });
}

interface ModelSwitcherProps {
    scale: number;
    isMobile: boolean;
}

const ModelSwitcher = ({scale, isMobile}: ModelSwitcherProps) => {
    const SCALE_LARGE_DESKTOP = 0.08;
    const SCALE_LARGE_MOBILE = 0.05;

    const smallMacbookRef = useRef<Group>(null);
    const largeMacbookRef = useRef<Group>(null);

    const showLargeMacbook = scale === SCALE_LARGE_DESKTOP || scale === SCALE_LARGE_MOBILE;

    useGSAP(() => {
        if(showLargeMacbook) {
            moveGroup(smallMacbookRef.current, -OFFSET_DISTANCE);
            moveGroup(largeMacbookRef.current, 0);

            fadeMeshes(smallMacbookRef.current, 0);
            fadeMeshes(largeMacbookRef.current, 1);
        } else {
            moveGroup(smallMacbookRef.current, 0);
            moveGroup(largeMacbookRef.current, OFFSET_DISTANCE);

            fadeMeshes(smallMacbookRef.current, 1);
            fadeMeshes(largeMacbookRef.current, 0);
        }
    }, [scale]);

    const controlsConfig = {
        snap: true,
        speed: 1.0,
        zoom: 1.0,
        azimuth: [-Infinity, Infinity] as [number, number],
        config: { mass: 1, tension: 0, friction: 26 },
    }
  return (
    <>
    <PresentationControls {...controlsConfig}>
        <group ref={largeMacbookRef}>
            <MacbookModel16 scale={isMobile ? 0.05 : 0.08} />
        </group>
    </PresentationControls>
    <PresentationControls {...controlsConfig}>
        <group ref={smallMacbookRef}>
            <MacbookModel14 scale={isMobile ? 0.03 : 0.06} />
        </group>
    </PresentationControls>
    </>
  )
}

export default ModelSwitcher