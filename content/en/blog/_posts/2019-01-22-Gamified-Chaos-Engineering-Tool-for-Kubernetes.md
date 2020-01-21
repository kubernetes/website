---
layout: blog
title: "KubeInvaders - Gamified Chaos Engineering Tool for Kubernetes"
date: 2020-01-22
slug: kubeinvaders-gamified-chaos-engineering-tool-for-kubernetes
---

**Authors** Eugenio Marzo, Sourcesense

Some months ago, I released my latest project called KubeInvaders. The
first time I shared it with the community was during an Openshift
Commons Briefing session. Kubenvaders is a Gamified Chaos Engineering
tool for Kubernetes and Openshift and helps test how resilient your
Kubernetes cluster is, in a fun way.

It is like space invaders but the aliens are PODs.

![](https://github.com/lucky-sideburn/KubeInvaders-kubernetes-post/raw/master/img1.png)

During my presentation at Codemotion Milan 2019, I started saying "of
course you can do it with few lines of bash but it is boring."
![](https://github.com/lucky-sideburn/KubeInvaders-kubernetes-post/raw/master/img2.png)

Using the code above you can kill random PODs across a K8s cluster but I
think it is much funnier with the spaceship of Kubeinvaders.

I published the code at
[https://github.com/lucky-sideburn/KubeInvaders](https://github.com/lucky-sideburn/KubeInvaders)
and there is a little community that is growing gradually. Some people
love to use it for demo sessions killing PODs on the big screens.

![](https://github.com/lucky-sideburn/KubeInvaders-kubernetes-post/raw/master/img3.png)

## How to install KubeInvaders

I defined multiples modes to install it:

1.  Helm Chart
    [https://github.com/lucky-sideburn/KubeInvaders/tree/master/helm-charts/kubeinvaders](https://github.com/lucky-sideburn/KubeInvaders/tree/master/helm-charts/kubeinvaders)

2.  Manual Installation for Openshift using a template
    [https://github.com/lucky-sideburn/KubeInvaders\#install-kubeinvaders-on-openshift](https://github.com/lucky-sideburn/KubeInvaders#install-kubeinvaders-on-openshift)

3.  Manual Installation for Kubernetes
    [https://github.com/lucky-sideburn/KubeInvaders\#install-kubeinvaders-on-kubernetes](https://github.com/lucky-sideburn/KubeInvaders#install-kubeinvaders-on-kubernetes)

The preferred way, of course, is with a Helm chart.

  ----------------------------------------------------------------------------------------------------------------------------------------------------
  
  ```
  # Please set target_namespace to set your target namespace!
  helm install --set-string target_namespace="namespace1,namespace2" \
  --name kubeinvaders --namespace kubeinvaders ./helm-charts/kubeinvaders
  ```
  ----------------------------------------------------------------------------------------------------------------------------------------------------

## How to use KubeInvaders

Once it is installed on your cluster you can use the following
functionalities:

a.  Key 'a' =\> Switch to automatic pilot;

b.  Key 'm' =\> Switch to manual pilot;

c.  Key 'i' =\> Show pod\'s name. Move the ship towards an alien;

d.  Key 'h' =\> Print help;

e.  Key 'n' =\> Jump between; different namespaces (my preferred feature!)

## Tuning KubeInvaders

At Codemotion Milan 2019, my colleagues and I organized a desk with a
game station for playing KubeInvaders. People had to fight with K8s to
win a t-shirt.

If you have PODs that require a few seconds to start, you may lose. It
is possible to set the complexity of the game with these parameters as
env var in the K8s deployment:

a.  ALIENPROXIMITY =\> Reduce this value to increase the distance between aliens;

b.  HITSLIMIT =\> Seconds of CPU time to wait before shooting;

c.  UPDATETIME =\> Seconds to wait before update PODs status (you can set also 0.x Es: 0.5);

The result is a harder game experience against the machine :D

## Use cases

Adopting chaos engineering strategies for your production environment is
really useful because it is the only way to test if a system supports
unexpected destructive events.

KubeInvaders is a game so please do not take it too seriously but it has
some important use cases:

-   Test how resilient K8s clusters are on unexpected PODs deletion;

-   Collect metrics like PODs restart time;

-   Tuning readiness probes;

## Next step

I want to continue to add some cool features and integrate it into a
Kubernetes dashboard because I am planning to transform it into a
"Gamified Chaos Engineering and Development Tool for Kubernetes".

For "Development Tool for Kubernetes" I mean something that help
developers to interact with deployments in a K8s environment. For
example:

a.  Point to the aliens to get PODs logs;

b.  Deploy Helm charts shooting some particular objects;

c.  Read message stored in a specific label present in a deployment;

Please feel free to contribute to
[https://github.com/lucky-sideburn/KubeInvaders](https://github.com/lucky-sideburn/KubeInvaders)
and stay updated following \#kubeinvaders news on Twitter
([https://twitter.com/luckysideburn](https://twitter.com/luckysideburn))

Thanks!
