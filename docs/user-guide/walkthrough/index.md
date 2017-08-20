---
assignees:
- eparis
- mikedanese
title: Kubernetes 101
---

<!--
## Kubectl CLI and Pods

For Kubernetes 101, we will cover kubectl, pods, volumes, and multiple containers

{% include task-tutorial-prereqs.md %}

In order for the kubectl usage examples to work, make sure you have an example directory locally, either from [a release](https://github.com/kubernetes/kubernetes/releases) or [the source](https://github.com/kubernetes/kubernetes).

* TOC
{:toc}
-->

## Kubectl CLI 和 Pods

在 Kubernetes 101 课程里, 我们会涉及 kubectl, pods, volumes, 和 多 containers 这几个内容。 

{% include task-tutorial-prereqs.md %}

为确保kubectl 的演示案例能够正常工作， 您必须把演示案例的目录保存到本地。 演示案例的相关文件可以从 [a release](https://github.com/kubernetes/kubernetes/releases) 或者 [the source](https://github.com/kubernetes/kubernetes) 上拉取。 

* TOC
{:toc}


<!--
## Kubectl CLI

The easiest way to interact with Kubernetes is via the [kubectl](/docs/user-guide/kubectl-overview/) command-line interface.

For more info about kubectl, including its usage, commands, and parameters, see the [kubectl CLI reference](/docs/user-guide/kubectl-overview/).

If you haven't installed and configured kubectl, finish [installing kubectl](/docs/tasks/kubectl/install/) before continuing.

-->


## Kubectl CLI

和 Kubernetes 交互最简单的方法是使用 [kubectl](/docs/user-guide/kubectl-overview/) 命令行接口。 

想了解更多 kubectl 的信息， 包括用法， 命令， 参数， 可以参考 [kubectl CLI 指南](/docs/user-guide/kubectl-overview/).

如果您没有安装和配置 kubectl , 在开始本章之前， 先过一遍这篇文档  [安装 kubectl](/docs/tasks/kubectl/install/)

<!--
## Pods

In Kubernetes, a group of one or more containers is called a _pod_. Containers in a pod are deployed together, and are started, stopped, and replicated as a group.

See [pods](/docs/concepts/workloads/pods/pod/) for more details.
-->
## Pods

在 Kubernetes 中, 一个或者多个容器组成的容器组称为 _pod_。 在 pod 中的容器是部署在一起的， 并且以组的方式启动， 停止和复制。 

查看这个文档 [pods](/docs/concepts/workloads/pods/pod/) 获取更多细节。 


<!--
#### Pod Definition

The simplest pod definition describes the deployment of a single container.  For example, an nginx web server pod might be defined as such:

{% include code.html language="yaml" file="pod-nginx.yaml" ghlink="/docs/user-guide/walkthrough/pod-nginx.yaml" %}

A pod definition is a declaration of a _desired state_.  Desired state is a very important concept in the Kubernetes model.  Many things present a desired state to the system, and it is Kubernetes' responsibility to make sure that the current state matches the desired state.  For example, when you create a Pod, you declare that you want the containers in it to be running.  If the containers happen to not be running (e.g. program failure, ...), Kubernetes will continue to (re-)create them for you in order to drive them to the desired state. This process continues until the Pod is deleted.

See the [design document](https://git.k8s.io/community/contributors/design-proposals/README.md) for more details.
-->
#### Pod 定义

只描述了一个容器的部署是最简单的pod 定义。比如， 一个 nginx web 服务的 pod 可能是这样的定义：

{% include code.html language="yaml" file="pod-nginx.yaml" ghlink="/docs/user-guide/walkthrough/pod-nginx.yaml" %}

一个 pod 的定义是对_期望状态_ 的声明。 期望的状态在 Kubernetes 的模型中是一个非常重要的概念。许多事物（**此处翻译有疑义**）展示了对系统的期望状态， Kubernetes 的职责是确保当前的状态和期望的状态相匹配。 举个例子， 当你创建一个 Pod 时，你声明你想要在里面的容器能够运行。如果里面的容器刚好没有运行（比如说遇到程序故障）， Kubernetes 将会持续重建它们，以驱使它们处于期望的状态。 这个过程会持续到 Pod 被删除。 

查看[设计文档](https://git.k8s.io/community/contributors/design-proposals/README.md) 获取更多信息。 

<!--
#### Pod Management

Create a pod containing an nginx server ([pod-nginx.yaml](/docs/user-guide/walkthrough/pod-nginx.yaml)):

```shell
$ kubectl create -f docs/user-guide/walkthrough/pod-nginx.yaml
```

List all pods:

```shell
$ kubectl get pods
```

On most providers, the pod IPs are not externally accessible. The easiest way to test that the pod is working is to create a busybox pod and exec commands on it remotely. See the [command execution documentation](/docs/tasks/kubectl/get-shell-running-container/) for details.

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
-->

#### Pod 管理

创建一个运行 nginx 的 pod  ([pod-nginx.yaml](/docs/user-guide/walkthrough/pod-nginx.yaml)):

```shell
$ kubectl create -f docs/user-guide/walkthrough/pod-nginx.yaml
```

列出所有的 pods ：

```shell
$ kubectl get pods
```

在大多数的平台里， pod 的 IP 不能被集群外部访问的。测试 pod 是否正常工作的最简单的方式是创建一个  busybox  的pod， 并执行远程在它上面执行命令。查看这篇文档 [命令执行文档](/docs/tasks/kubectl/get-shell-running-container/) 获取更多信息。 

假设 pod IP 可以被访问， 你可以通过 wget 80端口来访问它的 http 端点：

```shell
{% raw %}
$ kubectl run busybox --image=busybox --restart=Never --tty -i --generator=run-pod/v1 --env "POD_IP=$(kubectl get pod nginx -o go-template='{{.status.podIP}}')"
u@busybox$ wget -qO- http://$POD_IP # Run in the busybox container
u@busybox$ exit # Exit the busybox container
$ kubectl delete pod busybox # Clean up the pod we created with "kubectl run"
{% endraw %}
```

通过名称删除 pod ：

```shell
$ kubectl delete pod nginx
```

<!--
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
    # name must match the volume name below
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
-->

#### Volumes

上面是针对一个简单的静态服务器的最佳实践。 但是如果需要持久化储存呢？

容器的文件系统的生命周期和容器的生命周期是一致的。 因此如果你的应用状态需要在迁移， 重启， 崩溃后能够恢复，您就必须配置持久化存储。 

在这个例子里， 我们创建了一个带有命名过的存储卷的Redis pod ， For this example we'll be creating a Redis pod with a named volume and volume mount that defines the path to mount the volume.

1. Define a volume:

```yaml
volumes:
    - name: redis-persistent-storage
      emptyDir: {}
```

2. Define a volume mount within a container definition:

```yaml
volumeMounts:
    # name must match the volume name below
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

<!--
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
-->
<!--
## What's Next?

Continue on to [Kubernetes 201](/docs/user-guide/walkthrough/k8s201) or
for a complete application see the [guestbook example](https://github.com/kubernetes/kubernetes/tree/{{page.githubbranch}}/examples/guestbook/)
-->