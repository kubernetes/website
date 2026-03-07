/*
Copyright 2016 The Kubernetes Authors.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

package examples_test

import (
	"bytes"
	"encoding/json"
	"fmt"
	"gopkg.in/yaml.v3"
	"io"
	"os"
	"path/filepath"
	"slices"
	"strings"
	"testing"

	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/runtime"
	"k8s.io/apimachinery/pkg/runtime/schema"
	"k8s.io/apimachinery/pkg/types"
	"k8s.io/apimachinery/pkg/util/validation/field"
	"k8s.io/kubernetes/pkg/api/legacyscheme"

	"k8s.io/kubernetes/pkg/apis/admissionregistration"
	admreg_validation "k8s.io/kubernetes/pkg/apis/admissionregistration/validation"

	"k8s.io/kubernetes/pkg/apis/apps"
	apps_validation "k8s.io/kubernetes/pkg/apis/apps/validation"

	"k8s.io/kubernetes/pkg/apis/autoscaling"
	autoscaling_validation "k8s.io/kubernetes/pkg/apis/autoscaling/validation"

	"k8s.io/kubernetes/pkg/apis/batch"
	batch_validation "k8s.io/kubernetes/pkg/apis/batch/validation"

	api "k8s.io/kubernetes/pkg/apis/core"
	"k8s.io/kubernetes/pkg/apis/core/validation"

	"k8s.io/kubernetes/pkg/apis/flowcontrol"
	flowcontrol_validation "k8s.io/kubernetes/pkg/apis/flowcontrol/validation"

	"k8s.io/kubernetes/pkg/apis/networking"
	networking_validation "k8s.io/kubernetes/pkg/apis/networking/validation"

	"k8s.io/kubernetes/pkg/apis/policy"
	policy_validation "k8s.io/kubernetes/pkg/apis/policy/validation"

	"k8s.io/kubernetes/pkg/apis/rbac"
	rbac_validation "k8s.io/kubernetes/pkg/apis/rbac/validation"

	"k8s.io/kubernetes/pkg/apis/resource"
	resource_validation "k8s.io/kubernetes/pkg/apis/resource/validation"

	"k8s.io/kubernetes/pkg/apis/scheduling"
	scheduling_validation "k8s.io/kubernetes/pkg/apis/scheduling/validation"

	"k8s.io/kubernetes/pkg/apis/storage"
	storage_validation "k8s.io/kubernetes/pkg/apis/storage/validation"

	"k8s.io/kubernetes/pkg/capabilities"

	// initialize install packages
	_ "k8s.io/kubernetes/pkg/apis/admissionregistration/install"
	_ "k8s.io/kubernetes/pkg/apis/apps/install"
	_ "k8s.io/kubernetes/pkg/apis/autoscaling/install"
	_ "k8s.io/kubernetes/pkg/apis/batch/install"
	_ "k8s.io/kubernetes/pkg/apis/core/install"
	_ "k8s.io/kubernetes/pkg/apis/flowcontrol/install"
	_ "k8s.io/kubernetes/pkg/apis/networking/install"
	_ "k8s.io/kubernetes/pkg/apis/policy/install"
	_ "k8s.io/kubernetes/pkg/apis/rbac/install"
	_ "k8s.io/kubernetes/pkg/apis/resource/install"
	_ "k8s.io/kubernetes/pkg/apis/scheduling/install"
	_ "k8s.io/kubernetes/pkg/apis/storage/install"
)

var (
	Groups     map[string]TestGroup
	serializer runtime.SerializerInfo
)

var kindObjs = map[string]runtime.Object{
	"ClusterRole":        &rbac.ClusterRole{},
	"ClusterRoleBinding": &rbac.ClusterRoleBinding{},
	"ConfigMap":          &api.ConfigMap{},
	"CronJob":            &batch.CronJob{},
	// "CustomResourceDefinition":         &apiextensions.CustomResourceDefinition{},
	"DaemonSet":                        &apps.DaemonSet{},
	"Deployment":                       &apps.Deployment{},
	"DeviceClass":                      &resource.DeviceClass{},
	"FlowSchema":                       &flowcontrol.FlowSchema{},
	"HorizontalPodAutoscaler":          &autoscaling.HorizontalPodAutoscaler{},
	"Ingress":                          &networking.Ingress{},
	"IngressClass":                     &networking.IngressClass{},
	"Job":                              &batch.Job{},
	"LimitRange":                       &api.LimitRange{},
	"MutatingAdmissionPolicy":          &admissionregistration.MutatingAdmissionPolicy{},
	"Namespace":                        &api.Namespace{},
	"NetworkPolicy":                    &networking.NetworkPolicy{},
	"PersistentVolume":                 &api.PersistentVolume{},
	"PersistentVolumeClaim":            &api.PersistentVolumeClaim{},
	"Pod":                              &api.Pod{},
	"PodDisruptionBudget":              &policy.PodDisruptionBudget{},
	"PriorityClass":                    &scheduling.PriorityClass{},
	"ReplicaSet":                       &apps.ReplicaSet{},
	"ReplicationController":            &api.ReplicationController{},
	"ResourceClaim":                    &resource.ResourceClaim{},
	"ResourceClaimTemplate":            &resource.ResourceClaimTemplate{},
	"ResourceQuota":                    &api.ResourceQuota{},
	"Role":                             &rbac.Role{},
	"RoleBinding":                      &rbac.RoleBinding{},
	"Secret":                           &api.Secret{},
	"Service":                          &api.Service{},
	"ServiceAccount":                   &api.ServiceAccount{},
	"StatefulSet":                      &apps.StatefulSet{},
	"StorageClass":                     &storage.StorageClass{},
	"ValidatingAdmissionPolicy":        &admissionregistration.ValidatingAdmissionPolicy{},
	"ValidatingAdmissionPolicyBinding": &admissionregistration.ValidatingAdmissionPolicyBinding{},
}

// Note a key in the following map has to be complete relative path
var filesIgnore = []string{
	"admin/konnectivity/egress-selector-configuration.yaml",
	"audit/audit-policy.yaml",
	// The registration of this API group has some problems
	"customresourcedefinition/shirt-resource-definition.yaml",
	// This is an raw example
	"customresourcedefinition/shirt-resources.yaml",
	// kind.x-k8s.io group not recognizable
	"pods/security/seccomp/kind.yaml",
	// PSP is dropped in v1.29, do not validate them
	"policy/baseline-psp.yaml",
	"policy/example-psp.yaml",
	"policy/privileged-psp.yaml",
	"policy/restricted-psp.yaml",
	// TODO: FlowSchema cannot be validated
	"priority-and-fairness/list-events-default-service-account.yaml",
	"priority-and-fairness/health-for-strangers.yaml",
	// NOTE: The following Secret manifest cannot pass because the field values
	// in it are not BASE64 encoded
	"secret/tls-auth-secret.yaml",
}

// TestGroup contains GroupVersion to uniquely identify the API
type TestGroup struct {
	externalGroupVersion schema.GroupVersion
}

// GroupVersion makes copy of schema.GroupVersion
func (g TestGroup) GroupVersion() *schema.GroupVersion {
	copyOfGroupVersion := g.externalGroupVersion
	return &copyOfGroupVersion
}

// Codec returns the codec for the API version to test against
func (g TestGroup) Codec() runtime.Codec {
	if serializer.Serializer == nil {
		return legacyscheme.Codecs.LegacyCodec(g.externalGroupVersion)
	}
	return legacyscheme.Codecs.CodecForVersions(serializer.Serializer, legacyscheme.Codecs.UniversalDeserializer(), schema.GroupVersions{g.externalGroupVersion}, nil)
}

func initGroups() {
	Groups = make(map[string]TestGroup)
	groupNames := []string{
		admissionregistration.GroupName,
		api.GroupName,
		apps.GroupName,
		autoscaling.GroupName,
		batch.GroupName,
		networking.GroupName,
		policy.GroupName,
		rbac.GroupName,
		resource.GroupName,
		scheduling.GroupName,
		storage.GroupName,
	}

	for _, gn := range groupNames {
		versions := legacyscheme.Scheme.PrioritizedVersionsForGroup(gn)
		Groups[gn] = TestGroup{
			externalGroupVersion: schema.GroupVersion{
				Group:   gn,
				Version: versions[0].Version,
			},
		}
	}
}

func getCodecForObject(obj runtime.Object) (runtime.Codec, error) {
	kinds, _, err := legacyscheme.Scheme.ObjectKinds(obj)
	if err != nil {
		return nil, fmt.Errorf("unexpected encoding error: %v", err)
	}
	kind := kinds[0]

	for _, group := range Groups {
		if group.GroupVersion().Group != kind.Group {
			continue
		}

		if legacyscheme.Scheme.Recognizes(kind) {
			return group.Codec(), nil
		}
	}
	// Codec used for unversioned types
	if legacyscheme.Scheme.Recognizes(kind) {
		serializer, ok := runtime.SerializerInfoForMediaType(legacyscheme.Codecs.SupportedMediaTypes(), runtime.ContentTypeJSON)
		if !ok {
			return nil, fmt.Errorf("no serializer registered for json")
		}
		return serializer.Serializer, nil
	}
	return nil, fmt.Errorf("unexpected kind: %v", kind)
}

func validateObject(obj runtime.Object) (errors field.ErrorList) {
	podValidationOptions := validation.PodValidationOptions{
		AllowInvalidPodDeletionCost:             false,
		AllowIndivisibleHugePagesValues:         true,
		AllowTaintTolerationComparisonOperators: true,
	}
	netValidationOptions := networking_validation.NetworkPolicyValidationOptions{
		AllowInvalidLabelValueInSelector: false,
	}
	pdbValidationOptions := policy_validation.PodDisruptionBudgetValidationOptions{
		AllowInvalidLabelValueInSelector: false,
	}
	clusterroleValidationOptions := rbac_validation.ClusterRoleValidationOptions{
		AllowInvalidLabelValueInSelector: false,
	}

	switch t := obj.(type) {
	case *admissionregistration.ValidatingWebhookConfiguration:
		errors = admreg_validation.ValidateValidatingWebhookConfiguration(t)
	case *admissionregistration.ValidatingAdmissionPolicy:
		errors = admreg_validation.ValidateValidatingAdmissionPolicy(t)
	case *admissionregistration.ValidatingAdmissionPolicyBinding:
		errors = admreg_validation.ValidateValidatingAdmissionPolicyBinding(t)
	case *admissionregistration.MutatingAdmissionPolicy:
		errors = admreg_validation.ValidateMutatingAdmissionPolicy(t)
	case *api.ConfigMap:
		if t.Namespace == "" {
			t.Namespace = api.NamespaceDefault
		}
		errors = validation.ValidateConfigMap(t)
	case *api.Endpoints:
		if t.Namespace == "" {
			t.Namespace = api.NamespaceDefault
		}
		errors = validation.ValidateEndpointsCreate(t)
	case *api.LimitRange:
		if t.Namespace == "" {
			t.Namespace = api.NamespaceDefault
		}
		errors = validation.ValidateLimitRange(t)
	case *api.Namespace:
		errors = validation.ValidateNamespace(t)
	case *api.PersistentVolume:
		opts := validation.PersistentVolumeSpecValidationOptions{}
		errors = validation.ValidatePersistentVolume(t, opts)
	case *api.PersistentVolumeClaim:
		if t.Namespace == "" {
			t.Namespace = api.NamespaceDefault
		}
		opts := validation.PersistentVolumeClaimSpecValidationOptions{}
		errors = validation.ValidatePersistentVolumeClaim(t, opts)
	case *api.Pod:
		if t.Namespace == "" {
			t.Namespace = api.NamespaceDefault
		}
		errors = validation.ValidatePodCreate(t, podValidationOptions)
	case *api.PodList:
		for i := range t.Items {
			errors = append(errors, validateObject(&t.Items[i])...)
		}
	case *api.PodTemplate:
		if t.Namespace == "" {
			t.Namespace = api.NamespaceDefault
		}
		errors = validation.ValidatePodTemplate(t, podValidationOptions)
	case *api.ReplicationController:
		if t.Namespace == "" {
			t.Namespace = api.NamespaceDefault
		}
		errors = validation.ValidateReplicationController(t, podValidationOptions)
	case *api.ReplicationControllerList:
		for i := range t.Items {
			errors = append(errors, validateObject(&t.Items[i])...)
		}
	case *api.ResourceQuota:
		if t.Namespace == "" {
			t.Namespace = api.NamespaceDefault
		}
		errors = validation.ValidateResourceQuota(t)
	case *api.Secret:
		if t.Namespace == "" {
			t.Namespace = api.NamespaceDefault
		}
		errors = validation.ValidateSecret(t)
	case *api.Service:
		if t.Namespace == "" {
			t.Namespace = api.NamespaceDefault
		}
		// handle clusterIPs, logic copied from service strategy
		if len(t.Spec.ClusterIP) > 0 && len(t.Spec.ClusterIPs) == 0 {
			t.Spec.ClusterIPs = []string{t.Spec.ClusterIP}
		}
		errors = validation.ValidateServiceCreate(t)
	case *api.ServiceAccount:
		if t.Namespace == "" {
			t.Namespace = api.NamespaceDefault
		}
		errors = validation.ValidateServiceAccount(t)
	case *api.ServiceList:
		for i := range t.Items {
			errors = append(errors, validateObject(&t.Items[i])...)
		}
	case *apps.StatefulSet:
		if t.Namespace == "" {
			t.Namespace = api.NamespaceDefault
		}
		errors = apps_validation.ValidateStatefulSet(t, podValidationOptions)
	case *apps.DaemonSet:
		if t.Namespace == "" {
			t.Namespace = api.NamespaceDefault
		}
		errors = apps_validation.ValidateDaemonSet(t, podValidationOptions)
	case *apps.Deployment:
		if t.Namespace == "" {
			t.Namespace = api.NamespaceDefault
		}
		errors = apps_validation.ValidateDeployment(t, podValidationOptions)
	case *apps.ReplicaSet:
		if t.Namespace == "" {
			t.Namespace = api.NamespaceDefault
		}
		errors = apps_validation.ValidateReplicaSet(t, podValidationOptions)
	case *autoscaling.HorizontalPodAutoscaler:
		opts := autoscaling_validation.HorizontalPodAutoscalerSpecValidationOptions{}
		if t.Namespace == "" {
			t.Namespace = api.NamespaceDefault
		}
		errors = autoscaling_validation.ValidateHorizontalPodAutoscaler(t, opts)
	case *batch.CronJob:
		if t.Namespace == "" {
			t.Namespace = api.NamespaceDefault
		}
		errors = batch_validation.ValidateCronJobCreate(t, podValidationOptions)
	case *batch.Job:
		if t.Namespace == "" {
			t.Namespace = api.NamespaceDefault
		}

		// Job needs generateSelector called before validation, and job.Validate does this.
		if strings.Index(t.ObjectMeta.Name, "$") > -1 {
			t.ObjectMeta.Name = "skip-for-good"
		}
		t.ObjectMeta.UID = types.UID("fakeuid")
		if t.Spec.Template.ObjectMeta.Labels == nil {
			t.Spec.Template.ObjectMeta.Labels = make(map[string]string)
		}
		t.Spec.Template.ObjectMeta.Labels["controller-uid"] = "fakeuid"
		t.Spec.Template.ObjectMeta.Labels["job-name"] = t.ObjectMeta.Name
		if t.Spec.Selector == nil {
			t.Spec.Selector = &metav1.LabelSelector{
				MatchLabels: map[string]string{
					"controller-uid": "fakeuid",
					"job-name":       t.ObjectMeta.Name,
				},
			}
		}
		opts := batch_validation.JobValidationOptions{
			RequirePrefixedLabels: false,
		}
		errors = batch_validation.ValidateJob(t, opts)

	case *flowcontrol.FlowSchema:
		// TODO: This is still failing
		errors = flowcontrol_validation.ValidateFlowSchema(t)

	case *networking.Ingress:
		if t.Namespace == "" {
			t.Namespace = api.NamespaceDefault
		}
		errors = networking_validation.ValidateIngressCreate(t)
	case *networking.IngressClass:
		errors = networking_validation.ValidateIngressClass(t)
	case *networking.NetworkPolicy:
		if t.Namespace == "" {
			t.Namespace = api.NamespaceDefault
		}
		errors = networking_validation.ValidateNetworkPolicy(t, netValidationOptions)
	case *policy.PodDisruptionBudget:
		if t.Namespace == "" {
			t.Namespace = api.NamespaceDefault
		}
		errors = policy_validation.ValidatePodDisruptionBudget(t, pdbValidationOptions)
	case *rbac.ClusterRole:
		// clusterole does not accept namespace
		errors = rbac_validation.ValidateClusterRole(t, clusterroleValidationOptions)
	case *rbac.Role:
		if t.Namespace == "" {
			t.Namespace = api.NamespaceDefault
		}
		errors = rbac_validation.ValidateRole(t)
	case *rbac.ClusterRoleBinding:
		// clusterolebinding does not accept namespace
		errors = rbac_validation.ValidateClusterRoleBinding(t)
	case *rbac.RoleBinding:
		errors = rbac_validation.ValidateRoleBinding(t)
	case *resource.DeviceClass:
		errors = resource_validation.ValidateDeviceClass(t)
	case *resource.ResourceClaim:
		if t.Namespace == "" {
			t.Namespace = api.NamespaceDefault
		}
		errors = resource_validation.ValidateResourceClaim(t)
	case *resource.ResourceClaimTemplate:
		if t.Namespace == "" {
			t.Namespace = api.NamespaceDefault
		}
		errors = resource_validation.ValidateResourceClaimTemplate(t)
	case *scheduling.PriorityClass:
		errors = scheduling_validation.ValidatePriorityClass(t)
	case *storage.StorageClass:
		// storageclass does not accept namespace
		errors = storage_validation.ValidateStorageClass(t)
	default:
		errors = field.ErrorList{}
		errors = append(errors, field.InternalError(field.NewPath(""), fmt.Errorf("no validation defined for %#v", obj)))
	}
	return errors
}

// Walks inDir for any json/yaml files. Converts yaml to json, and calls fn for
// each file found with the contents in data.
func walkConfigFiles(inDir string, t *testing.T, fn func(path string, data [][]byte, kinds []string)) error {
	return filepath.Walk(inDir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		// skip files that are explicitly ignored
		if slices.Contains(filesIgnore, path) {
			return nil
		}

		file := filepath.Base(path)
		ext := filepath.Ext(file)

		if ext != ".json" && ext != ".yaml" {
			return nil
		}

		data, err := os.ReadFile(path)
		if err != nil {
			return err
		}

		t.Logf("Checking : %s\n", path)
		var docs [][]byte
		var kinds []string
		if ext == ".yaml" {
			// YAML can contain multiple documents.
			reader := bytes.NewBuffer(data)
			dec := yaml.NewDecoder(reader)

			for {
				var doc map[string]interface{}
				err := dec.Decode(&doc)
				if err != nil {
					if err == io.EOF {
						break
					}
					return fmt.Errorf("Decoding error %s: %v", path, err)
				}

				// skip manifest missking `apiVersion` or `kind` fields.
				if _, found := doc["apiVersion"]; !found {
					continue
				}
				kind, found := doc["kind"]
				if !found {
					continue
				}
				data, err = json.MarshalIndent(doc, "", "  ")
				if err != nil {
					return fmt.Errorf("JSON marshaling error %s: %v", path, err)
				}
				// deal with "empty" document (e.g. pure comments)
				if string(data) != "null" {
					kinds = append(kinds, kind.(string))
					docs = append(docs, data)
				}
			}
		} else {
			var doc map[string]interface{}
			err := json.Unmarshal(data, &doc)
			if err != nil {
				if err == io.EOF {
					return nil
				}
				return fmt.Errorf("Decoding error %s: %v", path, err)
			}

			// skip manifest missking `apiVersion` or `kind` fields.
			if _, found := doc["apiVersion"]; !found {
				return nil
			}
			kind, found := doc["kind"]
			if !found {
				return nil
			}
			kinds = append(kinds, kind.(string))
			docs = append(docs, data)
		}

		fn(path, docs, kinds)
		return nil
	})
}

func TestExampleObjectSchemas(t *testing.T) {
	initGroups()

	capabilities.Initialize(capabilities.Capabilities{
		AllowPrivileged: true,
	})

	walkConfigFiles(".", t, func(path string, docs [][]byte, kinds []string) {

		for i, data := range docs {
			expectedType := kindObjs[kinds[i]]
			codec, err := getCodecForObject(expectedType)
			if err != nil {
				t.Errorf("Could not get codec for %v: %s", expectedType, err)
			}
			if err := runtime.DecodeInto(codec, data, expectedType); err != nil {
				t.Errorf("%s did not decode correctly: %v\n%s", path, err, string(data))
				return
			}
			if errors := validateObject(expectedType); len(errors) > 0 {
				t.Errorf("%s did not validate correctly: %v", path, errors)
			}
		}
	})
}
