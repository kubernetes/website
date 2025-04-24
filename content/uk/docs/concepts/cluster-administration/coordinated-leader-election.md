---
title: Координовані вибори лідера
content_type: concept
weight: 200
---

<!-- overview -->

{{< feature-state feature_gate_name="CoordinatedLeaderElection" >}}

Kubernetes {{< skew currentVersion >}} включає бета-функцію, яка дозволяє компонентам {{< glossary_tooltip text="панелі управління" term_id="control-plane" >}} детерміновано обирати лідера через _координовані вибори лідера_. Це корисно для задоволення обмежень щодо несумісності версій Kubernetes під час оновлення кластера. Наразі єдина вбудована стратегія вибору — це `OldestEmulationVersion`, що надає перевагу лідеру з найнижчою версією емуляції, за яким йде бінарна версія, а потім позначка часу створення.

## Увімкнення координованих виборів лідера {#enabling-coordinated-leader-election}

Переконайтеся, що [функціональну можливість](/docs/reference/command-line-tools-reference/feature-gates/) `CoordinatedLeaderElection` увімкнено під час запуску {{< glossary_tooltip text="API Server" term_id="kube-apiserver" >}} та що група API `coordination.k8s.io/v1beta1` увімкнена також.

Це можна зробити, встановивши прапорці `--feature-gates="CoordinatedLeaderElection=true"` та `--runtime-config="coordination.k8s.io/v1beta1=true"`.

## Конфігурація компонентів {#component-configuration}

За умови, що ви увімкнули функціональну можливість `CoordinatedLeaderElection` _та_ увімкнули групу API `coordination.k8s.io/v1beta1`, сумісні компоненти панелі управління автоматично використовують LeaseCandidate та Lease API для вибору лідера за потреби.

Для Kubernetes {{< skew currentVersion >}} два компоненти панелі управління (kube-controller-manager і kube-scheduler) автоматично використовують координовані вибори лідера, коли функціональну можливість та група API увімкнені.
