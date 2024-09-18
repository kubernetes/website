---
title: Adopting Sidecar Containers
content_type: tutorial
weight: 40
min-kubernetes-server-version: 1.29
---

<!-- overview -->

This section is relevant for people adopting a new built-in [sidecar containers](/docs/concepts/workloads/pods/sidecar-containers/) feature for their workloads.

Sidecar containers is not a new concept as posted in the [blog post](https://kubernetes.io/blog/2015/06/the-distributed-system-toolkit-patterns/).
Kubernetes allowed to run multiple containers in a Pod to implement this concept. However, running sidecar container as a regular container
has a lot of limitations being fixed with the new built-in sidecar containers support.

{{< feature-state feature_gate_name="SidecarContainers" >}}

## {{% heading "objectives" %}}

* Understand the need for sidecar containers
* Be able to troubleshoot issues with the sidecar containers
* Understand options to universally "inject" sidecar containers to any workload


## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}



<!-- lessoncontent -->

## Sidecar containers overview

Sidecar containers are the secondary containers that run along with the main
application container within the same {{< glossary_tooltip text="Pod" term_id="pod" >}}.
These containers are used to enhance or to extend the functionality of the primary _app
container_ by providing additional services, or functionality such as logging, monitoring,
security, or data synchronization, without directly altering the primary application code.
You can read more in the [Sidecar containers](/docs/concepts/workloads/pods/sidecar-containers/)
concept page.

The concept of sidecar containers is not new and there are multiple implementation of this concept.
As well as sidecar containers that you, the person defining the Pod, want to run, you can also find
that some {{< glossary_tooltip text="addons" term_id="addons" >}} modify Pods -  before the Pods
start running - so that there are extra sidecar containers. The mechanisms to _inject_ those extra
sidecars are often [mutating webhooks](/docs/reference/access-authn-authz/admission-controllers/#mutatingadmissionwebhook).
For example, a service mesh addon might inject a sidecar that configures mutual TLS and encryption
in transit between different Pods.

While the concept of sidecar containers is not new,
the native implementation of this feature in Kubernetes, however, is new. And as with every new feature,
adopting this feature may present certain challenges.

This tutorial explore challenges and solution can be experienced by end users as well as
by authors of sidecar containers.

## Benefits of a built-in sidecar containers

Using Kubernetes' native support for sidecar containers provides several benefits:

1. You can configure a native  sidecar container to start ahead of {{< glossary_tooltip text="init containers" term_id="init-container" >}}.
2. The built-in sidecar containers can be authored to guarantee that they are terminated last.
   Sidecar containers are terminated with a `SIGTERM` signal once all the regular containers 
   are completed and terminated. If the sidecar container isn’t gracefully shut down, a 
   `SIGKILL` signal will be used to terminate it.
3. With Jobs, when Pod's `restartPolicy: OnFailure` or `restartPolicy: Never`,
   native sidecar containers do not block Pod completion. With legacy sidecar containers,
   special care is needed to handle this situation.
4. Also, with Jobs, built-in sidecar containers would keep being restarted once they are done, even if regular containers would not with Pod's `restartPolicy: Never`.

## Adopting built-in sidecar containers

The `SidecarContainers` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) is in beta state starting from Kubernetes version 1.29 and is enabled by default.
Some clusters may have this feature disabled or have software installed that is incompatible with the feature.

When this happens, the Pod may be rejected or the sidecar containers may block Pod startup, rendering the Pod useless.
This condition is easy to detect as Pod simply get stuck on initialization. However, it is rarely clear what caused the problem.

Here are the considerations and troubleshooting steps that one can take while adopting sidecar containers for their workload.

### Ensure the feature gate is enabled

As a very first step, make sure that both - API server and Nodes are at Kubernetes version v1.29 or
later.
The feature will break on clusters where Nodes are running earlier versions where it is not enabled.

{{< alert title="Note" color="info" >}}

The feature can be enabled on nodes with  the version 1.28. The behavior of built-in sidecar
container termination was different in version 1.28 and it is not recommended to adjust
behavior of a sidecar to that behavior. However if that only concern is the startup order, the
above statement can be changed to Nodes, running version 1.28 with the feature gate enabled.

{{< /alert >}}

You should ensure that the feature gate is enabled for the API server(s) within the control plane
**and** for all nodes.

One of the ways to check the feature gate enablement is running a command like this:

- For API Server 
  `kubectl get --raw /metrics | grep kubernetes_feature_enabled | grep SidecarContainers`
- For the individual node: 
  `kubectl get --raw /api/v1/nodes/<node-name>/proxy/metrics | grep kubernetes_feature_enabled | grep SidecarContainers`

If you see something like: `kubernetes_feature_enabled{name="SidecarContainers",stage="BETA"} 1`,
it means that the feature is enabled.

### Check for 3rd party tooling and mutating webhooks

If you experience issues when validating the feature, it may be an indication that one of the
3rd party tools or mutating webhooks are broken.

When the `SidecarContainers` feature gate is enabled, Pods gain a new field in their API.
Some tools or mutating webhooks might have been built with an earlier version of Kubernetes API.

If tools pass the unknown fields as-is using various patching strategies to mutate a Pod object,
this will not be a problem. However there are tools that will strip out unknown fields;
if you have those, they must be recompiled with the v1.28+ version of Kubernetes API client code.

The way to check this is to use the `kubectl describe pod` command with your Pod that has passed through
mutating admission.
If any tools stripped out the new field (`restartPolicy:Always`), you will not see it in the command output.

If you hit an issue like this, please advise the author of the tools or the webhooks use one of the patching strategies of modifying objects instead of a full object update.

{{< alert  title="Note" color="info" >}}

Mutating webhook may update Pods based on some conditions. So sidecar containers may work for some Pods and fail for others.

{{< /alert >}}

### Automatic injection of sidecars

If you are using software that injects sidecars automatically,
there are a few possible strategies you may follow to
ensure that native sidecar container can be used.
All of the strategies are generally options you may choose to decide whether
the Pod the sidecar will be injected to will land on a Node supporting the feature or not.

As an example, you can follow [this conversation in Istio community](https://github.com/istio/istio/issues/48794). The discussion is exploring the options listed below.

1. Mark Pods that lands to nodes supporting sidecars. You can use node labels
   and node affinity to mark nodes supporting sidecar containers and Pods landing on those nodes.
2. Check Nodes compatibility on injection. During sidecar injection you may use the following strategies to check node compatibility:
   - query node version and assume the feature gate is enabled on the version 1.29+
   - query node prometheus metrics and check feature enablement status
   - assume the nodes are running with a [supported version skew](/releases/version-skew-policy/#supported-version-skew)
     from the API server
   - there may be other custom ways to detect nodes compatibility.
3. Develop a universal sidecar injector. The idea of a universal sidecar container is to inject a sidecar container
   as a regular container as well as a native sidecar container. And have a runtime logic to decide which one will work.
   The universal sidecar injector is wasteful as it will account for requests twice, but may be considered as a workable solution for special cases.
   - One way would be on start of a native sidecar container
     detect the node version and exit immediately if the version does not support the sidecar feature.
   - Consider runtime feature detection design:
     - Define an empty dir so containers can communicate with each other
     - Inject init container, let's call it `NativeSidecar` with `restartPolicy=Always`. 
     - `NativeSidecar` must write a file to an empty dir indicating the first run and exists immediately with exit code `0`.
     - `NativeSidecar` on restart (when native sidecars are supported) checks that file already exists in the empty dir and changes it - indicating that the built-in sidecar containers are supported and running.
     - Inject regular container, let's call it `OldWaySidecar`.
     - `OldWaySidecar` on start checks the presence of a file in an empty dir.
     - If the file indicates that the `NativeSidecar` is NOT running - it assumes that the sidecar feature is not supported and works assuming it is the sidecar.
     - If the file indicates that the `NativeSidecar` is running - it either does nothing and sleeps forever (in case when Pod’s `restartPolicy=Always`) or exists immediately with exit code `0` (in case when Pod’s `restartPolicy!=Always`).


## {{% heading "whatsnext" %}}


* Learn more about [sidecar containers](/docs/concepts/workloads/pods/sidecar-containers/).
