---
title: "Announcing the Checkpoint/Restore Working Group"
date: 2026-XX-XX
draft: true
slug: introducing-checkpoint-restore-wg
author: >
  [Radostin Stoyanov](https://github.com/rst0git),
  [Viktória Spišaková](https://github.com/viktoriaas),
  [Adrian Reber](https://github.com/adrianreber),
  [Peter Hunt](https://github.com/haircommander)
---

The community around Kubernetes includes a number of Special Interest Groups (SIGs) and Working Groups (WGs) facilitating discussions on important topics between interested contributors. Today we would like to announce the new [Kubernetes Checkpoint Restore WG](https://github.com/kubernetes/community/tree/master/wg-checkpoint-restore) focusing on the integration of Checkpoint/Restore functionality into Kubernetes.

## Motivation and use cases

There are several high-level scenarios discussed in the working group:

- Optimizing resource utilization for interactive workloads, such as Jupyter notebooks and AI chatbots
- Accelerating startup of applications with long initialization times, including Java applications and [LLM inference services](https://doi.org/10.1145/3731599.3767354)
- Using periodic checkpointing to enable fault-tolerance for long-running workloads, such as distributed model training
- Providing [interruption-aware scheduling](https://doi.org/10.1007/978-3-032-10507-3_3) with transparent checkpoint/restore, allowing lower-priority Pods to be preempted while preserving the runtime state of applications
- Facilitating Pod migration across nodes for load balancing and maintenance, without disrupting workloads.
- Enabling forensic checkpointing to investigate and analyze security incidents such as cyberattacks, data breaches, and unauthorized access.

Across these scenarios, the goal is to help facilitate discussions of ideas between the Kubernetes community and the growing Checkpoint/Restore in Userspace (CRIU) ecosystem. The CRIU community includes several projects that support these use cases, including:

- [CRIU](https://github.com/checkpoint-restore/criu) - A tool for checkpointing and restoring running applications and containers
- [checkpointctl](https://github.com/checkpoint-restore/checkpointctl) - A tool for in-depth analysis of container checkpoints
- [criu-coordinator](https://github.com/checkpoint-restore/criu-coordinator) - A tool for coordinated checkpoint/restore of distributed applications with CRIU
- [checkpoint-restore-operator](https://github.com/checkpoint-restore/checkpoint-restore-operator) - A Kubernetes operator for managing checkpoints

More information about the checkpoint/restore integration with Kubernetes is also available [here](https://criu.org/Kubernetes).

## Related events

Following our presentation about [transparent checkpointing](https://sched.co/1tx7i) at KubeCon EU 2025, we are excited to welcome you to our [panel discussion](https://sched.co/2CW6P) and [AI + ML session](https://sched.co/2CW7Z) at KubeCon + CloudNativeCon Europe 2026.

## Connect with us

If you are interested in contributing to Kubernetes or CRIU, there are several ways to participate:

- Join our meeting every second Thursday at 17:00 UTC via the Zoom link in our [meeting notes](https://docs.google.com/document/d/1ZMtHBibXfTw4cQerM4O4DJonzVs3W7Hp2K5ml6pTufs/edit); recordings of our prior meetings are available [here](https://www.youtube.com/playlist?list=PL69nYSiGNLP1P7F40IMVL3NsNiIm5AGos).
- Chat with us on the [Kubernetes Slack](http://slack.k8s.io/): [#wg-checkpoint-restore](https://kubernetes.slack.com/messages/wg-checkpoint-restore)
- Email us at the [wg-checkpoint-restore mailing list](https://groups.google.com/a/kubernetes.io/g/wg-checkpoint-restore)
