---
layout: blog
title: "Tuning Linux Swap for Kubernetes: A Deep Dive"
date: 2025-07-xx
draft: true
slug: tuning-linux-swap-for-kubernetes-a-deep-dive
author: >
  Ajay Sundar Karuppasamy (Google),
---

**Proposed Content Outline:**

1.  **Critical Linux Kernel Parameters for Swap:** Explain `min_free_kbytes`, `watermark_scale_factor`, `swappiness`, `vfs_cache_pressure`, etc.
2.  **Test Setup:** Details of the stress tests performed, application used, infrastructure, and methodology.
3.  **Impact & Results:** Showcase the performance differences and swap utilization results with varying parameter values (including graphs).
4.  **Risks of Swap Tuning in Kubernetes:** Discuss interactions with Kubernetes Eviction and OOM Killer.
5.  **Optimal Findings:** Share recommended configurations and best practices.

**HackMD Draft Link:** https://hackmd.io/@ajaysundark/rJEhBDRExl
