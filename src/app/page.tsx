"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleBlur() {
    inputRef.current?.focus();
  };

  return (
    <div>
      <div>
        hii
      </div>
      <div id="input">
        ╭─<span style={{ background: "#00ff00", color: "white" }}> ~ </span> <br />
        <div style={{ display: "inline-flex", alignItems: "center", width: "100%" }}>
          ╰─
          {/* we luve random ahh stack overflow posts */}
          <input type="text" id="command-input" ref={inputRef} onBlur={handleBlur} />
        </div>
      </div>
    </div >
  );
}
