// This is a mock authentication object.
// In a real app, this would involve checking tokens, sessions, etc.
export const auth = {
  // To test, you can manually change this value to `false`
  isAdmin: true, 

  // A function to check the user's role
  checkAdminStatus: () => {
    // In a real scenario, you might check localStorage, a cookie, or an API
    return auth.isAdmin;
  }
};