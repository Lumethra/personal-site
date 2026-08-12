# Personal Site

## What is this??

This is my very very very own personal website. Why?? Cause everybody needs a personal website, but I didnt found the motivation and commitment to make one myself. But here we are. My own version is finally here. Where my inspiration came from?? Well it came from this vibecoded version from my friend [@Leon](https://github.com/Leonhoch5). Wanna check it out?? Here you go: [https://qoig.dev/](https://qoig.dev/). One important thing to mention though is, that it might be already been replaced with one made of php, ewww, sooo, good luck. 

### Features: 

  - full terminal design
  - typewriter to initialize some data
  - easter eggs (go find em (very easy))
  - animated stuff, like welcome, the age and ~~orphie~~
  - very easy to make an own version out of mine
  - made out of NextJS --> easy to deploy

## How to deploy

1. **Install NodeJS** <br />
    Make sure you have [Node.js](https://nodejs.org/) or [PNPM](https://pnpm.io/) installed.

2. **Clone the repo** <br /> 
    Run this command to clone the repo in any folder: 
    ``` bash
    git clone https://github.com/Lumethra/personal-site.git
    cd personal-site
    ```

3. **Install the dependencies** <br />
    You need to run the command, depending on what you have, PNPM or NPM
    ``` bash
    pnpm install
    ```

    > if you dont have pnpm delete pnpm-lock.yaml and pnpm-workspace.yaml. Then run

    ``` bash
    npm install
    ```

4. **Start the Dev-Server** <br />
    The website needs to be running first to visit it: 
    ``` bash
    pnpm run dev
    ```

    > or

    ``` bash
    npm run dev
    ```

5. **See the site** <br />
    visit [http://localhost:3000](http://localhost:3000)

## How to make an own version of it

1. **Open commands file** <br />
    - open /src  
    - then /assets 
    - and then the file commands.json

2. **Edit the commands** <br />
    change the value of... 
    - command and you get a new command
    - output to get another output
    - delay to get a longer or shorter delay
    - isFunction to make the output a sandboxed function
    - isArt to output orphie

3. **Adding commands** <br />
    feel free to add any commands, but remember to have all 5 fields included

4. **Important** <br />
    The age thing is kinda hardcoded, so you need to 
    - go to /src
    - then /app
    - and then open page.tsx
    - scroll down to line 243 and change your birthday there, you can also search for updateAge() if I commited other things and the lines shifted

## Final words

This project is mostly about having fun with NextJS and getting an own personal site. 

Have a nice day. ❤️