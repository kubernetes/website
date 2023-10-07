---
title: Workload
id: workload
date: 2019-02-13
full_link: /docs/concepts/workloads/
short_description: >
   A workload is an application running on Kubernetes.

aka: 
tags:
- fundamental
---
   A workload is an application running on Kubernetes.

<!--more--> 

Various core objects that represent different types or parts of a workload
include the DaemonSet, Deployment, Job, ReplicaSet, and StatefulSet objects.

For example, a workload that has a web server and a database might run the
database in one {{< glossary_tooltip term_id="StatefulSet" >}} and the web server
in a {{< glossary_tooltip term_id="Deployment" >}}.
