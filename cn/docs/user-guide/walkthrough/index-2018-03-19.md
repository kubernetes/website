---
reviewers:
- eparis
- mikedanese
title: Kubernetes 101
---

## Kubectl CLI and Pods

For Kubernetes 101, we will cover kubectl, pods, volumes, and multiple containers

{% include task-tutorial-prereqs.md %}

In order for the kubectl usage examples to work, make sure you have an example directory locally, either from [a release](https://github.com/kubernetes/kubernetes/releases) or [the source](https://github.com/kubernetes/kubernetes).

* TOC
{:toc}


## Kubectl CLI

The easiest way to interact with Kubernetes is via the [kubectl](/docs/user-guide/kubectl-overview/) command-line interface.

For more info about kubectl, including its usage, commands, and parameters, see the [kubectl CLI reference](/docs/user-guide/kubectl-overview/).

If you haven't installed and configured kubectl, finish [installing kubectl](/docs/tasks/kubectl/install/) before continuing.

## Pods

In Kubernetes, a group of one or more containers is called a _pod_. Containers in a pod are deployed together, and are started, stopped, and replicated as a group.

See [pods](/docs/concepts/workloads/pods/pod/) for more details.


#### Pod Definition

The simplest pod definition describes the deployment of a single container.  For example, an nginx web server pod might be defined as such:

{% include code.html language="yaml" file="pod-nginx.yaml" ghlink="/docs/user-guide/walkthrough/pod-nginx.yaml" %}

A pod definition is a declaration of a _desired state_.  Desired state is a very important concept in the Kubernetes model.  Many things present a desired state to the system, and it is Kubernetes' responsibility to make sure that the current state matches the desired state.  For example, when you create a Pod, you declare that you want the containers in it to be running.  If the containers happen to not be running (e.g. program failure, ...), Kubernetes will continue to (re-)create them for you in order to drive them to the desired state. This process continues until the Pod is deleted.

See the [design document](https://git.k8s.io/community/contributors/design-proposals/README.md) for more details.


#### Pod Management

Create a pod containing an nginx server ([pod-nginx.yaml](/docs/user-guide/walkthrough/pod-nginx.yaml)):

```shell
$ kubectl create -f docs/user-guide/walkthrough/pod-nginx.yaml
```

List all pods:

```shell
$ kubectl get pods
```

On most providers, the pod IPs are not externally accessible. The easiest way to test that the pod is working is to create a busybox pod and exec commands on it remotely. See the [command execution documentation](/docs/tasks/debug-application-cluster/get-shell-running-container/) for details.

Provided the pod IP is accessible, you should be able to access its http endpoint with wget on port 80:

```shell
{% raw %}
$ kubectl run busybox --image=busybox --restart=Never --tty -i --generator=run-pod/v1 --env "POD_IP=$(kubectl get pod nginx -o go-template='{{.status.podIP}}')"
u@busybox$ wget -qO- http://$POD_IP # Run in the busybox container
u@busybox$ exit # Exit the busybox container
$ kubectl delete pod busybox # Clean up the pod we created with "kubectl run"
{% endraw %}
```

Delete the pod by name:

```shell
$ kubectl delete pod nginx
```


#### Volumes

That's great for a simple static web server, but what about persistent storage?

The container file system only lives as long as the container does. So if your app's state needs to survive relocation, reboots, and crashes, you'll need to configure some persistent storage.

For this example we'll be creating a Redis pod with a named volume and volume mount that defines the path to mount the volume.

1. Define a volume:

```yaml
volumes:
    - name: redis-persistent-storage
      emptyDir: {}
```

2. Define a volume mount within a container definition:

```yaml
volumeMounts:
    # name must match the volume name defined in volumes
    - name: redis-persistent-storage
      # mount path within the container
      mountPath: /data/redis
```

Example Redis pod definition with a persistent storage volume ([pod-redis.yaml](/docs/user-guide/walkthrough/pod-redis.yaml)):

{% include code.html language="yaml" file="pod-redis.yaml" ghlink="/docs/user-guide/walkthrough/pod-redis.yaml" %}

Notes:

- The `volumeMounts` `name` is a reference to a specific  `volumes` `name`.
- The `volumeMounts` `mountPath` is the path to mount the volume within the container.

##### Volume Types

- **EmptyDir**: Creates a new directory that will exist as long as the Pod is running on the node, but it can persist across container failures and restarts.
- **HostPath**: Mounts an existing directory on the node's file system (e.g. `/var/logs`).

See [volumes](/docs/concepts/storage/volumes/) for more details.


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

Note that we have also added a volume here.  In this case, the volume is mounted into both containers.  It is marked `readOnly` in the web server's case, since it doesn't need to write to the directory.

Finally, we have also introduced an environment variable to the `git-monitor` container, which allows us to parameterize that container with the particular git repository that we want to track.


## What's Next?

Continue on to [Kubernetes 201](/docs/user-guide/walkthrough/k8s201/) or
for a complete application see the [guestbook example](https://github.com/kubernetes/examples/tree/{{page.githubbranch}}/guestbook/)
