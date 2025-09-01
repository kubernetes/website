
---
title: "How Uber Migrated 3,500+ Interactive Sessions to Kubernetes — with Zero Downtime: A Breakdown"
date: 2025-09-01
author: "Eric Nyuydze Wiryenkfea"
authorURL: "https://github.com/Wiryenkfea-Eric"
authorImageURL: "https://raw.githubusercontent.com/Wiryenkfea-Eric/k8s-blog-assets/master/Downloads/k8s-blog-assets/Profile%20pic.jpeg"

slug: "uber-interactive-sessions-kubernetes-migration"
blog: true
tags: [Kubernetes, DevOps, Uber, Scalability, Infrastructure]
---

Ever tried changing shoes, while running to catch a bus?  

That’s what it felt like when Uber migrated thousands of live Jupyter and RStudio sessions — the beating heart of data science at scale — across container platforms. And incredibly, they pulled it off without disrupting a single user.

But that’s not all. What started as a backend infrastructure migration turned into a masterclass in platform engineering, DevOps resilience, and user-centric innovation.

If you work in DevOps, Data Science, or Platform Engineering, buckle up — because this story is packed with clever tricks, painful lessons, and surprising wins.

Let’s rewind and walk through step by step.

---

## 🔹 Why Migrate to Kubernetes? And why did they do it now?

Uber’s infrastructure follows three key principles:

* Cloud-agnostic flexibility (no vendor lock-in)  
* Automated, homogeneous scaling  
* Seamless on-prem to cloud migration  

Peloton, while reliable, had limitations:

* Static host groups with zero workload portability  
* Zone failures that could wipe out entire services  
* A high operational overhead that didn’t scale well  

Kubernetes promised:

* Better resource management  
* Resilience  
* Cloud readiness  

But migrating live interactive sessions — where users install Python/R packages on the fly — was like swapping a car’s engine while driving.

![Figure1: Transition of interactive session workloads](https://raw.githubusercontent.com/Wiryenkfea-Eric/k8s-blog-assets/master/Downloads/k8s-blog-assets/Transition%20of%20interactive%20session%20workloads%20from%20Peloton%20to%20Kubernetes.webp)
*Figure 1: Transition of interactive session workloads from Peloton to Kubernetes*

---

## 🔹 The Technical Hurdles

They weren’t just migrating apps.  
They were moving **3,500+ interactive sessions**, many of them long-lived, GPU-hungry, and running live production workloads.

And this is where it gets interesting…

### 1. Interactive Sessions ≠ Kubernetes Jobs

Kubernetes Jobs were built for short, ephemeral workloads.  
Uber had to force them into behaving like durable sessions:

* `parallelism: 1` — isolate each session  
* `completions: 1024` — trick the Job into staying “alive”  
* `restartPolicy: Never` — no unwanted restarts  
* `backoffLimit: high` — stop Kubernetes from killing jobs too soon  

```yaml
apiVersion: batch/v1                  # Defines the API version for a Kubernetes Job
kind: Job                             # Specifies this resource is a Job
spec:
  completions: 1024                   # Total number of successful completions required — keeps sessions running
  parallelism: 1                      # Only one pod runs at a time — 1 per user
  backoffLimit: 100                   # Number of retries before considering the Job as failed
  template:
    spec:
      restartPolicy: Never            # Pods will not be restarted on failure
      containers:
      - name: dsw-session             # Name of the container running the interactive session
        image: uber-dsw:latest        # Custom Docker image for Uber’s DSW (Data Science Workbench)
        hostNetwork: true             # Grants the pod access to the host's network stack
```

That alone was impressive. But what came next was even smarter…

### 2. Persisting user-installed packages

Here’s the nightmare: Imagine running a notebook for hours, installing packages, and then suddenly it crashes. Everything gone.

To solve this, Uber built a real-time `inotify` daemon that:

* Watched for package installs (`pip`, `conda`, etc.)
* Checkpointed them to NFS in real-time
* Restored them automatically on reboot

The result? No more reinstallation rage.

### 3. The NFS Conundrum

Peloton hardcoded NFS to static nodes. Kubernetes doesn’t like that.
And at the time, CSI drivers weren’t an option.

So what did they do?
They mounted NFS at the fleet level — making it accessible to every pod without rewriting all their storage logic. A bold move that saved them from months of rewriting legacy logic — and kept the migration moving.

### 4. Observability had to be rebuilt from scratch

Kubernetes’ UI couldn’t give users what they were used to — job statuses, logs, sandbox views.

Uber replicated `etcd` data into Apache Cassandra and built a custom Compute UI.
Think of it as Kubernetes, reimagined for data scientists.

### 5. Federation: The Secret Sauce

To prevent single-zone failures and optimize utilization, Uber created **Federator**, an in-house abstraction that:

* Routes jobs across clusters based on health, SLA, and capacity
* Enables high availability and smart resource usage
* Allows seamless failovers and better resilience

This was no ordinary migration. It was a strategic re-architecture.

Without Federation, a single availability zone hiccup could have taken out hundreds of sessions.

![Figure 2: Kubernetes clusters usage without and with federation](https://raw.githubusercontent.com/Wiryenkfea-Eric/k8s-blog-assets/master/Downloads/k8s-blog-assets/Kubernetes%20clusters%20usage%20without%20and%20with%20federation.webp)
*Figure 2: Kubernetes clusters usage without and with federation*

---

## 🔹 Real-World Lessons

Initially, they considered storing full environments on NFS, but the high IOPS cost quickly ruled that out. Instead, they checkpointed only the package installation list.

Uber also built a **restart API** that:

* Notifies users about the transition
* Saves package metadata
* Seamlessly resumes sessions on Kubernetes

All this, without disrupting workflows or requiring user intervention.

---

## 🔹 What did they achieve?

* Migrated thousands of long-lived, GPU-powered sessions
* Zero user disruption across 2,000+ data scientists
* Improved availability, observability, and fault tolerance
* Set the stage for cloud portability and future automation

---

## 🔹 Lessons for Every DevOps and Platform Team

* ✓ Abstract Kubernetes with care — not everything needs a CRD
* ✓ Automate package persistence — users will thank you
* ✓ UI and Observability matter — don’t make users dig for logs
* ✓ Federation = resilience — let your workloads flow intelligently
* ✓ Migrations = modernization opportunities — don’t just lift and shift

---

## 🔹 What this means going forward

Migrating interactive workloads is hard.
Doing it at Uber-scale — with zero downtime — is next-level.

But with the right architecture, user-first design, and a few brilliant hacks, Uber proved that even the most delicate workloads can be moved without a hiccup.

If you’re running:

* JupyterHub
* ML pipelines
* Kubernetes data platform

…then take a page out of Uber’s playbook.

---

## Further Reading

* [Uber Engineering Blog — Migrating Large-Scale Compute Workloads to Kubernetes](https://eng.uber.com/migrating-large-scale-compute-workloads-to-kubernetes/)

---

## About the Author

**Eric Nyuydze Wiryenkfea** – Cloud & DevOps Engineer (5 years plus of experience), Cloud Solutions Trainer, Community builder, Public speaker and technical writer.
Follow on [GitHub](https://github.com/Wiryenkfea-Eric) for more real-world infrastructure breakdowns.

```