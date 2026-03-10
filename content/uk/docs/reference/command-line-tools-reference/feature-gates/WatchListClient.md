---
title: WatchListClient
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: false
    fromVersion: "1.30"
    toVersion: "1.34"
  - stage: beta
    defaultValue: true
    fromVersion: "1.35"
---

Дозволяє клієнту API запитувати потік даних замість отримання повного списку. Ця функціональність доступна в `client-go` і вимагає, щоб на сервері була ввімкнена функція [WatchList](/docs/reference/command-line-tools-reference/feature-gates/). Якщо `WatchList` не підтримується на сервері, клієнт повернеться до стандартного запиту списку.
