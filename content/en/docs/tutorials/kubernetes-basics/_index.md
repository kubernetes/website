---
title: Learn Kubernetes Basics
main_menu: true
no_list: true
weight: 20
content_type: concept
card:
  name: tutorials
  weight: 20
  title: Walkthrough the basics
---

## {{% heading "objectives" %}}

This tutorial provides a walkthrough of the basics of the Kubernetes cluster orchestration
system. Each module contains some background information on major Kubernetes features
and concepts, and a tutorial for you to follow along.

Using the tutorials, you can learn to:

* Deploy a containerized application on a cluster.
* Scale the deployment.
* Update the containerized application with a new software version.
* Debug the containerized application.

## What can Kubernetes do for you?

With modern web services, users expect applications to be available 24/7, and developers
expect to deploy new versions of those applications several times a day. Containerization
helps package software to serve these goals, enabling applications to be released and updated
without downtime. Kubernetes helps you make sure those containerized applications run where
and when you want, and helps them find the resources and tools they need to work. Kubernetes
is a production-ready, open source platform designed with Google's accumulated experience in
container orchestration, combined with best-of-breed ideas from the community.

## Kubernetes Basics Modules

<!-- css code to preserve original format -->
<link rel="stylesheet" href="/css/style_tutorials.css">

<div class="tutorials-modules">
  <div class="module">
    <a href="/docs/tutorials/kubernetes-basics/create-cluster/cluster-intro/">
      <img src="/docs/tutorials/kubernetes-basics/public/images/module_01.svg?v=1469803628347" alt="Module 1">
      <h5>1. Create a Kubernetes cluster</h5>
    </a>
  </div>
  <div class="module">
    <a href="/docs/tutorials/kubernetes-basics/deploy-app/deploy-intro/">
      <img src="/docs/tutorials/kubernetes-basics/public/images/module_02.svg?v=1469803628347" alt="Module 2">
      <h5>2. Deploy an app</h5>
    </a>
  </div>
  <div class="module">
    <a href="/docs/tutorials/kubernetes-basics/explore/explore-intro/">
      <img src="/docs/tutorials/kubernetes-basics/public/images/module_03.svg?v=1469803628347" alt="Module 3">
      <h5>3. Explore your app</h5>
    </a>
  </div>
  <div class="module">
    <a href="/docs/tutorials/kubernetes-basics/expose/expose-intro/">
      <img src="/docs/tutorials/kubernetes-basics/public/images/module_04.svg?v=1469803628347" alt="Module 4">
      <h5>4. Expose your app publicly</h5>
    </a>
  </div>
  <div class="module">
    <a href="/docs/tutorials/kubernetes-basics/scale/scale-intro/">
      <img src="/docs/tutorials/kubernetes-basics/public/images/module_05.svg?v=1469803628347" alt="Module 5">
      <h5>5. Scale up your app</h5>
    </a>
  </div>
  <div class="module">
    <a href="/docs/tutorials/kubernetes-basics/update/update-intro/">
      <img src="/docs/tutorials/kubernetes-basics/public/images/module_06.svg?v=1469803628347" alt="Module 6">
      <h5>6. Update your app</h5>
    </a>
  </div>
</div>

## {{% heading "whatsnext" %}}

* Tutorial [Using Minikube to Create a
Cluster](/docs/tutorials/kubernetes-basics/create-cluster/)