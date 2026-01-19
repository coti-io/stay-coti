import { randomUUID } from 'crypto'

export const getRandomString = (
    length: number,
    type: 'default' | 'number' = 'default'
): string => {
    let characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()'
    if (type === 'number') {
        characters = '0123456789'
    }
    const charactersLength = characters.length
    let result = ''

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charactersLength)
        result += characters.charAt(randomIndex)
    }

    return result
}

export const randomID = () => {
    return randomUUID().replace(/-/g, '')
}
