---
layout: blog
title: "Kubernetes v1.35: Handling Undecryptable Resources (Alpha)"
date: 2025-11-XXT09:00:00-08:00
draft: true
slug: kubernetes-v1-35-handling-undecryptable-resources-alpha
author: >
  [Ben Petersen](https://github.com/benjaminapetersen) (Microsoft)
---

## Handling undecryptable resources: when one broken Secret ruins everything

If you’ve ever rotated an encryption key a little too aggressively, miswired a
KMS plugin, or inherited a cluster with a mysterious etcd history, you may have
seen the most frustrating flavour of "encryption at rest": the part where *one
malformed object* makes it impossible to list **any** objects of that type. A
single Secret or ConfigMap that can’t be decrypted turns simple operations like
`kubectl get secrets -n production` into a full-cluster faceplant. And because
the API server can’t read the object, you can’t delete it either—unless you’re
willing to go spelunking directly in etcd with all the associated "please don’t
brick the cluster" anxiety.

KEP-3926, *Handling undecryptable resources*, gives administrators a safer,
API-native way to (a) find out which resources are failing to decrypt and (b)
remove them when you really, truly mean it.

## The problem: one bad object, many sad APIs

Encryption at rest in Kubernetes works by transforming objects as they’re
written to and read from storage. If that transformation fails on the way *out*
of etcd—because a key is gone, the ciphertext is corrupted, or some other
storage-layer issue—then:

- Any request that needs to read that object fails.
- A `LIST` or `WATCH` that touches the same prefix also fails, even if all
	other objects are perfectly fine.
- Because the API server can’t decode the object, you can’t just `kubectl
	delete` your way out of trouble.

Today, the escape hatch is: connect directly to etcd and surgically remove the
broken record. That’s brittle, vendor‑unfriendly, and not something most SREs
are excited to practice in production.

The cluster needs a way to say, "this thing is unreadable, please show me which
one it is" and, if the admin decides it’s safe, "delete it anyway"—all via the
Kubernetes API.

## The solution: better errors and a (very sharp) delete option

The enhancement does two main things:

1. **Improves errors for undecryptable resources**

	 When the API server can’t read objects from storage, it now uses a specific
	 status reason: `StorageReadError` (`StatusReasonStoreReadError`). That
	 error:

	 - Clearly signals that the failure happened while reading from the backend
		 store.
	 - Includes details about the resource kind and the key prefix.
	 - Can list up to 100 specific keys that failed to read, so you can see which
		 objects are malformed without poking at etcd directly.

	 This alone makes it much easier to diagnose *what* is broken when a list or
	 get explodes.

2. **Introduces a new delete option for "I know this is dangerous" deletes**

To actually remove an object the API server cannot decode, the KEP adds a
new field to `DeleteOptions`:

```go
type DeleteOptions struct {
    ...
    // IgnoreStoreReadErrorWithClusterBreakingPotential will try to perform the
    // normal deletion flow but, if the resource data cannot be read from the
    // store (for example, decryption fails or the data is corrupted), it will
    // disregard those read errors and still perform the deletion.
    // WARNING: This can break your cluster if the resource has dependencies
    //          you don't fully understand.
    IgnoreStoreReadErrorWithClusterBreakingPotential bool
}
```

When this flag is set, the API server will do its best to delete the object
even if it can’t decode its contents.

Because this is the kind of feature vendors put in the "do not call me if
you used this" category, the KEP also adds **extra protection**:

- Deletes that set `IgnoreStoreReadErrorWithClusterBreakingPotential` go
    through an additional admission layer.
- That admission checks for a special RBAC verb,
    `delete-ignore-read-errors`, on the target resource.
- In other words, even if you can normally `delete` Pods/Secrets/etc., you
    need *separate*, explicitly granted permission to do this unsafe delete.

## How it all works (at a high level)

Putting it together, the flow looks like this:

1. **You hit a decryption problem**

A `GET` or `LIST` call fails because one or more objects can’t be
transformed from their stored form. Instead of a generic 500, you see a
`StorageReadError` that includes the affected resource kind, key prefix, and
a list of keys that failed to read.

2. **You decide the object really can go away**

Maybe it’s a Secret that a controller will recreate, or a test namespace you
no longer need. After reviewing the error details and your environment, you
decide it’s safe to delete even without being able to inspect the contents.

3. **You issue a delete with the special option set**

A client (such as `kubectl`, once it grows support) would send something
equivalent to:

```yaml
apiVersion: v1
kind: Secret
metadata:
    name: broken-secret
    namespace: prod
---
# Conceptual delete options, sent as the body of a DELETE call
apiVersion: v1
kind: DeleteOptions
ignoreStoreReadErrorWithClusterBreakingPotential: true
```

The exact wire format is handled by the client, but the important part is
that `ignoreStoreReadErrorWithClusterBreakingPotential` boolean.

4. **The API server gates the dangerous path**

- Admission intercepts the delete.
- It checks whether the calling user is authorized for the
    `delete-ignore-read-errors` verb on that resource.
- Only if that RBAC check passes will the server proceed with the
    best‑effort delete, even though reading the object’s data fails.

This approach lets you recover from a small number of bad objects using only
the Kubernetes API, while still making it hard to casually press the big red
button.

---

## Try it out

The unsafe delete behavior is guarded by a feature gate on the API server:

- Feature gate name: `AllowUnsafeMalformedObjectDeletion`
- Component: `kube-apiserver`

On a test cluster running v1.35, you might enable it like this:

```bash
kube-apiserver \
	--feature-gates=AllowUnsafeMalformedObjectDeletion=true \
	...
```

Then:

1. Grant yourself (or a break‑glass admin role) the special delete power, for
	 example:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
    name: unsafe-malformed-delete-admin
rules:
- apiGroups: ["*"]
    resources: ["*"]
    verbs: ["delete", "delete-ignore-read-errors"]
```

2. Trigger or simulate an undecryptable object (in a safe, non‑production
	 environment) and observe the new `StorageReadError` with its list of
	 failing keys.
3. Use a client that can send the new `DeleteOptions` flag to remove the bad
	 object via the API.

As always, don’t experiment with this for the first time on your only
production cluster.

---

## What’s next?

KEP-3926 targets an alpha phase with a few clear goals:

1. **Stabilize the new error behavior** so operators reliably see which
	 objects are undecryptable and why.
2. **Validate the delete option and admission flow** across real‑world
	 environments and storage backends.
3. **Decide on graduation** once we have enough feedback on usability,
	 performance, and operational safety.

Long‑term, the aim is not to make "ignore read errors" a routine part of
cluster operations, but to ensure that when encryption at rest does break in
small ways, you’re not forced to choose between living with a stuck API or
talking directly to etcd.

---

## How to get involved

If you want to dig into the details, start with the KEP itself:

- [KEP-3926: Handling undecryptable resources](https://kep.k8s.io/3926)

If you operate clusters with encryption at rest enabled—or you build the tools
that manage those clusters—your feedback is especially valuable. You can:

- Join the [#sig-auth](https://kubernetes.slack.com/messages/sig-auth)
	channel on Kubernetes Slack (get an invite at <https://slack.k8s.io/>).
- Attend the bi‑weekly [SIG Auth meetings](https://github.com/kubernetes/community/blob/master/sig-auth/README.md#meetings),
	held every other Wednesday.

Hopefully you never need this feature. But if you wake up one day to discover
that one undecryptable Secret has turned your API into a very expensive error
generator, it’s nice to know you’ve got something better than "open etcd and
cross your fingers" in your toolkit.

