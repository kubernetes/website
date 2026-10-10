---
layout: blog
title: "Live and let live with Kluctl and Server Side Apply"
date: 2022-11-04
slug: live-and-let-live-with-kluctl-and-ssa
author: >
   Alexander Block
---

This blog post was inspired by a previous Kubernetes blog post about
[Advanced Server Side Apply](https://kubernetes.io/blog/2022/10/20/advanced-server-side-apply/).
The author of said blog post listed multiple benefits for applications and
controllers when switching to server-side apply (from now on abbreviated with
SSA). Especially the chapter about
[CI/CD systems](https://kubernetes.io/blog/2022/10/20/advanced-server-side-apply/#ci-cd-systems)
motivated me to respond and write down my thoughts and experiences.

These thoughts and experiences are the results of me working on [Kluctl](https://kluctl.io)
for the past 2 years. I describe Kluctl as "The missing glue to put together
large Kubernetes deployments, composed of multiple smaller parts
(Helm/Kustomize/...) in a manageable and unified way."

To get a basic understanding of Kluctl, I suggest to visit the [kluctl.io](https://kluctl.io)
website and read through the documentation and tutorials, for example the 
[microservices demo tutorial](https://kluctl.io/docs/tutorials/microservices-demo/1-basic-project-setup/).
As an alternative, you can watch [Hands-on Introduction to kluctl](https://www.youtube.com/watch?v=9LoYLjDjOdg)
from the Rawkode Academy YouTube channel which shows a hands-on demo session.

There is also a [Kluctl delivery scenario](https://github.com/podtato-head/podtato-head-delivery/tree/main/kluctl)
for the [podtato-head](https://github.com/podtato-head/podtato-head) demo project.

## Live and let live

One of the main philosophies that Kluctl follows is ["live and let live"](https://kluctl.io/docs/philosophy/#live-and-let-live),
meaning that it will try its best to work in conjunction with any other tool or
controller running outside or inside your clusters. Kluctl will not overwrite
any fields that it lost ownership of, unless you explicitly tell it to do so.

Achieving this would not have been possible (or at least several magnitudes
harder) without the use of SSA. Server-side apply allows Kluctl
to detect when ownership for a field got lost, for example when another controller
or operator updates that field to another value. Kluctl can then decide on a 
field-by-field basis if force-applying is required before retrying based on these
decisions.

## The days before SSA

The first versions of Kluctl were based on shelling out to `kubectl` and thus
implicitly relied on client-side apply. At that time, SSA was
still alpha and quite buggy. And to be honest, I didn't even know it was a
thing at that time.

The way client-side apply worked had some serious drawbacks. The most obvious one
(it was guaranteed that you'd stumble on this by yourself if enough time passed)
is that it relied on an annotation (`kubectl.kubernetes.io/last-applied-configuration`)
being added to the object, bringing in all the limitations and issues with huge
annotation values. A good example of such issues are
[CRDs being so large](https://github.com/prometheus-operator/prometheus-operator/issues/4439),
that they don't fit into the annotation's value anymore.

Another drawback can be seen just by looking at the name (**client**-side apply).
Being **client** side means that each client has to provide the apply-logic on
its own, which at that time was only properly implemented inside `kubectl`,
making it hard to be replicated inside controllers.

This added `kubectl` as a dependency (either as an executable or in the form of
Go packages) to all controllers that wanted to leverage the apply-logic.

However, even if one managed to get client-side apply running from inside a
controller, you ended up with a solution that gave no control over how it
worked internally. As an example, there was no way to individually decide which
fields to overwrite in case of external changes and which ones to let go. 

## Discovering SSA apply

I was never happy with the solution described above and then somehow stumbled
across [server-side apply](/docs/reference/using-api/server-side-apply/),
which was still in beta at that time. Experimenting with it via
`kubectl apply --server-side` revealed immediately that the true power of
SSA can not be easily leveraged by shelling out to `kubectl`.

The way SSA is implemented in `kubectl` does not allow enough
control over conflict resolution as it can only switch between
"not force-applying anything and erroring out" and "force-applying everything
without showing any mercy!".

The API documentation however made it clear that SSA is able to
control conflict resolution on field level, simply by choosing which fields
to include and which fields to omit from the supplied object.

## Moving away from kubectl

This meant that Kluctl had to move away from shelling out to `kubectl` first. Only
after that was done, I would have been able to properly implement SSA
with its powerful conflict resolution.

To achieve this, I first implemented access to the target clusters via a
Kubernetes client library. This had the nice side effect of dramatically
speeding up Kluctl as well. It also improved the security and usability of
Kluctl by ensuring that a running Kluctl command could not be messed around
with by externally modifying the kubeconfig while it was running.

## Implementing SSA

After switching to a Kubernetes client library, leveraging SSA
felt easy. Kluctl now has to send each manifest to the API server as part of a
`PATCH` request, which signals
that Kluctl wants to perform a SSA operation. The API server then
responds with an OK response (HTTP status code 200), or with a Conflict response
(HTTP status 409).

In case of a Conflict response, the body of that response includes machine-readable
details about the conflicts. Kluctl can then use these details to figure out
which fields are in conflict and which actors (field managers) have taken
ownership of the conflicted fields.

Then, for each field, Kluctl will decide if the conflict should be ignored or
if it should be force-applied. If any field needs to be force-applied, Kluctl
will retry the apply operation with the ignored fields omitted and the `force`
flag being set on the API call.

In case a conflict is ignored, Kluctl will issue a warning to the user so that
the user can react properly (or ignore it forever...).

That's basically it. That is all that is required to leverage SSA.
Big thanks and thumbs-up to the Kubernetes developers who made this possible!

## Conflict Resolution

Kluctl has a few simple rules to figure out if a conflict should be ignored
or force-applied.

It first checks the field's actor (the field manager) against a list of known
field manager strings from tools that are frequently used to perform manual modifications. These
are for example `kubectl` and `k9s`. Any modifications performed with these tools
are considered "temporary" and will be overwritten by Kluctl.

If you're using Kluctl along with `kubectl` where you don't want the changes from
`kubectl` to be overwritten (for example, using in a script) then you can specify
`--field-manager=<manager-name>` on the command line to `kubectl`, and Kluctl
doesn't apply its special heuristic.

If the field manager is not known by Kluctl, it will check if force-applying is
requested for that field. Force-applying can be requested in different ways:

1. By passing `--force-apply` to Kluctl. This will cause ALL fields to be force-applied on conflicts.
2. By adding the [`kluctl.io/force-apply=true`](https://kluctl.io/docs/kluctl/deployments/annotations/all-resources/#kluctlioforce-apply) annotation to the object in question. This will cause all fields of that object to be force-applied on conflicts.
3. By adding the [`kluctl.io/force-apply-field=my.json.path`](https://kluctl.io/docs/kluctl/deployments/annotations/all-resources/#kluctlioforce-apply-field) annotation to the object in question. This causes only fields matching the JSON path to be force-applied on conflicts.

Marking a field to be force-applied is required whenever some other actor is
known to erroneously claim fields (the ECK operator does this to the nodeSets
field for example), you can ensure that Kluctl always overwrites these fields
to the original or a new value.

In the future, Kluctl will allow even more control about conflict resolution.
For example, the CLI will allow to control force-applying on field level.

## DevOps vs Controllers

So how does SSA in Kluctl lead to "live and let live"?

It allows the co-existence of classical pipelines (e.g. Github Actions or
Gitlab CI), controllers (e.g. the HPA controller or GitOps style controllers)
and even admins running deployments from their local machines.

Wherever you are on your infrastructure automation journey, Kluctl has a place
for you. From running deployments using a script on your PC, all the way to
fully automated CI/CD with the pipelines themselves defined in code, Kluctl
aims to complement the workflow that's right for you.

And even after fully automating everything, you can intervene with your admin
permissions if required and run a `kubectl` command that will modify a field
and prevent Kluctl from overwriting it. You'd just have to switch to a
field-manager (e.g. "admin-override") that is not overwritten by Kluctl.

## A few takeaways

Server-side apply is a great feature and essential for the future of
controllers and tools in Kubernetes. The amount of controllers involved
will only get more and proper modes of working together are a must.

I believe that CI/CD-related controllers and tools should leverage
SSA to perform proper conflict resolution. I also believe that
other controllers (e.g. Flux and ArgoCD) would benefit from the same kind
of conflict resolution control on field-level.

It might even be a good idea to come together and work on a standardized
set of annotations to control conflict resolution for CI/CD-related tooling.

On the other side, non CI/CD-related controllers should ensure that they don't
cause unnecessary conflicts when modifying objects. As of
[the server-side apply documentation](/docs/reference/using-api/server-side-apply/#using-server-side-apply-in-a-controller),
it is strongly recommended for controllers to always perform force-applying. When
following this recommendation, controllers should really make sure that only
fields related to the controller are included in the applied object.
Otherwise, unnecessary conflicts are guaranteed.

In many cases, controllers are meant to only modify the status subresource
of the objects they manage. In this case, controllers should only patch the
status subresource and not touch the actual object. If this is followed,
conflicts become impossible to occur.

If you are a developer of such a controller and unsure about your controller
adhering to the above, simply try to retrieve an object managed by your
controller and look at the `managedFields` (you'll need to pass
`--show-managed-fields -oyaml` to `kubectl get`) to see if some field got
claimed unexpectedly.
