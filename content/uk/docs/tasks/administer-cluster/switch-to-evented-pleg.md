---
title: Перехід від опитування до оновлення стану контейнера на основі подій CRI
min-kubernetes-server-version: 1.26
content_type: task
weight: 93
---

{{< feature-state feature_gate_name="EventedPLEG" >}}

<!-- overview -->

Ця сторінка показує, як мігрувати вузли для використання оновлення стану контейнера на основі подій. Реалізація на основі подій зменшує використання ресурсів вузла kubeletʼом порівняно зі старим підходом, який ґрунтується на опитуванні. Ви можете знати цю функцію як _evented Pod lifecycle event generator (PLEG)_. Це назва, яка використовується внутрішньо в проєкті Kubernetes для основних деталей реалізації.

Підхід на основі опитування відомий як _generic PLEG_.

## {{% heading "prerequisites" %}}

* Ви повинні запускати версію Kubernetes, яка надає цю функцію. Kubernetes v1.27 включає підтримку бета-версії оновлення стану контейнера на основі подій. Функція є бета-версією, але стандартно _вимкнена_, оскільки вона потребує підтримки від середовища виконання контейнерів.
* {{< version-check >}} Якщо ви використовуєте іншу версію Kubernetes, перевірте документацію для цього релізу.
* Використане контейнерне середовище повинно підтримувати події життєвого циклу контейнера. Kubelet автоматично повертається до старого механізму опитування generic PLEG, якщо контейнерне середовище не оголошує підтримку подій життєвого циклу контейнера, навіть якщо у вас увімкнено цей функціонал.

<!-- steps -->

## Навіщо переходити на Evented PLEG? {#why-switch-to-evented-pleg}

* _Generic PLEG_ викликає значне навантаження через часте опитування стану контейнерів.
* Це навантаження загострюється паралельним опитуванням стану контейнерів kublet, що обмежує його масштабованість та призводить до проблем з поганим функціонуванням та надійністю.
* Мета _Evented PLEG_ — зменшити непотрібну роботу під час бездіяльності шляхом заміни періодичного опитування.

## Перехід на Evented PLEG {#switching-to-evented-pleg}

1. Запустіть Kubelet з увімкненою [функціональною можливістю](/docs/reference/command-line-tools-reference/feature-gates/) `EventedPLEG`. Ви можете керувати feature gate kubelet редагуючи [файл конфігурації](/docs/tasks/administer-cluster/kubelet-config-file/) kubelet і перезапустіть службу kubelet. Вам потрібно зробити це на кожному вузлі, де ви використовуєте цю функцію.

2. Переконайтеся, що вузол [виведено з експлуатації](/docs/tasks/administer-cluster/safely-drain-node/) перед продовженням.

3. Запустіть контейнерне середовище з увімкненою генерацією подій контейнера.

   {{< tabs name="tab_with_code" >}}
   {{% tab name="Containerd" %}}
   Версія 1.7+
   {{% /tab %}}
   {{% tab name="CRI-O" %}}
   Версія 1.26+

   Перевірте, чи CRI-O вже налаштований на відправлення CRI-подій, перевіривши конфігурацію,

   ```shell
   crio config | grep enable_pod_events
   ```

   Якщо він увімкнений, вивід повинен бути схожий на наступний:

   ```none
   enable_pod_events = true
   ```

   Щоб увімкнути його, запустіть демон CRI-O з прапорцем `--enable-pod-events=true` або використовуйте конфігурацію dropin з наступними рядками:

   ```toml
   [crio.runtime]
   enable_pod_events: true
   ```

   {{% /tab %}}
   {{< /tabs >}}

   {{< version-check >}}

4. Перевірте, що kubelet використовує моніторинг стану контейнера на основі подій. Щоб перевірити це, шукайте термін `EventedPLEG` в журналах kubelet.

   Вивід буде схожий на це:

   ```console
   I0314 11:10:13.909915 1105457 feature_gate.go:249] feature gates: &{map[EventedPLEG:true]}
   ```

   Якщо ви встановили `--v` у значення 4 і вище, ви можете побачити більше записів, що підтверджують, що kubelet використовує моніторинг стану контейнера на основі подій.

   ```console
   I0314 11:12:42.009542 1110177 evented.go:238] "Evented PLEG: Generated pod status from the received event" podUID=3b2c6172-b112-447a-ba96-94e7022912dc
   I0314 11:12:44.623326 1110177 evented.go:238] "Evented PLEG: Generated pod status from the received event" podUID=b3fba5ea-a8c5-4b76-8f43-481e17e8ec40
   I0314 11:12:44.714564 1110177 evented.go:238] "Evented PLEG: Generated pod status from the received event" podUID=b3fba5ea-a8c5-4b76-8f43-481e17e8ec40
   ```

## {{% heading "whatsnext" %}}

* Дізнайтеся більше про дизайн у пропозиції покращення Kubernetes (KEP): [Kubelet Evented PLEG for Better Performance](https://github.com/kubernetes/enhancements/blob/5b258a990adabc2ffdc9d84581ea6ed696f7ce6c/keps/sig-node/3386-kubelet-evented-pleg/README.md).
