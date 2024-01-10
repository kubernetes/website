---
title: 配置 Pod 初始化
content_type: task
weight: 170
---

<!--
title: Configure Pod Initialization
content_type: task
weight: 170
-->

<!-- overview -->
<!--
This page shows how to use an Init Container to initialize a Pod before an
application Container runs.
-->
本文介绍在应用容器运行前，怎样利用 Init 容器初始化 Pod。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

<!--
## Create a Pod that has an Init Container

In this exercise you create a Pod that has one application Container and one
Init Container. The init container runs to completion before the application
container starts.

Here is the configuration file for the Pod:
-->
## 创建一个包含 Init 容器的 Pod  {#create-a-pod-that-has-an-init-container}

本例中你将创建一个包含一个应用容器和一个 Init 容器的 Pod。Init 容器在应用容器启动前运行完成。

下面是 Pod 的配置文件：

{{% code_sample file="pods/init-containers.yaml" %}}

<!--
In the configuration file, you can see that the Pod has a Volume that the init
container and the application container share.

The init container mounts the
shared Volume at `/work-dir`, and the application container mounts the shared
Volume at `/usr/share/nginx/html`. The init container runs the following command
and then terminates:
-->
配置文件中，你可以看到应用容器和 Init 容器共享了一个卷。

Init 容器将共享卷挂载到了 `/work-dir` 目录，应用容器将共享卷挂载到了 `/usr/share/nginx/html` 目录。
Init 容器执行完下面的命令就终止：

```shell
wget -O /work-dir/index.html http://info.cern.ch
```

<!--
Notice that the init container writes the `index.html` file in the root directory
of the nginx server.

Create the Pod:
-->
请注意 Init 容器在 nginx 服务器的根目录写入 `index.html`。

创建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/pods/init-containers.yaml
```

<!--
Verify that the nginx container is running:
-->
检查 nginx 容器运行正常：

```shell
kubectl get pod init-demo
```

<!--
The output shows that the nginx container is running:
-->
结果表明 nginx 容器运行正常：

```
NAME        READY     STATUS    RESTARTS   AGE
init-demo   1/1       Running   0          1m
```

<!--
Get a shell into the nginx container running in the init-demo Pod:
-->
通过 shell 进入 init-demo Pod 中的 nginx 容器：

```shell
kubectl exec -it init-demo -- /bin/bash
```

<!--
In your shell, send a GET request to the nginx server:
-->

在 shell 中，发送个 GET 请求到 nginx 服务器：

```
root@nginx:~# apt-get update
root@nginx:~# apt-get install curl
root@nginx:~# curl localhost
```

<!--
The output shows that nginx is serving the web page that was written by the init container:
-->
结果表明 nginx 正在为 Init 容器编写的 web 页面服务：

```
<html><head></head><body><header>
<title>http://info.cern.ch</title>
</header>

<h1>http://info.cern.ch - home of the first website</h1>
  ...
<li><a href="http://info.cern.ch/hypertext/WWW/TheProject.html">Browse the first website</a></li>
  ...
```

## {{% heading "whatsnext" %}}

<!--
* Learn more about
  [communicating between Containers running in the same Pod](/docs/tasks/access-application-cluster/communicate-containers-same-pod-shared-volume/).
* Learn more about [Init Containers](/docs/concepts/workloads/pods/init-containers/).
* Learn more about [Volumes](/docs/concepts/storage/volumes/).
* Learn more about [Debugging Init Containers](/docs/tasks/debug/debug-application/debug-init-containers/)
-->

* 进一步了解[同一 Pod 中的容器间的通信](/zh-cn/docs/tasks/access-application-cluster/communicate-containers-same-pod-shared-volume/)。
* 进一步了解 [Init 容器](/zh-cn/docs/concepts/workloads/pods/init-containers/)。
* 进一步了解[卷](/zh-cn/docs/concepts/storage/volumes/)。
* 进一步了解 [Init 容器排错](/zh-cn/docs/tasks/debug/debug-application/debug-init-containers/)。
