package main

import (
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
)

const (
	envVar = "DEMO_SECRET__PASSWD"
	filePrefix = "file://"
)

var (
	envVal, filePath string
	isExistFile, isExistEnv, changed bool
)

type middleware struct {
	logger http.Handler
}

func (l *middleware) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	log.Println(r.URL.Path)
	l.logger.ServeHTTP(w, r)
}

func fileExist(path string) (string, bool) {
	if strings.HasPrefix(path, filePrefix) {
		path = strings.TrimPrefix(path, filePrefix)
		info, err := os.Stat(path)
		if err == nil {
			return path, !info.IsDir()
		}
		if errors.Is(err, os.ErrNotExist) {
			return "", false
		}
	}
	return "", false
}

func httpHandle(w http.ResponseWriter, r *http.Request) {

	if !changed {
		if envVal, isExistEnv = os.LookupEnv(envVar); isExistEnv {
			if filePath, isExistFile = fileExist(envVal); isExistFile {
				body, err := os.ReadFile(filePath)
				if err != nil {
					log.Fatalf("unable to read file: %v", err)
				}
				os.Setenv(envVar, string(body))
				envVal = os.Getenv(envVar)
				changed = true
			}
		}
	}

	switch r.URL.Path {
	case "/":
		if isExistFile {
			w.WriteHeader(http.StatusOK)
			fmt.Fprintln(w, envVal)
		} else if isExistEnv {
			w.WriteHeader(http.StatusOK)
			fmt.Fprintln(w, envVal)
		} else {
			w.WriteHeader(http.StatusNotFound)
			fmt.Fprintln(w, "Secret Not Found")
		}
	case "/readiness":
		if isExistEnv && isExistFile {
			w.WriteHeader(http.StatusOK)
			fmt.Fprintln(w, "OK")
		} else if isExistEnv && isExistFile == false && strings.HasPrefix(envVal, filePrefix) {
			w.WriteHeader(http.StatusOK)
			fmt.Fprintln(w, "Environment variable was defined but file not found")
		} else if isExistEnv {
			w.WriteHeader(http.StatusOK)
			fmt.Fprintln(w, "Environment variable was defined")
		} else {
			w.WriteHeader(http.StatusNotFound)
			fmt.Fprintln(w, "Environment variable wasn't defined")
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
