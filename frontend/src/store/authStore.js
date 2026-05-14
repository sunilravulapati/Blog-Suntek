import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import axios from 'axios'

const API_BASE_URL = import.meta.env.PROD ? "https://blog-suntek-1.onrender.com" : "http://localhost:5000"

export const useAuth = create(
  persist(
    (set) => ({
      currentUser: null,
      loginLoading: false,
      checkLoading: false,
      error: null,
      isAuthenticated: false,

      login: async (userCredWithRole) => {
        const { role, ...userCredObj } = userCredWithRole
        try {
          set({ loginLoading: true, error: null })
          const endpoint = `${API_BASE_URL}/common-api/login`
          const res = await axios.post(endpoint, userCredObj, { withCredentials: true })
          set({ loginLoading: false, isAuthenticated: true, currentUser: res.data.payload })
        } catch (err) {
          set({
            loginLoading: false,
            isAuthenticated: false,
            currentUser: null,
            error: err.response?.data?.error || 'Login failed',
          })
        }
      },

      logout: async () => {
        try {
          await axios.get(`${API_BASE_URL}/common-api/logout`, { withCredentials: true })
        } catch (_) { }
        set({ loginLoading: false, isAuthenticated: false, currentUser: null })
      },

      checkAuth: async () => {
        try {
          set({ checkLoading: true })
          const resObj = await axios.get(
            `${API_BASE_URL}/common-api/check-auth`,
            { withCredentials: true, timeout: 8000 }
          )
          set({ checkLoading: false, isAuthenticated: true, currentUser: resObj.data.payload })
        } catch {
          set({ checkLoading: false, isAuthenticated: false, currentUser: null })
        }
      },

      setUser: (user) => set({ currentUser: user, isAuthenticated: true }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)