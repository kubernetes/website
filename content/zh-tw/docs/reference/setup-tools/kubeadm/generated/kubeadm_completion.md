<!--
The file is auto-generated from the Go source code of the component using a generic
[generator](https://github.com/kubernetes-sigs/reference-docs/). To learn how
to generate the reference documentation, please read
[Contributing to the reference documentation](/docs/contribute/generate-ref-docs/).
To update the reference conent, please follow the 
[Contributing upstream](/docs/contribute/generate-ref-docs/contribute-upstream/)
guide. You can file document formatting bugs against the
[reference-docs](https://github.com/kubernetes-sigs/reference-docs/) project.
-->

<!--
Output shell completion code for the specified shell (bash or zsh)
-->
為指定 Shell（Bash 或 Zsh） 輸出 Shell 補全程式碼

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

為指定的 shell（bash 或 zsh）輸出 shell 自動補全程式碼。
必須啟用 shell 程式碼以提供互動式 kubeadm 命令補全。這可以透過載入 .bash_profile 檔案完成。

<!--
Note: this requires the bash-completion framework.
-->

注意: 此功能依賴於 `bash-completion` 框架。

<!--
To install it on Mac use homebrew:
    $ brew install bash-completion
Once installed, bash_completion must be evaluated. This can be done by adding the
following line to the .bash_profile
    $ source $(brew --prefix)/etc/bash_completion
-->

在 Mac 上使用 homebrew 安裝:

```
brew install bash-completion
```

安裝後，必須啟用 bash_completion。這可以透過在 .bash_profile 檔案中新增下面的命令列來完成

```
source $(brew --prefix)/etc/bash_completion
```

<!--
If bash-completion is not installed on Linux, please install the 'bash-completion' package
via your distribution's package manager.
-->

如果在 Linux 上沒有安裝 bash-completion，請透過你的發行版的包管理器安裝 `bash-completion` 軟體包。

<!--
Note for zsh users: [1] zsh completions are only supported in versions of zsh &gt;= 5.2
-->

zsh 使用者注意事項：[1] zsh 自動補全僅在 &gt;=v5.2 及以上版本中支援。

```
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

# Write bash completion code to a file and source if from .bash_profile
kubeadm completion bash > ~/.kube/kubeadm_completion.bash.inc
printf "\n# Kubeadm shell completion\nsource '$HOME/.kube/kubeadm_completion.bash.inc'\n" >> $HOME/.bash_profile
source $HOME/.bash_profile

# Load the kubeadm completion code for zsh[1] into the current shell
source <(kubeadm completion zsh)
-->

```
# 在 Mac 上使用 homebrew 安裝 bash completion
brew install bash-completion
printf "\n# Bash completion support\nsource $(brew --prefix)/etc/bash_completion\n" >> $HOME/.bash_profile
source $HOME/.bash_profile

# 將 bash 版本的 kubeadm 自動補全程式碼載入到當前 shell 中
source <(kubeadm completion bash)

# 將 bash 自動補全完成程式碼寫入檔案並且從 .bash_profile 檔案載入它
printf "\n# Kubeadm shell completion\nsource '$HOME/.kube/kubeadm_completion.bash.inc'\n" >> $HOME/.bash_profile
source $HOME/.bash_profile

# 將 zsh 版本的 kubeadm 自動補全程式碼載入到當前 shell 中
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
<!-- help for completion -->
<p>
completion 操作的幫助命令
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
<!--
[EXPERIMENTAL] The path to the 'real' host root filesystem.
-->
<p>
[實驗] 到 '真實' 主機根檔案系統的路徑。
</p>
</td>
</tr>

</tbody>
</table>

