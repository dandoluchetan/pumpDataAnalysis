
# API Specification and Implementation Document

## Bar Graph API:
### Endpoint: `/api/bar-graph`
- **Method:** GET
- **Query Parameters:**
  - `state`: (optional) Filter the data by state. If not provided or set to 'All', all data will be returned.
- **Response:**
  - **Content-Type:** application/json
  - **Body:** Array of objects representing the bar graph data, each object containing the following fields:
    - `id`: Auto incremented id of that record.
    - `psum_avg_value`: Psum average value
    - `from_timestamp`: Timestamp of the data point
    - `operating_load`: Operating load value
    - `state`: State of the machine at the given timestamp
    ```json
    {
        "id": 97,
        "from_timestamp": "2021-01-27T05:39:00.000Z",
        "psum_avg_value": 148.9387826666667,
        "operating_load": 45.34049902836919,
        "state": "On - loaded"
    }
    ```
## Pie Chart API:
### Endpoint: `/api/pie-chart`
- **Method:** GET
- **Query Parameters:**
  - `startTime`: (required) Start timestamp of the time range
  - `endTime`: (required) End timestamp of the time range
- **Response:**
  - **Content-Type:** application/json
  - **Body:** Array of objects representing the pie chart data, each object containing the following fields:
    - `state`: State of the machine
    - `value`: Percentage of time distributed in the given state within the specified time range
    ```json
    {
        "state": "On - loaded",
        "value": "77.22"
    }
    ```

## Linear Graph API:
### Endpoint: `/api/linear-graph`
- **Method:** GET
- **Query Parameters:**
  - `startTime`: (required) Start timestamp of the time range
  - `endTime`: (required) End timestamp of the time range
- **Response:**
  - **Content-Type:** application/json
  - **Body:** Array of objects representing the linear graph data, each object containing the following fields:
    - `state`: State of the machine
    - `from_timestamp`: Timestamp of the data point.
    ```json
    {
        "from_timestamp": "2021-01-27T05:39:00.000Z",
        "state": "On - loaded"
    }
    ```

## Implementation:

### Bar Graph API (`barGraphRoutes.js`):
- It fetches data from the database based on the provided state query parameter.
- If state is not provided or set to 'All', it returns all data.
- The data is ordered by `from_timestamp` in ascending order.

### Pie Chart API (`pieChartRoutes.js`):
- It validates the presence of `startTime` and `endTime` query parameters.
- It fetches data from the database within the specified time range.
- It calculates the percentage of time spent in each state within the time range.
- The data is formatted as an array of objects with `state` and `value` fields.

### Linear Graph API (`linearGraphRoutes.js`):
- It validates the presence of `startTime` and `endTime` query parameters.
- It fetches data from the database within the specified time range.
- It calculates the percentage of time spent in each state within the time range.
- The data is formatted as an array of objects with `state` and `from_timestamp` fields.
