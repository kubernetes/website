---
title: Поради щодо налагодження Windows
content_type: concept
---

<!-- overview -->

<!-- body -->

## Усунення несправностей на рівні вузла {#troubleshooting-node}

1. Мої Podʼи застрягли в стані "Container Creating" або постійно перезапускаються

   Переконайтеся, що ваш образ pause сумісний з версією вашої ОС Windows. Дивіться [Контейнер pause](/docs/concepts/windows/intro/#pause-container), щоб дізнатися про найновіший / рекомендований образ pause та/або отримати більше інформації.

   {{< note >}}
   Якщо ви використовуєте containerd як середовище виконання контейнерів, образ pause вказується в полі `plugins.plugins.cri.sandbox_image` файлу конфігурації config.toml.
   {{< /note >}}

1. Мої Podʼи показують статус `ErrImgPull` або `ImagePullBackOff`

   Переконайтеся, що ваш Pod планується на [сумісний](https://docs.microsoft.com/virtualization/windowscontainers/deploy-containers/version-compatibility) вузол Windows.

   Додаткову інформацію про те, як вказати сумісний вузол для вашого Podʼа, можна знайти в
   [цьому посібнику](/docs/concepts/windows/user-guide/#ensuring-os-specific-workloads-land-on-the-appropriate-container-host).

## Усунення несправностей мережі {#troubleshooting-network}

1. Мої Podʼи Windows не мають мережевого зʼєднання

   Якщо ви використовуєте віртуальні машини, переконайтеся, що MAC spoofing **увімкнено** на всіх мережевих адаптерах віртуальних машин.

1. Мої Podʼи Windows не можуть виконати ping до зовнішніх ресурсів

   Для Podʼів Windows не запрограмовано правил вихідного трафіку для протоколу ICMP. Однак TCP/UDP підтримується. Коли потрібно показати зʼєднання з ресурсами за межами кластера, замініть `ping <IP>` відповідними командами `curl <IP>`.

   Якщо проблеми не зникли, найімовірніше, ваша мережева конфігурація в [cni.conf](https://github.com/Microsoft/SDN/blob/master/Kubernetes/flannel/l2bridge/cni/config/cni.conf) потребує додаткової уваги. Цей статичний файл завжди можна редагувати. Оновлена конфігурація застосовується до всіх нових ресурсів Kubernetes.

   Одна з мережевих вимог Kubernetes (дивіться [модель Kubernetes](/docs/concepts/cluster-administration/networking/)) — звʼязок усередині кластера без NAT. Щоб виконати цю вимогу, існує [ExceptionList](https://github.com/Microsoft/SDN/blob/master/Kubernetes/flannel/l2bridge/cni/config/cni.conf#L20) для всього трафіку, до якого ви не хочете застосовувати вихідний NAT. Однак це також означає, що зовнішню IP-адресу, до якої ви звертаєтеся, потрібно вилучити з `ExceptionList`. Лише тоді трафік з ваших Podʼів Windows буде правильно оброблено SNAT, щоб отримати відповідь із зовнішнього світу. Тож ваш `ExceptionList` у `cni.conf` має виглядати так:

   ```conf
   "ExceptionList": [
                   "10.244.0.0/16",  # Підмережа кластера
                   "10.96.0.0/12",   # Підмережа Service
                   "10.127.130.0/24" # Підмережа керування (хоста)
               ]
   ```

1. Мій вузол Windows не може отримати доступ до Service типу `NodePort`

   Локальний доступ до NodePort із самого вузла не працює. Це відоме обмеження. Доступ до NodePort працює з інших вузлів або із зовнішніх клієнтів.

1. vNIC і точки доступу HNS контейнерів видаляються

   Ця проблема може виникати, коли параметр `hostname-override` не передається до [kube-proxy](/docs/reference/command-line-tools-reference/kube-proxy/). Щоб її розвʼязати, користувачам потрібно передати kube-proxy імʼя хоста так:

   ```powershell
   C:\k\kube-proxy.exe --hostname-override=$(hostname)
   ```

1. Мій вузол Windows не може отримати доступ до моїх Service за IP-адресою Service

   Це відоме обмеження мережевого стека Windows. Однак Podʼи Windows можуть звертатися до IP-адреси Service.

1. Під час запуску kubelet не знайдено мережевого адаптера

   Мережевому стеку Windows потрібен віртуальний адаптер, щоб мережа Kubernetes працювала. Якщо наведені нижче команди не повертають результатів (в оболонці адміністратора), то створення віртуальної мережі — необхідної передумови для роботи kubelet — не вдалося:

   ```powershell
   Get-HnsNetwork | ? Name -ieq "cbr0"
   Get-NetAdapter | ? Name -Like "vEthernet (Ethernet*"
   ```

   Часто варто змінити параметр [InterfaceName](https://github.com/microsoft/SDN/blob/master/Kubernetes/flannel/start.ps1#L7) скрипту `start.ps1`, якщо мережевий адаптер хоста називається не "Ethernet". Інакше перегляньте вивід скрипту `start-kubelet.ps1`, щоб зʼясувати, чи були помилки під час створення віртуальної мережі.

1. DNS-перетворення не працює належним чином

   Перевірте обмеження DNS для Windows у цьому [розділі](/docs/concepts/services-networking/dns-pod-service/#dns-windows).

1. `kubectl port-forward` завершується з помилкою "unable to do port forwarding: wincat not found"

   Це реалізовано в Kubernetes 1.15 через додавання `wincat.exe` до інфраструктурного контейнера pause `mcr.microsoft.com/oss/kubernetes/pause:3.6`. Обовʼязково використовуйте підтримувану версію Kubernetes. Якщо ви хочете зібрати власний інфраструктурний контейнер pause, обовʼязково додайте до нього [wincat](https://github.com/kubernetes/kubernetes/tree/master/build/pause/windows/wincat).

1. Встановлення Kubernetes завершується невдачею, бо мій вузол Windows Server розташований за проксі

   Якщо ви перебуваєте за проксі, потрібно визначити такі змінні середовища PowerShell:

   ```PowerShell
   [Environment]::SetEnvironmentVariable("HTTP_PROXY", "http://proxy.example.com:80/", [EnvironmentVariableTarget]::Machine)
   [Environment]::SetEnvironmentVariable("HTTPS_PROXY", "http://proxy.example.com:443/", [EnvironmentVariableTarget]::Machine)
   ```

### Усунення несправностей Flannel {#flannel-troubleshooting}

1. З Flannel мої вузли мають проблеми після повторного приєднання до кластера

   Щоразу, коли раніше видалений вузол знову приєднується до кластера, flannelD намагається призначити вузлу нову підмережу Podʼів. Користувачам слід видалити старі файли конфігурації підмережі Podʼів за такими шляхами:

   ```powershell
   Remove-Item C:\k\SourceVip.json
   Remove-Item C:\k\SourceVipRequest.json
   ```

1. Flanneld зависає на "Waiting for the Network to be created"

   Є чимало повідомлень про цю [проблему](https://github.com/coreos/flannel/issues/1066); найімовірніше, це проблема синхронізації в момент, коли встановлюється IP-адреса керування мережі flannel. Як обхідний шлях, перезапустіть `start.ps1` або запустіть його вручну так:

   ```powershell
   [Environment]::SetEnvironmentVariable("NODE_NAME", "<Windows_Worker_Hostname>")
   C:\flannel\flanneld.exe --kubeconfig-file=c:\k\config --iface=<Windows_Worker_Node_IP> --ip-masq=1 --kube-subnet-mgr=1
   ```

1. Мої Podʼи Windows не можуть запуститися через відсутність `/run/flannel/subnet.env`

   Це означає, що Flannel не запустився правильно. Можна спробувати перезапустити `flanneld.exe` або вручну скопіювати файли з `/run/flannel/subnet.env` на майстрі Kubernetes до `C:\run\flannel\subnet.env` на робочому вузлі Windows і змінити рядок `FLANNEL_SUBNET` на інше значення. Наприклад, якщо потрібна підмережа вузла 10.244.4.1/24:

   ```env
   FLANNEL_NETWORK=10.244.0.0/16
   FLANNEL_SUBNET=10.244.4.1/24
   FLANNEL_MTU=1500
   FLANNEL_IPMASQ=true
   ```

### Подальше дослідження {#further-investigation}

Якщо ці кроки не розвʼязали вашої проблеми, допомогу із запуском контейнерів Windows на вузлах Windows у Kubernetes можна отримати тут:

* Тема [Windows Server Container](https://stackoverflow.com/questions/tagged/windows-server-container) на StackOverflow
* Офіційний форум Kubernetes [discuss.kubernetes.io](https://discuss.kubernetes.io/)
* Slack Kubernetes, [канал #SIG-Windows](https://kubernetes.slack.com/messages/sig-windows)
