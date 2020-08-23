---
title: 安装 Minikube
content_type: task
weight: 20
card:
  name: tasks
  weight: 10
---

<!--
title: Install Minikube
content_type: task
weight: 20
card:
  name: tasks
  weight: 10
-->

<!-- overview -->

<!--
This page shows you how to install [Minikube](/docs/tutorials/hello-minikube), a tool that runs a single-node Kubernetes cluster in a virtual machine on your personal computer.
-->
本页面讲述如何安装 [Minikube](/zh/docs/tutorials/hello-minikube)，该工具用于在你电脑中的虚拟机上运行一个单节点的 Kubernetes 集群。

## {{% heading "prerequisites" %}}

{{< tabs name="minikube_before_you_begin" >}}
{{% tab name="Linux" %}}

<!--
To check if virtualization is supported on Linux, run the following command and verify that the output is non-empty:
-->

若要检查你的 Linux 是否支持虚拟化技术，请运行下面的命令并验证输出结果是否不为空：

```
grep -E --color 'vmx|svm' /proc/cpuinfo
```

{{% /tab %}}

{{% tab name="macOS" %}}

<!--
To check if virtualization is supported on macOS, run the following command on your terminal.
-->
若要检查你的 macOS 是否支持虚拟化技术，请运行下面的命令：

```
sysctl -a | grep -E --color 'machdep.cpu.features|VMX'
```

<!--
If you see `VMX` in the output (should be colored), the VT-x feature is enabled in your machine.
-->
如果你在输出结果中看到了 `VMX` （应该会高亮显示）的字眼，说明你的电脑已启用 VT-x 特性。

{{% /tab %}}

{{% tab name="Windows" %}}
<!--
To check if virtualization is supported on Windows 8 and above, run the following command on your Windows terminal or command prompt.
-->
若要检查你的 Windows8 及以上的系统是否支持虚拟化技术，请终端或者 cmd 中运行以下命令：

```
systeminfo
```
<!--
If you see the following output, virtualization is supported on Windows.
-->
如果你看到下面的输出，则表示该 Windows 支持虚拟化技术。

```
Hyper-V Requirements:     VM Monitor Mode Extensions: Yes
                          Virtualization Enabled In Firmware: Yes
                          Second Level Address Translation: Yes
                          Data Execution Prevention Available: Yes
```

<!--
If you see the following output, your system already has a Hypervisor installed and you can skip the next step.
-->
如果你看到下面的输出，则表示你的操作系统已经安装了 Hypervisor，你可以跳过安装 Hypervisor 的步骤。
```
Hyper-V Requirements:     A hypervisor has been detected. Features required for Hyper-V will not be displayed.
```

{{% /tab %}}
{{< /tabs >}}

<!-- steps -->

<!--
# Installing minikube
-->
## 安装 minikube

{{< tabs name="tab_with_md" >}}
{{% tab name="Linux" %}}

<!--
### Install kubectl

Make sure you have kubectl installed. You can install kubectl according to the instructions in [Install and Set Up kubectl](/docs/tasks/tools/install-kubectl/#install-kubectl-on-linux).
-->
### 安装 kubectl

请确保你已正确安装 kubectl。你可以根据[安装并设置 kubectl](/zh/docs/tasks/tools/install-kubectl/#install-kubectl-on-linux)
的说明来安装 kubectl。

<!--
### Install a Hypervisor

If you do not already have a hypervisor installed, install one of these now:
-->

### 安装 Hypervisor

如果还没有装过 hypervisor，请选择以下方式之一进行安装：

<!--
• [KVM](https://www.linux-kvm.org/), which also uses QEMU

• [VirtualBox](https://www.virtualbox.org/wiki/Downloads)
-->

- [KVM](https://www.linux-kvm.org/)，KVM 也使用了 QEMU
- [VirtualBox](https://www.virtualbox.org/wiki/Downloads)

<!--
Minikube also supports a `--vm-driver=none` option that runs the Kubernetes components on the host and not in a VM.
Using this driver requires [Docker](https://www.docker.com/products/docker-desktop) and a Linux environment but not a hypervisor.

If you're using the `none` driver in Debian or a derivative, use the `.deb` packages for
Docker rather than the snap package, which does not work with Minikube.
You can download `.deb` packages from [Docker](https://www.docker.com/products/docker-desktop).
-->
Minikube 还支持使用一个 `--vm-driver=none` 选项，让 Kubernetes 组件运行在主机上，而不是在 VM 中。
使用这种驱动方式需要 [Docker](https://www.docker.com/products/docker-desktop) 和 Linux 环境，但不需要 hypervisor。

如果你在 Debian 系的 OS 中使用了 `none` 这种驱动方式，请使用 `.deb` 包安装 Docker，不要使用 snap 包的方式，Minikube 不支持这种方式。
你可以从 [Docker](https://www.docker.com/products/docker-desktop) 下载 `.deb` 包。

<!--
The `none` VM driver can result in security and data loss issues.
Before using `--vm-driver=none`, consult [this documentation](https://minikube.sigs.k8s.io/docs/reference/drivers/none/) for more information.
-->
{{< caution >}}
`none` VM 驱动方式存在导致安全和数据丢失的问题。
使用 `--vm-driver=none` 之前，请参考[这个文档](https://minikube.sigs.k8s.io/docs/reference/drivers/none/)获取详细信息。
{{< /caution >}}

<!--
Minikube also supports a `vm-driver=podman` similar to the Docker driver. Podman run as superuser privilege (root user) is the best way to ensure that your containers have full access to any feature available on your system.
-->
Minikube 还支持另外一个类似于 Docker 驱动的方式 `vm-driver=podman`。
使用超级用户权限（root 用户）运行 Podman 可以最好的确保容器具有足够的权限使用
你的操作系统上的所有特性。

<!--
The `podman` driver requires running the containers as root because regular user accounts don’t have full access to all operating system features that their containers might need to run.
-->
{{< caution >}}
`Podman` 驱动需要以 root 用户身份运行容器，因为普通用户帐户没有足够的权限
使用容器运行可能需要的操作系统上的所有特性。
{{< /caution >}}

<!--
### Install Minikube using a package

There are *experimental* packages for Minikube available; you can find Linux (AMD64) packages
from Minikube's [releases](https://github.com/kubernetes/minikube/releases) page on GitHub.

Use your Linux's distribution's package tool to install a suitable package.
-->
### 使用包安装 Minikube

Minikube 有 *实验性* 的安装包。你可以在 Minikube 在 GitHub 上的[发行版本](https://github.com/kubernetes/minikube/releases) 找到 Linux (AMD64) 的包。

根据你的 Linux 发行版选择安装合适的包。

<!--
### Install Minikube via direct download

If you're not installing via a package, you can download a stand-alone
binary and use that.
-->
### 直接下载并安装 Minikube

如果你不想通过包安装，你也可以下载并使用一个单节点二进制文件。

```shell
curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64 \
  && chmod +x minikube
```

<!--
Here's an easy way to add the Minikube executable to your path:
-->
将 Minikube 可执行文件添加至 PATH：

```shell
sudo mkdir -p /usr/local/bin/
sudo install minikube /usr/local/bin/
```

<!--
### Install Minikube using Homebrew

As yet another alternative, you can install Minikube using Linux [Homebrew](https://docs.brew.sh/Homebrew-on-Linux):
-->
### 使用 Homebrew 安装 Minikube

你还可以使用 Linux [Homebrew](https://docs.brew.sh/Homebrew-on-Linux) 安装 Minikube：

```shell
brew install minikube
```

{{% /tab %}}

{{% tab name="macOS" %}}

<!--
### Install kubectl

Make sure you have kubectl installed. You can install kubectl according to the instructions in [Install and Set Up kubectl](/docs/tasks/tools/install-kubectl/#install-kubectl-on-macos).
-->
### 安装 kubectl

请确保你已正确安装 kubectl。你可以根据[安装并设置 kubectl](/zh/docs/tasks/tools/install-kubectl/#install-kubectl-on-linux)
的说明来安装 kubectl。

<!--
### Install a Hypervisor

If you do not already have a hypervisor installed, install one of these now:
-->
### 安装 Hypervisor

如果你还没有安装 hypervisor，请选择以下方式之一进行安装：

• [HyperKit](https://github.com/moby/hyperkit)
• [VirtualBox](https://www.virtualbox.org/wiki/Downloads)
• [VMware Fusion](https://www.vmware.com/products/fusion)

<!--
### Install Minikube
The easiest way to install Minikube on macOS is using [Homebrew](https://brew.sh):
-->
### 安装 Minikube

macOS 安装 Minikube 最简单的方法是使用 [Homebrew](https://brew.sh)：

```shell
brew install minikube
```

<!--
You can also install it on macOS by downloading a stand-alone binary:
-->
你也可以通过下载独立的可执行文件进行安装：

```shell
curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-darwin-amd64 \
  && chmod +x minikube
```

<!--
Here's an easy way to add the Minikube executable to your path:
-->
下面是一个简单的将 Minikube 可执行文件添加至 PATH 的方法：

```shell
sudo mv minikube /usr/local/bin
```

{{% /tab %}}
{{% tab name="Windows" %}}

<!--
### Install kubectl

Make sure you have kubectl installed. You can install kubectl according to the instructions in [Install and Set Up kubectl](/docs/tasks/tools/install-kubectl/#install-kubectl-on-windows).
-->
### 安装 kubectl

请确保你已正确安装 kubectl。你可以根据[安装并设置 kubectl](/zh/docs/tasks/tools/install-kubectl/#install-kubectl-on-windows)
的说明来安装 kubectl。

<!--
### Install a Hypervisor

If you do not already have a hypervisor installed, install one of these now:
-->
### 安装 Hypervisor

如果你还没有安装 hypervisor，请选择以下方式之一进行安装：

• [Hyper-V](https://msdn.microsoft.com/en-us/virtualization/hyperv_on_windows/quick_start/walkthrough_install)
• [VirtualBox](https://www.virtualbox.org/wiki/Downloads)

<!--
Hyper-V can run on three versions of Windows 10: Windows 10 Enterprise, Windows 10 Professional, and Windows 10 Education.
-->
{{< note >}}
Hyper-V 可以运行在三个版本的 Windows 10 上：企业版、专业版和教育版（Enterprise, Professional, Education）。
{{< /note >}}

<!--
### Install Minikube using Chocolatey

The easiest way to install Minikube on Windows is using [Chocolatey](https://chocolatey.org/) (run as an administrator):
-->
### 使用 Chocolatey 安装 Minikube

Windows 安装 Minikube 最简单的方法是使用 [Chocolatey](https://chocolatey.org/) （以管理员身份运行）：

```shell
choco install minikube
```

<!--
After Minikube has finished installing, close the current CLI session and restart. Minikube should have been added to your path automatically.
-->
完成 Minikube 的安装后，关闭当前 CLI 界面再重新打开。
Minikube 应该已经自动添加至 path 中。

<!--
### Install Minikube using an installer executable

To install Minikube manually on Windows using [Windows Installer](https://docs.microsoft.com/en-us/windows/desktop/msi/windows-installer-portal), download [`minikube-installer.exe`](https://github.com/kubernetes/minikube/releases/latest/download/minikube-installer.exe) and execute the installer.
-->

### 使用安装程序安装 Minikube

在 Windows 上使用 [Windows Installer](https://docs.microsoft.com/en-us/windows/desktop/msi/windows-installer-portal) 手动安装 Minikube，下载并运行 [`minikube-installer.exe`](https://github.com/kubernetes/minikube/releases/latest/download/minikube-installer.exe) 即可。

<!--
### Install Minikube via direct download

To install Minikube manually on Windows, download [`minikube-windows-amd64`](https://github.com/kubernetes/minikube/releases/latest), rename it to `minikube.exe`, and add it to your path.
-->
### 直接下载并安装 Minikube

想在 Windows 上手动安装 Minikube，下载 [`minikube-windows-amd64`](https://github.com/kubernetes/minikube/releases/latest) 并将其重命名为 `minikube.exe`，然后将其添加至 path 即可。

{{% /tab %}}
{{< /tabs >}}

<!--
## Confirm Installation

To confirm successful installation of both a hypervisor and Minikube, you can run the following command to start up a local Kubernetes cluster:
-->
## 安装确认

要确认 hypervisor 和 Minikube 均已成功安装，可以运行以下命令来启动本地 Kubernetes 集群：

<!--
For setting the `--vm-driver` with `minikube start`, enter the name of the hypervisor you installed in lowercase letters where `<driver_name>` is mentioned below. A full list of `--vm-driver` values is available in [specifying the VM driver documentation](https://kubernetes.io/docs/setup/learning-environment/minikube/#specifying-the-vm-driver).
-->
{{< note >}}
若要为 `minikube start` 设置 `--vm-driver`，在下面提到 `<驱动名称>` 的地方，
用小写字母输入你安装的 hypervisor 的名称。
[指定 VM 驱动程序](/zh/docs/setup/learning-environment/minikube/#specifying-the-vm-driver)
列举了 `--vm-driver` 值的完整列表。
{{< /note >}}

{{< note >}}
由于国内无法直接连接 k8s.gcr.io，推荐使用阿里云镜像仓库，在 `minikube start` 中添加 `--image-repository` 参数。
{{< /note >}}

```shell
minikube start --vm-driver=<驱动名称>
# 或者在需要时
minikube start --vm-driver=<驱动名称> --image-repository=registry.cn-hangzhou.aliyuncs.com/google_containers
```

<!--
Once `minikube start` finishes, run the command below to check the status of the cluster:
-->
一旦 `minikube start` 完成，你可以运行下面的命令来检查集群的状态：

```shell
minikube status
```

<!--
If your cluster is running, the output from `minikube status` should be similar to:
-->
如果你的集群正在运行，`minikube status` 的输出结果应该类似于这样：

```
host: Running
kubelet: Running
apiserver: Running
kubeconfig: Configured
```

<!--
After you have confirmed whether Minikube is working with your chosen hypervisor, you can continue to use Minikube or you can stop your cluster. To stop your cluster, run:
-->
在确认 Minikube 与 hypervisor 均正常工作后，你可以继续使用 Minikube 或停止集群。要停止集群，请运行：

```shell
minikube stop
```

<!--
## Clean up local state {#cleanup-local-state}

If you have previously installed Minikube, and run:
-->
## 清理本地状态          {#cleanup-local-state}

如果你之前安装过 Minikube，并运行了：

```shell
minikube start
```

<!-- and `minikube start` returned an error: -->
并且 `minikube start` 返回了一个错误：

```
machine does not exist
```

<!-- then you need to clear minikube's local state: -->
那么，你需要清理 minikube 的本地状态：

```shell
minikube delete
```

## {{% heading "whatsnext" %}}

<!--
* [Running Kubernetes Locally via Minikube](/docs/setup/learning-environment/minikube/)
-->

* [使用 Minikube 在本地运行 Kubernetes](/zh/docs/setup/learning-environment/minikube/)

