import React, {useState, useEffect} from 'react';
import {OpenSeaDragonViewer} from './openSeaDragonViewer';
import Viewer, {viewerPropsType} from "./viewer";

const OpenSeaDragon = () => {

    const [images, setImages] = useState([]);
    const [manifest, setManifest] = useState();


    useEffect(() => {
        getImages();
    }, []);

    const getImages = async () => {
        const response = await fetch("https://openslide-demo.s3.dualstack.us-east-1.amazonaws.com/info.json")
        let image = await response.json();
        setImages(image.groups)
    };

    const previewImage = async (slide) => {
        setManifest(slide.slide);
    };

    const viewerProps: viewerPropsType = {
        imageUrl: `${process.env.PUBLIC_URL}/sample/sampleImage.jpg`,
        successCallback: () => console.log('test')
    }

    return (
      <div style={{ display: "flex", justifyContent: 'space-between' }}>
          {/*<div>*/}
          {/*    <h2>Test Images</h2>*/}
          {/*    {images.map((group, index) =>*/}
          {/*      <div*/}
          {/*        key={index}*/}
          {/*        style={{*/}
          {/*            display: "flex",*/}
          {/*            flexDirection: 'column'*/}
          {/*        }}*/}
          {/*      >*/}
          {/*          <h3 key={index}>{group.name}</h3>*/}
          {/*          {group.slides.map((slide, index) =>*/}
          {/*            <button*/}
          {/*              key={index}*/}
          {/*              onClick={() => {*/}
          {/*                  return previewImage(slide);*/}
          {/*              }}*/}
          {/*            >*/}
          {/*                {slide.name}*/}
          {/*            </button>*/}
          {/*          )}*/}
          {/*      </div>*/}
          {/*    )}*/}
          {/*</div>*/}
          <div>
              <Viewer props={viewerProps}/>
              {/*<OpenSeaDragonViewer image={manifest}/>*/}
          </div>
      </div>
    );
}

export default OpenSeaDragon;