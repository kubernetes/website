---
title: Поради щодо налагодження Windows
content_type: task
---

<!-- overview -->

<!-- body -->

## Розвʼязання проблем на рівні вузла {#troubleshooting-node}

1. Мої Podʼи застрягли на "Container Creating" або постійно перезавантажуються.

   Переконайтеся, що ваш образ pause відповідає версії вашої операційної системи Windows. Див. [Контейнер pause](/docs/concepts/windows/intro/#pause-container) для перегляду останнього/рекомендованого образу pause та/або отримання додаткової інформації.

   {{< note >}}
   Якщо ви використовуєте containerd як оточення для виконання контейнерів, образ pause вказується в    полі `plugins.plugins.cri.sandbox_image` файлу конфігурації config.toml.
   {{< /note >}}

2. Мої Podʼи показують статус як `ErrImgPull` або `ImagePullBackOff`.

   Переконайтеся, що ваш Pod планується на [сумісний](https://docs.microsoft.com/virtualization/windowscontainers/deploy-containers/version-compatibility) вузол Windows.

   Додаткову інформацію про те, як вказати сумісний вузол для вашого Podʼа, можна знайти в
   [цьому посібнику](/docs/concepts/windows/user-guide/#ensuring-os-specific-workloads-land-on-the-appropriate-container-host).

## Розвʼязання проблем мережі {#troubleshooting-network}

1. Мої Podʼи Windows не мають підключення до мережі.

   Якщо ви використовуєте віртуальні машини, переконайтеся, що MAC spoofing **увімкнено** на всіх адаптерах мережі віртуальних машин.

2. Мої Podʼи Windows не можуть пінгувати зовнішні ресурси.

   Podʼи Windows не мають правил для вихідного трафіку, програмованих для протоколу ICMP. Однак, підтримується TCP/UDP. При спробі продемонструвати підключення до ресурсів за межами кластера, замініть `ping <IP>` відповідними командами `curl <IP>`.

   Якщо у вас все ще виникають проблеми, ймовірно, ваша мережева конфігурація в
   [cni.conf](https://github.com/Microsoft/SDN/blob/master/Kubernetes/flannel/l2bridge/cni/config/cni.conf) потребує додаткової уваги. Ви завжди можете редагувати цей статичний файл. Оновлення конфігурації буде застосовано до будь-яких нових ресурсів Kubernetes.

   Одним із вимог мережі Kubernetes (див. [Модель Kubernetes](/docs/concepts/cluster-administration/networking/)) є внутрішнє звʼязування кластера без NAT всередині. Щоб відповідати цій вимозі, існує [ExceptionList](https://github.com/Microsoft/SDN/blob/master/Kubernetes/flannel/l2bridge/cni/config/cni.conf#L20) для всього трафіку, де ви не хочете, щоб відбувалось використання NAT назовні. Однак, це також означає, що вам потрібно виключити зовнішню IP-адресу, яку ви намагаєтесь запитати з `ExceptionList`. Тільки тоді трафік, який походить з вашого Podʼа Windows, буде коректно SNAT'ed для отримання відповіді зі світу. З цього погляду ваш `ExceptionList` у `cni.conf` повинен виглядати так:

   ```conf
   "ExceptionList": [
                   "10.244.0.0/16",  # Підмережа кластера
                   "10.96.0.0/12",   # Підмережа служби
                   "10.127.130.0/24" # Управління (хост) підмережа
               ]
   ```

3. Мій вузол Windows не може отримати доступ до служб типу `NodePort`.

   Доступ до локального NodePort з самого вузла не вдається. Це відоме обмеження. Доступ до NodePort працює з інших вузлів або зовнішніх клієнтів.

4. vNICs та HNS точки доступу контейнерів видаляються.

   Цю проблему може викликати відмова в передачі параметра `hostname-override` до [kube-proxy](/docs/reference/command-line-tools-reference/kube-proxy/). Щоб вирішити це, користувачі повинні передавати імʼя хосту kube-proxy наступним чином:

   ```powershell
   C:\k\kube-proxy.exe --hostname-override=$(hostname)
   ```

5. Мій вузол Windows не може отримати доступ до моїх Service за допомогою IP-адреси Service

   Це відоме обмеження стека мережі на Windows. Однак, Podʼи Windows можуть отримувати доступ до IP-адреси Service.

6. Під час запуску kubelet не знайдено мережевого адаптера.

   Для правильної роботи мережі Windows потрібен віртуальний адаптер. Якщо наступні команди не повертають результатів (в оболонці адміністратора), створення віртуальної мережі, необхідна передумова для роботи kubelet, не вдалося:

   ```powershell
   Get-HnsNetwork | ? Name -ieq "cbr0"
   Get-NetAdapter | ? Name -Like "vEthernet (Ethernet*"
   ```

   Часто варто змінити параметр [InterfaceName](https://github.com/microsoft/SDN/blob/master/Kubernetes/flannel/start.ps1#L7) у скрипті `start.ps1`, в разі, якщо мережевий адаптер хосту не є "Ethernet". В іншому випадку зверніться до виводу скрипту `start-kubelet.ps1`, щоб побачити, чи є помилки під час створення віртуальної мережі.

7. DNS-перетворення не працює належним чином.

   Перевірте обмеження DNS для Windows у цьому [розділі](/docs/concepts/services-networking/dns-pod-service/#dns-windows).

8. `kubectl port-forward` видає помилку "unable to do port forwarding: wincat not found"

   Це було реалізовано в Kubernetes 1.15, включивши `wincat.exe` в інфраструктурний контейнер pause `mcr.microsoft.com/oss/kubernetes/pause:3.6`. Будьте впевнені, що використовуєте підтримувану версію Kubernetes. Якщо ви хочете побудувати власний контейнер інфраструктури pause, обовʼязково додайте [wincat](https://github.com/kubernetes/kubernetes/tree/master/build/pause/windows/wincat).

9. Моє встановлення Kubernetes падає, тому що мій вузол сервера Windows знаходиться за проксі

   Якщо ви перебуваєте за проксі, наступні змінні середовища PowerShell повинні бути визначені:

   ```PowerShell
   [Environment]::SetEnvironmentVariable("HTTP_PROXY", "http://proxy.example.com:80/", [EnvironmentVariableTarget]::Machine)
   [Environment]::SetEnvironmentVariable("HTTPS_PROXY", "http://proxy.example.com:443/", [EnvironmentVariableTarget]::Machine)
   ```

### Розвʼязання проблем Flannel {#flannel-troubleshooting}

1. З Flannel мої вузли мають проблеми після повторного приєднання до кластера.

   Кожного разу, коли раніше видалений вузол повторно приєднується до кластера, flannelD намагається призначити нову підмережу Podʼа вузлу. Користувачі повинні видалити старі файли конфігурації підмережі Podʼа за наступними шляхами:

   ```powershell
   Remove-Item C:\k\SourceVip.json
   Remove-Item C:\k\SourceVipRequest.json
   ```

1. Flanneld застрягає в "Waiting for the Network to be created"

   Є численні звіти про цю [проблему](https://github.com/coreos/flannel/issues/1066); ймовірно, це проблема з часом встановлення управлінської IP-адреси мережі flannel. Обхідним рішенням є перезапуск `start.ps1` або перезапуск його вручну так:

   ```powershell
   [Environment]::SetEnvironmentVariable("NODE_NAME", "<Windows_Worker_Hostname>")
   C:\flannel\flanneld.exe --kubeconfig-file=c:\k\config --iface=<Windows_Worker_Node_IP> --ip-masq=1 --kube-subnet-mgr=1
   ```

1. Мої Podʼи Windows не можуть запуститися через відсутність `/run/flannel/subnet.env`.

   Це вказує на те, що Flannel не запустився правильно. Ви можете спробувати перезапустити `flanneld.exe` або вручну скопіювати файли з `/run/flannel/subnet.env` на майстрі Kubernetes в `C:\run\flannel\subnet.env` на робочий вузол Windows та змінити рядок `FLANNEL_SUBNET` на інший номер. Наприклад, якщо підмережа вузла 10.244.4.1/24 бажана:

   ```env
   FLANNEL_NETWORK=10.244.0.0/16
   FLANNEL_SUBNET=10.244.4.1/24
   FLANNEL_MTU=1500
   FLANNEL_IPMASQ=true
   ```

### Подальші дослідження {#further-investigation}

Якщо ці кроки не розвʼязують вашої проблеми, ви можете отримати допомогу у запуску контейнерів Windows на вузлах Windows у Kubernetes у наступних ресурсах:

* StackOverflow [Тема Windows Server Container](https://stackoverflow.com/questions/tagged/windows-server-container)
* Офіційний форум Kubernetes [discuss.kubernetes.io](https://discuss.kubernetes.io/)
* Slack Kubernetes [#SIG-Windows Channel](https://kubernetes.slack.com/messages/sig-windows)
