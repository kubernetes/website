---
assignees:
- bgrant0607
- lavalamp
- thockin

---

# Kubernetes Deprecation Policy

Kubernetes is a large system with many components and many contributors.  As
with any such software, the feature set naturally evolves over time.  Sometimes
we realize that something we have done in the past, whether that is some API, a
flag, or even a whole feature, needs to be replaced or removed.  Kubernetes is
committed to not breaking users, so we can’t just make breaking changes.  This
is when deprecation is triggered.

This document details the policies we hold on deprecation for various facets of
the system.

## Deprecating parts of the API

Since Kubernetes is an API-driven system, it’s not surprising that the API
would evolve as our understanding of the problem space evolves.  The Kubernetes
API is actually a set of APIs, called “API groups”, and each API group is
versioned independently.  [API versions](http://kubernetes.io/docs/api/)
fall into 3 main tracks, each of which has different policies for deprecation:

| Example  | Track                            |
|----------|----------------------------------|
| v1       | GA (generally available, stable) |
| v1beta1  | Beta (pre-release)               |
| v1alpha1 | Alpha (experimental)             |

A given release of Kubernetes can support any number of API groups and any
number of versions of each.

The following rules govern the deprecation of elements of the API.  This
includes:
   * REST resources (aka API objects)
   * Fields of REST resources
   * Enumerated or constant values
These rules are enforced between official releases, not between
arbitrary commits to master or release branches.

Rule #1: API elements may only be removed by incrementing the version of the
API group.

Once an API element has been added to an API group at a particular version, it
can not be removed from that version, regardless of track.

Note: For historical reasons, we have 2 “monolithic” API groups - “core” (no
group name) and “extensions”.  We will incrementally move resources from these
legacy API groups into more domain-specific API groups.

Rule #2: API objects must be able to round-trip between API versions in a given
release without information loss, with the exception of whole REST resources
that do not exist in some versions.

For example, an object can be written as v1 and then read back as v2 and
converted to v1, and the resulting v1 resource will be identical to the
original.  The representation in v2 might be different from v1, but the system
knows how to convert between them in both directions.

Rule #3: Other than the “current” API version, older API versions must be
supported after their announced deprecation for a duration of no less than:
   * GA: 1 year or 2 releases (whichever is longer)
   * Beta: 3 months or 1 release (whichever is longer)
   * Alpha: 0 releases

This is best illustrated by example.  Imagine a Kubernetes release, version X,
which supports a particular API group.  A new Kubernetes release is made every
3 months (4 per year).  The following table describes which API versions are
supported in a series of subsequent releases.

| Release | API versions | Notes |
|---------|--------------|-------|
| X       | v1           |       |
| X+1     | v1, v2alpha1 |       |
| X+2     | v1, v2alpha2 | * v2alpha1 is removed, “action required” relnote |
| X+3     | v1, v2beta1  | * v2alpha2 is removed, “action required” relnote |
| X+4     | v1, v2beta1, v2beta2 | * v2beta1 is deprecated, “action required” relnote |
| X+5     | v1, v2, v2beta2      | * v2beta1 is removed, “action required” relnote<br> * v2beta2 is deprecated, “action required” relnote<br> * v1 is deprecated, “action required” relnote |
| X+6     | v1, v2               | * v2beta2 is removed, “action required” relnote |
| X+7     | v1, v2               | |
| X+8     | v1, v2               | |
| X+9     | v2                   | * v1 is removed, “action required” relnote |

### REST resources (aka API objects)

Consider a hypothetical REST resource named Widget, which was present in API v1
in the above timeline, and which we want to deprecate.  We [document](http://kubernetes.io/docs/deprecated/)
and [announce](https://groups.google.com/forum/#!forum/kubernetes-announce) the
deprecation in sync with release X+1.  The Widget resource still exists in API
version v1 (deprecated) but not in v2alpha1.  The Widget resource continues to
exist and function in releases up to and including X+8.  Only in release X+9,
when API v1 has aged out, does the Widget resource cease to exist, and the
behavior get removed.

### Fields of REST resources

As with whole REST resources, an individual field which was present in API v1
must exist and function until API v1 is removed.  Unlike whole resources, the
v2 APIs may choose a different representation for the field, as long as it can
be round-tripped.  For example a v1 field named “magnitude” which was
deprecated might be named “deprecatedMagnitude” in API v2.  When v1 is
eventually removed, the deprecated field can be removed from v2.

### Enumerated or constant values

As with whole REST resources and fields thereof, a constant value which was
supported in API v1 must exist and function until API v1 is removed.

### Future work

We intend to introduce more fine-grained API versions, at which point we will
adjust these rules as needed.

## Deprecating a flag or CLI

The Kubernetes system is comprised of several different programs cooperating.
Sometimes, we need to remove flags or CLI commands (collectively “CLI
elements”) in these programs.  The individual programs naturally sort into two
main groups - user-facing and admin-facing programs, which vary slightly in
their deprecation policies.  Unless a flag is explicitly prefixed “alpha” or
“beta”, it is considered GA.

CLI elements are effectively part of the API to the system, but since they are
not versioned in the same way as the REST API, the rules for deprecation are as
follows:

Rule #4a: CLI elements of user-facing components (e.g. kubectl) must function
after their announced deprecation for no less than:
   * GA: 1 year or 2 releases (whichever is longer)
   * Beta: 3 months or 1 release (whichever is longer)
   * Alpha: 0 releases

Rule #4b: CLI elements of admin-facing components (e.g. kubelet) must function
after their announced deprecation for no less than:
   * GA: 6 months or 1 release (whichever is longer)
   * Beta: 3 months or 1 release (whichever is longer)
   * Alpha: 0 releases

Rule #5: Deprecated CLI elements must emit warnings (optionally disableable)
when used.

## Deprecating a feature or behavior

Occasionally we need to deprecate some feature or behavior of the system that
is not controlled by the API or CLI.  In this case, the rules for deprecation
are as follows:

Rule #6: Deprecated behaviors must function for no less than 1 year after their
announced deprecation.

This does not imply that all changes to the system are governed by this policy.  This applies only to significant, user-visible behaviors which impact the correctness of applications running on Kubernetes or that impact the administration of Kubernetes clusters, and which are being removed entirely.

## Exceptions

No policy can cover every possible situation.  This policy is a living
document, and will evolve over time.  In practice, we expect to find situations
that do not fit neatly into this policy, or for which this policy becomes a
serious impediment.  Such situations should be discussed with SIGs and project
leaders to find the best solutions for those specific cases, always bearing in
mind that Kubernetes is committed to being a stable system that, as much as
possible, never breaks users. Exceptions will always be announced in all
relevant release notes.
