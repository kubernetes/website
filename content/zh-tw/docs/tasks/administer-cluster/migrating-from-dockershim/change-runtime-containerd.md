---
title: 將節點上的容器運行時從 Docker Engine 改爲 containerd
weight: 10
content_type: task 
---

<!--
title: "Changing the Container Runtime on a Node from Docker Engine to containerd"
weight: 10
content_type: task 
-->

<!--
This task outlines the steps needed to update your container runtime to containerd from Docker. It
is applicable for cluster operators running Kubernetes 1.23 or earlier. This also covers an
example scenario for migrating from dockershim to containerd. Alternative container runtimes
can be picked from this [page](/docs/setup/production-environment/container-runtimes/).
-->
本任務給出將容器運行時從 Docker 改爲 containerd 所需的步驟。
此任務適用於運行 1.23 或更早版本 Kubernetes 的集羣操作人員。
同時，此任務也涉及從 dockershim 遷移到 containerd 的示例場景。
有關其他備選的容器運行時，可查閱
[此頁面](/zh-cn/docs/setup/production-environment/container-runtimes/)進行揀選。

## {{% heading "prerequisites" %}}

{{% thirdparty-content %}}

<!--
Install containerd. For more information see
[containerd's installation documentation](https://containerd.io/docs/getting-started/)
and for specific prerequisite follow
[the containerd guide](/docs/setup/production-environment/container-runtimes/#containerd).
-->
安裝 containerd。進一步的信息可參見
[containerd 的安裝文檔](https://containerd.io/docs/getting-started/)。
關於一些特定的環境準備工作，請遵循 [containerd 指南](/zh-cn/docs/setup/production-environment/container-runtimes/#containerd)。

<!--
## Drain the node 
-->
## 騰空節點    {#drain-the-node}

```shell
kubectl drain <node-to-drain> --ignore-daemonsets
```

<!--
Replace `<node-to-drain>` with the name of your node you are draining.
-->
將 `<node-to-drain>` 替換爲你所要騰空的節點的名稱。

<!--
## Stop the Docker daemon
-->
## 停止 Docker 守護進程   {#stop-the-docker-daemon}

```shell
systemctl stop kubelet
systemctl disable docker.service --now
```

<!--
## Install Containerd

Follow the [guide](/docs/setup/production-environment/container-runtimes/#containerd)
for detailed steps to install containerd.
-->
## 安裝 Containerd    {#install-containerd}

遵循此[指南](/zh-cn/docs/setup/production-environment/container-runtimes/#containerd)
瞭解安裝 containerd 的詳細步驟。

{{< tabs name="tab-cri-containerd-installation" >}}
{{% tab name="Linux" %}}

<!--
1. Install the `containerd.io` package from the official Docker repositories. 
   Instructions for setting up the Docker repository for your respective Linux distribution and
   installing the `containerd.io` package can be found at 
   [Getting started with containerd](https://github.com/containerd/containerd/blob/main/docs/getting-started.md).
-->
1. 從官方的 Docker 倉庫安裝 `containerd.io` 包。關於爲你所使用的 Linux 發行版來設置
   Docker 倉庫，以及安裝 `containerd.io` 包的詳細說明，
   可參見[開始使用 containerd](https://github.com/containerd/containerd/blob/main/docs/getting-started.md)。

<!--
1. Configure containerd:
-->
2. 配置 containerd：

   ```shell
   sudo mkdir -p /etc/containerd
   containerd config default | sudo tee /etc/containerd/config.toml
   ```

<!--
1. Restart containerd:
-->
3. 重啓 containerd：

   ```shell
   sudo systemctl restart containerd
   ```
{{% /tab %}}
{{% tab name="Windows (PowerShell)" %}}

<!--
Start a Powershell session, set `$Version` to the desired version (ex: `$Version="1.4.3"`), and
then run the following commands:
-->
啓動一個 Powershell 會話，將 `$Version` 設置爲期望的版本（例如：`$Version="1.4.3"`），
之後運行下面的命令：

<!--
1. Download containerd:
-->
1. 下載 containerd：

   ```powershell
   curl.exe -L https://github.com/containerd/containerd/releases/download/v$Version/containerd-$Version-windows-amd64.tar.gz -o containerd-windows-amd64.tar.gz
   tar.exe xvf .\containerd-windows-amd64.tar.gz
   ```

<!--
2. Extract and configure:
-->
2. 解壓縮並執行配置：

   ```powershell
   Copy-Item -Path ".\bin\" -Destination "$Env:ProgramFiles\containerd" -Recurse -Force
   cd $Env:ProgramFiles\containerd\
   .\containerd.exe config default | Out-File config.toml -Encoding ascii

   # 請審查配置信息。取決於你的安裝環境，你可能需要調整：
   # - sandbox_image （Kubernetes pause 鏡像）
   # - CNI 的 bin_dir 和 conf_dir 的位置
   Get-Content config.toml

   # （可選步驟，但強烈建議執行）將 containerd 排除在 Windows Defender 掃描之外
   Add-MpPreference -ExclusionProcess "$Env:ProgramFiles\containerd\containerd.exe"
   ```

<!--
3. Start containerd:
-->
3. 啓動 containerd：

   ```powershell
   .\containerd.exe --register-service
   Start-Service containerd
   ```

{{% /tab %}}
{{< /tabs >}}

<!--
## Configure the kubelet to use containerd as its container runtime

Edit the file `/var/lib/kubelet/kubeadm-flags.env` and add the containerd runtime to the flags;
`--container-runtime-endpoint=unix:///run/containerd/containerd.sock`.
-->
## 配置 kubelet 使用 containerd 作爲其容器運行時

編輯文件 `/var/lib/kubelet/kubeadm-flags.env`，將 containerd 運行時添加到標誌中；
`--container-runtime-endpoint=unix:///run/containerd/containerd.sock`。

<!--
Users using kubeadm should be aware that the kubeadm tool stores the host's CRI socket in the
`/var/lib/kubelet/instance-config.yaml` file on each node. You can create this `/var/lib/kubelet/instance-config.yaml` file on the node.

The `/var/lib/kubelet/instance-config.yaml` file allows setting the `containerRuntimeEndpoint` parameter.

You can set this parameter's value to the path of your chosen CRI socket (for example `unix:///run/containerd/containerd.sock`).
-->
使用 kubeadm 的用戶應注意，kubeadm 工具在每個節點的
`/var/lib/kubelet/instance-config.yaml` 文件中存儲主機的
CRI 套接字。你可以在節點上創建這個 `/var/lib/kubelet/instance-config.yaml` 文件。

`/var/lib/kubelet/instance-config.yaml` 文件允許設置
`containerRuntimeEndpoint` 參數。

你可以將此參數的值設置爲你所選擇的 CRI
套接字的路徑（例如 `unix:///run/containerd/containerd.sock`）。

<!--
## Restart the kubelet
-->
## 重啓 kubelet    {#restart-the-kubelet}

```shell
systemctl start kubelet
```

<!--
## Verify that the node is healthy

Run `kubectl get nodes -o wide` and containerd appears as the runtime for the node we just changed.
-->
## 驗證節點處於健康狀態   {#verify-that-the-node-is-healthy}

運行 `kubectl get nodes -o wide`，containerd 會顯示爲我們所更改的節點上的運行時。

<!--
## Remove Docker Engine
-->
## 移除 Docker Engine  {#remove-docker-engine}

{{% thirdparty-content %}}

<!--
If the node appears healthy, remove Docker.
-->
如果節點顯示正常，刪除 Docker。

{{< tabs name="tab-remove-docker-engine" >}}
{{% tab name="CentOS" %}}

```shell
sudo yum remove docker-ce docker-ce-cli
```
{{% /tab %}}
{{% tab name="Debian" %}}

```shell
sudo apt-get purge docker-ce docker-ce-cli
```
{{% /tab %}}
{{% tab name="Fedora" %}}

```shell
sudo dnf remove docker-ce docker-ce-cli
```
{{% /tab %}}
{{% tab name="Ubuntu" %}}

```shell
sudo apt-get purge docker-ce docker-ce-cli
```
{{% /tab %}}
{{< /tabs >}}

<!--
The preceding commands don't remove images, containers, volumes, or customized configuration files on your host.
To delete them, follow Docker's instructions to [Uninstall Docker Engine](https://docs.docker.com/engine/install/ubuntu/#uninstall-docker-engine).
-->
上面的命令不會移除你的主機上的鏡像、容器、卷或者定製的配置文件。
要刪除這些內容，參閱 Docker 的指令來[卸載 Docker Engine](https://docs.docker.com/engine/install/ubuntu/#uninstall-docker-engine)。

{{< caution >}}
<!--
Docker's instructions for uninstalling Docker Engine create a risk of deleting containerd. Be careful when executing commands.
-->
Docker 所提供的卸載 Docker Engine 命令指導中，存在刪除 containerd 的風險。
在執行命令時要謹慎。
{{< /caution >}}

<!--
## Uncordon the node
-->
## uncordon 節點

```shell
kubectl uncordon <node-to-uncordon>
```

<!--
Replace `<node-to-uncordon>` with the name of your node you previously drained.
-->

將 `<node-to-uncordon>` 替換爲你之前騰空的節點的名稱。
