import { NDKContext } from '@/context/NDKContext'
import {
  NDKEvent,
  NDKFilter,
  NDKSubscription,
  NDKSubscriptionOptions
} from '@nostr-dev-kit/ndk'
import { useCallback, useContext, useEffect, useState } from 'react'

export interface IUseSubscription {
  subscription: NDKSubscription
  events: NDKEvent[]
}

export type SubscriptionProps = {
  filters: NDKFilter[]
  options: NDKSubscriptionOptions
  enabled: boolean
}

export const useSubscription = ({
  filters,
  options,
  enabled
}: SubscriptionProps) => {
  const { ndk } = useContext(NDKContext)

  const [subscription, setSubscription] = useState<NDKSubscription>()
  const [events, setEvents] = useState<NDKEvent[]>([])

  const startSubscription = useCallback(() => {
    if (ndk) {
      const newSubscription = ndk.subscribe(filters, options)
      setSubscription(newSubscription)
      return
    }
  }, [ndk])

  const stopSubscription = (sub: NDKSubscription) => {
    sub?.stop()
    sub?.removeAllListeners()
    setSubscription(undefined)
  }

  useEffect(() => {
    if (enabled && !subscription) {
      if (events.length) setEvents([])
      startSubscription()
    }

    return () => {
      if (subscription) stopSubscription(subscription)
    }
  }, [enabled, subscription, ndk])

  useEffect(() => {
    if (subscription)
      subscription?.on('event', async (event: NDKEvent) =>
        setEvents(prev => [...prev, event])
      )

    return () => {
      if (subscription) subscription.off('event')
    }
  }, [subscription])

  return {
    subscription,
    events
  }
}
