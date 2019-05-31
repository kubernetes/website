---
reviewers:
- dlorenc
- balopat
- aaron-prindle
title: Running Kubernetes Locally via Minikube
content_template: templates/concept
---

{{% capture overview %}}

Minikube is a tool that makes it easy to run Kubernetes locally. Minikube runs a single-node Kubernetes cluster inside a Virtual Machine (VM) on your laptop for users looking to try out Kubernetes or develop with it day-to-day.

{{% /capture %}}

{{% capture body %}}

## Minikube Features

Minikube supports the following Kubernetes features:

* DNS
* NodePorts
* ConfigMaps and Secrets
* Dashboards
* Container Runtime: Docker, [rkt](https://github.com/rkt/rkt), [CRI-O](https://github.com/kubernetes-incubator/cri-o), and [containerd](https://github.com/containerd/containerd)
* Enabling CNI (Container Network Interface)
* Ingress

## Installation

See [Installing Minikube](/docs/tasks/tools/install-minikube/).

## Quickstart

This brief demo guides you on how to start, use, and delete Minikube locally. Follow the steps given below to start and explore Minikube.

1. Start Minikube and create a cluster:
    ```shell
    minikube start
    ```
    The output is similar to this:

    ```
    Starting local Kubernetes cluster...
    Running pre-create checks...
    Creating machine...
    Starting local Kubernetes cluster...
    ```
    For more information on starting your cluster on a specific Kubernetes version, VM, or container runtime, see [Starting a Cluster](#starting-a-cluster).

2. Now, you can interact with your cluster using kubectl. For more information, see [Interacting with Your Cluster](#interacting-with-your-cluster).
    
    Let’s create a Kubernetes Deployment using an existing image named `echoserver`, which is a simple HTTP server and expose it on port 8080 using `--port`.
    ```shell
    kubectl run hello-minikube --image=k8s.gcr.io/echoserver:1.10 --port=8080
    ```
    The output is similar to this:
    ```
    deployment.apps/hello-minikube created
    ```
3. To access the `hello-minikue` Deployment, expose it as a Service:
    ```shell
    kubectl expose deployment hello-minikube --type=NodePort
    ```
    The option `--type=NodePort` specifies the type of the Service.
    
    The output is similar to this:
    ```
    service/hello-minikube exposed
    ```
4. The `hello-minikube` Pod is now launched but you have to wait until the Pod is up before accessing it via the exposed Service.

	Check if the Pod is up and running:
	```shell
	kubectl get pod
	```
	If the output shows the `STATUS` as `ContainerCreating`, the Pod is still being created:
	```
	NAME                              READY     STATUS              RESTARTS   AGE
	hello-minikube-3383150820-vctvh   0/1       ContainerCreating   0          3s
	```
	If the output shows the `STATUS` as `Running`, the Pod is now up and running:
	```
	NAME                              READY     STATUS    RESTARTS   AGE
	hello-minikube-3383150820-vctvh   1/1       Running   0          13s
	```
5. Get the URL of the exposed Service to view the Service details:
	```shell
	minikube service hello-minikube --url
	```
6. To view the details of your local cluster, copy and paste the URL you got as the output, on your browser.
    
    The output is similar to this:
    ```
    Hostname: hello-minikube-7c77b68cff-8wdzq

    Pod Information:
        -no pod information available-

    Server values:
        server_version=nginx: 1.13.3 - lua: 10008

    Request Information:
        client_address=172.17.0.1
        method=GET
        real path=/
        query=
        request_version=1.1
        request_scheme=http
        request_uri=http://192.168.99.100:8080/

    Request Headers:
        accept=*/*
        host=192.168.99.100:30674
        user-agent=curl/7.47.0

    Request Body:
        -no body in request-
    ```
	If you no longer want the Service and cluster to run, you can delete them.
7. Delete the `hello-minikube` Service:
    ```shell
    kubectl delete services hello-minikube
    ```
    The output is similar to this:
    ```
    service "hello-minikube" deleted
    ```
8. Delete the `hello-minikube` Deployment:
    ```shell
    kubectl delete deployment hello-minikube
    ```
    The output is similar to this:
    ```
    deployment.extensions "hello-minikube" deleted
    ```
9. Stop the local Minikube cluster:
    ```shell
    minikube stop
    ```
    The output is similar to this:
    ```
    Stopping "minikube"...
    "minikube" stopped.
    ```
	For more information, see [Stopping a Cluster](#stopping-a-cluster).
10. Delete the local Minikube cluster:
    ```shell
    minikube delete
    ```
    The output is similar to this:
    ```
    Deleting "minikube" ...
    The "minikube" cluster has been deleted.
    ```
	For more information, see [Deleting a cluster](#deleting-a-cluster).
  
## Managing your Cluster

### Starting a Cluster

The `minikube start` command can be used to start your cluster.
This command creates and configures a Virtual Machine that runs a single-node Kubernetes cluster.
This command also configures your [kubectl](/docs/user-guide/kubectl-overview/) installation to communicate with this cluster.

{{< note >}}
If you are behind a web proxy, you need to pass this information to the `minikube start` command:

```shell
https_proxy=<my proxy> minikube start --docker-env http_proxy=<my proxy> --docker-env https_proxy=<my proxy> --docker-env no_proxy=192.168.99.0/24
```
Unfortunately, setting the environment variables alone does not work.

Minikube also creates a "minikube" context, and sets it to default in kubectl.
To switch back to this context, run this command: `kubectl config use-context minikube`.
{{< /note >}}

#### Specifying the Kubernetes version

You can specify the version of Kubernetes for Minikube to use by
adding the `--kubernetes-version` string to the `minikube start` command. For
example, to run version {{< param "fullversion" >}}, you would run the following:

```
minikube start --kubernetes-version {{< param "fullversion" >}}
```
#### Specifying the VM driver
You can change the VM driver by adding the `--vm-driver=<enter_driver_name>` flag to `minikube start`.
For example the command would be.
```shell
minikube start --vm-driver=<driver_name>
```
 Minikube supports the following drivers:
 {{< note >}}
 See [DRIVERS](https://git.k8s.io/minikube/docs/drivers.md) for details on supported drivers and how to install
plugins.
{{< /note >}}

* virtualbox
* vmwarefusion
* kvm2 ([driver installation](https://git.k8s.io/minikube/docs/drivers.md#kvm2-driver))
* hyperkit ([driver installation](https://git.k8s.io/minikube/docs/drivers.md#hyperkit-driver))
* hyperv ([driver installation](https://github.com/kubernetes/minikube/blob/master/docs/drivers.md#hyperv-driver))
Note that the IP below is dynamic and can change. It can be retrieved with `minikube ip`.
* vmware ([driver installation](https://github.com/kubernetes/minikube/blob/master/docs/drivers.md#vmware-unified-driver)) (VMware unified driver)
* none (Runs the Kubernetes components on the host and not in a VM. Using this driver requires Docker ([docker install](https://docs.docker.com/install/linux/docker-ce/ubuntu/)) and a Linux environment)

#### Starting a cluster on alternative container runtimes
You can start Minikube on the following container runtimes.
{{< tabs name="container_runtimes" >}}
{{% tab name="containerd" %}}
To use [containerd](https://github.com/containerd/containerd) as the container runtime, run:
```bash
minikube start \
    --network-plugin=cni \
    --enable-default-cni \
    --container-runtime=containerd \
    --bootstrapper=kubeadm
```

Or you can use the extended version:

```bash
minikube start \
    --network-plugin=cni \
    --enable-default-cni \
    --extra-config=kubelet.container-runtime=remote \
    --extra-config=kubelet.container-runtime-endpoint=unix:///run/containerd/containerd.sock \
    --extra-config=kubelet.image-service-endpoint=unix:///run/containerd/containerd.sock \
    --bootstrapper=kubeadm
```
{{% /tab %}}
{{% tab name="CRI-O" %}}
To use [CRI-O](https://github.com/kubernetes-incubator/cri-o) as the container runtime, run:
```bash
minikube start \
    --network-plugin=cni \
    --enable-default-cni \
    --container-runtime=cri-o \
    --bootstrapper=kubeadm
```
Or you can use the extended version:

```bash
minikube start \
    --network-plugin=cni \
    --enable-default-cni \
    --extra-config=kubelet.container-runtime=remote \
    --extra-config=kubelet.container-runtime-endpoint=/var/run/crio.sock \
    --extra-config=kubelet.image-service-endpoint=/var/run/crio.sock \
    --bootstrapper=kubeadm
```
{{% /tab %}}
{{% tab name="rkt container engine" %}}
To use [rkt](https://github.com/rkt/rkt) as the container runtime run:
```shell
minikube start \
    --network-plugin=cni \
    --enable-default-cni \
    --container-runtime=rkt
```
This will use an alternative minikube ISO image containing both rkt, and Docker, and enable CNI networking.
{{% /tab %}}
{{< /tabs >}}

#### Use local images by re-using the Docker daemon

When using a single VM for Kubernetes, it's useful to reuse Minikube's built-in Docker daemon. Reusing the built-in daemon means you don't have to build a Docker registry on your host machine and push the image into it. Instead, you can build inside the same Docker daemon as Minikube, which speeds up local experiments.

{{< note >}}
Be sure to tag your Docker image with something other than latest and use that tag to pull the image. Because `:latest` is the default value, with a corresponding default image pull policy of `Always`, an image pull error (`ErrImagePull`) eventually results if you do not have the Docker image in the default Docker registry (usually DockerHub).
{{< /note >}}

To work with the Docker daemon on your Mac/Linux host, use the `docker-env command` in your shell:

```shell
eval $(minikube docker-env)
```

You can now use Docker at the command line of your host Mac/Linux machine to communicate with the Docker daemon inside the Minikube VM:

```shell
docker ps
```

{{< note >}}
On Centos 7, Docker may report the following error:

```
Could not read CA certificate "/etc/docker/ca.pem": open /etc/docker/ca.pem: no such file or directory
```

You can fix this by updating /etc/sysconfig/docker to ensure that Minikube's environment changes are respected:

```shell
< DOCKER_CERT_PATH=/etc/docker
---
> if [ -z "${DOCKER_CERT_PATH}" ]; then
>   DOCKER_CERT_PATH=/etc/docker
> fi
```
{{< /note >}}

### Configuring Kubernetes

Minikube has a "configurator" feature that allows users to configure the Kubernetes components with arbitrary values.
To use this feature, you can use the `--extra-config` flag on the `minikube start` command.

This flag is repeated, so you can pass it several times with several different values to set multiple options.

This flag takes a string of the form `component.key=value`, where `component` is one of the strings from the below list, `key` is a value on the
configuration struct and `value` is the value to set.

Valid keys can be found by examining the documentation for the Kubernetes `componentconfigs` for each component.
Here is the documentation for each supported configuration:

* [kubelet](https://godoc.org/k8s.io/kubernetes/pkg/kubelet/apis/config#KubeletConfiguration)
* [apiserver](https://godoc.org/k8s.io/kubernetes/cmd/kube-apiserver/app/options#ServerRunOptions)
* [proxy](https://godoc.org/k8s.io/kubernetes/pkg/proxy/apis/config#KubeProxyConfiguration)
* [controller-manager](https://godoc.org/k8s.io/kubernetes/pkg/controller/apis/config#KubeControllerManagerConfiguration)
* [etcd](https://godoc.org/github.com/coreos/etcd/etcdserver#ServerConfig)
* [scheduler](https://godoc.org/k8s.io/kubernetes/pkg/scheduler/apis/config#KubeSchedulerConfiguration)

#### Examples

To change the `MaxPods` setting to 5 on the Kubelet, pass this flag: `--extra-config=kubelet.MaxPods=5`.

This feature also supports nested structs. To change the `LeaderElection.LeaderElect` setting to `true` on the scheduler, pass this flag: `--extra-config=scheduler.LeaderElection.LeaderElect=true`.

To set the `AuthorizationMode` on the `apiserver` to `RBAC`, you can use: `--extra-config=apiserver.authorization-mode=RBAC`.

### Stopping a Cluster
The `minikube stop` command can be used to stop your cluster.
This command shuts down the Minikube Virtual Machine, but preserves all cluster state and data.
Starting the cluster again will restore it to its previous state.

### Deleting a Cluster
The `minikube delete` command can be used to delete your cluster.
This command shuts down and deletes the Minikube Virtual Machine. No data or state is preserved.

## Interacting with Your Cluster

### Kubectl

The `minikube start` command creates a [kubectl context](/docs/reference/generated/kubectl/kubectl-commands#-em-set-context-em-) called "minikube".
This context contains the configuration to communicate with your Minikube cluster.

Minikube sets this context to default automatically, but if you need to switch back to it in the future, run:

`kubectl config use-context minikube`,

Or pass the context on each command like this: `kubectl get pods --context=minikube`.

### Dashboard

To access the [Kubernetes Dashboard](/docs/tasks/access-application-cluster/web-ui-dashboard/), run this command in a shell after starting Minikube to get the address:

```shell
minikube dashboard
```

### Services

To access a Service exposed via a node port, run this command in a shell after starting Minikube to get the address:

```shell
minikube service [-n NAMESPACE] [--url] NAME
```

## Networking

The Minikube VM is exposed to the host system via a host-only IP address, that can be obtained with the `minikube ip` command.
Any services of type `NodePort` can be accessed over that IP address, on the NodePort.

To determine the NodePort for your service, you can use a `kubectl` command like this:

`kubectl get service $SERVICE --output='jsonpath="{.spec.ports[0].nodePort}"'`

## Persistent Volumes
Minikube supports [PersistentVolumes](/docs/concepts/storage/persistent-volumes/) of type `hostPath`.
These PersistentVolumes are mapped to a directory inside the Minikube VM.

The Minikube VM boots into a tmpfs, so most directories will not be persisted across reboots (`minikube stop`).
However, Minikube is configured to persist files stored under the following host directories:

* `/data`
* `/var/lib/minikube`
* `/var/lib/docker`

Here is an example PersistentVolume config to persist data in the `/data` directory:

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv0001
spec:
  accessModes:
    - ReadWriteOnce
  capacity:
    storage: 5Gi
  hostPath:
    path: /data/pv0001/
```

## Mounted Host Folders
Some drivers will mount a host folder within the VM so that you can easily share files between the VM and host.  These are not configurable at the moment and different for the driver and OS you are using.

{{< note >}}
Host folder sharing is not implemented in the KVM driver yet.
{{< /note >}}

| Driver | OS | HostFolder | VM |
| --- | --- | --- | --- |
| VirtualBox | Linux | /home | /hosthome |
| VirtualBox | macOS | /Users | /Users |
| VirtualBox | Windows | C://Users | /c/Users |
| VMware Fusion | macOS | /Users | /Users |
| Xhyve | macOS | /Users | /Users |

## Private Container Registries

To access a private container registry, follow the steps on [this page](/docs/concepts/containers/images/).

We recommend you use `ImagePullSecrets`, but if you would like to configure access on the Minikube VM you can place the `.dockercfg` in the `/home/docker` directory or the `config.json` in the `/home/docker/.docker` directory.

## Add-ons

In order to have Minikube properly start or restart custom addons,
place the addons you wish to be launched with Minikube in the `~/.minikube/addons`
directory. Addons in this folder will be moved to the Minikube VM and
launched each time Minikube is started or restarted.

## Using Minikube with an HTTP Proxy

Minikube creates a Virtual Machine that includes Kubernetes and a Docker daemon.
When Kubernetes attempts to schedule containers using Docker, the Docker daemon may require external network access to pull containers.

If you are behind an HTTP proxy, you may need to supply Docker with the proxy settings.
To do this, pass the required environment variables as flags during `minikube start`.

For example:

```shell
minikube start --docker-env http_proxy=http://$YOURPROXY:PORT \
                 --docker-env https_proxy=https://$YOURPROXY:PORT
```

If your Virtual Machine address is 192.168.99.100, then chances are your proxy settings will prevent `kubectl` from directly reaching it.
To by-pass proxy configuration for this IP address, you should modify your no_proxy settings. You can do so with:

```shell
export no_proxy=$no_proxy,$(minikube ip)
```

## Known Issues
* Features that require a Cloud Provider will not work in Minikube. These include:
  * LoadBalancers
* Features that require multiple nodes. These include:
  * Advanced scheduling policies

## Design

Minikube uses [libmachine](https://github.com/docker/machine/tree/master/libmachine) for provisioning VMs, and [kubeadm](https://github.com/kubernetes/kubeadm) to provision a Kubernetes cluster.

For more information about Minikube, see the [proposal](https://git.k8s.io/community/contributors/design-proposals/cluster-lifecycle/local-cluster-ux.md).

## Additional Links

* **Goals and Non-Goals**: For the goals and non-goals of the Minikube project, please see our [roadmap](https://git.k8s.io/minikube/docs/contributors/roadmap.md).
* **Development Guide**: See [CONTRIBUTING.md](https://git.k8s.io/minikube/CONTRIBUTING.md) for an overview of how to send pull requests.
* **Building Minikube**: For instructions on how to build/test Minikube from source, see the [build guide](https://git.k8s.io/minikube/docs/contributors/build_guide.md).
* **Adding a New Dependency**: For instructions on how to add a new dependency to Minikube, see the [adding dependencies guide](https://git.k8s.io/minikube/docs/contributors/adding_a_dependency.md).
* **Adding a New Addon**: For instructions on how to add a new addon for Minikube, see the [adding an addon guide](https://git.k8s.io/minikube/docs/contributors/adding_an_addon.md).
* **MicroK8s**: Linux users wishing to avoid running a virtual machine may consider [MicroK8s](https://microk8s.io/) as an alternative.

## Community

Contributions, questions, and comments are all welcomed and encouraged! Minikube developers hang out on [Slack](https://kubernetes.slack.com) in the #minikube channel (get an invitation [here](http://slack.kubernetes.io/)). We also have the [kubernetes-dev Google Groups mailing list](https://groups.google.com/forum/#!forum/kubernetes-dev). If you are posting to the list please prefix your subject with "minikube: ".

{{% /capture %}}
