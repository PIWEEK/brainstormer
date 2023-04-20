#!/bin/sh

pip install --upgrade -r server/requirements.txt --quiet --exists-action i
(cd client && python3 -m http.server &)
python3 server/main.py
