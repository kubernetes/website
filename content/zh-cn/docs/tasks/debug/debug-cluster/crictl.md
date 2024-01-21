---
title: 使用 crictl 对 Kubernetes 节点进行调试
content_type: task
weight: 30
---
<!--
reviewers:
- Random-Liu
- feiskyer
- mrunalp
title: Debugging Kubernetes nodes with crictl
content_type: task
weight: 30
-->

<!-- overview -->

{{< feature-state for_k8s_version="v1.11" state="stable" >}}

<!--
`crictl` is a command-line interface for CRI-compatible container runtimes.
You can use it to inspect and debug container runtimes and applications on a
Kubernetes node. `crictl` and its source are hosted in the
[cri-tools](https://github.com/kubernetes-sigs/cri-tools) repository.
-->
`crictl` 是 CRI 兼容的容器运行时命令行接口。
你可以使用它来检查和调试 Kubernetes 节点上的容器运行时和应用程序。
`crictl` 和它的源代码在
[cri-tools](https://github.com/kubernetes-sigs/cri-tools) 代码库。

## {{% heading "prerequisites" %}}

<!--
`crictl` requires a Linux operating system with a CRI runtime.
-->
`crictl` 需要带有 CRI 运行时的 Linux 操作系统。

<!-- steps -->

<!--
## Installing crictl

You can download a compressed archive `crictl` from the cri-tools
[release page](https://github.com/kubernetes-sigs/cri-tools/releases), for several
different architectures. Download the version that corresponds to your version
of Kubernetes. Extract it and move it to a location on your system path, such as
`/usr/local/bin/`.
-->
## 安装 crictl    {#installing-crictl}

你可以从 cri-tools [发布页面](https://github.com/kubernetes-sigs/cri-tools/releases)
下载一个压缩的 `crictl` 归档文件，用于几种不同的架构。
下载与你的 kubernetes 版本相对应的版本。
提取它并将其移动到系统路径上的某个位置，例如 `/usr/local/bin/`。

<!--
## General usage

The `crictl` command has several subcommands and runtime flags. Use
`crictl help` or `crictl <subcommand> help` for more details.
-->
## 一般用法    {#general-usage}

`crictl` 命令有几个子命令和运行时参数。
有关详细信息，请使用 `crictl help` 或 `crictl <subcommand> help` 获取帮助信息。

<!--
You can set the endpoint for `crictl` by doing one of the following:
-->
你可以用以下方法之一来为 `crictl` 设置端点：

<!--
* Set the `--runtime-endpoint` and `--image-endpoint` flags.
* Set the `CONTAINER_RUNTIME_ENDPOINT` and `IMAGE_SERVICE_ENDPOINT` environment
  variables.
* Set the endpoint in the configuration file `/etc/crictl.yaml`. To specify a
  different file, use the `--config=PATH_TO_FILE` flag when you run `crictl`.
-->
- 设置参数 `--runtime-endpoint` 和 `--image-endpoint`。
- 设置环境变量 `CONTAINER_RUNTIME_ENDPOINT` 和 `IMAGE_SERVICE_ENDPOINT`。
- 在配置文件 `--config=/etc/crictl.yaml` 中设置端点。
  要设置不同的文件，可以在运行 `crictl` 时使用 `--config=PATH_TO_FILE` 标志。

{{<note>}}
<!--
If you don't set an endpoint, `crictl` attempts to connect to a list of known
endpoints, which might result in an impact to performance.
-->
如果你不设置端点，`crictl` 将尝试连接到已知端点的列表，这可能会影响性能。
{{</note>}}

<!--
You can also specify timeout values when connecting to the server and enable or
disable debugging, by specifying `timeout` or `debug` values in the configuration
file or using the `--timeout` and `--debug` command-line flags.
-->
你还可以在连接到服务器并启用或禁用调试时指定超时值，方法是在配置文件中指定
`timeout` 或 `debug` 值，或者使用 `--timeout` 和 `--debug` 命令行参数。

<!--
To view or edit the current configuration, view or edit the contents of
`/etc/crictl.yaml`. For example, the configuration when using the `containerd`
container runtime would be similar to this:
-->
要查看或编辑当前配置，请查看或编辑 `/etc/crictl.yaml` 的内容。
例如，使用 `containerd` 容器运行时的配置会类似于这样：

```none
runtime-endpoint: unix:///var/run/containerd/containerd.sock
image-endpoint: unix:///var/run/containerd/containerd.sock
timeout: 10
debug: true
```

<!--
To learn more about `crictl`, refer to the [`crictl`
documentation](https://github.com/kubernetes-sigs/cri-tools/blob/master/docs/crictl.md).
-->
要进一步了解 `crictl`，参阅
[`crictl` 文档](https://github.com/kubernetes-sigs/cri-tools/blob/master/docs/crictl.md)。

<!--
## Example crictl commands

The following examples show some `crictl` commands and example output.
-->
## crictl 命令示例    {#example-crictl-commands}

{{< warning >}}
<!--
If you use `crictl` to create pod sandboxes or containers on a running
Kubernetes cluster, the Kubelet will eventually delete them. `crictl` is not a
general purpose workflow tool, but a tool that is useful for debugging.
-->
如果使用 `crictl` 在正在运行的 Kubernetes 集群上创建 Pod 沙盒或容器，
kubelet 最终将删除它们。
`crictl` 不是一个通用的工作流工具，而是一个对调试有用的工具。
{{< /warning >}}

<!--
### List pods

List all pods:
-->
### 打印 Pod 清单    {#list-pods}

打印所有 Pod 的清单：

```shell
crictl pods
```

<!--
The output is similar to this:
-->
输出类似于：

```none
POD ID              CREATED              STATE               NAME                         NAMESPACE           ATTEMPT
926f1b5a1d33a       About a minute ago   Ready               sh-84d7dcf559-4r2gq          default             0
4dccb216c4adb       About a minute ago   Ready               nginx-65899c769f-wv2gp       default             0
a86316e96fa89       17 hours ago         Ready               kube-proxy-gblk4             kube-system         0
919630b8f81f1       17 hours ago         Ready               nvidia-device-plugin-zgbbv   kube-system         0
```

<!--
List pods by name:
-->
根据名称打印 Pod 清单：

```shell
crictl pods --name nginx-65899c769f-wv2gp
```

<!--
The output is similar to this:
-->
输出类似于这样：

```none
POD ID              CREATED             STATE               NAME                     NAMESPACE           ATTEMPT
4dccb216c4adb       2 minutes ago       Ready               nginx-65899c769f-wv2gp   default             0
```

<!--
List pods by label:
-->
根据标签打印 Pod 清单：

```shell
crictl pods --label run=nginx
```

<!--
The output is similar to this:
-->
输出类似于这样：

```none
POD ID              CREATED             STATE               NAME                     NAMESPACE           ATTEMPT
4dccb216c4adb       2 minutes ago       Ready               nginx-65899c769f-wv2gp   default             0
```

<!--
### List images

List all images:
-->
### 打印镜像清单    {#list-containers}

打印所有镜像清单：

```shell
crictl images
```

<!--
The output is similar to this:
-->
输出类似于这样：

```none
IMAGE                                     TAG                 IMAGE ID            SIZE
busybox                                   latest              8c811b4aec35f       1.15MB
k8s-gcrio.azureedge.net/hyperkube-amd64   v1.10.3             e179bbfe5d238       665MB
k8s-gcrio.azureedge.net/pause-amd64       3.1                 da86e6ba6ca19       742kB
nginx                                     latest              cd5239a0906a6       109MB
```

<!--
List images by repository:
-->
根据仓库打印镜像清单：

```shell
crictl images nginx
```

<!--
The output is similar to this:
-->
输出类似于这样：

```none
IMAGE               TAG                 IMAGE ID            SIZE
nginx               latest              cd5239a0906a6       109MB
```

<!--
Only list image IDs:
-->
只打印镜像 ID：

```shell
crictl images -q
```

<!--
The output is similar to this:
-->
输出类似于这样：

```none
sha256:8c811b4aec35f259572d0f79207bc0678df4c736eeec50bc9fec37ed936a472a
sha256:e179bbfe5d238de6069f3b03fccbecc3fb4f2019af741bfff1233c4d7b2970c5
sha256:da86e6ba6ca197bf6bc5e9d900febd906b133eaa4750e6bed647b0fbe50ed43e
sha256:cd5239a0906a6ccf0562354852fae04bc5b52d72a2aff9a871ddb6bd57553569
```

<!--
### List containers

List all containers:
-->
### 打印容器清单    {#list-containers}

打印所有容器清单：

```shell
crictl ps -a
```

<!--
The output is similar to this:
-->
输出类似于这样：

```none
CONTAINER ID        IMAGE                                                                                                             CREATED             STATE               NAME                       ATTEMPT
1f73f2d81bf98       busybox@sha256:141c253bc4c3fd0a201d32dc1f493bcf3fff003b6df416dea4f41046e0f37d47                                   7 minutes ago       Running             sh                         1
9c5951df22c78       busybox@sha256:141c253bc4c3fd0a201d32dc1f493bcf3fff003b6df416dea4f41046e0f37d47                                   8 minutes ago       Exited              sh                         0
87d3992f84f74       nginx@sha256:d0a8828cccb73397acb0073bf34f4d7d8aa315263f1e7806bf8c55d8ac139d5f                                     8 minutes ago       Running             nginx                      0
1941fb4da154f       k8s-gcrio.azureedge.net/hyperkube-amd64@sha256:00d814b1f7763f4ab5be80c58e98140dfc69df107f253d7fdd714b30a714260a   18 hours ago        Running             kube-proxy                 0
```

<!--
List running containers:
-->
打印正在运行的容器清单：

```shell
crictl ps
```

<!--
The output is similar to this:
-->
输出类似于这样：

```none
CONTAINER ID        IMAGE                                                                                                             CREATED             STATE               NAME                       ATTEMPT
1f73f2d81bf98       busybox@sha256:141c253bc4c3fd0a201d32dc1f493bcf3fff003b6df416dea4f41046e0f37d47                                   6 minutes ago       Running             sh                         1
87d3992f84f74       nginx@sha256:d0a8828cccb73397acb0073bf34f4d7d8aa315263f1e7806bf8c55d8ac139d5f                                     7 minutes ago       Running             nginx                      0
1941fb4da154f       k8s-gcrio.azureedge.net/hyperkube-amd64@sha256:00d814b1f7763f4ab5be80c58e98140dfc69df107f253d7fdd714b30a714260a   17 hours ago        Running             kube-proxy                 0
```

<!--
### Execute a command in a running container
-->
### 在正在运行的容器上执行命令    {#execute-a-command-in-a-running-container}

```shell
crictl exec -i -t 1f73f2d81bf98 ls
```

<!--
The output is similar to this:
-->
输出类似于这样：

```none
bin   dev   etc   home  proc  root  sys   tmp   usr   var
```

<!--
### Get a container's logs

Get all container logs:
-->
### 获取容器日志    {#get-a-container-s-logs}

获取容器的所有日志：

```shell
crictl logs 87d3992f84f74
```

<!--
The output is similar to this:
-->
输出类似于这样：

```none
10.240.0.96 - - [06/Jun/2018:02:45:49 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.47.0" "-"
10.240.0.96 - - [06/Jun/2018:02:45:50 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.47.0" "-"
10.240.0.96 - - [06/Jun/2018:02:45:51 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.47.0" "-"
```

<!--
Get only the latest `N` lines of logs:
-->
获取最近的 `N` 行日志：

```shell
crictl logs --tail=1 87d3992f84f74
```

<!--
The output is similar to this:
-->
输出类似于这样：

```none
10.240.0.96 - - [06/Jun/2018:02:45:51 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.47.0" "-"
```

<!--
### Run a pod sandbox

Using `crictl` to run a pod sandbox is useful for debugging container runtimes.
On a running Kubernetes cluster, the sandbox will eventually be stopped and
deleted by the Kubelet.
-->
### 运行 Pod 沙盒    {#run-a-pod-sandbox}

用 `crictl` 运行 Pod 沙盒对容器运行时排错很有帮助。
在运行的 Kubernetes 集群中，沙盒会随机地被 kubelet 停止和删除。

<!--
1. Create a JSON file like the following:
-->
1. 编写下面的 JSON 文件：

   ```json
   {
     "metadata": {
       "name": "nginx-sandbox",
       "namespace": "default",
       "attempt": 1,
       "uid": "hdishd83djaidwnduwk28bcsb"
     },
     "log_directory": "/tmp",
     "linux": {
     }
   }
   ```

<!--
2. Use the `crictl runp` command to apply the JSON and run the sandbox.
-->
2. 使用 `crictl runp` 命令应用 JSON 文件并运行沙盒。

   ```shell
   crictl runp pod-config.json
   ```

   <!--
   The ID of the sandbox is returned.
   -->
   返回了沙盒的 ID。

<!--
### Create a container

Using `crictl` to create a container is useful for debugging container runtimes.
On a running Kubernetes cluster, the container will eventually be stopped and
deleted by the Kubelet.
-->
### 创建容器 {#create-a-container}

用 `crictl` 创建容器对容器运行时排错很有帮助。
在运行的 Kubernetes 集群中，容器最终将被 kubelet 停止和删除。

<!--
1. Pull a busybox image
-->
1. 拉取 busybox 镜像

   ```shell
   crictl pull busybox
   ```
   ```none
   Image is up to date for busybox@sha256:141c253bc4c3fd0a201d32dc1f493bcf3fff003b6df416dea4f41046e0f37d47
   ```

<!--
2. Create configs for the pod and the container:
-->
2. 创建 Pod 和容器的配置：

   <!--
   **Pod config**:
   -->
   **Pod 配置**：

   ```json
   {
     "metadata": {
       "name": "busybox-sandbox",
       "namespace": "default",
       "attempt": 1,
       "uid": "aewi4aeThua7ooShohbo1phoj"
     },
     "log_directory": "/tmp",
     "linux": {
     }
   }
   ```

   <!--
   **Container config**:
   -->
   **容器配置**：

   ```json
   {
     "metadata": {
       "name": "busybox"
     },
     "image":{
       "image": "busybox"
     },
     "command": [
       "top"
     ],
     "log_path":"busybox.log",
     "linux": {
     }
   }
   ```

<!--
3. Create the container, passing the ID of the previously-created pod, the
   container config file, and the pod config file. The ID of the container is
   returned.
-->
3. 创建容器，传递先前创建的 Pod 的 ID、容器配置文件和 Pod 配置文件。返回容器的 ID。

   ```bash
   crictl create f84dd361f8dc51518ed291fbadd6db537b0496536c1d2d6c05ff943ce8c9a54f container-config.json pod-config.json
   ```

<!--
4. List all containers and verify that the newly-created container has its
   state set to `Created`.
-->
4. 查询所有容器并确认新创建的容器状态为 `Created`。

   ```bash
   crictl ps -a
   ```
   <!--
   The output is similar to this:
   -->
   输出类似于这样：

   ```none
   CONTAINER ID        IMAGE               CREATED             STATE               NAME                ATTEMPT
   3e025dd50a72d       busybox             32 seconds ago      Created             busybox             0
   ```

<!--
### Start a container

To start a container, pass its ID to `crictl start`:
-->
### 启动容器 {#start-a-container}

要启动容器，要将容器 ID 传给 `crictl start`：

```shell
crictl start 3e025dd50a72d956c4f14881fbb5b1080c9275674e95fb67f965f6478a957d60
```

<!--
The output is similar to this:
-->
输出类似于这样：

```
3e025dd50a72d956c4f14881fbb5b1080c9275674e95fb67f965f6478a957d60
```

<!--
Check the container has its state set to `Running`.
-->
确认容器的状态为 `Running`。

```shell
crictl ps
```

<!--
The output is similar to this:
-->
输出类似于这样：

```none
CONTAINER ID   IMAGE    CREATED              STATE    NAME     ATTEMPT
3e025dd50a72d  busybox  About a minute ago   Running  busybox  0
```

## {{% heading "whatsnext" %}}

<!--
* [Learn more about `crictl`](https://github.com/kubernetes-sigs/cri-tools).
* [Map `docker` CLI commands to `crictl`](/docs/reference/tools/map-crictl-dockercli/).
-->
* [进一步了解 `crictl`](https://github.com/kubernetes-sigs/cri-tools)
* [将 `docker` CLI 命令映射到 `crictl`](/zh-cn/docs/reference/tools/map-crictl-dockercli/)
