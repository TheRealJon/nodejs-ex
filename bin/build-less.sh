#!/usr/bin/env bash

echo "Building less."
lessc --include-path=node_modules:node_modules/patternfly/node_modules ./styles/main.less ./assets/css/main.css
