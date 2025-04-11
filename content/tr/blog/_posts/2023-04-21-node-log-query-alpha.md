---
layout: blog
title: "Kubernetes 1.27: Query Node Logs Using The Kubelet API"
date: 2023-04-21
slug: node-log-query-alpha
author: >
   Aravindh Puthiyaparambil (Red Hat)
---

Kubernetes 1.27 introduced a new feature called _Node log query_ that allows
viewing logs of services running on the node.

## What problem does it solve?
Cluster administrators face issues when debugging malfunctioning services
running on the node. They usually have to SSH or RDP into the node to view the
logs of the service to debug the issue. The _Node log query_ feature helps with
this scenario by allowing the cluster administrator to view the logs using
_kubectl_. This is especially useful with Windows nodes where you run into the
issue of the node going to the ready state but containers not coming up due to
CNI misconfigurations and other issues that are not easily identifiable by
looking at the Pod status.

## How does it work?

The kubelet already has a _/var/log/_ viewer that is accessible via the node
proxy endpoint. The feature supplements this endpoint with a shim that shells
out to `journalctl`, on Linux nodes, and the `Get-WinEvent` cmdlet on Windows
nodes. It then uses the existing filters provided by the commands to allow
filtering the logs. The kubelet also uses heuristics to retrieve the logs.
If the user is not aware if a given system services logs to a file or to the
native system logger, the heuristics first checks the native operating system
logger and if that is not available it attempts to retrieve the first logs
from `/var/log/<servicename>` or `/var/log/<servicename>.log` or
`/var/log/<servicename>/<servicename>.log`.

On Linux we assume that service logs are available via journald, and that
`journalctl` is installed. On Windows we assume that service logs are available
in the application log provider. Also note that fetching node logs is only
available if you are authorized to do so (in RBAC, that's **get** and
**create** access to `nodes/proxy`). The privileges that you need to fetch node
logs also allow elevation-of-privilege attacks, so be careful about how you
manage them.

## How do I use it?

To use the feature, ensure that the `NodeLogQuery`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) is
enabled for that node, and that the kubelet configuration options
`enableSystemLogHandler` and `enableSystemLogQuery` are both set to true. You can
then query the logs from all your nodes or just a subset. Here is an example to
retrieve the kubelet service logs from a node:
```shell
# Fetch kubelet logs from a node named node-1.example
kubectl get --raw "/api/v1/nodes/node-1.example/proxy/logs/?query=kubelet"
```

You can further filter the query to narrow down the results:
```shell
# Fetch kubelet logs from a node named node-1.example that have the word "error"
kubectl get --raw "/api/v1/nodes/node-1.example/proxy/logs/?query=kubelet&pattern=error"
```

You can also fetch files from `/var/log/` on a Linux node:
```shell
kubectl get --raw "/api/v1/nodes/<insert-node-name-here>/proxy/logs/?query=/<insert-log-file-name-here>"
```

You can read the
[documentation](/docs/concepts/cluster-administration/system-logs/#log-query)
for all the available options.

## How do I help?

Please use the feature and provide feedback by opening GitHub issues or
reaching out to us on the
[#sig-windows](https://kubernetes.slack.com/archives/C0SJ4AFB7) channel on the
Kubernetes Slack or the SIG Windows
[mailing list](https://groups.google.com/g/kubernetes-sig-windows).
