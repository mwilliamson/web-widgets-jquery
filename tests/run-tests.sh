#!/usr/bin/env sh

set -e

THIS_DIR=$(dirname "$0")
PIDFILE="${THIS_DIR}/_server.pid"

kill_server() {
    if [ -f $PIDFILE ]; then
        kill `cat "${PIDFILE}"` || true
        rm -f "${PIDFILE}"
    fi
}

kill_server

node "${THIS_DIR}/server.js" &
SERVER_PID=$!
echo ${SERVER_PID} > "${THIS_DIR}/_server.pid"
"${THIS_DIR}/../node_modules/.bin/grunt" qunit

kill_server
