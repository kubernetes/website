---
title: Перехід від опитування до оновлення стану контейнера на основі подій CRI
min-kubernetes-server-version: 1.26
content_type: task
weight: 90
---

{{< feature-state feature_gate_name="EventedPLEG" >}}

<!-- overview -->

Ця сторінка показує, як перевести вузли на оновлення стану контейнерів на основі подій. Реалізація на основі подій зменшує споживання ресурсів вузла kubelet порівняно зі старим підходом, що ґрунтується на опитуванні. Можливо, ви знаєте цю можливість як _evented Pod lifecycle event generator (PLEG)_. Цю назву використовують усередині проєкту Kubernetes для ключової деталі реалізації.

Підхід на основі опитування відомий як _generic PLEG_.

## {{% heading "prerequisites" %}} {#before-you-begin}

* Вам потрібна версія Kubernetes, яка надає цю можливість. Kubernetes v1.27 містить бета-підтримку оновлень стану контейнерів на основі подій. Ця можливість перебуває на стадії бета, але стандартно _вимкнена_, оскільки потребує підтримки з боку середовища виконання контейнерів.
* {{< version-check >}} Якщо ви використовуєте іншу версію Kubernetes, перевірте документацію для цього релізу.
* Середовище виконання контейнерів, що використовується, має підтримувати події життєвого циклу контейнерів. Kubelet автоматично повертається до старого механізму generic PLEG, якщо середовище виконання контейнерів не оголошує підтримку подій життєвого циклу контейнерів, навіть якщо цю функціональну можливість увімкнено.

<!-- steps -->

## Навіщо переходити на Evented PLEG? {#why-switch-to-evented-pleg}

* _Generic PLEG_ викликає значне навантаження через часте опитування стану контейнерів.
* Це навантаження посилюється паралельним опитуванням станів контейнерів у kubelet, що обмежує його масштабованість і спричиняє низьку продуктивність і проблеми з надійністю.
* Мета _Evented PLEG_ — зменшити непотрібну роботу під час бездіяльності шляхом заміни періодичного опитування.

## Перехід на Evented PLEG {#switching-to-evented-pleg}

1. Запустіть kubelet з увімкненою функціональною можливістю [`EventedPLEG`](/docs/reference/command-line-tools-reference/feature-gates/#EventedPLEG). Керувати функціональними можливостями kubelet можна, відредагувавши [файл конфігурації](/docs/tasks/administer-cluster/kubelet-config-file/) kubelet і перезапустивши сервіс kubelet. Це потрібно зробити на кожному вузлі, де ви використовуєте цю можливість.

2. Перш ніж продовжити, переконайтеся, що для вузла виконано [drain](/docs/tasks/administer-cluster/safely-drain-node/).

3. Запустіть середовище виконання контейнерів з увімкненою генерацією подій контейнерів.

   {{< tabs name="tab_with_code" >}}
   {{% tab name="Containerd" %}}
   Версія 1.7+
   {{% /tab %}}
   {{% tab name="CRI-O" %}}
   Версія 1.26+

   Перевірте, чи CRI-O вже налаштовано на надсилання подій CRI, переглянувши конфігурацію,

   ```shell
   crio config | grep enable_pod_events
   ```

   Якщо це ввімкнено, вивід має бути подібним до такого:

   ```none
   enable_pod_events = true
   ```

   Щоб увімкнути це, запустіть демон CRI-O з прапорцем `--enable-pod-events=true` або використайте dropin-конфігурацію з такими рядками:

   ```toml
   [crio.runtime]
   enable_pod_events = true
   ```

   {{% /tab %}}
   {{< /tabs >}}

   {{< version-check >}}

4. Перевірте, що kubelet використовує моніторинг зміни стану контейнерів на основі подій. Для цього шукайте термін `EventedPLEG` у логах kubelet.

   Вивід має бути подібним до такого:

   ```console
   I0314 11:10:13.909915 1105457 feature_gate.go:249] feature gates: &{map[EventedPLEG:true]}
   ```

   Якщо ви встановили `--v` у значення 4 і вище, ви можете побачити більше записів, що підтверджують, що kubelet використовує моніторинг стану контейнера на основі подій.

   ```console
   I0314 11:12:42.009542 1110177 evented.go:238] "Evented PLEG: Generated pod status from the received event" podUID=3b2c6172-b112-447a-ba96-94e7022912dc
   I0314 11:12:44.623326 1110177 evented.go:238] "Evented PLEG: Generated pod status from the received event" podUID=b3fba5ea-a8c5-4b76-8f43-481e17e8ec40
   I0314 11:12:44.714564 1110177 evented.go:238] "Evented PLEG: Generated pod status from the received event" podUID=b3fba5ea-a8c5-4b76-8f43-481e17e8ec40
   ```

## {{% heading "whatsnext" %}} {#what-s-next}

* Докладніше про дизайн дивіться в пропозиції щодо покращення Kubernetes (KEP): [Kubelet Evented PLEG for Better Performance](https://github.com/kubernetes/enhancements/blob/5b258a990adabc2ffdc9d84581ea6ed696f7ce6c/keps/sig-node/3386-kubelet-evented-pleg/README.md).
