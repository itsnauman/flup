# flup

Flup is a simple chat application that lives in the terminal. It implements both the `server` and `client`. 
This project was made for the sake of learning about `node.js` sockets and `net` module.

### Usage:
```
Usage: index [options]

Options:

  -h, --help           output usage information
  -V, --version        output the version number
  -s, --server <host>  Start flup chat server
  -c, --client <host>  Start a chat client
```
###### Clone the source code:
`$ http://github.com/itsnauman/flup.git`

###### Start the flup server:
`$ node index.js --server localhost:8000`

###### Connect to the server using the client:
`$ node index.js --client localhost:8000`
