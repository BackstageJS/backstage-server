# Treehouse

Treehouse is a wonderfully easy way to preview particular versions of your static site for QA purposes.

## Usage

Create a fresh new repo, and install Treehouse:

```
$ npm install --save treehouse
```

or

```
$ yarn add treehouse
```

In your `index.js` file, import `getApp` from Treehouse, as well as the storage backend you want to use. Then configure your server:

```JavaScript
// index.js
import path from 'path'
import { getApp } from 'treehouse'
import { fileSystem } from 'treehouse/dist/storage-backends/file-system'

getApp(fileSystem(path.join(__dirname, '../files'))).listen(3000)
```

Note that `getApp` returns an `Express` object, which means you can call `.listen()` on it and start your server.

To make a test upload, run the following command:

```
$ curl -X POST -F package=@"$HOME/path/to/your/file.jpg" http://localhost:3000/APP_NAME/KEY_NAME -v
```
