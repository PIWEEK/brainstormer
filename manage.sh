#!/usr/bin/env bash
function build-devenv {
    pushd docker/devenv;
    echo "Building development image"
    docker compose build
    popd;    
}

function start-devenv {
    echo "Starting devenv"
    docker compose -f docker/devenv/docker-compose.yaml up -d
    docker exec -ti brainsurfer-devenv-main /home/brainsurfer/docker/devenv/start-tmux.sh
}

function stop-devenv {
    echo "Stoping devenv"
    docker compose -f docker/devenv/docker-compose.yaml stop;
}

function deploy-docker {
    pushd docker/deploy;
    ./deploy-docker.sh $@
    popd;    
}


function usage {
    echo "Brainsurfer manager"
    echo "USAGE: $0 OPTION"
    echo "Options:"
    echo "- build-devenv                     Build docker development oriented image"
    echo "- start-devenv                     Start the development oriented docker compose service."
    echo "- stop-devenv                      Stops the development oriented docker compose service."
    echo "- deploy-docker                    Deploy docker images locally."
    echo ""
}

case $1 in
    build-devenv)
        build-devenv ${@:2}
        ;;
    start-devenv)
        start-devenv ${@:2}
        ;;
    stop-devenv)
        stop-devenv ${@:2}
        ;;
    deploy-docker)
        deploy-docker ${@:2}
        ;;        
    *)
        usage
        ;;
esac
