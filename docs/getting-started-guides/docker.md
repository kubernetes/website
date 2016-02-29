---
---

The following instructions show you how to set up a simple, single node Kubernetes cluster using Docker.

Here's a diagram of what the final result will look like:

![Kubernetes Single Node on Docker](/images/docs/k8s-singlenode-docker.png)

* TOC
{:toc}

## Prerequisites

1. You need to have docker installed on one machine.
2. Your kernel should support memory and swap accounting. Ensure that the
following configs are turned on in your linux kernel:

```shell
CONFIG_RESOURCE_COUNTERS=y
CONFIG_MEMCG=y
CONFIG_MEMCG_SWAP=y
CONFIG_MEMCG_SWAP_ENABLED=y
CONFIG_MEMCG_KMEM=y
```

3. Enable the memory and swap accounting in the kernel, at boot, as command line
parameters as follows:

```shell
GRUB_CMDLINE_LINUX="cgroup_enable=memory swapaccount=1"
```

NOTE: The above is specifically for GRUB2.
    You can check the command line parameters passed to your kernel by looking at the
    output of /proc/cmdline:

```shell
$cat /proc/cmdline
    BOOT_IMAGE=/boot/vmlinuz-3.18.4-aufs root=/dev/sda5 ro cgroup_enable=memory
    swapaccount=1
```

### Step One: Run etcd

```shell
docker run --net=host -d gcr.io/google_containers/etcd:2.0.12 /usr/local/bin/etcd --addr=127.0.0.1:4001 --bind-addr=0.0.0.0:4001 --data-dir=/var/etcd/data
```

### Step Two: Run the master

```shell
docker run \
    --volume=/:/rootfs:ro \
    --volume=/sys:/sys:ro \
    --volume=/dev:/dev \
    --volume=/var/lib/docker/:/var/lib/docker:ro \
    --volume=/var/lib/kubelet/:/var/lib/kubelet:rw \
    --volume=/var/run:/var/run:rw \
    --net=host \
    --pid=host \
    --privileged=true \
    -d \
    gcr.io/google_containers/hyperkube:v1.0.1 \
    /hyperkube kubelet --containerized --hostname-override="127.0.0.1" --address="0.0.0.0" --api-servers=http://localhost:8080 --config=/etc/kubernetes/manifests
```

This actually runs the kubelet, which in turn runs a [pod](/docs/user-guide/pods) that contains the other master components.

### Step Three: Run the service proxy

```shell
docker run -d --net=host --privileged gcr.io/google_containers/hyperkube:v1.0.1 /hyperkube proxy --master=http://127.0.0.1:8080 --v=2
```

### Test it out

At this point you should have a running Kubernetes cluster.  You can test this by downloading the kubectl
binary
([OS X](https://storage.googleapis.com/kubernetes-release/release/v1.0.1/bin/darwin/amd64/kubectl))
([linux](https://storage.googleapis.com/kubernetes-release/release/v1.0.1/bin/linux/amd64/kubectl))

*Note:*
On OS/X you will need to set up port forwarding via ssh:

```shell
boot2docker ssh -L8080:localhost:8080
```

List the nodes in your cluster by running:

```shell
kubectl get nodes
```

This should print:

```shell
NAME        LABELS    STATUS
127.0.0.1   <none>    Ready
```

If you are running different Kubernetes clusters, you may need to specify `-s http://localhost:8080` to select the local cluster.

### Run an application

```shell
kubectl -s http://localhost:8080 run nginx --image=nginx --port=80
```

Now run `docker ps` you should see nginx running.  You may need to wait a few minutes for the image to get pulled.

### Expose it as a service

```shell
kubectl expose rc nginx --port=80
```

Run the following command to obtain the IP of this service we just created. There are two IPs, the first one is internal (CLUSTER_IP), and the second one is the external load-balanced IP.

```shell
kubectl get svc nginx
```

Alternatively, you can obtain only the first IP (CLUSTER_IP) by running:

```shell
kubectl get svc nginx --template={{.spec.clusterIP}}
```

Hit the webserver with the first IP (CLUSTER_IP):

```shell
curl <insert-cluster-ip-here>
```

Note that you will need run this curl command on your boot2docker VM if you are running on OS X.

### A note on turning down your cluster

Many of these containers run under the management of the `kubelet` binary, which attempts to keep containers running, even if they fail.  So, in order to turn down
the cluster, you need to first kill the kubelet container, and then any other containers.

You may use `docker kill $(docker ps -aq)`, note this removes _all_ containers running under Docker, so use with caution.
