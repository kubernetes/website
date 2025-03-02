---
layout: blog
title: "7 Common Kubernetes Pitfalls (and How I Learned to Avoid Them)"
date: 2024-12-27
slug: seven-kubernetes-pitfalls-and-how-to-avoid
author: >
  Abdelkoddous Lhajouji (CNCF Kubestronaut)
---

It’s no secret that Kubernetes can be both powerful and frustrating at times. When I first started dabbling with container orchestration, I made more than my fair share of mistakes enough to compile a whole list of pitfalls. In this post, I want to walk through seven big gotchas i’ve encountered (or seen others run into) and share some tips on how to avoid them. Whether you’re just kicking the tires on Kubernetes or already managing production clusters, I hope these insights help you steer clear of a little extra stress.

---

## 1. Skipping Resource Requests and Limits

**The Pitfall**: Not specifying CPU and memory requirements in your resource manifests. By default, Kubernetes can’t guess what your containers need, so in the worst-case scenario, you might either get starved of resources or accidentally hog them without realizing it.

**Context**:
In Kubernetes, resource requests and limits are critical for efficient cluster management. Resource requests ensure that the scheduler reserves the appropriate amount of CPU and memory for each pod, guaranteeing that it has the necessary resources to operate. Resource limits cap the amount of CPU and memory a pod can use, preventing any single pod from consuming excessive resources and potentially starving other pods.

When resource requests and limits are not set:

 1. Resource Starvation: Pods may get insufficient resources, leading to degraded performance or failures. This is because Kubernetes schedules pods based on these requests. Without them, the scheduler might place too many pods on a single node, leading to resource contention and performance bottlenecks.

 2. Resource Hoarding: Conversely, without limits, a pod might consume more than its fair share of resources, impacting the performance and stability of other pods on the same node. This can lead to issues such as other pods getting evicted or killed by the Out-Of-Memory (OOM) killer due to lack of available memory.

**How to Avoid It**:
- Start with modest `requests` (e.g., `100m` CPU, `128Mi` memory) and see how your app behaves.
- Monitor real-world usage and refine your values; the [Horizontal Pod Autoscaler](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/) can help automate scaling based on metrics.
- Keep an eye on `kubectl top pods` or your logging/monitoring tool to confirm you’re not over- or under-provisioning.

**My Reality Check**: Early on, I never thought about memory limits. Things seemed fine on my local cluster. Then, on a larger environment, Pods got OOMKilled left and right. Lesson learned.

---

## 2. Underestimating Liveness and Readiness Probes

**The Pitfall**: Deploying containers without telling Kubernetes whether your app is actually ready or alive. If your service “looks” like it’s running but is too slow or stuck, users can get 500 errors without you even knowing.

**How to Avoid It**:
- Add a simple HTTP `livenessProbe` to check a health endpoint (e.g., `/healthz`) so Kubernetes can restart a hung container.
- Use a `readinessProbe` to ensure traffic doesn’t reach your app until it’s warmed up.
- Keep probes simple. Overly complex checks can create false alarms and unnecessary restarts.

**My Reality Check**: I once forgot a readiness probe for a web service that took a while to load. Users hit it prematurely, got weird timeouts, and I spent hours scratching my head. A 3-line readiness probe would have saved the day.

---

## 3. “We’ll Just Look at Container Logs” (Famous Last Words)

**The Pitfall**: Relying solely on ephemeral Pod logs for troubleshooting. Once a Pod restarts or gets replaced, those logs vanish, and you lose critical debugging context.


**How to Avoid It**:
- **Centralize logs** using CNCF tools like [Fluentd](https://kubernetes.io/docs/concepts/cluster-administration/logging/#sidecar-container-with-a-logging-agent) or [Fluent Bit](https://fluentbit.io/) to aggregate output from all Pods.
- **Adopt OpenTelemetry** for a unified view of logs, metrics, and (if needed) traces. This lets you spot correlations between infrastructure events and app-level behavior.
- **Pair logs with Prometheus metrics** to track cluster-level data alongside application logs. If you need distributed tracing, consider CNCF projects like [Jaeger](https://www.jaegertracing.io/).

**My Reality Check**: The first time I lost Pod logs to a quick restart, I realized how flimsy “kubectl logs” can be on its own. Since then, I’ve set up a proper pipeline for every cluster to avoid missing vital clues.

---

## 4. Treating Dev and Prod Exactly the Same

**The Pitfall**: Deploying the same YAML with the same resources and settings to dev, staging, and production. Different environments have different needs, traffic patterns, and sometimes secrets.

**How to Avoid It**:
- Use environment overlays or [kustomize](https://kubernetes.io/docs/tasks/manage-kubernetes-objects/kustomization/) to maintain a shared base while customizing resource requests, replicas, or config for each environment.
- Keep secrets or environment-specific data in separate files, or use a specialized tool (e.g., Sealed Secrets).
- Plan for scale in production. Your dev cluster can probably get away with minimal CPU/memory, but prod might need significantly more.

**My Reality Check**: One time, I scaled up `replicaCount` from 2 to 10 in a tiny dev environment just to “test.” I promptly ran out of resources and spent half a day cleaning up the aftermath. Oops.

---

## 5. Leaving Old Stuff Floating Around

**The Pitfall**: Forgetting to clean up old Deployments, leftover Services, or orphaned PersistentVolumes. Over time, these ghost resources can cause confusion, inflate cloud bills, or break workflows if you accidentally route traffic to them.

**How to Avoid It**:
- **Label everything** with a purpose or owner label. That way, you can easily query resources you no longer need.
- **Regularly audit** your cluster: run `kubectl get all -n <namespace>` to see what’s actually running, and confirm it’s all legit.
- **Adopt Kubernetes’ Garbage Collection**: [K8s docs](https://kubernetes.io/docs/concepts/workloads/controllers/garbage-collection/) show how to remove dependent objects automatically.
- **Leverage policy automation**: Tools like [Kyverno](https://kyverno.io/) can automatically delete or block stale resources after a certain period, or enforce lifecycle policies so you don’t have to remember every single cleanup step.

**My Reality Check**: After a hackathon, I forgot to tear down a “test-svc” pinned to an external load balancer. Three weeks later, I realized I’d been paying for that LB the entire time. Facepalm.

---

## 6. Diving Too Deep into Networking Too Soon

**The Pitfall**: Jumping into complex service meshes, advanced CNI plugins, or multi-cluster traffic routing before you really grasp the basics of ClusterIP, NodePort, or a simple Ingress setup.

**How to Avoid It**:
- Start small: a Deployment, a Service, maybe a basic Ingress controller (like NGINX).
- Make sure you understand how traffic flows within the cluster, how service discovery works, and how DNS is configured.
- Only move to a full-blown mesh or advanced CNI features when you actually need them, complex networking adds overhead.

**My Reality Check**: I tried Istio on a small internal app once, then spent more time debugging Istio itself than the actual app. Eventually, I stepped back, removed Istio, and everything worked fine.

---

## 7. Going Too Light on Security and RBAC

**The Pitfall**: Running containers as `root`, using `latest` images, or granting `cluster-admin` rights to everyone. It’s easy in dev, but you’re essentially leaving the door unlocked if you carry this into production.

**How to Avoid It**:
- Use [RBAC](https://kubernetes.io/docs/reference/access-authn-authz/rbac/) to define clear roles and permissions.
- Pin images to specific versions (no more `:latest`!). This helps you know what’s actually deployed.
- Look into [Pod Security Admission](https://kubernetes.io/docs/concepts/security/pod-security-admission/) (or other solutions like Kyverno) to enforce non-root containers, read-only filesystems, etc.

**My Reality Check**: I never had a huge security breach, but i’ve heard plenty of cautionary tales. If you don’t tighten things up, it’s only a matter of time before something goes wrong.

---

## Final Thoughts

Kubernetes is amazing, but it’s not psychic, it won’t magically do the right thing if you don’t tell it what you need. By keeping these pitfalls in mind, you’ll avoid a lot of headaches and wasted time. Mistakes happen (trust me, I’ve made my share), but each one is a chance to learn more about how Kubernetes truly works under the hood.

If you’re curious to dive deeper, the [official docs](https://kubernetes.io/docs/home/) and the [community Slack](http://slack.kubernetes.io/) are excellent next steps. And of course, feel free to share your own horror stories or success tips, because at the end of the day, we’re all in this cloud native adventure together.

**Happy Shipping!**
