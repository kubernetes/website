---
object_rankings:
- object: imagePullSecrets
  rank: 1
concept_rankings:
- concept: image
  rank: 1
- concept: secret
  rank: 1
- concept: registry
  rank: 1
- concept: container
  rank: 2
- concept: pod
  rank: 2
command_rankings:
- command: kubectl create secret
  rank: 1
---

{% capture overview %}
This document explains how to pull images from a private container registry and run them inside a pod.

<!-- TODOs: Get GCR and EC2 auth instructions from here:
http://kubernetes.io/docs/user-guide/images/#using-a-private-registry
Then show these generic instructions:-->
{% endcapture %}

{% capture recommended_background %}
It is recommended you are familiar with the following concepts before continuing.

- [Pods](/docs/pod/)
- [Secrets](/docs/secret/)

{% endcapture %}


{% capture prerequisites %}
<!-- TODO: Improve these prerequisites. -->
1. Create a project.
1. Create a cluster.
{% endcapture %}


{% capture steps %}
#### 1: Obtaining access to a private registry

Use a secret to store your image registry credentials

```shell
$ kubectl create secret docker-registry myregistrykey --docker-username=janedoe --docker-password=●●●●●●●●●●● --docker-email=jdoe@example.com
secret "myregistrykey" created
```

This will store credentials compatible with most container registry providers.

#### 2: Include credentials in pod definition

Now, you can create pods which reference that secret by adding an `imagePullSecrets` section to your pod definition.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: foo
spec:
  containers:
    - name: foo
      image: janedoe/awesomeapp:v1
  imagePullSecrets:
    - name: myregistrykey
```

#### (Optional) Store .docker/config.json file as a secret

Instead of using kubectl, you can also authenticate by creating a `.docker/config.json`, such as by running `docker login <registry.domain>`,
then storing the resulting `.docker/config.json` file as a secret.

```shell
$ docker login
Username: janedoe
Password: ●●●●●●●●●●●
Email: jdoe@example.com
WARNING: login credentials saved in /Users/jdoe/.docker/config.json.
Login Succeeded

$ echo $(cat ~/.docker/config.json)
{ "https://index.docker.io/v1/": { "auth": "ZmFrZXBhc3N3b3JkMTIK", "email": "jdoe@example.com" } }

$ cat ~/.docker/config.json | base64
eyAiaHR0cHM6Ly9pbmRleC5kb2NrZXIuaW8vdjEvIjogeyAiYXV0aCI6ICJabUZyWlhCaGMzTjNiM0prTVRJSyIsICJlbWFpbCI6ICJqZG9lQGV4YW1wbGUuY29tIiB9IH0K

$ cat > /tmp/image-pull-secret.yaml <<EOF
apiVersion: v1
kind: Secret
metadata:
  name: myregistrykey
data:
  .dockerconfigjson: eyAiaHR0cHM6Ly9pbmRleC5kb2NrZXIuaW8vdjEvIjogeyAiYXV0aCI6ICJabUZyWlhCaGMzTjNiM0prTVRJSyIsICJlbWFpbCI6ICJqZG9lQGV4YW1wbGUuY29tIiB9IH0K
type: kubernetes.io/dockerconfigjson
EOF

$ kubectl create -f /tmp/image-pull-secret.yaml
secret "myregistrykey" created
```

{% endcapture %}

{% include templates/task.md %}
