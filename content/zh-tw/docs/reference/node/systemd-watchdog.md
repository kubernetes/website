---
content_type: "reference"
title: kubelet systemd 看門狗
weight: 80
math: true # 用以表示下面除以 2 的表達式
---
<!--
content_type: "reference"
title: Kubelet Systemd Watchdog
weight: 80
math: true # for a division by 2
-->

{{< feature-state feature_gate_name="SystemdWatchdog" >}}

<!--
On Linux nodes, Kubernetes {{< skew currentVersion >}} supports integrating with
[systemd](https://systemd.io/) to allow the operating system supervisor to recover
a failed kubelet. This integration is not enabled by default.
It can be used as an alternative to periodically requesting
the kubelet's `/healthz` endpoint for health checks. If the kubelet
does not respond to the watchdog within the timeout period, the watchdog
will kill the kubelet.
-->
在 Linux 節點上，Kubernetes {{< skew currentVersion >}} 支持與
[systemd](https://systemd.io/) 集成，以允許操作系統監視程式恢復失敗的 kubelet。
這種集成預設並未被啓用。它可以作爲一個替代方案，通過定期請求 kubelet 的 `/healthz` 端點進行健康檢查。
如果 kubelet 在設定的超時時限內未對看門狗做出響應，看門狗將殺死 kubelet。

<!--
The systemd watchdog works by requiring the service to periodically send
a _keep-alive_ signal to the systemd process. If the signal is not received
within a specified timeout period, the service is considered unresponsive
and is terminated. The service can then be restarted according to the configuration.
-->
systemd 看門狗的工作原理是要求服務定期向 systemd 進程發送一個**保持活躍**的信號。
如果 systemd 進程在指定的超時時限內未接收到某服務發出的信號，則對應的服務被視爲無響應並被終止。
之後 systemd 進程可以基於設定重啓該服務。

<!--
## Configuration

Using the systemd watchdog requires configuring the `WatchdogSec` parameter
in the `[Service]` section of the kubelet service unit file:
-->
## 設定    {#configuration}

使用 systemd 看門狗需要在 kubelet 服務單元檔案的 `[Service]` 部分設定 `WatchdogSec` 參數：

```
[Service]
WatchdogSec=30s
```

<!--
Setting `WatchdogSec=30s` indicates a service watchdog timeout of 30 seconds.
Within the kubelet, the `sd_notify()` function is invoked, at intervals of \\( WatchdogSec \div 2\\). to send
`WATCHDOG=1` (a keep-alive message). If the watchdog is not fed
within the timeout period, the kubelet will be killed. Setting `Restart`
to "always", "on-failure", "on-watchdog", or "on-abnormal" will ensure that the service
is automatically restarted.
-->
設置 `WatchdogSec=30s` 表示服務看門狗超時時限爲 30 秒。
在 kubelet 內，`sd_notify()` 函數被調用，以 \\( WatchdogSec \div 2\\) 的時間間隔，
發送 `WATCHDOG=1`（保持活躍的消息）。如果在超時時限內看門狗未被“投餵”此信號，kubelet 將被殺死。
將 `Restart` 設置爲 "always"、"on-failure"、"on-watchdog" 或 "on-abnormal"
將確保服務被自動重啓。

<!--
Some details about the systemd configuration:

1. If you set the systemd value for `WatchdogSec` to 0, or omit setting it, the systemd watchdog is not
   enabled for this unit.
2. The kubelet supports a minimum watchdog period of 1.0 seconds; this is to prevent the kubelet
   from being killed unexpectedly. You can set the value of `WatchdogSec` in a systemd unit definition
   to a period shorter than 1 second, but Kubernetes does not support any shorter interval.
   The timeout does not have to be a whole integer number of seconds.
3. The Kubernetes project suggests setting `WatchdogSec` to approximately a 15s period.
   Periods longer than 10 minutes are supported but explicitly **not** recommended.
-->
systemd 設定相關的一些細節：

1. 如果你將 systemd 的 `WatchdogSec` 值設置爲 0，或省略不設置，則對應的單元上不啓用 systemd 看門狗。
2. kubelet 支持設置的最小看門狗超時時限爲 1.0 秒；這是爲了防止 kubelet 被意外殺死。
   你可以在 systemd 單元定義中將 `WatchdogSec` 的值設置爲短於 1 秒的超時時限，
   但 Kubernetes 不支持任何更短的時間間隔。超時時限不必是整數的秒數。
3. Kubernetes 項目建議將 `WatchdogSec` 時限設置爲大約 15 秒。
   系統支持超過 10 分鐘的時限設置，但明確**不**推薦這樣做。

<!--
### Example Configuration
-->
### 示例設定    {#example-configuration}

<!--
# Configures the watchdog timeout
-->
```systemd
[Unit]
Description=kubelet: The Kubernetes Node Agent
Documentation=https://kubernetes.io/docs/home/
Wants=network-online.target
After=network-online.target

[Service]
ExecStart=/usr/bin/kubelet
# 配置看門狗的超時時限
WatchdogSec=30s
Restart=on-failure
StartLimitInterval=0
RestartSec=10

[Install]
WantedBy=multi-user.target
```

## {{% heading "whatsnext" %}}

<!--
For more details about systemd configuration, refer to the
[systemd documentation](https://www.freedesktop.org/software/systemd/man/latest/systemd.service.html#WatchdogSec=)
-->
有關 systemd 設定的細節，請參閱
[systemd 文檔](https://www.freedesktop.org/software/systemd/man/latest/systemd.service.html#WatchdogSec=)。
