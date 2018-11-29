---
reviewers:
- enisoc
- IanLewis
title: Extend the Kubernetes API with ThirdPartyResources
---

{% assign for_k8s_version="1.7" %}{% include feature-state-deprecated.md %}

* TOC
{:toc}

## What is ThirdPartyResource?

**ThirdPartyResource is deprecated as of Kubernetes 1.7 and has been removed in version 1.8 in
accordance with the [deprecation policy](/docs/reference/deprecation-policy) for beta features.**

**To avoid losing data stored in ThirdPartyResources, you must
[migrate to CustomResourceDefinition](/docs/tasks/access-kubernetes-api/migrate-third-party-resource/)
before upgrading to Kubernetes 1.8 or higher.**

Kubernetes comes with many built-in API objects. However, there are often times when you might need to extend Kubernetes with your own API objects in order to do custom automation.

`ThirdPartyResource` objects are a way to extend the Kubernetes API with a new API object type. The new API object type will be given an API endpoint URL and support CRUD operations, and watch API. You can then create custom objects using this API endpoint. You can think of `ThirdPartyResources` as being much like the schema for a database table. Once you have created the table, you can then start storing rows in the table. Once created, `ThirdPartyResources` can act as the data model behind custom controllers or automation programs.

## Structure of a ThirdPartyResource

Each `ThirdPartyResource` has the following:

   * `metadata` - Standard Kubernetes object metadata.
   * `kind` - The kind of the resources described by this third party resource.
   * `description` - A free text description of the resource.
   * `versions` - A list of the versions of the resource.

The `kind` for a `ThirdPartyResource` takes the form `<kind name>.<domain>`. You are expected to provide a unique kind and domain name in order to avoid conflicts with other `ThirdPartyResource` objects. Kind names will be converted to CamelCase when creating instances of the `ThirdPartyResource`. Hyphens in the `kind` are assumed to be word breaks. For instance the kind `camel-case` would be converted to `CamelCase` but `camelcase` would be converted to `Camelcase`.

Other fields on the `ThirdPartyResource` are treated as custom data fields. These fields can hold arbitrary JSON data and have any structure.

You can view the full documentation about `ThirdPartyResources` using the `explain` command in kubectl.

```
$ kubectl explain thirdpartyresource
```

## Creating a ThirdPartyResource

When you create a new `ThirdPartyResource`, the Kubernetes API Server reacts by creating a new, namespaced RESTful resource path. For now, non-namespaced objects are not supported. As with existing built-in objects, deleting a namespace deletes all custom objects in that namespace. `ThirdPartyResources` themselves are non-namespaced and are available to all namespaces.

For example, if you save the following `ThirdPartyResource` to `resource.yaml`:

```yaml
apiVersion: extensions/v1beta1
kind: ThirdPartyResource
metadata:
  name: cron-tab.stable.example.com
description: "A specification of a Pod to run on a cron style schedule"
versions:
- name: v1
```

And create it:

```shell
$ kubectl create -f resource.yaml
thirdpartyresource "cron-tab.stable.example.com" created
```

Then a new RESTful API endpoint is created at:

`/apis/stable.example.com/v1/namespaces/<namespace>/crontabs/...`

This endpoint URL can then be used to create and manage custom objects.
The `kind` of these objects will be `CronTab` following the camel case
rules applied to the `metadata.name` of this `ThirdPartyResource`
(`cron-tab.stable.example.com`)

## Creating Custom Objects

After the `ThirdPartyResource` object has been created you can create custom objects. Custom objects can contain custom fields. These fields can contain arbitrary JSON.
In the following example, a `cronSpec` and `image` custom fields are set to the custom object of kind `CronTab`.  The kind `CronTab` is derived from the
`metadata.name` of the `ThirdPartyResource` object we created above.

If you save the following YAML to `my-crontab.yaml`:

```yaml
apiVersion: "stable.example.com/v1"
kind: CronTab
metadata:
  name: my-new-cron-object
cronSpec: "* * * * /5"
image: my-awesome-cron-image
```

and create it:

```shell
$ kubectl create -f my-crontab.yaml
crontab "my-new-cron-object" created
```

You can then manage our `CronTab` objects using kubectl. Note that resource names are not case-sensitive when using kubectl:

```shell
$ kubectl get crontab
NAME                 KIND
my-new-cron-object   CronTab.v1.stable.example.com
```

You can also view the raw JSON data. Here you can see that it contains the custom `cronSpec` and `image` fields from the yaml you used to create it:

```yaml
$ kubectl get crontab -o json
{
    "apiVersion": "v1",
    "items": [
        {
            "apiVersion": "stable.example.com/v1",
            "cronSpec": "* * * * /5",
            "image": "my-awesome-cron-image",
            "kind": "CronTab",
            "metadata": {
                "creationTimestamp": "2016-09-29T04:59:00Z",
                "name": "my-new-cron-object",
                "namespace": "default",
                "resourceVersion": "12601503",
                "selfLink": "/apis/stable.example.com/v1/namespaces/default/crontabs/my-new-cron-object",
                "uid": "6f65e7a3-8601-11e6-a23e-42010af0000c"
            }
        }
    ],
    "kind": "List",
    "metadata": {},
    "resourceVersion": "",
    "selfLink": ""
}
```

## What's next

* [Migrate a ThirdPartyResource to a CustomResourceDefinition](/docs/tasks/access-kubernetes-api/migrate-third-party-resource/)
* [Extend the Kubernetes API with CustomResourceDefinitions](/docs/tasks/access-kubernetes-api/extend-api-custom-resource-definitions/)
* [ThirdPartyResource](https://v1-7.docs.kubernetes.io/docs/reference/v1.7/#thirdpartyresource-v1beta1-extensions)
