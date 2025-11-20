---
title: 同 Pod 內的容器使用共享卷通信
content_type: task
weight: 120
---
<!--
title: Communicate Between Containers in the Same Pod Using a Shared Volume
content_type: task
weight: 120
-->
<!-- overview -->

<!--
This page shows how to use a Volume to communicate between two Containers running
in the same Pod. See also how to allow processes to communicate by
[sharing process namespace](/docs/tasks/configure-pod-container/share-process-namespace/)
between containers.
-->
本文旨在說明如何讓一個 Pod 內的兩個容器使用一個卷（Volume）進行通信。
參閱如何讓兩個進程跨容器通過
[共享進程名字空間](/zh-cn/docs/tasks/configure-pod-container/share-process-namespace/)。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

<!--
##  Creating a Pod that runs two Containers

In this exercise, you create a Pod that runs two Containers. The two containers
share a Volume that they can use to communicate. Here is the configuration file
for the Pod:
-->
## 創建一個包含兩個容器的 Pod   {#creating-a-pod-that-runs-two-containers}

在這個練習中，你會創建一個包含兩個容器的 Pod。兩個容器共享一個卷用於他們之間的通信。
Pod 的設定檔案如下：

{{% code_sample file="pods/two-container-pod.yaml" %}}

<!--
In the configuration file, you can see that the Pod has a Volume named
`shared-data`.

The first container listed in the configuration file runs an nginx server. The
mount path for the shared Volume is `/usr/share/nginx/html`.
The second container is based on the debian image, and has a mount path of
`/pod-data`. The second container runs the following command and then terminates.
-->
在設定檔案中，你可以看到 Pod 有一個共享卷，名爲 `shared-data`。

設定檔案中的第一個容器運行了一個 nginx 伺服器。共享卷的掛載路徑是 `/usr/share/nginx/html`。
第二個容器是基於 debian 映像檔的，有一個 `/pod-data` 的掛載路徑。第二個容器運行了下面的命令然後終止。

```shell
echo Hello from the debian container > /pod-data/index.html
```

<!--
Notice that the second container writes the `index.html` file in the root
directory of the nginx server.

Create the Pod and the two Containers:
-->
注意，第二個容器在 nginx 伺服器的根目錄下寫了 `index.html` 檔案。

創建一個包含兩個容器的 Pod：

```shell
kubectl apply -f https://k8s.io/examples/pods/two-container-pod.yaml
```

<!--
View information about the Pod and the Containers:
-->
查看 Pod 和容器的資訊：

```shell
kubectl get pod two-containers --output=yaml
```

<!--
Here is a portion of the output:
-->
這是輸出的一部分：

```yaml
apiVersion: v1
kind: Pod
metadata:
  ...
  name: two-containers
  namespace: default
  ...
spec:
  ...
  containerStatuses:

  - containerID: docker://c1d8abd1 ...
    image: debian
    ...
    lastState:
      terminated:
        ...
    name: debian-container
    ...

  - containerID: docker://96c1ff2c5bb ...
    image: nginx
    ...
    name: nginx-container
    ...
    state:
      running:
    ...
```

<!--
You can see that the debian Container has terminated, and the nginx Container
is still running.

Get a shell to nginx Container:
-->
你可以看到 debian 容器已經被終止了，而 nginx 伺服器依然在運行。

進入 nginx 容器的 shell：

```shell
kubectl exec -it two-containers -c nginx-container -- /bin/bash
```

<!--
In your shell, verify that nginx is running:
-->
在 shell 中，確認 nginx 還在運行。

```
root@two-containers:/# apt-get update
root@two-containers:/# apt-get install curl procps
root@two-containers:/# ps aux
```

<!--
The output is similar to this:
-->
輸出類似於這樣：

```
USER       PID  ...  STAT START   TIME COMMAND
root         1  ...  Ss   21:12   0:00 nginx: master process nginx -g daemon off;
```

<!--
Recall that the debian Container created the `index.html` file in the nginx root
directory. Use `curl` to send a GET request to the nginx server:
-->
回憶一下，debian 容器在 nginx 的根目錄下創建了 `index.html` 檔案。
使用 `curl` 向 nginx 伺服器發送一個 GET 請求：

```
root@two-containers:/# curl localhost
```

<!--
The output shows that nginx serves a web page written by the debian container:
-->
輸出表示 nginx 向外提供了 debian 容器所寫就的頁面：

```
Hello from the debian container
```
<!-- discussion -->

<!--
## Discussion

The primary reason that Pods can have multiple containers is to support
helper applications that assist a primary application. Typical examples of
helper applications are data pullers, data pushers, and proxies.
Helper and primary applications often need to communicate with each other.
Typically this is done through a shared filesystem, as shown in this exercise,
or through the loopback network interface, localhost. An example of this pattern is a
web server along with a helper program that polls a Git repository for new updates.
-->
## 討論   {#discussion}

Pod 能有多個容器的主要原因是爲了支持輔助應用（helper applications），以協助主應用（primary application）。
輔助應用的典型例子是資料抽取，資料推送和代理。輔助應用和主應用經常需要相互通信。
就如這個練習所示，通信通常是通過共享檔案系統完成的，或者，也通過迴環網路介面 localhost 完成。
舉個網路介面的例子，web 伺服器帶有一個協助程式用於拉取 Git 倉庫的更新。

<!--
The Volume in this exercise provides a way for Containers to communicate during
the life of the Pod. If the Pod is deleted and recreated, any data stored in
the shared Volume is lost.
-->
在本練習中的卷爲 Pod 生命週期中的容器相互通信提供了一種方法。如果 Pod 被刪除或者重建了，
任何共享卷中的資料都會丟失。

## {{% heading "whatsnext" %}}

<!--
* Learn more about [patterns for composite containers](/blog/2015/06/the-distributed-system-toolkit-patterns/).
* Learn about [composite containers for modular architecture](https://www.slideshare.net/Docker/slideshare-burns).
* See [Configuring a Pod to Use a Volume for Storage](/docs/tasks/configure-pod-container/configure-volume-storage/).
* See [Configure a Pod to share process namespace between containers in a Pod](/docs/tasks/configure-pod-container/share-process-namespace/)
* See [Volume](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#volume-v1-core).
* See [Pod](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#pod-v1-core).
-->
* 進一步瞭解[複合容器的模式](/blog/2015/06/the-distributed-system-toolkit-patterns/)
* 學習[模塊化架構中的複合容器](https://www.slideshare.net/Docker/slideshare-burns)
* 參見[設定 Pod 使用捲來儲存資料](/zh-cn/docs/tasks/configure-pod-container/configure-volume-storage/)
* 參考[在 Pod 中的容器之間共享進程命名空間](/zh-cn/docs/tasks/configure-pod-container/share-process-namespace/)
* 參考 [Volume](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#volume-v1-core)
* 參考 [Pod](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#pod-v1-core)
