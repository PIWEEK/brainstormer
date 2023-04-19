#!/bin/sh

pip install --upgrade -r server/requirements.txt --quiet --exists-action i
(cd client && python -m http.server &)
python server/main.py
