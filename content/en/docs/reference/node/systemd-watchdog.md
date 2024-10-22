---
content_type: "reference"
title: Kubelet Systemd Watchdog
weight: 80
---

{{< feature-state feature_gate_name="SystemdWatchdog" >}}

Using the watchdog can improve the reliability of the kubelet.
It can be used as an alternative to periodically requesting
the kubelet's `/healthz` endpoint for health checks. If the kubelet
does not respond to the watchdog within the timeout period, the watchdog
will kill the kubelet.

The systemd watchdog works by requiring the service to periodically send
a "keep-alive" signal to the systemd daemon. If the signal is not received
within a specified timeout period, the service is considered unresponsive
and is terminated. The service can then be restarted according to the configuration.

### How to use

Using the systemd watchdog requires configuring the `WatchdogSec` parameter
in the `[Service]` section of the kubelet service unit file:
```sh
[Service]
WatchdogSec=30s
```

`WatchdogSec=30s` indicates a timeout of 30 seconds. In the kubelet program,
the `sd_notify` function is called at intervals of `WatchdogSec/2` to send
"WATCHDOG=1" for the keep-alive operation. If the watchdog is not fed
within the timeout period, the kubelet will be killed. Setting `Restart`
to "always", "on-failure", "on-watchdog", or "on-abnormal" will ensure that the service
is automatically restarted.

Explanation about the `WatchdogSec` configuration:

1. Not configuring it or setting it to 0 means the watchdog is not enabled.
2. The default minimum value for `WatchdogSec` in kubelet is currently 1 second 
   to prevent the kubelet from being killed unexpectedly. Even though `WatchdogSec`
   in systemd configuration can be set to less than 1 second, 
   Kubelet enforces a minimum of 1 second.
3. A good practice is to set `WatchdogSec` to no more than 10 minutes, 
   although this is not mandatory.

### Example Configuration
```Ini
[Unit]
Description=kubelet: The Kubernetes Node Agent
Documentation=https://kubernetes.io/docs/home/
Wants=network-online.target
After=network-online.target

[Service]
ExecStart=/usr/bin/kubelet
WatchdogSec=30s
Restart=on-failure
StartLimitInterval=0
RestartSec=10

[Install]
WantedBy=multi-user.target
```
For more details about systemd configuration, please refer to the
[systemd documentation](https://www.freedesktop.org/software/systemd/man/latest/systemd.service.html#WatchdogSec=)