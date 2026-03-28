import React from 'react';
import Webcam from 'react-webcam';

const WebcamOverlay = ({ webcamRef }) => {
    return (
        <div className="scan__camera-container" style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
            <Webcam
                audio={true}
                muted={true}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="scan__video"
                mirrored={true} 
                style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    display: 'block',
                    // PAKSA EFEK CERMIN DENGAN CSS
                    transform: 'scaleX(-1)',
                    WebkitTransform: 'scaleX(-1)'
                }}
            />

            {/* SVG Overlay */}
            <svg
                viewBox="0 0 640 480"
                preserveAspectRatio="xMidYMid slice"
                style={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    width: '100%',
                    height: '100%',
                    zIndex: 10,
                    pointerEvents: 'none'
                }}
            >
                <ellipse 
                    cx="320" cy="220" rx="130" ry="170" 
                    fill="none" 
                    stroke="rgba(255, 255, 255, 0.4)" 
                    strokeWidth="3" 
                    strokeDasharray="10,10" 
                />
                <path
                    d="M120,480 Q120,380 220,350 L420,350 Q520,380 520,480"
                    fill="none" 
                    stroke="rgba(255, 255, 255, 0.4)" 
                    strokeWidth="3" 
                    strokeDasharray="10,10"
                />
            </svg>
        </div>
    );
};

export default WebcamOverlay;