---

title: Kubernetes Security and Disclosure Information
aliases: [/security/]
approvers:
- eparis
- erictune
- philips
- jessfraz
---

## Security Announcements

Join the [kubernetes-announce](https://groups.google.com/forum/#!forum/kubernetes-announce) group for emails about security and major API announcements.

## Report a Vulnerability

We’re extremely grateful for security researchers and users that report vulnerabilities to the Kubernetes Open Source Community. All reports are thoroughly investigated by a set of community volunteers.

To make a report, please email the private [kubernetes-security@googlegroups.com](mailto:kubernetes-security@googlegroups.com) list with the security details and the details expected for [all Kubernetes bug reports](https://git.k8s.io/kubernetes/.github/ISSUE_TEMPLATE.md).

You may encrypt your email to this list using the GPG keys of the [Product Security Team members](https://git.k8s.io/sig-release/security-release-process-documentation/security-release-process.md#product-security-team-pst). Encryption using GPG is NOT required to make a disclosure.

### When Should I Report a Vulnerability?

- You think you discovered a potential security vulnerability in Kubernetes
- You are unsure how a vulnerability affects Kubernetes
- You think you discovered a vulnerability in another project that Kubernetes depends on (e.g. docker, rkt, etcd)

### When Should I NOT Report a Vulnerability?

- You need help tuning Kubernetes components for security
- You need help applying security related updates
- Your issue is not security related

## Security Vulnerability Response

Each report is acknowledged and analyzed by Product Security Team members within 3 working days. This will set off the [Security Release Process](https://git.k8s.io/sig-release/security-release-process-documentation/security-release-process.md#disclosures).

Any vulnerability information shared with Product Security Team stays within Kubernetes project and will not be disseminated to other projects unless it is necessary to get the issue fixed.

As the security issue moves from triage, to identified fix, to release planning we will keep the reporter updated.

## Public Disclosure Timing

A public disclosure date is negotiated by the Kubernetes product security team and the bug submitter. We prefer to fully disclose the bug as soon as possible once a user mitigation is available. It is reasonable to delay disclosure when the bug or the fix is not yet fully understood, the solution is not well-tested, or for vendor coordination. The timeframe for disclosure is from immediate (especially if it's already publicly known) to a few weeks. As a basic default, we expect report date to disclosure date to be on the order of 7 days. The Kubernetes product security team holds the final say when setting a disclosure date.
