---
title: Pull an Image from Google Cloud Registry
---

{% capture overview %}

If you store your container images in a private Google Cloud Registry (GCR), you might want to pull them into a project that you deploy on a different platform. To do this, you add an ``ImagePullSecrets`` field to the configuration for a Kubernetes service account. This is a type of Kubernetes secret that contains credential information.

To create this secret, we recommend that you create a GCP service account and use its keys to pull from GCR. These keys are stored in a JSON key file. This approach lets you store long-lived credentials, instead of passing short-lived access tokens.

NOTE: A GCP service account is different from a Kubernetes service account.

NOTE: Clusters on Google Container Engine (GKE) do not need to configure these secrets.

{% endcapture %}

{% capture prerequisites %}

{% include task-tutorial-prereqs.md %}

* You need a Docker image stored on GCR. For instructions, see the [Quickstart for GCR](https://cloud.google.com/container-registry/docs/quickstart).

{% endcapture %}

{% capture steps %}

## Create JSON key file

You can create the file with the following script. The script creates the necessary GCP service account and gives it access to the registry. In this case, we create a file named `k8s-gcr-auth-ro`.

```shell
# create a GCP service account; format of account is email address
SA_EMAIL=$(gcloud iam service-accounts --format='value(email)' create k8s-gcr-auth-ro)
# create the json key file and associate it with the service account
gcloud iam service-accounts keys create k8s-gcr-auth-ro.json --iam-account=$SA_EMAIL
# get the project id
PROJECT=$(gcloud config list core/project --format='value(core.project)')
# add the IAM policy binding for the defined project and service account
gcloud projects add-iam-policy-binding $PROJECT --member serviceAccount:$SA_EMAIL --role roles/storage.objectViewer
```

where the value `k8s-gcr-auth-ro` is the name of the JSON key file.

## Create Secret

Then create the Secret and specify the file that you just created:

```shell
kubectl create secret docker-registry gcr.io \
  --docker-username=_json_key \
  --docker-email=user@example.com \
  --docker-password="$(cat k8s-gcr-auth-ro.json)"
```

where:

* `gcr.io` is the name of the Secret. The name can contain only lower case alphanumeric characters, '-' or '.', and must start and end with an alphanumeric character. Regex for validation is `'[a-z0-9]([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*'`.
* docker-username must be set to `_json_key`
* docker-email must be any well-formed email address (not used, but required)       
* docker-password is the contents of the json key file that you created in the previous script

## Add Secret to Kubernetes configuration

You can specify the `imagePullSecrets` value either by including it in a Pod configuration file, or by patching the appropriate service account.

### Include your Secret in a Pod configuration file

Here is a configuration file for a Pod that specifies the Secret for your GCR image:

```yaml
apiVersion: v1
kind: Pod
metadata: 
  name: private-reg
spec:
  containers:
    - name: private-reg-container
      image: gcr.io/<registry_name>/<image_name>:<tagname>
  imagePullSecrets:
      - name: gcr.io
```

Copy the contents of this file to your own file named `my-private-reg-pod.yaml`. In your file, replace the container image path with the path to your image in a private GCR registry. Example image path:

```
gcr.io/janedoe/jdoe-private:v1
```

Create a Pod that uses your Secret, and verify that the Pod is running: 

```
kubectl create -f my-private-reg-pod.yaml
kubectl get pod private-reg
```

### Patch a service account

You can add the `imagePullSecrets` value to the default service account with the following command:

```shell
kubectl patch serviceaccount default \
  -p '{"imagePullSecrets": [{"name": "gcr.io"}]}'
```

If you work with only the default service account, then all pods in the namespace pull images from the private registry. This is the case whether or not you explicitly specify the service account in the pod spec. If you work with multiple service accounts, each service account must provide the appropriate `imagePullSecrets` value. For more information, see how to [Configure Service Accounts for Pods](https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/).

After you add your `imagePullSecrets` value, the YAML for the default service account looks like the following:

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: default
  namespace: default
  selfLink: /api/v1/namespaces/default/serviceaccounts/default
imagePullSecrets:
  - name: <secret_name>
```

{% endcapture %}

{% capture whatsnext %}

* Learn more about [Secrets](/docs/concepts/configuration/secret/).
* Learn more about
[using a private registry](/docs/concepts/containers/images/#using-a-private-registry).
* See [Pull an Image from a Private Docker Registry](/docs/tasks/configure-pod-container/pull-image-private-registry).
* See [Pull an Image from Amazon EC2 Container Registry](/docs/tasks/configure-pod-container/pull-image-ecr).
* See [kubectl create secret docker-registry](/docs/user-guide/kubectl/v1.6/#-em-secret-docker-registry-em-).
* See [Secret](/docs/api-reference/v1.6/#secret-v1-core).
* See the `imagePullSecrets` field of
[PodSpec](/docs/api-reference/v1.6/#podspec-v1-core).

{% endcapture %}

{% include templates/task.md %}