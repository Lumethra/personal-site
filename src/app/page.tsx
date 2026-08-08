"use client";

import { useEffect, useRef, useState } from "react";
import commands from '@/assets/commands.json';
import orphieTyping from '@/assets/orphie-typing.json';
import orphieCelebrating from '@/assets/orphie-celebrating.json';
import orphieSleeping from '@/assets/orphie-sleeping.json';
import ASCIIText from '@/assets/ASCII-text.json';

const orphieTypingFrames = orphieTyping.map(frame => frame.join('\n'));
const orphieCelebratingFrames = orphieCelebrating.map(frame => frame.join('\n'));
const orphieSleepingFrames = orphieSleeping.map(frame => frame.join('\n'));
const ASCIITextFrame = ASCIIText.map(frame => frame.map(line => `<span>${line}</span>`).join('\n'));

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

    await typewriter("welcome", inputRef.current, 140);
    await typewriter("clear", inputRef.current, 140);
    await typewriter("whoami", inputRef.current, 140);
    await typewriter("age", inputRef.current, 140);
    await typewriter("skills", inputRef.current, 140);
    await typewriter("help", inputRef.current, 140);
  }

  const sleep = (time: any) => new Promise<void>((resolve) => setTimeout(resolve, time))

  function typewriter(value: any, input: any, speed: any) {
    return new Promise<void>(async (resolve, reject) => { // I have no idea what this is, I just read, that I need a new Promise and typed newpromise and then autocomplete, or whatever the thing of vs code is caleld gave me this
      for (let i = 0; i < value.length; i++) {
        try {
          isInput(input)
            ? input.value = value.slice(0, i + 1)
            : input.textContent = value.slice(0, i + 1);
          await sleep(
            isInput(input)
              ? speed
              : value[i] === " " ? 0 : speed);
        } catch (e) {
          setTimeout(() => {
            isInput(input) ? input.value : input.textContent = value.slice(0, i + 1);
          }, (i + 1) * speed); // need an increasing value somehow, or it not worki, i think it might just that the timeout gets precess in the same time, cause for dont waits till timeout finish
        }
      }

      if (isInput(input)) {
        setTimeout(processInput, (value.length * speed) + 300);

        const findCommands = commands.find(function (item) {
          return item.command.toLowerCase() === value.toLowerCase();
        });

        setTimeout(resolve, (value.length * speed) + 1000 + (findCommands ? findCommands.delay : 100)); // holy is this complicated
      } else {
        resolve();
      }
    })
  }

  function isInput(input: any) {
    return input instanceof HTMLInputElement ? true : false;
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

      if (findCommands?.isArt) {
        return `<span class="orphie">${orphieTypingFrames[0]}</span>`;
      }

      if (findCommands?.output === "Welcome") {
        return `<span class="welcome">${ASCIITextFrame}</span>`;
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

      if (findCommands && findCommands.isArt) {
        const animContainer = outputLine.querySelector('.orphie');

        if (animContainer) {
          const play = (frames: any, duration: any, speed: any) => {
            return new Promise<void>((resolve) => {
              let frame = 0;
              let time = 0;

              const nextFrame = () => {
                if (!animContainer.isConnected) return resolve();

                animContainer.textContent = frames[frame];
                frame = (frame + 1) % frames.length;
                time += speed;

                if (time < duration) {
                  setTimeout(nextFrame, speed);
                } else {
                  resolve();
                }
              };

              nextFrame();
            });
          };

          const loop = async () => {
            if (!animContainer.isConnected) return;

            await play(orphieTypingFrames, 3000, 150);
            await play(orphieCelebratingFrames, 1300, 300);
            await play(orphieSleepingFrames, 6000, 300);

            loop();
          };

          loop();
        }
      }

      if (findCommands && findCommands.command === "age") {
        function updateAge() {
          const age = (new Date().getTime() - new Date('2010-01-19').getTime()) / 31556952000; // thanks google for 31556952000 this specific value
          const ageElement = outputLine.querySelector('.age');
          if (ageElement) {
            ageElement.textContent = age.toString();
          }

          setTimeout(updateAge, 50);
        }

        updateAge();
      }

      async function animateWelcome() {
        const welcomeLines = outputLine.querySelectorAll('.welcome > span');
        if (!welcomeLines) return;

        welcomeLines.forEach(element => {
          const text = element.textContent;

          return typewriter(text, element, 20);
        });
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach

        //await typewriter(welcome.textContent, welcome, 50);
      }

      if (findCommands?.command === "welcome") {
        animateWelcome();
      }

      document.body.scrollTop = document.body.scrollHeight;
    }, findCommands ? findCommands.delay : 100)

    if (statusRef.current) {
      statusRef.current.innerHTML = ` <span style="color: ${findCommands ? "blue" : "red"}">${findCommands ? "✔" : "✘"}</span>  ${findCommands ? findCommands.delay / 1000 : 0.1}s `;
    }

    if (findCommands?.command === "clear history") {
      localStorage.removeItem("history");
    } else {
      addToHistory(command);
    }

    document.body.scrollTop = document.body.scrollHeight;
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
          <span>╭─<span style={{ background: "#00ff00", color: "blue" }}> ~ </span> </span>
          <span><span ref={statusRef} style={{ background: "#00ff00", color: "blue" }}> ✔ </span></span>
        </div>
        <div style={{ display: "inline-flex", alignItems: "center", width: "100%" }}>
          ╰─
          {/* we luve random ahh stack overflow posts */}
          <input type="text" id="command-input" ref={inputRef} onBlur={handleBlur} onKeyDown={handleKeyDown} onChange={handleInputChange} />
        </div>
      </div>
    </div >
  );
}
