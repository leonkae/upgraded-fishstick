## ✅ **PHASE 1: Project Setup & Planning**

> _Goal: Establish a stable foundation before development._

### 🔹 Environment & Tools

- [x] Set up Git repository and version control
- [ ] Set up project management board (e.g., Trello, Jira)
- [x] Define folder structure for frontend and backend
- [x] Configure environment variable system

### 🔹 Requirements Review

- [x] Review Scope of Work and SLA
- [x] Confirm tech stack, APIs, and third-party services
- [ ] List and request missing content or access from client

---

## 🚧 **PHASE 2: Backend Development**

### 🔹 Core Setup

- [x] Set up Node.js + Express backend
- [ ] Connect to MongoDB (on Droplet)
- [x] Create API base structure and routing
- [x] Add admin authentication system

### 🔹 Questionnaire Logic

- [x] Define schema for questions and answers
- [ ] Create endpoints to serve quiz content
- [ ] Build scoring logic engine
- [ ] Return category (Heaven, Hell, In-Between)

### 🔹 Results Engine

- [ ] Set up result templates in database
- [ ] Serve result + recommendations via API
- [ ] Link content (e.g., devotionals, articles)

### 🔹 Payment Integration

- [ ] Integrate M-Pesa (Daraja API or gateway)
- [ ] Integrate card payments (Flutterwave or PayPal)
- [ ] Handle success/failure and webhook callbacks
- [ ] Enable admin tracking of donations
- [ ] Implement refund flagging system (manual process)

### 🔹 Email Notifications

- [ ] Configure Amazon SES
- [ ] Send quiz results to user email
- [ ] Integrate with Mailchimp (list only)

---

## 💻 **PHASE 3: Frontend Development (Next.js)**

### 🔹 App Setup

- [x] Scaffold Next.js project
- [ ] Implement layout and responsive styles
- [ ] Create route structure for quiz and results

### 🔹 Quiz Flow

- [ ] Build single-question-per-screen UI
- [ ] Add progress tracker (“Question X of Y”)
- [ ] Allow navigation back to previous questions
- [ ] Capture and submit answers to backend

### 🔹 Results Page

- [ ] Display outcome and result summary
- [ ] Load dynamic recommendations
- [ ] Add sharing options (WhatsApp, Facebook, etc.)
- [ ] Prompt for optional donation

### 🔹 User Info Capture

- [ ] Add name/email/phone input step
- [ ] Submit data to backend and trigger SES email
- [ ] Include opt-in for email follow-up

### 🔹 Payment UX

- [ ] Create donation call-to-action
- [ ] Integrate payment gateway frontend
- [ ] Show success and failure states

### 🔹 Enhancements

- [ ] Add SEO metadata and tags
- [ ] Lazy-load images and large components
- [ ] Display helpful error messages
- [ ] Handle no internet or API failures

---

## 🛠️ **PHASE 4: Admin Portal**

### 🔹 Admin Access

- [ ] Create admin login page
- [ ] Protect all routes behind session

### 🔹 Content Management

- [ ] Build interface to add/edit/delete questions
- [ ] Configure scoring and answer logic
- [ ] Manage result templates and links

### 🔹 Data Management

- [ ] Display user submissions
- [ ] Export to CSV
- [ ] Filter by score/result/time

### 🔹 Analytics & Reporting

- [ ] Show total completions, most common outcomes
- [ ] Display donation summaries
- [ ] Log payment transactions

### 🔹 Notifications

- [ ] Implement audit trail for admin changes
- [ ] Trigger admin email on new donation

---

## 🚀 **PHASE 5: QA, Testing & Deployment**

### 🔹 Testing

- [ ] Manually test quiz flow from start to finish
- [ ] Check layout across devices (mobile, tablet, desktop)
- [ ] Test payment gateway in sandbox mode

### 🔹 Performance & Accessibility

- [ ] Target <3s load time on mobile
- [ ] Validate WCAG accessibility (labels, contrast, keyboard nav)

### 🔹 Launch

- [ ] Deploy to DigitalOcean droplet
- [ ] Secure with HTTPS and domain setup
- [ ] Final client approval walkthrough

---

## 🧰 **PHASE 6: Post-Launch Support**

- [ ] Monitor server uptime and error logs
- [ ] Respond to bugs within 24 hours
- [ ] Conduct admin training session
- [ ] Deliver final credentials and system documentation
- [ ] Archive backups and finalize handover
