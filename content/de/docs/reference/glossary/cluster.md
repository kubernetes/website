---
title: Cluster
id: cluster
date: 2019-06-15
full_link: 
short_description: >
   Ein Satz Arbeitermaschinen, genannt Knoten, die containerisierte Anwendungen ausführen. Jedes Cluster hat mindestens einen Arbeiterknoten.

aka: 
tags:
- fundamental
- operation
---
Ein Satz Arbeitermaschinen, gennant {{< glossary_tooltip text="Knoten" term_id="node" >}}, die containerisierte Anwendungen ausführen. Jedes Cluster hat mindestens einen Arbeiterknoten.

<!--more-->
Die Arbeiterknoten bringen die {{< glossary_tooltip text="Pods" term_id="pod" >}} unter, die die Komponenten der Applikationslast sind. Die {{< glossary_tooltip text="Control Plane" term_id="control-plane" >}} verwaltet die Arbeiterknoten und Pods im Cluster. In Produktionsumgebungen läuft die Control Plane meistens über mehrere Computer, und ein Cluster hat meistens mehrere Knoten, um Fehlertoleranz und Hochverfügbarkeit zu ermöglichen.
