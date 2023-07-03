---
title: 在 Linux 系统中安装并设置 kubectl
content_type: task
weight: 10
card:
  name: tasks
  weight: 20
  title: 在 Linux 系统中安装 kubectl
---
<!-- 
reviewers:
- mikedanese
title: Install and Set Up kubectl on Linux
content_type: task
weight: 10
card:
  name: tasks
  weight: 20
  title: Install kubectl on Linux
-->

## {{% heading "prerequisites" %}}

<!--
You must use a kubectl version that is within one minor version difference of your cluster.
For example, a v{{< skew currentVersion >}} client can communicate
with v{{< skew currentVersionAddMinor -1 >}}, v{{< skew currentVersionAddMinor 0 >}},
and v{{< skew currentVersionAddMinor 1 >}} control planes.
Using the latest compatible version of kubectl helps avoid unforeseen issues.
-->
kubectl 版本和集群版本之间的差异必须在一个小版本号内。
例如：v{{< skew currentVersion >}} 版本的客户端能与 v{{< skew currentVersionAddMinor -1 >}}、
v{{< skew currentVersionAddMinor 0 >}} 和 v{{< skew currentVersionAddMinor 1 >}} 版本的控制面通信。
用最新兼容版的 kubectl 有助于避免不可预见的问题。

<!--
## Install kubectl on Linux
-->
## 在 Linux 系统中安装 kubectl {#install-kubectl-on-linux}

<!--
The following methods exist for installing kubectl on Linux:
-->
在 Linux 系统中安装 kubectl 有如下几种方法：

<!--
- [Install kubectl binary with curl on Linux](#install-kubectl-binary-with-curl-on-linux)
- [Install using native package management](#install-using-native-package-management)
- [Install using other package management](#install-using-other-package-management)
-->
- [用 curl 在 Linux 系统中安装 kubectl](#install-kubectl-binary-with-curl-on-linux)
- [用原生包管理工具安装](#install-using-native-package-management)
- [用其他包管理工具安装](#install-using-other-package-management)

<!--
### Install kubectl binary with curl on Linux
-->
### 用 curl 在 Linux 系统中安装 kubectl {#install-kubectl-binary-with-curl-on-linux}

<!--
1. Download the latest release with the command:
-->
1. 用以下命令下载最新发行版：

   {{< tabs name="download_binary_linux" >}}
   {{< tab name="x86-64" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
   {{< /tab >}}
   {{< tab name="ARM64" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/arm64/kubectl"
   {{< /tab >}}
   {{< /tabs >}}

   {{< note >}}
   <!--
   To download a specific version, replace the `$(curl -L -s https://dl.k8s.io/release/stable.txt)`
   portion of the command with the specific version.

   For example, to download version {{< skew currentPatchVersion >}} on Linux x86-64, type:
   -->
   如需下载某个指定的版本，请用指定版本号替换该命令的这一部分：
   `$(curl -L -s https://dl.k8s.io/release/stable.txt)`。

   例如，要在 Linux x86-64 中下载 {{< skew currentPatchVersion >}} 版本，请输入：

   ```bash
   curl -LO https://dl.k8s.io/release/v{{< skew currentPatchVersion >}}/bin/linux/amd64/kubectl
   ```

   <!--
   And for Linux ARM64, type:
   -->
   对于 Linux ARM64 来说，请输入：

   ```bash
   curl -LO https://dl.k8s.io/release/{{< param "fullversion" >}}/bin/linux/arm64/kubectl
   ```
   {{< /note >}}

<!--
1. Validate the binary (optional)

   Download the kubectl checksum file:
-->
2. 验证该可执行文件（可选步骤）

   下载 kubectl 校验和文件：

   {{< tabs name="download_checksum_linux" >}} 
   {{< tab name="x86-64" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl.sha256"
   {{< /tab >}}
   {{< tab name="ARM64" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/arm64/kubectl.sha256"
   {{< /tab >}}
   {{< /tabs >}}

   <!--
   Validate the kubectl binary against the checksum file:
   -->
   基于校验和文件，验证 kubectl 的可执行文件：

   ```bash
   echo "$(cat kubectl.sha256)  kubectl" | sha256sum --check
   ```

   <!--
   If valid, the output is:
   -->
   验证通过时，输出为：

   ```console
   kubectl: OK
   ```

   <!--
   If the check fails, `sha256` exits with nonzero status and prints output similar to:
   -->
   验证失败时，`sha256` 将以非零值退出，并打印如下输出：

   ```bash
   kubectl: FAILED
   sha256sum: WARNING: 1 computed checksum did NOT match
   ```

   {{< note >}}
   <!--
   Download the same version of the binary and checksum.
   -->
   下载的 kubectl 与校验和文件版本必须相同。
   {{< /note >}}

<!--
1. Install kubectl
-->
3. 安装 kubectl

   ```bash
   sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
   ```

   {{< note >}}
   <!--
   If you do not have root access on the target system, you can still install
   kubectl to the `~/.local/bin` directory:
   -->
   即使你没有目标系统的 root 权限，仍然可以将 kubectl 安装到目录 `~/.local/bin` 中：

   ```bash
   chmod +x kubectl
   mkdir -p ~/.local/bin
   mv ./kubectl ~/.local/bin/kubectl
   # 之后将 ~/.local/bin 附加（或前置）到 $PATH
   ```
   {{< /note >}}

<!--
1. Test to ensure the version you installed is up-to-date:
Or use this for detailed view of version:
-->
4. 执行测试，以保障你安装的版本是最新的：

   ```bash
   kubectl version --client
   ```

   {{< note >}}
   <!--
   The above command will generate a warning:
   -->
   上面的命令会产生一个警告：

   ```
   WARNING: This version information is deprecated and will be replaced with the output from kubectl version --short.
   ```

   <!--
   You can ignore this warning. You are only checking the version of `kubectl` that you
   have installed.
   -->
   你可以忽略这个警告。你只检查你所安装的 `kubectl` 的版本。
   {{< /note >}}

   <!--
   Or use this for detailed view of version:
   -->
   或者使用如下命令来查看版本的详细信息：

   ```cmd
   kubectl version --client --output=yaml
   ```

<!--
### Install using native package management
-->
### 用原生包管理工具安装 {#install-using-native-package-management}

{{< tabs name="kubectl_install" >}}
{{% tab name="基于 Debian 的发行版" %}}

<!--
1. Update the `apt` package index and install packages needed to use the Kubernetes `apt` repository:
-->
1. 更新 `apt` 包索引，并安装使用 Kubernetes `apt` 仓库所需要的包：

   ```shell
   sudo apt-get update
   sudo apt-get install -y ca-certificates curl
   ```

   <!--
   If you use Debian 9 (stretch) or earlier you would also need to install `apt-transport-https`:
   -->   
   如果你使用 Debian 9（stretch）或更早版本，则你还需要安装 `apt-transport-https`：

   ```shell
   sudo apt-get install -y apt-transport-https
   ```

<!--
2. Download the Google Cloud public signing key:
-->

2. 下载 Google Cloud 公开签名秘钥：

   ```shell
   curl -fsSL https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-archive-keyring.gpg
   ```

<!--
3. Add the Kubernetes `apt` repository:
-->

3. 添加 Kubernetes `apt` 仓库：

   ```shell
   echo "deb [signed-by=/etc/apt/keyrings/kubernetes-archive-keyring.gpg] https://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee /etc/apt/sources.list.d/kubernetes.list
   ```

<!--
4. Update `apt` package index with the new repository and install kubectl:
-->

4. 更新 `apt` 包索引，使之包含新的仓库并安装 kubectl：

   ```shell
   sudo apt-get update
   sudo apt-get install -y kubectl
   ```

{{< note >}}
<!--
In releases older than Debian 12 and Ubuntu 22.04, `/etc/apt/keyrings` does not exist by default.
You can create this directory if you need to, making it world-readable but writeable only by admins.
-->
在低于 Debian 12 和 Ubuntu 22.04 的发行版本中，`/etc/apt/keyrings` 默认不存在。
如有需要，你可以创建此目录，并将其设置为对所有人可读，但仅对管理员可写。
{{< /note >}}

{{% /tab %}}

{{% tab name="基于 Red Hat 的发行版" %}}

```bash
cat <<EOF | sudo tee /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://packages.cloud.google.com/yum/repos/kubernetes-el7-\$basearch
enabled=1
gpgcheck=1
gpgkey=https://packages.cloud.google.com/yum/doc/yum-key.gpg https://packages.cloud.google.com/yum/doc/rpm-package-key.gpg
EOF
sudo yum install -y kubectl
```

{{% /tab %}}
{{< /tabs >}}

<!--
### Install using other package management
-->
### 用其他包管理工具安装 {#install-using-other-package-management}

{{< tabs name="other_kubectl_install" >}}
{{% tab name="Snap" %}}
<!-- 
If you are on Ubuntu or another Linux distribution that supports the
[snap](https://snapcraft.io/docs/core/install) package manager, kubectl
is available as a [snap](https://snapcraft.io/) application.
-->
如果你使用的 Ubuntu 或其他 Linux 发行版，内建支持
[snap](https://snapcraft.io/docs/core/install) 包管理工具，
则可用 [snap](https://snapcraft.io/) 命令安装 kubectl。

```shell
snap install kubectl --classic
kubectl version --client
```

{{% /tab %}}

{{% tab name="Homebrew" %}}
<!-- 
If you are on Linux and using [Homebrew](https://docs.brew.sh/Homebrew-on-Linux)
package manager, kubectl is available for [installation](https://docs.brew.sh/Homebrew-on-Linux#install).
-->
如果你使用 Linux 系统，并且装了 [Homebrew](https://docs.brew.sh/Homebrew-on-Linux)
包管理工具，
则可以使用这种方式[安装](https://docs.brew.sh/Homebrew-on-Linux#install) kubectl。

```shell
brew install kubectl
kubectl version --client
```

{{% /tab %}}

{{< /tabs >}}

<!--
## Verify kubectl configuration
-->
## 验证 kubectl 配置 {#verify-kubectl-configration}

{{< include "included/verify-kubectl.md" >}}

<!--
## Optional kubectl configurations and plugins

### Enable shell autocompletion
-->
## kubectl 的可选配置和插件 {#optional-kubectl-configurations}

### 启用 shell 自动补全功能 {#enable-shell-autocompletion}

<!--
kubectl provides autocompletion support for Bash, Zsh, Fish, and PowerShell,
which can save you a lot of typing.

Below are the procedures to set up autocompletion for Bash, Fish, and Zsh.
-->
kubectl 为 Bash、Zsh、Fish 和 PowerShell 提供自动补全功能，可以为你节省大量的输入。

下面是为 Bash、Fish 和 Zsh 设置自动补全功能的操作步骤。

{{< tabs name="kubectl_autocompletion" >}}
{{< tab name="Bash" include="included/optional-kubectl-configs-bash-linux.md" />}}
{{< tab name="Fish" include="included/optional-kubectl-configs-fish.md" />}}
{{< tab name="Zsh" include="included/optional-kubectl-configs-zsh.md" />}}
{{< /tabs >}}

<!--
### Install `kubectl convert` plugin
-->
### 安装 `kubectl convert` 插件

{{< include "included/kubectl-convert-overview.md" >}}

<!--
1. Download the latest release with the command:
-->
1. 用以下命令下载最新发行版：

   {{< tabs name="download_binary_linux" >}}
   {{< tab name="x86-64" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl-convert"
   {{< /tab >}}
   {{< tab name="ARM64" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/arm64/kubectl"
   {{< /tab >}}
   {{< /tabs >}}

<!--
1. Validate the binary (optional)

   Download the kubectl-convert checksum file:
-->
2. 验证该可执行文件（可选步骤）

   下载 kubectl-convert 校验和文件：

   {{< tabs name="download_convert_checksum_linux" >}}
   {{< tab name="x86-64" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl-convert.sha256"
   {{< /tab >}}
   {{< tab name="ARM64" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/arm64/kubectl-convert.sha256"
   {{< /tab >}}
   {{< /tabs >}}

   <!--
   Validate the kubectl-convert binary against the checksum file:
   -->
   基于校验和，验证 kubectl-convert 的可执行文件：

   ```bash
   echo "$(cat kubectl-convert.sha256) kubectl-convert" | sha256sum --check
   ```

   <!--
   If valid, the output is:
   -->
   验证通过时，输出为：

   ```console
   kubectl-convert: OK
   ```

   <!--
   If the check fails, `sha256` exits with nonzero status and prints output similar to:
   -->
   验证失败时，`sha256` 将以非零值退出，并打印输出类似于：

   ```bash
   kubectl-convert: FAILED
   sha256sum: WARNING: 1 computed checksum did NOT match
   ```

   {{< note >}}
   <!--
   Download the same version of the binary and checksum.
   -->
   下载相同版本的可执行文件和校验和。
   {{< /note >}}

<!--
1. Install kubectl-convert
-->
3. 安装 kubectl-convert

   ```bash
   sudo install -o root -g root -m 0755 kubectl-convert /usr/local/bin/kubectl-convert
   ```

<!--
1. Verify plugin is successfully installed
-->
4. 验证插件是否安装成功

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

   ```bash
   rm kubectl-convert kubectl-convert.sha256
   ```

## {{% heading "whatsnext" %}}

{{< include "included/kubectl-whats-next.md" >}}
