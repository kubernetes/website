---
title: "kubectl-convert 概述"
description: >-
  一個 kubectl 外掛，允許你將清單從一個 Kubernetes API 版本轉換到不同的版本。
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
一個 Kubernetes 命令列工具 `kubectl` 的外掛，允許你將清單在不同 API 版本間轉換。
這對於將清單遷移到新的 Kubernetes 發行版上未被廢棄的 API 版本時尤其有幫助。
更多資訊請訪問 [遷移到非棄用 API](/zh-cn/docs/reference/using-api/deprecation-guide/#migrate-to-non-deprecated-apis)
