# `Assets`

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

#### `Change version`

```bash
git checkout tags/baseline

or

git checkout tags/stage-01

or

git checkout tags/stage-02

or

git checkout tags/stage-03
```

#### `Building`

```
docker build --rm -t demo-secret:baseline .
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

