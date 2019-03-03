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

SHOULD_PATCH_SSB=true

cat "${SLACK_SSB_FILE}" | grep loadSlackPlugins > /dev/null
if [ $? == "0" ]; then
    SHOULD_PATCH_SSB=false
    read -p "Slack's ssb-interop.js is already patched. Do you want to re-apply the patch? (y|n)? " choice
    case "$choice" in
        y|Y )
            sed -n -i.bak '/Start Slack Plugins/q;p' ${SLACK_SSB_FILE}
            SHOULD_PATCH_SSB=true
            ;;
        * )
            ;;
    esac
fi

if [ "${SHOULD_PATCH_SSB}" == "true" ]; then
    echo "Patching Slack's ssb-interop.js file at ${SLACK_SSB_FILE}"
    cat ./patch-files/ssb-interop-snippet-append.js | sudo tee -a "${SLACK_SSB_FILE}" > /dev/null
else
    echo "Slack's ssb-interop.js already patched, doing nothing."
fi

SHOULD_PATCH_INDEX=true

cat "${SLACK_INDEX_FILE}" | grep loadSlackPlugins > /dev/null
if [ $? == "0" ]; then
    SHOULD_PATCH_INDEX=false
    read -p "Slack's index.js is already patched. Do you want to re-apply the patch? (y|n)? " choice
    case "$choice" in
        y|Y )
            sed -n -i.bak '/Start Slack Plugins/q;p' ${SLACK_INDEX_FILE}
            SHOULD_PATCH_INDEX=true
            ;;
        * )
            ;;
    esac
fi

if [ "${SHOULD_PATCH_INDEX}" == "true" ]; then
    echo "Patching Slack's index.js file at ${SLACK_INDEX_FILE}"
    cat ./patch-files/index-snippet-append.js | sudo tee -a "${SLACK_INDEX_FILE}" > /dev/null
else
    echo "Slack's index.js already patched, doing nothing."
fi

if [ ! -f "${HOME}/.slack" ]; then
    ln -s ${PWD} ${HOME}/.slack
fi
