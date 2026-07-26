---
layout: blog
title: "Introducing the Windows Operational Readiness Specification"
date: 2024-04-03
slug: intro-windows-ops-readiness
author: >
  Jay Vyas (Tesla),
  Amim Knabben (Broadcom),
  Tatenda Zifudzi (AWS)
---

Since Windows support [graduated to stable](/blog/2019/03/25/kubernetes-1-14-release-announcement/)
with Kubernetes 1.14 in 2019, the capability to run Windows workloads has been much
appreciated by the end user community. The level of and availability of Windows workload
support has consistently been a major differentiator for Kubernetes distributions used by
large enterprises. However, with more Windows workloads being migrated to Kubernetes
and new Windows features being continuously released, it became challenging to test
Windows worker nodes in an effective and standardized way.

The Kubernetes project values the ability to certify conformance without requiring a 
closed-source license for a certified distribution or service that has no intention 
of offering Windows.

Some notable examples brought to the attention of SIG Windows were:

- An issue with load balancer source address ranges functionality not operating correctly on
  Windows nodes, detailed in a GitHub issue:
  [kubernetes/kubernetes#120033](https://github.com/kubernetes/kubernetes/issues/120033).
- Reports of functionality issues with Windows features, such as
  “[GMSA](https://learn.microsoft.com/en-us/windows-server/security/group-managed-service-accounts/group-managed-service-accounts-overview) not working with containerd,
  discussed in [microsoft/Windows-Containers#44](https://github.com/microsoft/Windows-Containers/issues/44).
- Challenges developing networking policy tests that could objectively evaluate
  Container Network Interface (CNI) plugins across different operating system configurations,
  as discussed in [kubernetes/kubernetes#97751](https://github.com/kubernetes/kubernetes/issues/97751).

SIG Windows therefore recognized the need for a tailored solution to ensure Windows
nodes' operational readiness *before* their deployment into production environments.
Thus, the idea to develop a [Windows Operational Readiness Specification](https://kep.k8s.io/2578)
was born.

## Can’t we just run the official Conformance tests?

The Kubernetes project contains a set of [conformance tests](https://www.cncf.io/training/certification/software-conformance/#how), 
which are standardized tests designed to ensure that a Kubernetes cluster meets 
the required Kubernetes specifications.

However, these tests were originally defined at a time when Linux was the *only* 
operating system compatible with Kubernetes, and thus, they were not easily 
extendable for use with Windows. Given that Windows workloads, despite their 
importance, account for a smaller portion of the Kubernetes community, it was 
important to ensure that the primary conformance suite relied upon by many 
Kubernetes distributions to certify Linux conformance, didn't become encumbered 
with Windows specific features or enhancements such as GMSA or multi-operating 
system kube-proxy behavior.

Therefore, since there was a specialized need for Windows conformance testing, 
SIG Windows went down the path of offering Windows specific conformance tests 
through the Windows Operational Readiness Specification.

## Can’t we just run the Kubernetes end-to-end test suite?

In the Linux world, tools such as [Sonobuoy](https://sonobuoy.io/) simplify execution of the 
conformance suite, relieving users from needing to be aware of Kubernetes' 
compilation paths or the semantics of [Ginkgo](https://onsi.github.io/ginkgo) tags.

Regarding needing to compile the Kubernetes tests, we realized that Windows 
users might similarly find the process of compiling and running the Kubernetes 
e2e suite from scratch similarly undesirable, hence, there was a clear need to 
provide a user-friendly, "push-button" solution that is ready to go. Moreover, 
regarding Ginkgo tags, applying conformance tests to Windows nodes through a set 
of [Ginkgo](https://onsi.github.io/ginkgo/) tags would also be burdensome for 
any user, including Linux enthusiasts or experienced Windows system admins alike.

To bridge the gap and give users a straightforward way to confirm their clusters 
support a variety of features, the Kubernetes SIG for Windows found it necessary to 
therefore create the Windows Operational Readiness application. This application 
written in Go, simplifies the process to run the necessary Windows specific tests 
while delivering results in a clear, accessible format.

This initiative has been a collaborative effort, with contributions from different 
cloud providers and platforms, including Amazon, Microsoft, SUSE, and Broadcom.

## A closer look at the Windows Operational Readiness Specification {#specification}

The Windows Operational Readiness specification specifically targets and executes 
tests found within the Kubernetes repository in a more user-friendly way than 
simply targeting [Ginkgo](https://onsi.github.io/ginkgo/) tags. It introduces a 
structured test suite that is split into sets of core and extended tests, with 
each set of tests containing categories directed at testing a specific area of 
testing, such as networking. Core tests target fundamental and critical 
functionalities that Windows nodes should support as defined by the Kubernetes 
specification. On the other hand, extended tests cover more complex features, 
more aligned with diving deeper into Windows-specific capabilities such as 
integrations with Active Directory. These goal of these tests is to be extensive, 
covering a wide array of Windows-specific capabilities to ensure compatibility 
with a diverse set of workloads and configurations, extending beyond basic 
requirements. Below is the current list of categories.

| Category Name            | Category Description                                                                                                                |
|--------------------------|-------------------------------------------------------------------------------------------------------------------------------------|
| `Core.Network`           | Tests minimal networking functionality (ability to access pod-by-pod IP.)                                                           |
| `Core.Storage`           | Tests minimal storage functionality, (ability to mount a hostPath storage volume.)                                                  |
| `Core.Scheduling`        | Tests minimal scheduling functionality, (ability to schedule a pod with CPU limits.)                                                |
| `Core.Concurrent`        | Tests minimal concurrent functionality, (the ability of a node to handle traffic to multiple pods concurrently.)                    |
| `Extend.HostProcess`     | Tests features related to Windows HostProcess pod functionality.                                                                    |
| `Extend.ActiveDirectory` | Tests features related to Active Directory functionality.                                                                           |
| `Extend.NetworkPolicy`   | Tests features related to Network Policy functionality.                                                                             |
| `Extend.Network`         | Tests advanced networking functionality, (ability to support IPv6)                                                                  |
| `Extend.Worker`          | Tests features related to Windows worker node functionality, (ability for nodes to access TCP and UDP services in the same cluster) |

## How to conduct operational readiness tests for Windows nodes

To run the Windows Operational Readiness test suite, refer to the test suite's
[`README`](https://github.com/kubernetes-sigs/windows-operational-readiness/blob/main/README.md), which explains how to set it up and run it. The test suite offers 
flexibility in how you can execute tests, either using a compiled binary or a 
Sonobuoy plugin. You also have the choice to run the tests against the entire 
test suite or by specifying a list of categories. Cloud providers have the 
choice of uploading their conformance results, enhancing transparency and reliability.

Once you have checked out that code, you can run a test. For example, this sample 
command runs the tests from the `Core.Concurrent` category:

```shell
./op-readiness --kubeconfig $KUBE_CONFIG --category Core.Concurrent
```

As a contributor to Kubernetes, if you want to test your changes against a specific pull 
request using the Windows Operational Readiness Specification, use the following bot 
command in the new pull request.

```shell
/test operational-tests-capz-windows-2019
```

## Looking ahead

We’re looking to improve our curated list of Windows-specific tests by adding 
new tests to the Kubernetes repository and also identifying existing test cases 
that can be targetted. The long term goal for the specification is to continually 
enhance test coverage for Windows worker nodes and improve the robustness of 
Windows support, facilitating a seamless experience across diverse cloud 
environments. We also have plans to integrate the Windows Operational Readiness 
tests into the official Kubernetes conformance suite.

If you are interested in helping us out, please reach out to us! We welcome help 
in any form, from giving once-off feedback to making a code contribution, 
to having long-term owners to help us drive changes. The Windows Operational 
Readiness specification is owned by the SIG Windows team. You can reach out 
to the team on the [Kubernetes Slack workspace](https://slack.k8s.io/) **#sig-windows** 
channel. You can also explore the [Windows Operational Readiness test suite](https://github.com/kubernetes-sigs/windows-operational-readiness/#readme) 
and make contributions directly to the GitHub repository.

Special thanks to Kulwant Singh (AWS), Pramita Gautam Rana (VMWare), Xinqi Li 
(Google) and Marcio Morales (AWS) for their help in making notable contributions to the specification. Additionally, 
appreciation goes to James Sturtevant (Microsoft), Mark Rossetti (Microsoft), 
Claudiu Belu (Cloudbase Solutions) and Aravindh Puthiyaparambil 
(Softdrive Technologies Group Inc.) from the SIG Windows team for their guidance and support.