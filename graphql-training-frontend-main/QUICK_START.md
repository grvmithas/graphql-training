# Quick Start Guide

Get the GraphQL Training Frontend running in minutes!

## 🚀 Prerequisites

1. **Node.js 16+** installed
2. **Backend GraphQL server** running (see backend setup)
3. **Git** (optional, for cloning)

## ⚡ Quick Setup

### 1. Navigate to the frontend directory
```bash
cd graphql-training-frontend-main
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure GraphQL endpoint
Edit `src/lib/apollo-client.ts` and update the GraphQL endpoint:
```typescript
const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql', // Update to your backend URL
});
```

### 4. Start the development server
```bash
npm run dev
```

### 5. Open your browser
Navigate to `http://localhost:5173`

## 🎯 What You'll See

1. **Login/Register Page**: Create an account or login
2. **Products Page**: Browse products with filtering
3. **Product Details**: View individual products and add to cart
4. **Categories**: Browse products by category
5. **Shopping Cart**: Manage cart items
6. **Admin Features**: Add new products and categories

## 🔧 Backend Setup

Make sure your GraphQL backend is running:

```bash
# Navigate to backend directory
cd ../graphql-training-backend-main

# Install dependencies
npm install

# Start the server
npm start
```

The backend should be running on `http://localhost:4000/graphql`

## 🐛 Troubleshooting

### Common Issues:

1. **"Network Error"**: 
   - Check if backend is running
   - Verify GraphQL endpoint in `apollo-client.ts`

2. **"Module not found"**:
   - Run `npm install` again
   - Clear node_modules and reinstall

3. **"GraphQL errors"**:
   - Check backend logs
   - Verify database connection
   - Ensure backend schema matches frontend queries

### Debug Mode:
```bash
# Start with debug logging
DEBUG=apollo-client:* npm run dev
```

## 📚 Next Steps

1. **Read the Training Guide**: `GRAPHQL_TRAINING_GUIDE.md`
2. **Explore the Code**: Study the component structure
3. **Try the Exercises**: Complete the training modules
4. **Modify the Code**: Add new features and experiment

## 🎓 Learning Path

1. **Start with Authentication**: Register/login to see the full app
2. **Explore Products**: Browse and filter products
3. **Study the Code**: Look at how GraphQL queries are structured
4. **Check the Hooks**: See how custom hooks manage GraphQL operations
5. **Examine Cache**: Use browser dev tools to see Apollo Client cache
6. **Try Modifications**: Add new features following the training guide

## 🔍 Development Tools

### Apollo Client DevTools
Install the Apollo Client DevTools browser extension to:
- Inspect GraphQL queries
- View cache contents
- Debug mutations
- Monitor performance

### React DevTools
Use React DevTools to:
- Inspect component hierarchy
- Monitor state changes
- Profile performance

## 📖 Key Files to Study

- `src/lib/apollo-client.ts` - Apollo Client configuration
- `src/graphql/queries.ts` - GraphQL queries
- `src/graphql/mutations.ts` - GraphQL mutations
- `src/hooks/useAuth.ts` - Authentication logic
- `src/hooks/useProducts.ts` - Product operations
- `src/hooks/useCart.ts` - Cart operations

## 🚀 Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

---

**Happy Learning! 🚀**

This frontend demonstrates real-world GraphQL best practices. Take your time exploring the code and completing the training exercises. 