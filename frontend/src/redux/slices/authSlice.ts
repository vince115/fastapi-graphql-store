// frontend/src/redux/slices/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";
const tokenData = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

// 型別定義
interface AuthState {
  token: string | null;
  loading: boolean;
  error: string | null;
  userInfo: unknown | null; // 可根據實際型別修改
}

const initialState: AuthState = {
  token: tokenData,
  loading: false,
  error: null,
  userInfo: null,
};


// ✅ 登入 thunk：根據當前路徑切換 login API
export const login = createAsyncThunk(
  "auth/login",
  async (
    credentials: { username: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const isAdmin =
        typeof window !== "undefined" &&
        window.location.pathname.startsWith("/admin");

      const url = isAdmin
        ? "http://localhost:8000/admin/login"
        : "http://localhost:8000/staff/login";

      const response = await axios.post(url, credentials);
      const token = response.data.access_token;

      const expiryTime = Date.now() + 15 * 60 * 1000;
      localStorage.setItem(
        "authToken",
        JSON.stringify({ token, expiryTime })
      );

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      return { token };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
      return rejectWithValue("登入失敗，請檢查帳號密碼");
    }
  }
);

// ✅ 可選：取得登入後使用者資訊
export const getAuth = createAsyncThunk(
  "auth/getAuth",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("http://localhost:8000/api/me");
      return res.data;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      return rejectWithValue("取得使用者資訊失敗");
    }
  }
);

// ✅ 支援手動設 token（給 token/expiryTime 解析用）
export const setToken = createAsyncThunk(
  "auth/setToken",
  async (
    payload: { token: string; expiresIn: number },
    { }
  ) => {
    const { token, expiresIn } = payload;
    const expiryTime = Date.now() + expiresIn * 1000;
    localStorage.setItem("authToken", JSON.stringify({ token, expiryTime }));
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    return { token };
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.userInfo = null;
      localStorage.removeItem("authToken");
      delete axios.defaults.headers.common["Authorization"];
    },
  },
  extraReducers: (builder) => {
    builder
      // login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<{ token: string }>) => {
        state.loading = false;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // getAuth
      .addCase(getAuth.fulfilled, (state, action: PayloadAction<any>) => {
        state.userInfo = action.payload;
      })
      // setToken
      .addCase(setToken.fulfilled, (state, action: PayloadAction<{ token: string }>) => {
        state.token = action.payload.token;
      });
  },
});

export const { logout } = authSlice.actions;

export const selectAuth = (state: RootState) => state.auth;

export default authSlice.reducer;
