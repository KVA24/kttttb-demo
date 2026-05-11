# Implementation Plan: Wiinvent Authentication Demo

## Overview

This implementation plan breaks down the Wiinvent Authentication Demo into discrete, actionable coding tasks. The application is a React + TypeScript web application built with Vite and styled with Tailwind CSS. It demonstrates a three-step authentication flow with HMAC-SHA256 signature generation and mock API responses.

The implementation follows a bottom-up approach: utilities first, then services, then components, and finally integration and polish.

## Tasks

- [ ] 1. Project setup and configuration
  - [ ] 1.1 Initialize Vite + React + TypeScript project
    - Create new Vite project with React-TypeScript template
    - Configure tsconfig.json for strict type checking
    - Set up project directory structure (src/components, src/services, src/utils, src/types)
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_
  
  - [ ] 1.2 Install and configure Tailwind CSS
    - Install Tailwind CSS and its dependencies
    - Configure tailwind.config.js with custom color scheme (primary blue, success green, error red)
    - Set up PostCSS configuration
    - Add Tailwind directives to main CSS file
    - _Requirements: 9.1, 9.3_
  
  - [ ] 1.3 Install testing dependencies
    - Install Vitest for unit testing
    - Install @testing-library/react for component testing
    - Install fast-check for property-based testing
    - Configure vitest.config.ts
    - _Requirements: Testing infrastructure_

- [ ] 2. Define TypeScript type definitions
  - [ ] 2.1 Create API request and response types
    - Define GetOTPRequest, VerifyOTPRequest, GetDataRequest interfaces
    - Define GetOTPResponse, VerifyOTPResponse, GetDataResponse interfaces
    - Define ErrorResponse interface
    - Create types file at src/types/api.ts
    - _Requirements: 12.1, 12.2, 12.3, 12.4_
  
  - [ ] 2.2 Create component prop types
    - Define AuthFlowState interface
    - Define StepIndicatorProps, Step1Props, Step2Props, Step3Props interfaces
    - Define ResponseDisplayProps, RequestHistoryPanelProps interfaces
    - Define RequestHistoryItem interface
    - Create types file at src/types/components.ts
    - _Requirements: 12.5_
  
  - [ ] 2.3 Create service configuration types
    - Define ApiClientConfig interface
    - Define MockApiService configuration types
    - Create types file at src/types/services.ts
    - _Requirements: 4.1, 4.5_

- [ ] 3. Implement utility functions
  - [ ] 3.1 Implement request ID generator
    - Create generateRequestId() function
    - Use format: req_{timestamp}_{random_alphanumeric}
    - Export from src/utils/requestIdGenerator.ts
    - _Requirements: 11.1, 11.2, 11.3, 11.5_
  
  - [ ]* 3.2 Write property tests for request ID generator
    - **Property 5: Request ID Uniqueness**
    - **Validates: Requirements 11.1, 11.5**
    - Test that all generated IDs in a sequence are unique
    - Use fast-check with 100 iterations
    - Create test file at src/utils/__tests__/requestIdGenerator.property.test.ts
  
  - [ ]* 3.3 Write property tests for request ID format
    - **Property 6: Request ID Format**
    - **Validates: Requirements 11.2**
    - Test that generated IDs match pattern req_{timestamp}_{random}
    - Verify timestamp is valid Unix timestamp
    - Verify random part is alphanumeric
    - Use fast-check with 100 iterations
  
  - [ ] 3.4 Implement HMAC-SHA256 signature generator
    - Create generateSignature() function using Web Crypto API
    - Implement constructPayload() helper function (METHOD + URI + TIMESTAMP + BODY)
    - Implement minifyJson() helper function
    - Export from src/utils/signatureGenerator.ts
    - _Requirements: 4.2, 4.3, 4.4_
  
  - [ ]* 3.5 Write property tests for signature determinism
    - **Property 1: Signature Determinism**
    - **Validates: Requirements 4.2, 4.4**
    - Test that same inputs always produce same signature
    - Use fast-check with 100 iterations
    - Create test file at src/utils/__tests__/signatureGenerator.property.test.ts
  
  - [ ]* 3.6 Write property tests for signature format validity
    - **Property 2: Signature Format Validity**
    - **Validates: Requirements 4.2, 4.4**
    - Test that signature is always 64-character hexadecimal string
    - Use fast-check with 100 iterations
  
  - [ ]* 3.7 Write property tests for signature uniqueness
    - **Property 3: Signature Uniqueness**
    - **Validates: Requirements 4.2, 4.4**
    - Test that different inputs produce different signatures
    - Use fast-check with 100 iterations
  
  - [ ]* 3.8 Write property tests for payload construction order
    - **Property 4: Payload Construction Order**
    - **Validates: Requirements 4.3**
    - Test that payload is constructed as METHOD + URI + TIMESTAMP + BODY
    - Use fast-check with 100 iterations
  
  - [ ] 3.9 Implement error handler utility
    - Create ApiError class extending Error
    - Implement handleApiError() function
    - Handle 4xx errors (return specific message)
    - Handle 5xx errors (return generic server error message)
    - Handle network errors (return network error message)
    - Export from src/utils/errorHandler.ts
    - _Requirements: 10.1, 10.2, 10.3, 10.5_
  
  - [ ]* 3.10 Write unit tests for error handler
    - Test 4xx error handling returns specific message
    - Test 5xx error handling returns generic message
    - Test network error handling
    - Test unknown error handling
    - Create test file at src/utils/__tests__/errorHandler.test.ts

- [ ] 4. Checkpoint - Verify utility functions
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. Implement API services
  - [ ] 5.1 Implement Mock API Service
    - Create MockApiService class
    - Implement getOTP() method returning mock GetOTPResponse
    - Implement verifyOTP() method returning mock VerifyOTPResponse
    - Implement getData() method returning mock GetDataResponse
    - Add simulateDelay() helper (1 second delay)
    - Add generateSessionOtp() and generateConsentRef() helpers
    - Export from src/services/mockApiService.ts
    - _Requirements: 6.1, 6.2, 6.3_
  
  - [ ] 5.2 Implement API Client Service
    - Create ApiClient class with ApiClientConfig
    - Implement getOTP(), verifyOTP(), getData() public methods
    - Implement private makeRequest() method
    - Generate X-Signature and X-Timestamp headers
    - Include X-Tenant-Code, X-Business-Code, Content-Type headers
    - Handle response errors and throw ApiError
    - Export from src/services/apiClient.ts
    - _Requirements: 4.1, 4.2, 4.5, 10.2, 10.3_
  
  - [ ] 5.3 Create API Service Factory
    - Create createApiService() factory function
    - Add USE_MOCK_API toggle (default: true)
    - Return MockApiService when USE_MOCK_API is true
    - Return ApiClient with demo config when USE_MOCK_API is false
    - Export from src/services/apiServiceFactory.ts
    - _Requirements: 6.1, 6.2, 6.3_
  
  - [ ]* 5.4 Write unit tests for Mock API Service
    - Test getOTP returns valid response structure
    - Test verifyOTP returns valid response with TTL
    - Test getData returns valid results array
    - Test delay simulation works
    - Create test file at src/services/__tests__/mockApiService.test.ts

- [ ] 6. Implement React components - Utilities
  - [ ] 6.1 Create ResponseDisplay component
    - Accept requestPayload, responseData, headers, isLoading, error props
    - Display formatted JSON for request payload
    - Display formatted JSON for response data
    - Display X-Signature and X-Timestamp headers
    - Show loading spinner when isLoading is true
    - Display error message when error is present
    - Use Tailwind CSS for styling
    - Export from src/components/ResponseDisplay.tsx
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 9.3, 9.4_
  
  - [ ] 6.2 Create StepIndicator component
    - Accept currentStep and completedSteps props
    - Display three steps: "Get OTP", "Verify OTP", "Get Data"
    - Highlight current step with primary color
    - Show checkmark for completed steps with success color
    - Use arrow or line connectors between steps
    - Use Tailwind CSS for styling
    - Export from src/components/StepIndicator.tsx
    - _Requirements: 8.1, 8.2, 8.3, 9.2, 9.3_
  
  - [ ] 6.3 Create RequestHistoryPanel component
    - Accept history array of RequestHistoryItem props
    - Display chronological list of requests (newest first)
    - Show method, endpoint, timestamp for each request
    - Make panel collapsible/expandable
    - Allow expanding individual requests to see full details
    - Use Tailwind CSS for styling
    - Export from src/components/RequestHistoryPanel.tsx
    - _Requirements: 7.5, 9.4, 9.5_

- [ ] 7. Implement React components - Step components
  - [ ] 7.1 Create Step1_GetOTP component
    - Accept onSuccess, onError, isActive props
    - Render MSISDN input field with label and placeholder
    - Render ID Number (param_detail.id_no) input field
    - Implement form validation (non-empty fields)
    - Add "Request OTP" submit button
    - Call API service getOTP() on submit
    - Generate unique request_id using utility
    - Display loading state during API call
    - Display error message on failure
    - Call onSuccess with session_otp on success
    - Include ResponseDisplay component
    - Use Tailwind CSS for styling
    - Export from src/components/Step1_GetOTP.tsx
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 5.1, 5.2, 5.4, 9.4, 10.4_
  
  - [ ] 7.2 Create Step2_VerifyOTP component
    - Accept sessionOtp, onSuccess, onError, isActive props
    - Render OTP input field with label and placeholder
    - Implement form validation (non-empty OTP)
    - Add "Verify OTP" submit button
    - Call API service verifyOTP() on submit with sessionOtp
    - Generate unique request_id using utility
    - Display loading state during API call
    - Display error message on failure
    - Call onSuccess with consent_ref, time_to_life, expire_time on success
    - Include ResponseDisplay component
    - Use Tailwind CSS for styling
    - Export from src/components/Step2_VerifyOTP.tsx
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 5.3, 9.4, 10.4_
  
  - [ ] 7.3 Create Step3_GetData component
    - Accept consentRef, onSuccess, onError, isActive, autoTrigger props
    - Automatically call API service getData() when isActive becomes true
    - Generate unique request_id using utility
    - Display loading state during API call
    - Display error message on failure
    - Display verification results (code, status, status_message) on success
    - Call onSuccess with response on success
    - Include ResponseDisplay component
    - Use Tailwind CSS for styling
    - Export from src/components/Step3_GetData.tsx
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 9.4, 10.4_

- [ ] 8. Checkpoint - Verify individual components
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 9. Implement main container component
  - [ ] 9.1 Create AuthFlowContainer component
    - Define AuthFlowState with currentStep, sessionOtp, consentRef, timeToLife, expireTime, requestHistory, isLoading, error
    - Initialize state with currentStep: 1, all other fields null/empty
    - Render StepIndicator with currentStep and completedSteps
    - Conditionally render Step1_GetOTP when currentStep is 1
    - Conditionally render Step2_VerifyOTP when currentStep is 2
    - Conditionally render Step3_GetData when currentStep is 3
    - Implement handleStep1Success to store sessionOtp and advance to step 2
    - Implement handleStep2Success to store consentRef, timeToLife, expireTime and advance to step 3
    - Implement handleStep3Success to store results
    - Implement handleError to display error messages
    - Add request/response to requestHistory after each API call
    - Render RequestHistoryPanel with requestHistory
    - Add Reset button that clears all state and returns to step 1
    - Use Tailwind CSS for layout and styling
    - Export from src/components/AuthFlowContainer.tsx
    - _Requirements: 1.1, 1.2, 2.1, 2.2, 3.1, 7.5, 8.1, 8.2, 8.3, 8.4, 8.5, 9.4_
  
  - [ ]* 9.2 Write integration tests for AuthFlowContainer
    - Test step 1 form submission triggers API call
    - Test successful step 1 advances to step 2
    - Test step 2 form submission with sessionOtp
    - Test successful step 2 advances to step 3
    - Test step 3 auto-triggers with consentRef
    - Test error display on API failure
    - Test reset button clears state and returns to step 1
    - Create test file at src/components/__tests__/AuthFlowContainer.test.tsx

- [ ] 10. Create main App component and entry point
  - [ ] 10.1 Create App component
    - Render header with title "Wiinvent Authentication Flow Demo"
    - Render AuthFlowContainer component
    - Add footer with attribution or additional info
    - Use Tailwind CSS for layout
    - Export from src/App.tsx
    - _Requirements: 9.1, 9.2, 9.4_
  
  - [ ] 10.2 Set up main entry point
    - Create main.tsx with React root rendering
    - Import and render App component
    - Import Tailwind CSS styles
    - Configure React StrictMode
    - _Requirements: 9.1_
  
  - [ ] 10.3 Create index.html
    - Set up HTML template with proper meta tags
    - Add viewport meta tag for responsive design
    - Link to main.tsx entry point
    - Set page title
    - _Requirements: 9.1, 9.5_

- [ ] 11. UI polish and styling refinements
  - [ ] 11.1 Enhance form field styling
    - Add focus states with primary color border
    - Add hover states for buttons
    - Ensure proper spacing and alignment
    - Add input validation visual feedback (red border for errors)
    - Use consistent padding and margins
    - _Requirements: 9.1, 9.3, 9.4_
  
  - [ ] 11.2 Improve loading states
    - Add animated spinner component
    - Show spinner during API calls
    - Disable form inputs during loading
    - Add loading text alongside spinner
    - _Requirements: 1.5, 2.5, 3.5, 9.3_
  
  - [ ] 11.3 Enhance error display
    - Style error messages with error color (red)
    - Add error icon alongside error text
    - Ensure errors are clearly visible
    - Add dismiss button for errors
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 9.3_
  
  - [ ] 11.4 Improve JSON display formatting
    - Use syntax highlighting for JSON (consider react-json-view or similar)
    - Add copy-to-clipboard button for JSON blocks
    - Ensure JSON is properly indented and readable
    - Make JSON sections collapsible
    - _Requirements: 7.1, 7.2, 7.3, 9.5_
  
  - [ ] 11.5 Add responsive design adjustments
    - Test layout on tablet and desktop sizes
    - Adjust component widths for different screen sizes
    - Ensure forms are usable on smaller screens
    - Use Tailwind responsive utilities (sm:, md:, lg:)
    - _Requirements: 9.5_
  
  - [ ] 11.6 Add transitions and animations
    - Add smooth transitions between steps
    - Animate step indicator progress
    - Add fade-in animations for response displays
    - Add button hover and click animations
    - _Requirements: 9.3_

- [ ] 12. Final integration and testing
  - [ ] 12.1 End-to-end manual testing
    - Test complete flow: Get OTP → Verify OTP → Get Data
    - Test form validation on all steps
    - Test error scenarios (mock API errors)
    - Test reset functionality
    - Test request history display
    - Verify all UI elements render correctly
    - _Requirements: All requirements_
  
  - [ ] 12.2 Cross-browser testing
    - Test in Chrome
    - Test in Firefox
    - Test in Safari
    - Verify Web Crypto API compatibility
    - _Requirements: 4.2, 4.4_
  
  - [ ] 12.3 Performance optimization
    - Check bundle size with Vite build
    - Optimize component re-renders if needed
    - Ensure fast initial load time
    - Verify no memory leaks in request history
    - _Requirements: Performance_
  
  - [ ] 12.4 Code quality review
    - Run TypeScript type checking (tsc --noEmit)
    - Ensure no TypeScript errors
    - Review code for consistency
    - Add JSDoc comments to utility functions
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

- [ ] 13. Final checkpoint - Complete verification
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP delivery
- Each task references specific requirements for traceability
- Property-based tests validate universal correctness properties from the design document
- Unit tests and integration tests validate specific examples and component interactions
- The implementation follows a bottom-up approach: utilities → services → components → integration
- Checkpoints ensure incremental validation at key milestones
- All code uses TypeScript for type safety as specified in the design document
- Tailwind CSS is used for all styling to match the design document specifications
- The Mock API Service is used by default for demonstration purposes

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2", "1.3"] },
    { "id": 1, "tasks": ["2.1", "2.2", "2.3"] },
    { "id": 2, "tasks": ["3.1", "3.4", "3.9"] },
    { "id": 3, "tasks": ["3.2", "3.3", "3.5", "3.6", "3.7", "3.8", "3.10"] },
    { "id": 4, "tasks": ["5.1", "5.2"] },
    { "id": 5, "tasks": ["5.3", "5.4"] },
    { "id": 6, "tasks": ["6.1", "6.2", "6.3"] },
    { "id": 7, "tasks": ["7.1", "7.2", "7.3"] },
    { "id": 8, "tasks": ["9.1"] },
    { "id": 9, "tasks": ["9.2"] },
    { "id": 10, "tasks": ["10.1", "10.2", "10.3"] },
    { "id": 11, "tasks": ["11.1", "11.2", "11.3", "11.4", "11.5", "11.6"] },
    { "id": 12, "tasks": ["12.1", "12.2", "12.3", "12.4"] }
  ]
}
```
