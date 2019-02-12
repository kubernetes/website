---
title: Mirror Pod
id: mirror-pod
date: 2091-02-12
full_link: 
short_description: >
  An object in the API server that tracks a static pod on a Kubelet.

aka: 
tags:
- fundamental
---
 A {{< glossary_tooltip text="pod" term_id="pod" >}} object that a Kubelet uses
 to represent a {{< glossary_tooltip text="static pod" term_id="static-pod" >}}

<!--more--> 

When Kubelet finds a static pod in its configuration, it automatically tries to
create a Pod object on the Kubernetes API server for it. This means that the pod
will be visible on the API server, but cannot be controlled from there.

(For example, removing a mirror pod will not stop the Kubelet from running it).
