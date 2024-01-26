#!/bin/bash

python3 -m venv venv
. venv/bin/activate
pip install -Ur requirements.txt -e .

cd site
python3 ../scrape.py

> assets/data.js cat <<EOF
let eurirsRaw=\`
$(cat eurirs.csv)
\`;
let euriborRaw=\`
$(cat euribor.csv)
\`;
EOF

> assets/last-update.js cat <<EOF
let lastUpdated='$(date '+%c %Z')';
EOF

cd -