---
---

[Juju](https://jujucharms.com/docs/stable/about-juju) makes it easy to deploy
Kubernetes by provisioning, installing and configuring all the systems in
the cluster. Once deployed the cluster can easily scale up with one command
to increase the cluster size.

The Juju Kubernetes work is curated by a very small group of community members.
Let us know how we are doing. If you find any problems please open an
[issue at the kubernetes project](https://github.com/kubernetes/kubernetes/issues)
and tag the issue with "juju" so we can find them.


* TOC
{:toc}

## Prerequisites

> Note: If you're running kube-up, on Ubuntu - all of the dependencies
> will be handled for you. You may safely skip to the section:
> [Launch a Kubernetes Cluster](#launch-a-kubernetes-cluster)

### On Ubuntu

[Install the Juju client](https://jujucharms.com/get-started)

> This documentation focuses on the Juju 2.0 release which will be
> promoted to stable during the April 2016 release cycle.

To paraphrase, on your local Ubuntu system:  

```shell
sudo add-apt-repository ppa:juju/devel
sudo apt-get update
sudo apt-get install juju2
```

If you are using another distro/platform - please consult the
[getting started guide](https://jujucharms.com/get-started) to install the
Juju dependencies for your platform.

### With Docker

If you are not using Ubuntu or prefer the isolation of Docker, you may
run the following:

> While this is a common target, the charmbox flavors of images are
> unofficial, and should be treated as experimental. If you encounter any issues
> turning up the Kubernetes cluster with charmbox, please file a bug on the
> [charmbox issue tracker](https://github.com/juju-solutions/charmbox/issues).

```shell
mkdir ~/.juju2
sudo docker run -v ~/.juju2:/home/ubuntu/.local/share/juju -ti jujusolutions/charmbox:devel
```

### Configure Juju to point a cloud

At this point you have access to the Juju client. Before you can deploy a
cluster you have to configure the credentials for the Juju cloud provider.

Juju [supports a wide variety of public clouds](#Cloud-compatibility) to set
up the credentials for your chosen cloud see the
[cloud setup page](https://jujucharms.com/docs/devel/getting-started#2.-choose-a-cloud).

After configuration is complete test your setup with a `juju bootstrap`
command:  
`juju bootstrap $cloudname $cloudtype` you are ready to launch the
Kubernetes cluster.

## Launch a Kubernetes cluster

You will need to export the `KUBERNETES_PROVIDER` environment variable before
bringing up the cluster.

```shell
export KUBERNETES_PROVIDER=juju
cluster/kube-up.sh
```

If this is your first time running the `kube-up.sh` script, it will attempt to
install the required dependencies to get started with Juju.

Next it will deploy two nodes of Kubernetes, 1 unit of etcd, and network
the units so containers on different hosts can communicate with each other.

## Exploring the cluster

The `juju status` command provides information about each unit in the cluster:

```shell
$ juju status

... (omitted for brevity)

[Units]
ID           WORKLOAD-STATE AGENT-STATE VERSION   MACHINE PORTS             PUBLIC-ADDRESS MESSAGE
etcd/0       active         idle        2.0-beta2 1                         54.146.50.29   Etcd leader running
kubernetes/0 active         idle        2.0-beta2 2       6443/tcp,8088/tcp 54.205.204.227 Kubernetes follower running
kubernetes/1 active         idle        2.0-beta2 3       6443/tcp,8088/tcp 54.145.57.114  Kubernetes leader running

... (omitted for brevity)
```

## Run some containers!

The `kubectl` file, the TLS certificates along with the configuration are
all available on the Kubernetes leader unit. Fetch the kubectl package so you
can run commands on the new Kuberntetes cluster.

Use the `juju status` command to figure out which Kubernetes unit is the leader
and copy the file from the leader:  

```shell
juju scp kubernetes/1:kubectl_package.tar.gz .
tar xvfz kubectl_package.tar.gz
kubectl --kubeconfig config get pods
```

If you are not on a Linux amd64 host system, you will need to find or build a
kubectl binary package for your architecture.

Put the config file in the home directory so you don't have to specify it on
the command line each time. The default location is `${HOME}/.kube/config`.

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
[Juju documentation for machine constraints](https://jujucharms.com/docs/devel/charms-constraints)
details.

## Scale out cluster

Need more clusters? Juju makes it easy to add units of a charm:  

```shell
juju add-unit kubernetes
```

Or multiple units at one time:  

```shell
juju add-unit -n3 kubernetes
```

## Tear down cluster

We recommend that you use the `kube-down.sh` command when you are done using
the cluster, as it properly brings down the cloud and removes some of the
build directories.

```shell
./kube-down.sh
```

Alternately if you want stop the servers you can destroy your current Juju
environment. Use the `juju env` command to get the current environment name:  

```shell
juju kill-controller `juju env`
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

Juju runs natively against a variety of public cloud providers. Juju currently
works with [Amazon Web Service](https://jujucharms.com/docs/stable/config-aws),
[Windows Azure](https://jujucharms.com/docs/stable/config-azure),
[DigitalOcean](https://jujucharms.com/docs/stable/config-digitalocean),
[Google Compute Engine](https://jujucharms.com/docs/stable/config-gce),
[HP Public Cloud](https://jujucharms.com/docs/stable/config-hpcloud),
[Joyent](https://jujucharms.com/docs/stable/config-joyent),
[LXC](https://jujucharms.com/docs/stable/config-LXC), any
[OpenStack](https://jujucharms.com/docs/stable/config-openstack) deployment,
[Vagrant](https://jujucharms.com/docs/stable/config-vagrant), and
[Vmware vSphere](https://jujucharms.com/docs/stable/config-vmware).

If you do not see your favorite cloud provider listed many clouds with ssh
access can be configured for
[manual provisioning](https://jujucharms.com/docs/stable/config-manual).

## Support Level


IaaS Provider        | Config. Mgmt | OS     | Networking  | Docs                                              | Conforms | Support Level
-------------------- | ------------ | ------ | ----------  | ---------------------------------------------     | ---------| ----------------------------
AWS                  | Juju         | Ubuntu | flannel     | [docs](/docs/getting-started-guides/juju)                                   |          | [Community](https://github.com/whitmo/bundle-kubernetes) ( [@whit](https://github.com/whitmo), [@matt](https://github.com/mbruzek), [@chuck](https://github.com/chuckbutler) )
OpenStack/HPCloud    | Juju         | Ubuntu | flannel     | [docs](/docs/getting-started-guides/juju)                                   |          | [Community](https://github.com/whitmo/bundle-kubernetes) ( [@whit](https://github.com/whitmo), [@matt](https://github.com/mbruzek), [@chuck](https://github.com/chuckbutler) )
Joyent               | Juju         | Ubuntu | flannel     | [docs](/docs/getting-started-guides/juju)                                   |          | [Community](https://github.com/whitmo/bundle-kubernetes) ( [@whit](https://github.com/whitmo), [@matt](https://github.com/mbruzek), [@chuck](https://github.com/chuckbutler) )



For support level information on all solutions, see the [Table of solutions](/docs/getting-started-guides/#table-of-solutions) chart.


