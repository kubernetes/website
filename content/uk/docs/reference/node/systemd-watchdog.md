---
content_type: "reference"
title: Сторожовий таймер systemd для kubelet
weight: 80
math: true
---

{{< feature-state feature_gate_name="SystemdWatchdog" >}}

На вузлах Linux, Kubernetes {{< skew currentVersion >}} підтримує інтеграцію з [systemd](https://systemd.io/), щоб дозволити супервізору операційної системи відновити несправний kubelet. Типово цю інтеграцію вимкнено. Її можна використовувати як альтернативу періодичним запитам до точки доступу kubelet `/healthz` для перевірки працездатності. Якщо протягом тайм-ауту kubelet не відповість на запит сторожового таймера, сторожовий таймер примусово завершить kubelet.

Сторожовий таймер systemd працює, вимагаючи від сервісу періодично надсилати сигнал _keep-alive_ процесу systemd. Якщо сигнал не отримано протягом визначеного тайм-ауту, сервіс вважається таким, що не відповідає, і його роботу завершують. Після цього сервіс можна перезапустити відповідно до конфігурації.

## Конфігурація {#configuration}

Використання сторожового таймера systemd вимагає налаштування параметра `WatchdogSec` у розділі `[Service]` unit-файлу сервісу kubelet:

```
[Service]
WatchdogSec=30s
```

Встановлення `WatchdogSec=30s` задає тайм-аут сторожового таймера сервісу 30 секунд. Усередині kubelet функція `sd_notify()` викликається з інтервалом \\( WatchdogSec \div 2\\), щоб відправити `WATCHDOG=1` (повідомлення keep-alive). Якщо сторожовий таймер не отримає цього повідомлення протягом тайм-ауту, kubelet буде примусово завершено. Встановлення `Restart` у значення "always", "on-failure", "on-watchdog" або "on-abnormal" забезпечить автоматичний перезапуск сервісу.

Дещо про конфігурацію systemd:

1. Якщо ви встановите значення systemd для параметра `WatchdogSec` рівним 0 або не встановите його, сторожовий таймер systemd буде вимкнено для цього юніта.
2. kubelet підтримує мінімальний період роботи сторожового таймера 1.0 секунди; це необхідно для запобігання несподіваного завершення роботи kubelet. Ви можете встановити значення `WatchdogSec` у визначенні юніта systemd на період, менший за 1 секунду, але Kubernetes не підтримує коротший інтервал. Тайм-аут не обовʼязково має бути цілим числом секунд.
3. Проєкт Kubernetes пропонує встановити `WatchdogSec` на період приблизно 15 с. Періоди довші за 10 хвилин підтримуються, але явно **не** рекомендуються.

### Приклад конфігурації {#example-configuration}

```systemd
[Unit]
Description=kubelet: The Kubernetes Node Agent
Documentation=https://kubernetes.io/docs/home/
Wants=network-online.target
After=network-online.target

[Service]
ExecStart=/usr/bin/kubelet
# Налаштування таймауту watchdog
WatchdogSec=30s
Restart=on-failure
StartLimitInterval=0
RestartSec=10

[Install]
WantedBy=multi-user.target
```

## {{% heading "whatsnext" %}} {#what-s-next}

Докладніше про конфігурацію systemd дивіться в [документації systemd](https://www.freedesktop.org/software/systemd/man/latest/systemd.service.html#WatchdogSec=).
