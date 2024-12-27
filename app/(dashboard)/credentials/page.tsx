import { GetCredentialsForUser } from '@/actions/credentials/getCredentialsForUser'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ShieldIcon, ShieldOffIcon } from 'lucide-react'
import React, { Suspense } from 'react'
import CreateCredentialDialog from './_components/CreateCredentialDialog'
import CredentialCard from './_components/CredentialCard'

const CredentialPage
    = () => {
        return (
            <div className='flex flex-1 flex-col h-full'>
                <div className='flex justify-between'>
                    <div className='flex flex-col'>
                        <h1 className='text-3xl font-bold'>Credentials</h1>
                        <p className='text-muted-foreground'>Manage your credentials</p>
                    </div>
                    <CreateCredentialDialog />
                </div>

                <div className='h-full py-6 space-y-8'>
                    <Alert>
                        <ShieldIcon className='h-4 w-4 stroke-primary' />
                        <AlertTitle className="text-primary">Encryption</AlertTitle>
                        <AlertDescription>All Information is securely encrypted. Your data remains safe.</AlertDescription>
                    </Alert>
                </div>


                <Suspense fallback={<Skeleton className='h-[300px] w-full' />}>
                    <UserCredentials />
                </Suspense>
            </div>
        )
    }

export default CredentialPage


const UserCredentials = async () => {
    const credentials = await GetCredentialsForUser();

    if (!credentials) {
        return <div className="">Something went wrong</div>
    }

    if (!credentials.length) {
        return (
            <Card className='w-full p-4'>
                <div className='flex flex-col gap-4 items-center justify-center'>
                    <div className='rounded-full bg-accent w-20 h-20 flex items-center justify-center'><ShieldOffIcon size={40} className='stroke-primary' /></div>
                    <div className='flex flex-col gap-1 text-center'>
                        <p className="text-bold">No credentials created yet</p>
                        <p className='text-sm text-muted-foreground'>Click the button below to create your first credential</p>
                    </div>
                    <CreateCredentialDialog triggerText='Create your first credential' />
                </div>
            </Card>)
    }
    return (
        <>
            <div className="flex gap-2 flex-wrap">
                {credentials.map((credential) => {
                    return <CredentialCard key={credential.id} credential={credential} />
                })}
            </div>
        </>
    )
}