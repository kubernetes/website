---
title: Kubernetes API Overview
assignees:
- bgrant0607
- erictune
- lavalamp
- jbeda
---

The REST API is the fundamental fabric of Kubernetes. All operations and
communications between components are REST API calls handled by the API Server,
including external user commands. Consequently, everything in the Kubernetes
platform is treated as an API object and has a corresponding entry in the
[API](/docs/api-reference/{{page.version}}/).

![image](/images/docs/architecture.png)

Most operations can be performed through the
[kubectl](/docs/user-guide/kubectl-overview/) command-line interface or other
command-line tools, such as [kubeadm](/docs/admin/kubeadm/), which in turn use
the API. However, the API can also be accessed directly using REST calls.
