import { useEffect, useState } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { useNavigate } from 'react-router-dom'
import { toast } from '@/hooks/use-toast'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (error) throw error

      if (data.user) {
        toast({
          title: 'Success!',
          description: 'Account created successfully. Please check your email to confirm.',
        })
        return { success: true, user: data.user }
      }
    } catch (error) {
      const authError = error as AuthError
      toast({
        title: 'Error',
        description: authError.message,
        variant: 'destructive',
      })
      return { success: false, error: authError }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        toast({
          title: 'Welcome back!',
          description: 'Successfully signed in.',
        })
        navigate('/dashboard')
        return { success: true, user: data.user }
      }
    } catch (error) {
      const authError = error as AuthError
      toast({
        title: 'Error',
        description: authError.message,
        variant: 'destructive',
      })
      return { success: false, error: authError }
    }
  }

  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      })

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      const authError = error as AuthError
      toast({
        title: 'Error',
        description: authError.message,
        variant: 'destructive',
      })
      return { success: false, error: authError }
    }
  }

  const signInWithGithub = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      })

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      const authError = error as AuthError
      toast({
        title: 'Error',
        description: authError.message,
        variant: 'destructive',
      })
      return { success: false, error: authError }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      toast({
        title: 'Signed out',
        description: 'Successfully signed out.',
      })
      navigate('/')
      return { success: true }
    } catch (error) {
      const authError = error as AuthError
      toast({
        title: 'Error',
        description: authError.message,
        variant: 'destructive',
      })
      return { success: false, error: authError }
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) throw error

      toast({
        title: 'Email sent',
        description: 'Check your email for the password reset link.',
      })
      return { success: true }
    } catch (error) {
      const authError = error as AuthError
      toast({
        title: 'Error',
        description: authError.message,
        variant: 'destructive',
      })
      return { success: false, error: authError }
    }
  }

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signInWithGithub,
    signOut,
    resetPassword,
  }
}

