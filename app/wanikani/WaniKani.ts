'use client'

import { useLocalStorage } from 'usehooks-ts'

export function useApiKey(): [string | null, (key: string) => void, () => void] {
    return useLocalStorage<string | null>(KEY, null)
}

export async function getWanikaniStatus(): Promise<WanikaniStatus> {
    const key = localStorage.getItem(KEY)?.trim()
    if (key === null || key === '') return 'no_key'
    const headers = createWanikaniHeaders()
    const response = await fetch(`${API_BASE_URL}/user`, { headers: headers })
    if (!response.ok) return 'invalid_key'
    const json = await response.json()
    return json.data.subscription.max_level_granted === 60 ? '60lvl' : '3lvl'
}

export type WanikaniStatus = 'no_key' | 'loading' | 'invalid_key' | '60lvl' | '3lvl'


export async function getKanjiForLevel(level: number): Promise<Kanji[] | null> {
    const headers = createWanikaniHeaders()
    const response = await fetch(`${API_BASE_URL}/subjects?types=kanji&levels=${level}`, { headers: headers })
    if (!response.ok) return null
    const json = await response.json()
    return json.data.map((d: any) => {
        return {
            kanji: d.data.characters,
            meaning: d.data.meanings.find((m: any) => m.primary).meaning,
            reading: d.data.readings.find((r: any) => r.primary).reading,
        }
    })
}

function createWanikaniHeaders(): Headers {
    const headers = new Headers()
    headers.append('Authorization', `Bearer ${localStorage.getItem(KEY)?.trim()}`)
    return headers
}

const API_BASE_URL = 'https://api.wanikani.com/v2'

export interface Kanji {
    kanji: string
    meaning: string
    reading: string
}

const KEY = 'local_storage_wanikani_api_key'
