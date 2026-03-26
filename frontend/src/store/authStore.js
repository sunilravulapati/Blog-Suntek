import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import axios from 'axios'

export const useAuth = create(
  persist(
    (set) => ({
      currentUser: null,
      loading: false,
      error: null,
      isAuthenticated: false,

      login: async (userCredWithRole) => {
        const { role, ...userCredObj } = userCredWithRole
        try {
          set({ loading: true, error: null })

          let res = await axios.post(
            "http://localhost:4000/common-api/login",
            userCredObj,
            { withCredentials: true }
          )

          set({
            loading: false,
            isAuthenticated: true,
            currentUser: res.data.payload
          })
        } catch (err) {
          set({
            loading: false,
            isAuthenticated: false,
            currentUser: null,
            error: err.response?.data?.error || "Login failed",
          })
        }
      },

      logout: async () => {
        try {
          set({ loading: true, error: null })

          await axios.get(
            "http://localhost:4000/common-api/logout",
            { withCredentials: true }
          )

          set({
            loading: false,
            isAuthenticated: false,
            currentUser: null
          })
        } catch (err) {
          set({
            loading: false,
            isAuthenticated: false,
            currentUser: null,
            error: err.response?.data?.error || "Logout failed",
          })
        }
      },

      checkAuth: async () => {
        try {
          set({ loading: true, error: null })

          let resObj = await axios.get('http://localhost:4000/common-api/check-auth', { withCredentials: true })
          // console.log(resObj.data.payload)

          set({
            loading: false,
            isAuthenticated: true,
            currentUser: resObj.data.payload
          })

        }
        catch (err) {
          set({
            loading: false,
            isAuthenticated: false,
            currentUser: null,
            error: err.response?.data?.error,
          })
        }
      }
    }),
    {
      name: "auth-storage", // 🔥 key in localStorage
    }
  )
)