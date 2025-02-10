---
title: 在 Windows 上安装 kubectl
content_type: task
weight: 10
---
<!--
reviewers:
- mikedanese
title: Install and Set Up kubectl on Windows
content_type: task
weight: 10
-->

## {{% heading "prerequisites" %}}

<!--
You must use a kubectl version that is within one minor version difference of
your cluster. For example, a v{{< skew currentVersion >}} client can communicate
with v{{< skew currentVersionAddMinor -1 >}}, v{{< skew currentVersionAddMinor 0 >}},
and v{{< skew currentVersionAddMinor 1 >}} control planes.
Using the latest compatible version of kubectl helps avoid unforeseen issues.
-->
kubectl 版本和集群版本之间的差异必须在一个小版本号内。
例如：v{{< skew currentVersion >}} 版本的客户端能与 v{{< skew currentVersionAddMinor -1 >}}、
v{{< skew currentVersionAddMinor 0 >}} 和 v{{< skew currentVersionAddMinor 1 >}} 版本的控制面通信。
用最新兼容版的 kubectl 有助于避免不可预见的问题。

<!--
## Install kubectl on Windows

The following methods exist for installing kubectl on Windows:
-->
## 在 Windows 上安装 kubectl {#install-kubectl-on-windows}

在 Windows 系统中安装 kubectl 有如下几种方法：

<!--
- [Install kubectl binary on Windows (via direct download or curl)](#install-kubectl-binary-on-windows-via-direct-download-or-curl)
- [Install on Windows using Chocolatey, Scoop, or winget](#install-nonstandard-package-tools)
-->
- [在 Windows 上安装 kubectl（通过直接下载或使用 curl）](#install-kubectl-binary-on-windows-via-direct-download-or-curl)
- [在 Windows 上用 Chocolatey、Scoop 或 winget 安装](#install-nonstandard-package-tools)

<!--
### Install kubectl binary on Windows (via direct download or curl)
-->
### 在 Windows 上安装 kubectl（通过直接下载或使用 curl） {#install-kubectl-binary-on-windows-via-direct-download-or-curl}

<!--
1. You have two options for installing kubectl on your Windows device
   
   - Direct download:

     Download the latest {{< skew currentVersion >}} patch release binary directly for your specific architecture by visiting the [Kubernetes release page](https://kubernetes.io/releases/download/#binaries). Be sure to select the correct binary for your architecture (e.g., amd64, arm64, etc.).

   - Using curl:

     If you have `curl` installed, use this command:
-->
1. 你有两种方式可以在 Windows 设备上安装 kubectl

   直接下载：

   通过访问 [Kubernetes 发布页面](https://kubernetes.io/releases/download/#binaries)
   直接下载特定于你的体系结构的二进制文件的最新 {{< skew currentVersion >}} 补丁版本。
   请务必选择适用于你的体系结构的二进制文件（例如，amd64、arm64 等）。

   使用 curl：

   如果你已安装 `curl`，可以使用以下命令：

   ```powershell
   curl.exe -LO "https://dl.k8s.io/release/v{{< skew currentPatchVersion >}}/bin/windows/amd64/kubectl.exe"
   ```

   {{< note >}}
   <!--
   To find out the latest stable version (for example, for scripting), take a look at
   [https://dl.k8s.io/release/stable.txt](https://dl.k8s.io/release/stable.txt).
   -->
   要想找到最新稳定的版本（例如：为了编写脚本），可以看看这里 [https://dl.k8s.io/release/stable.txt](https://dl.k8s.io/release/stable.txt)。
   {{< /note >}}

<!--
1. Validate the binary (optional)

   Download the `kubectl` checksum file:
-->
2. 验证该可执行文件（可选步骤）

   下载 `kubectl` 校验和文件：

   ```powershell
   curl.exe -LO "https://dl.k8s.io/v{{< skew currentPatchVersion >}}/bin/windows/amd64/kubectl.exe.sha256"
   ```

   <!--
   Validate the `kubectl` binary against the checksum file:
   -->
   基于校验和文件，验证 `kubectl` 的可执行文件：

   <!--
   - Using Command Prompt to manually compare `CertUtil`'s output to the checksum file downloaded:
   -->

   - 在命令行环境中，手工对比 `CertUtil` 命令的输出与校验和文件：

     ```cmd
     CertUtil -hashfile kubectl.exe SHA256
     type kubectl.exe.sha256
     ```

   <!--
   - Using PowerShell to automate the verification using the `-eq` operator to
     get a `True` or `False` result:
   -->

   - 用 PowerShell 自动验证，用运算符 `-eq` 来直接取得 `True` 或 `False` 的结果：

     ```powershell
     $(Get-FileHash -Algorithm SHA256 .\kubectl.exe).Hash -eq $(Get-Content .\kubectl.exe.sha256)
     ```

<!--
1. Append or prepend the `kubectl` binary folder to your `PATH` environment variable.

1. Test to ensure the version of `kubectl` is the same as downloaded:
-->
3. 将 `kubectl` 二进制文件夹追加或插入到你的 `PATH` 环境变量中。

4. 测试一下，确保此 `kubectl` 的版本和期望版本一致：

   ```cmd
   kubectl version --client
   ```

   <!--
   Or use this for detailed view of version:
   -->
   或者使用下面命令来查看版本的详细信息：

   ```cmd
   kubectl version --client --output=yaml
   ```

{{< note >}}
<!--
[Docker Desktop for Windows](https://docs.docker.com/docker-for-windows/#kubernetes)
adds its own version of `kubectl` to `PATH`. If you have installed Docker Desktop before,
you may need to place your `PATH` entry before the one added by the Docker Desktop
installer or remove the Docker Desktop's `kubectl`.
-->
[Windows 版的 Docker Desktop](https://docs.docker.com/docker-for-windows/#kubernetes)
将其自带版本的 `kubectl` 添加到 `PATH`。
如果你之前安装过 Docker Desktop，可能需要把此 `PATH` 条目置于 Docker Desktop 安装的条目之前，
或者直接删掉 Docker Desktop 的 `kubectl`。
{{< /note >}}

<!--
### Install on Windows using Chocolatey, Scoop, or winget {#install-nonstandard-package-tools}
-->
### 在 Windows 上用 Chocolatey、Scoop 或 winget 安装 {#install-nonstandard-package-tools}

<!--
1. To install kubectl on Windows you can use either [Chocolatey](https://chocolatey.org)
   package manager, [Scoop](https://scoop.sh) command-line installer, or
   [winget](https://learn.microsoft.com/en-us/windows/package-manager/winget/) package manager.
-->
1. 要在 Windows 上安装 kubectl，你可以使用包管理器 [Chocolatey](https://chocolatey.org)、
   命令行安装器 [Scoop](https://scoop.sh) 或包管理器 [winget](https://learn.microsoft.com/zh-cn/windows/package-manager/winget/)。

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
   {{% tab name="winget" %}}
   ```powershell
   winget install -e --id Kubernetes.kubectl
   ```
   {{% /tab %}}
   {{< /tabs >}}

<!--
1. Test to ensure the version you installed is up-to-date:
-->
2. 测试一下，确保安装的是最新版本：

   ```powershell
   kubectl version --client
   ```

<!--
1. Navigate to your home directory:
-->
3. 导航到你的 home 目录：

   ```powershell
   # 当你用 cmd.exe 时，则运行： cd %USERPROFILE%
   cd ~
   ```

<!--
1. Create the `.kube` directory:
-->
4. 创建目录 `.kube`：

   ```powershell
   mkdir .kube
   ```

<!--
1. Change to the `.kube` directory you just created:
-->
5. 切换到新创建的目录 `.kube`：

   ```powershell
   cd .kube
   ```

<!--
1. Configure kubectl to use a remote Kubernetes cluster:
 -->
6. 配置 kubectl，以接入远程的 Kubernetes 集群：

   ```powershell
   New-Item config -type file
   ```

{{< note >}}
<!--
Edit the config file with a text editor of your choice, such as Notepad.
-->
编辑配置文件，你需要先选择一个文本编辑器，比如 Notepad。
{{< /note >}}

<!--
## Verify kubectl configuration
-->
## 验证 kubectl 配置 {#verify-kubectl-configration}

{{< include "included/verify-kubectl.md" >}}

<!--
## Optional kubectl configurations and plugins

### Enable shell autocompletion
-->
## kubectl 可选配置和插件 {#optional-kubectl-configurations}

### 启用 shell 自动补全功能 {#enable-shell-autocompletion}

<!--
kubectl provides autocompletion support for Bash, Zsh, Fish, and PowerShell,
which can save you a lot of typing.

Below are the procedures to set up autocompletion for PowerShell.
-->
kubectl 为 Bash、Zsh、Fish 和 PowerShell 提供自动补全功能，可以为你节省大量的输入。

下面是设置 PowerShell 自动补全功能的操作步骤。

{{< include "included/optional-kubectl-configs-pwsh.md" >}}

<!--
### Install `kubectl convert` plugin
-->
### 安装 `kubectl convert` 插件   {#install-kubectl-convert-plugin}

{{< include "included/kubectl-convert-overview.md" >}}

<!--
1. Download the latest release with the command:
-->
1. 用以下命令下载最新发行版：

   ```powershell
   curl.exe -LO "https://dl.k8s.io/release/v{{< skew currentPatchVersion >}}/bin/windows/amd64/kubectl-convert.exe"
   ```

<!--
1. Validate the binary (optional).
-->
2. 验证该可执行文件（可选步骤）。

   <!--
   Download the `kubectl-convert` checksum file:
   -->
   下载 `kubectl-convert` 校验和文件：

   ```powershell
   curl.exe -LO "https://dl.k8s.io/v{{< skew currentPatchVersion >}}/bin/windows/amd64/kubectl-convert.exe.sha256"
   ```

   <!--
   Validate the `kubectl-convert` binary against the checksum file:
   -->
   基于校验和验证 `kubectl-convert` 的可执行文件：

   <!--
   - Using Command Prompt to manually compare `CertUtil`'s output to the checksum file downloaded:
   -->

   - 用提示的命令对 `CertUtil` 的输出和下载的校验和文件进行手动比较。

     ```cmd
     CertUtil -hashfile kubectl-convert.exe SHA256
     type kubectl-convert.exe.sha256
     ```

   <!--
   - Using PowerShell to automate the verification using the `-eq` operator to get
     a `True` or `False` result:
   -->

   - 使用 PowerShell `-eq` 操作使验证自动化，获得 `True` 或者 `False` 的结果：

     ```powershell
     $($(CertUtil -hashfile .\kubectl-convert.exe SHA256)[1] -replace " ", "") -eq $(type .\kubectl-convert.exe.sha256)
     ```

<!--
1. Append or prepend the `kubectl-convert` binary folder to your `PATH` environment variable.

1. Verify the plugin is successfully installed.
-->
3. 将 `kubectl-convert` 二进制文件夹附加或添加到你的 `PATH` 环境变量中。

4. 验证插件是否安装成功。

   ```shell
   kubectl convert --help
   ```

   <!--
   If you do not see an error, it means the plugin is successfully installed.
   -->
   如果你没有看到任何错误就代表插件安装成功了。

<!--
1. After installing the plugin, clean up the installation files:
-->
5. 安装插件后，清理安装文件：

   ```powershell
   del kubectl-convert.exe
   del kubectl-convert.exe.sha256
   ```

## {{% heading "whatsnext" %}}

{{< include "included/kubectl-whats-next.md" >}}
