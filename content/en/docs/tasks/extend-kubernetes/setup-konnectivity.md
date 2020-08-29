---
title: Set up Konnectivity service
content_type: task
weight: 70
---

<!-- overview -->

The Konnectivity service provides a TCP level proxy for the control plane to cluster
communication.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## Configure the Konnectivity service

The following steps require an egress configuration, for example:

{{< codenew file="admin/konnectivity/egress-selector-configuration.yaml" >}}

You need to configure the API Server to use the Konnectivity service
and direct the network traffic to the cluster nodes:

1. Create an egress configuration file such as `admin/konnectivity/egress-selector-configuration.yaml`.
1. Set the `--egress-selector-config-file` flag of the API Server to the path of
your API Server egress configuration file.

Next, you need to deploy the Konnectivity server and agents.
[kubernetes-sigs/apiserver-network-proxy](https://github.com/kubernetes-sigs/apiserver-network-proxy)
is a reference implementation.

Deploy the Konnectivity server on your control plane node. The provided
`konnectivity-server.yaml` manifest assumes
that the Kubernetes components are deployed as a {{< glossary_tooltip text="static Pod"
term_id="static-pod" >}} in your cluster. If not, you can deploy the Konnectivity
server as a DaemonSet.

{{< codenew file="admin/konnectivity/konnectivity-server.yaml" >}}

Then deploy the Konnectivity agents in your cluster:

{{< codenew file="admin/konnectivity/konnectivity-agent.yaml" >}}

Last, if RBAC is enabled in your cluster, create the relevant RBAC rules:

{{< codenew file="admin/konnectivity/konnectivity-rbac.yaml" >}}
