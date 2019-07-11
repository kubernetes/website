---
toc_hide: true
title: Node controller
content_template: templates/concept
---

{{% capture overview %}}

The node controller is a Kubernetes master component which manages various
aspects of nodes.

{{% /capture %}}

{{% capture body %}}

## Controller behavior

The node controller has multiple roles in a node's life.

### Roles

1.  If CIDR assignment is enabled, this controller assigns a CIDR block to each
    new Node when it is registered.
2.  This controller tracks and caches the cloud provider's list of available machines.
    When running in a cloud environment, and a node becomes unhealthy, the node
    controller queries the cloud provider's API to discover whether the server
    representing the unhealthy Node is still available. If the cloud provider API
    shows the server is gone / missing, the node controller stops tracking the Node.
3.  This controller watches running Nodes and updates the
    [conditions](/docs/concepts/architecture/nodes/#condition) field if the kubelet on
    a server stops sending heartbeats.
    Heartbeats come in 2 kinds:
    - changes to the associated Lease resource in the `kube-node-lease` namespace
    - updates to the Node's `.nodeStatus` field
    
    Either kind of heartbeat counts as a sign that the Node is still alive.
    If a Node becomes unreachable (the node controller hasn't seen the heartbeats
    for at least `--node-monitor-grace-period` seconds), this controller sets the Node's
    condition to `Unknown`.
4.  When something sets a condition on a Node, this controller additionally
    {{< glossary_tooltip text="taints" term_id="taint" >}} the Node with taints inside
    `node.kubernetes.io/`. For example, `node.kubernetes.io/unreachable` is the taint that
    matches the `Unknown` condition.
    
    If / when the condition changes, this controller updates the taints to match.

{{% /capture %}}
{{% capture whatsnext %}}
* Read about [nodes](/docs/concepts/architecture/nodes/)
* Read about the [Node API object](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#node-v1-core).
{{% /capture %}}
