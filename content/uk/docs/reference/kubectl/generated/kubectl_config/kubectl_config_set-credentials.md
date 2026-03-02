---
title: kubectl config set-credentials
content_type: tool-reference
weight: 30
auto_generated: false
---

## {{% heading "synopsis" %}}

Задайте запис user у kubeconfig.

Якщо вказати імʼя, яке вже існує, нові поля буде обʼєднано з наявними значеннями.

Прапорці клієнтського сертифіката:
: --client-certificate=certfile --client-key=keyfile

Прапорці токенів на предʼявника:
: --token=bearer_token

Базові прапорці авторизації:
: --username=базовий_користувач --password=базовий_пароль

Токен на предʼявника та базова авторизація є взаємозаперечними.

```shell
kubectl config set-credentials NAME [--client-certificate=path/to/certfile] [--client-key=path/to/keyfile] [--token=bearer_token] [--username=basic_user] [--password=basic_password] [--auth-provider=provider_name] [--auth-provider-arg=key=value] [--exec-command=exec_command] [--exec-api-version=exec_api_version] [--exec-arg=arg] [--exec-env=key=value]
```

## {{% heading "examples" %}}

```shell
# Встановити тільки поле "client-key" для запису "cluster-admin"
# без змін інших значень
kubectl config set-credentials cluster-admin --client-key=~/.kube/admin.key

# Встановити базову автентифікацію для запису "cluster-admin"
kubectl config set-credentials cluster-admin --username=admin --password=uXFGweU9l35qcif

# Вбудувати дані сертифіката клієнта для запису "cluster-admin"
kubectl config set-credentials cluster-admin --client-certificate=~/.kube/admin.crt --embed-certs=true

# Увімкнути провайдера автентифікації Google Compute Platform для запису "cluster-admin"
kubectl config set-credentials cluster-admin --auth-provider=gcp

# Увімкнути провайдера автентифікації OpenID Connect для запису "cluster-admin" з додатковими аргументами
kubectl config set-credentials cluster-admin --auth-provider=oidc --auth-provider-arg=client-id=foo --auth-provider-arg=client-secret=bar

# Видалити значення конфігурації "client-secret" для провайдера автентифікації OpenID Connect для запису "cluster-admin"
kubectl config set-credentials cluster-admin --auth-provider=oidc --auth-provider-arg=client-secret-

# Увімкнути новий втулок автентифікації exec для запису "cluster-admin"
kubectl config set-credentials cluster-admin --exec-command=/path/to/the/executable --exec-api-version=client.authentication.k8s.io/v1beta1

# Увімкнути новий втулок автентифікації exec для запису "cluster-admin" з інтерактивним режимом
kubectl config set-credentials cluster-admin --exec-command=/path/to/the/executable --exec-api-version=client.authentication.k8s.io/v1beta1 --exec-interactive-mode=Never

# Визначити нові аргументи для втулка автентифікації exec для запису "cluster-admin"
kubectl config set-credentials cluster-admin --exec-arg=arg1 --exec-arg=arg2

# Створити або оновити змінні середовища для втулка автентифікації exec для запису "cluster-admin"
kubectl config set-credentials cluster-admin --exec-env=key1=val1 --exec-env=key2=val2

# Видалити змінні середовища для втулка автентифікації exec для запису "cluster-admin"
kubectl config set-credentials cluster-admin --exec-env=var-to-remove-
```

## {{% heading "options" %}}

<table style="width: 100%; table-layout: fixed;">
    <colgroup>
        <col span="1" style="width: 10px;" />
        <col span="1" />
    </colgroup>
    <tbody>
        <tr>
            <td colspan="2">--auth-provider string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Провайдер авторизації/автентифікації для запису користувача у kubeconfig</p></td>
        </tr>
        <tr>
            <td colspan="2">--auth-provider-arg strings</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>аргументи 'key=value' для провайдера авторизації/автентифікації</p></td>
        </tr>
        <tr>
            <td colspan="2">--client-certificate string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до файлу клієнтського сертифіката для запису користувача у kubeconfig</p></td>
        </tr>
        <tr>
            <td colspan="2">--client-key string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до файлу ключа клієнта для запису користувача у kubeconfig</p></td>
        </tr>
        <tr>
            <td colspan="2">--embed-certs tristate[=true]</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Додати клієнтський сертифікат/ключ для входу користувача у kubeconfig</p></td>
        </tr>
        <tr>
            <td colspan="2">--exec-api-version string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Версія API втулка exec credential для запису користувача у kubeconfig</p></td>
        </tr>
        <tr>
            <td colspan="2">--exec-arg strings</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Нові аргументи команди втулка exec credential для запису користувача у kubeconfig</p></td>
        </tr>
        <tr>
            <td colspan="2">--exec-command string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Команди втулка exec credential для запису користувача у kubeconfig</p></td>
        </tr>
        <tr>
            <td colspan="2">--exec-env strings</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>'key=value' значеня зміних оточення для втулка exec credential</p></td>
        </tr>
        <tr>
            <td colspan="2">--exec-interactive-mode string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Режим InteractiveMode втулка exec credentials для запису користувача у kubeconfig</p></td>
        </tr>
        <tr>
            <td colspan="2">--exec-provide-cluster-info tristate[=true]</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>ProvideClusterInfo втулка exec credentials для запису користувача у kubeconfig</p></td>
        </tr>
        <tr>
            <td colspan="2">-h, --help</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Довідка set-credentials</p></td>
        </tr>
        <tr>
            <td colspan="2">--password string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Пароль для запису користувача у kubeconfig</p></td>
        </tr>
        <tr>
            <td colspan="2">--token string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Токен для запису користувача у kubeconfig</p></td>
        </tr>
        <tr>
            <td colspan="2">--username string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Імʼя користувачадля запису користувача у kubeconfig</p></td>
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
            <td colspan="2">--user string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Імʼя користувача kubeconfig, яке слід використовувати</p></td>
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

* [kubectl config](../) — Змінити файли kubeconfig
