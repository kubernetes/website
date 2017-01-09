---
assignees:
- crassirostris
- piosz
title: Logging with Stackdriver Logging
---

Before reading this page, it's highly recommended to familiarize yourself with the [overview of logging in Kubernetes](/docs/user-guide/logging/overview).

This article assumes that you have created a Kubernetes cluster with cluster-level logging support for sending logs to Stackdriver Logging. You can do this either by selecting the  **Enable Stackdriver Logging** checkbox in the create cluster dialogue in [GKE](https://cloud.google.com/container-engine/), or by setting the `KUBE_LOGGING_DESTINATION` flag to `gcp` when manually starting a cluster using `kube-up.sh`.

The following guide describes gathering a container's standard output and standard error. To gather logs written by an application to a file, you can use [a sidecar approach](https://github.com/kubernetes/contrib/blob/master/logging/fluentd-sidecar-gcp/README.md).

## Overview

After creation, you can discover logging agent pods in the `kube-system` namespace,
one per node, by running the following command:

```shell
$ kubectl get pods --namespace=kube-system
NAME                                           READY     STATUS    RESTARTS   AGE
...
fluentd-gcp-v1.30-50gnc                        1/1       Running   0          5d
fluentd-gcp-v1.30-v255c                        1/1       Running   0          5d
fluentd-gcp-v1.30-f02l5                        1/1       Running   0          5d
...
```

To understand how logging with Stackdriver works, consider the following
synthetic log generator pod specification [counter-pod.yaml](/docs/user-guide/logging/counter-pod.yaml):

{% include code.html language="yaml" file="counter-pod.yaml" ghlink="/docs/user-guide/counter-pod.yaml" %}

This pod specification has one container that runs a bash script
that writes out the value of a counter and the date once per
second, and runs indefinitely. Let's create this pod in the default namespace.

```shell
$ kubectl create -f counter-pod.yaml
pod "counter" created
```

You can observe the running pod:

```shell
$ kubectl get pods
NAME                                           READY     STATUS    RESTARTS   AGE
counter                                        1/1       Running   0          5m
```

For a short period of time you can observe the 'Pending' pod status, because the kubelet
has to download the container image first. When the pod status changes to `Running`
you can use the `kubectl logs` command to view the output of this counter pod.

```shell
$ kubectl logs counter
0: Mon Jan  1 00:00:00 UTC 2001
1: Mon Jan  1 00:00:01 UTC 2001
2: Mon Jan  1 00:00:02 UTC 2001
...
```

As described in the logging overview, this command fetches log entries
from the container log file. If the container is killed and then restarted by
Kubernetes, you can still access logs from the previous container. However,
if the pod is evicted from the node, log files are lost. Let's demonstrate this
by deleting the currently running counter container:

```shell
$ kubectl delete pod counter
pods/counter
```

and then recreating it:

```shell
$ kubectl create -f counter-pod.yaml
pods/counter
```

After some time, you can access logs from the counter pod again:

```shell
$ kubectl logs counter
0: Mon Jan  1 00:01:00 UTC 2001
1: Mon Jan  1 00:01:01 UTC 2001
2: Mon Jan  1 00:01:02 UTC 2001
...
```

As expected, only recent log lines are present. However, for a real-world
application you will likely want to be able to access logs from all containers,
especially for the debug purposes. This is exactly when the previously enabled
Stackdriver Logging can help.

## Viewing logs

Stackdriver Logging agent attaches metadata to each log entry, for you to use later
in queries to select only the messages you're interested in: for example,
the messages from a particular pod.

The most important pieces of metadata are the resource type and log name.
The resource type of a container log is `container`, which is named
`GKE Containers` in the UI (even if the Kubernetes cluster is not on GKE).
The log name is the name of the container, so that if you have a pod with
two containers, named `container_1` and `container_2` in the spec, their logs
will have log names `container_1` and `container_2` respectively.

System components have resource type `compute`, which is named
`GCE VM Instance` in the interface. Log names for system components are fixed.
For a GKE node, every log entry from a system component has one the following
log names:

* docker
* kubelet
* kube-proxy

You can learn more about viewing logs on [the dedicated Stackdriver page](https://cloud.google.com/logging/docs/view/logs_viewer).

One of the possible ways to view logs is using the
[`gcloud logging`](https://cloud.google.com/logging/docs/api/gcloud-logging)
command line interface from the [Google Cloud SDK](https://cloud.google.com/sdk/).
It uses Stackdriver Logging [filtering syntax](https://cloud.google.com/logging/docs/view/advanced_filters)
to query specific logs. For example, you can run the following command:

```shell
$ gcloud beta logging read 'logName="projects/$YOUR_PROJECT_ID/logs/count"' --format json | jq '.[].textPayload'
...
"2: Mon Jan  1 00:01:02 UTC 2001\n"
"1: Mon Jan  1 00:01:01 UTC 2001\n"
"0: Mon Jan  1 00:01:00 UTC 2001\n"
...
"2: Mon Jan  1 00:00:02 UTC 2001\n"
"1: Mon Jan  1 00:00:01 UTC 2001\n"
"0: Mon Jan  1 00:00:00 UTC 2001\n"
```

As you can see, it outputs messages for the count container from both
the first and second runs, despite the fact that the kubelet already deleted
the logs for the first container.

### Exporting logs

You can export logs to [Google Cloud Storage](https://cloud.google.com/storage/)
or to [BigQuery](https://cloud.google.com/bigquery/) to run further
analysis. Stackdriver Logging offers the concept of sinks, where you can
specify the destination of log entries. More information is available on
the Stackdriver [Exporting Logs page](https://cloud.google.com/logging/docs/export/configure_export_v2).
