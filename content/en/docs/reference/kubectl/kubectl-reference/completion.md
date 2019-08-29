---
title: completion
content_template: templates/tool-reference
---

### Overview
Output shell completion code for the specified shell (bash or zsh). The shell code must be evaluated to provide interactive completion of kubectl commands.  This can be done by sourcing it from the .bash_profile.

 Detailed instructions on how to do this are available here: https://kubernetes.io/docs/tasks/tools/install-kubectl/#enabling-shell-autocompletion

 Note for zsh users: [1] zsh completions are only supported in versions of zsh >= 5.2

### Usage

`completion SHELL`


### Example

 Installing bash completion on macOS using homebrew ## If running Bash 3.2 included with macOS

```shell
brew install bash-completion
```

# or, if running Bash 4.1+

```shell
brew install bash-completion@2
```

# If kubectl is installed via homebrew, this should start working immediately. ## If you've installed via other means, you may need add the completion to your completion directory

```shell
kubectl completion bash > $(brew --prefix)/etc/bash_completion.d/kubectl
```

 Installing bash completion on Linux ## If bash-completion is not installed on Linux, please install the 'bash-completion' package ## via your distribution's package manager. ## Load the kubectl completion code for bash into the current shell

```shell
source <(kubectl completion bash)
```

# Write bash completion code to a file and source if from .bash_profile

```shell
kubectl completion bash > ~/.kube/completion.bash.inc
printf "
```

 Kubectl shell completion

```shell
source '$HOME/.kube/completion.bash.inc'
" >> $HOME/.bash_profile
source $HOME/.bash_profile
```

 Load the kubectl completion code for zsh[1] into the current shell

```shell
source <(kubectl completion zsh)
```

 Set the kubectl completion code for zsh[1] to autoload on startup

```shell
kubectl completion zsh > "${fpath[1]}/_kubectl"
```







<hr>


### Version

<div class="kubectl-reference-copyright">

<a href="https://github.com/kubernetes/kubernetes">Kubectl Reference Docs  
{{< param "fullversion" >}}   &#xa9;Copyright 2019 The Kubernetes Authors</a>

</div>

