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
<div id="terminal_simulator"
  data-embed="kt-app"
  data-url="https://www.gstatic.com/cloud-site-ux/kubernetes-terminal.min.html">
</div>
{{% capture overview %}}


## Basic Concepts 1

### Image

_An Image_ is a binary package that encapsulates all of the files necessary to run an application inside of an operating system container.<!---We need to cite this-->
For better understanding, you can think of an image as a class in a programming language and a container as an instance of that class.

### Container

A _container_ is an active instantiation of an image.

Containers sit on a physical or a virtual host machine and run on the operating system of the host. This makes containers lightweight and portable: only megabytes in size. Hence, the containers help ensure that applications deploy quickly.

Example:


### Container Runtime

_Container Runtime_ is a program that runs on nodes <!---have a pop up explaining node--> and sets up containers for you by instantiating an image into a container.


### Control Loop

_Control Loop_ is a non-terminating loop that regulates the state of the system through the apiserver and makes changes attempting to move the current state towards the desired state.

Example: If there are currently 2 pods (current state) running in a node, however you want 3 additional pods(desired state) in a node, control loop ensures to spin up 3 additional pods.
