---
title: Network namespace
id: network-namespace
date: 2024-12-12
short_description: >
  Linux mechanism to provide custom networking to a subset of processes.

aka:
tags:
- networking
---
A form of isolation used on Linux, where different processes (such as in containers) see a
different set of network interfaces and configuration than the host system.

<!-- more -->

The host system is typically represented by a root network namespace, which is often what
network plugins use to set up connectivity between nodes (and between Pods on those nodes).

A network namespace is not the same as a Kubernetes {{< glossary_tooltip term_id="namespace" text="namespace">}}.
