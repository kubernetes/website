---
layout: blog
title: 'Попередній огляд Kubernetes v1.37'
date: 2026-07-31T08:00:00-08:00
slug: kubernetes-v1-37-sneak-peek
author: >
  Arsh Sharma,
  Christopher Tineo,
  Kirti Goyal,
  Sophia Ugochukwu,
  Swathi Rao,
  Troy Connor
translator: >
  [Андрій Головін](https://github.com/Andygol)
---

У міру наближення дати випуску Kubernetes v1.37 (проєкт розвивається та вдосконалюється) деякі функції можуть бути визнані застарілими, видаленими або замінені кращими з метою забезпечення загального стабільного функціонування проєкту. У цьому дописі міститься опис деяких запланованих змін у версії Kubernetes v1.37, про які, на думку команди з випуску, вам слід знати для подальшого обслуговування вашого середовища Kubernetes та щоб бути в курсі останніх змін. Наведена нижче інформація показує поточний стан версії v1.37 і може змінитися до фактичної дати випуску.

## Застарівання та видалення у Kubernetes v1.37 {#deprecations-and-removals-for-kubernetes-v1-37}

### Kubectl: `kubectl run --filename/-f` буде визнано застарілим {#kubectl-kubectl-run-filename-f-to-be-deprecated}

Прапорець `--filename` (або `-f`) для `kubectl run` буде визнано застарілим, оскільки згенерований Pod завжди будується виключно з CLI-аргументів, таких як `NAME` і `--image`.

Див. [kubernetes/kubernetes#138671](https://github.com/kubernetes/kubernetes/issues/138671) для ознайомлення з оригінальною проблемою та обговорення.

### Kubelet: Статичні Podʼи більше не можуть посилатися на Секрети чи ConfigMap {#kubelet-static-pods-can-no-longer-reference-secrets-or-configmaps}

Статичні Podʼи ніколи не були призначені для прямого читання API-ресурсів, оскільки вони не створюються через API-сервер, але помилка дозволяла їм посилатися на Секрети чи ConfigMap через такі поля, як `configMapRef` або `secretRef`. Ця помилка тепер виправлена: починаючи з v1.37 такі посилання суворо заборонені, а функціональну можливість `PreventStaticPodAPIReferences`, яка раніше дозволяла вам відмовитися від обмеження, було видалено.

Див. [kubernetes/kubernetes#140226](https://github.com/kubernetes/kubernetes/issues/140226) для ознайомлення з оригінальною проблемою та обговорення.

### Застарівання підтримки `ipvs` режиму в kube-proxy {#deprecating-kube-proxy-s-support-for-ipvs-mode}

Підтримка `ipvs` режиму в `kube-proxy` була введена в v1.8 для вирішення проблем продуктивності `iptables`. Однак, оскільки API `ipvs` ядра сам по собі не може повністю реалізувати Kubernetes Services, `ipvs` режим продовжує використовувати `iptables` під капотом ([KEP-3866, "The ipvs mode of kube-proxy will not save us"](https://github.com/kubernetes/enhancements/blob/master/keps/sig-network/3866-nftables-proxy/README.md#the-ipvs-mode-of-kube-proxy-will-not-save-us)).

Кластери, в яких `kube-proxy` працює в ipvs режимі (або `mode: ipvs` в KubeProxyConfiguration), тепер логують попередження про застарівання під час запуску. Термін застарівання виглядає так:

- До v1.40 `ipvs` режим для `kube-proxy` очікується, що буде стандартно вимкненим (але його все ще можна вибрати через функціональну можливість)
- До v1.43 підтримка `ipvs` режиму буде повністю видалена [KEP-5495, Graduation Criteria](https://github.com/kubernetes/enhancements/blob/master/keps/sig-network/5495-deprecate-ipvs-mode-in-kube-proxy/README.md#graduation-criteria).

Щоб перевірити , який режим ви зараз використовуєте, скористайтеся:

```bash
kubectl -n kube-system get configmap kube-proxy -o jsonpath='{.data.config\.conf}' | grep 'mode:'
```

Щоб зрозуміти обґрунтування цього застарівання, див. [KEP-5495: Deprecate ipvs mode in kube-proxy](https://kubernetes.dev/resources/keps/5495).

## Майбутні великі зміни {#ongoing-major-changes}

### Майбутнє видалення підтримки cgroup v1 {#cgroup-v1-support}

Оскільки сучасні дистрибутиви Linux та рушій виконання контейнерів стандартно використовують [cgroup v2](/docs/concepts/architecture/cgroups/), підтримка застарілої cgroup v1 офіційно поступово припиняється. Починаючи з випуску v1.35, налаштування `failCgroupV1` зазвичай встановлено true. Як наслідок, `kubelet` не зможе ініціалізуватися на будь-яких вузлах, що все ще покладаються на cgroup v1, якщо не буде застосовано явне налаштування заміни.

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
failCgroupV1: false # тимчасове перевизначення
```

Використання цього перевизначення слід вважати короткостроковим виправленням. Розширені можливості керування ресурсами, такі як In-Place Pod Resizing та Tiered Memory Protection, повністю залежать від cgroup v2. Хоча перевизначення залишається доступним у Kubernetes v1.37, користувачам рекомендується мігрувати до cgroup v2, оскільки підтримка cgroup v1 планується бути видаленою в майбутньому випуску.

Щоб дізнатися більше про це застарівання, зверніться до [KEP-5573: Remove cgroup v1 support](https://kubernetes.dev/resources/keps/5573).

## Кардинальні зміни у Kubernetes v1.37 {#breaking-changes-in-kubernetes-v1-37}

### Перемаркування томів SELinux ("SELinuxMount") переходить до GA {#SELinuxMount-GA}

SELinuxMount очікується, що досягне GA та буде стандартно увімкненим у v1.37. Томи будуть монтуватися з `-o context=<label>` (опція монтування зі стандартними значеннями) замість рекурсивного переназначення міток, але **лише** коли CSI драйвер тома погодиться на це через CSIDriver, що встановлює `.spec seLinuxMount: true`.

Оскільки одне монтування може містити лише один контекст SELinux, поди, що мають різні мітки SELinux і спільно використовують том на одному вузлі (які раніше могли співіснувати завдяки рекурсивній зміні міток), тепер можуть не запускатися. Щоб зберегти попередню рекурсивну поведінку для конкретного робочого навантаження, вкажіть у специфікації Podʼів значення `seLinuxChangePolicy: Recursive`.

У кластерах, де SELinux не ввімкнено, жодних змін не спостерігається. Щоб дізнатися більше, перегляньте [SELinux Volume Label Changes goes GA (and likely implications in v1.37)](/blog/2026/04/22/breaking-changes-in-selinux-volume-labeling/)

## Основні вдосконалення Kubernetes v1.37 {#featured-enhancements-of-kubernetes-v1-37}

### Metrics API переходить до GA {#metrics-api-ga}

Очікується, що API `metrics.k8s.io` досягне рівня Stable (GA) у Kubernetes v1.37 після майже девʼяти років перебування в Beta. API забезпечує стандартний спосіб отримання даних про використання CPU та памʼяті для Podʼів та вузлів, підтримуючи роботу таких широко використовуваних функцій Kubernetes, як Horizontal Pod Autoscaler (HPA) та команд на кшталт `kubectl top`.

Цей перехід до стабільної версії визнає стабільність API та його широке впровадження, без очікуваних функціональних змін. Обидва типи `v1` та `v1beta1` залишаться робочими під час переходу, дозволяючи розробникам прийняти стабільний API у власному темпі без внесення суттєвих змін в наявні робочі процеси.

Щоб дізнатися більше про це покращення, зверніться до [KEP-5207: metrics.k8s.io API definition](https://www.kubernetes.dev/resources/keps/5207/).

### Kubelet у UserNS, а саме Rootless Mode {#kubelet-in-userns-a-k-a-rootless-mode}

Традиційно, компоненти вузла Kubernetes, такі як `kubelet`, працюють з привілеями root на хості. Хоча це необхідно для багатьох розгортань, це також означає, що вразливість в одному з цих компонентів могла б потенційно мати більший вплив на базову систему.

У Kubernetes v1.37 очікується, що kubelet у User Namespace (Rootless Mode) досягне Beta. Це покращення дозволяє Kubernetes компонентам вузла працювати всередині Linux user namespace як непривілейованому користувачу на хості, але все одно поводитися як root всередині namespace. Зменшуючи потребу в привілеях root на рівні хосту, воно додає додатковий шар ізоляції та допомагає обмежити вплив потенційних вразливостей, що впливають на компоненти вузла.

Щоб дізнатися більше про це покращення, зверніться до [KEP-2033: Kubelet in UserNS(aka Rootless Mode)](https://kubernetes.dev/resources/keps/4960).

### Моніторинг стану томів {#volume-health-monitor}

Історично в Kubernetes не було API, за допомогою якого драйвери CSI могли б повідомляти про збої в роботі систем зберігання даних, які виявлялися лише через невдалі монтування або зависання операцій вводу-виводу. Оскільки контролери усунення несправностей не мали жодних даних у машиночитаному форматі, на основі яких можна було б вжити заходів, єдиним способом зʼясувати першопричину такого збою було зіставлення обʼєктів Kubernetes із даними на зовнішніх інформаційних панелях постачальників.

У Kubernetes v1.37 цей KEP повертає статус Graduation до рівня Alpha після початкової реалізації у версії v1.21 та впроваджує чотири нові RPC-інтерфейси CSI. Втулок контролера повідомляє про стан томів сховища за допомогою `ControllerListVolumeHealth` (виводить список томів, що не працюють належним чином) та `ControllerGetVolumeHealth` (перевіряє стан конкретного тому). Монітор працездатності на стороні контролера опитує ці контролери CSI та зберігає результати у `PersistentVolumeClaim.status.healthStatus`.

На боці вузла, kubelet викликає `NodeGetVolumeHealth`, щоб отримати стан окремих томів на цьому вузлі та записує його в `Pod.status.volumeHealth`, тоді як `NodeGetStorageHealth` повідомляє про стан драйверів, зареєстрованих на вузлі, в `CSINode.status.storageHealth`.

Набір помилок тримається простим, розширюваним та машиннозчитуваним (`Inaccessible`, `Degraded` тощо), з подальшим деталізованим описом від драйвера через `reason` та `message`. Нарешті, звіти на боці контролера та на боці вузла тримаються незалежними та, отже, відображаються окремо, забезпечуючи більш цілісний огляд стану сховища споживачам.

Щоб дізнатися більше про це покращення, зверніться до [KEP-1432: Volume Health Monitor](https://kubernetes.dev/resources/keps/1432).

## Хочете дізнатися більше? {#want-to-know-more}

Нові функції та функції, що виводяться з експлуатації, також оголошуються в нотатках до випуску Kubernetes. Ми офіційно оголосимо, що нового в [Kubernetes v1.37](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.37.md) у рамках CHANGELOG для цього випуску.

Випуск Kubernetes v1.37 заплановано на **середу, 26 серпня 2026 року**. Слідкуйте за оновленнями!

Ви також можете переглянути оголошення про зміни в нотатках до випуску для:

- [Kubernetes v1.36](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.36.md)

- [Kubernetes v1.35](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.35.md)

- [Kubernetes v1.34](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.34.md)

- [Kubernetes v1.33](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.33.md)

## Долучайтеся до спільноти Kubernetes {#get-involved}

Найпростіший спосіб долучитися до проєкту Kubernetes — приєднатися до однієї з багатьох [Special Interest Groups](https://kubernetes.dev/community/community-groups/sigs/) (SIG), які відповідають вашим інтересам.

Якщо ви не знаєте, з чого почати, долучайтеся до наших щомісячних [сесій для нових учасників](https://www.kubernetes.dev/docs/orientation/), де ми розповідаємо спільноті, як влаштований проєкт, і допоможемо вам зробити свій перший внесок.

- Дізнайтеся більше про те, як стати [учасником Kubernetes](https://www.kubernetes.dev/docs/guide/)
- Читайте більше про те, що відбувається з Kubernetes у нашому [блозі](https://kubernetes.io/blog/)
- Приєднуйтеся до нас у [Slack](http://slack.k8s.io/)
- Слідкуйте за нами у [X](https://x.com/kubernetesio)
- Слідкуйте за нами у [LinkedIn](https://www.linkedin.com/company/kubernetes/)
- Слідкуйте за нами у [Bluesky](https://bsky.app/profile/kubernetes.io) для останніх оновлень
- Долучайтеся до обговорень спільноти на [Discuss](https://discuss.kubernetes.io/)
- Ставте питання (або відповідайте на питання) на [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)
- Поділіться [своєю історією користувача Kubernetes](https://www.cncf.io/case-studies/)
- Дізнайтеся більше про [команду випуску Kubernetes](https://github.com/kubernetes/sig-release/tree/master/release-team)
