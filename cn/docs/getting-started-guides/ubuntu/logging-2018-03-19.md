---
title: Logging
---

{% capture overview %}
This page will explain how logging works within a Juju deployed cluster.
{% endcapture %}

{% capture prerequisites %}
This page assumes you have a working Juju deployed cluster.
{% endcapture %}

{% capture steps %}
## Agent Logging

The `juju debug-log` will show all of the consolidated logs of all the Juju agents running on each node of the cluster. This can be useful for finding out why a specific node hasn't deployed or is in an error state. These agent logs are located in `/var/lib/juju/agents` on every node. 

See the [Juju documentation](https://jujucharms.com/docs/stable/troubleshooting-logs) for more information.


## Managing log verbosity

Log verbosity in Juju is set at the model level. You can adjust it at any time:  

```
juju add-model k8s-development --config logging-config='<root>=DEBUG;unit=DEBUG'
```

and later on your k8s-production model

```
juju model-config -m k8s-production logging-config='<root>=ERROR;unit=ERROR'
```

In addition, the jujud daemon is started in debug mode by default on all controllers. To remove that behavior edit ```/var/lib/juju/init/jujud-machine-0/exec-start.sh``` on the controller node and comment the ```--debug``` section. 

It then contains: 

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

Then restart the service with: 

```
sudo systemctl restart jujud-machine-0.service
```

See the [official documentation](https://jujucharms.com/docs/stable/models-config) for more information about logging and other model settings in Juju. 
{% endcapture %}

{% include templates/task.md %}
