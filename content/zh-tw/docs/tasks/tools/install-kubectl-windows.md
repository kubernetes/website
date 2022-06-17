---
title: 在 Windows 上安裝 kubectl
content_type: task
weight: 10
card:
  name: tasks
  weight: 20
  title: Windows 安裝 kubectl
---
<!-- 
reviewers:
- mikedanese
title: Install and Set Up kubectl on Windows
content_type: task
weight: 10
card:
  name: tasks
  weight: 20
  title: Install kubectl on Windows
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
## Install kubectl on Windows
-->
## 在 Windows 上安裝 kubectl {#install-kubectl-on-windows}

<!-- 
The following methods exist for installing kubectl on Windows:
-->
在 Windows 系統中安裝 kubectl 有如下幾種方法：

- [用 curl 在 Windows 上安裝 kubectl](#install-kubectl-binary-with-curl-on-windows)
- [在 Windows 上用 Chocolatey 或 Scoop 安裝](#install-on-windows-using-chocolatey-or-scoop)

<!-- 
### Install kubectl binary with curl on Windows
-->
### 用 curl 在 Windows 上安裝 kubectl {#install-kubectl-binary-with-curl-on-windows}

<!-- 
1. Download the [latest release {{< param "fullversion" >}}](https://dl.k8s.io/release/{{< param "fullversion" >}}/bin/windows/amd64/kubectl.exe).

   Or if you have `curl` installed, use this command:
-->
1. 下載 [最新發行版 {{< param "fullversion" >}}](https://dl.k8s.io/release/{{< param "fullversion" >}}/bin/windows/amd64/kubectl.exe)。

   如果你已安裝了 `curl`,也可以使用此命令：

   ```powershell
   curl -LO "https://dl.k8s.io/release/{{< param "fullversion" >}}/bin/windows/amd64/kubectl.exe"
   ```

   <!-- 
      To find out the latest stable version (for example, for scripting), take a look at [https://dl.k8s.io/release/stable.txt](https://dl.k8s.io/release/stable.txt).
   -->
   {{< note >}}
   要想找到最新穩定的版本（例如：為了編寫指令碼），可以看看這裡 [https://dl.k8s.io/release/stable.txt](https://dl.k8s.io/release/stable.txt)。
   {{< /note >}}

   <!-- 
   1. Validate the binary (optional)

      Download the `kubectl` checksum file:
   -->
1. 驗證該可執行檔案（可選步驟）
   
   下載 `kubectl` 校驗和檔案：

   ```powershell
   curl -LO "https://dl.k8s.io/{{< param "fullversion" >}}/bin/windows/amd64/kubectl.exe.sha256"
   ```

   <!-- 
   Validate the `kubectl` binary against the checksum file:
   -->
   基於校驗和檔案，驗證 `kubectl` 的可執行檔案：

   <!-- 
   - Using Command Prompt to manually compare `CertUtil`'s output to the checksum file downloaded:
   -->
   - 在命令列環境中，手工對比 `CertUtil` 命令的輸出與校驗和檔案：

     ```cmd
     CertUtil -hashfile kubectl.exe SHA256
     type kubectl.exe.sha256
     ```

   <!-- 
   - Using PowerShell to automate the verification using the `-eq` operator to get a `True` or `False` result:
   -->
   - 用 PowerShell 自動驗證，用運算子 `-eq` 來直接取得 `True` 或 `False` 的結果：

     ```powershell
     $($(CertUtil -hashfile .\kubectl.exe SHA256)[1] -replace " ", "") -eq $(type .\kubectl.exe.sha256)
     ```

   <!-- 
   1. Append or prepend the `kubectl` binary folder to your `PATH` environment variable.

   1. Test to ensure the version of `kubectl` is the same as downloaded:
      Or use this for detailed view of version:
   -->
1. 將 `kubectl` 二進位制資料夾追加或插入到你的 `PATH` 環境變數中。

1. 測試一下，確保此 `kubectl` 的版本和期望版本一致：

   ```cmd
   kubectl version --client
   ```
   或者使用下面命令來檢視版本的詳細資訊：
   ```cmd
   kubectl version --client --output=yaml
   ```


<!-- 
[Docker Desktop for Windows](https://docs.docker.com/docker-for-windows/#kubernetes) adds its own version of `kubectl` to `PATH`.
If you have installed Docker Desktop before, you may need to place your `PATH` entry before the one added by the Docker Desktop installer or remove the Docker Desktop's `kubectl`.
-->
{{< note >}}
[Windows 版的 Docker Desktop](https://docs.docker.com/docker-for-windows/#kubernetes) 
將其自帶版本的 `kubectl` 新增到 `PATH`。
如果你之前安裝過 Docker Desktop，可能需要把此 `PATH` 條目置於 Docker Desktop 安裝的條目之前，
或者直接刪掉 Docker Desktop 的 `kubectl`。
{{< /note >}}

<!-- 
### Install on Windows using Chocolatey or Scoop
-->
### 在 Windows 上用 Chocolatey 或 Scoop 安裝 {#install-on-windows-using-chocolatey-or-scoop}

<!-- 
1. To install kubectl on Windows you can use either [Chocolatey](https://chocolatey.org) package manager or [Scoop](https://scoop.sh) command-line installer.
-->
1. 要在 Windows 上安裝 kubectl，你可以使用包管理器 [Chocolatey](https://chocolatey.org) 
   或是命令列安裝器 [Scoop](https://scoop.sh)。

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
2. 測試一下，確保安裝的是最新版本：

   ```powershell
   kubectl version --client
   ```

   <!-- 
   1. Navigate to your home directory:
   -->
3. 導航到你的 home 目錄：

   <!-- 
   # If you're using cmd.exe, run: cd %USERPROFILE%
   -->
   ```powershell
   # 當你用 cmd.exe 時，則執行： cd %USERPROFILE%
   cd ~
   ```

   <!-- 
   1. Create the `.kube` directory:
   -->
4. 建立目錄 `.kube`：

   ```powershell
   mkdir .kube
   ```

   <!-- 
   1. Change to the `.kube` directory you just created:
   -->
5. 切換到新建立的目錄 `.kube` 

   ```powershell
   cd .kube
   ```

   <!-- 
   1. Configure kubectl to use a remote Kubernetes cluster:
   -->
6. 配置 kubectl，以接入遠端的 Kubernetes 叢集：

   ```powershell
   New-Item config -type file
   ```

<!-- 
Edit the config file with a text editor of your choice, such as Notepad.
-->
{{< note >}}
編輯配置檔案，你需要先選擇一個文字編輯器，比如 Notepad。
{{< /note >}}

<!-- 
## Verify kubectl configuration
-->
## 驗證 kubectl 配置 {#verify-kubectl-configration}

{{< include "included/verify-kubectl.md" >}}

<!-- 
## Optional kubectl configurations and plugins

### Enable shell autocompletion
-->
## kubectl 可選配置和外掛 {#optional-kubectl-configurations}

### 啟用 shell 自動補全功能 {#enable-shell-autocompletion}

<!--
kubectl provides autocompletion support for Bash, Zsh, Fish, and PowerShell, which can save you a lot of typing.

Below are the procedures to set up autocompletion for PowerShell.
-->
kubectl 為 Bash、Zsh、Fish 和 PowerShell 提供自動補全功能，可以為你節省大量的輸入。

下面是設定 PowerShell 自動補全功能的操作步驟。

{{< include "included/optional-kubectl-configs-pwsh.md" >}}

<!--
### Install `kubectl convert` plugin
-->
### 安裝 `kubectl convert` 外掛

{{< include "included/kubectl-convert-overview.md" >}}

<!--
1. Download the latest release with the command:
-->
1. 用以下命令下載最新發行版：

   ```powershell
   curl -LO "https://dl.k8s.io/release/{{< param "fullversion" >}}/bin/windows/amd64/kubectl-convert.exe"
   ```

<!--
1. Validate the binary (optional)

   Download the `kubectl-convert` checksum file:
-->
1. 驗證該可執行檔案（可選步驟）
   
   下載 `kubectl-convert` 校驗和檔案：

   ```powershell
   curl -LO "https://dl.k8s.io/{{< param "fullversion" >}}/bin/windows/amd64/kubectl-convert.exe.sha256"
   ```

   <!--
   Validate the `kubectl-convert` binary against the checksum file:

   - Using Command Prompt to manually compare `CertUtil`'s output to the checksum file downloaded:
   -->
   基於校驗和，驗證 `kubectl-convert` 的可執行檔案：

   - 用提示的命令對 `CertUtil` 的輸出和下載的校驗和檔案進行手動比較。
   
     ```cmd
     CertUtil -hashfile kubectl-convert.exe SHA256
     type kubectl-convert.exe.sha256
     ```

   <!--
   - Using PowerShell to automate the verification using the `-eq` operator to get a `True` or `False` result:
   -->
   - 使用 PowerShell `-eq` 操作使驗證自動化，獲得 `True` 或者 `False` 的結果：
   
     ```powershell
     $($(CertUtil -hashfile .\kubectl-convert.exe SHA256)[1] -replace " ", "") -eq $(type .\kubectl-convert.exe.sha256)
     ```

<!--
1.  Append or prepend the `kubectl-convert` binary folder to your `PATH` environment variable.

1. Verify plugin is successfully installed
-->
1. 將 `kubectl-convert` 二進位制資料夾附加或新增到你的 `PATH` 環境變數中。

1. 驗證外掛是否安裝成功

   ```shell
   kubectl convert --help
   ```

   <!--
   If you do not see an error, it means the plugin is successfully installed.
   -->
   如果你沒有看到任何錯誤就代表外掛安裝成功了。

## {{% heading "whatsnext" %}}

{{< include "included/kubectl-whats-next.md" >}}
