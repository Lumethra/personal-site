"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import commands from '@/assets/commands.json';

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function focus() {
      inputRef.current?.focus();
    }

    focus();

    window.addEventListener('keydown', focus);

    return () => {
      window.removeEventListener('keydown', focus);
    };
  }, []);

  function handleBlur() {
    inputRef.current?.focus();
  };

  function handleKeyDown(e: any) {
    if (e.key === "Enter") {
      const commandInput = inputRef.current;

      const command = commandInput?.value.trim();
      if (!command) return;

      constructOutput(command);

      if (commandInput) commandInput.value = "";
    }
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

    const outputLine = document.createElement('div');
    outputLine.className = 'terminal-line output';
    outputLine.innerHTML = `<span class="output ${ifError}">${getOutput()}</span>`;
    terminal.appendChild(outputLine);

    terminal.scrollTop = terminal.scrollHeight;
  }

  return (
    <div>
      <div id="history" ref={historyRef}></div>
      <div id="input">
        ╭─<span style={{ background: "#00ff00", color: "blue" }}> ~ </span> <br />
        <div style={{ display: "inline-flex", alignItems: "center", width: "100%" }}>
          ╰─
          {/* we luve random ahh stack overflow posts */}
          <input type="text" id="command-input" ref={inputRef} onBlur={handleBlur} onKeyDown={handleKeyDown} />
        </div>
      </div>
    </div >
  );
}
