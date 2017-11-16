#!/bin/bash
if [ -z "${SLACK_INSTALLATION_PATH}" ]; then
    if [ `uname` == "Linux" ]; then
        SLACK_INSTALLATION_PATH=/usr/lib/slack/resources
    else
        SLACK_INSTALLATION_PATH=/Applications/Slack.app/Contents/Resources
    fi
fi
SLACK_SSB_FILE="${SLACK_INSTALLATION_PATH}/app.asar.unpacked/src/static/ssb-interop.js"

cat "${SLACK_SSB_FILE}" | grep loadEvergageCustom > /dev/null
if [ $? == "0" ]; then
    echo "Slack already patched, doing nothing."
else
    echo "Patching slack at ${SLACK_SSB_FILE}"
    cat ./ssb-interop-snippet-append.js | sudo tee -a "${SLACK_SSB_FILE}" > /dev/null
fi
