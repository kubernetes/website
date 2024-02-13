---
title: "Hardening Guide - Scheduler Configuration"
description: >
    Information about how to make the Kubernetes scheduler more secure.
content_type: concept
draft: false
weight: 90
---

<!-- overview -->
[kube-scheduler](/docs/reference/command-line-tools-reference/kube-scheduler) is one of the critical components of the control plane. Generally, it the of the top consideration for the security of the Control Plane. 

In this document we explain the effects of a misconfigured scheduler and how we can make the scheduler more secure.

A misconfigured Scheduler can have security implications. Such a scheduler can target specific nodes and evict the services sharing the node. This can aid an attacker with a [Yo-Yo attack](https://arxiv.org/abs/2105.00542) which is an attack on a vulnerable autoscaler.

<!-- body -->
## kube-scheduler configurations

### Scheduler Authentication & Authorization configuration options
{{<table caption="Authentication and Authorization Configurations">}}
| Configuration | Description | Security Hardening Advice |
| --- | :--- | --- |
|`authentication-kubeconfig`|kubeconfig file pointing at the 'core' kubernetes server with enough rights to create tokenreviews.authentication.k8s.io. This is optional. If empty, all token requests are considered to be anonymous and no client CA is looked up in the cluster. |Make sure that a proper to provide a proper kubeconfig so that the server calls are secure. This kubeconfig file should also maintained securely.|
|`authentication-tolerate-lookup-failure`| If true, failures to look up missing authentication configuration from the cluster are not considered fatal. Note that this can result in authentication that treats all requests as anonymous. |Set to `false` to make sure invalid authentication configurations do not lead to requests passing off as anonymous |
|`authentication-skip-lookup`| If false, the authentication-kubeconfig will be used to lookup missing authentication configuration from the cluster. |This should be set to `false` to make sure all missing authentication configuration falls back to the authentication kubeconfig.|
|`authorization-always-allow-paths`| A list of HTTP paths to skip during authorization, i.e. these are authorized without contacting the 'core' kubernetes server. |These paths should respond with data that is appropriate for anonymous authorization. Defaults to `"/healthz,/readyz,/livez"`.|
{{</table>}}

### Address configuration options
{{<table caption="Address Configurations">}}
| Configuration | Description | Security Hardening Advice |
| --- | --- | --- |
|`bind-address`| The IP address on which to listen for the --secure-port port. The associated interface(s) must be reachable by the rest of the cluster, and by CLI/web clients. If blank or an unspecified address (0.0.0.0 or ::), all interfaces and IP address families will be used. |In most cases, kube-scheduler does not need to be externally accessible. Setting the bind address to `localhost` is a secure practice.|
|`permit-address-sharing`|If true, SO_REUSEADDR will be used when binding the port. This allows binding to wildcard IPs like 0.0.0.0 and specific IPs in parallel, and it avoids waiting for the kernel to release sockets in TIME_WAIT state.|Default `false`. Setting it to  `true` will enable connection sharing through `SO_REUSEADDR`. Caution: `SO_REUSEADDR` can reuse terminated connections and are in `TIME_WAIT` state.|
|`permit-port-sharing`|If true, SO_REUSEPORT will be used when binding the port, which allows more than one instance to bind on the same address and port.|Default `false`. Should be only enabled after careful deliberation and with `permit-address-sharing`.|
{{</table>}}

### TLS configuration options
{{<table caption="Address Configurations">}}
| Configuration | Description | Security Hardening Advice |
| --- | --- | --- |
|`requestheader-client-ca-file`|Root certificate bundle to use to verify client certificates on incoming requests before trusting usernames in headers specified by --requestheader-username-headers. WARNING: generally do not depend on authorization being already done for incoming requests.|Always provide the root certificate bundle. This allows authorization to happen on each incoming request through `requestheader-allowed-names`.|
|`tls-cipher-suites strings`|Comma-separated list of cipher suites for the server. If omitted, the default Go cipher suites will be used.|Always provide a list of preferred cipher suites. This ensures encryption never happens with insecure cipher suites.|
{{</table>}}

## Scheduling configurations
The cluster administrator needs be careful with the plugins that use the [queueSort, filter, and permit extension points](/docs/reference/scheduling/config/#extension-points). Scheduling happens in a series of stages that are exposed through the extension points. Plugins that define their own extension points can be enabled. This can affect the defined scheduling process of the kube-scheduler of the cluster.

Exactly one plugin that uses the `queueSort` extension point can be enabled at a time. Any other plugins that use `queueSort` should be scrutinized.

Plugins that implement the `filter` extension point can potentially mark all nodes as unschedulable. This can bring scheduling of new pods to a halt.

Plugins that implement the `permit` extension point  can prevent or delay the binding of a Pod. Such plugins should be thoroughly reviewed by the cluster administrator.
