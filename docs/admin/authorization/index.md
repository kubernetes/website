---
assignees:
- erictune
- lavalamp
- deads2k
- liggitt
title: Overview
---

{% capture overview %}
Learn more about Kubernetes authorization, including details about creating policies using the supported authorization modules.
{% endcapture %}

{% capture body %}
In Kubernetes, you must be authenticated (logged in) before your request can be authorized (granted permission to access). For information about authentication, see [Accessing Control Overview](/docs/admin/accessing-the-api/).

Kubernetes expects attributes that are common to REST API requests. This means that Kubernetes authorization works with existing organization-wide or cloud-provider-wide access control systems which may handle other APIs besides the Kubernetes API.

## Determine Whether a Request is Allowed or Denied
Kubernetes authorizes API requests using the API server. It evaluates all of the request attributes against all policies and allows or denies the request. All parts of an API request must be allowed by some policy in order to proceed. This means that permissions are denied by default.

(Although Kubernetes uses the API server, access controls and policies that depend on specific fields of specific kinds of objects are handled by Admission Controllers.)

When multiple authorization modules are configured, each is checked in sequence, and if any module authorizes the request, then the request can proceed. If all modules deny the request, then the request is denied (HTTP status code 403).

## Review Your Request Attributes
Kubernetes reviews only the following API request attributes:

 * **user** - The `user` string provided during authentication
 * **group** - The list of group names to which the authenticated user belongs
 * **"extra"** - A map of arbitrary string keys to string values, provided by the authentication layer
 * **API** - Indicates whether the request is for an API resource
 * **Request path** - Path to miscellaneous non-resource endpoints like `/api` or `/healthz`.
 * **API request verb** - API verbs `get`, `list`, `create`, `update`, `patch`, `watch`, `proxy`, `redirect`, `delete`, and `deletecollection` are used for resource requests. To determine the request verb for a resource API endpoint, see **Determine the request verb** below.
 * **HTTP request verb** - HTTP verbs `get`, `post`, `put`, and `delete` are used for non-resource requests
 * **Resource** - The ID or name of the resource that is being accessed (for resource requests only)
--* For resource requests using `get`, `update`, `patch`, and `delete` verbs, you must provide the resource name.
 * **Subresource** - The subresource that is being accessed (for resource requests only)
 * **Namespace** - The namespace of the object that is being accessed (for namespaced resource requests only)
 * **API group** - The API group being accessed (for resource requests only). An empty string designates the [core API group](/docs/api/).

## Determine the Request Verb
To determine the request verb for a resource API endpoint, review the HTTP verb used and whether or not the request acts on an individual resource or a collection of resources:

HTTP verb | request verb
----------|---------------
POST      | create
GET, HEAD | get (for individual resources), list (for collections)
PUT       | update
PATCH     | patch
DELETE    | delete (for individual resources), deletecollection (for collections)

Kubernetes sometimes checks authorization for additional permissions using specialized verbs. For example:

* [PodSecurityPolicy](/docs/concepts/policy/pod-security-policy/) checks for authorization of the `use` verb on `podsecuritypolicies` resources in the `extensions` API group.
* [RBAC](/docs/admin/authorization/rbac/#privilege-escalation-prevention-and-bootstrapping) checks for authorization 
of the `bind` verb on `roles` and `clusterroles` resources in the `rbac.authorization.k8s.io` API group.
* [Authentication](/docs/admin/authentication/) layer checks for authorization of the `impersonate` verb on `users`, `groups`, and `serviceaccounts` in the core API group, and the `userextras` in the `authentication.k8s.io` API group.

## Authorization Modules
 * **Node** - A special-purpose authorizer that grants permissions to kubelets based on the pods they are scheduled to run. To learn more about using the Node authorization mode, see [Node Authorization](/docs/admin/authorization/node/)
 * **ABAC** - Attribute-based access control (ABAC) defines an access control paradigm whereby access rights are granted to users through the use of policies which combine attributes together. The policies can use any type of attributes (user attributes, resource attributes, object, environment attributes etc). To learn more about using the ABAC mode, see [ABAC Mode](/docs/admin/authorization/abac/)
 * **RBAC** - Role-based access control (RBAC) is a method of regulating access to computer or network resources based on the roles of individual users within an enterprise. In this context, access is the ability of an individual user to perform a specific task, such as view, create, or modify a file. To learn more about using the RBAC mode, see [RBAC Mode](/docs/admin/authorization/rbac/)
 ..* When specified "RBAC" (Role-Based Access Control) uses the "rbac.authorization.k8s.io" API group to drive authorization decisions, allowing admins to dynamically configure permission policies through the Kubernetes API.
 ..* As of 1.6 RBAC mode is in beta.
 ..* To enable RBAC, start the apiserver with `--authorization-mode=RBAC`.
 * **Webhook** - A WebHook is an HTTP callback: an HTTP POST that occurs when something happens; a simple event-notification via HTTP POST. A web application implementing WebHooks will POST a message to a URL when certain things happen. To learn more about using the Webhook mode, see [Webhook Mode](/docs/admin/authorization/webhook/)
 * **Custom Modules** - You can create custom modules for using with Kubernetes. To learn more, see **Custom Modules** below.
 
### Custom Modules
Other implementations can be developed fairly easily. The APIserver calls the Authorizer interface:

```go
type Authorizer interface {
  Authorize(a Attributes) error
}
```

to determine whether or not to allow each API action.

An authorization plugin is a module that implements this interface.
Authorization plugin code goes in `pkg/auth/authorizer/$MODULENAME`.

An authorization module can be completely implemented in go, or can call out
to a remote authorization service.  Authorization modules can implement
their own caching to reduce the cost of repeated authorization calls with the
same or similar arguments.  Developers should then consider the interaction
between caching and revocation of permissions.

#### Checking API Access

Kubernetes exposes the `subjectaccessreviews.v1.authorization.k8s.io` resource as a
normal resource that allows external access to API authorizer decisions.  No matter which authorizer
you choose to use, you can issue a `POST` with a `SubjectAccessReview` just like the webhook
authorizer to the `apis/authorization.k8s.io/v1/subjectaccessreviews` endpoint and
get back a response.  For instance:

```bash
kubectl create --v=8 -f -  << __EOF__
{
  "apiVersion": "authorization.k8s.io/v1",
  "kind": "SubjectAccessReview",
  "spec": {
    "resourceAttributes": {
      "namespace": "kittensandponies",
      "verb": "get",
      "group": "unicorn.example.org",
      "resource": "pods"
    },
    "user": "jane",
    "group": [
      "group1",
      "group2"
    ],
    "extra": {
      "scopes": [
        "openid",
        "profile"
      ]
    }
  }
}
__EOF__

--- snip lots of output ---

I0913 08:12:31.362873   27425 request.go:908] Response Body: {"kind":"SubjectAccessReview","apiVersion":"authorization.k8s.io/v1","metadata":{"creationTimestamp":null},"spec":{"resourceAttributes":{"namespace":"kittensandponies","verb":"GET","group":"unicorn.example.org","resource":"pods"},"user":"jane","group":["group1","group2"],"extra":{"scopes":["openid","profile"]}},"status":{"allowed":true}}
subjectaccessreview "" created
```

This is useful for debugging access problems, in that you can use this resource
to determine what access an authorizer is granting.

## Using Flags for Your Authorization Module

You must include a flag in your policy to indicate which authorization module your policies include:

The following flags can be used:
  - `--authorization-mode=ABAC` Attribute-Based Access Control (ABAC) mode allows you to configure policies using local files.
  - `--authorization-mode=RBAC` Role-based access control (RBAC) mode allows you to create and store policies using the Kubernetes API.
  - `--authorization-mode=Webhook` WebHook is an HTTP callback mode that allows you to manage authorization using a remote REST.
  - `--authorization-mode=AlwaysDeny` This flag blocks all requests. Use this flag only for testing.
  - `--authorization-mode=AlwaysAllow` This flag allows all requests. Use this flag only if you do not require authorization for your API requests.

You can choose more than one authorization module. If one of the modes is `AlwaysAllow`, then it overrides the other modes and all API requests are allowed. 

## Versioning
For version 1.2, clusters created by kube-up.sh are configured so that no authorization is required for any request.

As of version 1.3, clusters created by kube-up.sh are configured so that the ABAC authorization modules are enabled. However, its input file is initially set to allow all users to do all operations. The cluster administrator needs to edit that file, or configure a different authorizer to restrict what users can do.

{% endcapture %}
{% capture whatsnext %}
* To learn more about Authentication, see **Authentication** in [Controlling Access to the Kubernetes API](/docs/admin/accessing-the-api/).
* To learn more about Admission Control, see [Using Admission Controllers](/docs/admin/admission-controllers/).
{% endcapture %}

{% include templates/concept.md %}
