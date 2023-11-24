import React, { Suspense } from 'react';
import ModelViewer from './ModelViewer';
import CloseIcon from './CloseIcon';
import './Modal.css';

interface ModalProps {
  item: {
    title: string;
    imageFile?: string;
    videoFile?: string;
    _3dFile?: string;
  };
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ item, onClose }) => {
  const is3DFile = item._3dFile && item._3dFile.endsWith('.glb');

  console.log(`this is the file : ` + item._3dFile);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          <CloseIcon color="black" />
        </button>
        <h2>{item.title}</h2>

        {item.videoFile && <video src={`/src/assets${item.videoFile}`} controls />}

        {is3DFile ? (
          <Suspense>
            <h4>Use your mouse to Zoom, Pan, and Rotate</h4>
            <ModelViewer glbPath={`/src/assets${item._3dFile}`} />
          </Suspense>
        ) : (
          item.imageFile && <img
            src={'/src/assets' + item.imageFile}
            alt={item.title}
            onError={(event) => {
              const target = event.target as HTMLImageElement;
              if (target) {
                target.src = '/src/assets/images/fallback.jpg';
              }
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Modal;