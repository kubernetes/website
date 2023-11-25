---
title: Release Managers
type: docs
---

"Release Managers" is an umbrella term that encompasses the set of Kubernetes
contributors responsible for maintaining release branches and creating releases
by using the tools SIG Release provides.

The responsibilities of each role are described below.

- [Contact](#contact)
  - [Security Embargo Policy](#security-embargo-policy)
- [Handbooks](#handbooks)
- [Release Managers](#release-managers)
  - [Becoming a Release Manager](#becoming-a-release-manager)
- [Release Manager Associates](#release-manager-associates)
  - [Becoming a Release Manager Associate](#becoming-a-release-manager-associate)
- [SIG Release Leads](#sig-release-leads)
  - [Chairs](#chairs)
  - [Technical Leads](#technical-leads)

## Contact

| Mailing List | Slack | Visibility | Usage | Membership |
| --- | --- | --- | --- | --- |
| [release-managers@kubernetes.io](mailto:release-managers@kubernetes.io) | [#release-management](https://kubernetes.slack.com/messages/CJH2GBF7Y) (channel) / @release-managers (user group) | Public | Public discussion for Release Managers | All Release Managers (including Associates, and SIG Chairs) |
| [release-managers-private@kubernetes.io](mailto:release-managers-private@kubernetes.io) | N/A | Private | Private discussion for privileged Release Managers | Release Managers, SIG Release leadership |
| [security-release-team@kubernetes.io](mailto:security-release-team@kubernetes.io) | [#security-release-team](https://kubernetes.slack.com/archives/G0162T1RYHG) (channel) / @security-rel-team (user group) | Private | Security release coordination with the Security Response Committee | [security-discuss-private@kubernetes.io](mailto:security-discuss-private@kubernetes.io), [release-managers-private@kubernetes.io](mailto:release-managers-private@kubernetes.io) |

### Security Embargo Policy

Some information about releases is subject to embargo and we have defined policy about
how those embargoes are set. Please refer to the
[Security Embargo Policy](https://github.com/kubernetes/committee-security-response/blob/main/private-distributors-list.md#embargo-policy)
for more information.

## Handbooks

**NOTE: The Patch Release Team and Branch Manager handbooks will be de-duplicated at a later date.**

- [Patch Release Team][handbook-patch-release]
- [Branch Managers][handbook-branch-mgmt]

## Release Managers

**Note:** The documentation might refer to the Patch Release Team and the
Branch Management role. Those two roles were consolidated into the
Release Managers role.

Minimum requirements for Release Managers and Release Manager Associates are:

- Familiarity with basic Unix commands and able to debug shell scripts.
- Familiarity with branched source code workflows via `git` and associated
  `git` command line invocations.
- General knowledge of Google Cloud (Cloud Build and Cloud Storage).
- Open to seeking help and communicating clearly.
- Kubernetes Community [membership][community-membership]

Release Managers are responsible for:

- Coordinating and cutting Kubernetes releases:
  - Patch releases (`x.y.z`, where `z` > 0)
  - Minor releases (`x.y.z`, where `z` = 0)
  - Pre-releases (alpha, beta, and release candidates)
  - Working with the [Release Team][release-team] through each
  release cycle
  - Setting the [schedule and cadence for patch releases][patches]
- Maintaining the release branches:
  - Reviewing cherry picks
  - Ensuring the release branch stays healthy and that no unintended patch
    gets merged
- Mentoring the [Release Manager Associates](#release-manager-associates) group
- Actively developing features and maintaining the code in k/release
- Supporting Release Manager Associates and contributors through actively
  participating in the Buddy program
  - Check in monthly with Associates and delegate tasks, empower them to cut
    releases, and mentor
  - Being available to support Associates in onboarding new contributors e.g.,
    answering questions and suggesting appropriate work for them to do

This team at times works in close conjunction with the
[Security Response Committee][src] and therefore should abide by the guidelines
set forth in the [Security Release Process][security-release-process].

GitHub Access Controls: [@kubernetes/release-managers](https://github.com/orgs/kubernetes/teams/release-managers)

GitHub Mentions: [@kubernetes/release-engineering](https://github.com/orgs/kubernetes/teams/release-engineering)

- Adolfo García Veytia ([@puerco](https://github.com/puerco))
- Cici Huang ([@cici37](https://github.com/cici37))
- Carlos Panato ([@cpanato](https://github.com/cpanato))
- Jeremy Rickard ([@jeremyrickard](https://github.com/jeremyrickard))
- Marko Mudrinić ([@xmudrii](https://github.com/xmudrii))
- Nabarun Pal ([@palnabarun](https://github.com/palnabarun))
- Sascha Grunert ([@saschagrunert](https://github.com/saschagrunert))
- Stephen Augustus ([@justaugustus](https://github.com/justaugustus))
- Verónica López ([@verolop](https://github.com/verolop))

### Becoming a Release Manager

To become a Release Manager, one must first serve as a Release Manager
Associate. Associates graduate to Release Manager by actively working on
releases over several cycles and:

- demonstrating the willingness to lead
- tag-teaming with Release Managers on patches, to eventually cut a release
  independently
  - because releases have a limiting function, we also consider substantial
    contributions to image promotion and other core Release Engineering tasks
- questioning how Associates work, suggesting improvements, gathering feedback,
  and driving change
- being reliable and responsive
- leaning into advanced work that requires Release Manager-level access and
  privileges to complete

## Release Manager Associates

Release Manager Associates are apprentices to the Release Managers, formerly
referred to as Release Manager shadows. They are responsible for:

- Patch release work, cherry pick review
- Contributing to k/release: updating dependencies and getting used to the
  source codebase
- Contributing to the documentation: maintaining the handbooks, ensuring that
  release processes are documented
- With help from a release manager: working with the Release Team during the
  release cycle and cutting Kubernetes releases
- Seeking opportunities to help with prioritization and communication
  - Sending out pre-announcements and updates about patch releases
  - Updating the calendar, helping with the release dates and milestones from
    the [release cycle timeline][k-sig-release-releases]
- Through the Buddy program, onboarding new contributors and pairing up with
  them on tasks

GitHub Mentions: @kubernetes/release-engineering

- Arnaud Meukam ([@ameukam](https://github.com/ameukam))
- Jim Angel ([@jimangel](https://github.com/jimangel))
- Joseph Sandoval ([@jrsapi](https://github.com/jrsapi))
- Xander Grzywinski([@salaxander](https://github.com/salaxander))

### Becoming a Release Manager Associate

Contributors can become Associates by demonstrating the following:

- consistent participation, including 6-12 months of active release
  engineering-related work
- experience fulfilling a technical lead role on the Release Team during a
  release cycle
  - this experience provides a solid baseline for understanding how SIG Release
    works overall—including our expectations regarding technical skills,
    communications/responsiveness, and reliability
- working on k/release items that improve our interactions with Testgrid,
  cleaning up libraries, etc.
  - these efforts require interacting and pairing with Release Managers and
    Associates

## SIG Release Leads

SIG Release Chairs and Technical Leads are responsible for:

- The governance of SIG Release
- Leading knowledge exchange sessions for Release Managers and Associates
- Coaching on leadership and prioritization

They are mentioned explicitly here as they are owners of the various
communications channels and permissions groups (GitHub teams, GCP access) for
each role. As such, they are highly privileged community members and privy to
some private communications, which can at times relate to Kubernetes security
disclosures.

GitHub team: [@kubernetes/sig-release-leads](https://github.com/orgs/kubernetes/teams/sig-release-leads)

### Chairs

- Jeremy Rickard ([@jeremyrickard](https://github.com/jeremyrickard))
- Sascha Grunert ([@saschagrunert](https://github.com/saschagrunert))
- Stephen Augustus ([@justaugustus](https://github.com/justaugustus))

### Technical Leads

- Adolfo García Veytia ([@puerco](https://github.com/puerco))
- Carlos Panato ([@cpanato](https://github.com/cpanato))
- Verónica López ([@verolop](https://github.com/verolop))

---

Past Branch Managers, can be found in the [releases directory][k-sig-release-releases]
of the kubernetes/sig-release repository within `release-x.y/release_team.md`.

Example: [1.15 Release Team](https://git.k8s.io/sig-release/releases/release-1.15/release_team.md)

[community-membership]: https://git.k8s.io/community/community-membership.md#member
[handbook-branch-mgmt]: https://git.k8s.io/sig-release/release-engineering/role-handbooks/branch-manager.md
[handbook-patch-release]: https://git.k8s.io/sig-release/release-engineering/role-handbooks/patch-release-team.md
[k-sig-release-releases]: https://git.k8s.io/sig-release/releases
[patches]: /releases/patch-releases/
[src]: https://git.k8s.io/community/committee-security-response/README.md
[release-team]: https://git.k8s.io/sig-release/release-team/README.md
[security-release-process]: https://git.k8s.io/security/security-release-process.md
