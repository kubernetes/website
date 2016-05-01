---
---

* TOC
{:toc}

### Introduction

This tutorial is designed to start a local cluster, consisting of a master and single node
on the local machine.

To interact with the cluster you then can use kubectl to do so.

### Requirements

This tutorial is intended to run on Linux and needs Docker. It was tested on Ubuntu 16.04
but other Linuxes should be similar.

**Warning**
This tutorial exposes the Kubernetes installation on a public IP address, be sure you
understand the risks involved.

#### Linux

Not running Linux? Consider running Linux in a local virtual machine with [vagrant](https://www.vagrantup.com/), or on a cloud provider like [Google Compute Engine](/docs/getting-started-guides/gce)

#### Docker

At least [Docker](https://docs.docker.com/installation/#installation)
1.8.3+. Ensure the Docker daemon is running and can be contacted (try `docker
ps`).  Some of the Kubernetes components need to run as root, which normally
works fine with docker.

### Starting the cluster

First you will need to open up your terminal.

Then you need to configure the directory where to place the binaries and their dependencies:
```shell
export KUBE_BIN=~/kube-bin
export PATH=${PATH}:${KUBE_BIN}
```

Then, you need to configure the IP and port on which the API will be exposed. Make sure that
this IP matches one assigned to your computer.
```shell
export KUBE_API_ADDR=192.168.1.111
export KUBE_API_PORT=8080
```

The next step is to configure versions for the dependencies, these will be used later:
```shell
export FLANNEL_VERSION="0.5.5"
export ETCD_VERSION=2.3.3
export KUBE_VERSION="1.2.3"
export KUBERNETES_PROVIDER=local
export NUM_NODES=1
```

**Note** During this tutorial we'll launch many commands as background running commands.
If you want to launch them in separate tabs, please remember to always run the above
commands so that everything is configured correctly.

Now, lets downloaded Kubernetes and extract it:
```shell
curl -L https://github.com/kubernetes/kubernetes/releases/download/v${KUBE_VERSION}/kubernetes.tar.gz \
    -o /tmp/kubernetes.tar.gz
cd /tmp
tar -zxvf kubernetes.tar.gz
rm kubernetes.tar.gz
cd kubernetes/server
tar -zxvf kubernetes-server-linux-amd64.tar.gz

mv kubernetes/server/bin ~/${KUBE_BIN}
```

From now one, the commands will need to be executed in the directory where you've placed
Kubernetes so lets make sure where are there:
```shell
cd ${KUBE_BIN}
```

Our first dependency that needs to run is [etdc](https://coreos.com/etcd/):
```shell
curl -L  https://github.com/coreos/etcd/releases/download/v${ETCD_VERSION}/etcd-v${ETCD_VERSION}-linux-amd64.tar.gz \
    -o etcd-v${ETCD_VERSION}-linux-amd64.tar.gz
tar zxvf etcd-v${ETCD_VERSION}-linux-amd64.tar.gz
cp etcd-v${ETCD_VERSION}-linux-amd64/etcd .
cp etcd-v${ETCD_VERSION}-linux-amd64/etcdctl .
rm -r etcd-v${ETCD_VERSION}-linux-amd64.tar.gz etcd-v${ETCD_VERSION}-linux-amd64
```

This will launch it in the background but you could launch it as well in a separate terminal:
```shell
ETCD_VERSION=false ./etcd &
```

After etcd has loaded successfully, we need to add an entry for the flannel network configuration:
```shell
./etcdctl mk /coreos.com/network/config '{"Network":"172.17.0.0/16"}'
```

Now, download [flannel](https://coreos.com/flannel/) in order to create the networking
layer to be used by Kubernetes:
```shell
curl -L https://github.com/coreos/flannel/releases/download/v${FLANNEL_VERSION}/flannel-${FLANNEL_VERSION}-linux-amd64.tar.gz \
    -o flannel-${FLANNEL_VERSION}-linux-amd64.tar.gz
tar zxvf flannel-${FLANNEL_VERSION}-linux-amd64.tar.gz
cp flannel-${FLANNEL_VERSION}/flanneld .
rm -r flannel-${FLANNEL_VERSION}-linux-amd64.tar.gz flannel-${FLANNEL_VERSION}
```

Flannel needs to be launched as root, and again it will be launched in background:
```shell
sudo ./flanneld &
```

Finally, before we are able to launch Kubernetes, we should create the default directory
where it expects to store the security certificates being used
```shell
sudo mkdir -p /var/run/kubernetes
```

Now lets launch the Kubernetes. First we need to launch the API server. This needs to
run as root:
```shell
sudo ./kube-apiserver --service-cluster-ip-range=127.0.0.1/28 \
    --etcd-servers='http://localhost:2379,http://localhost:4001' \
    --insecure-bind-address=${KUBE_API_ADDR} --insecure-port=${KUBE_API_PORT} &
```

Next, we need to launch Kubelet:
```shell
sudo ./kubelet --api-servers=${KUBE_API_ADDR}:${KUBE_API_PORT} &
```

Launch the Controller manager:
```shell
sudo ./kube-controller-manager --master=${KUBE_API_ADDR}:${KUBE_API_PORT} \
    --root-ca-file=/var/run/kubernetes/apiserver.crt &
```

Launch the proxy:
```shell
sudo ./kube-proxy --master=${KUBE_API_ADDR}:${KUBE_API_PORT} &
```

Launch the scheduler
```shell
sudo ./kube-scheduler --master=${KUBE_API_ADDR}:${KUBE_API_PORT} &
```

And that's it. Your Kubernetes cluster should now be up and running.


#### Get the Dashboard and run it

To get the [Kubernetes Dashboard](http://kubernetes.io/docs/user-guide/ui/) up and
running you'll need to do is to:

- download and schedule (run) the dashboard board:
```shell
kubectl create -f https://rawgit.com/kubernetes/dashboard/master/src/deploy/kubernetes-dashboard.yaml
```
- expose it to the world:
```shell
kubectl proxy --port=9090 &
```

To see if this works, you can do this
```shell
./kubectl -s=${KUBE_API_ADDR}:${KUBE_API_PORT} describe pods --namespace=kube-system
```

Note that ` --namespace=kube-system ` is needed as the pod is launched in that namespace.

### Running a container

Your cluster is running, and you want to start running containers!

You can now use any of the kubectl commands to interact with your local setup.

```shell
cd ~/kube-bin
./kubectl get pods
./kubectl get services
./kubectl get deployments
./kubectl run my-nginx --image=nginx --replicas=2 --port=80

## Begin wait for provision to complete, you can monitor the docker pull by opening a new terminal
  sudo docker images
  ## you should see it pulling the nginx image, once the above command returns it
  sudo docker ps
  ## you should see your container running!
  exit
## end wait

## Introspect Kubernetes
./kubectl get pods
./kubectl get services
./kubectl get deployments
```

### Running a user defined pod

Note the difference between a [container](/docs/user-guide/containers)
and a [pod](/docs/user-guide/pods). Since you only asked for the former, Kubernetes will create a wrapper pod for you.
However you cannot view the nginx start page on localhost. To verify that nginx is running you need to run `curl` within the docker container (try `docker exec`).

You can control the specifications of a pod via a user defined manifest, and reach nginx through your browser on the port specified therein:

```shell
./kubectl create -f docs/user-guide/pod.yaml
```

Congratulations!

### FAQs

#### I cannot reach service IPs on the network.

Some firewall software that uses iptables may not interact well with
kubernetes.  If you have trouble around networking, try disabling any
firewall or other iptables-using systems, first.  Also, you can check
if SELinux is blocking anything by running a command such as `journalctl --since yesterday | grep avc`.

By default the IP range for service cluster IPs is 10.0.*.* - depending on your
docker installation, this may conflict with IPs for containers.  If you find
containers running with IPs in this range, edit hack/local-cluster-up.sh and
change the service-cluster-ip-range flag to something else.

#### kubectl claims to start a container but `get pods` and `docker ps` don't show it.

One or more of the Kubernetes daemons might've crashed. Tail the [logs](/docs/admin/cluster-troubleshooting/#looking-at-logs) of each in /tmp.

```shell
$ ls /tmp/kube*.log
$ tail -f /tmp/kube-apiserver.log
```

#### The pods fail to connect to the services by host names

The local-up-cluster.sh script doesn't start a DNS service. Similar situation can be found [here](http://issue.k8s.io/6667). You can start a manually. Related documents can be found [here](https://releases.k8s.io/{{page.githubbranch}}/cluster/addons/dns#how-do-i-configure-it)
