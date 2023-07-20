import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

export const { useState, useEffect } = (function makeMyHooks() {
  let hookIndex = 0; // Hook을 호출할 때마다 증가하는 인덱스
  const hooks = []; // 모든 hook 상태를 저장하는 배열

  // useState 구현
  const useState = (initialValue) => {
    const state = hooks[hookIndex] || initialValue; // 현재 hook 상태를 가져오거나 초기값 설정
    hooks[hookIndex] = state; // 상태 배열 업데이트

    // setState 함수 구현
    const setState = (function () {
      const currentHookIndex = hookIndex; // 현재 hook 인덱스를 캡처

      return (value) => {
        hooks[currentHookIndex] = value; // 상태 업데이트
        hookIndex = 0; // 인덱스 초기화
        render(App, "root"); // 컴포넌트 다시 렌더링
      };
    })();

    increaseIndex(); // 다음 hook을 위해 인덱스 증가
    return [state, setState]; // [상태, 상태 설정 함수] 형태로 반환
  };

  // useEffect 구현
  const useEffect = (effect, deps) => {
    const prevDeps = hooks[hookIndex];

    if (isFirstCall(prevDeps) || isDepsChanged(prevDeps, deps)) {
      effect(); // effect 실행
    }

    hooks[hookIndex] = deps; // 의존성 배열 업데이트
    increaseIndex(); // 다음 hook을 위해 인덱스 증가
  };

  // 컴포넌트 렌더링 함수
  const render = (Component, elementName) => {
    const element = document.getElementById(elementName); // 루트 element 가져오기
    if (element) {
      ReactDOM.render(<Component />, element); // 컴포넌트 렌더링
    }
  };

  // 인덱스 증가 함수
  const increaseIndex = () => {
    log(); // 상태 로깅
    hookIndex++; // 인덱스 증가
  };

  // 상태 로깅 함수
  const log = () => {
    console.group(`currentHookIndex: ${hookIndex}`);
    console.log("hooks", hooks); // 현재 hook 상태 출력
    console.groupEnd();
  };

  // 처음 호출인지 확인하는 함수
  const isFirstCall = (prevDeps) => {
    return prevDeps === undefined; // 의존성 배열이 없으면 처음 호출
  };

  // 의존성 배열이 변경되었는지 확인하는 함수
  const isDepsChanged = (prevDeps, deps) => {
    return deps.some((dep, idx) => dep !== prevDeps[idx]); // 의존성 배열의 요소가 변경되면 true
  };

  // useState와 useEffect를 반환
  return { useState, useEffect };
})();
