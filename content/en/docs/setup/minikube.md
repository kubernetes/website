---
reviewers:
- dlorenc
- balopat
- aaron-prindle
title: Running Kubernetes Locally via Minikube
content_template: templates/concept
---

{{% capture overview %}}

Minikube is a tool that makes it easy to run Kubernetes locally. Minikube runs a single-node Kubernetes cluster inside a VM on your laptop for users looking to try out Kubernetes or develop with it day-to-day.

{{% /capture %}}

{{% capture body %}}

## Minikube Features

* Minikube supports Kubernetes features such as:
  * DNS
  * NodePorts
  * ConfigMaps and Secrets
  * Dashboards
  * Container Runtime: Docker, [rkt](https://github.com/rkt/rkt), [CRI-O](https://github.com/kubernetes-incubator/cri-o) and [containerd](https://github.com/containerd/containerd)
  * Enabling CNI (Container Network Interface)
  * Ingress

## Installation

See [Installing Minikube](/docs/tasks/tools/install-minikube/).

## Quickstart

Here's a brief demo of Minikube usage.
If you want to change the VM driver add the appropriate `--vm-driver=xxx` flag to `minikube start`. Minikube supports
the following drivers:

* virtualbox
* vmwarefusion
* kvm2 ([driver installation](https://git.k8s.io/minikube/docs/drivers.md#kvm2-driver))
* hyperkit ([driver installation](https://git.k8s.io/minikube/docs/drivers.md#hyperkit-driver))
* hyperv ([driver installation](https://github.com/kubernetes/minikube/blob/master/docs/drivers.md#hyperv-driver))
Note that the IP below is dynamic and can change. It can be retrieved with `minikube ip`.
* vmware ([driver installation](https://github.com/kubernetes/minikube/blob/master/docs/drivers.md#vmware-unified-driver)) (VMware unified driver)
* none (Runs the Kubernetes components on the host and not in a VM. Using this driver requires Docker ([docker install](https://docs.docker.com/install/linux/docker-ce/ubuntu/)) and a Linux environment)

1. Start a minikube 

    ```        
    minikube start
    ```    
    The output shows that the kubernetes cluster is started:
   
    ```
    Starting local Kubernetes cluster...
    Running pre-create checks...
    Creating machine...
    Starting local Kubernetes cluster...
    ```
        
2. Create an echo server deployment

    ```
    kubectl run hello-minikube --image=k8s.gcr.io/echoserver:1.10 --port=8080
    ```        
    The output of a successful command verifies that the deployment is created:
   
    ```
    deployment.apps/hello-minikube created
    ```
        
3. Expose an echo server deployment to create service       

    ```
    kubectl expose deployment hello-minikube --type=NodePort
    ```
    The output of a successful command verifies that the service is created:
   
    ```
    service/hello-minikube exposed
    ```

4. Check whether the pod is up and running

    ```
    kubectl get pod
    ```
    The output displays the pod is still being created:     
         
    ```
    NAME                              READY     STATUS              RESTARTS   AGE
    hello-minikube-3383150820-vctvh   0/1       ContainerCreating   0          3s
    ```

5. Wait for while and then check again, whether the pod is up and running using same command

    ```
    kubectl get pod
    ```
    Now the output displays the pod is created and it is running:     
   
    ```
    NAME                              READY     STATUS    RESTARTS   AGE
    hello-minikube-3383150820-vctvh   1/1       Running   0          13s
    ```

6. Curl service which we have created

    ```
    curl $(minikube service hello-minikube --url)
    ```        
    Output looks similer to this:
   
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
7. Delete the service which we have created

    ```
    kubectl delete services hello-minikube
    ```
    The output of a successful command verifies that the service is deleted:  
   
    ```
    service "hello-minikube" deleted
    ```
8. Delete the deployment which we have created

    ```
    kubectl delete deployment hello-minikube
    ```
    The output of a successful command verifies that the deployment is deleted:
   
    ```
    deployment.extensions "hello-minikube" deleted
    ```
9. Stop a minikube

    ```
    minikube stop
   ```
   The output displays the kubernetes cluster is stopping:
   
   ```
   Stopping local Kubernetes cluster...
   Stopping "minikube"...
   ```

### Alternative Container Runtimes

#### containerd

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

#### CRI-O

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

#### rkt container engine

To use [rkt](https://github.com/rkt/rkt) as the container runtime run:

```shell
minikube start \
    --network-plugin=cni \
    --enable-default-cni \
    --container-runtime=rkt
```

This will use an alternative minikube ISO image containing both rkt, and Docker, and enable CNI networking.

### Driver plugins

See [DRIVERS](https://git.k8s.io/minikube/docs/drivers.md) for details on supported drivers and how to install
plugins, if required.

### Use local images by re-using the Docker daemon

When using a single VM of Kubernetes, it's really handy to reuse the Minikube's built-in Docker daemon; as this means you don't have to build a docker registry on your host machine and push the image into it - you can just build inside the same docker daemon as minikube which speeds up local experiments. Just make sure you tag your Docker image with something other than 'latest' and use that tag while you pull the image. Otherwise, if you do not specify version of your image, it will be assumed as `:latest`, with pull image policy of `Always` correspondingly, which may eventually result in `ErrImagePull` as you may not have any versions of your Docker image out there in the default docker registry (usually DockerHub) yet.

To be able to work with the docker daemon on your mac/linux host use the `docker-env command` in your shell:

```shell
eval $(minikube docker-env)
```

You should now be able to use docker on the command line on your host mac/linux machine talking to the docker daemon inside the minikube VM:

```shell
docker ps
```

On Centos 7, docker may report the following error:

```shell
Could not read CA certificate "/etc/docker/ca.pem": open /etc/docker/ca.pem: no such file or directory
```

The fix is to update /etc/sysconfig/docker to ensure that Minikube's environment changes are respected:

```shell
< DOCKER_CERT_PATH=/etc/docker
---
> if [ -z "${DOCKER_CERT_PATH}" ]; then
>   DOCKER_CERT_PATH=/etc/docker
> fi
```

Remember to turn off the imagePullPolicy:Always, otherwise Kubernetes won't use images you built locally.

## Managing your Cluster

### Starting a Cluster

The `minikube start` command can be used to start your cluster.
This command creates and configures a Virtual Machine that runs a single-node Kubernetes cluster.
This command also configures your [kubectl](/docs/user-guide/kubectl-overview/) installation to communicate with this cluster.

If you are behind a web proxy, you will need to pass this information to the `minikube start` command:

```shell
https_proxy=<my proxy> minikube start --docker-env http_proxy=<my proxy> --docker-env https_proxy=<my proxy> --docker-env no_proxy=192.168.99.0/24
```

Unfortunately just setting the environment variables will not work.

Minikube will also create a "minikube" context, and set it to default in kubectl.
To switch back to this context later, run this command: `kubectl config use-context minikube`.

#### Specifying the Kubernetes version

You can specify the specific version of Kubernetes for Minikube to use by
adding the `--kubernetes-version` string to the `minikube start` command. For
example, to run version `v1.7.3`, you would run the following:

```
minikube start --kubernetes-version v1.7.3
```

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

To access a service exposed via a node port, run this command in a shell after starting Minikube to get the address:

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
