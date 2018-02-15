# Backstage Server

Backstage Server is a wonderfully easy way to preview particular versions of your static site for QA purposes.

## Usage

Create a fresh new repo, and install Backstage Server:

```
$ npm install --save backstage-server
```

or

```
$ yarn add backstage-server
```

In your `index.js` file, import `getApp` from Backstage Server, as well as the storage backend you want to use. Then configure your server:

```JavaScript
// index.js
import path from 'path'
import { getApp } from 'backstage-server'
import { fileSystem } from 'backstage-server/dist/storage-backends/file-system'

getApp(fileSystem(path.join(__dirname, '../files'))).listen(3000)
```

Note that `getApp` returns an `Express` object, which means you can call `.listen()` on it and start your server.

To make a test upload, run the following command:

```
$ curl -X POST -F package=@"$HOME/path/to/your/file.jpg" http://localhost:3000/APP_NAME/KEY_NAME -v
```
