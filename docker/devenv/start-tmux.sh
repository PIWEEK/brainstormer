#!/usr/bin/env bash

tmux -2 new-session -d -s brainsurfer

tmux rename-window -t brainsurfer:0 'back'
tmux select-window -t brainsurfer:0
# tmux send-keys -t brainsurfer 'cd /home/brainsurfer/brainsurfer-back' enter C-l
# tmux send-keys -t brainsurfer 'python3 -m venv .env' enter C-l
# tmux send-keys -t brainsurfer '.env/bin/pip install pip --upgrade' enter C-l
# tmux send-keys -t brainsurfer '.env/bin/pip install -r requirements.txt' enter C-l
# tmux send-keys -t brainsurfer 'cd src' enter C-l
# tmux send-keys -t brainsurfer '../.env/bin/python app.py run' enter

tmux new-window -t brainsurfer:1 -n 'front'
tmux select-window -t brainsurfer:1
tmux send-keys -t brainsurfer 'cd /home/brainsurfer/front' enter C-l
tmux send-keys -t brainsurfer 'npm install' enter C-l
tmux send-keys -t brainsurfer 'npm run dev' enter

tmux -2 attach-session -t brainsurfer
