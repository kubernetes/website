---
title: "macOS 系統上的 bash 自動補全"
description: "在 macOS 上實現 Bash 自動補全的一些可選設定。"
headless: true
_build:
  list: never
  render: never
  publishResources: false
---
<!-- 
title: "bash auto-completion on macOS"
description: "Some optional configuration for bash auto-completion on macOS."
headless: true
_build:
  list: never
  render: never
  publishResources: false
-->

<!-- 
### Introduction
-->
### 簡介 {#introduction}

<!-- 
The kubectl completion script for Bash can be generated with `kubectl completion bash`.
Sourcing this script in your shell enables kubectl completion.

However, the kubectl completion script depends on
[**bash-completion**](https://github.com/scop/bash-completion) which you thus have to previously install.
-->
kubectl 的 Bash 補全腳本可以通過 `kubectl completion bash` 命令生成。
在你的 Shell 中導入（Sourcing）這個腳本即可啓用補全功能。

此外，kubectl 補全腳本依賴於工具 [**bash-completion**](https://github.com/scop/bash-completion)，
所以你必須先安裝它。

{{< warning>}}
<!-- 
There are two versions of bash-completion, v1 and v2. V1 is for Bash 3.2
(which is the default on macOS), and v2 is for Bash 4.1+. The kubectl completion
script **doesn't work** correctly with bash-completion v1 and Bash 3.2.
It requires **bash-completion v2** and **Bash 4.1+**. Thus, to be able to
correctly use kubectl completion on macOS, you have to install and use
Bash 4.1+ ([*instructions*](https://apple.stackexchange.com/a/292760)).
The following instructions assume that you use Bash 4.1+
(that is, any Bash version of 4.1 or newer).
-->
bash-completion 有兩個版本：v1 和 v2。v1 對應 Bash 3.2（也是 macOS 的預設安裝版本），
v2 對應 Bash 4.1+。kubectl 的補全腳本**無法適配** bash-completion v1 和 Bash 3.2。
必須爲它配備 **bash-completion v2** 和 **Bash 4.1+**。
有鑑於此，爲了在 macOS 上使用 kubectl 補全功能，你必須要安裝和使用 Bash 4.1+
（[**說明**](https://apple.stackexchange.com/a/292760)）。
後續說明假定你用的是 Bash 4.1+（也就是 Bash 4.1 或更新的版本）。
{{< /warning >}}

<!-- 
### Upgrade Bash
-->
### 升級 Bash {#upgrade-bash}

<!-- 
The instructions here assume you use Bash 4.1+. You can check your Bash's version by running:
-->
後續說明假定你已使用 Bash 4.1+。你可以運行以下命令檢查 Bash 版本：

```bash
echo $BASH_VERSION
```

<!-- 
If it is too old, you can install/upgrade it using Homebrew:
-->
如果版本太舊，可以用 Homebrew 安裝/升級：

```bash
brew install bash
```

<!-- 
Reload your shell and verify that the desired version is being used:
-->
重新加載 Shell，並驗證所需的版本已經生效：

```bash
echo $BASH_VERSION $SHELL
```

<!-- 
Homebrew usually installs it at `/usr/local/bin/bash`.
-->
Homebrew 通常把它安裝爲 `/usr/local/bin/bash`。

<!-- 
### Install bash-completion
-->
### 安裝 bash-completion {#install-bash-completion}

{{< note >}}
<!--
As mentioned, these instructions assume you use Bash 4.1+,
which means you will install bash-completion v2 (in contrast to Bash 3.2 and bash-completion v1,
in which case kubectl completion won't work).
-->
如前所述，本說明假定你使用的 Bash 版本爲 4.1+，這意味着你要安裝 bash-completion v2
（不同於 Bash 3.2 和 bash-completion v1，kubectl 的補全功能在該場景下無法工作）。
{{< /note >}}

<!-- 
You can test if you have bash-completion v2 already installed with `type _init_completion`.
If not, you can install it with Homebrew:
-->
你可以用命令 `type _init_completion` 測試 bash-completion v2 是否已經安裝。
如未安裝，用 Homebrew 來安裝它：

```bash
brew install bash-completion@2
```

<!-- 
As stated in the output of this command, add the following to your `~/.bash_profile` file:
-->
如命令的輸出資訊所顯示的，將如下內容添加到檔案 `~/.bash_profile` 中：

```bash
brew_etc="$(brew --prefix)/etc" && [[ -r "${brew_etc}/profile.d/bash_completion.sh" ]] && . "${brew_etc}/profile.d/bash_completion.sh"
```

<!-- 
Reload your shell and verify that bash-completion v2 is correctly installed with `type _init_completion`.
-->
重新加載 Shell，並用命令 `type _init_completion` 驗證 bash-completion v2 已經恰當的安裝。

<!-- 
### Enable kubectl autocompletion
-->
### 啓用 kubectl 自動補全功能 {#enable-kubectl-autocompletion}

<!-- 
You now have to ensure that the kubectl completion script gets sourced in all
your shell sessions. There are multiple ways to achieve this:

- Source the completion script in your `~/.bash_profile` file:
-->
你現在需要確保在所有的 Shell 環境中均已導入（sourced）kubectl 的補全腳本，
有若干種方法可以實現這一點：

- 在檔案 `~/.bash_profile` 中導入（Source）補全腳本：

  ```bash
  echo 'source <(kubectl completion bash)' >>~/.bash_profile
  ```

<!-- 
- Add the completion script to the `/usr/local/etc/bash_completion.d` directory:
-->
- 將補全腳本添加到目錄 `/usr/local/etc/bash_completion.d` 中：

  ```bash
  kubectl completion bash >/usr/local/etc/bash_completion.d/kubectl
  ```

<!-- 
- If you have an alias for kubectl, you can extend shell completion to work with that alias:
-->
- 如果你爲 kubectl 定義了別名，則可以擴展 Shell 補全來兼容該別名：

  ```bash
  echo 'alias k=kubectl' >>~/.bash_profile
  echo 'complete -o default -F __start_kubectl k' >>~/.bash_profile
  ```

<!-- 
- If you installed kubectl with Homebrew (as explained
  [here](/docs/tasks/tools/install-kubectl-macos/#install-with-homebrew-on-macos)),
  then the kubectl completion script should already be in `/usr/local/etc/bash_completion.d/kubectl`.
  In that case, you don't need to do anything.
-->
- 如果你是用 Homebrew 安裝的 kubectl
  （如[此頁面](/zh-cn/docs/tasks/tools/install-kubectl-macos/#install-with-homebrew-on-macos)所描述），
  則 kubectl 補全腳本應該已經安裝到目錄 `/usr/local/etc/bash_completion.d/kubectl`
  中了。這種情況下，你什麼都不需要做。

  {{< note >}}
  <!-- 
  The Homebrew installation of bash-completion v2 sources all the files in the
  `BASH_COMPLETION_COMPAT_DIR` directory, that's why the latter two methods work.
  -->
  用 Hommbrew 安裝的 bash-completion v2 會初始化目錄 `BASH_COMPLETION_COMPAT_DIR`
  中的所有檔案，這就是後兩種方法能正常工作的原因。
  {{< /note >}}

<!-- 
In any case, after reloading your shell, kubectl completion should be working.
-->
總之，重新加載 Shell 之後，kubectl 補全功能將立即生效。
