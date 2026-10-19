---
layout: blog
title: "Ingress NGINX: Statement from the Kubernetes Steering and Security Response Committees"
date: 2026-01-29
slug: ingress-nginx-statement
author: >
  [Kat Cosgrove](https://github.com/katcosgrove) (Steering Committee)
---

**In March 2026, Kubernetes will retire Ingress NGINX, a piece of critical infrastructure for about half of cloud native environments.** The retirement of Ingress NGINX was [announced](https://kubernetes.io/blog/2025/11/11/ingress-nginx-retirement/) for March 2026, after years of [public warnings](https://groups.google.com/a/kubernetes.io/g/dev/c/rxtrKvT_Q8E/m/6_ej0c1ZBAAJ) that the project was in dire need of contributors and maintainers. There will be no more releases for bug fixes, security patches, or any updates of any kind after the project is retired. This cannot be ignored, brushed off, or left until the last minute to address. We cannot overstate the severity of this situation or the importance of beginning migration to alternatives like [Gateway API](https://gateway-api.sigs.k8s.io/guides/getting-started/) or one of the many [third-party Ingress controllers](https://kubernetes.io/docs/concepts/services-networking/ingress-controllers/) immediately.

To be abundantly clear: choosing to remain with Ingress NGINX after its retirement leaves you and your users vulnerable to attack. None of the available alternatives are direct drop-in replacements. This will require planning and engineering time. Half of you will be affected. You have two months left to prepare.

**Existing deployments will continue to work, so unless you proactively check, you may not know you are affected until you are compromised.** In most cases, you can check to find out whether or not you rely on Ingress NGINX by running `kubectl get pods --all-namespaces --selector app.kubernetes.io/name=ingress-nginx` with cluster administrator permissions.

Despite its broad appeal and widespread use by companies of all sizes, and repeated calls for help from the maintainers, the Ingress NGINX project never received the contributors it so desperately needed. According to internal Datadog research, about 50% of cloud native environments currently rely on this tool, and yet for the last several years, it has been maintained solely by one or two people working in their free time. Without sufficient staffing to maintain the tool to a standard both ourselves and our users would consider secure, the responsible choice is to wind it down and refocus efforts on modern alternatives like [Gateway API](https://gateway-api.sigs.k8s.io/guides/getting-started/).

We did not make this decision lightly; as inconvenient as it is now, doing so is necessary for the safety of all users and the ecosystem as a whole. Unfortunately, the flexibility Ingress NGINX was designed with, that was once a boon, has become a burden that cannot be resolved. With the technical debt that has piled up, and fundamental design decisions that exacerbate security flaws, it is no longer reasonable or even possible to continue maintaining the tool even if resources did materialize.

We issue this statement together to reinforce the scale of this change and the potential for serious risk to a significant percentage of Kubernetes users if this issue is ignored. It is imperative that you check your clusters now. If you are reliant on Ingress NGINX, you must begin planning for migration.

Thank you,

Kubernetes Steering Committee

Kubernetes Security Response Committee
