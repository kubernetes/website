package main

import (
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
)

const (
	envVar = "DEMO_SECRET__PASSWD_FILE"
)

type middleware struct {
	logger http.Handler
}

func (l *middleware) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	log.Println(r.URL.Path)
	l.logger.ServeHTTP(w, r)
}

func fileExist(path string) bool {
	info, err := os.Stat(path)
	if err == nil {
		return !info.IsDir()
	}
	if errors.Is(err, os.ErrNotExist) {
		return false
	}
	return false
}

func httpHandle(w http.ResponseWriter, r *http.Request) {

	var isExist, ok bool
	var envVal string

	if envVal, ok = os.LookupEnv(envVar); ok {
		if fileExist(envVal) {
			isExist = true
		}
	}

	switch r.URL.Path {
	case "/":
		if isExist {
			w.WriteHeader(http.StatusOK)
			fmt.Fprintln(w, envVal)
		} else {
			w.WriteHeader(http.StatusNotFound)
			fmt.Fprintln(w, "Secret Not Found")
		}
	case "/readiness":
		if isExist {
			w.WriteHeader(http.StatusOK)
			fmt.Fprintln(w, "OK")
		} else {
			w.WriteHeader(http.StatusNotFound)
			fmt.Fprintln(w, "File or environment variable wasn't found")
		}
	default:
		w.WriteHeader(http.StatusNotFound)
		fmt.Fprintln(w, "404 Not Found")
	}
}

func main() {
	r := http.HandlerFunc(httpHandle)
	m := middleware{logger: r}
	http.ListenAndServe(":8080", &m)
}
