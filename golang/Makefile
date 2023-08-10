.PHONY: build clean deploy

build:
	env GOARCH=amd64 GOOS=linux go build -ldflags="-s -w" -o bin/user user/main.go

clean:
	rm -rf ./bin ./vendor

deploy: clean build
	npx serverless deploy --stage dev --verbose
