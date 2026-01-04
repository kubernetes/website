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

## Motivation and Use Cases

There are a few high-level scenarios that are discussed in the working group:

- Optimizing resource utilization for interactive workloads (e.g., Jupyter Notebooks, AI chatbots)
- Accelerating startup of applications with long initialization times (e.g., Java applications, LLM inference serving)
- Periodic checkpointing as a fault-tolerance mechanism for long-running workloads (e.g., machine learning training)
- Interruption-aware scheduling with transparent checkpointing and restore to enable preempting lower-priority Pods while preserving the runtime state of applications
- Pod migration across nodes to enable maintenance and load balancing without disrupting running workloads
- Forensic container checkpointing for investigating and analyzing security incidents, such as cyberattacks, data breaches, or unauthorized access

In all these cases, the intent is to help facilitate discussions of ideas between the growing Kubernetes and CRIU communities. The CRIU community itself includes a number of projects broadly aimed at assisting with these use cases including:

- [CRIU](https://github.com/checkpoint-restore/criu) - A tool for checkpointing and restoring running applications and containers
- [checkpointctl](https://github.com/checkpoint-restore/checkpointctl) - A tool for in-depth analysis of container checkpoints
- [criu-coordinator](https://github.com/checkpoint-restore/criu-coordinator) - A tool for coordinated checkpoint/restore of distributed applications with CRIU
- [checkpoint-restore-operator](https://github.com/checkpoint-restore/checkpoint-restore-operator) - A Kubernetes operator for managing checkpoints

More information about the checkpoint/restore integration with Kubernetes is also available [here](https://criu.org/Kubernetes).

## Related Events

We are excited to welcome you to our [panel discussion](https://sched.co/2CW6P) and [AI + ML session](https://sched.co/2CW7Z) at KubeCon + CloudNativeCon Europe 2026.

## Connect With Us

If you are interested in contributing to Kubernetes or CRIU, there are several ways to participate:

- Join our meeting every second Thursday at 17:00 UTC via the Zoom link in our [meeting notes](https://docs.google.com/document/d/1ZMtHBibXfTw4cQerM4O4DJonzVs3W7Hp2K5ml6pTufs/edit); recordings of our prior meetings are available [here](https://www.youtube.com/playlist?list=PL69nYSiGNLP1P7F40IMVL3NsNiIm5AGos).
- Chat with us on the [Kubernetes Slack](http://slack.k8s.io/): [#wg-checkpoint-restore](https://kubernetes.slack.com/messages/wg-checkpoint-restore)
- Email us at the [wg-checkpoint-restore mailing list](https://groups.google.com/a/kubernetes.io/g/wg-checkpoint-restore)
