---
reviewers:
- bgrant0607
- lavalamp
- thockin
title: Kubernetes Deprecation Policy
weight: 40
---

Kubernetes is a large system with many components and many contributors.  As
with any such software, the feature set naturally evolves over time, and
sometimes a feature may need to be removed. This could include an API, a flag,
or even an entire feature. To avoid breaking existing users, Kubernetes follows
a deprecation policy for aspects of the system that are slated to be removed.

This document details the deprecation policy for various facets of the system.

## Deprecating parts of the API

Since Kubernetes is an API-driven system, the API has evolved over time to
reflect the evolving understanding of the problem space. The Kubernetes API is
actually a set of APIs, called "API groups", and each API group is
independently versioned.  [API versions](/docs/reference/using-api/api-overview/#api-versioning) fall
into 3 main tracks, each of which has different policies for deprecation:

| Example  | Track                            |
|----------|----------------------------------|
| v1       | GA (generally available, stable) |
| v1beta1  | Beta (pre-release)               |
| v1alpha1 | Alpha (experimental)             |

A given release of Kubernetes can support any number of API groups and any
number of versions of each.

The following rules govern the deprecation of elements of the API.  This
includes:

   * REST resources (aka API objects)
   * Fields of REST resources
   * Annotations on REST resources, including "beta" annotations but not
     including "alpha" annotations.
   * Enumerated or constant values
   * Component config structures

These rules are enforced between official releases, not between
arbitrary commits to master or release branches.

**Rule #1: API elements may only be removed by incrementing the version of the
API group.**

Once an API element has been added to an API group at a particular version, it
can not be removed from that version or have its behavior significantly
changed, regardless of track.

Note: For historical reasons, there are 2 "monolithic" API groups - "core" (no
group name) and "extensions".  Resources will incrementally be moved from these
legacy API groups into more domain-specific API groups.

**Rule #2: API objects must be able to round-trip between API versions in a given
release without information loss, with the exception of whole REST resources
that do not exist in some versions.**

For example, an object can be written as v1 and then read back as v2 and
converted to v1, and the resulting v1 resource will be identical to the
original.  The representation in v2 might be different from v1, but the system
knows how to convert between them in both directions.  Additionally, any new
field added in v2 must be able to round-trip to v1 and back, which means v1
might have to add an equivalent field or represent it as an annotation.

**Rule #3: An API version in a given track may not be deprecated until a new
API version at least as stable is released.**

GA API versions can replace GA API versions as well as beta and alpha API
versions.  Beta API versions *may not* replace GA API versions.

**Rule #4a: Other than the most recent API versions in each track, older API
versions must be supported after their announced deprecation for a duration of
no less than:**

   * **GA: 12 months or 3 releases (whichever is longer)**
   * **Beta: 9 months or 3 releases (whichever is longer)**
   * **Alpha: 0 releases**

This covers the maximum supported version skew of 2 releases.

NOTE: Until [#52185](https://github.com/kubernetes/kubernetes/issues/52185) is
resolved, no API versions that have been persisted to storage may be removed. 
Serving REST endpoints for those versions may be disabled (subject to the 
deprecation timelines in this document), but the API server must remain capable 
of decoding/converting previously persisted data from storage.

**Rule #4b: The "preferred" API version and the "storage version" for a given
group may not advance until after a release has been made that supports both the
new version and the previous version**

Users must be able to upgrade to a new release of Kubernetes and then roll back
to a previous release, without converting anything to the new API version or
suffering breakages (unless they explicitly used features only available in the
newer version).  This is particularly evident in the stored representation of
objects.

All of this is best illustrated by examples.  Imagine a Kubernetes release,
version X, which introduces a new API group.  A new Kubernetes release is made
every approximately 3 months (4 per year).  The following table describes which
API versions are supported in a series of subsequent releases.

<table>
  <thead>
    <tr>
      <th>Release</th>
      <th>API Versions</th>
      <th>Preferred/Storage Version</th>
      <th>Notes</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>X</td>
      <td>v1alpha1</td>
      <td>v1alpha1</td>
      <td></td>
    </tr>
    <tr>
      <td>X+1</td>
      <td>v1alpha2</td>
      <td>v1alpha2</td>
      <td>
        <ul>
           <li>v1alpha1 is removed, "action required" relnote</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>X+2</td>
      <td>v1beta1</td>
      <td>v1beta1</td>
      <td>
        <ul>
          <li>v1alpha2 is removed, "action required" relnote</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>X+3</td>
      <td>v1beta2, v1beta1 (deprecated)</td>
      <td>v1beta1</td>
      <td>
        <ul>
          <li>v1beta1 is deprecated, "action required" relnote</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>X+4</td>
      <td>v1beta2, v1beta1 (deprecated)</td>
      <td>v1beta2</td>
      <td></td>
    </tr>
    <tr>
      <td>X+5</td>
      <td>v1, v1beta1 (deprecated), v1beta2 (deprecated)</td>
      <td>v1beta2</td>
      <td>
        <ul>
          <li>v1beta2 is deprecated, "action required" relnote</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>X+6</td>
      <td>v1, v1beta2 (deprecated)</td>
      <td>v1</td>
      <td>
        <ul>
          <li>v1beta1 is removed, "action required" relnote</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>X+7</td>
      <td>v1, v1beta2 (deprecated)</td>
      <td>v1</td>
      <td></td>
    </tr>
    <tr>
      <td>X+8</td>
      <td>v2alpha1, v1</td>
      <td>v1</td>
      <td>
        <ul>
          <li>v1beta2 is removed, "action required" relnote</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>X+9</td>
      <td>v2alpha2, v1</td>
      <td>v1</td>
      <td>
        <ul>
           <li>v2alpha1 is removed, "action required" relnote</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>X+10</td>
      <td>v2beta1, v1</td>
      <td>v1</td>
      <td>
        <ul>
          <li>v2alpha2 is removed, "action required" relnote</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>X+11</td>
      <td>v2beta2, v2beta1 (deprecated), v1</td>
      <td>v1</td>
      <td>
        <ul>
          <li>v2beta1 is deprecated, "action required" relnote</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>X+12</td>
      <td>v2, v2beta2 (deprecated), v2beta1 (deprecated), v1 (deprecated)</td>
      <td>v1</td>
      <td>
        <ul>
          <li>v2beta2 is deprecated, "action required" relnote</li>
          <li>v1 is deprecated, "action required" relnote</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>X+13</td>
      <td>v2, v2beta1 (deprecated), v2beta2 (deprecated), v1 (deprecated)</td>
      <td>v2</td>
      <td></td>
    </tr>
    <tr>
      <td>X+14</td>
      <td>v2, v2beta2 (deprecated), v1 (deprecated)</td>
      <td>v2</td>
      <td>
        <ul>
          <li>v2beta1 is removed, "action required" relnote</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>X+15</td>
      <td>v2, v1 (deprecated)</td>
      <td>v2</td>
      <td>
        <ul>
          <li>v2beta2 is removed, "action required" relnote</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>X+16</td>
      <td>v2, v1 (deprecated)</td>
      <td>v2</td>
      <td></td>
    </tr>
    <tr>
      <td>X+17</td>
      <td>v2</td>
      <td>v2</td>
      <td>
        <ul>
          <li>v1 is removed, "action required" relnote</li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

### REST resources (aka API objects)

Consider a hypothetical REST resource named Widget, which was present in API v1
in the above timeline, and which needs to be deprecated.  We
[document](/docs/reference/deprecation-policy/) and
[announce](https://groups.google.com/forum/#!forum/kubernetes-announce) the
deprecation in sync with release X+1.  The Widget resource still exists in API
version v1 (deprecated) but not in v2alpha1.  The Widget resource continues to
exist and function in releases up to and including X+8.  Only in release X+9,
when API v1 has aged out, does the Widget resource cease to exist, and the
behavior get removed.

### Fields of REST resources

As with whole REST resources, an individual field which was present in API v1
must exist and function until API v1 is removed.  Unlike whole resources, the
v2 APIs may choose a different representation for the field, as long as it can
be round-tripped.  For example a v1 field named "magnitude" which was
deprecated might be named "deprecatedMagnitude" in API v2.  When v1 is
eventually removed, the deprecated field can be removed from v2.

### Enumerated or constant values

As with whole REST resources and fields thereof, a constant value which was
supported in API v1 must exist and function until API v1 is removed.

### Component config structures

Component configs are versioned and managed just like REST resources.

### Future work

Over time, Kubernetes will introduce more fine-grained API versions, at which
point these rules will be adjusted as needed.

## Deprecating a flag or CLI

The Kubernetes system is comprised of several different programs cooperating.
Sometimes, a Kubernetes release might remove flags or CLI commands
(collectively "CLI elements") in these programs.  The individual programs
naturally sort into two main groups - user-facing and admin-facing programs,
which vary slightly in their deprecation policies.  Unless a flag is explicitly
prefixed or documented as "alpha" or "beta", it is considered GA.

CLI elements are effectively part of the API to the system, but since they are
not versioned in the same way as the REST API, the rules for deprecation are as
follows:

**Rule #5a: CLI elements of user-facing components (e.g. kubectl) must function
after their announced deprecation for no less than:**

   * **GA: 12 months or 2 releases (whichever is longer)**
   * **Beta: 3 months or 1 release (whichever is longer)**
   * **Alpha: 0 releases**

**Rule #5b: CLI elements of admin-facing components (e.g. kubelet) must function
after their announced deprecation for no less than:**

   * **GA: 6 months or 1 release (whichever is longer)**
   * **Beta: 3 months or 1 release (whichever is longer)**
   * **Alpha: 0 releases**

**Rule #6: Deprecated CLI elements must emit warnings (optionally disable)
when used.**

## Deprecating a feature or behavior

Occasionally a Kubernetes release needs to deprecate some feature or behavior
of the system that is not controlled by the API or CLI.  In this case, the
rules for deprecation are as follows:

**Rule #7: Deprecated behaviors must function for no less than 1 year after their
announced deprecation.**

This does not imply that all changes to the system are governed by this policy.
This applies only to significant, user-visible behaviors which impact the
correctness of applications running on Kubernetes or that impact the
administration of Kubernetes clusters, and which are being removed entirely.

## Exceptions

No policy can cover every possible situation.  This policy is a living
document, and will evolve over time.  In practice, there will be situations
that do not fit neatly into this policy, or for which this policy becomes a
serious impediment.  Such situations should be discussed with SIGs and project
leaders to find the best solutions for those specific cases, always bearing in
mind that Kubernetes is committed to being a stable system that, as much as
possible, never breaks users. Exceptions will always be announced in all
relevant release notes.
