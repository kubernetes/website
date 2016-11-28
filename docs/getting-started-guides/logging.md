# Logging

In most cases, it's useful to have a dedicated logging backend with the ability to store, analyze and search logs independently from the pods and containers lifecycle. It's sometimes called cluster level logging, because it follow the lifecycle of the whole cluster, not just one application or one node.

If you're not interested in the cluster level logging and just want to understand logging on the node level, you can skip directly to the [related section][Using node logging agent].

For now let's assume we have a logging backend, which a remote service, located somewhere inside a kubernetes or outside of it. There are several possible designs of the logging collecting solution, let's describe each one in more details.

## Exposing logs directly from the application

!(Exposing logs directly from the application)[/images/docs/getting-started-guides/logging/logging-from-application.png]

First of all, you can always push your logs directly from your application (or expose an endpoint for a pull approach), then it's completely outside of the scope of kubernetes and the scope of this article.

## Using side-container with the logging agent

!(Using side-container with the logging agent)[/images/docs/getting-started-guides/logging/logging-with-sidecar.png]

Alternatively, you can use dedicated logging agent, which is essentially an application which sends logs to the logging backend (or exposes an edpoint in the pull model). One way of using the logging agent is to have a sidecar container in pod specs, containing only the configured agent.

The concrete implementation of the agent, interface between agent and the application and the interface between agent and the backend are completely up to user. One example is fluentd side-car container for Stackdriver logging backend, which is described in details (there)[].

## Using node logging agent

Using side-car containers multiplies number of containers running on a node which may lead to a big increase in resource consumption. Alternative solution is to have one logging agent per node for all applications running on this node. Kubernetes offers an interface for collecting logs from `stdout`/`stderr`. __Note! Currently, it only works for application's standard output and standard error!__

!(Using node level logging agent)[/images/docs/getting-started-guides/logging/logging-with-node-agent.png]

Several main components can be extracted and highlighted

1. Application and container engine

	* Everything written to `stdout` and `stderr` by a containerized application goes to a container runtime. Currently, from the Docker runtime it goes to a file using standard (json logging driver)[]. __Note! It implies that each _line_ will be treatet as a separate message, no direct support for multiline messages, e.g. stacktraces.__

	* In case container restarts, kubelet keeps by default one terminated container with its logs.

	* In case pod is evicted from the node, all corresponding containers are evicted too with their logs.

1. Logrotate

	Important question is how to achieve log rotations so that logs won't consume all available space on the node. Right now, logrotate tools solves this task. Detailed configuration can be found (there)[]. In short, we keep up to `5` rotation, rotation is performed daily or if log file grows beyond `10MB`. Rotations belong to a single container, that is if container dies several times or pod gets evited, all rotations are lost.

1. Logging agent

	As it was mentioed earlier, logging agent is a tool to expose or push logs to a backend. From high level perspective it's a container, which has access to a directory with log files from all containers. This container should be on every node, therefore it should be either manifest pod, shipped with a node, or a daemon set replica.

	Kubernetes doesn't specify logging agent, but it ships with two default options. Both use fluentd with custom configuration as an agent, both are shipped as manifest pods.

	* Stackdriver Logging in Google Cloud, more information (there)[]

	* Elasticsearch inside the cluster, more information (there)[]