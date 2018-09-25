#!/bin/bash

pip install pyyaml

CONFIGS=(community reference release)

for config in ${CONFIGS[@]}; do
    ./update-imported-docs $config.yml
done

