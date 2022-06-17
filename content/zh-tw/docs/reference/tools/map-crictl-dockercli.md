---
title: 從 Docker 命令列對映到 crictl
content_type: reference
---

<!--
title: Mapping from dockercli to crictl
content_type: reference
-->

{{% thirdparty-content %}}

{{<note>}}
<!--
This page is deprecated and will be removed in Kubernetes 1.27.
-->
此頁面已被廢棄，將在 Kubernetes 1.27 版本刪除。
{{</note>}}

<!--
`crictl` is a command-line interface for {{<glossary_tooltip term_id="cri" text="CRI">}}-compatible container runtimes.
You can use it to inspect and debug container runtimes and applications on a
Kubernetes node. `crictl` and its source are hosted in the
[cri-tools](https://github.com/kubernetes-sigs/cri-tools) repository.
-->
`crictl` 是相容 {{<glossary_tooltip term_id="cri" text="CRI">}}的容器執行時的一種命令列介面。
你可以使用它來在 Kubernetes 節點上檢視和除錯容器執行時和應用。
`crictl` 及其原始碼都託管在
[cri-tools](https://github.com/kubernetes-sigs/cri-tools) 倉庫中。

<!--
This page provides a reference for mapping common commands for the `docker`
command-line tool into the equivalent commands for `crictl`.
-->
本頁面提供一份參考資料，用來將 `docker` 命令列工具的常用命令對映到
`crictl` 的等價命令。

<!--
## Mapping from docker CLI to crictl
-->
## 從 docker 命令列對映到 crictl   {#mapping-from-docker-cli-to-crictl}

<!--
The exact versions for the mapping table are for `docker` CLI v1.40 and `crictl`
v1.19.0. This list is not exhaustive. For example, it doesn't include
experimental `docker` CLI commands.
-->
對映表格中列舉的確切版本是 `docker` 命令列的 v1.40 版本和 `crictl` 的 v1.19.0 版本。
這一列表不是完備的。例如，其中並未包含實驗性質的 `docker` 命令。

{{< note >}}
<!--
The output format of `crictl` is similar to `docker` CLI, despite some missing
columns for some CLI. Make sure to check output for the specific command if your
command output is being parsed programmatically.
-->
`crictl` 的輸出格式類似於 `docker` 命令列，只是對於某些命令而言會有部分列缺失。
如果你的命令輸出會被程式解析，請確保你認真查看了對應的命令輸出。
{{< /note >}}

<!--
### Retrieve debugging information
-->
### 獲得除錯資訊   {#retrieve-debugging-information}

{{< table caption="docker 命令列與 crictl 的對映 - 獲得除錯資訊" >}}
<!--docker CLI | crictl | Description | Unsupported Features
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
docker CLI | crictl | 描述 | 不支援的功能
-- | -- | -- | --
`attach` | `attach` | 掛接到某執行中的容器 | `--detach-keys`, `--sig-proxy`
`exec` | `exec` | 在執行中的容器內執行命令 | `--privileged`, `--user`, `--detach-keys`
`images` | `images` | 列舉映象 |  
`info` | `info` | 顯示系統範圍的資訊 |  
`inspect` | `inspect`, `inspecti` | 返回容器、映象或任務的底層資訊 |  
`logs` | `logs` | 取回容器的日誌資料  | `--details`
`ps` | `ps` | 列舉容器  |  
`stats` | `stats` | 顯示容器資源用量統計的動態資料流 | 列：NET/BLOCK I/O、PIDs
`version` | `version` | 顯示執行時（Docker、ContainerD 或其他）的版本資訊 | 
{{< /table >}}

<!--
### Perform Changes
-->
### 執行變更    {#perform-changes}

{{< table caption="docker 命令列與 crictl 的對映 - 執行變更" >}}
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
docker CLI | crictl | 描述 | 不支援的功能
-- | -- | -- | --
`create` | `create` | 建立一個新容器 |  
`kill` | `stop` (超時值為 0) | 殺死一個或多個執行中的容器 | `--signal`
`pull` | `pull` | 從某映象庫拉取映象或倉庫 | `--all-tags`, `--disable-content-trust`
`rm` | `rm` | 移除一個或者多個容器 |  
`rmi` | `rmi` | 移除一個或者多個映象 |  
`run` | `run` | 在一個新的容器中執行命令 |  
`start` | `start` | 啟動一個或多個已停止的容器 | `--detach-keys`
`stop` | `stop` | 停止一個或多個執行中的容器 |  
`update` | `update` | 更新一個或多個容器的配置 | `--restart`、`--blkio-weight` 以 CRI 所不支援的資源約束
{{< /table >}}

<!--
### Supported only in crictl
-->
### 僅被 crictl 支援的命令   {#supported-only-in-crictl}

{{< table caption="docker 命令列與 crictl 的對映 - 僅被 crictl 支援的命令" >}}
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
`imagefsinfo` | 返回映象檔案系統資訊
`inspectp` | 顯示一個或多個 Pod 的狀態
`port-forward` | 將本地埠轉發到 Pod
`pods` | 列舉 Pod
`runp` | 執行一個新的 Pod
`rmp` | 刪除一個或多個 Pod
`stopp` | 停止一個或多個執行中的 Pod
{{< /table >}}

