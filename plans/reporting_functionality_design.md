# Reporting Functionality Design

This document outlines the design for the reporting/flagging functionality, allowing users to report inappropriate content (users, merchants, posts, reels) and providing an admin interface to manage these reports.

## 1. Report Database Model

**Model Name:** `Report`

**Description:** Stores information about user-submitted reports.

**Fields:**

*   `id`: Primary Key, UUID
*   `reporter_id`: Foreign Key to `User` model (the user who submitted the report)
*   `reported_entity_type`: String (Enum: 'user', 'merchant', 'post', 'reel') - Identifies the type of entity being reported.
*   `reported_entity_id`: UUID (ID of the specific entity being reported)
*   `reason`: String (Text detailing the reason for the report. This could be a predefined list of reasons or free text from the user.)
*   `status`: String (Enum: 'pending', 'under_review', 'resolved', 'rejected') - Current status of the report. Default: 'pending'
*   `created_at`: DateTime (Timestamp of when the report was created)
*   `updated_at`: DateTime (Timestamp of when the report was last updated)

**Relationships:**

*   Many-to-one with `User` (a user can submit many reports).

## 2. Backend API Design

### 2.1. Submit Report API

*   **Endpoint:** `POST /api/reports`
*   **Description:** Allows authenticated users to submit a new report.
*   **Request Body:**
    ```json
    {
        "reported_entity_type": "[user|merchant|post|reel]",
        "reported_entity_id": "<UUID_of_entity>",
        "reason": "<string_reason_for_report>"
    }
    ```
*   **Authentication:** Required (User submitting the report).
*   **Response:**
    *   `201 Created`: Report submitted successfully.
    *   `400 Bad Request`: Invalid input or missing fields.
    *   `401 Unauthorized`: User not authenticated.
    *   `404 Not Found`: Reported entity not found.

### 2.2. Admin Report Management API

*   **Endpoint:** `GET /api/admin/reports`
    *   **Description:** Retrieve a list of reports, with optional filtering (e.g., by status, entity type).
    *   **Query Parameters:** `status`, `reported_entity_type`, `page`, `limit`.
    *   **Authentication:** Required (Admin user).
    *   **Response:** List of `Report` objects.

*   **Endpoint:** `GET /api/admin/reports/{report_id}`
    *   **Description:** Retrieve details of a specific report.
    *   **Authentication:** Required (Admin user).
    *   **Response:** Single `Report` object.

*   **Endpoint:** `PUT /api/admin/reports/{report_id}/status`
    *   **Description:** Update the status of a report (e.g., to 'under_review', 'resolved', 'rejected').
    *   **Request Body:**
        ```json
        {
            "status": "[under_review|resolved|rejected]"
        }
        ```
    *   **Authentication:** Required (Admin user).
    *   **Response:** `200 OK` or `400 Bad Request`.

*   **Endpoint:** `POST /api/admin/reports/{report_id}/action` (Optional, for future expansion)
    *   **Description:** API to trigger actions based on a report (e.g., suspend user, remove post). This would be more complex and depend on the specific actions needed.
    *   **Authentication:** Required (Admin user).

## 3. Frontend UI Design

### 3.1. User Report Submission UI

*   **Integration:** A 'Report' button or option will be available on user profiles, merchant pages. For individual posts and reels, the 'Report' button will be accessible within a three-dot menu.
*   **Report Form:** Clicking 'Report' will open a modal or navigate to a dedicated page with a form.
    *   **Fields:**
        *   **Report Reason (Dropdown/Radio buttons):** A predefined list of common reasons (e.g., "Inappropriate content", "Spam", "Harassment", "Misinformation"). An "Other" option with a free-text input field.
        *   **Additional Details (Textarea):** Optional field for users to provide more context.
    *   **Submission:** A 'Submit Report' button.
*   **Feedback:** Upon successful submission, a confirmation message will be displayed (e.g., "Report submitted. We will review it shortly."). Error messages will be displayed for failed submissions.

### 3.2. Admin Report Review Page

*   **Route:** `/admin/reports`
*   **Layout:** A dashboard-style page accessible only to admin users.
*   **Report List:**
    *   A table or list view displaying all submitted reports.
    *   **Columns:** Report ID, Reporter (User), Reported Entity Type, Reported Entity ID, Reason, Status, Created At.
    *   **Filtering & Sorting:** Options to filter reports by status (Pending, Under Review, Resolved, Rejected), reported entity type, and sort by creation date.
    *   **Pagination:** To handle a large number of reports.
*   **Report Detail View (Clicking on a report):**
    *   Displays all details of the report.
    *   Links to the reported user's profile, merchant page, or content.
    *   **Actions:**
        *   **Change Status:** Buttons or a dropdown to update the report status (e.g., 'Mark as Under Review', 'Resolve', 'Reject').
        *   **Admin Notes (Textarea):** A field for admin users to add internal notes about their review and actions taken.
        *   **Direct Actions (Optional, for future expansion):** Buttons to directly action the reported entity, such as:
            *   'Suspend User'
            *   'Remove Content'
            *   'Ban Merchant'
*   **Confirmation:** Confirmation dialogs for status changes and direct actions.

## 4. Workflow Diagram

```mermaid
graph TD
    A[User encounters problematic content] --> B{Click Report Button}
    B --> C[Open Report Form]
    C --> D{User selects reason & submits}
    D -- Submits to --> E[Backend API: POST /reports]
    E -- Saves to --> F[Database: Report Table]
    F --> G[Admin Notification (Optional)]

    H[Admin navigates to /admin/reports] --> I[Admin Report List View]
    I --> J{Admin filters/sorts reports}
    J --> K[Select individual Report]
    K --> L[Report Detail View]
    L --> M{Admin actions: Change Status, Add Notes, etc.}
    M -- Updates --> F[Database: Report Table]
    M -- May trigger --> N[Automated Action (e.g., send warning to user)]