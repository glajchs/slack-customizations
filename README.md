# slack-customizations
Some customizations to slack, such as some keybindings, dark theme, etc

## Installation Instructions
1. Sync this repo locally

    `git clone https://github.com/glajchs/slack-customizations.git`
2. Run the patch-slack.sh from within the slack-customizations folder (NOTE: You need to run this step *every time* slack does a desktop app update for new versions, or if you re-install slack)

    `cd slack-customizations; ./patch-slack.sh`
3. Move any files you want run that end with ".css" or ".js" into a folder in your home directory named ".slack".

    You can either make a folder there and copy the files from the ".slack" folder in this repo over, or you can make a symlink from this folder to that like this:

    `ln -s $PWD/.slack $HOME/`

4. Within the Slack UI, go to File->Preferences (Ctrl+,), and on the left select the "Plugins" section at the bottom.  Enable plugins as a whole, and then individually any set of plugins that you want.

   ![Image of Slack Plugins](https://raw.githubusercontent.com/glajchs/slack-customizations/master/readme-files/slack-plugins-ui.png)

## Example screenshot of plugins

#### Random Emoji (I'm Feeling Lucky)

![Image of Random Emoji Popup](https://raw.githubusercontent.com/glajchs/slack-customizations/master/readme-files/slack-plugin-random-emoji.png)

#### Simple Find

![Image of Simple Find](https://raw.githubusercontent.com/glajchs/slack-customizations/master/readme-files/slack-plugin-simple-find.png)

#### 

## Current list of Plugins

See the image at the top to enable different specific plugins.  The current list, in rough order of usefulness for the general public, includes:

- Dark Theme
- Random Emoji
- Emoji Big Preview
- No Laggy Scroll
- Simple Find
- Reactions Hover Position
- Keybind - Close Chat
- Keybind - Next/Prev Chat
- Keybind - New/Open Chat

## How to create your own plugins:

You just need a `<something>.js` plugin file that you put in your `$HOME/.slack` directory.  This will get picked up, and you can ingest other files (such as .css files) that you also put into your $HOME/.slack directory.

See [https://github.com/glajchs/slack-customizations/blob/master/.slack/plugin-darktheme.js](.slack/plugin-darktheme.js) for a simple example of loading a CSS file via a new plugin.

Just make sure to generate a unique `pluginId`, give it a unique `pluginName`, and some description sections (so that your plugin will render nicely on the plugin list page).  Also consider using the `prereqsReady` function if your plugin needs to wait for something in Slack to finish loading before it initializes.

## Uninstallation Instructions

While I don't have uninstallation instructions to *unpatch* the ssb-interop.sh file, you can essentially remove all customizations by emptying your $HOME:/.slack/ folder of all files that end with ".css" or ".js", and this will effectively remove all the plugins from the system.

Treat this as a last resort though, since plugins as a whole, or individual plugins, can be disabled in the Slack settings UI (Ctrl+,).

Also The patched ssb-interop.js and index.js files only have a small number of lines appended to the end of them.  If you want you can manually edit these files to remove the ending sections.  Look for the `/** Start Slack Plugins Section **/` line.


## How to run slack in devtools mode
To run slack in a mode that gives you access to the webkit devtool (Inspect Element), go to a terminal, and set the variable SLACK_DEVELOPER_MENU

`export SLACK_DEVELOPER_MENU=true`

Then launch slack from that terminal

`slack &`

or on a Mac

`open -a Slack`

Now after you've launched, you can right-click anywhere and hit "Inspect Element".  Customize away!

## Caveats
Tested first on Linux, starting to do testing w/Macs via other machines.  Windows not tested at all yet (and there are a few things that I know need doing before it will work, such as some path separator character considerations).

## Wishlist for the future

- Add a keyboard shortcut to star/unstar a conversation
- Implement a mode where the ordering of the channels are based upon most recent activity
- Implement a way to switch between ordering types (custom (see plugin-channel-reordering.js.inprog), alphabetical (default), most recent activity (to be implemented))
- Find a way to get rid of the distinctions between types "Direct Messages, Apps, Channels", and just have 1 big list in the sidebar
- Suggestions welcome!
