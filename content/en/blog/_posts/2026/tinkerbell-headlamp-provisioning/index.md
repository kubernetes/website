---
layout: blog
title: "Follow bare metal provisioning in Headlamp with Tinkerbell"
draft: true
slug: tinkerbell-headlamp-provisioning
author: >
  [Ayushmaan Sharma](https://github.com/ayushmaan-16) (LFX Mentorship 2026 Term 2)
---

Before a physical server can run applications, it needs an operating system and the right disk and
network configuration. [Tinkerbell](https://tinkerbell.org/) automates this bare metal provisioning
process. In a Kubernetes-based setup, operators describe machines and provisioning instructions
through custom resources.

The [Tinkerbell plugin for Headlamp](https://github.com/headlamp-k8s/plugins/tree/main/tinkerbell)
brings this information into the Kubernetes UI, with resource views, maps, and metrics. It helps
answer practical questions: which machine is being provisioned, what should run on it, and where
does an operation need attention? I built the plugin through my LFX Mentorship with the
[Headlamp](https://headlamp.dev/) project.

## Watch a machine get provisioned in Headlamp

This demo follows an Ubuntu provisioning workflow in the Tinkerbell Vagrant lab. The target is a
VirtualBox VM, and the provisioning actions really execute on it. Headlamp shows the resource data
and execution updates reported to Kubernetes.

Following an Ubuntu provisioning run from Running to Success in Headlamp:

<video controls preload="metadata" style="width: 100%;" aria-label="Ubuntu provisioning workflow progressing from Running to Success in Headlamp">
  <source src="provisioning-demo.mp4" type="video/mp4">
  Your browser does not support embedded video. You can
  <a href="provisioning-demo.mp4">download the provisioning demo</a> instead.
</video>

## Connect provisioning, automation, and machine management

Custom Resource Definitions (CRDs) add resource types to the Kubernetes API. The plugin brings seven
Tinkerbell resource types into familiar Headlamp list and detail views:

| Resource | Description |
| --- | --- |
| Hardware | The machine and its provisioning configuration. |
| Template | The recipe of tasks and actions. |
| Workflow | A provisioning run connecting hardware to a template. |
| WorkflowRuleSet | Rules that automate workflow creation for matching hardware. |
| BMC Machine | A machine managed through its Baseboard Management Controller. |
| BMC Job | A group of requested management operations for a machine. |
| BMC Task | An individual management operation and its execution status. |

## Check the machine before inspecting the workflow

Hardware details show machine identity, interfaces, boot settings, and provisioning disks. Operators
can check that a run targets the expected machine and storage device. When the agent reports them,
observed CPU, memory, network, and block-device attributes add information about the detected
hardware. These are inventory attributes, not live utilisation measurements.

{{< figure src="hardware.png" alt="Hardware machine1 details showing its agent ID, hostname, IP and MAC addresses, CPU cores, and memory." >}}

## Read the provisioning recipe as tasks and actions

A Template can describe actions such as writing an operating system image, growing a partition, and
updating configuration files. Its detail view presents tasks and actions with available container
image and timeout information. Raw Template Data provides the underlying recipe and variables; it is
not the complete Kubernetes object YAML. Execution results belong to the Workflow, not the Template.

{{< figure src="template.png" alt="Ubuntu template details showing one task and eight actions, with the task's worker and volumes." >}}

## Follow progress and inspect failed actions

Workflow views show provisioning state, hardware and template references, and task and action
progress. During execution, the current task and action identify what is running. Available timings
and messages help explain the result, while the Failed Action Summary brings reported failures
together.

Template Rendering shows whether Tinkerbell could prepare the recipe using the workflow inputs;
successful rendering does not mean provisioning is complete. Controller-reported conditions provide
additional context when present. These views help focus an investigation without replacing
controller or agent logs.

{{< figure src="workflow.png" alt="The playground workflow showing Success, its hardware and template, and execution settings." >}}

## See which rules create provisioning workflows

WorkflowRuleSets automate workflow creation when hardware matches configured rules. Their views show
the rules and the referenced template, helping operators understand the intended automation without
reading the full object YAML. A rule definition describes matching behaviour; it is not proof that a
particular workflow has already run.

{{< figure src="workflowruleset.png" alt="WorkflowRuleSet machine1-auto-provision showing its ubuntu template reference and matching rules." >}}

## Check machine power through the BMC view

A Baseboard Management Controller provides out-of-band management, independently of the installed
operating system. The BMC Machine view shows the reported power state and available conditions, such
as whether the controller is contactable. This helps distinguish a provisioning problem from a
machine-management connection problem.

{{< figure src="bmc-machine.png" alt="BMC Machine machine1-bmc showing an unknown power state and reported conditions." >}}

## Inspect grouped management operations in BMC Jobs

A BMC Job targets a machine and groups requested operations. Its detail view shows the machine
reference, requested tasks, and available timing and condition information. Unlike a provisioning
Template, a Job represents work to execute, so its execution status is meaningful.

{{< figure src="bmc-job.png" alt="BMC Job machine1-provisioning-preflight showing its machine reference, three tasks, and timestamps." >}}

## Find the result of an individual BMC Task

A BMC Task represents an operation such as changing power state or boot settings. Its view exposes
the operation, task data, and available execution timings and conditions. This makes it easier to
inspect one operation when a wider management sequence does not complete as expected.

{{< figure src="bmc-task.png" alt="BMC Task machine1-power-cycle showing the powerAction operation, cycle task data, and timestamps." >}}

## Trace resource relationships in the map

Map integration places related resources in a connected view. A Workflow links to its Hardware and
Template; hardware can reference a BMC Machine, with Jobs and owned Tasks showing the management
chain. WorkflowRuleSets also connect to their referenced templates. Shared templates can connect
multiple provisioning runs without implying that one machine owns the template.

Connections follow resource references and ownership data. Resources without a supported reference
can remain separate, rather than gaining a guessed connection.

{{< figure src="resource-map.png" alt="Headlamp Map linking two hardware resources and their workflows to a shared ubuntu template, alongside WorkflowRuleSet and BMC resources." >}}

## Use metrics to add context over time

Metrics integration complements resource status with measurements over time. With a configured
metrics source, operators can inspect trends alongside the current resource state. The distinction
matters: a Workflow reports what happened in a particular run, while a chart describes the scope and
time range of its underlying measurement.

{{< figure src="controller-metrics.png" alt="Workflow Controller Health chart showing reconciliation and error rates over a ten-minute interval." >}}

## Bring lab testing and real-server feedback together

I tested Hardware, Template, and Workflow views using Tinkerbell v0.23.0 in the Vagrant and
VirtualBox lab. The stack VM hosted Kubernetes and Tinkerbell; a target VM booted the provisioning
environment and installed Ubuntu. Headlamp reads the resources from the management cluster, without
requiring the target to already be a Kubernetes node.

Tinkerbell users and maintainers also tested WorkflowRuleSet and BMC views on real servers. Their
feedback included "This Is Super Cool". Together, the lab runs and real-server testing helped check
the plugin against practical provisioning and machine-management use cases.

## Try the plugin with your Tinkerbell cluster

1. Install [Headlamp Desktop](https://headlamp.dev/docs/latest/installation/desktop/) and connect to a Kubernetes cluster running Tinkerbell.

2. Open the Headlamp Plugin Catalog, search for Tinkerbell, and install the plugin.

3. Select your cluster and open Tinkerbell in the sidebar. Your Kubernetes identity needs permission to access the relevant resources.

The plugin does not install Tinkerbell or provision machines on its own. Use the [plugin
README](https://github.com/headlamp-k8s/plugins/tree/main/tinkerbell) for setup details and the
[Tinkerbell documentation](https://tinkerbell.org/docs/) for the provisioning environment.
