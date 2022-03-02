---
title: 从dockercli到crictl的映射
content_type: reference
---
<!--
---
title: Mapping from dockercli to crictl
content_type: reference
---
-->
{{% thirdparty-content %}}

<!--
This page is deprecated and will be removed in Kubernetes 1.27.
-->
{{<note>}}
此页面已弃用，将在Kubernetes 1.27中删除。
{{</note>}}

<!--
`crictl` is a command-line interface for {{<glossary_tooltip term_id="cri" text="CRI">}}-compatible container runtimes.
You can use it to inspect and debug container runtimes and applications on a
Kubernetes node. `crictl` and its source are hosted in the
[cri-tools](https://github.com/kubernetes-sigs/cri-tools) repository.
-->
`crictl`是 {{<glossary_tooltip term_id="cri" text="CRI">}}-兼容的容器运行时命令行接口。
你可以使用它来检查和调试Kubernetes节点上的容器运行时和应用程序。
`crictl`及其源码托管于 [cri-tools](https://github.com/kubernetes-sigs/cri-tools)。

<!--
This page provides a reference for mapping common commands for the `docker`
command-line tool into the equivalent commands for `crictl`.
-->
本页提供了将 `docker` 命令行工具的常用命令映射为 `crictl` 的等效命令的参考。

<!--
## Mapping from docker CLI to crictl
-->
## 从docker CLI到crictl的映射

<!--
The exact versions for the mapping table are for `docker` CLI v1.40 and `crictl`
v1.19.0. This list is not exhaustive. For example, it doesn't include
experimental `docker` CLI commands.
-->
映射表适用于`docker` CLI v1.40 版本和`crictl`v1.19.0版本。
这份清单并不详尽，例如，不包括实验性的`docker`CLI命令。

<!--
The output format of `crictl` is similar to `docker` CLI, despite some missing
columns for some CLI. Make sure to check output for the specific command if your
command output is being parsed programmatically.
-->
{{< note >}}
尽管某些CLI缺少一些列，但是`crictl`的输出格式与`docker`CLI基本类似。
如果以编程方式解析命令输出，请务必检查特定命令的输出。
{{< /note >}}

<!--
### Retrieve debugging information
-->
### 检索调试信息

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
{{< table caption="mapping from docker cli to crictl - retrieve debugging information" >}}
docker cli | crictl | 描述 | 不支持的特性
-- | -- | -- | --
`attach` | `attach` | 连接到一个运行的容器 | `--detach-keys`, `--sig-proxy`
`exec` | `exec` | 在运行的容器中执行命令 | `--privileged`, `--user`, `--detach-keys`
`images` | `images` | 镜像列表 |  
`info` | `info` | 显示系统性信息 |  
`inspect` | `inspect`, `inspecti` | 返回容器，镜像或任务的低级信息 |  
`logs` | `logs` | 获取容器日志 | `--details`
`ps` | `ps` | 容器列表 |  
`stats` | `stats` | 显示容器资源使用实时信息 | Column: NET/BLOCK I/O, PIDs
`version` | `version` | 显示运行时（Docker，ContainerD或其他）版本信息 |  
{{< /table >}}

<!--
### Perform Changes
-->
### 执行变更

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
{{< table caption="mapping from docker cli to crictl - perform changes" >}}
docker cli | crictl | 描述 | 不支持的特性
-- | -- | -- | --
`create` | `create` | 创建一个新容器 |  
`kill` | `stop` (timeout = 0) | 杀死一个或多个运行中的容器 | `--signal`
`pull` | `pull` | 拉取镜像或仓库 | `--all-tags`, `--disable-content-trust`
`rm` | `rm` | 删除一个或多个容器 |  
`rmi` | `rmi` | 删除一个或多个镜像 |  
`run` | `run` | 在新容器中执行命令 |  
`start` | `start` | 启动一个或多个已经停止的容器 | `--detach-keys`
`stop` | `stop` | 停止一个或多个运行中的容器 |  
`update` | `update` | 更新一个或多个容器的配置 | `--restart`, `--blkio-weight` 和CRI不支持的其他一些资源限制。
{{< /table >}}

<!--
### Supported only in crictl
-->
### 仅在crictl中支持

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
{{< table caption="mapping from docker cli to crictl - supported only in crictl" >}}
crictl | 描述
-- | --
`imagefsinfo` | 返回镜像文件系统信息
`inspectp` | 显示一个或多个pod的状态
`port-forward` | 本地端口转发至pod
`pods` | pod列表
`runp` | 运行一个新的pod
`rmp` | 删除一个或多个pod
`stopp` | 停止一个或多个运行中的pod
{{< /table >}}