---
layout: blog
title: "Kubernetes 1.27: Safer, More Performant Pruning in kubectl apply"
date: 2023-05-09
slug: introducing-kubectl-applyset-pruning
author: >
   Katrina Verey (independent),
   Justin Santa Barbara (Google)
---

Declarative configuration management with the `kubectl apply` command is the gold standard approach
to creating or modifying Kubernetes resources. However, one challenge it presents is the deletion
of resources that are no longer needed. In Kubernetes version 1.5, the `--prune` flag was
introduced to address this issue, allowing kubectl apply to automatically clean up previously
applied resources removed from the current configuration.

Unfortunately, that existing implementation of `--prune` has design flaws that diminish its
performance and can result in unexpected behaviors. The main issue stems from the lack of explicit
encoding of the previously applied set by the preceding `apply` operation, necessitating
error-prone dynamic discovery. Object leakage, inadvertent over-selection of resources, and limited
compatibility with custom resources are a few notable drawbacks of this implementation. Moreover,
its coupling to client-side apply hinders user upgrades to the superior server-side apply
mechanism.

Version 1.27 of `kubectl` introduces an alpha version of a revamped pruning implementation that
addresses these issues. This new implementation, based on a concept called _ApplySet_, promises
better performance and safety.

An _ApplySet_ is a group of resources associated with a _parent_ object on the cluster, as
identified and configured through standardized labels and annotations. Additional standardized
metadata allows for accurate identification of ApplySet _member_ objects within the cluster,
simplifying operations like pruning.

To leverage ApplySet-based pruning, set the `KUBECTL_APPLYSET=true` environment variable and include
the flags `--prune` and `--applyset` in your `kubectl apply` invocation:

```shell
KUBECTL_APPLYSET=true kubectl apply -f <directory/> --prune --applyset=<name>
```

By default, ApplySet uses a Secret as the parent object. However, you can also use
a ConfigMap with the format `--applyset=configmaps/<name>`. If your desired Secret or
ConfigMap object does not yet exist, `kubectl` will create it for you. Furthermore, custom
resources can be enabled for use as ApplySet parent objects.

The ApplySet implementation is based on a new low-level specification that can support higher-level
ecosystem tools by improving their interoperability. The lightweight nature of this specification
enables these tools to continue to use existing object grouping systems while opting in to
ApplySet's metadata conventions to prevent inadvertent changes by other tools (such as `kubectl`).

ApplySet-based pruning offers a promising solution to the shortcomings of the previous `--prune`
implementation in `kubectl` and can help streamline your Kubernetes resource management. Please
give this new feature a try and share your experiences with the community—ApplySet is under active
development, and your feedback is invaluable!


### Additional resources

- For more information how to use ApplySet-based pruning, read
  [Declarative Management of Kubernetes Objects Using Configuration Files](/docs/tasks/manage-kubernetes-objects/declarative-config/) in the Kubernetes documentation.
- For a deeper dive into the technical design of this feature or to learn how to implement the
  ApplySet specification in your own tools, refer to [KEP&nbsp;3659](https://git.k8s.io/enhancements/keps/sig-cli/3659-kubectl-apply-prune/README.md):
  _ApplySet: `kubectl apply --prune` redesign and graduation strategy_.


### How do I get involved?

If you want to get involved in ApplySet development, you can get in touch with the developers at
[SIG CLI](https://git.k8s.io/community/sig-cli). To provide feedback on the feature, please
[file a bug](https://github.com/kubernetes/kubectl/issues/new?assignees=knverey,justinsb&labels=kind%2Fbug&template=bug-report.md)
or [request an enhancement](https://github.com/kubernetes/kubectl/issues/new?assignees=knverey,justinsb&labels=kind%2Fbug&template=enhancement.md)
on the `kubernetes/kubectl` repository.
