---
title: kubectl logs
content_type: tool-reference
weight: 30
auto_generated: false
no_list: true
---

## {{% heading "synopsis" %}}

Вивести логи для контейнера у Podʼі або вказаного ресурсу. Якщо в pod є лише один контейнер, назва контейнера не є обовʼязковою.

```shell
kubectl logs [-f] [-p] (POD | TYPE/NAME) [-c CONTAINER]
```

## {{% heading "examples" %}}

```shell
# Вивести знімок логів з Podʼа nginx з одним контейнером
kubectl logs nginx

# Вивести знімки логів з пакета nginx, додаючи до кожного рядка імʼя вихідного пакета та контейнера.
kubectl logs nginx --prefix

# Вивести знімки логів з pod nginx, обмеживши виведення до 500 байт
kubectl logs nginx --limit-bytes=500

# Вивести знімки логів з pod nginx, зачекавши до 20 секунд на їх запуск.
kubectl logs nginx --pod-running-timeout=20s

# Вивести знімок логів з Podʼа nginx з кількома контейнерами
kubectl logs nginx --all-containers=true

# Вивести знімок логів з всіх Podʼів в deployment nginx
kubectl logs deployment/nginx --all-pods=true

# Вивести знімок логів з усіх контейнерів у Podʼах, визначених міткою app=nginx
kubectl logs -l app=nginx --all-containers=true

# Вивести знімок логів з всіх Podʼів з міткою app=nginx, обмживши запити логів 10 Podʼами
kubectl logs -l app=nginx --max-log-requests=10

# Вивести знімок логів з попереднього завершеного контейнера ruby з Podʼа web-1
kubectl logs -p -c ruby web-1

# Почати трансляцію логів з Podʼа nginx, продовжувати навіть за наявності помилок
kubectl logs nginx -f --ignore-errors=true

# Почати трансляцію логів контейнера ruby у Podʼі web-1
kubectl logs -f -c ruby web-1

# Почати трансляцію логів з усіх контейнерів у Podʼах, визначених міткою app=nginx
kubectl logs -f -l app=nginx --all-containers=true

# Показати лише останні 20 рядків виводу в Podʼі nginx
kubectl logs --tail=20 nginx

# Показати всі логи з Podʼа nginx, записані за останню годину
kubectl logs --since=1h nginx

# Показати всі логи з позначками часу від Podʼа nginx, починаючи з 30 серпня 2024 року, о 06:00:00 UTC
kubectl logs nginx --since-time=2024-08-30T06:00:00Z --timestamps=true


# Показати логи з kubelet з простроченим сертифікатом сервера
kubectl logs --insecure-skip-tls-verify-backend nginx

# Вивести знімок логів з першого контейнера завдання з назвою hello
kubectl logs job/hello

# Вивести знімок логів з контейнера nginx-1 у deployment з назвою nginx
kubectl logs deployment/nginx -c nginx-1
```

## {{% heading "options" %}}

<table style="width: 100%; table-layout: fixed;">
    <colgroup>
        <col span="1" style="width: 10px;" />
        <col span="1" />
    </colgroup>
    <tbody>
        <tr>
            <td colspan="2">--all-containers</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Отримайте логи всіх контейнерів у pod(ах).</p></td>
        </tr>
        <tr>
            <td colspan="2">--all-pods</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Отримати логи з усіх Pod(ів). Встановлює префікс у true.</p></td>
        </tr>
        <tr>
            <td colspan="2">-c, --container string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Вивести логи цього контейнера</p></td>
        </tr>
        <tr>
            <td colspan="2">-f, --follow</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Вкажіть, чи потрібно транслювати логи.</p></td>
        </tr>
        <tr>
            <td colspan="2">-h, --help</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Довідка logs</p></td>
        </tr>
        <tr>
            <td colspan="2">--ignore-errors</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо ви переглядаєте / стежите за логами pod, дозвольте будь-яким помилкам, що трапляються, бути не фатальними</p></td>
        </tr>
        <tr>
            <td colspan="2">--insecure-skip-tls-verify-backend</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Пропустити перевірку ідентичності kubelet, з якого запитуються логи.  Теоретично, зловмисник може повернути недійсний вміст логу. Можливо, ви захочете використати цей параметр, якщо термін дії сертифікатів, що обслуговують ваш kubelet, закінчився.</p></td>
        </tr>
        <tr>
            <td colspan="2">--limit-bytes int</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Максимальна кількість байт логів для виводу. Стандартно без обмежень.</p></td>
        </tr>
        <tr>
            <td colspan="2">--max-log-requests int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 5</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Вкажіть максимальну кількість паралельних логів, які слід відстежувати при використанні селектора. Стандартно встановлено значення 5.</p></td>
        </tr>
        <tr>
            <td colspan="2">--pod-running-timeout duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 20s</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Тривалість часу (наприклад, 5s, 2m або 3h, більше нуля) для очікування, поки не запрацює хоча б один Pod</p></td>
        </tr>
        <tr>
            <td colspan="2">--prefix</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>До початку кожного рядка логу додайте джерело логу (імʼя pod та імʼя контейнера)</p></td>
        </tr>
        <tr>
            <td colspan="2">-p, --previous</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо true, вивести логи для попереднього екземпляра контейнера в pod, якщо він існує.</p></td>
        </tr>
        <tr>
            <td colspan="2">-l, --selector string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Селектор (запит на мітки) для фільтрації, що підтримує '=', '==', '!=', 'in', 'notin' (наприклад, -l key1=value1,key2=value2,key3 in (value3)). Обʼєкти, щоб мати збіг, повинні задовольняти усім зазначеним обмеженням міток.</p></td>
        </tr>
        <tr>
            <td colspan="2">--since duration</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Виводити лише ті логи, що є новішими за відносну тривалість, наприклад, 5s, 2m або 3h. Стандартно для всіх логів. Можна використовувати лише один з параметрів since-time / since.</p></td>
        </tr>
        <tr>
            <td colspan="2">--since-time string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Виводити логи лише після певної дати (RFC3339). Стандартно для всіх логів. Можна використовувати лише один з параметрів since-time / since.</p></td>
        </tr>
        <tr>
            <td colspan="2">--tail int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: -1</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Рядки нещодавнього файлу логу для показу. Стандартно дорівнює -1 без селектора, показуючи всі рядки логу, інакше 10, якщо селектор вказано.</p></td>
        </tr>
        <tr>
            <td colspan="2">--timestamps</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Додайте мітки часу до кожного рядка у виводі логу</p></td>
        </tr>
    </tbody>
</table>

## {{% heading "parentoptions" %}}

<table style="width: 100%; table-layout: fixed;">
    <colgroup>
        <col span="1" style="width: 10px;" />
        <col span="1" />
    </colgroup>
    <tbody>
        <tr>
            <td colspan="2">--as string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Імʼя користувача, яке використовується для виконання операції. Користувач може бути звичайним користувачем або службовим обліковим записом в просторі імен.</p></td>
        </tr>
        <tr>
            <td colspan="2">--as-group strings</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Група, яка використовується для операції; цей прапорець можна повторити для вказівки декількох груп.</p></td>
        </tr>
        <tr>
            <td colspan="2">--as-uid string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>UID, який використовується для операції.</p></td>
        </tr>
        <tr>
            <td colspan="2">--as-user-extra strings</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Додаткові параметри користувача, які слід використовувати для операції. Цей прапорець можна повторювати, щоб вказати кілька значень для одного і того ж ключа.</p></td>
        </tr>
        <tr>
            <td colspan="2">--cache-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "$HOME/.kube/cache"</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Типове розташування теки кешу</p></td>
        </tr>
        <tr>
            <td colspan="2">--certificate-authority string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до файлу сертифіката для центра сертифікації</p></td>
        </tr>
        <tr>
            <td colspan="2">--client-certificate string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до файлу клієнтського сертифіката для TLS</p></td>
        </tr>
        <tr>
            <td colspan="2">--client-key string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до файлу ключа клієнта для TLS</p></td>
        </tr>
        <tr>
            <td colspan="2">--cluster string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Назва файлу kubeconfig кластера, який слід використовувати</p></td>
        </tr>
        <tr>
            <td colspan="2">--context string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Назва контексту kubeconfig, який слід використовувати</p></td>
        </tr>
        <tr>
            <td colspan="2">--disable-compression</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо true, відмовляється від стиснення відповіді для всіх запитів до сервера</p></td>
        </tr>
        <tr>
            <td colspan="2">--insecure-skip-tls-verify</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо true, сертифікат сервера не буде перевірятися на дійсність. Це зробить ваші HTTPS-зʼєднання небезпечними</p></td>
        </tr>
        <tr>
            <td colspan="2">--kubeconfig string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до файлу kubeconfig, який слід використовувати для CLI-запитів.</p></td>
        </tr>
        <tr>
            <td colspan="2">--kuberc string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до файлу kuberc, який буде використовуватися для налаштувань. Цю функцію можна вимкнути, експортувавши функцію KUBECTL_KUBERC=false або вимкнувши функцію KUBERC=off.</p></td>
        </tr>
        <tr>
            <td colspan="2">--match-server-version</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Вимагає, щоб версія сервера відповідала версії клієнта</p></td>
        </tr>
        <tr>
            <td colspan="2">-n, --namespace string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо присутній, простір імен для цього CLI-запиту</p></td>
        </tr>
        <tr>
            <td colspan="2">--password string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Пароль для базової автентифікації на API-сервері</p></td>
        </tr>
        <tr>
            <td colspan="2">--profile string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "none"</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Імʼя профілю для захоплення. Одне із (none|cpu|heap|goroutine|threadcreate|block|mutex|trace)</p></td>
        </tr>
        <tr>
            <td colspan="2">--profile-output string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "profile.pprof"</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Імʼя файлу, в який записується профіль</p></td>
        </tr>
        <tr>
            <td colspan="2">--request-timeout string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "0"</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Час очікування перед відмовою у виконанні окремого запиту до сервера. Ненульові значення повинні містити відповідну одиницю часу (наприклад, 1s, 2m, 3h). Значення нуль означає відсутність тайм-ауту запитів.</p></td>
        </tr>
        <tr>
            <td colspan="2">-s, --server string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Адреса та порт сервера API Kubernetes</p></td>
        </tr>
        <tr>
            <td colspan="2">--storage-driver-buffer-duration duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 1m0s</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Записи в драйвері зберігання будуть буферизовані на цей час і збережені в бекендах без памʼяті як одна транзакція</p></td>
        </tr>
        <tr>
            <td colspan="2">--storage-driver-db string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "cadvisor"</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Назва бази даних</p></td>
        </tr>
        <tr>
            <td colspan="2">--storage-driver-host string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "localhost:8086"</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Хост:порт бази даних</p></td>
        </tr>
        <tr>
            <td colspan="2">--storage-driver-password string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "root"</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Пароль бази даних</p></td>
        </tr>
        <tr>
            <td colspan="2">--storage-driver-secure</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>використовувати захищене зʼєднання з базою даних</p></td>
        </tr>
        <tr>
            <td colspan="2">--storage-driver-table string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "stats"</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Назва таблиці</p></td>
        </tr>
        <tr>
            <td colspan="2">--storage-driver-user string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "root"</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Імʼя користувача бази даних</p></td>
        </tr>
        <tr>
            <td colspan="2">--tls-server-name string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Імʼя сервера, яке використовується для перевірки дійсності сертифіката сервера. Якщо воно не надане, використовується імʼя хоста, яке використовується для звʼязку з сервером</p></td>
        </tr>
        <tr>
            <td colspan="2">--token string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Токен на предʼявника для автентифікації на API-сервері</p></td>
        </tr>
        <tr>
            <td colspan="2">--user string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Імʼя користувача kubeconfig, яке слід використовувати</p></td>
        </tr>
        <tr>
            <td colspan="2">--username string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Імʼя користувача для базової автентифікації на API-сервері</p></td>
        </tr>
        <tr>
            <td colspan="2">--version version[=true]</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>--version, --version=raw виводить інформацію про версію та завершує роботу; --version=vX.Y.Z... задає відповідну версію</p></td>
        </tr>
        <tr>
            <td colspan="2">--warnings-as-errors</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Трактувати попередження, отримані від сервера, як помилки і виходити з ненульовим кодом виходу</p></td>
        </tr>
    </tbody>
</table>

## {{% heading "seealso" %}}

* [kubectl](../kubectl/) — kubectl керує менеджером кластерів Kubernetes
