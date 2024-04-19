# API for Cookbook.gg

This is the code that helps run [cookboo.gg](cookbook.gg) behind the scenes!

## Getting Started
1. fork this repository and clone your fork to your local machine
2. in the project root run any command that will install all dependencies. Some examples of commands you can use are:
    ```bash
    npm i;
    # or
    yarn;
    # or
    pnpm install;
    ```
3. install redis to your machine. Mac: [use homebrew](https://formulae.brew.sh/formula/redis#default), Windows: TODO
    - if using homebrew make sure to follow the instructions in the output to run `brew services start redis` to start redis on your machine.
4. In the root of your project create a file called `.env` and paste in the following code:
    ```bash
    SESSION_SECRET = "XXXXXX"
    DATABASE_URL = "XXXXXX"
    DISCORD_ID = "XXXXXX"
    DISCORD_SECRET = "XXXXXX"
    ```
**NOTE**: you will need to reach out to a current developer to get certain keys needed for running the API locally
5. run the script `dev` to start serving the API locally! Suggested run options are:
    ```bash
        npm run dev
        # or
        yarn dev
        # or
        pnpm dev
    ```
TODO: write 6 and onwards about getting local db setup

## Issues
If you have any issues with the local setup process or the API in general please log an issue for other developers to help out

## Be Kind Always :green_heart:
README written by stump - coronary - vera
