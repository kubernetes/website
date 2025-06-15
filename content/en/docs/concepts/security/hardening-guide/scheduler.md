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

A misconfigured scheduler can have security implications. 
Such a scheduler can target specific nodes and evict the workloads or applications that are sharing the node and its resources. 
This can aid an attacker with a [Yo-Yo attack](https://arxiv.org/abs/2105.00542): an attack on a vulnerable autoscaler.

<!-- body -->
## kube-scheduler configuration

### Scheduler authentication & authorization command line options

When setting up authentication configuration, it should be made sure that kube-scheduler's authentication remains consistent with kube-api-server's authentication. 
If any request has missing authentication headers, 
the [authentication should happen through the kube-api-server allowing all authentication to be consistent in the cluster](/docs/tasks/extend-kubernetes/configure-aggregation-layer/#original-request-username-and-group).

- `authentication-kubeconfig`: Make sure to provide a proper kubeconfig so that the scheduler can retrieve authentication configuration options from the API Server. This kubeconfig file should be protected with strict file permissions.
- `authentication-tolerate-lookup-failure`: Set this to `false` to make sure the scheduler _always_ looks up its authentication configuration from the API server.
- `authentication-skip-lookup`: Set this to `false` to make sure the scheduler _always_ looks up its authentication configuration from the API server.
- `authorization-always-allow-paths`: These paths should respond with data that is appropriate for anonymous authorization. Defaults to `/healthz,/readyz,/livez`.
- `profiling`: Set to `false` to disable the profiling endpoints which are provide debugging information but which should not be enabled on production clusters as they present a risk of denial of service or information leakage. The `--profiling` argument is deprecated and can now be provided through the [KubeScheduler DebuggingConfiguration](https://kubernetes.io/docs/reference/config-api/kube-scheduler-config.v1/#DebuggingConfiguration). Profiling can be disabled through the kube-scheduler config by setting `enableProfiling` to `false`.                                                                                     
- `requestheader-client-ca-file`: Avoid passing this argument.


### Scheduler networking command line options

- `bind-address`: In most cases, the kube-scheduler does not need to be externally accessible. Setting the bind address to `localhost` is a secure practice.
- `permit-address-sharing`: Set this to `false` to  disable connection sharing through `SO_REUSEADDR`. `SO_REUSEADDR` can lead to reuse of terminated connections that are in `TIME_WAIT` state.
- `permit-port-sharing`: Default `false`. Use the default unless you are confident you understand the security implications.


### Scheduler TLS command line options

- `tls-cipher-suites`: Always provide a list of preferred cipher suites. This ensures encryption never happens with insecure cipher suites. 


## Scheduling configurations for custom schedulers

When using custom schedulers based on the Kubernetes scheduling code, cluster administrators need to be careful with
plugins that use the `queueSort`, `prefilter`, `filter`, or `permit` [extension points](/docs/reference/scheduling/config/#extension-points).
These extension points control various stages of a scheduling process, and the wrong configuration can impact the kube-scheduler's behavior in your cluster.

### Key considerations

- Exactly one plugin that uses the `queueSort` extension point can be enabled at a time. Any plugins that use `queueSort` should be scrutinized.
- Plugins that implement the `prefilter` or `filter` extension point can potentially mark all nodes as unschedulable. This can bring scheduling of new pods to a halt.
- Plugins that implement the `permit` extension point can prevent or delay the binding of a Pod. Such plugins should be thoroughly reviewed by the cluster administrator.

When using a plugin that is not one of the [default plugins](/docs/reference/scheduling/config/#scheduling-plugins), consider disabling the `queueSort`, `filter` and `permit` extension points as follows:

```yaml
apiVersion: kubescheduler.config.k8s.io/v1
kind: KubeSchedulerConfiguration
profiles:
  - schedulerName: my-scheduler
    plugins:
      # Disable specific plugins for different extension points
      # You can disable all plugins for an extension point using "*"
      queueSort:
        disabled:
        - name: "*"             # Disable all queueSort plugins
      # - name: "PrioritySort"  # Disable specific queueSort plugin
      filter:
        disabled:
        - name: "*"                 # Disable all filter plugins
      # - name: "NodeResourcesFit"  # Disable specific filter plugin
      permit:
        disabled:
        - name: "*"               # Disables all permit plugins
      # - name: "TaintToleration" # Disable specific permit plugin
```
This creates a scheduler profile ` my-custom-scheduler`.
Whenever the `.spec` of a Pod does not have a value for `.spec.schedulerName`, the kube-scheduler runs for that Pod, 
using its main configuration, and default plugins.
If you define a Pod with `.spec.schedulerName` set to `my-custom-scheduler`, the kube-scheduler runs but with a custom configuration; in that custom configuration,
the  `queueSort`, `filter` and `permit` extension points are disabled.
If you use this KubeSchedulerConfiguration, and don't run any custom scheduler, 
and you then define a Pod with  `.spec.schedulerName` set to `nonexistent-scheduler` 
(or any other scheduler name that doesn't exist in your cluster), no events would be generated for a pod.

## Disallow labeling nodes

A cluster administrator should ensure that cluster users cannot label the nodes. 
A malicious actor can use `nodeSelector` to schedule workloads on nodes where those workloads should not be present.
