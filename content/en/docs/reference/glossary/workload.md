---
title: Workloads
id: workloads
date: 2019-02-13
full_link: /docs/concepts/workloads/
short_description: >
   Workloads are objects you use to manage and run your containers on the cluster.

aka: 
tags:
- fundamental
- core-object
- workload
---
  Workloads are objects you use to manage and run your containers on the cluster.

<!--more--> 

Kubernetes performs the 
deployment and updates the workload with the current state of the application.
Workloads include the DaemonSet, Deployments, Jobs, Pods, ReplicaSet, ReplicationController, and StatefulSet objects.

For example, a workload that has a web element and a database element might run the
database in one {{< glossary_tooltip term_id="StatefulSet" >}} of
{{< glossary_tooltip text="pods" term_id="pod" >}} and the webserver via
a {{< glossary_tooltip term_id="Deployment" >}} that consists of many web app
{{< glossary_tooltip text="pods" term_id="pod" >}}, all alike.

