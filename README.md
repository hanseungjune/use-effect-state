# 커스텀 React Hooks - useState, useEffect

이 프로젝트는 React의 `useState`, `useEffect` 훅을 커스텀하였습니다. 해당 프로젝트의 목표는 React 훅의 내부 구현을 이해하고 직접 구현해보는 것이었습니다.

## 실행방법

1. 먼저 이 저장소를 로컬에 클론합니다.
    ```
    git clone https://github.com/hanseungjune/use-effect-state.git
    ```

2. 디렉토리를 이동합니다.
    ```
    cd use-effect-state
    ```

3. 필요한 노드 모듈을 설치합니다.
    ```
    npm install
    ```
    ```
    yarn install
    ```
4. 프로젝트를 실행합니다.
    ```
    npm start
    ```
    ```
    yarn start
    ```

## 커밋 컨벤션

이 프로젝트에서는 다음과 같은 커밋 컨벤션을 사용하였습니다.

> feat: 새로운 기능 추가
> fix: 버그 수정
> docs: 문서 수정
> style: 코드 포맷팅 (코드 변경이 없는 경우)
> refactor: 코드 리팩토링
> test: 테스트 추가 및 테스트 리팩토링 (프로덕션 코드 변경 없음)
> chore: 빌드 업무 수정, 패키지 매니저 설정 등 (프로덕션 코드 변경 없음)

## 시작 기간

2023 - 07 - 20

## 코드 설명

```js
// hooks.js
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

```

```js
//App.js

import { useState, useEffect } from "./hooks";

function App() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    console.log("useEffect!");
  }, [text, count]);

  return (
    <>
      <section>
        <h1>count: {count}</h1>
        <button onClick={() => setCount(count + 1)}>up</button>
        <button onClick={() => setCount(count - 1)}>Down</button>
        <button onClick={() => setToggle(!toggle)}>Toggle</button>
      </section>
      <br />
      <section>
        <h1 h1>text: {text}</h1>
        <input value={text} onChange={(e) => setText(e.target.value)} />
      </section>
    </>
  );
}

export default App;
```

useState: React의 useState 훅을 커스텀하였습니다. 해당 훅은 초기 값(initial value)을 인자로 받고, 상태값과 해당 상태를 변경하는 함수를 배열로 반환합니다.

useEffect: React의 useEffect 훅을 커스텀하였습니다. 해당 훅은 side effect를 실행하는 함수와 의존성 배열을 인자로 받습니다. 의존성 배열의 요소가 변경될 때만 side effect가 실행됩니다.

## 후기

이 프로젝트를 통해 React 훅의 내부 동작 원리에 대해 깊이 이해할 수 있었습니다. 또한 직접 훅을 구현해보면서 훅의 사용법뿐만 아니라 구현 방법에 대해서도 학습하였습니다. 이 경험은 제가 React를 더 깊게 이해하는 데 도움이 되었으며, 앞으로 React를 사용하는 프로젝트에서도 큰 도움이 될 것입니다.