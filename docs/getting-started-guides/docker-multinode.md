---
---

This guide will set up a 2-node Kubernetes cluster, consisting of a _master_ node which hosts the API server and orchestrates work
and a _worker_ node which receives work from the master.  You can repeat the process of adding worker nodes an arbitrary number of
times to create larger clusters.

Here's a diagram of what the final result will look like:

![Kubernetes Single Node on Docker](/images/docs/k8s-docker.png)

_Note_:
These instructions are somewhat significantly more advanced than the [single node](/docs/getting-started-guides/docker) instructions.  If you are
interested in just starting to explore Kubernetes, we recommend that you start there.

_Note_:
There is a [bug](https://github.com/docker/docker/issues/14106) in Docker 1.7.0 that prevents this from working correctly.
Please install Docker 1.6.2 or Docker 1.7.1.

* TOC
{:toc}

## Prerequisites

You need a machine with docker of right version installed.

### Bootstrap Docker

This guide also uses a pattern of running two instances of the Docker daemon
   1) A _bootstrap_ Docker instance which is used to start system daemons like `flanneld` and `etcd`
   2) A _main_ Docker instance which is used for the Kubernetes infrastructure and user's scheduled containers

This pattern is necessary because the `flannel` daemon is responsible for setting up and managing the network that interconnects
all of the Docker containers created by Kubernetes.  To achieve this, it must run outside of the _main_ Docker daemon.  However,
it is still useful to use containers for deployment and management, so we create a simpler _bootstrap_ daemon to achieve this.

You can specify k8s version on very node before install:

```shell
export K8S_VERSION=<your_k8s_version (e.g. 1.0.3)>
```

Otherwise, we'll use latest `hyperkube` image as default k8s version.

## Master Node

The first step in the process is to initialize the master node.

Clone the Kubernetes repo, and run [master.sh](/docs/getting-started-guides/docker-multinode/master.sh) on the master machine with root:

```shell
cd kubernetes/docs/getting-started-guides/docker-multinode/
./master.sh
...
`Master done!`
```

See [here](/docs/getting-started-guides/docker-multinode/master) for detailed instructions explanation.

## Adding a worker node

Once your master is up and running you can add one or more workers on different machines.

Clone the Kubernetes repo, and run [worker.sh](/docs/getting-started-guides/docker-multinode/worker.sh) on the worker machine with root:

```shell
export MASTER_IP=<your_master_ip (e.g. 1.2.3.4)>
cd kubernetes/docs/getting-started-guides/docker-multinode/
./worker.sh
...
`Worker done!`
````

See [here](/docs/getting-started-guides/docker-multinode/worker) for detailed instructions explanation.

## Deploy a DNS

See [here](/docs/getting-started-guides/docker-multinode/deployDNS) for instructions.

## Testing your cluster

Once your cluster has been created you can [test it out](/docs/getting-started-guides/docker-multinode/testing)

For more complete applications, please look in the [examples directory](https://github.com/kubernetes/kubernetes/tree/{{page.githubbranch}}/examples/)
