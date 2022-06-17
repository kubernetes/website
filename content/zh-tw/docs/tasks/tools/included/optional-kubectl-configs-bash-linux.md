---
title: "Linux 系統中的 bash 自動補全功能"
description: "Linux 系統中 bash 自動補全功能的一些可選配置。"
headless: true
---
<!-- 
---
title: "bash auto-completion on Linux"
description: "Some optional configuration for bash auto-completion on Linux."
headless: true
---
-->

<!-- 
### Introduction
-->
### 簡介 {#introduction}

<!-- 
The kubectl completion script for Bash can be generated with the command `kubectl completion bash`. Sourcing the completion script in your shell enables kubectl autocompletion.

However, the completion script depends on [**bash-completion**](https://github.com/scop/bash-completion), which means that you have to install this software first (you can test if you have bash-completion already installed by running `type _init_completion`).
-->
kubectl 的 Bash 補全指令碼可以用命令 `kubectl completion bash` 生成。
在 shell 中匯入（Sourcing）補全指令碼，將啟用 kubectl 自動補全功能。

然而，補全指令碼依賴於工具 [**bash-completion**](https://github.com/scop/bash-completion)，
所以要先安裝它（可以用命令 `type _init_completion` 檢查 bash-completion 是否已安裝）。

<!-- 
### Install bash-completion
-->
### 安裝 bash-completion {#install-bash-comletion}

<!-- 
bash-completion is provided by many package managers (see [here](https://github.com/scop/bash-completion#installation)). You can install it with `apt-get install bash-completion` or `yum install bash-completion`, etc.

The above commands create `/usr/share/bash-completion/bash_completion`, which is the main script of bash-completion. Depending on your package manager, you have to manually source this file in your `~/.bashrc` file.

To find out, reload your shell and run `type _init_completion`. If the command succeeds, you're already set, otherwise add the following to your `~/.bashrc` file:
-->
很多包管理工具均支援 bash-completion（參見[這裡](https://github.com/scop/bash-completion#installation)）。
可以透過 `apt-get install bash-completion` 或 `yum install bash-completion` 等命令來安裝它。

上述命令將建立檔案 `/usr/share/bash-completion/bash_completion`，它是 bash-completion 的主指令碼。
依據包管理工具的實際情況，你需要在 `~/.bashrc` 檔案中手工匯入此檔案。

要檢視結果，請重新載入你的 shell，並執行命令 `type _init_completion`。
如果命令執行成功，則設定完成，否則將下面內容新增到檔案 `~/.bashrc` 中：

```bash
source /usr/share/bash-completion/bash_completion
```

<!-- 
Reload your shell and verify that bash-completion is correctly installed by typing `type _init_completion`.
-->
重新載入 shell，再輸入命令 `type _init_completion` 來驗證 bash-completion 的安裝狀態。

<!-- 
### Enable kubectl autocompletion
-->
### 啟動 kubectl 自動補全功能 {#enable-kubectl-autocompletion}

#### Bash

<!-- 
You now need to ensure that the kubectl completion script gets sourced in all your shell sessions. There are two ways in which you can do this:
-->
你現在需要確保一點：kubectl 補全指令碼已經匯入（sourced）到 shell 會話中。
可以透過以下兩種方法進行設定：

{{< tabs name="kubectl_bash_autocompletion" >}}
{{{< tab name="當前使用者" codelang="bash" >}}
echo 'source <(kubectl completion bash)' >>~/.bashrc
{{< /tab >}}
{{< tab name="系統全域性" codelang="bash" >}}
kubectl completion bash | sudo tee /etc/bash_completion.d/kubectl > /dev/null
{{< /tab >}}}
{{< /tabs >}}

<!-- 
If you have an alias for kubectl, you can extend shell completion to work with that alias:
-->
如果 kubectl 有關聯的別名，你可以擴充套件 shell 補全來適配此別名：

```bash
echo 'alias k=kubectl' >>~/.bashrc
echo 'complete -o default -F __start_kubectl k' >>~/.bashrc
```

{{< note >}}
<!-- 
bash-completion sources all completion scripts in `/etc/bash_completion.d`.
-->
bash-completion 負責匯入 `/etc/bash_completion.d` 目錄中的所有補全指令碼。
{{< /note >}}

<!-- 
Both approaches are equivalent. After reloading your shell, kubectl autocompletion should be working.
-->
兩種方式的效果相同。重新載入 shell 後，kubectl 自動補全功能即可生效。
