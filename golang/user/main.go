package main

import (
	"encoding/json"
	"errors"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
)

const notFoundResponse = "{\"error\": \"not found user\"}"

type User struct {
	Name  string `json:"name"`
	Email string `json:"email"`
	ID    string `json:"id"`
}

var sess = session.Must(session.NewSession())
var db = dynamodb.New(sess)

func LambdaHandler(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	id, hasIdOnPath := request.PathParameters["id"]

	if !hasIdOnPath {
		return events.APIGatewayProxyResponse{
			StatusCode: 404,
			Body:       notFoundResponse,
		}, nil
	}

	item, err := getUserById(id)

	if item == nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 404,
			Body:       notFoundResponse,
			Headers: map[string]string{
				"Access-Control-Allow-Origin": "*",
			},
		}, nil
	}

	if err != nil {
		return events.APIGatewayProxyResponse{}, err
	}

	itemJson, _ := json.Marshal(item)
	return events.APIGatewayProxyResponse{
		StatusCode: 200,
		Body:       string(itemJson),
		Headers: map[string]string{
			"Access-Control-Allow-Origin": "*",
		},
	}, nil
}

func getUserById(id string) (*User, error) {
	itemDynamoDB, err := db.GetItem(&dynamodb.GetItemInput{
		TableName: aws.String("User"),
		Key: map[string]*dynamodb.AttributeValue{
			"id": {
				S: aws.String(id),
			},
		},
	})

	if itemDynamoDB.Item == nil {
		return nil, errors.New("Could not find user: " + id)
	}

	var item User
	if err := dynamodbattribute.UnmarshalMap(itemDynamoDB.Item, &item); err != nil {
		return nil, err
	}

	if err != nil {
		return nil, err
	}

	return &item, err
}

func main() {
	lambda.Start(LambdaHandler)
}
