---
layout: blog
title: "Kubernetes: 1.31 KubeletEnsureSecretPulledImages feature gate"
date: 2024-07-01
slug: ensure-secret-pulled-images
author: >
  Sai Ramesh Vanka (Red Hat)
---
Reference KEP: https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/2535-ensure-secret-pulled-images
# Scenario: Enable KubeletEnsureSecretPulledImages FeatureGate

## Objective
Enable a new feature gate `KubeletEnsureSecretPulledImages` and create two pods that pull same image from a private registry (for ex: `quay.io`) with one pod configured with valid image pull credentials and another having invalid image pull credentials.
## Steps

### Step 1: Modify kubelet Configuration
First, let's modify the kubelet configuration to adjust a parameter related to Pod security.

```yaml
# File: /etc/kubernetes/kubelet.conf
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
featureGates:
  KubeletEnsureSecretPulledImages: true
pullImageSecretRecheck: true
pullImageSecretRecheckPeriod: 60s
```
In this configuration:
`KubeletEnsureSecretPulledImages: true` enables the feature gate
`pullImageSecretRecheck: true`  is a boolean to enable the recheck
`pullImageSecretRecheckPeriod: 60s`  is the duration after which the kubelet's image related cache gets invalidated
### Step 2: Create a valid and an invalid image pull secrets
Create two secrets one valid (`valid-creds`) and another invalid(`invalid-creds`) to be used while creating pods using this [reference](https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/)
### Step 3: Create two simple nginx pods that use the above image pull secrets
Now, deploy simple nginx pods that utilize the above created image pull secrets
```yaml
# File: nginx-pod.yaml
apiVersion: v1
kind: Pod
metadata:
  name: image-with-valid-creds
spec:
  containers:
  - image: quay.io/<private-repo>/nginx:latest
    name: nginx
    command: [ "sleep", "10000" ]
  imagePullSecrets:
  - name: valid-creds
---
apiVersion: v1
kind: Pod
metadata:
  name: image-with-invalid-creds
spec:
  containers:
  - image: quay.io/<private-repo>/nginx:latest
    name: nginx
    command: [ "sleep", "10000" ]
  imagePullSecrets:
  - name: invalid-creds
```
In this Pod specification:
- The nginx container is based on a private image `quay.io/<private-repo>/nginx:latest`

### Step 3: Apply Configuration
Apply the kubelet configuration and deploy the nginx Pod.
`$ kubectl apply -f nginx-pod.yaml`

### Step 4: Verify Deployment
Verify that the nginx pod with valid creds is running and the pod with invalid creds errors out.
```
$ kubectl get pods
NAME                      READY   STATUS               RESTARTS   AGE
image-with-valid-creds    1/1     Running              0          10s
image-with-invalid-creds  1/1     ErrImageNotEnsured   0          10s
```
### Step 5: Repeat the pod creation after turning off the feature gate
Modify the kubelet configuration by setting the `KubeletEnsureSecretPulledImages` feature gate to `false` and verify both the pods are `Running` successfully which is the default/current behavior.

### Conclusion
As of today, if a pod pulls an image from a private registry with valid credentials on to a node, the same can be leveraged by any another pod on the same node even without a valid image pull seceret/credentials.
This newly introduced feature would help the cluster admin to have a better access control in terms of multi tenant scenarios by allowing the access of an image only incase of having a valid credentials even if the image is already present on the node.