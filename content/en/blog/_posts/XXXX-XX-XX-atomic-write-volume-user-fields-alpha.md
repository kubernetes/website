---
layout: blog
title: "Define file owner of atomically written volume files"
date: XXXX-XX-XX
slug: atomic-write-volume-user-fields-alpha
draft: true
author: >
  Gavin Lam (Independent)
---

<!--
Placeholder for KEP-5936 (Add user fields to atomic write volumes), targeting alpha in v1.37.
-->

Kubernetes v1.37 introduces (as an alpha feature) the ability for users to define the
desired file owner of `configMap`, `secret`, `downwardAPI` and `projected` volumes
using the new `defaultUser` and `user` fields.

## The problem

## What's new in v1.37

## How it works

## How to try it out

## What's next

## Getting involved

This work is tracked in [KEP-5936](https://github.com/kubernetes/enhancements/issues/5936)
by [SIG Storage](https://github.com/kubernetes/community/tree/master/sig-storage).
