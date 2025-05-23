---
layout: blog
title: "Start Sidecar First: How To Avoid Snags"
date: 2025-06-03
draft: false
slug: start-sidecar-first
author: Agata Skorupka (The Scale Factory)
---

From the [Kubernetes Multicontainer Pods: An Overview blog post](/blog/2025/04/22/multi-container-pods-overview/) you know what their job is, what are the main architectural patterns, and how they are implemented in Kubernetes. The main thing I’ll cover in this article is how to ensure that your sidecar containers start before the main app. It’s more complicated than you might think!

## A gentle refresher

I'd just like to remind readers that the [v1.29.0 release of Kubernetes](/blog/2023/12/13/kubernetes-v1-29-release/) added native support for
[sidecar containers](/docs/concepts/workloads/pods/sidecar-containers/), which can now be defined within the `.spec.initContainers` field,
but with `restartPolicy: Always`. You can see that illustrated in the following example Pod manifest snippet:

```yaml
initContainers:
  - name: logshipper
    image: alpine:latest
    restartPolicy: Always # this is what makes it a sidecar container
    command: ['sh', '-c', 'tail -F /opt/logs.txt']
    volumeMounts:
    - name: data
        mountPath: /opt
```

What are the specifics of defining sidecars with a `.spec.initContainers` block, rather than as a legacy multi-container pod with multiple `.spec.containers`?
Well, all `.spec.initContainers` are always launched **before** the main application. If you define Kubernetes-native sidecars, those are terminated **after** the main application. Furthermore, when used with [Jobs](/docs/concepts/workloads/controllers/job/), a sidecar container should still be alive and could potentially even restart after the owning Job is complete; Kubernetes-native sidecar containers do not block pod completion.

To learn more, you can also read the official [Pod sidecar containers tutorial](/docs/tutorials/configuration/pod-sidecar-containers/).

## The problem

Now you know that defining a sidecar with this native approach will always start it before the main application. From the [kubelet source code](https://github.com/kubernetes/kubernetes/blob/537a602195efdc04cdf2cb0368792afad082d9fd/pkg/kubelet/kuberuntime/kuberuntime_manager.go#L827-L830), it's visible that this often means being started almost in parallel, and this is not always what an engineer wants to achieve. What I'm really interested in is whether I can delay the start of the main application until the sidecar is not just started, but fully running and ready to serve.
It might be a bit tricky because the problem with sidecars is there’s no obvious success signal, contrary to init containers - designed to run only for a specified period of time. With an init container, exit status 0 is unambiguously "I succeeded". With a sidecar, there are lots of points at which you can say "a thing is running".
Starting one container only after the previous one is ready is part of a graceful deployment strategy, ensuring proper sequencing and stability during startup. It’s also actually how I’d expect sidecar containers to work as well, to cover the scenario where the main application is dependent on the sidecar. For example, it may happen that an app errors out if the sidecar isn’t available to serve requests (e.g., logging with DataDog). Sure, one could change the application code (and it would actually be the “best practice” solution), but sometimes they can’t - and this post focuses on this use case.

I'll explain some ways that you might try, and show you what approaches will really work.

## Readiness probe

To check whether Kubernetes native sidecar delays the start of the main application until the sidecar is ready, let’s simulate a short investigation. Firstly, I’ll simulate a sidecar container which will never be ready by implementing a readiness probe which will never succeed. As a reminder, a [readiness probe](/docs/concepts/configuration/liveness-readiness-startup-probes/) checks if the container is ready to start accepting traffic and therefore, if the pod can be used as a backend for services. 

(Unlike standard init containers, sidecar containers can have [probes](https://kubernetes.io/docs/concepts/configuration/liveness-readiness-startup-probes/) so that the kubelet can supervise the sidecar and intervene if there are problems. For example, restarting a sidecar container if it fails a health check.)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
  labels:
    app: myapp
spec:
  replicas: 1
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
        - name: myapp
          image: alpine:latest
          command: ["sh", "-c", "sleep 3600"]
      initContainers:
        - name: nginx
          image: nginx:latest
          restartPolicy: Always
          ports:
            - containerPort: 80
              protocol: TCP
          readinessProbe:
            exec:
              command:
              - /bin/sh
              - -c
              - exit 1 # this command always fails, keeping the container "Not Ready"
            periodSeconds: 5
      volumes:
        - name: data
          emptyDir: {}
```

The result is:

```console
controlplane $ kubectl get pods -w
NAME                    READY   STATUS    RESTARTS   AGE
myapp-db5474f45-htgw5   1/2     Running   0          9m28s

controlplane $ kubectl describe pod myapp-db5474f45-htgw5 
Name:             myapp-db5474f45-htgw5
Namespace:        default
(...)
Events:
  Type     Reason     Age               From               Message
  ----     ------     ----              ----               -------
  Normal   Scheduled  17s               default-scheduler  Successfully assigned default/myapp-db5474f45-htgw5 to node01
  Normal   Pulling    16s               kubelet            Pulling image "nginx:latest"
  Normal   Pulled     16s               kubelet            Successfully pulled image "nginx:latest" in 163ms (163ms including waiting). Image size: 72080558 bytes.
  Normal   Created    16s               kubelet            Created container nginx
  Normal   Started    16s               kubelet            Started container nginx
  Normal   Pulling    15s               kubelet            Pulling image "alpine:latest"
  Normal   Pulled     15s               kubelet            Successfully pulled image "alpine:latest" in 159ms (160ms including waiting). Image size: 3652536 bytes.
  Normal   Created    15s               kubelet            Created container myapp
  Normal   Started    15s               kubelet            Started container myapp
  Warning  Unhealthy  1s (x6 over 15s)  kubelet            Readiness probe failed:
```

From these logs it’s evident that only one container is ready - and I know it can’t be the sidecar, because I’ve defined it so it’ll never be ready (you can also check container statuses in `kubectl get pod -o json`). I also saw that myapp has been started before the sidecar is ready. That was not the result I wanted to achieve; in this case, the main app container has a hard dependency on its sidecar.

## Maybe a startup probe?

To ensure that the sidecar is ready before the main app container starts, I can define a `startupProbe`. It will delay the start of the main container until the command is successfully executed (returns `0` exit status). If you’re wondering why I’ve added it to my `initContainer`, let’s analyse what happens If I’d added it to myapp container. I wouldn’t have guaranteed the probe would run before the main application code - and this one, can potentially error out without the sidecar being up and running.

```yaml                                                                
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
  labels:
    app: myapp
spec:
  replicas: 1
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
        - name: myapp
          image: alpine:latest
          command: ["sh", "-c", "sleep 3600"]
      initContainers:
        - name: nginx
          image: nginx:latest
          ports:
            - containerPort: 80
              protocol: TCP
          restartPolicy: Always
          startupProbe:
            httpGet:
              path: /
              port: 80
            initialDelaySeconds: 5
            periodSeconds: 30
            failureThreshold: 10
            timeoutSeconds: 20
      volumes:
        - name: data
          emptyDir: {}
```

This results in 2/2 containers being ready and running, and from events, it can be inferred that the main application started only after nginx had already been started. But to confirm whether it waited for the sidecar readiness, let’s change the `startupProbe` to the exec type of command: 

```yaml
startupProbe:
  exec:
    command:
    - /bin/sh
    - -c
    - sleep 15
```

and run `kubectl get pods -w` to watch in real time whether the readiness of both containers only changes after a 15 second delay. Again, events confirm the main application starts after the sidecar.
That means that using the `startupProbe` with a correct `startupProbe.httpGet` request helps to delay the main application start until the sidecar is ready. It’s not optimal, but it works.

## What about the postStart lifecycle hook?

Fun fact: using the `postStart` lifecycle hook block will also do the job, but I’d have to write my own mini-shell script, which is even less efficient.

```yaml
initContainers:
  - name: nginx
    image: nginx:latest
    restartPolicy: Always
    ports:
      - containerPort: 80
        protocol: TCP
    lifecycle:
      postStart:
        exec:
          command:
          - /bin/sh
          - -c
          - |
            echo "Waiting for readiness at http://localhost:80"
            until curl -sf http://localhost:80; do
              echo "Still waiting for http://localhost:80..."
              sleep 5
            done
            echo "Service is ready at http://localhost:80"
```

## Liveness probe

An interesting exercise would be to check the sidecar container behavior with a [liveness probe](/docs/concepts/configuration/liveness-readiness-startup-probes/).
A liveness probe behaves and is configured similarly to a readiness probe - only with the difference that it doesn’t affect the readiness of the container but restarts it in case the probe fails. 

```yaml
livenessProbe:
  exec:
    command:
    - /bin/sh
    - -c
    - exit 1 # this command always fails, keeping the container "Not Ready"
  periodSeconds: 5
```

After adding the liveness probe configured just as the previous readiness probe and checking events of the pod by `kubectl describe pod` it’s visible that the sidecar has a restart count above 0. Nevertheless, the main application is not restarted nor influenced at all, even though I'm aware that (in our imaginary worst-case scenario) it can error out when the sidecar is not there serving requests.
What if I’d used a `livenessProbe` without lifecycle `postStart`? Both containers will be immediately ready: at the beginning, this behavior will not be different from the one without any additional probes since the liveness probe doesn’t affect readiness at all. After a while, the sidecar will begin to restart itself, but it won’t influence the main container.

## Findings summary

I’ll summarize the startup behavior in the table below:

| Probe/Hook     | Sidecar starts before the main app?                      | Main app waits for the sidecar to be ready?         | What if the check doesn’t pass?                    |
|----------------|----------------------------------------------------------|-----------------------------------------------------|----------------------------------------------------|
| `readinessProbe` | **Yes**, but it’s almost in parallel (effectively **no**)    | **No**                                                  | Sidecar is not ready; main app continues running   |
| `livenessProbe`  | Yes, but it’s almost in parallel (effectively **no**)    | **No**                                                  | Sidecar is restarted, main app continues running   |
| `startupProbe`   | **Yes**                                                      | **Yes**                                                 | Main app is not started                            |
| postStart      | **Yes**, main app container starts after `postStart` completes | **Yes**, but you have to provide custom logic for that  | Main app is not started                            |

To summarize: with sidecars often being a dependency of the main application, you may want to delay the start of the latter until the sidecar is healthy.
The ideal pattern is to start both containers simultaneously and have the app container logic delay at all levels, but it’s not always possible. If that's what you need, you have to use the right kind of customization to the Pod definition. Thankfully, it’s nice and quick, and you have the recipe ready above.

Happy deploying!
