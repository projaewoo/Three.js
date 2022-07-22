import React from 'react';

const LightController = () => {
    return (
      <>
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <pointLight position={[-10, 10, 10]} />
      </>
    );
}

export default LightController;