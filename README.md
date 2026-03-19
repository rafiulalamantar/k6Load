# k6 Load Testing Suite

A comprehensive k6 load testing project for the QuickPizza API with multiple testing scenarios and advanced metrics.

## 📁 Project Structure

```
k6Load/
├── endToend.js          # Complete end-to-end user journey testing
├── endToEnd_group.js    # Advanced group-based testing with custom metrics
├── test1.js            # Basic load testing (3 VUs, 10s)
├── test2.js            # Advanced load testing with custom metrics
├── package.json        # Project dependencies
└── README.md          # This documentation
```

## 🚀 Test Files Overview

### 1. `endToend.js` - End-to-End User Journey
Complete user flow testing including:
- User registration
- User authentication
- Order creation
- Order retrieval

**Key Features:**
- Random username generation
- Comprehensive checks and validations
- Group-based test organization
- Global counters for tracking users and orders

### 2. `endToEnd_group.js` - Advanced Group Testing
Enhanced version with custom metrics and detailed reporting:
- All end-to-end functionality
- Custom Rate metrics (authentication, registration, order rates)
- Group duration thresholds
- Advanced summary reporting

### 3. `test1.js` - Basic Load Test
Simple load testing scenario:
- 3 Virtual Users for 10 seconds
- Basic HTTP GET requests
- Standard k6 metrics

### 4. `test2.js` - Advanced Load Test
Enhanced load testing with custom metrics:
- Staged load (2→5→0 VUs)
- Custom Trend metrics (`pizza_response_time`)
- Tagged requests for detailed analysis
- Multiple check validations

## 🛠 Prerequisites

- **k6 CLI** installed (https://k6.io/)
  - macOS: `brew install k6`
  - Linux: Use package manager or download from releases
  - Windows: Use Chocolatey or download from releases

## 🏃‍♂️ Running Tests

### Basic Tests
```bash
# Basic load test (3 VUs, 10s)
k6 run test1.js

# Advanced load test with custom metrics
k6 run test2.js
```

### End-to-End Tests
```bash
# Complete user journey test
k6 run endToend.js

# Advanced group-based test with detailed metrics
k6 run endToEnd_group.js
```

### Custom Options
```bash
# Run with custom VUs and duration
k6 run --vus 10 --duration 30s test1.js

# Run with JSON output for reporting
k6 run endToEnd_group.js --out json=results.json

# Run with HTML report
k6 run --out json=results.json test2.js && k6-html-report results.json
```

## 📊 Metrics & Configuration

### Common Metrics
- `http_req_duration`: Total request duration (95th percentile < 500ms)
- `http_req_failed`: Request failure rate (< 1%)
- `checks`: Check success rate (> 90%)

### Custom Metrics (endToEnd_group.js)
- `authentication_rate`: Login success rate
- `registration_rate`: Registration success rate
- `order_creation_rate`: Order creation success rate
- `order_retrieval_rate`: Order retrieval success rate
- `pizza_response_time`: Custom trend for pizza API responses

### Thresholds
```javascript
thresholds: {
    http_req_duration: ['p(95)<500'],
    'checks': ['rate>0.9'],
    'authentication_rate': ['rate>0.9'],
    'group_duration{group:::User Registration}': ['p(95)<2000']
}
```

## 🎯 API Endpoints Tested

- `GET /` - Homepage
- `POST /api/users` - User registration
- `POST /api/users/token/login` - User authentication
- `POST /api/pizza` - Create pizza order
- `GET /api/pizza/{id}` - Retrieve pizza order

## 📈 Test Scenarios

### Load Patterns
- **Ramp-up**: Gradual increase in virtual users
- **Steady-state**: Constant load for duration
- **Ramp-down**: Gradual decrease to zero

```javascript
stages: [
    { duration: '5s', target: 2 },   // Ramp up to 2 VUs
    { duration: '10s', target: 10 }, // Ramp up to 10 VUs
    { duration: '5s', target: 0 },   // Ramp down to 0
]
```
### Basic Configuration
```javascript
export const options = {
    vus: 3,
    duration: '10s',
    thresholds: {
        http_req_duration: ['p(95)<500']
    }
};
```
```javascript
export const options = {
    stages: [
        { duration: '5s', target: 2 },
        { duration: '5s', target: 4 },
        { duration: '3s', target: 0 }
    ],
    thresholds: {
        'checks': ['rate>0.9'],
        'group_duration{group:::User Login}': ['p(95)<2000']
    }
};
```

## 📋 Test Data

### User Registration Payload
```json
{
    "username": "AntarAbCd1",
    "password": "password123"
}
```

### Pizza Order Payload
```json
{
    "maxCaloriesPerSlice": 1000,
    "mustBeVegetarian": true,
    "excludedIngredients": ["Pizza curtur"],
    "maxNumberOfToppings": 9,
    "minNumberOfToppings": 2,
    "customName": "John Doe"
}
```

## 🚨 Troubleshooting

### Common Issues
- **High failure rates**: Check API endpoints and authentication
- **Slow response times**: Review network conditions and API performance
- **Memory issues**: Reduce VUs or add sleep between requests

### Debug Mode
```bash
# Run with verbose logging
k6 run --log-output=stdout --logformat=raw test1.js

# Run with HTTP debug
k6 run --http-debug test1.js
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add your test scenarios
4. Update this README if needed
5. Submit a pull request

## 📄 License

ISC License - See package.json for details

## 🔗 Resources

- [k6 Documentation](https://k6.io/docs/)
- [k6 HTTP Testing](https://k6.io/docs/using-k6/http-requests/)
- [k6 Metrics](https://k6.io/docs/using-k6/metrics/)
- [QuickPizza API](https://quickpizza.grafana.com)