title: 将节点上的容器运行时从 Docker Engine 改为 containerd
weight: 8
content_type: task 

<!--
title: "Changing the Container Runtime on a Node from Docker Engine to containerd"
weight: 8
content_type: task 
-->

<!--
This task outlines the steps needed to update your container runtime to containerd from Docker. It is applicable for cluster operators running Kubernetes 1.23 or earlier. Also  this covers an example scenario for migrating from dockershim to containerd and alternative container runtimes can be picked from this [page](https://kubernetes.io/docs/setup/production-environment/container-runtimes/).
-->
本任务给出将容器运行时从 Docker 改为 containerd 所需的步骤。
此任务适用于运行 1.23 或更早版本 Kubernetes 的集群操作人员。
同时，此任务也涉及从 dockershim 迁移到 containerd 的示例场景，
以及可以从[此页面](/zh/docs/setup/production-environment/container-runtimes/)
获得的其他容器运行时列表。

## {{% heading "prerequisites" %}}

{{% thirdparty-content %}}

<!--
Install containerd. For more information see, [containerd's installation documentation](https://containerd.io/docs/getting-started/) and for specific prerequisite follow [this](/docs/setup/production-environment/container-runtimes/#containerd).
-->
安装 containerd。进一步的信息可参见
[containerd 的安装文档](https://containerd.io/docs/getting-started/)。
关于一些特定的环境准备工作，请参阅[此页面](/zh/docs/setup/production-environment/container-runtimes/#containerd)。

<!--
## Drain the node 

```
# replace <node-to-drain> with the name of your node you are draining
kubectl drain <node-to-drain> --ignore-daemonsets
```
-->
## 腾空节点    {#drain-the-node}

```
# 将 <node-to-drain> 替换为你所要腾空的节点的名称
kubectl drain <node-to-drain> --ignore-daemonsets
```

<!--
## Stop the Docker daemon
-->
## 停止 Docker 守护进程   {#stop-the-docker-daemon}

```shell
systemctl stop kubelet
systemctl disable docker.service --now
```

<!--
## Install Containerd

This [page](/docs/setup/production-environment/container-runtimes/#containerd) contains detailed steps to install containerd.
-->
## 安装 Containerd    {#install-containerd}

此[页面](/zh/docs/setup/production-environment/container-runtimes/#containerd)
包含安装 containerd 的详细步骤。

{{< tabs name="tab-cri-containerd-installation" >}}
{{% tab name="Linux" %}}

<!--
1. Install the `containerd.io` package from the official Docker repositories. 
Instructions for setting up the Docker repository for your respective Linux distribution and installing the `containerd.io` package can be found at 
[Install Docker Engine](https://docs.docker.com/engine/install/#server).
-->
1. 从官方的 Docker 仓库安装 `containerd.io` 包。关于为你所使用的 Linux 发行版来设置
   Docker 仓库，以及安装 `containerd.io` 包的详细说明，可参见
   [Install Docker Engine](https://docs.docker.com/engine/install/#server)。

<!--
2. Configure containerd:
-->
2. 配置 containerd：

   ```shell
   sudo mkdir -p /etc/containerd
   containerd config default | sudo tee /etc/containerd/config.toml
   ```

<!--
3. Restart containerd:
-->
3. 重启 containerd：

   ```shell
   sudo systemctl restart containerd
   ```

{{% /tab %}}
{{% tab name="Windows (PowerShell)" %}}

<!--
Start a Powershell session, set `$Version` to the desired version (ex: `$Version="1.4.3"`), and then run the following commands:
-->
启动一个 Powershell 会话，将 `$Version` 设置为期望的版本（例如：`$Version="1.4.3"`），
之后运行下面的命令：

<!--
1. Download containerd:
-->
1. 下载 containerd：

   ```powershell
   curl.exe -L https://github.com/containerd/containerd/releases/download/v$Version/containerd-$Version-windows-amd64.tar.gz -o containerd-windows-amd64.tar.gz
   tar.exe xvf .\containerd-windows-amd64.tar.gz
   ```

<!--
2. Extract and configure:
-->
2. 解压缩并执行配置：

   ```powershell
   Copy-Item -Path ".\bin\" -Destination "$Env:ProgramFiles\containerd" -Recurse -Force
   cd $Env:ProgramFiles\containerd\
   .\containerd.exe config default | Out-File config.toml -Encoding ascii

   # 请审查配置信息。取决于你的安装环境，你可能需要调整：
   # - the sandbox_image （Kubernetes pause 镜像）
   # - cni bin_dir 和 conf_dir 的位置
   Get-Content config.toml

   # （可选步骤，但强烈建议执行）将 containerd 排除在 Windows Defender 扫描之外
   Add-MpPreference -ExclusionProcess "$Env:ProgramFiles\containerd\containerd.exe"
   ```

<!--
3. Start containerd:
-->
3. 启动 containerd：

   ```powershell
   .\containerd.exe --register-service
   Start-Service containerd
   ```

{{% /tab %}}
{{< /tabs >}}

<!--
## Configure the kubelet to use containerd as its container runtime

Edit the file `/var/lib/kubelet/kubeadm-flags.env` and add the containerd runtime to the flags. `--container-runtime=remote` and `--container-runtime-endpoint=unix:///run/containerd/containerd.sock"`
-->
## 配置 kubelet 使用 containerd 作为其容器运行时

编辑文件 `/var/lib/kubelet/kubeadm-flags.env`，将 containerd 运行时添加到标志中：
`--container-runtime=remote` 和 `--container-runtime-endpoint=unix:///run/containerd/containerd.sock"`。

<!--
For users using kubeadm should consider the following:

The `kubeadm` tool stores the CRI socket for each host as an annotation in the Node object for that host.
-->
对于使用 kubeadm 的用户，可以考虑下面的问题：

`kubeadm` 工具将每个主机的 CRI 套接字保存在该主机对应的 Node 对象的注解中。

<!--
To change it you must do the following:

Execute `kubectl edit no <NODE-NAME>` on a machine that has the kubeadm `/etc/kubernetes/admin.conf` file.
-->
要更改这一注解信息，你必须执行下面的操作：

在一台包含 `/etc/kubernetes/admin.conf` 文件的机器上，执行
`kubectl edit no <节点名称>`。

<!--
This will start a text editor where you can edit the Node object.

To choose a text editor you can set the `KUBE_EDITOR` environment variable.

- Change the value of `kubeadm.alpha.kubernetes.io/cri-socket` from `/var/run/dockershim.sock`
   to the CRI socket path of your choice (for example `unix:///run/containerd/containerd.sock`).
   
   Note that new CRI socket paths must be prefixed with `unix://` ideally.

- Save the changes in the text editor, which will update the Node object.
-->
这一命令会打开一个文本编辑器，供你在其中编辑 Node 对象。
要选择不同的文本编辑器，你可以设置 `KUBE_EDITOR` 环境变量。

- 更改 `kubeadm.alpha.kubernetes.io/cri-socket` 值，将其从
  `/var/run/dockershim.sock` 改为你所选择的 CRI 套接字路径
  （例如：`unix:///run/containerd/containerd.sock`）。

  注意新的 CRI 套接字路径必须带有 `unix://` 前缀。

- 保存文本编辑器中所作的修改，这会更新 Node 对象。

<!--
## Restart the kubelet
-->
## 重启 kubelet    {#restart-the-kubelet}

```shell
systemctl start kubelet
```

<!--
## Verify that the node is healthy

Run `kubectl get nodes -o wide` and containerd appears as the runtime for the node we just changed.

## Remove Docker Engine
-->
## 验证节点处于健康状态   {#verify-that-the-node-is-healthy}

运行 `kubectl get nodes -o wide`，containerd 会显示为我们所更改的节点上的运行时。

{{% thirdparty-content %}}

<!--
Finally if everything goes well remove docker
-->
最后，在一切顺利时删除 Docker。

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

