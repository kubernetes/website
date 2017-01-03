------------

# completion



Output shell completion code for the given shell (bash or zsh). 

This command prints shell code which must be evaluation to provide interactive completion of kubectl commands. 

  $ source <(kubectl completion bash)
  
will load the kubectl completion code for bash. Note that this depends on the bash-completion framework. It must be sourced before sourcing the kubectl completion, e.g. on the Mac: 

  $ brew install bash-completion
  $ source $(brew --prefix)/etc/bash_completion
  $ source <(kubectl completion bash)
  
If you use zsh [1], the following will load kubectl zsh completion: 

  $ source <(kubectl completion zsh)
  
 [1] zsh completions are only supported in versions of zsh >= 5.2

### Usage

`$ completion SHELL`



