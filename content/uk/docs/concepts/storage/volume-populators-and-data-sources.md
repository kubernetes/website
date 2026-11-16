---
title: Наповнювачі томів та джерела даних
content_type: concept
weight: 71
---

<!-- overview -->

У цьому документі описано _наповнювачі томів_ (volume populators) та _джерела даних_ (data sources) у Kubernetes. Рекомендується ознайомитися з [постійними томами](/docs/concepts/storage/persistent-volumes/).

<!-- body -->

Коли ви створюєте {{< glossary_tooltip text="PersistentVolumeClaim" term_id="persistent-volume-claim" >}}, том, який Kubernetes надає для нього, зазвичай спочатку порожній. _Джерело даних_ дозволяє натомість запитати, щоб новий том було попередньо заповнено наявними даними. _Наповнювачі томів_ — це контролери, які виконують це заповнення на основі джерела даних, на яке посилається PersistentVolumeClaim.

Kubernetes має вбудовану підтримку джерел даних, які [клонують наявний том](/docs/concepts/storage/volume-pvc-datasource/) або [відновлюють знімок тому](/docs/concepts/storage/volume-snapshots/). Власні наповнювачі томів розширюють цей механізм. Джерело даних — це власний ресурс, тобто обʼєкт, тип якого визначено за допомогою {{< glossary_tooltip text="CustomResourceDefinition" term_id="CustomResourceDefinition" >}}. Контролер-наповнювач стежить за PersistentVolumeClaims, які посилаються на такий ресурс, і заповнює з нього новий том.

## Наповнювачі томів та джерела даних {#volume-populators-and-data-sources}

{{< feature-state for_k8s_version="v1.24" state="beta" >}}

Kubernetes підтримує власні наповнювачі томів. Щоб використовувати власні наповнювачі томів, ви повинні ввімкнути функціональну можливість [`AnyVolumeDataSource`](/docs/reference/command-line-tools-reference/feature-gates/#AnyVolumeDataSource) для kube-apiserver та kube-controller-manager.

Наповнювачі томів використовують поле специфікації PVC з назвою `dataSourceRef`. На відміну від поля `dataSource`, яке може містити лише посилання на інший PersistentVolumeClaim або на VolumeSnapshot, поле `dataSourceRef` може містити посилання на будь-який обʼєкт у тому самому просторі імен, за винятком основних обʼєктів, відмінних від PVC. Для кластерів, у яких увімкнено цю функціональну можливість, слід надавати перевагу `dataSourceRef`, а не `dataSource`.

## Посилання на джерела даних {#data-source-references}

Поле `dataSourceRef` поводиться майже так само, як поле `dataSource`. Якщо вказано одне з них, а інше ні, API-сервер надасть обом полям однакове значення. Жодне з полів не можна змінити після створення, а спроба вказати різні значення для цих двох полів призведе до помилки валідації. Тому обидва поля завжди матимуть однаковий вміст.

Існують дві відмінності між полями `dataSourceRef` та `dataSource`, про які користувачі повинні знати:

* Поле `dataSource` ігнорує недійсні значення (ніби поле було порожнім), тоді як `dataSourceRef` ніколи не ігнорує значення і спричинить помилку, якщо використано недійсне значення. Недійсними значеннями є будь-які основні обʼєкти (обʼєкти без apiGroup), крім PVC.
* Поле `dataSourceRef` може містити різні типи обʼєктів, тоді як поле `dataSource` дозволяє лише PVC та VolumeSnapshots.

Коли ввімкнено можливість `CrossNamespaceVolumeDataSource`, зʼявляються додаткові відмінності:

* Поле `dataSource` дозволяє лише локальні обʼєкти, тоді як поле `dataSourceRef` дозволяє обʼєкти в будь-яких просторах імен.
* Коли вказано простір імен, `dataSource` та `dataSourceRef` не синхронізуються.

Користувачі завжди повинні використовувати `dataSourceRef` у кластерах, де ввімкнено цю функціональну можливість, і повертатися до `dataSource` у кластерах, де її не ввімкнено. За жодних обставин не потрібно переглядати обидва поля. Дубльовані значення з дещо різною семантикою існують лише для зворотної сумісності. Зокрема, суміш старіших і новіших контролерів може взаємодіяти, оскільки поля однакові.

### Використання наповнювачів томів {#using-volume-populators}

Наповнювачі томів — це {{< glossary_tooltip text="контролери" term_id="controller" >}}, які можуть створювати непорожні томи, вміст яких визначається власним ресурсом. Користувачі створюють заповнений том, посилаючись на власний ресурс за допомогою поля `dataSourceRef`:

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: populated-pvc
spec:
  dataSourceRef:
    name: example-name
    kind: ExampleDataSource
    apiGroup: example.storage.k8s.io
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
```

Оскільки наповнювачі томів є зовнішніми компонентами, спроби створити PVC, який використовує один із них, можуть завершитися невдачею, якщо встановлено не всі потрібні компоненти. Зовнішні контролери повинні генерувати Events на PVC, щоб надавати зворотний звʼязок про статус створення, зокрема попередження, якщо PVC неможливо створити через відсутність певного компонента.

Ви можете встановити у свій кластер alpha-контролер [volume data source validator](https://github.com/kubernetes-csi/volume-data-source-validator). Цей контролер генерує попереджувальні Events на PVC, якщо жоден наповнювач не зареєстровано для обробки такого виду джерела даних. Коли для PVC встановлено відповідний наповнювач, саме цей контролер-наповнювач відповідає за створення Events, повʼязаних зі створенням тому та проблемами під час цього процесу.

## Джерела даних між просторами імен {#cross-namespace-data-sources}

{{< feature-state for_k8s_version="v1.26" state="alpha" >}}

Kubernetes підтримує джерела даних томів між просторами імен. Щоб використовувати їх, ви повинні ввімкнути функціональні можливості [`AnyVolumeDataSource`](/docs/reference/command-line-tools-reference/feature-gates/#AnyVolumeDataSource) та [`CrossNamespaceVolumeDataSource`](/docs/reference/command-line-tools-reference/feature-gates/#CrossNamespaceVolumeDataSource) для kube-apiserver та kube-controller-manager. Крім того, ви повинні ввімкнути функціональну можливість `CrossNamespaceVolumeDataSource` для csi-provisioner.

Увімкнення функціональної можливості `CrossNamespaceVolumeDataSource` дозволяє вказати простір імен у полі dataSourceRef.

{{< note >}}
Коли ви вказуєте простір імен для джерела даних тому, Kubernetes перевіряє наявність ReferenceGrant в іншому просторі імен, перш ніж прийняти посилання. ReferenceGrant є частиною API розширення `gateway.networking.k8s.io`. Докладніше дивіться в розділі [ReferenceGrant](https://gateway-api.sigs.k8s.io/reference/api-types/referencegrant/) документації Gateway API. Це означає, що перед використанням цього механізму ви повинні розширити свій кластер Kubernetes принаймні ресурсом ReferenceGrant із Gateway API.
{{< /note >}}

### Використання джерела даних тому між просторами імен {#using-a-cross-namespace-volume-data-source}

{{< feature-state for_k8s_version="v1.26" state="alpha" >}}

Створіть ReferenceGrant, щоб дозволити власнику простору імен прийняти посилання. Ви визначаєте заповнений том, вказуючи джерело даних тому між просторами імен за допомогою поля `dataSourceRef`. У вихідному просторі імен уже повинен існувати дійсний ReferenceGrant:

   ```yaml
   apiVersion: gateway.networking.k8s.io/v1beta1
   kind: ReferenceGrant
   metadata:
     name: allow-ns1-pvc
     namespace: default
   spec:
     from:
     - group: ""
       kind: PersistentVolumeClaim
       namespace: ns1
     to:
     - group: snapshot.storage.k8s.io
       kind: VolumeSnapshot
       name: new-snapshot-demo
   ```

   ```yaml
   apiVersion: v1
   kind: PersistentVolumeClaim
   metadata:
     name: foo-pvc
     namespace: ns1
   spec:
     storageClassName: example
     accessModes:
     - ReadWriteOnce
     resources:
       requests:
         storage: 1Gi
     dataSourceRef:
       apiGroup: snapshot.storage.k8s.io
       kind: VolumeSnapshot
       name: new-snapshot-demo
       namespace: default
     volumeMode: Filesystem
   ```

## {{% heading "whatsnext" %}} {#whats-next}

* Дізнайтеся про [постійні томи](/docs/concepts/storage/persistent-volumes/).
* Дізнайтеся про [клонування томів CSI](/docs/concepts/storage/volume-pvc-datasource/).
* Дізнайтеся про [знімки томів](/docs/concepts/storage/volume-snapshots/).
* Прочитайте про [функціональні можливості](/docs/reference/command-line-tools-reference/feature-gates/), згадані на цій сторінці.
