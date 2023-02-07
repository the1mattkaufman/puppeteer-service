#!/usr/bin/env bash
set -e

./torproxy.sh &
npm start &
wait -n