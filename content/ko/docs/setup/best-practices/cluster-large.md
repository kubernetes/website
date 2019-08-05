---
title: 대형 클러스터 구축
weight: 20
---

## 지원

{{< param "version" >}} 버전에서, 쿠버네티스는 노드 5000개까지의 클러스터를 지원한다. 보다 정확하게는, 다음 기준을 *모두* 만족하는 설정을 지원한다.

* 노드 5000개 이하
* 전체 파드 150000개 이하
* 전체 컨테이너 300000개 이하
* 노드 당 파드 100개 이하

<br>

{{< toc >}}

## 설치

A cluster is a set of nodes (physical or virtual machines) running Kubernetes agents, managed by a "master" (the cluster-level control plane).

Normally the number of nodes in a cluster is controlled by the value `NUM_NODES` in the platform-specific `config-default.sh` file (for example, see [GCE's `config-default.sh`](http://releases.k8s.io/{{< param "githubbranch" >}}/cluster/gce/config-default.sh)).

Simply changing that value to something very large, however, may cause the setup script to fail for many cloud providers. A GCE deployment, for example, will run in to quota issues and fail to bring the cluster up.

When setting up a large Kubernetes cluster, the following issues must be considered.

### 쿼터 문제

To avoid running into cloud provider quota issues, when creating a cluster with many nodes, consider:

* Increase the quota for things like CPU, IPs, etc.
  * In [GCE, for example,](https://cloud.google.com/compute/docs/resource-quotas) you'll want to increase the quota for:
    * CPUs
    * VM instances
    * Total persistent disk reserved
    * In-use IP addresses
    * Firewall Rules
    * Forwarding rules
    * Routes
    * Target pools
* Gating the setup script so that it brings up new node VMs in smaller batches with waits in between, because some cloud providers rate limit the creation of VMs.

### Etcd 저장소

To improve performance of large clusters, we store events in a separate dedicated etcd instance.

When creating a cluster, existing salt scripts:

* start and configure additional etcd instance
* configure api-server to use it for storing events

### 마스터 크기와 마스터 구성 요소

On GCE/Google Kubernetes Engine, and AWS, `kube-up` automatically configures the proper VM size for your master depending on the number of nodes
in your cluster. On other providers, you will need to configure it manually. For reference, the sizes we use on GCE are

* 1-5 nodes: n1-standard-1
* 6-10 nodes: n1-standard-2
* 11-100 nodes: n1-standard-4
* 101-250 nodes: n1-standard-8
* 251-500 nodes: n1-standard-16
* more than 500 nodes: n1-standard-32

And the sizes we use on AWS are

* 1-5 nodes: m3.medium
* 6-10 nodes: m3.large
* 11-100 nodes: m3.xlarge
* 101-250 nodes: m3.2xlarge
* 251-500 nodes: c4.4xlarge
* more than 500 nodes: c4.8xlarge

{{< note >}}
On Google Kubernetes Engine, the size of the master node adjusts automatically based on the size of your cluster. For more information, see [this blog post](https://cloudplatform.googleblog.com/2017/11/Cutting-Cluster-Management-Fees-on-Google-Kubernetes-Engine.html).

On AWS, master node sizes are currently set at cluster startup time and do not change, even if you later scale your cluster up or down by manually removing or adding nodes or using a cluster autoscaler.
{{< /note >}}

### 애드온 자원

To prevent memory leaks or other resource issues in [cluster addons](https://releases.k8s.io/{{< param "githubbranch" >}}/cluster/addons) from consuming all the resources available on a node, Kubernetes sets resource limits on addon containers to limit the CPU and Memory resources they can consume (See PR [#10653](http://pr.k8s.io/10653/files) and [#10778](http://pr.k8s.io/10778/files)).

For example:

```yaml
  containers:
  - name: fluentd-cloud-logging
    image: k8s.gcr.io/fluentd-gcp:1.16
    resources:
      limits:
        cpu: 100m
        memory: 200Mi
```

Except for Heapster, these limits are static and are based on data we collected from addons running on 4-node clusters (see [#10335](http://issue.k8s.io/10335#issuecomment-117861225)). The addons consume a lot more resources when running on large deployment clusters (see [#5880](http://issue.k8s.io/5880#issuecomment-113984085)). So, if a large cluster is deployed without adjusting these values, the addons may continuously get killed because they keep hitting the limits.

To avoid running into cluster addon resource issues, when creating a cluster with many nodes, consider the following:

* Scale memory and CPU limits for each of the following addons, if used, as you scale up the size of cluster (there is one replica of each handling the entire cluster so memory and CPU usage tends to grow proportionally with size/load on cluster):
  * [InfluxDB and Grafana](http://releases.k8s.io/{{< param "githubbranch" >}}/cluster/addons/cluster-monitoring/influxdb/influxdb-grafana-controller.yaml)
  * [kubedns, dnsmasq, and sidecar](http://releases.k8s.io/{{< param "githubbranch" >}}/cluster/addons/dns/kube-dns/kube-dns.yaml.in)
  * [Kibana](http://releases.k8s.io/{{< param "githubbranch" >}}/cluster/addons/fluentd-elasticsearch/kibana-deployment.yaml)
* Scale number of replicas for the following addons, if used, along with the size of cluster (there are multiple replicas of each so increasing replicas should help handle increased load, but, since load per replica also increases slightly, also consider increasing CPU/memory limits):
  * [elasticsearch](http://releases.k8s.io/{{< param "githubbranch" >}}/cluster/addons/fluentd-elasticsearch/es-statefulset.yaml)
* Increase memory and CPU limits slightly for each of the following addons, if used, along with the size of cluster (there is one replica per node but CPU/memory usage increases slightly along with cluster load/size as well):
  * [FluentD with ElasticSearch Plugin](http://releases.k8s.io/{{< param "githubbranch" >}}/cluster/addons/fluentd-elasticsearch/fluentd-es-ds.yaml)
  * [FluentD with GCP Plugin](http://releases.k8s.io/{{< param "githubbranch" >}}/cluster/addons/fluentd-gcp/fluentd-gcp-ds.yaml)

Heapster's resource limits are set dynamically based on the initial size of your cluster (see [#16185](http://issue.k8s.io/16185)
and [#22940](http://issue.k8s.io/22940)). If you find that Heapster is running
out of resources, you should adjust the formulas that compute heapster memory request (see those PRs for details).

For directions on how to detect if addon containers are hitting resource limits, see the [Troubleshooting section of Compute Resources](/docs/concepts/configuration/manage-compute-resources-container/#troubleshooting).

In the [future](http://issue.k8s.io/13048), we anticipate to set all cluster addon resource limits based on cluster size, and to dynamically adjust them if you grow or shrink your cluster.
We welcome PRs that implement those features.

### 시작 시 사소한 노드 오류 허용

For various reasons (see [#18969](https://github.com/kubernetes/kubernetes/issues/18969) for more details) running
`kube-up.sh` with a very large `NUM_NODES` may fail due to a very small number of nodes not coming up properly.
Currently you have two choices: restart the cluster (`kube-down.sh` and then `kube-up.sh` again), or before
running `kube-up.sh` set the environment variable `ALLOWED_NOTREADY_NODES` to whatever value you feel comfortable
with. This will allow `kube-up.sh` to succeed with fewer than `NUM_NODES` coming up. Depending on the
reason for the failure, those additional nodes may join later or the cluster may remain at a size of
`NUM_NODES - ALLOWED_NOTREADY_NODES`.
