# slack-customizations
Some customizations to slack, such as some keybindings, dark theme, etc

## Installation Instructions
1. Sync this repo locally

    `git clone https://github.com/glajchs/slack-customizations.git`
2. Run the patch-slack.sh from within the slack-customizations folder (NOTE: You need to run this step *every time* slack does a desktop app update for new versions, or if you re-install slack)

    Linux/Mac

    `cd slack-customizations; ./patch-slack.sh`

    Windows

    `cd slack-customizations; patch-slack.bat`

3. Within the Slack UI, go to File->Preferences (Ctrl+,), and on the left select the "Plugins" section at the bottom.  Enable plugins as a whole, and then individually any set of plugins that you want.

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

To disable all functionality, first you should go and disable all the plugins by unchecking "Settings -> Plugins -> Enable Slack Plugins".

Also the plugin files are all stored as a symlinked directory at "${HOME}/.slack" for Linux/Mac, or "%APPLOCALDATA%\.slack" for Windows.  If you delete the symlinked directory the plugins won't load.

I don't have a "uninstallation" instructions to unpatch the ssb-interop.js and index.js files.

Treat this as a last resort though, since plugins as a whole, or individual plugins, can be disabled in the Slack settings UI (Ctrl+,).

Also The patched ssb-interop.js and index.js files only have a small number of lines appended to the end of them.  If you want you can manually edit these files to remove the ending sections.  Look for the `/** Start Slack Plugins Section **/` line.


## How to run slack in devtools mode
To run slack in a mode that gives you access to the webkit devtool (Inspect Element), go to a terminal, and set the variable SLACK_DEVELOPER_MENU

Linux/Mac:

`export SLACK_DEVELOPER_MENU=true`

Windows:

`set SLACK_DEVELOPER_MENU=true`

Then launch slack from that terminal

Linux:

`slack &`

Mac:

`open -a Slack`

Windows:

`%LOCALAPPDATA%\slack\slack.exe`

Now after you've launched, you can right-click anywhere and hit "Inspect Element".  Customize away!

## Caveats
Tested first on Linux.  Windows support generated recently.  Mac support supposedly works, but I can't test that since macs don't do VMs.

## Wishlist for the future

- Have the plugins auto-update instead of requiring constant resyncs from git
- Have real community created plugins
- Add more granular options to Slack's "snooze for N time" dropdown for their notifications
- Add a keyboard shortcut to star/unstar a conversation
- Implement a mode where the ordering of the channels are based upon most recent activity
- Implement a way to switch between ordering types (custom (see plugin-channel-reordering.js.inprog), alphabetical (default), most recent activity (to be implemented))
- Find a way to get rid of the distinctions between types "Direct Messages, Apps, Channels", and just have 1 big list in the sidebar
- Suggestions welcome!
