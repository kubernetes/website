---
title: 獲取正在執行容器的 Shell
content_type: task
---

<!-- overview -->

<!--
This page shows how to use `kubectl exec` to get a shell to a
running Container.
-->
本文介紹怎樣使用 `kubectl exec` 命令獲取正在執行容器的 Shell。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

<!--
## Getting a shell to a Container
-->
## 獲取容器的 Shell

<!--
In this exercise, you create a Pod that has one Container. The Container
runs the nginx image. Here is the configuration file for the Pod:
-->
在本練習中，你將建立包含一個容器的 Pod。容器執行 nginx 映象。下面是 Pod 的配置檔案：

{{< codenew file="application/shell-demo.yaml" >}}

<!--
Create the Pod:
-->
建立 Pod：

```shell
kubectl create -f https://k8s.io/examples/application/shell-demo.yaml
```

<!--
Verify that the Container is running:
-->
檢查容器是否執行正常：

```shell
kubectl get pod shell-demo
```

<!--
Get a shell to the running Container:
-->
獲取正在執行容器的 Shell：

```shell
kubectl exec -it shell-demo -- /bin/bash
```
{{< note >}}

<!--
The double dash symbol "--" is used to separate the arguments you want to pass to the command from the kubectl arguments.
-->
雙破折號 "--" 用於將要傳遞給命令的引數與 kubectl 的引數分開。
{{< /note >}}

<!--
In your shell, list the root directory:
-->
在 shell 中，列印根目錄：

```shell
root@shell-demo:/# ls /
```

<!--
In your shell, experiment with other commands. Here are
some examples:
-->
在 shell 中，實驗其他命令。下面是一些示例：

```shell
root@shell-demo:/# ls /
root@shell-demo:/# cat /proc/mounts
root@shell-demo:/# cat /proc/1/maps
root@shell-demo:/# apt-get update
root@shell-demo:/# apt-get install -y tcpdump
root@shell-demo:/# tcpdump
root@shell-demo:/# apt-get install -y lsof
root@shell-demo:/# lsof
root@shell-demo:/# apt-get install -y procps
root@shell-demo:/# ps aux
root@shell-demo:/# ps aux | grep nginx
```

<!--
## Writing the root page for nginx
-->
## 編寫 nginx 的根頁面

<!--
Look again at the configuration file for your Pod. The Pod
has an `emptyDir` volume, and the Container mounts the volume
at `/usr/share/nginx/html`.
-->
再看一下 Pod 的配置檔案。該 Pod 有個 `emptyDir` 卷，容器將該卷掛載到了 `/usr/share/nginx/html`。

<!--
In your shell, create an `index.html` file in the `/usr/share/nginx/html`
directory:
-->
在 shell 中，在 `/usr/share/nginx/html` 目錄建立一個 `index.html` 檔案：

```shell
root@shell-demo:/# echo Hello shell demo > /usr/share/nginx/html/index.html
```

<!--
In your shell, send a GET request to the nginx server:
-->
在 shell 中，向 nginx 伺服器傳送 GET 請求：

```shell
root@shell-demo:/# apt-get update
root@shell-demo:/# apt-get install curl
root@shell-demo:/# curl localhost
```

<!--
The output shows the text that you wrote to the `index.html` file:
-->
輸出結果顯示了你在 `index.html` 中寫入的文字。

```shell
Hello shell demo
```

<!--
When you are finished with your shell, enter `exit`.
-->
當用完 shell 後，輸入 `exit` 退出。

<!--
## Running individual commands in a Container
-->
## 在容器中執行單個命令

<!--
In an ordinary command window, not your shell, list the environment
variables in the running Container:
-->
在普通的命令視窗（而不是 shell）中，列印環境執行容器中的變數：

```shell
kubectl exec shell-demo env
```

<!--
Experiment running other commands. Here are some examples:
-->
實驗執行其他命令。下面是一些示例：

```shell
kubectl exec shell-demo ps aux
kubectl exec shell-demo ls /
kubectl exec shell-demo cat /proc/1/mounts
```

<!-- discussion -->

<!--
## Opening a shell when a Pod has more than one Container
-->
## 當 Pod 包含多個容器時開啟 shell

<!--
If a Pod has more than one Container, use `--container` or `-c` to
specify a Container in the `kubectl exec` command. For example,
suppose you have a Pod named my-pod, and the Pod has two containers
named main-app and helper-app. The following command would open a
shell to the main-app Container.
-->
如果 Pod 有多個容器，`--container` 或者 `-c` 可以在 `kubectl exec` 命令中指定容器。
例如，你有個名為 my-pod 的 Pod，該 Pod 有兩個容器分別為 main-app 和 healper-app。
下面的命令將會開啟一個 shell 訪問 main-app 容器。

```shell
kubectl exec -it my-pod --container main-app -- /bin/bash
```

## {{% heading "whatsnext" %}}

* [kubectl exec](/docs/reference/generated/kubectl/kubectl-commands/#exec)
