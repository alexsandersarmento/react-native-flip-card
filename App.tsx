import React, { useState } from 'react'
import {
  NativeBaseProvider,
  VStack,
  HStack,
  Box,
  Text,
  Image,
  Input,
  IInputProps,
  Center,
} from 'native-base'
import Animated, { FlipInEasyY, useSharedValue, useAnimatedStyle, withTiming, interpolate } from 'react-native-reanimated'
import { ImageSourcePropType } from 'react-native'

interface ICreditCardFrontProps {
  name: string
  number: string
  expiry: string
  cardType: string
  focusedInput: string
  spin: Animated.SharedValue<number>
}

interface ICreditCardBackProps {
  cvv: string
  focusedInput: string
  spin: Animated.SharedValue<number>
}

interface ICreditCardInputProps extends IInputProps {
  placeholder: string
  value: string
  onChangeText: (text: string) => void
}

interface ICreditCardImageProps {
  source: ImageSourcePropType | Animated.Node<ImageSourcePropType | undefined> | undefined
  alt: string
}

const AnimatedImage = Animated.createAnimatedComponent(Image)

const CreditCardImage = ({ source, alt } : ICreditCardImageProps) => {
  return (
    <AnimatedImage
      key='mastercard'
      source={source}
      alt={alt}
      resizeMode='contain'
      size={50}
      entering={FlipInEasyY.duration(500)}
    />
  )
}

const CreditCardImages = [
  <CreditCardImage key='mastercard' source={require('./assets/images/mastercard.png')} alt="mastercard" />,
  <CreditCardImage key='visa' source={require('./assets/images/visa.png')} alt="visa" />,
  <CreditCardImage key='elo' source={require('./assets/images/elo.png')} alt="elo" />,
]

const CreditCardFront = ({ name, number, expiry, cardType, focusedInput, spin } : ICreditCardFrontProps) => {
  const frontAnimatedStyle = useAnimatedStyle(() => {
    const spinVal = interpolate(spin.value, [0, 1], [0, 180])
    return {
      transform: [
        {
          rotateY: withTiming(`${spinVal}deg`, { duration: 500 }),
        },
      ],
    }
  }, [])

  return (
    <Animated.View
      style={[{ 
        width: '100%',
        alignItems: 'center',
        position: 'absolute',
        backfaceVisibility: 'hidden', 
      }, frontAnimatedStyle]}
    >
      <Box
        bg="green.300"
        shadow={2}
        rounded="lg"
        p={4}
        w={350}
        h={200}
      >
        <VStack flex={1} justifyContent='space-between'>
          {CreditCardImages.find((image) => image.props.alt === cardType) || CreditCardImages[0]}
          <Text
            color="white"
            fontSize="lg"
            fontWeight="bold"
            p={2}
            borderColor={focusedInput === 'number' ? 'red.400' : 'transparent'}
            borderWidth={1}
            borderRadius={4}
          >
            {number || '**** **** **** ****'}
          </Text>
          <HStack justifyContent='space-between' alignItems='center'>
            <Text
              color="white"
              fontSize="lg"
              fontWeight="bold"
              p={2}
              borderColor={focusedInput === 'name' ? 'red.400' : 'transparent'}
              borderWidth={1}
              borderRadius={4}
            >
              {name || '*******'}
            </Text>
            <VStack 
              p={2}
              borderColor={focusedInput === 'expiry' ? 'red.400' : 'transparent'}
              borderWidth={1}
              borderRadius={4}
            >
              <Text
                color="white"
                fontSize="xs"
                fontWeight="light"
              >
                Expires
              </Text>
              <Text
                color="white"
                fontSize="md"
                fontWeight="bold"
              >
                {expiry || '**/**'}
              </Text>
            </VStack>
          </HStack>
        </VStack>
      </Box>
    </Animated.View>
  )
}

const CreditCardBack = ({ cvv, focusedInput, spin } : ICreditCardBackProps) => {
  const backAnimatedStyle = useAnimatedStyle(() => {
    const spinVal = interpolate(spin.value, [0, 1], [180, 360])
    return {
      transform: [
        {
          rotateY: withTiming(`${spinVal}deg`, { duration: 500 }),
        },
      ],
    }
  }, [])

  return (
    <Animated.View
      style={[{
        width: '100%',
        alignItems: 'center',
        backfaceVisibility: 'hidden',
      }, backAnimatedStyle]}
    >
      <VStack
        bg="green.300"
        shadow={2}
        rounded="lg"
        w={350}
        h={200}
        space={4}
      >
        <Box
          bg='gray.800'
          w='full'
          h={50}
          mt={4}
        />
        <HStack
          p={2}
          space={4}
          width='full'
          alignSelf='center'
          bg='white'
          justifyContent='space-between'
          alignItems='center'
        >
          <VStack flex={1}>
            <Box 
              bg='gray.100'
              w='full'
              h={2}
              mb={2}
            />
            <Box 
              bg='gray.100'
              w='full'
              h={2}
            />
          </VStack>
          <Box>
          <VStack 
            alignItems='center'
            p={2}
            borderColor={focusedInput === 'cvv' ? 'red.400' : 'transparent'}
            borderWidth={1}
            borderRadius={4}
          >
            <Text
              color="gray.400"
              fontSize="xs"
              fontWeight="light"
            >
              CVV
            </Text>
            <Text
              color="gray.400"
              fontSize="md"
              fontWeight="bold"
            >
              {cvv || '***'}
            </Text>
          </VStack>
          </Box>
        </HStack>
      </VStack>
    </Animated.View>
  )
}

const CreditCardInput = ({ placeholder, value, onChangeText, ...rest } : ICreditCardInputProps) => {
  return (
    <Input
      placeholder={placeholder}
      rounded="lg"
      fontSize="md"
      p={4}
      value={value}
      onChangeText={onChangeText}
      {...rest}
    />
  )
}

const CreditCard = () => {
  const [name, setName] = useState('')
  const [number, setNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cardType, setCardType] = useState('')
  const [cvv, setCvv] = useState('')
  const [focusedInput, setFocusedInput] = useState('number')

  const spin = useSharedValue<number>(0)

  const handleFlip = () => {
    spin.value = spin.value ? 0 : 1
  }

  const handleFocusInputThatAreNotCvv = (inputName: string) => {
    if (focusedInput === 'cvv') {
      handleFlip()
    }
    setFocusedInput(inputName)
  }

  const handleFocusCvvInput = () => {
    setFocusedInput('cvv')
    handleFlip()
  }

  const checkCardType = (text: string) => {
    const cardNumber = text.slice(0, 2)
    if (['51', '52', '53', '54', '55'].includes(cardNumber)) {
      return 'mastercard'
    }

    if (['40', '41', '42', '43', '44', '45', '46', '47', '48', '49'].includes(cardNumber)) {
      return 'visa'
    }

    if (['50', '60', '62', '64', '65'].includes(cardNumber)) {
      return 'elo'
    }
  }

  const handleNameChange = (text: string) => {
    setName(text)
  }

  const handleNumberChange = (text: string) => {
    const formattedText = text.replace(/[^0-9]/g, '').replace(/(.{4})/g, '$1 ').trim()
    setCardType(String(checkCardType(formattedText)))
    setNumber(formattedText)
  }

  const handleExpiryChange = (text: string) => {
    setExpiry(text.replace(
      /[^0-9]/g, '',
    ).replace(
      /^([2-9])$/g, '0$1',
    ).replace(
      /^(1{1})([3-9]{1})$/g, '0$1/$2',
    ).replace(
      /^0{1,}/g, '0',
    ).replace(
      /^([0-1]{1}[0-9]{1})([0-9]{1,2}).*/g, '$1/$2',
    ))
  }

  const handleCvvChange = (text: string) => {
    setCvv(text)
  }

  return (
    <VStack 
      space={4}
      w='90%'
      justifyContent='center'
      alignItems='center'
      position='relative'
    >
      <Box>
        <CreditCardFront 
          name={name}
          number={number}
          expiry={expiry}
          cardType={cardType}
          focusedInput={focusedInput}
          spin={spin}
        />
        <CreditCardBack 
          cvv={cvv}
          focusedInput={focusedInput}
          spin={spin}
        />
      </Box>
      <CreditCardInput 
        w='full'
        placeholder="Card number" 
        value={number} 
        onChangeText={handleNumberChange} 
        maxLength={19}
        onFocus={() => handleFocusInputThatAreNotCvv('number')}
        autoFocus
        />
      <CreditCardInput
        w='full'
        placeholder="Name on card" 
        value={name} 
        onChangeText={handleNameChange}
        onFocus={() => handleFocusInputThatAreNotCvv('name')}
      />
      <HStack space={4} w='full'>
        <CreditCardInput
          flex={1}
          placeholder="Expiry date" 
          value={expiry} 
          onChangeText={handleExpiryChange}
          onFocus={() => handleFocusInputThatAreNotCvv('expiry')}
        />
        <CreditCardInput 
          placeholder="CVV" 
          value={cvv} 
          onChangeText={handleCvvChange}
          onFocus={() => handleFocusCvvInput()}
          maxLength={3}
          w={100}
        />
      </HStack>
    </VStack>
  )
}

export default function App() {
  return (
    <NativeBaseProvider>
      <Center flex={1}>
        <CreditCard />
      </Center>
    </NativeBaseProvider>
  )
}
