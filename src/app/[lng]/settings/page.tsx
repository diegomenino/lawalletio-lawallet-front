'use client'

import Container from '@/components/Layout/Container'
import Navbar from '@/components/Layout/Navbar'
import {
  Button,
  Divider,
  Flex,
  Heading,
  LinkSetting,
  Text
} from '@/components/UI'
import { LaWalletContext } from '@/context/LaWalletContext'
import { useTranslation } from '@/hooks/useTranslations'

import theme from '@/styles/theme'
import { defaultIdentity } from '@/types/identity'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { useRouter } from 'next/navigation'
import { useContext } from 'react'

export default function Page() {
  const { t } = useTranslation()
  const { setUserIdentity } = useContext(LaWalletContext)
  const router: AppRouterInstance = useRouter()

  // const switchLanguage = () => {
  //   lng === 'es' ? changeLanguage('en') : changeLanguage('es')
  // }

  const logoutSession = () => {
    setUserIdentity(defaultIdentity).then(() => {
      localStorage.removeItem('identity')
      localStorage.removeItem('cached_txs')
      router.push('/login')
    })
  }

  return (
    <>
      <Navbar showBackPage={true}>
        <Flex align="center">
          <Heading as="h5">{t('SETTINGS')}</Heading>
        </Flex>
      </Navbar>

      <Container size="small">
        <Divider y={16} />
        <Text size="small" color={theme.colors.gray50}>
          {t('MY_WALLET')}
        </Text>
        <Divider y={8} />
        <Flex direction="column" gap={4}>
          <LinkSetting href="/settings/recovery">
            {t('BACKUP_ACCOUNT')}
          </LinkSetting>
        </Flex>
        <Divider y={16} />
        <Flex justify="center">
          <Text size="small" color={theme.colors.gray50}>
            LaWallet v1.0.0
          </Text>
        </Flex>
        <Divider y={16} />
        <Flex>
          <Button color="error" variant="bezeled" onClick={logoutSession}>
            {t('LOGOUT')}
          </Button>
        </Flex>
        <Divider y={16} />
      </Container>
    </>
  )
}
