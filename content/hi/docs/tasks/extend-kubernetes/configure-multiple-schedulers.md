---
title: एकाधिक स्केड्यूलर्स कॉन्फ़िगर करें
content_type: task
weight: 20
---

<!-- overview -->
कुबेरनेट्स में, आप एक ही क्लस्टर में एकाधिक स्केड्यूलर्स चला सकते हैं। आप एक मुख्य स्केड्यूलर के साथ एक कस्टम स्केड्यूलर चला सकते हैं। पॉड्स को कस्टम स्केड्यूलर द्वारा स्केड्यूल करने के लिए, आप उन पॉड्स के स्पेसिफिकेशन में स्केड्यूलर का नाम निर्दिष्ट करते हैं।

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

## स्केड्यूलर कोड को डाउनलोड करें

1. स्केड्यूलर कोड को डाउनलोड करें:

```bash
git clone https://github.com/kubernetes/kubernetes.git
cd kubernetes
```

2. एक कस्टम स्केड्यूलर बनाएं जो निम्नलिखित कोड से बना हो:

```go
package main

import (
    "fmt"
    "os"

    "k8s.io/kubernetes/cmd/kube-scheduler/app"
)

func main() {
    command := app.NewSchedulerCommand(
        app.WithPlugin("multipoint", multipoint.New),
    )
    if err := command.Execute(); err != nil {
        fmt.Fprintf(os.Stderr, "%v\n", err)
        os.Exit(1)
    }
}
```

3. स्केड्यूलर को बिल्ड करें:

```bash
go build -o my-scheduler
```

## स्केड्यूलर को डिप्लॉय करें

स्केड्यूलर को क्लस्टर में डिप्लॉय करने के लिए, आप एक कुबेरनेट्स डिप्लॉयमेंट का उपयोग कर सकते हैं। यहाँ एक उदाहरण है:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-scheduler
  namespace: kube-system
spec:
  replicas: 1
  selector:
    matchLabels:
      component: scheduler
      tier: control-plane
  template:
    metadata:
      labels:
        component: scheduler
        tier: control-plane
    spec:
      serviceAccountName: my-scheduler-sa
      containers:
      - name: my-scheduler
        image: my-scheduler:latest
        imagePullPolicy: Never
        livenessProbe:
          httpGet:
            path: /healthz
            port: 10251
          initialDelaySeconds: 15
        readinessProbe:
          httpGet:
            path: /healthz
            port: 10251
          initialDelaySeconds: 5
```

## स्केड्यूलर को कॉन्फ़िगर करें

स्केड्यूलर को कॉन्फ़िगर करने के लिए, आप एक कॉन्फ़िगमैप बना सकते हैं:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: my-scheduler-config
  namespace: kube-system
data:
  scheduler-config.yaml: |
    apiVersion: kubescheduler.config.k8s.io/v1beta1
    kind: KubeSchedulerConfiguration
    profiles:
    - schedulerName: my-scheduler
      plugins:
        score:
          enabled:
          - name: NodeResourcesBalancedAllocation
            weight: 1
          - name: NodeResourcesLeastAllocated
            weight: 1
```

## स्केड्यूलर का उपयोग करें

पॉड्स को कस्टम स्केड्यूलर द्वारा स्केड्यूल करने के लिए, आप उन पॉड्स के स्पेसिफिकेशन में `schedulerName` फ़ील्ड निर्दिष्ट करते हैं:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
spec:
  schedulerName: my-scheduler
  containers:
  - name: nginx
    image: nginx
```

## {{% heading "whatsnext" %}}

* [स्केड्यूलर प्रोफ़ाइल्स](/docs/reference/scheduling/config#scheduling-profiles) के बारे में जानें
* [स्केड्यूलर प्लगइन्स](/docs/reference/scheduling/config#scheduling-plugins) के बारे में जानें
* [स्केड्यूलर कॉन्फ़िगरेशन](/docs/reference/scheduling/config) के बारे में जानें 