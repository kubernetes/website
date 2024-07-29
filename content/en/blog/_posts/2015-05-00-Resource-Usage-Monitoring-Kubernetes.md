---
title:  Resource Usage Monitoring in Kubernetes
date: 2015-05-12
slug: resource-usage-monitoring-kubernetes
url: /blog/2015/05/Resource-Usage-Monitoring-Kubernetes
author: >
   Vishnu Kannan (Google),
   Victor Marmol (Google)
---

Understanding how an application behaves when deployed is crucial to scaling the application and providing a reliable service. In a Kubernetes cluster, application performance can be examined at many different levels: containers, [pods](/docs/user-guide/pods), [services](/docs/user-guide/services), and whole clusters. As part of Kubernetes we want to provide users with detailed resource usage information about their running applications at all these levels. This will give users deep insights into how their applications are performing and where possible application bottlenecks may be found. In comes [Heapster](https://github.com/kubernetes/heapster), a project meant to provide a base monitoring platform on Kubernetes.  


**Overview**  


Heapster is a cluster-wide aggregator of monitoring and event data. It currently supports Kubernetes natively and works on all Kubernetes setups. Heapster runs as a pod in the cluster, similar to how any Kubernetes application would run. The Heapster pod discovers all nodes in the cluster and queries usage information from the nodes’ [Kubelets](https://github.com/kubernetes/kubernetes/blob/master/DESIGN.md#kubelet), the on-machine Kubernetes agent. The Kubelet itself fetches the data from [cAdvisor](https://github.com/google/cadvisor). Heapster groups the information by pod along with the relevant labels. This data is then pushed to a configurable backend for storage and visualization. Currently supported backends include [InfluxDB](http://influxdb.com/) (with [Grafana](http://grafana.org/) for visualization), [Google Cloud Monitoring](https://cloud.google.com/monitoring/) and many others described in more details here. The overall architecture of the service can be seen below:  


[![](https://2.bp.blogspot.com/-6Bu15356Zqk/V4mGINP8eOI/AAAAAAAAAmk/-RwvkJUt4rY2cmjqYFBmRo25FQQPRb27ACEw/s640/monitoring-architecture.png)](https://2.bp.blogspot.com/-6Bu15356Zqk/V4mGINP8eOI/AAAAAAAAAmk/-RwvkJUt4rY2cmjqYFBmRo25FQQPRb27ACEw/s1600/monitoring-architecture.png)

Let’s look at some of the other components in more detail.



**cAdvisor**



cAdvisor is an open source container resource usage and performance analysis agent. It is purpose built for containers and supports Docker containers natively. In Kubernetes, cadvisor is integrated into the Kubelet binary. cAdvisor auto-discovers all containers in the machine and collects CPU, memory, filesystem, and network usage statistics. cAdvisor also provides the overall machine usage by analyzing the ‘root’? container on the machine.



On most Kubernetes clusters, cAdvisor exposes a simple UI for on-machine containers on port 4194. Here is a snapshot of part of cAdvisor’s UI that shows the overall machine usage:  


[![](https://3.bp.blogspot.com/-V5KAfomW7Cg/V4mGH6OTKSI/AAAAAAAAAmo/EZHcG0afrs0606eTDMCryT6j6SoNzu3PgCEw/s400/cadvisor.png)](https://3.bp.blogspot.com/-V5KAfomW7Cg/V4mGH6OTKSI/AAAAAAAAAmo/EZHcG0afrs0606eTDMCryT6j6SoNzu3PgCEw/s1600/cadvisor.png)

**Kubelet**  

The Kubelet acts as a bridge between the Kubernetes master and the nodes. It manages the pods and containers running on a machine. Kubelet translates each pod into its constituent containers and fetches individual container usage statistics from cAdvisor. It then exposes the aggregated pod resource usage statistics via a REST API.



**STORAGE BACKENDS**



**InfluxDB and Grafana**



A Grafana setup with InfluxDB is a very popular combination for monitoring in the open source world. InfluxDB exposes an easy to use API to write and fetch time series data. Heapster is setup to use this storage backend by default on most Kubernetes clusters. A detailed setup guide can be found [here](https://github.com/kubernetes/heapster/blob/master/docs/influxdb.md). InfluxDB and Grafana run in Pods. The pod exposes itself as a Kubernetes service which is how Heapster discovers it.



The Grafana container serves Grafana’s UI which provides an easy to configure dashboard interface. The default dashboard for Kubernetes contains an example dashboard that monitors resource usage of the cluster and the pods inside of it. This dashboard can easily be customized and expanded. Take a look at the storage schema for InfluxDB [here](https://github.com/kubernetes/heapster/blob/master/docs/storage-schema.md#metrics).



Here is a video showing how to monitor a Kubernetes cluster using heapster, InfluxDB and Grafana:


 [![](https://img.youtube.com/vi/SZgqjMrxo3g/0.jpg)](https://www.youtube.com/watch?SZgqjMrxo3g)




Here is a snapshot of the default Kubernetes Grafana dashboard that shows the CPU and Memory usage of the entire cluster, individual pods and containers:



[![](https://1.bp.blogspot.com/-lHMeU_4UnAk/V4mGHyrWkBI/AAAAAAAAAms/SvnncgJ7ieAduBqQzpI86oaboIkAKEpEQCEw/s640/influx.png)](https://1.bp.blogspot.com/-lHMeU_4UnAk/V4mGHyrWkBI/AAAAAAAAAms/SvnncgJ7ieAduBqQzpI86oaboIkAKEpEQCEw/s1600/influx.png)





**Google Cloud Monitoring**



Google Cloud Monitoring is a hosted monitoring service that allows you to visualize and alert on important metrics in your application. Heapster can be setup to automatically push all collected metrics to Google Cloud Monitoring. These metrics are then available in the [Cloud Monitoring Console](https://app.google.stackdriver.com/). This storage backend is the easiest to setup and maintain. The monitoring console allows you to easily create and customize dashboards using the exported data.



Here is a video showing how to setup and run a Google Cloud Monitoring backed Heapster:
"https://youtube.com/embed/xSMNR2fcoLs"
Here is a snapshot of the a Google Cloud Monitoring dashboard showing cluster-wide resource usage.



[![](https://2.bp.blogspot.com/-F2j3kYn3IoA/V4mGH3M-0gI/AAAAAAAAAmg/aoml93zPeKsKbTX1tN5sTtRRTw7dAKsxwCEw/s640/gcm.png)](https://2.bp.blogspot.com/-F2j3kYn3IoA/V4mGH3M-0gI/AAAAAAAAAmg/aoml93zPeKsKbTX1tN5sTtRRTw7dAKsxwCEw/s1600/gcm.png)



**Try it out!**



Now that you’ve learned a bit about Heapster, feel free to try it out on your own clusters! The [Heapster repository](https://github.com/kubernetes/heapster) is available on GitHub. It contains detailed instructions to setup Heapster and its storage backends. Heapster runs by default on most Kubernetes clusters, so you may already have it! Feedback is always welcome. Please let us know if you run into any issues via the troubleshooting channels.
