## OwnerReference v1

Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | OwnerReference

> Example yaml coming soon...



OwnerReference contains enough information to let you identify an owning object. Currently, an owning object must be in the same namespace, so there is no namespace field.

<aside class="notice">
Appears In  <a href="#objectmeta-v1">ObjectMeta</a> </aside>

Field        | Description
------------ | -----------
apiVersion <br /> *string* | API version of the referent.
controller <br /> *boolean* | If true, this reference points to the managing controller.
kind <br /> *string* | Kind of the referent. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#types-kinds
name <br /> *string* | Name of the referent. More info: http://kubernetes.io/docs/user-guide/identifiers#names
uid <br /> *string* | UID of the referent. More info: http://kubernetes.io/docs/user-guide/identifiers#uids

