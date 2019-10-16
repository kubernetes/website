---
title: 安装 Minikube
content_template: templates/task
weight: 20
card:
  name: tasks
  weight: 10
---

{{% capture overview %}}

<!-- This page shows you how to install [Minikube](/docs/tutorials/hello-minikube), a tool that runs a single-node Kubernetes cluster in a virtual machine on your personal computer. -->
该页面向您展示了如何安装 [Minikube](/docs/tutorials/hello-minikube)，Minikube 是一个安装在您电脑虚拟机上的单节点 Kubernetes 集群。

{{% /capture %}}

{{% capture prerequisites %}}

{{< tabs name="minikube_before_you_begin" >}}
{{% tab name="Linux" %}}
<!-- To check if virtualization is supported on Linux, run the following command and verify that the output is non-empty: -->
检查 Linux 上是否支持虚拟化，运行如下命令并确保输出不为空：
```
grep -E --color 'vmx|svm' /proc/cpuinfo
```
{{% /tab %}}

{{% tab name="macOS" %}}
<!-- To check if virtualization is supported on macOS, run the following command on your terminal. -->
检查 macOS 上是否支持虚拟化，运行如下命令并确保输出不为空：
```
sysctl -a | grep -E --color 'machdep.cpu.features|VMX'
```
<!-- If you see `VMX` in the output (should be colored), the VT-x feature is enabled in your machine. -->
如果输出内容为有颜色的 `VMX`，表示在您的电脑上 VT-x 功能已经开启。
{{% /tab %}}

{{% tab name="Windows" %}}
<!-- To check if virtualization is supported on Windows 8 and above, run the following command on your Windows terminal or command prompt. -->
检查在 Windows 8 及以上系统是否支持虚拟化，在您 Windows 终端或命令行运行如下命令：
```
systeminfo
```
<!-- If you see the following output, virtualization is supported on Windows. -->
如果输出如下内容，表示您的 Windows 支持虚拟化。
```
Hyper-V Requirements:     VM Monitor Mode Extensions: Yes
                          Virtualization Enabled In Firmware: Yes
                          Second Level Address Translation: Yes
                          Data Execution Prevention Available: Yes
```

<!-- If you see the following output, your system already has a Hypervisor installed and you can skip the next step. -->
如果输出如下内容，表示您的操作系统已经安装了虚拟机管理程序，您可以跳过下一步。
```
Hyper-V Requirements:     A hypervisor has been detected. Features required for Hyper-V will not be displayed.
```


{{% /tab %}}
{{< /tabs >}}

{{% /capture %}}

{{% capture steps %}}

<!-- # Installing minikube -->
# 安装 minikube

{{< tabs name="tab_with_md" >}}
{{% tab name="Linux" %}}

<!-- ### Install kubectl -->
### 安装 kubectl

<!-- Make sure you have kubectl installed. You can install kubectl according to the instructions in [Install and Set Up kubectl](/docs/tasks/tools/install-kubectl/#install-kubectl-on-linux). -->
确保您已经安装了 kubectl。您可以按照[安装和配置 kubectl](/docs/tasks/tools/install-kubectl/#install-kubectl-on-linux)的指引来安装 kubectl。

<!-- ### Install a Hypervisor -->
### 安装虚拟机管理程序

<!-- If you do not already have a hypervisor installed, install one of these now: -->
如果您没有安装虚拟机管理程序，选择如下一项进行安装：

<!-- • [KVM](https://www.linux-kvm.org/), which also uses QEMU -->
• [KVM](https://www.linux-kvm.org/)，使用了 QEMU

• [VirtualBox](https://www.virtualbox.org/wiki/Downloads)

{{< note >}}
<!-- Minikube also supports a `--vm-driver=none` option that runs the Kubernetes components on the host and not in a VM. Using this driver requires [Docker](https://www.docker.com/products/docker-desktop) and a Linux environment but not a hypervisor. It is recommended to use the apt installation of docker from ([Docker](https://www.docker.com/products/docker-desktop), when using the none driver. The snap installation of docker does not work with minikube. -->
minikube 也支持 `--vm-driver=none` 选项使 Kubernetes 组件运行在宿主机而不是虚拟机中。使用这种驱动模式需要 [Docker](https://www.docker.com/products/docker-desktop)和 Linux 环境，而不是虚拟机管理器。使用无驱动模式时，推荐从([Docker](https://www.docker.com/products/docker-desktop)使用 apt 进行安装。docker 这种快照式的安装不适用于 minikube。
{{< /note >}}

<!-- ### Install Minikube using a package -->
### 使用安装包安装 Minikube

<!-- There are *experimental* packages for Minikube available; you can find Linux (AMD64) packages
from Minikube's [releases](https://github.com/kubernetes/minikube/releases) page on GitHub. -->
有*试验性*的 Minikube 安装包可供使用。您可以在 GitHub 上 Minikube 的 [releases](https://github.com/kubernetes/minikube/releases)页面找到Linux (AMD64)的安装包。

<!-- Use your Linux's distribution's package tool to install a suitable package. -->
使用您的发布版 Linux 包工具进行安装。

<!-- ### Install Minikube via direct download -->
### 通过直接下载来安装 Minikube

<!-- If you're not installing via a package, you can download a stand-alone
binary and use that. -->
如果您没有通过安装包进行安装，您可以下载一个独立的二进制版本使用。

```shell
curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64 \
  && chmod +x minikube
```

<!-- Here's an easy way to add the Minikube executable to your path: -->
如下是一种简单的方式将 Minikube 添加到您的执行路径中：

```shell
sudo install minikube /usr/local/bin
```

{{% /tab %}}
{{% tab name="macOS" %}}
<!-- ### Install kubectl -->
### 安装 kubectl

<!-- Make sure you have kubectl installed. You can install kubectl according to the instructions in [Install and Set Up kubectl](/docs/tasks/tools/install-kubectl/#install-kubectl-on-macos). -->
确保您已经安装了 kubectl。您可以通过[安装和配置 kubectl](/docs/tasks/tools/install-kubectl/#install-kubectl-on-macos)来安装 kubectl。

<!-- ### Install a Hypervisor -->
### 安装虚拟机管理器

<!-- If you do not already have a hypervisor installed, install one of these now: -->
如果您没有安装虚拟机管理器，现在就选一个安装：

• [HyperKit](https://github.com/moby/hyperkit)

• [VirtualBox](https://www.virtualbox.org/wiki/Downloads)

• [VMware Fusion](https://www.vmware.com/products/fusion)

<!-- ### Install Minikube -->
### 安装Minikube
<!-- The easiest way to install Minikube on macOS is using [Homebrew](https://brew.sh): -->
在 macOS 上安装 Minikube 最简单的方法是使用[Homebrew](https://brew.sh)：

```shell
brew cask install minikube
```

<!-- You can also install it on macOS by downloading a stand-alone binary: -->
您也可以通过下载独立二进制文件来安装在 macOS 上。

```shell
curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-darwin-amd64 \
  && chmod +x minikube
```

<!-- Here's an easy way to add the Minikube executable to your path: -->
如下是一种简单的方式将 Minikube 添加到您的执行路径中：

```shell
sudo mv minikube /usr/local/bin
```

{{% /tab %}}
{{% tab name="Windows" %}}
<!-- ### Install kubectl -->
安装 kubectl

<!-- Make sure you have kubectl installed. You can install kubectl according to the instructions in [Install and Set Up kubectl](/docs/tasks/tools/install-kubectl/#install-kubectl-on-windows). -->
确保您已经安装了 kubectl。您可以通过[安装和配置 kubectl](/docs/tasks/tools/install-kubectl/#install-kubectl-on-windows)来安装 kubectl。

<!-- ### Install a Hypervisor -->
### 安装虚拟机管理器

<!-- If you do not already have a hypervisor installed, install one of these now: -->
如果您没有安装虚拟机管理器，现在就选一个安装：

• [Hyper-V](https://msdn.microsoft.com/en-us/virtualization/hyperv_on_windows/quick_start/walkthrough_install)

• [VirtualBox](https://www.virtualbox.org/wiki/Downloads)

{{< note >}}
<!-- Hyper-V can run on three versions of Windows 10: Windows 10 Enterprise, Windows 10 Professional, and Windows 10 Education. -->
Hyper-V 可以运行在3种版本的 Windows 10 中：Windows 10 企业版，Windows 10 专业版，Windows 10教育版。
{{< /note >}}

<!-- ### Install Minikube using Chocolatey -->
使用 Chocolatey 安装 Minikube

<!-- The easiest way to install Minikube on Windows is using [Chocolatey](https://chocolatey.org/) (run as an administrator): -->
在 Windows 上安装 Minikube 最简单的方式是使用[Chocolatey](https://chocolatey.org/) (以管理员身份运行)：

```shell
choco install minikube
```

<!-- After Minikube has finished installing, close the current CLI session and restart. Minikube should have been added to your path automatically. -->
Minikube 安装结束后，关闭命令行并重启。Minikube 应该已经添加到可执行路径中。

<!-- ### Install Minikube using an installer executable -->
### 使用安装器安装 Minikube

<!-- To install Minikube manually on Windows using [Windows Installer](https://docs.microsoft.com/en-us/windows/desktop/msi/windows-installer-portal), download [`minikube-installer.exe`](https://github.com/kubernetes/minikube/releases/latest/download/minikube-installer.exe) and execute the installer. -->
手动在 Windows 上安装 Minikube 使用[Windows Installer](https://docs.microsoft.com/en-us/windows/desktop/msi/windows-installer-portal)，下载[`minikube-installer.exe`](https://github.com/kubernetes/minikube/releases/latest/download/minikube-installer.exe)然后执行安装器。

<!-- ### Install Minikube via direct download -->
### 直接下载安装 Minikube

<!-- To install Minikube manually on Windows, download [`minikube-windows-amd64`](https://github.com/kubernetes/minikube/releases/latest), rename it to `minikube.exe`, and add it to your path. -->
在 Windows 上手动安装 Minikube，下载[`minikube-windows-amd64`](https://github.com/kubernetes/minikube/releases/latest)，重命名为`minikube.exe`，并将其添加到执行路径中。

{{% /tab %}}
{{< /tabs >}}


{{% /capture %}}

{{% capture whatsnext %}}

<!-- * [Running Kubernetes Locally via Minikube](/docs/setup/learning-environment/minikube/) -->
* [通过 Minikube 在本地运行 Kubernetes](/docs/setup/learning-environment/minikube/)

{{% /capture %}}

<!-- ## Cleanup local state -->
## 清理本地状态

<!-- If you have previously installed minikube, and run: -->
如果您之前安装过 Minikube，运行如下命令：
```shell
minikube start
```

<!-- And this command returns an error: -->
然后这条命令会返回一个错误：
```shell
machine does not exist
```

<!-- You need to clear minikube's local state: -->
您需要清理 Minikube 的本地状态：
```shell
minikube delete
```
