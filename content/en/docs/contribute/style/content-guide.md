---
title: Documentation Content Guide
linktitle: Content guide
content_template: templates/concept
weight: 10
---

{{% capture overview %}}

This page contains guidelines for Kubernetes documentation.

If you have questions about what's allowed, join the #sig-docs channel in 
[Kubernetes Slack](http://slack.k8s.io/) and ask! 

You can register for Kubernetes Slack at http://slack.k8s.io/. 

For information on creating new content for the Kubernetes
docs, follow the [style guide](/docs/contribute/style/style-guide).

{{% /capture %}}

{{% capture body %}}

## Overview

Source for the Kubernetes website, including the docs, resides in the
[kubernetes/website](https://github.com/kubernetes/website) repository.

Located in the `kubernetes/website/content/<language_code>/docs` folder, the
majority of Kubernetes documentation is specific to the [Kubernetes
project](https://github.com/kubernetes/kubernetes). 

## What's allowed

Kubernetes docs permit only some kinds of content.

### Third party content
Kubernetes documentation includes applied examples of projects in the Kubernetes project&mdash;projects that live in the [kubernetes](https://github.com/kubernetes) and
[kubernetes-sigs](https://github.com/kubernetes-sigs) GitHub organizations. 

Links to active content in the Kubernetes project are always allowed. 

Kubernetes requires some third party content to function. Examples include container runtimes (containerd, CRI-O, Docker), 
[networking policy](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/) (CNI plugins), [Ingress controllers](https://kubernetes.io/docs/concepts/services-networking/ingress-controllers/), and [logging](https://kubernetes.io/docs/concepts/cluster-administration/logging/).

Docs can link to third-party open source software (OSS) outside the Kubernetes project if it's necessary for Kubernetes to function.

### Dual sourced content

Wherever possible, Kubernetes docs link to canonical sources instead of hosting
dual-sourced content.

Dual-sourced content requires double the effort (or more!) to maintain
and grows stale more quickly.

{{< note >}}

If you're a maintainer for a Kubernetes project and need help hosting your own docs, 
ask for help in [#sig-docs on Kubernetes Slack](https://kubernetes.slack.com/messages/C1J0BPD2M/).

{{< /note >}}

### More information

If you have questions about allowed content, join the [Kubernetes Slack](http://slack.k8s.io/) #sig-docs channel and ask!

{{% /capture %}}

{{% capture whatsnext %}}

* Read the [Style guide](/docs/contribute/style/style-guide).

{{% /capture %}}
