---
title: 獲取正在運行容器的 Shell
content_type: task
---

<!-- overview -->

<!--
This page shows how to use `kubectl exec` to get a shell to a
running container.
-->
本文介紹怎樣使用 `kubectl exec` 命令獲取正在運行容器的 Shell。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

<!--
## Getting a shell to a Container
-->
## 獲取容器的 Shell

<!--
In this exercise, you create a Pod that has one container. The container
runs the nginx image. Here is the configuration file for the Pod:
-->
在本練習中，你將創建包含一個容器的 Pod。容器運行 nginx 映像檔。下面是 Pod 的設定文件：

{{% code_sample file="application/shell-demo.yaml" %}}

<!--
Create the Pod:
-->
創建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/application/shell-demo.yaml
```

<!--
Verify that the container is running:
-->
檢查容器是否運行正常：

```shell
kubectl get pod shell-demo
```

<!--
Get a shell to the running container:
-->
獲取正在運行容器的 Shell：

```shell
kubectl exec --stdin --tty shell-demo -- /bin/bash
```

{{< note >}}

<!--
The double dash (`--`) separates the arguments you want to pass to the command from the kubectl arguments.
-->
雙破折號 "--" 用於將要傳遞給命令的參數與 kubectl 的參數分開。
{{< /note >}}

<!--
In your shell, list the root directory:
-->
在 shell 中，打印根目錄：

```shell
# 在容器內運行如下命令
ls /
```

<!--
In your shell, experiment with other commands. Here are
some examples:
-->
在 shell 中，實驗其他命令。下面是一些示例：

```shell
# 你可以在容器中運行這些示例命令
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
## 編寫 nginx 的根頁面

<!--
Look again at the configuration file for your Pod. The Pod
has an `emptyDir` volume, and the container mounts the volume
at `/usr/share/nginx/html`.
-->
再看一下 Pod 的設定文件。該 Pod 有個 `emptyDir` 卷，容器將該卷掛載到了 `/usr/share/nginx/html`。

<!--
In your shell, create an `index.html` file in the `/usr/share/nginx/html`
directory:
-->
在 shell 中，在 `/usr/share/nginx/html` 目錄創建一個 `index.html` 文件：

```shell
# 在容器內運行如下命令
echo 'Hello shell demo' > /usr/share/nginx/html/index.html
```

<!--
In your shell, send a GET request to the nginx server:
-->
在 shell 中，向 nginx 伺服器發送 GET 請求：

```shell
# 在容器內運行如下命令
apt-get update
apt-get install curl
curl http://localhost/
```

<!--
The output shows the text that you wrote to the `index.html` file:
-->
輸出結果顯示了你在 `index.html` 中寫入的文本。

```shell
Hello shell demo
```

<!--
When you are finished with your shell, enter `exit`.
-->
當用完 shell 後，輸入 `exit` 退出。

```shell
exit # 快速退出容器內的 Shell
```

<!--
## Running individual commands in a Container
-->
## 在容器中運行單個命令

<!--
In an ordinary command window, not your shell, list the environment
variables in the running container:
-->
在普通的命令窗口（而不是 shell）中，打印環境運行容器中的變量：

```shell
kubectl exec shell-demo -- env
```

<!--
Experiment with running other commands. Here are some examples:
-->
實驗運行其他命令。下面是一些示例：

```shell
kubectl exec shell-demo -- ps aux
kubectl exec shell-demo -- ls /
kubectl exec shell-demo -- cat /proc/1/mounts
```

<!-- discussion -->

<!--
## Opening a shell when a Pod has more than one Container
-->
## 當 Pod 包含多個容器時打開 shell

<!--
If a Pod has more than one container, use `--container` or `-c` to
specify a container in the `kubectl exec` command. For example,
suppose you have a Pod named my-pod, and the Pod has two containers
named _main-app_ and _helper-app_. The following command would open a
shell to the _main-app_ container.
-->
如果 Pod 有多個容器，`--container` 或者 `-c` 可以在 `kubectl exec` 命令中指定容器。
例如，你有個名爲 my-pod 的 Pod，該 Pod 有兩個容器分別爲 **main-app** 和 **healper-app**。
下面的命令將會打開一個 shell 訪問 **main-app** 容器。

```shell
kubectl exec -i -t my-pod --container main-app -- /bin/bash
```

{{< note >}}
<!--
The short options `-i` and `-t` are the same as the long options `--stdin` and `--tty`
-->
短的命令參數 `-i` 和 `-t` 與長的命令參數 `--stdin` 和 `--tty` 作用相同。
{{< /note >}}

## {{% heading "whatsnext" %}}

<!--
* Read about [kubectl exec](/docs/reference/generated/kubectl/kubectl-commands/#exec)
-->
* 閱讀 [kubectl exec](/docs/reference/generated/kubectl/kubectl-commands/#exec)。

