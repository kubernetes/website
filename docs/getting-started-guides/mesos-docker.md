---
assignees:
- jdef
- karlkfi
title: Kubernetes on Mesos on Docker
---

The mesos/docker provider uses docker-compose to launch Kubernetes as a Mesos framework, running in docker with its
dependencies (etcd & mesos).

* TOC
{:toc}

## Cluster Goals

- kubernetes development
- pod/service development
- demoing
- fast deployment
- minimal hardware requirements
- minimal configuration
- entry point for exploration
- simplified networking
- fast end-to-end tests
- local deployment

Non-Goals:

- high availability
- fault tolerance
- remote deployment
- production usage
- monitoring
- long running
- state persistence across restarts

## Cluster Topology

The cluster consists of several docker containers linked together by docker-managed hostnames:

| Component                     | Hostname                    | Description                                                                             |
|-------------------------------|-----------------------------|-----------------------------------------------------------------------------------------|
| docker-grand-ambassador       |                             | Proxy to allow circular hostname linking in docker                                      |
| etcd                          | etcd                        | Key/Value store used by Mesos                                                           |
| Mesos Master                  | mesosmaster1                | REST endpoint for interacting with Mesos                                                |
| Mesos Slave (x2)              | mesosslave1, mesosslave2    | Mesos agents that offer resources and run framework executors (e.g. Kubernetes Kublets) |
| Kubernetes API Server         | apiserver                   | REST endpoint for interacting with Kubernetes                                           |
| Kubernetes Controller Manager | controller                  |                                                                                         |
| Kubernetes Scheduler          | scheduler                   | Schedules container deployment by accepting Mesos offers                                |

## Prerequisites

Required:

- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) - version control system
- [Docker CLI](https://docs.docker.com/) - container management command line client
- [Docker Engine](https://docs.docker.com/) - container management daemon
  - On Mac, use [Docker Machine](https://docs.docker.com/machine/install-machine/)
- [Docker Compose](https://docs.docker.com/compose/install/) - multi-container application orchestration

Optional:

- [Virtual Box](https://www.virtualbox.org/wiki/Downloads)
  - Free x86 virtualization engine with a Docker Machine driver
- [Golang](https://golang.org/doc/install) - Go programming language
  - Required to build Kubernetes locally
- [Make](https://en.wikipedia.org/wiki/Make_(software))  - Utility for building executables from source
  - Required to build Kubernetes locally with make

### Install on Mac (Homebrew)

It's possible to install all of the above via [Homebrew](http://brew.sh/) on a Mac.

Some steps print instructions for configuring or launching. Make sure each is properly set up before continuing to the next step.

```shell
brew install git
brew install caskroom/cask/brew-cask
brew cask install virtualbox
brew install docker
brew install docker-machine
brew install docker-compose
```

### Install on Linux

Most of the above are available via apt and yum, but depending on your distribution, you may have to install via other
means to get the latest versions.

It is recommended to use Ubuntu, simply because it best supports AUFS, used by docker to mount volumes. Alternate file
systems may not fully support docker-in-docker.

In order to build Kubernetes, the current user must be in a docker group with sudo privileges.
See the docker docs for [instructions](https://docs.docker.com/installation/ubuntulinux/#create-a-docker-group).


#### Docker Machine Config (Mac)

If on a Mac using docker-machine, the following steps will make the docker IPs (in the virtualbox VM) reachable from the
host machine (Mac).

1. Create VM

   oracle-virtualbox

   ```shell
   docker-machine create --driver virtualbox kube-dev
   eval "$(docker-machine env kube-dev)"
   ```

2. Set the VM's host-only network to "promiscuous mode":

    oracle-virtualbox

    ```conf
    docker-machine stop kube-dev
    VBoxManage modifyvm kube-dev --nicpromisc2 allow-all
    docker-machine start kube-dev
    ```

    This allows the VM to accept packets that were sent to a different IP.

    Since the host-only network routes traffic between VMs and the host, other VMs will also be able to access the docker
    IPs, if they have the following route.

1. Route traffic to docker through the docker-machine IP:

```shell
sudo route -n add -net 172.17.0.0 $(docker-machine ip kube-dev)
```

    Since the docker-machine IP can change when the VM is restarted, this route may need to be updated over time.
    To delete the route later: `sudo route delete 172.17.0.0`


## Walkthrough

1. Checkout source

    ```shell
    git clone https://github.com/kubernetes/kubernetes
    cd kubernetes
    ```

    By default, that will get you the bleeding edge of master branch.
    You may want a [release branch](https://github.com/kubernetes/kubernetes/releases) instead,
    if you have trouble with master.

1. Build binaries

    You'll need to build kubectl (CLI) for your local architecture and operating system and the rest of the server binaries for linux/amd64.

    Building a new release covers both cases:

    ```shell
    KUBERNETES_CONTRIB=mesos build/release.sh
    ```

    For developers, it may be faster to [build locally](#build-locally).

1. [Optional] Build docker images

    The following docker images are built as part of `./cluster/kube-up.sh`, but it may make sense to build them manually the first time because it may take a while.

    1. Test image includes all the dependencies required for running e2e tests.

        ```shell
        ./cluster/mesos/docker/test/build.sh
        ```

        In the future, this image may be available to download. It doesn't contain anything specific to the current release, except its build dependencies.

    1. Kubernetes-Mesos image includes the compiled linux binaries.

        ```shell
        ./cluster/mesos/docker/km/build.sh
        ```

        This image needs to be built every time you recompile the server binaries.

1. [Optional] Configure Mesos resources

    By default, the mesos-slaves are configured to offer a fixed amount of resources (cpus, memory, disk, ports).
    If you want to customize these values, update the `MESOS_RESOURCES` environment variables in `./cluster/mesos/docker/docker-compose.yml`.
    If you delete the `MESOS_RESOURCES` environment variables, the resource amounts will be auto-detected based on the host resources, which will over-provision by > 2x.

    If the configured resources are not available on the host, you may want to increase the resources available to Docker Engine.
    You may have to increase you VM disk, memory, or cpu allocation. See the Docker Machine docs for details
    ([Virtualbox](https://docs.docker.com/machine/drivers/virtualbox))


1. Configure provider

    ```shell
    export KUBERNETES_PROVIDER=mesos/docker
    ```

    This tells cluster scripts to use the code within `cluster/mesos/docker`.

1. Create cluster

    ```shell
    ./cluster/kube-up.sh
    ```

    If you manually built all the above docker images, you can skip that step during kube-up:

    ```shell
    MESOS_DOCKER_SKIP_BUILD=true ./cluster/kube-up.sh
    ```

    After deploying the cluster, `~/.kube/config` will be created or updated to configure kubectl to target the new cluster.

1. Explore examples

    To learn more about Pods, Volumes, Labels, Services, and Replication Controllers, start with the
    [Kubernetes Walkthrough](/docs/user-guide/walkthrough/).

    To skip to a more advanced example, see the [Guestbook Example](https://github.com/kubernetes/kubernetes/tree/{{page.githubbranch}}/examples/guestbook/)

1. Destroy cluster

    ```shell
    ./cluster/kube-down.sh
    ```

## Addons

The `kube-up` for the mesos/docker provider will automatically deploy KubeDNS and KubeUI addons as pods/services.

Check their status with:

```shell
./cluster/kubectl.sh get pods --namespace=kube-system
```

### KubeUI

The web-based Kubernetes UI is accessible in a browser through the API Server proxy: `https://<apiserver>:6443/ui/`.

By default, basic-auth is configured with user `admin` and password `admin`.

The IP of the API Server can be found using `./cluster/kubectl.sh cluster-info`.


## End To End Testing

Warning: e2e tests can take a long time to run. You may not want to run them immediately if you're just getting started.

While your cluster is up, you can run the end-to-end tests:

```shell
./cluster/test-e2e.sh
```

Notable parameters:
- Increase the logging verbosity: `-v=2`
- Run only a subset of the tests (regex matching): `-ginkgo.focus=<pattern>`

To build, deploy, test, and destroy, all in one command (plus unit & integration tests):

```shell
make test_e2e
```

## Kubernetes CLI

When compiling from source, it's simplest to use the `./cluster/kubectl.sh` script, which detects your platform &
architecture and proxies commands to the appropriate `kubectl` binary.

ex: `./cluster/kubectl.sh get pods`


## Helpful scripts

- Kill all docker containers

    ```shell
    docker ps -q -a | xargs docker rm -f
    ```

- Clean up unused docker volumes

    ```shell
    docker run -v /var/run/docker.sock:/var/run/docker.sock -v /var/lib/docker:/var/lib/docker --rm martin/docker-cleanup-volumes
    ```

## Build Locally

The steps above tell you how to build in a container, for minimal local dependencies. But if you have Go and Make installed you can build locally much faster:

```shell
KUBERNETES_CONTRIB=mesos make
```

However, if you're not on linux, you'll still need to compile the linux/amd64 server binaries:

```shell
KUBERNETES_CONTRIB=mesos build/run.sh hack/build-go.sh
```

The above two steps should be significantly faster than cross-compiling a whole new release for every supported platform (which is what `./build/release.sh` does).

Breakdown:

- `KUBERNETES_CONTRIB=mesos` - enables building of the contrib/mesos binaries
- `hack/build-go.sh` - builds the Go binaries for the current architecture (linux/amd64 when in a docker container)
- `make` - delegates to `hack/build-go.sh`
- `build/run.sh` - executes a command in the build container
- `build/release.sh` - cross compiles Kubernetes for all supported architectures and operating systems (slow)

## Support Level


IaaS Provider        | Config. Mgmt | OS     | Networking  | Docs                                              | Conforms | Support Level
-------------------- | ------------ | ------ | ----------  | ---------------------------------------------     | ---------| ----------------------------
Mesos/Docker         | custom       | Ubuntu | Docker      | [docs](/docs/getting-started-guides/mesos-docker)                           |          | Community ([Kubernetes-Mesos Authors](https://github.com/mesosphere/kubernetes-mesos/blob/master/AUTHORS.md))

For support level information on all solutions, see the [Table of solutions](/docs/getting-started-guides/#table-of-solutions) chart.

