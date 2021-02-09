---
title: 安装并配置 kubectl
content_type: task
weight: 10
card:
  name: tasks
  weight: 20
  title: 安装 kubectl
---
<!--
reviewers:
- mikedanese
title: Install and Set Up kubectl
content_type: task
weight: 10
card:
  name: tasks
  weight: 20
  title: Install kubectl
-->

<!-- overview -->
<!--
The Kubernetes command-line tool, [kubectl](/docs/reference/kubectl/kubectl/), allows
you to run commands against Kubernetes clusters.
You can use kubectl to deploy applications, inspect and manage cluster resources,
and view logs. For a complete list of kubectl operations, see
[Overview of kubectl](/docs/reference/kubectl/overview/).
 -->
使用 Kubernetes 命令行工具 [kubectl](/zh/docs/reference/kubectl/kubectl/)，
你可以在 Kubernetes 上运行命令。
使用 kubectl，你可以部署应用、检视和管理集群资源、查看日志。
要了解 kubectl 操作的完整列表，请参阅
[kubectl 概览](/zh/docs/reference/kubectl/overview/)。

## {{% heading "prerequisites" %}}

<!--
You must use a kubectl version that is within one minor version difference of your cluster.
For example, a v1.2 client should work with v1.1, v1.2, and v1.3 master.
Using the latest version of kubectl helps avoid unforeseen issues.
-->
你必须使用与集群小版本号差别为一的 kubectl 版本。
例如，1.2 版本的客户端应该与 1.1 版本、1.2 版本和 1.3 版本的主节点一起使用。
使用最新版本的 kubectl 有助于避免无法预料的问题。

<!-- steps -->

<!--
## Install kubectl on Linux

### Install kubectl binary with curl on Linux
-->
## 在 Linux 上安装 kubectl  {#install-kubectl-on-linux}

### 在 Linux 上使用 curl 安装 kubectl 可执行文件

<!--
1. Download the latest release with the command:
-->
1. 使用下面命令下载最新的发行版本：

   ```bash
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
   ```

   <!--
   To download a specific version, replace the `$(curl -L -s https://dl.k8s.io/release/stable.txt)` portion of the command with the specific version.

   For example, to download version {{< param "fullversion" >}} on Linux, type:
   -->
   要下载特定版本，将命令中的 `$(curl -L -s https://dl.k8s.io/release/stable.txt)`
   部分替换为指定版本。

   例如，要下载 Linux 上的版本 {{< param "fullversion" >}}，输入：
    
   ```
   curl -LO https://dl.k8s.io/release/{{< param "fullversion" >}}/bin/linux/amd64/kubectl
   ```

<!--
1. Validate the binary (optional)
-->
2. 验证可执行文件（可选步骤）：

   <!--
   Download the kubectl checksum file:
   -->
   下载 kubectl 校验和文件：

   ```bash
   curl -LO "https://dl.k8s.io/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl.sha256"
   ```

   <!--
   Validate the kubectl binary against the checksum file:
   -->
   使用校验和文件检查 kubectl 可执行二进制文件：

   ```bash
   echo "$(<kubectl.sha256) kubectl" | sha256sum --check
   ```

   <!--
   If valid, the output is:
   -->
   如果合法，则输出为：

   ```bash
   kubectl: OK
   ```

   <!--
   If the check fails, `sha256` exits with nonzero status and prints output similar to:
   -->
   如果检查失败，则 `sha256` 退出且状态值非 0 并打印类似如下输出：

   ```bash
   kubectl: FAILED
   sha256sum: WARNING: 1 computed checksum did NOT match
   ```

   {{< note >}}
   <!--
   Download the same version of the binary and checksum.
   -->
   所下载的二进制可执行文件和校验和文件须是同一版本。
   {{< /note >}}


<!--
1. Install kubectl
-->
3. 安装 kubectl

   ```bash
   sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
   ```

   <!--
   If you do not have root access on the target system, you can still install kubectl to the `~/.local/bin` directory:
   -->
   如果你并不拥有目标系统的 root 访问权限，你仍可以将 kubectl 安装到
   `~/.local/bin` 目录下：

   ```bash
   mkdir -p ~/.local/bin/kubectl
   mv ./kubectl ~/.local/bin/kubectl
   # 之后将 ~/.local/bin/kubectl 添加到环境变量 $PATH 中
   ```

<!--
1. Test to ensure the version you installed is up-to-date:
-->
4. 测试你所安装的版本是最新的：

   ```
   kubectl version --client
   ```

<!--
### Install using native package management
-->
### 使用原生包管理器安装    {#install-using-native-package-management}

{{< tabs name="kubectl_install" >}}
{{< tab name="Ubuntu、Debian 或 HypriotOS" codelang="bash" >}}
sudo apt-get update && sudo apt-get install -y apt-transport-https gnupg2 curl
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -
echo "deb https://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee -a /etc/apt/sources.list.d/kubernetes.list
sudo apt-get update
sudo apt-get install -y kubectl
{{< /tab >}}

{{< tab name="CentOS、RHEL 或 Fedora" codelang="bash" >}}
cat <<EOF > /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://packages.cloud.google.com/yum/repos/kubernetes-el7-x86_64
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://packages.cloud.google.com/yum/doc/yum-key.gpg https://packages.cloud.google.com/yum/doc/rpm-package-key.gpg
EOF
yum install -y kubectl
{{< /tab >}}
{{< /tabs >}}

<!--
### Install using other package management
-->
### 使用其他包管理器安装 {#install-using-other-package-management}

{{< tabs name="other_kubectl_install" >}}
{{% tab name="Snap" %}}
<!--
If you are on Ubuntu or another Linux distribution that support [snap](https://snapcraft.io/docs/core/install) package manager, kubectl is available as a [snap](https://snapcraft.io/) application.
-->
如果你使用 Ubuntu 或者其他支持 [snap](https://snapcraft.io/docs/core/install)
包管理器的 Linux 发行版，kubeclt 可以作为 [Snap](https://snapcraft.io)
应用来安装：

```shell
snap install kubectl --classic

kubectl version --client
```

{{% /tab %}}

{{% tab name="Homebrew" %}}
<!--
If you are on Linux and using [Homebrew](https://docs.brew.sh/Homebrew-on-Linux) package manager, kubectl is available for [installation](https://docs.brew.sh/Homebrew-on-Linux#install).
-->
如果你在使用 Linux 且使用 [Homebrew](https://docs.brew.sh/Homebrew-on-Linux) 包管理器，
kubectl 也可以用这种方式[安装](https://docs.brew.sh/Homebrew-on-Linux#install)。

```shell
brew install kubectl

kubectl version --client
```

{{% /tab %}}

{{< /tabs >}}

<!--
## Install kubectl on macOS

### Install kubectl binary with curl on macOS
-->
## 在 macOS 上安装 kubectl

### 在 macOS 上使用 curl 安装 kubectl 可执行文件

<!--
1. Download the latest release:
-->
1. 下载最新发行版本：

   ```bash
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/amd64/kubectl"
   ```

   <!--
   To download a specific version, replace the `$(curl -L -s https://dl.k8s.io/release/stable.txt)` portion of the command with the specific version.

   For example, to download version {{< param "fullversion" >}} on macOS, type:
   -->
   要下载特定版本，可将上面命令中的 `$(curl -L -s https://dl.k8s.io/release/stable.txt)`
   部分替换成你想要的版本。

   例如，要在 macOS 上安装版本 {{< param "fullversion" >}}，输入：

   ```bash
   curl -LO https://dl.k8s.io/release/{{< param "fullversion" >}}/bin/darwin/amd64/kubectl
   ```

<!--
1. Validate the binary (optional)
-->
2. 检查二进制可执行文件（可选操作）

   <!--
   Download the kubectl checksum file:
   -->
   下载 kubectl 校验和文件：

   ```bash
   curl -LO "https://dl.k8s.io/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/amd64/kubectl.sha256"
   ```

   <!--
   Validate the kubectl binary against the checksum file:
   -->
   使用校验和文件检查 kubectl 二进制可执行文件：

   ```bash
   echo "$(<kubectl.sha256)  kubectl" | shasum -a 256 --check
   ```

   <!--
   If valid, the output is:
   -->
   如果合法，则输出为：

   ```bash
   kubectl: OK
   ```

   <!--
   If the check fails, `shasum` exits with nonzero status and prints output similar to:
   -->
   如果检查失败，则 `shasum` 退出且状态值为非 0，并打印类似如下的输出：

   ```bash
   kubectl: FAILED
   shasum: WARNING: 1 computed checksum did NOT match
   ```

   {{< note >}}
   <!--
   Download the same version of the binary and checksum.
   -->
   下载的二进制可执行文件和校验和文件须为同一版本。
   {{< /note >}}

<!--
1. Make the kubectl binary executable.
-->
3. 设置 kubectl 二进制文件为可执行模式

   ```bash
   chmod +x ./kubectl
   ```

<!--
1. Move the kubectl binary to a file location on your system `PATH`.
-->
4. 将 kubectl 二进制文件移动到系统 `PATH` 环境变量中的某个位置：

   ```bash
   sudo mv ./kubectl /usr/local/bin/kubectl && \
   sudo chown root: /usr/local/bin/kubectl
   ```

<!--
4. Test to ensure the version you installed is up-to-date:
-->
5. 测试以确保所安装的版本是最新的：

   ```bash
   kubectl version --client
   ```

<!--
### Install with Homebrew on macOS

If you are on macOS and using [Homebrew](https://brew.sh/) package manager, you can install kubectl with Homebrew.
-->
### 在 macOS 上使用 Homebrew 安装    {#install-with-homebrew-on-macos}

如果你使用的是 macOS 系统且使用 [Homebrew](https://brew.sh/) 包管理器，
你可以使用 Homebrew 来安装 kubectl。

<!--
1. Run the installation command:
-->
1. 运行安装命令：

   ```bash
   brew install kubectl 
   ```
   
   <!--
   or
   -->
   或者
   
   ```bash
   brew install kubernetes-cli
   ```

<!--
1. Test to ensure the version you installed is sufficiently up-to-date:
-->
2. 测试以确保你安装的版本是最新的：

    ```bash
    kubectl version --client
    ```

<!--
### Install with Macports on macOS

If you are on macOS and using [Macports](https://macports.org/) package manager, you can install kubectl with Macports.
-->
### 在 macOS 上用 Macports 安装 kubectl

如果你使用的是 macOS 系统并使用 [Macports](https://macports.org/) 包管理器，
你可以通过 Macports 安装 kubectl。

<!--
1. Run the installation command:
-->
1. 运行安装命令：

   ```bash
   sudo port selfupdate
   sudo port install kubectl
   ```

<!--
2. Test to ensure the version you installed is sufficiently up-to-date:
-->
2. 测试以确保你安装的版本是最新的：

   ```bash
   kubectl version --client
   ```

<!--
## Install kubectl on Windows   {#install-kubectl-on-windows}

### Install kubectl binary with curl on Windows
-->
## 在 Windows 上安装 kubectl   {#install-kubectl-on-windows}

### 在 Windows 上使用 curl 安装 kubectl 二进制文件

<!--
1. Download the [latest release {{< param "fullversion" >}}](https://dl.k8s.io/release/{{< param "fullversion" >}}/bin/windows/amd64/kubectl.exe).

   Or if you have `curl` installed, use this command:
-->
1. 下载[最新发行版本 {{< param "fullversion" >}}](https://dl.k8s.io/release/{{< param "fullversion" >}}/bin/windows/amd64/kubectl.exe)。

   或者如何你安装了 `curl`，使用下面的命令：

   ```bash
   curl -LO https://dl.k8s.io/release/{{< param "fullversion" >}}/bin/windows/amd64/kubectl.exe
   ```

   <!--
   To find out the latest stable version (for example, for scripting), take a look at [https://dl.k8s.io/release/stable.txt](https://dl.k8s.io/release/stable.txt).
   -->
   要了解哪个是最新的稳定版本（例如，出于脚本编写目的），可查看
   [https://dl.k8s.io/release/stable.txt](https://dl.k8s.io/release/stable.txt)。

<!--
1. Validate the binary (optional)
-->
2. 验证二进制可执行文件（可选操作）

   <!--
   Download the kubectl checksum file:
   -->
   下载 kubectl 校验和文件：

   ```powershell
   curl -LO https://dl.k8s.io/{{< param "fullversion" >}}/bin/windows/amd64/kubectl.exe.sha256
   ```

   <!--
   Validate the kubectl binary against the checksum file:
   -->
   使用校验和文件验证 kubectl 可执行二进制文件：

   <!--
   - Using Command Prompt to manually compare `CertUtil`'s output to the checksum file downloaded:
   -->
   - 使用命令行提示符（Commmand Prompt）来手动比较 `CertUtil` 的输出与
     所下载的校验和文件：

     ```cmd
     CertUtil -hashfile kubectl.exe SHA256
     type kubectl.exe.sha256
     ```

   <!--
   - Using PowerShell to automate the verification using the `-eq` operator to get a `True` or `False` result:
   -->
   - 使用 PowerShell 的 `-eq` 操作符来自动完成校验操作，获得 `True` 或 `False` 结果：

     ```powershell
     $($(CertUtil -hashfile .\kubectl.exe SHA256)[1] -replace " ", "") -eq $(type .\kubectl.exe.sha256)
     ```

<!--
1. Add the binary in to your PATH.
-->
3. 将可执行文件放到 PATH 目录下。

<!--
1. Test to ensure the version of `kubectl` is the same as downloaded:
-->
4. 测试以确定所下载的 `kubectl` 版本是正确的的：

   ```cmd
   kubectl version --client
   ```

<!--
[Docker Desktop for Windows](https://docs.docker.com/docker-for-windows/#kubernetes) adds its own version of `kubectl` to PATH.
If you have installed Docker Desktop before, you may need to place your PATH entry before the one added by the Docker Desktop installer or remove the Docker Desktop's `kubectl`.
-->
{{< note >}}
[Docker Desktop for Windows](https://docs.docker.com/docker-for-windows/#kubernetes)
会将自己的 `kubectl` 程序添加到 PATH 中。
如果你之前安装过 Docker Desktop，你可能需要将新安装的 PATH 项放到 Docker Desktop
安装程序所添加的目录之前，或者干脆删除 Docker Desktop 所安装的 `kubectl`。
{{< /note >}}

<!--
## Install with PowerShell from PSGallery

If you are on Windows and using [PowerShell Gallery](https://www.powershellgallery.com/) package manager, you can install and update kubectl with PowerShell.
-->
## 使用 PowerShell 从 PSGallery 安装 kubectl

如果你使用的是 Windows 系统并使用 [Powershell Gallery](https://www.powershellgallery.com/)
软件包管理器，你可以使用 PowerShell 安装和更新 kubectl。

<!--
1. Run the installation commands (making sure to specify a `DownloadLocation`):
-->
1. 运行安装命令（确保指定 `DownloadLocation`）：

   ```powershell
   Install-Script -Name 'install-kubectl' -Scope CurrentUser -Force
   install-kubectl.ps1 [-DownloadLocation <路径名>]
   ```

   <!--
   If you do not specify a `DownloadLocation`, `kubectl` will be installed in the user's `temp` Directory.
   -->
   {{< note >}}
   如果你没有指定 `DownloadLocation`，那么 `kubectl` 将安装在用户的 `temp` 目录中。
   {{< /note >}}

   <!--
   The installer creates `$HOME/.kube` and instructs it to create a config file
   -->
   安装程序创建 `$HOME/.kube` 目录，并指示它创建配置文件

<!--
2. Test to ensure the version you installed is up-to-date:
-->
2. 测试以确保你安装的版本是最新的：

   ```powershell
   kubectl version --client
   ```

<!--
Updating the installation is performed by rerunning the two commands listed in step 1.
-->
{{< note >}}
通过重新运行步骤 1 中列出的两个命令可以更新安装。
{{< /note >}}

<!--
### Install on Windows using Chocolatey or Scoop
-->
### 在 Windows 系统上用 Chocolatey 或者 Scoop 安装

<!--
1. To install kubectl on Windows you can use either [Chocolatey](https://chocolatey.org) package manager or [Scoop](https://scoop.sh) command-line installer.
-->
1. 要在 Windows 上用 [Chocolatey](https://chocolatey.org) 或者
   [Scoop](https://scoop.sh) 命令行安装程序安装 kubectl：

   {{< tabs name="kubectl_win_install" >}}
   {{% tab name="choco" %}}
   ```powershell
   choco install kubernetes-cli
   ```
   {{% /tab %}}
   {{% tab name="scoop" %}}
   ```powershell
   scoop install kubectl
   ```
   {{% /tab %}}
   {{< /tabs >}}

<!--
1. Test to ensure the version you installed is up-to-date:
-->
2. 测试以确保你安装的版本是最新的：

   ```
   kubectl version --client
   ```

<!--
1. Navigate to your home directory:
-->
3. 切换到你的 HOME 目录：

   ```powershell
   # 如果你在使用 cmd.exe，运行 cd %USERPROFILE%
   cd ~
   ```

<!--
1. Create the `.kube` directory:
-->
4. 创建 `.kube` 目录：

   ```powershell
   mkdir .kube
   ```

<!--
1. Change to the `.kube` directory you just created:
-->
5. 进入到刚刚创建的 `.kube` 目录：

   ```powershell
   cd .kube
   ```

<!--
1. Configure kubectl to use a remote Kubernetes cluster:
-->
6. 配置 kubectl 以使用远程 Kubernetes 集群：

   ```powershell
   New-Item config -type file
   ```

<!--
Edit the config file with a text editor of your choice, such as Notepad.
-->
{{< note >}}
使用你喜欢的文本编辑器，例如 Notepad，编辑此配置文件。
{{< /note >}}


<!--
## Download as part of the Google Cloud SDK

You can install kubectl as part of the Google Cloud SDK.
-->
## 将 kubectl 作为 Google Cloud SDK 的一部分下载

kubectl 可以作为 Google Cloud SDK 的一部分进行安装。

<!--
1. Install the [Google Cloud SDK](https://cloud.google.com/sdk/).

2. Run the `kubectl` installation command:
-->
1. 安装 [Google Cloud SDK](https://cloud.google.com/sdk/)。

2. 运行以下命令安装 `kubectl`：

   ```shell
   gcloud components install kubectl
   ```

<!--
3. Test to ensure the version you installed is up-to-date:
-->
3. 测试以确保你安装的版本是最新的：

   ```shell
   kubectl version --client
   ```

<!--
## Verifying kubectl configuration

In order for kubectl to find and access a Kubernetes cluster, it needs a
[kubeconfig file](/docs/concepts/configuration/organize-cluster-access-kubeconfig/),
which is created automatically when you create a cluster using
[kube-up.sh](https://github.com/kubernetes/kubernetes/blob/master/cluster/kube-up.sh)
or successfully deploy a Minikube cluster.
By default, kubectl configuration is located at `~/.kube/config`.
-->
## 验证 kubectl 配置   {#verifying-kubectl-configuration}

kubectl 需要一个
[kubeconfig 配置文件](/zh/docs/concepts/configuration/organize-cluster-access-kubeconfig/)
使其找到并访问 Kubernetes 集群。当你使用
[kube-up.sh](https://github.com/kubernetes/kubernetes/blob/master/cluster/kube-up.sh)
创建 Kubernetes 集群或者使用已经部署好的 Minikube 集群时，
会自动生成 kubeconfig 配置文件。
默认情况下，kubectl 的配置文件位于 `~/.kube/config`。

<!--
Check that kubectl is properly configured by getting the cluster state:
-->
通过获取集群状态检查 kubectl 是否被正确配置：

```shell
kubectl cluster-info
```

<!--
If you see a URL response, kubectl is correctly configured to access your cluster.

If you see a message similar to the following, kubectl is not configured correctly or is not able to connect to a Kubernetes cluster.
-->
如果你看到一个 URL 被返回，那么 kubectl 已经被正确配置，
能够正常访问你的 Kubernetes 集群。

如果你看到类似以下的信息被返回，那么 kubectl 没有被正确配置，
无法正常访问你的 Kubernetes 集群。

```
The connection to the server <server-name:port> was refused - did you specify the right host or port?
```

<!--
For example, if you are intending to run a Kubernetes cluster on your laptop (locally), you will need a tool like Minikube to be installed first and then re-run the commands stated above.

If kubectl cluster-info returns the url response but you can't access your cluster, to check whether it is configured properly, use:
-->
例如，如果你打算在笔记本电脑（本地）上运行 Kubernetes 集群，则需要首先安装
minikube 等工具，然后重新运行上述命令。

如果 kubectl cluster-info 能够返回 URL 响应，但你无法访问你的集群，可以使用
下面的命令检查配置是否正确：

```shell
kubectl cluster-info dump
```

<!--
## Optional kubectl configurations

### Enabling shell autocompletion

kubectl provides autocompletion support for Bash and Zsh, which can save you a lot of typing.

Below are the procedures to set up autocompletion for Bash (including the difference between Linux and macOS) and Zsh.
-->
## 可选的 kubectl 配置

### 启用 shell 自动补全功能

kubectl 为 Bash 和 Zsh 支持自动补全功能，可以节省大量输入！

下面是设置 Bash 与 Zsh 下自动补齐的过程（包括 Linux 与 macOS 的差异）。

{{< tabs name="kubectl_autocompletion" >}}

{{% tab name="Linux 上的 Bash" %}}

<!--
### Introduction

The kubectl completion script for Bash can be generated with the command `kubectl completion bash`. Sourcing the completion script in your shell enables kubectl autocompletion.

However, the completion script depends on [**bash-completion**](https://github.com/scop/bash-completion), which means that you have to install this software first (you can test if you have bash-completion already installed by running `type _init_completion`).
-->
#### 介绍

用于 Bash 的 kubectl 自动补齐脚本可以用 `kubectl completion bash` 命令生成。
在 Shell 环境中引用自动补齐脚本就可以启用 kubectl 自动补齐。

不过，补齐脚本依赖于 [**bash-completion**](https://github.com/scop/bash-completion) 软件包，
这意味着你必须先安装 bash-completion（你可以通过运行 `type _init_completion`）来测试是否
你已经安装了这个软件）。

<!--
### Install bash-completion

bash-completion is provided by many package managers (see [here](https://github.com/scop/bash-completion#installation)). You can install it with `apt-get install bash-completion` or `yum install bash-completion`, etc.

The above commands create `/usr/share/bash-completion/bash_completion`, which is the main script of bash-completion. Depending on your package manager, you have to manually source this file in your `~/.bashrc` file.

To find out, reload your shell and run `type _init_completion`. If the command succeeds, you're already set, otherwise add the following to your `~/.bashrc` file:
-->
### 安装 bash-completion

很多包管理器都提供 bash-completion（参见[这里](https://github.com/scop/bash-completion#installation)）。
你可以通过 `apt-get install bash-completion` 或 `yum install bash-completion` 来安装。

上述命令会创建 `/usr/share/bash-completion/bash_completion`，也就是 bash-completion 的主脚本。
取决于所用的包管理器，你可能必须在你的 `~/.bashrc` 中通过 `source` 源引此文件。

要搞清楚这一点，可以重新加载你的 Shell 并运行 `type _init_completion`。
如果命令成功，一切就绪；否则你就需要将下面的内容添加到你的 `~/.bashrc`
文件中：

```bash
source /usr/share/bash-completion/bash_completion
```

之后，重新加载你的 Shell 并运行 `type _init_completion` 来检查 bash-completion 是否已
正确安装。

<!--
### Enable kubectl autocompletion

You now need to ensure that the kubectl completion script gets sourced in all your shell sessions. There are two ways in which you can do this:
-->
### 启用 kubectl 自动补齐

你现在需要确定在你的所有 Shell 会话中都源引了 kubectl 自动补齐脚本。
实现这点有两种方式：

<!--
- Source the completion script in your `~/.bashrc` file:
-->
- 在 `~/.bashrc` 文件中源引自动补齐脚本

  ```bash
  echo 'source <(kubectl completion bash)' >>~/.bashrc
  ```

<!--
- Add the completion script to the `/etc/bash_completion.d` directory:
-->
- 将自动补齐脚本添加到目录 `/etc/bash_completion.d`：

  ```bash
  kubectl completion bash >/etc/bash_completion.d/kubectl
  ```

<!--
If you have an alias for kubectl, you can extend shell completion to work with that alias:
-->
如果你为 kubectl 命令设置了别名（alias），你可以扩展 Shell 补齐，使之能够与别名一起使用：

```bash
echo 'alias k=kubectl' >>~/.bashrc
echo 'complete -F __start_kubectl k' >>~/.bashrc
```

<!--
- Source the completion script in your `~/.bashrc` file:
-->

<!--
bash-completion sources all completion scripts in `/etc/bash_completion.d`.
-->
{{< note >}}
bash-completion 会自动源引 `/etc/bash_completion.d` 下的所有自动补齐脚本。
{{< /note >}}

<!--
Both approaches are equivalent. After reloading your shell, kubectl autocompletion should be working.
-->
两种方法是等价的。重新加载 Shell 之后，kubectl 的自动补齐应该能够使用了。

{{% /tab %}}

{{% tab name="macOS 上的 Bash" %}}

<!--
### Introduction

The kubectl completion script for Bash can be generated with `kubectl completion bash`. Sourcing this script in your shell enables kubectl completion.

However, the kubectl completion script depends on [**bash-completion**](https://github.com/scop/bash-completion) which you thus have to previously install.
-->
### 介绍

用于 Bash 的 kubectl 自动补齐脚本可以用 `kubectl completion bash` 命令生成。
在 Shell 环境中引用自动补齐脚本就可以启用 kubectl 自动补齐。
不过，补齐脚本依赖于 [**bash-completion**](https://github.com/scop/bash-completion) 软件包，
你必须预先安装。

<!--
There are two versions of bash-completion, v1 and v2. V1 is for Bash 3.2
(which is the default on macOS), and v2 is for Bash 4.1+. The kubectl
completion script **doesn't work** correctly with bash-completion v1 and Bash
3.2. It requires **bash-completion v2** and **Bash 4.1+**. Thus, to be able to
correctly use kubectl completion on macOS, you have to install and use Bash
4.1+
([*instructions*](https://itnext.io/upgrading-bash-on-macos-7138bd1066ba)).
The following instructions assume that you use Bash 4.1+ (that is, any Bash
version of 4.1 or newer).
-->
{{< warning>}}
`bash-completion` 有两个版本，v1 和 v2。
v1 是用于 Bash 3.2 版本的（macOS 上的默认配置），v2 是用于 Bash 4.1 以上版本的。
`kubectl` 补齐脚本 *无法* 在 v1 版本的 bash-completion 和 Bash 3.2 上使用，
需要 **bash-completion v2** 和 **Bash 4.1 以上版本**。
因此，为了在 macOS 上正常使用 kubectl 自动补齐，你需要安装并使用 Bash 4.1+
版本（[*相关指南*](https://itnext.io/upgrading-bash-on-macos-7138bd1066ba)）。
下面的指令假定你在使用 Bash 4.1+（也就是说 Bash 4.1 及以上版本）。
{{< /warning >}}

<!--
### Upgrade Bash

The instructions here assume you use Bash 4.1+. You can check your Bash's version by running:
-->
### 升级 Bash  {#upgrade-bash}

这里的命令假定你使用的是 Bash 4.1+。你可以通过下面的命令来检查 Bash 版本：

```bash
echo $BASH_VERSION
```

<!--
If it is too old, you can install/upgrade it using Homebrew:
-->
如果版本很老，你可以使用 Homebrew 来安装或升级：

```bash
brew install bash
```

<!--
Reload your shell and verify that the desired version is being used:
-->
重新加载 Shell 并验证你使用的版本是期望的版本：

```bash
echo $BASH_VERSION $SHELL
```

<!--
Homebrew usually installs it at `/usr/local/bin/bash`.
-->
Homebrew 通常安装 Bash 到 `/usr/local/bin/bash`。

<!--
### Install bash-completion

{{< note >}}
As mentioned, these instructions assume you use Bash 4.1+, which means you will install bash-completion v2 (in contrast to Bash 3.2 and bash-completion v1, in which case kubectl completion won't work).
{{< /note >}}

You can test if you have bash-completion v2 already installed with `type _init_completion`. If not, you can install it with Homebrew:
-->
### 安装 bash-completion

{{< note >}}
如前所述，这里的指令假定你使用的是 Bash 4.1+，这意味着你会安装 bash-completion
的 v2 版本（与此相对，在 Bash 3.2 版本中的 bash-completion v1 是 kubectl
无法使用的。
{{< /note >}}

你可以通过输入 `type _init_completion` 来测试是否 bash-completion v2 已经安装。
如果没有，可以用 Homebrew 来安装：

```bash
brew install bash-completion@2
```

<!--
As stated in the output of this command, add the following to your `~/.bash_profile` file:
-->
就像命令的输出所提示的，你应该将下面的内容添加到 `~/.bash_profile` 文件中：

```bash
export BASH_COMPLETION_COMPAT_DIR="/usr/local/etc/bash_completion.d"
[[ -r "/usr/local/etc/profile.d/bash_completion.sh" ]] && . "/usr/local/etc/profile.d/bash_completion.sh"
```

<!--
Reload your shell and verify that bash-completion v2 is correctly installed with `type _init_completion`.
-->
重新加载你的 Shell 并运行 `type _init_completion`，验证 bash-completion v2
被正确安装。

<!--
### Enable kubectl autocompletion

You now have to ensure that the kubectl completion script gets sourced in all your shell sessions. There are multiple ways to achieve this:
-->
### 启用 kubectl 自动补齐

你现在需要确保在你的所有 Shell 会话中都源引了 kubectl 自动补齐脚本。
实现这点有两种方式：

<!--
- Source the completion script in your `~/.bash_profile` file:
-->
- 在 `~/.bash_profile` 文件中源引自动补齐脚本

  ```bash
  echo 'source <(kubectl completion bash)' >>~/.bash_profile
  ```

<!--
- Add the completion script to the `/usr/local/etc/bash_completion.d` directory:
-->
- 将自动补齐脚本添加到目录 `/usr/local/etc/bash_completion.d`：

  ```bash
  kubectl completion bash >/usr/local/etc/bash_completion.d/kubectl
  ```

<!--
If you have an alias for kubectl, you can extend shell completion to work with that alias:
-->
- 如果你为 kubectl 命令设置了别名（alias），你可以扩展 Shell 补齐，使之能够与别名一起使用：

  ```bash
  echo 'alias k=kubectl' >>~/.bash_profile
  echo 'complete -F __start_kubectl k' >>~/.bash_profile
  ```

<!--
- If you installed kubectl with Homebrew (as explained [above](#install-with-homebrew-on-macos)), then the kubectl completion script should already be in `/usr/local/etc/bash_completion.d/kubectl`. In that case, you don't need to do anything.

  The Homebrew installation of bash-completion v2 sources all the files in the `BASH_COMPLETION_COMPAT_DIR` directory, that's why the latter two methods work.

In any case, after reloading your shell, kubectl completion should be working.
-->
- 如果你是所有 Homebrew 来安装 kubectl（如[前文](#install-with-homebrew-on-macos)所述）, 
  kubectl 补齐脚本应该已经位于 `/usr/local/etc/bash_completion.d/kubectl` 目录下。
  在这种情况下，你就不用做任何操作了。

<!--
The Homebrew installation of bash-completion v2 sources all the files in the
`BASH_COMPLETION_COMPAT_DIR` directory, that's why the latter two methods work.
-->
{{< note >}}
Homebrew 安装 bash-completion v2 时会源引 `BASH_COMPLETION_COMPAT_DIR` 目录下的所有
文件，这是为什么后面两种方法也可行的原因。
{{< /note >}}

<!--
In any case, after reloading your shell, kubectl completion should be working.
-->
在任何一种情况下，重新加载 Shell 之后，kubectl 的自动补齐应该可以工作了。

{{% /tab %}}

{{% tab name="Zsh" %}}

<!--
The kubectl completion script for Zsh can be generated with the command `kubectl completion zsh`. Sourcing the completion script in your shell enables kubectl autocompletion.

To do so in all your shell sessions, add the following to your `~/.zshrc` file:
-->
Zsh 的 kubectl 补齐脚本可通过 `kubectl completion zsh` 命令来生成。
在 Shell 环境中引用自动补齐脚本就可以启用 kubectl 自动补齐。

```zsh
source <(kubectl completion zsh)
```

<!--
If you have an alias for kubectl, you can extend shell completion to work with that alias:
-->
如果你为 kubectl 命令设置了别名（alias），你可以扩展 Shell 补齐，使之能够与别名一起使用：

```zsh
echo 'alias k=kubectl' >>~/.zshrc
echo 'complete -F __start_kubectl k' >>~/.zshrc
```

<!--
After reloading your shell, kubectl autocompletion should be working.
-->
重新加载 Shell 之后，kubectl 的自动补齐应该可以工作了。

<!--
If you get an error like `complete:13: command not found: compdef`, then add the following to the beginning of your `~/.zshrc` file:
-->
如果你看到类似 `complete:13: command not found: compdef` 这种错误信息，
可以将下面的命令添加到你的 `~/.zshrc` 文件的文件头：

```zsh
autoload -Uz compinit
compinit
```

{{% /tab %}}

{{< /tabs >}}

## {{% heading "whatsnext" %}}

<!--
* [Install Minikube](https://minikube.sigs.k8s.io/docs/start/)
* See the [getting started guides](/docs/setup/) for more about creating clusters.
* [Learn how to launch and expose your application.](/docs/tasks/access-application-cluster/service-access-application-cluster/)
* If you need access to a cluster you didn't create, see the
  [Sharing Cluster Access document](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/).
* Read the [kubectl reference docs](/docs/reference/kubectl/kubectl/)
-->
* [安装 Minikube](https://minikube.sigs.k8s.io/docs/start/)
* 参阅[入门指南](/zh/docs/setup/)，了解创建集群相关的信息
* 了解如何[启动和暴露你的应用](/zh/docs/tasks/access-application-cluster/service-access-application-cluster/)
* 如果你需要访问别人创建的集群，参考
  [共享集群访问文档](/zh/docs/tasks/access-application-cluster/configure-access-multiple-clusters/)
* 阅读 [kubectl 参考文档](/zh/docs/reference/kubectl/kubectl/)

