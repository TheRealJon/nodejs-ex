#!/usr/bin/env bash

echo "Copying PatternFly fonts"
cp -r ./node_modules/patternfly/dist/fonts ./assets/fonts

echo "Copying PatternFly Images"
cp -r ./node_modules/patternfly/dist/img ./assets/img
