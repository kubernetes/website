---
layout: blog
title: 'Scaling Kubernetes Workloads with Node Swap'
draft: true
slug: scaling-kubernetes-workloads-with-node-swap
author: >
  [Ocean Xie](https://github.com/oceanxie1),
  [Yuan Wang](https://github.com/yuanwang04)
---

Memory is often the first hard limit a Kubernetes cluster hits. Nodes run out of RAM long before they run out of CPU, and the new wave of agentic AI workloads makes this worse. These workloads demand large memory footprints to start up and run untrusted code, then sit idle waiting for the next prompt. That idle but resident memory is expensive, and it caps how many pods a node can hold. This is where swap helps. Kubernetes support for running nodes with swap enabled reached General Availability in v1.34, and by backing that swap with fast NVMe Local SSDs, a node can page out dormant memory and pack in far more pods. This post benchmarks that approach across three workloads, including CI/CD kernel builds, sandboxed headless browsers, and isolated Python runtimes, and shows density gains of up to 3x, often with little or no latency cost.

## The node density problem

The Kubernetes ecosystem has reached a fundamental physical resource constraint: the strict limits of hardware memory versus the growing demand for dynamic, bursty workloads in the new agentic era.

Historically, administrators provisioning memory-intensive workloads encountered a persistent dilemma: set memory limits too high and you waste expensive infrastructure on idle RAM; set them too low and you risk Out-Of-Memory (OOM) kills.

This conflict is amplified when deploying autonomous AI agents using secure execution environments like the [`agent-sandbox`](https://github.com/kubernetes-sigs/agent-sandbox) framework. These agentic pods require large memory footprints to initialize and execute untrusted code. However, after their burst of activity, they typically enter long-tail idle phases waiting for user prompts. Keeping this idle state in physical RAM caps cluster density and makes AI infrastructure expensive to run.

## The solution: Kubernetes node swap

With the introduction of Kubernetes' support for running nodes with swap enabled (which reached General Availability in v1.34), this paradigm shifts. By enabling the Linux kernel to page out anonymous memory to disk, _node swap_ acts as a shock absorber during traffic spikes or periods of heavy memory oversubscription.

Historically, swap was discouraged in Kubernetes for two reasons. The first was memory accounting. Under cgroup v1, the controls treated memory and swap as a single combined limit rather than letting operators set an independent limit for disk swap. Without independent tracking, a process could page large amounts of anonymous memory out to disk, which made a container's real memory usage unpredictable and hard to isolate. Kubernetes' swap support resolves this by relying on cgroup v2, whose separate swap accounting tracks disk swap on its own. The second reason was the latency penalty of paging to slow spinning disks, which fast NVMe Local SSDs largely eliminate. Together, these make it practical to increase pod density and buffer against memory spikes without sacrificing cluster stability.

## The benchmark data

To quantify the performance boundaries and cost-saving potential of Local SSD-backed node swap, this analysis covers three distinct workload categories: a Traditional Build Workload for CI/CD pipelines, High-Density Browser Sandboxes, and Isolated Python Sandboxes.

| Workload Profile | Baseline Capacity (No Swap) | Local SSD Swap Capacity | Density Improvement | P50 Latency (Baseline → Swap) |
| --- | --- | --- | --- | --- |
| **Linux CI/CD Kernel Build** | 600 MB RAM Limit | 300 MB RAM Limit | **-50% RAM Footprint** | 433s → 374s (No Latency Cost) |
| **Headless Chrome (Kata)** | 40 Concurrent Pods | 50 Concurrent Pods | **+25% Pod Density** | 34.54s → 71.02s (+106% latency) |
| **Headless Chrome (gVisor)** | 80 Concurrent Pods | 160 Concurrent Pods | **+100% Pod Density** | 17.59s → 59.02s (+235% latency) |
| **Python Sandbox (gVisor)** | 80 Concurrent Pods | 240 Concurrent Pods | **+200% Pod Density** | 2.04s → 3.43s (+68% latency) |

### 1. Traditional workload: Linux kernel build

Before exploring specialized agentic architectures, swap was validated against classic batch workloads by running a complete Linux kernel build. The kernel compilation process leverages concurrent worker threads, balloons in memory to hold compiled object files, and requires a large memory spike during the brief linking phase.

This workload mirrors the memory behavior of enterprise CI/CD pipelines. Because earlier compiled objects sit inactive in memory while the pipeline progresses, CI/CD jobs frequently hoard unused physical RAM, which makes them well suited to node swap compression.

On a baseline node without swap, the minimum memory limit to prevent an OOM crash during compilation was 600 MB. Routing swap to a Local SSD cut the container memory limit by 50% to 300 MB without incurring any execution slowdown (in fact, it ran cleanly in 374s vs the baseline 433s). However, as an explicit tradeoff, compressing the limit further to 200 MB forced the active working set into swap, causing long I/O wait times and increasing execution time by over 40%. This reinforces that swap serves as an insurance policy for burst memory, not a replacement for active RAM.

### 2. High-density agent workloads: headless browser runtimes

AI agent workloads frequently require manipulating headless browsers via Chromium. However, trusting external code execution often requires stricter security isolation than standard Linux namespaces. This benchmark cross-evaluated several container runtime environments. The raw logs and testing methodologies for the default runtime are available in the [Agent Sandbox GKE Swap directory](https://github.com/kubernetes-sigs/agent-sandbox/tree/main/examples/gke-swap).

*   **Unsandboxed baseline limits (`runc`):** To test the limits of the environment without the overhead of security runtimes, plain runc containers were swept on a c4-standard-32 node (32 vCPU, 120 GB RAM). Without swap, the node exhausted physical memory and failed past 512 pods. Enabling Local SSD swap allowed the node to support 768 concurrent pods.
*   **Advanced security runtimes (for example: gVisor, Kata Containers):** Enabling strict security sandboxing increases memory overhead and normally reduces pod density. However, memory swap naturally absorbs this overhead penalty. Without swap, a gVisor environment hit a hard limit at 80 pods. Local SSD swap doubled that capacity, which allowed 160 concurrent gVisor pods on a single node. Similarly, Kata Containers microVMs exhausted physical RAM at 40 concurrent pods without swap, but using GCP Local SSD swap expanded this to 50 stable Kata microVMs before CPU saturation.

For a comprehensive architectural breakdown and density metrics for gVisor and Kata, see the [Agent Sandbox GKE Swap Runtimes directory](https://github.com/kubernetes-sigs/agent-sandbox/tree/main/examples/gke-swap/runtimes).

### 3. Beyond browsers: sandboxed Python runtimes

The advantages of node swap also extend to untrusted, isolated code-execution environments. This sweep deployed simultaneous Python sandbox sessions analyzing 5 million rows of data from the MovieLens 20M dataset, requiring a ~375 MB resident memory footprint per execution. The in-depth scaling results and deployment code for this sweep can be reviewed in the [Agent Sandbox GKE Swap Python Density directory](https://github.com/kubernetes-sigs/agent-sandbox/tree/main/examples/gke-swap/python-density).

Without swap, heavy concurrent bursts exhausted physical memory, causing the node to hit a hard RAM limit and fail at 80 concurrent sessions. Enabling Local SSD swap offloaded dormant anonymous memory, freeing up physical RAM and preserving the node's page cache. This allowed the node to scale to 240 concurrently isolated Python sandboxes—a 3x density improvement.

{{< figure src="node-swap-chart.svg" title="Density Benchmarks with and without Node Swap" >}}

## How to use it

If you manage Kubernetes infrastructure for developer environments, browser testing farms, JVM applications, or AI execution runtimes, leveraging Local SSD swap can multiply your density efficiency.

In Kubernetes v1.34+, Node Swap is Generally Available. You enable it via the kubelet configuration:

```yaml
kind: KubeletConfiguration
apiVersion: kubelet.config.k8s.io/v1beta1
failSwapOn: false
memorySwap:
  swapBehavior: LimitedSwap
```

Pairing this upstream configuration with your cloud provider's high-speed local disk gives you dynamic memory balancing. For example, this is natively supported on Google Kubernetes Engine via [Node Memory Swap](https://docs.cloud.google.com/kubernetes-engine/docs/how-to/node-memory-swap) configured on Local SSD profiles.

To get the benefits, configure your workloads with Burstable QoS: set your container's memory limits higher than its requests. The node automatically rations fast swap space based on idle application memory usage while keeping active processes responsive.

## Conclusion

As the Kubernetes ecosystem transitions into the agentic era, administrators face a growing conflict between finite hardware memory limits and the bursty behavior of AI workloads. Frameworks like Agent Sandbox provide the security isolation required for running untrusted agents, but that isolation traditionally demands large amounts of idle memory overhead.

By configuring the kubelet with `LimitedSwap` and routing it to Local SSDs, you can mitigate this conflict. Fast swap offloads the dormant states of idle agents, allowing you to increase pod density and node utilization on the same infrastructure without compromising security boundaries.
