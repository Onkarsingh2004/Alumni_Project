# 🚀 Alumni Portal - Walkthrough Demonstration

Follow this guide to experience the full power of your application.

## 1. The Student Journey (Alice)
**Goal**: Alice is a 3rd-year student looking for mentorship.

1.  **Register**:
    *   Go to -> `http://localhost:3000/register`
    *   Select **Student**.
    *   Name: `Alice Student`, Email: `alice@test.com`, Pass: `123456`.
    *   *Result*: You are redirected to `/dashboard`.
2.  **Edit Profile**:
    *   Click **Profile** in the navbar.
    *   Fill in: Branch `CSE`, Year `3`, Skills `React, Node`.
    *   Click **Save**.
3.  **Find Mentor**:
    *   Click **Mentors**.
    *   You might see "No mentors found" yet. Let's fix that!

## 2. The Alumni Journey (Bob)
**Goal**: Bob is a Google Engineer ready to help.

1.  **Register** (Open new Incognito Window):
    *   Go to -> `http://localhost:3000/register`
    *   Select **Alumni**.
    *   Name: `Bob Engineer`, Email: `bob@google.com`, Pass: `123456`.
2.  **Edit Profile**:
    *   Go to **Profile**.
    *   Company: `Google`, Role: `Senior SDE`, Exp: `5`, Domain: `Backend`.
    *   **IMPORTANT**: Check `Available for Mentorship`.
    *   Click **Save**.
3.  **Host Event**:
    *   Go to **Events**.
    *   Click **Host Event**.
    *   Title: `System Design Masterclass`, Type: `Webinar`.
    *   Click **Create**.

## 3. The Connection (Alice meets Bob)
**Goal**: Alice requests mentorship and joins Bob's event.

1.  **Switch back to Alice (Student)**.
2.  **Request Mentorship**:
    *   Go to **Mentors**.
    *   🎉 **Bob** now appears in the list!
    *   Click **Request Mentorship**.
    *   Message: "Hi Bob, I love backend engineering. Can you guide me?".
    *   Click **Send**.
3.  **Join Event**:
    *   Go to **Events**.
    *   See Bob's "System Design Masterclass".
    *   Click **Register Now**. -> Changes to "Registered".
4.  **Community**:
    *   Go to **Community**.
    *   Post: "Anyone attending Bob's webinar?".
    *   See it appear in the feed.

## 4. Closing the Loop (Bob)
**Goal**: Bob accepts the request.

1.  **Switch back to Bob (Alumni)**.
2.  **Dashboard**:
    *   Go to **Dashboard**.
    *   See **Mentorship Request** from Alice.
    *   Click **Accept** (Green Checkmark).
    *   *Status changes to Accepted*.

---
**✅ Demo Complete!**
You have just successfully bridged the gap between a Student and an Alumni.
