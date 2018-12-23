# Judge

An online judge system.

## Getting started

### external packages

- Install [mongodb](https://docs.mongodb.com/manual/administration/install-on-linux/)
- Install redis by
  ```bash
  sudo apt install redis-server
  ```
- Install npm
- Install firejail by
  ```bash
  sudo apt install firejail
  ```

### npm

```bash
# install dependencies
npm install
# start live client and server development server
npm run dev

# start production server
npm start
```

## Notes on npm packages

- Webpack 4.x does not work.

## Obtain Environment Configurations

set you environment configurations in `/config.js`

in your code, get back your configs by using `process:config`
