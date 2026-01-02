---
title: API Overview
description: Technical reference for integrating with our booking and service APIs.
category: reference
order: 1
lastUpdated: 2024-01-15
---

# API Overview

This reference document provides technical details for integrating with our services.

## Booking Integration

### Webhook Events

When a booking is made, we can send webhook notifications to your systems:

```json
{
  "event": "booking.created",
  "data": {
    "id": "bk_123456",
    "service": "consultation",
    "duration": 60,
    "scheduled_at": "2024-01-20T10:00:00Z",
    "customer": {
      "email": "customer@example.com",
      "name": "John Doe"
    }
  }
}
```

### Available Events

| Event                 | Description                   |
| --------------------- | ----------------------------- |
| `booking.created`     | New booking created           |
| `booking.confirmed`   | Booking confirmed by provider |
| `booking.cancelled`   | Booking cancelled             |
| `booking.completed`   | Session completed             |
| `booking.rescheduled` | Booking time changed          |

## Calendar Integration

### Supported Platforms

We integrate with major calendar platforms:

- Google Calendar
- Microsoft Outlook
- Apple Calendar (via iCal)
- Calendly

### iCal Feed

Subscribe to your bookings via iCal:

```
https://api.example.com/calendar/feed/{your-token}.ics
```

## Service Definitions

### Consultation Types

```typescript
interface Service {
  id: string;
  name: string;
  description: string;
  duration: number; // minutes
  price: {
    amount: number;
    currency: string;
    type: "hourly" | "flat" | "custom";
  };
  availability: {
    days: string[];
    hours: {
      start: string;
      end: string;
    };
    timezone: string;
  };
}
```

### Example Service

```json
{
  "id": "srv_consultation",
  "name": "1-Hour Consultation",
  "description": "Expert guidance on your project",
  "duration": 60,
  "price": {
    "amount": 150,
    "currency": "USD",
    "type": "hourly"
  },
  "availability": {
    "days": ["monday", "tuesday", "wednesday", "thursday", "friday"],
    "hours": {
      "start": "09:00",
      "end": "17:00"
    },
    "timezone": "America/New_York"
  }
}
```

## Rate Limits

API requests are rate-limited:

| Endpoint         | Limit      |
| ---------------- | ---------- |
| Booking creation | 10/minute  |
| Calendar sync    | 60/hour    |
| Webhook retries  | 3 attempts |

## Error Handling

### Error Response Format

```json
{
  "error": {
    "code": "BOOKING_CONFLICT",
    "message": "The requested time slot is not available",
    "details": {
      "requested_time": "2024-01-20T10:00:00Z",
      "next_available": "2024-01-20T14:00:00Z"
    }
  }
}
```

### Common Error Codes

| Code               | Description           |
| ------------------ | --------------------- |
| `BOOKING_CONFLICT` | Time slot unavailable |
| `INVALID_SERVICE`  | Service ID not found  |
| `RATE_LIMITED`     | Too many requests     |
| `UNAUTHORIZED`     | Invalid API key       |

## Need Help?

For API support and integration assistance, [book a technical consultation](/services/) with our team.
