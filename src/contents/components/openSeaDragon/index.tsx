import React from 'react';
import Viewer, {viewerPropsType} from "./viewer";

const OpenSeaDragon = () => {

    const viewerProps: viewerPropsType = {
        imageUrl: `${process.env.PUBLIC_URL}/sample/sampleImage.jpg`,
        showNavigator: true,
        successCallback: () => console.log('test')
    }

    return (
      <div style={{ display: "flex", justifyContent: 'space-between' }}>
          <div>
              <Viewer props={viewerProps}/>
          </div>
      </div>
    );
}

export default OpenSeaDragon;