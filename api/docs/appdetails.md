# `POST /api/appdetails`

This endpoint allows you to retrieve Steam application details.

## Request

`POST /appdetails`

### Request Body

The request should contain a JSON object with the following field:

- `appids`: An array of application IDs for which details are being requested.

#### Example

```json
{
  "appids": [123456, 234567, 345678]
}
```

## Response

The response will contain details for the specified applications.

### Response Body

The response is a JSON object where each key is an application ID and the corresponding value contains the details of that application.

#### Example

```json
{
  "123456": {
    // Details for application 123456
  },
  "234567": {
    // Details for application 234567
  },
  "345678": {
    // Details for application 345678
  }
}
```

## Error Handling

In case of an error (e.g., missing `appids` in the request body), the endpoint will return an appropriate error message and HTTP status code.

### Example Error Response

```json
{
  "error": "Invalid request format."
}
```