---
title: 設定 Pod 初始化
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
本文介紹在應用容器運行前，怎樣利用 Init 容器初始化 Pod。

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
## 創建一個包含 Init 容器的 Pod  {#create-a-pod-that-has-an-init-container}

本例中你將創建一個包含一個應用容器和一個 Init 容器的 Pod。Init 容器在應用容器啓動前運行完成。

下面是 Pod 的設定檔案：

{{% code_sample file="pods/init-containers.yaml" %}}

<!--
In the configuration file, you can see that the Pod has a Volume that the init
container and the application container share.

The init container mounts the
shared Volume at `/work-dir`, and the application container mounts the shared
Volume at `/usr/share/nginx/html`. The init container runs the following command
and then terminates:
-->
設定檔案中，你可以看到應用容器和 Init 容器共享了一個卷。

Init 容器將共享卷掛載到了 `/work-dir` 目錄，應用容器將共享卷掛載到了 `/usr/share/nginx/html` 目錄。
Init 容器執行完下面的命令就終止：

```shell
wget -O /work-dir/index.html http://info.cern.ch
```

<!--
Notice that the init container writes the `index.html` file in the root directory
of the nginx server.

Create the Pod:
-->
請注意 Init 容器在 nginx 伺服器的根目錄寫入 `index.html`。

創建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/pods/init-containers.yaml
```

<!--
Verify that the nginx container is running:
-->
檢查 nginx 容器運行正常：

```shell
kubectl get pod init-demo
```

<!--
The output shows that the nginx container is running:
-->
結果表明 nginx 容器運行正常：

```
NAME        READY     STATUS    RESTARTS   AGE
init-demo   1/1       Running   0          1m
```

<!--
Get a shell into the nginx container running in the init-demo Pod:
-->
通過 shell 進入 init-demo Pod 中的 nginx 容器：

```shell
kubectl exec -it init-demo -- /bin/bash
```

<!--
In your shell, send a GET request to the nginx server:
-->

在 shell 中，發送個 GET 請求到 nginx 伺服器：

```
root@nginx:~# apt-get update
root@nginx:~# apt-get install curl
root@nginx:~# curl localhost
```

<!--
The output shows that nginx is serving the web page that was written by the init container:
-->
結果表明 nginx 正在爲 Init 容器編寫的 web 頁面服務：

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

* 進一步瞭解[同一 Pod 中的容器間的通信](/zh-cn/docs/tasks/access-application-cluster/communicate-containers-same-pod-shared-volume/)。
* 進一步瞭解 [Init 容器](/zh-cn/docs/concepts/workloads/pods/init-containers/)。
* 進一步瞭解[卷](/zh-cn/docs/concepts/storage/volumes/)。
* 進一步瞭解 [Init 容器排錯](/zh-cn/docs/tasks/debug/debug-application/debug-init-containers/)。
