---
layout: blog
title: 'Image Pull Policy: Configuring Kubernetes to Ensure Access Security for Container Images in a Multi-Tenant Environment'
date: 2024-02-22
slug: ensure-secret-pulled-images
---

**Authors:** Michael Brown (IBM), Paco Xu (DaoCloud)

Intro..

## Understanding Kubernetes Image Pull Policies

excerpts from : https://kubernetes.io/docs/concepts/containers/images/

## Configuring The Ensure Secret Pulled Images Featuregate

## Dependencies

## Use Cases (with feature gate enabled)

### Cluster running only non-proprietary (e.g. open-source) images. No need to hide images.

### Cluster running some proprietary images which should be hidden to those outside the company, but visible to all cluster users.

### Cluster with proprietary images, a few of which require stricter access control.

### A multi-tenant cluster where each tenant needs own private registry

## Closing Notes

