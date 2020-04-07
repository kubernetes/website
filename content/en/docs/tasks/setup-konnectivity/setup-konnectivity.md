---
title: Set up Konnectivity service
content_template: templates/task
weight: 70
---

{{% capture overview %}}

The Konnectivity service provides TCP level proxy for the Master → Cluster
communication.

{{% /capture %}}

{{% capture prerequisites %}}

{{< include "task-tutorial-prereqs.md" >}}

{{% /capture %}}

{{% capture steps %}}

## Configure the Konnectivity service

First, you need to configure the API Server to use the Konnectivity service
to direct its network traffic to cluster nodes:

1. Set the `--egress-selector-config-file` flag of the API Server, it is the
path to the API Server egress configuration file.
1. At the path, create a configuration file. For example,

{{< codenew file="admin/konnectivity/egress-selector-configuration.yaml" >}}

Next, you need to deploy the Konnectivity server and agents.
[kubernetes-sigs/apiserver-network-proxy](https://github.com/kubernetes-sigs/apiserver-network-proxy)
is a reference implementation.

Deploy the Konnectivity server on your master node. The provided yaml assumes
that the Kubernetes components are deployed as a {{< glossary_tooltip text="static Pod"
term_id="static-pod" >}} in your cluster. If not, you can deploy the Konnectivity
server as a DaemonSet.

{{< codenew file="admin/konnectivity/konnectivity-server.yaml" >}}

Then deploy the Konnectivity agents in your cluster:

{{< codenew file="admin/konnectivity/konnectivity-agent.yaml" >}}

Last, if RBAC is enabled in your cluster, create the relevant RBAC rules:

{{< codenew file="admin/konnectivity/konnectivity-rbac.yaml" >}}

{{% /capture %}}