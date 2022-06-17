---
title: 將節點上的容器執行時從 Docker Engine 改為 containerd
weight: 8
content_type: task 
---

<!--
title: "Changing the Container Runtime on a Node from Docker Engine to containerd"
weight: 8
content_type: task 
-->

<!--
This task outlines the steps needed to update your container runtime to containerd from Docker. It
is applicable for cluster operators running Kubernetes 1.23 or earlier. Also  this covers an
example scenario for migrating from dockershim to containerd and alternative container runtimes
can be picked from this [page](/docs/setup/production-environment/container-runtimes/).
-->
本任務給出將容器執行時從 Docker 改為 containerd 所需的步驟。
此任務適用於執行 1.23 或更早版本 Kubernetes 的叢集操作人員。
同時，此任務也涉及從 dockershim 遷移到 containerd 的示例場景，
以及可以從[此頁面](/zh-cn/docs/setup/production-environment/container-runtimes/)
獲得的其他容器執行時列表。

## {{% heading "prerequisites" %}}

{{% thirdparty-content %}}

<!--
Install containerd. For more information see
[containerd's installation documentation](https://containerd.io/docs/getting-started/)
and for specific prerequisite follow
[the containerd guide](/docs/setup/production-environment/container-runtimes/#containerd).
-->
安裝 containerd。進一步的資訊可參見
[containerd 的安裝文件](https://containerd.io/docs/getting-started/)。
關於一些特定的環境準備工作，請遵循 [containerd 指南](/zh-cn/docs/setup/production-environment/container-runtimes/#containerd)。

<!--
## Drain the node 

```shell
kubectl drain <node-to-drain> --ignore-daemonsets
```

Replace `<node-to-drain>` with the name of your node you are draining.
-->
## 騰空節點    {#drain-the-node}

```shell
kubectl drain <node-to-drain> --ignore-daemonsets
```

將 `<node-to-drain>` 替換為你所要騰空的節點的名稱

<!--
## Stop the Docker daemon
-->
## 停止 Docker 守護程序   {#stop-the-docker-daemon}

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
1. 從官方的 Docker 倉庫安裝 `containerd.io` 包。關於為你所使用的 Linux 發行版來設定
   Docker 倉庫，以及安裝 `containerd.io` 包的詳細說明，可參見
   [開始使用 containerd](https://github.com/containerd/containerd/blob/main/docs/getting-started.md)。

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
3. 重啟 containerd：

   ```shell
   sudo systemctl restart containerd
   ```
{{% /tab %}}
{{% tab name="Windows (PowerShell)" %}}

<!--
Start a Powershell session, set `$Version` to the desired version (ex: `$Version="1.4.3"`), and
then run the following commands:
-->
啟動一個 Powershell 會話，將 `$Version` 設定為期望的版本（例如：`$Version="1.4.3"`），
之後執行下面的命令：

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

   # 請審查配置資訊。取決於你的安裝環境，你可能需要調整：
   # - the sandbox_image （Kubernetes pause 映象）
   # - cni bin_dir 和 conf_dir 的位置
   Get-Content config.toml

   # （可選步驟，但強烈建議執行）將 containerd 排除在 Windows Defender 掃描之外
   Add-MpPreference -ExclusionProcess "$Env:ProgramFiles\containerd\containerd.exe"
   ```

<!--
3. Start containerd:
-->
3. 啟動 containerd：

   ```powershell
   .\containerd.exe --register-service
   Start-Service containerd
   ```

{{% /tab %}}
{{< /tabs >}}

<!--
## Configure the kubelet to use containerd as its container runtime

Edit the file `/var/lib/kubelet/kubeadm-flags.env` and add the containerd runtime to the flags.
`--container-runtime=remote` and
`--container-runtime-endpoint=unix:///run/containerd/containerd.sock"`.
-->
## 配置 kubelet 使用 containerd 作為其容器執行時

編輯檔案 `/var/lib/kubelet/kubeadm-flags.env`，將 containerd 執行時新增到標誌中：
`--container-runtime=remote` 和 `--container-runtime-endpoint=unix:///run/containerd/containerd.sock"`。

<!--
For users using kubeadm should consider the following:

Users using kubeadm should be aware that the `kubeadm` tool stores the CRI socket for each host as
an annotation in the Node object for that host. To change it you can execute the following command
on a machine that has the kubeadm `/etc/kubernetes/admin.conf` file.
-->
對於使用 kubeadm 的使用者，可以考慮下面的問題：

`kubeadm` 工具將每個主機的 CRI 套接字儲存在該主機對應的 Node 物件的註解中。
使用 `kubeadm` 的使用者應該知道，`kubeadm` 工具將每個主機的 CRI 套接字儲存在該主機對應的 Node 物件的註解中。
要更改這一註解資訊，你可以在一臺包含 kubeadm `/etc/kubernetes/admin.conf` 檔案的機器上執行以下命令：

```shell
kubectl edit no <node-name>
```

<!--
This will start a text editor where you can edit the Node object.

To choose a text editor you can set the `KUBE_EDITOR` environment variable.

- Change the value of `kubeadm.alpha.kubernetes.io/cri-socket` from `/var/run/dockershim.sock`
  to the CRI socket path of your choice (for example `unix:///run/containerd/containerd.sock`).
   
  Note that new CRI socket paths must be prefixed with `unix://` ideally.

- Save the changes in the text editor, which will update the Node object.
-->
這一命令會開啟一個文字編輯器，供你在其中編輯 Node 物件。
要選擇不同的文字編輯器，你可以設定 `KUBE_EDITOR` 環境變數。

- 更改 `kubeadm.alpha.kubernetes.io/cri-socket` 值，將其從
  `/var/run/dockershim.sock` 改為你所選擇的 CRI 套接字路徑
  （例如：`unix:///run/containerd/containerd.sock`）。

  注意新的 CRI 套接字路徑必須帶有 `unix://` 字首。

- 儲存文字編輯器中所作的修改，這會更新 Node 物件。

<!--
## Restart the kubelet
-->
## 重啟 kubelet    {#restart-the-kubelet}

```shell
systemctl start kubelet
```

<!--
## Verify that the node is healthy

Run `kubectl get nodes -o wide` and containerd appears as the runtime for the node we just changed.

## Remove Docker Engine
-->
## 驗證節點處於健康狀態   {#verify-that-the-node-is-healthy}

執行 `kubectl get nodes -o wide`，containerd 會顯示為我們所更改的節點上的執行時。

{{% thirdparty-content %}}

<!--
Finally if everything goes well, remove Docker.
-->
最後，在一切順利時刪除 Docker。

{{< tabs name="tab-remove-docker-enigine" >}}
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

