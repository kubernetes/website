---
assignees:
- lavalamp
- yifan-gu

---

This document describes how to run Kubernetes using [rkt](https://github.com/coreos/rkt) as the container runtime.

* TOC
{:toc}

## Prerequisites

* [Systemd](http://www.freedesktop.org/wiki/Software/systemd/) must be installed and enabled. The minimum systemd version required for Kubernetes v1.3 is `219`. Systemd is used to monitor and manage the pods on each node.

* [Install the latest rkt release](https://coreos.com/rkt/docs/latest/trying-out-rkt.html). The minimum rkt version required is [v1.9.1](https://github.com/coreos/rkt/releases/tag/v1.9.1). The [CoreOS Linux alpha channel](https://coreos.com/releases/) ships with a recent rkt release, and you can easily [upgrade rkt on CoreOS](https://coreos.com/rkt/docs/latest/install-rkt-in-coreos.html), if necessary.

* The [rkt API service](https://coreos.com/rkt/docs/latest/subcommands/api-service.html) must be running on the node.

## Pod networking in rktnetes

### Kubernetes CNI networking

You can configure Kubernetes pod networking with the usual Container Network Interface (CNI) [network plugins](/docs/admin/network-plugins/) by setting the kubelet's `--network-plugin` and `--network-plugin-dir` options appropriately. Configured in this fashion, the rkt container engine will be unaware of network details, and expects to connect pods to the provided subnet.

#### kubenet: Google Compute Engine (GCE) network

The `kubenet` plugin can be selected with the kubelet option `--network-plugin=kubenet`. This plugin is currently only supported on GCE. When using kubenet, Kubernetes CNI creates and manages the network, and rkt is provided with a subnet from a bridge device connected to the GCE network.

### rkt contained network

Rather than delegating pod networking to Kubernetes, rkt can configure connectivity directly with its own [*contained network*](https://coreos.com/rkt/docs/latest/networking/overview.html#contained-mode) on a subnet provided by a bridge device, the flannel SDN, or another CNI plugin. Configured this way, rkt looks in its [config directories](https://coreos.com/rkt/docs/latest/configuration.html#command-line-flags), usually `/etc/rkt/net.d`, to discover the CNI configuration and invoke the appropriate plugins to create the pod network.

#### rkt contained network with bridge

The *contained network* is rkt's default, so you can leave the kubelet's `--network-plugin` option empty to select this network. The contained network can be backed by any CNI plugin. With the *contained network*, rkt will attempt to join pods to a network named `rkt.kubernetes.io`, so this network name must be used for whatever desired CNI configuration.

When using the contained network, create a network configuration file beneath the rkt network config directory that defines how to create this `rkt.kubernetes.io` network in your environment. This example sets up a bridge device with the `bridge` CNI plugin:

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

#### rkt contained network with flannel

While it is recommended to operate flannel through the Kubernetes CNI support, you can alternatively configure the flannel plugin directly to provide the subnet for rkt's contained network. An example CNI/flannel config file looks like this:

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

For more information on flannel configuration, see the [CNI/flannel README](https://github.com/containernetworking/cni/blob/master/Documentation/flannel.md).

#### Contained network caveats:

* You must create an appropriate CNI configuration file with a network name of `rkt.kubernetes.io`.
* The downwards API and environment variable substitution will not contain the pod IP address.
* The `/etc/hosts` file will not contain the pod's own hostname, although `/etc/hostname` is populated.

## Running rktnetes

### Spin up a local Kubernetes cluster with the rkt runtime

To use rkt as the container runtime in a local Kubernetes cluster, supply the following flags to the kubelet:

* `--container-runtime=rkt` Set the node's container runtime to rkt.
* `--rkt-api-endpoint=HOST:PORT` Set the endpoint of the rkt API service. Default: `localhost:15441`.
* `--rkt-path=PATH_TO_RKT_BINARY` Set the path of the rkt binary. Optional. If empty, look for `rkt` in `$PATH`.
* `--rkt-stage1-image=STAGE1` Set the name of the stage1 image, e.g. `coreos.com/rkt/stage1-coreos`. Optional. If not set, the default Linux kernel software isolation stage1 is used.

If you are using the [hack/local-up-cluster.sh](https://github.com/kubernetes/kubernetes/tree/{{page.githubbranch}}/hack/local-up-cluster.sh) script to launch the cluster, you can edit the environment variables `CONTAINER_RUNTIME`, `RKT_PATH`, and `RKT_STAGE1_IMAGE` to set these flags. `RKT_PATH` and `RKT_STAGE1_IMAGE` are optional if `rkt` is in your $PATH` with appropriate configuration.

```shell
$ export CONTAINER_RUNTIME=rkt
$ export RKT_PATH=<rkt_binary_path>
$ export RKT_STAGE1_IMAGE=<stage1-name>
```

Now you can launch the cluster using the `local-up-cluster.sh` script:

```shell
$ hack/local-up-cluster.sh
```

We are also working on getting rkt working as the container runtime in [minikube](https://github.com/kubernetes/minikube/issues/168).

### Launch a rktnetes cluster on Google Compute Engine (GCE)

This section outlines using the `kube-up` script to launch a CoreOS/rkt cluster on GCE.

Specify the OS distribution, the GCE distributor's master project, and the instance images for the Kubernetes master and nodes. Set the `KUBE_CONTAINER_RUNTIME` to `rkt`:

```shell
$ export KUBE_OS_DISTRIBUTION=coreos
$ export KUBE_GCE_MASTER_PROJECT=coreos-cloud
$ export KUBE_GCE_MASTER_IMAGE=<image_id>
$ export KUBE_GCE_NODE_PROJECT=coreos-cloud
$ export KUBE_GCE_NODE_IMAGE=<image_id>
$ export KUBE_CONTAINER_RUNTIME=rkt
```

Optionally, set the version of rkt by setting `KUBE_RKT_VERSION`:

```shell
$ export KUBE_RKT_VERSION=1.9.1
```

Optionally, select an alternative [stage1 isolator](#modular-isolation-with-interchangeable-stage1-images) for the container runtime by setting `KUBE_RKT_STAGE1_IMAGE`:

```shell
$ export KUBE_RKT_STAGE1_IMAGE=<stage1-name>
```

Then you can launch the cluster with:

```shell
$ cluster/kube-up.sh
```

### Launch a rktnetes cluster on AWS

The `kube-up` script is not yet supported on AWS. Instead, we recommend following the [Kubernetes on AWS guide](https://coreos.com/kubernetes/docs/latest/kubernetes-on-aws.html) to launch a CoreOS Kubernetes cluster on AWS, then setting kubelet options as above.

### Deploy apps to the cluster

After creating the cluster, you can start deploying applications. For an introductory example, [deploy a simple nginx web server](/docs/user-guide/simple-nginx). Note that this example did not have to be modified for use with a "rktnetes" cluster. More examples can be found in the [Kubernetes examples directory](https://github.com/kubernetes/kubernetes/tree/{{page.githubbranch}}/examples/).

## Modular isolation with interchangeable stage1 images

rkt executes containers in an interchangeable isolation environment. This facility is called the [*stage1* image](https://coreos.com/rkt/docs/latest/devel/architecture.html#stage-1). There are currently three supported rkt stage1 images:

* `systemd-nspawn` stage1, the default. Isolates running containers with Linux kernel namespaces and cgroups in a manner similar to the default container runtime.
* [`KVM` stage1](https://coreos.com/rkt/docs/latest/running-lkvm-stage1.html), runs containers inside a KVM hypervisor-managed virtual machine. Experimental in the Kubernetes v1.3 release.
* [`fly stage1`](https://coreos.com/rkt/docs/latest/running-fly-stage1.html), which isolates containers with only a `chroot`, giving host-level access to mount and network namespaces for specially-privileged utilities.

In addition to the three provided stage1 images, you can [create your own](https://coreos.com/rkt/docs/latest/devel/stage1-implementors-guide.html) for specific isolation requirements. If no configuration is set, the [default stage1](https://coreos.com/rkt/docs/latest/build-configure.html#parameters-for-setting-up-default-stage1-image) is used. There are two ways to select a different stage1; either per-node, or per-pod:

* Set the kubelet's `--rkt-stage1-image` flag, which tells the kubelet the stage1 image to use for every pod on the node. For example, `--rkt-stage1-image=coreos/rkt/stage1-coreos` selects the default systemd-nspawn stage1.
* Set the annotation `rkt.alpha.kubernetes.io/stage1-name-override` to override the stage1 used to execute a given pod. This allows for mixing different container isolation mechanisms on the same cluster or on the same node. For example, the following (shortened) pod manifest will run its pod with the `fly stage1` to give the application -- the `kubelet` in this case -- access to the host's namespace:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: kubelet
  namespace: kube-system
  labels:
    k8s-app: kubelet
  annotations:
    rkt.alpha.kubernetes.io/stage1-name-override: coreos.com/rkt/stage1-fly
spec:
  containers:
  - name: kubelet
    image: quay.io/coreos/hyperkube:v1.3.0-beta.2_coreos.0
    command:
    - kubelet
    - --api-servers=127.0.0.1:8080
    - --config=/etc/kubernetes/manifests
    - --allow-privileged
    - --kubeconfig=/etc/kubernetes/kubeconfig
    securityContext:
      privileged: true
[...]
```

### Notes on using different stage1 images

Setting the stage1 annotation could potentially give the pod root privileges. Because of this, the `privileged` boolean in the pod's `securityContext` must be set to `true`.

Use rkt's [*contained network*](#rkt-contained-network) with the KVM stage1, because the CNI plugin driver does not yet fully support the hypervisor-based runtime.

## Known issues and differences between rkt and Docker

rkt and the default node container engine have very different designs, as do rkt's native ACI and the Docker container image format. Users may experience different behaviors when switching from one container engine to the other. More information can be found [in the Kubernetes rkt notes](/docs/getting-started-guides/rkt/notes/).

## Troubleshooting

Here are a few tips for troubleshooting Kubernetes with the rkt container engine:

### Check rkt pod status

To check the status of running pods, use the rkt subcommands [`rkt list`](https://coreos.com/rkt/docs/latest/subcommands/list.html), [`rkt status`](https://coreos.com/rkt/docs/latest/subcommands/status.html), and [`rkt image list`](https://coreos.com/rkt/docs/latest/subcommands/image.html#rkt-image-list). See the [rkt commands documentation](https://coreos.com/rkt/docs/latest/commands.html) for more information about rkt subcommands.

### Check journal logs

Check a pod's log using `journalctl` on the node. Pods are managed and named as systemd units. The pod's unit name is formed by concatenating a `k8s_` prefix with the pod UUID, in a format like `k8s_${RKT_UUID}`. Find the pod's UUID with `rkt list` to assemble its service name, then ask journalctl for the logs:


```shell
$ sudo journalctl -u k8s_ad623346
```

#### Log verbosity

By default, the log verbosity level is 2. In order to see more log messages related to rkt, set this level to 4 or above. For a local cluster, set the environment variable: `LOG_LEVEL=4`.

### Check Kubernetes events and logs.

Kubernetes provides various tools for troubleshooting and examination. More information can be found [in the app troubleshooting guide](/docs/user-guide/application-troubleshooting).
