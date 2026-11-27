---
# Removed from Kubernetes
title: RootCAConfigMap
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.13"
    toVersion: "1.19"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.20"
    toVersion: "1.20"
  - stage: stable
    defaultValue: true
    fromVersion: "1.21"
    toVersion: "1.22"

removed: true
---
Налаштуйте `kube-controller-manager` на публікацію {{< glossary_tooltip text="ConfigMap" term_id="configmap" >}} з назвою `kube-root-ca.crt` у кожному просторі імен. Цей ConfigMap містить пакет CA, який використовується для перевірки зʼєднань з kube-apiserver. Докладні відомості наведено у статті [Токени привʼязаних службових облікових записів](https://github.com/kubernetes/enhancements/blob/master/keps/sig-auth/1205-bound-service-account-tokens/README.md).
