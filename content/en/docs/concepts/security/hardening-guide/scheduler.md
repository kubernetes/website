---
title: "Hardening Guide - Scheduler Configuration"
description: >
    Information about how to make the Kubernetes scheduler more secure.
content_type: concept
draft: false
weight: 90
---

<!-- overview -->
<!-- overview -->
[kube-scheduler](/docs/reference/command-line-tools-reference/kube-scheduler) is one of the critical components of the control plane. Generally, it the of the top consideration for the security of the Control Plane. 

In this document we explain the effects of a misconfigured scheduler and how we can make the scheduler more secure.

A misconfigured Scheduler can have security implications. Such a scheduler can unfairly target the nodes and evict the services sharing the node. This can aid an attacker with a Yo-Yo DDoS attack which is a autoscaling based DDoS attack.

<!-- body -->
## kube-scheduler configurations

### Scheduler Authentication & Authorization configuration options
{{<table caption="Authentication and Authorization Configurations">}}
| Configuration | Description | Security Hardening Advice |
| --- | :--- | --- |
|`authentication-kubeconfig`|  kubeconfig file pointing at the 'core' kubernetes server with enough rights to create tokenreviews.authentication.k8s.io. This is optional. If empty, all token requests are considered to be anonymous and no client CA is looked up in the cluster. | It should be made sure that a proper kubeconfig is provided so that the server can be called securely. This kubeconfig file should also be maintained securely.|
|`authentication-tolerate-lookup-failure`| If true, failures to look up missing authentication configuration from the cluster are not considered fatal. Note that this can result in authentication that treats all requests as anonymous. |Set to `false` to make sure invalid authentication configurations do not lead to requests passing off as anonymous |
|`authentication-skip-lookup`| If false, the authentication-kubeconfig will be used to lookup missing authentication configuration from the cluster. |This should be set to `false` to make sure all missing authentication configuration falls back to the authentication kubeconfig.|
|`authorization-always-allow-paths`| A list of HTTP paths to skip during authorization, i.e. these are authorized without contacting the 'core' kubernetes server.|These paths have to be well regulated and should not respond with any information that would would require any kind of authentication. The paths should be designed to be respond with data that is allowed to be shown to anonymous requests. Defaults to `"/healthz,/readyz,/livez"`|
{{</table>}}

### Address configuration options
{{<table caption="Address Configurations">}}
| Configuration | Description | Security Hardening Advice |
| --- | --- | --- |
|`bind-address`| The IP address on which to listen for the --secure-port port. The associated interface(s) must be reachable by the rest of the cluster, and by CLI/web clients. If blank or an unspecified address (0.0.0.0 or ::), all interfaces and IP address families will be used. | There are rarely any scenarios where kube-scheduler needs to externally accessible which is why setting the bind address to `localhost` is a secure practice.|
|`permit-address-sharing`|If true, SO_REUSEADDR will be used when binding the port. This allows binding to wildcard IPs like 0.0.0.0 and specific IPs in parallel, and it avoids waiting for the kernel to release sockets in TIME_WAIT state.|This option defaults to `false` and should be set to `true` very carefully because `SO_REUSEADDR` can reuse connections that are terminated and are in `TIME_WAIT` state.|
|`permit-port-sharing`|If true, SO_REUSEPORT will be used when binding the port, which allows more than one instance to bind on the same address and port.|This option defaults to `false` and should be only enabled after careful delibration and when `permit-address-sharing` is enabled.|
{{</table>}}

### TLS configuration options
{{<table caption="Address Configurations">}}
| Configuration | Description | Security Hardening Advice |
| --- | --- | --- |
|`requestheader-client-ca-file`|Root certificate bundle to use to verify client certificates on incoming requests before trusting usernames in headers specified by --requestheader-username-headers. WARNING: generally do not depend on authorization being already done for incoming requests.|The root certificate bundle should always be provided so that request authorization can be done for each incoming request by `requestheader-allowed-names`.|
|`tls-cipher-suites strings`|Comma-separated list of cipher suites for the server. If omitted, the default Go cipher suites will be used.|A list of preferred cipher suites should be provided here so that the encryption is not based on insecure cipher suites.|
{{</table>}}

## Scheduling configurations
When a cluster administrator is setting up the kube-scheduler and using [the different scheduling plugins](/docs/reference/scheduling/config/#scheduling-plugins), special care should be taken to make sure when defining plugins with profiles `queueSort`, `filter` and `reserve`. The `queueSort`, `filter` and `reserve` profiles are critical in defining a scheduler configuration and a misconfigruation with these plugins can cause scheduler to unfairly select nodes to schedule the pods.
