---
layout: blog
title: "A ConfigMap Update Is Not One Change"
draft: true # will be changed to date: YYYY-MM-DD before publication
slug: a-configmap-update-is-not-one-change
author: >
  [Santhosh Kumar Somarapu](https://github.com/1991santhu)
---

You run `kubectl apply` on a ConfigMap. The command returns. The change is now live, or it is
partially live, or it is not live at all, and which of those you get depends on how each consuming
Pod happens to reference it.

This is documented behaviour rather than a defect, but it is spread across several places, and the
consequence only becomes obvious during an incident.

## Three consumption modes, three behaviours

**As a mounted volume: eventually.** The documentation
[puts it plainly](/docs/concepts/configuration/configmap/#mounted-configmaps-are-updated-automatically):
when a ConfigMap currently consumed in a volume is updated, projected keys are eventually updated as
well. The kubelet checks whether the mounted ConfigMap is fresh on every periodic sync, and it reads
through its local cache.

The delay is defined too. It can be as long as the kubelet sync period plus cache propagation delay,
where that second term depends on the `configMapAndSecretChangeDetectionStrategy` field in the
[KubeletConfiguration struct](/docs/reference/config-api/kubelet-config.v1beta1/): watch propagation
delay for the default watch strategy, the TTL for a TTL-based cache, or zero if every request is
redirected straight to the API server.

**As environment variables: never, until restart.** "ConfigMaps consumed as environment variables are
not updated automatically and require a pod restart."

**As a `subPath` mount: never.** "A container using a ConfigMap as a
[subPath](/docs/concepts/storage/volumes/#using-subpath) volume mount will not receive ConfigMap
updates."

## What that means at fleet scale

Take one ConfigMap consumed by three Deployments, one per mode. After a single apply:

- The volume-mounted Pods pick it up after their kubelet's sync plus cache delay, and the exact
  moment differs per node
- The env-var Pods keep the old values until something restarts them, which might be the next
  deploy, a node drain, an eviction, or a crash
- The `subPath` Pods keep the old values indefinitely, restart or not, until the mount changes

So the cluster ends up in mixed state, and the mixed state is not transient. Some of it persists
until an unrelated event happens to end it.

That last part is the one that catches people. A Pod restarted at 3 a.m. for an unrelated reason
suddenly picks up a config change made three weeks earlier, by someone who has forgotten making it.

## Why it looks fine in staging

Staging tends to restart often. Fewer replicas, more frequent deploys, more churn, so the env-var
Pods converge quickly and the window where old and new coexist is small enough to miss.

Production has long-lived Pods. The same change that appeared atomic in staging leaves a durable
split in production, and the split follows Pod age rather than anything you can see in a manifest.

## Practical handling

**Treat a ConfigMap change as a rollout, not an edit.** It changes behaviour, so it deserves what
other behavioural changes get. That usually means a
[rolling restart](/docs/reference/kubectl/generated/kubectl_rollout/kubectl_rollout_restart/) of
consumers rather than trusting propagation.

**Know which mode each consumer uses before you edit.** The three modes look nearly identical in a
Pod spec and behave completely differently on update. It is worth grepping for `subPath` and
`envFrom` specifically, because those are the two that will not converge on their own.

**Consider [immutable ConfigMaps](/docs/concepts/configuration/configmap/#configmap-immutable) where
a change must be atomic.** Marking a ConfigMap immutable means its data cannot be edited at all; to
change the configuration you create a new object and point the Deployment at it. Naming those objects
with a version suffix makes the change go through the normal rollout machinery, with the ordering,
health checks and rollback that implies. The documented tradeoffs are that the immutable flag cannot
be reverted, that Pods still mounting a deleted ConfigMap should be recreated, and that somebody has
to clean up the old objects. Immutability also reduces load on the API server by closing watches.

**Do not measure propagation by checking one Pod.** A single healthy Pod with the new value tells you
one kubelet synced. It says nothing about the others, and nothing at all about the env-var consumers.

## The wider point

Most changes that take a service down do not look like deployments, so they do not get the machinery
deployments get. A ConfigMap edit is a one-line command with no rollout, no staged exposure, no
health gate and no automatic rollback, and it can change application behaviour just as thoroughly as
a new image.

The behaviour above is all documented and all reasonable in isolation. It is the combination that
surprises, and the fix is mostly knowing which mode you are in before you press enter.
