import React, {useRef, useEffect, useState} from 'react';
import { select } from 'd3';

const D3tutorial = () => {

    const svgRef = useRef();
    const [data, setData] = useState([5, 20, 25, 30, 40]);

    useEffect(() => {
        const svg = select(svgRef.current);
        svg
          .selectAll('circle')
          // D3야, svg(svgRef.current) 밑의 circle 태그를 모두 찾아서 선택해줘
          .data(data)
          // 그리고 데이터와 바인딩 (싱크로나이즈) 해줘
          .join(
            // join: svg 요소를 '신규 생성' | '업데이트' | '지우기' 해야할 경우, 한꺼번에 관리
            (enter) => enter.append('circle'),
            // circle이 없으면 신규 생성
            (update) => update.attr('class', 'updated'),
            // 이미 있으면 업데이트 (updated 클래스 추가)
            (exit) => exit.remove()
            // 남은 circle은 지우기
          )
          // .join('circle')        // 간단하게 circle 생성만 하는 경우엔 이렇게 작성해도 됌
          
          // 생성한 circle한테 아래와 같은 속성들을 좀 추가해줘
          // r: 반지름, cx: 중심점 x좌표값, cy: 중심점 y좌표값
          .attr('r', (value) => value)
          .attr('cx', (value) => value * 2)
          .attr('cy', (value) => value * 2)
          .attr('stroke', 'red');
    }, [data])

    const increaseData = () => {
        setData(data.map(value => value + 5))
    }

    const decreaseData = () => {
        setData(data.map(value => value - 5))
    }

    return (
      <div>
          <svg ref={svgRef as any}>
              <circle/>
          </svg>
          <button onClick={increaseData}>+5</button>
          <button onClick={decreaseData}>-5</button>
      </div>
    );
}

export default D3tutorial;