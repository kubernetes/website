---
title: Bring your ideas to the world with kubectl plugins
date: 2020-02-28
author: >
  Cornelius Weig (TNG Technology Consulting GmbH)
---

`kubectl` is the most critical tool to interact with Kubernetes and has to address multiple user personas, each with their own needs and opinions. 
One way to make `kubectl` do what you need is to build new functionality into `kubectl`.


## Challenges with building commands into `kubectl`

However, that's easier said than done. Being such an important cornerstone of
Kubernetes, any meaningful change to `kubectl` needs to undergo a Kubernetes
Enhancement Proposal (KEP) where the intended change is discussed beforehand.

When it comes to implementation, you'll find that `kubectl` is an ingenious and
complex piece of engineering. It might take a long time to get used to
the processes and style of the codebase to get done what you want to achieve. Next
comes the review process which may go through several rounds until it meets all
the requirements of the Kubernetes maintainers -- after all, they need to take
over ownership of this feature and maintain it from the day it's merged.

When everything goes well, you can finally rejoice. Your code will be shipped
with the next Kubernetes release. Well, that could mean you need to wait
another 3 months to ship your idea in `kubectl` if you are unlucky.

So this was the happy path where everything goes well. But there are good
reasons why your new functionality may never make it into `kubectl`. For one,
`kubectl` has a particular look and feel and violating that style will not be
acceptable by the maintainers. For example, an interactive command that
produces output with colors would be inconsistent with the rest of `kubectl`.
Also, when it comes to tools or commands useful only to a minuscule proportion
of users, the maintainers may simply reject your proposal as `kubectl` needs to
address common needs.

But this doesn’t mean you can’t ship your ideas to `kubectl` users.

## What if you didn’t have to change `kubectl` to add functionality?

This is where `kubectl` [plugins](https://kubernetes.io/docs/tasks/extend-kubectl/kubectl-plugins/) shine.
Since `kubectl` v1.12, you can simply
drop executables into your `PATH`, which follows the naming pattern
`kubectl-myplugin`. Then you can execute this plugin as `kubectl myplugin`, and
it will just feel like a normal sub-command of `kubectl`.

Plugins give you the opportunity to try out new experiences like terminal UIs,
colorful output, specialized functionality, or other innovative ideas. You can
go creative, as you’re the owner of your own plugin.

Further, plugins offer safe experimentation space for commands you’d like to
propose to `kubectl`. By pre-releasing as a plugin, you can push your
functionality faster to the end-users and quickly gather feedback. For example,
the [kubectl-debug](https://github.com/verb/kubectl-debug) plugin is proposed
to become a built-in command in `kubectl` in a
[KEP](https://github.com/kubernetes/enhancements/blob/master/keps/sig-cli/20190805-kubectl-debug.md)).
In the meanwhile, the plugin author can ship the functionality and collect
feedback using the plugin mechanism.

## How to get started with developing plugins

If you already have an idea for a plugin, how do you best make it happen?
First you have to ask yourself if you can implement it as a wrapper around
existing `kubectl` functionality. If so, writing the plugin as a shell script
is often the best way forward, because the resulting plugin will be small,
works cross-platform, and has a high level of trust because it is not
compiled.

On the other hand, if the plugin logic is complex, a general-purpose language
is usually better. The canonical choice here is Go, because you can use the
excellent `client-go` library to interact with the Kubernetes API. The Kubernetes
maintained [sample-cli-plugin](https://github.com/kubernetes/sample-cli-plugin)
demonstrates some best practices and can be used as a template for new plugin
projects.

When the development is done, you just need to ship your plugin to the
Kubernetes users. For the best plugin installation experience and discoverability,
you should consider doing so via the
[krew](https://github.com/kubernetes-sigs/krew) plugin manager. For an in-depth
discussion about the technical details around `kubectl` plugins, refer to the
documentation on [kubernetes.io](https://kubernetes.io/docs/tasks/extend-kubectl/kubectl-plugins/).
