import React from 'react';
import * as d3 from 'd3';

const D3miniMap = () => {

    const url = `https://gist.githubusercontent.com/ivanbacher/11cd328411c74b2bc2ec789291852544/raw/bb39be70f71e4fb52ae5101150f5fffde4b66272/map.svg`;

    d3.svg(url).then(xml => {
        let width = parseInt(d3.select('body').style('width'));
        let height = parseInt(d3.select('body').style('height'));

        document.querySelector('#map')?.appendChild(xml.documentElement.cloneNode(true));
        document.querySelector('#minimap')?.appendChild(xml.documentElement.cloneNode(true));

        let map = d3.select('#map').select('svg');
        let minimap = d3.select('#minimap').select('svg').attr('width', 200);
        let transform = d3.zoomIdentity.translate(0, 0).scale(1);

        const zoomed = () => {
            let mapMainContainer = map.select('#main_container')
              .attr('transform', d3.event.transform);

            minimap.select('#minimapRect').remove();

            let mapWidth = parseFloat(d3.select('#map').style('width'));
            let mapHeight = parseFloat(d3.select('#map').style('height'));
            let factor = mapWidth / d3.select('#map svg').attr('viewBox').split(' ')[2];

            let dx = d3.event.transform.x / d3.event.transform.k;
            let dy = d3.event.transform.y / d3.event.transform.k;

            let minimapRect = minimap.append('rect')
              .attr('id', 'minimapRect')
              .attr('width', mapWidth / factor / d3.event.transform.k)
              .attr('height', mapHeight / factor / d3.event.transform.k)
              .attr('stroke', 'red')
              .attr('stroke-width', 10)
              .attr('fill', 'none')
              .attr('transform', `translate(${-dx},${-dy})`);
        }

        let zoom = d3.zoom().scaleExtent([1, 3]).on('zoom', zoomed);

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