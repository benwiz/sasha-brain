package main

import (
	"encoding/json"
	"fmt"
	"github.com/apex/go-apex"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/guregu/dynamo"
	"os"
)

type message struct {
	PathParameters table  `json:"pathParameters"`
	Body           string `json:"body"`
}

type table struct {
	Table string `json:"table"`
}

type person struct {
	Person string `json:"person" dynamo:"person"`
	Age    int    `json:"age" dynamo:"age"`
}

type response struct {
	StatusCode int    `json:"statusCode"`
	Body       string `json:"body"`
}

func main() {
	apex.HandleFunc(func(event json.RawMessage, ctx *apex.Context) (interface{}, error) {
		fmt.Fprintf(os.Stderr, "Event: %s\n", event)

		// Unmarshal into map so that we can look at query value
		var m message
		err := json.Unmarshal(event, &m)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Message Unmarshal Fail: %s\n", err)
			return nil, err
		}
		fmt.Fprintf(os.Stderr, "Message: %s\n", m)

		// Initialize response
		r := response{}

		// Connect to dyanamodb
		db := dynamo.New(session.New(), &aws.Config{Region: aws.String("us-east-1")})
		table := db.Table("sasha." + m.PathParameters.Table) // TODO: Need to validate table before trying to get it.

		// Unmarshal the Body into the correct struct based on the Query
		if m.PathParameters.Table == "people" {
			fmt.Fprintf(os.Stderr, "Body: %s\n", m.Body)
			var p person
			err = json.Unmarshal([]byte(m.Body), &p)
			if err != nil {
				fmt.Fprintf(os.Stderr, "Person Unmarshal Fail: %s\n", err)
				return nil, err
			}

			// Put item into sasha.people table
			err = table.Put(p).Run() // TODO: This should be able to return the created record. Use it in response.
			if err != nil {
				fmt.Fprintf(os.Stderr, "Table Put Fail: %s\n", table)
				return nil, err
			}

			// TODO: Better response body. Use the created record data in response.
			r.StatusCode = 200
			r.Body = fmt.Sprintf(`{"message": "Successfully wrote record: %s."}`, p.Person)
		} else {
			r.StatusCode = 404
			r.Body = fmt.Sprintf("Table not found: %v.", m.PathParameters.Table)
		}

		return r, nil
	})
}
