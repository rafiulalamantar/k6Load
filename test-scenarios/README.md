# K6 Load Testing Scenarios

This folder contains various k6 load testing scenarios designed to test different aspects of application performance under stress.

## Test Scenarios Overview

### Basic Tests
- **test1.js**: Simple API Load Test - Basic load test with constant virtual users
- **test2.js**: Ramping Load Test - Gradual increase in load to find performance limits

### Stress Tests
- **stressTest.js**: E-commerce Flash Sale Spike - Sudden traffic spike simulation
- **rateLimitTest.js**: API Rate Limiting Under Load - Tests rate limiting behavior
- **databaseStressTest.js**: Database Connection Pool Under Stress - Tests DB connection limits
- **memoryLeakTest.js**: Memory Leak Detection - Long-running test for memory issues
- **concurrentLoginTest.js**: Mass User Authentication Surge - Simultaneous login attempts

### Advanced Scenarios
- **fileUploadTest.js**: Concurrent File Upload Stress - File upload performance under load
- **webSocketTest.js**: Real-Time Communication Load - WebSocket connection testing
- **microservicesTest.js**: Distributed System Inter-Service Calls - Microservices communication
- **cdnPerformanceTest.js**: Content Delivery Network Efficiency - Static asset delivery
- **authTokenRefreshTest.js**: Token Expiration and Refresh Handling - Authentication token management
- **dataExportImportTest.js**: Bulk Data Operations - Large-scale data processing

### End-to-End Tests
- **endToEnd.js**: Complete User Workflow Simulation - Full user journey testing
- **endToEnd_group.js**: Structured User Journey with Metrics - Grouped workflow with detailed metrics

### Browser Tests
- **browserTest.js**: User Interface Performance Test - Browser-based UI testing

## Running Tests

To run any test, use:
```bash
k6 run test-scenarios/<filename>.js
```

For example:
```bash
k6 run test-scenarios/stressTest.js
```

## Scenario Descriptions

Each test file contains a detailed scenario description at the top, explaining:
- Scenario name
- Description of what it tests
- Real-life applications where this scenario is relevant

This helps you understand the purpose and context of each test before running it.