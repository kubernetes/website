---
layout: blog
title: "Kubernetes v1.35: Constrained Impersonation - Pretending but Without the Fraud! (Alpha)"
date: 2025-11-XXT09:00:00-08:00
draft: true
slug: kubernetes-v1-35-constrained-impersonation-alpha
author: >
  [Ben Petersen](https://github.com/benjaminapetersen) (Microsoft)
---

## Constrained Impersonation: Prentending but Without the Fraud!

The word "impersonation" tends to elicit bad vibes.  In a world where
security threats lurk around every corner, rarely do we think of impersonation
as a good thing.  But this release we are here to give you some new tools
to make impersonating users, groups, service accounts and nodes as exciting
as it sounds, but without the fraud!

When you hear "impersonation", you probably don’t think "security feature".
You think fraud, spam calls, or that one colleague who can perfectly copy
your on-call voice. In Kubernetes, though, impersonation is a very real and
very useful capability. And now, with constrained impersonation, it’s also a
lot safer.

This post walks through what constrained impersonation is, how it works under
the hood, and when you might actually want to let something pretend to be
someone else on purpose.

Spoiler: we’re not giving your controllers a fake mustache and a stolen
passport. We’re giving them a tightly scoped, auditable permission slip.

---

## Quick recap: what is impersonation in Kubernetes?

Let's review impersonation in its current form.  We will call it "legacy impersonation".

User impersonation lets one Kubernetes identity (the **impersonator**) ask the
API server to handle a request *as if it came from* a different identity (the
**impersonated user**).

At the HTTP level, this is done using headers such as:

- `Impersonate-User`
- `Impersonate-Group`
- `Impersonate-Uid`
- `Impersonate-Extra-*`

And at the `kubectl` level, with flags like `--as` and `--as-group`.

The basic flow is:

1. The client authenticates as itself (for example, `system:serviceaccount:my-ns:deputy`).
2. It sends impersonation headers saying, "Please treat this request as if it
	 came from `panda@myfavoritebears.com`".
3. The API server checks whether the impersonator is allowed to impersonate
	 that identity.
4. If allowed, the request is then **authorized using the impersonated
	 user’s permissions**, not the impersonator’s.

Today, this is known as **legacy impersonation**. If you can impersonate a
user, you effectively get to do *anything that user can do*, anywhere in the
cluster. Helpful for admins. Terrifying for controllers.

---

## The problem: great for humans, too scary for controllers

Legacy impersonation is intentionally powerful. A cluster admin might use it
to debug a tricky RBAC rule:

```bash
kubectl --as=panda@myfavoritebears.com get pods -n prod
```

If this works, you know that Panda can list Pods in `prod`. If it fails, you
know you have more RBAC spelunking to do.

But what if you want a **controller** to impersonate?

Examples from the KEP:

- A node-level agent (like a CNI plugin) wants to list Pods *only on the node
	it’s running on*.
- A "deputy" controller wants to impersonate users **just enough** to open a
	VM console on their behalf, but nothing else.

With legacy impersonation, if you give these controllers the ability to
impersonate a user or node, they inherit **all** of that identity’s powers.
That’s a big blast radius:

- A bug, misconfiguration, or compromise in the controller could escalate to
	full user or node privileges.
- It’s hard to express policies like, "this controller can impersonate Panda
	only to *list* Pods in this namespace, nothing more".

So we want impersonation, but with **least privilege**. Enter constrained
impersonation.

---

## What is constrained impersonation?

Constrained impersonation is an alpha feature (Kubernetes v1.35,
`ConstrainedImpersonation` feature gate) that lets you say:

> This service account can impersonate this identity, **only** for these
> specific verbs on these specific resources.

Instead of a single, wide-open `impersonate` verb, the API server introduces
two families of more precise verbs:

1. **Who can you impersonate?**

	 These verbs answer "what kind of identity is allowed to be impersonated":

	 - `impersonate:user-info` — generic users, groups, UIDs, and extras.
	 - `impersonate:serviceaccount` — service accounts.
	 - `impersonate:arbitrary-node` — any node.
	 - `impersonate:associated-node` — specifically the node the controller is
		 running on.

2. **What can you do *via* impersonation?**

	 These verbs answer "what actions are allowed while impersonating":

	 - `impersonate-on:<mode>:<verb>`

	 Examples:

	 - `impersonate-on:user-info:list` on Pods
	 - `impersonate-on:user-info:get` on `virtualmachines/console`
	 - `impersonate-on:associated-node:list` on Pods

You express these via normal RBAC `Role` and `ClusterRole` objects, just like
any other verb.

---

## How the API server checks constrained impersonation

When constrained impersonation is enabled and a request comes in with
impersonation headers, the API server adds a couple of extra
`SubjectAccessReview` (SAR) checks.

Imagine a service account `system:serviceaccount:default:deputy` wants to
impersonate user `panda` to list Pods in the `default` namespace.

The API server does roughly this:

1. **Check: can you impersonate this identity at all?**

	 SAR for "who" you can impersonate, for example:

	 ```yaml
	 apiVersion: authorization.k8s.io/v1
	 kind: SubjectAccessReview
	 spec:
		 resourceAttributes:
			 group: authentication.k8s.io
			 resource: users
			 name: panda
			 verb: impersonate:user-info
		 user: system:serviceaccount:default:deputy
	 ```

	 If this fails, the request is denied (or falls back to legacy
	 impersonation, depending on how you’ve configured things).

2. **Check: what are you allowed to do *via* impersonation?**

	 SAR for the action the impersonator wants to perform on behalf of the
	 impersonated user, for example:

	 ```yaml
	 apiVersion: authorization.k8s.io/v1
	 kind: SubjectAccessReview
	 spec:
		 resourceAttributes:
			 group: ""
			 resource: pods
			 namespace: default
			 verb: impersonate-on:user-info:list
		 user: system:serviceaccount:default:deputy
	 ```

3. **Then, as usual, check whether the impersonated user can do the thing.**

	 Just like legacy impersonation, the final authorization is still based on
	 the impersonated user’s RBAC. If `panda` can’t list Pods in `default`, the
	 request fails, even if the impersonator’s constrained impersonation
	 permissions are perfect.

If the constrained checks fail but the impersonator still has the old
unscoped `impersonate` verb, the API server can fall back to legacy
impersonation behavior. That gives you a transition path: enable the feature,
then gradually migrate specific flows to constrained impersonation.

Audit logs grow a new `authenticationMetadata.impersonationConstraint` field
to record which constrained verb allowed the request, so you can see *why*
impersonation was allowed, not just *that* it happened.

---

## Example: a controller impersonating its node

Let’s make this concrete with one of the [KEP](https://kep.k8s.io/5284)’s user stories.

You run a per-node controller (say, a CNI plugin or some node agent). It needs
to list Pods **on its own node**, but shouldn’t get cluster-wide Pod
permissions.

With constrained impersonation you can do this:

1. Allow it to impersonate the node it’s running on using
	 `impersonate:associated-node`.
2. Allow it to list Pods **via that impersonation** using
	 `impersonate-on:associated-node:list`.

RBAC sketch:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
	name: impersonate:associated-node
rules:
- apiGroups: ["authentication.k8s.io"]
	resources: ["nodes"]
	verbs: ["impersonate:associated-node"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
	name: impersonate-pods-via-node
rules:
- apiGroups: [""]
	resources: ["pods"]
	verbs: ["impersonate-on:associated-node:list"]
```

You bind those roles to your node agent’s service account.

At runtime, the agent figures out the node it’s running on (for example, via
the downward API) and configures its client like:

```go
kubeConfig.Impersonate = rest.ImpersonationConfig{
		UserName: "system:node:" + os.Getenv("MY_NODE_NAME"),
}
```

Now the agent can only:

- Impersonate **its own node**, and
- Use that impersonation only to `list` Pods as allowed by the role.

It does *not* become an all-powerful node or cluster admin.

---

## Example: a deputy controller acting for users

Another story from the KEP: a "deputy" controller that opens VM consoles on
behalf of users.

You want:

- Users to keep control over *what they are allowed to do*.
- The deputy to act "as the user" for just this one action, so audit logs and
	admission behave as if the user did it themselves.

With constrained impersonation, you:

1. Give the deputy permission to impersonate user identities using
	 `impersonate:user-info`.
2. Give it permission to perform the **specific** VM console action via
	 impersonation using `impersonate-on:user-info:get` on the
	 `virtualmachines/console` subresource.

RBAC sketch:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
	name: impersonate-user-info
rules:
- apiGroups: ["authentication.k8s.io"]
	resources: ["users"]
	verbs: ["impersonate:user-info"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
	name: impersonate-vm-console
	namespace: default
rules:
- apiGroups: ["subresources.kubevirt.io"]
	resources: ["virtualmachines/console"]
	verbs: ["impersonate-on:user-info:get"]
```

Bind these to the deputy service account. Now, when the deputy impersonates a
user to open a VM console, the API server ensures:

- The deputy is allowed to impersonate that user.
- The deputy is allowed to perform the `get` console action via impersonation.
- The user themselves is allowed to get the console.

If any of those checks fail, the request fails. Your deputy can’t secretly do
more than users could do on their own.

---

## Why this is safer (and still backwards compatible)

Constrained impersonation is designed to be **additive** and **opt-in**:

- If you do nothing, legacy impersonation keeps working as before.
- You can enable the `ConstrainedImpersonation` feature gate, then start
	granting the new verbs to specific controllers or workflows.
- You can gradually tighten things so that high-privilege service accounts no
	longer need unconstrained `impersonate` at all.

Security-wise, you get:

- Much smaller blast radius if a controller is compromised.
- Clear RBAC intent: "this thing can impersonate X, but only to do Y on Z".
- Better audit information about *why* an impersonation was allowed.

You do pay a small cost: more `SubjectAccessReview` checks per impersonated
request, which means a bit more load on your authorizer, especially if you use
webhooks. The implementation includes short-lived caching, and the KEP calls
this out as an acceptable trade-off for the additional safety.

---

## When should you use constrained impersonation?

You should consider constrained impersonation when:

- A controller needs to act *as* a user or node, but only for a narrow set of
	actions.
- You want audit logs to show real users (or nodes) as the actor, even though
	controllers are making the calls.
- You’d like to stop handing out raw `impersonate` and move toward
	least-privilege delegation.

You probably don’t need constrained impersonation for:

- One-off human debugging as a cluster admin using `kubectl --as`.
- Simple clusters where impersonation isn’t used at all.

But as clusters grow, controllers multiply, and security teams ask sharper
questions like, "Why does this CNI daemonset effectively have admin
privileges?", constrained impersonation gives you a better answer than,
"Because it was convenient at the time."

---

## Wrap-up

Kubernetes impersonation has always been powerful; constrained impersonation
makes it **precise**.

By splitting impersonation into:

- *Who* you can impersonate (`impersonate:<mode>`), and
- *What* you can do while impersonating (`impersonate-on:<mode>:<verb>`),

the API server lets you keep the useful parts of impersonation—debugging,
delegation, and realistic audit trails—without turning every helper
controller into a potential super-admin.

So yes, Kubernetes now lets things impersonate each other more often. But in
this case, impersonation is less "crime podcast" and more "well-documented,
audited permission model"—which, for a production cluster, is arguably much
more exciting.

