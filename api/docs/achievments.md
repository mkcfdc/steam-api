# `GET /playerachievements/:appId/:steamId`

This endpoint retrieves player achievements for a specific application and Steam user.

## Request

`GET /playerachievements/:appId/:steamId`

### URL Parameters

- `appId`: The unique identifier of the application.
- `steamId`: The Steam ID of the user.

#### Example

`GET /playerachievements/123456/76561198000000000`

## Response

The response will contain the player's achievements for the specified application and Steam user.

### Response Body

The response is typically a JSON object containing a list of achievements along with their status for the specified user and application.

#### Example

```json
{
  "achievements": [
    {
      "name": "Achievement Name 1",
      "achieved": 1
    },
    {
      "name": "Achievement Name 2",
      "achieved": 0
    }
    // ... more achievements
  ]
}
```

## Error Handling

In case of an error (e.g., invalid `appId` or `steamId`, or if the data is not available), the endpoint will return an appropriate error message and HTTP status code.

### Example Error Response

```json
{
  "error": "Invalid appId or steamId."
}
```