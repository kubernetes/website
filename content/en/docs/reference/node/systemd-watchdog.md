---
content_type: "reference"
title: Kubelet Systemd Watchdog
weight: 80
---

{{< feature-state feature_gate_name="SystemdWatchdog" >}}

On Linux nodes, Kubernetes {{< skew currentVersion >}} supports integrating with
[systemd](https://systemd.io/) to allow the operating system supervisor to recover
a failed kubelet. This integration is not enabled by default.
It can be used as an alternative to periodically requesting
the kubelet's `/healthz` endpoint for health checks. If the kubelet
does not respond to the watchdog within the timeout period, the watchdog
will kill the kubelet.

The systemd watchdog works by requiring the service to periodically send
a _keep-alive_ signal to the systemd process. If the signal is not received
within a specified timeout period, the service is considered unresponsive
and is terminated. The service can then be restarted according to the configuration.

## Configuration

Using the systemd watchdog requires configuring the `WatchdogSec` parameter
in the `[Service]` section of the kubelet service unit file:
```
[Service]
WatchdogSec=30s
```

Setting `WatchdogSec=30s` indicates a service watchdog timeout of 30 seconds.
Within the kubelet, the `sd_notify()` function is invoked, at intervals of `WatchdogSec` ÷ 2, to send
`WATCHDOG=1` (a keep-alive message). If the watchdog is not fed
within the timeout period, the kubelet will be killed. Setting `Restart`
to "always", "on-failure", "on-watchdog", or "on-abnormal" will ensure that the service
is automatically restarted.

Some details about the systemd configuration:

1. If you set the systemd value for `WatchdogSec` to 0, or omit setting it, the systemd watchdog is not
   enabled for this unit.
2. The kubelet supports a minimum watchdog period of 1.0 seconds; this is to prevent the kubelet
   from being killed unexpectedly. You can set the value of `WatchdogSec` in a systemd unit definition
   to a period shorter than 1 second, but Kubernetes does not support any shorter interval.
   The timeout does not have to be a whole integer number of seconds.
3. The Kubernetes project suggests setting `WatchdogSec` to approximately a 15s period.
   Periods longer than 10 minutes are supported but explicitly **not** recommended.

### Example Configuration
```systemd
[Unit]
Description=kubelet: The Kubernetes Node Agent
Documentation=https://kubernetes.io/docs/home/
Wants=network-online.target
After=network-online.target

[Service]
ExecStart=/usr/bin/kubelet
# Configures the watchdog timeout
WatchdogSec=30s
Restart=on-failure
StartLimitInterval=0
RestartSec=10

[Install]
WantedBy=multi-user.target
```
## {{% heading "whatsnext" %}}
For more details about systemd configuration, refer to the
[systemd documentation](https://www.freedesktop.org/software/systemd/man/latest/systemd.service.html#WatchdogSec=)
