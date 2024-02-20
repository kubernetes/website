---
title: CIDR
id: cidr
date: 2019-11-12
full_link: 
short_description: >
  CIDR ist eine Notation, um Blöcke von IP Adressen zu beschreiben und wird viel verwendet in verschiedenen Netzwerkkonfigurationen.

aka:
tags:
- networking
---
CIDR (Classless Inter-Domain Routing) ist eine Notation, um Blöcke von IP Adressen zu beschreiben und wird viel verwendet in verschiedenen Netzwerkkonfigurationen.

<!--more-->

Im Kubernetes Kontext, erhält jeder {{< glossary_tooltip text="Knoten" term_id="node" >}} eine Reihe von IP Adressen durch die Startadresse und eine Subnetzmaske unter Verwendung von CIDR. Dies erlaubt Knoten jedem {{< glossary_tooltip text="Pod" term_id="pod" >}} eine eigene IP Adresse zuzuweisen. Obwohl es ursprünglich ein Konzept für IPv4 ist, wurde CIDR erweitert um auch IPv6 einzubinden.

