---
layout: blog
title: "See what your Kyverno policies are doing, with Headlamp"
draft: true
slug: kyverno-policy-visualization
author: >
  [Athang Kali](https://github.com/Athang69) (LFX Mentorship 2026 Term 3)
---

[Kyverno](https://kyverno.io/) is a CNCF graduated, Kubernetes-native policy engine that validates, mutates, and generates Kubernetes resources, used across thousands of clusters.

[Headlamp](https://headlamp.dev/) is an extensible Kubernetes web UI. With its plugin system, Headlamp can surface APIs and workflows beyond the built-in Kubernetes resources. The Kyverno plugin already gave you compliance metrics, policy list views, and reports, but it stayed entirely read-only. You could see that a policy failed, you couldn't easily see which resources it actually touched, why it matched them, or what to change.

These updates, available from the plugin's `main` branch, close that gap. The plugin now surfaces reported resources and policy match criteria, provides guidance for supported violations, covers Kyverno's newer CEL-based policy types, and reports on the health of the policy engine itself.

<!-- REVIEW NOTE: the walkthrough video is recorded and already embedded on the headlamp-website
side. k/website blog guidelines ask for the youtube shortcode here instead of a raw video file, so
this section is waiting on a real video ID once the recording is uploaded to Headlamp's official
YouTube channel:
{{< youtube id="REPLACE_WITH_VIDEO_ID" title="Kyverno plugin for Headlamp walkthrough" >}}
-->

## See every resource a policy affects, grouped by kind with the reason it matched

Kyverno already tracks the outcome of every policy evaluation in PolicyReport and ClusterPolicyReport objects. The plugin reads existing report data directly into a Policy Impact panel on legacy Policy and ClusterPolicy detail pages. Reports describe existing resources; blocked admission requests are not included.

The panel groups reported resources by kind, shows each resource's status, and provides kind-level summaries of the policy's match selectors, including `match.any`, `match.all`, direct resource selectors, and wildcard kind patterns. Overall pass, fail, and warning counts appear above the groups. It supports both cluster-scoped and namespaced legacy policies.

{{< figure src="policy-impact-panel-grouped-by-kind-with-match-reasons.png" alt="Policy Impact panel on a Kyverno policy detail page, grouping affected resources by kind with pass and fail counts" >}}

## See it on the Map

The same reported data also shows up as a native source in Headlamp's Map view for legacy Policy and ClusterPolicy objects. Each policy appears as its own node, connected to up to 50 reported resources, prioritized by worst result.

The node's details indicate when results are clipped; open the policy detail page to see the full reported resource list. CEL policy kinds are not included in this Map source yet.

A policy with a failing resource gets a red flag, one with only warnings gets an orange flag, so problems stand out at a glance without opening anything. Hovering over a policy node shows its enforcement mode, rule count, and pass ratio.

{{< figure src="map-view-policy-nodes-connected-to-resources.png" alt="Kyverno policy nodes in the Headlamp Map view, connected by edges to the resources they evaluated" >}}

{{< figure src="map-view-glance-tooltip-enforcement-and-pass-ratio.png" alt="Hover glance tooltip on a Kyverno policy node showing enforcement mode, rule count, and pass ratio" >}}

## Understand why a resource failed and explore possible fixes

Seeing that a resource failed is only half the story. A Violation Drill-Down dialog opens from a **Details** button on both the Violations table and the Policy Impact panel. When a legacy validation rule or CEL validation can be identified in a readable policy, it can show matching criteria and suggested guidance; error results, unsupported sources, and unavailable policies show the available report details instead.

The guidance is tailored to how the rule is actually written. A `pattern` rule displays the required pattern, an `anyPattern` rule points to the alternatives in the policy, and a `foreach` rule names its list expressions.

A conditional `deny` rule directs you to `validate.deny.conditions`, while an unconditional `deny` explains that every matched resource is rejected.

For CEL-based `ValidatingPolicy` violations, the dialog shows match constraints and, when it can identify the failed validation, its CEL expression.

{{< figure src="violation-drilldown-pattern-rule-fix-suggestion.png" alt="Violation Drill-Down dialog for a failed pattern rule, showing the match reason and the required field pattern" >}}

{{< figure src="violation-drilldown-cel-match-constraints-and-expression.png" alt="Violation Drill-Down dialog for a CEL ValidatingPolicy, showing the match constraints and the CEL expression that failed" >}}

## Browse Kyverno's newer CEL-based policy kinds, namespace-scoped now too

Kyverno's newer policy types, ValidatingPolicy, MutatingPolicy, GeneratingPolicy, DeletingPolicy, and ImageValidatingPolicy, use CEL expressions instead of the older rule format.

The plugin already had cluster-scoped list and detail views for all 5.

These updates add the namespace-scoped counterparts, so you can browse a policy scoped to a single namespace the same way you already browse the cluster-scoped ones. These namespaced views require Kyverno 1.17 or later and the corresponding Namespaced\*Policy CRDs to be installed in your cluster.

{{< figure src="namespaced-cel-policy-list-view.png" alt="Namespaced ValidatingPolicy list view in Headlamp, showing the Namespace column and real Ready status" >}}

## Know whether the policy engine itself is healthy

A policy can only do its job if the engine running it is healthy. The plugin's **Kyverno → Overview** page now has a Policy Engine Health section, showing the admission request rate, denied requests, circuit breaker trips, and admission review latency from Kyverno's Prometheus metrics, plus a count of currently unready policies derived from their Kubernetes status conditions.

This section is disabled by default. Enable **Policy Engine Health** under **Settings → Plugins → kyverno**, ensure a reachable Prometheus server is scraping Kyverno's controller metrics, and grant your Kubernetes identity read access to the policy resources used for readiness checks, including cleanup policies.

If Prometheus isn't available in your cluster, this section stays out of the way instead of showing a broken or crashed view.

{{< figure src="policy-engine-health-dashboard.png" alt="Policy Engine Health section on the Kyverno Overview page, showing admission rate, denials, circuit breaker trips, and latency" >}}

## Why use this alongside kubectl

The plugin isn't trying to replace `kubectl` or Kyverno's own CLI. Those remain the right tools for automation, scripting, and raw object inspection. What the plugin improves is the interactive side of working with policies: seeing which resources have results in existing policy reports, and troubleshooting a specific violation without reconstructing the rule and the resource state by hand from several separate commands.

## What's next

Planned follow-up work includes a per-rule _policy rule explainer_ directly on the policy detail page, Glance tooltips for PolicyReport and ClusterPolicyReport objects in the Map view, and an accessibility and multi-language pass across the plugin, currently in review.

## Try it and share feedback

The Map view integration and Violation Drill-Down covered above are merged to the plugin's `main` branch, but not yet in a published release. To try everything in this post today, build the plugin from source:

1. Install [Headlamp Desktop](https://headlamp.dev/docs/latest/installation/desktop/).
2. Clone the [Headlamp plugins repository](https://github.com/headlamp-k8s/plugins) and build the `kyverno` plugin from its `main` branch, following the [plugin's README](https://github.com/headlamp-k8s/plugins/tree/main/kyverno). Copy the contents of `kyverno/dist/` into the `kyverno` subdirectory of your Headlamp plugins directory (the README lists the Linux and macOS paths), then restart Headlamp.
3. Connect Headlamp to a Kubernetes cluster where Kyverno is already installed.

Once a release containing these features is published, you'll also be able to install it directly from the Plugin Catalog in Headlamp Desktop:

{{< figure src="kyverno-plugin-catalog.png" alt="Kyverno plugin in the Headlamp Plugin Catalog" >}}

If you have ideas, feature requests, or bug reports, open an issue in the [Headlamp plugins repository](https://github.com/headlamp-k8s/plugins).
