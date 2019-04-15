---
reviewers:
content_template: templates/concept
title: Logging and Monitoring using the Elastic Stack (ELK) and Beats
---

{{% capture overview %}}

## Overview
There are several ways to view logs and metrics from Kubernetes clusters, these range from
`kubectl logs` and `kubectl top` to aggregating your logs and metrics in services such as
[Stackdriver logging](https://cloud.google.com/logging/) and [Prometheus](https://prometheus.io/)
or [Elasticsearch](https://www.elastic.co/solutions/logging) (aka ELK).

This article describes how to set up an Elasticsearch cluster to ingest logs and metrics into
[Elasticsearch](https://www.elastic.co/products/elasticsearch) and view
them using [Kibana](https://www.elastic.co/products/kibana), as a combined
solution that can be used with any Kubernetes provider from Minikube to your favorite cloud provider.

This diagram describes what will be deployed by following this article.  Notes regarding this diagram:

1. You may have one Kubernetes node, or you may have more than one.  The number of nodes shown in the diagram is just an example.
1. The application pods can be the example pods described later in this article, or your own application.
1. Beats, specifically in this diagram Filebeat and Metricbeat, are deployed as DaemonSets, and therefore there will be one Filebeat and one Metricbeat pod per node.
1. The Elasticsearch cluster and Kibana can be running on your laptop, deployed in a Kubernetes cluster, deployed on servers or virtual machines, or be a managed Elasticsearch Service in Elastic Cloud.

![Elasticsearch Status](/images/docs/k8s-nodes-elastic.png)

{{% /capture %}}

{{% capture body %}}

## Deploy Elasticsearch and Kibana
### Deploy Elasticsearch and Kibana using Elastic Helm Charts
{{< note >}}
At the time of writing the [Elastic Helm Charts](https://github.com/elastic/helm-charts) are in alpha status,
and at this stage they are not recommended for production use. For this reason the solution described in this
article will also discuss using either the managed Elasticsearch Service in Elastic Cloud, or self managed
Elasticsearch and Kibana outside of your Kubernetes cluster.
{{< /note >}}

There are detailed instructions and a sample values.yaml file for the [Elasticsearch Helm Chart](https://github.com/elastic/helm-charts/tree/master/elasticsearch) and [Kibana Helm Chart](https://github.com/elastic/helm-charts/tree/master/kibana) in GitHub, here is the general workflow.

{{< note >}}
If you are using Minikube, you may want to consider the amount of CPU and memory avaialble to your Minikube cluster.  We would recommend using the Minikube example [values.yaml](https://github.com/elastic/helm-charts/blob/master/elasticsearch/examples/minikube/values.yaml) and resources similar to:
`minikube start --cpus 6 --memory 10240`
{{< /note >}}

#### Add the Elastic Helm repo

```shell
helm repo add elastic https://helm.elastic.co
```
#### List the Chart versions

```shell
helm search elastic/elasticsearch -l
```
The output will look similar to this:
```
NAME                 	CHART VERSION	APP VERSION	DESCRIPTION  
elastic/elasticsearch	6.6.2-alpha1 	6.6.2      	Elasticsearch
elastic/elasticsearch	6.6.0-alpha1 	6.6.0      	Elasticsearch
elastic/elasticsearch	6.5.4-alpha3 	6.5.4      	Elasticsearch
elastic/elasticsearch	6.5.4-alpha2 	6.5.4      	Elasticsearch
elastic/elasticsearch	6.5.4-alpha1 	6.5.4      	Elasticsearch
elastic/elasticsearch	6.5.3-alpha1 	6.5.3      	Elasticsearch
elastic/elasticsearch	6.5.2-alpha1 	6.5.2      	Elasticsearch
elastic/elasticsearch	6.5.0        	6.5.0      	Elasticsearch
elastic/elasticsearch	6.4.3        	6.4.3      	Elasticsearch
elastic/elasticsearch	6.4.2        	6.4.2      	Elasticsearch
```

Choose a version, and use it when you install both the Elasticsearch Helm Chart and Kibana Helm Chart.

#### Install the Elasticsearch Helm Chart

{{< note >}}
Substitute the Chart version you want to use in the below command
{{< /note >}}

{{< note >}}
If you are deploying into Minikube use the [values.yaml](https://github.com/elastic/helm-charts/blob/master/elasticsearch/examples/minikube/values.yaml) file for Minikube (this relaxes the `antiAffinity` setting and reduces the CPU and memory resources).
{{< /note >}}

```shell
helm install --name elasticsearch elastic/elasticsearch --version <Chart version> [-f values.yaml]
```

### Deploy Elasticsearch Service in Elastic Cloud
foo
```shell
KUBE_LOGGING_DESTINATION=elasticsearch
```
### Deploy self managed Elasticsearch and Kibana outside of your Kubernetes cluster
foo
```shell
KUBE_LOGGING_DESTINATION=elasticsearch
```

## Deploy Beats to collect logs and metrics
foo
```shell
KUBE_LOGGING_DESTINATION=elasticsearch
```

## Deploy a sample application in your Kubernetes cluster
foo
```shell
KUBE_LOGGING_DESTINATION=elasticsearch
```

## View logs and metrics in Kibana
foo
```shell
KUBE_LOGGING_DESTINATION=elasticsearch
```

## Apply these techniques to your applications
foo
```shell
KUBE_LOGGING_DESTINATION=elasticsearch
```

{{% /capture %}}
{{% capture whatsnext %}}

Kibana opens up all sorts of powerful options for exploring your logs! For some
ideas on how to dig into it, check out [Kibana's documentation](https://www.elastic.co/guide/en/kibana/current/discover.html).

{{% /capture %}}
