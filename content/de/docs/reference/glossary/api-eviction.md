---
title: API-initiierte Räumung
id: api-eviction
date: 2021-04-27
full_link: /docs/concepts/scheduling-eviction/api-eviction/
short_description: >
  API-initiierte Räumung ist der Prozess, durch den Sie die Räumungs API verwenden, um ein Räumungsobjekt zu erstellen, dass eine geordnete Beendung des Pods auslöst.
aka:
tags:
- operation
---
API-initiierte Räumung ist der Prozess, durch den Sie die [Räumungs API](/docs/reference/generated/kubernetes-api/{{<param "version">}}/#create-eviction-pod-v1-core) verwenden, um ein Räumungsobjekt zu erstellen, dass eine geordnete Beendung des Pods auslöst.


<!--more-->

Sie können Räumung anfragen, indem Sie direkt die Räumungs API verwenden, mithilfe eines Clients des kube-api-servers, wie der `kubectl drain` Befehl. Wenn ein `Räumungs` Objekt erstellt wird, beendet der API Server den Pod. 

API-initiierte Räumungen respektieren Ihre konfigurierte [`PodDisruptionBudgets`](/docs/tasks/run-application/configure-pdb/)
und [`terminationGracePeriodSeconds`](/docs/concepts/workloads/pods/pod-lifecycle#pod-termination).

API-initiierte Räumung ist nicht das gleiche wie [Knotendruck Räumung](/docs/concepts/scheduling-eviction/node-pressure-eviction/).

* Siehe [API-initiierte Räumung](/docs/concepts/scheduling-eviction/api-eviction/) für mehr Informationen.
