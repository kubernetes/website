---
title: "Plugin Mechanism"
linkTitle: "Plugin Mechanism"
weight: 1
type: docs
description: >
   Working with Plugins
---


{{< alert color="success" title="TL;DR" >}}

- Drop executables named `kubectl-plugin_name` on your `PATH` and invoke with `kubectl plugin-name`

- `kubectl plugin list` shows available plugins

{{< /alert >}}

# Kubectl plugins

Kubectl plugins are a lightweight mechanism to extend `kubectl` with custom functionality to suit your needs.

## Plugin mechanism

As of version 1.12, kubectl has a simple plugin mechanism to expose binaries on your `PATH` as kubectl subcommands.
When invoking an unknown subcommand `kubectl my-plugin`, kubectl starts searching for an executable named `kubectl-my_plugin` on your `PATH`.
Note how the dash is mapped to an underscore. This is to enable plugins that are invoked by multiple words, for example 
`kubectl my plugin` would trigger a search for the commands `kubectl-my-plugin` or `kubectl-my`. The more specific match
always wins over the other, so if both `kubectl-my` and `kubectl-my-plugin` exist, the latter will be called.
When a matching executable is found, kubectl calls it, forwarding all extra arguments.

The reference on [kubernetes.io](https://kubernetes.io/docs/tasks/extend-kubectl/kubectl-plugins/) knows more.

{{< alert color="success" title="Windows compatibility" >}}
On windows, the minimum required version to use the plugin mechanism is 1.14.
{{< /alert >}}

Listing installed plugins
```bash
kubectl plugin list
```