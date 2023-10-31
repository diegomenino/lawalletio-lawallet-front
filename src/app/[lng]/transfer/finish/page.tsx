'use client'

import { SatoshiV2Icon } from '@bitcoin-design/bitcoin-icons-react/filled'

import Container from '@/components/Layout/Container'
import Navbar from '@/components/Layout/Navbar'
import {
  Button,
  Divider,
  Flex,
  Heading,
  Text,
  LinkButton,
  Avatar,
  Confetti,
  Icon
} from '@/components/UI'
import { LaWalletContext } from '@/context/LaWalletContext'
import { useTransferContext } from '@/context/TransferContext'
import { useTranslation } from '@/hooks/useTranslations'
import { formatAddress, formatToPreference } from '@/lib/formatter'

import theme from '@/styles/theme'
import { TransferTypes } from '@/types/transaction'
import { useRouter } from 'next/navigation'
import { useContext, useMemo } from 'react'

export default function Page() {
  const { t } = useTranslation()
  const {
    lng,
    userConfig: {
      props: { currency }
    },
    converter: { pricesData, convertCurrency }
  } = useContext(LaWalletContext)

  const { transferInfo } = useTransferContext()

  const convertedAmount: string = useMemo(() => {
    const convertion: number = convertCurrency(
      transferInfo.amount,
      'SAT',
      currency
    )

    return formatToPreference(currency, convertion, lng)
  }, [pricesData])

  const router = useRouter()
  const [transferUsername, transferDomain] = transferInfo.data.split('@')
  if (!transferInfo.data) router.push('/dashboard')

  return (
    <>
      <Navbar />

      <Container size="small">
        <Confetti />
        <Divider y={16} />
        <Heading>{t('FINISH_TRANSFER_TITLE')}</Heading>
        <Divider y={4} />
        <Text size="small">{t('TRANSFER_TO')}</Text>
        <Divider y={24} />
        <Flex align="center" gap={8}>
          <Avatar size="large">
            <Text size="small">
              {transferUsername.substring(0, 2).toUpperCase()}
            </Text>
          </Avatar>
          {transferInfo.type === TransferTypes.INVOICE ? (
            <Flex justify="center">
              <Text>{formatAddress(transferInfo.data)}</Text>
            </Flex>
          ) : (
            <Flex justify="center">
              <Text>{transferUsername}</Text>
              <Text color={theme.colors.gray50}>@{transferDomain}</Text>
            </Flex>
          )}
        </Flex>
        <Divider y={24} />
        {Number(convertedAmount) !== 0 ? (
          <Flex align="center" justify="center" gap={4}>
            {currency !== 'SAT' && <Text>$</Text>}
            <Heading>{convertedAmount}</Heading>
            <Text>{currency}</Text>
          </Flex>
        ) : (
          <Flex align="center" justify="center" gap={4}>
            <Icon size="small">
              <SatoshiV2Icon />
            </Icon>
            <Heading>{transferInfo.amount}</Heading>
            <Text>SAT</Text>
          </Flex>
        )}
        <Divider y={24} />
      </Container>

      <Flex>
        <Container size="small">
          <Divider y={16} />
          <Flex gap={8}>
            <LinkButton variant="borderless" href="/dashboard">
              {t('GO_HOME')}
            </LinkButton>

            <Button variant="bezeled" onClick={() => null}>
              {t('SHARE')}
            </Button>
          </Flex>
          <Divider y={32} />
        </Container>
      </Flex>
    </>
  )
}
