# Sasha

A collection of microservices that combined make Sasha.

## gui

GUI for interacting with Sasha.

A simple Node.js Lmabda function that reads an html file, handles some string replacements, and serves the resulting html.

[https://sasha.benwiz.io](https://sasha.benwiz.io)

## http-sns

A Node.js Lambda function hooked up via the API Gateway for a POST request. The body of the POST request will be taken exactly as is and placed into the topic noted in the query string.

I chose to use the library `aws-sns-publish` because it just works. I should probably learn `aws-sdk`.

Query string

```text
topic STRING (required)
```

Payload

```text
Match desired message content.
```

## sns-ifttt

A Node.js Lambda function that consumed the `ifttt` SNS topic. It takes the `action` and optional `payload` from the following message.

```json
{
  "action": "wemo_switch_1_on",
  "payload": {
    "value1": "aaa",
    "value2": "bbb",
    "value3": "ccc"
  }
}
```

## write-dynamodb

A Go function that takes an undefined JSON message and writes it to the specified key in DynamoDB. As schema's change, the structs defined in this function will have to change. I'm unsure if I like this or if I should use another language so I can submit generic payloads.

Invote the function with

```bash
apex invoke write-dynamodb < functions/write-dynamodb/event.json
```

## get-dynamodb

A Go function that takes a table name in the path paraters and a query string that matches the schema of the table.

Invote the function with

```bash
apex invoke get-dynamodb < functions/get-dynamodb/event.json
```

## overland-receiver

Receive the post request from the [Overland iOS app](https://overland.p3k.io/).

## Deploy

Create a file called _env.json_ to store environment variables.

```json
{
  "PHONE_NUMBER": "",
  "UNSPLASH_APPLICATION_ID": ""
}
```

Optionally append the function name to deploy just that function.

```bash
apex deply -E env.json
```

Useful bash function.

```bash
apexdeploy() {
    if [ -z "$1" ]
    then
        apex deploy -E env.json
    else
        apex deploy -E env.json "$1"
    fi
}
```

## Notes

## To Do

- All dynamodb connections must validate the table or handle a bad table better.
- Add an `update-dynamodb` function. May be able to replace (or just deprecate, or not at all) `write-dynamodb` with this (https://github.com/guregu/dynamo/blob/master/update.go).
- For write/get to dynamodb, the path parameter should be called `table` and should be the actual table name.

- get-dynamodb: handle record not found error with HTTP response

- Set up Zing to report wemo switch status directly to DynamoDB
- overland-receiver needs to write the current location to a DynamoDB

- Low priority / dependencies haven't been created
  - Detect if we don't sleep together
  - Better libs strategy for Python functions (see `send-image`).
  - Receive sms
  - Slowly move entirely away from IFTTT
