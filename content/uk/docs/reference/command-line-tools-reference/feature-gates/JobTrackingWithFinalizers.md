---
title: JobTrackingWithFinalizers
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.22"
    toVersion: "1.22"
  - stage: beta
    defaultValue: false
    fromVersion: "1.23"
    toVersion: "1.24"
  - stage: beta
    defaultValue: true
    fromVersion: "1.25"
    toVersion: "1.25"
  - stage: stable
    defaultValue: true
    fromVersion: "1.26"
    toVersion: "1.28"

removed: true
---
Дозволяє відстежувати завершення [Job](/docs/concepts/workloads/controllers/job), не покладаючись на те, що Pods залишаться в кластері на невизначений час. Контролер Job використовує завершувачі Pod і поле у статусі Job для відстеження завершених Podʼів, щоб зарахувати їх до списку завершених.
