---
title: Посібник з запуску контейнерів Windows у Kubernetes
content_type: tutorial
weight: 75
---

<!-- overview -->

Ця сторінка надає покроковий опис, які ви можете виконати, щоб запустити контейнери Windows за допомогою Kubernetes. На сторінці також висвітлені деякі специфічні для Windows функції в Kubernetes.

Важливо зауважити, що створення та розгортання служб і робочих навантажень у Kubernetes працює практично однаково для контейнерів Linux та Windows. Команди [kubectl](/docs/reference/kubectl/), щоб працювати з кластером, ідентичні. Приклади на цій сторінці надаються для швидкого старту з контейнерами Windows.

<!-- body -->

## Цілі {#objectives}

Налаштувати приклад розгортання для запуску контейнерів Windows на вузлі з операційною системою Windows.

## {{% heading "prerequisites" %}}

Ви вже повинні мати доступ до кластера Kubernetes, який містить робочий вузол з операційною системою Windows Server.

## Початок роботи: Розгортання робочого навантаження Windows {#getting-started-deploying-a-windows-workload}

Наведений нижче приклад файлу YAML розгортає простий вебсервер, який працює в контейнері Windows.

Створіть файл маніфесту з назвою `win-webserver.yaml` з наступним вмістом:

```yaml
---
apiVersion: v1
kind: Service
metadata:
  name: win-webserver
  labels:
    app: win-webserver
spec:
  ports:
    # порт, на якому має працювати ця служба
    - port: 80
      targetPort: 80
  selector:
    app: win-webserver
  type: NodePort
---
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: win-webserver
  name: win-webserver
spec:
  replicas: 2
  selector:
    matchLabels:
      app: win-webserver
  template:
    metadata:
      labels:
        app: win-webserver
      name: win-webserver
    spec:
     containers:
      - name: windowswebserver
        image: mcr.microsoft.com/windows/servercore:ltsc2019
        command:
        - powershell.exe
        - -command
        - "<#code used from https://gist.github.com/19WAS85/5424431#> ; $$listener = New-Object System.Net.HttpListener ; $$listener.Prefixes.Add('http://*:80/') ; $$listener.Start() ; $$callerCounts = @{} ; Write-Host('Listening at http://*:80/') ; while ($$listener.IsListening) { ;$$context = $$listener.GetContext() ;$$requestUrl = $$context.Request.Url ;$$clientIP = $$context.Request.RemoteEndPoint.Address ;$$response = $$context.Response ;Write-Host '' ;Write-Host('> {0}' -f $$requestUrl) ;  ;$$count = 1 ;$$k=$$callerCounts.Get_Item($$clientIP) ;if ($$k -ne $$null) { $$count += $$k } ;$$callerCounts.Set_Item($$clientIP, $$count) ;$$ip=(Get-NetAdapter | Get-NetIpAddress); $$header='<html><body><H1>Windows Container Web Server</H1>' ;$$callerCountsString='' ;$$callerCounts.Keys | % { $$callerCountsString+='<p>IP {0} callerCount {1} ' -f $$ip[1].IPAddress,$$callerCounts.Item($$_) } ;$$footer='</body></html>' ;$$content='{0}{1}{2}' -f $$header,$$callerCountsString,$$footer ;Write-Output $$content ;$$buffer = [System.Text.Encoding]::UTF8.GetBytes($$content) ;$$response.ContentLength64 = $$buffer.Length ;$$response.OutputStream.Write($$buffer, 0, $$buffer.Length) ;$$response.Close() ;$$responseStatus = $$response.StatusCode ;Write-Host('< {0}' -f $$responseStatus)  } ; "
     nodeSelector:
      kubernetes.io/os: windows
```

{{< note >}}
Зіставлення портів також підтримується, але для спрощення цей приклад використовує прямий доступ до порту 80 контейнера у Service.
{{< /note >}}

1. Перевірте, що всі вузли справні:

    ```bash
    kubectl get nodes
    ```

2. Розгорніть Service та спостерігайте за оновленнями робочих навантажень:

    ```bash
    kubectl apply -f win-webserver.yaml
    kubectl get pods -o wide -w
    ```

    Коли служба розгорнута правильно, обидва робочі навантаження позначаються як готові. Щоб вийти з команди спостереження, натисніть Ctrl+C.

3. Перевірте успішність розгортання. Для перевірки:

    * Кілька Podʼів показуються з вузла керування Linux, скористайтеся `kubectl get pods`
    * Комунікація від вузла до Podʼа через мережу, за допомогою `curl` перевірте доступність порту 80 за IP-адресою Podʼів з вузла керування Linux, щоб перевірити відповідь вебсервера
    * Комунікація від Podʼа до Podʼа, пінг між Podʼами (і між хостами, якщо у вас більше одного вузла Windows) за допомогою `kubectl exec`
    * Комунікація Service-Pod, за допомогою `curl` перевірте віртуальний IP-адрес служби (вказаний у `kubectl get services`) з вузла керування Linux і з окремих Podʼів
    * Виявлення Service, за допомогою `curl` перевірте імʼя Service з [типовим суфіксом DNS Kubernetes](/docs/concepts/services-networking/dns-pod-service/#services)
    * Вхідне підключення, за допомогою `curl` перевірте NodePort з вузла керування Linux або зовнішніх машин поза кластером
    * Вихідне підключення, за допомогою `curl` перевірте зовнішні IP-адреси зсередини Podʼа за допомогою `kubectl exec`

{{< note >}}
Хости контейнерів Windows не можуть отримати доступ до IP-адрес служб, запланованих на них через поточні обмеження платформи мережі Windows. Здатність до доступу до IP-адрес служб мають лише Podʼи Windows.
{{< /note >}}

## Спостережуваність {#observability}

### Збір логів з навантажень {#capturing-logs-from-workloads}

Логи — важливий елемент спостереження; вони дозволяють користувачам отримувати інформацію про роботу навантажень та є ключовим інгредієнтом для розвʼязання проблем. Оскільки контейнери Windows та робочі навантаження всередині контейнерів Windows поводяться по-іншому ніж контейнери в Linux, користувачі мали проблеми зі збором логів, що обмежувало операційну видимість. Робочі навантаження Windows, наприклад, зазвичай налаштовані на ведення логу подій ETW (Event Tracing for Windows) або надсилання записів в журнал подій програми. [LogMonitor](https://github.com/microsoft/windows-container-tools/tree/master/LogMonitor), відкритий інструмент від Microsoft, є рекомендованим способом моніторингу налаштованих джерел логів всередині контейнера Windows. LogMonitor підтримує моніторинг логів подій, провайдерів ETW та власних логів програм, перенаправляючи їх у STDOUT для використання за допомогою `kubectl logs <pod>`.

Дотримуйтеся інструкцій на сторінці GitHub LogMonitor, щоб скопіювати його бінарні файли та файли конфігурації до всіх ваших контейнерів та додати необхідні точки входу для LogMonitor, щоб він міг надсилати ваші логи у STDOUT.

## Налаштування користувача для роботи контейнера {#configuring-container-user}

### Використання налаштовуваних імен користувача контейнера {#using-configurable-container-usernames}

Контейнери Windows можуть бути налаштовані для запуску своїх точок входу та процесів з іншими іменами користувачів, ніж ті, що типово встановлені в образі. Дізнайтеся більше про це [тут](/docs/tasks/configure-pod-container/configure-runasusername/).

### Управління ідентифікацією робочого навантаження за допомогою групових керованих службових облікових записів {#managing-workload-identity-with-group-managed-service-accounts}

Робочі навантаження контейнерів Windows можна налаштувати для використання групових керованих службових облікових записів (Group Managed Service Accounts — GMSA). Групові керовані службові облікові записи є конкретним типом облікових записів Active Directory, які забезпечують автоматичне керування паролями, спрощене керування іменами службових принципалів (service principal name — SPN) та можливість делегування управління іншим адміністраторам на кількох серверах. Контейнери, налаштовані з GMSA, можуть отримувати доступ до зовнішніх ресурсів домену Active Directory, надаючи тим самим ідентифікацію, налаштовану за допомогою GMSA. Дізнайтеся більше про налаштування та використання GMSA для контейнерів Windows [тут](/docs/tasks/configure-pod-container/configure-gmsa/).

## Заплямованість та Толерантність {#taints-and-tolerations}

Користувачам необхідно використовувати певну комбінацію {{<glossary_tooltip text="taintʼів" term_id="taint" >}} та селекторів вузлів, щоб розміщувати робочі навантаження Linux та Windows на відповідних вузлах з операційними системами. Рекомендований підхід викладений нижче, однією з його головних цілей є те, що цей підхід не повинен порушувати сумісність для наявних робочих навантажень Linux.

Ви можете (і повинні) встановлювати значення `.spec.os.name` для кожного Pod, щоб вказати операційну систему, для якої призначені контейнери у цьому Pod. Для Podʼів, які запускають контейнери Linux, встановіть `.spec.os.name` на `linux`. Для Podʼів, які запускають контейнери Windows, встановіть `.spec.os.name` на `windows`.

{{< note >}}
Якщо ви використовуєте версію Kubernetes старішу за 1.24, вам може знадобитися увімкнути [функціональну можливість](/docs/reference/command-line-tools-reference/feature-gates/) `IdentifyPodOS`, щоб мати можливість встановлювати значення для `.spec.pod.os`.
{{< /note >}}

Планувальник не використовує значення `.spec.os.name` при призначенні Podʼів вузлам. Ви повинні використовувати звичайні механізми Kubernetes для [призначення Podʼів вузлам](/docs/concepts/scheduling-eviction/assign-pod-node/), щоб забезпечити, що панель управління вашого кластера розміщує Podʼи на вузлах, на яких працюють відповідні операційні системи.

Значення `.spec.os.name` не впливає на планування Podʼів Windows, тому все ще потрібні taint та толерантності (або селектори вузлів), щоб забезпечити, що Podʼи Windows розміщуються на відповідних вузлах Windows.

### Забезпечення того, що навантаження, специфічні для ОС, розміщуються на відповідний хост {#ensuring-os-specific-workloads-land-on-the-appropriate-container-host}

Користувачі можуть забезпечувати, що Windows контейнери можуть бути заплановані на відповідний хост за допомогою taint та толерантностей. Усі вузли Kubernetes, які працюють під керуванням Kubernetes {{< skew currentVersion >}}, типово мають такі мітки:

* kubernetes.io/os = [windows|linux]
* kubernetes.io/arch = [amd64|arm64|...]

Якщо специфікація Pod не вказує селектор вузла, такий як `"kubernetes.io/os": windows`, це може означати можливість розміщення Pod на будь-якому хості, Windows або Linux. Це може бути проблематичним, оскільки Windows контейнер може працювати лише на Windows, а Linux контейнер може працювати лише на Linux. Найкраща практика для Kubernetes {{< skew currentVersion >}} — використовувати селектор вузлів.

Однак у багатьох випадках користувачі мають вже наявну велику кількість розгортань для Linux контейнерів, а також екосистему готових конфігурацій, таких як Helm-чарти створені спільнотою, і випадки програмної генерації Podʼів, такі як оператори. У таких ситуаціях ви можете мати сумнів що до того, щоб внести зміну конфігурації для додавання полів `nodeSelector` для всіх Podʼів і шаблонів Podʼів. Альтернативою є використання taint. Оскільки kubelet може встановлювати taint під час реєстрації, його можна легко змінити для автоматичного додавання taint при запуску лише на Windows.

Наприклад: `--register-with-taints='os=windows:NoSchedule'`

Додавши taint до всіх вузлів Windows, на них нічого не буде заплановано (це стосується наявних Podʼів Linux). Щоб запланувати Pod Windows на вузлі Windows, для цього потрібно вказати як `nodeSelector`, так і відповідну толерантність для вибору Windows.

```yaml
nodeSelector:
    kubernetes.io/os: windows
    node.kubernetes.io/windows-build: '10.0.20348'
tolerations:
    - key: "os"
      operator: "Equal"
      value: "windows"
      effect: "NoSchedule"
```

### Робота з кількома версіями Windows в одному кластері {#handling-multiple-windows-versions-in-the-same-cluster}

Версія Windows Server, що використовується кожним Pod, повинна відповідати версії вузла. Якщо ви хочете використовувати кілька версій Windows Server в одному кластері, то вам слід встановити додаткові мітки вузлів та поля `nodeSelector`.

Kubernetes автоматично додає мітку,
[`node.kubernetes.io/windows-build`](/docs/reference/labels-annotations-taints/#nodekubernetesiowindows-build) для спрощення цього.

Ця мітка відображає основний, додатковий і номер збірки Windows, які повинні збігатись для сумісності. Ось значення, що використовуються для кожної версії Windows Server:

| Назва продукту                       | Версія                 |
|--------------------------------------|------------------------|
| Windows Server 2022                  | 10.0.20348             |
| Windows Server 2025                  | 10.0.26100             |

### Спрощення за допомогою RuntimeClass {#simplifying-with-runtimeclass}

[RuntimeClass] може бути використаний для спрощення процесу використання taints та tolerations. Адміністратор кластера може створити обʼєкт `RuntimeClass`, який використовується для інкапсуляції цих taint та toleration.

1. Збережіть цей файл як `runtimeClasses.yml`. Він містить відповідний `nodeSelector` для ОС Windows, архітектури та версії.

   ```yaml
   ---
   apiVersion: node.k8s.io/v1
   kind: RuntimeClass
   metadata:
     name: windows-2019
   handler: example-container-runtime-handler
   scheduling:
     nodeSelector:
       kubernetes.io/os: 'windows'
       kubernetes.io/arch: 'amd64'
       node.kubernetes.io/windows-build: '10.0.20348'
     tolerations:
     - effect: NoSchedule
       key: os
       operator: Equal
       value: "windows"
   ```

2. Виконайте команду `kubectl create -f runtimeClasses.yml` з правами адміністратора кластера.
3. Додайте `runtimeClassName: windows-2019` відповідно до специфікацій Pod.

   Наприклад:

   ```yaml
   ---
   apiVersion: apps/v1
   kind: Deployment
   metadata:
     name: iis-2019
     labels:
       app: iis-2019
   spec:
     replicas: 1
     template:
       metadata:
         name: iis-2019
         labels:
           app: iis-2019
       spec:
         runtimeClassName: windows-2019
         containers:
         - name: iis
           image: mcr.microsoft.com/windows/servercore/iis:windowsservercore-ltsc2019
           resources:
             limits:
               cpu: 1
               memory: 800Mi
             requests:
               cpu: .1
               memory: 300Mi
           ports:
             - containerPort: 80
    selector:
       matchLabels:
         app: iis-2019
   ---
   apiVersion: v1
   kind: Service
   metadata:
     name: iis
   spec:
     type: LoadBalancer
     ports:
     - protocol: TCP
       port: 80
     selector:
       app: iis-2019
   ```

[RuntimeClass]: /uk/docs/concepts/containers/runtime-class/

