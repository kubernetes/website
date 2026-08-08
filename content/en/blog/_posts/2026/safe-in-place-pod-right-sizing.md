---
layout: blog
title: "Hands-off right-sizing without killing Pods"
draft: true
math: true
slug: safe-in-place-pod-right-sizing
author: >
  [Sebastien Tardif](https://github.com/SebTardif)
---

The goal many platform teams actually want is simple to say and hard to
run:

**Keep container CPU and memory requests aligned with real usage, continuously,
without treating Pod deletion, eviction, or container restart as the normal
way to apply every change.**

In-place Pod resize ([generally available since Kubernetes 1.35](/blog/2025/12/19/kubernetes-v1-35-in-place-pod-resize-ga/))
is the primitive that makes that goal realistic. It is not the whole system.

This post is about how those pieces work together so a resize API
becomes **hands-off adaptive right-sizing**:

1. Measure usage over enough history.
2. Decide a new request (and maybe limit).
3. Apply with the Pod **resize** path when possible.
4. Verify the workload is still healthy.
5. Revert or dampen when it is not.
6. Coexist with horizontal scaling so the loops do not fight.

I am writing as an operator and practitioner, not as a statement of official
Kubernetes architecture. The Vertical Pod Autoscaler (VPA) is the main
project-side answer for vertical recommendations and apply. Custom
automation is optional. Where I give **concrete numbers, formulas, or
stage names**, treat them as **field examples** one team might use, not as
Kubernetes-endorsed standards. Other designs work. The **loop** is what
matters.

Right-sizing is only **one** use case for in-place resize. The same API
supports startup CPU boosts, shrinking idle pre-warmed workers, and other
short-lived vertical adjustments in the
[GA announcement](/blog/2025/12/19/kubernetes-v1-35-in-place-pod-resize-ga/).
This post stays on continuous right-sizing.

## Why static requests keep failing

Teams over-request because under-requesting fails in public: throttling,
restarts, OOM kills, pages at night. Over-requesting fails in private:
worse bin-packing and a larger bill. That is often **rational fear**, not
laziness. When the alternative to a 2-core request was "get OOM-killed or
throttled at 3 AM," over-provisioning was the safe local choice.

Public telemetry keeps showing large headroom. Datadog has reported that
**over 65% of Kubernetes workloads use less than half of their requested
CPU and memory**
([container report](https://www.datadoghq.com/container-report/)).
Industry FinOps discussions likewise call out overprovisioning as a major
cost driver. Treat any single report as directional for that dataset, not
a census of every cluster.

Static requests cannot track a service that grows, ships a heavier
dependency, or has a nightly batch spike. People want **adaptation**.
Until in-place resize, adaptation usually meant **replace the Pod**.

## The end state: a closed loop that prefers live resize

Hands-off right-sizing is a control loop, not a one-shot patch:

```text
observe usage  →  recommend  →  apply (prefer /resize)  →  verify  →
    ↑________________ revert / backoff / dampen ______________|
```

**Success looks like:** requests drift toward real need; most applies do
not evict or restart; bad decreases undo cleanly; HPA still scales for
load, not for request-math artifacts; thin data stays cautious.

**Failure looks like:** every change restarts Pods; requests flap every
reconcile; VPA and HPA chase the same CPU percentage; memory is cut under
a spike; nobody trusts the numbers, so automation is turned off.

In-place resize addresses the **mechanism** of the first failure. The rest
is how measure, decide, apply, verify, and coexist fit together.

---

## 1. Apply with in-place resize when you can

Docs: [Resize container resources](/docs/tasks/configure-pod-container/resize-container-resources/).

The Pod **resize** subresource updates desired CPU and memory in
`spec.containers[*].resources` (see also
[Manage resources for containers](/docs/concepts/configuration/manage-resources-containers/)
for how requests and limits work). The `kubelet` actuates into
`status.containerStatuses[*].resources`. Container `resizePolicy` chooses
`NotRequired` (live cgroup update) versus `RestartContainer` per resource.

Example (prefer live CPU; restart on memory when the app cannot adapt):

```yaml
containers:
  - name: app
    resources:
      requests:
        cpu: "500m"
        memory: "256Mi"
      limits:
        cpu: "500m"
        memory: "256Mi"
    resizePolicy:
      - resourceName: cpu
        restartPolicy: NotRequired
      - resourceName: memory
        restartPolicy: RestartContainer
```

For a hands-off loop that avoids kill and restart when possible:

- Prefer **`NotRequired` for CPU** when the runtime tolerates live change.
- Treat **memory** carefully. CPU and memory resizes both go through
  cgroup updates when `NotRequired` is used. Many apps and runtimes (for
  example some Java setups) still cannot adapt to a live memory limit,
  which is why docs often show `RestartContainer` for memory. A loop that
  "never restarts" may still need restart for **some** memory changes.
- Preserve **QoS class** ([Pod QoS](/docs/concepts/workloads/pods/pod-qos/)).
- Know the **hard limits** on the task page: CPU and memory only; Windows,
  swap, and static CPU or Memory manager policies; non-restartable init
  and ephemeral containers; and related restrictions.

### Memory decrease is part of adaptation, with a real race

Since 1.35, decreasing memory limits is allowed. The `kubelet` does a
**best-effort** check: if usage is already above the new limit, it skips
applying and leaves the resize in progress rather than forcing an immediate
OOM. That check can still lose a race if usage spikes right after the
check. See the GA blog and
[kubernetes/kubernetes#135670](https://github.com/kubernetes/kubernetes/issues/135670).

Platform guard is not application health. OOM and readiness after a
decrease remain first-class signals to revert.

---

## 2. Decide and apply, start with VPA

[HPA](/docs/concepts/workloads/autoscaling/horizontal-pod-autoscale/)
is core. [VPA](/docs/concepts/workloads/autoscaling/vertical-pod-autoscale/)
is an **add-on** you install. That alone explains much of the adoption
gap versus HPA: one is always available, one is an operational choice.

VPA has also moved with in-place resize. It is not stuck forever on
"evict every change":

| Mode | Role in a hands-off path |
|------|---------------------------|
| `Off` | Measure and recommend only. Best first step. |
| `Initial` | Set resources at Pod creation only. |
| `Recreate` | Apply by eviction and recreate. Disruptive but PDB-aware. |
| `InPlaceOrRecreate` | Prefer in-place resize; fall back to eviction when needed. |
| `InPlace` | In-place only where available and gated; retry without eviction fallback. |

Eviction-based apply uses the Eviction API and respects
[PodDisruptionBudgets](/docs/concepts/workloads/pods/disruptions/).
For hands-off without kill as **normal**, prefer modes that try in-place
first, and keep PDBs for fallback.

Use `resourcePolicy.containerPolicies` so automation stays bounded:
`minAllowed` / `maxAllowed`, `controlledResources`, and
`controlledValues` (`RequestsOnly` versus `RequestsAndLimits`).

### What operators still own after VPA is configured

Even with good VPA modes, teams still hit loop problems VPA does not fully
absorb for every organization:

1. **Disruption risk on the fallback path** when in-place cannot apply.
2. **HPA interaction** when both use the same resource utilization signal.
3. **Trust and explainability.** Histogram-style recommendations can be
   hard to audit when a value looks surprising. That is not unique to VPA,
   but it is why many teams stay on `Off` longer than they planned: they
   can see a number, not always why it is that number.

Those are reasons to **configure carefully and verify after apply**, not
reasons to ignore VPA. Most teams should exhaust VPA `Off` → bounded
policies → in-place-capable modes before writing a recommender.

You do **not** need a custom controller for a basic closed loop. Custom
automation is for policies the add-on cannot express.

---

## 3. Coexist with horizontal scaling

When something lowers CPU **requests**, utilization as
usage ÷ request jumps even if absolute usage is flat. HPA **can** scale
out; more replicas drop usage per Pod; vertical logic trims again. That
feedback shows up when both loops use the **same resource utilization
metric**. It is not destiny.

**Default approach:**

1. Vertical loop owns request (and maybe limit) sizing.
2. HPA scales on a **different** signal when possible (QPS, concurrency,
   queue depth, or other custom or external metrics).
3. Or restrict VPA with `controlledResources` so it does not own the axis
   HPA uses.

### Optional field math: keep percentage-of-request HPA in sync

Only if you must keep percentage-of-request HPA on the same resource,
one approach is to adjust the HPA utilization target when requests change
so the **absolute** threshold stays roughly stable:

\\(\text{newTarget} = \text{originalTarget} \times \frac{\text{oldRequest}}{\text{newRequest}}\\)

Example: original target 70%, request 500m → 300m gives
**70% × (500 ÷ 300) ≈ 117%**, about the same absolute CPU threshold
(~350m). Caveats: targets above 100%, stabilization windows, multi-step
drift if you do not store the original target, and custom-metric HPAs that
do not fit. Prefer metric separation whenever you can.

---

## 4. Verify and revert with multiple signals

Apply without kill is only half of safe.

**Example signals** teams watch after a resize (especially a decrease):

| Signal | Example field technique |
|--------|-------------------------|
| OOM | `lastState.terminated.reason == OOMKilled` with timestamp **after** the resize |
| Restarts | `restartCount` jump above a small threshold after the change |
| Readiness | Pod `Ready` condition going false |
| CPU throttling | `rate(container_cpu_cfs_throttled_periods_total[5m]) / rate(container_cpu_cfs_periods_total[5m])`; some teams investigate above about **50%**. Throttling is **limit**-driven, not request-driven. Use a grace period after resize so rate windows are not half pre-resize data. |
| App SLOs | Latency or error rate breach after resize beats "infrastructure green" |

When automation applied via resize, prefer **revert via resize**. If the
same workload reverts repeatedly, **back off** (for example exponential
backoff on that target) so the loop does not thrash every reconcile.

How much of this path VPA covers varies by version and mode. Know what
you still own in monitoring and policy before you call the system
hands-off.

---

## 5. Earn the right to be unattended

### Example autonomy ladder (map it to VPA when you can)

Do not jump to full auto on day one. One **example** progression:

| Stage | Intent | Often maps to |
|-------|--------|----------------|
| **Observe** | Metrics pipeline only; no recommendations required | Instrumentation, no VPA yet |
| **Recommend** | Surface numbers; humans review | VPA `updateMode: Off` |
| **One-shot** | Apply once to a single Pod or small target; stop | Manual resize or tightly scoped apply |
| **Canary** | Resize a fraction (for example about 10%); promote only if verify passes | Partial rollout discipline around VPA or gated apply |
| **Auto** | Continuous apply on eligible workloads | `InPlaceOrRecreate` or `InPlace` after trust |

Stages can last days or weeks. Names and counts are not sacred; the idea
is **blast radius grows only after verify stays clean**.

### History: why thin data should stay fat

A recommendation from two hours of traffic is not the same as two weeks
that include peak. **Example field approach** some teams use when they
score their own recommendations (VPA has its own recommender; this is not
a replacement for it):

Combine **time coverage** and **sample density**. Here `dataPoints` is
the count of usage samples in the window (for example points from a
Prometheus range query):

```math
\begin{aligned}
\text{timeComponent} &= \text{days of data collected} \\
\text{dataComponent} &= \sqrt{\frac{\text{dataPoints}}{24}} \\
\text{confidence} &= \operatorname{clamp}\!\left(\frac{\min(\text{timeComponent},\;\text{dataComponent})}{7},\; 0,\; 1\right)
\end{aligned}
```

At low confidence, add headroom; at full confidence, shrink the buffer:

\\(\text{confidenceFactor} = 1 + \text{multiplier} \times (1 - \text{confidence})^{\text{exponent}}\\)

With example defaults multiplier = 1.0 and exponent = 2.0, no data starts
near a **100%** safety buffer that decays toward zero around a week of
dense data. The point is the **policy**, not the constants: sparse or
young workloads must not get aggressive shrinks.

### Dampening: stop thrash

Without dampening, a loop can oscillate every reconcile. **Example**
controls (other thresholds are fine):

- **Minimum change:** one team might ignore moves below about **10%** of
  the current value (460m vs 500m is noise).
- **Maximum step:** cap each resize (for example about **50%** of current
  for CPU) so convergence takes multiple cycles.
- **Directional caps:** allow faster recovery up than shrink down (for
  example up to **+50%** per step but only about **−30%** down).

These are calm-loop engineering, not official Kubernetes patterns.

### Time-of-day and bursts

A single percentile over a full week can miss nightly ETL or over-fit a
quiet weekend.

**Example diurnal method:** bucket usage into **24 hourly windows**, take
a high percentile in each hour, then take the **maximum across hours**.
The recommendation covers the worst hour without sizing the whole day for
that hour alone.

**Example burst method:** if max observed usage exceeds about **3×** the
95th percentile, treat the workload as bursty and add headroom that grows
slower than a pure linear spike:

\\(\text{burstFactor} = 1 + \text{sensitivity} \times \log_2\!\left(\frac{\text{max}}{\text{p95}}\right)\\)

With a common sensitivity choice, a **4×** burst might add on the order of
**20%** headroom and an **8×** burst on the order of **30%**. The log curve
stops one pathological spike from dominating forever. Again: illustration,
not a standard.

Alternatively, keep vertical for baseline and let **HPA** (or scheduled
overlays) absorb spikes. That composition is valid too.

---

## Putting it together (minimal path first)

Stay close to project components until they fail you:

1. Confirm in-place resize on a canary Pod
   ([resize task](/docs/tasks/configure-pod-container/resize-container-resources/)).
2. Install VPA; targets in **`Off`**; read recommendations across real
   traffic (Recommend stage).
3. Set `containerPolicies` bounds; choose requests-only versus
   requests-and-limits.
4. Point HPA at a **non-competing** metric if you scale horizontally.
5. Move toward **`InPlaceOrRecreate` or `InPlace`** only after numbers and
   PDBs look sane; widen blast radius using something like the ladder
   above.
6. Wire multi-signal verify (and revert) before you call it hands-off.
7. Only then add custom policy (confidence-style headroom, diurnal
   buckets, stricter dampening) if VPA defaults are not enough.

If you replace the recommender or actuator later, **keep the same jobs**:
prefer resize, verify, revert with backoff, coexist with HPA, dampen,
respect history and load shape.

---

## Feedback that improves the whole loop

If you run in-place resize in production and hit sharp edges, feature
owners care about concrete reports more than abstract designs. Examples:

- OOM after memory decrease despite kubelet guards (see also
  [kubernetes/kubernetes#135670](https://github.com/kubernetes/kubernetes/issues/135670))
- Resizes stuck deferred or infeasible without clear operator guidance
- Runtimes that ignore live memory or CPU changes
- Scheduler and kubelet races around resize (tracked for example in
  [kubernetes/kubernetes#126891](https://github.com/kubernetes/kubernetes/issues/126891);
  the [IPPR GA post](/blog/2025/12/19/kubernetes-v1-35-in-place-pod-resize-ga/)
  also calls out this class of work under improved stability)

---

## Closing

Hands-off right-sizing is not a single flag. It is several capabilities
working as one control loop:

| Piece | Job |
|-------|-----|
| In-place resize | Apply without kill or restart when possible |
| VPA (or equivalent) | Measure, recommend, apply with policy bounds |
| HPA metric choice | Horizontal scale without fighting vertical math |
| Verify and revert | Detect harm; undo live; back off when stuck |
| History, dampening, staged scope | Earn the right to be unattended |

In-place Pod resize removed the old assumption that vertical change must
replace the Pod. The remaining work is operational: get measure, decide,
apply, verify, and horizontal policy working together so adaptation can run
without teaching users that right-sizing means downtime.

Start from the docs and VPA modes. Add autonomy only as fast as verify and
HPA coexistence allow. Use the field examples above when you need more
policy detail, and send sharp production feedback upstream when the API
or add-ons still fall short. That is the path to resizing that keeps
adapting, and keeps Pods alive.
