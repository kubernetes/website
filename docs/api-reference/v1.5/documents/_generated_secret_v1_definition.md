## Secret v1

Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | Secret



Secret holds secret data of a certain type. The total bytes of the values in the Data field must be less than MaxSecretSize bytes.

<aside class="notice">
Appears In  <a href="#secretlist-v1">SecretList</a> </aside>

Field        | Description
------------ | -----------
apiVersion <br /> *string*  | APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#resources
data <br /> *object*  | Data contains the secret data. Each key must be a valid DNS_SUBDOMAIN or leading dot followed by valid DNS_SUBDOMAIN. The serialized form of the secret data is a base64 encoded string, representing the arbitrary (possibly non-string) data value here. Described in https://tools.ietf.org/html/rfc4648#section-4
kind <br /> *string*  | Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#types-kinds
metadata <br /> *[ObjectMeta](#objectmeta-v1)*  | Standard object's metadata. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#metadata
stringData <br /> *object*  | stringData allows specifying non-binary secret data in string form. It is provided as a write-only convenience method. All keys and values are merged into the data field on write, overwriting any existing values. It is never output when reading from the API.
type <br /> *string*  | Used to facilitate programmatic handling of secret data.

