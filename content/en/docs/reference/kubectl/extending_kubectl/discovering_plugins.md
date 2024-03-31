---
title: "Discovering Plugins"
linkTitle: "Discovering Plugins"
weight: 2
type: docs
description: >
   Discovering Plugins that suits your requirement
---



By design, `kubectl` does not install plugins. This task is left to the kubernetes sub-project
[krew.sigs.k8s.io](https://krew.sigs.k8s.io/) which needs to be installed separately.
Krew helps to

- discover plugins
- get updates for installed plugins
- remove plugins

## Installing krew

Krew should be used as a kubectl plugin. To set yourself up to using krew - please check out the [Installation section for krew](https://krew.sigs.k8s.io/docs/user-guide/setup/install/)

## Krew capabilities

Discover plugins
```bash
kubectl krew search
```

Install a plugin
```bash
kubectl krew install access-matrix
```

Upgrade all installed plugins
```bash
kubectl krew upgrade
```

Show details about a plugin
```bash
kubectl krew info access-matrix
```

Uninstall a plugin
```bash
kubectl krew uninstall access-matrix
```