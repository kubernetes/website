<!--
The file is auto-generated from the Go source code of the component using a generic
[generator](https://github.com/kubernetes-sigs/reference-docs/). To learn how
to generate the reference documentation, please read
[Contributing to the reference documentation](/docs/contribute/generate-ref-docs/).
To update the reference content, please follow the
[Contributing upstream](/docs/contribute/generate-ref-docs/contribute-upstream/)
guide. You can file document formatting bugs against the
[reference-docs](https://github.com/kubernetes-sigs/reference-docs/) project.
-->

<!--
Output shell completion code for the specified shell (bash or zsh)
-->
为指定 Shell（Bash 或 Zsh） 输出 Shell 补全代码

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

为指定的 shell（bash 或 zsh）输出 shell 自动补全代码。
必须激活 shell 代码以提供交互式 kubeadm 命令补全。这可以通过加载 .bash_profile 文件完成。

<!--
Note: this requires the bash-completion framework.
-->

注意: 此功能依赖于 `bash-completion` 框架。

<!--
To install it on Mac use homebrew:
    $ brew install bash-completion
Once installed, bash_completion must be evaluated. This can be done by adding the
following line to the .bash_profile
    $ source $(brew --prefix)/etc/bash_completion
-->

在 Mac 上使用 homebrew 安装:

```
brew install bash-completion
```

安装后，必须激活 bash_completion。这可以通过在 .bash_profile 文件中添加下面的命令行来完成

```
source $(brew --prefix)/etc/bash_completion
```

<!--
If bash-completion is not installed on Linux, please install the 'bash-completion' package
via your distribution's package manager.
-->

如果在 Linux 上没有安装 bash-completion，请通过你的发行版的包管理器安装 `bash-completion` 软件包。

<!--
Note for zsh users: [1] zsh completions are only supported in versions of zsh &gt;= 5.2
-->

zsh 用户注意事项：[1] zsh 自动补全仅在 &gt;=v5.2 及以上版本中支持。

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
# 在 Mac 上使用 homebrew 安装 bash completion
brew install bash-completion
printf "\n# Bash completion support\nsource $(brew --prefix)/etc/bash_completion\n" >> $HOME/.bash_profile
source $HOME/.bash_profile

# 将 bash 版本的 kubeadm 自动补全代码加载到当前 shell 中
source <(kubeadm completion bash)

# 将 bash 自动补全完成代码写入文件并且从 .bash_profile 文件加载它
printf "\n# Kubeadm shell completion\nsource '$HOME/.kube/kubeadm_completion.bash.inc'\n" >> $HOME/.bash_profile
source $HOME/.bash_profile

# 将 zsh 版本的 kubeadm 自动补全代码加载到当前 shell 中
source <(kubeadm completion zsh)
```

<!--
### Options
-->

### 选项

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
completion 操作的帮助命令
</p>
</td>
</tr>

</tbody>
</table>

<!--
### Options inherited from parent commands
-->

### 从父命令继承的选项

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
[实验] 到 '真实' 主机根文件系统的路径。
</p>
</td>
</tr>

</tbody>
</table>

