---
title: 获取正在运行容器的 Shell
content_type: task
---

<!-- overview -->

<!--
This page shows how to use `kubectl exec` to get a shell to a
running container.
-->
本文介绍怎样使用 `kubectl exec` 命令获取正在运行容器的 Shell。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

<!--
## Getting a shell to a Container
-->
## 获取容器的 Shell

<!--
In this exercise, you create a Pod that has one container. The container
runs the nginx image. Here is the configuration file for the Pod:
-->
在本练习中，你将创建包含一个容器的 Pod。容器运行 nginx 镜像。下面是 Pod 的配置文件：

{{% code_sample file="application/shell-demo.yaml" %}}

<!--
Create the Pod:
-->
创建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/application/shell-demo.yaml
```

<!--
Verify that the container is running:
-->
检查容器是否运行正常：

```shell
kubectl get pod shell-demo
```

<!--
Get a shell to the running container:
-->
获取正在运行容器的 Shell：

```shell
kubectl exec --stdin --tty shell-demo -- /bin/bash
```

{{< note >}}

<!--
The double dash (`--`) separates the arguments you want to pass to the command from the kubectl arguments.
-->
双破折号 "--" 用于将要传递给命令的参数与 kubectl 的参数分开。
{{< /note >}}

<!--
In your shell, list the root directory:
-->
在 shell 中，打印根目录：

```shell
# 在容器内运行如下命令
ls /
```

<!--
In your shell, experiment with other commands. Here are
some examples:
-->
在 shell 中，实验其他命令。下面是一些示例：

```shell
# 你可以在容器中运行这些示例命令
ls /
cat /proc/mounts
cat /proc/1/maps
apt-get update
apt-get install -y tcpdump
tcpdump
apt-get install -y lsof
lsof
apt-get install -y procps
ps aux
ps aux | grep nginx
```

<!--
## Writing the root page for nginx
-->
## 编写 nginx 的根页面

<!--
Look again at the configuration file for your Pod. The Pod
has an `emptyDir` volume, and the container mounts the volume
at `/usr/share/nginx/html`.
-->
再看一下 Pod 的配置文件。该 Pod 有个 `emptyDir` 卷，容器将该卷挂载到了 `/usr/share/nginx/html`。

<!--
In your shell, create an `index.html` file in the `/usr/share/nginx/html`
directory:
-->
在 shell 中，在 `/usr/share/nginx/html` 目录创建一个 `index.html` 文件：

```shell
# 在容器内运行如下命令
echo 'Hello shell demo' > /usr/share/nginx/html/index.html
```

<!--
In your shell, send a GET request to the nginx server:
-->
在 shell 中，向 nginx 服务器发送 GET 请求：

```shell
# 在容器内运行如下命令
apt-get update
apt-get install curl
curl http://localhost/
```

<!--
The output shows the text that you wrote to the `index.html` file:
-->
输出结果显示了你在 `index.html` 中写入的文本。

```shell
Hello shell demo
```

<!--
When you are finished with your shell, enter `exit`.
-->
当用完 shell 后，输入 `exit` 退出。

```shell
exit # 快速退出容器内的 Shell
```

<!--
## Running individual commands in a Container
-->
## 在容器中运行单个命令

<!--
In an ordinary command window, not your shell, list the environment
variables in the running container:
-->
在普通的命令窗口（而不是 shell）中，打印环境运行容器中的变量：

```shell
kubectl exec shell-demo -- env
```

<!--
Experiment with running other commands. Here are some examples:
-->
实验运行其他命令。下面是一些示例：

```shell
kubectl exec shell-demo -- ps aux
kubectl exec shell-demo -- ls /
kubectl exec shell-demo -- cat /proc/1/mounts
```

<!-- discussion -->

<!--
## Opening a shell when a Pod has more than one Container
-->
## 当 Pod 包含多个容器时打开 shell

<!--
If a Pod has more than one container, use `--container` or `-c` to
specify a container in the `kubectl exec` command. For example,
suppose you have a Pod named my-pod, and the Pod has two containers
named _main-app_ and _helper-app_. The following command would open a
shell to the _main-app_ container.
-->
如果 Pod 有多个容器，`--container` 或者 `-c` 可以在 `kubectl exec` 命令中指定容器。
例如，你有个名为 my-pod 的 Pod，该 Pod 有两个容器分别为 **main-app** 和 **healper-app**。
下面的命令将会打开一个 shell 访问 **main-app** 容器。

```shell
kubectl exec -i -t my-pod --container main-app -- /bin/bash
```

{{< note >}}
<!--
The short options `-i` and `-t` are the same as the long options `--stdin` and `--tty`
-->
短的命令参数 `-i` 和 `-t` 与长的命令参数 `--stdin` 和 `--tty` 作用相同。
{{< /note >}}

## {{% heading "whatsnext" %}}

<!--
* Read about [kubectl exec](/docs/reference/generated/kubectl/kubectl-commands/#exec)
-->
* 阅读 [kubectl exec](/docs/reference/generated/kubectl/kubectl-commands/#exec)。

