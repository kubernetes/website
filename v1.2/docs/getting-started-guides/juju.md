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

[Install the Juju client](https://jujucharms.com/get-started) on your
local Ubuntu system:

```shell
sudo add-apt-repository ppa:juju/stable
sudo apt-get update
sudo apt-get install juju-core juju-quickstart
```

### With Docker

If you are not using Ubuntu or prefer the isolation of Docker, you may
run the following:

```shell
mkdir ~/.juju
sudo docker run -v ~/.juju:/home/ubuntu/.juju -ti jujusolutions/jujubox:latest
```

At this point from either path you will have access to the `juju
quickstart` command.

To set up the credentials for your chosen cloud run:

```shell
juju quickstart --constraints="mem=3.75G" -i
```

> The `constraints` flag is optional, it changes the size of virtual machines
> that Juju will generate when it requests a new machine.  Larger machines
> will run faster but cost more money than smaller machines.

Follow the dialogue and choose `save` and `use`.  Quickstart will now
bootstrap the juju root node and setup the juju web based user
interface.


## Launch Kubernetes cluster

You will need to export the `KUBERNETES_PROVIDER` environment variable before
bringing up the cluster.

```shell
export KUBERNETES_PROVIDER=juju
cluster/kube-up.sh
```

If this is your first time running the `kube-up.sh` script, it will install
the required dependencies to get started with Juju, additionally it will
launch a curses based configuration utility allowing you to select your cloud
provider and enter the proper access credentials.

Next it will deploy the kubernetes master, etcd, 2 nodes with flannel based
Software Defined Networking (SDN) so containers on different hosts can
communicate with each other.


## Exploring the cluster

The `juju status` command provides information about each unit in the cluster:

```shell
$ juju status --format=oneline
- docker/0: 52.4.92.78 (started)
  - flannel-docker/0: 52.4.92.78 (started)
  - kubernetes/0: 52.4.92.78 (started)
- docker/1: 52.6.104.142 (started)
  - flannel-docker/1: 52.6.104.142 (started)
  - kubernetes/1: 52.6.104.142 (started)
- etcd/0: 52.5.216.210 (started) 4001/tcp
- juju-gui/0: 52.5.205.174 (started) 80/tcp, 443/tcp
- kubernetes-master/0: 52.6.19.238 (started) 8080/tcp
```

You can use `juju ssh` to access any of the units:

```shell
juju ssh kubernetes-master/0
```

## Run some containers!

`kubectl` is available on the Kubernetes master node.  We'll ssh in to
launch some containers, but one could use `kubectl` locally by setting
`KUBERNETES_MASTER` to point at the ip address of "kubernetes-master/0".

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
juju ssh kubernetes-master/0
kubectl delete pods hello
```

## Scale out cluster

We can add node units like so:

```shell
juju add-unit docker # creates unit docker/2, kubernetes/2, docker-flannel/2
```

## Launch the "k8petstore" example app

The [k8petstore example](https://github.com/kubernetes/kubernetes/tree/{{page.githubbranch}}/examples/k8petstore/) is available as a
[juju action](https://jujucharms.com/docs/devel/actions).

```shell
juju action do kubernetes-master/0
```

> Note: this example includes curl statements to exercise the app, which
> automatically generates "petstore" transactions written to redis, and allows
> you to visualize the throughput in your browser.

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
works with:

- [Amazon Web Service](https://jujucharms.com/docs/stable/config-aws)
- [Windows Azure](https://jujucharms.com/docs/stable/config-azure)
- [DigitalOcean](https://jujucharms.com/docs/stable/config-digitalocean)
- [Google Compute Engine](https://jujucharms.com/docs/stable/config-gce)
- [HP Public Cloud](https://jujucharms.com/docs/stable/config-hpcloud)
- [Joyent](https://jujucharms.com/docs/stable/config-joyent)
- [LXC](https://jujucharms.com/docs/stable/config-LXC)
- Any [OpenStack](https://jujucharms.com/docs/stable/config-openstack) deployment
- [Vagrant](https://jujucharms.com/docs/stable/config-vagrant)
- [Vmware vSphere](https://jujucharms.com/docs/stable/config-vmware)

If you do not see your favorite cloud provider listed many clouds can be
configured for [manual provisioning](https://jujucharms.com/docs/stable/config-manual).

The Kubernetes bundle has been tested on GCE and AWS and found to work with
version 1.0.0.