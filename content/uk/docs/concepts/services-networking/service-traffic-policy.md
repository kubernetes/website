---
title: Політика внутрішнього трафіку Service
content_type: concept
weight: 120
description: >-
  Якщо два Podʼи у вашому кластері хочуть взаємодіяти, і обидва Podʼи фактично працюють на одному вузлі, використовуйте _політику внутрішнього трафіку Service_, щоб утримувати мережевий трафік у межах цього вузла. Якщо уникнути проходження трафіку туди й назад через мережу кластера, це може допомогти з надійністю, продуктивністю (затримкою мережі та пропускною здатністю) або вартістю.
---


<!-- overview -->

{{<feature-state for_k8s_version="v1.26" state="stable">}}

_Політика внутрішнього трафіку Service_ дозволяє обмежити внутрішній трафік, маршрутизуючи його лише до точок доступу в межах вузла, з якого надійшов трафік. Тут «внутрішній» трафік означає трафік, який надходить від Podʼів у поточному кластері. Це може допомогти зменшити витрати та покращити продуктивність.

<!-- body -->

## Використання політики внутрішнього трафіку Service {#using-service-internal-traffic-policy}

Ви можете увімкнути політику лише для внутрішнього трафіку для {{< glossary_tooltip text="Service" term_id="service" >}}, встановивши його `.spec.internalTrafficPolicy` у `Local`. Це вказує kube-proxy використовувати для внутрішнього трафіку кластера лише локальні для вузла точки доступу.

{{< note >}}
Для Podʼів на вузлах без точок доступу для певного Service цей Service поводиться так, ніби в нього немає точок доступу (для Podʼів на цьому вузлі), навіть якщо він має точки доступу на інших вузлах.
{{< /note >}}

У цьому прикладі показано, як виглядає Service, коли ви встановлюєте `.spec.internalTrafficPolicy` у `Local`:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app.kubernetes.io/name: MyApp
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9376
  internalTrafficPolicy: Local
```

## Як це працює {#how-it-works}

kube-proxy фільтрує точки доступу, до яких він маршрутизує трафік, на основі параметра `spec.internalTrafficPolicy`. Коли встановлено `Local`, враховуються лише локальні для вузла точки доступу. Коли встановлено `Cluster` (стандартно) або параметр не встановлено, Kubernetes враховує всі точки доступу.

## {{% heading "whatsnext" %}} {#whats-next}

* Дізнайтеся про [маршрутизацію з урахуванням топології](/docs/concepts/services-networking/topology-aware-routing)
* Дізнайтеся про [політику зовнішнього трафіку Service](/docs/tasks/access-application-cluster/create-external-load-balancer/#preserving-the-client-source-ip)
* Пройдіть навчальний матеріал [Підключення застосунків за допомогою Services](/docs/tutorials/services/connect-applications-service/)
