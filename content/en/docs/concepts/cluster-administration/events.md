---
reviewers:
- piosz
- x13n
content_template: templates/concept
title: Events in Kubernetes
---

{{% capture overview %}}

Kubernetes {{% glossary_tooltip text="Events" term_id="events" %}} are created
when other resources have state changes, errors, or messages that should be
broadcast to the rest of the system. Events can be used to debug issues with a cluster.

{{% /capture %}}


{{% capture body %}}

Since events are API objects, they are stored in the {{< glossary_tooltip
text="apiserver" term_id="kube-apiserver" >}} on the control plane. To avoid
filling up storage, a retention policy is enforced: Events are removed one hour
after the last occurrence. To provide longer history and aggregation
capabilities, you can install a third-party solution to capture Events.
Exploring third-party solutions is beyond the scope of the Kubernetes
documentation. You may wish to look at the [CNCF Cloud Native Interactive
Landscape](https://landscape.cncf.io) for projects that can consume and
aggregate Kubernetes Events.

{{% /capture %}}

{{% capture whatsnext %}}

Read about using Events for debugging your application in the
[Application Introspection and Debugging](/docs/tasks/debug-application-cluster/debug-application-introspection/)
section.


{{% /capture %}}
