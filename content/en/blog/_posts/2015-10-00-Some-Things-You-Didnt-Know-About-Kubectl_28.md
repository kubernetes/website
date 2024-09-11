---
title: "Some things you didn’t know about kubectl"
date: 2015-10-28
slug: some-things-you-didnt-know-about-kubectl_28
url: /blog/2015/10/Some-Things-You-Didnt-Know-About-Kubectl_28
author: >
  Brendan Burns (Google) 
---

[kubectl](/docs/reference/kubectl/) is the command line tool for interacting with Kubernetes clusters. Many people use it every day to deploy their container workloads into production clusters. But there’s more to kubectl than just `kubectl create -f or kubectl rolling-update`. kubectl is a veritable multi-tool of container orchestration and management. Below we describe some of the features of kubectl that you may not have seen.   

## Run interactive commands

`kubectl run` has been in kubectl since the 1.0 release, but recently we added the ability to run interactive containers in your cluster. That means that an interactive shell in your Kubernetes cluster is as close as:  

```console
$> kubectl run -i --tty busybox --image=busybox --restart=Never -- sh
Waiting for pod default/busybox-tv9rm to be running, status is Pending, pod ready: false
Waiting for pod default/busybox-tv9rm to be running, status is Running, pod ready: false
$> # ls 
bin dev etc home proc root sys tmp usr var 
$> # exit
```

The above `kubectl` command is equivalent to `docker run -i -t busybox sh`. Sadly we mistakenly used `-t` for template in kubectl 1.0, so we need to retain backwards compatibility with existing CLI user. But the existing use of `-t` is deprecated and we’ll eventually shorten `--tty` to `-t`.

In this example, `-i` indicates that you want an allocated `stdin` for your container and indicates that you want an interactive session, `--restart=Never` indicates that the container shouldn’t be restarted after you exit the terminal and `--tty` requests that you allocate a TTY for that session.

## View your Pod’s logs

Sometimes you just want to watch what’s going on in your server. For this, `kubectl logs` is the subcommand to use. Adding the -f flag lets you live stream new logs to your terminal, just like tail -f.

```console
$> kubectl logs -f redis-izl09
```

## Attach to existing containers

In addition to interactive execution of commands, you can now also attach to any running process. Like kubectl logs, you’ll get stderr and stdout data, but with attach, you’ll also be able to send stdin from your terminal to the program. Awesome for interactive debugging, or even just sending ctrl-c to a misbehaving application.

```console
$> kubectl attach redis -i

1:C 12 Oct 23:05:11.848 # Warning: no config file specified, using the default config. In order to specify a config file use redis-server /path/to/redis.conf

                _._                
           _.-``__''-._            
      _.-`` `. `_. ''-._ Redis 3.0.3 (00000000/0) 64 bit
  .-`` .-```. ```\/ _.,_ ''-._     
 ( ' , .-` | `, ) Running in standalone mode
 |`-._`-...-` __...-.``-._|'` _.-'| Port: 6379
 | `-._ `._ / _.-' | PID: 1
  `-._ `-._ `-./ _.-' _.-'         
 |`-._`-._ `-.__.-' _.-'_.-'|      
 | `-._`-._ _.-'_.-' | http://redis.io
`-._ `-._`-.__.-'_.-' _.-'         
 |`-._`-._ `-.__.-' _.-'_.-'|      
 | `-._`-._ _.-'_.-' |             
  `-._ `-._`-.__.-'_.-' _.-'       
      `-._ `-.__.-' _.-'           
          `-._ _.-'                
              `-.__.-'             

1:M 12 Oct 23:05:11.849 # Server started, Redis version 3.0.3
```

## Forward ports from Pods to your local machine

Often times you want to be able to temporarily communicate with applications in your cluster without exposing them to the public internet for security reasons. To achieve this, the port-forward command allows you to securely forward a port on your local machine through the kubernetes API server to a Pod running in your cluster. For example:  

```console
$> kubectl port-forward redis-izl09 6379
```

Opens port 6379 on your local machine and forwards communication to that port to the Pod or Service in your cluster. For example, you can use the `telnet` command to poke at a Redis service in your cluster:

```console
$> telnet localhost 6379 
INCR foo
:1
INCR foo 
:2
```

## Execute commands inside an existing container
In addition to being able to attach to existing processes inside a container, the `exec` command allows you to spawn new processes inside existing containers. This can be useful for debugging, or examining your pods to see what’s going on inside without interrupting a running service. `kubectl exec` is different from `kubectl run`, because it runs a command inside of an _existing_ container, rather than spawning a new container for execution.

```console
$> kubectl exec redis-izl09 -- ls /
bin
boot
data
dev
entrypoint.sh
etc
home
```


## Add or remove Labels

Sometimes you want to dynamically add or remove labels from a Pod, Service or Replication controller. Maybe you want to add an existing Pod to a Service, or you want to remove a Pod from a Service. No matter what you want, you can easily and dynamically add or remove labels using the `kubectl label` subcommand:

```console
`$> kubectl label pods redis-izl09 mylabel=awesome `
`pod "redis-izl09" labeled`
```

## Add annotations to your objects

Just like labels, you can add or remove annotations from API objects using the kubectl annotate subcommand. Unlike labels, annotations are there to help describe your object, but aren’t used to identify pods via label queries ([more details on annotations](/docs/concepts/overview/working-with-objects/annotations/)). For example, you might add an annotation of an icon for a GUI to use for displaying your pods.

```console
$> kubectl annotate pods redis-izl09 icon-url=http://goo.gl/XXBTWq
pod "redis-izl09" annotated
```

## Output custom format

Sometimes, you want to customize the fields displayed when kubectl summarizes an object from your cluster. To do this, you can use the `custom-columns-file` format. `custom-columns-file` takes in a template file for rendering the output. Again, JSONPath expressions are used in the template to specify fields in the API object. For example, the following template first shows the number of restarts, and then the name of the object:

```console
$> cat cols.tmpl
RESTARTS                                   NAME
.status.containerStatuses[0].restartCount .metadata.name
```

If you pass this template to the `kubectl get pods` command you get a list of pods with the specified fields displayed.

```
$> kubectl get pods redis-izl09 -o=custom-columns-file --template=cols.tmpl                 RESTARTS           NAME   
 0                  redis-izl09   
 1                  redis-abl42  
```

## Easily manage multiple Kubernetes clusters

If you’re running multiple Kubernetes clusters, you know it can be tricky to manage all of the credentials for the different clusters. Using the `kubectl config` subcommands, switching between different clusters is as easy as:

```console
$> kubectl config use-context
```

Not sure what clusters are available? You can view currently configured clusters with:

```console
$> kubectl config view
```

Phew, that outputs a lot of text. To restrict it down to only the things we’re interested in, we can use a JSONPath template:

```console
$> kubectl config view -o jsonpath="{.context[*].name}"
```

Ahh, that’s better.


## Conclusion

So there you have it, nine new and exciting things you can do with your Kubernetes cluster and the kubectl command line. If you’re just getting started with Kubernetes, check out [Google Container Engine](https://cloud.google.com/container-engine/) or other ways to [get started with Kubernetes](/docs/tutorials/kubernetes-basics/).

