---
title: Ефемерні томи
content_type: concept
weight: 30
---

<!-- overview -->

У цьому документі описано _ефемерні томи_ в Kubernetes. Рекомендується ознайомитися з [томами](/docs/concepts/storage/volumes/), зокрема з PersistentVolumeClaim та PersistentVolume.

<!-- body -->

Деяким застосункам потрібне додаткове сховище, але їм не важливо, чи зберігаються ці дані постійно між перезапусками. Наприклад, сервіси кешування часто обмежені обсягом памʼяті й можуть переміщувати рідко використовувані дані в сховище, повільніше за памʼять, майже не впливаючи на загальну продуктивність.

Інші застосунки очікують, що у файлах будуть певні вхідні дані лише для читання, наприклад, конфігураційні дані або секретні ключі.

_Ефемерні томи_ призначені для таких сценаріїв використання. Оскільки томи живуть стільки ж, скільки Pod, і створюються та видаляються разом із ним, Podʼи можна зупиняти й перезапускати, не обмежуючись місцем, де доступний певний постійний том.

Ефемерні томи вказуються _inline_ у специфікації Podʼа, що спрощує розгортання застосунків і керування ними.

### Типи ефемерних томів {#types-of-ephemeral-volumes}

Kubernetes підтримує кілька різновидів ефемерних томів для різних цілей:

- [emptyDir](/docs/concepts/storage/volumes/#emptydir): порожній під час запуску Podʼа, сховище надається локально з базової теки kubelet (зазвичай кореневий диск) або з оперативної памʼяті
- [configMap](/docs/concepts/storage/volumes/#configmap), [downwardAPI](/docs/concepts/storage/volumes/#downwardapi), [secret](/docs/concepts/storage/volumes/#secret): вставляють різні види даних Kubernetes у Pod
- [image](/docs/concepts/storage/volumes/#image): дозволяє монтувати файли образів контейнерів або артефакти безпосередньо в Pod.
- [ефемерні томи CSI](#csi-ephemeral-volumes): схожі на попередні види томів, але надаються спеціальними драйверами {{< glossary_tooltip text="CSI" term_id="csi" >}}, які спеціально [підтримують цю можливість](https://kubernetes-csi.github.io/docs/ephemeral-local-volumes.html)
- [загальні ефемерні томи](#generic-ephemeral-volumes), які можуть надавати всі драйвери сховища, що також підтримують постійні томи

`emptyDir`, `configMap`, `downwardAPI`, `secret` надаються як [локальне тимчасове сховище](/docs/concepts/storage/ephemeral-storage/). Ними керує kubelet на кожному вузлі.

Ефемерні томи CSI *повинні* надаватися сторонніми драйверами сховища CSI.

Загальні ефемерні томи *можуть* надаватися сторонніми драйверами сховища CSI, а також будь-яким іншим драйвером сховища, який підтримує динамічне надання. Деякі драйвери CSI написані спеціально для ефемерних томів CSI і не підтримують динамічне надання: їх не можна використовувати для загальних ефемерних томів.

Перевага сторонніх драйверів полягає в тому, що вони можуть пропонувати функціональність, яку сам Kubernetes не підтримує, наприклад, сховище з іншими характеристиками продуктивності, ніж диск, яким керує kubelet, або вставлення інших даних.

### Ефемерні томи CSI {#csi-ephemeral-volumes}

{{< feature-state for_k8s_version="v1.25" state="stable" >}}

{{< note >}}
Ефемерні томи CSI підтримує лише частина драйверів CSI. [Список драйверів](https://kubernetes-csi.github.io/docs/drivers.html) Kubernetes CSI показує, які драйвери підтримують ефемерні томи.
{{< /note >}}

Концептуально ефемерні томи CSI схожі на типи томів `configMap`, `downwardAPI` та `secret`: сховище керується локально на кожному вузлі й створюється разом з іншими локальними ресурсами після того, як Pod заплановано на вузол. На цьому етапі Kubernetes уже не має поняття про перепланування Podʼів. Створення тому має бути таким, щоб збій був малоймовірним, інакше запуск Podʼа застрягне. Зокрема, [планування Podʼів з урахуванням місткості сховища](/docs/concepts/storage/storage-capacity/) для цих томів *не* підтримується. Наразі на них також не поширюються обмеження використання ресурсів сховища Podʼа, оскільки kubelet може застосовувати їх лише до сховища, яким керує сам.

Ось приклад маніфесту для Podʼа, який використовує ефемерне сховище CSI:

```yaml
kind: Pod
apiVersion: v1
metadata:
  name: my-csi-app
spec:
  containers:
    - name: my-frontend
      image: busybox:1.28
      volumeMounts:
      - mountPath: "/data"
        name: my-csi-inline-vol
      command: [ "sleep", "1000000" ]
  volumes:
    - name: my-csi-inline-vol
      csi:
        driver: inline.storage.kubernetes.io
        volumeAttributes:
          foo: bar
```

`volumeAttributes` визначають, який том готує драйвер. Ці атрибути специфічні для кожного драйвера й не стандартизовані. Додаткові інструкції дивіться в документації кожного драйвера CSI.

### Обмеження драйверів CSI {#csi-driver-restrictions}

Ефемерні томи CSI дозволяють користувачам передавати `volumeAttributes` безпосередньо драйверу CSI як частину специфікації Podʼа. Драйвер CSI, який дозволяє `volumeAttributes`, що зазвичай доступні лише адміністраторам, НЕ підходить для використання в inline-ефемерному томі. Наприклад, параметри, які зазвичай визначаються в StorageClass, не слід відкривати користувачам через inline-ефемерні томи.

Адміністратори кластера, яким потрібно обмежити драйвери CSI, дозволені для використання як inline-томи у специфікації Podʼа, можуть зробити це так:

- Вилучити `Ephemeral` із `volumeLifecycleModes` у специфікації CSIDriver, що не дасть використовувати драйвер як inline-ефемерний том.
- Використати [вебхук допуску](/docs/reference/access-authn-authz/extensible-admission-controllers/), щоб обмежити використання цього драйвера.

### Загальні ефемерні томи {#generic-ephemeral-volumes}

{{< feature-state for_k8s_version="v1.23" state="stable" >}}

Загальні ефемерні томи схожі на томи `emptyDir` у тому сенсі, що надають кожному Podʼу теку для робочих даних, яка зазвичай порожня після надання. Але вони також можуть мати додаткові можливості:

- Сховище може бути локальним або мережевим.
- Томи можуть мати фіксований розмір, який Podʼи не можуть перевищити.
- Томи можуть мати певні початкові дані, залежно від драйвера та параметрів.
- Підтримуються звичайні операції з томами, якщо їх підтримує драйвер, зокрема [створення знімків](/docs/concepts/storage/volume-snapshots/), [клонування](/docs/concepts/storage/volume-pvc-datasource/), [зміна розміру](/docs/concepts/storage/persistent-volumes/#expanding-persistent-volumes-claims) та [відстеження місткості сховища](/docs/concepts/storage/storage-capacity/).

Приклад:

```yaml
kind: Pod
apiVersion: v1
metadata:
  name: my-app
spec:
  containers:
    - name: my-frontend
      image: busybox:1.28
      volumeMounts:
      - mountPath: "/scratch"
        name: scratch-volume
      command: [ "sleep", "1000000" ]
  volumes:
    - name: scratch-volume
      ephemeral:
        volumeClaimTemplate:
          metadata:
            labels:
              type: my-frontend-volume
          spec:
            accessModes: [ "ReadWriteOnce" ]
            storageClassName: "scratch-storage-class"
            resources:
              requests:
                storage: 1Gi
```

### Життєвий цикл та PersistentVolumeClaim {#lifecycle-and-persistentvolumeclaim}

Ключова ідея дизайну полягає в тому, що [параметри для PersistentVolumeClaim](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#ephemeralvolumesource-v1-core) дозволені всередині джерела тому Podʼа. Підтримуються мітки, анотації та весь набір полів PersistentVolumeClaim. Коли такий Pod створюється, контролер ефемерних томів створює фактичний обʼєкт PersistentVolumeClaim у тому самому просторі імен, що й Pod, і забезпечує видалення PersistentVolumeClaim під час видалення Podʼа.

Це запускає привʼязку та/або надання тому: або негайно, якщо {{< glossary_tooltip text="StorageClass" term_id="storage-class" >}} використовує негайну привʼязку томів, або коли Pod попередньо заплановано на вузол (режим привʼязки томів `WaitForFirstConsumer`). Другий варіант рекомендовано для загальних ефемерних томів, оскільки тоді планувальник може вільно вибрати придатний вузол для Podʼа. За негайної привʼязки планувальник змушений вибрати вузол, який має доступ до тому, щойно том стає доступним.

З погляду [власності на ресурси](/docs/concepts/architecture/garbage-collection/#owners-dependents) Pod, який має загальне ефемерне сховище, є власником PersistentVolumeClaim(ів), що надають це ефемерне сховище. Коли Pod видаляють, збирач сміття Kubernetes видаляє PVC, що зазвичай спричиняє видалення тому, оскільки стандартна політика повторного використання класів сховища — видаляти томи. Ви можете створити квазіефемерне локальне сховище за допомогою StorageClass із політикою повторного використання `retain`: сховище переживає Pod, і в цьому випадку потрібно подбати про окреме очищення тому.

Поки ці PVC існують, їх можна використовувати, як будь-який інший PVC. Зокрема, на них можна посилатися як на джерело даних під час клонування томів або створення знімків. Обʼєкт PVC також містить поточний статус тому.

### Іменування PersistentVolumeClaim {#persistentvolumeclaim-naming}

Назви автоматично створених PVC є детермінованими: назва є комбінацією назви Podʼа та назви тому з дефісом (`-`) посередині. У наведеному вище прикладі назва PVC буде `my-app-scratch-volume`. Таке детерміноване іменування полегшує взаємодію з PVC, оскільки його не потрібно шукати, якщо відомі назва Podʼа та назва тому.

Детерміноване іменування також створює потенційний конфлікт між різними Podʼами (Pod "pod-a" з томом "scratch" та інший Pod з назвою "pod" і томом "a-scratch" отримають однакову назву PVC "pod-a-scratch"), а також між Podʼами та PVC, створеними вручну.

Такі конфлікти виявляються: PVC використовується для ефемерного тому, лише якщо його створено для цього Podʼа. Ця перевірка базується на відносинах власності. Наявний PVC не перезаписується і не змінюється. Але це не розвʼязує конфлікт, оскільки без правильного PVC Pod не може запуститися.

{{< caution >}}
Будьте обережні, називаючи Podʼи й томи в тому самому просторі імен, щоб таких конфліктів не виникало.
{{< /caution >}}

### Безпека {#security}

Використання загальних ефемерних томів дозволяє користувачам створювати PVC опосередковано, якщо вони можуть створювати Podʼи, навіть якщо в них немає дозволу створювати PVC безпосередньо. Адміністратори кластера мають про це знати. Якщо це не відповідає їхній моделі безпеки, вони повинні використовувати [вебхук допуску](/docs/reference/access-authn-authz/extensible-admission-controllers/), який відхиляє обʼєкти, такі як Podʼи, що мають загальний ефемерний том.

Звичайна [квота простору імен для PVC](/docs/concepts/policy/resource-quotas/#storage-resource-quota) однаково застосовується, тому навіть якщо користувачам дозволено використовувати цей новий механізм, вони не можуть обходити з його допомогою інші політики.

## {{% heading "whatsnext" %}} {#whats-next}

### Ефемерні томи, керовані kubelet {#ephemeral-volumes-managed-by-kubelet}

Дивіться [локальне тимчасове сховище](/docs/concepts/storage/ephemeral-storage/).

### Ефемерні томи CSI {#csi-ephemeral-volumes-1}

- Докладніше про дизайн читайте в [Ephemeral Inline CSI volumes KEP](https://github.com/kubernetes/enhancements/blob/ad6021b3d61a49040a3f835e12c8bb5424db2bbb/keps/sig-storage/20190122-csi-inline-volumes.md).
- Докладніше про подальший розвиток цієї можливості читайте в [issue для відстеження вдосконалення #596](https://github.com/kubernetes/enhancements/issues/596).

### Загальні ефемерні томи {#generic-ephemeral-volumes-1}

- Докладніше про дизайн читайте в [Generic ephemeral inline volumes KEP](https://github.com/kubernetes/enhancements/blob/master/keps/sig-storage/1698-generic-ephemeral-volumes/README.md).
