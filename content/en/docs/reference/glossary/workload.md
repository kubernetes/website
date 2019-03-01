---
title: Workloads
id: workloads
date: 2019-02-13
full_link: https://kubernetes.io/docs/concepts/workloads/
short_description: >
   A workload is a framing term to refer to a set of APIs/resources/objects.

aka: 
tags:
- fundamental
- core-object
- workload
---
  A workload is a framing term to refer to a set of APIs/resources/objects.

<!--more--> 

Workload is a framing term to refer to a set of APIs/resources/objects. Kubernetes performs the 
deployment and updates the workload with the current state of the application. Workloads let you define the 
rules for application scheduling, scaling, and upgrade.
Workloads includes the Daemon Sets, Deployments, Jobs, Pods, Replica Sets, Replication Controllers, Stateful Sets.

For example, a workload that has a web element and a database element might run the
database in one {{< glossary_tooltip term_id="StatefulSet" >}} of
{{< glossary_tooltip text="pods" term_id="pod" >}} and the webserver via
a {{< glossary_tooltip term_id="Deployment" >}} that consists of many web app
{{< glossary_tooltip text="pods" term_id="pod" >}}, all alike.

