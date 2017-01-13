

-----------
# PolicyRule v1alpha1



Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1alpha1 | PolicyRule







PolicyRule holds information that describes a policy rule, but does not contain information about who the rule applies to or which namespace the rule applies to.

<aside class="notice">
Appears In <a href="#clusterrole-v1alpha1">ClusterRole</a> <a href="#role-v1alpha1">Role</a> </aside>

Field        | Description
------------ | -----------
apiGroups <br /> *string array*  | APIGroups is the name of the APIGroup that contains the resources.  If multiple API groups are specified, any action requested against one of the enumerated resources in any API group will be allowed.
attributeRestrictions <br /> *[RawExtension](#rawextension-runtime)*  | AttributeRestrictions will vary depending on what the Authorizer/AuthorizationAttributeBuilder pair supports. If the Authorizer does not recognize how to handle the AttributeRestrictions, the Authorizer should report an error.
nonResourceURLs <br /> *string array*  | NonResourceURLs is a set of partial urls that a user should have access to.  *s are allowed, but only as the full, final step in the path This name is intentionally different than the internal type so that the DefaultConvert works nicely and because the ordering may be different. Since non-resource URLs are not namespaced, this field is only applicable for ClusterRoles referenced from a ClusterRoleBinding. Rules can either apply to API resources (such as "pods" or "secrets") or non-resource URL paths (such as "/api"),  but not both.
resourceNames <br /> *string array*  | ResourceNames is an optional white list of names that the rule applies to.  An empty set means that everything is allowed.
resources <br /> *string array*  | Resources is a list of resources this rule applies to.  ResourceAll represents all resources.
verbs <br /> *string array*  | Verbs is a list of Verbs that apply to ALL the ResourceKinds and AttributeRestrictions contained in this rule.  VerbAll represents all kinds.






