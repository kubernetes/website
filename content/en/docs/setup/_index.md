---
reviewers:
- brendandburns
- erictune
- mikedanese
no_issue: true
title: Getting started
main_menu: true
weight: 20
content_template: templates/concept
card:
  name: setup
  weight: 20
  anchors:
  - anchor: "#learning-environment"
    title: Learning environment
  - anchor: "#production-environment"
    title: Production environment  
---

{{% capture overview %}}

This section covers different options to set up and run Kubernetes.

Different Kubernetes solutions meet different requirements: ease of maintenance, security, control, available resources, and expertise required to operate and manage a cluster.

You can deploy a Kubernetes cluster on a local machine, cloud, on-prem datacenter, or choose a managed Kubernetes cluster. You can also create custom solutions across a wide range of cloud providers, or bare metal environments.

More simply, you can create a Kubernetes cluster in learning and production environments.

{{% /capture %}}

{{% capture body %}}

## Learning environment

If you're learning Kubernetes, use the Docker-based solutions: tools supported by the Kubernetes community, or tools in the ecosystem to set up a Kubernetes cluster on a local machine.

{{< table caption="Local machine solutions table that lists the tools supported by the community and the ecosystem to deploy Kubernetes." >}}

|Community           |Ecosystem     |
| ------------       | --------     |
| [Minikube](/docs/setup/learning-environment/minikube/) | [Docker Desktop](https://www.docker.com/products/docker-desktop)|
| [kind (Kubernetes IN Docker)](/docs/setup/learning-environment/kind/) | [Minishift](https://docs.okd.io/latest/minishift/)|
|                     | [MicroK8s](https://microk8s.io/)|


## Production environment

When evaluating a solution for a production environment, consider which aspects of operating a Kubernetes cluster (or _abstractions_) you want to manage yourself or offload to a provider.

[Kubernetes Partners](https://kubernetes.io/partners/#conformance) includes a list of [Certified Kubernetes](https://github.com/cncf/k8s-conformance/#certified-kubernetes) providers.

{{% /capture %}}
