# 09. Testing and Execution — AI StudyBuddy API

## 1. Objective
Testing checks whether the AI StudyBuddy API works as expected, handles invalid input safely, protects user data, and produces reliable results.

## 2. Testing Environment
Suggested tools:
- Node.js and npm
- MongoDB local server or MongoDB Atlas
- Postman or Thunder Client
- Browser or frontend development server
- Automated test framework such as Jest or Vitest, if configured

Record the actual versions and environment used for the project.

## 3. Setup and Execution

1. Install a supported Node.js version.
2. Open the project folder in a terminal.
3. Install dependencies:

```bash
npm install
```

4. Create a `.env` file based on the project's environment-variable template. Example variable names:

```env
PORT=5000
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=replace-with-a-long-random-secret
AI_API_KEY=your-server-side-ai-provider-key
```

Only include variables required by your implementation. Never commit `.env` to Git or share real credentials.

5. Start the backend using the script defined in `package.json`. Common examples are:

```bash
npm run dev
```

or

```bash
npm start
```

6. Confirm the terminal reports that the server and database connection started successfully.
7. Send a request to the configured health-check endpoint, if the project provides one.

## 4. Functional Test Cases

| ID | Test | Expected result |
|---|---|---|
| TC-01 | Register with valid details | Account is created |
| TC-02 | Register with an existing email | Request is rejected safely |
| TC-03 | Login with correct credentials | Token and safe user profile returned |
| TC-04 | Login with incorrect password | Unauthorized response |
| TC-05 | Open protected route without token | Request is rejected |
| TC-06 | Request an available quiz | Quiz data is returned |
| TC-07 | Submit valid quiz answers | Score is calculated by backend |
| TC-08 | Submit malformed quiz data | Validation error returned |
| TC-09 | Create and retrieve flashcards | Correct records are returned |
| TC-10 | Retrieve progress | Only the signed-in user's progress is returned |
| TC-11 | Request an AI summary with valid text | Summary is returned or a clear provider error |
| TC-12 | Request AI generation with empty text | Validation error returned |
| TC-13 | Request a nonexistent resource | `404 Not Found` |
| TC-14 | Trigger a rate limit | Request is temporarily limited |
| TC-15 | Simulate database unavailability | Safe error is returned; server does not leak secrets |

## 5. API Testing Procedure
For each endpoint:
1. Select the correct HTTP method and URL.
2. Add `Content-Type: application/json` for JSON requests.
3. For protected routes, add `Authorization: Bearer <token>`.
4. Enter the request body when required.
5. Send the request.
6. Check the status code, response body, and database changes.
7. Repeat with missing, invalid, and boundary-case inputs.
8. Save the request and result in a test report.

## 6. Security and Data-Integrity Tests
- Verify passwords are stored as hashes, not plain text.
- Verify tokens are checked on protected routes.
- Verify one user cannot read, edit, or delete another user's private records.
- Verify secrets do not appear in browser JavaScript, logs, or API responses.
- Verify request size and AI usage limits.
- Verify user input is validated before database writes.
- Verify errors do not reveal stack traces or internal configuration.

## 7. Sample Test Report

| Test ID | Actual result | Status | Evidence / remarks |
|---|---|---|---|
| TC-01 | Fill after execution | Not run | Add screenshot or response |
| TC-02 | Fill after execution | Not run | Add screenshot or response |
| TC-03 | Fill after execution | Not run | Add screenshot or response |
| TC-05 | Fill after execution | Not run | Add screenshot or response |
| TC-07 | Fill after execution | Not run | Add score response |
| TC-10 | Fill after execution | Not run | Confirm ownership |
| TC-11 | Fill after execution | Not run | Do not include API keys |
| TC-15 | Fill after execution | Not run | Add safe error response |

Do not mark tests as passed until they have actually been executed. Attach real screenshots or response captures to the final report.

## 8. Troubleshooting
- **Server command not found:** Check Node.js installation and run `npm install`.
- **Port already in use:** Change the configured port or stop the other process.
- **Database connection error:** Check the URI, network access, credentials, and database status.
- **401 response:** Check the token, expiration, and authorization header.
- **CORS error:** Configure the backend to allow the correct frontend origin.
- **AI request fails:** Check the server-side key, provider quota, network, timeout, and request format.
- **404 on a deployed site:** Confirm the deployment output directory, build command, and route configuration.

## 9. Completion Criteria
Testing is complete when critical functional and security cases have been run, defects are recorded, high-priority defects are resolved, and the test report contains actual outcomes.

## 10. Result
This phase provides a repeatable procedure for starting the application and verifying its API. The final report must reflect observed test results rather than assumed success.
