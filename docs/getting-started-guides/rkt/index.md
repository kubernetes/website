---
---

This document describes how to run Kubernetes using [rkt](https://github.com/coreos/rkt) as a container runtime.

### **Prerequisite**

- [systemd](http://www.freedesktop.org/wiki/Software/systemd/) should be installed on the machine and should be enabled.
  The minimum version required for Kubernetes 1.3 is `219`.
  *(Note that systemd is not required by rkt itself, we are using it here to monitor and manage the pods launched by kubelet.)*

- Install the latest rkt release according to the instructions [here](https://github.com/coreos/rkt).
  The minimum version required is [v1.9.0](https://github.com/coreos/rkt/releases/tag/v1.9.0).

- The [rkt API service](http://coreos.com/rkt/docs/latest/subcommands/api-service.html) must be running on the node.

### Network Setup

You can configure your network using the kubenet and CNI [network
plugins](http://kubernetes.io/docs/admin/network-plugins/) by setting the
`--network-plugin` flag, as described in each plugin's documentation.


In addition, rkt supports using rkt's [Contained Networking](https://coreos.com/rkt/docs/latest/networking.html#contained-mode).
In this mode, rkt will attempt to join pods into a network named `rkt.kubernetes.io`.
An example network config file looks like this:
```shell		
$ cat <<EOF >/etc/rkt/net.d/k8s_network_example.conf
{
  "name": "rkt.kubernetes.io",
  "type": "bridge",
  "bridge": "mybridge",
  "mtu": 1460,
  "addIf": "true",
  "isGateway": true,
  "ipMasq": true,
  "ipam": {
    "type": "host-local",
    "subnet": "10.22.0.0/16",
    "gateway": "10.22.0.1",
    "routes": [
      { "dst": "0.0.0.0/0" }
    ]
  }
}
EOF
```

However, there are a small number of caveats you should be aware of when using rkt's networking:

* You must create an appropriate CNI configuration file with a network name of `rkt.kubernetes.io`.
* The downwards API and environment variable substitution will not contain the pod IP.
* The `/etc/hosts` file will not contain your own hostname (though `/etc/hostname` contains the hostname).

#### Using flannel

While it's recommended that you configure flannel using kubernetes' CNI support, you can also configure it using rkt's contained networking.
An example flannel/CNI config file looks like this:
```shell
$ cat <<EOF >/etc/rkt/net.d/k8s_flannel_example.conf
{
    "name": "rkt.kubernetes.io",
    "type": "flannel",
    "delegate": {
        "isDefaultGateway": true
    }
}
EOF
```

For more information on flannel configuration, please read [CNI/flannel README](https://github.com/containernetworking/cni/blob/master/Documentation/flannel.md).

#### On GCE

Each VM on GCE has an additional 256 IP addresses routed to it, so it is possible to forego flannel in smaller clusters.
This can most easily be done by using the builtin kubenet plugin.
This can be done by setting `--network-plugin=kubenet`.

### Local cluster

To use rkt as the container runtime, we need to supply the following flags to kubelet:

- `--container-runtime=rkt` chooses the container runtime to use.
- `--rkt-api-endpoint=HOST:PORT` sets the endpoint of the rkt API service.
  Leave empty to use the default one (`localhost:15441`).
- `--rkt-path=$PATH_TO_RKT_BINARY` sets the path of rkt binary.
  Leave empty to use the first rkt in $PATH.
- `--rkt-stage1-image` sets the name of the stage1 image, e.g. coreos.com/rkt/stage1-coreos.
  Leave empty to use the default stage1 image in the rkt's configuration.

If you are using the [hack/local-up-cluster.sh](https://github.com/kubernetes/kubernetes/tree/{{page.githubbranch}}/hack/local-up-cluster.sh) script to launch the local cluster, then you can edit the environment variable `CONTAINER_RUNTIME`, `RKT_PATH` and `RKT_STAGE1_IMAGE` to set these flags:

```shell
$ export CONTAINER_RUNTIME=rkt
$ export RKT_PATH=$PATH_TO_RKT_BINARY
$ export RKT_STAGE1_IMAGE=$NAME_OF_THE_STAGE1_IMAGE
```

Then we can launch the local cluster using the script:

```shell
$ hack/local-up-cluster.sh
```

We are also working on set up rkt as the container runtime for [minikube](https://github.com/kubernetes/minikube/issues/168).

### CoreOS cluster on Google Compute Engine (GCE)

Here we provide instruction on how to use the `kube-up` script to launch a CoreOS/rkt cluster on GCE.
In order to do that, you need to specify the OS distribution, project, image:

```shell
$ export KUBE_OS_DISTRIBUTION=coreos
$ export KUBE_GCE_MASTER_PROJECT=coreos-cloud
$ export KUBE_GCE_MASTER_IMAGE=<image_id>
$ export KUBE_GCE_NODE_PROJECT=coreos-cloud
$ export KUBE_GCE_NODE_IMAGE=<image_id>
$ export KUBE_CONTAINER_RUNTIME=rkt
```

You can optionally choose the version of rkt used by setting `KUBE_RKT_VERSION`:

```shell
$ export KUBE_RKT_VERSION=1.9.0
```

Then you can launch the cluster by:

```shell
$ cluster/kube-up.sh
```

### CoreOS cluster on AWS

`kube-up` for AWS is currently supported.
Instead, we recommend you to refer the [Kubernetes on AWS guide](https://coreos.com/kubernetes/docs/latest/kubernetes-on-aws.html) to launch a CoreOS/rkt cluster on AWS.

### Getting started with your cluster

See [a simple nginx example](/docs/user-guide/simple-nginx) to try out your new cluster.

For more complete applications, please look in the [examples directory](https://github.com/kubernetes/kubernetes/tree/{{page.githubbranch}}/examples/).

### Known Issues and Differences

rkt and Docker have very different designs, as well as ACI and Docker image format.
Users might experience some different experience when switching from one to the other.
More information can be found [here](/docs/getting-started-guides/rkt/notes/).

### Debugging

Here are several tips in case you run into any issues.

##### Check logs

By default, the log verbose level is 2. In order to see more logs related to rkt, we can set the verbose level to 4.
For local cluster, we can set the environment variable: `LOG_LEVEL=4`.
If the cluster is using salt, we can edit the [logging.sls](https://github.com/kubernetes/kubernetes/tree/{{page.githubbranch}}/cluster/saltbase/pillar/logging.sls) in the saltbase.

##### Check rkt pod status

To check the pods' status, we can use rkt command, such as `rkt list`, `rkt status`, `rkt image list`, etc.
More information about rkt command line can be found [here](https://github.com/coreos/rkt/blob/master/Documentation/commands.md).

##### Check journal logs

As we use systemd to launch/manage rkt pods, we can check the pods' log using `journalctl`:

- Check the running state of the systemd service:

```shell
$ sudo journalctl -u ${SERVICE_NAME}
```

where `${SERVICE_NAME}` is the name of the service file created for the pod, typically the format is `k8s_${RKT_UUID}`.

##### Check Kubernetes events, logs.

Besides above tricks, Kubernetes also provides us handy tools for debugging the pods. More information can be found [here](/docs/user-guide/application-troubleshooting).
