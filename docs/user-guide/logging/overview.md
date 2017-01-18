---
assignees:
- crassirostris
- piosz
title: Logging Overview
---

Application and systems logs can help you understand what is happening inside your cluster. The logs are particularly useful for debugging problems and monitoring cluster activity. Most modern applications have some kind of logging mechanism; as such, most container engines are likewise designed to support some kind of logging. The easiest and most embraced logging method for containerized applications is to write to the standard output and standard error streams.

However, the native functionality provided by a container engine or runtime is usually not enough for a complete logging solution. For example, if a container crashes, a pod is evicted, or a node dies, you'll usually still want to access your application's logs. As such, logs should have a separate storage and lifecycle independent of nodes, pods, or containers. This concept is called _cluster-level-logging_. Cluster-level logging requires a separate backend to store, analyze, and query logs. Kubernetes provides no native storage solution for log data, but you can integrate many existing logging solutions into your Kubernetes cluster.

This document includes:

* A basic demonstration of logging in Kubernetes using the standard output stream
* A detailed description of the node logging architecture in Kubernetes
* Guidance for implementing cluster-level logging in Kubernetes

The guidance for cluster-level logging assumes that a logging backend is present inside or outside of your cluster. If you're not interested in having cluster-level logging, you might still find the description of how logs are stored and handled on the node to be useful.

## Basic logging in Kubernetes

In this section, you can see an example of basic logging in Kubernetes that outputs data to the standard output stream. This demonstration uses a [pod specification](/docs/user-guide/logging/counter-pod.yaml) with a container that writes some text to standard output once per second.

{% include code.html language="yaml" file="counter-pod.yaml" ghlink="/docs/user-guide/counter-pod.yaml" %}

To run this pod, use the following command:

```shell
$ kubectl create -f http://k8s.io/docs/user-guide/counter-pod.yaml
pod "counter" created
```

To fetch the logs, use the `kubectl logs` command, as follows

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

You can use `kubectl logs` to retrieve logs from a previous instantiation of a container with `--previous` flag, in case the container has crashed. If your pod has multiple containers, you should specify which container's logs you want to access by appending a container name to the command. See the [`kubectl logs` documentation](/docs/user-guide/kubectl/kubectl_logs/) for more details.

## Logging at the node level

![Node level logging](/images/docs/user-guide/logging/logging-node-level.png)

Everything a containerized application writes to `stdout` and `stderr` is handled and redirected somewhere by a container engine. For example, the Docker container engine redirects those two streams to [a logging driver](https://docs.docker.com/engine/admin/logging/overview), which is configured in Kubernetes to write to a file in json format.

**Note:** The Docker json logging driver treats each line as a separate message. When using the Docker logging driver, there is no direct support for multi-line messages. You need to handle multi-line messages at the logging agent level or higher.

By default, if a container restarts, the kubelet keeps one terminated container with its logs. If a pod is evicted from the node, all corresponding containers are also evicted, along with their logs.

An important consideration in node-level logging is implementing log rotation, so that logs don't consume all available storage on the node. Kubernetes uses the [`logrotate`](http://www.linuxcommand.org/man_pages/logrotate8.html) tool to implement log rotation.

Kubernetes performs log rotation daily, or if the log file grows beyond 10MB in size. Each rotation belongs to a single container; if the container repeatedly fails or the pod is evicted, all previous rotations for the container are lost. By default, Kubernetes keeps up to five logging rotations per container.

The Kubernetes logging configuration differs depending on the node type. For example, you can find detailed information for GCI in the corresponding [configure helper](https://github.com/kubernetes/kubernetes/blob/{{page.githubbranch}}/cluster/gce/gci/configure-helper.sh#L96).

When you run [`kubectl logs`](/docs/user-guide/kubectl/kubectl_logs), as in the basic logging example, the kubelet on the node handles the request and reads directly from the log file, returning the contents in the response. Note that `kubectl logs` **only returns the last rotation**; you must manually extract prior rotations, if desired and cluster-level logging is not enabled.

### System component logs

There are two types of system components: those that run in a container and those
that do not run in a container. For example:

* The Kubernets scheduler and kube-proxy run in a container.
* The kubelet and container runtime, for example Docker, do not run in containers.

On machines with systemd, the kubelet and container runtime write to journald. If
systemd is not present, they write to `.log` files in the `/var/log` directory.
System components inside containers always write to the `/var/log` directory,
bypassing the default logging mechanism. They use the [glog](https://godoc.org/github.com/golang/glog)
logging library. You can find the conventions for logging severity for those
components in the [development docs on logging](https://github.com/kubernetes/community/blob/master/contributors/devel/logging.md).

Similarly to the container logs, system component logs in the `/var/log`
directory are rotated daily and based on the log size. However,
system component logs have a higher size retention: by default,
they can store up to 100MB.

## Cluster-level logging architectures

While Kubernetes does not provide a native solution for cluster-level logging, there are several common approaches you can consider. Here are some options:

* Use a node-level logging agent that runs on every node.
* Include a dedicated sidecar container for logging in an application pod.
* Push logs directly to a backend from within an application.

### Using a node logging agent

![Using a node level logging agent](/images/docs/user-guide/logging/logging-with-node-agent.png)

You can implement cluster-level logging by including a _node-level logging agent_ on each node. The logging agent is a dedicated tool that exposes logs or pushes logs to a backend. Commonly, the logging agent is a container that has access to a directory with log files from all of the application containers on that node.

Because the logging agent must run on every node, it's common to implement it as either a DaemonSet replica, a manifest pod, or a dedicated native process on the node. However the latter two approaches are deprecated and highly discouraged.

Using a node-level logging agent is the most common and encouraged approach for a Kubernetes cluster, because it creates only one agent per node, and it doesn't require any changes to the applications running on the node. However, node-level logging _only works for applications' standard output and standard error_.

Kubernetes doesn't specify a logging agent, but two optional logging agents are packaged with the Kubernetes release: [Stackdriver Logging](/docs/user-guide/logging/stackdriver) for use with Google Cloud Platform, and [Elasticsearch](/docs/user-guide/logging/elasticsearch). You can find more information and instructions in the dedicated documents. Both use [fluentd](http://www.fluentd.org/) with custom configuration as an agent on the node.

### Using a sidecar container with the logging agent

![Using a sidecar container with the logging agent](/images/docs/user-guide/logging/logging-with-sidecar.png)

You can implement cluster-level logging by including a dedicated logging agent for each application on your cluster. You can include this logging agent as a _sidecar container_ in the pod spec for each application; the sidecar container should contain only the logging agent.

The concrete implementation of the logging agent, the interface between agent and the application, and the interface between the logging agent and the logs backend are completely up to a you. For an example implementation, see the [fluentd sidecar container](https://github.com/kubernetes/contrib/tree/b70447aa59ea14468f4cd349760e45b6a0a9b15d/logging/fluentd-sidecar-gcp) for the Stackdriver logging backend.

**Note:** Using a sidecar container for logging may lead to significant resource consumption.

### Exposing logs directly from the application

![Exposing logs directly from the application](/images/docs/user-guide/logging/logging-from-application.png)

You can implement cluster-level logging by exposing or pushing logs directly from every application itself; however, the implementation for such a logging mechanism is outside the scope of Kubernetes.

