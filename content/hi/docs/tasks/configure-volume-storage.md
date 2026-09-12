---
title: Storage के लिए Volume उपयोग करने हेतु Pod कॉन्फ़िगर करें
content_type: task
weight: 80
---

<!-- overview -->

यह पेज दिखाता है कि storage के लिए Volume उपयोग करने हेतु Pod को कैसे कॉन्फ़िगर करें।

किसी Container का file system केवल उतनी देर तक रहता है जितनी देर Container रहता है।
इसलिए जब कोई Container terminate होकर फिर restart होता है, तो filesystem में किए गए बदलाव खो जाते हैं।
Container से स्वतंत्र और अधिक consistent storage के लिए आप
[Volume](/docs/concepts/storage/volumes/) का उपयोग कर सकते हैं।
यह stateful applications (जैसे key-value stores, उदाहरण के लिए Redis, और databases) के लिए
विशेष रूप से महत्वपूर्ण है।

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## Pod के लिए volume कॉन्फ़िगर करें

इस अभ्यास में आप ऐसा Pod बनाते हैं जिसमें एक Container चलता है। इस Pod में
[emptyDir](/docs/concepts/storage/volumes/#emptydir) प्रकार का Volume होता है
जो Pod के जीवनकाल तक बना रहता है, भले ही Container terminate होकर restart हो जाए।
यह Pod की configuration file है:

{{% code_sample file="pods/storage/redis.yaml" %}}

1. Pod बनाएं:

   ```shell
   kubectl apply -f https://k8s.io/examples/pods/storage/redis.yaml
   ```

1. जांचें कि Pod का Container चल रहा है, और फिर Pod में होने वाले बदलाव देखें:

   ```shell
   kubectl get pod redis --watch
   ```

   आउटपुट इस तरह दिखेगा:

   ```console
   NAME      READY     STATUS    RESTARTS   AGE
   redis     1/1       Running   0          13s
   ```

1. दूसरे terminal में, चल रहे Container का shell खोलें:

   ```shell
   kubectl exec -it redis -- /bin/bash
   ```

1. अपनी shell में `/data/redis` पर जाएँ, और फिर एक फ़ाइल बनाएं:

   ```shell
   root@redis:/data# cd /data/redis/
   root@redis:/data/redis# echo Hello > test-file
   ```

1. अपनी shell में चल रही processes की सूची देखें:

   ```shell
   root@redis:/data/redis# apt-get update
   root@redis:/data/redis# apt-get install procps
   root@redis:/data/redis# ps aux
   ```

   आउटपुट इस तरह होगा:

   ```console
   USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
   redis        1  0.1  0.1  33308  3828 ?        Ssl  00:46   0:00 redis-server *:6379
   root        12  0.0  0.0  20228  3020 ?        Ss   00:47   0:00 /bin/bash
   root        15  0.0  0.0  17500  2072 ?        R+   00:48   0:00 ps aux
   ```

1. अपनी shell में Redis process को kill करें:

   ```shell
   root@redis:/data/redis# kill <pid>
   ```

   जहाँ `<pid>` Redis process ID (PID) है।

1. अपने मूल terminal में Redis Pod में होने वाले बदलाव देखें। अंततः
   आपको कुछ ऐसा दिखाई देगा:

   ```console
   NAME      READY     STATUS     RESTARTS   AGE
   redis     1/1       Running    0          13s
   redis     0/1       Completed  0         6m
   redis     1/1       Running    1         6m
   ```

इस बिंदु पर Container terminate होकर restart हो चुका है। ऐसा इसलिए है क्योंकि
Redis Pod की
[restartPolicy](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core)
`Always` है।

1. restarted Container के अंदर shell खोलें:

   ```shell
   kubectl exec -it redis -- /bin/bash
   ```

1. अपनी shell में `/data/redis` पर जाएँ, और सत्यापित करें कि `test-file` अभी भी मौजूद है।

   ```shell
   root@redis:/data/redis# cd /data/redis/
   root@redis:/data/redis# ls
   test-file
   ```

1. इस अभ्यास के लिए बनाया गया Pod हटाएं:

   ```shell
   kubectl delete pod redis
   ```

## {{% heading "whatsnext" %}}

- [Volume](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#volume-v1-core) देखें।

- [Pod](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#pod-v1-core) देखें।

- `emptyDir` द्वारा दिए गए local disk storage के अलावा, Kubernetes कई प्रकार के
  network-attached storage solutions को सपोर्ट करता है, जिनमें GCE पर PD और EC2 पर EBS शामिल हैं।
  ये critical data के लिए अधिक उपयुक्त हैं और nodes पर devices को mount/unmount करने जैसे
  विवरण संभालते हैं। अधिक जानकारी के लिए
  [Volumes](/docs/concepts/storage/volumes/) देखें।
