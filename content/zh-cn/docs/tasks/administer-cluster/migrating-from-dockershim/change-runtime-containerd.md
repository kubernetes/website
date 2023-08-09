---
title: 将节点上的容器运行时从 Docker Engine 改为 containerd
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
本任务给出将容器运行时从 Docker 改为 containerd 所需的步骤。
此任务适用于运行 1.23 或更早版本 Kubernetes 的集群操作人员。
同时，此任务也涉及从 dockershim 迁移到 containerd 的示例场景。
有关其他备选的容器运行时，可查阅
[此页面](/zh-cn/docs/setup/production-environment/container-runtimes/)进行拣选。

## {{% heading "prerequisites" %}}

{{% thirdparty-content %}}

<!--
Install containerd. For more information see
[containerd's installation documentation](https://containerd.io/docs/getting-started/)
and for specific prerequisite follow
[the containerd guide](/docs/setup/production-environment/container-runtimes/#containerd).
-->
安装 containerd。进一步的信息可参见
[containerd 的安装文档](https://containerd.io/docs/getting-started/)。
关于一些特定的环境准备工作，请遵循 [containerd 指南](/zh-cn/docs/setup/production-environment/container-runtimes/#containerd)。

<!--
## Drain the node 
-->
## 腾空节点    {#drain-the-node}

```shell
kubectl drain <node-to-drain> --ignore-daemonsets
```

<!--
Replace `<node-to-drain>` with the name of your node you are draining.
-->
将 `<node-to-drain>` 替换为你所要腾空的节点的名称。

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

Follow the [guide](/docs/setup/production-environment/container-runtimes/#containerd)
for detailed steps to install containerd.
-->
## 安装 Containerd    {#install-containerd}

遵循此[指南](/zh-cn/docs/setup/production-environment/container-runtimes/#containerd)
了解安装 containerd 的详细步骤。

{{< tabs name="tab-cri-containerd-installation" >}}
{{% tab name="Linux" %}}

<!--
1. Install the `containerd.io` package from the official Docker repositories. 
   Instructions for setting up the Docker repository for your respective Linux distribution and
   installing the `containerd.io` package can be found at 
   [Getting started with containerd](https://github.com/containerd/containerd/blob/main/docs/getting-started.md).
-->
1. 从官方的 Docker 仓库安装 `containerd.io` 包。关于为你所使用的 Linux 发行版来设置
   Docker 仓库，以及安装 `containerd.io` 包的详细说明，
   可参见[开始使用 containerd](https://github.com/containerd/containerd/blob/main/docs/getting-started.md)。

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
3. 重启 containerd：

   ```shell
   sudo systemctl restart containerd
   ```
{{% /tab %}}
{{% tab name="Windows (PowerShell)" %}}

<!--
Start a Powershell session, set `$Version` to the desired version (ex: `$Version="1.4.3"`), and
then run the following commands:
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
   # - sandbox_image （Kubernetes pause 镜像）
   # - CNI 的 bin_dir 和 conf_dir 的位置
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

Edit the file `/var/lib/kubelet/kubeadm-flags.env` and add the containerd runtime to the flags;
`--container-runtime-endpoint=unix:///run/containerd/containerd.sock`.
-->
## 配置 kubelet 使用 containerd 作为其容器运行时

编辑文件 `/var/lib/kubelet/kubeadm-flags.env`，将 containerd 运行时添加到标志中；
`--container-runtime-endpoint=unix:///run/containerd/containerd.sock`。

<!--
Users using kubeadm should be aware that the `kubeadm` tool stores the CRI socket for each host as
an annotation in the Node object for that host. To change it you can execute the following command
on a machine that has the kubeadm `/etc/kubernetes/admin.conf` file.
-->
使用 `kubeadm` 的用户应该知道，`kubeadm` 工具将每个主机的 CRI 套接字保存在该主机对应的
Node 对象的注解中。
要更改这一注解信息，你可以在一台包含 kubeadm `/etc/kubernetes/admin.conf` 文件的机器上执行以下命令：

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
-->
## 验证节点处于健康状态   {#verify-that-the-node-is-healthy}

运行 `kubectl get nodes -o wide`，containerd 会显示为我们所更改的节点上的运行时。

<!--
## Remove Docker Engine
-->
## 移除 Docker Engine  {#remove-docker-engine}

{{% thirdparty-content %}}

<!--
If the node appears healthy, remove Docker.
-->
如果节点显示正常，删除 Docker。

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
上面的命令不会移除你的主机上的镜像、容器、卷或者定制的配置文件。
要删除这些内容，参阅 Docker 的指令来[卸载 Docker Engine](https://docs.docker.com/engine/install/ubuntu/#uninstall-docker-engine)。

{{< caution >}}
<!--
Docker's instructions for uninstalling Docker Engine create a risk of deleting containerd. Be careful when executing commands.
-->
Docker 所提供的卸载 Docker Engine 命令指导中，存在删除 containerd 的风险。
在执行命令时要谨慎。
{{< /caution >}}

<!--
## Uncordon the node
-->
## uncordon 节点

```shell
kubectl uncordon <node-to-uncordon>
```

<!--
Replace `<node-to-uncordon>` with the name of your node you previously drained.
-->

将 `<node-to-uncordon>` 替换为你之前腾空的节点的名称。
