import React from 'react';
import * as d3 from 'd3';

const D3miniMap = () => {

    const url = `https://gist.githubusercontent.com/ivanbacher/11cd328411c74b2bc2ec789291852544/raw/bb39be70f71e4fb52ae5101150f5fffde4b66272/map.svg`;

    d3.svg(url).then(xml => {
        let width = parseInt(d3.select('body').style('width'));
        let height = parseInt(d3.select('body').style('height'));

        // xml.documentElement.cloneNode(true): <svg ...></svg>
        document.querySelector('#map')?.appendChild(xml.documentElement.cloneNode(true));
        document.querySelector('#minimap')?.appendChild(xml.documentElement.cloneNode(true));

        let map = d3.select('#map').select('svg');
        // #map 밑에 svg를 생성
        // d3.select: 특정 태그 하나를 선택
        let minimap = d3.select('#minimap').select('svg').attr('width', 200);
        // #minimap 밑에 svg를 생성, width: 200으로 지정
        // selection.attr: 선택 태그의 속성값을 지정
        let transform = d3.zoomIdentity.translate(0, 0).scale(1);
        // d3.zoomIdentity => identity transform을 return

        const zoomed = () => {
            map.select('#main_container')
              .attr('transform', d3.event.transform);
            // main container의 transform을 d3.event.transform으로 지정

            minimap.select('#minimapRect').remove();
            // minimap의 잔상을 제거

            let mapWidth = parseFloat(d3.select('#map').style('width'));
            let mapHeight = parseFloat(d3.select('#map').style('height'));
            let factor = mapWidth / d3.select('#map svg').attr('viewBox').split(' ')[2];
            let dx = d3.event.transform.x / d3.event.transform.k;
            let dy = d3.event.transform.y / d3.event.transform.k;
            // 계산 중

            // 미니맵 안의 빨간색 사각형
            minimap.append('rect')
              // selection.append: 새로운 태그를 추가
              .attr('id', 'minimapRect')
              .attr('width', mapWidth / factor / d3.event.transform.k)      // 넓이 지정
              .attr('height', mapHeight / factor / d3.event.transform.k)    // 높이 지정
              .attr('stroke', 'red')
              .attr('stroke-width', 10)
              .attr('fill', 'none')
              .attr('transform', `translate(${-dx},${-dy})`);           // transform(translate, scale, rotate)
        }

        let zoom = d3.zoom().scaleExtent([1, 3]).on('zoom', zoomed);
        // d3.zoom().scaleExtent([min, mex])        // min: minimun scale factor       // max: maximum scale factor
        // ...scaleExtent([])   => return zoom behavior
        /// ...on(type, 동작 함수)  => type에 따라 각 동작을 수행하게 됌

        map.call(zoom)
          .call(zoom.transform, transform);

    })


    return (
      <div id={'viewport'}>
          <div id={'map'}></div>
          <div id={'minimap'}></div>
      </div>
    );
}

export default D3miniMap;