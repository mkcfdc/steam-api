# `POST /cdkeys/search`

This endpoint allows you to search for CD keys based on a query.

## Request

`POST /cdkeys/search`

### Request Body

The request should contain a JSON object with the following field:

- `query`: A string representing the search query.

#### Example

```json
{
  "query": "example search term"
}
```

## Response

The response will contain search results based on the provided query.

### Response Body

The response is typically a JSON object or an array of objects, each representing a search result with relevant details.

#### Example

```json
[
  {
    // Details of the first search result
  },
  {
    // Details of the second search result
  }
  // ... more results
]
```

## Error Handling

In case of an error (e.g., invalid query format), the endpoint will return an appropriate error message and HTTP status code.

### Example Error Response

```json
{
  "error": "Invalid query format."
}
```