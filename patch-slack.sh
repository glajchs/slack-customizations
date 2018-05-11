#!/bin/bash
if [ -z "${SLACK_INSTALLATION_PATH}" ]; then
    if [ `uname` == "Linux" ]; then
        SLACK_INSTALLATION_PATH=/usr/lib/slack/resources
    else
        SLACK_INSTALLATION_PATH=/Applications/Slack.app/Contents/Resources
    fi
fi
SLACK_SSB_FILE="${SLACK_INSTALLATION_PATH}/app.asar.unpacked/src/static/ssb-interop.js"
SLACK_INDEX_FILE="${SLACK_INSTALLATION_PATH}/app.asar.unpacked/src/static/index.js"

cat "${SLACK_SSB_FILE}" | grep loadSlackPlugins > /dev/null
if [ $? == "0" ]; then
    echo "Slack's ssb-interop.js already patched, doing nothing."
else
    echo "Patching Slack's ssb-interop.js file at ${SLACK_SSB_FILE}"
    cat ./patch-files/ssb-interop-snippet-append.js | sudo tee -a "${SLACK_SSB_FILE}" > /dev/null
fi

cat "${SLACK_INDEX_FILE}" | grep loadSlackPlugins > /dev/null
if [ $? == "0" ]; then
    echo "Slack's index.js already patched, doing nothing."
else
    echo "Patching Slack's index.js file at ${SLACK_INDEX_FILE}"
    cat ./patch-files/index-snippet-append.js | sudo tee -a "${SLACK_INDEX_FILE}" > /dev/null
fi
