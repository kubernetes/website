
<!--
Output shell completion code for the specified shell (bash or zsh).
-->
输出指定 shell (bash or zsh) 的自动补全代码。

<!--
### Synopsis
-->
### 概览



<!--
Output shell completion code for the specified shell (bash or zsh).
The shell code must be evalutated to provide interactive
completion of kubeadm commands. This can be done by sourcing it from
the .bash_profile.
-->
输出指定 shell (bash or zsh) 的自动补全代码。shell 代码必须被执行才能提供交互式的 kubeadm 的命令补全。可以通过 sourcing .bash_profile 文件里的 shell 代码来实现。

<!--
Note: this requires the bash-completion framework, which is not installed
by default on Mac. This can be installed by using homebrew:

    $ brew install bash-completion
-->
注意：这需要 bash-completion 框架，Mac 上没有默认安装。可以使用 homebrew 来安装：

    $ brew install bash-completion

<!--
Once installed, bash_completion must be evaluated. This can be done by adding the
following line to the .bash_profile

    $ source $(brew --prefix)/etc/bash_completion
-->
一旦安装后，bash_completion 必须被执行。可以通过添加下面一行代码到 .bash_profile 来完成。


<!--
Note for zsh users: [1] zsh completions are only supported in versions of zsh >= 5.2
-->
zsh 用户需要注意： [1] zsh 自动完成只在 zsh >= 5.2 的版本才支持。

```
kubeadm completion SHELL
```

<!--
### Examples
-->
### 示例


```

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
```

