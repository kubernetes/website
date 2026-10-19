---
layout: blog
title: "7 Common Kubernetes Pitfalls (and How I Learned to Avoid Them)"
date: 2025-10-20T08:30:00-07:00
slug: seven-kubernetes-pitfalls-and-how-to-avoid
author: >
  Abdelkoddous Lhajouji
---

It’s no secret that Kubernetes can be both powerful and frustrating at times. When I first started dabbling with container orchestration, I made more than my fair share of mistakes enough to compile a whole list of pitfalls. In this post, I want to walk through seven big gotchas I’ve encountered (or seen others run into) and share some tips on how to avoid them. Whether you’re just kicking the tires on Kubernetes or already managing production clusters, I hope these insights help you steer clear of a little extra stress.


## 1. Skipping resource requests and limits

**The pitfall**: Not specifying CPU and memory requirements in Pod specifications. This typically happens because Kubernetes does not require these fields, and workloads can often start and run without them—making the omission easy to overlook in early configurations or during rapid deployment cycles.

**Context**:
In Kubernetes, resource requests and limits are critical for efficient cluster management. Resource requests ensure that the scheduler reserves the appropriate amount of CPU and memory for each pod, guaranteeing that it has the necessary resources to operate. Resource limits cap the amount of CPU and memory a pod can use, preventing any single pod from consuming excessive resources and potentially starving other pods.
When resource requests and limits are not set:

 1. Resource Starvation: Pods may get insufficient resources, leading to degraded performance or failures. This is because Kubernetes schedules pods based on these requests. Without them, the scheduler might place too many pods on a single node, leading to resource contention and performance bottlenecks.
 2. Resource Hoarding: Conversely, without limits, a pod might consume more than its fair share of resources, impacting the performance and stability of other pods on the same node. This can lead to issues such as other pods getting evicted or killed by the Out-Of-Memory (OOM) killer due to lack of available memory.

### How to avoid it:
- Start with modest `requests` (for example `100m` CPU, `128Mi` memory) and see how your app behaves.
- Monitor real-world usage and refine your values; the [HorizontalPodAutoscaler](/docs/tasks/run-application/horizontal-pod-autoscale/) can help automate scaling based on metrics.
- Keep an eye on `kubectl top pods` or your logging/monitoring tool to confirm you’re not over- or under-provisioning.

**My reality check**: Early on, I never thought about memory limits. Things seemed fine on my local cluster. Then, on a larger environment, Pods got *OOMKilled* left and right. Lesson learned.
For detailed instructions on configuring resource requests and limits for your containers, please refer to [Assign Memory Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-memory-resource/)
(part of the official Kubernetes documentation).

## 2. Underestimating liveness and readiness probes

**The pitfall**: Deploying containers without explicitly defining how Kubernetes should check their health or readiness. This tends to happen because Kubernetes will consider a container “running” as long as the process inside hasn’t exited. Without additional signals, Kubernetes assumes the workload is functioning—even if the application inside is unresponsive, initializing, or stuck.

**Context**:  
Liveness, readiness, and startup probes are mechanisms Kubernetes uses to monitor container health and availability. 

- **Liveness probes** determine if the application is still alive. If a liveness check fails, the container is restarted.
- **Readiness probes** control whether a container is ready to serve traffic. Until the readiness probe passes, the container is removed from Service endpoints.
- **Startup probes** help distinguish between long startup times and actual failures.

### How to avoid it:
- Add a simple HTTP `livenessProbe` to check a health endpoint (for example `/healthz`) so Kubernetes can restart a hung container.
- Use a `readinessProbe` to ensure traffic doesn’t reach your app until it’s warmed up.
- Keep probes simple. Overly complex checks can create false alarms and unnecessary restarts.

**My reality check**: I once forgot a readiness probe for a web service that took a while to load. Users hit it prematurely, got weird timeouts, and I spent hours scratching my head. A 3-line readiness probe would have saved the day.

For comprehensive instructions on configuring liveness, readiness, and startup probes for containers, please refer to [Configure Liveness, Readiness and Startup Probes](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/)
in the official Kubernetes documentation.

## 3. “We’ll just look at container logs” (famous last words)

**The pitfall**: Relying solely on container logs retrieved via `kubectl logs`. This often happens because the command is quick and convenient, and in many setups, logs appear accessible during development or early troubleshooting. However, `kubectl logs` only retrieves logs from currently running or recently terminated containers, and those logs are stored on the node’s local disk. As soon as the container is deleted, evicted, or the node is restarted, the log files may be rotated out or permanently lost.

### How to avoid it:
- **Centralize logs** using CNCF tools like [Fluentd](https://kubernetes.io/docs/concepts/cluster-administration/logging/#sidecar-container-with-a-logging-agent) or [Fluent Bit](https://fluentbit.io/) to aggregate output from all Pods.
- **Adopt OpenTelemetry** for a unified view of logs, metrics, and (if needed) traces. This lets you spot correlations between infrastructure events and app-level behavior.
- **Pair logs with Prometheus metrics** to track cluster-level data alongside application logs. If you need distributed tracing, consider CNCF projects like [Jaeger](https://www.jaegertracing.io/).

**My reality check**: The first time I lost Pod logs to a quick restart, I realized how flimsy “kubectl logs” can be on its own. Since then, I’ve set up a proper pipeline for every cluster to avoid missing vital clues.

## 4. Treating dev and prod exactly the same

**The pitfall**: Deploying the same Kubernetes manifests with identical settings across development, staging, and production environments. This often occurs when teams aim for consistency and reuse, but overlook that environment-specific factors—such as traffic patterns, resource availability, scaling needs, or access control—can differ significantly. Without customization, configurations optimized for one environment may cause instability, poor performance, or security gaps in another.

### How to avoid it:
- Use environment overlays or [kustomize](https://kustomize.io/) to maintain a shared base while customizing resource requests, replicas, or config for each environment.
- Extract environment-specific configuration into ConfigMaps and / or Secrets. You can use a specialized tool such as [Sealed Secrets](https://github.com/bitnami-labs/sealed-secrets) to manage confidential data.
- Plan for scale in production. Your dev cluster can probably get away with minimal CPU/memory, but prod might need significantly more.

**My reality check**: One time, I scaled up `replicaCount` from 2 to 10 in a tiny dev environment just to “test.” I promptly ran out of resources and spent half a day cleaning up the aftermath. Oops.

## 5. Leaving old stuff floating around

**The pitfall**: Leaving unused or outdated resources—such as Deployments, Services, ConfigMaps, or PersistentVolumeClaims—running in the cluster. This often happens because Kubernetes does not automatically remove resources unless explicitly instructed, and there is no built-in mechanism to track ownership or expiration. Over time, these forgotten objects can accumulate, consuming cluster resources, increasing cloud costs, and creating operational confusion, especially when stale Services or LoadBalancers continue to route traffic.

### How to avoid it:
- **Label everything** with a purpose or owner label. That way, you can easily query resources you no longer need.
- **Regularly audit** your cluster: run `kubectl get all -n <namespace>` to see what’s actually running, and confirm it’s all legit.
- **Adopt Kubernetes’ Garbage Collection**: [K8s docs](/docs/concepts/workloads/controllers/garbage-collection/) show how to remove dependent objects automatically.
- **Leverage policy automation**: Tools like [Kyverno](https://kyverno.io/) can automatically delete or block stale resources after a certain period, or enforce lifecycle policies so you don’t have to remember every single cleanup step.

**My reality check**: After a hackathon, I forgot to tear down a “test-svc” pinned to an external load balancer. Three weeks later, I realized I’d been paying for that load balancer the entire time. Facepalm.

## 6. Diving too deep into networking too soon

**The pitfall**: Introducing advanced networking solutions—such as service meshes, custom CNI plugins, or multi-cluster communication—before fully understanding Kubernetes' native networking primitives. This commonly occurs when teams implement features like traffic routing, observability, or mTLS using external tools without first mastering how core Kubernetes networking works: including Pod-to-Pod communication, ClusterIP Services, DNS resolution, and basic ingress traffic handling. As a result, network-related issues become harder to troubleshoot, especially when overlays introduce additional abstractions and failure points.

### How to avoid it:

- Start small: a Deployment, a Service, and a basic ingress controller such as one based on NGINX (e.g., Ingress-NGINX).
- Make sure you understand how traffic flows within the cluster, how service discovery works, and how DNS is configured.
- Only move to a full-blown mesh or advanced CNI features when you actually need them, complex networking adds overhead.

**My reality check**: I tried Istio on a small internal app once, then spent more time debugging Istio itself than the actual app. Eventually, I stepped back, removed Istio, and everything worked fine.

## 7. Going too light on security and RBAC

**The pitfall**: Deploying workloads with insecure configurations, such as running containers as the root user, using the `latest` image tag, disabling security contexts, or assigning overly broad RBAC roles like `cluster-admin`. These practices persist because Kubernetes does not enforce strict security defaults out of the box, and the platform is designed to be flexible rather than opinionated. Without explicit security policies in place, clusters can remain exposed to risks like container escape, unauthorized privilege escalation, or accidental production changes due to unpinned images.

### How to avoid it:

- Use [RBAC](/docs/reference/access-authn-authz/rbac/) to define roles and permissions within Kubernetes. While RBAC is the default and most widely supported authorization mechanism, Kubernetes also allows the use of alternative authorizers. For more advanced or external policy needs, consider solutions like [OPA Gatekeeper](https://open-policy-agent.github.io/gatekeeper/) (based on Rego), [Kyverno](https://kyverno.io/), or custom webhooks using policy languages such as CEL or [Cedar](https://cedarpolicy.com/).
- Pin images to specific versions (no more `:latest`!). This helps you know what’s actually deployed.
- Look into [Pod Security Admission](/docs/concepts/security/pod-security-admission/) (or other solutions like Kyverno) to enforce non-root containers, read-only filesystems, etc.

**My reality check**: I never had a huge security breach, but I’ve heard plenty of cautionary tales. If you don’t tighten things up, it’s only a matter of time before something goes wrong.

## Final thoughts

Kubernetes is amazing, but it’s not psychic, it won’t magically do the right thing if you don’t tell it what you need. By keeping these pitfalls in mind, you’ll avoid a lot of headaches and wasted time. Mistakes happen (trust me, I’ve made my share), but each one is a chance to learn more about how Kubernetes truly works under the hood.
If you’re curious to dive deeper, the [official docs](/docs/home/) and the [community Slack](http://slack.kubernetes.io/) are excellent next steps. And of course, feel free to share your own horror stories or success tips, because at the end of the day, we’re all in this cloud native adventure together.

**Happy Shipping!**
