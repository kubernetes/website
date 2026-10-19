---
title: Kubernetes Security and Disclosure Information
aliases: [/security/]
reviewers:
- eparis
- erictune
- philips
- jessfraz
content_type: concept
weight: 20
---

<!-- overview -->
This page describes Kubernetes security and disclosure information.

<!-- body -->
## Security Announcements

Join the [kubernetes-security-announce](https://groups.google.com/forum/#!forum/kubernetes-security-announce)
group for emails about security and major API announcements.

## Report a Vulnerability

We're extremely grateful for security researchers and users that report vulnerabilities to
the Kubernetes Open Source Community. All reports are thoroughly investigated by a set of community volunteers.

To make a report, submit your vulnerability to the [Kubernetes bug bounty program](https://hackerone.com/kubernetes).
This allows triage and handling of the vulnerability with standardized response times.

You can also email the private [security@kubernetes.io](mailto:security@kubernetes.io)
list with the security details and the details expected for
[all Kubernetes bug reports](https://github.com/kubernetes/kubernetes/blob/master/.github/ISSUE_TEMPLATE/bug-report.yaml).

You may encrypt your email to this list using the GPG keys of the
[Security Response Committee members](https://git.k8s.io/security/README.md#product-security-committee-psc).
Encryption using GPG is NOT required to make a disclosure.

### When Should I Report a Vulnerability?

- You think you discovered a potential security vulnerability in Kubernetes
- You are unsure how a vulnerability affects Kubernetes
- You think you discovered a vulnerability in another project that Kubernetes depends on
  - For projects with their own vulnerability reporting and disclosure process, please report it directly there

### When Should I NOT Report a Vulnerability?

- You need help tuning Kubernetes components for security
- You need help applying security related updates
- Your issue is not security related

## Security Vulnerability Response

Each report is acknowledged and analyzed by Security Response Committee members within 3 working days.
This will set off the [Security Release Process](https://git.k8s.io/security/security-release-process.md#disclosures).

Any vulnerability information shared with Security Response Committee stays within Kubernetes project
and will not be disseminated to other projects unless it is necessary to get the issue fixed.

As the security issue moves from triage, to identified fix, to release planning we will keep the reporter updated.

## Public Disclosure Timing

A public disclosure date is negotiated by the Kubernetes Security Response Committee and the bug submitter.
We prefer to fully disclose the bug as soon as possible once a user mitigation is available. It is reasonable
to delay disclosure when the bug or the fix is not yet fully understood, the solution is not well-tested,
or for vendor coordination. The timeframe for disclosure is from immediate (especially if it's already publicly known)
to a few weeks. For a vulnerability with a straightforward mitigation, we expect report date to disclosure date
to be on the order of 7 days. The Kubernetes Security Response Committee holds the final say when setting a disclosure date.
