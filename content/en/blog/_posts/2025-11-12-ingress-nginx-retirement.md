---
layout: blog
title: "Ingress NGINX Retirement: What You Need to Know"
slug: ingress-nginx-retirement
canonicalUrl: https://www.kubernetes.dev/blog/2025/11/12/ingress-nginx-retirement
date: 2025-11-11T10:30:00-08:00
author: >
  Tabitha Sable (Kubernetes SRC)
---

To prioritize the safety and security of the ecosystem, Kubernetes SIG Network and the Security Response Committee are announcing the upcoming retirement of [Ingress NGINX](https://github.com/kubernetes/ingress-nginx/). Best-effort maintenance will continue until March 2026. Afterward, there will be no further releases, no bugfixes, and no updates to resolve any security vulnerabilities that may be discovered. **Existing deployments of Ingress NGINX will continue to function and installation artifacts will remain available.**

We recommend migrating to one of the many alternatives. Consider [migrating to Gateway API](https://gateway-api.sigs.k8s.io/guides/), the modern replacement for Ingress. If you must continue using Ingress, many alternative Ingress controllers are [listed in the Kubernetes documentation](https://kubernetes.io/docs/concepts/services-networking/ingress-controllers/). Continue reading for further information about the history and current state of Ingress NGINX, as well as next steps.

## About Ingress NGINX

[Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/) is the original user-friendly way to direct network traffic to workloads running on Kubernetes. ([Gateway API](https://kubernetes.io/docs/concepts/services-networking/gateway/) is a newer way to achieve many of the same goals.) In order for an Ingress to work in your cluster, there must be an [Ingress controller](https://kubernetes.io/docs/concepts/services-networking/ingress-controllers/) running. There are many Ingress controller choices available, which serve the needs of different users and use cases. Some are cloud-provider specific, while others have more general applicability.

[Ingress NGINX](https://www.github.com/kubernetes/ingress-nginx) was an Ingress controller, developed early in the history of the Kubernetes project as an example implementation of the API. It became very popular due to its tremendous flexibility, breadth of features, and independence from any particular cloud or infrastructure provider. Since those days, many other Ingress controllers have been created within the Kubernetes project by community groups, and by cloud native vendors. Ingress NGINX has continued to be one of the most popular, deployed as part of many hosted Kubernetes platforms and within innumerable independent users’ clusters.

## History and Challenges

The breadth and flexibility of Ingress NGINX has caused maintenance challenges. Changing expectations about cloud native software have also added complications. What were once considered helpful options have sometimes come to be considered serious security flaws, such as the ability to add arbitrary NGINX configuration directives via the "snippets" annotations. Yesterday’s flexibility has become today’s insurmountable technical debt.

Despite the project’s popularity among users, Ingress NGINX has always struggled with insufficient or barely-sufficient maintainership. For years, the project has had only one or two people doing development work, on their own time, after work hours and on weekends. Last year, the Ingress NGINX maintainers [announced](https://kccncna2024.sched.com/event/1hoxW/securing-the-future-of-ingress-nginx-james-strong-isovalent-marco-ebert-giant-swarm) their plans to wind down Ingress NGINX and develop a replacement controller together with the Gateway API community. Unfortunately, even that announcement failed to generate additional interest in helping maintain Ingress NGINX or develop InGate to replace it. (InGate development never progressed far enough to create a mature replacement; it will also be retired.)

## Current State and Next Steps

Currently, Ingress NGINX is receiving best-effort maintenance. SIG Network and the Security Response Committee have exhausted our efforts to find additional support to make Ingress NGINX sustainable. To prioritize user safety, we must retire the project.

In March 2026, Ingress NGINX maintenance will be halted, and the project will be [retired](https://github.com/kubernetes-retired/). After that time, there will be no further releases, no bugfixes, and no updates to resolve any security vulnerabilities that may be discovered. The GitHub repositories will be made read-only and left available for reference.

Existing deployments of Ingress NGINX will not be broken. Existing project artifacts such as Helm charts and container images will remain available.

In most cases, you can check whether you use Ingress NGINX by running `kubectl get pods \--all-namespaces \--selector app.kubernetes.io/name=ingress-nginx` with cluster administrator permissions.

We would like to thank the Ingress NGINX maintainers for their work in creating and maintaining this project–their dedication remains impressive. This Ingress controller has powered billions of requests in datacenters and homelabs all around the world. In a lot of ways, Kubernetes wouldn’t be where it is without Ingress NGINX, and we are grateful for so many years of incredible effort.

**SIG Network and the Security Response Committee recommend that all Ingress NGINX users begin migration to Gateway API or another Ingress controller immediately.** Many options are listed in the Kubernetes documentation: [Gateway API](https://gateway-api.sigs.k8s.io/guides/), [Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress-controllers/). Additional options may be available from vendors you work with.
