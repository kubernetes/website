---
title: Cloud Controller Manager
id: cloud-controller-manager
date: 2018-04-12
full_link: /docs/concepts/architecture/cloud-controller/
short_description: >
  Control Plane Komponente, die Kubernetes mit Drittanbieter Cloud Provider integriert.
aka: 
tags:
- core-object
- architecture
- operation
---
 Eine Kubernetes {{< glossary_tooltip text="Control Plane" term_id="control-plane" >}} Komponente, die Cloud spezifische Kontrolllogik einbettet. Der Cloud Controller Manager lässt Sie Ihr Cluster in die Cloud Provider API einbinden, und trennt die Komponenten die mit der Cloud Platform interagieren von Komponenten, die nur mit Ihrem Cluster interagieren.

<!--more-->

Durch Entkopplung der Interoperabilitätslogik zwischen Kubernetes und der darunterliegenden Cloud Infrastruktur, ermöglicht der Cloud Controller Manager den Cloud Providern das Freigeben neuer Features in einem anderen Tempo als das Kubernetes Projekt.

