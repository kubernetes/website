---
---

[Juju](https://jujucharms.com/docs/stable/about-juju) makes it easy to deploy
Kubernetes by provisioning, installing and configuring all the systems in
the cluster.  Once deployed the cluster can easily scale up with one command
to increase the cluster size.

* TOC
{:toc}

## Prerequisites

> Note: If you're running kube-up, on Ubuntu - all of the dependencies
> will be handled for you. You may safely skip to the section:
> [Launch Kubernetes Cluster](#launch-kubernetes-cluster)

### On Ubuntu

[Install the Juju client](https://jujucharms.com/get-started)

> This documentation focuses on the juju 2.0 release which will be
> promoted to stable during its release cycle in April

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

> While this is a common target, the charmbox flavors of images are
> unofficial, and should be treated as Experimental. If you encounter any issues
> turning up the Kubernetes cluster with charmbox, please file a bug on the
> respective issue tracker [here](https://github.com/juju-solutions/charmbox/issues)

If you are not using Ubuntu or prefer the isolation of Docker, you may
run the following:

```shell
mkdir ~/.juju2
sudo docker run -v ~/.juju2:/home/ubuntu/.local/share/juju -ti jujusolutions/charmbox:devel
```

At this point from either path you will have access to the `juju
bootstrap` command. However we will need to configure the credentials for the
 Juju cloud provider before we can proceed.

To set up the credentials for your chosen cloud see the [cloud setup docs](https://jujucharms.com/docs/devel/getting-started#2.-choose-a-cloud):

Once your cloud has been bootstrapped via:
`juju bootstrap $cloudname $cloudtype` you are ready to launch the cluster.

## Launch Kubernetes cluster

You will need to export the `KUBERNETES_PROVIDER` environment variable before
bringing up the cluster.

```shell
export KUBERNETES_PROVIDER=juju
cluster/kube-up.sh
```

If this is your first time running the `kube-up.sh` script, it will attempt to
install the required dependencies to get started with Juju.

Next it will deploy the kubernetes application, 3 units of etcd, and network
the units with flannel based Software Defined Networking (SDN) so containers
on different hosts can communicate with each other.


## Exploring the cluster

The `juju status` command provides information about each unit in the cluster:

```shell
$ juju status --format=oneline

... (snipped for brevity)

[Units]
ID           WORKLOAD-STATE AGENT-STATE VERSION   MACHINE PORTS             PUBLIC-ADDRESS MESSAGE
etcd/0       active         idle        2.0-beta2 1                         54.146.50.29   Etcd leader running
kubernetes/0 active         idle        2.0-beta2 2       6443/tcp,8088/tcp 54.205.204.227 Kubernetes follower running
kubernetes/1 active         idle        2.0-beta2 3       6443/tcp,8088/tcp 54.145.57.114  Kubernetes leader running

... (snipped for brevity)
```


## Run some containers!

`kubectl` is available on the Kubernetes leader node. We'll fetch the kubectl
command, and execute some queries against our newly stood up cluster.


```shell
juju scp kubernetes/1:kubectl_package.tar.gz .
tar xvfz kubectl_package.tar.gz
```

If you are not on a linux amd64 host system, you will need to fetch a kubectl



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
the container. Better tooling for using Juju to introspect container
is in the works but we can use `juju run` and `juju status` to find
our hello app.

Exit out of our ssh session and run:

```shell
juju run --unit kubernetes/0 "docker ps -n=1"
...
juju run --unit kubernetes/1 "docker ps -n=1"
CONTAINER IDIMAGE  COMMAND CREATED STATUS  PORTS   NAMES
02beb61339d8quay.io/kelseyhightower/hello:latest   /hello  About an hour ago   Up About an hourk8s_hello....
```

We see "kubernetes/1" has our container, we can open port 80:

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

## Scale out cluster

We can add node units like so:

```shell
juju add-unit kubernetes
```


## Tear down cluster

```shell
./kube-down.sh
```

or destroy your current Juju environment (using the `juju env` command):

```shell
juju destroy-environment --force `juju env`
```


## More Info

The Kubernetes charms and bundles can be found in the `kubernetes` project on
github.com:

 - [Bundle Repository](http://releases.k8s.io/{{page.githubbranch}}/cluster/juju/bundles)
   * [Kubernetes master charm](https://releases.k8s.io/{{page.githubbranch}}/cluster/juju/charms/trusty/kubernetes-master)
   * [Kubernetes node charm](https://releases.k8s.io/{{page.githubbranch}}/cluster/juju/charms/trusty/kubernetes)
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

If you do not see your favorite cloud provider listed many clouds can be
configured for [manual provisioning](https://jujucharms.com/docs/stable/config-manual).
