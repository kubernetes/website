---
title: Resource clean-up controllers
content_template: templates/concept
weight: 90
---

{{% capture overview %}}

This page lists the {{< glossary_tooltip text="controllers" term_id="controller" >}}
for resource cleanup and garbage collection, that come as part of Kubernetes itself.

{{% /capture %}}

{{% capture body %}}

### Time-to-live (TTL) controller {#controller-ttl}

The [Time-to-live controller](/docs/reference/controllers/ttl/) sets TTL
annotations on {{< glossary_tooltip text="Nodes" term_id="node" >}}
based on the size of your cluster, so that the
{{< glossary_tooltip text="kubelet" term_id="kubelet" >}} understands how long
it can cache responses from the
{{< glossary_tooltip text="API server" term_id="kube-apiserver" >}}.

### TTL-after-finished controller {#controller-ttl-after-finished}

The [TTL-after-finished controller](/docs/reference/controllers/ttl-after-finished/)
cleans up finished tasks.

### Garbage collector {#controller-garbagecollector}

For objects that are created automatically, the
[garbage collector](/docs/reference/controllers/garbage-collector/) makes sure
that resources are removed when all the objects that depend on them are removed.

### Pod garbage collector {#controller-pod-garbage-collector}

The [Pod garbage collector](/docs/reference/controllers/pod-garbage-collector/)
cleans up {{< glossary_tooltip text="Pods" term_id="pod" >}} that
are terminated.

### Certificate signing request (CSR) cleaner {#controller-csr-cleaner}

The [CSR cleaner](/docs/reference/controllers/certificate-cleaner/)
removes old certificate signing requests that haven't been approved and signed.

### Namespace lifecycle controller {#controller-namespace}

When you (or any Kubernetes API client) remove a
{{< glossary_tooltip term_id="namespace" >}},
the [namespace controller](/docs/reference/controllers/namespace/) makes sure
the Namespace is empty (contains no objects) before that Namespace is removed.

{{% /capture %}}
{{% capture whatsnext %}}
* Read about [owners and dependents](/docs/concepts/workloads/controllers/garbage-collection/#owners-and-dependents)
* Read about [admission controllers](/docs/reference/access-authn-authz/admission-controllers/)
{{% /capture %}}
