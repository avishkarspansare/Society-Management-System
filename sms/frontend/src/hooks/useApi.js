import { useState, useCallback } from 'react'
import toast from 'react-hot-toast'

/**
 * Generic API call hook with loading, error, and data state.
 * Usage: const { data, loading, error, execute } = useApi(myService.getAll)
 */
export function useApi(apiFn, options = {}) {
  const { onSuccess, onError, successMessage } = options
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  const execute = useCallback(async (...args) => {
    setLoading(true)
    setError(null)
    try {
      const res = await apiFn(...args)
      const payload = res.data?.data ?? res.data
      setData(payload)
      if (successMessage) toast.success(successMessage)
      if (onSuccess) onSuccess(payload)
      return payload
    } catch (err) {
      const msg = err.message || 'Request failed'
      setError(msg)
      if (onError) onError(err)
      return null
    } finally {
      setLoading(false)
    }
  }, [apiFn, successMessage, onSuccess, onError])

  return { data, loading, error, execute }
}
