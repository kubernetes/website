---
assignees:
- crassirostris
- piosz
- aleksandra-malinowska

---

Application and systems logs is the great way to understand, what is happenning inside the cluster, debug problems and monitor the activity. Most modern application have some kind of logging mechanism. Container engines are designed to support logging out of the box in some way. Easiest and the most embraced logging mechanism in the container world is to write to the standard output and standard error streams.

Obviosly, just that is not enough to provide a complete logging solution. For example, if container crashes, pod gets evicted or node dies, ususally it's still desired to be able to access application logs. Therefore logs should have a separate storage and a separate lifecycle from nodes, pods and containers. This concept is called __cluster level logging__ and required a separate backend to store, analyze and query logs. Kubernetes is not a logging storage solution, but it can be integrated with any of the existing ones.

In the following sections firstly the node level logging will be described and then possible architectures of cluster level logging. If you're not interested in having cluster level logging, you might still be interested in the description how logs are stored and handled on the node. For the latter section the assumption is that there exists a logging backend, inside or outside of kubernetes cluster.

## Logging one the node level

![Node level logging](/images/docs/getting-started-guides/logging/logging-node-level.png)

Everything written to `stdout` and `stderr` by a containerized application goes to a container runtime. Currently, from the Docker runtime it goes to a file using standard [json logging driver](https://docs.docker.com/engine/admin/logging/overview). __Note! It implies that each _line_ will be treatet as a separate message, no direct support for multiline messages, e.g. stacktraces.__ In case container restarts, kubelet keeps by default one terminated container with its logs. In case pod is evicted from the node, all corresponding containers are evicted too with their logs.

Important question is how to achieve log rotations so that logs won't consume all available space on the node. Right now, logrotate tools solves this task. Detailed configuration can be found [there](https://github.com/kubernetes/kubernetes/blob/release-1.5/cluster/gce/gci/configure-helper.sh#L96). In short, up to `5` rotation are kept, rotation is performed daily or if log file grows beyond `10MB`. Rotations belong to a single container, that is if container dies several times or pod gets evited, all rotations for the container are lost.

When user performs [`kubectl logs`](/docs/user-guide/kubectl/kubectl_logs), request ends up on the kubelet, which reads directly from the log file and returns its content in the response.

## Cluster level logging architectures

### Using node logging agent

![Using node level logging agent](/images/docs/getting-started-guides/logging/logging-with-node-agent.png)

Logging agent is a tool to expose or push logs to a backend. From high level perspective it's a container, which has access to a directory with log files from all containers. This container should be on every node, therefore it should be either manifest pod, shipped with a node, or a daemon set replica.

This is the most common and encouraged approach, because only one logging agent per node is created and it doens't require any changes in the target application. __Note! Currently, it only works for application's standard output and standard error!__

Kubernetes doesn't specify logging agent, but it ships with two default options. Both use fluentd with custom configuration as an agent, both are shipped as manifest pods.

	* Stackdriver Logging in Google Cloud, more information [there](/docs/getting-started-guides/logging-gcp)

	* Elasticsearch inside the cluster, more information [there](/docs/getting-started-guides/logging-elasticsearch)

### Using side-container with the logging agent

![Using side-container with the logging agent](/images/docs/getting-started-guides/logging/logging-with-sidecar.png)

Alternatively, dedicated logging agent with it's own configuration for each application may be used. One way of doing so is to have a sidecar container in pod specs, containing only the logging agent.

The concrete implementation of the agent, interface between agent and the application and the interface between agent and the backend are completely up to a user. One example is fluentd side-car container for Stackdriver logging backend, which is described in details [there](https://github.com/kubernetes/contrib/tree/b70447aa59ea14468f4cd349760e45b6a0a9b15d/logging/fluentd-sidecar-gcp). __Note! This may lead to significant resource consumption!__

### Exposing logs directly from the application

![Exposing logs directly from the application](/images/docs/getting-started-guides/logging/logging-from-application.png)

Of course, pushing logs to a backend (or exposing an endpoint for a pull approach) can always be performed by the application itself, but then it's completely outside of the scope of kubernetes and the scope of this article.
