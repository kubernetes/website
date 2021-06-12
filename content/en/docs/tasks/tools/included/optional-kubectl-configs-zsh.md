---
title: "zsh auto-completion"
description: "Some optional configuration for zsh auto-completion."
headless: true
---

The kubectl completion script for Zsh can be generated with the command `kubectl completion zsh`. Sourcing the completion script in your shell enables kubectl autocompletion.

To do so in all your shell sessions, add the following to your `~/.zshrc` file:

```zsh
source <(kubectl completion zsh)
```

If you have an alias for kubectl, you can extend shell completion to work with that alias:

```zsh
echo 'alias k=kubectl' >>~/.zshrc
echo 'complete -F __start_kubectl k' >>~/.zshrc
```

After reloading your shell, kubectl autocompletion should be working.

If you get an error like `complete:13: command not found: compdef`, then add the following to the beginning of your `~/.zshrc` file:

```zsh
autoload -Uz compinit
compinit
```