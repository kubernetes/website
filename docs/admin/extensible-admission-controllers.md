---
assignees:
- smarterclayton
- lavalamp
- whitlockjc
- caesrxuchao
title: Extending admission controllers
---

* TOC
{:toc}

Please read ./admission-controllers.md for background knowledge of admission controllers.

## How do I extend admission controllers?

The plugin-style admission controllers need to be compiled in-tree, are only configurable when the apiserver starts up.

In 1.7, we introduced Initializers and External Admission Hook, both of them enables extending admission controllers without recompilation and are configurable at runtime.

## What are they?

Initializers: muntating AC

External webhook: non-mutating, called in parallel

## When are they called?

AdmissionChain, depends on the admission-controller-config

Recommended plug-in order:
???
```
--admission-control=Initializer,NamespaceLifecycle,LimitRanger,ServiceAccount,PersistentVolumeLabel,DefaultStorageClass,ResourceQuota,DefaultTolerationSeconds,GenericAdmissionWebhook"
```

## Dynamic configuration

Making sure the initializer controller and the webhook controller are running before updating ACC

The configurations are guaranteed to be effective 1 second after they are committed

## Failure mode, Fail Open vs. Fail closed
