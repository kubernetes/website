---
content_type: "reference"
title: kubelet systemd 看门狗
weight: 80
math: true # 用以表示下面除以 2 的表达式
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
在 Linux 节点上，Kubernetes {{< skew currentVersion >}} 支持与
[systemd](https://systemd.io/) 集成，以允许操作系统监视程序恢复失败的 kubelet。
这种集成默认并未被启用。它可以作为一个替代方案，通过定期请求 kubelet 的 `/healthz` 端点进行健康检查。
如果 kubelet 在设定的超时时限内未对看门狗做出响应，看门狗将杀死 kubelet。

<!--
The systemd watchdog works by requiring the service to periodically send
a _keep-alive_ signal to the systemd process. If the signal is not received
within a specified timeout period, the service is considered unresponsive
and is terminated. The service can then be restarted according to the configuration.
-->
systemd 看门狗的工作原理是要求服务定期向 systemd 进程发送一个**保持活跃**的信号。
如果 systemd 进程在指定的超时时限内未接收到某服务发出的信号，则对应的服务被视为无响应并被终止。
之后 systemd 进程可以基于配置重启该服务。

<!--
## Configuration

Using the systemd watchdog requires configuring the `WatchdogSec` parameter
in the `[Service]` section of the kubelet service unit file:
-->
## 配置    {#configuration}

使用 systemd 看门狗需要在 kubelet 服务单元文件的 `[Service]` 部分配置 `WatchdogSec` 参数：

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
设置 `WatchdogSec=30s` 表示服务看门狗超时时限为 30 秒。
在 kubelet 内，`sd_notify()` 函数被调用，以 \\( WatchdogSec \div 2\\) 的时间间隔，
发送 `WATCHDOG=1`（保持活跃的消息）。如果在超时时限内看门狗未被“投喂”此信号，kubelet 将被杀死。
将 `Restart` 设置为 "always"、"on-failure"、"on-watchdog" 或 "on-abnormal"
将确保服务被自动重启。

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
systemd 配置相关的一些细节：

1. 如果你将 systemd 的 `WatchdogSec` 值设置为 0，或省略不设置，则对应的单元上不启用 systemd 看门狗。
2. kubelet 支持设置的最小看门狗超时时限为 1.0 秒；这是为了防止 kubelet 被意外杀死。
   你可以在 systemd 单元定义中将 `WatchdogSec` 的值设置为短于 1 秒的超时时限，
   但 Kubernetes 不支持任何更短的时间间隔。超时时限不必是整数的秒数。
3. Kubernetes 项目建议将 `WatchdogSec` 时限设置为大约 15 秒。
   系统支持超过 10 分钟的时限设置，但明确**不**推荐这样做。

<!--
### Example Configuration
-->
### 示例配置    {#example-configuration}

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
# 配置看门狗的超时时限
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
有关 systemd 配置的细节，请参阅
[systemd 文档](https://www.freedesktop.org/software/systemd/man/latest/systemd.service.html#WatchdogSec=)。
