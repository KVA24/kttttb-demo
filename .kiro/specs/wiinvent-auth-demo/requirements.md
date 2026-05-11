# Requirements Document

## Introduction

This document specifies the requirements for a React web application that demonstrates the Wiinvent subscriber information verification authentication flow. The application simulates a three-step authentication process: OTP generation, OTP verification, and data retrieval. The system uses HMAC-SHA256 signature generation for API security and provides a complete user interface for testing the authentication workflow with mock API responses.

## Glossary

- **System**: The React web application that simulates the Wiinvent authentication flow
- **User**: The person interacting with the web application
- **OTP**: One-Time Password sent to the subscriber's phone number
- **MSISDN**: Mobile Station International Subscriber Directory Number (phone number)
- **Session_OTP**: A session identifier returned after requesting an OTP
- **Consent_Ref**: A consent reference token returned after successful OTP verification
- **X-Signature**: HMAC-SHA256 signature header for API authentication
- **X-Timestamp**: Unix timestamp header for API requests
- **Request_Body**: JSON payload sent to API endpoints
- **Mock_API**: Simulated API responses for demonstration purposes
- **Param_Detail**: Object containing verification parameters (e.g., id_no)
- **TTL**: Time To Live - duration for which consent reference is valid

## Requirements

### Requirement 1: OTP Request Step

**User Story:** As a user, I want to request an OTP by providing my phone number and ID information, so that I can begin the authentication process.

#### Acceptance Criteria

1. WHEN a user enters a valid MSISDN and param_detail (id_no), THE System SHALL generate a unique request ID and call the get-otp endpoint
2. WHEN the get-otp request is successful, THE System SHALL store the session_otp and display it to the user
3. WHEN the get-otp request fails with 4xx error, THE System SHALL display the error message to the user
4. WHEN the get-otp request fails with 5xx error, THE System SHALL display a server error message to the user
5. WHILE the get-otp request is in progress, THE System SHALL display a loading indicator

### Requirement 2: OTP Verification Step

**User Story:** As a user, I want to verify the OTP I received, so that I can obtain consent to access my subscriber data.

#### Acceptance Criteria

1. WHEN a user enters a valid OTP with the session_otp from step 1, THE System SHALL call the verify-otp endpoint
2. WHEN the verify-otp request is successful, THE System SHALL store the consent_ref, time_to_life, and expire_time
3. WHEN the verify-otp request fails with 4xx error, THE System SHALL display the error message to the user
4. WHEN the verify-otp request fails with 5xx error, THE System SHALL display a server error message to the user
5. WHILE the verify-otp request is in progress, THE System SHALL display a loading indicator

### Requirement 3: Data Retrieval Step

**User Story:** As a user, I want the system to automatically retrieve my verification results after OTP verification, so that I can see the authentication outcome.

#### Acceptance Criteria

1. WHEN the verify-otp step completes successfully, THE System SHALL automatically call the get-data endpoint with the consent_ref
2. WHEN the get-data request is successful, THE System SHALL display the results array with code, status, and status_message
3. WHEN the get-data request fails with 4xx error, THE System SHALL display the error message to the user
4. WHEN the get-data request fails with 5xx error, THE System SHALL display a server error message to the user
5. WHILE the get-data request is in progress, THE System SHALL display a loading indicator

### Requirement 4: API Security Headers

**User Story:** As a developer, I want the system to generate proper security headers for each API request, so that the requests are authenticated correctly.

#### Acceptance Criteria

1. WHEN making any API request, THE System SHALL generate an X-Timestamp header containing the current Unix timestamp
2. WHEN making any API request, THE System SHALL generate an X-Signature header using HMAC-SHA256 algorithm
3. THE System SHALL construct the signature payload as: HTTP_METHOD + REQUEST_URI + TIMESTAMP + REQUEST_BODY (minified JSON)
4. THE System SHALL compute the HMAC-SHA256 signature using the API secret key and convert it to hexadecimal format
5. WHEN making any API request, THE System SHALL include X-Tenant-Code, X-Business-Code, and Content-Type headers

### Requirement 5: Form Input Validation

**User Story:** As a user, I want the system to validate my input before submitting, so that I receive immediate feedback on invalid data.

#### Acceptance Criteria

1. WHEN a user enters an MSISDN, THE System SHALL validate that it is a non-empty string
2. WHEN a user enters an id_no in param_detail, THE System SHALL validate that it is a non-empty string
3. WHEN a user enters an OTP, THE System SHALL validate that it is a non-empty string
4. WHEN form validation fails, THE System SHALL display validation error messages
5. WHEN form validation fails, THE System SHALL prevent API request submission

### Requirement 6: Mock API Responses

**User Story:** As a developer, I want the system to provide mock API responses, so that I can demonstrate the flow without a real backend.

#### Acceptance Criteria

1. THE System SHALL provide mock responses for successful get-otp requests returning a session_otp
2. THE System SHALL provide mock responses for successful verify-otp requests returning consent_ref, time_to_life, and expire_time
3. THE System SHALL provide mock responses for successful get-data requests returning a results array
4. THE System SHALL provide mock responses for 4xx error scenarios with appropriate error messages
5. THE System SHALL provide mock responses for 5xx error scenarios with appropriate error messages

### Requirement 7: Response Display

**User Story:** As a user, I want to see the complete API response for each step, so that I can understand what data is being exchanged.

#### Acceptance Criteria

1. WHEN any API request completes successfully, THE System SHALL display the full response JSON in a readable format
2. WHEN any API request fails, THE System SHALL display the error response JSON in a readable format
3. THE System SHALL display the request payload that was sent for each API call
4. THE System SHALL display the generated X-Signature and X-Timestamp headers for each request
5. THE System SHALL maintain a history of all requests and responses during the session

### Requirement 8: Workflow Navigation

**User Story:** As a user, I want to navigate through the authentication steps sequentially and reset the flow, so that I can test different scenarios.

#### Acceptance Criteria

1. WHEN the application starts, THE System SHALL display the get-otp form as the first step
2. WHEN the get-otp step completes successfully, THE System SHALL enable and display the verify-otp form
3. WHEN the verify-otp step completes successfully, THE System SHALL automatically proceed to the get-data step
4. THE System SHALL provide a reset button that clears all state and returns to the first step
5. THE System SHALL disable subsequent steps until previous steps are completed successfully

### Requirement 9: User Interface Design

**User Story:** As a user, I want a clean and intuitive interface, so that I can easily understand and use the authentication flow.

#### Acceptance Criteria

1. THE System SHALL use a modern UI framework (Tailwind CSS or Material-UI) for styling
2. THE System SHALL display clear step indicators showing the current step in the workflow
3. THE System SHALL use distinct visual styling for success, error, and loading states
4. THE System SHALL organize form fields with clear labels and placeholders
5. THE System SHALL display API responses in collapsible or expandable sections for better readability

### Requirement 10: Error Handling

**User Story:** As a user, I want clear error messages when something goes wrong, so that I can understand what happened and how to proceed.

#### Acceptance Criteria

1. WHEN a network error occurs, THE System SHALL display a user-friendly network error message
2. WHEN a 4xx error occurs, THE System SHALL display the specific error message from the API response
3. WHEN a 5xx error occurs, THE System SHALL display a generic server error message
4. WHEN an error occurs, THE System SHALL allow the user to retry the failed step
5. THE System SHALL log errors to the browser console for debugging purposes

### Requirement 11: Request ID Generation

**User Story:** As a developer, I want each API request to have a unique request ID, so that requests can be tracked and correlated.

#### Acceptance Criteria

1. WHEN making any API request, THE System SHALL generate a unique request_id
2. THE System SHALL use a UUID or timestamp-based format for request_id generation
3. THE System SHALL include the request_id in the request body for all API calls
4. THE System SHALL display the request_id in the request details shown to the user
5. FOR ALL requests in a single session, each request_id SHALL be unique

### Requirement 12: TypeScript Type Safety

**User Story:** As a developer, I want TypeScript type definitions for all API requests and responses, so that I can catch type errors during development.

#### Acceptance Criteria

1. THE System SHALL define TypeScript interfaces for get-otp request and response types
2. THE System SHALL define TypeScript interfaces for verify-otp request and response types
3. THE System SHALL define TypeScript interfaces for get-data request and response types
4. THE System SHALL define TypeScript types for API error responses
5. THE System SHALL use typed state management for all component state variables
