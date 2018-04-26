---
title: Migrate a ThirdPartyResource to CustomResourceDefinition
reviewers:
- enisoc
- deads2k
---

{% capture overview %}
This page shows how to migrate data stored in a ThirdPartyResource (TPR) to a
[CustomResourceDefinition](/docs/reference/generated/kubernetes-api/{{page.version}}/#customresourcedefinition-v1beta1-apiextensions) (CRD).

Kubernetes does not automatically migrate existing TPRs.
This is due to API changes introduced as part of
[graduating to beta](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/api-machinery/thirdpartyresources.md)
under a new name and API group.
Instead, both TPR and CRD are available and operate independently in Kubernetes 1.7.
Users must migrate each TPR one by one to preserve their data before upgrading to Kubernetes 1.8.

The simplest way to migrate is to stop all clients that use a given TPR, then delete the TPR and
start from scratch with a CRD.
This page describes an optional process that eases the transition by migrating existing TPR data for
you **on a best-effort basis**.
{% endcapture %}

{% capture prerequisites %}
{% include task-tutorial-prereqs.md %}

* Make sure your Kubernetes cluster has a **master version of exactly 1.7.x** (any patch release),
  as this is the only version that supports both TPR and CRD.
* If you use a TPR-based custom controller, check with the author of the controller first.
  Some or all of these steps may be unnecessary if the custom controller handles the migration for
  you.
* Be familiar with the concept of [custom resources](/docs/concepts/api-extension/custom-resources/),
  which were known as *third-party resources* until Kubernetes 1.7.
* Be familiar with [CustomResourceDefinitions](/docs/concepts/api-extension/custom-resources/#customresourcedefinitions),
  which are a simple way to implement custom resources.
* **Before performing a migration on real data, conduct a dry run by going through these steps in a test cluster.**
{% endcapture %}

{% capture steps %}
## Migrate TPR data

1.  **Rewrite the TPR definition**

    Clients that access the REST API for your custom resource should not need any changes.
    However, you will need to rewrite your TPR definition as a CRD.

    Make sure you specify values for the CRD fields that match what the server used to fill in for
    you with TPR.

    For example, if your ThirdPartyResource looks like this:

    ```yaml
    apiVersion: extensions/v1beta1
    kind: ThirdPartyResource
    metadata:
      name: cron-tab.stable.example.com
    description: "A specification of a Pod to run on a cron style schedule"
    versions:
    - name: v1
    ```

    A matching CustomResourceDefinition could look like this:

    ```yaml
    apiVersion: apiextensions.k8s.io/v1beta1
    kind: CustomResourceDefinition
    metadata:
      name: crontabs.stable.example.com
    spec:
      scope: Namespaced
      group: stable.example.com
      version: v1
      names:
        kind: CronTab
        plural: crontabs
        singular: crontab
    ```

1.  **Install the CustomResourceDefinition**

    While the source TPR is still active, install the matching CRD with `kubectl create`.
    Existing TPR data remains accessible because TPRs take precedence over CRDs when both try
    to serve the same resource.

    After you create the CRD, make sure the *Established* condition goes to True.
    You can check it with a command like this:

    ```shell
    kubectl get crd -o 'custom-columns=NAME:{.metadata.name},ESTABLISHED:{.status.conditions[?(@.type=="Established")].status}'
    ```

    The output should look like this:

    ```console
    NAME                          ESTABLISHED
    crontabs.stable.example.com   True
    ```

1.  **Stop all clients that use the TPR**

    The API server attempts to prevent TPR data for the resource from changing while it
    copies objects to the CRD, but it can't guarantee consistency in all cases, such as with
    [multiple masters](/docs/admin/high-availability/).
    Stopping clients, such as TPR-based custom controllers, helps to avoid inconsistencies in
    the copied data.

    In addition, clients that watch TPR data do not receive any more events once the migration
    begins.
    You must restart them after the migration completes so they start watching CRD data instead.

1.  **Back up TPR data**

    In case the data migration fails, save a copy of existing data for the resource:

    ```shell
    kubectl get crontabs --all-namespaces -o yaml > crontabs.yaml
    ```

    You should also save a copy of the TPR definition if you don't have one already:

    ```shell
    kubectl get thirdpartyresource cron-tab.stable.example.com -o yaml --export > tpr.yaml
    ```

1.  **Delete the TPR definition**

    Normally, when you delete a TPR definition, the API server tries to clean up any objects stored
    in that resource.
    Because a matching CRD exists, the server copies objects to the CRD instead of deleting them.

    ```shell
    kubectl delete thirdpartyresource cron-tab.stable.example.com
    ```

1.  **Verify the new CRD data**

    It can take up to 10 seconds for the TPR controller to notice when you delete the TPR definition
    and to initiate the migration. The TPR data remains accessible during this time.

    Once the migration completes, the resource begins serving through the CRD.
    Check that all your objects were correctly copied:

    ```shell
    kubectl get crontabs --all-namespaces -o yaml
    ```

    If the copy failed, you can quickly revert to the set of objects that existed just before the
    migration by recreating the TPR definition:

    ```shell
    kubectl create -f tpr.yaml
    ```

1.  **Restart clients**

    After verifying the CRD data, restart any clients you stopped before the migration, such as
    custom controllers and other watchers.
    These clients now access CRD data when they make requests on the same API endpoints
    that the TPR previously served.
{% endcapture %}

{% capture whatsnext %}
* Learn more about [custom resources](/docs/concepts/api-extension/custom-resources/).
* Learn more about [using CustomResourceDefinitions](/docs/tasks/access-kubernetes-api/extend-api-custom-resource-definitions/).
* See [CustomResourceDefinition](/docs/reference/generated/kubernetes-api/{{page.version}}/#customresourcedefinition-v1beta1-apiextensions).
{% endcapture %}

{% include templates/task.md %}
