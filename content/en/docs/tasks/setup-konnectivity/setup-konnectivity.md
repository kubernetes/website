---
title: Setup Konnectivity Service 
content_template: templates/task
weight: 110
---

The Konnectivity service provides TCP level proxy for the Master → Cluster
communication.

You can set it up with the following steps.

First, you need to configure the API Server to use the Konnectivity service
to direct its network traffic to cluster nodes:
1. Set the `--egress-selector-config-file` flag of the API Server, it is the
path to the API Server egress configuration file.
2. At the path, create a configuration file. For example,

{{< codenew file="admin/konnectivity/egress-selector-configuration.yaml" >}}

Next, you need to deploy the Konnectivity service server and agents.
[kubernetes-sigs/apiserver-network-proxy](https://github.com/kubernetes-sigs/apiserver-network-proxy)
is a reference implementation.

Deploy the Konnectivity server on your master node. The provided yaml assuming
Kubernetes components are deployed as {{< glossary_tooltip text="static pod"
term_id="static-pod" >}} in your cluster. If not , you can deploy it as a
Daemonset to be reliable.

{{< codenew file="admin/konnectivity/konnectivity-server.yaml" >}}

Then deploy the Konnectivity agents in your cluster:

{{< codenew file="admin/konnectivity/konnectivity-agent.yaml" >}}

Last, if RBAC is enabled in your cluster, create the relevant RBAC rules:

{{< codenew file="admin/konnectivity/konnectivity-rbac.yaml" >}}
