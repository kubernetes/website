---
approvers:
- caesarxuchao
- mikedanese
title: 获取一个运行容器的 Shell
---

<!--
title: Get a Shell to a Running Container
-->

{% capture overview %}

<!--
This page shows how to use `kubectl exec` to get a shell to a
running Container.
-->

本页面展示如何通过 `kubectl exec` 获取一个运行容器的 Shell

{% endcapture %}


{% capture prerequisites %}

{% include task-tutorial-prereqs.md %}

{% endcapture %}


{% capture steps %}

<!--
## Getting a shell to a Container

In this exercise, you create a Pod that has one Container. The Container
runs the nginx image. Here is the configuration file for the Pod:
-->

## 获取容器的 Shell

在这个练习中，创建只有一个容器的 Pod，容器中运行 nginx 镜像。如下是 Pod  的配置文件：

{% include code.html language="yaml" file="shell-demo.yaml" ghlink="/docs/tasks/debug-application-cluster/shell-demo.yaml" %}

<!--
Create the Pod:
-->

创建 Pod ：

```shell
kubectl create -f https://k8s.io/docs/tasks/debug-application-cluster/shell-demo.yaml
```

<!--
Verify that the Container is running:
-->

验证容器正在运行：

```shell
kubectl get pod shell-demo
```

<!--
Get a shell to the running Container:
-->

获取运行容器的 Shell ：

```shell
kubectl exec -it shell-demo -- /bin/bash
```

<!--
In your shell, list the running processes:
-->

在 shell 中列出正在运行的进程：

```shell
root@shell-demo:/# ps aux
```

<!--
In your shell, list the nginx processes:
-->

在 shell 中，列出 nginx 进程：

```shell
root@shell-demo:/# ps aux | grep nginx
```

<!--
In your shell, experiment with other commands. Here are
some examples:
-->

在 shell 中，尝试其它命令。例如：

```shell
root@shell-demo:/# ls /
root@shell-demo:/# cat /proc/mounts
root@shell-demo:/# cat /proc/1/maps
root@shell-demo:/# apt-get update
root@shell-demo:/# apt-get install tcpdump
root@shell-demo:/# tcpdump
root@shell-demo:/# apt-get install lsof
root@shell-demo:/# lsof
```

<!--
## Writing the root page for nginx

Look again at the configuration file for your Pod. The Pod
has an `emptyDir` volume, and the Container mounts the volume
at `/usr/share/nginx/html`.
-->

## 编辑 nginx 的主页

再次查看 Pod 的配置文件。 Pod 有一个 `emptyDir` 卷，挂载在容器的 `/usr/share/nginx/html`。

<!--
In your shell, create an `index.html` file in the `/usr/share/nginx/html`
directory:
-->

在 shell 中，在 `/usr/share/nginx/html` 目录下创建 `index.html` 文件：

```shell
root@shell-demo:/# echo Hello shell demo > /usr/share/nginx/html/index.html
```

<!--
In your shell, send a GET request to the nginx server:
-->

在 shell 中，发送 GET 请求到 nginx 服务器：

```shell
root@shell-demo:/# apt-get update
root@shell-demo:/# apt-get install curl
root@shell-demo:/# curl localhost
```

<!--
The output shows the text that you wrote to the `index.html` file:
-->

输出的正是 `index.html` 文件中的内容：

```shell
Hello shell demo
```

<!--
When you are finished with your shell, enter `exit`.
-->

当完成工作后，可以通过输入 `exit` 退出 shell 。

<!--
## Running individual commands in a Container

In an ordinary command window, not your shell, list the environment
variables in the running Container:
-->

## 在容器中运行单个命令

在普通的命令窗口中(而不是容器中的 shell ) ，列出运行容器中的环境变量：

```shell
kubectl exec shell-demo env
```

<!--
Experiment running other commands. Here are some examples:
-->

尝试运行其它命令。例如：

```shell
kubectl exec shell-demo ps aux
kubectl exec shell-demo ls /
kubectl exec shell-demo cat /proc/1/mounts
```

{% endcapture %}

{% capture discussion %}

<!--
## Opening a shell when a Pod has more than one Container

If a Pod has more than one Container, use `--container` or `-c` to
specify a Container in the `kubectl exec` command. For example,
suppose you have a Pod named my-pod, and the Pod has two containers
named main-app and helper-app. The following command would open a
shell to the main-app Container.
-->

## 当 Pod 中有多个容器时打开一个 shell

如果 Pod 中有多个容器，使用 `--container` 或 `-c` 在 `kubectl exec` 命令中指定一个容器。例如，假设你有一个 Pod 叫 my-pod ，并且这个 Pod 中有两个容器，分别叫做 main-app 和 helper-app 。下面的命令将会打开 main-app 容器的 shell 。

```shell
kubectl exec -it my-pod --container main-app -- /bin/bash
```

{% endcapture %}


{% capture whatsnext %}

* [kubectl exec](/docs/user-guide/kubectl/v1.6/#exec)

{% endcapture %}


{% include templates/task.md %}
