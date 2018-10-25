---
title: " Weekly Kubernetes Community Hangout Notes - May 1 2015 "
date: 2015-05-11
slug: weekly-kubernetes-community-hangout
url: /blog/2015/05/Weekly-Kubernetes-Community-Hangout
---
Every week the Kubernetes contributing community meet virtually over Google Hangouts. We want anyone who's interested to know what's discussed in this forum.

* Simple rolling update - Brendan

    * Rolling update = nice example of why RCs and Pods are good.

    * ...pause… (Brendan needs demo recovery tips from Kelsey)

    * Rolling update has recovery: Cancel update and restart, update continues from where it stopped.

    * New controller  gets name of old controller, so appearance is pure update.

    * Can also name versions in update (won't do rename at the end).
* Rocket demo - CoreOS folks

    * 2 major differences between rocket & docker: Rocket is daemonless & pod-centric.

    * Rocket has AppContainer format as native, but also supports docker image format.

    * Can run AppContainer and docker containers in same pod.

    * Changes are close to merged.
* demo service accounts and secrets being added to pods - Jordan

    * Problem: It's hard to get a token to talk to the API.

    * New API object: "ServiceAccount"

    * ServiceAccount is namespaced, controller makes sure that at least 1 default service account exists in a namespace.

    * Typed secret "ServiceAccountToken", controller makes sure there is at least 1 default token.

    * DEMO

    *     * Can create new service account with ServiceAccountToken. Controller will create token for it.

    * Can create a pod with service account, pods will have service account secret mounted at /var/run/secrets/kubernetes.io/…
* Kubelet running in a container - Paul

    * Kubelet successfully ran pod w/ mounted secret.
