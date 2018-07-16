---
reviewers:
- chenopis
layout: docsportal
css: /css/style_user_journeys.css
js: https://use.fontawesome.com/4bcc658a89.js, https://cdnjs.cloudflare.com/ajax/libs/prefixfree/1.0.7/prefixfree.min.js, https://cloud.google.com/js/embed.min.js
title: Foundational
track: "USERS › APPLICATION DEVELOPER › FOUNDATIONAL"
content_template: templates/user-journey-content
---

{{% capture overview %}}


## Why Kubernetes?

Users expect web applications to be available 24/7, and developers expect to deploy new versions of applications several times a day. Kubernetes helps deploy software to serve these goals:

  - Enable applications to be released and updated in an easy and quick way without downtime
  - Ensure that applications run where and when you want
  - Ensure applications have all the required resources and tools to run

{{% /capture %}}

## What is Kubernetes?

Kubernetes is an open-source platform for automating deployment, scaling, and managing containerized applications. Kubernetes provides container centric management which optimizes the utilization of resources like Central Processing Unit (CPU) and memory through distribution of applications across a cluster of machines (or nodes).

An application runs on an individual machine; it accepts input and then returns data. Applications consist of a language runtime, source code, and libraries. An application may be dependent on an external library that you might have installed on your own system but might not be available when you roll out the application to the production operating system. Even in situations when development and production environment use the same version of the operating system, the application deployment can fail if a dependency is not included. An application needs all its dependencies to be deployed successfully and a container image packages all of these together so that your application runs successfully irrespective of where you deploy the application. These containerized applications are decoupled from individual hosts. Kubernetes allows you to deploy these containerized applications to a cluster without tying them specifically to individual machines.
