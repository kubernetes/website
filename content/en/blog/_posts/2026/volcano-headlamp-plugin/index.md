---
layout: blog
title: "Inspecting Volcano Workloads Faster with Headlamp"
draft: true
slug: visual-context-volcano-headlamp-plugin
author: >
  [Mahmoud Magdy](https://github.com/mahmoudmagdy1-1) (independent)
---

[Volcano](https://volcano.sh/) is a cloud native batch scheduler for Kubernetes, built for high-performance computing, AI/ML, and other batch workloads.

[Headlamp](https://headlamp.dev/) is an extensible Kubernetes web UI. With its plugin system, Headlamp can surface APIs and workflows beyond the built-in Kubernetes resources. The Volcano plugin brings core Volcano resources into Headlamp so you can inspect workload state, queue behavior, and gang scheduling details in one place.

Kubernetes was originally designed around long-running services, where applications are expected to start and remain available over time. Batch, AI/ML, and HPC workloads often behave differently: jobs arrive dynamically, compete for limited resources, and may need multiple workers to start together before useful work can begin.

Volcano extends Kubernetes with concepts such as queues, priorities, quotas, and gang scheduling. Instead of treating every Pod independently, Volcano schedules workloads with awareness of the job as a whole and the resources it needs to make progress.

To make these workloads easier to operate and troubleshoot, the Volcano plugin brings that scheduling context directly into Headlamp.

Watch this short walkthrough to see the Volcano plugin in Headlamp:

{{< youtube id="Mqm1EyAa7TY" title="Volcano plugin for Headlamp walkthrough" >}}

## Visual context helps teams understand Volcano jobs, queues, and PodGroups faster

Working with Volcano often means moving across several related resources while trying to understand a batch workload. You might start with a Job, then look at the related PodGroup, inspect the Pods behind it, check the Queue, and finally return to the Job again. All of that is possible with CLI tools like `kubectl` and the Volcano CLI, but it can become fragmented very quickly.

The Volcano plugin for Headlamp makes that workflow easier by bringing the key resources together in a single UI. Instead of reconstructing relationships manually, you can move directly between Jobs, Queues, PodGroups, Pods, and events from the same interface.

Volcano introduces its own resources on top of core Kubernetes objects:

Job
: Describes a batch workload as a set of tasks and the Pods they create.

Queue
: Divides cluster capacity between teams or workloads using quotas and priorities.

PodGroup
: Ties a group of Pods together so the scheduler can treat them as a single unit for gang scheduling.

The plugin surfaces all three resource types directly in Headlamp, providing dedicated list and detail views for each of them under a Volcano section in the sidebar.

## Jobs: workload status, actions, and logs

The Job view is the center of the plugin experience. In the list view, you can quickly understand the basics of a workload, including its status, queue, running versus minimum-available values, task count, and age.

{{< figure src="volcano-jobs-list.png" alt="Volcano Jobs list in Headlamp" >}}

The detail view goes further by surfacing the information you usually need while debugging a Job: task details, Pod status, related Queue and PodGroup links, conditions, events, and more. Instead of forcing you to jump between several CLI commands, the plugin keeps that context together in a single page.

The Job page also adds supported lifecycle actions for appropriate states, including **Suspend** and **Resume**, so you can act on a Job directly from the UI.

Another useful addition is direct **Job logs** access. You can open logs for Pods created by a Volcano Job without leaving the Job detail page. The logs viewer supports both single-Pod and all-Pods views, along with container selection and common log controls such as line count, previous logs, timestamps, and follow.

{{< figure src="volcano-job-logs.png" alt="Volcano Job logs in Headlamp" >}}

## Queues: scheduling capacity and resource context

The Queue view provides much more than a small set of top-level fields. It helps you understand how resources are being allocated and constrained by surfacing capacity, allocated resources, deserved and guaranteed resources, reservation details, child queues, and more.

This makes the Queue page much more useful when trying to understand how resources are being shared and limited across queues.

{{< figure src="volcano-queue-detail.png" alt="Volcano Queue details in Headlamp" >}}

## PodGroups: gang scheduling state and blockers

PodGroups are central to understanding gang scheduling in Volcano, and the plugin makes that state easier to inspect. The PodGroup view highlights progress, conditions, minimum resource requirements, and more.

This also gives you a clearer picture of whether a workload is blocked because it has not yet met the scheduling conditions required to run as a group.

{{< figure src="volcano-podgroup-detail.png" alt="Volcano PodGroup details in Headlamp" >}}

## Map view: jobs, queues, PodGroups, and pods in one place

The map view shows how Volcano resources are connected. Instead of inspecting each resource separately, you can see how Jobs, PodGroups, Queues, and Pods relate to one another.

This is especially useful when a workload is pending or not progressing as expected. The map can show the Job, its related PodGroup, the Pods created for the workload, and the Queue context around it. Warning and error states also make it easier to spot resources that need attention.

{{< figure src="volcano-map-view.png" alt="Volcano resources in the Headlamp map view" >}}

## Why use this alongside CLI tools

The plugin is not trying to replace `kubectl` or the Volcano CLI. Those remain important for automation, scripting, and raw object inspection. What the plugin improves is the interactive troubleshooting experience: discovering related resources more quickly, understanding structured detail pages, and moving from scheduling state to runtime output without switching tools constantly.

## What’s next

This work brings the main Volcano workflow into Headlamp, including Jobs, Queues, PodGroups, and the map view. Possible future work includes Prometheus integration, richer scheduling insights, and more workflow-oriented visibility across Volcano workloads.

## Try it and share feedback

To try the plugin:

1. Install Headlamp.
2. Open the Plugin Catalog from the Headlamp UI.
3. Search for Volcano.
4. Install the Volcano plugin.
5. Connect Headlamp to a Kubernetes cluster where Volcano is already installed.

{{< figure src="volcano-plugin-catalog.png" alt="Volcano plugin in the Headlamp Plugin Catalog" >}}

If you have ideas, feature requests, or bug reports, open an issue in the [Headlamp plugins repository](https://github.com/headlamp-k8s/plugins). Feedback from real Volcano users will help shape what comes next.
