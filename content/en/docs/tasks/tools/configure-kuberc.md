---
title: "Customize kubectl behavior with .kuberc"
description: "Learn how to configure kubectl's behavior using the optional .kuberc file"
slug: customize-kubectl-kuberc
weight: 10
---

## Overview

The `.kuberc` file is an optional user-level configuration file introduced in newer versions of `kubectl` (v1.30+).  
It allows you to define preferences for how `kubectl` behaves — such as setting a default namespace, hiding warnings, or modifying CLI behavior — without affecting cluster configuration.

> ⚠️ Note: `.kuberc` is **not a replacement** for your `kubeconfig` file. It works **alongside** it to customize the CLI experience.

---

## Prerequisites

- `kubectl` version **1.30 or higher**
- Basic knowledge of using Kubernetes CLI
- Access to a terminal or shell environment

---

## Creating a `.kuberc` File

To get started, create the file in your home directory:

```bash
touch ~/.kuberc
Then open the file and add your preferred settings:

```yaml
default-namespace: dev
disable-warnings: true
