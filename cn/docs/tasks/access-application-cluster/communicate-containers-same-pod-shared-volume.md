---
title: 同 Pod 内的容器使用共享卷通信
redirect_from:
- "/docs/user-guide/pods/multi-container/"
- "/docs/user-guide/pods/multi-container.html"
- "/docs/tasks/configure-pod-container/communicate-containers-same-pod/"
- "/docs/tasks/configure-pod-container/communicate-containers-same-pod.html"
---
<!--
---
title: Communicate Between Containers in the Same Pod Using a Shared Volume
redirect_from:
- "/docs/user-guide/pods/multi-container/"
- "/docs/user-guide/pods/multi-container.html"
- "docs/tasks/configure-pod-container/communicate-containers-same-pod/"
- "docs/tasks/configure-pod-container/communicate-containers-same-pod.html"
---
-->

{% capture overview %}

<!-- This page shows how to use a Volume to communicate between two Containers running
in the same Pod. -->
本文旨在说明如何让一个 Pod 内的两个容器使用一个卷（Volume）进行通信。

{% endcapture %}


{% capture prerequisites %}

{% include task-tutorial-prereqs.md %}

{% endcapture %}


{% capture steps %}

<!-- ##  Creating a Pod that runs two Containers -->
## 创建一个包含两个容器的 Pod

<!-- In this exercise, you create a Pod that runs two Containers. The two containers
share a Volume that they can use to communicate. Here is the configuration file
for the Pod: -->
在这个练习中，你会创建一个包含两个容器的 Pod。两个容器共享一个卷用于他们之间的通信。
Pod 的配置文件如下：

{% include code.html language="yaml" file="two-container-pod.yaml" ghlink="/docs/tasks/access-application-cluster/two-container-pod.yaml" %}

<!-- In the configuration file, you can see that the Pod has a Volume named
`shared-data`. -->
在配置文件中，你可以看到 Pod 有一个共享卷，名为 `shared-data`。

<!-- The first container listed in the configuration file runs an nginx server. The
mount path for the shared Volume is `/usr/share/nginx/html`.
The second container is based on the debian image, and has a mount path of
`/pod-data`. The second container runs the following command and then terminates.
配置文件中的第一个容器运行了一个 nginx 服务器。共享卷的挂载路径是 `/usr/share/nginx/html`。 -->
第二个容器是基于 debian 镜像的，有一个 `/pod-data` 的挂载路径。第二个容器运行了下面的命令然后终止。

    echo Hello from the debian container > /pod-data/index.html

<!-- Notice that the second container writes the `index.html` file in the root
directory of the nginx server. -->
注意，第二个容器在 nginx 服务器的根目录下写了 `index.html` 文件。

<!-- Create the Pod and the two Containers: -->
创建一个包含两个容器的 Pod：

    kubectl create -f https://k8s.io/docs/tasks/access-application-cluster/two-container-pod.yaml

<!-- View information about the Pod and the Containers: -->
查看 Pod 和容器的信息：

    kubectl get pod two-containers --output=yaml

<!-- Here is a portion of the output: -->
这是输出的一部分：

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

<!-- You can see that the debian Container has terminated, and the nginx Container
is still running. -->
你可以看到 debian 容器已经被终止了，而 nginx 服务器依然在运行。

<!-- Get a shell to nginx Container: -->
进入 nginx 容器的 shell：

    kubectl exec -it two-containers -c nginx-container -- /bin/bash

<!-- In your shell, verify that nginx is running: -->
在 shell 中，确认 nginx 还在运行。

    root@two-containers:/# ps aux

<!-- The output is similar to this: -->
输出类似于这样：

    USER       PID  ...  STAT START   TIME COMMAND
    root         1  ...  Ss   21:12   0:00 nginx: master process nginx -g daemon off;

<!-- Recall that the debian Container created the `index.html` file in the nginx root
directory. Use `curl` to send a GET request to the nginx server: -->
回忆一下，debian 容器在 nginx 的根目录下创建了 `index.html` 文件。
使用 `curl` 向 nginx 服务器发送一个 GET 请求：

    root@two-containers:/# apt-get update
    root@two-containers:/# apt-get install curl
    root@two-containers:/# curl localhost

<!-- The output shows that nginx serves a web page written by the debian container: -->
输出表示 nginx 提供了 debian 容器写的页面：

    Hello from the debian container

{% endcapture %}


{% capture discussion %}

<!-- ## Discussion -->
## 讨论

<!-- The primary reason that Pods can have multiple containers is to support
helper applications that assist a primary application. Typical examples of
helper applications are data pullers, data pushers, and proxies.
Helper and primary applications often need to communicate with each other.
Typically this is done through a shared filesystem, as shown in this exercise,
or through the loopback network interface, localhost. An example of this pattern is a
web server along with a helper program that polls a Git repository for new updates. -->
Pod 能有多个容器的主要原因是为了支持辅助应用（helper applications），以协助主应用（primary application）。
辅助应用的典型例子是数据抽取，数据推送和代理。辅助应用和主应用经常需要相互通信。
就如这个练习所示，通信通常是通过共享文件系统完成的，或者，也通过回环网络接口 localhost 完成。
举个网络接口的例子，web 服务器带有一个协助程序用于拉取 Git 仓库的更新。

<!-- The Volume in this exercise provides a way for Containers to communicate during
the life of the Pod. If the Pod is deleted and recreated, any data stored in
the shared Volume is lost. -->
在本练习中的卷为 Pod 生命周期中的容器相互通信提供了一种方法。如果 Pod 被删除或者重建了，
任何共享卷中的数据都会丢失。

{% endcapture %}


{% capture whatsnext %}

<!-- * Learn more about
[patterns for composite containers](http://blog.kubernetes.io/2015/06/the-distributed-system-toolkit-patterns.html). -->
* 更多学习内容
[混合容器的方式](http://blog.kubernetes.io/2015/06/the-distributed-system-toolkit-patterns.html)。

<!-- * Learn about
[composite containers for modular architecture](http://www.slideshare.net/Docker/slideshare-burns). -->
* 学习 [模块化架构的混合容器](http://www.slideshare.net/Docker/slideshare-burns)。

<!-- * See
[Configuring a Pod to Use a Volume for Storage](/docs/tasks/configure-pod-container/configure-volume-storage/). -->
* 参见 [配置一个使用存储卷的 Pod](/docs/tasks/configure-pod-container/configure-volume-storage/)。

<!-- * See [Volume](/docs/api-reference/v1.6/#volume-v1-core). -->
* 参见 [卷](/docs/api-reference/{{page.version}}/#volume-v1-core)。

<!-- * See [Pod](/docs/api-reference/v1.6/#pod-v1-core). -->
* 参见 [Pod](/docs/api-reference/{{page.version}}/#pod-v1-core).

{% endcapture %}


{% include templates/task.md %}
