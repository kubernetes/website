---
assignees:
- megastef
title: Logging and Monitoring with Sematext 
---

# Logging and Monitoring with Sematext 

Logging on Kubernetes requires either Elasticsearch running in the cluster or Google Cloud Logging. 

An easier alternative is the integration of hosted Log Management and Performance Monitoring solutions like [Logsene](https:sematext.com/logsene) and [SPM](https://sematext.com/docker) by Sematext.

## Agent for Kubernetes Metrics and Logs

There are a number of [open source docker monitoring and logging projects](https://sematext.com/blog/2016/07/19/open-source-docker-monitoring-logging/) one can cobble together to build a monitoring and log collection system (or systems).  The pro is that the code is all free.  The downside is that this takes time - both initially when setting it up and later when maintaining.  Luckily, there is [Sematext Docker Agent](https://sematext.com/kubernetes/) - a modern, Kubernetes-aware monitoring and log collection agent.  It runs as a tiny container on every Kubernetes node and collects logs, metrics and events for all cluster nodes and all containers. It discovers all containers (one pod might contain multiple containers) including containers for Kubernetes core services, if core services are deployed in Docker containers. After its deployment, all logs and metrics are immediately available out of the box. Why is this valuable?  Because it means you don’t have to spend the next N hours or days figuring out which data to collect and how to chart it, plus you don’t need the resources to maintain your own logging and monitoring infrastructure. Let’s see how to deploy this agent.

## Deploy Sematext Docker Agent to all Kubernetes Nodes 

Kubernetes provides DaemonSets, which ensure pods are added to nodes as nodes are added to the cluster. We can use this to easily deploy Sematext Agent to each cluster node!

1. Get a free account at [sematext.com/spm](https://apps.sematext.com/users-web/register.do)  
2. [Create an SPM App](https://apps.sematext.com/spm-reports/registerApplication.do) of type "Docker" and copy the SPM Application Token 
   - For logs (optional) [create a Logsene App](https://apps.sematext.com/logsene-reports/registerApplication.do) to obtain an App Token for [Logsene](http://www.sematext.com/logsene/)
3. Create [sematext-agent.yml](https://github.com/sematext/sematext-agent-docker/blob/master/kubernetes/sematext-agent.yml) - and edit values of LOGSENE_TOKEN and SPM_TOKEN in the Daemon Set definition as shown below.

{% include code.html language="yaml" file="sematext-agent.yml" ghlink="/docs/user-guide/logging-monitoring-sematext/sematext-agent.yml" %}


4. Run the Daemon Set

```shell
kubectl apply -f sematext-agent.yml 
daemonset "sematext-agent" created
```
Now let’s check if the agent got deployed to all nodes:

```shell
kubectl get pods -l sematext-agent
NAME                   READY     STATUS    RESTARTS   AGE
sematext-agent-nh4ez   1/1       Running   0          8s
sematext-agent-s47vz   1/1       Running   0          8s
```

## Understand Kubernetes Logs

Kubernetes containers’ logs are not much different from Docker container logs. However, Kubernetes users need to view logs for the deployed pods. That’s why it is very useful to have Kubernetes-specific information available for log search, such as:

- Kubernetes name space
- Kubernetes pod name
- Kubernetes container name
- Kubernetes UID
- Docker image name 
- Docker container name

Sematext Docker Agent extracts this information from the Docker container names and tags all logs with the information mentioned above. Having these data extracted in individual fields makes it is very  easy to watch logs of deployed pods, build reports from logs, quickly narrow down to problematic pods while troubleshooting, and so on!  If Kubernetes core components (such as kubelet, proxy, api server) are deployed via Docker the Sematext Docker Agent will collect Kubernetes core components logs as well. 

There are many other useful features Logsene and Sematext Docker Agent give you out of the box, such as:

- Automatic format detection and parsing of logs
- Includes patterns to recognize and parse many log formats
- Custom pattern definitions for specific images and application types
- [Automatic Geo-IP enrichment for container logs](https://sematext.com/blog/2016/04/11/automatic-geo-ip-enrichment-for-docker-logs-2/)
- Filtering logs e.g. to exclude noisy services 
- Masking of sensitive data in specific log fields (phone numbers, payment information, authentication tokens, ...)
- Alerts and scheduled reports based on logs
- Analytics for structured logs e.g. in Kibana or Grafana

![](https://sematext.com/wp-content/uploads/2016/10/image02.png)
_Logsene UI: All logs are automatically tagged with node name, namespace, pod name, UID, image name and container ID._

Sematext Docker Agent supports many log formats out of the box, this means logs of any running websever like apache2 or nginx are parsed. The Logsene API is compatible with Elasticsearch and therefore Logs can be analyzed with the integrated Kibana or any local [Grafana](https://sematext.com/blog/2015/12/14/using-grafana-with-elasticsearch-for-log-analytics-2/) server. 

![](https://sematext.com/wp-content/uploads/2016/10/Logsene-Kibana-Web.png)
_Webserver logs displayed in Logsene Kibana integration_
 

## Interpretation of Kubernetes Metrics 

The metrics from all Kubernetes nodes are collected in a single SPM App, which aggregates metrics on several levels: 
- Cluster - metrics aggregated over all nodes displayed in SPM overview
- Host / node level - metrics aggregated per node 
- Docker Image level - metrics aggregated by image name, e.g. all nginx webserver containers
- Docker Container level - metrics aggregated for a single container

![Aggregated Cluster Metrics in SPM overview](https://sematext.com/wp-content/uploads/2016/07/docker-monitoring-overview.png)

*Aggregated Cluster Metrics in SPM overview*

Each detailed chart has filter options for Node, Pod, and Docker Container. A search by pod name in the Pod filter makes it easy to select all containers for a specific pod. 
There are more [docker metrics to monitor](https://sematext.com/blog/2016/06/28/top-docker-metrics-to-watch/), like CPU and memory usage, memory fail counters, throttled CPU times, Network Throughput and Network errors for containers.

