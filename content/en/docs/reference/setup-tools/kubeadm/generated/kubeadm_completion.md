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


Output shell completion code for the specified shell (bash or zsh)

### Synopsis



Output shell completion code for the specified shell (bash or zsh).
The shell code must be evaluated to provide interactive
completion of kubeadm commands. This can be done by sourcing it from
the .bash_profile.

Note: this requires the bash-completion framework.

To install it on Mac use homebrew:
    $ brew install bash-completion
Once installed, bash_completion must be evaluated. This can be done by adding the
following line to the .bash_profile
    $ source $(brew --prefix)/etc/bash_completion

If bash-completion is not installed on Linux, please install the 'bash-completion' package
via your distribution's package manager.

Note for zsh users: [1] zsh completions are only supported in versions of zsh &gt;= 5.2

```
kubeadm completion SHELL [flags]
```

### Examples

```

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
```

### Options

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
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>help for completion</p></td>
</tr>

</tbody>
</table>



### Options inherited from parent commands

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
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>[EXPERIMENTAL] The path to the 'real' host root filesystem.</p></td>
</tr>

</tbody>
</table>



