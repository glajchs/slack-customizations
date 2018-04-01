# slack-customizations
Some customizations to slack, such as some keybindings, dark theme, etc

## Installation Instructions
1. Sync this repo locally

    `git clone https://github.com/glajchs/slack-customizations.git`
2. Run the patch-slack.sh from within the slack-customizations folder

    `cd slack-customizations; ./patch-slack.sh`
3. Move any files you want run that end with ".css" or ".js" into a folder in your home directory named ".slack".

    You can either make a folder there and copy the files from the ".slack" folder in this repo over, or you can make a symlink from this folder to that like this:
    
    `ln -s $PWD/.slack $HOME/`

## How to add your own themes
Simple, just save your theme as a file ending in ".css" into the $HOME/.slack directory!  To disable other files in that directory from loading (so you don't get 2 themes), rename all the ".css" files to something else, such as ".css_old"
Some other example themes out there that I've found are:
- https://github.com/laCour/slack-night-mode/tree/master/css/raw/black.css
- https://github.com/laCour/slack-night-mode/tree/master/css/raw/variants/*
- https://github.com/widget-/slack-black-theme/blob/master/custom.css

For those unfamiliar with working with github files.  For any given file, click the "Raw" button, then on the resulting page right-click anywhere on the page and hit "Save as".  Save this into your $HOME:/.slack folder

## Uninstallation Instructions

While I don't have uninstallation instructions to *unpatch* the ssb-interop.sh file, you can essentially remove all customizations by emptying your $HOME:/.slack/ folder of all files that end with ".css" or ".js"

## Default customization files

- .slack/black.css

    This file is taken from the "slack-night-mode" theme, but the portions that customize the left sidebar have been commented out.  This allows this theme to play nicely with your sidebar theme.  See the original file here: https://github.com/laCour/slack-night-mode/blob/master/css/raw/black.css

- .slack/black-message-separator-lines.css

    This adds tiny grey lines between messages, making it easier to distinguish between the lines.  If this isn't your cup of tee, delete or rename this file to not end in ".js".

- .slack/plugin-customSlack.js

    This adds a number of keyboard shortcuts.  Mac people let me know if this works with `cmd+KEY` instead of `ctrl+KEY`

    `ctrl+e` and `ctrl+n` will open the "Jump to" dialog to help facilitate opening recent, or type-completing to open any, conversation or channel.  This is the same thing that `ctrl+k` does by default.

    `ctrl+w` closes the currently selected direct message, thread, or channel.  Note that for channels, this means that you will no longer be in the channel and will have to rejoin.  Sadly slack has no great way to be "in" a channel, but remove it from the visible list until you get more messages.

    `ctrl+pageup` and `ctrl+pagedown` will move to the previous/next conversation in the sidebar list.  I've implemented it using a 250ms delay to enable multiple keystrokes taking effect.  This makes it significantly less laggy, as each conversation open locks the javascript thread for a good while.  This results in a *slight* delay in going to the previous/next room, but a much smoother ability to keep going to next/previous rooms seemlessly.  It will change the selected room color in the sidebar immediatelly however to give good feedback.

- .slack/plugin-channel-reordering.js.inprog

    This file will not be loaded by default.  It is a work in progress.  It binds `ctrl+shift+pageup` and `ctrl+shift+pagedown` to moving the current channel/thread/direct message up/down one in the list.  While the rooms do move, and via a localStorage restore their ordering after a slack relaunch, there are still significant bugs in this implementation.  More work TBD.

## How to run slack in devtools mode
To run slack in a mode that gives you access to the webkit devtool (Inspect Element), go to a terminal, and set the variable SLACK_DEVELOPER_MENU

`export SLACK_DEVELOPER_MENU=true`

Then launch slack from that terminal

`slack &`

or on a Mac

`open -a Slack`

Now after you've launched, you can right-click anywhere and hit "Inspect Element".  Customize away!

## Caveats
Tested first on Linux, starting to do testing w/Macs via other machines.  Windows not tested at all yet (and there are a few things that I know need doing before it will work).

## Wishlist for the future

- Make the emoticon search widget allow for substring search (why isn't this built-in!!)
- Implement a proper `ctrl+f` find in currently open conversation, similar to what you'd have in your browser.  I would have this be in addition to the current slack search, which is fine for a "search all the things" implementation, but much less usable when searching within the currently open conversation.
- Add a keyboard shortcut to star/unstar a conversation
- Implement a mode where the ordering of the channels are based upon most recent activity
- Implement a way to switch between ordering types (custom (see plugin-channel-reordering.js.inprog), alphabetical (default), most recent activity (to be implemented))
- Find a way to get rid of the distinctions between types "Direct Messages, Apps, Channels", and just have 1 big list in the sidebar
- Suggestions welcome!
