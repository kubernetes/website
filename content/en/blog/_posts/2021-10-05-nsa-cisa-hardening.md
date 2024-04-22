---
layout: blog
title: A Closer Look at NSA/CISA Kubernetes Hardening Guidance
date: 2021-10-05
slug: nsa-cisa-kubernetes-hardening-guidance
author: >
  Jim Angel (Google),
  Pushkar Joglekar (VMware),
  Savitha Raghunathan (Red Hat)
---

{{% alert title="Disclaimer" %}}
The open source tools listed in this article are to serve as examples only 
and are in no way a direct recommendation from the Kubernetes community or authors.
{{% /alert %}}

## Background

USA's National Security Agency (NSA) and the Cybersecurity and Infrastructure
Security Agency (CISA)
released Kubernetes Hardening Guidance
on August 3rd, 2021. The guidance details threats to Kubernetes environments
and provides secure configuration guidance to minimize risk.

The following sections of this blog correlate to the sections in the NSA/CISA guidance. 
Any missing sections are skipped because of limited opportunities to add 
anything new to the existing content. 

_Note_: This blog post is not a substitute for reading the guide. Reading the published 
guidance is recommended before proceeding as the following content is 
complementary.

{{% pageinfo color="primary" %}}
**Update, November 2023:**

The National Security Agency (NSA) and the Cybersecurity and Infrastructure Security Agency (CISA) released the 1.0 version of the Kubernetes hardening guide in August 2021 and updated it based on industry feedback in March 2022 (version 1.1).

The most recent version of the Kubernetes hardening guidance was released in August 2022 with corrections and clarifications. Version 1.2 outlines a number of recommendations for [hardening Kubernetes clusters](https://media.defense.gov/2022/Aug/29/2003066362/-1/-1/0/CTR_KUBERNETES_HARDENING_GUIDANCE_1.2_20220829.PDF).
{{% /pageinfo %}}

## Introduction and Threat Model

Note that the threats identified as important by the NSA/CISA, or the intended audience of this guidance, may be different from the threats that other enterprise users of Kubernetes consider important. This section 
is still useful for organizations that care about data, resource theft and 
service unavailability.

The guidance highlights the following three sources of compromises:

- Supply chain risks
- Malicious threat actors
- Insider threats (administrators, users, or cloud service providers)

The [threat model](https://en.wikipedia.org/wiki/Threat_model) tries to take a step back and review threats that not only
exist within the boundary of a Kubernetes cluster but also include the underlying
infrastructure and surrounding workloads that Kubernetes does not manage.

For example, when a workload outside the cluster shares the same physical
network, it has access to the kubelet and to control plane components: etcd, controller manager, scheduler and API
server. Therefore, the guidance recommends having network level isolation
separating Kubernetes clusters from other workloads that do not need connectivity
to Kubernetes control plane nodes. Specifically, scheduler, controller-manager,
etcd only need to be accessible to the API server. Any interactions with Kubernetes
from outside the cluster can happen by providing access to API server port.

List of ports and protocols for each of these components are
defined in [Ports and Protocols](/docs/reference/ports-and-protocols/)
within the Kubernetes documentation.

> Special note: kube-scheduler and kube-controller-manager uses different ports than the ones mentioned in the guidance

The [Threat modelling](https://cnsmap.netlify.app/threat-modelling) section
from the CNCF [Cloud Native Security Whitepaper + Map](https://github.com/cncf/tag-security/tree/main/security-whitepaper)
provides another perspective on approaching threat modelling Kubernetes, from a
cloud native lens.

## Kubernetes Pod security

Kubernetes by default does not guarantee strict workload isolation between pods
running in the same node in a cluster. However, the guidance provides several 
techniques to enhance existing isolation and reduce the attack surface in case of a 
compromise.

### "Non-root" containers and "rootless" container engines

Several best practices related to basic security principle of least privilege
i.e. provide only the permissions are needed; no more, no less, are worth a
second look.

The guide recommends setting non-root user at build time instead of relying on
setting `runAsUser` at runtime in your Pod spec. This is a good practice and provides
some level of defense in depth. For example, if the container image is built with user `10001`
and the Pod spec misses adding the `runAsuser` field in its `Deployment` object. In this
case there are certain edge cases that are worth exploring for awareness:

1. Pods can fail to start, if the user defined at build time is different from
   the one defined in pod spec and some files are as a result inaccessible.
2. Pods can end up sharing User IDs unintentionally. This can be problematic
   even if the User IDs are non-zero in a situation where a container escape to
   host file system is possible. Once the attacker has access to the host file
   system, they get access to all the file resources that are owned by other
   unrelated pods that share the same UID.
3. Pods can end up sharing User IDs, with other node level processes not managed
   by Kubernetes e.g. node level daemons for auditing, vulnerability scanning,
   telemetry. The threat is similar to the one above where host file system
   access can give attacker full access to these node level daemons without
   needing to be root on the node.

However, none of these cases will have as severe an impact as a container
running as root being able to escape as a root user on the host, which can provide 
an attacker with complete control of the worker node, further allowing lateral
movement to other worker or control plane nodes.

Kubernetes 1.22 introduced
an [alpha feature](/docs/tasks/administer-cluster/kubelet-in-userns/)
that specifically reduces the impact of such a control plane component running
as root user to a non-root user through user namespaces.

That ([alpha stage](/docs/reference/command-line-tools-reference/feature-gates/#feature-stages)) support for user namespaces / rootless mode is available with
the following container runtimes:

- [Docker Engine](https://docs.docker.com/engine/security/rootless/)
- [Podman](https://developers.redhat.com/blog/2020/09/25/rootless-containers-with-podman-the-basics)

Some distributions support running in rootless mode, like the following:

- [kind](https://kind.sigs.k8s.io/docs/user/rootless/)
- [k3s](https://rancher.com/docs/k3s/latest/en/advanced/#running-k3s-with-rootless-mode-experimental)
- [Usernetes](https://github.com/rootless-containers/usernetes)

### Immutable container filesystems

The NSA/CISA Kubernetes Hardening Guidance highlights an often overlooked feature `readOnlyRootFileSystem`, with a
working example in [Appendix B](https://media.defense.gov/2021/Aug/03/2002820425/-1/-1/1/CTR_KUBERNETES%20HARDENING%20GUIDANCE.PDF#page=42). This example limits execution and tampering of
containers at runtime. Any read/write activity can then be limited to few
directories by using `tmpfs` volume mounts.

However, some applications that modify the container filesystem at runtime, like exploding a WAR or JAR file at container startup, 
could face issues when enabling this feature. To avoid this issue, consider making minimal changes to the filesystem at runtime 
when possible.

### Building secure container images

Kubernetes Hardening Guidance also recommends running a scanner at deploy time as an admission controller,
to prevent vulnerable or misconfigured pods from running in the cluster.
Theoretically, this sounds like a good approach but there are several caveats to
consider before this can be implemented in practice:

- Depending on network bandwidth, available resources and scanner of choice,
  scanning for vulnerabilities for an image can take an indeterminate amount of
  time. This could lead to slower or unpredictable pod start up times, which
  could result in spikes of unavailability when apps are serving peak load.
- If the policy that allows or denies pod startup is made using incorrect or
  incomplete data it could result in several false positive or false negative
  outcomes like the following:
  - inside a container image, the `openssl` package is detected as vulnerable. However,
    the application is written in Golang and uses the Go `crypto` package for TLS. Therefore, this vulnerability
    is not in the code execution path and as such has minimal impact if it
    remains unfixed.
  - A vulnerability is detected in the `openssl` package for a Debian base image.
    However, the upstream Debian community considers this as a Minor impact
    vulnerability and as a result does not release a patch fix for this
    vulnerability. The owner of this image is now stuck with a vulnerability that
    cannot be fixed and a cluster that does not allow the image to run because
    of predefined policy that does not take into account whether the fix for a
    vulnerability is available or not
  - A Golang app is built on top of a [distroless](https://github.com/GoogleContainerTools/distroless)
    image, but it is compiled with a Golang version that uses a vulnerable [standard library](https://pkg.go.dev/std).
    The scanner has
    no visibility into golang version but only on OS level packages. So it 
    allows the pod to run in the cluster in spite of the image containing an 
    app binary built on vulnerable golang.

To be clear, relying on vulnerability scanners is absolutely a good idea but
policy definitions should be flexible enough to allow:

- Creation of exception lists for images or vulnerabilities through labelling
- Overriding the severity with a risk score based on impact of a vulnerability
- Applying the same policies at build time to catch vulnerable images with
  fixable vulnerabilities before they can be deployed into Kubernetes clusters

Special considerations like offline vulnerability database fetch, may also be
needed, if the clusters run in an air-gapped environment and the scanners
require internet access to update the vulnerability database.

### Pod Security Policies

Since Kubernetes v1.21, the [PodSecurityPolicy](/docs/concepts/security/pod-security-policy/) 
API and related features are [deprecated](/blog/2021/04/06/podsecuritypolicy-deprecation-past-present-and-future/),
but some of the guidance in this section will still apply for the next few years, until cluster operators
upgrade their clusters to newer Kubernetes versions.

The Kubernetes project is working on a replacement for PodSecurityPolicy.
Kubernetes v1.22 includes an alpha feature called [Pod Security Admission](/docs/concepts/security/pod-security-admission/)
that is intended to allow enforcing a minimum level of isolation between pods.

The built-in isolation levels for Pod Security Admission are derived
from [Pod Security Standards](/docs/concepts/security/pod-security-standards/), which is a superset of all the components mentioned in Table I [page 10](https://media.defense.gov/2021/Aug/03/2002820425/-1/-1/1/CTR_KUBERNETES%20HARDENING%20GUIDANCE.PDF#page=17) of
the guidance.

Information about migrating from PodSecurityPolicy to the Pod Security
Admission feature is available
in
[Migrate from PodSecurityPolicy to the Built-In PodSecurity Admission Controller](/docs/tasks/configure-pod-container/migrate-from-psp/).

One important behavior mentioned in the guidance that remains the same between
Pod Security Policy and its replacement is that enforcing either of them does
not affect pods that are already running. With both PodSecurityPolicy and Pod Security Admission,
the enforcement happens during the pod creation
stage.

### Hardening container engines

Some container workloads are less trusted than others but may need to run in the
same cluster. In those cases, running them on dedicated nodes that include
hardened container runtimes that provide stricter pod isolation boundaries can
act as a useful security control.

Kubernetes supports
an API called [RuntimeClass](/docs/concepts/containers/runtime-class/) that is
stable / GA (and, therefore, enabled by default) stage as of Kubernetes v1.20.
RuntimeClass allows you to ensure that Pods requiring strong isolation are scheduled onto
nodes that can offer it.

Some third-party projects that you can use in conjunction with RuntimeClass are:

- [kata containers](https://github.com/kata-containers/kata-containers/blob/main/docs/how-to/how-to-use-k8s-with-cri-containerd-and-kata.md#create-runtime-class-for-kata-containers)
- [gvisor](https://gvisor.dev/docs/user_guide/containerd/quick_start/)

As discussed here and in the guidance, many features and tooling exist in and around
Kubernetes that can enhance the isolation boundaries between
pods. Based on relevant threats and risk posture, you should pick and choose
between them, instead of trying to apply all the recommendations. Having said that, cluster
level isolation i.e. running workloads in dedicated clusters, remains the strictest workload 
isolation mechanism, in spite of improvements mentioned earlier here and in the guide.

## Network Separation and Hardening

Kubernetes Networking can be tricky and this section focuses on how to secure
and harden the relevant configurations. The guide identifies the following as key
takeaways: 
- Using NetworkPolicies to create isolation between resources,
- Securing the control plane
- Encrypting traffic and sensitive data

### Network Policies

Network policies can be created with the help of network plugins. In order to
make the creation and visualization easier for users, Cilium supports
a [web GUI tool](https://editor.cilium.io). That web GUI lets you create Kubernetes
NetworkPolicies (a generic API that nevertheless requires a compatible CNI plugin),
and / or Cilium network policies (CiliumClusterwideNetworkPolicy and CiliumNetworkPolicy,
which only work in clusters that use the Cilium CNI plugin).
You can use these APIs to restrict network traffic between pods, and therefore minimize the
attack vector.

Another scenario that is worth exploring is the usage of external IPs. Some
services, when misconfigured, can create random external IPs. An attacker can take
advantage of this misconfiguration and easily intercept traffic. This vulnerability
has been reported
in [CVE-2020-8554](https://www.cvedetails.com/cve/CVE-2020-8554/).
Using [externalip-webhook](https://github.com/kubernetes-sigs/externalip-webhook)
can mitigate this vulnerability by preventing the services from using random
external IPs. [externalip-webhook](https://github.com/kubernetes-sigs/externalip-webhook) 
only allows creation of services that don't require external IPs or whose 
external IPs are within the range specified by the administrator.

> CVE-2020-8554 - Kubernetes API server in all versions allow an attacker
> who is able to create a ClusterIP service and set the `spec.externalIPs` field,
> to intercept traffic to that IP address. Additionally, an attacker who is able to
> patch the `status` (which is considered a privileged operation and should not
> typically be granted to users) of a LoadBalancer service can set the
> `status.loadBalancer.ingress.ip` to similar effect.

### Resource Policies

In addition to configuring ResourceQuotas and limits, consider restricting how many process
IDs (PIDs) a given Pod can use, and also to reserve some PIDs for node-level use to avoid
resource exhaustion. More details to apply these limits can be
found in [Process ID Limits And Reservations](/docs/concepts/policy/pid-limiting/).

### Control Plane Hardening

In the next section, the guide covers control plane hardening. It is worth
noting that
from [Kubernetes 1.20](https://github.com/kubernetes/kubernetes/issues/91506),
insecure port from API server, has been removed.

### Etcd

As a general rule, the etcd server should be configured to only trust
certificates assigned to the API server. It limits the attack surface and prevents a
malicious attacker from gaining access to the cluster. It might be beneficial to
use a separate CA for etcd, as it by default trusts all the certificates issued
by the root CA.

### Kubeconfig Files

In addition to specifying the token and certificates directly, `.kubeconfig`
supports dynamic retrieval of temporary tokens using auth provider plugins.
Beware of the possibility of malicious
shell [code execution](https://banzaicloud.com/blog/kubeconfig-security/) in a
`kubeconfig` file. Once attackers gain access to the cluster, they can steal ssh
keys/secrets or more.

### Secrets
Kubernetes [Secrets](/docs/concepts/configuration/secret/) is the native way of managing secrets as a Kubernetes
API object. However, in some scenarios such as a desire to have a single source of truth for all app secrets, irrespective of whether they run on Kubernetes or not, secrets can be managed loosely coupled with 
Kubernetes and consumed by pods through side-cars or init-containers with minimal usage of Kubernetes Secrets API. 

[External secrets providers](https://github.com/external-secrets/kubernetes-external-secrets)
and [csi-secrets-store](https://github.com/kubernetes-sigs/secrets-store-csi-driver)
are some of these alternatives to Kubernetes Secrets

## Log Auditing

The NSA/CISA guidance stresses monitoring and alerting based on logs. The key points
include logging at the host level, application level, and on the cloud. When
running Kubernetes in production, it's important to understand who's
responsible, and who's accountable, for each layer of logging.

### Kubernetes API auditing

One area that deserves more focus is what exactly should alert or be logged. The
document outlines a sample policy in [Appendix L: Audit Policy](https://media.defense.gov/2021/Aug/03/2002820425/-1/-1/1/CTR_KUBERNETES%20HARDENING%20GUIDANCE.PDF#page=55) that logs all
RequestResponse's including metadata and request / response bodies. While helpful for a demo, it may not be practical for production.

Each organization needs to evaluate their
own threat model and build an audit policy that complements or helps troubleshooting incident response. Think
about how someone would attack your organization and what audit trail could identify it. Review more advanced options for tuning audit logs in the official [audit logging documentation](/docs/tasks/debug/debug-cluster/audit/#audit-policy).
It's crucial to tune your audit logs to only include events that meet your threat model. A minimal audit policy that logs everything at `metadata` level can also be a good starting point. 

Audit logging configurations can also be tested with
kind following these [instructions](https://kind.sigs.k8s.io/docs/user/auditing).

### Streaming logs and auditing

Logging is important for threat and anomaly detection. As the document outlines,
it's a best practice to scan and alert on logs as close to real time as possible
and to protect logs from tampering if a compromise occurs. It's important to
reflect on the various levels of logging and identify the critical areas such as
API endpoints.

Kubernetes API audit logging can stream to a webhook and there's an example in [Appendix N: Webhook configuration](https://media.defense.gov/2021/Aug/03/2002820425/-1/-1/1/CTR_KUBERNETES%20HARDENING%20GUIDANCE.PDF#page=58). Using a webhook could be a method that
stores logs off cluster and/or centralizes all audit logs. Once logs are
centrally managed, look to enable alerting based on critical events. Also ensure
you understand what the baseline is for normal activities.

### Alert identification

While the guide stressed the importance of notifications, there is not a blanket
event list to alert from. The alerting requirements vary based on your own
requirements and threat model. Examples include the following events:

- Changes to the `securityContext` of a Pod
- Updates to admission controller configs
- Accessing certain files / URLs

### Additional logging resources

- [Seccomp Security Profiles and You: A Practical Guide - Duffie Cooley](https://www.youtube.com/watch?v=OPuu8wsu2Zc)
- [TGI Kubernetes 119: Gatekeeper and OPA](https://www.youtube.com/watch?v=ZJgaGJm9NJE)
- [Abusing The Lack of Kubernetes Auditing Policies](https://www.lacework.com/blog/hiding-in-plaintext-sight-abusing-the-lack-of-kubernetes-auditing-policies/)
- [Enable seccomp for all workloads with a new v1.22 alpha feature](https://kubernetes.io/blog/2021/08/25/seccomp-default/)
- [This Week in Cloud Native: Auditing / Pod Security](https://www.twitch.tv/videos/1147889860)

## Upgrading and Application Security practices

Kubernetes releases three times per year, so upgrade-related toil is a common problem for
people running production clusters. In addition to this, operators must
regularly upgrade the underlying node's operating system and running
applications. This is a best practice to ensure continued support and to reduce
the likelihood of bugs or vulnerabilities.

Kubernetes supports the three most recent stable releases. While each Kubernetes
release goes through a large number of tests before being published, some
teams aren't comfortable running the latest stable release until some time has
passed. No matter what version you're running, ensure that patch upgrades
happen frequently or automatically. More information can be found in
the [version skew](/releases/version-skew-policy/) policy
pages.

When thinking about how you'll manage node OS upgrades, consider ephemeral
nodes. Having the ability to destroy and add nodes allows your team to respond
quicker to node issues. In addition, having deployments that tolerate node
instability (and a culture that encourages frequent deployments) allows for
easier cluster upgrades.

Additionally, it's worth reiterating from the guidance that periodic 
vulnerability scans and penetration tests can be performed on the various system
components to proactively look for insecure configurations and vulnerabilities.

### Finding release & security information

To find the most recent Kubernetes supported versions, refer to
[https://k8s.io/releases](https://k8s.io/releases), which includes minor versions. It's good to stay up to date with
your minor version patches.

If you're running a managed Kubernetes offering, look for their release
documentation and find their various security channels.

Subscribe to
the [Kubernetes Announce mailing list](https://groups.google.com/g/kubernetes-announce).
The Kubernetes Announce mailing list is searchable for terms such
as "[Security Advisories](https://groups.google.com/g/kubernetes-announce/search?q=%5BSecurity%20Advisory%5D)".
You can set up alerts and email notifications as long as you know what key
words to alert on.

## Conclusion

In summary, it is fantastic to see security practitioners sharing this
level of detailed guidance in public. This guidance further highlights
Kubernetes going mainstream and how securing Kubernetes clusters and the
application containers running on Kubernetes continues to need attention and focus of
practitioners. Only a few weeks after the guidance was published, an open source
tool [kubescape](https://github.com/armosec/kubescape) to validate cluster
against this guidance became available.

This tool can be a great starting point to check the current state of your
clusters, after which you can use the information in this blog post and in the guidance to assess 
where improvements can be made.

Finally, it is worth reiterating that not all controls in this guidance will
make sense for all practitioners. The best way to know which controls matter is
to rely on the threat model of your own Kubernetes environment.

_A special shout out and thanks to Rory McCune (@raesene) for his inputs to this blog post_
