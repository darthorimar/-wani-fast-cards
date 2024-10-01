'use client'

import { Center } from '@/app/componets/center'
import { getKanjiForLevel, getWanikaniStatus, Kanji, WanikaniStatus } from '@/app/wanikani/WaniKani'
import { Button, Card, CardBody } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useEffect, useState } from 'react'
import { MdArrowBack } from 'react-icons/md'
import { MdRestartAlt } from 'react-icons/md'

export default function Page(
    { params }: { params: { level: number } }
) {
    const [rerenderCount, setRerenderCount] = useState(0)

    function rerender() {
        setRerenderCount(c => c + 1)
    }

    return <>
        <Navigation rerender={rerender} />
        <Center>
            <Content level={params.level} rerender={rerender} rerenderCount={rerenderCount} />
        </Center>
    </>
}

function Navigation({ rerender }: { rerender: () => void }) {
    const router = useRouter()
    return <div className='fixed top-2 left-2 flex gap-1'>
        <ActionButton icon={<MdArrowBack color='hsl(var(--nextui-default-400))' />} onPress={() => router.push('/')} />
        <ActionButton icon={<MdRestartAlt color='hsl(var(--nextui-default-400))' />} onPress={() => rerender()} />
    </div>
}

function ActionButton(
    { icon, onPress }: { icon: React.ReactNode, onPress: () => void }
) {
    return <Button onPress={onPress} size='sm' variant='bordered' isIconOnly startContent={icon} />
}

function Content(
    { level, rerender, rerenderCount }: { level: number, rerender: () => void, rerenderCount: number }
) {
    const [kanjis, setKanjis] = useState<Kanji[]>([])
    const [status, setStatus] = useState<WanikaniStatus>('loading')
    const router = useRouter()

    useEffect(() => {
        Promise.all([getWanikaniStatus(), getKanjiForLevel(level)]).then(([status, k]) => {
            setStatus(status)
            if (k === null) {
                return
            }
            setKanjis(shuffled(k))
        })
    }, [rerenderCount, level])

    if (status === 'no_key' || status === 'invalid_key') {
        return <div className='flex flex-col gap-4'>
            <ErrorCard>
                Invalid API key
            </ErrorCard>
            <Button color='secondary' variant='bordered' onPress={() => router.push('/')}>Change API KEY</Button>
        </div>
    }

    if (status === '3lvl' && level > 3) {
        return <div>
            <ErrorCard>
                Level {level} is inaccessible
            </ErrorCard>
        </div>
    }

    if (status === 'loading') {
        return <div>Loading...</div>
    }

    return <div className='flex flex-col items-center gap-4' key={rerenderCount}>
        <h1 className='font-bold text-3xl mb-4'>Kanji for level {level}</h1>
        <LearnKanji kanjis={kanjis} rerender={rerender} />
    </div>
}

function ErrorCard({ children }: { children: React.ReactNode }) {
    return <Card className='bg-danger-200'>
        <CardBody>
            <h1 className='text-xl'>{children}</h1>
        </CardBody>
    </Card>
}

function LearnKanji(
    { kanjis, rerender }: { kanjis: Kanji[], rerender: () => void }
) {
    const [notShowKanjis, setNotShowKanjis] = useState<Kanji[]>(kanjis)
    const [revealAnswer, setRevealAnswer] = useState(false)

    const router = useRouter()

    if (notShowKanjis.length === 0) {
        return <div className='text-center '>
            <div className='text-xl mb-4'>Done!</div>
            <div className='flex gap-2'>
                <Button color='secondary' variant='bordered' onPress={() => rerender()}>Again</Button>
                <Button color='secondary' variant='bordered' onPress={() => router.push('/')}>Chose level</Button>
            </div>
        </div>
    }

    return <div className='rounded-3xl p-6 bg-[#f0a] flex flex-col items-center h-60 select-none cursor-pointer'
        onClick={() => {
            if (revealAnswer) {
                setNotShowKanjis(notShowKanjis.slice(1))
            }
            setRevealAnswer(!revealAnswer)
        }}>
        <div className='text-9xl'>{notShowKanjis[0].kanji}</div>
        {revealAnswer && <>
            <div className='text-2xl font-bold mt-2'> {notShowKanjis[0].reading} </div>
            <div className='text-xl'> {notShowKanjis[0].meaning} </div>
        </>}

    </div>
}

function shuffled<T>(array: T[]): T[] {
    const result = [...array]
    for (let i = result.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]]
    }
    return result
}