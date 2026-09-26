---
layout: blog
title: "KubeInvaders - Gamified Chaos Engineering Tool for Kubernetes"
date: 2020-01-22
slug: kubeinvaders-gamified-chaos-engineering-tool-for-kubernetes
author: >
  Eugenio Marzo (Sourcesense)
---

Some months ago, I released my latest project called KubeInvaders. The
first time I shared it with the community was during an Openshift
Commons Briefing session. Kubenvaders is a Gamified Chaos Engineering
tool for Kubernetes and Openshift and helps test how resilient your
Kubernetes cluster is, in a fun way.

It is like Space Invaders, but the aliens are pods.

![](https://github.com/lucky-sideburn/KubeInvaders-kubernetes-post/raw/master/img1.png)

During my presentation at Codemotion Milan 2019, I started saying "of
course you can do it with few lines of Bash, but it is boring."

![](https://github.com/lucky-sideburn/KubeInvaders-kubernetes-post/raw/master/img2.png)

Using the code above you can kill random pods across a Kubernetes cluster, but I
think it is much more fun with the spaceship of KubeInvaders.

I published the code at
[https://github.com/lucky-sideburn/KubeInvaders](https://github.com/lucky-sideburn/KubeInvaders)
and there is a little community that is growing gradually. Some people
love to use it for demo sessions killing pods on a big screen.

![](https://github.com/lucky-sideburn/KubeInvaders-kubernetes-post/raw/master/img3.png)

## How to install KubeInvaders

I defined multiples modes to install it:

1.  Helm Chart
    [https://github.com/lucky-sideburn/KubeInvaders/tree/master/helm-charts/kubeinvaders](https://github.com/lucky-sideburn/KubeInvaders/tree/master/helm-charts/kubeinvaders)

2.  Manual Installation for Openshift using a template
    [https://github.com/lucky-sideburn/KubeInvaders\#install-kubeinvaders-on-openshift](https://github.com/lucky-sideburn/KubeInvaders#install-kubeinvaders-on-openshift)

3.  Manual Installation for Kubernetes
    [https://github.com/lucky-sideburn/KubeInvaders\#install-kubeinvaders-on-kubernetes](https://github.com/lucky-sideburn/KubeInvaders#install-kubeinvaders-on-kubernetes)

The preferred way, of course, is with a Helm chart:
  
  ```
  # Please set target_namespace to set your target namespace!
  helm install --set-string target_namespace="namespace1,namespace2" \
  --name kubeinvaders --namespace kubeinvaders ./helm-charts/kubeinvaders
  ```

## How to use KubeInvaders

Once it is installed on your cluster you can use the following
functionalities:

 * Key 'a' — Switch to automatic pilot
 * Key 'm' — Switch to manual pilot
 * Key 'i' — Show pod's name. Move the ship towards an alien
 * Key 'h' — Print help
 * Key 'n' — Jump between different namespaces (my favorite feature!)

## Tuning KubeInvaders

At Codemotion Milan 2019, my colleagues and I organized a desk with a
game station for playing KubeInvaders. People had to fight with Kubernetes to
win a t-shirt.

If you have pods that require a few seconds to start, you may lose. It
is possible to set the complexity of the game with these parameters as
environmment variables in the Kubernetes deployment:

 * ALIENPROXIMITY — Reduce this value to increase the distance between aliens;
 * HITSLIMIT — Seconds of CPU time to wait before shooting;
 * UPDATETIME — Seconds to wait before updating pod status (you can set also 0.x Es: 0.5);

The result is a harder game experience against the machine.

## Use cases

Adopting chaos engineering strategies for your production environment is
really useful, because it is the only way to test if a system supports
unexpected destructive events.

KubeInvaders is a game — so please do not take it too seriously! — but it demonstrates
some important use cases:

 * Test how resilient Kubernetes clusters are on unexpected pod deletion
 * Collect metrics like pod restart time
 * Tune readiness probes

## Next steps

I want to continue to add some cool features and integrate it into a
Kubernetes dashboard because I am planning to transform it into a
"Gamified Chaos Engineering and Development Tool for Kubernetes", to help
developer to interact with deployments in a Kubernetes environment. For
example:

 * Point to the aliens to get pod logs
 * Deploy Helm charts by shooting some particular objects
 * Read messages stored in a specific label present in a deployment

Please feel free to contribute to
[https://github.com/lucky-sideburn/KubeInvaders](https://github.com/lucky-sideburn/KubeInvaders)
and stay updated following \#kubeinvaders news [on Twitter](https://twitter.com/luckysideburn).
