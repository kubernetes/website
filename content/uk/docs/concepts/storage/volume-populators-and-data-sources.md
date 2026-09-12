---
title: Наповнювачі томів та джерела даних
content_type: concept
weight: 71
---

<!-- overview -->

У цьому документі описано _наповнювачі томів_ (volume populators) та _джерела даних_ (data sources) в Kubernetes. Рекомендується вже мати уявлення про [постійні томи](/docs/concepts/storage/persistent-volumes/).

<!-- body -->

Коли ви створюєте {{< glossary_tooltip text="PersistentVolumeClaim" term_id="persistent-volume-claim" >}}, том, який Kubernetes виділяє для нього, зазвичай спочатку є порожнім. _Джерело даних_ дозволяє замість цього запитувати, щоб новий том був попередньо заповнений наявними даними. _Наповнювачі томів_ — це контролери, які виконують це заповнення на основі джерела даних, на яке посилається PersistentVolumeClaim.

Kubernetes має вбудовану підтримку джерел даних, які [клонують наявний том](/docs/concepts/storage/volume-pvc-datasource/) або [відновлюють знімок тому](/docs/concepts/storage/volume-snapshots/). Користувацькі наповнювачі томів розширюють цей механізм. Джерело даних — це користувацький ресурс, тобто обʼєкт, тип якого визначено за допомогою {{< glossary_tooltip text="CustomResourceDefinition" term_id="CustomResourceDefinition" >}}. Контролер-наповнювач відстежує PersistentVolumeClaims, які посилаються на такий ресурс, і заповнює новий том даними з нього.

## Наповнювачі томів та джерела даних {#volume-populators-and-data-sources}

{{< feature-state for_k8s_version="v1.24" state="beta" >}}

Kubernetes підтримує користувацькі наповнювачі томів. Щоб використовувати користувацькі наповнювачі томів, ви повинні увімкнути функціональну можливість [`AnyVolumeDataSource`](/docs/reference/command-line-tools-reference/feature-gates/#AnyVolumeDataSource) для kube-apiserver та kube-controller-manager.

Наповнювачі томів використовують поле специфікації PVC з назвою `dataSourceRef`. На відміну від поля `dataSource`, яке може містити лише посилання на інший PersistentVolumeClaim або на VolumeSnapshot, поле `dataSourceRef` може містити посилання на будь-який обʼєкт у тому самому просторі імен, за винятком основних обʼєктів, відмінних від PVC. Для кластерів, у яких увімкнено цю функціональну можливість, використання `dataSourceRef` є кращим, ніж `dataSource`.

## Посилання на джерела даних {#data-source-references}

Поле `dataSourceRef` поводиться майже так само, як поле `dataSource`. Якщо одне з них вказано, а інше — ні, сервер API надасть обом полям однакове значення. Жодне поле не може бути змінено після створення, а спроба вказати різні значення для цих двох полів призведе до помилки валідації. Тому обидва поля завжди матимуть однаковий вміст.

Існують дві відмінності між полями `dataSourceRef` та `dataSource`, про які користувачі повинні знати:

* Поле `dataSource` ігнорує недійсні значення (ніби поле було порожнім), тоді як `dataSourceRef` ніколи не ігнорує значення і спричинить помилку, якщо використано недійсне значення. Недійсними значеннями є будь-які основні обʼєкти (обʼєкти без apiGroup), крім PVC.
* Поле `dataSourceRef` може містити різні типи обʼєктів, тоді як поле `dataSource` дозволяє лише PVC та VolumeSnapshots.

Коли увімкнено функцію `CrossNamespaceVolumeDataSource`, зʼявляються додаткові відмінності:

* Поле `dataSource` дозволяє лише локальні обʼєкти, тоді як поле `dataSourceRef` дозволяє   обʼєкти в будь-яких просторах імен.
* Коли вказано простір імен, `dataSource` та `dataSourceRef` не синхронізуються.

Користувачі завжди повинні використовувати `dataSourceRef` у кластерах, де увімкнено цю функціональну можливість, і повертатися до `dataSource` у кластерах, де її немає. Немає необхідності переглядати обидва поля за жодних обставин. Дубльовані значення з дещо різною семантикою існують лише для зворотної сумісності. Зокрема, суміш старих і нових контролерів може взаємодіяти, оскільки поля однакові.

### Використання наповнювачів томів {#using-volume-populators}

Наповнювачі томів — це {{< glossary_tooltip text="контролери" term_id="controller" >}}, які можуть створювати непорожні томи, де вміст тому визначається користувацьким ресурсом. Користувачі створюють заповнений том, посилаючись на користувацький ресурс за допомогою поля `dataSourceRef`:

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

Оскільки наповнювачі томів є зовнішніми компонентами, спроби створити PVC, який їх використовує, можуть зазнати невдачі, якщо не встановлено всі необхідні компоненти. Зовнішні контролери повинні генерувати події на PVC для надання зворотного звʼязку щодо статусу створення, включаючи попередження, якщо PVC не може бути створено через відсутність певного компонента.

Ви можете встановити alpha-контролер [volume data source validator](https://github.com/kubernetes-csi/volume-data-source-validator) у свій кластер. Цей контролер генерує попереджувальні події (Events) на PVC у випадку, якщо жоден наповнювач не зареєстровано для обробки такого типу джерела даних. Коли відповідний наповнювач встановлено для PVC, саме цей контролер-наповнювач відповідає за створення подій, повʼязаних зі створенням тому та проблемами під час цього процесу.

## Джерела даних між просторами імен {#cross-namespace-data-sources}

{{< feature-state for_k8s_version="v1.26" state="alpha" >}}

Kubernetes підтримує джерела даних томів між просторами імен. Щоб використовувати джерела даних томів між просторами імен, ви повинні увімкнути функціональні можливості [`AnyVolumeDataSource`](https://kubernetes.io/docs/reference/command-line-tools-reference/feature-gates/#AnyVolumeDataSource) та [`CrossNamespaceVolumeDataSource`](https://kubernetes.io/docs/reference/command-line-tools-reference/feature-gates/#CrossNamespaceVolumeDataSource) для kube-apiserver та kube-controller-manager. Крім того, ви повинні увімкнути функціональну можливість `CrossNamespaceVolumeDataSource` для csi-provisioner.

Увімкнення функціональної можливості `CrossNamespaceVolumeDataSource` дозволяє вам вказати простір імен у полі dataSourceRef.

{{< note >}}
Коли ви вказуєте простір імен для джерела даних тому, Kubernetes перевіряє наявність ReferenceGrant в іншому просторі імен перед прийняттям посилання. ReferenceGrant є частиною розширених API `gateway.networking.k8s.io`. Перегляньте [ReferenceGrant](https://gateway-api.sigs.k8s.io/api-types/referencegrant/) в документації Gateway API для отримання деталей. Це означає, що ви повинні розширити свій кластер Kubernetes принаймні ReferenceGrant з Gateway API, перш ніж ви зможете використовувати цей механізм.
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

## {{% heading "whatsnext" %}}

* Дізнайтеся про [постійні томи](/docs/concepts/storage/persistent-volumes/).
* Дізнайтеся про [клонування CSI-томів](/docs/concepts/storage/volume-pvc-datasource/).
* Дізнайтеся про [знімки томів](/docs/concepts/storage/volume-snapshots/).
* Прочитайте про [функціональні можливості](/docs/reference/command-line-tools-reference/feature-gates/), згадані на цій сторінці.
