import { createSlice } from "@reduxjs/toolkit";

// Function to save auth state to localStorage
const saveState = (state) => {
  try {
    const serializedState = JSON.stringify({
      ...state,
      expiry: Date.now() + 3600000, // Set expiry to 1 hour (3600000 ms)
    });
    localStorage.setItem("authState", serializedState);
  } catch (err) {
    console.error("Failed to save state", err); // Ignore write errors
  }
};

// Function to load auth state from localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem("authState");
    if (!serializedState) return undefined; // Return undefined if there's no state

    const parsedState = JSON.parse(serializedState);

    // If state has expired, remove it from localStorage and return undefined
    if (parsedState.expiry && Date.now() > parsedState.expiry) {
      localStorage.removeItem("authState");
      return undefined;
    }
    return parsedState; // Return parsed state if it's valid
  } catch (err) {
    console.error("Failed to load state", err);
    return undefined;
  }
};

// Initial state based on loaded state or default values
const initialState = loadState() || {
  users: [],
  currentUser: null,
  token: null,
  Uid: null,
  Role: null,
  Name: null,
  Dept: null,
  isAuthenticated: false,
};

let logoutTimer;

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authenticate: (state, action) => {
      state.isAuthenticated = action.payload;
      saveState(state);

      if (state.isAuthenticated) {
        logoutTimer = setTimeout(() => {
          authSlice.caseReducers.logOut(state); // Auto-logout after 1 hour
          saveState(state);
        }, 3600000); // 1 hour in milliseconds
      }
    },

    setUserInfo: (state, action) => {
      const { user, token, Uid, Name, Role, Dept } = action.payload;
      state.currentUser = user;
      state.token = token;
      state.Uid = Uid;
      state.Name = Name;
      state.Role = Role;
      state.Dept = Dept;
      state.isAuthenticated = true;

      // Check if user exists in the users array and update, otherwise add them
      const existingUserIndex = state.users.findIndex((u) => u.Uid === Uid);
      if (existingUserIndex !== -1) {
        state.users[existingUserIndex] = { user, token, Uid, Name, Role, Dept };
      } else {
        state.users.push({ user, token, Uid, Name, Role, Dept });
      }

      saveState(state);

      // Clear any existing timers and start a new logout timer
      if (logoutTimer) clearTimeout(logoutTimer);
      logoutTimer = setTimeout(() => {
        authSlice.caseReducers.logOut(state);
        saveState(state);
      }, 3600000); // 1 hour in milliseconds
    },

    logOut: (state) => {
      state.currentUser = null;
      state.token = null;
      state.Uid = null;
      state.Name = null;
      state.Role = null;
      state.Dept = null;
      state.isAuthenticated = false;

      // Clear auth data from localStorage
      localStorage.removeItem("authState");
      localStorage.removeItem("clerkAuthToken");
      localStorage.removeItem("adminAuthToken");

      // Clear the logout timer
      if (logoutTimer) clearTimeout(logoutTimer);
    },
  },
});

// Export actions and reducer
export const { authenticate, setUserInfo, logOut } = authSlice.actions;
export default authSlice.reducer;

// Export the loadState function for external use
export { loadState };

// Selectors
// Selectors with optional chaining to avoid undefined errors
export const selectCurrentUser = (state) => state.auth?.currentUser ?? null;
export const selectCurrentToken = (state) => state.auth?.token ?? null;
export const selectCurrentUid = (state) => state.auth?.Uid ?? null;
export const selectCurrentName = (state) => state.auth?.Name ?? null;
export const selectCurrentRole = (state) => state.auth?.Role ?? null;
export const selectCurrentDept = (state) => state.auth?.Dept ?? null;
export const selectAllUsers = (state) => state.auth?.users ?? [];
export const isAuthenticated = (state) => state.auth?.isAuthenticated ?? false;


// Action to set users manually
export const setUsers = (users) => ({
  type: "auth/setUsers",
  payload: users,
});
