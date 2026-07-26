package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"net/http"

	admissionv1 "k8s.io/api/admission/v1"
	appsv1 "k8s.io/api/apps/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/util/errors"
)

func verifyDeployment(deploy *appsv1.Deployment) error {
	var errs []error
	for i, c := range deploy.Spec.Template.Spec.Containers {
		if c.Name == "" {
			return fmt.Errorf("container %d has no name", i)
		}
		if c.SecurityContext == nil {
			errs = append(errs, fmt.Errorf("container %q does not have SecurityContext", c.Name))
		}
		if c.SecurityContext.RunAsNonRoot == nil || !*c.SecurityContext.RunAsNonRoot {
			errs = append(errs, fmt.Errorf("container %q must set RunAsNonRoot to true in its SecurityContext", c.Name))
		}
		if c.SecurityContext.ReadOnlyRootFilesystem == nil || !*c.SecurityContext.ReadOnlyRootFilesystem {
			errs = append(errs, fmt.Errorf("container %q must set ReadOnlyRootFilesystem to true in its SecurityContext", c.Name))
		}
		if c.SecurityContext.AllowPrivilegeEscalation != nil && *c.SecurityContext.AllowPrivilegeEscalation {
			errs = append(errs, fmt.Errorf("container %q must NOT set AllowPrivilegeEscalation to true in its SecurityContext", c.Name))
		}
		if c.SecurityContext.Privileged != nil && *c.SecurityContext.Privileged {
			errs = append(errs, fmt.Errorf("container %q must NOT set Privileged to true in its SecurityContext", c.Name))
		}
	}
	return errors.NewAggregate(errs)
}

func WebhookEnforceSecurePodConfiguration(rw http.ResponseWriter, req *http.Request) {
	result := &admissionv1.AdmissionReview{Response: &admissionv1.AdmissionResponse{}}
	err := func() error {
		ar := new(admissionv1.AdmissionReview)
		err := json.NewDecoder(req.Body).Decode(ar)
		if err != nil {
			return err
		}
		if ar.Request == nil {
			return nil
		}
		result.TypeMeta = ar.TypeMeta
		result.Response.UID = ar.Request.UID
		if len(ar.Request.Object.Raw) == 0 {
			return nil
		}
		deploy := new(appsv1.Deployment)
		err = json.Unmarshal(ar.Request.Object.Raw, deploy)
		if err != nil {
			return err
		}
		return verifyDeployment(deploy)
	}()
	if err == nil {
		result.Response.Allowed = true
	} else {
		result.Response.Allowed = false
		result.Response.Result = &metav1.Status{
			Code:    http.StatusForbidden,
			Message: err.Error(),
		}
	}
	err = json.NewEncoder(rw).Encode(result)
	if err != nil {
		log.Println(err)
	}
}

var _ http.HandlerFunc = WebhookEnforceSecurePodConfiguration

func main() {
	http.HandleFunc("/", WebhookEnforceSecurePodConfiguration)

	addr := flag.String("addr", ":8443", "address to listen on")
	certFile := flag.String("cert", "cert.pem", "path to TLS certificate")
	keyFile := flag.String("key", "key.pem", "path to TLS key")
	flag.Parse()

	log.Fatalln(http.ListenAndServeTLS(*addr, *certFile, *keyFile, nil))
}
