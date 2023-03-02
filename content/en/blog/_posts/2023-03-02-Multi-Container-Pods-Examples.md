---
layout: blog
title: "Multi-Containers Pods Examples and Explanations"
date: 2023-03-02
slug: Init-Containers-Example
---

## A sidecar container performs some task that helps the main container.

That is an example of a Pod with a sidecar container that interacts with the main container using a shared volume :

````
apiVersion: v1
kind: Pod
metadata:
  name: sidecar-cont
spec:
  containers:
  - name: busybox
    image: busybox:stable
    command: ['sh', '-c', 'echo "I am the main container!" > /output/data.txt; while true; do sleep 5; done']
    volumeMounts:
    - name: shared-vol
      mountPath: /output
  - name: sidecar
    image: busybox:stable
    command: ['sh', '-c', 'while true; do cat /input/data.txt; sleep 5; done']
    volumeMounts:
    - name: shared-voll
      mountPath: /input
  volumes:
  - name: shared-vol
    emptyDir: {}
````



If you check the logs for the sidecar container, you should be able to see the data that was written by the main container.


## An ambassador container proxies network traffic to and/or from the main container.

That is an example of a Pod with an ambassador container that interacts with the main container via shared network resources :

````
apiVersion: v1
kind: Pod
metadata:
  name: ambassador-webserver
  labels:
    app: ambassador-ex
spec:
  containers:
  - name: nginx
    image: nginx:stable
    ports:
    - containerPort: 80

---

apiVersion: v1
kind: Service
metadata:
  name: ambassador-svc
spec:
  selector:
    app: ambassador-ex
  ports:
  - protocol: TCP
    port: 8081
    targetPort: 80

---

apiVersion: v1
kind: ConfigMap
metadata:
  name: ambassador-config
data:
  haproxy.cfg: |
    frontend ambassador
      bind *:8080
      default_backend ambassador_svc
    backend ambassador_svc
      server svc ambassador-svc:8081

---

apiVersion: v1
kind: Pod
metadata:
  name: ambassador-cont
spec:
  containers:
  - name: busybox
    image: radial/busyboxplus:curl
    command: ['sh', '-c', 'while true; do curl localhost:8080; sleep 5; done']
  - name: ambassador
    image: haproxy:2.4
    volumeMounts:
    - name: config
      mountPath: /usr/local/etc/haproxy/
  volumes:
  - name: config
    configMap:
      name: ambassador-config
````

You can check the logs for the main Pod `busybox` to verify that the setup is working


## An adapter container transforms the main container’s output.
