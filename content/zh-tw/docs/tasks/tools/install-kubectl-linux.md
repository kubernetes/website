---
title: 在 Linux 系統中安裝並設置 kubectl
content_type: task
weight: 10
---
<!-- 
reviewers:
- mikedanese
title: Install and Set Up kubectl on Linux
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
kubectl 版本和叢集版本之間的差異必須在一個小版本號內。
例如：v{{< skew currentVersion >}} 版本的客戶端能與 v{{< skew currentVersionAddMinor -1 >}}、
v{{< skew currentVersionAddMinor 0 >}} 和 v{{< skew currentVersionAddMinor 1 >}} 版本的控制面通信。
用最新兼容版的 kubectl 有助於避免不可預見的問題。

<!--
## Install kubectl on Linux
-->
## 在 Linux 系統中安裝 kubectl {#install-kubectl-on-linux}

<!--
The following methods exist for installing kubectl on Linux:
-->
在 Linux 系統中安裝 kubectl 有如下幾種方法：

<!--
- [Install kubectl binary with curl on Linux](#install-kubectl-binary-with-curl-on-linux)
- [Install using native package management](#install-using-native-package-management)
- [Install using other package management](#install-using-other-package-management)
-->
- [用 curl 在 Linux 系統中安裝 kubectl](#install-kubectl-binary-with-curl-on-linux)
- [用原生包管理工具安裝](#install-using-native-package-management)
- [用其他包管理工具安裝](#install-using-other-package-management)

<!--
### Install kubectl binary with curl on Linux
-->
### 用 curl 在 Linux 系統中安裝 kubectl  {#install-kubectl-binary-with-curl-on-linux}

<!--
1. Download the latest release with the command:
-->
1. 用以下命令下載最新發行版：

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
   如需下載某個指定的版本，請用指定版本號替換該命令的這一部分：
   `$(curl -L -s https://dl.k8s.io/release/stable.txt)`。

   例如，要在 Linux x86-64 中下載 {{< skew currentPatchVersion >}} 版本，請輸入：

   ```bash
   curl -LO https://dl.k8s.io/release/v{{< skew currentPatchVersion >}}/bin/linux/amd64/kubectl
   ```

   <!--
   And for Linux ARM64, type:
   -->
   對於 Linux ARM64 來說，請輸入：

   ```bash
   curl -LO https://dl.k8s.io/release/v{{< skew currentPatchVersion >}}/bin/linux/arm64/kubectl
   ```
   {{< /note >}}

<!--
1. Validate the binary (optional)

   Download the kubectl checksum file:
-->
2. 驗證該可執行檔案（可選步驟）

   下載 kubectl 校驗和檔案：

   {{< tabs name="download_checksum_linux" >}}
   {{< tab name="x86-64" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl.sha256"
   {{< /tab >}}
   {{< tab name="ARM64" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/arm64/kubectl.sha256"
   {{< /tab >}}
   {{< /tabs >}}

   <!--
   Validate the kubectl binary against the checksum file:
   -->
   基於校驗和檔案，驗證 kubectl 的可執行檔案：

   ```bash
   echo "$(cat kubectl.sha256)  kubectl" | sha256sum --check
   ```

   <!--
   If valid, the output is:
   -->
   驗證通過時，輸出爲：

   ```console
   kubectl: OK
   ```

   <!--
   If the check fails, `sha256` exits with nonzero status and prints output similar to:
   -->
   驗證失敗時，`sha256` 將以非零值退出，並打印如下輸出：

   ```console
   kubectl: FAILED
   sha256sum: WARNING: 1 computed checksum did NOT match
   ```

   {{< note >}}
   <!--
   Download the same version of the binary and checksum.
   -->
   下載的 kubectl 與校驗和檔案版本必須相同。
   {{< /note >}}

<!--
1. Install kubectl
-->
3. 安裝 kubectl：

   ```bash
   sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
   ```

   {{< note >}}
   <!--
   If you do not have root access on the target system, you can still install
   kubectl to the `~/.local/bin` directory:
   -->
   即使你沒有目標系統的 root 權限，仍然可以將 kubectl 安裝到目錄 `~/.local/bin` 中：

   <!--
   # and then append (or prepend) ~/.local/bin to $PATH
   -->
   ```bash
   chmod +x kubectl
   mkdir -p ~/.local/bin
   mv ./kubectl ~/.local/bin/kubectl
   # 之後將 ~/.local/bin 附加（或前置）到 $PATH
   ```
   {{< /note >}}

<!--
1. Test to ensure the version you installed is up-to-date:
Or use this for detailed view of version:
-->
4. 執行測試，以保障你安裝的版本是最新的：

   ```bash
   kubectl version --client
   ```

   <!--
   Or use this for detailed view of version:
   -->
   或者使用如下命令來查看版本的詳細資訊：

   ```cmd
   kubectl version --client --output=yaml
   ```

<!--
### Install using native package management
-->
### 用原生包管理工具安裝 {#install-using-native-package-management}

{{< tabs name="kubectl_install" >}}
{{% tab name="基於 Debian 的發行版" %}}

<!--
1. Update the `apt` package index and install packages needed to use the Kubernetes `apt` repository:
-->
1. 更新 `apt` 包索引，並安裝使用 Kubernetes `apt` 倉庫所需要的包：

   <!--
   ```shell
   sudo apt-get update
   # apt-transport-https may be a dummy package; if so, you can skip that package
   sudo apt-get install -y apt-transport-https ca-certificates curl gnupg
   ```
   -->
   ```shell
   sudo apt-get update
   # apt-transport-https 可以是一個虛擬包；如果是這樣，你可以跳過這個包
   sudo apt-get install -y apt-transport-https ca-certificates curl gnupg
   ```

<!--
2. Download the public signing key for the Kubernetes package repositories. The same signing key is used for all repositories so you can disregard the version in the URL:
-->
2. 下載 Kubernetes 軟體包倉庫的公共簽名密鑰。
   同一個簽名密鑰適用於所有倉庫，因此你可以忽略 URL 中的版本資訊：

   <!--
   # If the folder `/etc/apt/keyrings` does not exist, it should be created before the curl command, read the note below.
   # sudo mkdir -p -m 755 /etc/apt/keyrings
   -->
   ```shell
   # 如果 `/etc/apt/keyrings` 目錄不存在，則應在 curl 命令之前創建它，請閱讀下面的註釋。
   # sudo mkdir -p -m 755 /etc/apt/keyrings
   curl -fsSL https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
   sudo chmod 644 /etc/apt/keyrings/kubernetes-apt-keyring.gpg # allow unprivileged APT programs to read this keyring   
   ```

{{< note >}}
<!--
In releases older than Debian 12 and Ubuntu 22.04, folder `/etc/apt/keyrings` does not exist by default, and it should be created before the curl command.
-->
在低於 Debian 12 和 Ubuntu 22.04 的發行版本中，`/etc/apt/keyrings` 預設不存在。
應在 curl 命令之前創建它。
{{< /note >}}

<!--
3. Add the appropriate Kubernetes `apt` repository. If you want to use Kubernetes version different than {{< param "version" >}},
   replace {{< param "version" >}} with the desired minor version in the command below:
-->
3. 添加合適的 Kubernetes `apt` 倉庫。如果你想用 {{< param "version" >}} 之外的 Kubernetes 版本，
   請將下面命令中的 {{< param "version" >}} 替換爲所需的次要版本：

   <!--
   ```shell
   # This overwrites any existing configuration in /etc/apt/sources.list.d/kubernetes.list
   echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/deb/ /' | sudo tee /etc/apt/sources.list.d/kubernetes.list
   sudo chmod 644 /etc/apt/sources.list.d/kubernetes.list   # helps tools such as command-not-found to work correctly
   ```
   -->
   ```shell
   # 這會覆蓋 /etc/apt/sources.list.d/kubernetes.list 中的所有現存配置
   echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/deb/ /' | sudo tee /etc/apt/sources.list.d/kubernetes.list
   sudo chmod 644 /etc/apt/sources.list.d/kubernetes.list   # 有助於讓諸如 command-not-found 等工具正常工作
   ```

{{< note >}}
<!--
To upgrade kubectl to another minor release, you'll need to bump the version in `/etc/apt/sources.list.d/kubernetes.list` before running `apt-get update` and `apt-get upgrade`. This procedure is described in more detail in [Changing The Kubernetes Package Repository](/docs/tasks/administer-cluster/kubeadm/change-package-repository/).
-->
要將 kubectl 升級到別的次要版本，你需要先升級 `/etc/apt/sources.list.d/kubernetes.list` 中的版本，
再運行 `apt-get update` 和 `apt-get upgrade` 命令。
更詳細的步驟可以在[更改 Kubernetes 軟體包儲存庫](/zh-cn/docs/tasks/administer-cluster/kubeadm/change-package-repository/)中找到。
{{< /note >}}

<!--
4. Update `apt` package index, then install kubectl:
-->
4. 更新 `apt` 包索引，然後安裝 kubectl：

   ```shell
   sudo apt-get update
   sudo apt-get install -y kubectl
   ```

{{% /tab %}}

{{% tab name="基於 Red Hat 的發行版" %}}

<!--
1. Add the Kubernetes `yum` repository. If you want to use Kubernetes version
   different than {{< param "version" >}}, replace {{< param "version" >}} with
   the desired minor version in the command below.
-->
1. 添加 Kubernetes 的 `yum` 倉庫。如果你想使用 {{< param "version" >}} 之外的 Kubernetes 版本，
   將下面命令中的 {{< param "version" >}} 替換爲所需的次要版本。

   <!--
   ```bash
   # This overwrites any existing configuration in /etc/yum.repos.d/kubernetes.repo
   cat <<EOF | sudo tee /etc/yum.repos.d/kubernetes.repo
   [kubernetes]
   name=Kubernetes
   baseurl=https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/rpm/
   enabled=1
   gpgcheck=1
   gpgkey=https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/rpm/repodata/repomd.xml.key
   EOF
   ```
   -->
   ```bash
   # 這會覆蓋 /etc/yum.repos.d/kubernetes.repo 中現存的所有配置
   cat <<EOF | sudo tee /etc/yum.repos.d/kubernetes.repo
   [kubernetes]
   name=Kubernetes
   baseurl=https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/rpm/
   enabled=1
   gpgcheck=1
   gpgkey=https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/rpm/repodata/repomd.xml.key
   EOF
   ```

{{< note >}}
<!--
To upgrade kubectl to another minor release, you'll need to bump the version in `/etc/yum.repos.d/kubernetes.repo` before running `yum update`. This procedure is described in more detail in [Changing The Kubernetes Package Repository](/docs/tasks/administer-cluster/kubeadm/change-package-repository/).
-->
要將 kubectl 升級到別的次要版本，你需要先升級 `/etc/yum.repos.d/kubernetes.repo`
中的版本，再運行 `yum update` 命令。
更詳細的步驟可以在[更改 Kubernetes 軟體包儲存庫](/zh-cn/docs/tasks/administer-cluster/kubeadm/change-package-repository/)中找到。
{{< /note >}}

<!--
2. Install kubectl using `yum`:
-->
2. 使用 `yum` 安裝 kubectl：

   ```bash
   sudo yum install -y kubectl
   ```

{{% /tab %}}

{{% tab name="基於 SUSE 的發行版" %}}
<!-- 
1. Add the Kubernetes `zypper` repository. If you want to use Kubernetes version
different than {{< param "version" >}}, replace {{< param "version" >}} with
the desired minor version in the command below.
-->

1. 添加 Kubernetes `zypper` 軟體源。如果你想使用不同於 {{< param "version" >}}
   的 Kubernetes 版本，請在下面的命令中將 {{< param "version" >}} 替換爲所需的次要版本。

<!-- 
```bash
# This overwrites any existing configuration in /etc/zypp/repos.d/kubernetes.repo
cat <<EOF | sudo tee /etc/zypp/repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/rpm/
enabled=1
gpgcheck=1
gpgkey=https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/rpm/repodata/repomd.xml.key
EOF
```
-->
```bash
# 這將覆蓋 /etc/zypp/repos.d/kubernetes.repo 中的任何現有配置。
cat <<EOF | sudo tee /etc/zypp/repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/rpm/
enabled=1
gpgcheck=1
gpgkey=https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/rpm/repodata/repomd.xml.key
EOF
```
{{< note >}}
<!--
To upgrade kubectl to another minor release, you'll need to bump the version in `/etc/zypp/repos.d/kubernetes.repo` before running `zypper update`. This procedure is described in more detail in
[Changing The Kubernetes Package Repository](/docs/tasks/administer-cluster/kubeadm/change-package-repository/).
-->
要升級 kubectl 到另一個小版本，你需要先更新 `/etc/zypp/repos.d/kubernetes.repo` 的版本，
再運行 `zypper update`。
此過程在[更改 Kubernetes 軟體包倉庫](/zh-cn/docs/tasks/administer-cluster/kubeadm/change-package-repository/)中有更詳細的描述。
{{< /note >}}

<!--
2. Update `zypper` and confirm the new repo addition:
-->
2. 更新 zypper 並確認新的倉庫已添加：

   ```bash
   sudo zypper update
   ```

   <!--
   When this message appears, press 't' or 'a':
   -->
   出現此資訊時，按 't' 或 'a''：

   ```
   New repository or package signing key received:

   Repository:       Kubernetes
   Key Fingerprint:  1111 2222 3333 4444 5555 6666 7777 8888 9999 AAAA
   Key Name:         isv:kubernetes OBS Project <isv:kubernetes@build.opensuse.org>
   Key Algorithm:    RSA 2048
   Key Created:      Thu 25 Aug 2022 01:21:11 PM -03
   Key Expires:      Sat 02 Nov 2024 01:21:11 PM -03 (expires in 85 days)
   Rpm Name:         gpg-pubkey-9a296436-6307a177

   Note: Signing data enables the recipient to verify that no modifications occurred after the data
   were signed. Accepting data with no, wrong or unknown signature can lead to a corrupted system
   and in extreme cases even to a system compromise.

   Note: A GPG pubkey is clearly identified by its fingerprint. Do not rely on the key's name. If
   you are not sure whether the presented key is authentic, ask the repository provider or check
   their web site. Many providers maintain a web page showing the fingerprints of the GPG keys they
   are using.

   Do you want to reject the key, trust temporarily, or trust always? [r/t/a/?] (r): a
   ```

<!--
3. Install kubectl using `zypper`:
-->
3. 使用 `zypper` 安裝 kubectl：

   ```bash
   sudo zypper install -y kubectl
   ```

{{% /tab %}}

{{< /tabs >}}

<!--
### Install using other package management
-->
### 用其他包管理工具安裝 {#install-using-other-package-management}

{{< tabs name="other_kubectl_install" >}}
{{% tab name="Snap" %}}
<!--
If you are on Ubuntu or another Linux distribution that supports the
[snap](https://snapcraft.io/docs/core/install) package manager, kubectl
is available as a [snap](https://snapcraft.io/) application.
-->
如果你使用的 Ubuntu 或其他 Linux 發行版，內建支持
[snap](https://snapcraft.io/docs/core/install) 包管理工具，
則可用 [snap](https://snapcraft.io/) 命令安裝 kubectl。

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
如果你使用 Linux 系統，並且裝了 [Homebrew](https://docs.brew.sh/Homebrew-on-Linux)
包管理工具，
則可以使用這種方式[安裝](https://docs.brew.sh/Homebrew-on-Linux#install) kubectl。

```shell
brew install kubectl
kubectl version --client
```

{{% /tab %}}

{{< /tabs >}}

<!--
## Verify kubectl configuration
-->
## 驗證 kubectl 設定 {#verify-kubectl-configuration}

{{< include "included/verify-kubectl.md" >}}

<!--
## Optional kubectl configurations and plugins

### Enable shell autocompletion
-->
## kubectl 的可選設定和插件 {#optional-kubectl-configurations}

### 啓用 shell 自動補全功能 {#enable-shell-autocompletion}

<!--
kubectl provides autocompletion support for Bash, Zsh, Fish, and PowerShell,
which can save you a lot of typing.

Below are the procedures to set up autocompletion for Bash, Fish, and Zsh.
-->
kubectl 爲 Bash、Zsh、Fish 和 PowerShell 提供自動補全功能，可以爲你節省大量的輸入。

下面是爲 Bash、Fish 和 Zsh 設置自動補全功能的操作步驟。

{{< tabs name="kubectl_autocompletion" >}}
{{< tab name="Bash" include="included/optional-kubectl-configs-bash-linux.md" />}}
{{< tab name="Fish" include="included/optional-kubectl-configs-fish.md" />}}
{{< tab name="Zsh" include="included/optional-kubectl-configs-zsh.md" />}}
{{< /tabs >}}

<!--
### Configure kuberc

See [kuberc](/docs/reference/kubectl/kuberc) for more information.
-->
### 設定 kuberc  {#configure-kuberc}

更多資訊請參見 [kuberc](/zh-cn/docs/reference/kubectl/kuberc)。

<!--
### Install `kubectl convert` plugin
-->
### 安裝 `kubectl convert` 插件 {#install-kubectl-convert-plugin}

{{< include "included/kubectl-convert-overview.md" >}}

<!--
1. Download the latest release with the command:
-->
1. 用以下命令下載最新發行版：

   {{< tabs name="download_convert_binary_linux" >}}
   {{< tab name="x86-64" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl-convert"
   {{< /tab >}}
   {{< tab name="ARM64" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/arm64/kubectl-convert"
   {{< /tab >}}
   {{< /tabs >}}

<!--
1. Validate the binary (optional)

   Download the kubectl-convert checksum file:
-->
2. 驗證該可執行檔案（可選步驟）

   下載 kubectl-convert 校驗和檔案：

   {{< tabs name="download_convert_checksum_linux" >}}
   {{< tab name="x86-64" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl-convert.sha256"
   {{< /tab >}}
   {{< tab name="ARM64" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/arm64/kubectl-convert.sha256"
   {{< /tab >}}
   {{< /tabs >}}

   <!--
   Validate the kubectl-convert binary against the checksum file:
   -->
   基於校驗和，驗證 kubectl-convert 的可執行檔案：

   ```bash
   echo "$(cat kubectl-convert.sha256) kubectl-convert" | sha256sum --check
   ```

   <!--
   If valid, the output is:
   -->
   驗證通過時，輸出爲：

   ```console
   kubectl-convert: OK
   ```

   <!--
   If the check fails, `sha256` exits with nonzero status and prints output similar to:
   -->
   驗證失敗時，`sha256` 將以非零值退出，並打印輸出類似於：

   ```console
   kubectl-convert: FAILED
   sha256sum: WARNING: 1 computed checksum did NOT match
   ```

   {{< note >}}
   <!--
   Download the same version of the binary and checksum.
   -->
   下載相同版本的可執行檔案和校驗和。
   {{< /note >}}

<!--
1. Install kubectl-convert
-->
3. 安裝 kubectl-convert

   ```bash
   sudo install -o root -g root -m 0755 kubectl-convert /usr/local/bin/kubectl-convert
   ```

<!--
1. Verify plugin is successfully installed
-->
4. 驗證插件是否安裝成功

   ```shell
   kubectl convert --help
   ```

   <!--
   If you do not see an error, it means the plugin is successfully installed.
   -->
   如果你沒有看到任何錯誤就代表插件安裝成功了。

<!--
1. After installing the plugin, clean up the installation files:
-->
5. 安裝插件後，清理安裝檔案：

   ```bash
   rm kubectl-convert kubectl-convert.sha256
   ```

## {{% heading "whatsnext" %}}

{{< include "included/kubectl-whats-next.md" >}}
