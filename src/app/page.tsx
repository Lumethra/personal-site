"use client";

import { useEffect, useRef, useState } from "react";
import commands from '@/assets/commands.json';

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLSpanElement>(null);
  const [historyIndex, setHistoryIndex] = useState(-1);

  useEffect(() => {
    function focus() {
      inputRef.current?.focus();
    }

    focus();

    init();

    window.addEventListener('keydown', focus);

    return () => {
      window.removeEventListener('keydown', focus);
    };
  }, []);

  function handleBlur() {
    inputRef.current?.focus();
  };

  async function init() {
    if (!inputRef.current) return;

    //inputRef.current.className = "type";

    await typewriter("whoami", inputRef.current, 140);
    await typewriter("skills", inputRef.current, 140);
    await typewriter("help", inputRef.current, 140);
  }

  function typewriter(value: any, input: any, speed: any) {
    return new Promise<void>((resolve, reject) => { // I have no idea what this is, I just read, that I need a new Promise and typed newpromise and then autocomplete, or whatever the thing of vs code is caleld gave me this
      for (let i = 0; i < value.length; i++) {
        setTimeout(() => {
          input.value = value.slice(0, i + 1);
        }, (i + 1) * speed); // need an increasing value somehow, or it not worki, i think it might just that the timeout gets precess in the same time, cause for dont waits till timeout finish
      }

      setTimeout(processInput, (value.length * speed) + 500);

      const findCommands = commands.find(function (item) {
        return item.command.toLowerCase() === value.toLowerCase();
      });

      setTimeout(resolve, (value.length * speed) + 1000 + (findCommands ? findCommands.delay : 100)); // holy is this complicated
    })
  }

  function handleKeyDown(e: any) {
    if (e.key === "Enter") {
      processInput();
    }

    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      const history = JSON.parse(localStorage.getItem("history") ?? "[]");

      if (history.length > 0) {
        setHistoryIndex((prev) => {
          const next = e.key === "ArrowUp"
            ? prev < history.length - 1 ? prev + 1 : prev
            : prev > 0 ? prev - 1 : prev
          inputRef.current && (inputRef.current.value = history[history.length - 1 - next]);
          return next;
        });
      }
    }

    // if (e.key === "ArrowDown") {
    //   e.preventDefault();
    //   const history = JSON.parse(localStorage.getItem("history") ?? "[]");

    //   if (history.length > 0) {
    //     setHistoryIndex((prev) => {
    //       const next = prev > 0 ? prev - 1 : prev;
    //       inputRef.current && (inputRef.current.value = history[history.length - 1 - next]);
    //       return next;
    //     });
    //   }
    // }
  }

  function handleInputChange() {
    setHistoryIndex(-1); // resets when someone types
  }

  function processInput() {
    const commandInput = inputRef.current;

    let command = commandInput?.value.trim();
    if (!command) return;

    command = command.replace(/terminal/g, "").trim(); // THANKS (https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/String/replace)
    if (!command) return;

    constructOutput(command);

    if (commandInput) commandInput.value = "";
  }

  function constructOutput(command: any) {
    const terminal = historyRef.current;
    if (!terminal) return;

    const findCommands = commands.find(function (item) {
      return item.command.toLowerCase() === command.toLowerCase();
    });

    // if (findCommands == undefined) {
    //   const commandLine = document.createElement('div');
    //   commandLine.className = 'terminal-line';
    //   commandLine.innerHTML = `<span class="prompt">❯</span> <span class="command error">${command}</span>`;
    //   terminal.appendChild(commandLine);

    //   const outputLine = document.createElement('div');
    //   outputLine.className = 'terminal-line output';
    //   outputLine.innerHTML = `<span class="output error">${command}: command not found...</span>`;
    //   terminal.appendChild(outputLine);
    // }

    const ifError = findCommands ? "" : "error";
    // const ifErrorOutptu = findCommands ? findCommands?.output : `${command}: command not found...`;
    function getOutput() {
      if (!findCommands) {
        return `${command}: command not found...`;
      }

      if (findCommands?.isFunction) {
        const outputFunction = new Function("commands", findCommands?.output);

        return outputFunction(commands);
      }

      return findCommands?.output;
    }

    const commandLine = document.createElement('div');
    commandLine.className = 'terminal-line';
    commandLine.innerHTML = `<span class="prompt">❯</span> <span class="command ${ifError}">${command}</span>`;
    terminal.appendChild(commandLine);

    setTimeout(() => {
      if (!terminal) return;

      const outputLine = document.createElement('div');
      outputLine.className = 'terminal-line output';
      outputLine.innerHTML = `<span class="output ${ifError}">${getOutput()}</span>`;
      terminal.appendChild(outputLine);
    }, findCommands ? findCommands.delay : 100)

    if (statusRef.current) {
      statusRef.current.innerHTML = ` <span style="color: ${findCommands ? "blue" : "red"}">${findCommands ? "✔" : "✘"}</span>  ${findCommands ? findCommands.delay / 1000 : 0.1}s `;
    }

    if (findCommands?.command === "clear history") {
      localStorage.removeItem("history");
    } else {
      addToHistory(command);
    }

    terminal.scrollTop = terminal.scrollHeight;
  }

  function addToHistory(command: any) {
    const history = JSON.parse(localStorage.getItem("history") ?? "[]");

    history.push(command);

    localStorage.setItem("history", JSON.stringify(history));
  }

  return (
    <div>
      <div id="history" ref={historyRef}></div>
      <div id="input">
        ╭─<span style={{ background: "#00ff00", color: "blue" }}> ~ </span> <span style={{ position: "absolute", right: "20px" }}><span ref={statusRef} style={{ background: "#00ff00", color: "blue" }}> ✔ </span></span><br />
        <div style={{ display: "inline-flex", alignItems: "center", width: "100%" }}>
          ╰─
          {/* we luve random ahh stack overflow posts */}
          <input type="text" id="command-input" ref={inputRef} onBlur={handleBlur} onKeyDown={handleKeyDown} onChange={handleInputChange} />
        </div>
      </div>
    </div >
  );
}
