---
title: AtomicWriteVolumeUserFields
content_type: feature_gate

build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.37"
---
Ця функціональна можливість існує в сервері API Kubernetes та в kubelet.

Використання з kube-apiserver дозволяє користувачам встановлювати поля `user` та `defaultUser` для томів `configMap`, `secret`, `downwardAPI` та `projected`.

У kubelet, якщо поля `user` або `defaultUser` вказані для тому, вона встановлює UID власника файлів даних тому під час створення файлів.
