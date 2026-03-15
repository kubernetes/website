---
title: Managing Workloads
content_type: concept
reviewers:
- janetkuo
weight: 40
---

<!-- overview -->

Workload management in Kubernetes covers how you organize, deploy, update,
scale, and maintain your applications. After you deploy an application and
expose it through a Service, you need strategies for keeping it running
reliably: updating to new versions without disrupting users, scaling to
meet changing demand, and recovering from failures. This page explains
the key concepts and strategies behind these activities, and links to
task pages for step-by-step procedures.

<!-- body -->

## Organizing resource configurations

Most applications require multiple Kubernetes resources working together.
A typical web application might need a Deployment, a Service, a ConfigMap,
and a PersistentVolumeClaim. Organizing these resources effectively makes
your applications easier to deploy, update, and troubleshoot.

Kubernetes supports several approaches to resource organization:

- **Single-file grouping**: combine related resources in one YAML file,
  separated by `---`. Place the Service before the Deployment so that the
  scheduler can spread Pods across nodes as they are created.
- **Directory-based organization**: group all manifests for an application
  in the same directory, organized by microservice or application tier.
- **URL-based configuration**: deploy directly from manifests hosted in
  source control systems.

For details on `kubectl` commands that support these approaches, see
[Command line tool (kubectl)](/docs/reference/kubectl/).

### External tools

Several tools extend Kubernetes manifest management beyond what `kubectl`
provides natively.

#### Helm {#external-tool-helm}

{{% thirdparty-content single="true" %}}

[Helm](https://helm.sh/) is a tool for managing packages of pre-configured
Kubernetes resources. These packages are known as _Helm charts_.

#### Kustomize {#external-tool-kustomize}

[Kustomize](https://kustomize.io/) traverses a Kubernetes manifest to add,
remove, or update configuration options. It is available both as a standalone
binary and as a
[native feature](/docs/tasks/manage-kubernetes-objects/kustomization/) of
`kubectl`.

## Update strategies

When you release a new version of your application, how Kubernetes transitions
from the old version to the new one determines whether users experience
downtime and how much risk the update carries. Kubernetes supports several
update strategies, each suited to different scenarios.

### Rolling updates

A rolling update gradually replaces old Pods with new ones. At any point
during the update, a mix of old and new Pods serves traffic, so the
application remains available throughout. This is the default strategy for
Deployments.

Two parameters control the pace of a rolling update:

- **`maxUnavailable`**: the maximum number of Pods that can be unavailable
  during the update (default: 25%).
- **`maxSurge`**: the maximum number of extra Pods that can exist above the
  desired count during the update (default: 25%).

Rolling updates also support pausing and resuming, which allows you to
inspect a partial update or batch multiple changes into a single rollout.
If a new version introduces problems, you can roll back to a previous
revision.

For step-by-step instructions, see
[Update a Deployment Without Downtime](/docs/tasks/run-application/update-deployment-rolling/).
For configuration details, see the
[Deployment](/docs/concepts/workloads/controllers/deployment/#strategy)
concept page.

### Recreate

The Recreate strategy terminates all existing Pods before creating new ones.
This causes a brief period of downtime but ensures that only one version of
the application runs at a time.

Use the Recreate strategy when:

- Your application cannot tolerate running two versions simultaneously
  (for example, due to database schema incompatibilities).
- You need a clean switchover with no overlap between old and new Pods.

For details, see the
[Deployment strategy](/docs/concepts/workloads/controllers/deployment/#strategy)
documentation.

### Canary deployments

A canary deployment runs a new version of your application alongside the
existing stable version, routing only a small fraction of traffic to the new
version. This allows you to monitor the new version under real production
conditions before committing to a full rollout.

The canary pattern in Kubernetes uses labels to differentiate between stable
and canary Pods. Both Deployments share a common label (for example,
`app: my-app`) that allows a single Service to route traffic to both sets
of Pods. A `track` label (`stable` or `canary`) distinguishes the two
releases. By adjusting the replica counts, you control the traffic ratio
between stable and canary Pods.

For a hands-on walkthrough, see
[Deploy a Release Using a Canary Deployment](/docs/tutorials/stateless-application/canary-deployment/).

### Comparing update strategies

| Strategy | Downtime | Risk level | Best for |
|----------|----------|------------|----------|
| Rolling update | None | Low — gradual rollout | Most workloads |
| Recreate | Yes | Low — clean switchover | Incompatible versions |
| Canary | None | Lowest — small traffic percentage | High-risk changes requiring production validation |

## Scaling workloads

Scaling adjusts the number of Pod replicas running your application to match
demand. Kubernetes supports two approaches:

- **Manual scaling**: you set the replica count directly. This works well for
  predictable, scheduled, or one-off capacity changes where you know the
  required number of replicas in advance.
- **Automatic scaling**: a HorizontalPodAutoscaler (HPA) monitors metrics
  such as CPU utilization, memory usage, or custom metrics, and adjusts the
  replica count automatically. This suits workloads with variable or
  unpredictable demand.

{{< caution >}}
If a HorizontalPodAutoscaler manages a Deployment, do not set replicas
manually. The HPA continuously reconciles the replica count and overrides
any manual changes.
{{< /caution >}}

For step-by-step instructions on manual scaling, see
[Scale a Deployment Manually](/docs/tasks/run-application/scale-deployment/).
For automatic scaling, see the
[HorizontalPodAutoscaler walkthrough](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/).

## Updating resources in place

After deploying resources, you often need to make changes without replacing
the entire object. Kubernetes provides several approaches for in-place
updates, each suited to different workflows:

- **Declarative management** (`kubectl apply`): compares your configuration
  file against the live state and applies only the differences. This approach
  works well when you maintain configuration as code in source control. For
  details, see
  [server-side apply](/docs/reference/using-api/server-side-apply/).
- **Interactive editing** (`kubectl edit`): opens the live resource in a text
  editor, allowing you to make changes directly. Useful for one-off
  adjustments or exploration.
- **Patch operations** (`kubectl patch`): updates specific fields using JSON
  patch, JSON merge patch, or strategic merge patch. Best for scripted or
  automated changes. For details, see
  [Update API Objects in Place Using kubectl patch](/docs/tasks/manage-kubernetes-objects/update-api-object-kubectl-patch/).

## Disruptive updates

Some resource fields are immutable after creation (for example, a Pod's
container name or a Service's `clusterIP`). When you need to change an
immutable field, you must delete and recreate the resource. The
`kubectl replace --force` command performs this operation in a single step.

{{< caution >}}
Disruptive updates cause downtime because Kubernetes deletes the existing
resource before creating the replacement. Use this approach only when
in-place updates are not possible.
{{< /caution >}}

## Cluster administrator considerations

As a cluster administrator, you can set guardrails that influence how
application teams manage their workloads:

- [**ResourceQuotas**](/docs/concepts/policy/resource-quotas/): limit the
  total compute resources a namespace can consume, preventing any single team
  from overusing cluster capacity.
- [**PodDisruptionBudgets**](/docs/concepts/workloads/pods/disruptions/):
  ensure a minimum number of Pods remain available during voluntary
  disruptions such as node maintenance or Deployment rollouts. See also
  [Specifying a PodDisruptionBudget](/docs/tasks/run-application/configure-pdb/).
- [**Topology spread constraints**](/docs/concepts/scheduling-eviction/topology-spread-constraints/):
  encourage or require Pods to spread across failure domains (zones, nodes)
  for higher availability.
- [**Taints and tolerations**](/docs/concepts/scheduling-eviction/taint-and-toleration/):
  control which Pods can schedule onto specific nodes, useful for dedicating
  hardware or isolating workloads.

## {{% heading "whatsnext" %}}

- [Scale a Deployment Manually](/docs/tasks/run-application/scale-deployment/)
- [Update a Deployment Without Downtime](/docs/tasks/run-application/update-deployment-rolling/)
- [Deploy a Release Using a Canary Deployment](/docs/tutorials/stateless-application/canary-deployment/)
- [Horizontal Pod Autoscaling](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/)
- [Deployments](/docs/concepts/workloads/controllers/deployment/)
- [Application introspection and debugging](/docs/tasks/debug/debug-application/debug-running-pod/)
