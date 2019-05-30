---
title: kubeadm-for-windows
authors:
  - "@ksubrmnn"
  - "@patricklang"
owning-sig: sig-windows
Participating-sigs:
  - sig-windows
  - sig-cluster-lifecycle
reviewers:
approvers:
editor: "@ksubrmnn"
creation-date: 2019-05-30
last-updated: 2019-05-30
---

# Kubeadm for Windows

## Summary

In Kubernetes 1.14, official support was added for Windows Containers. However, there is no official tool available to users for 
joining a Windows node to a cluster. The current solution is to create a set of scripts to download Kubernetes binaries and write 
their config files, but this has proven to be cumbersome and is a huge pain point for Windows adoption. On Linux, Kubeadm is 
available to quickly join nodes to a cluster, and now the same functionality is available for for Windows.

It should be noted that at this time, this document is only a placeholder for the doc that will describe how to use kubeadm with Windows worker
nodes.
