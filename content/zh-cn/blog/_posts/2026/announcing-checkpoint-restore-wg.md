---
title: "宣布成立 Checkpoint/Restore 工作组"
date: 2026-01-21T10:00:00-08:00
canonicalUrl: https://www.kubernetes.dev/blog/2026/01/21/introducing-checkpoint-restore-wg/
slug: introducing-checkpoint-restore-wg
author: >
  [Radostin Stoyanov](https://github.com/rst0git),
  [Viktória Spišaková](https://github.com/viktoriaas),
  [Adrian Reber](https://github.com/adrianreber),
  [Peter Hunt](https://github.com/haircommander)
translator: >
  [Xin Li](https://github.com/my-git9)
---
<!--
title: "Announcing the Checkpoint/Restore Working Group"
date: 2026-01-21T10:00:00-08:00
canonicalUrl: https://www.kubernetes.dev/blog/2026/01/21/introducing-checkpoint-restore-wg/
slug: introducing-checkpoint-restore-wg
author: >
  [Radostin Stoyanov](https://github.com/rst0git),
  [Viktória Spišaková](https://github.com/viktoriaas),
  [Adrian Reber](https://github.com/adrianreber),
  [Peter Hunt](https://github.com/haircommander)
-->

<!--
The community around Kubernetes includes a number of Special Interest Groups (SIGs) and Working Groups (WGs) facilitating discussions on important topics between interested contributors. Today we would like to announce the new [Kubernetes Checkpoint Restore WG](https://github.com/kubernetes/community/tree/master/wg-checkpoint-restore) focusing on the integration of Checkpoint/Restore functionality into Kubernetes.
-->
Kubernetes 社区包含多个特别兴趣小组（SIG）和工作组（WG），
旨在促进感兴趣的贡献者之间就重要议题展开讨论。
今天，我们宣布成立新的
[Kubernetes Checkpoint Restore WG](https://github.com/kubernetes/community/tree/master/wg-checkpoint-restore)，
专注于将 Checkpoint/Restore 功能集成到 Kubernetes 中。

<!--
## Motivation and use cases

There are several high-level scenarios discussed in the working group:
-->
## 动机和应用场景

工作组讨论了以下几个高层次的应用场景：

<!--
- Optimizing resource utilization for interactive workloads, such as Jupyter notebooks and AI chatbots
- Accelerating startup of applications with long initialization times, including Java applications and [LLM inference services](https://doi.org/10.1145/3731599.3767354)
- Using periodic checkpointing to enable fault-tolerance for long-running workloads, such as distributed model training
- Providing [interruption-aware scheduling](https://doi.org/10.1007/978-3-032-10507-3_3) with transparent checkpoint/restore, allowing lower-priority Pods to be preempted while preserving the runtime state of applications
- Facilitating Pod migration across nodes for load balancing and maintenance, without disrupting workloads.
- Enabling forensic checkpointing to investigate and analyze security incidents such as cyberattacks, data breaches, and unauthorized access.
-->
- 优化交互式工作负载（例如 Jupyter Notebook 和 AI 聊天机器人）的资源利用率
- 加速初始化时间较长的应用程序启动，包括 Java 应用程序和 [LLM 推理服务](https://doi.org/10.1145/3731599.3767354)
- 使用周期性 Checkpoint 机制，为长时间运行的工作负载（例如分布式模型训练）提供容错能力
- 提供具有透明 Checkpoint/Restore 功能的[中断感知调度](https://doi.org/10.1007/978-3-032-10507-3_3)，
  允许抢占低优先级 Pod，同时保持应用程序的运行时状态
- 促进 Pod 跨节点迁移，以实现负载均衡和维护，而不会中断工作负载
- 启用 Checkpoint 取证功能，用于调查和分析安全事件，例如网络攻击、数据泄露和未经授权的访问。

<!--
Across these scenarios, the goal is to help facilitate discussions of ideas between the Kubernetes community and the growing Checkpoint/Restore in Userspace (CRIU) ecosystem. The CRIU community includes several projects that support these use cases, including:
-->
在这些场景中，目标是促进 Kubernetes 社区与日益壮大的用户空间
Checkpoint/Restore（CRIU）生态系统之间的思想交流。CRIU 社区包含多个支持这些用例的项目，其中包括：

<!--
- [CRIU](https://github.com/checkpoint-restore/criu) - A tool for checkpointing and restoring running applications and containers
- [checkpointctl](https://github.com/checkpoint-restore/checkpointctl) - A tool for in-depth analysis of container checkpoints
- [criu-coordinator](https://github.com/checkpoint-restore/criu-coordinator) - A tool for coordinated checkpoint/restore of distributed applications with CRIU
- [checkpoint-restore-operator](https://github.com/checkpoint-restore/checkpoint-restore-operator) - A Kubernetes operator for managing checkpoints
-->
- [CRIU](https://github.com/checkpoint-restore/criu) - 用于对运行中的应用程序和容器进行 Checkpoint 维护和 Restore 的工具
- [checkpointctl](https://github.com/checkpoint-restore/checkpointctl) - 用于深入分析容器 Checkpoint 的工具
- [criu-coordinator](https://github.com/checkpoint-restore/criu-coordinator) - 用于与 CRIU 协同执行分布式应用程序 Checkpoint/Restore 的工具
- [checkpoint-restore-operator](https://github.com/checkpoint-restore/checkpoint-restore-operator) - 用于管理 Checkpoint 的 Kubernetes Operator

<!--
More information about the checkpoint/restore integration with Kubernetes is also available [here](https://criu.org/Kubernetes).
-->
有关 Kubernetes 的 Checkpoint/Restore 集成的更多信息，请参阅[此处](https://criu.org/Kubernetes)。

<!--
## Related events

Following our presentation about [transparent checkpointing](https://sched.co/1tx7i) at KubeCon EU 2025, we are excited to welcome you to our [panel discussion](https://sched.co/2CW6P) and [AI + ML session](https://sched.co/2CW7Z) at KubeCon + CloudNativeCon Europe 2026.
-->
## 相关活动

继我们在 KubeCon EU 2025 上就[透明 Checkpoint](https://sched.co/1tx7i)
发表演讲之后，我们非常高兴地邀请你参加我们在
KubeCon + CloudNativeCon Europe 2026
上的[小组讨论](https://sched.co/2CW6P)和[人工智能 + 机器学习专题研讨会](https://sched.co/2CW7Z)。


<!--
## Connect with us

If you are interested in contributing to Kubernetes or CRIU, there are several ways to participate:
-->
## 联系我们

如果你有兴趣为 Kubernetes 或 CRIU 做贡献，可以通过以下几种方式参与：

<!--
- Join our meeting every second Thursday at 17:00 UTC via the Zoom link in our [meeting notes](https://docs.google.com/document/d/1ZMtHBibXfTw4cQerM4O4DJonzVs3W7Hp2K5ml6pTufs/edit); recordings of our prior meetings are available [here](https://www.youtube.com/playlist?list=PL69nYSiGNLP1P7F40IMVL3NsNiIm5AGos).
- Chat with us on the [Kubernetes Slack](http://slack.k8s.io/): [#wg-checkpoint-restore](https://kubernetes.slack.com/messages/wg-checkpoint-restore)
- Email us at the [wg-checkpoint-restore mailing list](https://groups.google.com/a/kubernetes.io/g/wg-checkpoint-restore)
-->
- 请于每隔一周的周四 17:00 UTC 通过[会议记录](https://docs.google.com/document/d/1ZMtHBibXfTw4cQerM4O4DJonzVs3W7Hp2K5ml6pTufs/edit)中的
  Zoom 链接加入我们的会议；之前的会议录像可在[此处](https://www.youtube.com/playlist?list=PL69nYSiGNLP1P7F40IMVL3NsNiIm5AGos)观看。
- 在 [Kubernetes Slack](http://slack.k8s.io/)
  上与我们交流：[#wg-checkpoint-restore](https://kubernetes.slack.com/messages/wg-checkpoint-restore)
- 发送邮件至 [wg-checkpoint-restore 邮件列表](https://groups.google.com/a/kubernetes.io/g/wg-checkpoint-restore)
