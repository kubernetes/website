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
	"bufio"
	"bytes"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"strings"
	"testing"

	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/runtime"
	"k8s.io/apimachinery/pkg/runtime/schema"
	"k8s.io/apimachinery/pkg/types"
	"k8s.io/apimachinery/pkg/util/validation/field"
	"k8s.io/apimachinery/pkg/util/yaml"
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

	// "k8s.io/kubernetes/pkg/apis/flowcontrol"
	// flowcontrol_validation "k8s.io/kubernetes/pkg/apis/flowcontrol/validation"

	"k8s.io/kubernetes/pkg/apis/networking"
	networking_validation "k8s.io/kubernetes/pkg/apis/networking/validation"

	"k8s.io/kubernetes/pkg/apis/policy"
	policy_validation "k8s.io/kubernetes/pkg/apis/policy/validation"

	"k8s.io/kubernetes/pkg/apis/rbac"
	rbac_validation "k8s.io/kubernetes/pkg/apis/rbac/validation"

	"k8s.io/kubernetes/pkg/apis/storage"
	storage_validation "k8s.io/kubernetes/pkg/apis/storage/validation"

	"k8s.io/kubernetes/pkg/capabilities"

	// initialize install packages
	_ "k8s.io/kubernetes/pkg/apis/admissionregistration/install"
	_ "k8s.io/kubernetes/pkg/apis/apps/install"
	_ "k8s.io/kubernetes/pkg/apis/autoscaling/install"
	_ "k8s.io/kubernetes/pkg/apis/batch/install"
	_ "k8s.io/kubernetes/pkg/apis/core/install"
	_ "k8s.io/kubernetes/pkg/apis/networking/install"
	_ "k8s.io/kubernetes/pkg/apis/policy/install"
	_ "k8s.io/kubernetes/pkg/apis/rbac/install"
	_ "k8s.io/kubernetes/pkg/apis/storage/install"
)

var (
	Groups     map[string]TestGroup
	serializer runtime.SerializerInfo
)

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
		AllowImageVolumeSource:          true,
		AllowInvalidPodDeletionCost:     false,
		AllowIndivisibleHugePagesValues: true,
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
		errors = validation.ValidateService(t)
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
		if t.Namespace == "" {
			t.Namespace = api.NamespaceDefault
		}
		errors = autoscaling_validation.ValidateHorizontalPodAutoscaler(t)
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

	// case *flowcontrol.FlowSchema:
	// TODO: This is still failing
	// errors = flowcontrol_validation.ValidateFlowSchema(t)

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
	case *rbac.ClusterRoleBinding:
		// clusterolebinding does not accept namespace
		errors = rbac_validation.ValidateClusterRoleBinding(t)
	case *rbac.RoleBinding:
		errors = rbac_validation.ValidateRoleBinding(t)
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
func walkConfigFiles(inDir string, t *testing.T, fn func(name, path string, data [][]byte)) error {
	return filepath.Walk(inDir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		if info.IsDir() && path != inDir {
			return filepath.SkipDir
		}

		file := filepath.Base(path)
		if ext := filepath.Ext(file); ext == ".json" || ext == ".yaml" {
			data, err := os.ReadFile(path)
			if err != nil {
				return err
			}
			name := strings.TrimSuffix(file, ext)

			var docs [][]byte
			if ext == ".yaml" {
				// YAML can contain multiple documents.
				splitter := yaml.NewYAMLReader(bufio.NewReader(bytes.NewBuffer(data)))
				for {
					doc, err := splitter.Read()
					if err == io.EOF {
						break
					}
					if err != nil {
						return fmt.Errorf("%s: %v", path, err)
					}
					out, err := yaml.ToJSON(doc)
					if err != nil {
						return fmt.Errorf("%s: %v", path, err)
					}
					// deal with "empty" document (e.g. pure comments)
					if string(out) != "null" {
						docs = append(docs, out)
					}
				}
			} else {
				docs = append(docs, data)
			}

			t.Logf("Checking file %s\n", name)
			fn(name, path, docs)
		}
		return nil
	})
}

func TestExampleObjectSchemas(t *testing.T) {
	initGroups()

	// Please help maintain the alphabeta order in the map
	cases := map[string]map[string][]runtime.Object{
		"access": {
			"deployment-replicas-policy":                   {&admissionregistration.ValidatingAdmissionPolicy{}},
			"endpoints-aggregated":                         {&rbac.ClusterRole{}},
			"image-matches-namespace-environment.policy":   {&admissionregistration.ValidatingAdmissionPolicy{}},
			"validating-admission-policy-audit-annotation": {&admissionregistration.ValidatingAdmissionPolicy{}},
			"validating-admission-policy-match-conditions": {&admissionregistration.ValidatingAdmissionPolicy{}},
		},
		"access/certificate-signing-request": {
			"clusterrole-approve": {&rbac.ClusterRole{}},
			"clusterrole-create":  {&rbac.ClusterRole{}},
			"clusterrole-sign":    {&rbac.ClusterRole{}},
		},
		"admin": {
			"namespace-dev":        {&api.Namespace{}},
			"namespace-prod":       {&api.Namespace{}},
			"snowflake-deployment": {&apps.Deployment{}},
		},
		"admin/cloud": {
			"ccm-example": {&api.ServiceAccount{}, &rbac.ClusterRoleBinding{}, &apps.DaemonSet{}},
		},
		"admin/dns": {
			"busybox":                   {&api.Pod{}},
			"dns-horizontal-autoscaler": {&api.ServiceAccount{}, &rbac.ClusterRole{}, &rbac.ClusterRoleBinding{}, &apps.Deployment{}},
			"dnsutils":                  {&api.Pod{}},
		},
		// TODO: "admin/konnectivity" is not include yet.
		"admin/logging": {
			"fluentd-sidecar-config":                  {&api.ConfigMap{}},
			"two-files-counter-pod":                   {&api.Pod{}},
			"two-files-counter-pod-agent-sidecar":     {&api.Pod{}},
			"two-files-counter-pod-streaming-sidecar": {&api.Pod{}},
		},
		"admin/resource": {
			"cpu-constraints":          {&api.LimitRange{}},
			"cpu-constraints-pod":      {&api.Pod{}},
			"cpu-constraints-pod-2":    {&api.Pod{}},
			"cpu-constraints-pod-3":    {&api.Pod{}},
			"cpu-constraints-pod-4":    {&api.Pod{}},
			"cpu-defaults":             {&api.LimitRange{}},
			"cpu-defaults-pod":         {&api.Pod{}},
			"cpu-defaults-pod-2":       {&api.Pod{}},
			"cpu-defaults-pod-3":       {&api.Pod{}},
			"limit-mem-cpu-container":  {&api.LimitRange{}},
			"limit-mem-cpu-pod":        {&api.LimitRange{}},
			"limit-range-pod-1":        {&api.Pod{}},
			"limit-range-pod-2":        {&api.Pod{}},
			"limit-range-pod-3":        {&api.Pod{}},
			"limit-memory-ratio-pod":   {&api.LimitRange{}},
			"memory-constraints":       {&api.LimitRange{}},
			"memory-constraints-pod":   {&api.Pod{}},
			"memory-constraints-pod-2": {&api.Pod{}},
			"memory-constraints-pod-3": {&api.Pod{}},
			"memory-constraints-pod-4": {&api.Pod{}},
			"memory-defaults":          {&api.LimitRange{}},
			"memory-defaults-pod":      {&api.Pod{}},
			"memory-defaults-pod-2":    {&api.Pod{}},
			"memory-defaults-pod-3":    {&api.Pod{}},
			"pvc-limit-lower":          {&api.PersistentVolumeClaim{}},
			"pvc-limit-greater":        {&api.PersistentVolumeClaim{}},
			"quota-mem-cpu":            {&api.ResourceQuota{}},
			"quota-mem-cpu-pod":        {&api.Pod{}},
			"quota-mem-cpu-pod-2":      {&api.Pod{}},
			"quota-objects":            {&api.ResourceQuota{}},
			"quota-objects-pvc":        {&api.PersistentVolumeClaim{}},
			"quota-objects-pvc-2":      {&api.PersistentVolumeClaim{}},
			"quota-pod":                {&api.ResourceQuota{}},
			"quota-pod-deployment":     {&apps.Deployment{}},
			"storagelimits":            {&api.LimitRange{}},
		},
		"admin/sched": {
			"clusterrole":  {&rbac.ClusterRole{}},
			"my-scheduler": {&api.ServiceAccount{}, &rbac.ClusterRoleBinding{}, &rbac.ClusterRoleBinding{}, &rbac.RoleBinding{}, &api.ConfigMap{}, &apps.Deployment{}},
			"pod1":         {&api.Pod{}},
			"pod2":         {&api.Pod{}},
			"pod3":         {&api.Pod{}},
		},
		"application": {
			"deployment":            {&apps.Deployment{}},
			"deployment-patch":      {&apps.Deployment{}},
			"deployment-retainkeys": {&apps.Deployment{}},
			"deployment-scale":      {&apps.Deployment{}},
			"deployment-sidecar":    {&apps.Deployment{}},
			"deployment-update":     {&apps.Deployment{}},
			"nginx-app":             {&api.Service{}, &apps.Deployment{}},
			"nginx-with-request":    {&apps.Deployment{}},
			"php-apache":            {&apps.Deployment{}, &api.Service{}},
			"shell-demo":            {&api.Pod{}},
			"simple_deployment":     {&apps.Deployment{}},
			"update_deployment":     {&apps.Deployment{}},
		},
		"application/cassandra": {
			"cassandra-service":     {&api.Service{}},
			"cassandra-statefulset": {&apps.StatefulSet{}, &storage.StorageClass{}},
		},
		"application/guestbook": {
			"frontend-deployment":       {&apps.Deployment{}},
			"frontend-service":          {&api.Service{}},
			"redis-follower-deployment": {&apps.Deployment{}},
			"redis-follower-service":    {&api.Service{}},
			"redis-leader-deployment":   {&apps.Deployment{}},
			"redis-leader-service":      {&api.Service{}},
		},
		"application/hpa": {
			"php-apache": {&autoscaling.HorizontalPodAutoscaler{}},
		},
		"application/job": {
			"cronjob":         {&batch.CronJob{}},
			"job-sidecar":     {&batch.Job{}},
			"job-tmpl":        {&batch.Job{}},
			"indexed-job":     {&batch.Job{}},
			"indexed-job-vol": {&batch.Job{}},
		},
		"application/job/rabbitmq": {
			"job":                  {&batch.Job{}},
			"rabbitmq-statefulset": {&apps.StatefulSet{}},
			"rabbitmq-service":     {&api.Service{}},
		},
		"application/job/redis": {
			"job":           {&batch.Job{}},
			"redis-pod":     {&api.Pod{}},
			"redis-service": {&api.Service{}},
		},
		"application/mongodb": {
			"mongo-deployment": {&apps.Deployment{}},
			"mongo-service":    {&api.Service{}},
		},
		"application/mysql": {
			"mysql-configmap":   {&api.ConfigMap{}},
			"mysql-deployment":  {&api.Service{}, &apps.Deployment{}},
			"mysql-pv":          {&api.PersistentVolume{}, &api.PersistentVolumeClaim{}},
			"mysql-services":    {&api.Service{}, &api.Service{}},
			"mysql-statefulset": {&apps.StatefulSet{}},
		},
		"application/nginx": {
			"nginx-deployment": {&apps.Deployment{}},
			"nginx-svc":        {&api.Service{}},
		},
		"application/ssa": {
			"nginx-deployment":             {&apps.Deployment{}},
			"nginx-deployment-no-replicas": {&apps.Deployment{}},
		},
		"application/web": {
			"web":          {&api.Service{}, &apps.StatefulSet{}},
			"web-parallel": {&api.Service{}, &apps.StatefulSet{}},
		},
		"application/wordpress": {
			"mysql-deployment":     {&api.Service{}, &api.PersistentVolumeClaim{}, &apps.Deployment{}},
			"wordpress-deployment": {&api.Service{}, &api.PersistentVolumeClaim{}, &apps.Deployment{}},
		},
		"application/zookeeper": {
			"zookeeper": {&api.Service{}, &api.Service{}, &policy.PodDisruptionBudget{}, &apps.StatefulSet{}},
		},
		"concepts/policy/limit-range": {
			"example-conflict-with-limitrange-cpu":    {&api.Pod{}},
			"problematic-limit-range":                 {&api.LimitRange{}},
			"example-no-conflict-with-limitrange-cpu": {&api.Pod{}},
		},
		"configmap": {
			"configmaps":              {&api.ConfigMap{}, &api.ConfigMap{}},
			"configmap-multikeys":     {&api.ConfigMap{}},
			"configure-pod":           {&api.Pod{}},
			"immutable-configmap":     {&api.ConfigMap{}},
			"new-immutable-configmap": {&api.ConfigMap{}},
		},
		"controllers": {
			"daemonset":                           {&apps.DaemonSet{}},
			"daemonset-label-selector":            {&apps.DaemonSet{}},
			"fluentd-daemonset":                   {&apps.DaemonSet{}},
			"fluentd-daemonset-update":            {&apps.DaemonSet{}},
			"frontend":                            {&apps.ReplicaSet{}},
			"hpa-rs":                              {&autoscaling.HorizontalPodAutoscaler{}},
			"job":                                 {&batch.Job{}},
			"job-backoff-limit-per-index-example": {&batch.Job{}},
			"job-pod-failure-policy-config-issue": {&batch.Job{}},
			"job-pod-failure-policy-example":      {&batch.Job{}},
			"job-pod-failure-policy-failjob":      {&batch.Job{}},
			"job-pod-failure-policy-ignore":       {&batch.Job{}},
			"job-success-policy":                  {&batch.Job{}},
			"replicaset":                          {&apps.ReplicaSet{}},
			"replication":                         {&api.ReplicationController{}},
			"replication-nginx-1.14.2":            {&api.ReplicationController{}},
			"replication-nginx-1.16.1":            {&api.ReplicationController{}},
			"nginx-deployment":                    {&apps.Deployment{}},
		},
		"debug": {
			"counter-pod":                     {&api.Pod{}},
			"event-exporter":                  {&api.ServiceAccount{}, &rbac.ClusterRoleBinding{}, &apps.Deployment{}},
			"fluentd-gcp-configmap":           {&api.ConfigMap{}},
			"fluentd-gcp-ds":                  {&apps.DaemonSet{}},
			"node-problem-detector":           {&apps.DaemonSet{}},
			"node-problem-detector-configmap": {&apps.DaemonSet{}},
			"termination":                     {&api.Pod{}},
		},
		"pods": {
			"commands":                            {&api.Pod{}},
			"image-volumes":                       {&api.Pod{}},
			"init-containers":                     {&api.Pod{}},
			"lifecycle-events":                    {&api.Pod{}},
			"pod-configmap-env-var-valueFrom":     {&api.Pod{}},
			"pod-configmap-envFrom":               {&api.Pod{}},
			"pod-configmap-volume":                {&api.Pod{}},
			"pod-configmap-volume-specific-key":   {&api.Pod{}},
			"pod-multiple-configmap-env-variable": {&api.Pod{}},
			"pod-nginx-preferred-affinity":        {&api.Pod{}},
			"pod-nginx-required-affinity":         {&api.Pod{}},
			"pod-nginx-specific-node":             {&api.Pod{}},
			"pod-nginx":                           {&api.Pod{}},
			"pod-projected-svc-token":             {&api.Pod{}},
			"pod-rs":                              {&api.Pod{}, &api.Pod{}},
			"pod-single-configmap-env-variable":   {&api.Pod{}},
			"pod-with-affinity-preferred-weight":  {&api.Pod{}},
			"pod-with-node-affinity":              {&api.Pod{}},
			"pod-with-pod-affinity":               {&api.Pod{}},
			"pod-with-scheduling-gates":           {&api.Pod{}},
			"pod-with-toleration":                 {&api.Pod{}},
			"pod-without-scheduling-gates":        {&api.Pod{}},
			"private-reg-pod":                     {&api.Pod{}},
			"share-process-namespace":             {&api.Pod{}},
			"simple-pod":                          {&api.Pod{}},
			"two-container-pod":                   {&api.Pod{}},
			"user-namespaces-stateless":           {&api.Pod{}},
		},
		"pods/config": {
			"redis-pod":            {&api.Pod{}},
			"example-redis-config": {&api.ConfigMap{}},
		},
		"pods/inject": {
			"dapi-envars-container":            {&api.Pod{}},
			"dapi-envars-pod":                  {&api.Pod{}},
			"dapi-volume":                      {&api.Pod{}},
			"dapi-volume-resources":            {&api.Pod{}},
			"dependent-envars":                 {&api.Pod{}},
			"envars":                           {&api.Pod{}},
			"pod-multiple-secret-env-variable": {&api.Pod{}},
			"pod-secret-envFrom":               {&api.Pod{}},
			"pod-single-secret-env-variable":   {&api.Pod{}},
			"secret":                           {&api.Secret{}},
			"secret-envars-pod":                {&api.Pod{}},
			"secret-pod":                       {&api.Pod{}},
		},
		"pods/probe": {
			"exec-liveness":                   {&api.Pod{}},
			"grpc-liveness":                   {&api.Pod{}},
			"http-liveness":                   {&api.Pod{}},
			"pod-with-http-healthcheck":       {&api.Pod{}},
			"pod-with-tcp-socket-healthcheck": {&api.Pod{}},
			"tcp-liveness-readiness":          {&api.Pod{}},
		},
		"pods/qos": {
			"qos-pod":   {&api.Pod{}},
			"qos-pod-2": {&api.Pod{}},
			"qos-pod-3": {&api.Pod{}},
			"qos-pod-4": {&api.Pod{}},
			"qos-pod-5": {&api.Pod{}},
		},
		"pods/resource": {
			"cpu-request-limit":       {&api.Pod{}},
			"cpu-request-limit-2":     {&api.Pod{}},
			"extended-resource-pod":   {&api.Pod{}},
			"extended-resource-pod-2": {&api.Pod{}},
			"memory-request-limit":    {&api.Pod{}},
			"memory-request-limit-2":  {&api.Pod{}},
			"memory-request-limit-3":  {&api.Pod{}},
		},
		"pods/security": {
			"hello-apparmor":     {&api.Pod{}},
			"security-context":   {&api.Pod{}},
			"security-context-2": {&api.Pod{}},
			"security-context-3": {&api.Pod{}},
			"security-context-4": {&api.Pod{}},
			"security-context-5": {&api.Pod{}},
			"security-context-6": {&api.Pod{}},
		},
		"pods/storage": {
			"projected":                                    {&api.Pod{}},
			"projected-secret-downwardapi-configmap":       {&api.Pod{}},
			"projected-secrets-nondefault-permission-mode": {&api.Pod{}},
			"projected-service-account-token":              {&api.Pod{}},
			"pv-claim":                                     {&api.PersistentVolumeClaim{}},
			"pv-duplicate":                                 {&api.Pod{}},
			"pv-pod":                                       {&api.Pod{}},
			"pv-volume":                                    {&api.PersistentVolume{}},
			"redis":                                        {&api.Pod{}},
			"projected-clustertrustbundle":                 {&api.Pod{}},
		},
		"pods/topology-spread-constraints": {
			"one-constraint":                   {&api.Pod{}},
			"one-constraint-with-nodeaffinity": {&api.Pod{}},
			"two-constraints":                  {&api.Pod{}},
		},
		"policy": {
			"priority-class-resourcequota":                   {&api.ResourceQuota{}},
			"zookeeper-pod-disruption-budget-maxunavailable": {&policy.PodDisruptionBudget{}},
			"zookeeper-pod-disruption-budget-minavailable":   {&policy.PodDisruptionBudget{}},
		},
		/* TODO: This doesn't work yet.
		"priority-and-fairness": {
			"health-for-strangers": {&flowcontrol.FlowSchema{}},
		},
		*/
		"secret/serviceaccount": {
			"mysecretname": {&api.Secret{}},
		},
		"security": {
			"example-baseline-pod":   {&api.Pod{}},
			"podsecurity-baseline":   {&api.Namespace{}},
			"podsecurity-privileged": {&api.Namespace{}},
			"podsecurity-restricted": {&api.Namespace{}},
		},
		"service": {
			"nginx-service":                      {&api.Service{}},
			"load-balancer-example":              {&apps.Deployment{}},
			"pod-with-graceful-termination":      {&apps.Deployment{}},
			"explore-graceful-termination-nginx": {&api.Service{}},
		},
		"service/access": {
			"backend-deployment":  {&apps.Deployment{}},
			"backend-service":     {&api.Service{}},
			"frontend-deployment": {&apps.Deployment{}},
			"frontend-service":    {&api.Service{}},
			"hello-application":   {&apps.Deployment{}},
		},
		"service/networking": {
			"curlpod":                                 {&apps.Deployment{}},
			"custom-dns":                              {&api.Pod{}},
			"default-ingressclass":                    {&networking.IngressClass{}},
			"dual-stack-default-svc":                  {&api.Service{}},
			"dual-stack-ipfamilies-ipv6":              {&api.Service{}},
			"dual-stack-ipv6-svc":                     {&api.Service{}},
			"dual-stack-prefer-ipv6-lb-svc":           {&api.Service{}},
			"dual-stack-preferred-ipfamilies-svc":     {&api.Service{}},
			"dual-stack-preferred-svc":                {&api.Service{}},
			"external-lb":                             {&networking.IngressClass{}},
			"example-ingress":                         {&networking.Ingress{}},
			"hostaliases-pod":                         {&api.Pod{}},
			"ingress-resource-backend":                {&networking.Ingress{}},
			"ingress-wildcard-host":                   {&networking.Ingress{}},
			"minimal-ingress":                         {&networking.Ingress{}},
			"name-virtual-host-ingress":               {&networking.Ingress{}},
			"name-virtual-host-ingress-no-third-host": {&networking.Ingress{}},
			"namespaced-params":                       {&networking.IngressClass{}},
			"networkpolicy":                           {&networking.NetworkPolicy{}},
			"networkpolicy-multiport-egress":          {&networking.NetworkPolicy{}},
			"network-policy-allow-all-egress":         {&networking.NetworkPolicy{}},
			"network-policy-allow-all-ingress":        {&networking.NetworkPolicy{}},
			"network-policy-default-deny-egress":      {&networking.NetworkPolicy{}},
			"network-policy-default-deny-ingress":     {&networking.NetworkPolicy{}},
			"network-policy-default-deny-all":         {&networking.NetworkPolicy{}},
			"nginx-policy":                            {&networking.NetworkPolicy{}},
			"nginx-secure-app":                        {&api.Service{}, &apps.Deployment{}},
			"nginx-svc":                               {&api.Service{}},
			"run-my-nginx":                            {&apps.Deployment{}},
			"simple-fanout-example":                   {&networking.Ingress{}},
			"test-ingress":                            {&networking.Ingress{}},
			"tls-example-ingress":                     {&networking.Ingress{}},
		},
		"windows": {
			"configmap-pod":             {&api.ConfigMap{}, &api.Pod{}},
			"daemonset":                 {&apps.DaemonSet{}},
			"deploy-hyperv":             {&apps.Deployment{}},
			"deploy-resource":           {&apps.Deployment{}},
			"emptydir-pod":              {&api.Pod{}},
			"hostpath-volume-pod":       {&api.Pod{}},
			"run-as-username-container": {&api.Pod{}},
			"run-as-username-pod":       {&api.Pod{}},
			"secret-pod":                {&api.Secret{}, &api.Pod{}},
			"simple-pod":                {&api.Pod{}},
		},
	}

	// Note a key in the following map has to be complete relative path
	filesIgnore := map[string]map[string]bool{
		"audit": {
			"audit-policy": true,
		},
		// PSP is dropped in v1.29, do not validate them
		"policy": {
			"baseline-psp":   true,
			"example-psp":    true,
			"privileged-psp": true,
			"restricted-psp": true,
		},
	}
	capabilities.SetForTests(capabilities.Capabilities{
		AllowPrivileged: true,
	})

	for dir, expected := range cases {
		tested := 0
		numExpected := 0
		path := dir
		// Test if artifacts do exist
		for name := range expected {
			fn := path + "/" + name
			_, err1 := os.Stat(fn + ".yaml")
			_, err2 := os.Stat(fn + ".json")
			if err1 != nil && err2 != nil {
				t.Errorf("Test case defined for non-existent file %s", fn)
			}
		}
		t.Logf("Checking path %s/\n", path)
		err := walkConfigFiles(path, t, func(name, path string, docs [][]byte) {
			expectedTypes, found := expected[name]
			if !found {
				p := filepath.Dir(path)
				if files, ok := filesIgnore[p]; ok {
					if files[name] {
						return
					}
				}
				t.Errorf("%s: %s does not have a test case defined", path, name)
				return
			}
			numExpected += len(expectedTypes)
			if len(expectedTypes) != len(docs) {
				t.Errorf("%s: number of expected types (%v) doesn't match number of docs in YAML (%v)", path, len(expectedTypes), len(docs))
				return
			}
			for i, data := range docs {
				expectedType := expectedTypes[i]
				tested++
				if expectedType == nil {
					t.Logf("skipping : %s/%s\n", path, name)
					return
				}

				codec, err := getCodecForObject(expectedType)
				if err != nil {
					t.Errorf("Could not get codec for %s: %s", expectedType, err)
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
		if err != nil {
			t.Errorf("Expected no error, Got %v on Path %v", err, path)
		}
		if tested != numExpected {
			t.Errorf("Directory %v: Expected %d examples, Got %d", path, len(expected), tested)
		}
	}
}
