---
title: "kubectl-convert 概述"
description: >-
  一个 kubectl 插件，允许你将清单从一个 Kubernetes API 版本转换到不同的版本。
headless: true
---
<!--
---
title: "kubectl-convert overview"
description: >-
  A kubectl plugin that allows you to convert manifests from one version
  of a Kubernetes API to a different version.
headless: true
---
-->

<!--
A plugin for Kubernetes command-line tool `kubectl`, which allows you to convert manifests between different API 
versions. This can be particularly helpful to migrate manifests to a non-deprecated api version with newer Kubernetes release.
For more info, visit [migrate to non deprecated apis](/docs/reference/using-api/deprecation-guide/#migrate-to-non-deprecated-apis)
-->
一个 Kubernetes 命令行工具 `kubectl` 的插件，允许你将清单在不同 API 版本间转换。
在将清单迁移到具有较新 Kubernetes 版本的未弃用 API 版本时，这个插件特别有用。
更多信息请访问 [迁移到非弃用 API](/zh/docs/reference/using-api/deprecation-guide/#migrate-to-non-deprecated-apis)
