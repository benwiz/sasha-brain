exports.handle = function (request, context) {
  console.log('request:', JSON.stringify(request));
  if (request.directive.header.namespace === 'Alexa.Discovery' && request.directive.header.name === 'Discover') {
      handleDiscovery(request, context, "");
  }
  else if (request.directive.header.namespace === 'Alexa.PowerController') {
      if (request.directive.header.name === 'TurnOn' || request.directive.header.name === 'TurnOff') {
          handlePowerControl(request, context);
      }
  }

  function handleDiscovery(request, context) {
      var payload = {
          "endpoints":
          [
              {
                  "endpointId": "demo_id",
                  "manufacturerName": "Smart Device Company",
                  "friendlyName": "Bedroom Outlet",
                  "description": "Smart Device Switch",
                  "displayCategories": ["SWITCH"],
                  "cookie": {
                      "key1": "arbitrary key/value pairs for skill to reference this endpoint.",
                      "key2": "There can be multiple entries",
                      "key3": "but they should only be used for reference purposes.",
                      "key4": "This is not a suitable place to maintain current endpoint state."
                  },
                  "capabilities":
                  [
                      {
                        "type": "AlexaInterface",
                        "interface": "Alexa",
                        "version": "3"
                      },
                      {
                          "interface": "Alexa.PowerController",
                          "version": "3",
                          "type": "AlexaInterface",
                          "properties": {
                              "supported": [{
                                  "name": "powerState"
                              }],
                               "retrievable": true
                          }
                      }
                  ]
              }
          ]
      };
      var header = request.directive.header;
      header.name = "Discover.Response";
      log("DEBUG: ", "Discovery Response: ", JSON.stringify({ header: header, payload: payload }));
      context.succeed({ event: { header: header, payload: payload } });
  }

  function log(message, message1, message2) {
      console.log(message + message1 + message2);
  }

  function handlePowerControl(request, context) {
      // get device ID passed in during discovery
      var requestMethod = request.directive.header.name;
      // get user token pass in request
      var requestToken = request.directive.endpoint.scope.token;
      var powerResult;

      if (requestMethod === "TurnOn") {

          // Make the call to your device cloud for control
          // powerResult = stubControlFunctionToYourCloud(endpointId, token, request);
          powerResult = "ON";
      }
     else if (requestMethod === "TurnOff") {
          // Make the call to your device cloud for control and check for success
          // powerResult = stubControlFunctionToYourCloud(endpointId, token, request);
          powerResult = "OFF";
      }
      var contextResult = {
          "properties": [{
              "namespace": "Alexa.PowerController",
              "name": "powerState",
              "value": powerResult,
              "timeOfSample": new Date(),
              "uncertaintyInMilliseconds": 50
          }]
      };
      var responseHeader = request.directive.header;
      responseHeader.name = "Alexa.Response";
      responseHeader.messageId = responseHeader.messageId + "-R";
      var response = {
          context: contextResult,
          event: {
              header: responseHeader,
          },
          payload: {},
      };
      log("DEBUG: ", "Alexa.PowerController ", JSON.stringify(response));
      context.succeed(response);
  }
};
