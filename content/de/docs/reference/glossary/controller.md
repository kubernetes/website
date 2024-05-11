---
title: Controller
id: controller
date: 2018-04-12
full_link: /docs/concepts/architecture/controller/
short_description: >
  Eine Kontrollschleife, die den geteilten Zustand des Clusters über den Apiserver beobachtet, und Änderungen ausführt, um den aktuellen Zustand in Richtung des Wunschzustands zu bewegen.

aka: 
tags:
- architecture
- fundamental
---
In Kubernetes sind Controller Kontrollschleifen, die den Zustand des {{< glossary_tooltip term_id="cluster" text="Clusters">}} überwachen und bei Bedarf Änderungen ausführen oder anfordern.
Jeder Controller versucht, den aktuellen Clusterzustand in Richtung des Wunschzustands zu bewegen.

<!--more-->

Controller beobachten den geteilten Zustand des Clusters durch den {{< glossary_tooltip text="API Server" term_id="kube-apiserver" >}} (Teil der {{< glossary_tooltip text="Control Plane" term_id="control-plane" >}}).

Mache Controller, laufen auch im Control Plane, und stellen Kontrollschleifen zur Verfügung, die essentiell für die grundlegende Kubernetes Funktionalität sind. Zum Beispiel: der Deployment Controller, der Daemonset Controller, der Namespace Controller und der Persistent Volume Controller (unter anderem) laufen alle innerhalb des {{< glossary_tooltip text="Kube Controller Managers" term_id="kube-controller-manager" >}}.
