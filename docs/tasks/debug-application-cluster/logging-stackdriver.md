---
assignees:
- crassirostris
- piosz
title: Logging Using Stackdriver
---

Before reading this page, it's highly recommended to familiarize yourself
with the [overview of logging in Kubernetes](/docs/concepts/cluster-administration/logging).

**Note:** By default, only container's standard output and standard error will be
collected by logging solution. To collect logs written by an application to
a file, you can take a look at the [sidecar approach](/docs/concepts/cluster-administration/logging/#using-a-sidecar-container-with-the-logging-agent).

## Deploying

In order to ingest logs, as explained in the logging overview, logging agent
should be deployed to each node. Stackdriver logging agent is configured
fluentd instance. Configuration for fluentd is stored in ConfigMap and
instances are managed using DaemonSet, which makes Kubernetes schedule
an agent on each node. The way how ConfigMap and DaemonSet are deployed
in a cluster depends on your setup.

### GKE

Stackdriver is a default logging solution for clusters on GKE. Unless you
deliberately opt out of using Stackdriver Logging, it will be deployed
and working out of the box without any further actions.

### Deploying with a new cluster

**Note:** this section is only valid if you're using `kube-up.sh` for starting
your cluster. Otherwise, please refer to the next section.

Before starting your cluster, set `KUBE_LOGGING_DESTINATION` environment
variable to `gcp` and, unless on GCE, include
`alpha.kubernetes.io/fluentd-ds-ready=true` to`KUBE_NODE_LABELS` variable.
Once started, cluster should have Stackdriver logging agent running on each
node. If deployed that way, DaemonSet for the agents and ConfigMap with
the agents configuration will be addons.

### Deploying to an existing cluster

1. Apply label on each node, if not present already.

    Stackdriver logging agent deployment is using node labels to understand to
    which nodes it should be allocated. If describing your nodes produces the
    following output

    ```shell
    $ kubectl describe node $NODE_NAME
    ...
    Labels:         alpha.kubernetes.io/fluentd-ds-ready=true
    ...
    ```

    then you don't need to do anything else in this step. If you can't find
    `alpha.kubernetes.io/fluentd-ds-ready=true` among labels, execute the following
    command for each node:

    ```shell
    $ kubectl label node $NODE_NAME alpha.kubernetes.io/fluentd-ds-ready=true
    ```

    Note that if node is recreated, label has to be applied again. Kubelet
    has a command-line parameter for applying node labels, you can change node
    startup script to set this parameter appropriately.

1. Deploy ConfigMap with the logging agent configuration

    You need to run the following command

    ```shell
    $ kubectl create -f https://raw.githubusercontent.com/kubernetes/kubernetes/release-1.6/cluster/addons/fluentd-gcp/fluentd-gcp-configmap.yaml
    configmap "fluentd-gcp-config" created
    ```

    It will create ConfigMap in `kube-system` namespace. You can download the file
    manually and change it before creating the ConfigMap object.

1. Deploy logging agent DaemonSet

    Again, you need to run the following command

    ```shell
    $ kubectl create -f https://raw.githubusercontent.com/kubernetes/kubernetes/release-1.6/cluster/addons/fluentd-gcp/fluentd-gcp-ds.yaml
    daemonset "fluentd-gcp-v2.0" created
    ```

    You can download and edit this file before using it as well.

## Logging Agents Overview

After Stackdriver DaemonSet is deployed, you can discover logging agent pods
in the `kube-system` namespace, one per node, by running the following command:

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
synthetic log generator pod specification [counter-pod.yaml](/docs/tasks/debug-application-cluster/counter-pod.yaml):

{% include code.html language="yaml" file="counter-pod.yaml" ghlink="/docs/tasks/debug-application-cluster/counter-pod.yaml" %}

This pod specification has one container that runs a bash script
that writes out the value of a counter and the date once per
second, and runs indefinitely. Let's create this pod in the default namespace.

```shell
$ kubectl create -f http://k8s.io/docs/user-guide/logging/examples/counter-pod.yaml
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
pod "counter" deleted
```

and then recreating it:

```shell
$ kubectl create -f http://k8s.io/docs/user-guide/logging/examples/counter-pod.yaml
pod "counter" created
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
