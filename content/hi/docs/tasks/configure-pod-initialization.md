---
title: Pod Initialization कॉन्फ़िगर करें
content_type: task
weight: 170
---

<!-- overview -->

यह पेज दिखाता है कि किसी एप्लिकेशन Container के चलने से पहले Pod को initialize करने के लिए
Init Container का उपयोग कैसे करें।

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## ऐसा Pod बनाएं जिसमें Init Container हो

इस अभ्यास में आप ऐसा Pod बनाते हैं जिसमें एक application Container और एक
Init Container होता है। application container शुरू होने से पहले init container
पूरा चलकर समाप्त हो जाता है।

यह Pod की configuration file है:

{{% code_sample file="pods/init-containers.yaml" %}}

configuration file में आप देख सकते हैं कि Pod में एक Volume है जिसे init
container और application container share करते हैं।

init container shared Volume को `/work-dir` पर mount करता है, और application container
shared Volume को `/usr/share/nginx/html` पर mount करता है। init container नीचे दी गई कमांड चलाता है
और फिर समाप्त हो जाता है:

```shell
wget -O /work-dir/index.html http://info.cern.ch
```

ध्यान दें कि init container, nginx server की root directory में `index.html` फ़ाइल लिखता है।

Pod बनाएं:

```shell
kubectl apply -f https://k8s.io/examples/pods/init-containers.yaml
```

जांचें कि nginx container चल रहा है:

```shell
kubectl get pod init-demo
```

आउटपुट दिखाता है कि nginx container चल रहा है:

```
NAME        READY     STATUS    RESTARTS   AGE
init-demo   1/1       Running   0          1m
```

init-demo Pod में चल रहे nginx container के अंदर shell खोलें:

```shell
kubectl exec -it init-demo -- /bin/bash
```

अपनी shell में, nginx server पर GET request भेजें:

```
root@nginx:~# apt-get update
root@nginx:~# apt-get install curl
root@nginx:~# curl localhost
```

आउटपुट दिखाता है कि nginx वही web page serve कर रहा है जिसे init container ने लिखा था:

```html
<html><head></head><body><header>
<title>http://info.cern.ch</title>
</header>

<h1>http://info.cern.ch - home of the first website</h1>
  ...
  <li><a href="http://info.cern.ch/hypertext/WWW/TheProject.html">Browse the first website</a></li>
  ...
```

## {{% heading "whatsnext" %}}

* इसके बारे में और जानें:
  [एक ही Pod में चल रहे Containers के बीच communication](/docs/tasks/access-application-cluster/communicate-containers-same-pod-shared-volume/)।
* [Init Containers](/docs/concepts/workloads/pods/init-containers/) के बारे में और जानें।
* [Volumes](/docs/concepts/storage/volumes/) के बारे में और जानें।
* [Debugging Init Containers](/docs/tasks/debug/debug-application/debug-init-containers/) के बारे में और जानें।
