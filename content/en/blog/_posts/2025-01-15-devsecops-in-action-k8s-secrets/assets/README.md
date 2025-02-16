# `Assets`
Copyright 2025 The Kubernetes Authors.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

This file related to the article "DevSecOps in Action: Kubernetes Secrets"
https://kubernetes.io/blog/2025/01/15/devsecops-in-action-k8s-secrets/

## `Usage`

### `Preparing`

#### `minikube`

```bash
minikube start
eval $(minikube docker-env)
minikube tunnel 2>&1 > /dev/null &
export MINIKUBE__EXT_IP=$(minikube kubectl -- get svc demo-secret --output jsonpath='{.status.loadBalancer.ingress[0].ip}')
```

### `Deploying`

In order to build example it's necessary to select folder (e.g baseline).

**Folder name is tag for container image.**

#### `Building`


```
cd assets/baseline
docker build --rm -t demo-secret:baseline .
```

or

```
cd assets/stage-01
docker build --rm -t demo-secret:stage-01 .
```

#### `Installing/Uninstalling`

```bash
kubectl kustomize kustomization/overlays/demo/ | minikube kubectl -- apply -f-
kubectl kustomize kustomization/overlays/demo/ | minikube kubectl -- delete -f-
```

#### `Checking`

```bash
curl $MINIKUBE__EXT_IP
```

## `References`

- [minikube start](https://minikube.sigs.k8s.io/docs/start/)
- [minikube tunnel](https://minikube.sigs.k8s.io/docs/commands/tunnel/)

