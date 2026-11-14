---
title: WorkloadWithJob
content_type: feature_gate
build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.36"
---

Дозволяє контролеру Job компілювати конфігурацію `.spec.scheduling` Job у обʼєкти [Workload](/docs/concepts/workloads/workload-api/) та [PodGroup](/docs/concepts/workloads/podgroup-api/) перед створенням будь-яких Podʼів. Коли `.spec.scheduling` не вказано, Job типово використовує політику планування `Basic`. Див. [Інтеграція з Workload API](/docs/concepts/workloads/controllers/job#integrate-with-workload-apis) для деталей.
