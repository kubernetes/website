---
title: Політики внутрішнього трафіку Service
content_type: concept
weight: 120
description: >-
  Якщо два Podʼа в вашому кластері хочуть взаємодіяти, і вони обидва фактично працюють на одному й тому ж вузлі, використовуйте _Політики внутрішнього трафіку Service_, щоб утримувати мережевий трафік в межах цього вузла. Уникнення зворотного зв’язку через кластерну мережу може допомогти підвищити надійність, продуктивність (затримку мережі та пропускну здатність) або вартість.
---


<!-- overview -->

{{<feature-state for_k8s_version="v1.26" state="stable">}}

_Політика внутрішнього трафіку Service_ дозволяє обмежувати внутрішній трафік, маршрутизуючи його лише до endpoint у межах вузла, з якого походить трафік. Тут "внутрішній" трафік означає трафік, який виник з Podʼів у поточному кластері. Це може допомогти зменшити витрати та покращити продуктивність.

<!-- body -->

## Використання політики внутрішнього трафіку Service {#using-service-internal-traffic-policy}

Ви можете увімкнути політику тільки для внутрішнього трафіку для {{<glossary_tooltip text="Service" term_id="service">}}, встановивши його `.spec.internalTrafficPolicy` в `Local`. Це вказує kube-proxy використовувати лише вузлові локальні endpoint для внутрішнього трафіку кластера.

{{< note >}}
Для Podʼів на вузлах без endpoint для певного Service, Service буде працювати так, ніби в нього немає endpoint (для Podʼів на цьому вузлі), навіть якщо у Service є endpointʼи на інших вузлах. {{< /note >}}

У наступному прикладі показано, як виглядає Service, коли ви встановлюєте
`.spec.internalTrafficPolicy` в `Local`:

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

Kube-proxy фільтрує endpointʼи, до яких він виконує маршрутизацію, на основі налаштувань `spec.internalTrafficPolicy`. Коли вона встановлена в `Local`, розглядаються тільки вузлові локальні endpointʼи. Коли вона встановлена в `Cluster` (стандартно), або не встановлена взагалі, Kubernetes розглядає всі endpointʼи.

## {{% heading "whatsnext" %}}

* Дізнайтеся про [Маршрутизацію з урахуванням топології](/docs/concepts/services-networking/topology-aware-routing)
* Дізнайтеся про [Політики зовнішнього трафіку Service](/docs/tasks/access-application-cluster/create-external-load-balancer/#preserving-the-client-source-ip)
* Скористайтесь довідником [Підключенням застосунків за допомогою Service](/docs/tutorials/services/connect-applications-service/).
