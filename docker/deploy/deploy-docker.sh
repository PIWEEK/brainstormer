#!/bin/bash

function usage() {
    echo "Usage: $0 <quote-module>"
    echo
    echo "  Valid quote-modules: brainsurfer-back brainsurfer-nginx all"
    echo
    echo "Example: $0 brainsurfer-back"
}

function restart_module(){
    docker compose -f docker-compose.yml stop $1
    docker compose -f docker-compose.yml rm -v -f $1
    docker compose -f docker-compose.yml up -d --no-deps $1
}

function update_back() {
    echo "#############"
    echo "Updating back"
    echo "#############"
    echo "...Updating back: Create docker"
    docker build --no-cache=true -t brainsurfer-back:1.0 -f back ../../
    restart_module brainsurfer-back
    echo "Updating back: done!"
}

function update_nginx() {
    echo "##############"
    echo "Updating nginx"
    echo "##############"
    echo "...Updating nginx: Create docker"
    docker build --no-cache=true -t brainsurfer-nginx:1.0 -f nginx ./
    restart_module brainsurfer-nginx
    echo "Updating nginx: done!"
}

case "$1" in
    brainsurfer-back)
        update_back;;
    brainsurfer-nginx)
        update_nginx;;
    all)
        update_back && update_nginx;;
    *) echo
        usage;;
esac
