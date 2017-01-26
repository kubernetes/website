---
title: Logging
---

{% capture overview %}
This page will explain how logging works within a Juju deployed cluster.
{% endcapture %}

{% capture prerequisites %}
This page assumes you have a working Juju deployed cluster.
{% endcapture %}


## Agent Logging

The `juju debug-log` will show all of the consolidated logs of all the Juju agents running on each node of the cluster. This can be useful for finding out why a specific node hasn't deployed or is in an error state. These agent logs are located in `/var/lib/juju/agents` on every node. 

See the [Juju documentation](https://jujucharms.com/docs/stable/troubleshooting-logs) for more information.


