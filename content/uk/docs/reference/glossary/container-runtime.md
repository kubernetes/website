---
title: Середовища виконання контейнерів
id: container-runtime
date: 2019-06-05
full_link: /docs/setup/production-environment/container-runtimes
short_description: >
  Середовище виконання контейнера — це програмне забезпечення, яке відповідає за запуск та виконання контейнерів.

aka:
- Container Runtime
tags:
- fundamental
- workload
---

Основний компонент, який дозволяє Kubernetes ефективно запускати контейнери. Він відповідає за керування виконанням і життєвим циклом контейнерів у середовищі Kubernetes.

<!--more-->

Kubernetes підтримує середовища виконання контейнерів, такі як {{< glossary_tooltip term_id="containerd" >}}, {{< glossary_tooltip term_id="cri-o" >}}, та будь-яку іншу реалізацію [Kubernetes CRI (інтерфейс виконання контейнерів)](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-node/container-runtime-interface.md).
