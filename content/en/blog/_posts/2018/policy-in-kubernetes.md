---
title: Current State of Policy in Kubernetes
date: 2018-05-02
slug: policy-in-kubernetes
author: >
  Zhipeng Huang,
  Torin Sandall,
  Michael Elder,
  Erica Von Buelow,
  Khalid Ahmed,
  Yisui Hu
---

Kubernetes has grown dramatically in its impact to the industry; and with rapid growth, we are beginning to see variations across components in how they define and apply policies.

Currently, policy related components could be found in identity services, networking services, storage services, multi-cluster federation, RBAC and many other areas, with different degree of maturity and also different motivations for specific problems. Within each component, some policies are extensible while others are not. The languages used by each project to express intent vary based on the original authors and experience. Driving consistent views of policies across the entire domain is a daunting task.

Adoption of Kubernetes in regulated industries will also drive the need to ensure that a deployed cluster confirms with various legal requirements, such as PCI, HIPPA, or GDPR. Each of these compliance standards enforces a certain level of privacy around user information, data, and isolation.

The core issues with the current Kubernetes policy implementations are identified as follows:

* Lack of big picture across the platform
* Lack of coordination and common language among different policy components
* Lack of consistency for extensible policy creation across the platform.
  * There are areas where policy components are extensible, and there are also areas where strict end-to-end solutions are enforced. No consensus is established on the preference to a extensible and pluggable architecture.
* Lack of consistent auditability across the Kubernetes architecture of policies which are created, modified, or disabled as well as the actions performed on behalf of the policies which are applied.

## Forming Kubernetes Policy WG

We have established a new WG to directly address these issues. We intend to provide an overall architecture that describes both the current policy related implementations as well as future policy related proposals in Kubernetes. Through a collaborative method, we want to present both dev and end user a universal view of policy in Kubernetes.

We are not seeking to redefine and replace existing implementations which have been reached by thorough discussion and consensus. Rather to establish a summarized review of current implementation and addressing gaps to address broad end to end scenarios as defined in our initial design proposal.

Kubernetes Policy WG has been focusing on the design proposal document and using the weekly meeting for discussions among WG members. The design proposal outlines the background and motivation of why we establish the WG, the concrete use cases from which the gaps/requirement analysis is deduced, the overall architecture and the container policy interface proposal.

## Key Policy Scenarios in Kubernetes

Among several use cases the workgroup has brainstormed, eventually three major scenario stands out.

The first one is about legislation/regulation compliance which requires the Kubernetes clusters conform to. The compliance scenario takes GDPR as an legislation example and the suggested policy architecture out of the discussion is to have a datapolicy controller responsible for the auditing.

The second scenario is about capacity leasing, or multi-tenant quota in traditional IaaS concept, which deals with when a large enterprise want to delegate the resource control to various Lines Of Business it has, how the Kubernetes cluster should be configured to have a policy driven mechanism to enforce the quota system. The ongoing multi-tenant controller design proposed in the multi-tenancy working group could be an ideal enforcement point for the quota policy controller, which in turn might take a look at kube-arbitrator for inspiration.

The last scenario is about cluster policy which refers to the general security and resource oriented policy control. Luster policy will involve both cluster level and namespace level policy control as well as enforcement, and there is a proposal called Kubernetes Security Profile that is under development by the Policy WG member to provide a PoC for this use case.

## Kubernetes Policy Architecture

Building upon the three scenarios, the WG is now working on three concrete proposals together with sig-arch, sig-auth and other related projects. Besides the Kubernetes security profile proposal aiming at the cluster policy use case, we also have the scheduling policy proposal which partially targets the capacity leasing use case and the topology service policy proposal which deals with affinity based upon service requirement and enforcement on routing level.

When these concrete proposals got clearer the WG will be able to provide a high level Kubernetes policy architecture as part of the motivation of the establishment of the Policy WG.

## Towards Cloud Native Policy Driven Architecture

Policy is definitely something goes beyond Kubernetes and applied to a broader cloud native context. Our work in the Kubernetes Policy WG will provide the foundation of building a CNCF wide policy architecture, with the integration of Kubernetes and various other cloud native components such as open policy agent, Istio, Envoy, SPIFEE/SPIRE and so forth. The Policy WG has already collaboration with the CNCF SAFE WG (in-forming) team, and will work on more alignments to make sure a community driven cloud native policy architecture design.
