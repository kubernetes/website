---
reviewers:
content_template: templates/concept
title: Logging and Monitoring using the Elastic Stack (ELK) and Beats
---

{{% capture overview %}}

# Overview
There are several ways to view logs and metrics from Kubernetes clusters, these range from
`kubectl logs` and `kubectl top` to aggregating your logs and metrics in services such as
[Stackdriver logging](https://cloud.google.com/logging/) and [Prometheus](https://prometheus.io/)
or [Elasticsearch](https://www.elastic.co/solutions/logging) (aka ELK).

This article describes how to set up an Elasticsearch cluster to ingest logs and metrics into
[Elasticsearch](https://www.elastic.co/products/elasticsearch) and view
them using [Kibana](https://www.elastic.co/products/kibana), as a combined
solution that can be used with any Kubernetes provider from Minikube to your favorite cloud provider.

### This diagram describes what will be deployed by following this article.  

![Elasticsearch Status](/images/docs/k8s-nodes-elastic.png)

{{< note >}}
Notes regarding this diagram:

1. You may have one Kubernetes node, or you may have more than one.  The number of nodes shown in the diagram is just an example.
1. The application pods can be the example pods described later in this article, or your own application.
1. Beats, specifically in this diagram Filebeat and Metricbeat, are deployed as DaemonSets, and therefore there will be one Filebeat and one Metricbeat pod per node.
1. The Elasticsearch cluster and Kibana can be running on your laptop, deployed in a Kubernetes cluster, deployed on servers or virtual machines, or be a managed Elasticsearch Service in Elastic Cloud.{{< /note >}}

{{% /capture %}}

{{% capture body %}}

# Deploy Elasticsearch and Kibana

Choose one method from the three options presented:

1. Deploy Elasticsearch and Kibana using [Elastic Helm Charts](https://github.com/elastic/helm-charts)
1. Deploy [Elasticsearch Service in Elastic Cloud](https://cloud.elastic.co/)
1. Deploy [self managed Elasticsearch](https://www.elastic.co/guide/en/elastic-stack-get-started/current/get-started-elastic-stack.html) and Kibana outside of your Kubernetes cluster

## Option 1: Deploy Elasticsearch and Kibana using Elastic Helm Charts
{{< note >}}
At the time of writing the [Elastic Helm Charts](https://github.com/elastic/helm-charts) are in alpha status,
and at this stage they are not recommended for production use. For this reason the solution described in this
article will also discuss using either the managed Elasticsearch Service in Elastic Cloud, or self managed
Elasticsearch and Kibana outside of your Kubernetes cluster.
{{< /note >}}

{{< note >}}
This is one of the methods to deploy Elasticsearch and Kibana.  You can use any of the three options.
{{< /note >}}

There are detailed instructions and a sample values.yaml file for the [Elasticsearch Helm Chart](https://github.com/elastic/helm-charts/tree/master/elasticsearch) and [Kibana Helm Chart](https://github.com/elastic/helm-charts/tree/master/kibana) in GitHub, here is the general workflow.

{{< note >}}
If you are using Minikube allocate extra CPU and memory, for example: `minikube start --cpus 6 --memory 10240`
{{< /note >}}

### Add the Elastic Helm repo

```shell
helm repo add elastic https://helm.elastic.co
```
### List the Chart versions

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

### Install the Elasticsearch Helm Chart

{{< note >}}
Substitute the Chart version you want to use in the below command
{{< /note >}}

{{< note >}}
If you are deploying into Minikube use the [`values.yaml`](https://github.com/elastic/helm-charts/blob/master/elasticsearch/examples/minikube/values.yaml) file for Minikube (this relaxes the antiAffinity setting and reduces the CPU and memory resources).
{{< /note >}}

```shell
helm install --name elasticsearch elastic/elasticsearch --version <Chart version> [-f values.yaml]
```

### Install the Kibana Helm Chart
{{< note >}}
In general, you should use the same version of Kibana and Elasticsearch unless you have a specific reason to have mismatched versions.
{{< /note >}}

```shell
helm install --name kibana elastic/kibana --version <Chart version>
```

## Option 2: Deploy Elasticsearch Service in Elastic Cloud
{{< note >}}
This is one of the methods to deploy Elasticsearch and Kibana.  You can use any of the three options.
{{< /note >}}

The [Elasticsearch Service](https://www.elastic.co/cloud/elasticsearch-service/signup) in Elastic Cloud is a managed service.  You can sign up for a free trial and create a deployment.  When you create the deployment you will be presented with a password for the `elastic` account and a Cloud ID.  These will be used to configure Filebeat and Metricbeat to send data to your Elasticsearch Service deployment.

Save the password and Cloud ID from this panel so that you can add them in a Kubernetes secret:
![Elasticsearch Service credentials](/images/docs/elasticsearch-service-credentials.png)

## Option 3: Deploy self managed Elasticsearch and Kibana outside of your Kubernetes cluster
{{< note >}}
This is one of the methods to deploy Elasticsearch and Kibana.  You can use any of the three options.
{{< /note >}}

You can follow the instructions in the [Getting Started with the Elastic Stack](https://www.elastic.co/guide/en/elastic-stack-get-started/current/get-started-elastic-stack.html)
 guide.  Just deploy Elasticsearch and Kibana and then come back to this article, the step by step details for deploying Beats in a Kubernetes cluster are in this document.


# Deploy Beats to collect logs and metrics
foo
```shell
KUBE_LOGGING_DESTINATION=elasticsearch
```

# Deploy a sample application in your Kubernetes cluster
foo
```shell
KUBE_LOGGING_DESTINATION=elasticsearch
```

# View logs and metrics in Kibana
foo
```shell
KUBE_LOGGING_DESTINATION=elasticsearch
```

# Apply these techniques to your applications
foo
```shell
KUBE_LOGGING_DESTINATION=elasticsearch
```

{{% /capture %}}
{{% capture whatsnext %}}

Kibana opens up all sorts of powerful options for exploring your logs! For some
ideas on how to dig into it, check out [Kibana's documentation](https://www.elastic.co/guide/en/kibana/current/discover.html).

{{% /capture %}}
