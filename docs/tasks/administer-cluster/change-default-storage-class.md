---
title: Change the default StorageClass
---

{% capture overview %}
This page shows how to change the default Storage Class that is used to
provision volumes for PersistentVolumeClaims that have no special requirements.

{% endcapture %}

{% capture prerequisites %}

{% include task-tutorial-prereqs.md %}

{% endcapture %}

{% capture steps %}

## Why change the default storage class?

Depending on the installation method, your Kubernetes cluster may be deployed with
an existing StorageClass that is marked as default. This default StorageClass
is then used to dynamically provision storage for PersistentVolumeClaims
that do not require any specific storage class. See
[PersistentVolumeClaim documentation](/docs/concepts/storage/persistent-volumes/#class-1)
for details.

The pre-installed default StorageClass may not fit well with your expected workload;
for example, it might provision storage that is too expensive. If this is the case,
you can either change the default StorageClass or disable it completely to avoid
dynamic provisioning of storage.

Simply deleting the default StorageClass may not work, as it may be re-created
automatically by the addon manager running in your cluster. Please consult the docs for your installation
for details about addon manager and how to disable individual addons.

## Changing the default StorageClass

1. List the StorageClasses in your cluster:

       kubectl get storageclass

    The output is similar to this:

        NAME                 TYPE
        standard (default)   kubernetes.io/gce-pd
        gold                 kubernetes.io/gce-pd

   The default StorageClass is marked by `(default)`.

1. Mark the default StorageClass as non-default:

   The default StorageClass has an annotation
   `storageclass.kubernetes.io/is-default-class` set to `true`. Any other value
   or absence of the annotation is interpreted as `false`.

   To mark a StorageClass as non-default, you need to change its value to `false`:

       kubectl patch storageclass <your-class-name> -p '{"metadata": {"annotations":{"storageclass.kubernetes.io/is-default-class":"false"}}}'

    where `<your-class-name>` is the name of your chosen StorageClass.

1. Mark a StorageClass as default:

   Similarly to the previous step, you need to add/set the annotation
   `storageclass.kubernetes.io/is-default-class=true`.

       kubectl patch storageclass <your-class-name> -p '{"metadata": {"annotations":{"storageclass.kubernetes.io/is-default-class":"true"}}}'

   Please note that at most one StorageClass can be marked as default. If two
   or more of them are marked as default, Kubernetes ignores the annotation,
   i.e. it behaves as if there is no default StorageClass.

1. Verify that your chosen StorageClass is default:

       kubectl get storageclass

    The output is similar to this:

        NAME             TYPE
        standard         kubernetes.io/gce-pd
        gold (default)   kubernetes.io/gce-pd

{% endcapture %}

{% capture whatsnext %}
* Learn more about [StorageClasses](/docs/concepts/storage/persistent-volumes/).
{% endcapture %}

{% include templates/task.md %}
