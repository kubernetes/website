---
assignees:
- caesarxuchao
- erictune

---

[Juju](https://jujucharms.com/docs/2.0/about-juju) encapsulates the 
operational knowledge of provisioning, installing, and securing a Kubernetes
cluster into one step. Juju allows you to deploy a Kubernetes cluster on
different cloud providers with a consistent, repeatable user experience.
Once deployed the cluster can easily scale up with one command.

The Juju Kubernetes work is curated by a dedicated team of community members,
let us know how we are doing. If you find any problems please open an
[issue on the kubernetes project](https://github.com/kubernetes/kubernetes/issues)
and tag the issue with "juju" so we can find them.


* TOC
{:toc}

## Prerequisites

> Note: If you're running kube-up, on Ubuntu - all of the dependencies
> will be handled for you. You may safely skip to the section:
> [Launch a Kubernetes Cluster](#launch-a-kubernetes-cluster)

### On Ubuntu

[Install the Juju client](https://jujucharms.com/docs/2.0/getting-started-general)

> This documentation focuses on the Juju 2.0 release which will be
> promoted to stable during the April 2016 release cycle.

To paraphrase, on your local Ubuntu system:  

```shell
sudo add-apt-repository ppa:juju/devel
sudo apt-get update
sudo apt-get install juju
```

If you are using another distro/platform - please consult the
[getting started guide](https://jujucharms.com/docs/2.0/getting-started-general)
to install the Juju dependencies for your platform.

### With Docker

If you prefer the isolation of Docker, you can run the Juju client in a 
container. Create a local directory to store the Juju configuration, then
volume mount the container:  

```shell
mkdir -p $HOME/.local/share/juju
docker run --rm -ti \
  -v $HOME/.local/share/juju:/home/ubuntu/.local/share/juju \
  jujusolutions/charmbox:devel
```

> While this is a common target, the charmbox flavors of images are
> unofficial, and should be treated as experimental. If you encounter any issues
> turning up the Kubernetes cluster with charmbox, please file a bug on the
> [charmbox issue tracker](https://github.com/juju-solutions/charmbox/issues).

### Configure Juju to your favorite cloud provider

At this point you have access to the Juju client. Before you can deploy a
cluster you have to configure Juju with the 
[cloud credentials](https://jujucharms.com/docs/2.0/credentials) for each 
cloud provider you would like to use.

Juju [supports a wide variety of public clouds](#cloud-compatibility) to set
up the credentials for your chosen cloud see the
[cloud setup page](https://jujucharms.com/docs/devel/getting-started-general#2.-choose-a-cloud).

After configuration is complete test your setup with a `juju bootstrap`
command: `juju bootstrap $controllername $cloudtype` you are ready to launch 
the Kubernetes cluster.

## Launch a Kubernetes cluster

You can deploy a Kubernetes cluster with Juju from the `kubernetes` directory of 
the [kubernetes github project](https://github.com/kubernetes/kubernetes.git). 
Clone the repository on your local system. Export the `KUBERNETES_PROVIDER` 
environment variable before bringing up the cluster.

```shell
cd kubernetes
export KUBERNETES_PROVIDER=juju
cluster/kube-up.sh
```

If this is your first time running the `kube-up.sh` script, it will attempt to
install the required dependencies to get started with Juju.

The script will deploy two nodes of Kubernetes, 1 unit of etcd, and network
the units so containers on different hosts can communicate with each other.

## Exploring the cluster

The `juju status` command provides information about each unit in the cluster:  

```shell
$ juju status
MODEL    CONTROLLER  CLOUD/REGION     VERSION
default  windows     azure/centralus  2.0-beta13

APP         VERSION  STATUS  EXPOSED  ORIGIN      CHARM       REV  OS
etcd                 active  false    jujucharms  etcd        3    ubuntu
kubernetes           active  true     jujucharms  kubernetes  5    ubuntu

RELATION      PROVIDES    CONSUMES    TYPE
cluster       etcd        etcd        peer
etcd          etcd        kubernetes  regular
certificates  kubernetes  kubernetes  peer

UNIT          WORKLOAD  AGENT  MACHINE  PORTS     PUBLIC-ADDRESS  MESSAGE
etcd/0        active    idle   0        2379/tcp  13.67.217.11    (leader) cluster is healthy
kubernetes/0  active    idle   1        8088/tcp  13.67.219.76    Kubernetes running.
kubernetes/1  active    idle   2        6443/tcp  13.67.219.182   (master) Kubernetes running.

MACHINE  STATE    DNS            INS-ID     SERIES  AZ
0        started  13.67.217.11   machine-0  trusty  
1        started  13.67.219.76   machine-1  trusty  
2        started  13.67.219.182  machine-2  trusty 
```

## Run some containers!

The `kubectl` file, and the TLS certificates along with the configuration are
all available on the Kubernetes master unit. Fetch the kubectl package so you
can run commands on the new Kuberntetes cluster.

Use the `juju status` command to figure out which unit is the master. In the 
example above the "kubernetes/1" unit is the master. Use the `juju scp` 
command to copy the file from the unit:  

```shell
juju scp kubernetes/1:kubectl_package.tar.gz .
tar xvfz kubectl_package.tar.gz
./kubectl --kubeconfig kubeconfig get pods
```

If you are not on a Linux amd64 host system, you will need to find or build a
kubectl binary package for your architecture.

Copy the `kubeconfig` file to the home directory so you don't have to specify 
it on the command line each time. The default location is 
`${HOME}/.kube/config`.

No pods will be available before starting a container:

```shell
kubectl get pods
NAME READY STATUSRESTARTS   AGE

kubectl get replicationcontrollers
CONTROLLER  CONTAINER(S)  IMAGE(S)  SELECTOR  REPLICAS
```

We'll follow the aws-coreos example. Create a pod manifest: `pod.json`

```json
{
  "apiVersion": "v1",
  "kind": "Pod",
  "metadata": {
"name": "hello",
"labels": {
  "name": "hello",
  "environment": "testing"
}
  },
  "spec": {
"containers": [{
  "name": "hello",
  "image": "quay.io/kelseyhightower/hello",
  "ports": [{
"containerPort": 80,
"hostPort": 80
  }]
}]
  }
}
```

Create the pod with kubectl:  

```shell
kubectl create -f pod.json
```

Get info on the pod:  

```shell
kubectl get pods
```

To test the hello app, we need to locate which node is hosting
the container. We can use `juju run` and `juju status` commands to find
our hello app.

Exit out of our ssh session and run:

```shell
juju run --unit kubernetes/0 "docker ps -n=1"
...
juju run --unit kubernetes/1 "docker ps -n=1"
CONTAINER IDIMAGE  COMMAND CREATED STATUS  PORTS   NAMES
02beb61339d8quay.io/kelseyhightower/hello:latest   /hello  About an hour ago   Up About an hourk8s_hello....
```

We see "kubernetes/1" has our container, expose the kubernetes charm and open
port 80:

```shell
juju run --unit kubernetes/1 "open-port 80"
juju expose kubernetes
sudo apt-get install curl
curl $(juju status --format=oneline kubernetes/1 | cut -d' ' -f3)
```

Finally delete the pod:  

```shell
juju ssh kubernetes/0
kubectl delete pods hello
```

## Scale up cluster

Want larger Kubernetes nodes? It is easy to request different sizes of cloud
resources from Juju by using **constraints**. You can increase the amount of
CPU or memory (RAM) in any of the systems requested by Juju. This allows you
to fine tune th Kubernetes cluster to fit your workload. Use flags on the
bootstrap command or as a separate `juju constraints` command. Look to the
[Juju documentation for machine](https://jujucharms.com/docs/2.0/charms-constraints)
details.

## Scale out cluster

Need more workers? Juju makes it easy to add units of a charm:   

```shell
juju add-unit kubernetes
```

Or multiple units at one time:  

```shell
juju add-unit -n3 kubernetes
```

You can also scale the etcd charm for more fault tolerant key/value storage:  

```shell
juju add-unit -n2 etcd
```

## Tear down cluster

We recommend that you use the `kube-down.sh` script when you are done using
the cluster, as it properly brings down the cloud and removes some of the
build directories.

```shell
./cluster/kube-down.sh
```

Alternately if you want stop the servers you can destroy the Juju model or the
controller. Use the `juju switch` command to get the current controller name:  

```shell
juju switch
juju destroy-controller $controllername --destroy-all-models
```

## More Info

Juju works with charms and bundles to deploy solutions. The code that stands up
a Kubernetes cluster is done in the charm code. The charm is built from using
a layered approach to keep the code smaller and more focused on the operations
of Kubernetes.

The Kubernetes layer and bundles can be found in the `kubernetes`
project on github.com:  

 - [Bundle location](https://github.com/kubernetes/kubernetes/tree/master/cluster/juju/bundles)
 - [Kubernetes charm layer location](https://github.com/kubernetes/kubernetes/tree/master/cluster/juju/layers/kubernetes)
 - [More about Juju](https://jujucharms.com)


### Cloud compatibility

Juju is cloud agnostic and gives you a consistent experience across different
cloud providers. Juju supports a variety of public cloud providers: [Amazon Web Service](https://jujucharms.com/docs/2.0/help-aws),
[Microsoft Azure](https://jujucharms.com/docs/2.0/help-azure),
[Google Compute Engine](https://jujucharms.com/docs/2.0/help-google),
[Joyent](https://jujucharms.com/docs/2.0/help-joyent),
[Rackspace](https://jujucharms.com/docs/2.0/help-rackspace), any
[OpenStack cloud](https://jujucharms.com/docs/2.0/clouds#specifying-additional-clouds),
and
[Vmware vSphere](https://jujucharms.com/docs/2.0/config-vmware).

If you do not see your favorite cloud provider listed many clouds with ssh
access can be configured for
[manual provisioning](https://jujucharms.com/docs/2.0/clouds-manual).

To change to a different cloud you can use the `juju switch` command and set
up the credentials for that cloud provider and continue to use the `kubeup.sh`
script.

## Support Level


IaaS Provider        | Config. Mgmt | OS     | Networking  | Docs                                              | Conforms | Support Level
-------------------- | ------------ | ------ | ----------  | ---------------------------------------------     | ---------| ----------------------------
Amazon Web Services (AWS)   | Juju         | Ubuntu | flannel     | [docs](/docs/getting-started-guides/juju)                                   |          | [Community](https://github.com/juju-solutions/bundle-kubernetes-core) ( [@mbruzek](https://github.com/mbruzek), [@chuckbutler](https://github.com/chuckbutler) )
OpenStack                   | Juju         | Ubuntu | flannel     | [docs](/docs/getting-started-guides/juju)                                   |          | [Community](https://github.com/juju-solutions/bundle-kubernetes-core) ( [@mbruzek](https://github.com/mbruzek), [@chuckbutler](https://github.com/chuckbutler) )
Microsoft Azure             | Juju         | Ubuntu | flannel     | [docs](/docs/getting-started-guides/juju)                                   |          | [Community](https://github.com/juju-solutions/bundle-kubernetes-core) ( [@mbruzek](https://github.com/mbruzek), [@chuckbutler](https://github.com/chuckbutler) )
Google Compute Engine (GCE) | Juju         | Ubuntu | flannel     | [docs](/docs/getting-started-guides/juju)                                   |          | [Community](https://github.com/juju-solutions/bundle-kubernetes-core) ( [@mbruzek](https://github.com/mbruzek), [@chuckbutler](https://github.com/chuckbutler) )


For support level information on all solutions, see the [Table of solutions](/docs/getting-started-guides/#table-of-solutions) chart.
