---
layout: blog
title: "Spotlight on SIG Node"
slug: sig-node-spotlight-2024
canonicalUrl: https://www.kubernetes.dev/blog/2024/06/20/sig-node-spotlight-2024
date: 2024-06-20
author: >
  Arpit Agrawal
---


In the world of container orchestration, [Kubernetes](/) reigns
supreme, powering some of the most complex and dynamic applications across the globe. Behind the
scenes, a network of Special Interest Groups (SIGs) drives Kubernetes' innovation and stability.

Today, I have the privilege of speaking with [Matthias
Bertschy](https://www.linkedin.com/in/matthias-bertschy-b427b815/), [Gunju
Kim](https://www.linkedin.com/in/gunju-kim-916b33190/), and [Sergey
Kanzhelev](https://www.linkedin.com/in/sergeykanzhelev/), members of [SIG
Node](https://github.com/kubernetes/community/blob/master/sig-node/README.md), who will shed some
light on their roles, challenges, and the exciting developments within SIG Node.

_Answers given collectively by all interviewees will be marked by their initials._

## Introductions

**Arpit:** Thank you for joining us today. Could you please introduce yourselves and provide a brief
overview of your roles within SIG Node?

**Matthias:** My name is Matthias Bertschy, I am French and live next to Lake Geneva, near the
French Alps. I have been a Kubernetes contributor since 2017, a reviewer for SIG Node and a
maintainer of [Prow](https://docs.prow.k8s.io/docs/overview/). I work as a Senior Kubernetes
Developer for a security startup named [ARMO](https://www.armosec.io/), which donated
[Kubescape](https://www.cncf.io/projects/kubescape/) to the CNCF.

![Lake Geneva and the Alps](Lake_Geneva_and_the_Alps.jpg)

**Gunju:** My name is Gunju Kim. I am a software engineer at
[NAVER](https://www.navercorp.com/naver/naverMain), where I focus on developing a cloud platform for
search services. I have been contributing to the Kubernetes project in my free time since 2021.

**Sergey:** My name is Sergey Kanzhelev. I have worked on Kubernetes and [Google Kubernetes
Engine](https://cloud.google.com/kubernetes-engine) for 3 years and have worked on open-source
projects for many years now. I am a chair of SIG Node.

## Understanding SIG Node

**Arpit:** Thank you! Could you provide our readers with an overview of SIG Node's responsibilities
within the Kubernetes ecosystem?

**M/G/S:** SIG Node is one of the first if not the very first SIG in Kubernetes. The SIG is
responsible for all iterations between Kubernetes and node resources, as well as node maintenance
itself. This is quite a large scope, and the SIG owns a large part of the Kubernetes codebase. Because
of this wide ownership, SIG Node is always in contact with other SIGs such as SIG Network, SIG
Storage, and SIG Security and almost any new features and developments in Kubernetes involves SIG
Node in some way.

**Arpit**: How does SIG Node contribute to Kubernetes' performance and stability?

**M/G/S:** Kubernetes works on nodes of many different sizes and shapes, from small physical VMs
with cheap hardware to large AI/ML-optimized GPU-enabled nodes. Nodes may stay online for months or
maybe be short-lived and be preempted at any moment as they are running on excess compute of a cloud
provider.

[`kubelet`](/docs/concepts/architecture/#kubelet) — the
Kubernetes agent on a node — must work in all these environments reliably. As for the performance
of kubelet operations, this is becoming increasingly important today. On one hand, as Kubernetes is
being used on extra small nodes more and more often in telecom and retail environments, it needs to
scale into the smallest footprint possible. On the other hand, with AI/ML workloads where every node
is extremely expensive, every second of delayed operations can visibly change the price of
computation.


## Challenges and Opportunities

**Arpit:** What upcoming challenges and opportunities is SIG Node keeping an eye on?

**M/G/S:** As Kubernetes enters the second decade of its life, we see a huge demand to support new
workload types. And SIG Node will play a big role in this. The Sidecar KEP, which we will be talking
about later, is one of the examples of increased emphasis on supporting new workload types.

The key challenge we will have in the next few years is how to keep innovations while maintaining
high quality and backward compatibility of existing scenarios. SIG Node will continue to play a
central role in Kubernetes.

**Arpit:** And are there any ongoing research or development areas within SIG Node that excite you?

**M/G/S:** Supporting new workload types is a fascinating area for us. Our recent exploration of
sidecar containers is a testament to this. Sidecars offer a versatile solution for enhancing
application functionality without altering the core codebase.

**Arpit:** What are some of the challenges you've faced while maintaining SIG Node, and how have you
overcome them?

**M/G/S:** The biggest challenge of SIG Node is its size and the many feature requests it
receives. We are encouraging more people to join as reviewers and are always open to improving
processes and addressing feedback. For every release, we run the feedback session at the SIG Node
meeting and identify problematic areas and action items.

**Arpit:** Are there specific technologies or advancements that SIG Node is closely monitoring or
integrating into Kubernetes?

**M/G/S:** Developments in components that the SIG depends on, like
[container runtimes](/docs/setup/production-environment/container-runtimes/)
(e.g. [containerd](https://containerd.io/) and [CRI-O](https://cri-o.io/), and OS features are
something we contribute to and monitor closely. For example, there is an upcoming _cgroup v1_
deprecation and removal that Kubernetes and SIG Node will need to guide Kubernetes users
through. Containerd is also releasing version `2.0`, which removes deprecated features, which will
affect Kubernetes users.

**Arpit:** Could you share a memorable experience or achievement from your time as a SIG Node
maintainer that you're particularly proud of?

**Mathias:** I think the best moment was when my first KEP (introducing the
[`startupProbe`](/docs/concepts/workloads/pods/pod-lifecycle/#container-probes))
finally graduated to GA (General Availability). I also enjoy seeing my contributions being used
daily by contributors, such as the comment containing the GitHub tree hash used to retain LGTM
despite squash commits.

## Sidecar containers

**Arpit:** Can you provide more context on the concept of sidecar containers and their evolution in
the context of Kubernetes?

**M/G/S:** The concept of
[sidecar containers](/docs/concepts/workloads/pods/sidecar-containers/) dates back to
2015 when Kubernetes introduced the idea of composite containers. These additional containers,
running alongside the main application container within the same pod, were seen as a way to extend
and enhance application functionality without modifying the core codebase. Early adopters of
sidecars employed custom scripts and configurations to manage them, but this approach presented
challenges in terms of consistency and scalability.

**Arpit:** Can you share specific use cases or examples where sidecar containers are particularly
beneficial?

**M/G/S:** Sidecar containers are a versatile tool that can be used to enhance the functionality of
applications in a variety of ways:

- **Logging and monitoring:** Sidecar containers can be used to collect logs and metrics from the
  primary application container and send them to a centralized logging and monitoring system.
- **Traffic filtering and routing:** Sidecar containers can be used to filter and route traffic to
  and from the primary application container.
- **Encryption and decryption:** Sidecar containers can be used to encrypt and decrypt data as it
  flows between the primary application container and external services.
- **Data synchronization:** Sidecar containers can be used to synchronize data between the primary
  application container and external databases or services.
- **Fault injection:** Sidecar containers can be used to inject faults into the primary application
  container in order to test its resilience to failures.

**Arpit:** The proposal mentions that some companies are using a fork of Kubernetes with sidecar
functionality added. Can you provide insights into the level of adoption and community interest in
this feature?

**M/G/S:** While we lack concrete metrics to measure adoption rates, the KEP has garnered
significant interest from the community, particularly among service mesh vendors like Istio, who
actively participated in its alpha testing phase. The KEP's visibility through numerous blog posts,
interviews, talks, and workshops further demonstrates its widespread appeal. The KEP addresses the
growing demand for additional capabilities alongside main containers in Kubernetes pods, such as
network proxies, logging systems, and security measures. The community acknowledges the importance
of providing easy migration paths for existing workloads to facilitate widespread adoption of the
feature.

**Arpit:** Are there any notable examples or success stories from companies using sidecar containers
in production?

**M/G/S:** It is still too early to expect widespread adoption in production environments. The 1.29
release has only been available in Google Kubernetes Engine (GKE) since January 11, 2024, and there
still needs to be comprehensive documentation on how to enable and use them effectively via
universal injector. Istio, a popular service mesh platform, also lacks proper documentation for
enabling native sidecars, making it difficult for developers to get started with this new
feature. However, as native sidecar support matures and documentation improves, we can expect to see
wider adoption of this technology in production environments.

**Arpit:** The proposal suggests introducing a `restartPolicy` field for init containers to indicate
sidecar functionality. Can you explain how this solution addresses the outlined challenges?

**M/G/S:** The proposal to introduce a `restartPolicy` field for init containers addresses the
outlined challenges by utilizing existing infrastructure and simplifying sidecar management. This
approach avoids adding new fields to the pod specification, keeping it manageable and avoiding more
clutter. By leveraging the existing init container mechanism, sidecars can be run alongside regular
init containers during pod startup, ensuring a consistent ordering of initialization. Additionally,
setting the restart policy of sidecar init containers to `Always` explicitly states that they continue
running even after the main application container terminates, enabling persistent services like
logging and monitoring until the end of the workload.

**Arpit:** How will the introduction of the `restartPolicy` field for init containers affect
backward compatibility with existing Kubernetes configurations?

**M/G/S:** The introduction of the `restartPolicy` field for init containers will maintain backward
compatibility with existing Kubernetes configurations. Existing init containers will continue to
function as they have before, and the new `restartPolicy` field will only apply to init containers
explicitly marked as sidecars. This approach ensures that existing applications and deployments will
not be disrupted by the new feature, and provides a more streamlined way to define and manage
sidecars.

## Contributing to SIG Node

**Arpit:** What is the best place for the new members and especially beginners to contribute?

**M/G/S:** New members and beginners can contribute to the Sidecar KEP (Kubernetes Enhancement
Proposal) by:

- **Raising awareness:** Create content that highlights the benefits and use cases of sidecars. This
  can educate others about the feature and encourage its adoption.
- **Providing feedback:** Share your experiences with sidecars, both positive and negative. This
  feedback can be used to improve the feature and make it more widely usable.
- **Sharing your use cases:** If you are using sidecars in production,
  share your experiences with others. This can help to demonstrate the
  real-world value of the feature and encourage others to adopt it.
- **Improving the documentation:** Help to clarify and expand the documentation for the
  feature. This can make it easier for others to understand and use sidecars.

In addition to the Sidecar KEP, there are many other areas where SIG Node needs more contributors:

- **Test coverage:** SIG Node is always looking for ways to improve the test coverage of Kubernetes
  components.
- **CI maintenance:** SIG Node maintains a suite of e2e tests ensuring Kubernetes components
  function as intended across a variety of scenarios.


# Conclusion

In conclusion, SIG Node stands as a cornerstone in Kubernetes' journey, ensuring its reliability and
adaptability in the ever-changing landscape of cloud-native computing. With dedicated members like
Matthias, Gunju, and Sergey leading the charge, SIG Node remains at the forefront of innovation,
driving Kubernetes towards new horizons.
