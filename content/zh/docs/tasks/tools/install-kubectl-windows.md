---
title: 在 Windows 上安装 kubectl
content_type: task
weight: 10
card:
  name: tasks
  weight: 20
  title: Windows 安装 kubectl
---
<!-- 
---
reviewers:
- mikedanese
title: Install and Set Up kubectl on Windows
content_type: task
weight: 10
card:
  name: tasks
  weight: 20
  title: Install kubectl on Windows
---
-->

## {{% heading "prerequisites" %}}

<!-- 
You must use a kubectl version that is within one minor version difference of your cluster.
For example, a v1.2 client should work with v1.1, v1.2, and v1.3 master.
Using the latest version of kubectl helps avoid unforeseen issues.
-->
kubectl 版本和集群版本之间的差异必须在一个小版本号内。
例如：v1.2 版本的客户端只能与 v1.1、v1.2 和 v1.3 版本的集群一起工作。
用最新版的 kubectl 有助于避免不可预见的问题。

<!-- 
## Install kubectl on Windows
-->
## 在 Windows 上安装 kubectl {#install-kubectl-on-windows}

<!-- 
The following methods exist for installing kubectl on Windows:
-->
在 Windows 系统中安装 kubectl 有如下几种方法：

- [用 curl 在 Windows 上安装 kubectl](#install-kubectl-binary-with-curl-on-windows)
- [用 PowerShell 从 PSGallery 安装](#install-with-powershell-from-psgallery)
- [在 Windows 上用 Chocolatey 或 Scoop 安装](#install-on-windows-using-chocolatey-or-scoop)
- [作为谷歌云 SDK 的一部分，在 Windows 上安装](#install-on-windows-as-part-of-the-google-cloud-sdk)

<!-- 
### Install kubectl binary with curl on Windows
-->
### 用 curl 在 Windows 上安装 kubectl {#install-kubectl-binary-with-curl-on-windows}

<!-- 
1. Download the [latest release {{< param "fullversion" >}}](https://dl.k8s.io/release/{{< param "fullversion" >}}/bin/windows/amd64/kubectl.exe).

   Or if you have `curl` installed, use this command:
-->
1. 下载 [最新发行版 {{< param "fullversion" >}}](https://dl.k8s.io/release/{{< param "fullversion" >}}/bin/windows/amd64/kubectl.exe)。

   如果你已安装了 `curl`,也可以使用此命令：

   ```powershell
   curl -LO https://dl.k8s.io/release/{{< param "fullversion" >}}/bin/windows/amd64/kubectl.exe
   ```

   <!-- 
      To find out the latest stable version (for example, for scripting), take a look at [https://dl.k8s.io/release/stable.txt](https://dl.k8s.io/release/stable.txt).
   -->
   {{< note >}}
   要想找到最新稳定的版本（例如：为了编写脚本），可以看看这里 [https://dl.k8s.io/release/stable.txt](https://dl.k8s.io/release/stable.txt)。
   {{< /note >}}

   <!-- 
   1. Validate the binary (optional)

      Download the kubectl checksum file:
   -->
1. 验证该可执行文件（可选步骤）
   
   下载 kubectl 校验和文件：

   ```powershell
   curl -LO https://dl.k8s.io/{{< param "fullversion" >}}/bin/windows/amd64/kubectl.exe.sha256
   ```

   <!-- 
   Validate the kubectl binary against the checksum file:
   -->
   基于校验和文件，验证 kubectl 的可执行文件：

   <!-- 
   - Using Command Prompt to manually compare `CertUtil`'s output to the checksum file downloaded:
   -->
   - 在命令行环境中，手工对比 `CertUtil` 命令的输出与校验和文件：

     ```cmd
     CertUtil -hashfile kubectl.exe SHA256
     type kubectl.exe.sha256
     ```

   <!-- 
   - Using PowerShell to automate the verification using the `-eq` operator to get a `True` or `False` result:
   -->
   - 用 PowerShell 自动验证，用运算符 `-eq` 来直接取得 `True` 或 `False` 的结果：

     ```powershell
     $($(CertUtil -hashfile .\kubectl.exe SHA256)[1] -replace " ", "") -eq $(type .\kubectl.exe.sha256)
     ```

   <!-- 
   1. Add the binary in to your `PATH`.

   1. Test to ensure the version of `kubectl` is the same as downloaded:
   -->
1. 将可执行文件的路径添加到 `PATH`。

1. 测试一下，确保此 `kubectl` 的版本和期望版本一致：

   ```cmd
   kubectl version --client
   ```

<!-- 
[Docker Desktop for Windows](https://docs.docker.com/docker-for-windows/#kubernetes) adds its own version of `kubectl` to `PATH`.
If you have installed Docker Desktop before, you may need to place your `PATH` entry before the one added by the Docker Desktop installer or remove the Docker Desktop's `kubectl`.
-->
{{< note >}}
[Windows 版的 Docker Desktop](https://docs.docker.com/docker-for-windows/#kubernetes) 
将其自带版本的 `kubectl` 添加到 `PATH`。
如果你之前安装过 Docker Desktop，可能需要把此 `PATH` 条目置于 Docker Desktop 安装的条目之前，
或者直接删掉 Docker Desktop 的 `kubectl`。
{{< /note >}}

<!-- 
### Install with PowerShell from PSGallery
-->
### 用 PowerShell 从 PSGallery 安装 {#install-with-powershell-from-psgallery}

<!-- 
If you are on Windows and using the [PowerShell Gallery](https://www.powershellgallery.com/) package manager, you can install and update kubectl with PowerShell.
-->
如果你工作在 Windows 平台上，且使用 [PowerShell Gallery](https://www.powershellgallery.com/) 包管理器，
则可以用 PowerShell 安装、更新 kubectl。

<!-- 
1. Run the installation commands (making sure to specify a `DownloadLocation`):
-->
1. 运行安装命令（确保提供了参数 `DownloadLocation`）：

   ```powershell
   Install-Script -Name 'install-kubectl' -Scope CurrentUser -Force
   install-kubectl.ps1 [-DownloadLocation <path>]
   ```

   <!-- 
   If you do not specify a `DownloadLocation`, `kubectl` will be installed in the user's `temp` Directory.
   -->
   {{< note >}}
   如果没有指定 `DownloadLocation`，`kubectl` 则会被安装到用户的 `temp` 目录下。
   {{< /note >}}

   <!-- 
   The installer creates `$HOME/.kube` and instructs it to create a config file.
   -->
   安装程序创建 `$HOME/.kube`，并指示其创建配置文件。

   <!-- 
   1. Test to ensure the version you installed is up-to-date:
   -->
1. 测试一下，确保你安装的是最新版本：

   ```powershell
   kubectl version --client
   ```

<!-- 
Updating the installation is performed by rerunning the two commands listed in step 1.
-->
{{< note >}}
更新安装是通过重新运行步骤 1 中的两个命令而实现。
{{< /note >}}

<!-- 
### Install on Windows using Chocolatey or Scoop
-->
### 在 Windows 上用 Chocolatey 或 Scoop 安装 {#install-on-windows-using-chocolatey-or-scoop}

<!-- 
1. To install kubectl on Windows you can use either [Chocolatey](https://chocolatey.org) package manager or [Scoop](https://scoop.sh) command-line installer.
-->
1. 要在 Windows 上安装 kubectl，你可以使用包管理器 [Chocolatey](https://chocolatey.org) 
   或是命令行安装器 [Scoop](https://scoop.sh)。

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
2. 测试一下，确保安装的是最新版本：

   ```powershell
   kubectl version --client
   ```

   <!-- 
   1. Navigate to your home directory:
   -->
3. 导航到你的 home 目录：

   <!-- 
   # If you're using cmd.exe, run: cd %USERPROFILE%
   -->
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
5. 切换到新创建的目录 `.kube` 

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

<!-- 
Edit the config file with a text editor of your choice, such as Notepad.
-->
{{< note >}}
编辑配置文件，你需要先选择一个文本编辑器，比如 Notepad。
{{< /note >}}

<!-- 
### Install on Windows as part of the Google Cloud SDK
-->
### 作为谷歌云 SDK 的一部分，在 Windows 上安装 {#install-on-windows-as-part-of-the-google-cloud-sdk}

{{< include "included/install-kubectl-gcloud.md" >}}

<!-- 
## Verify kubectl configuration
-->
## 验证 kubectl 配置 {#verify-kubectl-configration}

{{< include "included/verify-kubectl.md" >}}

<!-- 
## Optional kubectl configurations

### Enable shell autocompletion
-->
## kubectl 可选配置 {#optional-kubectl-configurations}

### 启用 shell 自动补全功能 {#enable-shell-autocompletion}

<!-- 
kubectl provides autocompletion support for Bash and Zsh, which can save you a lot of typing.

Below are the procedures to set up autocompletion for Zsh, if you are running that on Windows.
-->
kubectl 为 Bash 和 Zsh 提供自动补全功能，可以减轻许多输入的负担。

下面是设置 Zsh 自动补全功能的操作步骤，前提是你在 Windows 上面运行的是 Zsh。

{{< include "included/optional-kubectl-configs-zsh.md" >}}

## {{% heading "whatsnext" %}}

{{< include "included/kubectl-whats-next.md" >}}