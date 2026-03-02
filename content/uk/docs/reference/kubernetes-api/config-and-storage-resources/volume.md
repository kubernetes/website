---
api_metadata:
  apiVersion: ""
  import: "k8s.io/api/core/v1"
  kind: "Volume"
content_type: "api_reference"
description: "Volume представляє собою іменований том у Pod, до якого може мати доступ будь-який контейнер у Podʼі."
title: "Volume"
weight: 10
auto_generated: false
---

`import "k8s.io/api/core/v1"`

## Volume {#Volume}

Volume становить собою іменований том у Pod, до якого може мати доступ будь-який контейнер у Podʼі.

---

- **name** (string), обовʼязково

  Назва тома. Повинна бути DNS_LABEL і унікальна в межах Pod. Додаткова інформація: [https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names](/docs/concepts/overview/working-with-objects/names/#names)

### Відкриті постійні томи {#exposed-persistent-volumes}

- **persistentVolumeClaim** (PersistentVolumeClaimVolumeSource)

  persistentVolumeClaimVolumeSource — це посилання на PersistentVolumeClaim у тому ж просторі імен. Додаткова інформація: [https://kubernetes.io/docs/concepts/storage/persistent-volumes#persistentvolumeclaims](/docs/concepts/storage/persistent-volumes#persistentvolumeclaims)

  <a name="PersistentVolumeClaimVolumeSource"></a>
  *PersistentVolumeClaimVolumeSource посилається на PVC користувача в тому ж просторі імен. Цей том знаходить привʼязаний PV та монтує цей том для Podʼа. PersistentVolumeClaimVolumeSource, фактично, є обгорткою навколо іншого типу тому, який належить комусь іншому (системі).*

  - **persistentVolumeClaim.claimName** (string), обовʼязково

    claimName — це назва PersistentVolumeClaim у тому ж просторі імен, що й у Podʼа, який використовує цей том. Додаткова інформація: [https://kubernetes.io/docs/concepts/storage/persistent-volumes#persistentvolumeclaims](/docs/concepts/storage/persistent-volumes#persistentvolumeclaims)

  - **persistentVolumeClaim.readOnly** (boolean)

    readOnly — Встановлює значення ReadOnly у VolumeMounts. Стандартне значення — false.

### Проєкції {#projections}

- **configMap** (ConfigMapVolumeSource)

  configMap — представляє configMap, який повинен заповнити цей том.

  <a name="ConfigMapVolumeSource"></a>
  *Адаптує ConfigMap до тому.

  Вміст поля Data цільового ConfigMap буде представлений у томі у вигляді файлів, використовуючи ключі у полі Data як назви файлів, якщо елемент items заповнений конкретними зіставленнями ключів зі шляхами. Томи ConfigMap підтримують керування власністю та перепризначення міток SELinux.

  - **configMap.name** (string)

    Name — назва обʼєкта ConfigMap, повʼязаного з томом. Це поле є обов\язковим для заповнення, але для забезпечення зворотної сумісності дозволяється залишати його порожнім. Екземпляри цього типу з порожнім значенням тут майже напевно є помилковими. Додаткова інформація: [https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names](/docs/concepts/overview/working-with-objects/names/#names)

  - **configMap.optional** (boolean)

    optional — вказує, чи ConfigMap або його ключі мають бути визначені.

  - **configMap.defaultMode** (int32)

    defaultMode є необовʼязковим параметром: біти режимів, які використовуються для встановлення стандартних дозволів на створені файли. Має бути вісімковим значенням між 0000 та 0777 або десятковим значенням між 0 та 511. У форматі YAML можна використовувати як вісімкові, так і десяткові значення, у форматі JSON потрібно використовувати десяткові значення для режиму бітів. Стандартне значення — 0644. Теки всередині шляху не підпадають під це налаштування. Це може суперечити іншим параметрам, які впливають на режим файлу, наприклад, fsGroup, і результат може бути встановлення інших бітів режимів.

  - **configMap.items** ([]<a href="{{< ref "../config-and-storage-resources/volume#KeyToPath" >}}">KeyToPath</a>)

    *Atomic: буде замінено під час злиття*

    Якщо не вказано items, кожна пара ключ-значення у полі Data зазначеного ConfigMap буде перенесена в том як файл, імʼя якого — це ключ, а вміст — значення. Якщо вказано, перераховані ключі будуть перенесені у вказані шляхи, а невказані ключі відсутні. Якщо вказано ключ, якого немає у ConfigMap, налаштування тому завершиться помилкою, якщо він не позначений як необовʼязковий. Шляхи повинні бути відносними та не можуть містити шлях '..' або починатися з '..'.

  - **secret** (SecretVolumeSource)

    secret — представляє secret, який повинен заповнити цей том. Додаткова інформація: [https://kubernetes.io/docs/concepts/storage/volumes#secret](/docs/concepts/storage/volumes#secret)

    <a name="SecretVolumeSource"></a>
    *Адаптує Secret до тому.

    Вміст поля Data цільового Secret буде представлений у томі у вигляді файлів, використовуючи ключі у полі Data як назви файлів. Томи Secret підтримують керування власністю та перепризначення міток SELinux.*

  - **secret.secretName** (string)

    secretName — назва обʼєкта Secret в просторі імен Podʼа, що буде використовуватись. Додаткова інформація: [https://kubernetes.io/docs/concepts/storage/volumes#secret](/docs/concepts/storage/volumes#secret)

  - **secret.optional** (boolean)

    optional — вказує, чи Secret або його ключі мають бути визначені.

  - **secret.defaultMode** (int32)

    defaultMode є необовʼязковим параметром: біти режимів, які використовуються для встановлення стандартних дозволів на створені файли. Має бути вісімковим значенням між 0000 та 0777 або десятковим значенням між 0 та 511. У форматі YAML можна використовувати як вісімкові, так і десяткові значення, у форматі JSON потрібно використовувати десяткові значення для режиму бітів. Стандартне значення — 0644. Теки всередині шляху не підпадають під це налаштування. Це може суперечити іншим параметрам, які впливають на режим файлу, наприклад, fsGroup, і результат може бути встановлення інших бітів режимів.

  - **secret.items** ([]<a href="{{< ref "../config-and-storage-resources/volume#KeyToPath" >}}">KeyToPath</a>)

    *Atomic: буде замінено під час злиття*

    Якщо не вказано items, кожна пара ключ-значення у полі Data зазначеного Secret буде перенесена в том як файл, імʼя якого — це ключ, а вміст — значення. Якщо вказано, перераховані ключі будуть перенесені у вказані шляхи, а невказані ключі відсутні. Якщо вказано ключ, якого немає у Secret, налаштування тому завершиться помилкою, якщо він не позначений як необовʼязковий. Шляхи повинні бути відносними та не можуть містити шлях '..' або починатися з '..'.

- **downwardAPI** (DownwardAPIVolumeSource)

  downwardAPI — представляє downward API Podʼа, який повинен заповнити цей том.

  <a name="DownwardAPIVolumeSource"></a>
  *DownwardAPIVolumeSource представляє том з вмістом з downward API. Томи downward API підтримують керування власністю та перепризначення міток SELinux.*

  - **downwardAPI.defaultMode** (int32)

    Опційно: біти режимів, які використовуються для встановлення стандартних дозволів на створені файли. Має бути вісімковим значенням між 0000 та 0777 або десятковим значенням між 0 та 511. У форматі YAML можна використовувати як вісімкові, так і десяткові значення, у форматі JSON потрібно використовувати десяткові значення для режиму бітів. Стандартне значення — 0644. Теки всередині шляху не підпадають під це налаштування. Це може суперечити іншим параметрам, які впливають на режим файлу, наприклад, fsGroup, і результат може бути встановлення інших бітів режимів.

  - **downwardAPI.items** ([]<a href="{{< ref "../config-and-storage-resources/volume#DownwardAPIVolumeFile" >}}">DownwardAPIVolumeFile</a>)

    *Atomic: буде замінено під час злиття*

    Items – список файлів тому downward API

- **projected** (ProjectedVolumeSource)

    projected — елементи для ресурсів all-in-one Secret, ConfigMap, downward API

    <a name="ProjectedVolumeSource"></a>
    *Представляє джерело projected тому*

  - **projected.defaultMode** (int32)

    defaultMode є бітами режимів, які використовуються для встановлення стандартних дозволів на створені файли. Має бути вісімковим значенням між 0000 та 0777 або десятковим значенням між 0 та 511. У форматі YAML можна використовувати як вісімкові, так і десяткові значення, у форматі JSON потрібно використовувати десяткові значення для режиму бітів. Стандартне значення — 0644. Теки всередині шляху не підпадають під це налаштування. Це може суперечити іншим параметрам, які впливають на режим файлу, наприклад, fsGroup, і результат може бути встановлення інших бітів режимів.

  - **projected.sources** ([]VolumeProjection)

    *Atomic: буде замінено під час злиття*

    sources — список джерел, які мають бути спроєцьовані. Кожен запис у цьому списку працює з одним джерелом.

    <a name="VolumeProjection"></a>
    *Проєкція, яка може бути спроєцьована разом з іншими підтримуваними типами томів. Тільки одне з цих полів повинно бути встановлене.*

    - **projected.sources.clusterTrustBundle** (ClusterTrustBundleProjection)

      `ClusterTrustBundle` дозволяє podʼу отримати доступ до поля `.spec.trustBundle` обʼєктів ClusterTrustBundle через файл з автоматичним оновленням.

      Альфа-функція, контрольована через функціональну можливість ClusterTrustBundleProjection.

      Обʼєкти ClusterTrustBundle можуть бути вибрані за іменем або за комбінацією імені підписувача і селектора міток.

      Kubelet виконує агресивну нормалізацію вмісту PEM, записаного у файлову систему podʼа. Езотеричні функції PEM, такі як міжблочні коментарі та заголовки блоків, видаляються. Сертифікати дедуплікуються. Порядок сертифікатів у файлі довільний, і Kubelet може змінювати його з часом.

      <a name="ClusterTrustBundleProjection"></a>
      *ClusterTrustBundleProjection описує, як вибрати набір обʼєктів ClusterTrustBundle і спроєктувати їх вміст у файлову систему подів.*

      - **projected.sources.clusterTrustBundle.path** (string), обовʼязково

        Відносний шлях від кореня тому для запису пакунка.

      - **projected.sources.clusterTrustBundle.labelSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

        Вибирає всі ClusterTrustBundles, які відповідають цьому селектору міток.  Має ефект, тільки якщо задано signerName.  Взаємовиключне з name.  Якщо не задано, інтерпретується як «не збігається ні з чим».  Якщо задано, але пусте, інтерпретується як «збігається з усім».

      - **projected.sources.clusterTrustBundle.name** (string)

        Вибирає один ClusterTrustBundle за назвою об'єкта. Взаємовиключне з signerName та labelSelector.

      - **projected.sources.clusterTrustBundle.optional** (boolean)

        Якщо `true`, не блокувати запуск podʼа, якщо посилання на ClusterTrustBundle(и) недоступні. Якщо використовується імʼя, тоді дозволено відсутність вказаного ClusterTrustBundle. Якщо використовується `signerName`, тоді комбінація `signerName` і `labelSelector` може не відповідати жодному ClusterTrustBundle.

      - **projected.sources.clusterTrustBundle.signerName** (string)

        Виберає усі ClusterTrustBundles, які відповідають цьому імені підписувача. Взаємовиключні з name.  Вміст усіх вибраних ClusterTrustBundles буде уніфіковано та дедупліковано.

    - **projected.sources.configMap** (ConfigMapProjection)

      configMap — інформація про дані ConfigMap, які мають бути спроєцьовані

      <a name="ConfigMapProjection"></a>
      *Адаптує ConfigMap для projected тому

      Вміст поля Data цільового ConfigMap буде представлений у projected томі у вигляді файлів, використовуючи ключі у полі даних як назви файлів, якщо елемент items заповнений конкретними зіставленнями ключів зі шляхами. Зверніть увагу, що це ідентично джерелу тому ConfigMap без стандартного режиму.*

      - **projected.sources.configMap.name** (string)

        Name — назва обʼєкта на який посилаються. Це поле є обов'язковим для заповнення, але для забезпечення зворотної сумісності дозволяється залишати його порожнім. Екземпляри цього типу з порожнім значенням тут майже напевно є помилковими. Додаткова інформація: [https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names](/docs/concepts/overview/working-with-objects/names/#names)

      - **projected.sources.configMap.optional** (boolean)

        optional — вказує, чи ConfigMap або його ключі мають бути визначені.

      - **projected.sources.configMap.items** ([]<a href="{{< ref "../config-and-storage-resources/volume#KeyToPath" >}}">KeyToPath</a>)

        *Atomic: буде замінено під час злиття*

        Якщо не вказано items, кожна пара ключ-значення у полі Data зазначеного ConfigMap буде перенесена в том як файл, імʼя якого — це ключ, а вміст — значення. Якщо вказано, перераховані ключі будуть перенесені у вказані шляхи, а невказані ключі відсутні. Якщо вказано ключ, якого немає у ConfigMap, налаштування тому завершиться помилкою, якщо він не позначений як необовʼязковий. Шляхи повинні бути відносними та не можуть містити шлях '..' або починатися з '..'.

    - **projected.sources.downwardAPI** (DownwardAPIProjection)

        downwardAPI — інформація про дані downward API, які мають бути спроєцьовані

        <a name="DownwardAPIProjection"></a>
        *Представляє інформацію downward API для проєцювання у projected том. Зверніть увагу, що це ідентично джерелу тому downward API без стандартного режиму.*

      - **projected.sources.downwardAPI.items** ([]<a href="{{< ref "../config-and-storage-resources/volume#DownwardAPIVolumeFile" >}}">DownwardAPIVolumeFile</a>)

        *Atomic: буде замінено під час злиття*

        Items — список файлів DownwardAPIVolume

    - **projected.sources.podCertificate** (PodCertificateProjection)

      Проєцює пакет облікових даних з автоматичною ротацією (приватний ключ і ланцюжок сертифікатів), який під може використовувати як клієнт або сервер TLS.

      Kubelet генерує приватний ключ і використовує його для надсилання PodCertificateRequest до зазначеного підписувача.  Після того, як підписувач схвалює запит і видає ланцюжок сертифікатів, Kubelet записує ключ і ланцюжок сертифікатів у файлову систему podʼа.  Pod не запускається, доки не будуть видані сертифікати для кожного джерела спроєцьованого тому podCertificate у його специфікації.

      Kubelet почне спробувати оновити сертифікат у час, вказаний підписувачем, використовуючи мітку часу PodCertificateRequest.Status.BeginRefreshAt.

      Kubelet може записувати один файл, вказаний у полі credentialBundlePath, або окремі файли, вказані у полях keyPath та certificateChainPath.

      Набір облікових даних — це єдиний файл у форматі PEM.  Перший запис PEM — це приватний ключ (у форматі PKCS#8), а решта записів PEM — це ланцюжок сертифікатів, виданих підписувачем (зазвичай підписувачі повертають свій ланцюжок сертифікатів у порядку від кінцевого до кореневого).

      Краще використовувати формат пакета облікових даних, оскільки код вашого застосунку може читати його атомарно.  Якщо ви використовуєте keyPath і certificateChainPath, ваш застосунок повинен виконати два окремі читання файлів. Якщо вони збігаються з ротацією сертифікатів, можливо, що приватний ключ і вкладений сертифікат, які ви читаєте, можуть не відповідати один одному. Ваш застосунок повинен перевірити цю умову і повторно прочитати, поки вони не будуть узгоджені.

      Іменований підписувач контролює вибір формату сертифіката, який він видає; зверніться до документації щодо реалізації підписувача, щоб дізнатися, як використовувати сертифікати, які він видає.

      <a name="PodCertificateProjection"></a>
      *PodCertificateProjection надає приватний ключ і сертифікат X.509 у файловій системі pod.*

      - **projected.sources.podCertificate.keyType** (string), обовʼязково

        Тип ключової пари, яку Kubelet створить для pod.

        Дійсні значення: "RSA3072", "RSA4096", "ECDSAP256", "ECDSAP384", "ECDSAP521", та "ED25519".

      - **projected.sources.podCertificate.signerName** (string), обовʼязково

        Створені Kubelet CSR будуть адресовані цьому підписувачу.

      - **projected.sources.podCertificate.certificateChainPath** (string)

        Запишіть ланцюжок сертифікатів за цим шляхом у спроєцбованому томі.

        Більшість застосунків повинні використовувати credentialBundlePath.  При використанні keyPath і certificateChainPath ваш застосунок повинен перевіряти, чи ключ і кінцевий сертифікат є сумісними, оскільки існує можливість читання файлів під час ротації.

      - **projected.sources.podCertificate.credentialBundlePath** (string)

        Записує пакет облікових даних за цим шляхом у спроєцьованому томі.

        Пакет облікових даних — це єдиний файл, що містить кілька блоків PEM. Перший блок PEM — це блок PRIVATE KEY, що містить приватний ключ PKCS#8.

        Решта блоків — це блоки CERTIFICATE, що містять виданий ланцюжок сертифікатів від підписувача (вкладений та будь-які проміжні).

        Використання credentialBundlePath дозволяє коду застосунку вашого Pod виконати одне атомарне читання, яке отримує узгоджений ключ і ланцюжок сертифікатів.  Якщо ви проєцюєте їх у окремі файли, код вашого застосунку повинен додатково перевірити, чи був кінцевий сертифікат виданий для ключа.

      - **projected.sources.podCertificate.keyPath** (string)

        Записує ключ за цим шляхом у прогнозованому обсязі.

        Більшість застосунків повинні використовувати credentialBundlePath. При використанні keyPath і certificateChainPath ваш застосунок повинен перевіряти, чи ключ і вкладений сертифікат є сумісними, оскільки існує можливість читання файлів під час ротації.

      - **projected.sources.podCertificate.maxExpirationSeconds** (int32)

        maxExpirationSeconds — максимальний дозволений термін дії сертифіката.

        Kubelet копіює це значення дослівно в PodCertificateRequests, який він генерує для цієї проєкції.

        Якщо це значення пропущено, kube-apiserver встановить його на 86400 (24 години). kube-apiserver відхилить значення, менші за 3600 (1 година).  Максимально допустиме значення — 7862400 (91 день).

        Після цього підписувач може видавати сертифікати з будь-яким терміном дії, *коротшим* за MaxExpirationSeconds, але не коротшим за 3600 секунд (1 година).  Це обмеження застосовується kube-apiserver. Підписувачі `kubernetes.io` ніколи не видають сертифікати з терміном дії, довшим за 24 години.

      - **projected.sources.podCertificate.userAnnotations** (map[string]string)

        userAnnotations дозволяють авторам подів передавати додаткову інформацію до реалізації підписувача.  Kubernetes жодним чином не обмежує та не перевіряє ці метадані.

        Ці значення копіюються дослівно в поле `spec.unverifiedUserAnnotations` обʼєктів PodCertificateRequest, які створює Kubelet.

        Записи підлягають тій самій перевірці, що й анотації метаданих обʼєктів, з тим доповненням, що всі ключі повинні мати префікс домену. На значення не накладаються жодні обмеження, крім загального обмеження розміру всього поля.

        Підписувачі повинні документувати ключі та значення, які вони підтримують. Підписувачі повинні відхиляти запити, що містять ключі, які вони не розпізнають.

    - **projected.sources.secret** (SecretProjection)

      secret – інформація про дані Secret, які мають бути спроєцьовані

      <a name="SecretProjection"></a>
      *Адаптує Secret для projected тому.

      Вміст поля Data цільового Secret буде представлений у projected томі у вигляді файлів, використовуючи ключі у полі Data як назви файлів. Зверніть увагу, що це ідентично джерелу тому Secret без стандартного режиму.*

      - **projected.sources.secret.name** (string)

        Name — назва обʼєкта на який посилаються. Це поле є обов'язковим для заповнення, але для забезпечення зворотної сумісності дозволяється залишати його порожнім. Екземпляри цього типу з порожнім значенням тут майже напевно є помилковими. Додаткова інформація: [https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names](/docs/concepts/overview/working-with-objects/names/#names)

      - **projected.sources.secret.optional** (boolean)

        optional — вказує, чи Secret або його ключі мають бути визначені.

      - **projected.sources.secret.items** ([]<a href="{{< ref "../config-and-storage-resources/volume#KeyToPath" >}}">KeyToPath</a>)

        *Atomic: буде замінено під час злиття*

        Якщо не вказано items, кожна пара ключ-значення у полі Data зазначеного Secret буде перенесена в том як файл, імʼя якого — це ключ, а вміст — значення. Якщо вказано, перераховані ключі будуть перенесені у вказані шляхи, а невказані ключі відсутні. Якщо вказано ключ, якого немає у Secret, налаштування тому завершиться помилкою, якщо він не позначений як необовʼязковий. Шляхи повинні бути відносними та не можуть містити шлях '..' або починатися з '..'.

    - **projected.sources.serviceAccountToken** (ServiceAccountTokenProjection)

      serviceAccountToken — інформація про дані serviceAccountToken, які мають бути спроєцьовані

      <a name="ServiceAccountTokenProjection"></a>
      *ServiceAccountTokenProjection представляє projected том токена службового облікового запису. Ця проєкція може бути використана для вставки токена службового облікового запису в файлову систему Podʼа для використання з API (сервера API Kubernetes або іншого).*

      - **projected.sources.serviceAccountToken.path** (string), обовʼязково

        path — це шлях відносно точки монтування файлу для проєцювання токена.

      - **projected.sources.serviceAccountToken.audience** (string)

        audience — це призначений отримувач токена. Отримувач токена повинен ідентифікувати себе із вказаним ідентифікатором в аудиторії токена або, в іншому випадку, повинен відхилити токен. Стандартно audience — це ідентифікатор apiserver.

      - **projected.sources.serviceAccountToken.expirationSeconds** (int64)

        expirationSeconds — це запитаний термін дійсності токена службового облікового запису. В міру наближення до закінчення терміну дії токена, втулок томів kubelet буде працювати у режимі проактивної ротації токена службового облікового запису. Kubelet буде спробувати почати ротацію токена, якщо токен старше 80 відсотків його часу життя або якщо токен старше 24 годин. Стандартне значення — 1 година і повинно бути принаймні 10 хвилин.

### Локальні / Тимчасові теки {#local-temporary-directory}

- **emptyDir** (EmptyDirVolumeSource)

  emptyDir представляє тимчасову теку, яка існує впродовж часу існування Podʼа. Додаткова інформація: [https://kubernetes.io/docs/concepts/storage/volumes#emptydir](/docs/concepts/storage/volumes#emptydir)

  <a name="EmptyDirVolumeSource"></a>
  *Представляє порожню теку для Podʼа. Томи порожніх тек підтримують управління власністю та перепризначення міток SELinux.*

  - **emptyDir.medium** (string)

    medium представляє тип носія для зберігання, який повинен підтримувати цю теку. Стандартне значення — "" (порожній рядок), що означає використання стандартного носія вузла. Повинно бути порожнім рядком (стандартно) або "Memory". Додаткова інформація: [Посилання на документацію Kubernetes про EmptyDir](/docs/concepts/storage/volumes#emptydir)

  - **emptyDir.sizeLimit** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

    sizeLimit — це загальна кількість локальної памʼяті, необхідна для цього тому EmptyDir. Обмеження розміру також застосовується для носія типу "Memory". Максимальне використання на носії типу "Memory" для EmptyDir буде мінімальним значенням між зазначеним тут SizeLimit та сумою обмежень памʼяті всіх контейнерів у Podʼі. Стандартне значення — nil, що означає, що обмеження не визначено. Додаткова інформація: [https://kubernetes.io/docs/concepts/storage/volumes#emptydir](/docs/concepts/storage/volumes#emptydir)

- **hostPath** (HostPathVolumeSource)

  hostPath представляє попередньо наявний файл або теку на хост-машині, який безпосередньо доступний контейнеру. Це зазвичай використовується для системних агентів або інших привілейованих речей, яким дозволено бачити хост-машину. Більшість контейнерів НЕ потребуватимуть цього. Додаткова інформація: [https://kubernetes.io/docs/concepts/storage/volumes#hostpath](/docs/concepts/storage/volumes#hostpath)

  <a name="HostPathVolumeSource"></a>
  *Представляє шлях хосту зіставлений з Pod. Томи hostPath не підтримують управління власністю або перевизначення міток SELinux.*

  - **hostPath.path** (string), обовʼязково

    path — це шлях до теки на хості. Якщо шлях є символічним посиланням, воно буде слідувати за посиланням до реального шляху. Додаткова інформація: [https://kubernetes.io/docs/concepts/storage/volumes#hostpath](/docs/concepts/storage/volumes#hostpath)

  - **hostPath.type** (string)

    type для тому HostPath. Стандартне значення — "". Додаткова інформація: [https://kubernetes.io/docs/concepts/storage/volumes#hostpath](/docs/concepts/storage/volumes#hostpath)

    Можливі значення переліку (enum):
    - `""` Для зворотньої суміності, залиште його порожнім, якщо не встановлено
    - `"BlockDevice"` Блок-пристрій повинен існувати за вказаним шляхом
    - `"CharDevice"` Символьний пристрій повинен існувати за вказаним шляхом
    - `"Directory"` Тека повинна існувати за вказаним шляхом
    - `"DirectoryOrCreate"` Якщо нічого не існує за вказаним шляхом, там буде створено порожню теку за потреби з режимом доступу 0755, маючи ту ж групу та власність, що й Kubelet.
    - `"File"` Файл повинен існувати за вказаним шляхом
    - `"FileOrCreate"` Якщо нічого не існує за вказаним шляхом, там буде створено порожній файл за потреби з режимом доступу 0644, маючи ту ж групу та власника, що й Kubelet.
    - `"Socket"` UNIX-сокет повинен існувати за вказаним шляхом

### Постійні томи {#persistent-volumes}

- **awsElasticBlockStore** (AWSElasticBlockStoreVolumeSource)

  awsElasticBlockStore представляє ресурс AWS Disk, який підключений до хост-машини kubelet і потім доступний Podʼу. Застаріло: AWSElasticBlockStore застарів. Всі операції для внутрішнього типу awsElasticBlockStore перенаправляються на CSI-драйвер ebs.csi.aws.com. Додаткова інформація: [https://kubernetes.io/docs/concepts/storage/volumes#awselasticblockstore](/docs/concepts/storage/volumes#awselasticblockstore)

  <a name="AWSElasticBlockStoreVolumeSource"></a>
  *Представляє ресурс Persistent Disk в AWS.

  Диск AWS EBS повинен існувати перед підключенням до контейнера. Диск також повинен знаходитися в тій же зоні AWS, що і kubelet. Диск AWS EBS може бути змонтований з приавами читання/запис тільки один раз. Томи AWS EBS підтримують управління власністю та перепризначення міток SELinux.*

  - **awsElasticBlockStore.volumeID** (string), обовʼязково

    volumeID — це унікальний ідентифікатор постійного дискового ресурсу в AWS (том Amazon EBS). Додаткова інформація: [https://kubernetes.io/docs/concepts/storage/volumes#awselasticblockstore](/docs/concepts/storage/volumes#awselasticblockstore)

  - **awsElasticBlockStore.fsType** (string)

    fsType — це тип файлової системи тому, який ви хочете змонтувати. Порада: Переконайтеся, що тип файлової системи підтримується операційною системою хосту. Приклади: "ext4", "xfs", "ntfs". Якщо не вказано, неявно припускається, що це "ext4". Додаткова інформація: [https://kubernetes.io/docs/concepts/storage/volumes#awselasticblockstore](/docs/concepts/storage/volumes#awselasticblockstore)

  - **awsElasticBlockStore.partition** (int32)

    partition — це розділ у томі, який ви хочете змонтувати. Якщо він не вказаний, то стандартно монтується за назвою тому. Приклади: Для тому `/dev/sda1` ви вказуєте розділ "1". Аналогічно, розділ тому для `/dev/sda` є "0" (або ви можете залишити властивість порожньою).

  - **awsElasticBlockStore.readOnly** (boolean)

    readOnly — значення true примусово встановлює налаштування readOnly у VolumeMounts. Додаткова інформація: [https://kubernetes.io/docs/concepts/storage/volumes#awselasticblockstore](/docs/concepts/storage/volumes#awselasticblockstore)

- **azureDisk** (AzureDiskVolumeSource)

  azureDisk представляє монтування Azure Data Disk на хості та привʼязує монтування до Podʼа. Застаріло: AzureDisk застарів. Усі операції для внутрішнього типу azureDisk переспрямовуються на драйвер CSI disk.csi.azure.com.

  <a name="AzureDiskVolumeSource"></a>
  *AzureDisk представляє монтування Azure Data Disk на хості та привʼязане монтування до Podʼа.*

  - **azureDisk.diskName** (string), обовʼязкове

    diskName — це імʼя диска даних у blob-сховищі

  - **azureDisk.diskURI** (string), обовʼязкове

    diskURI — це URI диска даних у blob-сховищі

  - **azureDisk.cachingMode** (string)

    cachingMode — це режим кешування хосту: None, Read Only, Read Write.

    Можливі значення переліку (enum):
    - `None`
    - `ReadOnly`
    - `ReadWrite`

  - **azureDisk.fsType** (string)

    fsType — це тип файлової системи для монтування. Повинен бути типом файлової системи, підтримуваним операційною системою хосту. Наприклад, "ext4", "xfs", "ntfs". Неявно припускається, що це "ext4", якщо не вказано інше.

  - **azureDisk.kind** (string)

    Очікувані значення kind: Shared (кілька blob-дисків на один обліковий запис зберігання), Dedicated (один blob-диск на обліковий запис зберігання), Managed (azure managed data disk, тільки в керованому наборі доступності). Стандартне значення — Shared.

    Можливі значення переліку (enum):
    - `"Dedicated"`
    - `"Managed"`
    - `"Shared"`

  - **azureDisk.readOnly** (boolean)

    readOnly стандартне значення — false (читання/запис). Значення readOnly тут примусово встановлює налаштування ReadOnly у VolumeMounts.

- **azureFile** (AzureFileVolumeSource)

  azureFile представляє монтування служби файлів Azure на хості та привʼязане монтування до Podʼа. Застаріло: AzureFile застарілий. Всі операції для внутрішнього типу azureFile перенаправляються на CSI-драйвер file.csi.azure.com.

  <a name="AzureFileVolumeSource"></a>
  *AzureFile представляє монтування служби файлів Azure на хості та привʼязане монтування до Podʼа.*

  - **azureFile.secretName** (string), обовʼязкове

    secretName — це імʼя секрету, що містить імʼя та ключ облікового запису Azure Storage.

  - **azureFile.shareName** (string), обовʼязкове

    shareName — це імʼя розділу Azure.

  - **azureFile.readOnly** (boolean)

    readOnly стандартне значення — false (читання/запис). Значення readOnly тут примусово встановлює налаштування ReadOnly у VolumeMounts.

- **cephfs** (CephFSVolumeSource)

  cephFS представляє монтування Ceph FS на хості, яке діє впродовж життєвого циклу Podʼа. Застаріло: CephFS застаріла і внутрішній тип cephfs більше не підтримується.

  <a name="CephFSVolumeSource"></a>
  *Представляє монтування файлової системи Ceph, яке діє впродовж життєвого циклу Podʼа. Томи cephfs не підтримують управління власністю або перепризначення міток SELinux.*

  - **cephfs.monitors** ([]string), обовʼязкове

    *Atomic: буде замінено під час злиття*

    monitors є обовʼязковим: Monitors — це колекція моніторів Ceph. Додаткова інформація: https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it

  - **cephfs.path** (string)

    path є необовʼязковим: Використовується як корінь монтування, а не як повне дерево Ceph. Стандартне значення — /

  - **cephfs.readOnly** (boolean)

    readOnly є необовʼязковим: Стандартне значення — false (читання/запис). Значення readOnly тут примусово встановлює налаштування ReadOnly у VolumeMounts. Додаткова інформація: https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it

  - **cephfs.secretFile** (string)

    secretFile є необовʼязковим: SecretFile — це шлях до вʼязки ключів користувача. Стандартне значення — /etc/ceph/user.secret. Додаткова інформація: https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it

  - **cephfs.secretRef** (<a href="{{< ref "../common-definitions/local-object-reference#LocalObjectReference" >}}">LocalObjectReference</a>)

    secretRef є необовʼязковим: SecretRef — це посилання на секрет автентифікації для користувача. Стандартне значення — порожнє. Додаткова інформація: https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it

  - **cephfs.user** (string)

    user є необовʼязковим: User — це імʼя користувача rados. Стандартне значення — admin. Додаткова інформація: https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it

- **cinder** (CinderVolumeSource)

  cinder представляє том Cinder, підключений і змонтований на хост-машині kubelet. Застаріло: Cinder застарів. Всі операції для внутрішнього типу cinder перенаправляються на CSI-драйвер cinder.csi.openstack.org. Додаткова інформація: https://examples.k8s.io/mysql-cinder-pd/README.md

  <a name="CinderVolumeSource"></a>
  *Представляє ресурс тому Cinder в Openstack. Том Cinder повинен існувати перед монтуванням до контейнера. Том також повинен знаходитися в тому ж регіоні, що і kubelet. Томи Cinder підтримують управління власністю та перепризначення міток SELinux.*

  - **cinder.volumeID** (string), обовʼязкове

    volumeID використовується для ідентифікації тому в Cinder. Додаткова інформація: https://examples.k8s.io/mysql-cinder-pd/README.md

  - **cinder.fsType** (string)

    fsType — це тип файлової системи для монтування. Повинен бути типом файлової системи, підтримуваним операційною системою хоста. Приклади: "ext4", "xfs", "ntfs". Неявно припускається, що це "ext4", якщо не вказано інше. Додаткова інформація: https://examples.k8s.io/mysql-cinder-pd/README.md

  - **cinder.readOnly** (boolean)

    readOnly стандартне значення — false (читання/запис). Значення readOnly тут примусово встановлює налаштування ReadOnly у VolumeMounts. Додаткова інформація: https://examples.k8s.io/mysql-cinder-pd/README.md

  - **cinder.secretRef** (<a href="{{< ref "../common-definitions/local-object-reference#LocalObjectReference" >}}">LocalObjectReference</a>)

    secretRef є необовʼязковим: вказує на обʼєкт секрету, що містить параметри, які використовуються для підключення до OpenStack.

- **csi** (CSIVolumeSource)

  csi (Container Storage Interface) представляє ефемерне сховище, яке обробляється певними зовнішніми драйверами CSI.

  <a name="CSIVolumeSource"></a>
  *Представляє джерело розташування тому для монтування, керованого зовнішнім драйвером CSI*

  - **csi.driver** (string), обовʼязкове

    driver — це імʼя драйвера CSI, який обробляє цей том. Проконсультуйтеся з адміністратором для отримання правильного імені, зареєстрованого в кластері.

  - **csi.fsType** (string)

    fsType для монтування. Наприклад, "ext4", "xfs", "ntfs". Якщо не вказано, порожнє значення передається відповідному драйверу CSI, який визначить стандартну файлову систему.

  - **csi.nodePublishSecretRef** (<a href="{{< ref "../common-definitions/local-object-reference#LocalObjectReference" >}}">LocalObjectReference</a>)

    nodePublishSecretRef є посиланням на обʼєкт секрету, що містить конфіденційну інформацію, яку потрібно передати драйверу CSI для завершення викликів CSI NodePublishVolume і NodeUnpublishVolume. Це поле є необовʼязковим і може бути порожнім, якщо секрет не потрібен. Якщо обʼєкт секрету містить більше одного секрету, всі посилання на секрети передаються.

  - **csi.readOnly** (boolean)

    readOnly вказує на конфігурацію тільки для читання для тому. Стандартне значення — false (читання/запис).

  - **csi.volumeAttributes** (map[string]string)

    volumeAttributes зберігає властивості, специфічні для драйвера, які передаються драйверу CSI. Проконсультуйтеся з документацією вашого драйвера для підтримуваних значень.

- **ephemeral** (EphemeralVolumeSource)

  ephemeral представляє том, який обробляється кластерним драйвером зберігання. Життєвий цикл тому привʼязаний до Podʼа, який його визначає — том буде створено перед запуском Podʼа і видалено після видалення Podʼа.

  Використовуйте це, якщо: a) том потрібен лише під час роботи Podʼа, b) потрібні функції звичайних томів, такі як відновлення зі знімка або відстеження ємності, c) драйвер зберігання вказується через клас зберігання, і d) драйвер зберігання підтримує динамічне надання томів через PersistentVolumeClaim (див. EphemeralVolumeSource для отримання додаткової інформації про звʼязок між цим типом тому та PersistentVolumeClaim).

  Використовуйте PersistentVolumeClaim або один з API, специфічних для постачальника, для томів, які зберігаються довше, ніж життєвий цикл окремого Podʼа.

  Використовуйте CSI для легких локальних ефемерних томів, якщо драйвер CSI призначений для такого використання — див. документацію драйвера для отримання додаткової інформації.

  Pod може одночасно використовувати як ефемерні томи, так і постійні томи.

  <a name="EphemeralVolumeSource"></a>
  *Представляє ефемерний том, який обробляється звичайним драйвером зберігання.*

  - **ephemeral.volumeClaimTemplate** (PersistentVolumeClaimTemplate)

    Буде використовуватись для створення окремого PVC для надання тому. Pod, в якому вбудовано цей EphemeralVolumeSource, буде власником PVC, тобто PVC буде видалено разом з Podʼом. Назва PVC буде `<pod name>-<volume name>`, де `<volume name>` — це назва з масиву `PodSpec.Volumes`. Валідація Podʼа відхилить Pod, якщо обʼєднана назва не є дійсною для PVC (наприклад, занадто довга).

    Існуючий PVC з такою назвою, який не належить Podʼу, *не* буде використаний для Podʼа, щоб уникнути випадкового використання неповʼязаного тому. Запуск Podʼа буде заблокований до видалення неповʼязаного PVC. Якщо такий попередньо створений PVC призначений для використання Podʼом, PVC має бути оновлено з посиланням на власника Podʼа після створення Podʼа. Зазвичай це не повинно бути необхідним, але може бути корисним при ручному відновленні зламаного кластера.

    Це поле є лише для читання, і Kubernetes не вноситиме змін до PVC після його створення.

    Обовʼязкове, не може бути nil.

    <a name="PersistentVolumeClaimTemplate"></a>
    *PersistentVolumeClaimTemplate використовується для створення обʼєктів PersistentVolumeClaim як частини EphemeralVolumeSource.*

    - **ephemeral.volumeClaimTemplate.spec** (<a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaimSpec" >}}">PersistentVolumeClaimSpec</a>), обовʼязкове

      Специфікація для PersistentVolumeClaim. Весь вміст копіюється без змін у PVC, який створюється з цього шаблону. Ті ж самі поля, що й у PersistentVolumeClaim, також дійсні тут.

    - **ephemeral.volumeClaimTemplate.metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

      Може містити мітки та анотації, які будуть скопійовані у PVC під час його створення. Інші поля не дозволені і будуть відхилені під час валідації.

- **fc** (FCVolumeSource)

  fc представляє ресурс Fibre Channel, що підключений до хост-машини kubelet і потім експонується для доступу у Podʼі.

  <a name="FCVolumeSource"></a>
  *Представляє том Fibre Channel. Томи Fibre Channel можуть монтуватися для запису/читання лише один раз. Томи Fibre Channel підтримують керування власністю та перепризначення міток SELinux.*

  - **fc.fsType** (string)

    fsType — це тип файлової системи для монтування. Має бути типом файлової системи, який підтримується операційною системою хоста. Наприклад, "ext4", "xfs", "ntfs". Неявно вважається "ext4", якщо не вказано інше.

  - **fc.lun** (int32)

    lun є необовʼязковим: Номер LUN (логічної одиниці) цілі FC

  - **fc.readOnly** (boolean)

    readOnly є необовʼязковим: Стандартне значення — false (читання/запис). Значення ReadOnly тут примусово встановить параметр ReadOnly у VolumeMounts.

  - **fc.targetWWNs** ([]string)

    *Atomic: буде замінено під час злиття*

    targetWWNs є необовʼязковими: FC звертається до всесвітніх імен (WWNs)

  - **fc.wwids** ([]string)

    *Atomic: буде замінено під час злиття*

    wwids є необовʼязковими: Всесвітні ідентифікатори томів FC (wwids). Або wwids, або комбінація targetWWNs і lun повинні бути встановлені, але не обидва одночасно.

- **flexVolume** (FlexVolumeSource)

  flexVolume представляє загальний ресурс тома, що створюється/підключається за допомогою втулка на основі exec. Застаріло: FlexVolume застарів. Розгляньте можливість використання CSIDriver замість нього.

  <a name="FlexVolumeSource"></a>
  *FlexVolume представляє загальний ресурс тома, що створюється/підключається за допомогою втулка на основі exec.*

  - **flexVolume.driver** (string), обовʼязково

    driver — це назва драйвера, який використовується для цього тома.

  - **flexVolume.fsType** (string)

    fsType — це тип файлової системи для монтування. Має бути тип файлової системи, який підтримується операційною системою хоста. Наприклад, "ext4", "xfs", "ntfs". Стандартний тип файлової системи залежить від скрипта FlexVolume.

  - **flexVolume.options** (map[string]string)

    options є необовʼязковим: це поле містить додаткові командні параметри, якщо такі є.

  - **flexVolume.readOnly** (boolean)

    readOnly є необовʼязковим: Стандартне значення — false (читання/запис). Значення ReadOnly тут примусово встановить параметр ReadOnly у VolumeMounts.

  - **flexVolume.secretRef** (<a href="{{< ref "../common-definitions/local-object-reference#LocalObjectReference" >}}">LocalObjectReference</a>)

    secretRef є необовʼязковим: secretRef — це посилання на обʼєкт секрету, що містить конфіденційну інформацію для передачі у скрипти втулка. Воно може бути порожнім, якщо обʼєкт секрету не вказаний. Якщо обʼєкт секрету містить більше одного секрету, всі секрети передаються у скрипти втулка.

- **flocker** (FlockerVolumeSource)

  flocker представляє том Flocker, приєднаний до хост-машини kubelet. Залежить від роботи служби управління Flocker. Застаріло: Flocker застарів, і внутрішній тип flocker більше не підтримується.

  <a name="FlockerVolumeSource"></a>
  *Представляє том Flocker, змонтований агентом Flocker. Повинно бути встановлено тільки щось одне з datasetName і datasetUUID. Томи Flocker не підтримують керування власністю або перепризначення міток SELinux.*

  - **flocker.datasetName** (string)

    datasetName — це назва набору даних, збереженого як метадані -> name на наборі даних для Flocker слід вважати застарілим

  - **flocker.datasetUUID** (string)

    datasetUUID — це UUID набору даних. Це унікальний ідентифікатор набору даних Flocker.

- **gcePersistentDisk** (GCEPersistentDiskVolumeSource)

  gcePersistentDisk представляє ресурс диска GCE, який приєднаний до хост-машини kubelet і потім відкривається для доступу у Podʼі. Застаріло: GCEPersistentDisk застарів. Усі операції для внутрішнього типу gcePersistentDisk перенаправлено до драйвера CSI pd.csi.storage.gke.io. Додаткова інформація: [https://kubernetes.io/docs/concepts/storage/volumes#gcepersistentdisk](/docs/concepts/storage/volumes#gcepersistentdisk)

  <a name="GCEPersistentDiskVolumeSource"></a>
  *Представляє ресурс постійного диска в Google Compute Engine.

  Для монтування до контейнера повинен існувати диск GCE PD. Диск також повинен знаходитися в тому ж проєкті GCE та зоні, що й kubelet. Диск GCE PD може бути змонтований лише один раз для читання/запису або багато разів для читання. Диски GCE PD підтримують керування власністю та перепризначення міток SELinux.*

  - **gcePersistentDisk.pdName** (string), обовʼязково

    pdName — унікальна назва ресурсу PD в GCE. Використовується для ідентифікації диска в GCE. Додаткова інформація: [https://kubernetes.io/docs/concepts/storage/volumes#gcepersistentdisk](/docs/concepts/storage/volumes#gcepersistentdisk)

  - **gcePersistentDisk.fsType** (string)

    fsType — тип файлової системи тома, який ви хочете змонтувати. Порада: Переконайтеся, що тип файлової системи підтримується операційною системою хоста. Приклади: "ext4", "xfs", "ntfs". Неявно вважається "ext4", якщо не вказано інше. Додаткова інформація: [https://kubernetes.io/docs/concepts/storage/volumes#gcepersistentdisk](/docs/concepts/storage/volumes#gcepersistentdisk)

  - **gcePersistentDisk.partition** (int32)

    partition — це розділ у томі, який ви хочете змонтувати. Якщо пропущено, стандартно монтується за імʼям тома. Приклади: Для тому `/dev/sda1` ви вказуєте розділ як "1". Так само, розділ тому для `/dev/sda` — "0" (або ви можете залишити властивість порожньою). Додаткова інформація: [https://kubernetes.io/docs/concepts/storage/volumes#gcepersistentdisk](/docs/concepts/storage/volumes#gcepersistentdisk)

  - **gcePersistentDisk.readOnly** (boolean)

    readOnly тут примусово встановить параметр ReadOnly у VolumeMounts. Стандартне значення — false. Додаткова інформація: [https://kubernetes.io/docs/concepts/storage/volumes#gcepersistentdisk](/docs/concepts/storage/volumes#gcepersistentdisk)

- **glusterfs** (GlusterfsVolumeSource)

  glusterfs представляє монтування Glusterfs на хості, яке діє впрожовж життєвого циклу Podʼа. Застаріло: Glusterfs застаріла, а внутрішній тип glusterfs більше не підтримується.

  <a name="GlusterfsVolumeSource"></a>
  *Представляє монтування Glusterfs, яке діє впрожовж життєвого циклу Podʼа. Томи Glusterfs не підтримують керування власністю або перепризначення міток SELinux.*

  - **glusterfs.endpoints** (string), обовʼязково

    endpoints — це назва точки доступу, яка визначає топологію Glusterfs.

  - **glusterfs.path** (string), обовʼязково

    path — це шлях тома Glusterfs. Додаткова інформація: https://examples.k8s.io/volumes/glusterfs/README.md#create-a-pod

  - **glusterfs.readOnly** (boolean)

    readOnly тут примусово змусить монтувати том Glusterfs з правами тільки на читання. Стандартне значення — false. Додаткова інформація: https://examples.k8s.io/volumes/glusterfs/README.md#create-a-pod

- **iscsi** (ISCSIVolumeSource)

  iscsi представляє ресурс диска ISCSI, який приєднаний до хост-машини kubelet і потім експонується для доступу у Podʼі. Додаткова інформація: [https://kubernetes.io/docs/concepts/storage/volumes/#iscsi](/docs/concepts/storage/volumes/#iscsi)

  <a name="ISCSIVolumeSource"></a>
  *Представляє диск ISCSI. Томи ISCSI можуть бути змонтовані лише один раз для читання/запису. Томи ISCSI підтримують керування власністю та перепризначення міток SELinux.*

  - **iscsi.iqn** (string), обовʼязково

    iqn — це цільове Імʼя ISCSI Qualified Name.

  - **iscsi.lun** (int32), обовʼязково

    lun представляє номер цільового LUN (логічної одиниці) ISCSI.

  - **iscsi.targetPortal** (string), обовʼязково

    targetPortal — це цільовий портал ISCSI. Портал — це IP або ip_addr:порт, якщо порт відмінний від типового (зазвичай TCP-порти 860 і 3260).

  - **iscsi.chapAuthDiscovery** (boolean)

    chapAuthDiscovery визначає, чи підтримується автентифікація CHAP для виявлення ISCSI

  - **iscsi.chapAuthSession** (boolean)

    chapAuthSession визначає, чи підтримується сесійна автентифікація CHAP для ISCSI

  - **iscsi.fsType** (string)

    fsType — це тип файлової системи тома, який ви хочете змонтувати. Порада: Переконайтеся, що тип файлової системи підтримується операційною системою хоста. Приклади: "ext4", "xfs", "ntfs". Неявно вважається "ext4", якщо не вказано інше. Додаткова інформація: [https://kubernetes.io/docs/concepts/storage/volumes#iscsi](/docs/concepts/storage/volumes#iscsi)

  - **iscsi.initiatorName** (string)

    initiatorName — це власне Імʼя Ініціатора ISCSI. Якщо initiatorName вказаний одночасно з iscsiInterface, буде створено новий інтерфейс ISCSI \<цільовий портал>:\<імʼя тома> для підключення.

  - **iscsi.iscsiInterface** (string)

    iscsiInterface — це імʼя інтерфейсу, який використовує транспорт ISCSI. Стандартне значення — 'default' (tcp).

  - **iscsi.portals** ([]string)

    *Atomic: буде замінено під час злиття*

    portals — це список цільових порталів ISCSI. Портал — це IP або ip_addr:порт, якщо порт відмінний від типового (зазвичай TCP-порти 860 і 3260).

  - **iscsi.readOnly** (boolean)

    readOnly тут примусово встановить параметр ReadOnly у VolumeMounts. Стандартне значення — false.

  - **iscsi.secretRef** (<a href="{{< ref "../common-definitions/local-object-reference#LocalObjectReference" >}}">LocalObjectReference</a>)

    secretRef — це Секрет CHAP для автентифікації цілі та ініціатора ISCSI.

- **image** (ImageVolumeSource)

  `image` представляє обʼєкт OCI (образ контейнерна або артефакт), який завантажується та монтується на хост-машині kubelet. Том призначається під час запуску Podʼа в залежності від значення `PullPolicy`:

  - Always: kubelet завжди намагається завантажити посилання. Створення контейнера завершиться невдачею, якщо завантаження не вдасться.
  - Never: kubelet ніколи не завантажує посилання і використовує лише локальний образ або артефакт. Створення контейнера завершиться невдачею, якщо посилання немає.
  - IfNotPresent: kubelet завантажує посилання, якщо воно вже не присутнє на диску. Створення контейнера завершиться невдачею, якщо посилання немає, а завантаження не вдасться.

  Том буде перепризначатись, якщо pod буде видалено перестворено, що означає, що новий віддалений контент стане доступним при перестворенні Podʼа. Невдача при визначенні або завантаженні образу під час запуску Podʼа блокуватиме запуск контейнерів і може додати значну затримку. У разі невдачі будуть виконані повторні спроби за допомогою стандартного часу зворотнього відліку для томів і про них буде повідомлено у полі `reason` і `message` Podʼа.

  Типи обʼєктів, які можуть бути змонтовані цим томом, визначаються реалізацією серодовища виконання контейнерів на хост-машині і, як мінімум, повинні включати всі дійсні типи, підтримувані полем image контейнера. Обʼєкт OCI монтується в одну теку (`spec.containers[*].volumeMounts.mountPath`), обʼєднуючи шари маніфесту так само, як і для образів контейнерів. Том буде змонтований тільки для читання (ro) та міститиме файли, які не можна виконувати (noexec). Монтування субшляхів для контейнерів не підтримуються (`spec.containers[*].volumeMounts.subpath`) до 1.33. Поле `spec.securityContext.fsGroupChangePolicy` не впливає на цей тип тому.

  <a name="ImageVolumeSource"></a>
  *ImageVolumeSource представляє ресурс тома image.*

  - **image.pullPolicy** (string)

    Політика завантаження OCI об\єктів. Можливі значення:

    - Always: kubelet завжди намагається завантажити посилання. Створення контейнера завершиться невдачею, якщо завантаження не вдасться.
    - Never: kubelet ніколи не завантажує посилання і використовує лише локальний образ або артефакт. Створення контейнера завершиться невдачею, якщо посилання немає.
    - IfNotPresent: kubelet завантажує посилання, якщо воно вже не присутнє на диску. Створення контейнера завершиться невдачею, якщо посилання немає, а завантаження не вдасться.

    Стандартно використовується значення Always, якщо вказано тег `:latest`, або IfNotPresent в інших випадках.

    Можливі значення переліку (enum):
    - `"Always"` означає, що kubelet завжди намагається завантажити останній образ. Створення контейнера завершиться невдачею, якщо завантаження не вдасться.
    - `"IfNotPresent"` означає, що kubelet завантажує образ, якщо його немає на диску. Створення контейнера завершиться невдачею, якщо образ відсутній, а завантаження не вдасться.
    - `"Never"` означає, що kubelet ніколи не завантажує образ, а використовує лише локальний образ. Створення контейнера завершиться невдачею, якщо образ відсутній.

  - **image.reference** (string)

    Обовʼязково: Посилання на образ або артефакт, що буде використовуватися. Працює так само, як і поле `pod.spec.containers[*].image`. Секрети для завантаження (pull secrets) будуть зібрані так само, як і для образу контейнера, за допомогою пошуку облікових даних вузла, секретів для завантаження образів у Service Account та секретів для завантаження образів у специфікації podʼа. Більше інформації: [https://kubernetes.io/docs/concepts/containers/images](/docs/concepts/containers/images).

    Це поле є необовʼязковим, щоб дозволити вищим рівням керування конфігурацією використовувати стандартне значення або перевизначати образи контейнерів у контролерах робочих навантажень, таких як Deployments та StatefulSets.

- **nfs** (NFSVolumeSource)

  nfs представляє монтування NFS на хості, яке діє впрожовж життєвого циклу Podʼа. Додаткова інформація: [https://kubernetes.io/docs/concepts/storage/volumes#nfs](/docs/concepts/storage/volumes#nfs)

  <a name="NFSVolumeSource"></a>
  *Представляє монтування NFS, яке діє впрожовж життєвого циклу Podʼа. Томи NFS не підтримують керування власністю або перепризначення міток SELinux.*

  - **nfs.path** (string), обовʼязково

    path — це шлях, який експортується NFS-сервером. Додаткова інформація: [https://kubernetes.io/docs/concepts/storage/volumes#nfs](/docs/concepts/storage/volumes#nfs)

  - **nfs.server** (string), обовʼязково

    server — це імʼя хоста або IP-адреса сервера NFS. Додаткова інформація: [https://kubernetes.io/docs/concepts/storage/volumes#nfs](/docs/concepts/storage/volumes#nfs)

  - **nfs.readOnly** (boolean)

    readOnly тут примусово змусить експорт NFS монтувати з правами тільки на читання. Стандартне значення — false. Додаткова інформація: [https://kubernetes.io/docs/concepts/storage/volumes#nfs](/docs/concepts/storage/volumes#nfs)

- **photonPersistentDisk** (PhotonPersistentDiskVolumeSource)

  photonPersistentDisk представляє постійний диск PhotonController, приєднаний та змонтований на хост-машині kubelets. Застаріло: PhotonPersistentDisk застарів і внутрішній тип photonPersistentDisk більше не підтримується.

  <a name="PhotonPersistentDiskVolumeSource"></a>
  *Представляє ресурс постійного диска Photon Controller.*

  - **photonPersistentDisk.pdID** (string), обовʼязково

    pdID — це ідентифікатор, який ідентифікує постійний диск Photon Controller.

  - **photonPersistentDisk.fsType** (string)

    fsType — це тип файлової системи для монтування. Має бути тип файлової системи, який підтримується операційною системою хоста. Наприклад, "ext4", "xfs", "ntfs". Неявно вважається "ext4", якщо не вказано інше.

- **portworxVolume** (PortworxVolumeSource)

  portworxVolume представляє том Portworx, приєднаний та змонтований на хост-машині kubelets. Застаріло: PortworxVolume застарілв. Всі операції для внутрішнього типу portworxVolume перенаправляються на CSI-драйвер pxd.portworx.com, коли CSIMigrationPortworx функціональну можливість увімкнено.

  <a name="PortworxVolumeSource"></a>
  *PortworxVolumeSource представляє ресурс тома Portworx.*

  - **portworxVolume.volumeID** (string), обовʼязково

    volumeID унікально ідентифікує том Portworx.

  - **portworxVolume.fsType** (string)

    fsType представляє тип файлової системи для монтування. Має бути тип файлової системи, який підтримується операційною системою хоста. Наприклад, "ext4", "xfs". Неявно вважається "ext4", якщо не вказано інше.

  - **portworxVolume.readOnly** (boolean)

    readOnly стандартне значення — false (читання/запис). Встановлення readOnly тут примусить встановити параметр ReadOnly у VolumeMounts.

- **quobyte** (QuobyteVolumeSource)

  quobyte представляє монтування Quobyte на хості, яке діє впродовж життєвого циклу Podʼа. Застаріло: Quobyte застарілий і внутрішній тип quobyte більше не підтримується.

  <a name="QuobyteVolumeSource"></a>
  *Представляє монтування Quobyte, яке діє впродовж життєвого циклу Podʼа. Томи Quobyte не підтримують керування власністю або перепризначення міток SELinux.*

  - **quobyte.registry** (string), обовʼязково

    registry представляє один або кілька служб реєстру Quobyte, вказаних як рядок у вигляді пари host:port (декілька записів розділяються комами), який діє як центральний реєстр для томів.

  - **quobyte.volume** (string), обовʼязково

    volume — це рядок, який посилається на вже створений том Quobyte за імʼям.

  - **quobyte.group** (string)

    group — група для відображення доступу до тома. Стандартне знечення — без групи.

  - **quobyte.readOnly** (boolean)

    readOnly тут примусово змусить монтування тома Quobyte з правами тільки на читання. Стандартне значення — false.

  - **quobyte.tenant** (string)

    tenant, який володіє вказаним томом Quobyte в Backend. Використовується з динамічно створюваними томами Quobyte, значення встановлюється втулком.

  - **quobyte.user** (string)

    user — користувач для зіставлення (map) доступу до тома. Стандартне знечення — користувач serivceaccount.

- **rbd** (RBDVolumeSource)

  rbd представляє монтування блочного пристрою Rados на хості, яке діє впродовж життєвого циклу Podʼа. Застаріло: RBD застарів і внутрішній тип rbd більше не підтримується.

  <a name="RBDVolumeSource"></a>
  *Представляє монтування блочного пристрою Rados, яке діє впродовж життєвого циклу Podʼа. Томи RBD підтримують керування власністю та перепризначення міток SELinux.*

  - **rbd.image** (string), обовʼязково

    image — це імʼя образу Rados. Додаткова інформація: https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it

  - **rbd.monitors** ([]string), обовʼязково

    *Atomic: буде замінено під час злиття*

    monitors — це колекція моніторів Ceph. Додаткова інформація: https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it

  - **rbd.fsType** (string)

    fsType — це тип файлової системи тома, який ви хочете змонтувати. Порада: Переконайтеся, що тип файлової системи підтримується операційною системою хоста. Приклади: "ext4", "xfs", "ntfs". Неявно вважається "ext4", якщо не вказано інше. Додаткова інформація: [https://kubernetes.io/docs/concepts/storage/volumes#rbd](/docs/concepts/storage/volumes#rbd)

  - **rbd.keyring** (string)

    keyring — це шлях до вʼязки ключів користувача RBDUser. Стандартне значення — /etc/ceph/keyring. Додаткова інформація: htts://examples.k8s.io/volumes/rbd/README.md#how-to-use-it

  - **rbd.pool** (string)

    pool — це імʼя пулу Rados. Стандартне значення — rbd. Додаткова інформація: https://exampes.k8s.io/volumes/rbd/README.md#how-to-use-it

  - **rbd.readOnly** (boolean)

    readOnly тут примусово встановить параметр ReadOnly у VolumeMounts. Стандартне значення — false. Додаткова інформація: https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it

  - **rbd.secretRef** (<a href="{{< ref "../common-definitions/local-object-reference#LocalObjectReference" >}}">LocalObjectReference</a>)

    secretRef — це імʼя автентифікаційного секрету для користувача RBDUser. Якщо вказано, перевизначає keyring. Стандартне значення — nil. Додаткова інформація: https://exampes.k8s.io/volumes/rbd/README.md#how-to-use-it

  - **rbd.user** (string)

    user — це імʼя користувача Rados. Стандартне значення — admin. Додаткова інформація: https://exampes.k8s.io/volumes/rbd/README.md#how-to-use-it

- **scaleIO** (ScaleIOVolumeSource)

  scaleIO представляє постійний том ScaleIO, приєднаний та змонтований на вузлах Kubernetes. Застаріло: ScaleIO застаріла, а внутрішній тип scaleIO більше не підтримується.

  <a name="ScaleIOVolumeSource"></a>
  *ScaleIOVolumeSource представляє постійний том ScaleIO*

  - **scaleIO.gateway** (string), обовʼязково

    gateway — це адреса хоста шлюзу API ScaleIO.

  - **scaleIO.secretRef** (<a href="{{< ref "../common-definitions/local-object-reference#LocalObjectReference" >}}">LocalObjectReference</a>), обовʼязково

    secretRef посилається на секрет для користувача ScaleIO та іншої конфіденційної інформації. Якщо це не надано, операція входу не вдасться.

  - **scaleIO.system** (string), обовʼязково

    system — це імʼя системи зберігання, налаштоване в ScaleIO.

  - **scaleIO.fsType** (string)

    fsType — це тип файлової системи для монтування. Має бути тип файлової системи, який підтримується операційною системою хоста. Наприклад, "ext4", "xfs", "ntfs". Стандартне значення — "xfs".

  - **scaleIO.protectionDomain** (string)

    protectionDomain — це імʼя ScaleIO Protection Domain для налаштованого зберігання.

  - **scaleIO.readOnly** (boolean)

    readOnly стандартне значення — false (читання/запис). Встановлення readOnly тут примусить встановити параметр ReadOnly у VolumeMounts.

  - **scaleIO.sslEnabled** (boolean)

    sslEnabled — прапорець, що ввімкнує/вимикає SSL-звʼязок з шлюзом, станддартне значення — false

  - **scaleIO.storageMode** (string)

    storageMode вказує, чи повинно бути зберігання для тому ThickProvisioned чи ThinProvisioned. Стандартне значення — ThinProvisioned.

  - **scaleIO.storagePool** (string)

    storagePool — це пул зберігання ScaleIO, повʼязаний з доменом захисту.

  - **scaleIO.volumeName** (string)

    volumeName — це імʼя тому, вже створеного в системі ScaleIO, який повʼязаний з цим джерелом тому.

- **storageos** (StorageOSVolumeSource)

  storageos представляє том StorageOS, приєднаний та змонтований на вузлах Kubernetes. Застаріло: StorageOS застаріла і внутрішній тип storageos більше не підтримується.

  <a name="StorageOSVolumeSource"></a>
  *Представляє постійний ресурс тому StorageOS.*

  - **storageos.fsType** (string)

    fsType — це тип файлової системи для монтування. Має бути тип файлової системи, який підтримується операційною системою хоста. Наприклад, "ext4", "xfs", "ntfs". Неявно вважається "ext4", якщо не вказано інше.

  - **storageos.readOnly** (boolean)

    readOnly стандартне значення — false (читання/запис). Встановлення readOnly тут примусить встановити параметр ReadOnly у VolumeMounts.

  - **storageos.secretRef** (<a href="{{< ref "../common-definitions/local-object-reference#LocalObjectReference" >}}">LocalObjectReference</a>)

    secretRef вказує секрет для отримання облікових даних API StorageOS. Якщо не вказано, будуть спробовані стандартні значення.

  - **storageos.volumeName** (string)

    volumeName — це людино-читане імʼя тому StorageOS. Імена томів є унікальними лише в межах простору імен.

  - **storageos.volumeNamespace** (string)

    volumeNamespace вказує том простору імен в межах StorageOS. Якщо простір імен не вказано, тоді буде використано простір імен Pod. Це дозволяє дублювати простори імен Kubernetes у StorageOS для більш тісної інтеграції. Встановіть VolumeName на будь-яке імʼя для заміни стандартної поведінки. Встановіть на "default", якщо ви не використовуєте простори імен у StorageOS. Простори імен, які не існують заздалегідь у StorageOS, будуть створені.

- **vsphereVolume** (VsphereVirtualDiskVolumeSource)

  vsphereVolume представляє том vSphere, приєднаний та змонтований на вузлах kubelet. Застаріло: VsphereVolume застарів. Усі операції для внутрішнього типу vsphereVolume перенаправляються на драйвер CSI csi.vsphere.vmware.com.

  <a name="VsphereVirtualDiskVolumeSource"></a>
  *Представляє ресурс тому vSphere.*

  - **vsphereVolume.volumePath** (string), обовʼязково

    volumePath — це шлях, який ідентифікує том vmdk vSphere.

  - **vsphereVolume.fsType** (string)

    fsType — це тип файлової системи для монтування. Має бути тип файлової системи, який підтримується операційною системою хоста. Наприклад, "ext4", "xfs", "ntfs". Неявно вважається "ext4", якщо не вказано інше.

  - **vsphereVolume.storagePolicyID** (string)

    storagePolicyID — це ідентифікатор профілю управління політикою зберігання (SPBM), повʼязаний з іменем StoragePolicyName.

  - **vsphereVolume.storagePolicyName** (string)

    storagePolicyName — це імʼя профілю управління політикою зберігання (SPBM).

### Застаріле {#deprecated}

- **gitRepo** (GitRepoVolumeSource)

  gitRepo представляє репозиторій git на певному рівні ревізії. Застаріло: GitRepo застаріло. Для створення контейнера з репозиторієм git підключіть EmptyDir до InitContainer, який клонує репо за допомогою git, а потім підключіть EmptyDir до контейнера Pod.

  <a name="GitRepoVolumeSource"></a>
  *Представляє том, який заповнений вмістом репозиторію git. Томи репозиторію git не підтримують управління власниками. Томи репозиторію git підтримують перепризначення міток SELinux.

  Застаріло: GitRepo застаріло. Для створення контейнера з репозиторієм git підключіть EmptyDir до InitContainer, який клонує репо за допомогою git, а потім підключіть EmptyDir до контейнера Pod.*

  - **gitRepo.repository** (string), обовʼязково

    repository — це URL

  - **gitRepo.directory** (string)

    directory — це назва цільової теки. Не повинен містити або починатися з '..'. Якщо '.' надано, тека тому буде репозиторієм git. В іншому випадку, якщо вказано, том буде містити репозиторій git у підтеці з вказаною назвою.

  - **gitRepo.revision** (string)

    revision — це хеш коміту для вказаної ревізії.

## DownwardAPIVolumeFile {#DownwardAPIVolumeFile}

 DownwardAPIVolumeFile представляє інформацію для створення файлу, що містить поле pod.

---

- **path** (string), обовʼязково

  Обовʼязково: path — це відносний шлях до файлу, який буде створено. Не повинен бути абсолютним або містити шлях "..". Має бути закодований у кодуванні utf-8. Перший елемент відносного шляху не повинен починатися з "..".

- **fieldRef** (<a href="{{< ref "../common-definitions/object-field-selector#ObjectFieldSelector" >}}">ObjectFieldSelector</a>)

  Обовʼязково: Вибирає поле pod: підтримуються лише анотації, мітки, імʼя, uid та простір імен.

- **mode** (int32)

  Опціонально: біти режиму, які використовуються для встановлення дозволів на цей файл, повинні бути вісімковим значенням від 0000 до 0777 або десятковим значенням від 0 до 511. У YAML приймаються як вісімкові, так і десяткові значення, у JSON потрібні десяткові значення для бітів режиму. Якщо не вказано, буде використано стандартне значення для тому. Це може конфліктувати з іншими параметрами, що впливають на режим файлу, наприклад, fsGroup, і результат може бути іншим набором бітів режиму.

- **resourceFieldRef** (<a href="{{< ref "../common-definitions/resource-field-selector#ResourceFieldSelector" >}}">ResourceFieldSelector</a>)

  Вибирає ресурс контейнера: наразі підтримуються лише обмеження та запити ресурсів (limits.cpu, limits.memory, requests.cpu та requests.memory).

## KeyToPath {#KeyToPath}

Зіставляє ключ зі шляхом в томі.

---

- **key** (string), обовʼязково

  key — це ключ, який потрібно проєцювати.

- **path** (string), обовʼязково

  path — це відносний шлях файлу, який  слід прикріпити до ключа. Не може бути абсолютним шляхом. Не може містити елемента шляху '..'. Не може починатися з рядка '..'.

- **mode** (int32)

  mode — опціонально: біти режиму, які використовуються для встановлення дозволів на цей файл. Має бути вісімковим значенням між 0000 та 0777 або десятковим значенням між 0 та 511. У YAML приймаються як вісімкові, так і десяткові значення, у JSON для бітів режиму потрібні десяткові значення. Якщо не вказано, буде використано стнадартне значення для тому. Це може конфліктувати з іншими параметрами, що впливають на режим файлу, такими як fsGroup, і результат може бути іншим набором бітів режиму.
