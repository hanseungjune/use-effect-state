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
