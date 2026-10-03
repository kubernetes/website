---
reviewers:
- jpeeler
- pmorie
title: Storage के लिए Projected Volume उपयोग करने हेतु Pod कॉन्फ़िगर करें
content_type: task
weight: 100
---

<!-- overview -->
यह पेज दिखाता है कि एक ही directory में कई मौजूदा volume sources को mount करने के लिए
[`projected`](/docs/concepts/storage/volumes/#projected) Volume का उपयोग कैसे करें।
वर्तमान में `secret`, `configMap`, `downwardAPI` और `serviceAccountToken` volumes को project किया जा सकता है।

{{< note >}}
`serviceAccountToken` कोई volume type नहीं है।
{{< /note >}}


## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}


<!-- steps -->
## Pod के लिए projected volume कॉन्फ़िगर करें

इस अभ्यास में आप local files से username और password वाले {{< glossary_tooltip text="Secrets" term_id="secret" >}} बनाते हैं।
फिर आप एक ऐसा Pod बनाते हैं जिसमें एक container चलता है, और [`projected`](/docs/concepts/storage/volumes/#projected) Volume का उपयोग करके
Secrets को उसी shared directory में mount किया जाता है।

यह Pod की configuration file है:

{{% code_sample file="pods/storage/projected.yaml" %}}

1. Secrets बनाएं:

    ```shell
    # Create files containing the username and password:
    echo -n "admin" > ./username.txt
    echo -n "1f2d1e2e67df" > ./password.txt

    # Package these files into secrets:
    kubectl create secret generic user --from-file=./username.txt
    kubectl create secret generic pass --from-file=./password.txt
    ```
1. Pod बनाएं:

    ```shell
    kubectl apply -f https://k8s.io/examples/pods/storage/projected.yaml
    ```
1. जांचें कि Pod का container चल रहा है, और फिर Pod में होने वाले बदलाव देखें:

    ```shell
    kubectl get --watch pod test-projected-volume
    ```
    आउटपुट इस तरह दिखेगा:
    ```
    NAME                    READY     STATUS    RESTARTS   AGE
    test-projected-volume   1/1       Running   0          14s
    ```
1. दूसरे terminal में, चल रहे container का shell खोलें:

    ```shell
    kubectl exec -it test-projected-volume -- /bin/sh
    ```
1. अपनी shell में, जांचें कि `projected-volume` directory में आपके projected sources मौजूद हैं:

    ```shell
    ls /projected-volume/
    ```

## साफ़-सफ़ाई

Pod और Secrets हटाएँ:

```shell
kubectl delete pod test-projected-volume
kubectl delete secret user pass
```



## {{% heading "whatsnext" %}}

* [`projected`](/docs/concepts/storage/volumes/#projected) volumes के बारे में और जानें।
* [all-in-one volume](https://git.k8s.io/design-proposals-archive/node/all-in-one-volume.md) design document पढ़ें।
