---
layout: blog
title: "See Why Your Kueue Workload Is Waiting, with Headlamp"
draft: true
slug: kueue-headlamp-why-is-my-workload-waiting
author: >
  [Aarush Singh](https://github.com/xonas1101) (LFX Mentorship 2026 Term 3)
---

In October, [Why Is My Kubernetes Job Still Pending? Tracing Kueue Admission with Headlamp](/blog/2026/10/14/tracing-kueue-admission-with-headlamp/) walked through a pending Job with the first alpha of the [Kueue plugin for Headlamp](https://github.com/headlamp-k8s/plugins/tree/main/kueue).
If you have not read it, start there: it explains how Kueue admission differs from Pod scheduling, and how Workloads, LocalQueues, ClusterQueues, ResourceFlavors and Cohorts fit together.

That walkthrough also showed how much reading the answer took.
You found the `QuotaReserved` condition message, added up the PodSet requests, opened the ClusterQueue, and compared the numbers by eye.

Kueue already records everything needed to answer "why is this waiting?": conditions on the Workload, its resource requests, the quota each ClusterQueue has reserved, the pending order in its visibility API, and Prometheus metrics.
The latest work on the plugin is about seeing that data.
It does not add a new status of its own.
It reads what Kueue reports and puts it on the pages you already open.

Kueue has always known why your Workload is waiting.
Now you can see it.

## See why a Workload is not admitted

Kueue records why a Workload is held back across several places: the `QuotaReserved`, `Admitted` and `Evicted` conditions, the state of each admission check, and the requeue state.
The first alpha collapsed all of that into one status word.

The Workload detail page now has a **Why is this Workload not admitted?** section.
It names the stage the Workload is stuck at, explains what that stage means, and shows Kueue's own message next to it:

- **Not evaluated**: Kueue has not tried to reserve quota yet. The Workload is queued behind others.
- **Waiting for quota**: Kueue has not reserved quota. This is not always a shortage: a stopped queue or missing configuration also lands here.
- **Admission checks**: quota is reserved, but an AdmissionCheck has not passed. The blocking checks are listed and linked.
- **Topology assignment**: Kueue is still placing the Pods of a topology-aware request.
- **Evicted** or **Deactivated**: Kueue took the Workload out of the running. The section shows why, and when Kueue will retry.

While a Workload is waiting for quota, two more rows fill in the detail.

Kueue's message names only the first resource that does not fit, in one flavor.
The section now lists every resource the Workload requests, summed over its PodSets, next to the free quota each ResourceFlavor of the ClusterQueue has left, and how much the request is short by.
This is the comparison the October post did by hand.

The **Queue position** row reads Kueue's [visibility API](https://kueue.sigs.k8s.io/docs/tasks/manage/monitor_pending_workloads/pending_workloads_on_demand/), for example `2 in its LocalQueue, 2 in its ClusterQueue`.
If the API is not served, or you cannot read it, the row is left out and the rest of the page still loads.

{{< figure src="workload-why-not-admitted.png" alt="The Why is this Workload not admitted? section on a Workload that asks for 64 CPUs from a ClusterQueue with 1 CPU, showing the Waiting for quota stage, Kueue's message, the requests against free quota table and the queue position" >}}

## See how far a Workload got

The conditions also carry timestamps.
A **Lifecycle** section draws them as steps: Created, Quota reserved, Admitted, Pods ready and Finished.
Each step it reached shows when it happened and how long after the previous one.
The step it is waiting on shows how long it has waited and the reason.
Failures, evictions and steps it never reached are marked.

An admitted Workload whose Pods failed now shows **Waiting for replacement pods**, from Kueue's `WaitingForReplacementPods` condition, instead of looking healthy.

{{< figure src="workload-lifecycle.png" alt="The Lifecycle section on a Workload detail page: Created is reached, and the Workload has waited 5 days at Quota reserved with reason Pending" >}}

## See Kueue status from your Job

Most people do not open a Kueue page first.
They open their Job.

Headlamp's own **Workloads → Jobs** list now has **Queue** and **Kueue Status** columns, and the Job detail page has a **Kueue** section with its LocalQueue, its Workload, and the same "why" section.
Any resource with the `kueue.x-k8s.io/queue-name` label gets this section, so a pending JobSet, RayJob, LeaderWorkerSet or plain Pod shows it too.
Owner references on the Workload page are now links back to the Job or Pod.

{{< figure src="job-kueue-section.png" alt="The Kueue section on a Job detail page, with the Job's LocalQueue, Workload and status, followed by the Why is this Workload not admitted? section" >}}

## See what a queue is holding back

The queue pages now show who is waiting and why:

- The Workloads list, and the Related Workloads tables on LocalQueue and ClusterQueue pages, have a **Blocked On** column with the stage, and a **Why** column with Kueue's message.
- The ClusterQueue page lists **Pending Workloads in Admission Order**, the order Kueue will try them in.
- When a ClusterQueue is inactive, a **Why is this ClusterQueue inactive?** section shows the reason, such as a missing ResourceFlavor or an AdmissionCheck that is not active.
- ResourceFlavor and AdmissionCheck pages link back to the ClusterQueues that use them.
- A **Kueue → Overview** page lists every blocked Workload, sorted by stage, and every ClusterQueue with its pending and admitted counts.

{{< figure src="localqueue-related-workloads.png" alt="Related Workloads on a LocalQueue page, with Blocked On showing Not evaluated and Waiting for quota, and Why showing the explanation or Kueue's message" >}}

## See the admission path on the Map

Kueue resources are now a source in Headlamp's Map.
A Job connects to its Workload, the Workload to its LocalQueue, the LocalQueue to its ClusterQueue, and the ClusterQueue to its Cohort and ResourceFlavors.
Each Kueue kind can be turned on and off on its own.

Hovering a node shows a glance: a Workload's status, blocking stage and LocalQueue, or a queue's active state and pending and admitted counts.
Clicking a node opens its Kueue page in the Map's side panel.

{{< figure src="map-kueue-glance.png" alt="Headlamp Map showing Jobs connected to their Workloads, LocalQueues, ClusterQueues and a ResourceFlavor, with a glance tooltip on a Workload blocked on Waiting for quota" >}}

## See how a queue behaves over time

Everything above shows the state right now.
To see whether a queue has been backed up all day, the [Prometheus plugin](https://github.com/headlamp-k8s/plugins/tree/main/prometheus) adds charts to ClusterQueue pages from Kueue's own [metrics](https://kueue.sigs.k8s.io/docs/reference/metrics/):

- pending (active and inadmissible) and admitted Workloads,
- quota usage per flavor and resource, as a percentage of nominal quota,
- p50 and p95 admission wait time.

The quota usage chart needs Kueue's `metrics.enableClusterQueueResources` setting turned on.

{{< figure src="clusterqueue-prometheus-charts.png" alt="Prometheus Workloads chart on a ClusterQueue page, with tabs for Workloads, Quota usage and Admission wait, showing pending and admitted Workloads over time" >}}

## See more of Kueue

- AdmissionCheck, MultiKueueConfig and ProvisioningRequestConfig have list and detail pages.
- On a cluster without Kueue, the plugin explains that Kueue is not installed instead of showing an error.
- Detail pages check access only in their own namespace, so namespace-scoped users can use them. The README lists the [permissions](https://github.com/headlamp-k8s/plugins/tree/main/kueue#permissions) each page needs, with a read-only ClusterRole.
- `test-files/scenarios/` sets up a Workload in each blocking stage, so you can see every case on a local cluster.

## The checklist, updated

The October post ended with a nine-step checklist.
With the plugin showing the answer, it is shorter:

1. Open the Job. Its **Kueue** section shows the queue and Workload status.
1. If it is not admitted, read **Why is this Workload not admitted?**: the stage, Kueue's message, the requests against free quota and the queue position.
1. Follow the links to the queue, AdmissionCheck or ResourceFlavor it points at.
1. If it is admitted but the Pods are still `Pending`, it is a scheduling question. Move to the Pod events, as before.

## Try it

Install **Kueue** from the Plugin Catalog in Headlamp Desktop (version X.Y.Z or later), and the **Prometheus** plugin for the charts.
To try it on a local cluster, apply the [scenarios](https://github.com/headlamp-k8s/plugins/tree/main/kueue/test-files/scenarios).

If a Workload is still hard to explain after this, open an issue in the [Headlamp plugins repository](https://github.com/headlamp-k8s/plugins/issues).

## Developed during LFX Mentorship

This work was done during the [CNCF LFX Mentorship](https://mentorship.lfx.linuxfoundation.org/) 2026 Term 3, building on the plugin Utkarsh Raj wrote in Term 2.
Thanks to my mentors Kevin Hannon ([@kannon92](https://github.com/kannon92)), Heba Elayoty ([@helayoty](https://github.com/helayoty)) and René Dudfield ([@illume](https://github.com/illume)) for their reviews and guidance, and to the Headlamp and Kueue communities for their feedback.
