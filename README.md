# chatjs
A basic chat application build using [node.js](http://nodejs.org)
and [socket.io](http://socket.io). Initially developped to bench
the performances of socket.io.

## Developpement

 * Status : Active
 * Version : 0.0.3
 * Main developper : svartbergtroll
 * Stability : *meh* I suppose it's okay

Forks & pull requests welcome.

## License
               DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
                       Version 2, December 2004
     
    Copyright (C) 2014 Thomas Maurice <tmaurice59@gmail.com>
    
    Everyone is permitted to copy and distribute verbatim or modified
    copies of this license document, and changing it is allowed as long
    as the name is changed.
     
               DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
      TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION
     
     0. You just DO WHAT THE FUCK YOU WANT TO.

## Features
For now the app supports only one big chatroom. The main functionalities are :

 * [Markdown](http://daringfireball.net/projects/markdown/) formating for all your messages
 * User nicknames, and nickname changes
 * Nickname color, and randomization of it
 * User list in the chat
 * Auto reconnection on server or client failure
 * Connection/Deconnection notification
 * Some smileys :)
 * Status updates ! Similar to the /me command in IRC
 * A complete help window
 * Clickable links
 * Ninja mode (accessible via Alt + n) it will make the message disapear from your console after 2 minutes. Handy if you are at work ;)
 * Some keyboard shortcuts

## Build
To build it you need the following :

 * node.js
 * npm
 * bower (install with `sudo npm install -g bower`)
 * grunt (install with `sudo npm install -g grunt-cli`)

Then run the following commands to build the app:

    npm install
    bower install
    grunt

And it should do it ! The app will be built in the `build` directory.

## Running
To run it, just use the `grunt deploy` command :)

## TODO
 * Implement several chatrooms.
 * Implement user private messaging.
 * Make a nickname **unique** within one chatroom.
 * Enhance design
 * Make the code clean
 * Maybe rewrite some part of in in coffeescript
