---
---
# Doing a thing with a thing

{% capture purpose %}
This document teaches you how to do a thing.
{% endcapture %}

{% capture recommended_background %}
In order to do a thing, you must be familiar with the following:

- [Thing 1](/foo/)
- [Thing 2](/bar/)

{% endcapture %}

{% capture step_by_step %}
Here's how to do a thing with a thing.

#### 1. Prepare the thing

Lorem ipsum dolor it verberum.

#### 2. Run the thing command

Lorem ipsum dolor it verberum.

#### 3. Create the thing.yaml file

Lorem ipsum dolor it verberum.

```yaml
# Creates three nginx replicas
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  replicas: 3
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.7.9
        ports:
        - containerPort: 80
```

#### 4. ???

Lorem ipsum dolor it verberum.

#### 5. Profit!

Lorem ipsum dolor it verberum.

{% endcapture %}

{% include templates/task.md %}