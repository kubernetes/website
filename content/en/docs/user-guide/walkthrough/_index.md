---
reviewers:
- eparis
- mikedanese
title: Kubernetes 101
toc_hide: true
---

## Kubectl CLI and Pods

For Kubernetes 101, we will cover kubectl, Pods, Volumes, and multiple containers.

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

In order for the kubectl usage examples to work, make sure you have an example directory locally, either from [a release](https://github.com/kubernetes/kubernetes/releases) or the latest `.yaml` files located [here](https://github.com/kubernetes/website/tree/master/content/en/docs/user-guide/walkthrough).

{{< toc >}}


## Kubectl CLI

The easiest way to interact with Kubernetes is through the [kubectl](/docs/reference/kubectl/overview/) command-line interface.

For more info about kubectl, including its usage, commands, and parameters, see [Overview of kubectl](/docs/reference/kubectl/overview/).

For more information about installing and configuring kubectl, see [Install and Set Up kubectl](/docs/tasks/tools/install-kubectl/).

## Pods

In Kubernetes, a group of one or more containers is called a _Pod_. Containers in a Pod are deployed together, and are started, stopped, and replicated as a group.

For more information, see [Pods](/docs/concepts/workloads/pods/pod/).


#### Pod Definition

The simplest Pod definition describes the deployment of a single container.  For example, an nginx web server Pod might be defined as:

{{< code file="pod-nginx.yaml" >}}

A Pod definition is a declaration of a _desired state_.  Desired state is a very important concept in the Kubernetes model.  Many things present a desired state to the system, and Kubernetes' ensures that the current state matches the desired state.  For example, when you create a Pod and declare that the containers in it to be running. If the containers happen not to be running because of a program failure, Kubernetes continues to (re-)create the Pod in order to drive the pod to the desired state. This process continues until you delete the Pod.

For more information, see [Kubernetes Design Documents and Proposals](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/README.md).


#### Pod Management

Create a Pod containing an nginx server ([pod-nginx.yaml](/docs/user-guide/walkthrough/pod-nginx.yaml)):

```shell
$ kubectl create -f docs/user-guide/walkthrough/pod-nginx.yaml
```

List all Pods:

```shell
$ kubectl get pods
```

On most providers, the Pod IPs are not externally accessible. The easiest way to test that the pod is working is to create a busybox Pod and exec commands on it remotely. For more information, see [Get a Shell to a Running Container](/docs/tasks/debug-application-cluster/get-shell-running-container/).

If the IP of the Pod is accessible, you can access its http endpoint with wget on port 80:

```shell
$ kubectl run busybox --image=busybox --restart=Never --tty -i --generator=run-pod/v1 --env "POD_IP=$(kubectl get pod nginx -o go-template='{{.status.podIP}}')"
u@busybox$ wget -qO- http://$POD_IP # Run in the busybox container
u@busybox$ exit # Exit the busybox container
$ kubectl delete pod busybox # Clean up the pod we created with "kubectl run"

```

To delete a Pod named nginx:

```shell
$ kubectl delete pod nginx
```


#### Volumes

That's great for a simple static web server, but what about persistent storage?

The container file system only lives as long as the container does. So if your app's state needs to survive relocation, reboots, and crashes, you'll need to configure some persistent storage.

In this example you can create a Redis Pod with a named volume, and a volume mount that defines the path to mount the Volume.

1. Define a Volume:

```yaml
volumes:
    - name: redis-persistent-storage
      emptyDir: {}
```

2. Define a Volume mount within a container definition:

```yaml
volumeMounts:
    # name must match the volume name defined in volumes
    - name: redis-persistent-storage
      # mount path within the container
      mountPath: /data/redis
```


Here is an example of Redis Pod definition with a persistent storage volume ([pod-redis.yaml](/docs/user-guide/walkthrough/pod-redis.yaml)):


{{< code file="pod-redis.yaml" >}}

Where:

- The `volumeMounts` `name` is a reference to a specific  `volumes` `name`.
- The `volumeMounts` `mountPath` is the path to mount the volume within the container.

##### Volume Types

- **EmptyDir**: Creates a new directory that exists as long as the Pod is running on the node, but it can persist across container failures and restarts.
- **HostPath**: Mounts an existing directory on the node's file system. For example (`/var/logs`).

For more information, see [Volumes](/docs/concepts/storage/volumes/).


#### Multiple Containers

_Note:
The examples below are syntactically correct, but some of the images (e.g. kubernetes/git-monitor) don't exist yet.  We're working on turning these into working examples._


However, often you want to have two different containers that work together.  An example of this would be a web server, and a helper job that polls a git repository for new updates:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: www
spec:
  containers:
  - name: nginx
    image: nginx
    volumeMounts:
    - mountPath: /srv/www
      name: www-data
      readOnly: true
  - name: git-monitor
    image: kubernetes/git-monitor
    env:
    - name: GIT_REPO
      value: http://github.com/some/repo.git
    volumeMounts:
    - mountPath: /data
      name: www-data
  volumes:
  - name: www-data
    emptyDir: {}
```

Note that we have also added a Volume here.  In this case, the Volume is mounted into both containers.  It is marked `readOnly` in the web server's case, since it doesn't need to write to the directory.

Finally, we have also introduced an environment variable to the `git-monitor` container, which allows us to parameterize that container with the particular git repository that we want to track.


## What's Next?

Continue on to [Kubernetes 201](/docs/user-guide/walkthrough/k8s201/) or
for a complete application see the [guestbook example](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/guestbook/)
