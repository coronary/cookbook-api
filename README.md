# API for Cookbook.gg

This is the code that helps run [cookbook.gg](https://cookbook.gg) behind the scenes!

## Getting Started
### Prepping the API to run locally
1. fork this repository and clone your fork to your local machine
2. in the project root run any command that will install all dependencies. Some examples of commands you can use are:
    ```bash
    npm i;
    # or
    yarn;
    # or
    pnpm install;
    ```
3. In the root of your project create a file called `.env` and paste in the following code:
    ```bash
    SESSION_SECRET = "XXXXXX";
    DATABASE_URL = "XXXXXX";
    DISCORD_ID = "XXXXXX";
    DISCORD_SECRET = "XXXXXX";
    ```
**NOTE**: you will need to reach out to a current maintainer to get certain keys needed for running the API locally

At this point you're ready to run the API but it'll have no data to query from!
### Prepping a local databse
1. install redis to your machine. Mac: [use homebrew](https://formulae.brew.sh/formula/redis#default), Windows: TODO

2. install mongodb to your machine using the appropriate instructions for your platform [Mac Instructions](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x/#std-label-install-mdb-community-macos), [Windows Instructions](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-windows/#std-label-install-mdb-community-windows)
**IMPORTANT**: if using homebrew make sure to follow the instructions in the output to run `brew services start redis` and `brew services start mongodb-community`  to start redis and mongodb running in the background

3. use the command `mongorestore -d DB_NAME /PATH/TO/FOLDER` as described [here](https://www.mongodb.com/basics/bson) for importing `bson` type files. To make it easy you can name the DB the same as the restore folder (that you'll have to request from an active maintainer), but you can also name it whatever you like you'll just need to change the variable `DB_NAME` in your `.env` file to match what you name it during this step.

### Bringing it all together
1. run `mongosh` to see what the URL of your database is. It should be something along the lines of `mongodb://....`. Make sure to write this URL down for later! You can then close `mongosh` by running `exit()` in the prompt

2. edit your `.env` file and make sure the variable `DATABASE_URL` is set to the URL you wrote down from the last step.
    - if you changed the name of the database from `core-dev` to something else make sure to change the variable `DB_NAME` accordingly!

3. run the script `dev` (as defined in the `package.json`) to start serving the API locally! Suggested run options are:
    ```bash
        npm run dev;
        # or
        yarn dev;
        # or
        pnpm dev;
    ```

4. Profit! Everything should now be up and running for you to test the API locally using a tool like [Insomnia](https://insomnia.rest/) or [Postman](https://www.postman.com/) or even [cURL!](https://curl.se/docs/manpage.html)

## Tips and Tricks:
- If you're not a fan of only interacting with the database using the prompt from `mongosh` then you can use something like [Compass by Mongo](https://www.mongodb.com/products/tools/compass) which is a GUI for exploring your data more naturally.

## Issues
If you have any issues with the local setup process or the API in general please log an issue for other maintainers to help out

## Be Kind Always :green_heart:
README written by stump - coronary - vera
