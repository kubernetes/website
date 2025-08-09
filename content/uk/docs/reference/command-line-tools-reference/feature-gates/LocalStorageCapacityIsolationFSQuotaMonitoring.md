---
title: LocalStorageCapacityIsolationFSQuotaMonitoring
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.15"
    toVersion: "1.30"
  - stage: beta
    defaultValue: false
    fromVersion: "1.31"
---
Якщо `LocalStorageCapacityIsolation` увімкнено для [локального ефемерного сховища](/docs/concepts/configuration/manage-resources-containers/), резервна файлова система для [томів emptyDir](/docs/concepts/storage/volumes/#emptydir) підтримує квоти проєктів і `UserNamespacesSupport` увімкнено, квоти проєктів використовуються для моніторингу споживання сховища томів `emptyDir`, а не шляхом проходу файловою системою, що забезпечує кращу продуктивність і точність.
