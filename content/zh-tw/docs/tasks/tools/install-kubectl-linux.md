---
title: 在 Linux 系統中安裝並設定 kubectl
content_type: task
weight: 10
card:
  name: tasks
  weight: 20
  title: 在 Linux 系統中安裝 kubectl
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
You must use a kubectl version that is within one minor version difference of your cluster. For example, a v{{< skew currentVersion >}} client can communicate with v{{< skew currentVersionAddMinor -1 >}}, v{{< skew currentVersionAddMinor 0 >}}, and v{{< skew currentVersionAddMinor 1 >}} control planes.
Using the latest compatible version of kubectl helps avoid unforeseen issues.
-->
kubectl 版本和叢集版本之間的差異必須在一個小版本號內。
例如：v{{< skew currentVersion >}} 版本的客戶端能與 v{{< skew currentVersionAddMinor -1 >}}、
v{{< skew currentVersionAddMinor 0 >}} 和 v{{< skew currentVersionAddMinor 1 >}} 版本的控制面通訊。
用最新相容版的 kubectl 有助於避免不可預見的問題。

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
### 用 curl 在 Linux 系統中安裝 kubectl {#install-kubectl-binary-with-curl-on-linux}

<!-- 
1. Download the latest release with the command:
-->
1. 用以下命令下載最新發行版：

   ```bash
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
   ```

   {{< note >}}
   <!-- 
   To download a specific version, replace the `$(curl -L -s https://dl.k8s.io/release/stable.txt)` portion of the command with the specific version.

   For example, to download version {{< param "fullversion" >}} on Linux, type:
   -->
   如需下載某個指定的版本，請用指定版本號替換該命令的這一部分：
   `$(curl -L -s https://dl.k8s.io/release/stable.txt)`。

   例如，要在 Linux 中下載 {{< param "fullversion" >}} 版本，請輸入：

   ```bash
   curl -LO https://dl.k8s.io/release/{{< param "fullversion" >}}/bin/linux/amd64/kubectl
   ```
   {{< /note >}}

<!-- 
1. Validate the binary (optional)

   Download the kubectl checksum file:
-->
2. 驗證該可執行檔案（可選步驟）

   下載 kubectl 校驗和檔案：

   ```bash
   curl -LO "https://dl.k8s.io/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl.sha256"
   ```

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
   驗證透過時，輸出為：

   ```console
   kubectl: OK
   ```

   <!-- 
   If the check fails, `sha256` exits with nonzero status and prints output similar to:
   -->
   驗證失敗時，`sha256` 將以非零值退出，並列印如下輸出：

   ```bash
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
3. 安裝 kubectl

   ```bash
   sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
   ```

   {{< note >}}
   <!-- 
   If you do not have root access on the target system, you can still install kubectl to the `~/.local/bin` directory:
   -->
   即使你沒有目標系統的 root 許可權，仍然可以將 kubectl 安裝到目錄 `~/.local/bin` 中：

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
   
   或者使用如下命令來檢視版本的詳細資訊：
   ```cmd
   kubectl version --client --output=yaml
   ```

<!-- 
### Install using native package management
-->
### 用原生包管理工具安裝 {#install-using-native-package-management}

{{< tabs name="kubectl_install" >}}
{{% tab name="Ubuntu、Debian 或 HypriotOS" %}}

  <!--
  1. Update the `apt` package index and install packages needed to use the Kubernetes `apt` repository:
  -->
  1. 更新 `apt` 包索引，並安裝使用 Kubernetes `apt` 倉庫所需要的包：

     ```shell
     sudo apt-get update
     sudo apt-get install -y apt-transport-https ca-certificates curl
     ```
  <!--
  2. Download the Google Cloud public signing key:
  -->
  2. 下載 Google Cloud 公開簽名秘鑰：

     ```shell
     sudo curl -fsSLo /usr/share/keyrings/kubernetes-archive-keyring.gpg https://packages.cloud.google.com/apt/doc/apt-key.gpg
     ```

  <!--
  3. Add the Kubernetes `apt` repository:
  -->
  3. 新增 Kubernetes `apt` 倉庫：

     ```shell
     echo "deb [signed-by=/usr/share/keyrings/kubernetes-archive-keyring.gpg] https://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee /etc/apt/sources.list.d/kubernetes.list
     ```

  <!--
  4. Update `apt` package index with the new repository and install kubectl:
  -->
  4. 更新 `apt` 包索引，使之包含新的倉庫並安裝 kubectl：

     ```shell
     sudo apt-get update
     sudo apt-get install -y kubectl
     ```
{{% /tab %}}

{{% tab name="基於 Red Hat 的發行版" %}}

```shell
cat <<EOF | sudo tee /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://packages.cloud.google.com/yum/repos/kubernetes-el7-x86_64
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://packages.cloud.google.com/yum/doc/yum-key.gpg https://packages.cloud.google.com/yum/doc/rpm-package-key.gpg
EOF
sudo yum install -y kubectl
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
If you are on Ubuntu or another Linux distribution that supports the [snap](https://snapcraft.io/docs/core/install) package manager, kubectl is available as a [snap](https://snapcraft.io/) application.
-->
如果你使用的 Ubuntu 或其他 Linux 發行版，內建支援
[snap](https://snapcraft.io/docs/core/install) 包管理工具，
則可用 [snap](https://snapcraft.io/) 命令安裝 kubectl。

```shell
snap install kubectl --classic
kubectl version --client
```

{{% /tab %}}

{{% tab name="Homebrew" %}}
<!-- 
If you are on Linux and using [Homebrew](https://docs.brew.sh/Homebrew-on-Linux) package manager, kubectl is available for [installation](https://docs.brew.sh/Homebrew-on-Linux#install).
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
## 驗證 kubectl 配置 {#verify-kubectl-configration}

{{< include "included/verify-kubectl.md" >}}

<!--
## Optional kubectl configurations and plugins

### Enable shell autocompletion
-->
## kubectl 的可選配置和外掛 {#optional-kubectl-configurations}

### 啟用 shell 自動補全功能 {#enable-shell-autocompletion}

<!-- 
kubectl provides autocompletion support for Bash, Zsh, Fish, and PowerShell, which can save you a lot of typing.

Below are the procedures to set up autocompletion for Bash, Fish, and Zsh.
-->
kubectl 為 Bash、Zsh、Fish 和 PowerShell 提供自動補全功能，可以為你節省大量的輸入。

下面是為 Bash、Fish 和 Zsh 設定自動補全功能的操作步驟。

{{< tabs name="kubectl_autocompletion" >}}
{{< tab name="Bash" include="included/optional-kubectl-configs-bash-linux.md" />}}
{{< tab name="Fish" include="included/optional-kubectl-configs-fish.md" />}}
{{< tab name="Zsh" include="included/optional-kubectl-configs-zsh.md" />}}
{{< /tabs >}}

<!--
### Install `kubectl convert` plugin
-->
### 安裝 `kubectl convert` 外掛

{{< include "included/kubectl-convert-overview.md" >}}

<!--
1. Download the latest release with the command:
-->
1. 用以下命令下載最新發行版：

   ```bash
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl-convert"
   ```
<!--
2. Validate the binary (optional)

   Download the kubectl-convert checksum file:
-->
2. 驗證該可執行檔案（可選步驟）
   
   下載 kubectl-convert 校驗和檔案：
   
   ```bash
   curl -LO "https://dl.k8s.io/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl-convert.sha256"
   ```

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
   驗證透過時，輸出為：
   
   ```console
   kubectl-convert: OK
   ```

   <!--
   If the check fails, `sha256` exits with nonzero status and prints output similar to:
   -->
   驗證失敗時，`sha256` 將以非零值退出，並列印輸出類似於：

   ```bash
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
3. Install kubectl-convert
-->
3. 安裝 kubectl-convert

   ```bash
   sudo install -o root -g root -m 0755 kubectl-convert /usr/local/bin/kubectl-convert
   ```

<!--
4. Verify plugin is successfully installed
-->
4. 驗證外掛是否安裝成功

   ```shell
   kubectl convert --help
   ```

   <!--
   If you do not see an error, it means the plugin is successfully installed.
   -->
   如果你沒有看到任何錯誤就代表外掛安裝成功了。

## {{% heading "whatsnext" %}}

{{< include "included/kubectl-whats-next.md" >}}

