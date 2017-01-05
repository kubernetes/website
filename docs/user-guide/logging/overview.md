---
assignees:
- crassirostris
- piosz
title: Logging Overview
---

Application and systems logs can help you understand what is happening inside your cluster. The logs are particularly useful for debugging problems and monitoring cluster activity. Most modern applications have some kind of logging mechanism; as such, most container engines are likewise designed to support some kind of logging. The easiest and most embraced logging method for containerized applications is to write to the standard output and standard error streams.

However, the native functionality provided by a container engine or runtime is usually not enough for a complete logging solution. For example, if a container crashes, a pod is evicted, or a node dies, you'll usually still want to access your application's logs. As such, logs should have a separate storage and lifecycle independent of nodes, pods, or containers; this concept is called __cluster-level-logging__. Cluster-level logging requires a separate back-end to store, analyze, and query logs. Kubernetes provides no native storage solution for logs data, but you can integrate many existing logging solutions into your Kubernetes cluster.

In this document, you can find:

* A basic demonstration of logging in Kubernetes using the standard output stream
* A detailed description of the node logging architecture in Kubernetes
* Guidance for implementing cluster-level logging in Kubernetes

The guidance for cluster-level logging assumes that a logging back-end is present inside or outside of your cluster. If you're not interested in having cluster-level logging, you might still find the description how logs are stored and handled on the node to be useful.

## Basic logging in Kubernetes

In this section, you can see an example of basic logging in Kubernetes that outputs data to the standard output stream. This demonstration uses a [pod specification](/docs/user-guide/logging/examples/counter-pod.yaml) with a container that writes some text to standard output once per second.

{% include code.html language="yaml" file="examples/counter-pod.yaml" %}

To run this pod, use the following command:

```shell
$ kubectl create -f counter-pod.yaml
pod "counter" created
```

To fetch the logs, use the `kubectl logs` command, as follows

```shell
$ kubectl logs counter
0: Mon Jan  1 00:00:00 UTC 2001
1: Mon Jan  1 00:00:01 UTC 2001
2: Mon Jan  1 00:00:02 UTC 2001
...
```

You can use `kubectl logs` to retrieve logs from a previous instantiation of a container with `--previous` flag, in case the container has crashed. If your pod has multiple containers, you should specify which container's logs you want to access by appending a container name to the command. See the [`kubectl logs` documentation](/docs/user-guide/kubectl/kubectl_logs) for more details.

## Logging at the node level

![Node level logging](/images/docs/user-guide/logging/logging-node-level.png)

Everything a containerized application writes to `stdout` and `stderr` is handled and redirected somewhere by a container engine. For example, Docker container engine redirects those two streams to [a logging driver](https://docs.docker.com/engine/admin/logging/overview), which is configured in Kubernetes to write to a file in json format.

**Note:** The Docker json logging driver treats each line as a separate message. When using the Docker logging driver, there is no direct support for multi-line messages. To do so, you'll need to handle these at the logging agent level or higher.

By default, if a container restarts, kubelet keeps one terminated container with its logs. If a pod is evicted from the node, all corresponding containers are also evicted, along with their logs.

An important consideration in node-level logging is implementing log rotation, so that logs don't consume all available storage on the node. Kubernetes uses the [`logrotate`](http://www.linuxcommand.org/man_pages/logrotate8.html) tool to implement log rotation.

Kubernetes performs log rotation daily, or if the log file grows beyond 10MB in size. Each rotation belongs to a single container; if the container repeatedly fails or the pod is evicted, all previous rotations for the container are lost. By default, Kubernetes keeps up to five logging rotations per container.

The Kubernetes logging configuration differs depending on the node type. For example, you can find detailed information for GCI in the corresponding [configure helper](https://github.com/kubernetes/kubernetes/blob/{{page.githubbranch}}/cluster/gce/gci/configure-helper.sh#L96).

When you run [`kubectl logs`](/docs/user-guide/kubectl/kubectl_logs), as in the basic logging example, the kubelet on the node handles the request and reads directly from the log file, returning the contents in the response. Note that `kubectl logs` **only returns the last rotation**; you must manually extract prior rotations, if desired.

### System components logs

Kubernetes system components use a different logging mechanism than the application containers in pods. Components such as `kube-proxy` (among others) use the [glog](https://godoc.org/github.com/golang/glog) logging library. You can find the conventions for logging severity for those components in the [development docs on logging](https://github.com/kubernetes/kubernetes/tree/{{page.githubbranch}}/docs/devel/logging.md).

System components write directly to log files in the `/var/log` directory in the node's host filesystem. Like container logs, system component logs are rotated daily and based on size. However, system component logs have a higher size retention: by default, they store 100MB.

## Cluster-level logging architectures

While Kubernetes does not provide a native solution for cluster-level logging, there are several common approaches you can consider:

* You can use a node-level logging agent that runs on every node.
* You can include a dedicated sidecar container for logging in an application pod.
* You can push logs directly to a back-end from within an application.

### Using a node logging agent

![Using a node level logging agent](/images/docs/user-guide/logging/logging-with-node-agent.png)

You can implement cluster-level logging by including a _node-level logging agent_ on each node. The logging agent is a dedicated tool that exposes logs or pushes logs to a back-end. Commonly, the logging agent is a container that has access to a directory with log files from all of the application containers on that node.

Because the logging agent must run on every node, it's common to implement it as either a DaemonSet replica, a manifest pod, or a dedicated native process on the node. However the latter two approaches are deprecated and highly discouraged.

Using a node-level logging agent is the most common and encouraged approach for a Kubernetes cluster, since it creates only one agent per node and it doesn't require any changes to the applications running on the node. However, node-level logging _only works for applications' standard output and standard error_.

Kubernetes doesn't specify a logging agent, but two optional logging agents are packaged with the Kubernetes release: [Stackdriver Logging](/docs/user-guide/logging/stackdriver) for use with Google Cloud Platform, and [Elasticsearch](/docs/user-guide/logging/elasticsearch). You can find more information and instructions in the dedicated documents. Both use [fluentd](http://www.fluentd.org/) with custom configuration as an agent on the node.

### Using a sidecar container with the logging agent

You can use a sidecar container in one of the following ways:

* Sidecar container streams application logs to it's own `stdout`.
* Sidecar container contains a logging agent, which is configured to pick up logs from an application container.

#### Streaming sidecar container

![Sidecar container with a streaming container](/images/docs/user-guide/logging/logging-with-streaming-sidecar.png)

Using this approach you can re-use per-node agent and kubelet log handling
mechanisms. A separate container should contain simple piece of software that
reads logs from a file, a socker or the journald and prints it to the
`stdout` or `stderr`. This solution also allows to separate several log streams
from different parts of an application, some of which can lack support
for writing to stdout or stderr. Since the logic behind redirecting logs
is minimal, it's hardly a significant overhead. Additionally, since
stdout and stderr are handled by the kubelet, you have the ability
to use tools like `kubectl logs` out of the box.

Consider the following example: there is an application, writing to two files
in different formats, with the following specification:

{% include code.html language="yaml" file="examples/two-files-counter-pod.yaml" %}

It would be a mess to have log entries of different formats in the same log
stream, even if you managed to redirect both components to the stdout of
a container. Instead, let's use the described earlier approach, introducing
two container, tailing a log file from a shared volume and redirecting it
to a standard output.

{% include code.html language="yaml" file="examples/two-files-counter-pod-streaming-sidecar.yaml" %}

Now, if you run this pod, you can access each log stream separately by
running the following commands:

```shell
$ kubectl logs counter count-log-1
0: Mon Jan  1 00:00:00 UTC 2001
1: Mon Jan  1 00:00:01 UTC 2001
2: Mon Jan  1 00:00:02 UTC 2001
...
```

```shell
$ kubectl logs counter count-log-2
Mon Jan  1 00:00:00 UTC 2001 INFO 0
Mon Jan  1 00:00:01 UTC 2001 INFO 1
Mon Jan  1 00:00:02 UTC 2001 INFO 2
...
```

Node-level agent, installed in your cluster will pick those log streams
automatically without any further configuration. Agent then can be
configured to parse log lines depending on the source container.

Streaming sidecar container at the same time can be
responsible for log rotation and retention policy. Imagine you have an old
application that can only write to a single file. Using rsyslog
with some log rotation mechanism can solve the problem of keeping size of
the log file inside a container under a certain limit.

However, remember that it's always recommended to use stdout and sterr
directly and leave rotation and retention policies to kubelet. If you have
an application which writes to a single file, it's generally better to
set `/dev/stdout` as destination rather than implementing streaming sidecar
container approach.

#### Sidecar container with a logging agent

![Sidecar container with a logging agent](/images/docs/user-guide/logging/logging-with-sidecar-agent.png)

If node-level agent is not flexible enought, there is an option to create
a side-container with a separate logging agent, which you configured
specifically to run with the given application.

**Note**, however, that using a logging agent in a sidecar container may lead
to significant resource consumption. Moreover, you won't be able to access
those logs using `kubectl logs` command, since they are not controlled
by the kubelet.

As an example, let's use [Stackdriver logging agent](/docs/user-guide/logging/stackdriver/)
with the same application as above.

Logging agent inside a container should be configured. One good way to
configure container is using [Config Maps](/docs/user-guide/configmap/).
Let's create a config map with the agent configuration. Explaining the
configuration of fluentd, used as a Stackdriver logging agent is not
the purpose of this article, you can learn more in
[the official fluentd documentation](http://docs.fluentd.org/).

{% include code.html language="yaml" file="examples/fluentd-sidecar-config.yaml" %}

Now you can add a sidecar container to the original pod, mounting this
configuration to a place from where fluentd picks it up.

{% include code.html language="yaml" file="examples/two-files-counter-pod-agent-sidecar.yaml" %}

After some time you can find log messages in the Stackdriver interface.

Remember, that this is just an example and you can actually replace fluentd
with any logging agent, reading from any source inside an application
container.

### Exposing logs directly from the application

![Exposing logs directly from the application](/images/docs/user-guide/logging/logging-from-application.png)

You can implement cluster-level logging by exposing or pushing logs directly from every application itself; however, the implementation for such a logging mechanism is outside the scope of Kubernetes.
