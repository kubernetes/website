---
title: Monitoring
---

{% capture overview %}
This page shows how to connect various logging solutions to a Juju deployed cluster.
{% endcapture %}

{% capture prerequisites %}
This page assumes you have a working Juju deployed cluster.
{% endcapture %}

{% capture steps %}
## Connecting Datadog

Datadog is a SaaS offering which includes support for a range of integrations, including Kubernetes and ETCD. While the solution is SAAS/Commercial, they include a Free tier which is supported with the following method. To deploy a full Kubernetes stack with Datadog out of the box, do:

```
juju deploy canonical-kubernetes-datadog
```

### Installation of Datadog

To start, deploy the latest version Datadog from the Charm Store:

```
juju deploy datadog
```

Configure Datadog with your api-key, found in the [Datadog dashboard](). Replace `XXXX` with your API key.

```
juju configure datadog api-key=XXXX
```

Finally, attach `datadog` to all applications you wish to monitor. For example, kubernetes-master, kubernetes-worker, and etcd:

```
juju add-relation datadog kubernetes-worker
juju add-relation datadog kubernetes-master
juju add-relation datadog etcd
```

## Connecting Elastic stack

The Elastic stack, formally "ELK" stack, refers to Elastic Search and the suite of tools to facilitate log aggregation, monitoring, and dashboarding. To deploy a full Kubernetes stack with elastic out of the box, do:

```
juju deploy canonical-kubernetes-elastic
```

### New install of ElasticSearch

To start, deploy the latest version of ElasticSearch, Kibana, Filebeat, and Topbeat from the Charm Store:

This can be done in one command as:

```
juju deploy beats-core
```

However, if you wish to customize the deployment, or proceed manually, the following commands can be issued:

```
juju deploy elasticsearch
juju deploy kibana
juju deploy filebeat
juju deploy topbeat

juju add-relation elasticsearch kibana
juju add-relation elasticsearch topbeat
juju add-relation elasticsearch filebeat
```

Finally, connect filebeat and topbeat to all applications you wish to monitor. For example, kubernetes-master and kubernetes-worker:

```
juju add-relation kubernetes-master topbeat
juju add-relation kubernetes-master filebeat
juju add-relation kubernetes-worker topbeat
juju add-relation kubernetes-worker filebeat
```

### Existing ElasticSearch cluster

In the event an ElasticSearch cluster already exists, the following can be used to connect and leverage it instead of creating a new, separate, cluster. First deploy the two beats, filebeat and topbeat

```
juju deploy filebeat
juju deploy topbeat
```

Configure both filebeat and topbeat to connect to your ElasticSearch cluster, replacing `255.255.255.255` with the IP address in your setup.

```
juju configure filebeat elasticsearch=255.255.255.255
juju configure topbeat elasticsearch=255.255.255.255
```

Follow the above instructions on connect topbeat and filebeat to the applications you wish to monitor.


## Connecting Nagios

Nagios utilizes the Nagios Remote Plugin Executor protocol (NRPE protocol) as an agent on each node to derive machine level details of the health and applications.

### New install of Nagios

To start, deploy the latest version of the Nagios and NRPE charms from the store:

```
juju deploy nagios
juju deploy nrpe
```

Connect Nagios to NRPE

```
juju add-relation nagios nrpe
```

Finally, add NRPE to all applications deployed that you wish to monitor, for example `kubernetes-master`, `kubernetes-worker`, `etcd`, `easyrsa`, and `kubeapi-load-balancer`.

```
juju add-relation nrpe kubernetes-master
juju add-relation nrpe kubernetes-worker
juju add-relation nrpe etcd
juju add-relation nrpe easyrsa
juju add-relation nrpe kubeapi-load-balancer
```

### Existing install of Nagios

If you already have an existing Nagios installation, the `nrpe-external-master` charm can be used instead. This will allow you to supply configuration options that map your existing external Nagios installation to NRPE. Replace `255.255.255.255` with the IP address of the nagios instance.

```
juju deploy nrpe-external-master
juju configure nrpe-external-master nagios_master=255.255.255.255
```

Once configured, connect nrpe-external-master as outlined above.
{% endcapture %}

{% include templates/task.md %}
