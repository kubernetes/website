---
title: Security Considerations
---

{% capture overview %}
This page explains the security considerations of a deployed cluster and production recommendations.
{% endcapture %}
{% capture prerequisites %}
This page assumes you have a working Juju deployed cluster.
{% endcapture %}

By default all connections between every provided node is secured via TLS by easyrsa, including the etcd cluster. 

## Implementation

The TLS and easyrsa implementations use the following [layers](https://jujucharms.com/docs/2.0/developer-layers). 

[layer-tls-client](https://github.com/juju-solutions/layer-tls-client)
[layer-easyrsa](https://github.com/juju-solutions/layer-easyrsa)

{% capture steps %}
## Limiting ssh access

By default the administrator can ssh to any deployed node in a cluster. You can mass disable ssh access to the cluster nodes by issuing the following command.

    juju model-config proxy-ssh=true

Note: The Juju controller node will still have open ssh access in your cloud, and will be used as a jump host in this case.

Refer to the [model management](https://jujucharms.com/docs/2.0/models) page in the Juju documentation for instructions on how to manage ssh keys.
{% endcapture %}

{% include templates/task.md %}
