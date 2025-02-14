---
reviewers:
- caesarxuchao
- mikedanese
title: Get a Shell to a Running Container
content_type: task
---

<!-- overview -->

This page shows how to use `kubectl exec` to get a shell to a
running container.




## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}}




<!-- steps -->

## Getting a shell to a container

In this exercise, you create a Pod that has one container. The container
runs the nginx image. Here is the configuration file for the Pod:

{{% code_sample file="application/shell-demo.yaml" %}}

Create the Pod:

```shell
kubectl apply -f https://k8s.io/examples/application/shell-demo.yaml
```

Verify that the container is running:

```shell
kubectl get pod shell-demo
```

Get a shell to the running container:

```shell
kubectl exec --stdin --tty shell-demo -- /bin/bash
```

{{< note >}}
The double dash (`--`) separates the arguments you want to pass to the command from the kubectl arguments.
{{< /note >}}

In your shell, list the root directory:

```shell
# Run this inside the container
ls /
```

In your shell, experiment with other commands. Here are
some examples:

```shell
# You can run these example commands inside the container
ls /
cat /proc/mounts
cat /proc/1/maps
apt-get update
apt-get install -y tcpdump
tcpdump
apt-get install -y lsof
lsof
apt-get install -y procps
ps aux
ps aux | grep nginx
```

## Writing the root page for nginx

Look again at the configuration file for your Pod. The Pod
has an `emptyDir` volume, and the container mounts the volume
at `/usr/share/nginx/html`.

In your shell, create an `index.html` file in the `/usr/share/nginx/html`
directory:

```shell
# Run this inside the container
echo 'Hello shell demo' > /usr/share/nginx/html/index.html
```

In your shell, send a GET request to the nginx server:

```shell
# Run this in the shell inside your container
apt-get update
apt-get install curl
curl http://localhost/
```

The output shows the text that you wrote to the `index.html` file:

```
Hello shell demo
```

When you are finished with your shell, enter `exit`.

```shell
exit # To quit the shell in the container
```

## Running individual commands in a container

In an ordinary command window, not your shell, list the environment
variables in the running container:

```shell
kubectl exec shell-demo -- env
```

Experiment with running other commands. Here are some examples:

```shell
kubectl exec shell-demo -- ps aux
kubectl exec shell-demo -- ls /
kubectl exec shell-demo -- cat /proc/1/mounts
```



<!-- discussion -->

## Opening a shell when a Pod has more than one container

If a Pod has more than one container, use `--container` or `-c` to
specify a container in the `kubectl exec` command. For example,
suppose you have a Pod named my-pod, and the Pod has two containers
named _main-app_ and _helper-app_. The following command would open a
shell to the _main-app_ container.

```shell
kubectl exec -i -t my-pod --container main-app -- /bin/bash
```

{{< note >}}
The short options `-i` and `-t` are the same as the long options `--stdin` and `--tty`
{{< /note >}}


## {{% heading "whatsnext" %}}


* Read about [kubectl exec](/docs/reference/generated/kubectl/kubectl-commands/#exec)
