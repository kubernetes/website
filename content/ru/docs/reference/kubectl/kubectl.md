---
title: kubectl
content_type: tool-reference
weight: 28
---

## {{% heading "synopsis" %}}



kubectl управляет кластерами Kubernetes.

Более подробная информация по ссылке: https://kubernetes.io/ru/docs/reference/kubectl/overview/

```
kubectl [flags]
```



## {{% heading "options" %}}


<table style="width: 100%; table-layout: fixed;">
<colgroup>
<col span="1" style="width: 10px;" />
<col span="1" />
</colgroup>
<tbody>

<tr>
<td colspan="2">--add-dir-header</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Если true, добавляет директорию файла в заголовок</td>
</tr>

<tr>
<td colspan="2">--alsologtostderr</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Логировать в стандартный поток ошибок, а также в файлы</td>
</tr>

<tr>
<td colspan="2">--application-metrics-count-limit int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;По умолчанию: 100</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Максимальное количество сохраняемых метрик приложения (на каждый контейнер)</td>
</tr>

<tr>
<td colspan="2">--as string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Имя пользователя, от которого будет выполняться операция</td>
</tr>

<tr>
<td colspan="2">--as-group stringArray</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Группа, от которой будет выполняться операция, этот флаг можно использовать неоднократно, чтобы указать несколько групп.</td>
</tr>

<tr>
<td colspan="2">--azure-container-registry-config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Путь к файлу, который содержит информацию с конфигурацией реестра контейнера Azure.</td>
</tr>

<tr>
<td colspan="2">--boot-id-file string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;По умолчанию: "/proc/sys/kernel/random/boot_id"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Разделенный запятыми список файлов для проверки boot-id. Используйте первый существующий.</td>
</tr>

<tr>
<td colspan="2">--cache-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;По умолчанию: "$HOME/.kube/http-cache"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Директория HTTP-кеша по умолчанию</td>
</tr>

<tr>
<td colspan="2">--certificate-authority string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Путь к файлу сертификата для центра сертификации</td>
</tr>

<tr>
<td colspan="2">--client-certificate string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Путь к файлу клиентского сертификата для TLS</td>
</tr>

<tr>
<td colspan="2">--client-key string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Путь к файлу клиентского ключа для TLS</td>
</tr>

<tr>
<td colspan="2">--cloud-provider-gce-l7lb-src-cidrs cidrs&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;По умолчанию: 130.211.0.0/22,35.191.0.0/16</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Открыть CIDR в брандмауэре GCE для прокси трафика L7 LB и проверки работоспособности</td>
</tr>

<tr>
<td colspan="2">--cloud-provider-gce-lb-src-cidrs cidrs&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;По умолчанию: 130.211.0.0/22,209.85.152.0/22,209.85.204.0/22,35.191.0.0/16</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Открыть CIDR в брандмауэре GCE для прокси трафика L4 LB и проверки работоспособности</td>
</tr>

<tr>
<td colspan="2">--cluster string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Имя используемого кластера kubeconfig</td>
</tr>

<tr>
<td colspan="2">--container-hints string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;По умолчанию: "/etc/cadvisor/container_hints.json"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Путь к файлу подсказок контейнера</td>
</tr>

<tr>
<td colspan="2">--containerd string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;По умолчанию: "/run/containerd/containerd.sock"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Конечная точка containerd</td>
</tr>

<tr>
<td colspan="2">--containerd-namespace string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;По умолчанию: "k8s.io"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Пространство имени containerd</td>
</tr>

<tr>
<td colspan="2">--context string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Имя контекста kubeconfig</td>
</tr>

<tr>
<td colspan="2">--default-not-ready-toleration-seconds int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;По умолчанию: 300</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Указывает tolerationSeconds для допущения notReady:NoExecute, которое по умолчанию добавляется к каждому поду, у которого не установлено такое допущение.</td>
</tr>

<tr>
<td colspan="2">--default-unreachable-toleration-seconds int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;По умолчанию: 300</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Указывает tolerationSeconds для допущения unreachable:NoExecute, которое по умолчанию добавляется к каждому поду, у которого не установлено такое допущение.</td>
</tr>

<tr>
<td colspan="2">--disable-root-cgroup-stats</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Отключить сбор статистики корневой группы (Cgroup)</td>
</tr>

<tr>
<td colspan="2">--docker string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;По умолчанию: "unix:///var/run/docker.sock"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">docker endpoint</td>
</tr>

<tr>
<td colspan="2">--docker-env-metadata-whitelist string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Список ключей переменных окружения, разделенный запятыми, которые необходимо собрать для Docker-контейнеров</td>
</tr>

<tr>
<td colspan="2">--docker-only</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">В дополнение к корневой статистике уведомлять только о Docker-контейнерах</td>
</tr>

<tr>
<td colspan="2">--docker-root string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;По умолчанию: "/var/lib/docker"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">УСТАРЕЛО: корень docker считывается из информации docker (запасной вариант, по умолчанию: /var/lib/docker)</td>
</tr>

<tr>
<td colspan="2">--docker-tls</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Использовать TLS для подключения к Docker</td>
</tr>

<tr>
<td colspan="2">--docker-tls-ca string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;По умолчанию: "ca.pem"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Путь к доверенному CA</td>
</tr>

<tr>
<td colspan="2">--docker-tls-cert string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;По умолчанию: "cert.pem"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Путь к клиентскому сертификату</td>
</tr>

<tr>
<td colspan="2">--docker-tls-key string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;По умолчанию: "key.pem"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Путь к приватному ключу</td>
</tr>

<tr>
<td colspan="2">--enable-load-reader</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Включить считыватель нагрузки процессора</td>
</tr>

<tr>
<td colspan="2">--event-storage-age-limit string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;По умолчанию: "default=0"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Максимальный период времени для хранения события (по каждому типу). Значение флага — список из ключей и значений, разделенные запятыми, где ключи — это типы событий (например: создание, oom) либо "default", а значение — длительность. По умолчанию флаг применяется ко всем неуказанным типам событий</td>
</tr>

<tr>
<td colspan="2">--event-storage-event-limit string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;По умолчанию: "default=0"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Максимальное количество событий для хранения (по каждому типу). Значение флага — список из ключей и значений, разделенные запятыми, где ключи — это типы событий (например: создание, oom) либо "default", а значение — целое число. По умолчанию флаг применяется ко всем неуказанным типам событий</td>
</tr>

<tr>
<td colspan="2">--global-housekeeping-interval duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;По умолчанию: 1m0s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Интервал между глобальными служебными операциями (housekeepings)</td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Получить справочную информацию по команде kubectl</td>
</tr>

<tr>
<td colspan="2">--housekeeping-interval duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;По умолчанию: 10s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Интервал между служебными операциями (housekeepings) контейнера</td>
</tr>

<tr>
<td colspan="2">--insecure-skip-tls-verify</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Если true, значит сертификат сервера не будет проверяться на достоверность. Это сделает подключения через HTTPS небезопасными.</td>
</tr>

<tr>
<td colspan="2">--kubeconfig string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Путь к файлу kubeconfig для использования в CLI-запросах.</td>
</tr>

<tr>
<td colspan="2">--log-backtrace-at traceLocation&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;По умолчанию: :0</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">При логировании указанной строки (file:N), сгенерировать трассировку стека</td>
</tr>

<tr>
<td colspan="2">--log-cadvisor-usage</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Записывать ли в журнал использование контейнера cAdvisor</td>
</tr>

<tr>
<td colspan="2">--log-dir string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Если указан, хранить лог-файлы в этой директории.</td>
</tr>

<tr>
<td colspan="2">--log-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Если указан, использовать этот лог-файл</td>
</tr>

<tr>
<td colspan="2">--log-file-max-size uint&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;По умолчанию: 1800</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Установить максимальный размер файла лог-файла (в Мб). Если значение равно 0, максимальный размер файла не ограничен.</td>
</tr>

<tr>
<td colspan="2">--log-flush-frequency duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;По умолчанию: 5s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Максимальное количество секунд между очисткой лог-файлов</td>
</tr>

<tr>
<td colspan="2">--logtostderr&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;По умолчанию: true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Вывод логов в стандартный поток ошибок вместо сохранения их в файлы</td>
</tr>

<tr>
<td colspan="2">--machine-id-file string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;По умолчанию: "/etc/machine-id,/var/lib/dbus/machine-id"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Список файлов, разделенных запятыми, для проверки machine-id. Используйте первый существующий.</td>
</tr>

<tr>
<td colspan="2">--match-server-version</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Убедиться, что версия сервера соответствует версии клиента</td>
</tr>

<tr>
<td colspan="2">-n, --namespace string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Указать область пространства имен для данного запроса CLI</td>
</tr>

<tr>
<td colspan="2">--password string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Пароль для базовой аутентификации на API-сервере</td>
</tr>

<tr>
<td colspan="2">--profile string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;По умолчанию: "none"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Имя профиля. Может быть одним из перечисленных значений: none|cpu|heap|goroutine|threadcreate|block|mutex</td>
</tr>

<tr>
<td colspan="2">--profile-output string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;По умолчанию: "profile.pprof"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Имя файла для записи профиля.</td>
</tr>

<tr>
<td colspan="2">--request-timeout string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;По умолчанию: "0"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Время ожидания перед тем, как перестать ожидать ответ от сервера. Значения должны содержать соответствующую единицу времени (например, 1s, 2m, 3h). Нулевое значение означает, что у запросов нет тайм-аута.</td>
</tr>

<tr>
<td colspan="2">-s, --server string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Адрес и порт API-сервера Kubernetes</td>
</tr>

<tr>
<td colspan="2">--skip-headers</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Если true, не отображать заголовки в сообщениях лога.</td>
</tr>

<tr>
<td colspan="2">--skip-log-headers</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Если true, не отображать заголовки при открытии лог-файлов.</td>
</tr>

<tr>
<td colspan="2">--stderrthreshold severity&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;По умолчанию: 2</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Логи указанного уровня серьёзности или выше выводить в поток stderr</td>
</tr>

<tr>
<td colspan="2">--storage-driver-buffer-duration duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;По умолчанию: 1m0s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Буферизировать запись в драйвере хранилища в течение указанного времени, и сохранять в файловом хранилище в виде одной транзакции</td>
</tr>

<tr>
<td colspan="2">--storage-driver-db string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;По умолчанию: "cadvisor"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Имя базы данных</td>
</tr>

<tr>
<td colspan="2">--storage-driver-host string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;По умолчанию: "localhost:8086"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Хост и порт базы данных, записанный в формате host:port</td>
</tr>

<tr>
<td colspan="2">--storage-driver-password string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;По умолчанию: "root"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Пароль к базе данных</td>
</tr>

<tr>
<td colspan="2">--storage-driver-secure</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Использовать безопасное соединение с базой данных</td>
</tr>

<tr>
<td colspan="2">--storage-driver-table string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;По умолчанию: "stats"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Имя таблицы</td>
</tr>

<tr>
<td colspan="2">--storage-driver-user string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;По умолчанию: "root"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Имя пользователя базы данных</td>
</tr>

<tr>
<td colspan="2">--token string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Аутентификационный (bearer) токен для аутентификации на API-сервере</td>
</tr>

<tr>
<td colspan="2">--update-machine-info-interval duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;По умолчанию: 5m0s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Интервал между обновлениями информации о машине.</td>
</tr>

<tr>
<td colspan="2">--user string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Имя пользователя для kubeconfig</td>
</tr>

<tr>
<td colspan="2">--username string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Имя пользователя для базовой аутентификации на API-сервере</td>
</tr>

<tr>
<td colspan="2">-v, --v Level</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Номер уровня серьёзности логирования</td>
</tr>

<tr>
<td colspan="2">--version version[=true]</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Вывод версии команды</td>
</tr>

<tr>
<td colspan="2">--vmodule moduleSpec</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Список, разделённый запятыми, в виде настроек pattern=N для фильтрации лог-файлов</td>
</tr>

</tbody>
</table>





## {{% heading "seealso" %}}


* [kubectl annotate](/docs/reference/generated/kubectl/kubectl-commands#annotate)	- Обновить аннотации ресурса.
* [kubectl api-resources](/docs/reference/generated/kubectl/kubectl-commands#api-resources) - Вывести доступные API-ресурсы на сервере.
* [kubectl api-versions](/docs/reference/generated/kubectl/kubectl-commands#api-versions)	- Вывести доступные API-версии на сервере в виде "group/version".
* [kubectl apply](/docs/reference/generated/kubectl/kubectl-commands#apply)	- Внести изменения в конфигурацию ресурса из файла или потока stdin.
* [kubectl attach](/docs/reference/generated/kubectl/kubectl-commands#attach)	- Присоединиться к запущенному контейнеру.
* [kubectl auth](/docs/reference/generated/kubectl/kubectl-commands#auth)	- Проверить разрешение на выполнение определённых действий.
* [kubectl autoscale](/docs/reference/generated/kubectl/kubectl-commands#autoscale)	- Автоматически масштабировать Deployment, ReplicaSet или ReplicationController.
* [kubectl certificate](/docs/reference/generated/kubectl/kubectl-commands#certificate)	- Изменить сертификаты ресурсов.
* [kubectl cluster-info](/docs/reference/generated/kubectl/kubectl-commands#cluster-info)	- Показать информацию по кластеру.
* [kubectl completion](/docs/reference/generated/kubectl/kubectl-commands#completion)	- Вывод кода автодополнения указанной командной оболочки (bash или zsh).
* [kubectl config](/docs/reference/generated/kubectl/kubectl-commands#config)	- Изменить файлы kubeconfig.
* [kubectl convert](/docs/reference/generated/kubectl/kubectl-commands#convert)	- Конвертировать конфигурационные файлы в различные API-версии.
* [kubectl cordon](/docs/reference/generated/kubectl/kubectl-commands#cordon)	- Отметить узел как неназначаемый.
* [kubectl cp](/docs/reference/generated/kubectl/kubectl-commands#cp)	- Копировать файлы и директории в/из контейнеров.
* [kubectl create](/docs/reference/generated/kubectl/kubectl-commands#create)	- Создать ресурс из файла или потока stdin.
* [kubectl delete](/docs/reference/generated/kubectl/kubectl-commands#delete)	- Удалить ресурсы из файла, потока stdin, либо с помощью селекторов меток, имен, селекторов ресурсов или ресурсов.
* [kubectl describe](/docs/reference/generated/kubectl/kubectl-commands#describe)	- Показать подробную информацию о конкретном ресурсе или группе ресурсов.
* [kubectl diff](/docs/reference/generated/kubectl/kubectl-commands#diff)	- Сравнить действующую версию с новой (применяемой).
* [kubectl drain](/docs/reference/generated/kubectl/kubectl-commands#drain)	- Вытеснить узел для подготовки к эксплуатации.
* [kubectl edit](/docs/reference/generated/kubectl/kubectl-commands#edit)	- Отредактировать ресурс на сервере.
* [kubectl exec](/docs/reference/generated/kubectl/kubectl-commands#exec)	- Выполнить команду в контейнере.
* [kubectl explain](/docs/reference/generated/kubectl/kubectl-commands#explain)	- Получить документацию ресурсов.
* [kubectl expose](/docs/reference/generated/kubectl/kubectl-commands#expose)	- Создать новый сервис Kubernetes из контроллера репликации, сервиса, развёртывания или пода.
* [kubectl get](/docs/reference/generated/kubectl/kubectl-commands#get)	- Вывести один или несколько ресурсов.
* [kubectl kustomize](/docs/reference/generated/kubectl/kubectl-commands#kustomize)	- Собрать ресурсы kustomization из директории или URL-адреса.
* [kubectl label](/docs/reference/generated/kubectl/kubectl-commands#label)	- Обновить метки ресурса.
* [kubectl logs](/docs/reference/generated/kubectl/kubectl-commands#logs)	- Вывести логи контейнера в поде.
* [kubectl options](/docs/reference/generated/kubectl/kubectl-commands#options)	- Вывести список флагов, применяемых ко всем командам.
* [kubectl patch](/docs/reference/generated/kubectl/kubectl-commands#patch)	- Обновить один или несколько полей ресурса, используя стратегию слияния патча.
* [kubectl plugin](/docs/reference/generated/kubectl/kubectl-commands#plugin)	- Команда для работы с плагинами.
* [kubectl port-forward](/docs/reference/generated/kubectl/kubectl-commands#port-forward)	- Переадресовать один или несколько локальных портов в под.
* [kubectl proxy](/docs/reference/generated/kubectl/kubectl-commands#proxy)	- Запустить прокси на API-сервер Kubernetes.
* [kubectl replace](/docs/reference/generated/kubectl/kubectl-commands#replace)	- Заменить ресурс из определения в файле или потоке stdin.
* [kubectl rollout](/docs/reference/generated/kubectl/kubectl-commands#rollout)	- Управление плавающим обновлением ресурса.
* [kubectl run](/docs/reference/generated/kubectl/kubectl-commands#run)	- Запустить указанный образ в кластере.
* [kubectl scale](/docs/reference/generated/kubectl/kubectl-commands#scale)	- Задать новый размер для Deployment, ReplicaSet или Replication Controller.
* [kubectl set](/docs/reference/generated/kubectl/kubectl-commands#set)	- Конфигурировать ресурсы в объектах.
* [kubectl taint](/docs/reference/generated/kubectl/kubectl-commands#taint)	- Обновить ограничения для одного или нескольких узлов.
* [kubectl top](/docs/reference/generated/kubectl/kubectl-commands#top)	- Показать информацию по использованию системных ресурсов (процессор, память, диск).
* [kubectl uncordon](/docs/reference/generated/kubectl/kubectl-commands#uncordon)	- Отметить узел как назначаемый.
* [kubectl version](/docs/reference/generated/kubectl/kubectl-commands#version) - Вывести информацию о версии клиента и сервера.
* [kubectl wait](/docs/reference/generated/kubectl/kubectl-commands#wait) - Экспериментально: ожидать выполнения определенного условия в одном или нескольких ресурсах.



