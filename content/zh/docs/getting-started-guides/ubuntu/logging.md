---
title: 日志
content_template: templates/task
---

<!-- ---
title: Logging
content_template: templates/task
--- -->

{{% capture overview %}}
<!-- This page will explain how logging works within a Juju deployed cluster. -->
本文将说明日志在 Juju 部署的集群中是如何工作的。
{{% /capture %}}

{{% capture prerequisites %}}
<!-- This page assumes you have a working Juju deployed cluster. -->
本文假设你已经有一个可用的 Juju 部署的集群。
{{% /capture %}}

{{% capture steps %}}
<!-- ## Agent Logging -->
## 代理日志

<!-- The `juju debug-log` will show all of the consolidated logs of all the Juju agents running on each node of the cluster. This can be useful for finding out why a specific node hasn't deployed or is in an error state. These agent logs are located in `/var/lib/juju/agents` on every node. -->
`juju debug-log` 命令可以显示集群中每一个节点上运行的 Juju 代理所汇总的日志结果。
它可以帮助确定为何某个节点没有被部署或者是处于错误的状态。这些代理日志被存放在每个节点的 `/var/lib/juju/agents` 路径下。

<!-- See the [Juju documentation](https://jujucharms.com/docs/stable/troubleshooting-logs) for more information. -->
更多信息参见[Juju 文档](https://jujucharms.com/docs/stable/troubleshooting-logs)


<!-- ## Managing log verbosity -->
## 管理日志级别

<!-- Log verbosity in Juju is set at the model level. You can adjust it at any time: -->
Juju 中默认的日志级别是 model 级别。不过，你可以随时调整它：

```
juju add-model k8s-development --config logging-config='<root>=DEBUG;unit=DEBUG'
```

<!-- and later on your k8s-production model -->
然后在你的生态环境下的 k8s 模型进行配置

```
juju model-config -m k8s-production logging-config='<root>=ERROR;unit=ERROR'
```

<!-- In addition, the jujud daemon is started in debug mode by default on all controllers. To remove that behavior edit ```/var/lib/juju/init/jujud-machine-0/exec-start.sh``` on the controller node and comment the ```--debug``` section. -->
另外，所有控制器上的 jujud 守护进程默认使用 debug 级别。如果想要移除这种行为，编辑控制器节点上的 ```/var/lib/juju/init/jujud-machine-0/exec-start.sh``` 文件并注释掉 ```--debug``` 选项。

<!-- It then contains: -->
修改之后，如下所示：

```
#!/usr/bin/env bash

# Set up logging.
touch '/var/log/juju/machine-0.log'
chown syslog:syslog '/var/log/juju/machine-0.log'
chmod 0600 '/var/log/juju/machine-0.log'
exec >> '/var/log/juju/machine-0.log'
exec 2>&1

# Run the script.
'/var/lib/juju/tools/machine-0/jujud' machine --data-dir '/var/lib/juju' --machine-id 0 # --debug
```

<!-- Then restart the service with: -->
然后运行下面的命令，重启服务：

```
sudo systemctl restart jujud-machine-0.service
```

<!-- See the [official documentation](https://jujucharms.com/docs/stable/models-config) for more information about logging and other model settings in Juju. -->
Juju 中更多和日志与其它模型设置相关的信息请参考[官方文档](https://jujucharms.com/docs/stable/models-config)。
{{% /capture %}}
