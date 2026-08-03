---
layout: blog
title: "Kubernetes v1.37: A Webhook That Never Asks Who Wants to Know"
date: 2026-08-03
slug: kubernetes-v1-37-api-server-authentication-to-webhooks-alpha
author: >
  [Ben Petersen](https://github.com/benjaminapetersen) (Microsoft),
  [Peter Engelbert](https://github.com/pmengelbert) (Microsoft)
---

## A webhook that never asks who wants to know

Here is something that surprises a lot of people the first time they hear it: when
the Kubernetes API server calls one of your admission webhooks, it does not, by
default, prove that it is the API server. The webhook receives a request that
looks like it came from the control plane, and it takes that on faith. If some
other workload on the cluster can reach the webhook's network address, it can send
the very same request, and the webhook has no built-in way to tell the difference.

For a component whose whole job is to say "yes, admit this object" or "no, reject
it," trusting the caller without checking who the caller is turns out to be a real
gap. It is not a hypothetical, either. [CVE-2025-1974](https://nvd.nist.gov/vuln/detail/CVE-2025-1974)
is a recent, real-world example of what can go wrong when something on the cluster
network can talk to a component that assumed only the control plane would ever call
it. In Kubernetes v1.37, we - SIG Auth - are starting to close that gap.

{{< note >}}
This work is scoped to **admission webhooks**: the validating and mutating webhooks
that can accept, reject, or modify objects as they are created or updated. It does
not change authentication, authorization, audit, or conversion webhooks. When this
post says "webhook," it means an admission webhook.
{{< /note >}}

## A day in the life of a webhook that asks no questions

Let's make it concrete. Say you run a validating admission webhook called
`policy-webhook` in namespace `guardrails`. Its job is to inspect every new Pod and
decide whether it satisfies your organization's rules. The API server is configured
to call `policy-webhook` on every Pod create, sends it an `AdmissionReview` request,
and honors the allow-or-deny answer that comes back.

`policy-webhook` is reachable at a Service address on the cluster network. That is
exactly how the API server reaches it. But a Service address does not care who is
dialing it. Now suppose an attacker gets a foothold: a compromised Pod, a leaky
sidecar, anything that can open a connection on the service network. That workload
can craft its own `AdmissionReview` request and send it straight to `policy-webhook`.

From the webhook's point of view, the two requests are indistinguishable. It has no
standard, on-by-default way to confirm that the request in front of it actually came
from the API server. Depending on what your webhook does with that request, an
attacker who can pose as the API server might learn about policy that governs
resources they have no business seeing, or nudge the webhook into behavior it should
only ever perform for the control plane. The same concern applies to aggregated API
servers (add-on API servers registered through an `APIService` so their API groups
show up under the main Kubernetes API), which also call admission webhooks. A
compromised aggregated API server should not be able to probe a webhook about
resources it does not own.

There has always been an opt-in way to authenticate the caller. You can hand the API
server a kubeconfig, via `--admission-control-config-file`, carrying a client
certificate, a bearer token, or basic auth. It works, but it is a lot to ask. Someone
has to manage those credentials by hand, and changing them means restarting the API
server. The mechanism is unopinionated about which method you use, so a webhook that
wants to be broadly compatible has to be ready to verify all three. And the pain is
worst in the most common case: when the person running the API server and the person
who wrote the webhook are different people, which is exactly the situation for
off-the-shelf, community-maintained webhooks.

## Making the API server show some ID

The idea behind [KEP-6060](https://github.com/kubernetes/enhancements/issues/6060) is
to let the API server prove it is the caller, without any of that manual credential
wrangling. The API server (and aggregated API servers) can now mint a service account
token specifically for authenticating to an admission webhook, and present it as a
bearer token on the call. A service account token is just a signed JWT that stands in
for an identity. The twist here is that these tokens are short-lived, scoped to a
single webhook, and carry a claim about which API group the caller is allowed to ask
about.

The design goals are the part we care most about, because they are what make this
usable rather than just possible:

- **Low friction.** The aim is for this to work with minimal setup. Friction is what
  kills adoption, so the design leans toward being easy to turn on rather than a pile
  of configuration.
- **Backward compatible.** Existing kubeconfig-based setups keep working, and a
  webhook that simply ignores the `Authorization` header is unaffected. Nothing breaks
  by upgrading.
- **Scoped.** A token is tied to one webhook, by its audience, and to a specific API
  group, by an attested claim. It cannot be replayed against a different webhook or
  used to ask about a different API group.
- **Verifiable without a callback.** The webhook checks the token by verifying its
  signature against the API server's public keys, which the API server already
  publishes. There is no round-trip back to the API server to validate each token.

Two terms are worth pinning down. The **audience** (`aud`) of a token is the recipient
it is meant for; a verifier rejects any token whose audience is not itself. Here the
audience is derived from the target webhook's configuration, so a token minted for
`policy-webhook` is meaningless to any other webhook. And **JWKS / OIDC discovery** is
the mechanism that lets verification happen offline: the API server publishes its
public signing keys (a JSON Web Key Set) at a well-known endpoint, and a webhook fetches
those keys to check a token's signature on its own, without asking the API server about
that specific token.

![Diagram: the API server mints a short-lived, webhook-scoped service account token, presents it as a bearer token on the AdmissionReview call, and the webhook verifies the token signature offline against the API server's public keys. An attacker on the service network can reach the webhook but cannot forge a validly signed token.](webhook-auth-flow.svg)

The API server mints a scoped token, presents it to the webhook, and the webhook verifies it offline. An attacker can still reach the address, but has no valid token to present.

## How it all works

What follows is a simplified description. For the complete version, including the exact
claims and the authorization checks, please read
[KEP-6060](https://github.com/kubernetes/enhancements/issues/6060).

1. When the API server needs to call an admission webhook, it asks for a service
   account token that is bound to that specific webhook's configuration (its
   `ValidatingWebhookConfiguration` or `MutatingWebhookConfiguration`). The request also
   asks the API server to attest to which API group the caller may ask the webhook
   about.

2. Before issuing anything, the API server runs a series of authorization checks: that
   the caller is allowed to request a token for that service account, that the bound
   webhook configuration actually exists, and that the caller is permitted to attest to
   the API group it asked for. Only then does it sign the token. This is the important
   move: the API server will not vouch for a claim the caller is not authorized to make.

3. The resulting token is short-lived, its lifetime capped at ten minutes, and its
   audience is derived from the target webhook so it cannot be reused elsewhere. The API
   server caches these tokens per webhook and refreshes them as they expire, rather than
   minting a fresh one on every call.

4. The token is presented to the webhook as an `Authorization: Bearer` header on the
   `AdmissionReview` call. The webhook verifies the signature against the API server's
   published keys, checks that the audience matches itself, and checks that the attested
   API group covers the resource in the request. Because all of that is signature and
   claim inspection, the webhook never has to call back to the API server to trust the
   caller.

A note on what actually shipped in this alpha, because it matters for what you can try
today. The machinery that lives in the API server, issuing these webhook-scoped tokens
and enforcing the authorization checks at issuance time, is what landed in v1.37.

## Try it out

In Kubernetes v1.37 this ships as alpha, off by default, behind the
`APIServerWebhookAuthenticationToken` feature gate on the `kube-apiserver`. To
experiment with it, start your API server with:

```
--feature-gates=APIServerWebhookAuthenticationToken=true
```

Because this is alpha and off by default, it will not affect any existing cluster until
you deliberately turn it on. The user-facing documentation is coming together in
[kubernetes/website PR #56400](https://github.com/kubernetes/website/pull/56400); if you
want to follow the config surface as it settles, that is the place to watch.

## What's next?

This is an early step, and we have been deliberate about shipping the foundation first.
Several pieces are still ahead of us, and honestly, some of them are still being shaped:

- **A verification library for webhook authors.** We want webhook maintainers to validate these
  tokens without hand-rolling JWT and JWKS handling. A reusable library
  ([kubernetes/kubernetes#140665](https://github.com/kubernetes/kubernetes/pull/140665))
  is in progress but did not land in v1.37.
- **controller-runtime integration.** Many webhooks are built on controller-runtime, so
  first-class support there ([controller-runtime#3554](https://github.com/kubernetes-sigs/controller-runtime/pull/3554))
  is something we want, and it is still a work in progress.

If you look at that list and think "these are exactly the pieces I would have opinions
about," good. That is the point of shipping an alpha. The shape of the verification
library and the audience derivation is genuinely still open, and feedback right now is
great!

## How to get involved

Reading [KEP-6060](https://github.com/kubernetes/enhancements/issues/6060) is the best
way to understand the design in depth, including the parts this post simplified.

This is a SIG Auth effort, and we would love your help thinking through the open pieces.
You can find us on the [#sig-auth-authenticators-dev](https://kubernetes.slack.com/archives/C04UMAUC4UA)
channel on Kubernetes Slack (for an invitation, visit https://slack.k8s.io/). You are also welcome to join the bi-weekly [SIG Auth meetings](https://github.com/kubernetes/community/blob/master/sig-auth/README.md#meetings), held every other Wednesday.

If you maintain an admission webhook, or you have been burned by the caller-trust gap
before, we especially want to hear from you!
