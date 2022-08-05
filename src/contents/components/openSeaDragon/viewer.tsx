import React, {useEffect, useState} from 'react';
import OpenSeaDragon from "openseadragon";

export type viewerPropsType = {
    imageUrl: string,
    width?: number,
    height?: number,
    showNavigator?: boolean,
    successCallback?: () => void
}

type PropsType = {
    props: viewerPropsType
}

const Viewer = ({ props }: PropsType) => {

    const { width=1200, height=800, imageUrl, showNavigator=false, successCallback } = props as viewerPropsType

    const [viewer, setViewer] = useState(null);

    useEffect(() => {
        initOpenSeaDragon()
        return () => {
            viewer && viewer.destroy();
        }
    }, [])

    const initOpenSeaDragon = () => {
        viewer && viewer.destroy();
        setViewer(
            OpenSeaDragon({
                id: 'openSeaDragon',
                tileSources: {
                    type: 'image',
                    url: imageUrl as string,
                    success: successCallback,
                },
                animationTime: 0.5,
                maxZoomPixelRatio: 2,
                minZoomLevel: 1,
                zoomPerScroll: 2,
                visibilityRatio: 1,                 // 화면 밖으로 이미지가 나가지 않음
                constrainDuringPan: true,       // 화면 밖으로 이미지가 나가지 않음
                showNavigator
            })
        )
    }

    return (
      <div
        id={'openSeaDragon'}
        style={{width: `${width}px`, height: `${height}px`}}
      >
      </div>
    );
}

export default Viewer;