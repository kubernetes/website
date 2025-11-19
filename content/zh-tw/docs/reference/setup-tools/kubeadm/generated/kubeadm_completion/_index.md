<!--
### Synopsis
-->
### 概要

<!--
Output shell completion code for the specified shell (bash or zsh).
The shell code must be evaluated to provide interactive
completion of kubeadm commands. This can be done by sourcing it from
the .bash_profile.
-->
爲指定的 Shell（Bash 或 Zsh）輸出 Shell 補全代碼。
必須激活 Shell 代碼以提供交互式 kubeadm 命令補全。
這可以通過加載 .bash_profile 文件完成。

<!--
Note: this requires the bash-completion framework.
-->
注意：此功能依賴於 `bash-completion` 框架。

<!--
To install it on Mac use homebrew:
    $ brew install bash-completion
Once installed, bash_completion must be evaluated. This can be done by adding the
following line to the .bash_profile
    $ source $(brew --prefix)/etc/bash_completion
-->
在 Mac 上使用 Homebrew 安裝：

```bash
brew install bash-completion
```

安裝後，必須激活 `bash_completion`。
這可以通過在 `.bash_profile` 文件中添加下面的命令行來完成：

```bash
source $(brew --prefix)/etc/bash_completion
```

<!--
If bash-completion is not installed on Linux, please install the 'bash-completion' package
via your distribution's package manager.
-->
如果在 Linux 上沒有安裝 `bash-completion`，請通過你的發行版的包管理器安裝 `bash-completion` 軟件包。

<!--
Note for zsh users: [1] zsh completions are only supported in versions of zsh &gt;= 5.2
-->
Zsh 用戶注意事項：[1] Zsh 自動補全僅在 v5.2 及以上版本中支持。

```shell
kubeadm completion SHELL [flags]
```

<!--
### Examples
-->
### 示例

<!--
# Install bash completion on a Mac using homebrew
brew install bash-completion
printf "\n# Bash completion support\nsource $(brew --prefix)/etc/bash_completion\n" >> $HOME/.bash_profile
source $HOME/.bash_profile

# Load the kubeadm completion code for bash into the current shell
source <(kubeadm completion bash)

# Write bash completion code to a file and source it from .bash_profile
kubeadm completion bash > ~/.kube/kubeadm_completion.bash.inc
printf "\n# Kubeadm shell completion\nsource '$HOME/.kube/kubeadm_completion.bash.inc'\n" >> $HOME/.bash_profile
source $HOME/.bash_profile

# Load the kubeadm completion code for zsh[1] into the current shell
source <(kubeadm completion zsh)
-->
```bash
# 在 Mac 上使用 Homebrew 安裝 bash completion
brew install bash-completion
printf "\n# Bash completion support\nsource $(brew --prefix)/etc/bash_completion\n" >> $HOME/.bash_profile
source $HOME/.bash_profile

# 將 bash 版本的 kubeadm 自動補全代碼加載到當前 Shell 中
source <(kubeadm completion bash)

# 將 Bash 自動補全完成代碼寫入文件並且從 .bash_profile 文件加載它
printf "\n# Kubeadm shell completion\nsource '$HOME/.kube/kubeadm_completion.bash.inc'\n" >> $HOME/.bash_profile
source $HOME/.bash_profile

# 將 Zsh 版本的 kubeadm 自動補全代碼加載到當前 Shell 中
source <(kubeadm completion zsh)
```

<!--
### Options
-->
### 選項

   <table style="width: 100%; table-layout: fixed;">
<colgroup>
<col span="1" style="width: 10px;" />
<col span="1" />
</colgroup>
<tbody>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
help for completion
-->
completion 操作的幫助命令。
</p>
</td>
</tr>

</tbody>
</table>

<!--
### Options inherited from parent commands
-->
### 從父命令繼承的選項

<table style="width: 100%; table-layout: fixed;">
<colgroup>
<col span="1" style="width: 10px;" />
<col span="1" />
</colgroup>
<tbody>

<tr>
<td colspan="2">--rootfs string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
The path to the 'real' host root filesystem. This will cause kubeadm to chroot into the provided path.
-->
到“真實”主機根文件系統的路徑。設置此標誌將導致 kubeadm 切換到所提供的路徑。
</p>
</td>
</tr>

</tbody>
</table>
