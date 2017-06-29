---
assignees:
- jdef
title: Kubernetes on Mesos
---

* TOC
{:toc}

## About Kubernetes on Mesos

<!-- TODO: Update, clean up. -->

Mesos allows dynamic sharing of cluster resources between Kubernetes and other first-class Mesos frameworks such as [HDFS][1], [Spark][2], and [Chronos][3].
Mesos also ensures applications from different frameworks running on your cluster are isolated and that resources are allocated fairly among them.

Mesos clusters can be deployed on nearly every IaaS cloud provider infrastructure or in your own physical datacenter. Kubernetes on Mesos runs on-top of that and therefore allows you to easily move Kubernetes workloads from one of these environments to the other.

This tutorial will walk you through setting up Kubernetes on a Mesos cluster.
It provides a step by step walk through of adding Kubernetes to a Mesos cluster and starting your first pod with an nginx webserver.

**NOTE:** There are [known issues with the current implementation][7] and support for centralized logging and monitoring is not yet available.
Please [file an issue against the kubernetes-mesos project][8] if you have problems completing the steps below.

Further information is available in the Kubernetes on Mesos [contrib directory][13].

### Prerequisites

- Understanding of [Apache Mesos][6]
- A running [Mesos cluster on Google Compute Engine][5]
- A [VPN connection][10] to the cluster
- A machine in the cluster which should become the Kubernetes *master node* with:
  - Go (see [here](https://git.k8s.io/community/contributors/devel/development.md) for required versions)
  - make (i.e. build-essential)
  - Docker

**Note**: You *can*, but you *don't have to* deploy Kubernetes-Mesos on the same machine the Mesos master is running on.

### Deploy Kubernetes-Mesos

Log into the future Kubernetes *master node* over SSH, replacing the placeholder below with the correct IP address.

```shell
ssh jclouds@${ip_address_of_master_node}
```

Build Kubernetes-Mesos.

```shell
git clone https://github.com/kubernetes-incubator/kube-mesos-framework
cd kube-mesos-framework
make
```

Set some environment variables.
The internal IP address of the master may be obtained via `hostname -i`.

```shell
export KUBERNETES_MASTER_IP=$(hostname -i)
export KUBERNETES_MASTER=http://${KUBERNETES_MASTER_IP}:8888
```

Note that KUBERNETES_MASTER is used as the api endpoint. If you have existing `~/.kube/config` and point to another endpoint, you need to add option `--server=${KUBERNETES_MASTER}` to kubectl in later steps.

### Deploy etcd

Start etcd and verify that it is running:

```shell
sudo docker run -d --hostname $(uname -n) --name etcd \
  -p 4001:4001 -p 7001:7001 quay.io/coreos/etcd:v2.2.1 \
  --listen-client-urls http://0.0.0.0:4001 \
  --advertise-client-urls http://${KUBERNETES_MASTER_IP}:4001
```

```shell
$ sudo docker ps
CONTAINER ID   IMAGE                        COMMAND   CREATED   STATUS   PORTS                NAMES
fd7bac9e2301   quay.io/coreos/etcd:v2.2.1   "/etcd"   5s ago    Up 3s    2379/tcp, 2380/...   etcd
```

It's also a good idea to ensure your etcd instance is reachable by testing it

```shell
curl -L http://${KUBERNETES_MASTER_IP}:4001/v2/keys/
```

If connectivity is OK, you will see an output of the available keys in etcd (if any).

### Start Kubernetes-Mesos Services

Update your PATH to more easily run the Kubernetes-Mesos binaries:

```shell
export PATH="$(pwd)/_output/local/go/bin:$PATH"
```

Identify your Mesos master: depending on your Mesos installation this is either a `host:port` like `mesos-master:5050` or a ZooKeeper URL like `zk://zookeeper:2181/mesos`.
In order to let Kubernetes survive Mesos master changes, the ZooKeeper URL is recommended for production environments.

```shell
export MESOS_MASTER=<host:port or zk:// url>
```

Create a cloud config file `mesos-cloud.conf` in the current directory with the following contents:

```shell
$ cat <<EOF >mesos-cloud.conf
[mesos-cloud]
        mesos-master        = ${MESOS_MASTER}
EOF
```

Now start the kubernetes-mesos API server, controller manager, and scheduler on the master node:

```shell
$ km apiserver \
  --address=${KUBERNETES_MASTER_IP} \
  --etcd-servers=http://${KUBERNETES_MASTER_IP}:4001 \
  --service-cluster-ip-range=10.10.10.0/24 \
  --port=8888 \
  --cloud-provider=mesos \
  --cloud-config=mesos-cloud.conf \
  --secure-port=0 \
  --v=1 >apiserver.log 2>&1 &

$ km controller-manager \
  --master=${KUBERNETES_MASTER_IP}:8888 \
  --cloud-provider=mesos \
  --cloud-config=./mesos-cloud.conf  \
  --v=1 >controller.log 2>&1 &

$ km scheduler \
  --address=${KUBERNETES_MASTER_IP} \
  --mesos-master=${MESOS_MASTER} \
  --etcd-servers=http://${KUBERNETES_MASTER_IP}:4001 \
  --mesos-user=root \
  --api-servers=${KUBERNETES_MASTER_IP}:8888 \
  --cluster-dns=10.10.10.10 \
  --cluster-domain=cluster.local \
  --v=2 >scheduler.log 2>&1 &
```

Disown your background jobs so that they'll stay running if you log out.

```shell
disown -a
```

#### Validate KM Services

Interact with the kubernetes-mesos framework via `kubectl`:

```shell
$ kubectl get pods
NAME      READY     STATUS    RESTARTS   AGE
```

```shell
# NOTE: your service IPs will likely differ
$ kubectl get services
NAME             CLUSTER-IP       EXTERNAL-IP     PORT(S)        AGE
k8sm-scheduler   10.10.10.113     <none>          10251/TCP      1d
kubernetes       10.10.10.1       <none>          443/TCP        1d
```

Lastly, look for Kubernetes in the Mesos web GUI by pointing your browser to
`http://<mesos-master-ip:port>`. Make sure you have an active VPN connection.
Go to the Frameworks tab, and look for an active framework named "Kubernetes".

## Spin up a pod

Write a JSON pod description to a local file:

```shell
$ cat <<EOPOD >nginx.yaml
```

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
spec:
  containers:
  - name: nginx
    image: nginx
    ports:
    - containerPort: 80
EOPOD
```

Send the pod description to Kubernetes using the `kubectl` CLI:

```shell
$ kubectl create -f ./nginx.yaml
pod "nginx" created
```

Wait a minute or two while `dockerd` downloads the image layers from the internet.
We can use the `kubectl` interface to monitor the status of our pod:

```shell
$ kubectl get pods
NAME      READY     STATUS    RESTARTS   AGE
nginx     1/1       Running   0          14s
```

Verify that the pod task is running in the Mesos web GUI. Click on the
Kubernetes framework. The next screen should show the running Mesos task that
started the Kubernetes pod.

## Launching kube-dns

Kube-dns is an addon for Kubernetes which adds DNS-based service discovery to the cluster. For a detailed explanation see [DNS in Kubernetes][4].

The kube-dns addon runs as a pod inside the cluster. The pod consists of three co-located containers:

- a local etcd instance
- the [kube-dns][11] DNS server

We assume that kube-dns will use

- the service IP `10.10.10.10`
- and the `cluster.local` domain.

Note that we have passed these two values already as parameter to the apiserver above.

A template for a replication controller spinning up the pod with the 3 containers can be found at [cluster/addons/dns/kubedns-controller.yaml.in][12] in the repository. The following steps are necessary in order to get a valid replication controller yaml file:

- replace `{% raw %}{{ pillar['dns_replicas'] }}{% endraw %}`  with `1`
- replace `{% raw %}{{ pillar['dns_domain'] }}{% endraw %}` with `cluster.local.`
- add `--kube_master_url=${KUBERNETES_MASTER}` parameter to the kube2sky container command.

In addition the service template at [cluster/addons/dns/kubedns-controller.yaml.in][12] needs the following replacement:

- `{% raw %}{{ pillar['dns_server'] }}{% endraw %}` with `10.10.10.10`.

To do this automatically:

```shell{% raw %}
sed -e "s/{{ pillar\['dns_replicas'\] }}/1/g;"\
"s,\(command = \"/kube2sky\"\),\\1\\"$'\n'"        - --kube_master_url=${KUBERNETES_MASTER},;"\
"s/{{ pillar\['dns_domain'\] }}/cluster.local/g" \
  cluster/addons/dns/kubedns-controller.yaml.in > kubedns-controller.yaml
sed -e "s/{{ pillar\['dns_server'\] }}/10.10.10.10/g" \
  cluster/addons/dns/kubedns-svc.yaml.in > kubedns-svc.yaml
```

Now the kube-dns pod and service are ready to be launched:

```shell
kubectl create -f ./kubedns-controller.yaml
kubectl create -f ./kubedns-svc.yaml
```

Check with `kubectl get pods --namespace=kube-system` that 3/3 containers of the pods are eventually up and running. Note that the kube-dns pods run in the `kube-system` namespace, not in  `default`.

To check that the new DNS service in the cluster works, we start a busybox pod and use that to do a DNS lookup. First create the `busybox.yaml` pod spec:

```shell
cat <<EOF >busybox.yaml
```

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: busybox
  namespace: default
spec:
  containers:
  - image: busybox
    command:
      - sleep
      - "3600"
    imagePullPolicy: IfNotPresent
    name: busybox
  restartPolicy: Always
EOF
```

Then start the pod:

```shell
kubectl create -f ./busybox.yaml
```

When the pod is up and running, start a lookup for the Kubernetes master service, made available on 10.10.10.1 by default:

```shell
kubectl  exec busybox -- nslookup kubernetes
```

If everything works fine, you will get this output:

```shell
Server:    10.10.10.10
Address 1: 10.10.10.10

Name:      kubernetes
Address 1: 10.10.10.1
```
## Support Level


IaaS Provider        | Config. Mgmt | OS     | Networking  | Docs                                              | Conforms | Support Level
-------------------- | ------------ | ------ | ----------  | ---------------------------------------------     | ---------| ----------------------------
Mesos/GCE            |              |        |             | [docs](/docs/getting-started-guides/mesos)                                  |          | Community ([Kubernetes-Mesos Authors](https://github.com/mesosphere/kubernetes-mesos/blob/master/AUTHORS.md))


For support level information on all solutions, see the [Table of solutions](/docs/getting-started-guides/#table-of-solutions) chart.

## What next?

Try out some of the standard [Kubernetes examples][9].

Read about Kubernetes on Mesos' architecture in the [contrib directory][13].

**NOTE:** Some examples require Kubernetes DNS to be installed on the cluster.
Future work will add instructions to this guide to enable support for Kubernetes DNS.

**NOTE:** Please be aware that there are [known issues with the current Kubernetes-Mesos implementation][7].

[1]: https://docs.mesosphere.com/latest/usage/service-guides/hdfs/
[2]: https://docs.mesosphere.com/latest/usage/service-guides/spark/
[3]: https://docs.mesosphere.com/latest/usage/service-guides/chronos/
[4]: https://releases.k8s.io/{{page.githubbranch}}/cluster/addons/dns/README.md
[5]: https://dcos.io/docs/latest/administration/installing/cloud/gce/
[6]: http://mesos.apache.org/
[7]: https://github.com/kubernetes-incubator/kube-mesos-framework/blob/master/docs/issues.md
[8]: https://github.com/mesosphere/kubernetes-mesos/issues
[9]: https://github.com/kubernetes/kubernetes/tree/{{page.githubbranch}}/examples
[10]: http://open.mesosphere.com/getting-started/cloud/google/mesosphere/#vpn-setup
[11]: https://git.k8s.io/kubernetes/cluster/addons/dns/README.md#kube-dns
[12]: https://git.k8s.io/kubernetes/cluster/addons/dns/kubedns-controller.yaml.in
[13]: https://github.com/kubernetes-incubator/kube-mesos-framework/blob/master/README.md
