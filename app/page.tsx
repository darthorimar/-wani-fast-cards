'use client'

import { Center } from '@/app/componets/center'
import { Footer } from '@/app/componets/footer'
import { GitHubRibbon } from '@/app/componets/github_ribbon'
import { getWanikaniStatus, useApiKey, WanikaniStatus } from '@/app/wanikani/WaniKani'
import { Button, ButtonGroup, CircularProgress, cn, Input, Link } from '@nextui-org/react'
import React, { useCallback, useEffect, useRef, useState } from 'react'


export default function Page() {
    const [filter, setFilter] = useState<KanjiFilter>('started')

    const [wanikaniStatus, setWanikaniStatus] = useState<WanikaniStatus>('no_key')
    return <>
        <GitHubRibbon />
        <Center>
            <ApiKeyInput wanikaniStatus={wanikaniStatus} setWanikaniStatus={setWanikaniStatus} />

            <div className={wanikaniStatus === '3lvl' || wanikaniStatus == '60lvl' ? 'visisble' : 'invisible'}>

                <h1 className='text-3xl text-center mt-16'>Chose Kanji Level</h1>
                <KanjiFilterButtons classNames='my-6 w-full' filter={filter} setFilter={setFilter} />
                <div className='grid grid-cols-5 sm:grid-cols-10 gap-2'>
                    {
                        Array.from({ length: 60 }, (_, i) => i + 1)
                            .map((i) =>
                                <Button isDisabled={wanikaniStatus === '3lvl' && i > 3}
                                    className='hover:bg-secondary' key={i} as={Link} href={`/kanji/${i}${filter === 'started' ? '?started=true' : ''}`} isIconOnly> {i} </Button>
                            )
                    }
                </div>
            </div>
        </Center>
        <Footer />
    </>
}


function ApiKeyInput(
    { wanikaniStatus, setWanikaniStatus }: { wanikaniStatus: WanikaniStatus, setWanikaniStatus: (v: WanikaniStatus) => void }
) {
    const [apiKey, setApiKey] = useApiKey()
    const inputValue = useRef<string>(apiKey ?? '')


    const checkValidity = useCallback(() => {
        const keyTrimmed = inputValue.current.trim()
        switch (keyTrimmed) {
            case '':
                setWanikaniStatus('no_key')
                return
            default:
                setWanikaniStatus('loading')
                break
        }
        getWanikaniStatus().then(status => setWanikaniStatus(status))
    }, [setWanikaniStatus])

    useEffect(() => { checkValidity() }, [checkValidity])

    return <div className='flex flex-col gap-4 items-stretch justify-center'>
        <Input variant='bordered' type='password' label='API Key' placeholder='Enter your WaniKani API Key'
            defaultValue={inputValue.current}
            color={wanikaniStatus === '3lvl' || wanikaniStatus == '60lvl' ? 'success' : wanikaniStatus === 'invalid_key' ? 'danger' : 'default'}
            endContent={wanikaniStatus === 'loading' ? <CircularProgress size='sm' color='default' aria-label='Loading...' /> : <></>}
            isInvalid={wanikaniStatus === 'invalid_key'}
            errorMessage='Invalid API Key'
            description={<span>
                You can get your API key from your <a className='underline' href='https://www.wanikani.com/settings/personal_access_tokens' target='_blank'>WaniKani account settings</a>
            </span>}
            onValueChange={(v) => inputValue.current = v} />
        <Button onPress={() => {
            const keyTrimmed = inputValue.current.trim()
            setApiKey(keyTrimmed)
            checkValidity()
        }} color='secondary'>Update API Key</Button>
    </div>
}

type KanjiFilter = 'all' | 'started'

function KanjiFilterButtons(
    { filter, setFilter, classNames }
        : { filter: KanjiFilter, setFilter: (filter: KanjiFilter) => void, classNames?: string }
) {
    return (
        <div className={cn('flex justify-center mt-4', classNames)}>
            <ButtonGroup>
                <Button
                    color={filter === 'all' ? 'secondary' : 'default'}
                    onPress={() => setFilter('all')} >
                    All Kanji
                </Button>
                <Button
                    color={filter === 'started' ? 'secondary' : 'default'}
                    onPress={() => setFilter('started')}>
                    Started Kanji
                </Button>
            </ButtonGroup>
        </div>
    )
}
