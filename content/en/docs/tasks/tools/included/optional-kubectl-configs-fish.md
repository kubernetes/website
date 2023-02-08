---
title: "fish auto-completion"
description: "Optional configuration to enable fish shell auto-completion."
headless: true
_build:
  list: never
  render: never
  publishResources: false
---

{{< note >}}
Autocomplete for Fish requires kubectl 1.23 or later.
{{< /note >}}

The kubectl completion script for Fish can be generated with the command `kubectl completion fish`. Sourcing the completion script in your shell enables kubectl autocompletion.

To do so in all your shell sessions, add the following line to your `~/.config/fish/config.fish` file:

```shell
kubectl completion fish | source
```

After reloading your shell, kubectl autocompletion should be working.
