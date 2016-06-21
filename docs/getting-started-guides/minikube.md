---
---

* TOC
{:toc}

Minikube starts a single node kubernetes cluster locally for purposes of development and testing.
Minikube packages and configures a Linux VM, Docker and all Kubernetes components, optimized for local development.
Minikube supports Kubernetes features such as:

* DNS
* NodePorts
* ConfigMaps and Secrets
* Dashboards

Minikube does not yet support Cloud Provider specific features such as:

* LoadBalancers
* PersistentVolumes
* Ingress

### Requirements

Minikube requires that VT-x/AMD-v virtualization is enabled in BIOS on all platforms.

To check that this is enabled on Linux, run:

```shell
cat /proc/cpuinfo | grep 'vmx\|svm'
```

This command should output something if the setting is enabled.

To check that this is enabled on OSX (most newer Macs have this enabled by default), run:

```shell
sysctl -a | grep machdep.cpu.features | grep VMX

```

This command should output something if the setting is enabled.

#### Linux

Minikube requires the latest [Virtualbox](https://www.virtualbox.org/wiki/Downloads) to be installed on your system.

#### OSX

Minikube requires one of the following:

* The latest [Virtualbox](https://www.virtualbox.org/wiki/Downloads).
* The latest version of [VMWare Fusion](https://www.vmware.com/products/fusion).

### Installation

See the [latest Minikube release](https://github.com/kubernetes/minikube/releases) for installation instructions.

### Starting the cluster

To start a cluster, run the command:

```shell
minikube start
Starting local Kubernetes cluster...
Kubernetes is available at https://192.168.99.100:443.
```

This will build and start a lightweight local cluster, consisting of a master, etcd, Docker and a single node.

Minikube will also create a "minikube" context, and set it to default in kubectl.
To switch back to this context later, run this command: `kubectl config use-context minikube`.

Type `minikube stop` to shut the cluster down.

Minikube also includes the [Kubernetes dashboard](http://kubernetes.io/docs/user-guide/ui/). Run this command to see the included kube-system pods:

```shell
$ kubectl get pods --all-namespaces
NAMESPACE     NAME                           READY     STATUS    RESTARTS   AGE
kube-system   kube-addon-manager-127.0.0.1   1/1       Running   0          35s
kube-system   kubernetes-dashboard-9brhv     1/1       Running   0          20s
```

Run this command to open the Kubernetes dashboard:

```shell
minikube dashboard
```

### Test it out

List the nodes in your cluster by running:

```shell
kubectl get nodes
```

Minikube contains a built-in Docker daemon that for running containers.
If you use another Docker daemon for building your containers, you will have to publish them to a registry before minikube can pull them.
You can use minikube's built in Docker daemon to avoid this extra step of pushing your images.
Use the built-in Docker daemon with:

```shell
eval $(minikube docker-env)
```

This command sets up the Docker environment variables so a Docker client can communicate with the minikube Docker daemon:

```shell
docker ps
CONTAINER ID        IMAGE                                                        COMMAND                  CREATED             STATUS              PORTS               NAMES
42c643fea98b        gcr.io/google_containers/kubernetes-dashboard-amd64:v1.0.1   "/dashboard --port=90"   3 minutes ago       Up 3 minutes                            k8s_kubernetes-dashboard.1d0d880_kubernetes-dashboard-9brhv_kube-system_5062dd0b-370b-11e6-84b6-5eab1f51187f_134cba4c
475db7659edf        gcr.io/google_containers/pause-amd64:3.0                     "/pause"                 3 minutes ago       Up 3 minutes                            k8s_POD.2225036b_kubernetes-dashboard-9brhv_kube-system_5062dd0b-370b-11e6-84b6-5eab1f51187f_e76d8136
e9096501addf        gcr.io/google-containers/kube-addon-manager-amd64:v2         "/opt/kube-addons.sh"    3 minutes ago       Up 3 minutes                            k8s_kube-addon-manager.a1c58ca2_kube-addon-manager-127.0.0.1_kube-system_48abed82af93bb0b941173334110923f_82655b7d
64748893cf7c        gcr.io/google_containers/pause-amd64:3.0                     "/pause"                 4 minutes ago       Up 4 minutes                            k8s_POD.d8dbe16c_kube-addon-manager-127.0.0.1_kube-system_48abed82af93bb0b941173334110923f_c67701c3
```