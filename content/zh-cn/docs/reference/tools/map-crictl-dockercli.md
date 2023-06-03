---
title: 从 Docker 命令行映射到 crictl
content_type: reference
weight: 10
---

<!--
title: Mapping from dockercli to crictl
content_type: reference
weight: 10
-->

{{% thirdparty-content %}}

<!--
`crictl` is a command-line interface for {{<glossary_tooltip term_id="cri" text="CRI">}}-compatible container runtimes.
You can use it to inspect and debug container runtimes and applications on a
Kubernetes node. `crictl` and its source are hosted in the
[cri-tools](https://github.com/kubernetes-sigs/cri-tools) repository.
-->
`crictl` 是兼容 {{<glossary_tooltip term_id="cri" text="CRI">}}的容器运行时的一种命令行接口。
你可以使用它来在 Kubernetes 节点上检视和调试容器运行时和应用。
`crictl` 及其源代码都托管在
[cri-tools](https://github.com/kubernetes-sigs/cri-tools) 仓库中。

<!--
This page provides a reference for mapping common commands for the `docker`
command-line tool into the equivalent commands for `crictl`.
-->
本页面提供一份参考资料，用来将 `docker` 命令行工具的常用命令映射到
`crictl` 的等价命令。

<!--
## Mapping from docker CLI to crictl
-->
## 从 docker 命令行映射到 crictl   {#mapping-from-docker-cli-to-crictl}

<!--
The exact versions for the mapping table are for `docker` CLI v1.40 and `crictl`
v1.19.0. This list is not exhaustive. For example, it doesn't include
experimental `docker` CLI commands.
-->
映射表格中列举的确切版本是 `docker` 命令行的 v1.40 版本和 `crictl` 的 v1.19.0 版本。
这一列表不是完备的。例如，其中并未包含实验性质的 `docker` 命令。

{{< note >}}
<!--
The output format of `crictl` is similar to `docker` CLI, despite some missing
columns for some CLI. Make sure to check output for the specific command if your
command output is being parsed programmatically.
-->
`crictl` 的输出格式类似于 `docker` 命令行，只是对于某些命令而言会有部分列缺失。
如果你的命令输出会被程序解析，请确保你认真查看了对应的命令输出。
{{< /note >}}

<!--
### Retrieve debugging information
-->
### 获得调试信息   {#retrieve-debugging-information}

{{< table caption="docker 命令行与 crictl 的映射 - 获得调试信息" >}}
<!--
docker cli | crictl | Description | Unsupported Features
-- | -- | -- | --
`attach` | `attach` | Attach to a running container | `--detach-keys`, `--sig-proxy`
`exec` | `exec` | Run a command in a running container | `--privileged`, `--user`, `--detach-keys`
`images` | `images` | List images |  
`info` | `info` | Display system-wide information |  
`inspect` | `inspect`, `inspecti` | Return low-level information on a container, image or task |  
`logs` | `logs` | Fetch the logs of a container | `--details`
`ps` | `ps` | List containers |  
`stats` | `stats` | Display a live stream of container(s) resource usage statistics | Column: NET/BLOCK I/O, PIDs
`version` | `version` | Show the runtime (Docker, ContainerD, or others) version information |  
-->
docker CLI | crictl | 描述 | 不支持的功能
-- | -- | -- | --
`attach` | `attach` | 挂接到某运行中的容器 | `--detach-keys`, `--sig-proxy`
`exec` | `exec` | 在运行中的容器内执行命令 | `--privileged`, `--user`, `--detach-keys`
`images` | `images` | 列举镜像 |  
`info` | `info` | 显示系统范围的信息 |  
`inspect` | `inspect`, `inspecti` | 返回容器、镜像或任务的底层信息 |  
`logs` | `logs` | 取回容器的日志数据  | `--details`
`ps` | `ps` | 列举容器  |  
`stats` | `stats` | 显示容器资源用量统计的动态数据流 | 列：NET/BLOCK I/O、PIDs
`version` | `version` | 显示运行时（Docker、ContainerD 或其他）的版本信息 | 
{{< /table >}}

<!--
### Perform Changes
-->
### 执行变更    {#perform-changes}

{{< table caption="docker 命令行与 crictl 的映射 - 执行变更" >}}
<!--
docker cli | crictl | Description | Unsupported Features
-- | -- | -- | --
`create` | `create` | Create a new container |  
`kill` | `stop` (timeout = 0) | Kill one or more running container | `--signal`
`pull` | `pull` | Pull an image or a repository from a registry | `--all-tags`, `--disable-content-trust`
`rm` | `rm` | Remove one or more containers |  
`rmi` | `rmi` | Remove one or more images |  
`run` | `run` | Run a command in a new container |  
`start` | `start` | Start one or more stopped containers | `--detach-keys`
`stop` | `stop` | Stop one or more running containers |  
`update` | `update` | Update configuration of one or more containers | `--restart`, `--blkio-weight` and some other resource limit not supported by CRI.
-->
docker CLI | crictl | 描述 | 不支持的功能
-- | -- | -- | --
`create` | `create` | 创建一个新容器 |  
`kill` | `stop` (超时值为 0) | 杀死一个或多个运行中的容器 | `--signal`
`pull` | `pull` | 从某镜像库拉取镜像或仓库 | `--all-tags`, `--disable-content-trust`
`rm` | `rm` | 移除一个或者多个容器 |  
`rmi` | `rmi` | 移除一个或者多个镜像 |  
`run` | `run` | 在一个新的容器中执行命令 |  
`start` | `start` | 启动一个或多个已停止的容器 | `--detach-keys`
`stop` | `stop` | 停止一个或多个运行中的容器 |  
`update` | `update` | 更新一个或多个容器的配置 | `--restart`、`--blkio-weight` 以 CRI 所不支持的资源约束
{{< /table >}}

<!--
### Supported only in crictl
-->
### 仅被 crictl 支持的命令   {#supported-only-in-crictl}

{{< table caption="docker 命令行与 crictl 的映射 - 仅被 crictl 支持的命令" >}}
<!--
crictl | Description
-- | --
`imagefsinfo` | Return image filesystem info
`inspectp` | Display the status of one or more pods
`port-forward` | Forward local port to a pod
`pods` | List pods
`runp` | Run a new pod
`rmp` | Remove one or more pods
`stopp` | Stop one or more running pods
-->
crictl | 描述
-- | --
`imagefsinfo` | 返回镜像文件系统信息
`inspectp` | 显示一个或多个 Pod 的状态
`port-forward` | 将本地端口转发到 Pod
`pods` | 列举 Pod
`runp` | 运行一个新的 Pod
`rmp` | 删除一个或多个 Pod
`stopp` | 停止一个或多个运行中的 Pod
{{< /table >}}
