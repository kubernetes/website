---
assignees:
- mikedanese
title: Retrieving Logs
---

This page is designed to help you use logs to troubleshoot issues with your Kubernetes solution.

## Logging by Kubernetes Components

Kubernetes components, such as kubelet and apiserver, use the [glog](https://godoc.org/github.com/golang/glog) logging library.  Developer conventions for logging severity are described in [docs/devel/logging.md](https://github.com/kubernetes/kubernetes/tree/{{page.githubbranch}}/docs/devel/logging.md).

## Examining the logs of running containers

The logs of a running container may be fetched using the command `kubectl logs`. For example, given
this pod specification [counter-pod.yaml](https://github.com/kubernetes/kubernetes/tree/{{page.githubbranch}}/examples/blog-logging/counter-pod.yaml), which has a container which writes out some text to standard
output every second. (You can find different pod specifications [here](https://github.com/kubernetes/kubernetes.github.io/tree/{{page.docsbranch}}/docs/user-guide/logging-demo/).)

{% include code.html language="yaml" file="counter-pod.yaml" k8slink="/examples/blog-logging/counter-pod.yaml" %}

we can run the pod:

```shell
$ kubectl create -f ./counter-pod.yaml
pods/counter
```

and then fetch the logs:

```shell
$ kubectl logs counter
0: Tue Jun  2 21:37:31 UTC 2015
1: Tue Jun  2 21:37:32 UTC 2015
2: Tue Jun  2 21:37:33 UTC 2015
3: Tue Jun  2 21:37:34 UTC 2015
4: Tue Jun  2 21:37:35 UTC 2015
5: Tue Jun  2 21:37:36 UTC 2015
...
```

If a pod has more than one container then you need to specify which container's log files should
be fetched e.g.

```shell
$ kubectl logs kube-dns-v3-7r1l9 etcd
2015/06/23 00:43:10 etcdserver: start to snapshot (applied: 30003, lastsnap: 20002)
2015/06/23 00:43:10 etcdserver: compacted log at index 30003
2015/06/23 00:43:10 etcdserver: saved snapshot at index 30003
2015/06/23 02:05:42 etcdserver: start to snapshot (applied: 40004, lastsnap: 30003)
2015/06/23 02:05:42 etcdserver: compacted log at index 40004
2015/06/23 02:05:42 etcdserver: saved snapshot at index 40004
2015/06/23 03:28:31 etcdserver: start to snapshot (applied: 50005, lastsnap: 40004)
2015/06/23 03:28:31 etcdserver: compacted log at index 50005
2015/06/23 03:28:31 etcdserver: saved snapshot at index 50005
2015/06/23 03:28:56 filePurge: successfully removed file default.etcd/member/wal/0000000000000000-0000000000000000.wal
2015/06/23 04:51:03 etcdserver: start to snapshot (applied: 60006, lastsnap: 50005)
2015/06/23 04:51:03 etcdserver: compacted log at index 60006
2015/06/23 04:51:03 etcdserver: saved snapshot at index 60006
...
```

## Cluster level logging to Google Cloud Logging

The getting started guide [Cluster Level Logging to Google Cloud Logging](/docs/getting-started-guides/logging)
explains how container logs are ingested into [Google Cloud Logging](https://cloud.google.com/logging/docs/)
and shows how to query the ingested logs.

## Cluster level logging with Elasticsearch and Kibana

The getting started guide [Cluster Level Logging with Elasticsearch and Kibana](/docs/getting-started-guides/logging-elasticsearch)
describes how to ingest cluster level logs into Elasticsearch and view them using Kibana.

## Ingesting Application Log Files

Cluster level logging only collects the standard output and standard error output of the applications
running in containers. The guide [Collecting log files from within containers with Fluentd and sending them to the Google Cloud Logging service](https://github.com/kubernetes/contrib/blob/master/logging/fluentd-sidecar-gcp/README.md) explains how the log files of applications can also be ingested into Google Cloud logging.

## Known issues

Kubernetes does log rotation for Kubernetes components and docker containers. The command `kubectl logs` currently only read the latest logs, not all historical ones.