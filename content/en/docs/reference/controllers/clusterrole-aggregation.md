---
toc_hide: true
title: ClusterRole aggregation controller
content_template: templates/concept
---

{{% capture overview %}}

This {{< glossary_tooltip term_id="controller" text="controller" >}}
implements the `aggregationRule` property for
[ClusterRoles](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#role-and-clusterrole),
which are used in connection with
{{< glossary_tooltip text="Role-Based Access Control" term_id="rbac" >}} (RBAC).

{{% /capture %}}

{{% capture body %}}

The ClusterRole aggregation controller is built in to the {{< glossary_tooltip term_id="kube-controller-manager" >}}.

## Controller behavior

This controller manages the permissions of aggregated ClusterRoles. The controller
watches (all) ClusterRoles for changes.

If the controller sees changes (add / remove / update) to a ClusterRole that matches
the clusterRoleSelectors for any existing ClusterRole, it will calcluate the rules
for the ClusterRole that had clusterRoleSelectors set.

See [Aggregated ClusterRoles](/docs/reference/access-authn-authz/rbac/#aggregated-clusterroles)
for more information on this.

{{% /capture %}}
{{% capture whatsnext %}}
* Read about [ClusterRoles](/docs/reference/access-authn-authz/rbac/#role-and-clusterrole)
* Read about other [cluster orchestration controllers](/docs/reference/controllers/cluster-orchestration-controllers/)
{{% /capture %}}
