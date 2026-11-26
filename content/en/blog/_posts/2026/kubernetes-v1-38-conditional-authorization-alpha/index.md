---
layout: blog
title: 'Kubernetes v1.38: Introducing Conditional Authorization (Alpha)'
draft: true
slug: kubernetes-v1-38-conditional-authorization-alpha
author: >
   [Lucas Käldström](https://github.com/luxas) (Senior Applied Scientist at AWS)
---

> Summary:

> - Kubernetes authorizers can now return "it depends on this object condition" in addition to "Allow", "Deny" and "No opinion" decisions.
> - This empowers administrators to write uniform access control policies across authorization and admission in one single policy.
> - You can use the feature today by configuring a webhook authorizer, but in the future SIG Auth plans a built-in object-aware authorization API (codenamed "RBAC++").
> - If you want a video introduction to this feature, take a look at the latter part of [this KubeCon Atlanta 2025 talk] or [this KubeCon Amsterdam 2026 talk]

[this KubeCon Atlanta 2025 talk]: https://youtu.be/JBM0PRyDaPs?si=dg5DqsjUET8s-avH
[this KubeCon Amsterdam 2026 talk]: https://youtu.be/7aRWwlU_ewE?si=ZNBeneJ6frZA_kqv

Kubernetes users have for a long time expressed interest in extending Kubernetes RBAC with label and field selectors, in order to not just say `lucas can create Pods` but `lucas can create Pods, but only with non-root containers`. For various reasons, we in SIG Auth did not know, until recently, whether would be technically or practically feasible to implement such object-level granularity in Kubernetes authorizers. 

However, we're glad to announce that we've made progress in this area with the Conditional Authorization feature ([KEP-5681]) shipped in Kubernetes v1.38, at the alpha maturity level.

This blog post will walk through what a solution to this problem looks like, why it was complex to solve, how you can take the feature into use today, where SIG Auth is planning to go next with this feature, and how you can contribute to the effort.

[KEP-5681]: https://github.com/kubernetes/enhancements/tree/master/keps/sig-auth/5681-conditional-authorization

## Background: Why not Kubernetes RBAC + ValidatingAdmissionPolicy?

Those of you that are familiar with Kubernetes RBAC and Validating Admission Policies might be thinking: "I can express that with a combination of Kubernetes RBAC and Validating Admission Policy rules, how is this different?"

This is partially true, but its a workaround that we've all had to live with, not a solution to the fundamental problem.

Let's recall the Kubernetes request chain. A Kubernetes API write request goes through the following phases (on a high level):

1. **Authentication**: This phase resolves who the user _is_, in terms of a username, a set of groups, and extra user metadata.
1. **Authorization**: This phase checks "can this user perform this type of API request?", based on the user information and request metadata (API group, resource, namespace, name) alone.
  1. Kubernetes RBAC operates in this phase.
1. Decoding of the request payload (new object), if any.
1. **Mutating Admission**: Admission plugins can change fields on the request object according to various policies.
1. **Validating Admission**: Admission plugins ensure the new (request payload) object and the old (stored) API objects are compliant to the rules of the cluster administrator.
  1. Validating Admission Policy (VAP) or validating admission webhooks operates in this phase. 
1. **Storage**: If the authorizer and all admission plugins accepted the request, the write request is applied and written to etcd.

TODO: Insert picture.

While it is possible to declare a rule of "this user can perform write requests like this, but only on objects matching this criteria" by first creating an "over-granting" RBAC allow policy (e.g. `Role` and `RoleBinding`) and then creating a deny policy using `ValidatingAdmissionPolicy` and `ValidatingAdmissionPolicyBinding` to correct the over-grant, this approach has certain limitations:

1. **Administrator complexity**: The administrator needs to create and understand four separate API objects, how they relate to each other, and two different paradigms (RBAC first, then CEL).
  1. Ideally, the adminstrator could define their intended access control policy once, and then let the system figure it out under the hood.
1. **Non-atomicity**: Because four API objects are needed, the desired policy cannot be atomically applied. Thus, the administrator needs to first apply the VAP deny policy, and when successfully applied, apply the RBAC allow rule, and perform removals in the opposite order. This in order to not have face a situation when only the overly broad RBAC allow rule would be applied alone.
  1. Ideally, creates, updates and deletes of the access control policy itself is atomic, either applies or not as a unit.
1. **User experience**: If a user tries to understand their permissions, `kubectl auth can-i` will answer `yes`, even though the user actually is restricted to only write certain objects.
  1. Ideally, the user can introspect the conditions that restrict their abilities to perform requests of a given type.
1. **No read support**: `ValidatingAdmissionPolicy` (and admission plugins in general) only apply to write requests. Webhook authorizers in Kubernetes can restrict read requests since [KEP-4601], but not through a built-in API, and not in a way that resembles VAP.
  1. Ideally, access control policies for writes and reads should be uniform, that is, as close to each other as possible.

Now we have gathered a set of requirements for a solution. Next, enter Conditional Authorization.

## Solution: Conditional Authorization

The solution to this problem is to extend set of decisions an authorizer can return to the Kubernetes API server with "it depends on this object condition", and the API server promising that any condition returned to it will be evaluated to an `Allow` before any request can complete.

TODO: Architecture diagram

This is made possible by a technique called [partial evaluation] (also see [this blog post about partial evaluation in access control][cedar-tpe] if you're interested). It allows users to write a single policy, e.g. `lucas can create Pods, but only with non-root containers` or `users in the engineers group can create, update or delete PersistentVolumeClaims, but only when storageClassName is "basic-ssd"`. This policy depends on both request metadata (the API group, resource type, namespace, etc.) as well as the object (`Pod`/`PersistentVolumeClaim`). Recall that during the authorizer phase, the authorizer only has access to the request metadata.

Consider an example of `users in the engineers group can create PersistentVolumeClaims, but only when storageClassName is "basic-ssd"` in a VAP/CEL-like expression language for illustration:

```cel
request.verb in ["create", "update", "delete"] &&
request.apiGroup == "" &&
request.resource == "persistentvolumeclaims" &&
request.apiVersion == "v1" &&
"engineers" in request.user.groups &&
object != nil &&
object.spec.storageClassName == "basic-ssd"
```

However, if the authorizer implements partial evaluation, it can still simplify all the parts of the policy expression that depend on the known information, and keep the request object unknown during evaluation, keeping such expressions unchanged. After partial evaluation with `object` kept unknown but the `request` specified as:

```yaml
request:
  verb: create
  apiGroup: ""
  resource: persistentvolumeclaims
  apiVersion: v1
  user:
    name: foo
    groups:
    - engineers
    - bar
```

the expression is simplified into just:

```cel
object != nil && object.spec.storageClassName == "basic-ssd"
```

as all other terms evaluated to `true`. This simplfied expression becomes the condition returned to the `kube-apiserver`. If this is an allow policy, it means that if the above simplified condition on the request object evaluates to true, the authorizer's decision is `Allow`. The authorizer thus returns this condition to the `kube-apiserver`, the `kube-apiserver` sees the request can become allowed, decodes the object, and in the admission phase, when the `object` variable indeed is available, enforces the conditions to evaluate to `Allow` (otherwise the request is rejected with a `403 Forbidden` HTTP status code).

### Requests that cannot become allowed are denied early

However, consider an API request with the attributes

```yaml
request:
  verb: create
  apiGroup: ""
  resource: persistentvolumeclaims
  apiVersion: v1
  user:
    name: bar
    groups:
    - notrelevant
```

This will partially evaluate to:

```cel
true &&
true &&
true &&
true &&
false &&
object != nil &&
object.spec.storageClassName == "basic-ssd"
```

which can be simplified to just `false` in normal CEL-like semantics. This means that even though the access control policy was conditional on the object, the evaluation in this case is always `false`, irrespective of the `object`. If this is the case, the authorizer and/or kube-apiserver realize that we can fail fast and return `403 Forbidden` already at the authorization phase. This as no matter what the `object` is, we will get a `Deny` result, and thus we want to protect the server's resources and not spend CPU time and RAM to decode a (potentially malicious and large) request payload.

### Surfacing the conditions in `(Self)SubjectAccessReview`

Earlier we noted that, ideally, the user should be able to introspect the conditions they are subject to when performing a certain type of request.
With conditional authorization, this is now surfaced through the [`SubjectAccessReview`] and [`SelfSubjectAccessReview`] APIs that [empower users and administrators to inspect API access].
Surfacing this information in `kubectl auth can-i` is not implemented yet, but planned for the next implementation phase.
The information is however visible in the APIs, when the `ConditionalAuthorization` feature gate is enabled.
In the first example above, this becomes:

```yaml
apiVersion: authorization.k8s.io/v1
kind: SubjectAccessReview
spec:
  user: foo
  groups:
  - engineers
  - bar
  resourceAttributes:
    verb: create
    group: ""
    resource: persistentvolumeclaims
    version: v1
status:
  conditionalDecision:
    type: ConditionsMap
    conditionsMap:
      allowConditions:
      - id: example.com/engineers-can-use-pvc-basic-ssd-only
        condition: 'object != nil && object.spec.storageClassName == "basic-ssd"'
        type: authorizer.kubernetes.io/cel # Well-known conditions type for CEL
```

[partial evaluation]: https://en.wikipedia.org/wiki/Partial_evaluation
[cedar-tpe]: https://cedarpolicy.com/blog/tpe
[empower users and administrators to inspect API access]: https://kubernetes.io/docs/reference/access-authn-authz/authorization/#checking-api-access
[`SubjectAccessReview`]: https://kubernetes.io/docs/reference/kubernetes-api/definitions/subject-access-review-v1-authorization/
[`SelfSubjectAccessReview`]: https://kubernetes.io/docs/reference/kubernetes-api/definitions/self-subject-access-review-v1-authorization/

## Try it out!

Right now, only the [webhook authorizer] in Kubernetes supports returning conditions. We expect to expand the set of authorizers that support conditions over time. In practice, it means that for now, you can try this out e.g. in a kind cluster or wherever you can configure authorizers (howver, this is usually not possible in managed Kubernetes cloud offerings).

A year ago, when I prototyped these ideas and was writing up the [KEP][KEP-5681], I implemented a sample conditional authorizer [`kubernetes-cedar-authorizer`] for Kubernetes using [Cedar Policy], a CNCF Sandbox project. Cedar Policy is an authorization language and engine, a library that you can use to implement access control easier in your application. It supports attribute-, role- and relation-based access control (ABAC, RBAC and ReBAC), is designed to be fast and safe to execute, and provides advanced [policy querying][cedar-tpe] and [policy analysis] features to help you understand whether your policies actually do what you intended. (Disclaimer: I am a maintainer of the Cedar Policy project.)

I performed most of the design and implementation work on the Conditional Authorization KEP while I was at [Upbound]; around three months ago I joined AWS. I want to thank Upbound for allowing and encouraging me to contribute upstream, and for donating [`kubernetes-cedar-authorizer`] to the Cedar Policy project and by extension CNCF! Now that Kubernetes supports conditional authorization, work on the `kubernetes-cedar-authorizer` integration can resume, in order to move the project from a proof of concept to something production-ready the ecosystem can rely on.

Using Cedar and the `kubernetes-cedar-authorizer` project, the administrator could define the above mentioned policy uniformly and atomically as follows:

```cedar
permit(
   principal is k8s::User,
   action in [k8s::Action::"create", k8s::Action::"update", k8s::Action::"delete"],
   resource is core::persistentvolumeclaims
) when {
   principal.groups.contains("engineers") &&
   resource has request.v1.spec.storageClassName && 
   resource.request.v1.spec.storageClassName == "basic-ssd"
};
```

Try it out today by following the getting started guide in [`kubernetes-cedar-authorizer`] or build your own conditional authorizer!

### Explorations using formal verification

It is critical to get the implementation of an access control engine correct. Any bug could have severe effects: the implementation returning `Deny` when it should have returned `Allow` is an availability issue and getting `Allow` when it should have been `Deny` is a security issue. What techniques are available to increase the assurance of correctness? Unit and integration tests are given methods, but in addition, [property-based testing and formal verification] can help.

In order to be able to serve as a rock-solid building block for the rest of the cloud native ecosystem, [Cedar is formally verified in the proof language Lean].

Given the complexity of the conditional authorization feature implementation and design in Kubernetes, I'm exploring if we can bring some of the same learnings from Cedar to increase assurance of implementation correctness of this KEP. This is still in the very early stages, but if this is something you are interested in, let me know! Ideally, one would be able to prove end-to-end implementation correctness (under as minimal assumptions as possible) of both the Kubernetes part and a given authorizer, e.g. `kubernetes-cedar-authorizer` (which in turn can rely on the proofs of Cedar correctness).

TODO: Mention other Lean efforts in the k8s community.

[webhook authorizer]: https://kubernetes.io/docs/reference/access-authn-authz/webhook/
[Cedar Policy]: https://github.com/cedar-policy/cedar
[policy analysis]: https://cedarpolicy.com/blog/introducing-cedar-analysis
[`kubernetes-cedar-authorizer`]: https://github.com/cedar-policy/kubernetes-cedar-authorizer
[Upbound]: https://www.upbound.io/
[property-based testing and formal verification]: https://dl.acm.org/doi/10.1145/3663529.3663854
[Cedar is formally verified in the proof language Lean]: https://lean-lang.org/use-cases/cedar/

## Next stop: help shape RBAC++

Conditional Authorization is at the alpha stage in v1.38.
Next, we hope to hear feedback from webhook conditional authorizer implementers!

We also want to provide the community with a core Kubernetes API which implements conditional authorization under the hood, not just for webhook authorizers. This effort has the codename "RBAC++". The **floor is open for anyone** to propose API shapes for what this should look like. If you have a proposal or ideas related to this effort, you are welcome and encouraged to present at the [SIG Auth biweekly meeting] by adding yourself to [the meeting agenda].

Note that conditional authorization itself only covers write requests, but together with [KEP-4601] and [automated reasoning], one can protect read requests based on label and/or field selectors as well, without any changes needed to Kubernetes core for existing selectors. For more information about the theory behind this feature, see Chapter 5.6 of [this technical design writeup].

Furthermore, active exploration work is in progress in SIG Auth for the [Authenticator Provided Authorization Constraints] KEP, which relatedly empowers an authenticator to upper-bound the maximum privileges a given user credential can assume, e.g. prevent AI agents acting on behalf of a user to delete, even though the user itself has delete privileges.

[automated reasoning]: https://dl.acm.org/doi/10.1145/3649835
[this technical design writeup]: https://github.com/luxas/research#usable-access-control-in-cloud-management-systems

Finally, I want to thank everyone that's been contributing to this feature along the way, including, but not limited to (alphabetical order):

- Jordan Liggitt, Google
- David Eads, Red Hat
- Evan Hearne, Red Hat
- Mo Khan, Microsoft
- Standa Láznička, Microsoft
- Micah Hausler, AWS
- Tim Bannister, Control Plane

[KEP-4601]: https://github.com/kubernetes/enhancements/tree/master/keps/sig-auth/4601-authorize-with-selectors
[SIG Auth biweekly meeting]: https://github.com/kubernetes/community/tree/main/sig-auth
[the meeting agenda]: https://docs.google.com/document/d/1BiW9kcQYDeMtaItFMz5qG1XdCd5jNeJcQMRdb3UORdI/edit?tab=t.0#heading=h.ucn6b5acqauf
[Authenticator Provided Authorization Constraints]: https://github.com/kubernetes/enhancements/pull/5918

Outline:
- Problem statement and proposed solution
- History/Context
  - Link to my and Micah's talk
  - Link to KEP
- How to use this
- What this is and isn't
  - Not RBAC++, that's next
  - Not reads, only writes
- What's next

Thank the reviewers, etc.

