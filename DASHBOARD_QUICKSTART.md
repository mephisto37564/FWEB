# Dashboard Quick Start Guide

## Installation & Setup

### Prerequisites
- Node.js and npm installed
- MongoDB running and connected
- FWEB project cloned and dependencies installed

### Step 1: Install Dependencies (if needed)
The dashboard uses **Recharts** which should already be installed in your project. If not:

```bash
cd project-2
npm install recharts
```

### Step 2: Verify Backend is Running
```bash
cd backend
npm start
```

You should see:
```
MongoDB Connected
Server running on http://localhost:3000
```

### Step 3: Start Frontend Development Server
```bash
cd project-2
npm run dev
```

The frontend will be available at `http://localhost:5173` (or port shown in terminal)

---

## Testing the Dashboard

### Test as Regular User:

1. **Register/Login as a Regular User**
   - Navigate to `/register` or `/login`
   - Create an account or login with existing credentials
   - Note your user ID (check browser DevTools > Storage > localStorage)

2. **Apply for Some Jobs**
   - Go to `/listings`
   - Click on job listings
   - Click "Apply" button
   - Submit multiple applications to different companies
   - Apply over several sessions to create timeline data

3. **View User Dashboard**
   - Go to `/` (Dashboard)
   - You should see the UserDashboard with:
     - Total Applications count
     - Timeline chart showing your applications over time
     - Bar chart of applications by company
     - Table of recent applications

### Test as Admin:

1. **Login as Admin User**
   - Use an admin account (check database or register with admin role)
   - To grant admin access, update user role in MongoDB:
     ```javascript
     db.users.updateOne({email: "admin@example.com"}, {$set: {role: "admin"}})
     ```

2. **Create Some Test Data**
   - Create multiple listings
   - Have different users apply for various listings
   - Apply for the same listing multiple times with different users

3. **View Admin Dashboard**
   - Go to `/` (Dashboard)
   - You should see the AdminDashboard with:
     - Three stat cards (Total Listings, Total Applications, Active Users)
     - Timeline chart for all applications
     - Bar chart of most applied listings
     - Pie chart of job category distribution

---

## API Testing (Optional)

### Test User Dashboard API:

```bash
# Replace {userId} with an actual user ID from database
curl http://localhost:3000/dashboard/user/{userId}
```

Expected response:
```json
{
  "totalApplications": 5,
  "applicationsByCompany": [
    {"name": "Company A", "count": 3},
    {"name": "Company B", "count": 2}
  ],
  "timelineData": [
    {"date": "2024-01-15T00:00:00.000Z", "applications": 2}
  ],
  "recentApplications": [...]
}
```

### Test Admin Dashboard API:

```bash
curl http://localhost:3000/dashboard/admin
```

Expected response:
```json
{
  "totalListings": 10,
  "totalApplications": 25,
  "totalActiveUsers": 15,
  "mostAppliedListings": [...],
  "timelineData": [...],
  "jobCategoriesDistribution": [...]
}
```

---

## Troubleshooting

### Issue: Dashboard shows "Loading dashboard..." forever

**Solution:**
1. Check browser console (F12) for error messages
2. Verify backend is running: `http://localhost:3000`
3. Check network tab to see if API calls are failing
4. Verify userId is stored in localStorage:
   ```javascript
   // In browser console
   localStorage.getItem("userId")
   ```

### Issue: Charts not displaying

**Solution:**
1. Verify data is returning from API (check network tab)
2. Clear browser cache: Ctrl+Shift+Del
3. Check console for React errors
4. Verify Recharts is installed: `npm list recharts`

### Issue: No data showing in dashboard despite applications existing

**Solution:**
1. Verify applications are in database:
   ```javascript
   // In MongoDB CLI
   db.applications.find().limit(5)
   ```
2. Check if userId in applications matches current user
3. Verify the MongoDB connection string is correct
4. Check MongoDB logs for aggregation errors

### Issue: Admin dashboard shows 0 for all metrics

**Solution:**
1. Verify user role is "admin" in database
2. Verify listings exist in database
3. Verify applications exist and have userId reference
4. Check browser console for 403/401 errors (might need authentication)

---

## Performance Optimization Tips

### For Large Datasets:

1. **Add pagination to recent applications table:**
   ```javascript
   const recentApplications = await Applications.find({ userId: userId })
     .sort({ createdAt: -1 })
     .limit(10)
     .skip((page - 1) * 10);
   ```

2. **Cache dashboard data:**
   ```javascript
   // Use Redis or similar
   const cacheKey = `dashboard_admin`;
   const cached = await redis.get(cacheKey);
   if (cached) return JSON.parse(cached);
   ```

3. **Limit timeline data to last 12 months:**
   ```javascript
   const twelveMonthsAgo = new Date();
   twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
   
   $match: {
     createdAt: { $gte: twelveMonthsAgo }
   }
   ```

---

## Files to Check If Issues Occur

### Backend:
- `backend/routes/dashboard.js` - Dashboard API routes
- `backend/server.js` - Verify routes are mounted
- `backend/models/application.js` - Application schema

### Frontend:
- `project-2/src/components/AdminDashboard.jsx` - Admin view
- `project-2/src/components/UserDashboard.jsx` - User view
- `project-2/src/pages/Dashboard.jsx` - Main dashboard page
- `project-2/src/config.js` - API URL configuration

### Styles:
- `project-2/src/styles/Dashboard.css`
- `project-2/src/styles/StatsCard.css`
- `project-2/src/styles/Charts.css`

---

## Development Workflow

### Making Changes:

1. **Backend changes:**
   ```bash
   cd backend
   npm start
   # Changes require restart
   ```

2. **Frontend changes:**
   ```bash
   cd project-2
   npm run dev
   # HMR will auto-reload
   ```

3. **Database changes:**
   - Use MongoDB Compass or CLI
   - Changes are immediate (no restart needed)

### Testing New Features:

1. Create test data via Postman or curl
2. Verify API returns correct data
3. Update components to display new data
4. Test responsive design at different viewport sizes

---

## Deployment Checklist

Before deploying to production:

- [ ] Remove console.log statements
- [ ] Test with production-like data volume
- [ ] Verify error handling works properly
- [ ] Test on mobile devices
- [ ] Check accessibility (keyboard navigation, screen readers)
- [ ] Verify all API endpoints are secure
- [ ] Add rate limiting to prevent abuse
- [ ] Test with different user roles
- [ ] Verify data privacy (users can't see other users' data)
- [ ] Load test the dashboard API endpoints
- [ ] Set up monitoring and alerting

---

## Next Steps

After dashboard is working:

1. **Gather user feedback** - Does the data help users?
2. **Refine visualizations** - Are charts clear and useful?
3. **Add more metrics** - What else do users want to see?
4. **Set up analytics** - Track dashboard usage
5. **Optimize performance** - Monitor load times
6. **Integrate with email** - Send dashboard summaries
7. **Mobile optimization** - Test on all devices
8. **Accessibility** - WCAG 2.1 AA compliance

---

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review console errors (F12 in browser)
3. Check MongoDB connection and data
4. Verify all files are in correct locations
5. Ensure all dependencies are installed
6. Check API endpoint format in config.js
7. Verify user role and authentication

Good luck with your dashboard! 🚀
