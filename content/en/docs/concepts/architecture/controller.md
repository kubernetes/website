---
title: Controllers
content_template: templates/concept
weight: 30
---

{{% capture overview %}}

In applications of robotics and automation, a _control loop_ is
a non-terminating loop that regulates the state of the system.

In Kubernetes, a _controller_ is a control loop that watches the shared state
of the cluster through the API server and makes changes attempting to
move the current state towards the desired state.

{{% /capture %}}


{{% capture body %}}

You can run a controller as a set of Pods, as part of the
{{< glossary_tooltip text="control plane" term_id="control-plane" >}},
or externally to Kubernetes.

Most [built-in controllers](/docs/reference/controllers/built-in/) run inside
the {{< glossary_tooltip term_id="kube-controller-manager" >}},

## Controller pattern

Once running, a controller tracks at least one Kubernetes resource type (such as Pods).
When the controller identifies a change, it takes some configured action (such as setting
an annotation on the new Pod).

Well-implemented controllers wait for changes using a subscription at the API server;
see [efficient detection of changes](/docs/reference/using-api/api-concepts/#efficient-detection-of-changes)
for details.

Although it's common for a controller to work with a single type of resource,
Kubernetes controllers can and often do track multiple resource types.
For example, a controller that creates Pods to run Jobs will need to track Job
resources (to discover new work) and Pod resources (to see when the work is finished).

{{% /capture %}}
