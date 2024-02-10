---
title: "Hardening Guide - Scheduler Configuration"
description: >
    Information about how to make the Kubernetes scheduler more secure.
content_type: concept
weight: 90
---

<!-- overview -->
The Kubernetes {{< glossary_tooltip text="scheduler" term_id="kube-scheduler" >}} is
one of the critical components of the
{{< glossary_tooltip text="control plane" term_id="control-plane" >}}.

This document covers how to improve the security posture of the Scheduler.

A misconfigured scheduler can have security implications. Such a scheduler can target specific nodes and evict the workloads or applications that are sharing the node and its resources. This can aid an attacker with a [Yo-Yo attack](https://arxiv.org/abs/2105.00542): an attack on a vulnerable autoscaler.
<!-- body -->
## kube-scheduler configuration

### Scheduler authentication & authorization command line options
{{<table caption="Security advice for kube-scheduler command line options relating to authentication or authorization" >}}
| Command line argument                    | Security hardening advice                                                                                                              |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `authentication-kubeconfig`              | Make sure to provide a proper kubeconfig so that the server calls are secure. This kubeconfig file should also be maintained securely. |
| `authentication-tolerate-lookup-failure` | Set to `false` to make sure invalid authentication configurations do not lead to requests passing off as anonymous                     |
| `authentication-skip-lookup`             | This should be set to `false` to make sure all missing authentication configuration falls back to the authentication kubeconfig.       |
| `authorization-always-allow-paths`       | These paths should respond with data that is appropriate for anonymous authorization. Defaults to `/healthz,/readyz,/livez`.           |
{{</table>}}

### Scheduler networking command line options
{{<table caption="Security advice for kube-scheduler command line options relating to networking" >}}
| Command line argument    | Security hardening advice                                                                                                                                            |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `bind-address`           | In most cases, the kube-scheduler does not need to be externally accessible. Setting the bind address to `localhost` is a secure practice.                           |
| `permit-address-sharing` | Set this to `false` to  disable connection sharing through `SO_REUSEADDR`. `SO_REUSEADDR` can lead to reuse of terminated connections that are in `TIME_WAIT` state. |
| `permit-port-sharing`    | Default `false`. Use the default unless you are confident you understand the security implications.                                                                  |
{{</table>}}

### Scheduler TLS command line options
{{<table caption="Security advice for kube-scheduler command line options relating to encryption in transit" >}}
| Command line argument          | Security hardening advice                                                                                                                                                                                                          |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `requestheader-client-ca-file` | Generally do not depend on authorization being already done for incoming requests. Always provide the root certificate bundle. This allows authorization to happen on each incoming request through `requestheader-allowed-names`. |
| `tls-cipher-suites`            | Always provide a list of preferred cipher suites. This ensures encryption never happens with insecure cipher suites.                                                                                                               |
{{</table>}}

## Scheduling configurations for custom schedulers
This section covers security hardening when using custom schedulers based on the Kubernetes
scheduling code.
The cluster administrator needs be careful with the plugins that use the `queueSort`, `prefilter`, `filter`, or permit [extension points](https://github.com/docs/reference/scheduling/config/#extension-points).
Scheduling happens in a series of stages that are exposed through the extension points.
As a cluster administrator, you can enable plugins that define their own extension points.
Doing so can affect the defined scheduling behaviors of the kube-scheduler in your cluster.

When using a custom scheduler, plugin extension points such as `queueSort`, `prefilter`, `filter` and `permit` should be used with care.

Exactly one plugin that uses the `queueSort` extension point can be enabled at a time. Any plugins that use `queueSort` should be scrutinized.

Plugins that implement the `prefilter` or `filter` extension point can potentially mark all nodes as unschedulable. This can bring scheduling of new pods to a halt.

Plugins that implement the `permit` extension point  can prevent or delay the binding of a Pod. Such plugins should be thoroughly reviewed by the cluster administrator.

When using a plugin that is not one of the [default plugins](/docs/reference/scheduling/config/#scheduling-plugins), consider disabling the `queueSort`, `filter` and `permit` extension points as follows:

```yaml
apiVersion: kubescheduler.config.k8s.io/v1
kind: KubeSchedulerConfiguration
profiles:
  - schedulerName: default-scheduler
  - schedulerName: my-custom-scheduler
    plugins:
      queueSort:
        disabled:
        # Globally only one queueSort can be specified.
        - name: my-custom-scheduler
      # - name: default-scheduler
      permit:
        disabled:
        - name: '*'
```
This creates two scheduler profiles: `default-scheduler` and ` my-custom-scheduler`.
Whenever the `.spec` of a Pod does not have a value for `.spec.schedulerName`,
the kube-scheduler runs for that Pod, using its main configuration, and default plugins.
If you define a Pod with `.spec.schedulerName` set to `my-custom-scheduler`, the
kube-scheduler also runs but with a custom configuration; in that custom configuration,
the  `queueSort`, `filter` and `permit` extension points are disabled.
If you use this kube-scheduler configuration, and don't run any custom scheduler, and
you then define a Pod with  `.spec.schedulerName` set to `nonexistent-scheduler` (or
any other scheduler name that doesn't exist in your cluster), no events would be generated for a pod.

## Disallow labeling nodes
A cluster administrator should ensure that cluster users cannot label the nodes. A malicious actor can use `nodeSelector` to schedule workloads on nodes where those workloads should not be present.
