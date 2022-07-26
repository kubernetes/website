---
title: "fish auto-completion"
description: "Optional configuration to enable fish shell auto-completion."
headless: true
---

The kubectl completion script for Fish can be generated with the command `kubectl completion fish`. Sourcing the completion script in your shell enables kubectl autocompletion.

To do so in all your shell sessions, add the following line to your `~/.config/fish/config.fish` file:

```shell
kubectl completion fish | source
```

After reloading your shell, kubectl autocompletion should be working.

### Fig

You can get IDE-style autocompletions for kubectl also using [Fig](https://fig.io/) <a href="https://fig.io/" target="_blank"><img src="https://fig.io/badges/Logo.svg" width="15" height="15"/></a>. Fig works for bash, zsh, and fish.

To install, run:

```shell
brew install fig
```
