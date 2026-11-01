---
title: Посібник із запуску контейнерів Windows у Kubernetes
content_type: tutorial
weight: 75
---

<!-- overview -->

На цій сторінці наведено покроковий опис дій, які можна виконати, щоб запускати контейнери Windows за допомогою Kubernetes. Також на сторінці висвітлено деяку специфічну для Windows функціональність у Kubernetes.

Важливо зауважити, що створення та розгортання Services і робочих навантажень у Kubernetes відбувається майже однаково для контейнерів Linux та Windows. [Команди kubectl](/docs/reference/kubectl/) для взаємодії з кластером ідентичні. Приклади на цій сторінці наведено, щоб ви могли швидко почати роботу з контейнерами Windows.

<!-- body -->

## Цілі {#objectives}

Налаштувати приклад розгортання для запуску контейнерів Windows на вузлі Windows.

## {{% heading "prerequisites" %}} {#before-you-begin}

Ви вже повинні мати доступ до кластера Kubernetes, який містить робочий вузол, на якому працює Windows Server.

## Початок роботи: Розгортання робочого навантаження Windows {#getting-started-deploying-a-windows-workload}

Наведений нижче приклад файлу YAML розгортає простий вебсервер, що працює в контейнері Windows.

Створіть маніфест із назвою `win-webserver.yaml` з таким вмістом:

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
    # порт, на якому має працювати цей Service
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
Зіставлення портів також підтримується, але для простоти в цьому прикладі порт 80 контейнера відкрито безпосередньо для Service.
{{< /note >}}

1. Перевірте, що всі вузли справні:

    ```bash
    kubectl get nodes
    ```

1. Розгорніть Service та спостерігайте за оновленнями Podʼів:

    ```bash
    kubectl apply -f win-webserver.yaml
    kubectl get pods -o wide -w
    ```

    Коли Service розгорнуто правильно, обидва Podʼи позначаються як Ready. Щоб вийти з команди спостереження, натисніть Ctrl+C.

1. Перевірте успішність розгортання. Для перевірки:

    * Кілька Podʼів показуються з вузла панелі управління Linux, скористайтеся `kubectl get pods`
    * Звʼязок між вузлом і Podʼом через мережу, за допомогою `curl` перевірте порт 80 IP-адрес ваших Podʼів з вузла панелі управління Linux, щоб перевірити відповідь вебсервера
    * Звʼязок між Podʼами, пінг між Podʼами (і між хостами, якщо у вас більше одного вузла Windows) за допомогою `kubectl exec`
    * Звʼязок між Service і Podʼом, за допомогою `curl` перевірте віртуальну IP-адресу Service (її видно в `kubectl get services`) з вузла панелі управління Linux та з окремих Podʼів
    * Виявлення Service, за допомогою `curl` перевірте назву Service зі [стандартним суфіксом DNS Kubernetes](/docs/concepts/services-networking/dns-pod-service/#services)
    * Вхідне підключення, за допомогою `curl` перевірте NodePort з вузла панелі управління Linux або з машин поза кластером
    * Вихідне підключення, за допомогою `curl` перевірте зовнішні IP-адреси зсередини Podʼа, використовуючи `kubectl exec`

{{< note >}}
Хости контейнерів Windows не можуть отримати доступ до IP-адрес Services, запланованих на них, через поточні обмеження платформи мережевого стека Windows. Доступ до IP-адрес Services мають лише Podʼи Windows.
{{< /note >}}

## Спостережуваність {#observability}

### Збір логів робочих навантажень {#capturing-logs-from-workloads}

Логи — важливий елемент спостережуваності; вони дозволяють користувачам отримувати інформацію про роботу робочих навантажень і є ключовою складовою усунення несправностей. Оскільки контейнери Windows та робочі навантаження всередині контейнерів Windows поводяться інакше, ніж контейнери Linux, користувачам було важко збирати логи, що обмежувало операційну видимість. Робочі навантаження Windows, наприклад, зазвичай налаштовані на логування в ETW (Event Tracing for Windows) або надсилання записів до журналу подій застосунку. [LogMonitor](https://github.com/microsoft/windows-container-tools/tree/master/LogMonitor), інструмент Microsoft з відкритим кодом, є рекомендованим способом моніторингу налаштованих джерел логів усередині контейнера Windows. LogMonitor підтримує моніторинг журналів подій, провайдерів ETW та власних логів застосунків, перенаправляючи їх у STDOUT для споживання через `kubectl logs <pod>`.

Дотримуйтеся інструкцій на сторінці LogMonitor на GitHub, щоб скопіювати його бінарні файли та файли конфігурації до всіх ваших контейнерів і додати необхідні точки входу, щоб LogMonitor міг надсилати ваші логи у STDOUT.

## Налаштування користувача контейнера {#configuring-container-user}

### Використання налаштовуваних імен користувачів контейнера {#using-configurable-container-usernames}

Контейнери Windows можна налаштувати для запуску своїх точок входу та процесів з іменами користувачів, відмінними від стандартних для образу. Дізнайтеся більше про це [тут](/docs/tasks/configure-pod-container/configure-runasusername/).

### Керування ідентичністю робочих навантажень за допомогою службових облікових записів з груповим керуванням {#managing-workload-identity-with-group-managed-service-accounts}

Робочі навантаження контейнерів Windows можна налаштувати для використання службових облікових записів з груповим керуванням (Group Managed Service Accounts, GMSA). Службові облікові записи з груповим керуванням — це особливий тип облікових записів Active Directory, які забезпечують автоматичне керування паролями, спрощене керування іменами принципалів служб (service principal name, SPN) та можливість делегувати керування іншим адміністраторам на кількох серверах. Контейнери, налаштовані з GMSA, можуть отримувати доступ до зовнішніх ресурсів домену Active Directory, використовуючи ідентичність, налаштовану за допомогою GMSA. Дізнайтеся більше про налаштування та використання GMSA для контейнерів Windows [тут](/docs/tasks/configure-pod-container/configure-gmsa/).

## Taints та tolerations {#taints-and-tolerations}

Користувачам необхідно використовувати певну комбінацію {{<glossary_tooltip text="taints" term_id="taint" >}} та селекторів вузлів, щоб планувати робочі навантаження Linux та Windows на вузли з відповідною ОС. Рекомендований підхід викладено нижче; одна з його головних цілей — не порушувати сумісність для наявних робочих навантажень Linux.

Ви можете (і повинні) встановлювати `.spec.os.name` для кожного Podʼа, щоб вказати операційну систему, для якої призначені контейнери в цьому Podʼі. Для Podʼів, які запускають контейнери Linux, встановіть `.spec.os.name` у `linux`. Для Podʼів, які запускають контейнери Windows, встановіть `.spec.os.name` у `windows`.

Планувальник не використовує значення `.spec.os.name` під час призначення Podʼів вузлам. Ви повинні використовувати звичайні механізми Kubernetes для [призначення Podʼів вузлам](/docs/concepts/scheduling-eviction/assign-pod-node/), щоб панель управління вашого кластера розміщувала Podʼи на вузлах, на яких працює відповідна операційна система.

Значення `.spec.os.name` не впливає на планування Podʼів Windows, тому taints та tolerations (або селектори вузлів) усе ще потрібні, щоб Podʼи Windows потрапляли на відповідні вузли Windows.

### Забезпечення розміщення робочих навантажень, специфічних для ОС, на відповідному хості контейнерів {#ensuring-os-specific-workloads-land-on-the-appropriate-container-host}

Користувачі можуть забезпечити планування контейнерів Windows на відповідний хост за допомогою taints та tolerations. Усі вузли Kubernetes, на яких працює Kubernetes {{< skew currentVersion >}}, мають такі стандартні мітки:

* kubernetes.io/os = [windows|linux]
* kubernetes.io/arch = [amd64|arm64|...]

Якщо специфікація Podʼа не вказує `nodeSelector`, такий як `"kubernetes.io/os": windows`, Pod може бути запланований на будь-який хост, Windows або Linux. Це може бути проблемою, оскільки контейнер Windows може працювати лише на Windows, а контейнер Linux — лише на Linux. Найкраща практика для Kubernetes {{< skew currentVersion >}} — використовувати `nodeSelector`.

Однак у багатьох випадках користувачі вже мають велику кількість розгортань для контейнерів Linux, а також екосистему готових конфігурацій, таких як Helm-чарти спільноти, і випадки програмної генерації Podʼів, наприклад за допомогою операторів. У таких ситуаціях ви можете вагатися, чи вносити зміни до конфігурації, щоб додати поля `nodeSelector` до всіх Podʼів і шаблонів Podʼів. Альтернативою є використання taints. Оскільки kubelet може встановлювати taints під час реєстрації, його можна легко змінити так, щоб він автоматично додавав taint лише під час роботи на Windows.

Наприклад: `--register-with-taints='os=windows:NoSchedule'`

Якщо додати taint до всіх вузлів Windows, на них нічого не буде заплановано (зокрема й наявні Podʼи Linux). Щоб Pod Windows було заплановано на вузол Windows, йому потрібні і `nodeSelector`, і відповідна toleration для вибору Windows.

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

Версія Windows Server, яку використовує кожен Pod, повинна збігатися з версією вузла. Якщо ви хочете використовувати кілька версій Windows Server в одному кластері, то вам слід встановити додаткові мітки вузлів та поля `nodeSelector`.

Kubernetes автоматично додає мітку,
[`node.kubernetes.io/windows-build`](/docs/reference/labels-annotations-taints/#nodekubernetesiowindows-build) щоб це спростити.

Ця мітка відображає старший і молодший номери версії Windows та номер збірки, які повинні збігатися для сумісності. Ось значення для кожної версії Windows Server:

| Назва продукту                       | Версія                 |
|--------------------------------------|------------------------|
| Windows Server 2022                  | 10.0.20348             |
| Windows Server 2025                  | 10.0.26100             |

### Спрощення за допомогою RuntimeClass {#simplifying-with-runtimeclass}

[RuntimeClass] можна використовувати для спрощення роботи з taints та tolerations. Адміністратор кластера може створити обʼєкт `RuntimeClass`, який інкапсулює ці taints та tolerations.

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

1. Виконайте команду `kubectl create -f runtimeClasses.yml` з правами адміністратора кластера.
1. Додайте `runtimeClassName: windows-2019` до відповідних специфікацій Podʼів.

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
               cpu: 100m
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

[RuntimeClass]: /docs/concepts/containers/runtime-class/
