# Task Management Frontend

A modern Task Management web application built with **Angular 21** using Standalone Components, Signals, Reactive Forms, and Role-Based Authentication.

The application provides a clean, responsive user interface that enables Managers, Team Leads, and Employees to collaborate efficiently while enforcing role-based access control.




---

## Features

### Authentication

- User Registration
- Secure Login
- Logout
- Current User Session
- Cookie-Based Authentication
- Route Guards

---

### Dashboard

<img width="1918" height="912" alt="image" src="https://github.com/user-attachments/assets/f74bfd1f-45bb-47ec-b60b-83759f35bb60" />

- Responsive Dashboard
- Sidebar Navigation
- Navbar
- Role-Based Navigation
- Welcome Section

---


### Task Management
<img width="1917" height="906" alt="image" src="https://github.com/user-attachments/assets/9dc75a38-bb14-4a61-995d-c3cff656f91a" />
- Create Task
- Edit Task
- Delete Task
- View Task Details
- Update Task Status
- Assign Tasks
- Reassign Tasks




---

### User Management
<img width="1918" height="908" alt="image" src="https://github.com/user-attachments/assets/b7ddcd8f-5f8e-4e23-9665-be9587185e1e" />
Manager

- View All Users
- View Employees
- View Team Leads

Team Lead

- View Employees

Employee

- Personal Task Management


---

## Tech Stack

- Angular 21
- TypeScript
- RxJS
- Angular Signals
- Reactive Forms
- Bootstrap 5
- Bootstrap Icons
- CSS3

---

## Project Structure

```
src

app

├── core
├── guards
├── interceptors
├── layout
├── models
├── pages
│
├── auth
├── dashboard
├── tasks
├── users
│
├── services
└── shared
```

---

## Application Modules

### Authentication

- Login
- Register
- Session Management

### Dashboard

- Overview
- Navigation

### Tasks

- Task List
- Create Task
- Edit Task
- Status Management

### Users

- User Listing
- Role-Based Assignment

---

## Installation

Clone repository

```bash
git clone https://github.com/sachin2398/Task_Management_Frontend.git
```

Install dependencies

```bash
npm install
```

Run locally

```bash
ng serve
```

Application

```
http://localhost:4200
```

---

## Build Production

```bash
ng build
```

---

## Environment Configuration

Development

```typescript
export const environment = {
    production: false,
    apiUrl: "http://localhost:5000/api"
};
```

Production

```typescript
export const environment = {
    production: true,
    apiUrl: "https://your-backend-url/api"
};
```

---

## UI Highlights

- Modern Dashboard
- Responsive Design
- Dark Theme
- Role-Based Navigation
- Reusable Components
- Standalone Components
- Professional Layout

---

## Future Improvements

- Real-Time Notifications (Socket.IO)
- Charts & Analytics
- Task Attachments
- Activity Timeline
- Advanced Filters
- Search & Pagination
- Drag & Drop Task Board

---

## Author

**Sachin Kumar Singh**

GitHub: https://github.com/sachin2398
